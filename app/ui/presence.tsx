"use client";

/* Who is online, for the screens that list people.
 *
 * The heartbeat that feeds this already runs in the app shell — it was added
 * for matchmaking, and "is this person here" is the same question a friends
 * list asks. So nothing new is written; this only reads.
 *
 * Deliberately a set of ids rather than a timestamp per person: a screen needs
 * to know whether to light a dot, and exposing when somebody was last seen
 * would be a record of when they study.
 */

import { readToken, supabaseConfig } from "./session";

/** Ids from `ids` that are online right now. Empty set when signed out — a
 *  guest sees the ranking, not who is at their desk. */
export async function onlineAmong(ids: string[]): Promise<Set<string>> {
  const { url, key } = supabaseConfig();
  const token = readToken();
  const unique = [...new Set(ids.filter(Boolean))];
  if (!url || !key || !token || !unique.length) return new Set();
  try {
    const response = await fetch(`${url}/rest/v1/rpc/users_online`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ p_ids: unique }),
    });
    if (!response.ok) return new Set();
    const rows = (await response.json()) as string[];
    return new Set(Array.isArray(rows) ? rows : []);
  } catch {
    return new Set();
  }
}

/** How many people are on the platform right now. Public: a count says nothing
 *  about any particular person. Null when it cannot be read, so a caller can
 *  show nothing rather than a confident zero. */
export async function onlineNow(): Promise<number | null> {
  const { url, key } = supabaseConfig();
  if (!url || !key) return null;
  try {
    const response = await fetch(`${url}/rest/v1/rpc/online_now`, {
      method: "POST",
      headers: { apikey: key, "content-type": "application/json" },
      body: "{}",
    });
    if (!response.ok) return null;
    const value = await response.json();
    return typeof value === "number" ? value : null;
  } catch {
    return null;
  }
}

/* The dot itself. One component so "online" looks the same on the leaderboard,
   in a friends list and on a profile — and so the accessible name is written
   once rather than three times slightly differently. */
export function OnlineDot({ online, lang, label }: { online: boolean; lang: "uz" | "en"; label?: string }) {
  const text = online
    ? (lang === "uz" ? "onlayn" : "online")
    : (lang === "uz" ? "oflayn" : "offline");
  return (
    <span className={`presence-dot ${online ? "on" : "off"}`} title={label ? `${label} · ${text}` : text}>
      <i aria-hidden />
      <span className="sr-only">{text}</span>
    </span>
  );
}
