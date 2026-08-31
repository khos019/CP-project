"use client";

/* Typed access to /api/duel.
 *
 * Every call carries a fresh access token — an hour-old one is exactly what
 * migration 013's bug report was about, and a duel that dies mid-search
 * because the session quietly expired would be the same failure wearing a
 * different hat.
 *
 * Nothing here holds state. The server's duel_state() is the only description
 * of what is happening, which is what makes two browser tabs, a refresh and a
 * reconnect all agree without any of them coordinating.
 */

import { ensureFreshToken } from "./session";

export type DuelStatus = "idle" | "searching" | "challenge_sent" | "duel_found" | "duel_active";

export type ChallengeFrom = {
  id: string; username: string; display_name: string;
  avatar_url: string | null; duel_rating: number;
};
export type IncomingChallenge = {
  id: string; created_at: string; expires_at: string; from: ChallengeFrom;
};
export type DuelSession = {
  id: string; status: string; rating: number;
  created_at: string; expires_at: string; match_id: string | null;
};
export type DuelPlayer = {
  seat: number; is_bot: boolean; score: number; rating: number;
  display_name: string; username: string | null; avatar_url: string | null;
};
export type DuelRound = {
  round: number; problem_key: string; points: number;
  claimed_by_seat: number | null; claimed_at: string | null;
};
export type DuelActivity = { round: number; verdict: string; created_at: string };
export type ActiveDuel = {
  id: string; mode: "human" | "bot"; status: string; rounds: number;
  started_at: string; ends_at: string; my_seat: number;
  players: DuelPlayer[]; rounds_detail: DuelRound[];
  my_submissions: DuelActivity[]; opponent_activity: DuelActivity[];
};
export type DuelState = {
  status: DuelStatus;
  session: DuelSession | null;
  challenge: IncomingChallenge | null;
  duel: ActiveDuel | null;
  /** The server's clock, so a skewed device cannot mis-draw a countdown. */
  now: string;
};

export type TickResult = {
  ok: boolean; searching: boolean; elapsed?: number; radius?: number;
  available?: number; waiting_on_challenge?: boolean;
  bot_fallback_due?: boolean; state?: DuelState;
};

async function post<T>(body: Record<string, unknown>): Promise<T | { ok: false; error: string }> {
  const token = await ensureFreshToken();
  if (!token) return { ok: false, error: "not_authenticated" };
  try {
    const response = await fetch("/api/duel", {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    // A refused accept is an answer, not a failure — "already_taken" is what
    // the losing client needs in order to say so.
    return data as T;
  } catch {
    return { ok: false, error: "network" };
  }
}

export type DuelResultPlayer = {
  seat: number; is_bot: boolean; score: number; rating: number;
  rating_before: number; rating_after: number | null; delta: number;
  display_name: string; username: string | null;
};
export type DuelResult = {
  id: string; mode: "human" | "bot"; my_seat: number; winner_id: string | null;
  outcome: "win" | "loss" | "draw"; finished_at: string; started_at: string;
  players: DuelResultPlayer[];
  rounds: { round: number; problem_key: string; points: number; claimed_by_seat: number | null }[];
};

export const duelState = () => post<DuelState>({ action: "state" });
export const duelRecentResult = () => post<DuelResult | null>({ action: "result" });
export const duelHeartbeat = (ready = true) => post<{ ok: boolean }>({ action: "heartbeat", ready });
export const startSearch = () => post<{ ok: boolean; error?: string; resumed?: boolean; state?: DuelState }>({ action: "search" });
export const cancelSearch = () => post<{ ok: boolean }>({ action: "cancel" });
export const duelTick = () => post<TickResult>({ action: "tick" });
export const acceptChallenge = (id: string) =>
  post<{ ok: boolean; error?: string; duel_id?: string }>({ action: "accept", challenge_id: id });
export const declineChallenge = (id: string) => post<{ ok: boolean }>({ action: "decline", challenge_id: id });
export const forfeitDuel = (matchId: string) => post<{ ok: boolean }>({ action: "forfeit", match_id: matchId });

/** Lets the bot play whatever its schedule says is due. Called by the player's
 *  own polling because Workers cannot hold a timer for twenty minutes — the
 *  schedule was fixed when the duel started, so this only ever carries out a
 *  decision that was already made. */
export const botStep = (matchId: string) =>
  post<{ ok: boolean; moved?: boolean; reason?: string; verdict?: string }>({ action: "bot_step", match_id: matchId });

export type SubmitResult = {
  ok: boolean; error?: string; verdict?: string; passed?: number; total?: number;
  test?: number; runtimeMs?: number; memoryKb?: number; details?: string;
  claimed?: boolean; state?: DuelState;
};
export const submitToDuel = (matchId: string, round: number, language: "cpp20" | "python3", source: string) =>
  post<SubmitResult>({ action: "submit", match_id: matchId, round, language, source });

/** Seconds left on a server deadline, measured against the server's own clock
 *  as of the last state read — never against Date.now() alone, which is a
 *  number the device owner can change. */
export function secondsLeft(deadline: string, serverNow: string, drawnAt: number): number {
  const base = new Date(deadline).getTime() - new Date(serverNow).getTime();
  return Math.max(0, (base - (Date.now() - drawnAt)) / 1000);
}
