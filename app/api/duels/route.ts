import { ApiError, apiErrorResponse, enforceRateLimit, hasServiceRoleConfig, requireProfile, supabaseRequest } from "../../lib/server/supabase";
import { optionalUuid } from "../../lib/server/validation";

export const dynamic = "force-dynamic";

type ParticipantRow = { user_id: string; score: number; rating_before: number; rating_after: number | null };
type DuelRow = { id: string; status: "waiting" | "active" | "finished" | "cancelled"; started_at: string | null; ends_at: string | null; finished_at: string | null; current_stage: number };
type ProblemRow = { stage: number; problem_key: "sum-two" | "max-subarray" | "coin-change"; points: number; claimed_by: string | null; claimed_at: string | null };
type ProfileRow = { id: string; username: string; display_name: string; avatar_url: string | null };

async function duelSnapshot(userId: string, requestedId?: string | null) {
  if (!hasServiceRoleConfig()) throw new ApiError(503, "Duel persistence is not configured.", "DUEL_NOT_CONFIGURED");
  let duelId = requestedId || null;
  if (duelId) {
    const membership = await supabaseRequest<Array<{ duel_id: string }>>(`/rest/v1/duel_participants?duel_id=eq.${encodeURIComponent(duelId)}&user_id=eq.${encodeURIComponent(userId)}&select=duel_id&limit=1`, { mode: "service" });
    if (!membership.length) throw new ApiError(403, "You are not a participant in this duel.", "DUEL_FORBIDDEN");
  } else {
    const memberships = await supabaseRequest<Array<{ duel_id: string; duels: DuelRow | null }>>(`/rest/v1/duel_participants?user_id=eq.${encodeURIComponent(userId)}&select=duel_id,duels!inner(id,status,started_at,ends_at,finished_at,current_stage)&duels.status=in.(active,waiting)&order=duel_id.desc&limit=1`, { mode: "service" });
    duelId = memberships[0]?.duel_id || null;
  }
  if (!duelId) {
    const queued = await supabaseRequest<Array<{ user_id: string }>>(`/rest/v1/matchmaking_entries?user_id=eq.${encodeURIComponent(userId)}&select=user_id&limit=1`, { mode: "service" });
    return { status: queued.length ? "queued" : "idle" };
  }

  let duels = await supabaseRequest<DuelRow[]>(`/rest/v1/duels?id=eq.${encodeURIComponent(duelId)}&select=id,status,started_at,ends_at,finished_at,current_stage&limit=1`, { mode: "service" });
  if (!duels[0]) throw new ApiError(404, "Duel not found.", "DUEL_NOT_FOUND");
  if (duels[0].status === "active" && duels[0].ends_at && new Date(duels[0].ends_at).getTime() <= Date.now()) {
    await supabaseRequest("/rest/v1/rpc/finalize_duel", { mode: "service", method: "POST", body: { p_duel: duelId } });
    duels = await supabaseRequest<DuelRow[]>(`/rest/v1/duels?id=eq.${encodeURIComponent(duelId)}&select=id,status,started_at,ends_at,finished_at,current_stage&limit=1`, { mode: "service" });
  }
  const duel = duels[0];
  const [participants, problems] = await Promise.all([
    supabaseRequest<ParticipantRow[]>(`/rest/v1/duel_participants?duel_id=eq.${encodeURIComponent(duelId)}&select=user_id,score,rating_before,rating_after&order=user_id`, { mode: "service" }),
    supabaseRequest<ProblemRow[]>(`/rest/v1/duel_problems?duel_id=eq.${encodeURIComponent(duelId)}&stage=lte.${Math.min(duel.current_stage, 2)}&select=stage,problem_key,points,claimed_by,claimed_at&order=stage`, { mode: "service" }),
  ]);
  const ids = participants.map((row) => row.user_id);
  const profiles = ids.length ? await supabaseRequest<ProfileRow[]>(`/rest/v1/profiles?id=in.(${ids.join(",")})&select=id,username,display_name,avatar_url`, { mode: "service" }) : [];
  const profileById = new Map(profiles.map((row) => [row.id, row]));
  return {
    status: duel.status,
    duel: {
      id: duel.id,
      startedAt: duel.started_at,
      endsAt: duel.ends_at,
      finishedAt: duel.finished_at,
      currentStage: duel.current_stage,
      problems,
      participants: participants.map((row) => ({ ...row, profile: profileById.get(row.user_id) || null })),
    },
  };
}

export async function GET(request: Request) {
  try {
    const { profile } = await requireProfile(request);
    const requestedId = optionalUuid(new URL(request.url).searchParams.get("duelId"), "duelId");
    return Response.json(await duelSnapshot(profile.id, requestedId), { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { token, profile } = await requireProfile(request);
    if (!hasServiceRoleConfig()) throw new ApiError(503, "Duel persistence is not configured.", "DUEL_NOT_CONFIGURED");
    await enforceRateLimit(`duel-queue:${profile.id}`, 10, 60);
    const result = await supabaseRequest<{ status?: string; duelId?: string }>("/rest/v1/rpc/join_duel_queue", { mode: "user", token, method: "POST", body: {} });
    return Response.json(result.duelId ? await duelSnapshot(profile.id, result.duelId) : { status: result.status || "queued" }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { token } = await requireProfile(request);
    await supabaseRequest("/rest/v1/rpc/leave_duel_queue", { mode: "user", token, method: "POST", body: {} });
    return Response.json({ status: "idle" }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
