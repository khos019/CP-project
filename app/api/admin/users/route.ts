import { requirePermission } from "../../../lib/server/authorization";
import { ApiError, apiErrorResponse, requireProfile, supabaseRequest } from "../../../lib/server/supabase";
import { readJsonObject, requiredString } from "../../../lib/server/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { profile } = await requireProfile(request);
    await requirePermission(profile, "user.view");
    const users = await supabaseRequest(`/rest/v1/profiles?select=id,username,display_name,role,duel_rating,solved_count,suspended_until,created_at&order=created_at.desc&limit=100`, { mode: "service" });
    return Response.json({ users }, { headers: { "cache-control": "no-store" } });
  } catch (error) { return apiErrorResponse(error); }
}

export async function PATCH(request: Request) {
  try {
    const [{ token, profile }, body] = await Promise.all([requireProfile(request), readJsonObject(request, 8_000)]);
    const userId = requiredString(body.userId, "userId", 64);
    const action = requiredString(body.action, "action", 32);
    if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(userId)) throw new ApiError(400, "Invalid userId.", "INVALID_USER_ID");
    if (action === "role") {
      await requirePermission(profile, "user.manage_roles");
      const role = requiredString(body.role, "role", 16);
      if (!(["user", "admin", "owner"] as string[]).includes(role)) throw new ApiError(400, "Invalid role.", "INVALID_ROLE");
      await supabaseRequest("/rest/v1/rpc/set_user_role", { mode: "user", token, method: "POST", body: { p_user: userId, p_role: role } });
    } else if (action === "suspend") {
      await requirePermission(profile, "user.suspend");
      const until = body.until === null ? null : requiredString(body.until, "until", 64);
      if (until && Number.isNaN(new Date(until).getTime())) throw new ApiError(400, "Invalid suspension date.", "INVALID_DATE");
      await supabaseRequest("/rest/v1/rpc/suspend_user", { mode: "user", token, method: "POST", body: { p_user: userId, p_until: until } });
    } else throw new ApiError(400, "Invalid admin action.", "INVALID_ACTION");
    return Response.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch (error) { return apiErrorResponse(error); }
}
