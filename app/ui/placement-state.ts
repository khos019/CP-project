"use client";

/* Has this learner already dealt with the level check?
 *
 * Two facts answer that, and either one is enough: they FINISHED it (a result
 * screen was reached, so a placement record exists), or they SAID NO (the ✕ on
 * the offer banner, or "I'll start from zero" on the intro). Once either is
 * true the banner must never be offered again — being asked to prove yourself
 * a second time reads as the site forgetting who you are.
 *
 * It is stored twice on purpose:
 *
 *   - locally, so the banner is decided during the first paint, with no
 *     request and no flash of an offer the learner already answered;
 *   - on the account (migration 039), so the answer follows the person to
 *     their phone, to a second browser, and past a cleared cache.
 *
 * The account copy is authoritative when it exists and silent when it does
 * not: before 039 is applied, or signed out, or offline, every call here
 * degrades to the local flags and the app behaves exactly as it used to.
 */

import { readScoped, writeScoped, readToken, supabaseConfig } from "./session";
import { loadPlacement } from "./mastery";

const DISMISSED = "algoyol-placement-dismissed";
const config = supabaseConfig;
const token = readToken;

export type PlacementState = { taken: boolean; dismissed: boolean };

/** What this browser knows without asking anybody. */
export function localPlacementState(): PlacementState {
  return { taken: !!loadPlacement(), dismissed: readScoped(DISMISSED) === "1" };
}

/** The one question the banner asks. */
export function placementSettled(): boolean {
  const s = localPlacementState();
  return s.taken || s.dismissed;
}

/** Remember locally that the offer has been answered, whichever way. */
export function markSettledLocally() {
  writeScoped(DISMISSED, "1");
}

const rest = () => {
  const { url, key } = config();
  const auth = token();
  return url && key && auth ? { url, key, auth } : null;
};

/** The account's copy, or null when there is nobody to ask (signed out,
 *  Supabase unconfigured, 039 not applied yet, network down). */
export async function fetchPlacementState(): Promise<PlacementState | null> {
  const r = rest();
  if (!r) return null;
  try {
    const response = await fetch(`${r.url}/rest/v1/placement_state?select=taken,dismissed&limit=1`, {
      headers: { apikey: r.key, Authorization: `Bearer ${r.auth}` },
    });
    if (!response.ok) return null; // includes 404 before migration 039
    const rows = (await response.json()) as { taken: boolean; dismissed: boolean }[];
    if (!Array.isArray(rows) || !rows.length) return { taken: false, dismissed: false };
    return { taken: !!rows[0].taken, dismissed: !!rows[0].dismissed };
  } catch {
    return null;
  }
}

/** Record the answer on the account. Fire-and-forget: the local flag has
 *  already been written, so a failed request costs the learner nothing — and
 *  the next sign-in on this browser pushes it up again. */
export async function pushPlacementState(patch: { taken?: boolean; dismissed?: boolean; level?: number }): Promise<boolean> {
  const r = rest();
  if (!r) return false;
  try {
    const response = await fetch(`${r.url}/rest/v1/placement_state`, {
      method: "POST",
      headers: {
        apikey: r.key,
        Authorization: `Bearer ${r.auth}`,
        "content-type": "application/json",
        // upsert on the user_id primary key; the trigger keeps flags sticky
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(patch),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/** Called after sign-in and after the test itself: make the two copies agree.
 *  The account wins when it says "settled", because it speaks for every device;
 *  this browser wins when IT is the one that settled it, because that answer
 *  has not been sent up yet. Returns the settled state so the caller can
 *  refresh the banner without reading storage a second time. */
export async function syncPlacementState(): Promise<boolean> {
  const local = localPlacementState();
  const remote = await fetchPlacementState();
  if (!remote) return local.taken || local.dismissed;
  if (remote.taken || remote.dismissed) {
    markSettledLocally();
    return true;
  }
  if (local.taken || local.dismissed) {
    void pushPlacementState({ taken: local.taken, dismissed: local.dismissed });
    return true;
  }
  return false;
}
