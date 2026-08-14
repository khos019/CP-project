type SupabaseMode = "anon" | "user" | "service";

export type UserRole = "user" | "admin" | "owner";

export type AuthenticatedProfile = {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  preferred_language: "uz" | "en";
  role: UserRole;
  duel_rating: number;
  peak_duel_rating: number;
  solved_count: number;
  onboarding_completed_at: string | null;
  suspended_until: string | null;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string,
  ) {
    super(message);
  }
}

function supabaseUrl() {
  return (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
}

function anonKey() {
  return process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

function serviceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl() && anonKey());
}

export function hasServiceRoleConfig() {
  return Boolean(supabaseUrl() && serviceRoleKey());
}

function credentials(mode: SupabaseMode, token?: string) {
  const url = supabaseUrl();
  const anon = anonKey();
  if (!url || !anon) {
    throw new ApiError(503, "Supabase is not configured.", "SUPABASE_NOT_CONFIGURED");
  }

  if (mode === "service") {
    const service = serviceRoleKey();
    if (!service) {
      throw new ApiError(503, "Supabase service role is not configured.", "SERVICE_ROLE_NOT_CONFIGURED");
    }
    return { url, apiKey: service, authorization: `Bearer ${service}` };
  }

  if (mode === "user") {
    if (!token) throw new ApiError(401, "Authentication required.", "AUTH_REQUIRED");
    return { url, apiKey: anon, authorization: `Bearer ${token}` };
  }

  return { url, apiKey: anon, authorization: `Bearer ${anon}` };
}

type SupabaseRequest = {
  mode?: SupabaseMode;
  token?: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  prefer?: string;
  headers?: Record<string, string>;
};

export async function supabaseRequest<T>(path: string, options: SupabaseRequest = {}): Promise<T> {
  const mode = options.mode || "anon";
  const { url, apiKey, authorization } = credentials(mode, options.token);
  const response = await fetch(`${url}${path}`, {
    method: options.method || "GET",
    headers: {
      apikey: apiKey,
      Authorization: authorization,
      "content-type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {}),
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string; error_description?: string; code?: string } | null;
    throw new ApiError(
      response.status,
      payload?.message || payload?.error_description || `Supabase request failed (${response.status}).`,
      payload?.code || "SUPABASE_REQUEST_FAILED",
    );
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

function bearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || "";
}

export async function requireProfile(request: Request): Promise<{ token: string; profile: AuthenticatedProfile }> {
  const token = bearerToken(request);
  if (!token) throw new ApiError(401, "Authentication required.", "AUTH_REQUIRED");

  const account = await supabaseRequest<{ id?: string; email?: string }>("/auth/v1/user", {
    mode: "user",
    token,
  });
  if (!account.id) throw new ApiError(401, "Invalid session.", "INVALID_SESSION");

  const rows = await supabaseRequest<Array<Omit<AuthenticatedProfile, "email">>>(
    `/rest/v1/profiles?id=eq.${encodeURIComponent(account.id)}&select=id,username,display_name,avatar_url,preferred_language,role,duel_rating,peak_duel_rating,solved_count,onboarding_completed_at,suspended_until&limit=1`,
    { mode: "user", token },
  );
  const row = rows[0];
  if (!row) throw new ApiError(403, "Profile is unavailable.", "PROFILE_NOT_FOUND");
  if (row.suspended_until && new Date(row.suspended_until).getTime() > Date.now()) {
    throw new ApiError(403, "Account is suspended.", "ACCOUNT_SUSPENDED");
  }

  return { token, profile: { ...row, email: account.email || "" } };
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json({ error: error.message, code: error.code }, { status: error.status });
  }
  console.error("Unhandled API error", error);
  return Response.json({ error: "Unexpected server error.", code: "INTERNAL_ERROR" }, { status: 500 });
}

export async function enforceRateLimit(key: string, limit: number, windowSeconds: number) {
  const allowed = await supabaseRequest<boolean>("/rest/v1/rpc/consume_rate_limit", {
    mode: "service",
    method: "POST",
    body: { p_key: key, p_limit: limit, p_window_seconds: windowSeconds },
  });
  if (!allowed) throw new ApiError(429, "Too many requests. Try again shortly.", "RATE_LIMITED");
}
