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
 * Timers in a hidden tab are throttled, so the loss cannot be trusted to fire
 * while you are away. It is therefore checked twice — once on a timer, in case
 * the browser does run it, and once on return, by measuring how long the
 * absence actually lasted. The second check is the one that always works.
 *
 * ONE TAB PLAYS THE DUEL. `match_found` reaches every open tab of the site and
 * each one mounts the arena. A tab that mounted in the background has shown the
 * player nothing, so it claims nothing (seven duels were once forfeited by a
 * background tab counting down while the player sat in the other one). Until
 * 2026-10-04 every tab that had shown the duel policed it with its own
 * allowance in sessionStorage, and an absence was forgiven while another tab
 * showed the same duel -- so two tabs meant two allowances, and a hop through
 * another site on the way between them could be free. Now the first tab the
 * duel is on screen in owns it. Every other tab says "the duel is open in
 * another tab" and polices nothing, which makes it just another place that is
 * not the duel: time there is spent like time on any other site. Moving the
 * duel is an explicit take-over, and the take-over charges whatever absence
 * the old owner had open, so it is never a way out.
 *
 * Owner, allowance spent and the open absence live in localStorage under one
 * key per duel -- the one store every tab shares, and one that survives a
 * reload or a closed tab, so neither gives the allowance back. A reload does
 * spend the second or two it takes: the duel was not on screen for it.
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
  /** The duel is being played in another tab; this one only says so. */
  elsewhere: boolean;
  /** Move the duel to this tab. Charges any absence the old owner had open. */
  takeOver: () => void;
  clearStray: () => void;
};

/* What every tab of the site agrees on about one duel. */
type Shared = {
  /** The tab playing the duel, or null when none holds it (yet, or since it closed). */
  owner: string | null;
  /** Milliseconds of allowance spent by absences that have ended. */
  spent: number;
  /** When the owner's current absence began; null while it is on screen. */
  leftAt: number | null;
};

export function useTabGuard({
  active, graceMs, onLose, storageKey,
}: {
  /** Only guards while this is true — a finished duel is not a duel. */
  active: boolean;
  /** Total time away the whole duel may use, summed over every absence. */
  graceMs: number;
  onLose: (awaySeconds: number) => void;
  /** Where the shared state lives, in localStorage -- one key per duel. */
  storageKey?: string;
}): TabGuard {
  const [away, setAway] = useState(false);
  const [strays, setStrays] = useState(0);
  const [awaySeconds, setAwaySeconds] = useState(0);
  const [lastStray, setLastStray] = useState<number | null>(null);
  const [usedMs, setUsedMs] = useState(0);
  const [elsewhere, setElsewhere] = useState(false);

  const leftAt = useRef<number | null>(null);
  const timer = useRef<number | null>(null);
  const lost = useRef(false);
  /* Milliseconds already spent by absences that have ended. */
  const spent = useRef(0);
  const claimRef = useRef<() => void>(() => {});
  // Held in a ref so re-rendering the arena — which happens every second, for
  // the clock — does not tear down and rebuild the listeners underneath it.
  // Refreshed in its own effect, declared first so it is up to date before the
  // effect below can reach for it.
  const lose = useRef(onLose);
  useEffect(() => { lose.current = onLose; }, [onLose]);

  useEffect(() => {
    if (!active) return;
    lost.current = false;

    // Per page load, not per tab: a duplicated tab copies sessionStorage, and
    // two tabs answering to one id would both believe they own the duel.
    const tabId = Math.random().toString(36).slice(2);
    let mine = false;
    let memory: Shared = { owner: null, spent: 0, leftAt: null };

    const read = (): Shared => {
      if (!storageKey) return { ...memory };
      try {
        const v = JSON.parse(window.localStorage.getItem(storageKey) || "null");
        if (v && typeof v === "object") {
          return {
            owner: typeof v.owner === "string" ? v.owner : null,
            spent: Math.max(0, Number(v.spent) || 0),
            leftAt: typeof v.leftAt === "number" ? v.leftAt : null,
          };
        }
      } catch { /* storage blocked or garbled */ }
      return { ...memory };
    };
    const write = (v: Shared) => {
      memory = v;
      if (!storageKey) return;
      try { window.localStorage.setItem(storageKey, JSON.stringify(v)); } catch { /* storage blocked */ }
    };

    const give = (seconds: number) => {
      if (lost.current) return;
      lost.current = true;
      lose.current(seconds);
    };

    const stopTimer = () => {
      if (timer.current !== null) { window.clearTimeout(timer.current); timer.current = null; }
    };

    // Another tab took the duel: this one stops policing and says where it went.
    const release = () => {
      mine = false;
      stopTimer();
      leftAt.current = null;
      setAway(false);
      setElsewhere(true);
    };

    const claim = () => {
      const s = read();
      // Whatever absence the previous owner left open is spent now: from the
      // moment it began until this tab took over, the duel was on no screen.
      if (s.leftAt !== null) s.spent += Math.max(0, Date.now() - s.leftAt);
      write({ owner: tabId, spent: s.spent, leftAt: null });
      mine = true;
      stopTimer();
      leftAt.current = null;
      spent.current = s.spent;
      setUsedMs(s.spent);
      setAway(false);
      setElsewhere(false);
      if (s.spent >= graceMs) give(Math.round(s.spent / 1000));
    };
    claimRef.current = claim;

    const stillMine = () => {
      if (!mine) return false;
      if (read().owner === tabId) return true;
      release();
      return false;
    };

    const startTimer = () => {
      // Best effort: a hidden tab's timers are throttled and this may fire late
      // or not at all. `back()` is what actually guarantees the rule.
      // It fires when what is LEFT of the allowance runs out.
      timer.current = window.setTimeout(() => {
        timer.current = null;
        if (!stillMine() || leftAt.current === null) return;
        const total = spent.current + (Date.now() - leftAt.current);
        write({ ...read(), spent: total, leftAt: null });
        give(Math.round(total / 1000));
      }, Math.max(1000, graceMs - spent.current));
    };

    const leave = () => {
      if (!stillMine() || leftAt.current !== null || lost.current) return;
      const now = Date.now();
      leftAt.current = now;
      write({ ...read(), leftAt: now });
      setAway(true);
      setAwaySeconds(0);
      startTimer();
    };

    const back = () => {
      if (!mine) {
        // Nobody holds the duel -- it has not been seen yet, or its tab closed
        // -- so the tab the player is looking at takes it. Otherwise this tab
        // only says where the duel is.
        const s = read();
        if (s.owner === null) claim();
        else setElsewhere(s.owner !== tabId);
        return;
      }
      if (!stillMine()) return;
      stopTimer();
      const at = leftAt.current;
      leftAt.current = null;
      setAway(false);
      if (at === null || lost.current) return;
      const gone = Date.now() - at;
      const s = read();
      spent.current = s.spent + gone;
      write({ ...s, spent: spent.current, leftAt: null });
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

    // Another tab wrote: it took the duel, it closed, or it spent allowance.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      const s = read();
      if (mine) {
        if (s.owner !== tabId) release();
        return;
      }
      spent.current = s.spent;
      setUsedMs(s.spent);
      if (s.owner === null && !document.hidden) claim();
      else setElsewhere(s.owner !== null && s.owner !== tabId);
    };

    // The tab is closing or reloading. The duel goes free for the next tab to
    // claim; the absence stays open and is charged to that claim.
    const free = () => {
      const s = read();
      if (s.owner === tabId) write({ ...s, owner: null, leftAt: s.leftAt ?? Date.now() });
    };
    const onPageHide = () => { if (mine) free(); };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    window.addEventListener("pagehide", onPageHide);

    // Ticks the visible counter. One second is fine: this only feeds a label.
    const tick = window.setInterval(() => {
      if (mine && leftAt.current !== null) {
        const now = Date.now() - leftAt.current;
        setAwaySeconds(Math.round(now / 1000));
        setUsedMs(spent.current + now);
      }
    }, 1000);

    // First look. A tab that mounted in the background has shown the player
    // nothing, so it claims nothing until it is looked at.
    const first = read();
    spent.current = first.spent;
    setUsedMs(first.spent);
    if (first.owner !== null) setElsewhere(true);
    else if (!document.hidden) claim();
    // A reload that lands with the allowance already gone.
    if (first.spent >= graceMs) give(Math.round(first.spent / 1000));

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pagehide", onPageHide);
      window.clearInterval(tick);
      stopTimer();
      // Leaving the arena without leaving the tab is still leaving the duel:
      // free it for whichever tab shows it next, and charge the gap there.
      if (mine) free();
      mine = false;
      leftAt.current = null;
      claimRef.current = () => {};
    };
  }, [active, graceMs, storageKey]);

  return {
    away, strays, awaySeconds, lastStray, usedSeconds: Math.round(usedMs / 1000),
    elsewhere: active && elsewhere,
    takeOver: () => claimRef.current(),
    clearStray: () => setLastStray(null),
  };
}
