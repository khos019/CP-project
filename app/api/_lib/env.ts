/* Where a server-only secret actually lives.
 *
 * This cost an afternoon, so it is worth writing down.
 *
 * Cloudflare gives a Worker its secrets as *bindings* — they arrive on the
 * `env` object, which is why db/index.ts reaches for `cloudflare:workers` to
 * find `env.DB`. They are not on `process.env`. Meanwhile `NEXT_PUBLIC_*`
 * variables are substituted into the bundle at build time, so those do read
 * back from `process.env` and appear to work everywhere.
 *
 * The result was a bug that looked like anything but this: matchmaking created
 * challenges correctly, the database was right, the realtime service was
 * reachable, the secret was set — and no challenge was ever delivered, because
 * `process.env.SUPABASE_SERVICE_ROLE_KEY` was an empty string inside the
 * Worker and the broadcast quietly returned false. Locally it all worked,
 * because there `process.env` is populated from .env.local.
 *
 * So: bindings first, process.env second. The fallback keeps `vinext dev`,
 * `node --test` and any other Node context working unchanged.
 *
 * Note what this is deliberately NOT used for: NEXT_PUBLIC_* names must stay
 * written as literal `process.env.NEXT_PUBLIC_…` expressions, because the
 * bundler replaces that exact text at build time. Reading them through a
 * function would defeat the substitution and leave them undefined.
 */

import { env as workerEnv } from "cloudflare:workers";

export function serverEnv(name: string): string {
  // Trimmed on the way out. A secret typed or pasted into an interactive
  // prompt picks up a trailing newline or a carriage return depressingly
  // often, and the failure it produces says only "Invalid API key" — which
  // sends you looking at permissions rather than at whitespace.
  const binding = (workerEnv as unknown as Record<string, unknown> | undefined)?.[name];
  if (typeof binding === "string" && binding.trim()) return binding.trim();
  const fromProcess = typeof process !== "undefined" ? process.env?.[name] : undefined;
  return (fromProcess || "").trim();
}

/** Which source answered, for diagnostics. Returns where a value came from —
 *  never the value itself, so this is safe to put in an API response. */
export function serverEnvSource(name: string): "binding" | "process" | "none" {
  const binding = (workerEnv as unknown as Record<string, unknown> | undefined)?.[name];
  if (typeof binding === "string" && binding) return "binding";
  const fromProcess = typeof process !== "undefined" ? process.env?.[name] : undefined;
  return fromProcess ? "process" : "none";
}
