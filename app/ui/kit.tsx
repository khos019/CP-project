"use client";

import { tr } from "./i18n";

/* The small shared pieces every list and panel needs, in one place so that a
   second empty list cannot invent a second way of being empty. */

type Lang = "uz" | "en";

/* Drawn icons for empty states — one per kind of emptiness, stroked so they
   take the theme colour instead of rendering as a different emoji per OS. */
const EMPTY_ICONS = {
  trophy: <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></>,
  podium: <><path d="M9 21V9h6v12M3 21v-7h6M15 21v-5h6v5M2 21h20" /><path d="m12 3 .9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 5.1l2-.3L12 3Z" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6M8.5 11h5" /></>,
  chat: <><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" /></>,
  bag: <><path d="M5 8h14l-1 12.5H6L5 8Z" /><path d="M9 10V7a3 3 0 0 1 6 0v3" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></>,
  pulse: <><path d="M3 12h4l2.5-6 5 12 2.5-6h4" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.5A6.5 6.5 0 0 1 21.5 20" /></>,
  sparkle: <><path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z" /><path d="M19 16.5c.25 1.4.9 2.1 2.3 2.3-1.4.25-2.05.9-2.3 2.3-.25-1.4-.9-2.05-2.3-2.3 1.4-.2 2.05-.9 2.3-2.3Z" /></>,
  map: <><path d="m9 4-6 2.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4Z" /><path d="M9 4v13.5M15 6.5V20" /></>,
} as const;
export type EmptyIcon = keyof typeof EMPTY_ICONS;

/* An empty list that only says "nothing here" has wasted the one moment when
   the learner is definitely looking at it. Every empty state names the way
   out. `compact` is for an empty list inside a panel that already has its
   own frame and heading. */
export function EmptyState({
  lang, icon = "search", title, body, action, compact = false,
}: {
  lang: Lang; icon?: EmptyIcon; title: string; body?: string;
  action?: { label: string; onClick: () => void; secondary?: boolean };
  compact?: boolean;
}) {
  return (
    <div className={`empty${compact ? " empty-compact" : ""}`}>
      <span className="empty-ic" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          {EMPTY_ICONS[icon]}
        </svg>
      </span>
      <h3>{title}</h3>
      {body && <p className="muted">{body}</p>}
      {action && <button className={action.secondary ? "secondary" : "primary"} onClick={action.onClick}>{action.label}</button>}
      {!action && <span className="sr-only">{tr(lang,"kit.bosh")}</span>}
    </div>
  );
}

/* A skeleton rather than a spinner: a spinner says "wait", a skeleton says
   "here is the shape of what is coming", and on a slow Uzbek mobile connection
   the difference is whether the page looks broken. */
export function Skeleton({ rows = 3, height = 52 }: { rows?: number; height?: number }) {
  return (
    <div className="skeleton-list" aria-hidden>
      {Array.from({ length: rows }, (_, i) => (
        <div className="skeleton" key={i} style={{ height }} />
      ))}
    </div>
  );
}

export function ProgressBar({ done, total, tone = "green" }: { done: number; total: number; tone?: "green" | "orange" }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <span className={`bar-fill bar-${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* Badge lived here: a component nobody imported, whose .badge/.badge-* rules
   were never written either. It would have rendered as unstyled text the first
   time somebody reached for it, which is worse than not having it. */
