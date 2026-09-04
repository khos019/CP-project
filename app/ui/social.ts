"use client";

/* Friends, and the submission history behind them.
 *
 * Both live on the server rather than in the browser, because both are about
 * other people: a friend list that only exists on one device is a bookmark,
 * and a submission history nobody else can see is not a history.
 *
 * The source code of a submission is the one thing this module cannot fetch by
 * itself. It comes back only from submission_code / unlock_submission
 * (migration 015), which decide per caller whether it may be read at all.
 */

import { readToken, supabaseConfig } from "./session";

export type FriendRow = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  duel_rating: number;
  solved_count: number;
  since: string;
};

export type SubmissionRow = {
  id: string;
  problem_key: string;
  problem_title: string;
  language: "cpp20" | "python3";
  verdict: string;
  runtime_ms: number | null;
  memory_kb: number | null;
  passed: number | null;
  total: number | null;
  created_at: string;
  /** The server has already decided whether this viewer may read the source. */
  readable: boolean;
};

export type CodeResult =
  | { state: "ok"; source: string; language: string; charged?: number }
  | { state: "locked"; cost: number; balance: number }
  | { state: "insufficient"; }
  | { state: "signed-out" }
  | { state: "offline" };

const auth = (path: string) => {
  const { url, key } = supabaseConfig();
  const token = readToken();
  if (!url || !key || !token) return null;
  return {
    url: `${url}/rest/v1/${path}`,
    headers: { apikey: key, Authorization: `Bearer ${token}`, "content-type": "application/json" },
  };
};
const open = (path: string) => {
  const { url, key } = supabaseConfig();
  if (!url || !key) return null;
  const token = readToken();
  const headers: Record<string, string> = { apikey: key, "content-type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return { url: `${url}/rest/v1/${path}`, headers };
};

// ------------------------------------------------------------------- friends
/** The people this account follows, newest first. Null when signed out. */
export async function fetchFriends(): Promise<FriendRow[] | null> {
  const r = auth("friends?select=created_at,profiles!friends_friend_id_fkey(id,username,display_name,avatar_url,duel_rating,solved_count)&order=created_at.desc");
  if (!r) return null;
  try {
    const res = await fetch(r.url, { headers: r.headers });
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{ created_at: string; profiles: Omit<FriendRow, "since"> | null }>;
    if (!Array.isArray(rows)) return null;
    return rows
      .filter((row) => row.profiles)
      .map((row) => ({ ...(row.profiles as Omit<FriendRow, "since">), since: row.created_at }));
  } catch {
    return null;
  }
}

/** Just the ids, for deciding whether a star is lit. */
export async function fetchFriendIds(): Promise<Set<string> | null> {
  const r = auth("friends?select=friend_id");
  if (!r) return null;
  try {
    const res = await fetch(r.url, { headers: r.headers });
    if (!res.ok) return null;
    const rows = (await res.json()) as { friend_id: string }[];
    return new Set(rows.map((x) => x.friend_id));
  } catch {
    return null;
  }
}

export async function addFriend(friendId: string): Promise<boolean> {
  const r = auth("friends");
  if (!r) return false;
  try {
    const res = await fetch(r.url, {
      method: "POST",
      // Adding somebody already on the list is not an error, it is a no-op.
      headers: { ...r.headers, Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify({ friend_id: friendId }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function removeFriend(friendId: string): Promise<boolean> {
  const r = auth(`friends?friend_id=eq.${encodeURIComponent(friendId)}`);
  if (!r) return false;
  try {
    const res = await fetch(r.url, { method: "DELETE", headers: r.headers });
    return res.ok;
  } catch {
    return false;
  }
}

// --------------------------------------------------------------- submissions
/** Somebody's history. Readable by anyone; the code is not part of it.
    "not-migrated" is kept apart from a failure: a database still on 014 has no
    history to give, which is a different sentence from "we could not load it". */
export async function fetchSubmissions(
  userId: string,
  limit = 50,
): Promise<SubmissionRow[] | "not-migrated" | null> {
  const r = open("rpc/user_submissions");
  if (!r) return null;
  try {
    const res = await fetch(r.url, {
      method: "POST",
      headers: r.headers,
      body: JSON.stringify({ p_user: userId, p_limit: limit }),
    });
    // PostgREST answers 404/PGRST202 when the function is not in the schema.
    if (res.status === 404) return "not-migrated";
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? (rows as SubmissionRow[]) : null;
  } catch {
    return null;
  }
}

/** Records a verdict against the account. Silently does nothing when signed
    out — a guest has no history to keep, and their work stays local. */
export async function recordSubmission(entry: {
  problemKey: string;
  problemTitle: string;
  language: "cpp20" | "python3";
  verdict: string;
  runtimeMs?: number | null;
  memoryKb?: number | null;
  passed?: number | null;
  total?: number | null;
  source: string;
}): Promise<boolean> {
  const r = auth("bank_submissions");
  if (!r) return false;
  try {
    const res = await fetch(r.url, {
      method: "POST",
      headers: { ...r.headers, Prefer: "return=minimal" },
      body: JSON.stringify({
        problem_key: entry.problemKey,
        problem_title: entry.problemTitle,
        language: entry.language,
        verdict: entry.verdict,
        runtime_ms: entry.runtimeMs ?? null,
        memory_kb: entry.memoryKb ?? null,
        passed: entry.passed ?? null,
        total: entry.total ?? null,
        source_code: entry.source,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* My own submissions for one problem, newest first.
 *
 * This reads bank_submissions directly rather than going through
 * user_submissions: RLS on that table already restricts every row to its
 * author, so the source code comes back with the row and the problem page can
 * show "what I sent last time" without a request per entry. Nobody else's code
 * is reachable this way — the paywalled RPCs stay the only door to that. */
export type OwnSubmissionRow = {
  id: string;
  problem_key: string;
  problem_title: string;
  language: "cpp20" | "python3";
  verdict: string;
  runtime_ms: number | null;
  memory_kb: number | null;
  passed: number | null;
  total: number | null;
  created_at: string;
  source_code: string;
};

const OWN_COLUMNS = "id,problem_key,problem_title,language,verdict,runtime_ms,memory_kb,passed,total,created_at,source_code";

export async function fetchMySubmissionsFor(
  problemKey: string,
  limit = 25,
): Promise<OwnSubmissionRow[] | "not-migrated" | null> {
  const r = auth(
    `bank_submissions?problem_key=eq.${encodeURIComponent(problemKey)}&select=${OWN_COLUMNS}` +
      `&order=created_at.desc&limit=${limit}`,
  );
  if (!r) return null;
  try {
    const res = await fetch(r.url, { headers: r.headers });
    if (res.status === 404) return "not-migrated";
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? (rows as OwnSubmissionRow[]) : null;
  } catch {
    return null;
  }
}

/** Every problem this account has ever sent something for, and how it went.
    The map the problems list colours itself from — solved beats attempted, and
    it is the account's answer, so it survives a sign-out on any device. */
export async function fetchMyProblemStatuses(): Promise<Record<string, "solved" | "attempted"> | null> {
  const r = auth("bank_submissions?select=problem_key,verdict&limit=2000");
  if (!r) return null;
  try {
    const res = await fetch(r.url, { headers: r.headers });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows)) return null;
    const map: Record<string, "solved" | "attempted"> = {};
    for (const row of rows as Array<{ problem_key?: string; verdict?: string }>) {
      const key = row.problem_key;
      if (!key) continue;
      if (row.verdict === "ACCEPTED") map[key] = "solved";
      else if (map[key] !== "solved") map[key] = "attempted";
    }
    return map;
  } catch {
    return null;
  }
}

type CodeReply = { ok?: boolean; reason?: string; source?: string; language?: string; cost?: number; balance?: number; charged?: number };

const readCode = async (path: string, id: string): Promise<CodeResult> => {
  const r = auth(path);
  if (!r) return { state: "signed-out" };
  try {
    const res = await fetch(r.url, { method: "POST", headers: r.headers, body: JSON.stringify({ p_id: id }) });
    if (!res.ok) {
      const detail = (await res.json().catch(() => ({}))) as { message?: string };
      const message = String(detail.message || "");
      if (message.includes("insufficient_coins")) return { state: "insufficient" };
      if (message.includes("not_authenticated")) return { state: "signed-out" };
      return { state: "offline" };
    }
    const body = (await res.json()) as CodeReply;
    if (body.ok && typeof body.source === "string") {
      return { state: "ok", source: body.source, language: String(body.language || ""), charged: body.charged };
    }
    if (body.reason === "locked") {
      return { state: "locked", cost: Number(body.cost || 0), balance: Number(body.balance || 0) };
    }
    if (body.reason === "not_authenticated") return { state: "signed-out" };
    return { state: "offline" };
  } catch {
    return { state: "offline" };
  }
};

/** Reads the source if this viewer already may; otherwise reports the price. */
export const fetchSubmissionCode = (id: string) => readCode("rpc/submission_code", id);
/** Pays for the source. Free cases are answered, not charged. */
export const unlockSubmissionCode = (id: string) => readCode("rpc/unlock_submission", id);
