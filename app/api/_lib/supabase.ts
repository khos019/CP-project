/* Server-side Supabase access.
 *
 * Two ways in, and the difference matters:
 *
 *   asUser(token)  — forwards the learner's own JWT to PostgREST, so auth.uid()
 *                    inside every duel function is the caller and RLS applies
 *                    exactly as it does from the browser. This is the default:
 *                    a route that acts on somebody's behalf should not be able
 *                    to act on anybody else's.
 *
 *   asService()    — the service role, for the two things a learner's token
 *                    cannot legitimately do: move the bot, and broadcast.
 *                    Everything reached this way must already have been
 *                    authorised by a function that ran as the user.
 *
 * Nothing here decides anything. The database decides; this carries the call.
 */

import { serverEnv } from "./env";

export type RpcResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

const url = () => (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const anonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceKey = () => serverEnv("SUPABASE_SERVICE_ROLE_KEY");

export const supabaseConfigured = () => Boolean(url() && anonKey());

/** The bearer token on the request, or null. Presence is not proof — PostgREST
 *  verifies the signature, and a forged token simply fails there. */
export function bearerFrom(request: Request): string | null {
  const header = request.headers.get("authorization") || "";
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match ? match[1] : null;
}

async function call<T>(fn: string, args: Record<string, unknown>, key: string, bearer: string): Promise<RpcResult<T>> {
  if (!url() || !key) return { ok: false, status: 500, error: "supabase_not_configured" };
  try {
    const response = await fetch(`${url()}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${bearer}`, "content-type": "application/json" },
      body: JSON.stringify(args),
    });
    const text = await response.text();
    if (!response.ok) {
      // PostgREST answers 404/PGRST202 when the function is not in the schema,
      // which means migration 016 has not been applied — a different problem
      // from "you may not do that", and worth saying so.
      const detail = (() => { try { return JSON.parse(text) as { message?: string; code?: string } } catch { return {} } })();
      const missing = response.status === 404 || detail.code === "PGRST202";
      return { ok: false, status: response.status, error: missing ? "not_migrated" : detail.message || `http_${response.status}` };
    }
    return { ok: true, data: (text ? JSON.parse(text) : null) as T };
  } catch {
    return { ok: false, status: 502, error: "network" };
  }
}

/** Runs the function as the learner whose token this is. */
export const rpcAsUser = <T>(token: string, fn: string, args: Record<string, unknown> = {}) =>
  call<T>(fn, args, anonKey(), token);

/** Runs the function with the service role. Callers must have established
 *  authority some other way first. */
export const rpcAsService = <T>(fn: string, args: Record<string, unknown> = {}) =>
  call<T>(fn, args, serviceKey(), serviceKey());

/** Reads a table with the service role — used by the bot, which has no token
 *  and therefore no auth.uid() to read as. */
export async function selectAsService<T>(path: string): Promise<T | null> {
  if (!url() || !serviceKey()) return null;
  try {
    const response = await fetch(`${url()}/rest/v1/${path}`, {
      headers: { apikey: serviceKey(), Authorization: `Bearer ${serviceKey()}` },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}
