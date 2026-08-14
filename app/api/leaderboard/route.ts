import { apiErrorResponse, supabaseRequest } from "../../lib/server/supabase";

export const dynamic = "force-dynamic";

type LeaderRow = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  duel_rating: number;
  peak_duel_rating: number;
  solved_count: number;
};

export async function GET() {
  try {
    const leaders = await supabaseRequest<LeaderRow[]>(
      "/rest/v1/profiles?select=id,username,display_name,avatar_url,duel_rating,peak_duel_rating,solved_count&order=duel_rating.desc,solved_count.desc&limit=100",
      { mode: "service" },
    );
    return Response.json({ leaders }, {
      headers: { "cache-control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
