/* The placement model, checked without a browser.
 *
 * These are the claims the feature rests on, and every one of them is a claim
 * about arithmetic rather than about pixels:
 *
 *   - answering hard questions correctly places you high, and easy ones wrong
 *     places you low;
 *   - the estimate is stable — one unlucky answer at the end cannot undo a
 *     consistent performance;
 *   - a high placement opens units, a low one opens none;
 *   - placement never certifies a track outright, so the top of every track is
 *     still earned rather than granted.
 *
 * The model is TypeScript, so this reads the source and evaluates the two
 * functions it needs rather than pulling in a build step for four assertions.
 *
 *   node --test tests/placement-model.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

/* --- the roadmap bands the model reads ---------------------------------- */
const dataSrc = await readFile(new URL("app/ui/roadmap-data.ts", root), "utf8");
const catalog = [...dataSrc.matchAll(/slug:"([a-z-]+)",icon:[\s\S]*?level:"(\d+)\s*→\s*(\d+)"[\s\S]*?units:\[([^\]]*)\]/g)]
  .map((m) => ({
    slug: m[1],
    level: `${m[2]} → ${m[3]}`,
    units: m[4].split('","').map((x) => x.replace(/"/g, "")),
  }));

/* --- the model, transpiled rather than hand-stripped --------------------- */
/* An earlier version of this test stripped the TypeScript with regexes and
   broke on the first generic it met. The compiler is already a dependency;
   asking it is both shorter and correct. */
const ts = (await import("typescript")).default;
const modelSrc = await readFile(new URL("app/ui/placement-model.ts", root), "utf8");
const compiled = ts.transpileModule(modelSrc, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
// The only import the model has is the roadmap catalog, which this test builds
// itself. Swap that line for the data and drop any other import.
const moduleSource = compiled
  .split("\n")
  .map((line) => {
    if (!line.startsWith("import ")) return line;
    return line.includes("roadmap-data") ? `const roadmapCatalog = ${JSON.stringify(catalog)};` : "";
  })
  .join("\n");
const model = await import(
  `data:text/javascript;base64,${Buffer.from(moduleSource, "utf8").toString("base64")}`
);

const bankSrc = await readFile(new URL("app/ui/placement-bank.ts", root), "utf8");
const questions = [...bankSrc.matchAll(/id: "([a-z0-9-]+)", track: "([a-z-]+)", rating: (\d+),/g)]
  .map((m) => ({ id: m[1], track: m[2], rating: Number(m[3]) }));

/* Walk the same adaptive selection the screen uses. Answering the first
   fourteen questions in file order is not what the test is meant to measure:
   the point of the model is that the questions chase the learner. */
function run(isCorrect, rounds = 14) {
  const asked = new Set();
  const seenTracks = new Set();
  const answers = [];
  let rating = 1200;
  for (let i = 0; i < rounds; i++) {
    const target = rating + (i < 3 ? 0 : 60);
    const pool = questions.filter((q) => !asked.has(q.id));
    if (!pool.length) break;
    const cost = (q) => Math.abs(q.rating - target) + (seenTracks.has(q.track) ? 250 : 0);
    const q = pool.reduce((best, x) => (cost(x) < cost(best) ? x : best), pool[0]);
    asked.add(q.id);
    seenTracks.add(q.track);
    answers.push({ question: q, correct: isCorrect(q) });
    rating = model.estimateRating(answers);
  }
  return answers;
}

test("the bank covers every roadmap track it claims to place", () => {
  const tracks = new Set(questions.map((q) => q.track));
  assert.ok(questions.length >= 20, `only ${questions.length} questions`);
  assert.ok(tracks.size >= 10, `only ${tracks.size} tracks probed`);
  for (const q of questions) {
    assert.ok(catalog.some((c) => c.slug === q.track), `${q.id} points at unknown track ${q.track}`);
  }
});

test("answering everything correctly places high; everything wrong places low", () => {
  const strong = model.estimateRating(run(() => true));
  const weak = model.estimateRating(run(() => false));
  assert.ok(strong >= 1700, `all-correct placed at only ${strong}`);
  assert.ok(weak <= 950, `all-wrong placed at ${weak}`);
  assert.ok(strong > weak + 600, "the two extremes must be far apart");
});

test("one late mistake does not undo a consistent run", () => {
  const clean = run(() => true);
  const slip = clean.map((a, i) => (i === clean.length - 1 ? { ...a, correct: false } : a));
  const before = model.estimateRating(clean);
  const after = model.estimateRating(slip);
  assert.ok(before - after < 120, `a single last answer moved the estimate by ${before - after}`);
});

test("a high placement opens units and a low one opens none", () => {
  const strongRun = run(() => true);
  const weakRun = run(() => false);
  const high = model.placeTracks(model.estimateRating(strongRun), strongRun);
  const low = model.placeTracks(model.estimateRating(weakRun), weakRun);

  const openedHigh = high.reduce((n, t) => n + t.cleared, 0);
  const openedLow = low.reduce((n, t) => n + t.cleared, 0);
  assert.ok(openedHigh > 40, `a 1900 placement opened only ${openedHigh} units`);
  assert.equal(openedLow, 0, `a beginner placement opened ${openedLow} units`);
});

test("placement never clears more units than a track has, nor certifies it outright", () => {
  for (const rating of [800, 1200, 1500, 1900, 2400]) {
    for (const t of model.placeTracks(rating, run(() => true))) {
      const track = catalog.find((c) => c.slug === t.slug);
      assert.ok(t.cleared >= 0 && t.cleared <= track.units.length,
        `${t.slug}: cleared ${t.cleared} of ${track.units.length}`);
      assert.ok(t.mastery <= 820,
        `${t.slug}: placement handed out ${t.mastery} mastery — the top of a track must be earned`);
    }
  }
});

test("a track far above the learner stays closed", () => {
  const placed = model.placeTracks(900, run((q) => q.rating <= 1000));
  const advanced = placed.find((t) => t.slug === "advanced-cp");
  assert.equal(advanced.cleared, 0, "advanced-cp should open nothing for a 900 placement");
});
