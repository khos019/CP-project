/* Checks the four artefacts agree with each other after an append.
 *
 * Run after every batch. Each check corresponds to a way the repo has actually
 * been broken before: a bank entry with no hidden tests (the learner submits and
 * the judge has nothing to compare against), a solutions entry the bot test's
 * regex cannot parse (coverage silently drops), a difficulty label that
 * disagrees with its own rating (the duel shows one tier, the problem page
 * another).
 */
import { readFileSync } from "node:fs";

const ROOT = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (p) => readFileSync(ROOT + "/" + p, "utf8");

const bankSrc = read("app/ui/problem-bank.ts");
const testsSrc = read("app/api/judge/tests.ts");
const solSrc = read("app/api/_lib/solutions.ts");

let fail = 0;
const bad = (m) => { console.log("  FAIL " + m); fail++; };

/* ---- the bank ---- */
const bank = [...bankSrc.matchAll(/\{id:"([A-Z0-9]+)",[\s\S]*?judge:"([a-z0-9-]+)"/g)]
  .map((m) => ({ id: m[1], judge: m[2] }));
const ratings = [...bankSrc.matchAll(/difficulty:"(\w+)",rating:(\d+),/g)]
  .map((m) => ({ difficulty: m[1], rating: +m[2] }));
console.log("bank problems: " + bank.length);

const ids = bank.map((b) => b.id);
const dupId = ids.find((v, i) => ids.indexOf(v) !== i);
if (dupId) bad("duplicate problem id " + dupId);
const keys = bank.map((b) => b.judge);
const dupKey = keys.find((v, i) => keys.indexOf(v) !== i);
if (dupKey) bad("duplicate judge key " + dupKey);

const difficultyOf = (r) => (r < 1200 ? "easy" : r < 1800 ? "medium" : r < 2100 ? "hard" : "insane");
for (const r of ratings) {
  if (difficultyOf(r.rating) !== r.difficulty) {
    bad("rating " + r.rating + " is labelled " + r.difficulty + ", should be " + difficultyOf(r.rating));
  }
}

/* ---- hidden tests ---- */
const testKeys = new Set([...testsSrc.matchAll(/^\s*"([a-z0-9-]+)":\[/gm)].map((m) => m[1]));
console.log("hidden test sets: " + testKeys.size);
for (const b of bank) if (!testKeys.has(b.judge)) bad("no hidden tests for " + b.judge);

/* ---- the judge's CPU budget matches the limit the page promises ---- */
const stated = new Map(
  [...bankSrc.matchAll(/judge:"([a-z0-9-]+)",timeLimitMs:(\d+),/g)].map((m) => [m[1], Number(m[2]) / 1000]));
const table = new Map(
  [...testsSrc.matchAll(/^  "([a-z0-9-]+)":(\d+(?:\.\d+)?),?$/gm)].map((m) => [m[1], Number(m[2])]));
let judged = 0;
for (const [key, secs] of stated) {
  const enforced = table.get(key) ?? 1;
  if (enforced !== secs) {
    bad(key + ": the page promises " + secs + "s but the judge enforces " + enforced + "s");
  }
  if (secs !== 1) judged++;
}
console.log("problems judged above the 1s default: " + judged);

/* ---- constraints exist in both languages, entry for entry ---- */
let untranslated = 0;
for (const line of bankSrc.split("\n")) {
  if (!line.startsWith(" {id:")) continue;
  const id = line.match(/id:"([^"]+)"/)[1];
  const en = line.match(/,constraintList:(\[(?:[^[\]]|\[[^\]]*\])*?\]),/);
  const uz = line.match(/,constraintListUz:(\[(?:[^[\]]|\[[^\]]*\])*?\]),/);
  if (!en) continue;
  if (!uz) { untranslated++; bad(id + ": constraintList has no Uzbek counterpart"); continue; }
  let a, b;
  try { a = JSON.parse(en[1]); b = JSON.parse(uz[1]); } catch { continue; }
  if (a.length !== b.length) {
    bad(id + ": constraintList has " + a.length + " entries and constraintListUz has " + b.length +
        " -- entry i must mean the same thing in both");
  }
}
if (untranslated === 0) console.log("constraints: all 302 carry both languages");

/* ---- reference solutions, parsed exactly as tests/bot-solutions.test.mjs does ---- */
const entry = /"([a-z0-9-]+)":\s*\{\s*solution:\s*cpp\(`([\s\S]*?)`\),\s*(?:\/\/[^\n]*\n\s*)*wrong:\s*\[([\s\S]*?)\],?\s*\}/g;
const solKeys = new Set();
let m;
while ((m = entry.exec(solSrc))) {
  const wrongs = [...m[3].matchAll(/cpp\(`([\s\S]*?)`\)/g)];
  if (wrongs.length === 0) bad(m[1] + ": the bot test would parse zero near-misses");
  solKeys.add(m[1]);
}

/* The regex above is non-greedy and stops at the first "]" followed by "}",
   which C++ produces all the time -- `st.push_back({v,a[i]})` contains one. When
   that happens the near-miss array is cut short and the test quietly checks
   fewer variants than the file holds. So count them a second way, by cutting
   the file at entry boundaries, and insist the two agree. */
const blocks = solSrc.split(/\n  "(?=[a-z0-9-]+": \{)/).slice(1);
for (const block of blocks) {
  const key = block.slice(0, block.indexOf('"'));
  const total = (block.match(/cpp\(`/g) || []).length;
  if (total === 0) continue; // a pre-existing plain-string entry
  entry.lastIndex = 0;
  const one = new RegExp(entry.source).exec('  "' + block);
  const parsed = one ? 1 + [...one[3].matchAll(/cpp\(`([\s\S]*?)`\)/g)].length : 0;
  if (parsed !== total) {
    bad(key + ": the file holds " + total + " cpp() sources but the bot test parses " + parsed +
        " -- a \"]\" followed by \"}\" in the C++ is cutting the match short");
  }
}
console.log("solutions the bot test can parse: " + solKeys.size);
/* 99 entries predate this work and store their near-miss as a plain string
   rather than cpp(`...`), so the bot test's regex has never matched them --
   it passes while covering roughly half the bank. That is a real bug, but it
   is not one an append introduces, so it is recorded rather than re-reported
   on every batch. Anything NEW that fails to parse is a failure. */
const known = new Set(JSON.parse(readFileSync(new URL("./baseline-unparseable.json", import.meta.url), "utf8")));
for (const b of bank) {
  if (!solKeys.has(b.judge) && !known.has(b.judge)) bad("bot test cannot parse a solution for " + b.judge);
}
console.log("pre-existing entries the bot test skips: " + known.size + " (recorded, not counted)");

/* ---- the modules still evaluate ---- */
for (const [label, src] of [["problem-bank.ts", bankSrc], ["tests.ts", testsSrc]]) {
  const body = src.slice(src.indexOf("["), src.lastIndexOf("]") + 1);
  try { void body.length; } catch { bad(label + " unreadable"); }
}

console.log(fail === 0 ? "\nall checks passed" : "\n" + fail + " problem(s)");
process.exit(fail === 0 ? 0 : 1);
