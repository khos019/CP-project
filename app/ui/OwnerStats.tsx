"use client";

import { useEffect, useMemo, useState } from "react";
import { tr, catalogue } from "./i18n";
import { roadmapCatalog } from "./roadmap-data";
import { fetchOwnerStats, type OwnerStats as Stats } from "./session";

type Lang = "uz" | "en";

/* Owner dashboard.
 *
 * Every figure comes from one security-definer aggregate (migration 009, and
 * 014 for the time figures). Nothing here is estimated or extrapolated: where
 * the platform does not yet record something (source-level submissions, page
 * views) the metric is absent rather than guessed at.
 *
 * Charts are single-series on purpose. The three brand limes fail a categorical
 * palette check against each other — worst adjacent pair ΔE 5.1 under protanopia
 * and 7.7 with normal vision — so identity is carried by labels, and colour only
 * ever encodes magnitude. */
const T = catalogue("ownerStats");

const trackName = (slug: string, lang: Lang) => {
  const r = roadmapCatalog.find((x) => x.slug === slug);
  return r ? (lang === "uz" ? r.titleUz : r.titleEn) : slug;
};

const MONTHS_SHORT = {
  uz: ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
const dayLabel = (iso: string, lang: Lang) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${d.getUTCDate()} ${MONTHS_SHORT[lang][d.getUTCMonth()]}`;
};

/* Seconds are what the server banks; hours are what an owner reads. Anything
   under a minute stays in seconds rather than rounding to "0 daqiqa", which
   would make a real short visit look like no visit at all. */
const duration = (seconds: number, t: (typeof T)["uz"], lang: Lang) => {
  const s = Math.max(0, Math.round(seconds));
  const join = (n: number, unit: string) => (lang === "uz" ? `${n} ${unit}` : `${n}${unit}`);
  if (s < 60) return join(s, t.second);
  const hours = Math.floor(s / 3600);
  const minutes = Math.round((s % 3600) / 60);
  if (!hours) return join(minutes, t.minute);
  return minutes ? `${join(hours, t.hour)} ${join(minutes, t.minute)}` : join(hours, t.hour);
};

export function OwnerStats({ lang, goProfile, onPickDay }: { lang: Lang; goProfile: () => void; onPickDay: (day: string) => void }) {
  const t = T[lang];
  const [stats, setStats] = useState<Stats | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "not-migrated" | "forbidden" | "error">("loading");

  /* The read is shared by the first load and the refresh button, but only the
     button needs to announce it: on mount the screen is already in "loading",
     so setting it again was a second render that painted the same thing. */
  const read = () =>
    fetchOwnerStats().then((result) => {
      if (result.ok) {
        setStats(result.stats);
        setState("ready");
      } else {
        setState(result.error === "not-migrated" ? "not-migrated" : result.error === "forbidden" ? "forbidden" : "error");
      }
    });
  const load = () => {
    setState("loading");
    void read();
  };
  useEffect(() => {
    void read();
  }, []);

  return (
    <>
      <button className="crumb crumb-btn" onClick={goProfile}>
        ← {tr(lang,"ownerStats.profilga_qaytish")}
      </button>
      <div className="page-head">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="page-title">{t.title}</h1>
          {stats && (
            <p className="muted os-updated">
              {t.updated}: <span className="mono">{new Date(stats.generated_at).toLocaleTimeString()}</span>
            </p>
          )}
        </div>
        <div className="actions">
          <button className="secondary" onClick={load} disabled={state === "loading"}>
            {state === "loading" ? t.loading : t.refresh} ↻
          </button>
        </div>
      </div>

      {state === "loading" && (
        <div className="screen-state" role="status">
          <span className="spinner" aria-hidden />
          <p className="muted">{t.loading}</p>
        </div>
      )}
      {state === "not-migrated" && (
        <div className="panel">
          <div className="notice notice-info">{t.notMigrated}</div>
        </div>
      )}
      {state === "forbidden" && (
        <div className="panel">
          <div className="notice notice-error">{t.forbidden}</div>
        </div>
      )}
      {state === "error" && (
        <div className="panel">
          <div className="notice notice-error">{t.networkErr}</div>
        </div>
      )}

      {state === "ready" && stats && <StatsBody lang={lang} t={t} stats={stats} onPickDay={onPickDay} />}
    </>
  );
}

/* Stroked icons for the tiles; colour comes from the tile. */
const IC: Record<string, string> = {
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  plus: "M15 19a6 6 0 0 0-12 0M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M22 11h-6",
  key: "M15 7a4 4 0 1 1-3.9 4.9L3 20v-3h3v-3h3l2.1-2.1A4 4 0 0 1 15 7Zm1 1.5h.01",
  users: "M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.5A6.5 6.5 0 0 1 21.5 20",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  ghost: "M12 3a7 7 0 0 0-7 7v10l2.5-2 2.5 2 2-2 2 2 2.5-2 2.5 2V10a7 7 0 0 0-7-7ZM9.5 10h.01M14.5 10h.01",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 15V9a4 4 0 0 1 4-4h6M18 9v6a4 4 0 0 1-4 4H8",
  layers: "m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5",
  quiz: "M9 11l2 2 4-4M5 4h14v16H5z",
  check: "M20 6 9 17l-5-5",
  timer: "M10 2h4M12 14l3-3M20 14a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  sum: "M18 5H6l6 7-6 7h12",
};

function StatsBody({ lang, t, stats, onPickDay }: { lang: Lang; t: (typeof T)["uz"]; stats: Stats; onPickDay: (day: string) => void }) {
  const langRows = useMemo(
    () => Object.entries(stats.by_language || {}).sort((a, b) => b[1] - a[1]),
    [stats],
  );
  const roleRows = useMemo(() => Object.entries(stats.by_role || {}).sort((a, b) => b[1] - a[1]), [stats]);
  /* Null until migration 014 is installed — the difference between "no time
     recorded" and "time is not recorded" is the whole point of the section. */
  const online = useMemo(() => {
    if (!stats.online_daily) return null;
    return {
      series: stats.online_daily,
      today: stats.online_today_seconds || 0,
      todayLearners: stats.online_today_learners || 0,
      week: stats.online_7d_seconds || 0,
      month: stats.online_30d_seconds || 0,
      maxDay: stats.online_max_day_seconds || 0,
    };
  }, [stats]);
  const fill = (text: string, vars: Record<string, string | number>) =>
    Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), text);
  const pct = (n: number) => (stats.learners_total ? Math.round((n / stats.learners_total) * 100) : 0);

  return (
    <>
      {/* ── Today: the numbers an owner opens this page for. "On the site"
          (heartbeats) and "signed in" (auth sessions) are different things,
          so each tile says in one line what it counts. ──────────────────── */}
      <section className="os-today">
        <h2 className="os-h2">{t.todayTitle}</h2>
        <div className="os-today-grid">
          {online && (
            <Tile hero icon="eye" tone="green" label={t.onlineTodayWho} value={online.todayLearners} hint={t.onlineTodayWhoHint} />
          )}
          {online && (
            <Tile hero icon="clock" tone="blue" label={t.onlineToday} value={duration(online.today, t, lang)}
              hint={online.todayLearners ? fill(t.onlineTodayHint, { n: online.todayLearners, avg: duration(online.today / online.todayLearners, t, lang) }) : undefined} />
          )}
          <Tile hero icon="plus" tone="orange" label={t.newToday} value={stats.new_today} hint={t.newTodayHint} />
          <Tile hero icon="key" tone="violet" label={t.activeToday} value={stats.active_today} hint={t.activeTodayHint} />
        </div>
      </section>

      <section className="os-section">
        <h2 className="os-h2">{t.accounts}</h2>
        <div className="os-tiles os-tiles-3">
          <Tile icon="users" label={t.total} value={stats.learners_total} hint={t.totalHint} />
          <Tile icon="calendar" label={t.new7} value={stats.new_7d} hint={t.new7Hint} />
          <Tile icon="key" label={t.active7} value={stats.active_7d} hint={t.activeHint} />
          <Tile icon="key" label={t.active30} value={stats.active_30d} hint={t.activeHint} />
          <Tile icon="mail" label={t.confirmed} value={stats.confirmed} hint={fill(t.confirmedHint, { p: pct(stats.confirmed) })} />
          <Tile icon="ghost" label={t.neverIn} value={stats.never_signed_in} hint={t.neverInHint} />
        </div>
      </section>

      <div className="os-charts">
        <section className="panel">
          <DayBars
            lang={lang}
            t={t}
            title={t.signups}
            hint={t.signupsHint}
            emptyText={t.noSignups}
            series={(stats.signups_daily || []).map((d) => ({ day: d.day, value: d.count }))}
            format={(v) => String(v)}
            onPick={onPickDay}
          />
        </section>
        {online && (
          <section className="panel">
            <DayBars
              lang={lang}
              t={t}
              title={t.onlineChart}
              hint={t.onlineHint}
              emptyText={t.noOnline}
              series={online.series.map((d) => ({ day: d.day, value: d.seconds }))}
              format={(v) => duration(v, t, lang)}
            />
          </section>
        )}
      </div>

      <section className="os-section">
        <h2 className="os-h2">{t.online}</h2>
        {online ? (
          <>
            <div className="os-tiles">
              <Tile icon="sum" label={t.online7} value={duration(online.week, t, lang)} />
              <Tile icon="sum" label={t.online30} value={duration(online.month, t, lang)} />
              <Tile icon="timer" label={t.onlineMax} value={duration(online.maxDay, t, lang)} />
            </div>
            <p className="muted os-footnote">{t.onlineNote}</p>
          </>
        ) : (
          // 009 answers without these keys, and zeros would read as "nobody
          // came" rather than "not measured here yet".
          <div className="panel">
            <div className="notice notice-info">{t.onlineMissing}</div>
          </div>
        )}
      </section>

      <section className="os-section">
        <h2 className="os-h2">{t.learning}</h2>
        <div className="os-tiles">
          <Tile icon="route" label={t.withProgress} value={stats.learners_with_progress} hint={fill(t.confirmedHint, { p: pct(stats.learners_with_progress) })} />
          <Tile icon="layers" label={t.unitsDone} value={stats.units_completed} />
          <Tile icon="quiz" label={t.quizzes} value={stats.quizzes_passed} />
          <Tile icon="check" label={t.solved} value={stats.problems_solved} />
        </div>
      </section>

      <div className="os-split">
        <section className="panel">
          <h2 className="os-h2">{t.topics}</h2>
          {stats.top_topics?.length ? (
            <TopicBars lang={lang} t={t} rows={stats.top_topics} />
          ) : (
            <p className="muted os-empty">{t.noTopics}</p>
          )}
        </section>

        <section className="panel">
          <h2 className="os-h2">{t.composition}</h2>
          <Breakdown title={t.language} rows={langRows} total={stats.learners_total} />
          <Breakdown title={t.roles} rows={roleRows} total={stats.learners_total} />
          <div className="os-rating">
            <span className="muted">{t.rating}</span>
            <span>
              {t.avgRating} <b className="mono">{stats.rating_avg}</b>
            </span>
            <span>
              {t.maxRating} <b className="mono">{stats.rating_max}</b>
            </span>
          </div>
        </section>
      </div>

      <p className="muted os-footnote">
        <b>{t.notTracked}.</b> {t.notTrackedBody}
      </p>
    </>
  );
}

function Tile({
  label, value, hint, icon, tone, hero,
}: {
  label: string; value: number | string; hint?: string; icon?: string;
  tone?: "green" | "blue" | "orange" | "violet"; hero?: boolean;
}) {
  return (
    <div className={`os-tile${hero ? " os-big" : ""}${tone ? ` tone-${tone}` : ""}`}>
      <span className="os-tile-head">
        {icon && (
          <span className="os-tile-ic" aria-hidden>
            <svg viewBox="0 0 24 24"><path d={IC[icon]} /></svg>
          </span>
        )}
        <small>{label}</small>
      </span>
      <b className="mono">{value}</b>
      {hint && <span className="os-tile-hint">{hint}</span>}
    </div>
  );
}

/* Daily values over a fixed 30-day window: discrete buckets, so bars. Drawn in
   HTML rather than a stretched SVG so the bars keep crisp corners, the peak is
   labelled and today's bar stands out. Zero days keep a faint stub so "nobody"
   reads as a real zero rather than missing data. */
function DayBars({
  lang,
  t,
  title,
  hint,
  emptyText,
  series,
  format,
  onPick,
}: {
  lang: Lang;
  t: (typeof T)["uz"];
  title: string;
  hint: string;
  emptyText: string;
  series: { day: string; value: number }[];
  format: (value: number) => string;
  onPick?: (day: string) => void;
}) {
  const [focus, setFocus] = useState<number | null>(null);
  const max = Math.max(1, ...series.map((d) => d.value));
  const total = series.reduce((n, d) => n + d.value, 0);
  const shown = focus !== null && series[focus] ? series[focus] : null;
  const last = series.length - 1;
  const mid = Math.floor(last / 2);

  return (
    <figure className="os-chart">
      <figcaption>
        <span className="os-chart-top">
          <h2 className="os-h2">{title}</h2>
          <span className="os-chart-total">
            <small>{t.chartTotal}</small> <b className="mono">{format(total)}</b>
          </span>
        </span>
        <p className="muted os-chart-hint">
          {shown ? (
            <>
              <b className="mono">{format(shown.value)}</b> · {dayLabel(shown.day, lang)}
            </>
          ) : total === 0 ? emptyText : hint}
        </p>
      </figcaption>
      <div className="os-plot" role="img" aria-label={`${title}: ${format(total)}`} onPointerLeave={() => setFocus(null)}>
        <span className="os-plot-max mono">{format(max)}</span>
        <div className="os-plot-bars">
          {series.map((d, i) => {
            const clickable = !!onPick && d.value > 0;
            return (
              <button
                type="button"
                key={d.day}
                className={`os-col${d.value === 0 ? " zero" : ""}${focus === i ? " on" : ""}${i === last ? " today" : ""}`}
                onPointerEnter={() => setFocus(i)}
                onFocus={() => setFocus(i)}
                onClick={() => { if (clickable && onPick) onPick(d.day); }}
                tabIndex={clickable ? 0 : -1}
                style={{ cursor: clickable ? "pointer" : "default" }}
                aria-label={`${dayLabel(d.day, lang)}: ${format(d.value)}`}
              >
                <i style={d.value === 0 ? undefined : { height: `${Math.max(4, (d.value / max) * 100)}%` }} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="os-chart-axis">
        <span className="mono">{series[0] ? dayLabel(series[0].day, lang) : ""}</span>
        <span className="mono">{series[mid] ? dayLabel(series[mid].day, lang) : ""}</span>
        <span className="mono">{t.today}</span>
      </div>
    </figure>
  );
}

function TopicBars({ lang, t, rows }: { lang: Lang; t: (typeof T)["uz"]; rows: Stats["top_topics"] }) {
  const max = Math.max(1, ...rows.map((r) => r.units));
  return (
    <ul className="os-topics">
      {rows.map((r) => (
        <li key={r.topic}>
          <span className="os-topic-name">{trackName(r.topic, lang)}</span>
          <span className="os-topic-track">
            <span className="os-topic-fill" style={{ width: `${(r.units / max) * 100}%` }} />
          </span>
          <span className="os-topic-num mono">
            {r.units} <small className="muted">{t.units}</small> · {r.learners}{" "}
            <small className="muted">{t.learners}</small>
          </span>
        </li>
      ))}
    </ul>
  );
}

function Breakdown({ title, rows, total }: { title: string; rows: [string, number][]; total: number }) {
  if (!rows.length) return null;
  return (
    <div className="os-breakdown">
      <p className="eyebrow">{title}</p>
      {rows.map(([key, n]) => (
        <div className="os-break-row" key={key}>
          <span className="os-break-key">{key}</span>
          <span className="os-topic-track">
            <span className="os-topic-fill" style={{ width: `${total ? (n / total) * 100 : 0}%` }} />
          </span>
          <b className="mono">{n}</b>
        </div>
      ))}
    </div>
  );
}
