"use client";

/* Which problems this person has solved, and which they have only wrestled
 * with.
 *
 * The list used to colour itself from local mastery evidence alone, and mastery
 * lives in the account's localStorage namespace — which sign-out deletes. So a
 * learner who signed out, or opened the site on a second device, saw a hundred
 * unsolved problems they had already solved.
 *
 * The account's submissions are the durable record, so they are the source of
 * truth here: the map is refreshed from the server whenever the app boots
 * signed in, and the local copy is a cache that also lets a verdict colour the
 * row immediately, before any round trip.
 */

import { readScoped, writeScoped } from "./session";
import { fetchMyProblemStatuses } from "./social";

export type ProblemState = "solved" | "attempted" | "unsolved";
export type StatusMap = Record<string, "solved" | "attempted">;

const KEY = "algoyol-problem-status";

export function loadProblemStatuses(): StatusMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = JSON.parse(readScoped(KEY) || "{}") as StatusMap;
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

const save = (map: StatusMap) => {
  writeScoped(KEY, JSON.stringify(map));
  window.dispatchEvent(new Event("algoyol-progress"));
};

/** Records one verdict locally. Solved never falls back to attempted: a
    problem you have solved stays solved, whatever you submit afterwards. */
export function markAttempt(problemKey: string, accepted: boolean) {
  if (typeof window === "undefined" || !problemKey) return;
  const map = loadProblemStatuses();
  if (map[problemKey] === "solved") return;
  const next: "solved" | "attempted" = accepted ? "solved" : "attempted";
  if (map[problemKey] === next) return;
  map[problemKey] = next;
  save(map);
}

/** Pulls the account's record and merges it over the local cache. Silent on
    failure — a list that is briefly missing a tick is better than one that
    erases ticks because a request did not arrive. */
export async function syncProblemStatuses(): Promise<void> {
  const remote = await fetchMyProblemStatuses();
  if (!remote) return;
  const map = loadProblemStatuses();
  let changed = false;
  for (const [key, state] of Object.entries(remote)) {
    if (map[key] === state || map[key] === "solved") continue;
    map[key] = state;
    changed = true;
  }
  if (changed) save(map);
}
