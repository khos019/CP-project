"use client";

/* Turning fourteen answers into a place on the roadmap.
 *
 * Two steps, deliberately separate.
 *
 * 1. ESTIMATE A RATING. Each answer moves an estimate the way a duel moves an
 *    Elo: getting a 1700 question right when the estimate says 1200 moves it a
 *    long way, getting an 800 one right barely moves it at all. The same
 *    logistic curve the duel and the bot use, so "1500" means the same thing in
 *    all three places.
 *
 * 2. TURN THAT RATING INTO PER-TRACK PROGRESS. Every roadmap track advertises
 *    the range it carries a learner through — sorting is 800→1500, dynamic
 *    programming is 1100→2400. A learner estimated at 1400 is past most of
 *    sorting and has not started DP, and that is exactly what the bands say.
 *    Direct evidence adjusts it: answering the graphs question right moves
 *    graphs specifically, not everything.
 *
 * The result is deliberately capped below full mastery. Placement is evidence
 * that somebody can skip ahead, not evidence that they have done the work —
 * the last stretch of every track still has to be earned.
 */

import { roadmapCatalog } from "./roadmap-data";
import type { PlacementQuestion } from "./placement-bank";

export type Answer = { question: PlacementQuestion; correct: boolean };

/** Probability a learner of `rating` answers a question of `difficulty`. The
 *  same curve as duel Elo, so the numbers are comparable across the site. */
export const expectedCorrect = (rating: number, difficulty: number) =>
  1 / (1 + Math.pow(10, (difficulty - rating) / 400));

export const START_RATING = 1200;
/* Big early steps settle the estimate fast; small late ones stop the last
   question from undoing everything before it. */
const STEP_FIRST = 260;
const STEP_LAST = 70;

/** Where to aim the next question. Slightly above the estimate: a question
 *  somebody is 50/50 on tells you more than one they will certainly get. */
export function nextTarget(rating: number, asked: number) {
  return Math.round(rating + (asked < 3 ? 0 : 60));
}

export function estimateRating(answers: Answer[]): number {
  let rating = START_RATING;
  answers.forEach((a, i) => {
    const step = STEP_FIRST - (STEP_FIRST - STEP_LAST) * (i / Math.max(1, answers.length - 1));
    const expected = expectedCorrect(rating, a.question.rating);
    rating += step * ((a.correct ? 1 : 0) - expected);
  });
  return Math.round(Math.max(800, Math.min(2400, rating)));
}

export type TrackPlacement = {
  slug: string;
  /** 0–1000, the platform's mastery scale. */
  mastery: number;
  /** How many of the track's units placement considers already covered. */
  cleared: number;
  units: number;
  /** True when the learner answered something from this track directly. */
  probed: boolean;
};

/* Placement alone never certifies a track outright: 820 sits above the
   "unlock" and "complete" thresholds but below "advanced", leaving the top of
   every track to real work. */
const MAX_PLACEMENT_MASTERY = 820;
/* One right or wrong answer inside a track is real evidence about that track,
   worth more than the band estimate but not enough to override it entirely. */
const PROBE_CORRECT = 90;
const PROBE_WRONG = -140;

/* Below this, nothing is cleared anywhere.
 *
 * Some tracks advertise a band starting at 0 — programming basics is 0→900 —
 * and read literally that makes an 820 estimate "91% through the basics". But
 * 800 is the floor of the whole scale: it is where somebody lands who answers
 * everything wrong, and that is not evidence of knowing the first thirteen
 * units of anything. A placement has to demonstrate something before it skips
 * anything. */
const SCALE_FLOOR = 800;
const CLEAR_FLOOR = 900;

export function placeTracks(rating: number, answers: Answer[]): TrackPlacement[] {
  const probes = new Map<string, number>();
  for (const a of answers) {
    // A question only says something about its track when it sits in the range
    // the learner is actually near; a 2200 question they missed says nothing
    // about whether they know the basics of that track.
    const near = Math.abs(a.question.rating - rating) <= 500;
    if (!near) continue;
    probes.set(a.question.track, (probes.get(a.question.track) || 0) + (a.correct ? PROBE_CORRECT : PROBE_WRONG));
  }

  return roadmapCatalog.map((track) => {
    const [rawLo, hi] = bandOf(track.level);
    // Measured from the bottom of the rating scale, not from a band that
    // starts below it.
    const lo = Math.max(rawLo, SCALE_FLOOR);
    const span = Math.max(1, hi - lo);
    const frac = Math.max(0, Math.min(1, (rating - lo) / span));
    const adjusted = Math.max(0, Math.min(MAX_PLACEMENT_MASTERY,
      Math.round(frac * MAX_PLACEMENT_MASTERY + (probes.get(track.slug) || 0))));

    // Clearance follows the adjusted mastery rather than the raw band, so a
    // wrong answer in a track the learner should have known pulls back the
    // units it would otherwise have skipped.
    const share = adjusted / MAX_PLACEMENT_MASTERY;
    const total = track.units.length;
    const cleared = rating < CLEAR_FLOOR ? 0
      : share >= 0.95 ? total
      : Math.floor(share * total);

    return { slug: track.slug, mastery: adjusted, cleared, units: total, probed: probes.has(track.slug) };
  });
}

/** "900 → 1900" as written on the roadmap card. */
export function bandOf(level: string): [number, number] {
  const found = level.match(/(\d+)\D+(\d+)/);
  if (!found) return [800, 2000];
  return [Number(found[1]), Number(found[2])];
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
