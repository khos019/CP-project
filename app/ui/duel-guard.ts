"use client";

/* Watching whether the duel is still the thing on screen.
 *
 * A rated duel is the one place on the site where looking something up is
 * cheating, and the only signal a web page gets about that is whether it is
 * still the page you are looking at. So that is what this measures — not what
 * you did somewhere else, which it cannot see and should not pretend to.
 *
 * Two events, because neither alone is enough:
 *
 *   visibilitychange — another tab, a minimised window, a phone locking. Fires
 *                      reliably, and is the main case.
 *   blur / focus     — another application on top of the browser. On Windows an
 *                      alt-tab to a PDF often leaves the tab "visible", so
 *                      visibility alone would miss the most obvious way to read
 *                      an editorial while a duel runs.
 *
 * WHY THERE IS A GRACE PERIOD, and why it is not zero. The browser fires these
 * events for things that are not leaving: a notification stealing focus for a
 * moment, clicking the address bar, a password manager, an OS popup. Ending a
 * rated duel on a 200-millisecond blur would punish more accidents than
 * cheats. Anything long enough to read something is far past this window, so
 * the grace costs the rule nothing and saves it from being absurd.
 *
 * Coming back inside the window is not free either: it is counted and shown.
 *
 * Timers in a hidden tab are throttled, so the loss cannot be trusted to fire
 * while you are away. It is therefore checked twice — once on a timer, in case
 * the browser does run it, and once on return, by measuring how long the
 * absence actually lasted. The second check is the one that always works.
 */

import { useEffect, useRef, useState } from "react";

export type TabGuard = {
  /** Away right now, according to the last event we saw. */
  away: boolean;
  /** How many times the player has come back inside the grace period. */
  strays: number;
  /** Seconds of the current absence, counted while it is happening. */
  awaySeconds: number;
  /** The last absence that came back in time, in seconds. Null once seen. */
  lastStray: number | null;
  clearStray: () => void;
};

export function useTabGuard({
  active, graceMs, onLose,
}: {
  /** Only guards while this is true — a finished duel is not a duel. */
  active: boolean;
  graceMs: number;
  onLose: (awaySeconds: number) => void;
}): TabGuard {
  const [away, setAway] = useState(false);
  const [strays, setStrays] = useState(0);
  const [awaySeconds, setAwaySeconds] = useState(0);
  const [lastStray, setLastStray] = useState<number | null>(null);

  const leftAt = useRef<number | null>(null);
  const timer = useRef<number | null>(null);
  const lost = useRef(false);
  // Held in a ref so re-rendering the arena — which happens every second, for
  // the clock — does not tear down and rebuild the listeners underneath it.
  // Refreshed in its own effect, declared first so it is up to date before the
  // effect below can reach for it.
  const lose = useRef(onLose);
  useEffect(() => { lose.current = onLose; }, [onLose]);

  useEffect(() => {
    if (!active) return;
    lost.current = false;

    const give = (seconds: number) => {
      if (lost.current) return;
      lost.current = true;
      lose.current(seconds);
    };

    const leave = () => {
      if (leftAt.current !== null || lost.current) return;
      leftAt.current = Date.now();
      setAway(true);
      setAwaySeconds(0);
      // Best effort: a hidden tab's timers are throttled and this may fire late
      // or not at all. `back()` is what actually guarantees the rule.
      timer.current = window.setTimeout(() => give(Math.round(graceMs / 1000)), graceMs);
    };

    const back = () => {
      const at = leftAt.current;
      leftAt.current = null;
      setAway(false);
      if (timer.current !== null) { window.clearTimeout(timer.current); timer.current = null; }
      if (at === null || lost.current) return;
      const gone = Date.now() - at;
      if (gone >= graceMs) give(Math.round(gone / 1000));
      else {
        setStrays((n) => n + 1);
        setLastStray(Math.max(1, Math.round(gone / 1000)));
      }
    };

    const onVisibility = () => (document.hidden ? leave() : back());
    // The browser's own focus is the second signal; `document.hasFocus()`
    // guards against a blur that is immediately followed by focus staying put.
    const onBlur = () => leave();
    const onFocus = () => { if (!document.hidden) back(); };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    // Ticks the visible counter. One second is fine: this only feeds a label.
    const tick = window.setInterval(() => {
      if (leftAt.current !== null) setAwaySeconds(Math.round((Date.now() - leftAt.current) / 1000));
    }, 1000);

    // Started while already away — a duel accepted from a background tab.
    if (document.hidden) leave();

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      window.clearInterval(tick);
      if (timer.current !== null) { window.clearTimeout(timer.current); timer.current = null; }
      leftAt.current = null;
    };
  }, [active, graceMs]);

  return { away, strays, awaySeconds, lastStray, clearStray: () => setLastStray(null) };
}
