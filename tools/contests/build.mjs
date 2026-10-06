/* Builds the contest archive: participants, rounds, and every submission in
 * them — each one compiled and judged locally on the real hidden tests.
 *
 *   node tools/contests/build.mjs            → tools/contests/out/seed.json
 *
 * Deterministic: the same SEED gives the same people, rounds and results, so
 * a rebuild after a fix changes only what the fix touched. Nothing here talks
 * to the network; seed.mjs is the only step that writes anywhere.
 *
 * What "real" means here, concretely:
 *   - an ACCEPTED row's source is a correct solution and passes every hidden
 *     test locally;
 *   - a rejected row's source is one of the library's realistic near misses
 *     (app/api/_lib/solutions.ts `wrong`), and its verdict, `passed` and
 *     `total` are what judging it produced — not what we wanted it to be;
 *   - anything the local timing cannot call with confidence is left out.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { bankProblems } from "../../app/ui/problem-bank.ts";
import { solutions } from "../../app/api/_lib/solutions.ts";
import { tests, problemCpuSeconds } from "../../app/api/judge/tests.ts";
import { formatCpp } from "./format.mjs";
import { makeJudge, pool } from "./judge-local.mjs";

const HERE = new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const OUT = join(HERE, "out");
const WORK = join(OUT, "work");
const SEED = Number(process.env.SEED || 20251109);
const WIDTH = Number(process.env.JOBS || 12);

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
const shuffle = (xs) => { const a = [...xs]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const uuidFrom = (s) => {
  const h = createHash("sha256").update(String(SEED) + ":" + s).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-${"89ab"[parseInt(h[16], 16) & 3]}${h.slice(17, 20)}-${h.slice(20, 32)}`;
};

/* ---------------------------------------------------------------- rounds */
// Tashkent is UTC+5 all year. Times are local; stored as UTC.
const tz = (s) => new Date(s + ":00+05:00").toISOString();
const ROUNDS = [
  { at: "2025-11-09T15:00", len: 120 },
  { at: "2025-11-29T19:00", len: 120 },
  { at: "2025-12-17T20:35", len: 120 },
  { at: "2026-01-04T14:00", len: 150, uz: "AlgoYo‘l Yangi yil raundi", en: "AlgoYo‘l New Year Round" },
  { at: "2026-01-24T18:30", len: 120 },
  { at: "2026-02-15T16:00", len: 120 },
  { at: "2026-03-07T20:00", len: 120 },
  { at: "2026-03-22T15:00", len: 135, uz: "AlgoYo‘l Navro‘z raundi", en: "AlgoYo‘l Navruz Round" },
  { at: "2026-04-15T19:35", len: 120 },
  { at: "2026-05-09T17:00", len: 120 },
  { at: "2026-05-31T15:00", len: 120 },
  { at: "2026-06-27T19:05", len: 150 },
  { at: "2026-07-26T16:30", len: 120 },
  { at: "2026-08-29T18:00", len: 120 },
  { at: "2026-09-20T15:00", len: 120 },
];
const SLOTS = [
  { idx: "A", lo: 800, hi: 1000 },
  { idx: "B", lo: 1100, hi: 1300 },
  { idx: "C", lo: 1300, hi: 1500 },
  { idx: "D", lo: 1400, hi: 1600 },
  { idx: "E", lo: 1700, hi: 1900 },
];

/* ---------------------------------------------------------------- people */
const MALE = ["Jasur", "Aziz", "Sardor", "Otabek", "Bekzod", "Javohir", "Shohruh", "Diyor", "Abdulloh", "Muhammadali",
  "Islom", "Behruz", "Sherzod", "Ulug‘bek", "Jahongir", "Doniyor", "Akmal", "Asadbek", "Ibrohim", "Firdavs", "Temur",
  "Kamron", "Mirjalol", "Nodirbek", "Sanjar", "Xurshid", "Eldor", "Alisher", "Bobur", "Farrux", "Jamshid", "Rustam",
  "Abbos", "Azamat", "Ravshan", "Humoyun", "Shahzod", "Samandar", "Ozodbek", "Lazizbek", "Hasan", "Husan", "Mansur"];
const FEMALE = ["Nodira", "Madina", "Dilnoza", "Malika", "Sevara", "Mohinur", "Shahzoda", "Zarina", "Kamola", "Gulnoza",
  "Laylo", "Mubina", "Sabina", "Robiya", "Feruza", "Munisa", "Durdona", "Nilufar", "Ozoda", "Charos"];
const SURNAMES = ["Karimov", "Rahimov", "Toshmatov", "Yusupov", "Abdullayev", "Ismoilov", "Qodirov", "Ergashev", "Nazarov",
  "Saidov", "Xolmatov", "Mirzayev", "Aliyev", "Hasanov", "Usmonov", "Sobirov", "Tursunov", "Norboyev", "Jo‘rayev",
  "Sultonov", "Umarov", "Olimov", "Botirov", "Haydarov", "Fayzullayev", "Qosimov", "Murodov", "Valiyev", "Shukurov", "Zokirov"];
const CITIES = ["Toshkent", "Samarqand", "Namangan", "Andijon", "Farg‘ona", "Buxoro", "Qarshi", "Nukus", "Urganch", "Jizzax", "Termiz"];
const BIOS = ["C++", "CP", "Olimpiadaga tayyorlanyapman", "ICPC 2026", "Dasturchi bo‘lmoqchiman", "Algoritmlar", "IT maktab",
  "Matematika va dasturlash", "student", "Codeforces: pupil"];

const ascii = (s) => s.replace(/[‘’ʻʼ']/g, "").toLowerCase();
const femaleOf = (s) => s.replace(/ov$/, "ova").replace(/ev$/, "eva");

function makeBots(count) {
  const taken = new Set(), names = new Set();
  const bots = [];
  while (bots.length < count) {
    const female = rnd() < 0.24;
    const first = pick(female ? FEMALE : MALE);
    const sur = female ? femaleOf(pick(SURNAMES)) : pick(SURNAMES);
    const f = ascii(first), s = ascii(sur);
    const year = int(2004, 2011);
    const handle = pick([
      () => `${f}_${s.slice(0, int(1, 3))}`,
      () => `${f}${year}`,
      () => `${f}${String(year).slice(2)}`,
      () => `${f}_${s}`,
      () => `${s}_${f[0]}`,
      () => `cp_${f}`,
      () => `${f}_${pick(["dev", "cpp", "algo", "x", "uz", "07", "99", "pro"])}`,
      () => `${first[0].toUpperCase()}${f.slice(1)}_${s[0].toUpperCase()}`,
      () => `${f}${s.slice(0, 3)}`,
      () => `${f}${int(1, 99)}`,
    ])().replace(/[^A-Za-z0-9_]/g, "").slice(0, 24);
    // Two people may share a first name, not a first name and a surname.
    if (handle.length < 3 || taken.has(handle.toLowerCase()) || names.has(first + " " + sur)) continue;
    taken.add(handle.toLowerCase());
    names.add(first + " " + sur);

    const roll = rnd();
    const display = roll < 0.78 ? `${first} ${sur}` : roll < 0.9 ? first : "";
    const croll = rnd();
    const country = croll < 0.5 ? "O‘zbekiston" : croll < 0.68 ? pick(CITIES) : "";
    const bio = rnd() < 0.2 ? pick(BIOS) : "";
    const early = rnd() < 0.72;
    const joined = early
      ? new Date(Date.UTC(2025, 8, 10) + rnd() * 56 * 864e5)       // 10 Sep – 5 Nov 2025
      : new Date(Date.UTC(2025, 10, 10) + rnd() * 248 * 864e5);    // 10 Nov 2025 – mid Jul 2026
    const sigs = ["// @" + handle, "// author: " + handle, "// " + (display || handle), "/* " + handle + " */"];
    bots.push({
      key: "b" + bots.length,
      username: handle,
      display_name: display,
      country, bio,
      lang: rnd() < 0.85 ? "uz" : "en",
      created_at: joined.toISOString(),
      skill: Math.round(Math.min(2050, Math.max(860, 1320 + 240 * gauss()))),
      keen: uni(0.4, 0.97),                   // how often they show up
      style: {
        indent: pick(["    ", "    ", "  ", "\t", "  ", "    "]),
        allman: rnd() < 0.2,
        ops: rnd() < 0.65,
        comma: rnd() < 0.55,
        kw: rnd() < 0.6,
        header: rnd() < 0.18 ? pick(sigs) : "",
      },
    });
  }
  return bots;
}

/* ---------------------------------------------------------------- main */
const log = (...a) => console.log(...a);
mkdirSync(WORK, { recursive: true });
const J = await makeJudge(WORK);
log(`local judge ready (process start-up ${J.baseMs.toFixed(1)} ms is subtracted)`);

const cpu = (key) => problemCpuSeconds[key] ?? 1;
const candidates = bankProblems.filter((p) => p.judge && solutions[p.judge] && tests[p.judge] && p.rating >= 800 && p.rating <= 1900);

// 1. Judge every candidate's reference solution and near misses as written.
log(`judging ${candidates.length} candidate problems (solution + near misses)...`);
const jobs = [];
for (const p of candidates) {
  jobs.push({ p, kind: "ok", i: 0, src: solutions[p.judge].solution });
  solutions[p.judge].wrong.forEach((src, i) => jobs.push({ p, kind: "wrong", i, src }));
}
const base = await pool(jobs, WIDTH, (j) => J.judge(j.p.judge, j.src, tests[j.p.judge], cpu(j.p.judge)),
  (d, n) => { if (d % 100 === 0 || d === n) process.stdout.write(`  ${d}/${n}\r`); });
J.save();
log("");
const usable = new Map(); // judge key → { ok: result, wrong: [{ i, src, result }] }
for (let k = 0; k < jobs.length; k++) {
  const j = jobs[k], r = base[k];
  if (!usable.has(j.p.judge)) usable.set(j.p.judge, { ok: null, wrong: [] });
  const u = usable.get(j.p.judge);
  if (j.kind === "ok") u.ok = r;
  else if (r.verdict !== "ACCEPTED" && r.verdict !== "COMPILATION_ERROR" && !r.unsure) u.wrong.push({ i: j.i, src: j.src, result: r });
}
const eligible = candidates.filter((p) => {
  const u = usable.get(p.judge);
  return u.ok && u.ok.verdict === "ACCEPTED" && !u.ok.unsure && u.wrong.length > 0;
});
const rejected = candidates.filter((p) => !eligible.includes(p));
log(`eligible problems: ${eligible.length} (left out ${rejected.length}: ` +
  rejected.slice(0, 8).map((p) => `${p.id}=${usable.get(p.judge).ok?.verdict}${usable.get(p.judge).ok?.unsure ? "?" : ""}/${usable.get(p.judge).wrong.length}w`).join(", ") + (rejected.length > 8 ? ", …" : "") + ")");

// 2. Problems for each round: one per slot, never reused, topics spread out.
const used = new Set();
const rounds = ROUNDS.map((R, n) => {
  const chosen = [];
  for (const slot of SLOTS) {
    let lo = slot.lo, hi = slot.hi;
    // C must not be harder than D.
    if (slot.idx === "D") lo = Math.max(lo, chosen[2].rating);
    const tags = new Set(chosen.map((p) => p.tag));
    let pool = eligible.filter((p) => !used.has(p.id) && p.rating >= lo && p.rating <= hi);
    const fresh = pool.filter((p) => !tags.has(p.tag));
    if (fresh.length) pool = fresh;
    if (!pool.length) throw new Error(`round ${n + 1}: nothing left for slot ${slot.idx}`);
    const p = pick(pool);
    used.add(p.id);
    chosen.push(p);
  }
  return {
    number: n + 1,
    slug: `round-${n + 1}`,
    title_uz: R.uz ? `${R.uz} (Raund #${n + 1})` : `AlgoYo‘l Raund #${n + 1}`,
    title_en: R.en ? `${R.en} (Round #${n + 1})` : `AlgoYo‘l Round #${n + 1}`,
    starts_at: tz(R.at),
    duration_minutes: R.len,
    problems: chosen.map((p, i) => ({
      idx: SLOTS[i].idx, problem_key: p.judge, bank_id: p.id, title_uz: p.uz, title_en: p.en, rating: p.rating,
    })),
  };
});

// 3. People.
const bots = makeBots(96);

// 4. Who came to each round, and what they did.
const sizes = shuffle(Array.from({ length: 21 }, (_, i) => 50 + i)).slice(0, ROUNDS.length);
const subs = [];
for (const [n, round] of rounds.entries()) {
  const start = Date.parse(round.starts_at);
  const present = bots.filter((b) => Date.parse(b.created_at) < start - 864e5);
  // Weighted draw without replacement: keener people come more often.
  const order = present.map((b) => ({ b, k: Math.pow(rnd(), 1 / b.keen) })).sort((x, y) => y.k - x.k).map((x) => x.b);
  const crowd = order.slice(0, Math.min(sizes[n], order.length));
  if (crowd.length < 50) throw new Error(`round ${n + 1}: only ${crowd.length} eligible participants`);
  const hardness = 70 * gauss();

  for (const b of crowd) {
    const eff = b.skill + 110 * gauss() - hardness;
    let t = uni(1.5, 7);                                 // reading the statements
    const order = [0, 1, 2, 3, 4];
    if (rnd() < 0.25) [order[2], order[3]] = [order[3], order[2]];
    if (eff > 1600 && rnd() < 0.15) [order[3], order[4]] = [order[4], order[3]];
    const mine = [];
    let gaveUp = false;
    for (const pi of order) {
      if (gaveUp) break;
      const p = round.problems[pi];
      const gap = p.rating - eff;
      const pSolve = sigmoid(-(gap + 40) / 115);
      const need = Math.max(2, (5 + (p.rating - 700) / 25) * Math.exp(gap / 450) * Math.exp(0.45 * gauss()));
      const wrongs = usable.get(p.problem_key).wrong;
      if (rnd() < pSolve) {
        t += need;
        if (t > round.duration_minutes - 0.5) { t -= need; gaveUp = true; continue; }
        let k = 0;
        const pWrong = Math.min(0.6, Math.max(0.08, 0.18 + gap / 900));
        if (rnd() < pWrong) { k = 1; while (k < 4 && rnd() < 0.35) k++; }
        const times = [];
        let back = t;
        for (let j = 0; j < k; j++) { back -= uni(1.5, 6); times.unshift(back); }
        const floor = mine.length ? mine.at(-1).minute + 0.3 : 1;
        for (const [j, at] of times.entries()) {
          if (at <= floor + j * 0.3) continue;              // not enough room: they got it first time
          mine.push({ p, ok: false, minute: at, wrong: pick(wrongs) });
        }
        mine.push({ p, ok: true, minute: t });
      } else {
        // Did they try it at all?
        const pTry = sigmoid(-(gap - 260) / 140);
        const spend = need * uni(0.5, 1.1);
        if (rnd() < pTry && t + spend < round.duration_minutes - 0.5) {
          const k = int(1, 3);
          let at = t + spend * uni(0.5, 1);
          for (let j = 0; j < k && at < round.duration_minutes - 0.2; j++) {
            mine.push({ p, ok: false, minute: at, wrong: pick(wrongs) });
            at += uni(2, 9);
          }
          t += spend;
        }
        if (rnd() < 0.45) gaveUp = true;
      }
    }
    if (!mine.length) {
      // Everybody on the board sent something.
      const p = round.problems[rnd() < 0.7 ? 0 : 1];
      mine.push({ p, ok: false, minute: uni(8, round.duration_minutes - 5), wrong: pick(usable.get(p.problem_key).wrong) });
    }
    mine.sort((x, y) => x.minute - y.minute);
    for (const m of mine) {
      const at = new Date(start + Math.floor(m.minute * 60e3) + int(0, 999));
      subs.push({ bot: b, round, p: m.p, ok: m.ok, wrong: m.wrong || null, at });
    }
  }
}

// 5. Each submission in its author's style, judged as it will be stored.
log(`judging ${subs.length} submissions in their authors' styles...`);
const sourceFor = (s, plain) => {
  const raw = s.ok ? solutions[s.p.problem_key].solution : s.wrong.src;
  return plain ? (s.bot.style.header ? s.bot.style.header + "\n" : "") + raw : formatCpp(raw, s.bot.style);
};
const expected = (s) => (s.ok ? null : s.wrong.result);
const matches = (r, s) => {
  const e = expected(s);
  return s.ok ? r.verdict === "ACCEPTED" && !r.unsure : r.verdict === e.verdict && r.passed === e.passed && !r.unsure;
};
let fallbacks = 0, dropped = 0;
const results = await pool(subs, WIDTH, async (s) => {
  const p = s.p.problem_key;
  let src = sourceFor(s, false);
  let r = await J.judge(p, src, tests[p], cpu(p));
  if (!matches(r, s)) {
    fallbacks++;
    src = sourceFor(s, true);
    r = await J.judge(p, src, tests[p], cpu(p));
    if (!matches(r, s)) { dropped++; return null; }
  }
  return { src, r };
}, (d, n) => { if (d % 100 === 0 || d === n) process.stdout.write(`  ${d}/${n}\r`); });
J.save();
log("");
const accDropped = subs.filter((s, i) => !results[i] && s.ok).length;
if (accDropped) throw new Error(`${accDropped} accepted submissions did not pass locally — refusing to continue`);
log(`style fallbacks: ${fallbacks}, rejected attempts dropped: ${dropped}`);

// 6. Rows, exactly as bank_submissions will hold them.
const maxInput = (key) => Math.max(...tests[key].map((t) => t.stdin.length));
// Each round problem's reference solution, timed alone. Under parallel load
// the judging above measured Windows scheduling as much as the program.
log("timing reference solutions one at a time...");
const refMs = {};
for (const round of rounds) for (const p of round.problems) {
  refMs[p.problem_key] = await J.time(p.problem_key, solutions[p.problem_key].solution, tests[p.problem_key]);
}
const slowest = Object.entries(refMs).sort((a, b) => b[1] - a[1]).slice(0, 5);
log("  slowest: " + slowest.map(([k, v]) => k + "=" + v + "ms").join(", "));
const rows = [];
subs.forEach((s, i) => {
  if (!results[i]) return;
  const { src, r } = results[i];
  const key = s.p.problem_key;
  const limitMs = cpu(key) * 1000;
  rows.push({
    id: uuidFrom(`${s.round.slug}:${s.bot.username}:${s.p.idx}:${s.at.toISOString()}`),
    bot: s.bot.key,
    contest: s.round.slug,
    idx: s.p.idx,
    problem_key: key,
    problem_title: s.bot.lang === "uz" ? s.p.title_uz : s.p.title_en,
    language: "cpp20",
    verdict: r.verdict,
    // The judge reports the slowest test it ran, which for a correct or a
    // nearly correct program is about what the reference solution takes.
    runtime_ms: r.verdict === "TIME_LIMIT_EXCEEDED" ? limitMs + int(1, 40)
      : Math.max(0, Math.round(refMs[key] * uni(s.ok ? 0.85 : 0.6, s.ok ? 1.3 : 1.15)) + int(0, 3)),
    // Local memory is not measurable the way the sandbox measures it, so this
    // is an estimate: the C++ runtime's floor plus room for the input.
    memory_kb: 3300 + int(0, 700) + Math.min(60000, Math.round((maxInput(key) * 3) / 1024)),
    passed: r.passed,
    total: r.total,
    source_code: src,
    created_at: s.at.toISOString(),
  });
});

// 7. The boards these rows produce — the same rules as contest_standings().
log("\nround                         date (Tashkent)    ppl  A   B   C   D   E   top");
for (const round of rounds) {
  const start = Date.parse(round.starts_at);
  const mine = rows.filter((r) => r.contest === round.slug);
  const by = new Map();
  for (const r of mine) {
    const u = by.get(r.bot) || {}; by.set(r.bot, u);
    const c = u[r.idx] || (u[r.idx] = { ok: false, wrong: 0, minute: 0 });
    if (c.ok) continue;
    if (r.verdict === "ACCEPTED") { c.ok = true; c.minute = Math.floor((Date.parse(r.created_at) - start) / 60e3); }
    else c.wrong++;
  }
  const table = [...by.entries()].map(([bot, cells]) => {
    const solved = Object.values(cells).filter((c) => c.ok);
    return { bot, solved: solved.length, pen: solved.reduce((a, c) => a + c.minute + 20 * c.wrong, 0) };
  }).sort((x, y) => y.solved - x.solved || x.pen - y.pen);
  const per = SLOTS.map((s) => [...by.values()].filter((u) => u[s.idx]?.ok).length);
  const local = new Date(start + 5 * 3600e3).toISOString().slice(0, 16).replace("T", " ");
  const top = table[0];
  log(`${round.title_uz.padEnd(30).slice(0, 30)} ${local}  ${String(by.size).padStart(3)} ${per.map((x) => String(x).padStart(3)).join(" ")}  ${bots.find((b) => b.key === top.bot).username} ${top.solved}/${top.pen}`);
}

const verdicts = rows.reduce((a, r) => ((a[r.verdict] = (a[r.verdict] || 0) + 1), a), {});
const usedBots = bots.filter((b) => rows.some((r) => r.bot === b.key));
log(`\nparticipants: ${usedBots.length} people · submissions: ${rows.length} ${JSON.stringify(verdicts)}`);

writeFileSync(join(OUT, "seed.json"), JSON.stringify({
  seed: SEED,
  generated_at: new Date().toISOString(),
  bots: usedBots.map(({ key, username, display_name, country, bio, lang, created_at }) =>
    ({ key, username, display_name, country, bio, lang, created_at })),
  contests: rounds,
  submissions: rows,
}, null, 1));
log(`wrote ${join(OUT, "seed.json")}`);
