import { requirePermission } from "../../../lib/server/authorization";
import { ApiError, apiErrorResponse, requireProfile, supabaseRequest } from "../../../lib/server/supabase";
import { readJsonObject, requiredString } from "../../../lib/server/validation";
import { normalizeMasteryConfig } from "../../../lib/server/mastery-config";

export const dynamic = "force-dynamic";

function validatedSetting(key: string, raw: Record<string, unknown>) {
  if (key === "mastery") {
    const unlock = Number(raw.unlock), complete = Number(raw.complete), advanced = Number(raw.advanced);
    if (![unlock, complete, advanced].every(Number.isInteger) || unlock < 0 || advanced > 1000 || !(unlock <= complete && complete <= advanced) || !raw.weights || typeof raw.weights !== "object" || Array.isArray(raw.weights)) {
      throw new ApiError(400, "Mastery thresholds or weights are invalid.", "INVALID_SETTING");
    }
    return normalizeMasteryConfig({ ...raw, unlock, complete, advanced });
  }
  const durationSeconds = Number(raw.durationSeconds), problemCount = Number(raw.problemCount), ratingK = Number(raw.ratingK);
  if (!Number.isInteger(durationSeconds) || durationSeconds < 60 || durationSeconds > 7200 || !Number.isInteger(problemCount) || problemCount < 1 || problemCount > 10 || !Number.isInteger(ratingK) || ratingK < 1 || ratingK > 64 || typeof raw.enabled !== "boolean") {
    throw new ApiError(400, "Duel settings are invalid.", "INVALID_SETTING");
  }
  return { ...raw, durationSeconds, problemCount, ratingK, enabled: raw.enabled };
}

export async function GET(request: Request) {
  try {
    const { profile } = await requireProfile(request);
    await requirePermission(profile, "settings.manage");
    const settings = await supabaseRequest(`/rest/v1/platform_settings?select=key,value,updated_at,updated_by&order=key`, { mode: "service" });
    return Response.json({ settings }, { headers: { "cache-control": "no-store" } });
  } catch (error) { return apiErrorResponse(error); }
}

export async function PATCH(request: Request) {
  try {
    const [{ token, profile }, body] = await Promise.all([requireProfile(request), readJsonObject(request, 12_000)]);
    await requirePermission(profile, "settings.manage");
    const key = requiredString(body.key, "key", 32);
    if (!(["mastery", "duel"] as string[]).includes(key) || !body.value || typeof body.value !== "object" || Array.isArray(body.value)) throw new ApiError(400, "Invalid setting.", "INVALID_SETTING");
    const value = validatedSetting(key, body.value as Record<string, unknown>);
    await supabaseRequest("/rest/v1/rpc/update_platform_setting", { mode: "user", token, method: "POST", body: { p_key: key, p_value: value } });
    return Response.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch (error) { return apiErrorResponse(error); }
}
