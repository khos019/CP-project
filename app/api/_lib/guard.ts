/* Who may call the expensive routes, and how often.
 *
 * Written after 2026-10-14, 18:34-18:56 Tashkent time: three rented servers
 * sent ~93,000 POSTs to /api/judge in twenty-two minutes. The route asked for
 * no account and counted nothing, so every request became a Judge0 job — the
 * judge's queue filled (503 for every real learner) and the Worker's free
 * 100,000-requests-a-day allowance ran out, which took the WHOLE site down
 * until midnight UTC.
 *
 * Two checks, both cheap enough to run before any real work:
 *
 *   verifiedUserId(token)  — Supabase answers who the token belongs to. The
 *                            token is a signed JWT, so a script cannot invent
 *                            one; it has to hold a real session.
 *   allow(limiter, key)    — a per-account budget on Cloudflare's rate
 *                            limiting binding, shared by every isolate in the
 *                            location, with a per-isolate fallback for local
 *                            dev where the binding does not exist.
 *
 * What this cannot do is keep a flood from costing Worker requests: a refused
 * call is still an invocation. That part belongs to the Cloudflare WAF rate
 * limiting rule on /api/*, which runs before the Worker is ever started.
 */

import { env as workerEnv } from "cloudflare:workers";

type RateLimiter = { limit(options: { key: string }): Promise<{ success: boolean }> };
export type LimiterName = "JUDGE_LIMITER" | "DUEL_LIMITER";

/* Must match the "simple" blocks in wrangler.jsonc; used only when the binding
   is missing (vinext dev, node --test). */
const FALLBACK: Record<LimiterName, { limit: number; periodMs: number }> = {
  JUDGE_LIMITER: { limit: 12, periodMs: 60_000 },
  DUEL_LIMITER: { limit: 150, periodMs: 60_000 },
};

const localHits = new Map<string, number[]>();

function allowLocally(name: LimiterName, key: string): boolean {
  const { limit, periodMs } = FALLBACK[name];
  const now = Date.now();
  const id = `${name}:${key}`;
  const hits = (localHits.get(id) || []).filter((t) => now - t < periodMs);
  if (hits.length >= limit) {
    localHits.set(id, hits);
    return false;
  }
  hits.push(now);
  // Bounded so an isolate under a flood of distinct keys cannot grow without end.
  if (localHits.size > 5000) localHits.clear();
  localHits.set(id, hits);
  return true;
}

/** True when `key` still has budget on this limiter. Fails open if the binding
 *  itself errors: a broken limiter must not lock every learner out. */
export async function allow(name: LimiterName, key: string): Promise<boolean> {
  const binding = (workerEnv as unknown as Record<string, unknown> | undefined)?.[name] as RateLimiter | undefined;
  if (!binding || typeof binding.limit !== "function") return allowLocally(name, key);
  try {
    return (await binding.limit({ key })).success;
  } catch {
    return true;
  }
}

/* A verified token is cached until shortly before it expires, so a learner
   pressing Run ten times costs Supabase one lookup, not ten. */
const verified = new Map<string, { id: string; until: number }>();

function expiryOf(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    return payload.exp ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

/** The account id behind a Supabase access token, or "" when the token is
 *  missing, forged or expired. */
export async function verifiedUserId(token: string | null): Promise<string> {
  if (!token) return "";
  const now = Date.now();
  const hit = verified.get(token);
  if (hit && hit.until > now) return hit.id;

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return "";
  try {
    const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${token}` } });
    if (!response.ok) return "";
    const user = (await response.json()) as { id?: string };
    if (!user.id) return "";
    if (verified.size > 1000) verified.clear();
    verified.set(token, { id: user.id, until: Math.min(now + 5 * 60_000, expiryOf(token) || now + 60_000) });
    return user.id;
  } catch {
    return "";
  }
}
