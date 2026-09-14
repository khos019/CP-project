"use client";

import { useSyncExternalStore } from "react";
import { THEME_KEY, type Theme } from "./theme-script";

/* The theme lives on <html data-theme>, set before first paint by the script in
   the layout. This component never owns a copy of it: it reads the attribute
   through useSyncExternalStore, so the server render (which cannot know the
   stored choice) and the hydrating client agree, and a change made in another
   tab arrives through the storage event. */

function read(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(notify: () => void) {
  const root = document.documentElement;
  const watch = new MutationObserver(notify);
  watch.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  const other = (e: StorageEvent) => {
    if (e.key === THEME_KEY) root.dataset.theme = e.newValue === "dark" ? "dark" : "light";
  };
  window.addEventListener("storage", other);
  return () => { watch.disconnect(); window.removeEventListener("storage", other); };
}

function apply(next: Theme) {
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem(THEME_KEY, next); } catch { /* private mode: the choice lasts this visit */ }
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

/* Cards, rows and links carry their own colour transitions. Left on, they kept
   easing out of the old palette after the reveal had already landed, so the
   switch looked like it arrived, paused, and then finished. While the theme
   changes nothing transitions. Released by a timer, never by animation frames
   alone: a tab hidden mid-switch gets no frames, and the class must not outlive
   the switch or every transition on the site stays off. */
function holdTransitions(root: HTMLElement, safetyMs: number) {
  root.classList.add("theme-switching");
  let done = false;
  const release = () => {
    if (done) return;
    done = true;
    window.setTimeout(() => root.classList.remove("theme-switching"), 40);
  };
  window.setTimeout(release, safetyMs);
  return release;
}

/* The new theme is revealed as a circle growing out of the button. Where view
   transitions are missing, colours cross-fade instead; with reduced motion the
   switch is instant. */
function switchTheme(from: HTMLElement) {
  const next: Theme = read() === "dark" ? "light" : "dark";
  const root = document.documentElement;
  const doc = document as ViewTransitionDoc;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const release = holdTransitions(root, 0);
    apply(next);
    release();
    return;
  }

  if (!doc.startViewTransition) {
    root.classList.add("theme-fade");
    apply(next);
    window.setTimeout(() => root.classList.remove("theme-fade"), 320);
    return;
  }

  const box = from.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const release = holdTransitions(root, 700);
  const vt = doc.startViewTransition(() => apply(next));
  vt.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      /* Even in, even out: an ease-out tail spent its last third creeping over
         the far corner, which read as a stall. */
      { duration: 380, easing: "cubic-bezier(.45,0,.55,1)", pseudoElement: "::view-transition-new(root)" },
    );
  }).catch(() => { /* transition skipped: the theme is already applied */ });
  vt.finished.finally(release);
}

export function ThemeToggle({ lang }: { lang: "uz" | "en" }) {
  const theme = useSyncExternalStore(subscribe, read, () => null);
  const uz = lang === "uz";
  const label = theme === null
    ? (uz ? "Rejimni almashtirish" : "Toggle colour theme")
    : theme === "dark"
      ? (uz ? "Kunduzgi rejimga o‘tish" : "Switch to light mode")
      : (uz ? "Tungi rejimga o‘tish" : "Switch to dark mode");

  /* Both glyphs are always rendered and CSS picks one from data-theme, so the
     right icon is already on screen in the server HTML — no icon flash. */
  return (
    <button type="button" className="theme-toggle" onClick={e => switchTheme(e.currentTarget)}
      aria-label={label} title={label}>
      <svg className="tt-sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1M5.5 5.5l1.5 1.5M17 17l1.5 1.5M5.5 18.5L7 17M17 7l1.5-1.5" />
        </g>
      </svg>
      <svg className="tt-moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path d="M20.2 14.6A8.2 8.2 0 0 1 9.4 3.8a8.2 8.2 0 1 0 10.8 10.8z" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
