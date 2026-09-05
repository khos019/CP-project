/* The deep lesson body.
 *
 * The original unit content was ten short fields — goal, core, walkthrough,
 * mistakes, recap. That is a summary of a topic, not a lesson: somebody who
 * has never seen the idea cannot learn it from three sentences, and the pages
 * read as notes for a person who already knows the material.
 *
 * A deep lesson is instead an ordered list of sections, each built from
 * blocks: prose, sub-headings, callouts, tables, pictures, a step player that
 * runs an algorithm frame by frame, and code with a line-by-line commentary.
 * It sits between "Asosiy tushuncha" and "Keng tarqalgan xatolar" in the
 * lesson page, so the short fields keep working as the summary they always
 * were and the teaching happens in between.
 *
 * Everything is written twice — Uzbek first, English beside it — because both
 * are real audiences on this site, and a lesson that only half-translates is
 * worse than one that does not translate at all.
 */

import type { Spec } from "./diagram-kit";

/** One annotated span of a code listing: "lines 4–7 do this, and here is why". */
export type CodeNote = { from: number; to?: number; uz: string; en: string };

export type Block =
  /** A paragraph. The workhorse. */
  | { t: "p"; uz: string; en: string }
  /** A sub-heading inside a section (renders as h4). */
  | { t: "h"; uz: string; en: string }
  /** A bullet or numbered list. */
  | { t: "list"; uz: string[]; en: string[]; ordered?: boolean }
  /** A callout: the key idea, a warning, or a practical tip. */
  | { t: "note"; kind: "key" | "warn" | "tip"; uz: string; en: string }
  /** A formula or invariant, set apart from the prose. */
  | { t: "math"; uz: string; en?: string }
  /** A comparison table — complexity, before/after, tool choice. */
  | { t: "table"; headUz: string[]; headEn: string[]; rows: string[][]; captionUz?: string; captionEn?: string }
  /** A plain code listing. */
  | { t: "code"; cpp?: string; python?: string; captionUz?: string; captionEn?: string }
  /** Code plus a numbered commentary keyed to its lines. */
  | { t: "codewalk"; lang?: "cpp" | "python"; code: string; notes: CodeNote[]; captionUz?: string; captionEn?: string }
  /** A single picture. */
  | { t: "diagram"; spec: Spec }
  /** A picture the learner steps through: the algorithm, frame by frame. */
  | { t: "sim"; titleUz: string; titleEn: string; frames: { spec: Spec; uz: string; en: string }[] }
  /* A question the reader answers before reading on, with the answer hidden
     behind a click. Reading an explanation feels like understanding it; trying
     to answer first is what tells you whether you actually do. */
  | { t: "exercise"; qUz: string; qEn: string; aUz: string; aEn: string };

export type DeepSection = { titleUz: string; titleEn: string; blocks: Block[] };
export type DeepLesson = { sections: DeepSection[] };

import { programmingBasicsLessons } from "./lessons/programming-basics";
import { foundationsLessons } from "./lessons/foundations";
import { sortingLessons } from "./lessons/sorting";
import { backtrackingLessons } from "./lessons/backtracking";
import { mathLessons } from "./lessons/math";

/* One module per roadmap, merged here. Keeping them apart matters: a single
   file holding every deep lesson would be tens of thousands of lines, and the
   section being written is the only one anybody edits at a time. */
export const deepLessons: Record<string, DeepLesson> = {
  ...programmingBasicsLessons,
  ...foundationsLessons,
  ...sortingLessons,
  ...backtrackingLessons,
  ...mathLessons,
};

export const deepLessonFor = (unitId: string): DeepLesson | undefined => deepLessons[unitId];
