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


/* Platform statistics for the owner. The aggregates live behind a
   security-definer function (migration 009) because the underlying data is
   deliberately unreadable from a browser: unit_progress is RLS-scoped to the
   caller's own rows, and auth.users is not exposed to client roles at all.
   A missing function means the migration has not been applied yet — the page
   says so rather than showing nothing. */
export type OwnerStats = {
  generated_at: string;
  learners_total: number; new_today: number; new_7d: number; new_30d: number;
  active_today: number; active_7d: number; active_30d: number;
  never_signed_in: number; confirmed: number; unconfirmed: number;
  signups_daily: { day: string; count: number }[];
  by_language: Record<string, number>;
  by_role: Record<string, number>;
  rating_avg: number; rating_max: number;
  learners_with_progress: number; units_completed: number;
  quizzes_passed: number; problems_solved: number;
  top_topics: { topic: string; units: number; learners: number }[];
};

export async function fetchOwnerStats(): Promise<
  { ok: true; stats: OwnerStats } | { ok: false; error: "not-migrated" | "forbidden" | "network" }
> {
  const { url, key } = supabaseConfig();
  const token = readToken();
  if (!url || !key || !token) return { ok: false, error: "network" };
  try {
    const response = await fetch(`${url}/rest/v1/rpc/owner_platform_stats`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: "{}",
    });
    if (response.ok) return { ok: true, stats: (await response.json()) as OwnerStats };
    const detail = (await response.json().catch(() => ({}))) as { code?: string; message?: string };
    if (response.status === 404 || detail.code === "PGRST202") return { ok: false, error: "not-migrated" };
    if (response.status === 403 || detail.code === "42501") return { ok: false, error: "forbidden" };
    return { ok: false, error: "network" };
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

/* ---------------------------------------------------------------------------
   User administration and messaging (migrations 010 and 011)

   Every owner action is a security-definer RPC that re-checks the caller's
   role in the database. Nothing here is a permission decision — the UI hides
   what a learner may not do, and the database refuses it regardless.
   --------------------------------------------------------------------------- */

export type ApiError =
  | "not-migrated"
  | "forbidden"
  | "network"
  | "no-session"
  | "username-taken"
  | "invalid"
  | "suspended"
  | "blocked"
  | "rate-limited";

type RpcResult<T> = { ok: true; data: T } | { ok: false; error: ApiError; message?: string };

/* Postgres speaks in SQLSTATE codes; the UI speaks in reasons a person can
   act on. This is the only place the two are mapped. */
const rpcError = (status: number, detail: { code?: string; message?: string }): ApiError => {
  const text = detail.message || "";
  if (status === 404 || detail.code === "PGRST202") return "not-migrated";
  if (/username_taken/.test(text) || detail.code === "23505") return "username-taken";
  if (/invalid_username|invalid_display_name/.test(text) || detail.code === "23514") return "invalid";
  if (/account_suspended/.test(text)) return "suspended";
  if (/blocked_by_recipient/.test(text)) return "blocked";
  if (/rate_limited/.test(text) || detail.code === "53400") return "rate-limited";
  if (status === 403 || status === 401 || detail.code === "42501") return "forbidden";
  return "network";
};

async function rpc<T>(name: string, args: Record<string, unknown> = {}): Promise<RpcResult<T>> {
  const { url, key } = supabaseConfig();
  const token = readToken();
  if (!url || !key || !token) return { ok: false, error: "no-session" };
  try {
    const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(args),
    });
    if (response.ok) {
      const text = await response.text();
      return { ok: true, data: (text ? JSON.parse(text) : null) as T };
    }
    const detail = (await response.json().catch(() => ({}))) as { code?: string; message?: string };
    return { ok: false, error: rpcError(response.status, detail), message: detail.message };
  } catch {
    return { ok: false, error: "network" };
  }
}

export type AdminUser = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  email: string;
  role: Role;
  duel_rating: number;
  solved_count: number;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed: boolean;
  suspended_at: string | null;
  suspended_reason: string | null;
};

export const ownerSearchUsers = (query: string, limit = 25) =>
  rpc<AdminUser[]>("owner_search_users", { p_query: query, p_limit: limit });

export const ownerSetRole = (userId: string, role: Role) =>
  rpc<null>("set_user_role", { p_user: userId, p_role: role });

export const ownerSetSuspended = (userId: string, suspended: boolean, reason?: string) =>
  rpc<null>("owner_set_suspended", { p_user: userId, p_suspended: suspended, p_reason: reason ?? null });

export const ownerUpdateIdentity = (userId: string, username: string, displayName: string) =>
  rpc<null>("owner_update_identity", { p_user: userId, p_username: username, p_display_name: displayName });

export type MessageThread = {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  role: Role;
  last_body: string;
  last_at: string;
  last_as_site: boolean;
  last_mine: boolean;
  unread: number;
  blocked: boolean;
};

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  as_site: boolean;
  created_at: string;
  read_at: string | null;
};

export const fetchThreads = (limit = 50) => rpc<MessageThread[]>("my_message_threads", { p_limit: limit });
export const fetchUnreadCount = () => rpc<number>("my_unread_count");
export const markThreadRead = (otherId: string) => rpc<number>("mark_thread_read", { p_other: otherId });

/* A conversation is every message between the two of us, in either direction.
   RLS already restricts the table to conversations the caller is part of, so
   this filter picks which conversation, it does not decide what may be read. */
export async function fetchConversation(otherId: string, me: string): Promise<Message[] | null> {
  const { url, key } = supabaseConfig();
  const token = readToken();
  if (!url || !key || !token) return null;
  const pair = `or=(and(sender_id.eq.${me},recipient_id.eq.${otherId}),and(sender_id.eq.${otherId},recipient_id.eq.${me}))`;
  try {
    const response = await fetch(
      `${url}/rest/v1/messages?${pair}&select=id,sender_id,recipient_id,body,as_site,created_at,read_at&order=created_at.asc&limit=500`,
      { headers: { apikey: key, Authorization: `Bearer ${token}` } },
    );
    if (!response.ok) return null;
    return (await response.json()) as Message[];
  } catch {
    return null;
  }
}

export async function sendMessage(recipientId: string, body: string, asSite = false): Promise<RpcResult<Message>> {
  const { url, key } = supabaseConfig();
  const token = readToken();
  const me = readStoredUserId();
  if (!url || !key || !token || !me) return { ok: false, error: "no-session" };
  try {
    const response = await fetch(`${url}/rest/v1/messages`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ sender_id: me, recipient_id: recipientId, body, as_site: asSite }),
    });
    if (response.ok) {
      const rows = (await response.json()) as Message[];
      return { ok: true, data: rows[0] };
    }
    const detail = (await response.json().catch(() => ({}))) as { code?: string; message?: string };
    if (response.status === 404 || detail.code === "42P01") return { ok: false, error: "not-migrated" };
    return { ok: false, error: rpcError(response.status, detail), message: detail.message };
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function setBlocked(otherId: string, blocked: boolean): Promise<boolean> {
  const { url, key } = supabaseConfig();
  const token = readToken();
  const me = readStoredUserId();
  if (!url || !key || !token || !me) return false;
  const headers = { apikey: key, Authorization: `Bearer ${token}`, "content-type": "application/json" };
  try {
    const response = blocked
      ? await fetch(`${url}/rest/v1/message_blocks`, {
          method: "POST",
          headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ blocker_id: me, blocked_id: otherId }),
        })
      : await fetch(`${url}/rest/v1/message_blocks?blocker_id=eq.${me}&blocked_id=eq.${otherId}`, {
          method: "DELETE",
          headers,
        });
    return response.ok;
  } catch {
    return false;
  }
}

/* Who you can write to. Profiles are public by design, so this needs no
   privileged function, and it returns only what a profile page already shows.
   Email is not searchable here: that is the owner's tool, not everyone's. */
export type Person = { id: string; username: string; display_name: string; avatar_url: string | null; role: Role };

export async function searchPeople(query: string, limit = 12): Promise<Person[] | null> {
  const { url, key } = supabaseConfig();
  const token = readToken();
  const term = query.trim();
  if (!url || !key || !token || term.length < 2) return [];
  // PostgREST splits `or=(...)` on commas, so a comma in the term would read
  // as another condition. Wildcards are stripped for the same reason.
  const safe = encodeURIComponent(term.replace(/[,()*\\%_]/g, ""));
  if (!safe) return [];
  try {
    const response = await fetch(
      `${url}/rest/v1/profiles?or=(username.ilike.*${safe}*,display_name.ilike.*${safe}*)` +
        `&select=id,username,display_name,avatar_url,role&order=username.asc&limit=${limit}`,
      { headers: { apikey: key, Authorization: `Bearer ${token}` } },
    );
    if (!response.ok) return null;
    return (await response.json()) as Person[];
  } catch {
    return null;
  }
}
