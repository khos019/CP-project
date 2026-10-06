/* Builds a duel history for the seeded accounts: bot against bot only.
 *
 *   node tools/contests/duels.mjs          → tools/contests/out/duels.json
 *
 * Run after build.mjs (it reads out/seed.json). Nothing here touches the
 * network; seed.mjs --apply-duels writes the result.
 *
 * Each duel is stored the way duel_record_submission() and duel_finish()
 * would have stored it:
 *   - three rounds worth 100 / 200 / 300, picked by duel_pick_problems()'s
 *     rule: the pair's mean rating -150 / +0 / +200, nearest first, skipping
 *     problems either player has already solved;
 *   - every attempt is a duel_submissions row and a bank_submissions row;
 *   - a round goes to the first ACCEPTED, the duel ends when all three are
 *     taken or after 30 minutes, and Elo moves with K = 32.
 * Every source is compiled and judged locally, exactly as in build.mjs.
 *
 * Ratings are held between 950 and 1340, below the strongest real learner,
 * so that no seeded account outranks one at the top of the leaderboard.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { bankProblems } from "../../app/ui/problem-bank.ts";
import { solutions } from "../../app/api/_lib/solutions.ts";
import { tests, problemCpuSeconds } from "../../app/api/judge/tests.ts";
import { formatCpp } from "./format.mjs";
import { makeJudge, pool } from "./judge-local.mjs";

const HERE = new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const OUT = join(HERE, "out");
const SEED = Number(process.env.SEED || 20250915);
const WIDTH = Number(process.env.JOBS || 12);

const FLOOR = 950, CEILING = 1340, K = 32, LENGTH_MIN = 30, POINTS = [100, 200, 300], OFFSETS = [-150, 0, 200];
const FROM = Date.UTC(2025, 8, 15), UNTIL = Date.UTC(2026, 9, 5, 18);
// How far above a player's level a duel problem is still usually solved, and
// how many rating points cost a minute. Tuned so that, as in the real duels on
// the site, most rounds are taken and a full 600 is common.
const SOLVE_EDGE = Number(process.env.SOLVE_EDGE ?? 120), PACE = Number(process.env.PACE ?? 70);

/* ---------------------------------------------------------------- random */
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(SEED);
const uni = (a, b) => a + (b - a) * rnd();
const int = (a, b) => Math.floor(uni(a, b + 1));
const pick = (xs) => xs[Math.floor(rnd() * xs.length)];
const gauss = () => { let u = 0; while (!u) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd()); };
const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const uuidFrom = (s) => {
  const h = createHash("sha256").update("duel:" + SEED + ":" + s).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-${"89ab"[parseInt(h[16], 16) & 3]}${h.slice(17, 20)}-${h.slice(20, 32)}`;
};
const log = (...a) => console.log(...a);

/* ---------------------------------------------------------------- inputs */
const seed = JSON.parse(readFileSync(join(OUT, "seed.json"), "utf8"));
const bots = seed.bots.map((b) => ({
  ...b,
  joined: Date.parse(b.created_at),
  // Duel level: the contest skill pressed into the band the ratings may use.
  level: Math.round(Math.min(CEILING - 10, Math.max(FLOOR + 30, 1180 + (b.skill - 1320) * 0.45))),
  rating: 1200,
  busy: [],          // [from, to] in ms
  solvedAt: new Map(), // problem_key -> first AC time
}));
const byKey = Object.fromEntries(bots.map((b) => [b.key, b]));

// What each account had solved, and when, from the contests already applied.
for (const r of seed.submissions) {
  if (r.verdict !== "ACCEPTED") continue;
  const b = byKey[r.bot]; const t = Date.parse(r.created_at);
  if (!b.solvedAt.has(r.problem_key) || b.solvedAt.get(r.problem_key) > t) b.solvedAt.set(r.problem_key, t);
}
// Contest windows each account sat in: no duel during a round.
for (const c of seed.contests) {
  const s = Date.parse(c.starts_at), e = s + c.duration_minutes * 60e3;
  const who = new Set(seed.submissions.filter((r) => r.contest === c.slug).map((r) => r.bot));
  for (const k of who) byKey[k].busy.push([s - 15 * 60e3, e + 15 * 60e3]);
}
const freeAt = (b, s, e) => b.busy.every(([x, y]) => e <= x || s >= y);

const poolProblems = bankProblems.filter((p) => p.judge && solutions[p.judge] && tests[p.judge]);
const cpu = (key) => problemCpuSeconds[key] ?? 1;

/* ---------------------------------------------------------------- schedule */
// A plausible moment to play: Tashkent afternoon and evening, most days.
function someTime(after) {
  for (let i = 0; i < 50; i++) {
    const day = after + rnd() * (UNTIL - after);
    const d = new Date(day);
    const localHour = pick([11, 13, 15, 16, 17, 18, 19, 19, 20, 20, 21, 21, 22, 23]);
    const t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), localHour - 5, int(0, 59), int(0, 59));
    if (t > after && t < UNTIL) return t;
  }
  return null;
}

const quota = new Map(bots.map((b) => [b.key, Math.max(5, Math.min(40, Math.round(5 + 35 * Math.pow(b.keen, 1.6) * uni(0.55, 1.15))))]));
const played = new Map(bots.map((b) => [b.key, 0]));
const pairs = [];
let guard = 0;
const want = () => bots.filter((b) => played.get(b.key) < quota.get(b.key));
while (want().length >= 2 && guard++ < 20000) {
  const open = want();
  // The one with the most left to play looks for a game.
  const total = open.reduce((s, b) => s + (quota.get(b.key) - played.get(b.key)), 0);
  let x = rnd() * total, a = open[0];
  for (const b of open) { x -= quota.get(b.key) - played.get(b.key); if (x <= 0) { a = b; break; } }
  const t = someTime(Math.max(FROM, a.joined + 864e5));
  if (t === null) continue;
  const end = t + (LENGTH_MIN + 2) * 60e3;
  if (!freeAt(a, t - 10 * 60e3, end + 10 * 60e3)) continue;
  // Matchmaking pairs by level: the nearest available, with some luck.
  const cands = open.filter((b) => b !== a && b.joined + 864e5 < t && freeAt(b, t - 10 * 60e3, end + 10 * 60e3));
  if (!cands.length) continue;
  cands.sort((p, q) => Math.abs(p.level - a.level) + 60 * Math.abs(gauss()) - (Math.abs(q.level - a.level) + 60 * Math.abs(gauss())));
  const b = cands[0];
  a.busy.push([t, end]); b.busy.push([t, end]);
  played.set(a.key, played.get(a.key) + 1); played.set(b.key, played.get(b.key) + 1);
  pairs.push({ t, a, b });
}
// Anyone short of five plays the nearest-level account that is free.
for (const a of bots) {
  let tries = 0;
  while (played.get(a.key) < 5 && tries++ < 500) {
    const t = someTime(Math.max(FROM, a.joined + 864e5));
    if (t === null) break;
    const end = t + (LENGTH_MIN + 2) * 60e3;
    if (!freeAt(a, t - 10 * 60e3, end + 10 * 60e3)) continue;
    const b = bots.filter((x) => x !== a && x.joined + 864e5 < t && played.get(x.key) < 40 && freeAt(x, t - 10 * 60e3, end + 10 * 60e3))
      .sort((p, q) => Math.abs(p.level - a.level) - Math.abs(q.level - a.level))[0];
    if (!b) continue;
    a.busy.push([t, end]); b.busy.push([t, end]);
    played.set(a.key, played.get(a.key) + 1); played.set(b.key, played.get(b.key) + 1);
    pairs.push({ t, a, b });
  }
}
pairs.sort((x, y) => x.t - y.t);
log(`scheduled ${pairs.length} duels for ${bots.length} accounts`);

/* ---------------------------------------------------------------- judging */
const J = await makeJudge(join(OUT, "work"));
const usable = new Map();
async function prepare(p) {
  if (usable.has(p.judge)) return usable.get(p.judge);
  const ok = await J.judge(p.judge, solutions[p.judge].solution, tests[p.judge], cpu(p.judge));
  const wrong = [];
  for (const src of solutions[p.judge].wrong) {
    const r = await J.judge(p.judge, src, tests[p.judge], cpu(p.judge));
    if (r.verdict !== "ACCEPTED" && r.verdict !== "COMPILATION_ERROR" && !r.unsure) wrong.push({ src, result: r });
  }
  const u = { ok: ok.verdict === "ACCEPTED" && !ok.unsure, wrong };
  usable.set(p.judge, u);
  return u;
}

/* ---------------------------------------------------------------- play */
function playerTimeline(level, problems) {
  // Each player works through the rounds in order, sometimes skipping ahead.
  const eff = level + 90 * gauss();
  const order = rnd() < 0.2 ? [0, 2, 1] : [0, 1, 2];
  let t = uni(0.4, 2.5);
  const events = [];
  for (const i of order) {
    const p = problems[i];
    const gap = p.rating - eff;
    const pSolve = sigmoid(-(gap - SOLVE_EDGE) / 110);
    const need = Math.max(1.2, (2 + (p.rating - 700) / PACE) * Math.exp(gap / 450) * Math.exp(0.45 * gauss()));
    if (rnd() < pSolve) {
      const ac = t + need;
      let k = 0;
      if (rnd() < Math.min(0.55, Math.max(0.08, 0.16 + gap / 900))) { k = 1; while (k < 3 && rnd() < 0.3) k++; }
      let back = ac;
      const wrongs = [];
      for (let j = 0; j < k; j++) { back -= uni(1, 4); if (back > t + 0.3) wrongs.unshift(back); }
      for (const w of wrongs) events.push({ round: i, ok: false, at: w });
      events.push({ round: i, ok: true, at: ac });
      t = ac + uni(0.2, 1);
    } else {
      const spend = need * uni(0.6, 1.2);
      if (rnd() < sigmoid(-(gap - 220) / 130)) {
        let at = t + spend * uni(0.5, 1);
        for (let j = 0, n = int(1, 2); j < n; j++) { events.push({ round: i, ok: false, at }); at += uni(1.5, 5); }
      }
      t += spend;
    }
  }
  return events;
}

const matches = [];
let capped = 0;
for (const [n, { t, a, b }] of pairs.entries()) {
  // Problems: duel_pick_problems() against the ratings as they stand now.
  const target = Math.round((a.rating + b.rating) / 2);
  const chosen = [];
  for (let i = 0; i < 3; i++) {
    const want = target + OFFSETS[i];
    const fresh = poolProblems.filter((p) => !chosen.includes(p)
      && !(a.solvedAt.has(p.judge) && a.solvedAt.get(p.judge) < t)
      && !(b.solvedAt.has(p.judge) && b.solvedAt.get(p.judge) < t));
    const best = Math.min(...fresh.map((p) => Math.abs(p.rating - want)));
    let p = null;
    for (const c of fresh.filter((p) => Math.abs(p.rating - want) === best).sort(() => rnd() - 0.5)) {
      const u = await prepare(c);
      if (u.ok && u.wrong.length) { p = c; break; }
    }
    if (!p) p = fresh.sort((x, y) => Math.abs(x.rating - want) - Math.abs(y.rating - want))[0];
    chosen.push(p);
  }

  // Play it out, and replay a different afternoon if the result would carry
  // either account outside the band.
  let result = null;
  for (let attempt = 0; attempt < 8 && !result; attempt++) {
    const evA = playerTimeline(a.level, chosen).map((e) => ({ ...e, seat: 1 }));
    const evB = playerTimeline(b.level, chosen).map((e) => ({ ...e, seat: 2 }));
    const all = [...evA, ...evB].filter((e) => e.at < LENGTH_MIN).sort((x, y) => x.at - y.at);
    const claimed = [null, null, null], claimedAt = [null, null, null];
    const kept = [];
    let endAt = LENGTH_MIN;
    for (const e of all) {
      if (e.at >= endAt) break;
      // Once a round is taken, the other player moves on.
      if (claimed[e.round] !== null && claimed[e.round] !== e.seat) continue;
      if (claimed[e.round] === e.seat) continue;
      kept.push(e);
      if (e.ok) {
        claimed[e.round] = e.seat; claimedAt[e.round] = e.at;
        if (claimed.every((c) => c !== null)) endAt = e.at;
      }
    }
    const score = [0, 0];
    claimed.forEach((s, i) => { if (s) score[s - 1] += POINTS[i]; });
    const actualA = score[0] > score[1] ? 1 : score[0] < score[1] ? 0 : 0.5;
    const expA = 1 / (1 + Math.pow(10, (b.rating - a.rating) / 400));
    const dA = Math.round(K * (actualA - expA));
    const dB = Math.round(K * ((1 - actualA) - (1 - expA)));
    const na = a.rating + dA, nb = b.rating + dB;
    if ((na > CEILING || nb > CEILING || na < FLOOR || nb < FLOOR) && attempt < 7) { capped++; continue; }
    result = { kept, claimed, claimedAt, score, endAt, dA, dB, swept: claimed.every((c) => c !== null) };
  }

  const id = uuidFrom(`${n}:${a.key}:${b.key}:${t}`);
  // One clock for the duel: the AC, the round it claims and, on a sweep, the
  // finish are the same instant, as they are when the server records them.
  const at = (min) => new Date(t + Math.round(min * 60e3)).toISOString();
  const finishedAt = result.swept ? at(result.endAt) : new Date(t + LENGTH_MIN * 60e3 + int(1, 20) * 1000).toISOString();
  const seats = [a, b];
  const subs = result.kept.map((e, j) => {
    const who = seats[e.seat - 1];
    const p = chosen[e.round];
    if (e.ok) {
      if (!who.solvedAt.has(p.judge) || who.solvedAt.get(p.judge) > t) who.solvedAt.set(p.judge, t + e.at * 60e3);
    }
    return {
      id: uuidFrom(`${id}:s:${j}`), bankId: uuidFrom(`${id}:b:${j}`),
      seat: e.seat, bot: who.key, round: e.round, ok: e.ok,
      wrong: e.ok ? null : pick(usable.get(p.judge).wrong),
      problem: p, created_at: at(e.at),
    };
  });
  matches.push({
    id, started_at: new Date(t).toISOString(), ends_at: new Date(t + LENGTH_MIN * 60e3).toISOString(),
    finished_at: finishedAt,
    winner_seat: result.score[0] > result.score[1] ? 1 : result.score[1] > result.score[0] ? 2 : null,
    players: [
      { seat: 1, bot: a.key, display_name: a.display_name || a.username, score: result.score[0], rating_before: a.rating, rating_after: a.rating + result.dA },
      { seat: 2, bot: b.key, display_name: b.display_name || b.username, score: result.score[1], rating_before: b.rating, rating_after: b.rating + result.dB },
    ],
    rounds: chosen.map((p, i) => ({
      round: i, problem_key: p.judge, problem_rating: p.rating, points: POINTS[i],
      claimed_by_seat: result.claimed[i], claimed_at: result.claimed[i] ? at(result.claimedAt[i]) : null,
    })),
    subs,
  });
  a.rating += result.dA; b.rating += result.dB;
}
log(`played ${matches.length} duels (${capped} replays to stay inside ${FLOOR}-${CEILING})`);
if (process.env.SIM_ONLY) {
  const sc = matches.reduce((o, m) => { const k = m.players.map((p) => p.score).sort((x, y) => y - x).join(":"); o[k] = (o[k] || 0) + 1; return o; }, {});
  const rr = bots.map((b) => b.rating).sort((x, y) => x - y);
  log(`ratings ${rr[0]}..${rr.at(-1)} · scores ${JSON.stringify(Object.entries(sc).sort((a, b) => b[1] - a[1]).slice(0, 10))}`);
  process.exit(0);
}

/* ---------------------------------------------------------------- judge every row */
const flat = matches.flatMap((m) => m.subs.map((s) => ({ m, s })));
log(`judging ${flat.length} duel submissions in their authors' styles...`);
const results = await pool(flat, WIDTH, async ({ s }) => {
  const key = s.problem.judge, bot = byKey[s.bot];
  const raw = s.ok ? solutions[key].solution : s.wrong.src;
  const expect = (r) => (s.ok ? r.verdict === "ACCEPTED" && !r.unsure
    : r.verdict === s.wrong.result.verdict && r.passed === s.wrong.result.passed && !r.unsure);
  let src = formatCpp(raw, bot.style);
  let r = await J.judge(key, src, tests[key], cpu(key));
  if (!expect(r)) {
    src = (bot.style.header ? bot.style.header + "\n" : "") + raw;
    r = await J.judge(key, src, tests[key], cpu(key));
    if (!expect(r)) return null;
  }
  return { src, r };
}, (d, n) => { if (d % 200 === 0 || d === n) process.stdout.write(`  ${d}/${n}\r`); });
J.save();
log("");
const badAc = flat.filter((x, i) => !results[i] && x.s.ok).length;
if (badAc) throw new Error(`${badAc} accepted duel submissions did not pass locally`);

log("timing reference solutions one at a time...");
const refMs = {};
for (const key of new Set(flat.map((x) => x.s.problem.judge))) refMs[key] = await J.time(key, solutions[key].solution, tests[key]);

const maxInput = (key) => Math.max(...tests[key].map((t) => t.stdin.length));
let dropped = 0;
flat.forEach(({ s }, i) => {
  if (!results[i]) { s.drop = true; dropped++; return; }
  const { src, r } = results[i];
  const key = s.problem.judge;
  s.row = {
    language: "cpp20", source_code: src, verdict: r.verdict, passed: r.passed, total: r.total,
    runtime_ms: r.verdict === "TIME_LIMIT_EXCEEDED" ? cpu(key) * 1000 + int(1, 40)
      : Math.max(0, Math.round(refMs[key] * uni(s.ok ? 0.85 : 0.6, s.ok ? 1.3 : 1.15)) + int(0, 3)),
    memory_kb: 3300 + int(0, 700) + Math.min(60000, Math.round((maxInput(key) * 3) / 1024)),
    problem_title: byKey[s.bot].lang === "uz" ? s.problem.uz : s.problem.en,
  };
});
if (dropped) log(`dropped ${dropped} rejected attempts whose verdict could not be reproduced`);

/* ---------------------------------------------------------------- report */
const finals = bots.map((b) => ({ key: b.key, username: b.username, rating: b.rating, duels: played.get(b.key) }));
const rs = finals.map((f) => f.rating).sort((x, y) => x - y);
const ds = finals.map((f) => f.duels).sort((x, y) => x - y);
const outcomes = matches.reduce((o, m) => ((o[m.winner_seat ? "decided" : "draw"]++), o), { decided: 0, draw: 0 });
const scores = matches.reduce((o, m) => { const k = m.players.map((p) => p.score).sort((x, y) => y - x).join(":"); o[k] = (o[k] || 0) + 1; return o; }, {});
log(`ratings: min ${rs[0]} · median ${rs[rs.length >> 1]} · max ${rs.at(-1)}`);
log(`duels per account: min ${ds[0]} · median ${ds[ds.length >> 1]} · max ${ds.at(-1)}`);
log(`results: ${JSON.stringify(outcomes)} · scores ${JSON.stringify(Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 8))}`);
const v = flat.filter((x) => !x.s.drop).reduce((o, x) => ((o[x.s.row.verdict] = (o[x.s.row.verdict] || 0) + 1), o), {});
log(`submissions: ${flat.length - dropped} ${JSON.stringify(v)}`);

writeFileSync(join(OUT, "duels.json"), JSON.stringify({
  seed: SEED,
  generated_at: new Date().toISOString(),
  finals,
  matches: matches.map((m) => ({
    id: m.id, started_at: m.started_at, ends_at: m.ends_at, finished_at: m.finished_at, winner_seat: m.winner_seat,
    players: m.players, rounds: m.rounds,
    submissions: m.subs.filter((s) => !s.drop).map((s) => ({
      id: s.id, bank_id: s.bankId, seat: s.seat, bot: s.bot, round: s.round,
      problem_key: s.problem.judge, created_at: s.created_at, ...s.row,
    })),
  })),
}, null, 1));
log(`wrote ${join(OUT, "duels.json")}`);
