"use client";

/* AlgoYo'l session + scoped learner storage.
 *
 * Two problems this module exists to solve:
 *
 *  1. Guest vs. authenticated identity. A visitor who never registered must
 *     never look, to the app or to themselves, like an account holder. There
 *     is exactly one place that decides which of the three states we are in:
 *     "loading" (a stored token is being verified), "guest", "authenticated".
 *
 *  2. Learner state used to live under fixed localStorage keys, so the device
 *     was the identity: sign out and the next person inherited the previous
 *     learner's mastery, progress and Elo. Every learner key is now namespaced
 *     by account id (or "guest"), and sign-out drops the account namespace.
 */

export type Role = "user" | "admin" | "owner";
export type Profile = {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio?: string;
  country?: string;
  preferred_language: "uz" | "en";
  role: Role;
  duel_rating: number;
  solved_count: number;
  created_at: string;
};

export const GUEST_SCOPE = "guest";
const TOKEN_SESSION = "algoyol-access-token";
const TOKEN_REMEMBER = "algoyol-remember-token";
const USER_ID = "algoyol-user-id";

/* Learner keys that predate namespacing; adopted once into the active scope. */
export const LEARNER_KEYS = [
  "algoyol-roadmap-progress",
  "algoyol-mastery",
  "algoyol-mastery-log",
  "algoyol-mastery-config",
  "algoyol-duel-history",
  "algoyol-duel-rating",
  "algoyol-onboarded",
  "algoyol-active-lesson",
];

let scope: string = GUEST_SCOPE;

export const currentScope = () => scope;
export const scopedKey = (base: string) => `algoyol:${scope}:${base}`;
const keyFor = (owner: string, base: string) => `algoyol:${owner}:${base}`;

/* Returns true when the scope actually changed, so callers know to re-read. */
export function setScope(next: string) {
  if (scope === next) return false;
  scope = next;
  return true;
}

export const supabaseConfig = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
export const supabaseReady = () => {
  const { url, key } = supabaseConfig();
  return Boolean(url && key);
};

export const readToken = () =>
  typeof window === "undefined"
    ? null
    : sessionStorage.getItem(TOKEN_SESSION) || localStorage.getItem(TOKEN_REMEMBER);
export const readStoredUserId = () =>
  typeof window === "undefined" ? null : sessionStorage.getItem(USER_ID) || localStorage.getItem(USER_ID);

export function storeSession(token: string, remember: boolean, userId?: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TOKEN_SESSION, token);
  if (remember) localStorage.setItem(TOKEN_REMEMBER, token);
  else localStorage.removeItem(TOKEN_REMEMBER);
  if (userId) {
    sessionStorage.setItem(USER_ID, userId);
    if (remember) localStorage.setItem(USER_ID, userId);
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_SESSION);
  sessionStorage.removeItem(USER_ID);
  localStorage.removeItem(TOKEN_REMEMBER);
  localStorage.removeItem(USER_ID);
}

/* Sign-out must not leave the previous learner's work readable by whoever uses
   the browser next. The account namespace goes; nothing else is touched. */
export function dropScopeData(owner: string) {
  if (typeof window === "undefined") return;
  const prefix = `algoyol:${owner}:`;
  for (const k of Object.keys(localStorage)) if (k.startsWith(prefix)) localStorage.removeItem(k);
}

/* One-time migration for browsers that still hold pre-namespace keys. */
export function adoptLegacyInto(owner: string) {
  if (typeof window === "undefined") return;
  for (const base of LEARNER_KEYS) {
    const value = localStorage.getItem(base);
    if (value === null) continue;
    const target = keyFor(owner, base);
    if (localStorage.getItem(target) === null) localStorage.setItem(target, value);
    localStorage.removeItem(base);
  }
}

/* Work done before registering belongs to the same person — carry it into the
   new account exactly once, then clear the guest namespace so a second account
   on this browser cannot inherit it. */
export function adoptGuestInto(owner: string) {
  if (typeof window === "undefined" || owner === GUEST_SCOPE) return false;
  let adopted = false;
  for (const base of LEARNER_KEYS) {
    const value = localStorage.getItem(keyFor(GUEST_SCOPE, base));
    if (value === null) continue;
    if (localStorage.getItem(keyFor(owner, base)) === null) {
      localStorage.setItem(keyFor(owner, base), value);
      adopted = true;
    }
  }
  dropScopeData(GUEST_SCOPE);
  return adopted;
}

export function readScoped(base: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(scopedKey(base));
  } catch {
    return null;
  }
}
export function writeScoped(base: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(scopedKey(base), value);
  } catch {}
}
export function removeScoped(base: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(scopedKey(base));
  } catch {}
}

/* bio / country arrive with migration 007. Until it is applied the columns do
   not exist, and asking for them would fail the whole request — so the app
   detects them once and adapts, instead of showing fields that cannot save. */
let extendedColumns: boolean | null = null;
export async function hasExtendedProfile(): Promise<boolean> {
  if (extendedColumns !== null) return extendedColumns;
  const { url, key } = supabaseConfig();
  if (!url || !key) return (extendedColumns = false);
  try {
    const probe = await fetch(`${url}/rest/v1/profiles?select=bio,country&limit=1`, {
      headers: { apikey: key },
    });
    extendedColumns = probe.ok;
  } catch {
    extendedColumns = false;
  }
  return extendedColumns;
}
const PROFILE_BASE_COLUMNS =
  "id,username,display_name,avatar_url,preferred_language,role,duel_rating,solved_count,created_at";
async function profileColumns() {
  return (await hasExtendedProfile()) ? `${PROFILE_BASE_COLUMNS},bio,country` : PROFILE_BASE_COLUMNS;
}

/* Verifies a stored token against Supabase and returns the account it belongs
   to. A null result means "not signed in" — never "signed in with no data",
   which is how the old code ended up rendering invented numbers. */
export async function fetchProfile(token: string): Promise<Profile | null> {
  const { url, key } = supabaseConfig();
  if (!url || !key || !token) return null;
  const headers = { apikey: key, Authorization: `Bearer ${token}` };
  try {
    const account = await fetch(`${url}/auth/v1/user`, { headers });
    if (!account.ok) return null;
    const user = (await account.json()) as { id?: string; email?: string };
    if (!user.id) return null;
    const columns = await profileColumns();
    const rows = await fetch(`${url}/rest/v1/profiles?id=eq.${user.id}&select=${columns}`, { headers });
    if (!rows.ok) return null;
    const list = (await rows.json()) as Array<Omit<Profile, "email">>;
    if (!list.length) return null;
    return { ...list[0], email: user.email || "" };
  } catch {
    return null;
  }
}

/* Which sign-in methods the backend will actually accept. The Google button
   used to be rendered unconditionally: with the provider disabled in Supabase,
   clicking it navigated the user off the site to a raw JSON error
   ({"error_code":"validation_failed","msg":"Unsupported provider: provider is
   not enabled"}) with no way back. The UI now asks first, so it offers only
   what works — and lights up on its own once a provider is enabled, with no
   redeploy needed. */
export type AuthProviders = { google: boolean; github: boolean; email: boolean };
let providerCache: AuthProviders | null = null;
export async function fetchAuthProviders(): Promise<AuthProviders> {
  if (providerCache) return providerCache;
  const fallback: AuthProviders = { google: false, github: false, email: true };
  const { url, key } = supabaseConfig();
  if (!url || !key) return fallback;
  try {
    const response = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
    if (!response.ok) return fallback;
    const settings = (await response.json()) as { external?: Record<string, boolean> };
    const external = settings.external || {};
    providerCache = {
      google: external.google === true,
      github: external.github === true,
      email: external.email !== false,
    };
    return providerCache;
  } catch {
    return fallback;
  }
}

export type ProfilePatch = Partial<
  Pick<Profile, "display_name" | "username" | "avatar_url" | "preferred_language" | "bio" | "country">
>;

export async function updateProfile(
  id: string,
  patch: ProfilePatch,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { url, key } = supabaseConfig();
  const token = readToken();
  if (!url || !key || !token) return { ok: false, error: "no-session" };
  const extended = await hasExtendedProfile();
  const body: Record<string, unknown> = { ...patch };
  if (!extended) {
    delete body.bio;
    delete body.country;
  }
  if (!Object.keys(body).length) return { ok: true };
  try {
    const response = await fetch(`${url}/rest/v1/profiles?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
    });
    if (response.ok) return { ok: true };
    const detail = (await response.json().catch(() => ({}))) as { message?: string; code?: string };
    if (detail.code === "23505") return { ok: false, error: "username-taken" };
    if (detail.code === "23514") return { ok: false, error: "invalid" };
    return { ok: false, error: detail.message || `http-${response.status}` };
  } catch {
    return { ok: false, error: "network" };
  }
}

/* Leaderboard reads the real profiles table. Anonymous visitors can read it —
   profiles are public by design — so a guest sees a genuine ranking rather
   than a fabricated row claiming to be them. */
export type LeaderRow = { id: string; username: string; display_name: string; duel_rating: number; solved_count: number };
export async function fetchLeaderboard(limit = 50): Promise<LeaderRow[] | null> {
  const { url, key } = supabaseConfig();
  if (!url || !key) return null;
  try {
    const response = await fetch(
      `${url}/rest/v1/profiles?select=id,username,display_name,duel_rating,solved_count&order=duel_rating.desc,solved_count.desc&limit=${limit}`,
      { headers: { apikey: key } },
    );
    if (!response.ok) return null;
    const rows = (await response.json()) as LeaderRow[];
    return Array.isArray(rows) ? rows : null;
  } catch {
    return null;
  }
}

/* Count of registered learners — a real number for the landing page, in place
   of the invented "1,284 active today". */
export async function fetchLearnerCount(): Promise<number | null> {
  const { url, key } = supabaseConfig();
  if (!url || !key) return null;
  try {
    const response = await fetch(`${url}/rest/v1/profiles?select=id&limit=1`, {
      headers: { apikey: key, Prefer: "count=exact", Range: "0-0" },
    });
    const range = response.headers.get("content-range");
    const total = range?.split("/")[1];
    return total && total !== "*" ? Number(total) : null;
  } catch {
    return null;
  }
}

export async function saveDuelRating(id: string, next: number) {
  const { url, key } = supabaseConfig();
  const token = readToken();
  if (!url || !key || !token || !id) return;
  try {
    await fetch(`${url}/rest/v1/profiles?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ duel_rating: next }),
    });
  } catch {}
}
