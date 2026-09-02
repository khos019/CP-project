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

  return (
    <>
      <section className="os-section">
        <h2 className="os-h2">{t.accounts}</h2>
        <div className="os-tiles">
          <Tile label={t.total} value={stats.learners_total} accent />
          <Tile label={t.activeToday} value={stats.active_today} accent />
          <Tile label={t.active7} value={stats.active_7d} />
          <Tile label={t.active30} value={stats.active_30d} />
          <Tile label={t.newToday} value={stats.new_today} />
          <Tile label={t.new7} value={stats.new_7d} />
          <Tile label={t.confirmed} value={stats.confirmed} />
          <Tile label={t.neverIn} value={stats.never_signed_in} />
        </div>
      </section>

      <section className="os-section">
        <div className="panel">
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
        </div>
      </section>

      <section className="os-section">
        <h2 className="os-h2">{t.online}</h2>
        {online ? (
          <>
            <div className="os-tiles">
              <Tile label={t.onlineToday} value={duration(online.today, t, lang)} accent />
              <Tile label={t.onlineTodayWho} value={online.todayLearners} accent />
              <Tile
                label={t.onlineAvg}
                value={online.todayLearners ? duration(online.today / online.todayLearners, t, lang) : "—"}
              />
              <Tile label={t.online7} value={duration(online.week, t, lang)} />
              <Tile label={t.online30} value={duration(online.month, t, lang)} />
              <Tile label={t.onlineMax} value={duration(online.maxDay, t, lang)} />
            </div>
            <div className="panel" style={{ marginTop: 16 }}>
              <DayBars
                lang={lang}
                t={t}
                title={t.onlineChart}
                hint={t.onlineHint}
                emptyText={t.noOnline}
                series={online.series.map((d) => ({ day: d.day, value: d.seconds }))}
                format={(v) => duration(v, t, lang)}
              />
            </div>
            <p className="muted os-empty">{t.onlineNote}</p>
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
          <Tile label={t.withProgress} value={stats.learners_with_progress} accent />
          <Tile label={t.unitsDone} value={stats.units_completed} />
          <Tile label={t.quizzes} value={stats.quizzes_passed} />
          <Tile label={t.solved} value={stats.problems_solved} />
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

      <section className="panel os-note">
        <h3>{t.notTracked}</h3>
        <p className="muted">{t.notTrackedBody}</p>
      </section>
    </>
  );
}

function Tile({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div className={accent ? "os-tile accent" : "os-tile"}>
      <b className="mono">{value}</b>
      <small>{label}</small>
    </div>
  );
}

/* Daily counts over a fixed 30-day window: discrete time buckets, so bars, not a
   line. Zero days are drawn as a baseline tick so "nobody joined" reads as a
   real zero rather than missing data. */
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
  /* Sign-ups are a count and online time is a duration; the bars are the same
     shape either way, so only the readout differs. */
  format: (value: number) => string;
  onPick?: (day: string) => void;
}) {
  const [focus, setFocus] = useState<number | null>(null);
  const max = Math.max(1, ...series.map((d) => d.value));
  const total = series.reduce((n, d) => n + d.value, 0);
  const shown = focus !== null && series[focus] ? series[focus] : null;

  const W = 100;
  const H = 34;
  const gap = 0.6;
  const barW = Math.max(0.8, W / Math.max(series.length, 1) - gap);

  return (
    <figure className="os-chart">
      <figcaption>
        <h2 className="os-h2">{title}</h2>
        <p className="muted os-chart-hint">
          {shown ? (
            <>
              <b className="mono">{format(shown.value)}</b> · {dayLabel(shown.day, lang)}
            </>
          ) : total === 0 ? (
            emptyText
          ) : (
            hint
          )}
        </p>
      </figcaption>
      {/* The pointer is tracked across the whole plot rather than per bar: at 30
          days a bar is under three pixels wide, so requiring a direct hit would
          make the readout practically unreachable. */}
      <svg
        className="os-chart-svg"
        viewBox={`0 0 ${W} ${H + 6}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`${title}: ${format(total)}`}
        onPointerMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          if (!box.width || !series.length) return;
          const ratio = (e.clientX - box.left) / box.width;
          setFocus(Math.min(series.length - 1, Math.max(0, Math.floor(ratio * series.length))));
        }}
        onPointerLeave={() => setFocus(null)}
        onClick={() => {
          // Statistics stays aggregate; the names live on the Users page, which
          // is also where anything can be done about them. So a bar does not
          // expand here, it opens that page already filtered to its day.
          if (onPick && shown && shown.value > 0) onPick(shown.day);
        }}
        style={{ cursor: onPick && shown && shown.value > 0 ? "pointer" : "default" }}
      >
        <line x1="0" y1={H} x2={W} y2={H} className="os-axis" vectorEffect="non-scaling-stroke" />
        {focus !== null && (
          <rect x={focus * (barW + gap) - gap / 2} y="0" width={barW + gap} height={H} className="os-guide" />
        )}
        {series.map((d, i) => {
          const h = d.value === 0 ? 0.9 : Math.max(1.6, (d.value / max) * (H - 3));
          const x = i * (barW + gap);
          return (
            <rect
              key={d.day}
              x={x}
              y={H - h}
              width={barW}
              height={h}
              rx="0.5"
              className={`os-bar${d.value === 0 ? " zero" : ""}${focus === i ? " on" : ""}`}
            >
              <title>{`${dayLabel(d.day, lang)}: ${format(d.value)}`}</title>
            </rect>
          );
        })}
      </svg>
      <div className="os-chart-axis">
        <span className="mono">{series[0] ? dayLabel(series[0].day, lang) : ""}</span>
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
