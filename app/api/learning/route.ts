import { apiErrorResponse, requireProfile, supabaseRequest } from "../../lib/server/supabase";
import { normalizeMasteryConfig } from "../../lib/server/mastery-config";

export const dynamic = "force-dynamic";

type MasteryRow = {
  topic_slug: string;
  score: number;
  evidence_count: number;
  unlocked_at: string | null;
  validated_at: string | null;
};

type LearningRow = {
  unit_key: string;
  topic_slug: string;
  quiz_score: number | null;
  quiz_passed_at: string | null;
  problem_accepted_at: string | null;
  completed_at: string | null;
};

type MasteryEventRow = {
  id: string;
  topic_slug: string;
  source: string;
  source_key: string;
  delta: number;
  created_at: string;
};

type UnlockRow = { topic_slug: string; source: string; unlocked_at: string };
type SettingRow = { key: string; value: unknown };

export async function GET(request: Request) {
  try {
    const { token } = await requireProfile(request);
    const [masteryRows, learningRows, eventRows, unlockRows, settingRows] = await Promise.all([
      supabaseRequest<MasteryRow[]>(
        "/rest/v1/user_topic_mastery?select=topic_slug,score,evidence_count,unlocked_at,validated_at&order=updated_at.desc",
        { mode: "user", token },
      ),
      supabaseRequest<LearningRow[]>(
        "/rest/v1/user_learning_state?select=unit_key,topic_slug,quiz_score,quiz_passed_at,problem_accepted_at,completed_at",
        { mode: "user", token },
      ),
      supabaseRequest<MasteryEventRow[]>(
        "/rest/v1/mastery_events?select=id,topic_slug,source,source_key,delta,created_at&order=created_at.desc&limit=40",
        { mode: "user", token },
      ),
      supabaseRequest<UnlockRow[]>(
        "/rest/v1/roadmap_unlocks?select=topic_slug,source,unlocked_at",
        { mode: "user", token },
      ),
      supabaseRequest<SettingRow[]>(
        "/rest/v1/platform_settings?select=key,value&key=in.(mastery,duel)",
        { mode: "user", token },
      ),
    ]);

    const quizScores: Record<string, number> = {};
    const solved: Record<string, boolean> = {};
    for (const row of learningRows) {
      if (row.quiz_score !== null) quizScores[row.unit_key] = row.quiz_score;
      if (row.problem_accepted_at) solved[row.unit_key] = true;
    }

    const scores: Record<string, number> = {};
    const evidence: Record<string, number> = {};
    const validated: Record<string, boolean> = {};
    for (const row of masteryRows) {
      scores[row.topic_slug] = row.score;
      evidence[row.topic_slug] = row.evidence_count;
      if (row.validated_at) validated[row.topic_slug] = true;
    }

    const unlocks: Record<string, boolean> = {};
    for (const row of unlockRows) unlocks[row.topic_slug] = true;

    const settings = Object.fromEntries(settingRows.map((row) => [row.key, row.value]));
    settings.mastery = normalizeMasteryConfig(settings.mastery);
    return Response.json({
      progress: { quizScores, solved },
      mastery: { scores, evidence, unlocks, validated },
      events: eventRows.map((event) => ({
        id: event.id,
        topic: event.topic_slug,
        source: event.source,
        sourceKey: event.source_key,
        delta: event.delta,
        at: event.created_at,
      })),
      settings,
    }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
