/* The level check, checked without a browser.
 *
 * The claims the feature rests on are claims about the bank and about
 * arithmetic, not about pixels:
 *
 *   - every roadmap section has a full set of questions — three per tier — and
 *     every question is well-formed in both languages;
 *   - a correct answer adds mastery to its own section and to nothing else;
 *   - all six right completes a section; one basic or core miss still does;
 *     a deep miss does not; the basics and cores together open it;
 *   - the level check never reaches "advanced" mastery;
 *   - a completed section opens every unit, a partial one only some;
 *   - a run draws two questions per tier, preferring ones not seen before.
 *
 *   node --test tests/placement-model.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const ts = (await import("typescript")).default;

/* --- the roadmap the model reads ------------------------------------------ */
const dataSrc = await readFile(new URL("app/ui/roadmap-data.ts", root), "utf8");
const catalog = [...dataSrc.matchAll(/slug:"([a-z-]+)",icon:[\s\S]*?level:"(\d+)\s*→\s*(\d+)"[\s\S]*?units:\[([^\]]*)\]/g)]
  .map((m) => ({
    slug: m[1],
    level: `${m[2]} → ${m[3]}`,
    units: m[4].split('","').map((x) => x.replace(/"/g, "")),
  }));

/* --- TypeScript modules, transpiled and loaded with their imports swapped --
   Each module's imports are replaced by values this test already holds, so no
   bundler is needed. */
async function load(file, replacements) {
  const src = await readFile(new URL(file, root), "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const body = js.split("\n").map((line) => {
    if (!line.startsWith("import ")) return line;
    const hit = Object.entries(replacements).find(([from]) => line.includes(from));
    return hit ? hit[1] : "";
  }).join("\n");
  return import(`data:text/javascript;base64,${Buffer.from(body, "utf8").toString("base64")}`);
}

const parts = await Promise.all([
  load("app/ui/placement-q-basics.ts", {}),
  load("app/ui/placement-q-core.ts", {}),
  load("app/ui/placement-q-advanced.ts", {}),
]);
const questions = [...parts[0].basicsQuestions, ...parts[1].coreQuestions, ...parts[2].advancedQuestions];
globalThis.__pbParts = parts;
const bank = await load("app/ui/placement-bank.ts", {
  "placement-q-basics": "const { basicsQuestions } = globalThis.__pbParts[0];",
  "placement-q-core": "const { coreQuestions } = globalThis.__pbParts[1];",
  "placement-q-advanced": "const { advancedQuestions } = globalThis.__pbParts[2];",
});
const model = await load("app/ui/placement-model.ts", {
  "roadmap-data": `const roadmapCatalog = ${JSON.stringify(catalog)};`,
});

const DEFAULTS = { unlock: 450, complete: 700, advanced: 850 };
const sectionOf = (slug) => bank.sectionQuestions(slug, new Set());
const answer = (qs, right) => qs.map((question, i) => ({ question, correct: right(question, i) }));

/* ---------------------------------------------------------------- the bank */
test("every roadmap section has three questions in every tier", () => {
  for (const track of catalog) {
    for (const tier of ["basic", "core", "deep"]) {
      const n = questions.filter((q) => q.track === track.slug && q.tier === tier).length;
      assert.equal(n, 3, `${track.slug}/${tier} has ${n} questions`);
    }
  }
  for (const q of questions) {
    assert.ok(catalog.some((c) => c.slug === q.track), `${q.id} points at unknown section ${q.track}`);
  }
});

test("every question is well-formed in both languages", () => {
  const ids = new Set();
  for (const q of questions) {
    assert.ok(!ids.has(q.id), `duplicate id ${q.id}`);
    ids.add(q.id);
    assert.ok(q.uz.trim() && q.en.trim(), `${q.id}: empty question text`);
    assert.ok(q.whyUz.trim() && q.whyEn.trim(), `${q.id}: missing explanation`);
    assert.ok(q.choicesUz.length === 4, `${q.id}: ${q.choicesUz.length} options`);
    assert.equal(new Set(q.choicesUz).size, q.choicesUz.length, `${q.id}: repeated option`);
    assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.choicesUz.length, `${q.id}: correct out of range`);
    if (q.choicesEn) {
      assert.equal(q.choicesEn.length, q.choicesUz.length, `${q.id}: option count differs between languages`);
    } else {
      // Shared options are shown to English readers as-is, so they must not be Uzbek.
      for (const c of q.choicesUz) {
        assert.ok(!/[‘’]|\b(ta|va|bilan|xato|doim|emas|kerak|faqat|har|bir)\b/i.test(c), `${q.id}: shared option looks Uzbek: ${c}`);
      }
    }
    const [lo, hi] = catalog.find((c) => c.slug === q.track).level.split("→").map((s) => parseInt(s, 10));
    assert.ok(q.rating >= Math.max(800, lo) - 100 && q.rating <= hi + 100, `${q.id}: rating ${q.rating} is outside ${lo}→${hi}`);
  }
});

test("within a section, the tiers get harder", () => {
  for (const track of catalog) {
    const avg = (tier) => {
      const r = questions.filter((q) => q.track === track.slug && q.tier === tier).map((q) => q.rating);
      return r.reduce((a, b) => a + b, 0) / r.length;
    };
    assert.ok(avg("basic") <= avg("core") && avg("core") <= avg("deep"), `${track.slug}: tiers out of order`);
  }
});

/* ------------------------------------------------------------ the drawing */
test("a run draws two questions per tier, easiest tier first", () => {
  for (const track of catalog) {
    const qs = sectionOf(track.slug);
    assert.deepEqual(qs.map((q) => q.tier), ["basic", "basic", "core", "core", "deep", "deep"]);
    assert.ok(qs.every((q) => q.track === track.slug));
  }
});

test("a retake prefers questions the learner has not been shown", () => {
  const slug = "graphs";
  const first = sectionOf(slug);
  const seen = new Set(first.map((q) => q.id));
  const second = bank.sectionQuestions(slug, seen);
  // Three per tier, two drawn: the second run must bring in the unseen one.
  for (const tier of ["basic", "core", "deep"]) {
    const fresh = second.filter((q) => q.tier === tier && !seen.has(q.id));
    assert.equal(fresh.length, 1, `${tier}: the unseen question was not drawn first`);
  }
});

test("options are shuffled, and the marked answer stays the right one", () => {
  const q = questions[0];
  const positions = new Set();
  for (let i = 0; i < 200; i++) {
    const shown = bank.shuffleOptions(q);
    assert.equal(new Set(shown.order).size, q.choicesUz.length);
    assert.equal(shown.order[shown.correctAt], q.correct);
    assert.equal(bank.shownChoices(shown, "uz")[shown.correctAt], q.choicesUz[q.correct]);
    positions.add(shown.correctAt);
  }
  assert.equal(positions.size, q.choicesUz.length, "the correct answer never moved to some positions");
});

/* ------------------------------------------------------------ the scoring */
test("answers only move their own section", () => {
  const qs = sectionOf("sorting");
  const placed = model.placeTracks(answer(qs, () => true), DEFAULTS);
  for (const p of placed) {
    if (p.slug === "sorting") assert.ok(p.mastery > 0);
    else assert.equal(p.mastery, 0, `${p.slug} got ${p.mastery} from sorting answers`);
  }
});

test("all six right completes a section, below advanced", () => {
  const score = model.sectionScore(answer(sectionOf("math"), () => true), "math");
  assert.ok(score >= DEFAULTS.complete, `all correct gave only ${score}`);
  assert.ok(score < DEFAULTS.advanced, `the level check handed out ${score} — advanced must be earned`);
});

test("one basic or core miss still completes; a deep miss does not", () => {
  const qs = sectionOf("greedy");
  const missing = (tier) => model.sectionScore(answer(qs, (q) => q !== qs.find((x) => x.tier === tier)), "greedy");
  assert.ok(missing("basic") >= DEFAULTS.complete, `a basic miss left ${missing("basic")}`);
  assert.ok(missing("core") >= DEFAULTS.complete, `a core miss left ${missing("core")}`);
  assert.ok(missing("deep") < DEFAULTS.complete, `a deep miss still completed (${missing("deep")})`);
});

test("the basics and cores together open a section; the basics alone do not", () => {
  const qs = sectionOf("strings");
  const upTo = (tiers) => model.sectionScore(answer(qs, (q) => tiers.includes(q.tier)), "strings");
  assert.ok(upTo(["basic", "core"]) >= DEFAULTS.unlock, `basics + cores gave ${upTo(["basic", "core"])}`);
  assert.ok(upTo(["basic"]) < DEFAULTS.unlock, `basics alone gave ${upTo(["basic"])}`);
});

test("skipped and wrong answers add nothing", () => {
  const qs = sectionOf("trees");
  const list = qs.map((question, i) => ({ question, correct: false, skipped: i % 2 === 0 }));
  assert.equal(model.sectionScore(list, "trees"), 0);
});

test("a completed section opens every unit; a partial one opens only some", () => {
  for (const track of catalog) {
    const qs = sectionOf(track.slug);
    const full = model.placeTracks(answer(qs, () => true), DEFAULTS).find((p) => p.slug === track.slug);
    assert.equal(full.cleared, track.units.length, `${track.slug}: completed but opened ${full.cleared}/${track.units.length}`);

    const half = model.placeTracks(answer(qs, (q) => q.tier !== "deep"), DEFAULTS).find((p) => p.slug === track.slug);
    assert.ok(half.cleared > 0 && half.cleared < track.units.length,
      `${track.slug}: basics + cores opened ${half.cleared}/${track.units.length}`);

    const none = model.placeTracks(answer(qs, () => false), DEFAULTS).find((p) => p.slug === track.slug);
    assert.equal(none.cleared, 0, `${track.slug}: all wrong still opened ${none.cleared}`);
  }
});

test("the overall estimate separates a strong run from a weak one", () => {
  const all = catalog.flatMap((t) => sectionOf(t.slug));
  const strong = model.estimateRating(answer(all, () => true));
  const weak = model.estimateRating(answer(all.filter((q) => q.tier === "basic").slice(0, 10), () => false));
  assert.ok(strong >= 1800, `all correct estimated at only ${strong}`);
  assert.ok(weak <= 1000, `all wrong estimated at ${weak}`);
});
