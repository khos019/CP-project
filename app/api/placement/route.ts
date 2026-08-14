import { roadmapCatalog } from "../../ui/roadmap-data";
import { ApiError, apiErrorResponse, enforceRateLimit, hasServiceRoleConfig, requireProfile, supabaseRequest } from "../../lib/server/supabase";
import { placementAnswerKey, placementQuestions } from "../../lib/server/placement";
import { readJsonObject } from "../../lib/server/validation";
import { getMasteryConfig } from "../../lib/server/mastery-config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { profile } = await requireProfile(request);
    if (profile.onboarding_completed_at) return Response.json({ completed: true }, { headers: { "cache-control": "no-store" } });
    return Response.json({ completed: false, questions: placementQuestions }, { headers: { "cache-control": "no-store" } });
  } catch (error) { return apiErrorResponse(error); }
}

export async function POST(request: Request) {
  try {
    const [{ profile }, body] = await Promise.all([requireProfile(request), readJsonObject(request, 20_000)]);
    if (!hasServiceRoleConfig()) throw new ApiError(503, "Placement persistence is not configured.", "PLACEMENT_NOT_CONFIGURED");
    if (profile.onboarding_completed_at) throw new ApiError(409, "Placement has already been completed.", "PLACEMENT_ALREADY_COMPLETED");
    await enforceRateLimit(`placement:${profile.id}`, 5, 3600);
    const answers = body.answers && typeof body.answers === "object" && !Array.isArray(body.answers) ? body.answers as Record<string, unknown> : {};
    const background = body.background && typeof body.background === "object" && !Array.isArray(body.background) ? body.background as Record<string, unknown> : {};
    const masteryConfig = await getMasteryConfig();
    const mastery: Record<string, number> = {};
    for (const question of placementQuestions) {
      const answer = answers[question.id];
      if (answer !== undefined && (!Number.isInteger(answer) || Number(answer) < 0 || Number(answer) >= question.choicesUz.length)) throw new ApiError(400, "Invalid placement answer.", "INVALID_PLACEMENT_ANSWER");
      if (answer === placementAnswerKey[question.id]) mastery[question.topic] = Math.min(300, (mastery[question.topic] || 0) + masteryConfig.weights.placementQuestion);
    }
    const codingRows = await supabaseRequest<Array<{ problem_key: string }>>(`/rest/v1/submissions?user_id=eq.${encodeURIComponent(profile.id)}&context=eq.placement&status=eq.accepted&select=problem_key`, { mode: "service" });
    const codingResults = [...new Set(codingRows.map((row) => row.problem_key).filter(Boolean))];
    const codingEvidence: Record<string, { topic: string; difficulty: "easy" | "medium" | "hard" }> = {
      "sum-two": { topic: "programming-basics", difficulty: "easy" },
      "max-subarray": { topic: "foundations", difficulty: "medium" },
      "coin-change": { topic: "dynamic-programming", difficulty: "hard" },
    };
    for (const problemKey of codingResults) {
      const evidence = codingEvidence[problemKey];
      if (evidence) mastery[evidence.topic] = Math.min(300, (mastery[evidence.topic] || 0) + masteryConfig.weights.placementCoding[evidence.difficulty]);
    }
    const order = roadmapCatalog.map((roadmap) => roadmap.slug);
    const recommended = [...order].reverse().find((slug) => (mastery[slug] || 0) >= 70) || "programming-basics";
    const attemptId = await supabaseRequest<string>("/rest/v1/rpc/complete_placement", { mode: "service", method: "POST", body: { p_user: profile.id, p_answers: { background, answers }, p_coding_results: codingResults, p_mastery: mastery, p_recommended: recommended } });
    return Response.json({ attemptId, mastery, recommended, codingResults }, { headers: { "cache-control": "no-store" } });
  } catch (error) { return apiErrorResponse(error); }
}
