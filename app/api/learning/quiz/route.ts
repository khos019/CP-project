import { roadmapCatalog } from "../../../ui/roadmap-data";
import { apiErrorResponse, ApiError, enforceRateLimit, requireProfile, supabaseRequest } from "../../../lib/server/supabase";
import { getMasteryConfig } from "../../../lib/server/mastery-config";
import { readJsonObject } from "../../../lib/server/validation";
import { correctRoadmapAnswer } from "../../../lib/server/quiz-answers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const [{ profile }, body] = await Promise.all([requireProfile(request), readJsonObject(request, 8_000)]);
    const unitId = typeof body.unitId === "string" ? body.unitId : "";
    const answer = typeof body.answer === "number" && Number.isInteger(body.answer) ? body.answer : -1;
    const roadmap = roadmapCatalog.find((item) => item.units.some((unit) => unit.id === unitId));
    const unit = roadmap?.units.find((item) => item.id === unitId);
    if (!roadmap || !unit || answer < 0 || answer >= unit.quiz.choicesUz.length) {
      throw new ApiError(400, "Invalid quiz response.", "INVALID_QUIZ_RESPONSE");
    }

    await enforceRateLimit(`quiz:${profile.id}`, 30, 60);
    const score = answer === correctRoadmapAnswer(unit.id) ? 100 : 0;
    const masteryConfig = await getMasteryConfig();
    const result = await supabaseRequest<Record<string, unknown>>("/rest/v1/rpc/record_quiz_result", {
      mode: "service",
      method: "POST",
      body: {
        p_user: profile.id,
        p_unit_key: unit.id,
        p_topic_slug: roadmap.slug,
        p_score: score,
        p_mastery_delta: masteryConfig.weights.quiz,
      },
    });

    return Response.json({ correct: score === 100, score, mastery: result }, {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
