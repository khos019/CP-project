import { NextResponse } from "next/server";

/* The duel API.
 *
 * One route rather than eight, because there is nothing REST-shaped here: each
 * action is exactly one database function, and giving them one door means one
 * place where the caller's token is read and one place where events are sent.
 *
 * What this file is allowed to do:
 *   - forward the learner's JWT to a duel_* function, so auth.uid() is them
 *   - carry out an instruction the database already returned (start a bot duel,
 *     cancel the challenges an accept just orphaned)
 *   - announce what happened over realtime
 *
 * What it must never do: decide. Not who is eligible, not whether five seconds
 * have passed, not who won. Every one of those lives in migration 016, because
 * a decision made here is a decision made in a process that a determined client
 * can talk to directly.
 */

import { bearerFrom, rpcAsUser, rpcAsService } from "../_lib/supabase";
import { broadcast, toUser, toMatch } from "../_lib/broadcast";
import { judgeSource, languageIds, isJudgeableProblem, type Language } from "../_lib/judge";
// Titles only — so a duel solve lands in the submission history reading
// "Massivni teskari o'girish" rather than "array-reverse". The problem's own
// identity still comes from the duel row, never from the request.
import { bankProblems } from "../../ui/problem-bank";
import { solutions, hasSolution } from "../_lib/solutions";
import { planDuel, botConfigFrom, type BotPlan } from "../_lib/bot";

const titleFor = (key: string) => bankProblems.find((p) => p.judge === key)?.uz || key;
const bankFor = (key: string) => bankProblems.find((p) => p.judge === key);

type Json = Record<string, unknown>;
type Action =
  | "state" | "result" | "heartbeat" | "search" | "tick" | "accept" | "decline"
  | "cancel" | "bot" | "bot_step" | "submit" | "forfeit";

const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

/* The database hands back the ids it just touched; this turns them into
   messages. Kept separate from the calls above so a failed broadcast can never
   roll back something that already committed. */
const asString = (value: unknown) => (typeof value === "string" ? value : "");

export async function POST(request: Request) {
  const token = bearerFrom(request);
  if (!token) return bad("not_authenticated", 401);

  let body: { action?: Action; [key: string]: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return bad("invalid_body");
  }
  const action = body.action;
  if (!action) return bad("missing_action");

  switch (action) {
    // ---------------------------------------------------------------- reads
    case "state": {
      const result = await rpcAsUser<Json>(token, "duel_state");
      return result.ok ? NextResponse.json(result.data) : bad(result.error, result.status);
    }

    case "result": {
      // The duel that just ended. Separate from `state` because finishing a
      // duel is what stops it being the duel you are in.
      const result = await rpcAsUser<Json>(token, "duel_recent_result");
      return result.ok ? NextResponse.json(result.data) : bad(result.error, result.status);
    }

    case "heartbeat": {
      const ready = body.ready !== false;
      const result = await rpcAsUser<Json>(token, "duel_heartbeat", { p_ready: ready });
      return result.ok ? NextResponse.json(result.data) : bad(result.error, result.status);
    }

    // ------------------------------------------------------------ searching
    case "search": {
      const result = await rpcAsUser<Json>(token, "duel_start_search");
      if (!result.ok) return bad(result.error, result.status);
      const data = result.data;
      if (data.ok && !data.resumed) {
        const state = data.state as Json | undefined;
        const session = (state?.session || {}) as Json;
        await broadcast([toUser(asString(await callerId(token)), "matchmaking_started", {
          session_id: data.session_id, rating: data.rating, started_at: session.created_at,
        })]);
      }
      return NextResponse.json(data);
    }

    case "tick": {
      const result = await rpcAsUser<Json>(token, "duel_tick");
      if (!result.ok) return bad(result.error, result.status);
      const data = result.data;

      // "Players online: 7" on the searching screen. Counted with the same
      // presence window and exclusions the matchmaker itself uses, so the
      // number cannot claim opponents the search would not consider.
      const available = await rpcAsUser<number>(token, "duel_available_count");
      if (available.ok) data.available = available.data;

      // Challenges the tick just created. Each recipient is told directly;
      // the payload carries only what the card renders, and the receiver
      // confirms it against duel_state() before acting on it.
      const created = Array.isArray(data.challenges) ? (data.challenges as Json[]) : [];
      if (created.length) {
        const me = await callerProfile(token);
        await broadcast(created.map((c) => toUser(asString(c.receiver_id), "duel_challenge_received", {
          challenge_id: c.challenge_id,
          from: me,
          // The server's deadline, not a number computed here — the countdown
          // the learner watches has to be the one the accept is measured on.
          expires_at: c.expires_at,
        })));
      }

      // Two people were already searching and the database put them together
      // without a card — there was nothing to accept, both had said yes.
      if (data.paired === true) {
        const duelId = asString(data.duel_id);
        const me = asString(await callerId(token));
        const opponent = asString(data.opponent_id);
        await broadcast([
          toUser(me, "match_found", { duel_id: duelId, opponent_id: opponent, is_bot: false }),
          ...(opponent ? [toUser(opponent, "match_found", { duel_id: duelId, opponent_id: me, is_bot: false })] : []),
          toMatch(duelId, "duel_started", { duel_id: duelId }),
        ]);
        return NextResponse.json(data);
      }

      // The database decided the human window has closed. It re-checks the
      // elapsed time itself, so asking early achieves nothing.
      if (data.bot_fallback_due === true) {
        const bot = await rpcAsUser<Json>(token, "duel_start_bot_match");
        if (bot.ok && bot.data.ok) {
          const duelId = asString(bot.data.duel_id);
          await givePlan(duelId, Number(bot.data.bot_rating) || 1200);
          const fresh = await rpcAsUser<Json>(token, "duel_state");
          await broadcast([
            toUser(asString(await callerId(token)), "match_found", { duel_id: duelId, is_bot: true }),
            toMatch(duelId, "duel_started", { duel_id: duelId }),
          ]);
          return NextResponse.json({ ...data, bot_match: bot.data, state: fresh.ok ? fresh.data : data.state });
        }
      }
      return NextResponse.json(data);
    }

    case "cancel": {
      const result = await rpcAsUser<Json>(token, "duel_cancel_search");
      if (!result.ok) return bad(result.error, result.status);
      // Anyone still holding a card for this search should see it go, rather
      // than count down five seconds for an opponent who has already left.
      const dropped = Array.isArray(result.data.cancelled) ? (result.data.cancelled as Json[]) : [];
      if (dropped.length) {
        await broadcast(dropped.map((c) => toUser(asString(c.receiver_id), "duel_challenge_cancelled", {
          challenge_id: c.challenge_id, reason: "cancelled",
        })));
      }
      return NextResponse.json(result.data);
    }

    // ----------------------------------------------------------- challenges
    case "accept": {
      const challengeId = asString(body.challenge_id);
      if (!challengeId) return bad("missing_challenge_id");

      const result = await rpcAsUser<Json>(token, "duel_accept_challenge", { p_challenge: challengeId });
      if (!result.ok) return bad(result.error, result.status);
      const data = result.data;
      // A refusal is a normal answer, not an error: "already_taken" and
      // "expired" are exactly what the losing client needs to render.
      if (!data.ok) return NextResponse.json(data);

      const duelId = asString(data.duel_id);
      const me = asString(await callerId(token));
      const opponent = asString(data.opponent_id);
      const losers = Array.isArray(data.cancelled) ? (data.cancelled as Json[]) : [];

      await broadcast([
        toUser(me, "match_found", { duel_id: duelId, opponent_id: opponent, is_bot: false }),
        toUser(opponent, "match_found", { duel_id: duelId, opponent_id: me, is_bot: false }),
        toMatch(duelId, "duel_started", { duel_id: duelId }),
        // Everybody who was still counting down finds out now rather than in
        // three seconds' time.
        ...losers.map((l) => toUser(asString(l.receiver_id), "duel_challenge_cancelled", {
          challenge_id: l.challenge_id, reason: "taken",
        })),
      ]);
      return NextResponse.json(data);
    }

    case "decline": {
      const challengeId = asString(body.challenge_id);
      if (!challengeId) return bad("missing_challenge_id");
      const result = await rpcAsUser<Json>(token, "duel_decline_challenge", { p_challenge: challengeId });
      if (!result.ok) return bad(result.error, result.status);
      return NextResponse.json(result.data);
    }

    case "bot": {
      const result = await rpcAsUser<Json>(token, "duel_start_bot_match");
      if (!result.ok) return bad(result.error, result.status);
      if (result.data.ok) {
        const duelId = asString(result.data.duel_id);
        await givePlan(duelId, Number(result.data.bot_rating) || 1200);
        await broadcast([
          toUser(asString(await callerId(token)), "match_found", { duel_id: duelId, is_bot: true }),
          toMatch(duelId, "duel_started", { duel_id: duelId }),
        ]);
      }
      return NextResponse.json(result.data);
    }

    case "bot_step": {
      // Driven by the human's own polling. Workers hold no timers, so "the bot
      // thinks for four minutes" is not a sleeping process — it is a schedule
      // written at duel creation and a question asked on every poll: what was
      // due by now? An isolate dying between two rounds costs nothing.
      const matchId = asString(body.match_id);
      if (!matchId) return bad("missing_match_id");
      const moved = await runBotStep(token, matchId);
      return NextResponse.json(moved);
    }

    // -------------------------------------------------------- inside a duel
    case "submit": {
      const matchId = asString(body.match_id);
      const round = Number(body.round);
      const language = body.language as Language;
      const source = typeof body.source === "string" ? body.source : "";
      if (!matchId || !Number.isInteger(round) || round < 0) return bad("invalid_submission");
      if (!language || !languageIds[language] || !source.trim()) return bad("invalid_submission");

      // The problem is read from the duel, never taken from the request. A
      // client that asks to be judged against an easier problem than the one
      // its round holds is simply judged against its round.
      const state = await rpcAsUser<Json>(token, "duel_state");
      if (!state.ok) return bad(state.error, state.status);
      const duel = state.data.duel as Json | null;
      if (!duel || asString(duel.id) !== matchId) return bad("not_in_this_duel", 403);
      const rounds = Array.isArray(duel.rounds_detail) ? (duel.rounds_detail as Json[]) : [];
      const target = rounds.find((r) => Number(r.round) === round);
      if (!target) return bad("no_such_round");
      if (target.claimed_by_seat !== null && target.claimed_by_seat !== undefined) return bad("round_closed");
      const problemKey = asString(target.problem_key);
      if (!isJudgeableProblem(problemKey)) return bad("problem_not_judgeable", 500);

      const seat = Number(duel.my_seat);
      await broadcast([toMatch(matchId, "submission_received", { seat, round })]);

      const outcome = await judgeSource(problemKey, language, source);
      const recorded = await rpcAsUser<Json>(token, "duel_record_submission", {
        p_match: matchId, p_round: round, p_language: language, p_source: source,
        p_verdict: outcome.verdict, p_runtime: outcome.runtimeMs, p_memory: outcome.memoryKb,
        p_passed: outcome.passed, p_total: outcome.total, p_bot: false,
        // 017 writes this through to bank_submissions, so a duel solve shows up
        // on the Problems page like any other.
        p_title: titleFor(problemKey),
      });
      if (!recorded.ok) return bad(recorded.error, recorded.status);

      const claimed = recorded.data.claimed === true;
      await broadcast([toMatch(matchId, "submission_result", {
        seat, round, verdict: outcome.verdict, claimed,
      })]);

      // The database finishes the duel itself when the last round is claimed,
      // so this only has to notice that it did.
      const after = (recorded.data.state as Json | undefined)?.duel as Json | undefined;
      if (!after || after.status === "finished") {
        await broadcast([toMatch(matchId, "duel_finished", { duel_id: matchId })]);
      }

      return NextResponse.json({ ok: true, ...outcome, claimed, state: recorded.data.state });
    }

    case "forfeit": {
      const matchId = asString(body.match_id);
      if (!matchId) return bad("missing_match_id");
      const result = await rpcAsUser<Json>(token, "duel_forfeit", { p_match: matchId });
      if (!result.ok) return bad(result.error, result.status);
      if (result.data.ok) {
        await broadcast([toMatch(matchId, "duel_finished", {
          duel_id: matchId, winner_id: result.data.winner_id, reason: "forfeit",
        })]);
      }
      return NextResponse.json(result.data);
    }

    default:
      return bad("unknown_action");
  }
}


/* ---------------------------------------------------------------- the bot
 *
 * Two functions, and neither of them decides anything a learner could not
 * verify afterwards: the schedule is fixed before the first round starts, and
 * every submission it produces goes through judgeSource() — the same function,
 * the same hidden tests, the same verdicts as a human's.
 *
 * The reference solutions never leave the server. duel_state() does not return
 * another player's source, so what the opponent sees is "submitted", then
 * ACCEPTED or WRONG_ANSWER.
 */

/** Writes the bot's schedule for a freshly created duel. Runs as the service
 *  role: a learner's token must not be able to write their opponent's plan. */
async function givePlan(matchId: string, botRating: number): Promise<void> {
  const status = await rpcAsService<Json>("duel_bot_status", { p_match: matchId });
  if (!status.ok || !status.data?.ok) return;
  const rounds = Array.isArray(status.data.rounds) ? (status.data.rounds as Json[]) : [];
  if (!rounds.length) return;

  const configRow = await rpcAsService<Json>("duel_bot_config");
  const config = botConfigFrom(configRow.ok ? configRow.data : null);

  const plan: BotPlan = planDuel(
    matchId, botRating,
    rounds.map((r) => {
      const key = asString(r.problem_key);
      return {
        round: Number(r.round),
        problemKey: key,
        problemRating: Number(r.problem_rating) || 1200,
        difficulty: (bankFor(key)?.difficulty || "medium") as "easy" | "medium" | "hard",
      };
    }),
    1800, config,
  );
  await rpcAsService<Json>("duel_set_bot_plan", { p_match: matchId, p_plan: plan });
}

/** Plays at most one bot move. One per call on purpose: a duel that fell behind
 *  should catch up over a few polls rather than fire four submissions at the
 *  judge in the same request. */
async function runBotStep(token: string, matchId: string): Promise<Json> {
  const status = await rpcAsUser<Json>(token, "duel_bot_status", { p_match: matchId });
  if (!status.ok || !status.data?.ok) return { ok: false, error: status.ok ? String(status.data?.error) : status.error };
  const info = status.data;
  if (info.status !== "active") return { ok: true, moved: false, reason: "duel_over" };

  const elapsed = Number(info.elapsed) || 0;
  const seat = Number(info.seat);
  const plan = info.plan as BotPlan | null;
  // No plan means the duel was created before the bot could be given one. Not
  // an error the learner should pay for: the bot simply does not play, they
  // win the rounds, and nothing is stuck.
  if (!plan?.rounds?.length) return { ok: true, moved: false, reason: "no_plan" };

  const rounds = Array.isArray(info.rounds) ? (info.rounds as Json[]) : [];
  const done = (info.done || {}) as Record<string, number>;

  for (const roundPlan of plan.rounds) {
    const live = rounds.find((r) => Number(r.round) === roundPlan.round);
    // Somebody already claimed it — the bot moves on, exactly as a person would.
    if (!live || live.claimed_by_seat !== null) continue;

    const already = Number(done[String(roundPlan.round)] || 0);
    const attempt = roundPlan.attempts[already];
    if (!attempt || attempt.at > elapsed) continue;

    const key = asString(live.problem_key);
    const entry = hasSolution(key) ? solutions[key] : null;
    // A problem with no authored solution is a round the bot cannot play. It
    // stays open for the human rather than ending the duel.
    if (!entry) return { ok: true, moved: false, reason: "no_solution" };

    const source = attempt.correct ? entry.solution : (entry.wrong[0] || entry.solution);
    await broadcast([toMatch(matchId, "submission_received", { seat, round: roundPlan.round })]);

    const outcome = await judgeSource(key, "cpp20", source);
    // A judge outage must not be recorded as the bot failing: leaving the
    // attempt unrecorded means the next poll simply tries it again.
    if (outcome.verdict === "JUDGE_ERROR") {
      return { ok: true, moved: false, reason: "judge_unavailable" };
    }

    const recorded = await rpcAsService<Json>("duel_record_submission", {
      p_match: matchId, p_round: roundPlan.round, p_language: "cpp20", p_source: source,
      p_verdict: outcome.verdict, p_runtime: outcome.runtimeMs, p_memory: outcome.memoryKb,
      p_passed: outcome.passed, p_total: outcome.total, p_bot: true, p_title: titleFor(key),
    });
    if (!recorded.ok) return { ok: true, moved: false, reason: "record_failed" };

    await broadcast([toMatch(matchId, "submission_result", {
      seat, round: roundPlan.round, verdict: outcome.verdict,
      claimed: recorded.data?.claimed === true,
    })]);
    if (recorded.data?.claimed === true) {
      const after = (recorded.data.state as Json | undefined)?.duel as Json | undefined;
      if (!after) await broadcast([toMatch(matchId, "duel_finished", { duel_id: matchId })]);
    }
    return { ok: true, moved: true, round: roundPlan.round, verdict: outcome.verdict };
  }

  return { ok: true, moved: false, reason: "nothing_due" };
}

/* Who is calling. Supabase answers this from the token itself, which is the
   only source that cannot be edited by the sender. Cached per request by the
   caller passing the same token — one extra round trip on the actions that
   need to address the caller by id. */
async function callerId(token: string): Promise<string> {
  const profile = await callerProfile(token);
  return profile ? String(profile.id || "") : "";
}

const profileCache = new Map<string, Json>();
async function callerProfile(token: string): Promise<Json | null> {
  const cached = profileCache.get(token);
  if (cached) return cached;
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  try {
    const account = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: key, Authorization: `Bearer ${token}` },
    });
    if (!account.ok) return null;
    const user = (await account.json()) as { id?: string };
    if (!user.id) return null;
    const rows = await fetch(
      `${url}/rest/v1/profiles?id=eq.${user.id}&select=id,username,display_name,avatar_url,duel_rating`,
      { headers: { apikey: key, Authorization: `Bearer ${token}` } },
    );
    if (!rows.ok) return null;
    const list = (await rows.json()) as Json[];
    if (!list.length) return null;
    // Bounded so a long-lived isolate cannot accumulate tokens.
    if (profileCache.size > 64) profileCache.clear();
    profileCache.set(token, list[0]);
    return list[0];
  } catch {
    return null;
  }
}

export async function GET() {
  // Deliberate: everything here changes state or depends on who is asking, and
  // a GET invites a browser or a proxy to replay it.
  return bad("use_post", 405);
}

/* Kept for the bot runner in Phase 6, which has no learner token and moves the
   seat with no account behind it. Unused today, exported so the import in that
   phase is the only thing that changes. */
export const botRpc = rpcAsService;
