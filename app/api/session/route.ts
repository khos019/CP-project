import { apiErrorResponse, requireProfile } from "../../lib/server/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { profile } = await requireProfile(request);
    return Response.json({ profile }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
