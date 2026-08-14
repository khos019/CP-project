import { roadmapAnswerKey } from "./roadmap-answer-key";

// Correct answers stay in server-only modules so the browser bundle cannot reveal them.
export function correctRoadmapAnswer(unitId: string) {
  return roadmapAnswerKey[unitId] ?? -1;
}
