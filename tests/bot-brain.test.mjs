/* The bot's brain, checked against what it claims to be.
 *
 * The claim is narrow and testable: a bot playing at rating R behaves like a
 * person at rating R. Not "feels about right" — the platform already has a
 * number for how often R beats a problem rated P, the same Elo curve rating.ts
 * and duel_finish use, and the bot has to land on it.
 *
 * Everything here is pure. The plan is a deterministic function of the match
 * id, so twenty thousand duels can be simulated in a second and the answer is
 * the same twice.
 *
 *   node --test tests/bot-brain.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import { planDuel, solveProbability, getBotSubmissionBehavior } from "../app/api/_lib/bot.ts";

const DIFFS = ["easy", "medium", "hard"];
// The offsets duel_pick_problems() actually uses for the three rounds.
const OFFSETS = [-150, 0, 200];

/** Simulates N duels across a spread of bot ratings and returns per-round facts. */
function simulate(n = 20000) {
  const stat = OFFSETS.map(() => ({ n: 0, wrong: 0, empty: 0, tSolved: [], tFailed: [] }));
  for (let i = 0; i < n; i++) {
    const bot = 900 + (i % 12) * 100;
    const rounds = OFFSETS.map((off, r) => ({
      round: r, problemKey: `p${r}`, problemRating: bot + off,
      difficulty: DIFFS[r], wrongVariants: 1,
    }));
    for (const rp of planDuel(`match-${i}`, bot, rounds, 1800).rounds) {
      const s = stat[rp.round];
      s.n++;
      if (!rp.attempts.length) s.empty++;
      if (rp.attempts.some((a) => !a.correct)) s.wrong++;
      const first = rp.attempts[0]?.at;
      if (typeof first === "number") (rp.solves ? s.tSolved : s.tFailed).push(first);
    }
  }
  return stat;
}

const stat = simulate();
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

test("every round the bot plays produces at least one submission", () => {
  for (const [r, s] of stat.entries()) {
    assert.equal(s.empty, 0,
      `round ${r}: ${s.empty} of ${s.n} plans schedule nothing at all — that is an opponent that looks switched off`);
  }
});

test("solve rate tracks the Elo curve the rest of the platform uses", () => {
  for (const [r, s] of stat.entries()) {
    const solved = s.tSolved.length / s.n;
    const expected = solveProbability(1200, 1200 + OFFSETS[r]);
    assert.ok(Math.abs(solved - expected) < 0.02,
      `round ${r} (problem ${OFFSETS[r]} from the bot): solved ${(solved * 100).toFixed(1)}%, Elo says ${(expected * 100).toFixed(1)}%`);
  }
});

test("how fast the bot is does not give away whether it will succeed", () => {
  // These were the same draw once, so a solving bot was always a fast bot and
  // a failing one was always slow — a tell no person has.
  for (const [r, s] of stat.entries()) {
    const gap = Math.abs(mean(s.tSolved) - mean(s.tFailed));
    assert.ok(gap < 12,
      `round ${r}: first attempt averages ${Math.round(mean(s.tSolved))}s when it solves and ${Math.round(mean(s.tFailed))}s when it does not — the timing leaks the outcome`);
  }
});

test("a bot that fails a round fails it visibly, and one that wins still fumbles sometimes", () => {
  // A round it cannot solve must always show a rejected submission...
  const hardest = stat[2];
  assert.ok(hardest.wrong / hardest.n > 0.9,
    `only ${(hardest.wrong / hardest.n * 100).toFixed(1)}% of over-its-head rounds show a wrong submission`);
  // ...and a comfortable one must not be flawless, or it stops looking human.
  const easiest = stat[0];
  assert.ok(easiest.wrong / easiest.n > 0.25 && easiest.wrong / easiest.n < 0.75,
    `${(easiest.wrong / easiest.n * 100).toFixed(1)}% of comfortable rounds show a wrong submission — expected somewhere near half`);
});

test("the bot never schedules more failed attempts than it has different programs to send", () => {
  // Two identical submissions collecting the same verdict is the one thing no
  // player has ever done.
  for (let i = 0; i < 3000; i++) {
    const plan = planDuel(`v-${i}`, 1400, OFFSETS.map((off, r) => ({
      round: r, problemKey: `p${r}`, problemRating: 1400 + off, difficulty: DIFFS[r], wrongVariants: 1,
    })), 1800);
    for (const rp of plan.rounds) {
      const wrong = rp.attempts.filter((a) => !a.correct);
      assert.ok(wrong.length <= 1, `${wrong.length} failed attempts with only one wrong program available`);
      assert.equal(new Set(wrong.map((a) => a.variant)).size, wrong.length, "the same program twice");
    }
  }
});

test("the first thing the opponent sees happens within a couple of minutes", () => {
  const opening = stat[0].tSolved.concat(stat[0].tFailed).sort((a, b) => a - b);
  const median = opening[Math.floor(opening.length / 2)];
  const worst = opening[opening.length - 1];
  assert.ok(median < 90, `median first submission of a duel is ${median}s in`);
  assert.ok(worst < 240, `the slowest opening submission is ${worst}s in — long enough to read as broken`);
});

test("the plan is a function of the match id and nothing else", () => {
  const args = [OFFSETS.map((off, r) => ({
    round: r, problemKey: `p${r}`, problemRating: 1200 + off, difficulty: DIFFS[r], wrongVariants: 1,
  })), 1800];
  assert.deepEqual(planDuel("same", 1200, ...args), planDuel("same", 1200, ...args));
  assert.notDeepEqual(planDuel("same", 1200, ...args), planDuel("other", 1200, ...args));
});

test("strength is expressed in the platform's own units", () => {
  assert.equal(Math.round(solveProbability(1500, 1500) * 100), 50);
  assert.ok(solveProbability(1500, 1100) > 0.9, "400 points of gap should be near-certain");
  const behaviour = getBotSubmissionBehavior(1500, 1900, "hard", "seed");
  assert.ok(behaviour.expectedDelay > getBotSubmissionBehavior(1500, 1100, "hard", "seed").expectedDelay,
    "a problem above the bot must take it longer than one below");
});
