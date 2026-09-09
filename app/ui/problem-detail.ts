"use client";

/* Fetching one problem's statement.
 *
 * The bank is split in two: app/ui/problem-bank.ts is the index every screen
 * needs bundled, and the prose — legend, statement, input, output, constraints,
 * samples, sample notes — is served per problem by /api/problem. This module is
 * the client half of that arrangement, and it exists so the problem page and
 * the duel arena share one cache instead of each growing their own.
 *
 * Two things it is careful about:
 *
 *   - A statement never changes while the tab is open, so once fetched it is
 *     kept for the life of the page. Going back to the list and reopening the
 *     same problem is instant, and so is switching language, which used to be
 *     free only because the whole bank was already in memory.
 *   - Two components asking for the same id at the same moment — the duel
 *     renders the statement and the run panel from it — share one request
 *     rather than racing two.
 */

import { useEffect, useState } from "react";
import type { ProblemDetail } from "./problem-bank";

/* The statement of a problem is cached by the browser for a day
   (`cache-control: max-age=86400` on /api/problem), which is right for prose
   that almost never changes -- and wrong on the day it does: a reader who had
   opened a problem would keep the old wording for another 24 hours. So the
   request carries the revision of the prose, and rewriting the statements
   means bumping it. The number is part of the URL, so a new revision is a new
   cache entry and the old one simply expires unused.

   2 -- the legend paragraph was removed from all 302 problems and every
   statement was rewritten to explain its task on its own. */
const PROSE_REVISION = 2;

const cache = new Map<string, ProblemDetail>();
const inFlight = new Map<string, Promise<ProblemDetail | null>>();

/** The statement for `id`, or null if it could not be fetched. Resolved from
    memory when this page has already asked for it. */
export function fetchProblemDetail(id: string): Promise<ProblemDetail | null> {
  const held = cache.get(id);
  if (held) return Promise.resolve(held);

  const running = inFlight.get(id);
  if (running) return running;

  const request = (async () => {
    try {
      const response = await fetch(`/api/problem?id=${encodeURIComponent(id)}&r=${PROSE_REVISION}`);
      if (!response.ok) return null;
      const detail = (await response.json()) as ProblemDetail;
      cache.set(id, detail);
      return detail;
    } catch {
      return null;
    } finally {
      inFlight.delete(id);
    }
  })();

  inFlight.set(id, request);
  return request;
}

export type DetailState =
  | { status: "loading"; detail: undefined }
  | { status: "ready"; detail: ProblemDetail }
  | { status: "failed"; detail: undefined };

/* The three states are spelled out rather than collapsed into `detail | null`
   because the page renders each differently: a spinner, the statement, and a
   "could not load" notice are not the same screen, and a problem whose prose
   is genuinely empty is not a failure.

   The state is derived from the cache during render rather than copied into
   `useState`, so a statement that has already been fetched is returned on the
   first render — reopening a problem, or switching language, does not flash a
   spinner at somebody who is re-reading a statement they already have. The one
   thing that does need state is the failure, because a fetch that came back
   empty leaves nothing in the cache to derive from; it is held per mount, so
   leaving the page and coming back retries rather than showing the same error
   for the rest of the session.

   `id` may be null: the duel asks for its round's problem, and there is a
   render before the round is known. That reads as "loading", which is what it
   is — the caller has nothing to show either way. */
export function useProblemDetail(id: string | null): DetailState {
  const [settled, setSettled] = useState<{ id: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!id || cache.has(id)) return;
    let live = true;
    void fetchProblemDetail(id).then(detail => {
      // A fresh object every time, so a resolved fetch always re-renders — the
      // interesting change is in the cache, which React cannot see.
      if (live) setSettled({ id, ok: detail !== null });
    });
    return () => { live = false; };
  }, [id]);

  const held = id ? cache.get(id) : undefined;
  if (held) return { status: "ready", detail: held };
  if (id && settled?.id === id && !settled.ok) return { status: "failed", detail: undefined };
  return { status: "loading", detail: undefined };
}
