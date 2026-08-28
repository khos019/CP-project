"use client";

// Codeforces-style problem ratings and an Elo-shaped solving rating.
//
// This is deliberately NOT the Global Duel Rating. neeed.md section 6 says one
// rating must not stand for everything and the existing duel algorithm must be
// preserved, so this is a third, separate number:
//
//   Duel rating   — competitive, changes on win/loss (untouched)
//   Topic mastery — evidence of understanding a topic (untouched)
//   Algo rating   — how hard a problem you can solve on your own (this file)
//
// Every problem carries a difficulty rating on the familiar 800-3500 scale.
// Solving one moves your Algo rating toward it: beating a problem far above
// you is worth a lot, clearing an easy one you have long outgrown is worth
// almost nothing, and a problem you fail costs you nothing at all — practice
// should never punish curiosity (section 12).

import { readScoped, writeScoped } from "./session";

export type Rank = {
  min: number; nameUz: string; nameEn: string; color: string;
};

// Familiar competitive-programming tiers, with our own palette tuned for the
// dark theme rather than lifting another site's exact colours.
export const RANKS: Rank[] = [
  { min: 0,    nameUz: "Yangi boshlovchi", nameEn: "Newbie",              color: "#9aa5a0" },
  { min: 1200, nameUz: "Shogird",          nameEn: "Pupil",               color: "#6fd17a" },
  { min: 1400, nameUz: "Mutaxassis",       nameEn: "Specialist",          color: "#4fd4c4" },
  { min: 1600, nameUz: "Ekspert",          nameEn: "Expert",              color: "#6f9bff" },
  { min: 1900, nameUz: "Nomzod usta",      nameEn: "Candidate Master",    color: "#c07bff" },
  { min: 2100, nameUz: "Usta",             nameEn: "Master",              color: "#ffb347" },
  { min: 2300, nameUz: "Xalqaro usta",     nameEn: "International Master",color: "#ff9147" },
  { min: 2400, nameUz: "Grandmaster",      nameEn: "Grandmaster",         color: "#ff5f5f" },
  { min: 2900, nameUz: "Afsonaviy",        nameEn: "Legendary Grandmaster", color: "#ff2d2d" },
];

export const rankOf = (rating: number): Rank =>
  [...RANKS].reverse().find(r => rating >= r.min) || RANKS[0];

export const rankName = (rating: number, lang: "uz" | "en") =>
  lang === "uz" ? rankOf(rating).nameUz : rankOf(rating).nameEn;

export const ratingColor = (rating: number) => rankOf(rating).color;

const KEY = "algoyol-algo-rating";
export const START_RATING = 800;

export function algoRating(): number {
  try {
    const raw = Number(readScoped(KEY));
    return Number.isFinite(raw) && raw > 0 ? raw : START_RATING;
  } catch { return START_RATING; }
}

function setAlgoRating(value: number) {
  try { writeScoped(KEY, String(Math.max(0, Math.round(value)))); } catch {}
}

/**
 * Expected score in the Elo sense: the chance a solver of `user` strength
 * clears a problem rated `problem`.
 */
export function expectedScore(user: number, problem: number): number {
  return 1 / (1 + Math.pow(10, (problem - user) / 400));
}

/**
 * Rating gained for a first solve. K shrinks as you climb, so early progress
 * is quick and later progress has to be earned.
 */
export function solveDelta(user: number, problem: number): number {
  const k = user < 1400 ? 40 : user < 1900 ? 32 : user < 2300 ? 24 : 16;
  const gain = k * (1 - expectedScore(user, problem));
  // A problem well below you is worth a token amount, never zero, never much.
  return Math.max(1, Math.round(gain));
}

const solvedKey = "algoyol-rated-solves";
function ratedSolves(): string[] {
  try { return JSON.parse(readScoped(solvedKey) || "[]"); } catch { return []; }
}

/**
 * Applies a first-solve rating gain. Re-solving the same problem pays nothing,
 * so rating cannot be farmed by resubmitting (section 12).
 */
export function applySolve(problemId: string, problemRating: number): { delta: number; before: number; after: number } {
  const before = algoRating();
  const already = ratedSolves();
  if (already.includes(problemId)) return { delta: 0, before, after: before };
  const delta = solveDelta(before, problemRating);
  const after = before + delta;
  setAlgoRating(after);
  try { writeScoped(solvedKey, JSON.stringify([...already, problemId])); } catch {}
  return { delta, before, after };
}

export const hasRatedSolve = (problemId: string) => ratedSolves().includes(problemId);
export const solvedCount = () => ratedSolves().length;

/** Difficulty band label for a problem, used to colour its rating chip. */
export function difficultyOf(rating: number): "easy" | "medium" | "hard" {
  return rating < 1200 ? "easy" : rating < 1800 ? "medium" : "hard";
}
