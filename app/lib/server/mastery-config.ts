import { supabaseRequest } from "./supabase";

export type ServerMasteryConfig = {
  unlock: number;
  complete: number;
  advanced: number;
  weights: {
    quiz: number;
    lesson: number;
    problem: { easy: number; medium: number; hard: number };
    duelMultiplier: number;
    placementQuestion: number;
    placementCoding: { easy: number; medium: number; hard: number };
    challenge: number;
  };
};

export const SERVER_MASTERY_DEFAULTS: ServerMasteryConfig = {
  unlock: 450,
  complete: 700,
  advanced: 850,
  weights: {
    quiz: 40,
    lesson: 60,
    problem: { easy: 20, medium: 35, hard: 50 },
    duelMultiplier: 1.5,
    placementQuestion: 70,
    placementCoding: { easy: 100, medium: 150, hard: 200 },
    challenge: 520,
  },
};

const finiteInteger = (value: unknown, fallback: number, min = 0, max = 1000) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
};

export function normalizeMasteryConfig(value: unknown): ServerMasteryConfig {
  const raw = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const weights = raw.weights && typeof raw.weights === "object" && !Array.isArray(raw.weights) ? raw.weights as Record<string, unknown> : {};
  const problem = weights.problem && typeof weights.problem === "object" && !Array.isArray(weights.problem) ? weights.problem as Record<string, unknown> : {};
  const placementCoding = weights.placementCoding && typeof weights.placementCoding === "object" && !Array.isArray(weights.placementCoding) ? weights.placementCoding as Record<string, unknown> : {};
  const unlock = finiteInteger(raw.unlock, SERVER_MASTERY_DEFAULTS.unlock);
  const complete = finiteInteger(raw.complete, SERVER_MASTERY_DEFAULTS.complete, unlock);
  const advanced = finiteInteger(raw.advanced, SERVER_MASTERY_DEFAULTS.advanced, complete);
  const multiplier = Number(weights.duelMultiplier);
  return {
    unlock,
    complete,
    advanced,
    weights: {
      quiz: finiteInteger(weights.quiz, SERVER_MASTERY_DEFAULTS.weights.quiz, 0, 300),
      lesson: finiteInteger(weights.lesson, SERVER_MASTERY_DEFAULTS.weights.lesson, 0, 300),
      problem: {
        easy: finiteInteger(problem.easy, SERVER_MASTERY_DEFAULTS.weights.problem.easy, 0, 300),
        medium: finiteInteger(problem.medium, SERVER_MASTERY_DEFAULTS.weights.problem.medium, 0, 300),
        hard: finiteInteger(problem.hard, SERVER_MASTERY_DEFAULTS.weights.problem.hard, 0, 300),
      },
      duelMultiplier: Number.isFinite(multiplier) && multiplier >= 0 && multiplier <= 3 ? multiplier : SERVER_MASTERY_DEFAULTS.weights.duelMultiplier,
      placementQuestion: finiteInteger(weights.placementQuestion, SERVER_MASTERY_DEFAULTS.weights.placementQuestion, 0, 300),
      placementCoding: {
        easy: finiteInteger(placementCoding.easy, SERVER_MASTERY_DEFAULTS.weights.placementCoding.easy, 0, 300),
        medium: finiteInteger(placementCoding.medium, SERVER_MASTERY_DEFAULTS.weights.placementCoding.medium, 0, 300),
        hard: finiteInteger(placementCoding.hard, SERVER_MASTERY_DEFAULTS.weights.placementCoding.hard, 0, 300),
      },
      challenge: finiteInteger(weights.challenge, SERVER_MASTERY_DEFAULTS.weights.challenge, 0, 1000),
    },
  };
}

export async function getMasteryConfig() {
  const rows = await supabaseRequest<Array<{ value: unknown }>>("/rest/v1/platform_settings?key=eq.mastery&select=value&limit=1", { mode: "service" });
  return normalizeMasteryConfig(rows[0]?.value);
}
