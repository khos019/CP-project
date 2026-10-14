/* The one way the browser reaches /api/judge.
 *
 * The route asks for a signed-in session and keeps a per-account budget (see
 * app/api/_lib/guard.ts), so every caller has to send the token and every
 * caller has to be able to say "sign in" or "slow down" in words a learner
 * understands rather than printing `rate_limited`. */

import { ensureFreshToken } from "./session";

type Lang = "uz" | "en";

/** POSTs to /api/judge with the learner's token. A missing session is answered
 *  locally with the same 401 the server would give, without a round trip. */
export async function judgeFetch(body: Record<string, unknown>): Promise<Response> {
  const token = await ensureFreshToken();
  if (!token) return new Response(JSON.stringify({ error: "not_authenticated" }), { status: 401 });
  return fetch("/api/judge", {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}

/** Learner-facing text for the refusals the guard can give, or null for any
 *  other status — those carry their own message. */
export function judgeRefusal(status: number, lang: Lang): string | null {
  if (status === 401) {
    return lang === "uz"
      ? "Kodni ishga tushirish uchun hisobingizga kiring."
      : "Sign in to run code.";
  }
  if (status === 429) {
    return lang === "uz"
      ? "Juda ko‘p urinish. Bir daqiqadan keyin qayta urinib ko‘ring."
      : "Too many attempts. Try again in a minute.";
  }
  return null;
}
