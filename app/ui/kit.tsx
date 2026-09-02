"use client";

/* The small shared pieces every list and panel needs, in one place so that a
   second empty list cannot invent a second way of being empty. */

type Lang = "uz" | "en";

/* An empty list that only says "nothing here" has wasted the one moment when
   the learner is definitely looking at it. Every empty state names the way
   out. */
export function EmptyState({
  lang, icon = "◦", title, body, action,
}: {
  lang: Lang; icon?: string; title: string; body: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="empty">
      <span className="empty-ic" aria-hidden>{icon}</span>
      <h3>{title}</h3>
      <p className="muted">{body}</p>
      {action && <button className="primary" onClick={action.onClick}>{action.label}</button>}
      {!action && <span className="sr-only">{lang === "uz" ? "Bo‘sh" : "Empty"}</span>}
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

/* Verdicts and difficulties carry meaning, so they never carry it in colour
   alone — the word is always there next to the hue. */
export function Badge({ kind, children }: { kind: string; children: React.ReactNode }) {
  return <span className={`badge badge-${kind}`}>{children}</span>;
}
