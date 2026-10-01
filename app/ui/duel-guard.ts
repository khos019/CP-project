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
 * Coming back inside the window is not free either: it is counted, shown, and
 * SPENT. The grace is one allowance for the whole duel, not one per absence.
 * Per absence, six seconds away, back, five away, back, three away was
 * fourteen seconds of reading an editorial that the rule never saw -- any
 * number of short trips added up to as long as anyone liked. Now every absence
 * draws on the same budget, and the one that takes the total past it loses.
 *
 * The total is kept per duel in sessionStorage, so reloading the page is not a
 * way to get the allowance back.
 *
 * Timers in a hidden tab are throttled, so the loss cannot be trusted to fire
 * while you are away. It is therefore checked twice — once on a timer, in case
 * the browser does run it, and once on return, by measuring how long the
 * absence actually lasted. The second check is the one that always works.
 *
 * A TAB THAT NEVER SHOWED THE DUEL DOES NOT POLICE IT. `match_found` reaches
 * every open tab of the site and each one mounts the arena. A second tab left
 * in the background used to see `document.hidden`, start the countdown the
 * moment the duel began and forfeit it ten seconds later -- while the player
 * sat in the first tab reading problem A (seven duels lost that way on
 * 2026-09-28, each about eleven seconds long, none with a submission). So a
 * tab is only "armed" once the duel has actually been on screen in it, and an
 * absence is forgiven while another tab of the site is showing the same duel
 * in the foreground: the player has not left, they are over there.
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
  /** Seconds of the duel's allowance used so far, current absence included. */
  usedSeconds: number;
  clearStray: () => void;
};

/* How old another tab's "the duel is on screen here" stamp may be and still
   count. Stamps are written once a second by a foreground tab only. */
const WATCH_FRESH_MS = 2500;

export function useTabGuard({
  active, graceMs, onLose, storageKey,
}: {
  /** Only guards while this is true — a finished duel is not a duel. */
  active: boolean;
  /** Total time away the whole duel may use, summed over every absence. */
  graceMs: number;
  onLose: (awaySeconds: number) => void;
  /** Where the running total survives a reload -- one key per duel. */
  storageKey?: string;
}): TabGuard {
  const [away, setAway] = useState(false);
  const [strays, setStrays] = useState(0);
  const [awaySeconds, setAwaySeconds] = useState(0);
  const [lastStray, setLastStray] = useState<number | null>(null);
  const [usedMs, setUsedMs] = useState(0);

  const leftAt = useRef<number | null>(null);
  const timer = useRef<number | null>(null);
  const lost = useRef(false);
  /* Milliseconds already spent by absences that have ended. */
  const spent = useRef(0);
  // Held in a ref so re-rendering the arena — which happens every second, for
  // the clock — does not tear down and rebuild the listeners underneath it.
  // Refreshed in its own effect, declared first so it is up to date before the
  // effect below can reach for it.
  const lose = useRef(onLose);
  useEffect(() => { lose.current = onLose; }, [onLose]);

  useEffect(() => {
    if (!active) return;
    lost.current = false;

    const readSpent = () => {
      if (!storageKey) return 0;
      try { return Math.max(0, Number(window.sessionStorage.getItem(storageKey)) || 0); } catch { return 0; }
    };
    const writeSpent = (ms: number) => {
      if (!storageKey) return;
      try { window.sessionStorage.setItem(storageKey, String(Math.round(ms))); } catch { /* storage blocked */ }
    };
    spent.current = readSpent();
    setUsedMs(spent.current);

    /* Which tab has the duel in front of the player right now. localStorage,
       because it is the one store every tab of the site shares; the id tells a
       tab's own stamp from somebody else's. */
    const watchKey = storageKey ? `${storageKey}:watch` : null;
    const tabId = Math.random().toString(36).slice(2);
    const stampWatching = () => {
      if (!watchKey) return;
      try { window.localStorage.setItem(watchKey, `${tabId}:${Date.now()}`); } catch { /* storage blocked */ }
    };
    const watchedElsewhere = () => {
      if (!watchKey) return false;
      try {
        const [id, at] = (window.localStorage.getItem(watchKey) || "").split(":");
        return !!id && id !== tabId && Date.now() - Number(at) < WATCH_FRESH_MS;
      } catch { return false; }
    };
    // Armed once the duel has been on screen here. A tab that mounted in the
    // background has shown the player nothing, so it has nothing to enforce.
    let armed = !document.hidden;

    const give = (seconds: number) => {
      if (lost.current) return;
      lost.current = true;
      lose.current(seconds);
    };

    const startTimer = () => {
      // Best effort: a hidden tab's timers are throttled and this may fire late
      // or not at all. `back()` is what actually guarantees the rule.
      // It fires when what is LEFT of the allowance runs out.
      timer.current = window.setTimeout(() => {
        // The player is in another tab of this same duel: nothing was spent,
        // and the absence starts over from now.
        if (watchedElsewhere()) {
          if (leftAt.current !== null) leftAt.current = Date.now();
          startTimer();
          return;
        }
        writeSpent(graceMs);
        give(Math.round(graceMs / 1000));
      }, Math.max(1000, graceMs - spent.current));
    };

    const leave = () => {
      if (!armed || leftAt.current !== null || lost.current) return;
      leftAt.current = Date.now();
      setAway(true);
      setAwaySeconds(0);
      startTimer();
    };

    const back = () => {
      armed = true;
      const at = leftAt.current;
      leftAt.current = null;
      setAway(false);
      if (timer.current !== null) { window.clearTimeout(timer.current); timer.current = null; }
      if (at === null || lost.current) return;
      // Came here straight from another tab that was showing this duel.
      if (watchedElsewhere()) { stampWatching(); return; }
      const gone = Date.now() - at;
      spent.current += gone;
      writeSpent(spent.current);
      setUsedMs(spent.current);
      if (spent.current >= graceMs) give(Math.round(spent.current / 1000));
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
      if (leftAt.current !== null) {
        const now = Date.now() - leftAt.current;
        setAwaySeconds(Math.round(now / 1000));
        setUsedMs(spent.current + now);
      } else if (armed && !document.hidden && document.hasFocus()) {
        stampWatching();
      }
    }, 1000);

    // A reload that lands with the allowance already gone.
    if (spent.current >= graceMs) give(Math.round(spent.current / 1000));

    // Mounted in the foreground: say so at once rather than a second from now,
    // so a background tab's first look already finds this one watching.
    if (armed && document.hasFocus()) stampWatching();

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      window.clearInterval(tick);
      if (timer.current !== null) { window.clearTimeout(timer.current); timer.current = null; }
      leftAt.current = null;
    };
  }, [active, graceMs, storageKey]);

  return {
    away, strays, awaySeconds, lastStray, usedSeconds: Math.round(usedMs / 1000),
    clearStray: () => setLastStray(null),
  };
}
