/* The level-check question bank, one section of the roadmap at a time.
 *
 * The previous level check asked fourteen questions chosen adaptively along a
 * single rating scale and then guessed each section's progress from that one
 * number. A learner could answer one graphs question and walk away with a
 * placement in trees, strings and geometry they were never asked about. What
 * the result could not do was the thing the roadmap needs: say, per section,
 * "you have shown enough here — this one counts as done, go on to the next".
 *
 * So the bank is now organised by section. Every roadmap section has nine
 * questions in three tiers:
 *
 *   basic — the section's first units: what somebody who has *started* it knows;
 *   core  — the middle: what somebody who can solve its typical problems knows;
 *   deep  — the far end: the traps and techniques that separate "has read about
 *           it" from "has used it in contests".
 *
 * A test run draws two questions from each tier (six per section), preferring
 * ones this learner has not been shown before, so a retake is not the same
 * test with the answers already explained.
 *
 * What makes a question good enough to be in here:
 *
 *   - It tests a decision, not a definition. "Which structure is LIFO" is
 *     recall; "your BFS enqueues a node twice, what did you forget" is the
 *     mistake people actually make.
 *   - Every wrong option is a real belief somebody holds. An option nobody
 *     would pick teaches nothing about the person who did not pick it.
 *   - The explanation teaches the thing, not just the letter. A wrong answer
 *     that goes unexplained is a wasted question.
 */

import { basicsQuestions } from "./placement-q-basics";
import { coreQuestions } from "./placement-q-core";
import { advancedQuestions } from "./placement-q-advanced";

export type Tier = "basic" | "core" | "deep";
export const TIERS: Tier[] = ["basic", "core", "deep"];

export type PlacementQuestion = {
  id: string;
  /** Roadmap slug this question speaks for. */
  track: string;
  tier: Tier;
  /** Problem-rating equivalent, on the same scale as the bank and the duel. */
  rating: number;
  uz: string;
  en: string;
  /** Optional code shown under the question, in a monospace block. */
  code?: string;
  choicesUz: string[];
  /** Omitted when the options are language-neutral (numbers, code, formulas). */
  choicesEn?: string[];
  correct: number;
  whyUz: string;
  whyEn: string;
};

export const placementBank: PlacementQuestion[] = [
  ...basicsQuestions,
  ...coreQuestions,
  ...advancedQuestions,
];

/** How many questions of each tier one run asks per section. */
export const PER_TIER = 2;

/** The six questions a section gets on this run, easiest first. Within a tier,
 *  questions this learner has never been shown come first; ties are broken at
 *  random so two learners — or two attempts — do not see the same six. */
export function sectionQuestions(slug: string, seen: ReadonlySet<string>): PlacementQuestion[] {
  return TIERS.flatMap((tier) => {
    const pool = placementBank.filter((q) => q.track === slug && q.tier === tier);
    const ranked = shuffle(pool).sort((a, b) => Number(seen.has(a.id)) - Number(seen.has(b.id)));
    // Keep the drawn pair in rating order: the easier of the two goes first.
    return ranked.slice(0, PER_TIER).sort((a, b) => a.rating - b.rating);
  });
}

function shuffle<T>(list: T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* The options are also permuted every time a question is shown. Most questions
   were written with the right answer second, which a learner spots within
   about four questions and then stops reading the options. Shuffling at display
   time rather than in the source means it cannot drift back as questions are
   added. */
export type ShownQuestion = {
  question: PlacementQuestion;
  /** Original option indices, in the order they are displayed. */
  order: number[];
  /** Where the correct option ended up. */
  correctAt: number;
};

export function shuffleOptions(question: PlacementQuestion): ShownQuestion {
  const order = shuffle(question.choicesUz.map((_, i) => i));
  return { question, order, correctAt: order.indexOf(question.correct) };
}

/** The options as displayed, in the shuffled order. */
export const shownChoices = (shown: ShownQuestion, lang: "uz" | "en") => {
  const source = lang === "en" && shown.question.choicesEn ? shown.question.choicesEn : shown.question.choicesUz;
  return shown.order.map((i) => source[i]);
};
