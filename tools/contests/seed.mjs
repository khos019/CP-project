/* Writes tools/contests/out/seed.json into Supabase, or takes it back out.
 *
 *   node tools/contests/seed.mjs              dry run: what would be written
 *   node tools/contests/seed.mjs --apply      write it (needs 044 applied)
 *   node tools/contests/seed.mjs --rollback   delete every contest and seeded
 *                                             account this script created
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
const mode = process.argv.includes("--apply") ? "apply" : process.argv.includes("--rollback") ? "rollback" : "dry";

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
      const transient = e.cause?.code === "ECONNRESET" || e.cause?.code === "UND_ERR_SOCKET" || /fetch failed|→ 5dd/.test(String(e.message));
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

if (mode === "rollback") {
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
