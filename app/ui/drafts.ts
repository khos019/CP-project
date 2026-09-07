"use client";

/* Unsent code, kept across a refresh.
 *
 * Losing half an hour of work to a stray Cmd-R is the kind of thing people do
 * not forgive a judge for, and the browser gives no warning worth relying on.
 * So every keystroke in the editor is written to local storage against the
 * problem and the language it belongs to, and read back when that problem is
 * opened again.
 *
 * Local storage rather than the server, deliberately: a draft is not a
 * submission. It is unfinished, often wrong, and syncing it would mean sending
 * code the learner never chose to send. `writeScoped` already partitions by
 * account, so a shared machine does not leak one learner's draft to the next.
 *
 * A draft that matches the starter template is not stored at all — that is not
 * work, it is the blank page, and keeping it would only push real drafts out
 * of the store.
 *
 * Nothing clears a draft on an accepted verdict, deliberately: the code that
 * just passed is the code most worth finding when you come back to the
 * problem, and the starter template is one click of "select all" away.
 */
import { readScoped, writeScoped } from "./session";

export type DraftLang = "cpp20" | "python3";

const KEY = "algoyol-drafts";
/* Enough to cover a long session's worth of problems without letting the
   store grow without bound. Oldest entries are dropped first. */
const MAX_DRAFTS = 60;

type Draft = { code: string; at: number };
type Store = Record<string, Draft>;

const slot = (problemKey: string, language: DraftLang) => `${problemKey}:${language}`;

function load(): Store {
  try {
    const raw = readScoped(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

function save(store: Store) {
  const keys = Object.keys(store);
  if (keys.length > MAX_DRAFTS) {
    // Drop the least recently touched rather than an arbitrary slice: the
    // problem someone came back to should outlive one they abandoned.
    keys.sort((a, b) => (store[a]?.at || 0) - (store[b]?.at || 0));
    for (const dead of keys.slice(0, keys.length - MAX_DRAFTS)) delete store[dead];
  }
  writeScoped(KEY, JSON.stringify(store));
}

/** The stored draft for this problem and language, or null when there is none. */
export function readDraft(problemKey: string, language: DraftLang): string | null {
  if (!problemKey) return null;
  const entry = load()[slot(problemKey, language)];
  return entry && typeof entry.code === "string" ? entry.code : null;
}

/** Stores the current editor contents. Passing the starter template — or an
 *  empty editor — clears the slot instead, so "I reset it" survives a refresh
 *  just as reliably as "I wrote something". */
export function writeDraft(problemKey: string, language: DraftLang, code: string, starter: string) {
  if (!problemKey || typeof window === "undefined") return;
  const store = load();
  const key = slot(problemKey, language);
  if (!code.trim() || code === starter) delete store[key];
  else store[key] = { code, at: Date.now() };
  save(store);
}
