"use client";

// Roadmap progress storage.
//
// Signed in, with migration 006 applied, progress lives on the account. In
// every other case (signed out, Supabase unconfigured, table not migrated yet,
// network down) it falls back to localStorage. The fallback is deliberate:
// losing a learner's quiz history because a request failed is worse than
// keeping a device-local copy.

export type Progress = { quizScores: Record<string, number>; solved: Record<string, boolean> };
export const emptyProgress: Progress = { quizScores: {}, solved: {} };

const KEY = "algoyol-roadmap-progress";
const config = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
const token = () => (typeof window === "undefined" ? null : sessionStorage.getItem("algoyol-access-token"));

export function readLocal(): Progress {
  if (typeof window === "undefined") return emptyProgress;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return { quizScores: raw.quizScores || {}, solved: raw.solved || {} };
  } catch {
    return emptyProgress;
  }
}

export function writeLocal(next: Progress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

// null means "the account copy is unavailable" — callers keep their local copy.
export async function fetchRemote(): Promise<Progress | null> {
  const { url, key } = config();
  const auth = token();
  if (!url || !key || !auth) return null;
  try {
    const response = await fetch(`${url}/rest/v1/unit_progress?select=unit_slug,quiz_score,solved`, {
      headers: { apikey: key, Authorization: `Bearer ${auth}` },
    });
    if (!response.ok) return null; // includes 404 before migration 006 is applied
    const rows = (await response.json()) as { unit_slug: string; quiz_score: number; solved: boolean }[];
    if (!Array.isArray(rows)) return null;
    const next: Progress = { quizScores: {}, solved: {} };
    for (const row of rows) {
      if (row.quiz_score) next.quizScores[row.unit_slug] = row.quiz_score;
      if (row.solved) next.solved[row.unit_slug] = true;
    }
    return next;
  } catch {
    return null;
  }
}

export async function pushUnit(unitSlug: string, patch: { quizScore?: number; solved?: boolean }): Promise<boolean> {
  const { url, key } = config();
  const auth = token();
  if (!url || !key || !auth) return false;
  const body: Record<string, unknown> = { unit_slug: unitSlug };
  if (patch.quizScore !== undefined) body.quiz_score = patch.quizScore;
  if (patch.solved !== undefined) body.solved = patch.solved;
  try {
    const response = await fetch(`${url}/rest/v1/unit_progress`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${auth}`,
        "content-type": "application/json",
        // upsert on the (user_id, unit_slug) primary key
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(body),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Local wins on conflict: it is the copy the learner just produced.
export function mergeProgress(local: Progress, remote: Progress): Progress {
  return {
    quizScores: { ...remote.quizScores, ...local.quizScores },
    solved: { ...remote.solved, ...local.solved },
  };
}

// Called once after sign-in so work done while signed out is not stranded
// on the device.
export async function syncUp(local: Progress) {
  const slugs = new Set([...Object.keys(local.quizScores), ...Object.keys(local.solved)]);
  for (const slug of slugs) {
    await pushUnit(slug, { quizScore: local.quizScores[slug] || 0, solved: !!local.solved[slug] });
  }
}

// Load the effective progress: account copy merged over the local cache.
export async function loadProgress(): Promise<Progress> {
  const local = readLocal();
  const remote = await fetchRemote();
  if (!remote) return local;
  const merged = mergeProgress(local, remote);
  writeLocal(merged);
  return merged;
}

export async function saveUnit(current: Progress, unitSlug: string, patch: { quizScore?: number; solved?: boolean }): Promise<Progress> {
  const next: Progress = {
    quizScores: { ...current.quizScores },
    solved: { ...current.solved },
  };
  if (patch.quizScore !== undefined) next.quizScores[unitSlug] = patch.quizScore;
  if (patch.solved !== undefined) next.solved[unitSlug] = patch.solved;
  writeLocal(next);
  void pushUnit(unitSlug, patch);
  return next;
}
