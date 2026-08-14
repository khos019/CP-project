import { requirePermission } from "../../lib/server/authorization";
import { ApiError, apiErrorResponse, requireProfile, supabaseRequest } from "../../lib/server/supabase";

export const dynamic = "force-dynamic";

type Submission = { id: string; user_id: string; problem_key: string | null; language: string; source_code?: string; status: string; runtime_ms: number | null; memory_kb: number | null; context: string; created_at: string };

export async function GET(request: Request) {
  try {
    const { profile } = await requireProfile(request);
    const params = new URL(request.url).searchParams;
    const scope = params.get("scope") === "all" ? "all" : "mine";
    const includeSource = params.get("includeSource") === "1";
    if (scope === "all") await requirePermission(profile, "submission.view_all");
    if (scope === "all" && includeSource) await requirePermission(profile, "submission.view_source");
    const requestedLimit = Number(params.get("limit") || 50);
    if (!Number.isInteger(requestedLimit) || requestedLimit < 1) throw new ApiError(400, "Invalid limit.", "INVALID_LIMIT");
    const limit = Math.min(requestedLimit, 100);
    const columns = ["id", "user_id", "problem_key", "language", "status", "runtime_ms", "memory_kb", "context", "created_at", ...(includeSource ? ["source_code"] : [])].join(",");
    const ownerFilter = scope === "mine" ? `user_id=eq.${encodeURIComponent(profile.id)}&` : "";
    const submissions = await supabaseRequest<Submission[]>(`/rest/v1/submissions?${ownerFilter}select=${columns}&order=created_at.desc&limit=${limit}`, { mode: "service" });
    return Response.json({ submissions }, { headers: { "cache-control": "no-store" } });
  } catch (error) { return apiErrorResponse(error); }
}
