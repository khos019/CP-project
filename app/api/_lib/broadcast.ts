/* Realtime fan-out.
 *
 * The app had no realtime at all — messages poll once a minute, which is fine
 * for an inbox and useless for a challenge that lives five seconds. Supabase
 * already runs a realtime service on this project, so a duel challenge travels
 * over that rather than over a second piece of infrastructure: the server POSTs
 * here, and browsers subscribed to the topic have it in well under a second.
 *
 * What travels is deliberately thin. A Supabase channel is public to anyone
 * holding the anon key who knows the topic name, and a topic name is a uuid
 * rather than a permission. So an event says "something about you changed",
 * carrying only what the card needs to render, and the client answers by
 * asking duel_state() — which does check who is asking. Nothing here is
 * trusted by the receiver, which is what makes a public channel safe to use.
 */

import { serverEnv } from "./env";

// NEXT_PUBLIC_* stays a literal process.env read: the bundler substitutes that
// exact text at build time. The service key is a Worker binding — see ./env.
const url = () => (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const serviceKey = () => serverEnv("SUPABASE_SERVICE_ROLE_KEY");

/** Everything a duel can announce. Kept as a union so a typo in a route is a
 *  compile error rather than an event nobody ever receives. */
export type DuelEventName =
  | "matchmaking_started"
  | "duel_challenge_received"
  | "duel_challenge_cancelled"
  | "duel_challenge_expired"
  | "match_found"
  | "duel_started"
  | "submission_received"
  | "submission_result"
  | "duel_finished";

export const userTopic = (userId: string) => `duel:user:${userId}`;
export const matchTopic = (matchId: string) => `duel:match:${matchId}`;

type Message = { topic: string; event: DuelEventName; payload: Record<string, unknown> };

/** Sends a batch in one request. Failure is not fatal anywhere: realtime is how
 *  the client hears about a change quickly, never how it learns what is true —
 *  a dropped event costs a second of latency, because the next poll or the next
 *  duel_state() call corrects it. */
export async function broadcast(messages: Message[]): Promise<string> {
  if (!messages.length) return "empty";
  if (!url()) return "no_url";
  if (!serviceKey()) return "no_key";
  try {
    const response = await fetch(`${url()}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: { apikey: serviceKey(), Authorization: `Bearer ${serviceKey()}`, "content-type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (response.ok) return "ok";
    // The body names the reason when the status alone does not.
    const detail = await response.text().catch(() => "");
    return `http_${response.status}:${detail.slice(0, 120)}`;
  } catch (error) {
    return `threw:${error instanceof Error ? error.message : "unknown"}`;
  }
}

export const toUser = (userId: string, event: DuelEventName, payload: Record<string, unknown> = {}): Message =>
  ({ topic: userTopic(userId), event, payload });
export const toMatch = (matchId: string, event: DuelEventName, payload: Record<string, unknown> = {}): Message =>
  ({ topic: matchTopic(matchId), event, payload });
