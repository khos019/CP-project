"use client";

/* The duel rating over time, drawn the way a competitive-programming site
 * draws it: rank bands as horizontal stripes behind the curve, one dot per
 * duel, and the dot's colour taken from the rank the account was in at that
 * moment.
 *
 * Why the bands are the point: a rating means nothing on its own. 1580 is
 * either "nearly Expert" or "a long way past Specialist" depending on where
 * the boundaries are, and the graph is where that becomes visible without
 * anybody having to memorise the table. They are the same RANKS the rest of
 * the site colours names with, so a curve entering the blue band and a name
 * turning blue are the same fact.
 *
 * The points come from finished duels, oldest first, and the first point is
 * the rating the account *started* its first duel at — otherwise a new player
 * with one win has a curve of a single dot and no direction, which is the
 * opposite of what a graph is for.
 *
 * Nothing here fetches. The caller already has the history — the duel tab of
 * the same page renders the identical rows — so asking twice would draw the
 * graph from one request and the table from another and let them disagree.
 */

import { useState } from "react";
import { RANKS, rankOf } from "./rating";
import type { PublicDuelRow } from "./social";

type Lang = "uz" | "en";

const T = {
  uz: {
    title: "Duel reytingi",
    empty: "Grafik uchun hali duel yo‘q",
    emptyHint: "Birinchi duel yakunlangach shu yerda reyting egri chizig‘i chiziladi.",
    current: "Hozirgi",
    peak: "Eng yuqori",
    low: "Eng past",
    duels: "Duellar",
    win: "g‘alaba", loss: "mag‘lubiyat", draw: "durang",
    vs: "Raqib",
    bot: "Algo",
    outcome: { win: "G‘alaba", loss: "Mag‘lubiyat", draw: "Durang" },
    unrated: "reyting o‘zgarmadi",
  },
  en: {
    title: "Duel rating",
    empty: "No duels to graph yet",
    emptyHint: "The rating curve appears here once the first duel is finished.",
    current: "Current",
    peak: "Peak",
    low: "Lowest",
    duels: "Duels",
    win: "wins", loss: "losses", draw: "draws",
    vs: "Opponent",
    bot: "Algo",
    outcome: { win: "Win", loss: "Loss", draw: "Draw" },
    unrated: "rating unchanged",
  },
} as const;

/* The drawing area, in the SVG's own units. The wrapper gives itself this
   aspect ratio, so a tooltip placed at a percentage of the box lands on the
   dot it belongs to at every width. */
const W = 720;
const H = 300;
const PAD = { top: 14, right: 16, bottom: 30, left: 46 };

type Point = {
  x: number; y: number;
  rating: number;
  when: string;
  row: PublicDuelRow | null;
};

const MONTHS = {
  uz: ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
/* The scale of the axis labels follows the span of the history, because most
   of it is short: an account's first four duels are usually minutes apart, and
   three labels all reading "Sen 2026" say nothing at all. Under two days the
   labels carry the time, under two months the day, and beyond that the month
   and the year. */
type Scale = "time" | "day" | "month";
const scaleFor = (spanMs: number): Scale =>
  spanMs < 2 * 86400000 ? "time" : spanMs < 60 * 86400000 ? "day" : "month";

const shortDate = (iso: string, lang: Lang, scale: Scale) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const month = MONTHS[lang][d.getUTCMonth()];
  if (scale === "month") return `${month} ${d.getUTCFullYear()}`;
  const day = `${d.getUTCDate()} ${month}`;
  if (scale === "day") return day;
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${day} ${hh}:${mm}`;
};
const fullDate = (iso: string, lang: Lang) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(lang === "uz" ? "uz-UZ" : "en-GB",
    { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

/* A y-axis that starts and ends on a round number and always spans at least
   400 points. Without the floor, an account whose rating has moved by 12 gets
   a curve that looks like a mountain range. */
function domain(values: number[]): [number, number] {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const mid = (lo + hi) / 2;
  const span = Math.max(400, (hi - lo) * 1.35);
  const bottom = Math.max(0, Math.floor((mid - span / 2) / 100) * 100);
  return [bottom, Math.ceil((bottom + span) / 100) * 100];
}

/** Ticks every 200 points, and never more than six of them. */
function ticks(lo: number, hi: number): number[] {
  const step = (hi - lo) / 200 > 6 ? 400 : 200;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) out.push(v);
  return out;
}

export function RatingGraph({
  lang, rows, className,
}: {
  lang: Lang;
  /** Finished duels, newest first — the order both RPCs return. */
  rows: PublicDuelRow[];
  className?: string;
}) {
  const t = T[lang];
  const [hover, setHover] = useState<number | null>(null);

  const history = [...rows]
    .filter((r) => r.finished_at)
    .sort((a, b) => +new Date(a.finished_at) - +new Date(b.finished_at));

  if (!history.length) {
    return (
      <section className={`panel drg ${className || ""}`}>
        <h2 className="drg-title">{t.title}</h2>
        <div className="os-blank">
          <span className="os-blank-ic" aria-hidden>📈</span>
          <b>{t.empty}</b>
          <p>{t.emptyHint}</p>
        </div>
      </section>
    );
  }

  /* One point per duel, plus a leading point for where the first duel began.
     The leading point carries no row: there is no duel to describe in a
     tooltip, it is only the curve's left end. */
  const series: { rating: number; when: string; row: PublicDuelRow | null }[] = [
    { rating: history[0].rating_before, when: history[0].started_at || history[0].finished_at, row: null },
    ...history.map((r) => ({ rating: r.rating_after, when: r.finished_at, row: r })),
  ];

  const [lo, hi] = domain(series.map((p) => p.rating));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const times = series.map((p) => +new Date(p.when));
  const t0 = times[0];
  const t1 = times[times.length - 1];
  const spanMs = Math.max(1, t1 - t0);
  const xOf = (ms: number) =>
    series.length === 1 ? PAD.left + innerW / 2 : PAD.left + ((ms - t0) / spanMs) * innerW;
  const yOf = (rating: number) => PAD.top + innerH - ((rating - lo) / (hi - lo)) * innerH;

  const points: Point[] = series.map((p, i) => ({
    x: xOf(times[i]), y: yOf(p.rating), rating: p.rating, when: p.when, row: p.row,
  }));

  /* No area fill under the curve: the bands are the background, and a green
     wash over them turned two neighbouring ranks into one colour. */
  const line = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const ratings = series.map((p) => p.rating);
  const current = ratings[ratings.length - 1];
  const peak = Math.max(...ratings);
  const lowest = Math.min(...ratings);
  const tally = history.reduce(
    (acc, r) => { acc[r.outcome] += 1; return acc; },
    { win: 0, loss: 0, draw: 0 },
  );

  /* The x labels are the ends and the middle, not one per duel: a hundred
     duels in a month would otherwise print a hundred overlapping dates. A
     middle label that reads the same as an end is dropped rather than printed
     twice -- which is what happens whenever the middle duel falls on the same
     day as the first or the last. */
  const scale = scaleFor(spanMs);
  const ends = points.length > 2
    ? [points[0], points[Math.floor(points.length / 2)], points[points.length - 1]]
    : [points[0], points[points.length - 1]];
  const xLabels = ends
    .map((p, i) => ({ p, i, text: shortDate(p.when, lang, scale) }))
    .filter((l, i, all) => i === 0 || i === all.length - 1
      || (l.text !== all[0].text && l.text !== all[all.length - 1].text));

  const active = hover !== null ? points[hover] : null;

  /* Only the ranks the window actually shows are named underneath: a legend
     listing all nine would spend most of its room on bands that are not on
     screen. The chip is the same colour as the stripe behind the curve. */
  const shown = RANKS.filter((rank, i) => {
    const top = RANKS[i + 1] ? RANKS[i + 1].min : hi;
    return Math.min(top, hi) > Math.max(rank.min, lo);
  });

  return (
    <section className={`panel drg ${className || ""}`}>
      <div className="drg-head">
        <h2 className="drg-title">{t.title}</h2>
        <div className="drg-facts">
          <span><small>{t.current}</small> <b className="mono" style={{ color: rankOf(current).color }}>{current}</b></span>
          <span><small>{t.peak}</small> <b className="mono" style={{ color: rankOf(peak).color }}>{peak}</b></span>
          <span><small>{t.low}</small> <b className="mono">{lowest}</b></span>
          <span>
            <small>{t.duels}</small>{" "}
            <b className="mono">{history.length}</b>{" "}
            <small className="drg-tally">
              <i className="dh-win">{tally.win}{lang === "uz" ? "G" : "W"}</i>
              <i className="dh-loss">{tally.loss}{lang === "uz" ? "M" : "L"}</i>
              <i className="muted">{tally.draw}D</i>
            </small>
          </span>
        </div>
      </div>

      <div className="drg-box" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="drg-svg" role="img"
             aria-label={`${t.title}: ${lowest}–${peak}`}>
          {/* Rank bands. Each stripe is the slice of its rank that falls inside
              the visible window, so a curve never leaves the colour it is in. */}
          {RANKS.map((rank, i) => {
            const top = RANKS[i + 1] ? RANKS[i + 1].min : hi;
            const from = Math.max(rank.min, lo);
            const to = Math.min(top, hi);
            if (to <= from) return null;
            const y = yOf(to);
            const height = yOf(from) - y;
            return (
              <rect key={rank.min} x={PAD.left} y={y} width={innerW} height={height}
                    fill={rank.color} opacity={0.2} />
            );
          })}

          {/* Horizontal rating grid, labelled on the left. */}
          {ticks(lo, hi).map((v) => (
            <g key={v}>
              <line x1={PAD.left} x2={PAD.left + innerW} y1={yOf(v)} y2={yOf(v)}
                    className="drg-grid" />
              <text x={PAD.left - 8} y={yOf(v) + 4} className="drg-tick" textAnchor="end">{v}</text>
            </g>
          ))}

          <rect x={PAD.left} y={PAD.top} width={innerW} height={innerH} className="drg-frame" />

          <polyline points={line} className="drg-line" />

          {points.map((p, i) => (
            <circle
              key={i} cx={p.x} cy={p.y} r={hover === i ? 6 : 4}
              fill={rankOf(p.rating).color} className="drg-dot"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((h) => (h === i ? null : h))}
              onFocus={() => setHover(i)}
              onBlur={() => setHover((h) => (h === i ? null : h))}
              tabIndex={0}
            />
          ))}

          {xLabels.map((l, i) => (
            <text key={l.i} x={l.p.x} y={H - 10} className="drg-tick"
                  textAnchor={i === 0 ? "start" : i === xLabels.length - 1 ? "end" : "middle"}>
              {l.text}
            </text>
          ))}
        </svg>

        {/* The tooltip is a div rather than SVG text so it wraps, and it is
            positioned as a percentage of the same box the viewBox fills. */}
        {active && (
          <div
            className="drg-tip"
            style={{
              left: `${(active.x / W) * 100}%`,
              top: `${(active.y / H) * 100}%`,
              transform: `translate(${active.x > W * 0.6 ? "-100%" : "0"}, -115%)`,
            }}
          >
            <b className="mono" style={{ color: rankOf(active.rating).color }}>{active.rating}</b>
            {active.row ? (
              <>
                <span className={active.row.delta > 0 ? "dh-win" : active.row.delta < 0 ? "dh-loss" : "muted"}>
                  {active.row.delta > 0 ? "+" : ""}{active.row.delta}
                  {active.row.delta === 0 ? ` (${t.unrated})` : ""}
                </span>
                <small>
                  {t.outcome[active.row.outcome]} · {active.row.my_score}:{active.row.opp_score}
                </small>
                <small className="muted">
                  {t.vs}: {active.row.opponent_is_bot
                    ? t.bot
                    : active.row.opponent || active.row.opponent_username || "—"}
                </small>
              </>
            ) : null}
            <small className="muted">{fullDate(active.when, lang)}</small>
          </div>
        )}
      </div>

      <ul className="drg-ranks">
        {shown.map((rank) => (
          <li key={rank.min}>
            <i style={{ background: rank.color }} aria-hidden />
            {lang === "uz" ? rank.nameUz : rank.nameEn}
            <small className="mono">{rank.min}+</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
