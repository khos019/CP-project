export type MasterySource = "lesson" | "quiz" | "problem" | "duel" | "placement" | "challenge" | "migration";
export type MasteryStore = {
  scores: Record<string, number>;
  evidence: Record<string, number>;
  unlocks: Record<string, boolean>;
  validated: Record<string, boolean>;
};
export type MasteryEvent = {
  id: string;
  topic: string;
  source: MasterySource;
  sourceKey: string;
  delta: number;
  at: string;
};
export type MasteryConfig = {
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

export const EMPTY_MASTERY: MasteryStore = { scores: {}, evidence: {}, unlocks: {}, validated: {} };

export const DEFAULT_MASTERY_CONFIG: MasteryConfig = {
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

export const MASTERY_CONFIG = DEFAULT_MASTERY_CONFIG;

export function masteryLabel(score: number, lang: "uz" | "en", config = DEFAULT_MASTERY_CONFIG) {
  if (score >= config.advanced) return lang === "uz" ? "Ilg‘or mahorat" : "Advanced mastery";
  if (score >= config.complete) return lang === "uz" ? "Kuchli" : "Strong";
  if (score >= 600) return lang === "uz" ? "Malakali" : "Competent";
  if (score >= 400) return lang === "uz" ? "Amaliy bilim" : "Working knowledge";
  if (score >= 200) return lang === "uz" ? "Boshlang‘ich tanishuv" : "Basic familiarity";
  return lang === "uz" ? "Boshlanmagan" : "Not started";
}
