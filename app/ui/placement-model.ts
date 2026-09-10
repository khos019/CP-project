"use client";

/* Turning level-check answers into mastery, one roadmap section at a time.
 *
 * The rule is meant to be explainable in one breath, because the learner sees
 * it before they start:
 *
 *   every correct answer adds mastery to the section it belongs to — a basic
 *   question +80, a core one +150, a deep one +200 — and nothing else.
 *
 * With the platform's default thresholds (unlock 450, complete 700) that works
 * out to:
 *
 *   - both basics and both cores right (460): the section opens;
 *   - all six right (860, capped at 820): complete;
 *   - one basic or one core missed (780 / 710): still complete;
 *   - a deep question missed (660): not complete — the far end of a section is
 *     exactly what the deep questions check, so it has to be shown, not
 *     inferred.
 *
 * "Complete" is what lets the roadmap move on: a section at or above the
 * completion threshold counts as done for every section that lists it as a
 * prerequisite (see roadmapStatus in RoadmapHub.tsx).
 *
 * The cap sits below "advanced" (850) on purpose. Six multiple-choice answers
 * can show a learner is past a section; advanced mastery is for solved problems
 * and duels.
 *
 * A section the learner did not take, or skipped, gets nothing — no answers is
 * no evidence, and the roadmap keeps its normal order there.
 */

import { roadmapCatalog } from "./roadmap-data";
import type { PlacementQuestion, Tier } from "./placement-bank";

export type Answer = {
  question: PlacementQuestion;
  correct: boolean;
  /** The learner said "I don't know this section" instead of answering. Scored
   *  as zero; counted as a miss for the overall estimate, never for mastery. */
  skipped?: boolean;
};

export const TIER_POINTS: Record<Tier, number> = { basic: 80, core: 150, deep: 200 };
export const SECTION_CAP = 820;
/** A section stops after this many wrong answers: past that point it cannot
 *  be completed, and more questions would only be discouraging. */
export const WRONG_LIMIT = 2;

export function sectionScore(answers: Answer[], slug: string): number {
  const raw = answers
    .filter((a) => a.question.track === slug && a.correct)
    .reduce((sum, a) => sum + TIER_POINTS[a.question.tier], 0);
  return Math.min(SECTION_CAP, raw);
}

export type TrackPlacement = {
  slug: string;
  /** 0–1000, the platform's mastery scale. 0 when the section was not taken. */
  mastery: number;
  /** How many of the track's units the level check opens. */
  cleared: number;
  units: number;
  /** Questions actually answered in this section (skips excluded). */
  asked: number;
  right: number;
  /** True when the learner answered at least one question here. */
  probed: boolean;
};

/* How many units a partial score opens.
 *
 * A completed section opens all of them — that is what completing it means.
 * Below that, the share grows with the score but stays well short of the whole
 * track: knowing both basics and both cores (460) opens roughly the first half,
 * the basics alone (160) the first few units. The rest is walked. */
const PARTIAL_OPEN_SHARE = 0.7;

export function placeTracks(answers: Answer[], thresholds: { complete: number }): TrackPlacement[] {
  return roadmapCatalog.map((track) => {
    const mine = answers.filter((a) => a.question.track === track.slug && !a.skipped);
    const mastery = sectionScore(answers, track.slug);
    const units = track.units.length;
    const cleared = mastery >= thresholds.complete
      ? units
      : Math.floor(units * (mastery / thresholds.complete) * PARTIAL_OPEN_SHARE);
    return {
      slug: track.slug, mastery, cleared, units,
      asked: mine.length,
      right: mine.filter((a) => a.correct).length,
      probed: mine.length > 0,
    };
  });
}

/* ---- One overall number, for the headline only -------------------------------
 *
 * Every question also carries a problem-rating equivalent, so the answers can be
 * read as a series of duels against questions: a right answer to a 1700
 * question moves the estimate a long way when it says 1200, a right answer to an
 * 800 one barely moves it. The same logistic curve the duel uses, so "1500"
 * means the same here as there. It decides nothing on the roadmap — the
 * per-section scores above do that. */

export const expectedCorrect = (rating: number, difficulty: number) =>
  1 / (1 + Math.pow(10, (difficulty - rating) / 400));

export const START_RATING = 1200;
const STEP_FIRST = 220;
const STEP_LAST = 50;

export function estimateRating(answers: Answer[]): number {
  let rating = START_RATING;
  answers.forEach((a, i) => {
    const step = STEP_FIRST - (STEP_FIRST - STEP_LAST) * (i / Math.max(1, answers.length - 1));
    const expected = expectedCorrect(rating, a.question.rating);
    rating += step * ((a.correct ? 1 : 0) - expected);
  });
  return Math.round(Math.max(800, Math.min(2400, rating)));
}

/** A short, honest label for the estimate. Deliberately not a Codeforces title:
 *  this is a placement, not a rank somebody earned. */
export function levelLabel(rating: number, lang: "uz" | "en") {
  if (rating < 1000) return lang === "uz" ? "Boshlang‘ich" : "Beginner";
  if (rating < 1300) return lang === "uz" ? "Asoslar mustahkam" : "Solid basics";
  if (rating < 1600) return lang === "uz" ? "O‘rta daraja" : "Intermediate";
  if (rating < 1900) return lang === "uz" ? "Kuchli" : "Strong";
  return lang === "uz" ? "Ilg‘or" : "Advanced";
}
