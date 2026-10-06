/* Writes tools/contests/out/seed.json into Supabase, or takes it back out.
 *
 *   node tools/contests/seed.mjs              dry run: what would be written
 *   node tools/contests/seed.mjs --apply      write it (needs 044 applied)
 *   node tools/contests/seed.mjs --update-timing  rewrite runtime/memory of
 *                                             applied rows from seed.json
 *   node tools/contests/seed.mjs --rollback   delete every contest and seeded
 *                                             account this script created
 *   node tools/contests/seed.mjs --duels          dry run of out/duels.json
 *   node tools/contests/seed.mjs --apply-duels    write the bot-vs-bot duels
 *   node tools/contests/seed.mjs --rollback-duels delete them, ratings to 1200
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY from .env.local. Every account it creates is
 * recorded in out/applied.json as it goes, and in bot_accounts, so a rollback
 * works even after a run that stopped halfway.
 *
 * The accounts cannot be signed into: the password is random, never stored,
 * and the address is on a domain with no mailbox. No mail is sent.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { join } from "node:path";

const HERE = new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const ROOT = join(HERE, "..", "..");
const OUT = join(HERE, "out");
const arg = (f) => process.argv.includes(f);
const mode = arg("--apply-duels") ? "apply-duels" : arg("--rollback-duels") ? "rollback-duels" : arg("--duels") ? "dry-duels"
  : arg("--apply") ? "apply" : arg("--rollback") ? "rollback" : arg("--update-timing") ? "timing" : "dry";
const duelsFile = join(OUT, "duels.json");
const duels = existsSync(duelsFile) ? JSON.parse(readFileSync(duelsFile, "utf8")) : null;

const seed = JSON.parse(readFileSync(join(OUT, "seed.json"), "utf8"));
const appliedFile = join(OUT, "applied.json");
const applied = existsSync(appliedFile) ? JSON.parse(readFileSync(appliedFile, "utf8")) : { users: {} };
const remember = () => writeFileSync(appliedFile, JSON.stringify(applied, null, 1));

const EMAIL_DOMAIN = "contest-bots.algoyol.invalid";

if (mode === "dry") {
  const v = seed.submissions.reduce((a, r) => ((a[r.verdict] = (a[r.verdict] || 0) + 1), a), {});
  console.log(`would create ${seed.bots.length} accounts (@${EMAIL_DOMAIN}, marked in bot_accounts)`);
  console.log(`would create ${seed.contests.length} contests, ${seed.contests.length * 5} contest problems`);
  console.log(`would insert ${seed.submissions.length} bank_submissions ${JSON.stringify(v)} and as many contest_entries`);
  for (const c of seed.contests) {
    console.log(`  ${c.slug.padEnd(9)} ${c.starts_at}  ${c.problems.map((p) => `${p.idx}:${p.bank_id}(${p.rating})`).join(" ")}`);
  }
  console.log("\nnothing written. --apply to write, --rollback to undo.");
  process.exit(0);
}

if (mode === "dry-duels") {
  if (!duels) throw new Error("out/duels.json missing — run duels.mjs first");
  const subs = duels.matches.flatMap((m) => m.submissions);
  const v = subs.reduce((a, r) => ((a[r.verdict] = (a[r.verdict] || 0) + 1), a), {});
  const r = duels.finals.map((f) => f.rating).sort((a, b) => a - b);
  console.log(`would insert ${duels.matches.length} finished duels (mode 'human', bot vs bot), ${duels.matches.length * 3} rounds`);
  console.log(`would insert ${subs.length} duel_submissions and as many bank_submissions ${JSON.stringify(v)}`);
  console.log(`would set duel_rating on ${duels.finals.length} seeded accounts: ${r[0]}..${r.at(-1)}`);
  console.log("\nnothing written. --apply-duels to write, --rollback-duels to undo.");
  process.exit(0);
}

const env = Object.fromEntries(readFileSync(join(ROOT, ".env.local"), "utf8").split(/\r?\n/)
  .filter((l) => /^[A-Z_]+=/.test(l)).map((l) => { const i = l.indexOf("="); return [l.slice(0, i), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")]; }));
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL, KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing from .env.local");
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "content-type": "application/json" };

/* A dropped connection is retried. Every write below is safe to repeat: rows
   carry their own ids and are inserted with ignore-duplicates, and an account
   whose creation succeeded but whose answer was lost is adopted by its
   address on the next pass. */
async function call(method, path, body, prefer = "return=minimal") {
  for (let attempt = 0; ; attempt++) {
    try { return await callOnce(method, path, body, prefer); }
    catch (e) {
      const transient = e.cause?.code === "ECONNRESET" || e.cause?.code === "UND_ERR_SOCKET" || /fetch failed|→ 5\d\d/.test(String(e.message));
      if (transient && attempt < 6) { await new Promise((r) => setTimeout(r, 1000 * (attempt + 1))); continue; }
      throw e;
    }
  }
}
async function callOnce(method, path, body, prefer) {
  const res = await fetch(`${URL_}${path}`, { method, headers: { ...H, Prefer: prefer }, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path.split("?")[0]} → ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}
const rest = (method, table, body, prefer) => call(method, `/rest/v1/${table}`, body, prefer);
const chunks = (xs, n) => Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, i * n + n));

async function removeDuels() {
  if (!duels) return;
  // Rounds, players and duel_submissions go with the match (on delete cascade);
  // the bank copies of the attempts are separate rows.
  for (const batch of chunks(duels.matches.map((m) => m.id), 150)) {
    await rest("DELETE", `duel_matches?id=in.(${batch.join(",")})`);
  }
  for (const batch of chunks(duels.matches.flatMap((m) => m.submissions.map((s) => s.bank_id)), 150)) {
    await rest("DELETE", `bank_submissions?id=in.(${batch.join(",")})`);
  }
  console.log(`deleted ${duels.matches.length} seeded duels and their submissions`);
}

if (mode === "rollback-duels") {
  await removeDuels();
  for (const id of Object.values(applied.users)) await rest("PATCH", `profiles?id=eq.${id}`, { duel_rating: 1200 });
  console.log("seeded accounts back to 1200");
  process.exit(0);
}

if (mode === "apply-duels") {
  if (!duels) throw new Error("out/duels.json missing — run duels.mjs first");
  const user = (key) => { const id = applied.users[key]; if (!id) throw new Error("no account for " + key); return id; };
  const ign = "resolution=ignore-duplicates,return=minimal";
  const M = duels.matches;
  for (const batch of chunks(M, 200)) {
    await rest("POST", "duel_matches?on_conflict=id", batch.map((m) => ({
      id: m.id, status: "finished", mode: "human", rounds: 3,
      started_at: m.started_at, ends_at: m.ends_at, finished_at: m.finished_at, created_at: m.started_at,
      winner_seat: m.winner_seat, winner_id: m.winner_seat ? user(m.players[m.winner_seat - 1].bot) : null,
    })), ign);
    await rest("POST", "duel_match_players?on_conflict=match_id,seat", batch.flatMap((m) => m.players.map((p) => ({
      match_id: m.id, seat: p.seat, user_id: user(p.bot), is_bot: false, display_name: p.display_name,
      score: p.score, rating_before: p.rating_before, rating_after: p.rating_after, active: false,
    }))), ign);
    await rest("POST", "duel_rounds?on_conflict=match_id,round", batch.flatMap((m) => m.rounds.map((r) => ({ match_id: m.id, ...r }))), ign);
  }
  console.log(`duels: ${M.length}`);
  const subs = M.flatMap((m) => m.submissions.map((s) => ({ m, s })));
  let done = 0;
  for (const batch of chunks(subs, 250)) {
    await rest("POST", "duel_submissions?on_conflict=id", batch.map(({ m, s }) => ({
      id: s.id, match_id: m.id, seat: s.seat, is_bot: false, round: s.round, language: s.language,
      source_code: s.source_code, verdict: s.verdict, runtime_ms: s.runtime_ms, memory_kb: s.memory_kb,
      passed: s.passed, total: s.total, created_at: s.created_at,
    })), ign);
    // duel_record_submission() writes every duel attempt through to the bank.
    await rest("POST", "bank_submissions?on_conflict=id", batch.map(({ s }) => ({
      id: s.bank_id, user_id: user(s.bot), problem_key: s.problem_key, problem_title: s.problem_title,
      language: s.language, verdict: s.verdict, runtime_ms: s.runtime_ms, memory_kb: s.memory_kb,
      passed: s.passed, total: s.total, source_code: s.source_code, created_at: s.created_at,
    })), ign);
    done += batch.length;
    process.stdout.write(`  submissions ${done}/${subs.length}\r`);
  }
  console.log("");
  for (const f of duels.finals) await rest("PATCH", `profiles?id=eq.${user(f.key)}`, { duel_rating: f.rating });
  console.log(`duel_rating set on ${duels.finals.length} accounts`);
  process.exit(0);
}

if (mode === "rollback") {
  await removeDuels();
  const slugs = seed.contests.map((c) => c.slug);
  await rest("DELETE", `contests?slug=in.(${slugs.join(",")})`);
  console.log(`deleted contests ${slugs[0]}…${slugs.at(-1)} (problems and entries cascade)`);
  // Recorded ids, plus anything bot_accounts knows that the record missed.
  const marked = (await rest("GET", "bot_accounts?select=user_id")).map((r) => r.user_id);
  const ids = [...new Set([...Object.values(applied.users), ...marked])];
  let n = 0;
  for (const id of ids) {
    try { await call("DELETE", `/auth/v1/admin/users/${id}`); n++; }
    catch (e) { if (!/404/.test(String(e))) throw e; }
  }
  console.log(`deleted ${n} accounts (profiles and their submissions cascade)`);
  applied.users = {};
  remember();
  process.exit(0);
}

if (process.argv.includes("--update-timing")) {
  // Rewrites runtime_ms and memory_kb of rows already applied, by id. Sent as
  // whole rows because an upsert must be a valid insert; the other columns
  // carry the values they already hold.
  let done = 0;
  for (const batch of chunks(seed.submissions, 250)) {
    await rest("POST", "bank_submissions?on_conflict=id", batch.map((r) => ({
      id: r.id, user_id: applied.users[r.bot], problem_key: r.problem_key, problem_title: r.problem_title,
      language: r.language, verdict: r.verdict, runtime_ms: r.runtime_ms, memory_kb: r.memory_kb,
      passed: r.passed, total: r.total, source_code: r.source_code, created_at: r.created_at,
    })), "resolution=merge-duplicates,return=minimal");
    done += batch.length;
    process.stdout.write(`  updated ${done}/${seed.submissions.length}\r`);
  }
  console.log(`\nupdated timing on ${done} submissions`);
  process.exit(0);
}

/* ------------------------------------------------------------------ apply */
// Preflight: the migration is there, nothing is half-written, no name clashes.
await rest("GET", "contests?select=id&limit=1").catch(() => { throw new Error("contests table not found — run 044_contests.sql first"); });
const existing = await rest("GET", `contests?select=slug&slug=in.(${seed.contests.map((c) => c.slug).join(",")})`);
if (existing.length) throw new Error(`contests already present: ${existing.map((c) => c.slug).join(", ")} — run --rollback first`);
const taken = new Set((await rest("GET", "profiles?select=username&limit=10000")).map((p) => p.username.toLowerCase()));
// A clash that is one of ours from an interrupted run is adopted, not refused.
for (const b of seed.bots.filter((x) => taken.has(x.username.toLowerCase()) && !applied.users[x.key])) {
  const [row] = await rest("GET", `profiles?select=id&username=eq.${encodeURIComponent(b.username)}`);
  if (!row) continue;
  const u = await call("GET", `/auth/v1/admin/users/${row.id}`);
  if ((u.email || u.user?.email || "").endsWith("@" + EMAIL_DOMAIN)) { applied.users[b.key] = row.id; remember(); }
}
const clash = seed.bots.filter((b) => taken.has(b.username.toLowerCase()) && !applied.users[b.key]);
if (clash.length) throw new Error(`usernames already taken: ${clash.map((b) => b.username).join(", ")} — rebuild with another SEED`);

// 1. Accounts.
for (const b of seed.bots) {
  if (!applied.users[b.key]) {
  const user = await call("POST", "/auth/v1/admin/users", {
    email: `${b.username.toLowerCase()}@${EMAIL_DOMAIN}`,
    password: randomBytes(24).toString("base64url"),
    email_confirm: true,
    user_metadata: { username: b.username, display_name: b.display_name },
  });
  const id = user.id || user.user?.id;
  if (!id) throw new Error("no id for " + b.username);
  applied.users[b.key] = id;
  remember();
  }
  const id = applied.users[b.key];
  await rest("POST", "bot_accounts?on_conflict=user_id", { user_id: id }, "resolution=ignore-duplicates,return=minimal");
  await rest("PATCH", `profiles?id=eq.${id}`, {
    display_name: b.display_name, country: b.country, bio: b.bio,
    preferred_language: b.lang, created_at: b.created_at,
  });
  process.stdout.write(`  accounts ${Object.keys(applied.users).length}/${seed.bots.length}\r`);
}
console.log(`\naccounts ready: ${seed.bots.length}`);

// 2. Contests and their problems.
const made = await rest("POST", "contests", seed.contests.map((c) => ({
  slug: c.slug, number: c.number, title_uz: c.title_uz, title_en: c.title_en,
  starts_at: c.starts_at, duration_minutes: c.duration_minutes, archived: true,
})), "return=representation");
const contestId = Object.fromEntries(made.map((c) => [c.slug, c.id]));
await rest("POST", "contest_problems?on_conflict=contest_id,idx", seed.contests.flatMap((c) => c.problems.map((p) => ({ contest_id: contestId[c.slug], ...p }))), "resolution=ignore-duplicates,return=minimal");
console.log(`contests: ${made.length}`);

// 3. Submissions, then the entries that place them in a round.
const user = (key) => applied.users[key];
let done = 0;
for (const batch of chunks(seed.submissions, 250)) {
  await rest("POST", "bank_submissions?on_conflict=id", batch.map((r) => ({
    id: r.id, user_id: user(r.bot), problem_key: r.problem_key, problem_title: r.problem_title,
    language: r.language, verdict: r.verdict, runtime_ms: r.runtime_ms, memory_kb: r.memory_kb,
    passed: r.passed, total: r.total, source_code: r.source_code, created_at: r.created_at,
  })), "resolution=ignore-duplicates,return=minimal");
  done += batch.length;
  process.stdout.write(`  submissions ${done}/${seed.submissions.length}\r`);
}
console.log("");
for (const batch of chunks(seed.submissions, 1000)) {
  await rest("POST", "contest_entries?on_conflict=submission_id", batch.map((r) => ({
    submission_id: r.id, contest_id: contestId[r.contest], idx: r.idx, user_id: user(r.bot),
  })), "resolution=ignore-duplicates,return=minimal");
}
console.log(`entries: ${seed.submissions.length}`);

// 4. Read one board back through the public function, as the page will.
const check = await call("POST", "/rest/v1/rpc/contest_standings", { p_slug: seed.contests[0].slug });
console.log(`check: ${check.contest.slug} has ${check.rows.length} rows; leader ${check.rows[0]?.username} ${check.rows[0]?.solved}/${check.rows[0]?.penalty}`);
