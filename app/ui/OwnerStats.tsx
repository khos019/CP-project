"use client";

import { useEffect, useMemo, useState } from "react";
import { roadmapCatalog } from "./roadmap-data";
import { fetchOwnerStats, type OwnerStats as Stats } from "./session";

type Lang = "uz" | "en";

/* Owner dashboard.
 *
 * Every figure comes from migration 009's security-definer aggregate. Nothing
 * here is estimated or extrapolated: where the platform does not yet record
 * something (source-level submissions, session duration, page views) the metric
 * is absent rather than guessed at.
 *
 * Charts are single-series on purpose. The three brand limes fail a categorical
 * palette check against each other — worst adjacent pair ΔE 5.1 under protanopia
 * and 7.7 with normal vision — so identity is carried by labels, and colour only
 * ever encodes magnitude. */
const T = {
  uz: {
    eyebrow: "Faqat ega uchun",
    title: "Platforma statistikasi",
    refresh: "Yangilash",
    loading: "Yuklanmoqda…",
    updated: "Yangilandi",
    notMigrated:
      "Statistika funksiyasi hali qo‘shilmagan. 009_owner_platform_stats.sql migratsiyasini SQL Editor’da ishga tushiring.",
    forbidden: "Bu sahifa faqat ega (owner) roli uchun.",
    networkErr: "Ma’lumotni olib bo‘lmadi. Internetni tekshirib, qayta urining.",
    accounts: "Hisoblar",
    total: "Jami o‘quvchi",
    activeToday: "Bugun faol",
    active7: "7 kunda faol",
    active30: "30 kunda faol",
    newToday: "Bugun qo‘shildi",
    new7: "7 kunda yangi",
    new30: "30 kunda yangi",
    neverIn: "Hech kirmagan",
    confirmed: "Email tasdiqlangan",
    unconfirmed: "Tasdiqlanmagan",
    signups: "Ro‘yxatdan o‘tish · oxirgi 30 kun",
    signupsHint: "Kunlik yangi hisoblar. Ustunga bosing — o‘sha kuni kim qo‘shilganini ko‘rasiz.",
    noSignups: "Oxirgi 30 kunda yangi hisob yo‘q.",
    learning: "O‘rganish faoliyati",
    withProgress: "Progressi bor",
    unitsDone: "Bosqich tugatilgan",
    quizzes: "Testdan o‘tilgan",
    solved: "Masala yechilgan",
    topics: "Eng ko‘p o‘rganilayotgan mavzular",
    noTopics: "Hali hech kim bosqich boshlamagan.",
    learners: "o‘quvchi",
    units: "bosqich",
    composition: "Tarkib",
    language: "Til",
    roles: "Rollar",
    rating: "Reyting",
    avgRating: "O‘rtacha",
    maxRating: "Eng yuqori",
    notTracked: "Hali kuzatilmaydi",
    notTrackedBody:
      "Sahifa ko‘rishlari, sessiya davomiyligi va duel tarixi hozircha serverda saqlanmaydi, shuning uchun bu yerda ko‘rsatilmaydi. Duel natijalari va yechilgan masalalar hozir faqat brauzerda saqlanadi.",
    today: "bugun",
  },
  en: {
    eyebrow: "Owner only",
    title: "Platform statistics",
    refresh: "Refresh",
    loading: "Loading…",
    updated: "Updated",
    notMigrated:
      "The statistics function is not installed yet. Run 009_owner_platform_stats.sql in the SQL Editor.",
    forbidden: "This page is for the owner role only.",
    networkErr: "Could not load the data. Check your connection and try again.",
    accounts: "Accounts",
    total: "Total learners",
    activeToday: "Active today",
    active7: "Active in 7 days",
    active30: "Active in 30 days",
    newToday: "Joined today",
    new7: "New in 7 days",
    new30: "New in 30 days",
    neverIn: "Never signed in",
    confirmed: "Email confirmed",
    unconfirmed: "Unconfirmed",
    signups: "Sign-ups · last 30 days",
    signupsHint: "New accounts per day. Click a bar to see who joined that day.",
    noSignups: "No new accounts in the last 30 days.",
    learning: "Learning activity",
    withProgress: "Have progress",
    unitsDone: "Units completed",
    quizzes: "Quizzes passed",
    solved: "Problems solved",
    topics: "Most studied tracks",
    noTopics: "Nobody has started a unit yet.",
    learners: "learners",
    units: "units",
    composition: "Composition",
    language: "Language",
    roles: "Roles",
    rating: "Rating",
    avgRating: "Average",
    maxRating: "Highest",
    notTracked: "Not tracked yet",
    notTrackedBody:
      "Page views, session length and duel history are not stored on the server, so they are not shown here. Duel results and solved problems currently live only in the browser.",
    today: "today",
  },
};

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

export function OwnerStats({ lang, goProfile, onPickDay }: { lang: Lang; goProfile: () => void; onPickDay: (day: string) => void }) {
  const t = T[lang];
  const [stats, setStats] = useState<Stats | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "not-migrated" | "forbidden" | "error">("loading");

  const load = () => {
    setState("loading");
    fetchOwnerStats().then((result) => {
      if (result.ok) {
        setStats(result.stats);
        setState("ready");
      } else {
        setState(result.error === "not-migrated" ? "not-migrated" : result.error === "forbidden" ? "forbidden" : "error");
      }
    });
  };
  useEffect(load, []);

  return (
    <>
      <button className="crumb crumb-btn" onClick={goProfile}>
        ← {lang === "uz" ? "Profilga qaytish" : "Back to profile"}
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
          <SignupChart lang={lang} t={t} series={stats.signups_daily || []} onPickDay={onPickDay} />
        </div>
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

function Tile({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
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
function SignupChart({
  lang,
  t,
  series,
  onPickDay,
}: {
  lang: Lang;
  t: (typeof T)["uz"];
  series: { day: string; count: number }[];
  onPickDay: (day: string) => void;
}) {
  const [focus, setFocus] = useState<number | null>(null);
  const max = Math.max(1, ...series.map((d) => d.count));
  const total = series.reduce((n, d) => n + d.count, 0);
  const shown = focus !== null && series[focus] ? series[focus] : null;

  const W = 100;
  const H = 34;
  const gap = 0.6;
  const barW = Math.max(0.8, W / Math.max(series.length, 1) - gap);

  return (
    <figure className="os-chart">
      <figcaption>
        <h2 className="os-h2">{t.signups}</h2>
        <p className="muted os-chart-hint">
          {shown ? (
            <>
              <b className="mono">{shown.count}</b> · {dayLabel(shown.day, lang)}
            </>
          ) : total === 0 ? (
            t.noSignups
          ) : (
            t.signupsHint
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
        aria-label={`${t.signups}: ${total}`}
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
          if (shown && shown.count > 0) onPickDay(shown.day);
        }}
        style={{ cursor: shown && shown.count > 0 ? "pointer" : "default" }}
      >
        <line x1="0" y1={H} x2={W} y2={H} className="os-axis" vectorEffect="non-scaling-stroke" />
        {focus !== null && (
          <rect x={focus * (barW + gap) - gap / 2} y="0" width={barW + gap} height={H} className="os-guide" />
        )}
        {series.map((d, i) => {
          const h = d.count === 0 ? 0.9 : Math.max(1.6, (d.count / max) * (H - 3));
          const x = i * (barW + gap);
          return (
            <rect
              key={d.day}
              x={x}
              y={H - h}
              width={barW}
              height={h}
              rx="0.5"
              className={`os-bar${d.count === 0 ? " zero" : ""}${focus === i ? " on" : ""}`}
            >
              <title>{`${dayLabel(d.day, lang)}: ${d.count}`}</title>
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
