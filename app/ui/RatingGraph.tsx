"use client";

/* The duel rating over time, drawn the way Codeforces draws a rating: rank
 * bands as horizontal stripes, one dot per duel, the months along the bottom
 * and the peak ringed.
 *
 * Why the bands are the point: a rating means nothing on its own. 1580 is
 * either "nearly Expert" or "a long way past Specialist" depending on where the
 * boundaries are, and the graph is where that becomes visible without anybody
 * memorising the table. They are the same RANKS the rest of the site colours
 * names with, and each band carries its name, so a curve inside the green
 * stripe is visibly "Pupil".
 *
 * The x axis is the order of the duels, not the clock. The first duel sits at
 * the left edge and every later one a step to its right, the whole history
 * spread across the width. A time axis was tried first and failed twice on
 * real accounts: at a month's scale a first-week history was a clump in the
 * middle of an empty chart, and at its own scale three duels a minute apart
 * sat at one edge with the fourth, played the next day, far away at the
 * other. Duels come in bursts, which contests do not, and it is the sequence
 * of results that a rating curve is for reading.
 *
 * Time is still on the axis where it helps: each month is named ("Sen 2026")
 * under the first duel played in it, with a faint vertical line there, and a
 * label that would crowd the one before it is skipped -- the bottom of the
 * Codeforces graph, without its empty stretches.
 *
 * There is no leading point for "the rating before the first duel". Codeforces
 * draws none, and here it read as an extra duel that had never been played.
 *
 * Nothing here fetches. The caller already has the rows -- the duel page of the
 * same profile renders them -- so the curve and the table cannot disagree.
 */

import { useCallback, useRef, useState } from "react";
import { RANKS, rankOf } from "./rating";
import { MONTHS_SHORT, fullDateTime } from "./dates";
import type { PublicDuelRow } from "./social";

type Lang = "uz" | "en";

const T = {
  uz: {
    title: "Duel reytingi",
    empty: "Grafik uchun hali duel yo‘q",
    emptyHint: "Birinchi duel yakunlangach shu yerda reyting egri chizig‘i chiziladi.",
    vs: "Raqib",
    bot: "Algo (AI)",
    outcome: { win: "G‘alaba", loss: "Mag‘lubiyat", draw: "Durang" },
    unrated: "reytingsiz",
    peak: "Eng yuqori",
  },
  en: {
    title: "Duel rating",
    empty: "No duels to graph yet",
    emptyHint: "The rating curve appears here once the first duel is finished.",
    vs: "Opponent",
    bot: "Algo (AI)",
    outcome: { win: "Win", loss: "Loss", draw: "Draw" },
    unrated: "unrated",
    peak: "Peak",
  },
} as const;

/* The drawing area, in the SVG's own units. The wrapper takes this aspect
   ratio, so a tooltip placed at a percentage of the box sits on its dot at
   every width. A phone gets a narrower, taller canvas: the desktop one scaled
   down to 340 pixels was 130 pixels tall with 8-pixel labels. */
const WIDE = { W: 760, H: 300 };
const NARROW = { W: 440, H: 320 };
const PAD = { top: 12, right: 14, bottom: 28, left: 44 };
/* Room kept between the frame and the first and last dots. */
const EDGE = 18;

type Point = { x: number; y: number; t: number; row: PublicDuelRow };

/* A y-axis on round hundreds, at least 400 points tall. Without the floor an
   account whose rating moved by 12 gets a curve like a mountain range. */
function domain(values: number[]): [number, number] {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const mid = (lo + hi) / 2;
  const span = Math.max(400, (hi - lo) * 1.3);
  const bottom = Math.max(0, Math.floor((mid - span / 2) / 100) * 100);
  return [bottom, Math.ceil((bottom + span) / 100) * 100];
}

/* The y labels are the rank boundaries, as on Codeforces -- 1200, 1400, 1600,
   1900 -- because those are the numbers a reader is measuring against. Where
   the window shows fewer than two of them, round hundreds fill in. */
function yTicks(lo: number, hi: number): number[] {
  const bounds = RANKS.map((r) => r.min).filter((v) => v > lo && v < hi);
  if (bounds.length >= 2) return bounds;
  const step = hi - lo > 800 ? 200 : 100;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) out.push(v);
  return out.length > 5 ? out.filter((_, i) => i % 2 === 0) : out;
}

export function RatingGraph({
  lang, rows, className,
}: {
  lang: Lang;
  /** Finished duels, newest first -- the order the RPC returns. */
  rows: PublicDuelRow[];
  className?: string;
}) {
  const t = T[lang];
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  /* The canvas follows the width it is given. A callback ref, because the box
     only exists once there is a history to draw. */
  const [narrow, setNarrow] = useState(false);
  const observer = useRef<ResizeObserver | null>(null);
  const measure = useCallback((el: HTMLDivElement | null) => {
    observer.current?.disconnect();
    if (!el) return;
    observer.current = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < 560));
    observer.current.observe(el);
  }, []);
  const { W, H } = narrow ? NARROW : WIDE;

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

  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x0 = PAD.left;
  const x1 = PAD.left + innerW;

  /* One step per duel. A single duel stands at the left edge like the first
     of many; there is no "middle" to put it in. */
  const times = history.map((r) => +new Date(r.finished_at));
  const n = history.length;
  const step = n > 1 ? (innerW - 2 * EDGE) / (n - 1) : 0;
  const xs = history.map((_, i) => x0 + EDGE + i * step);

  const [lo, hi] = domain(history.flatMap((r) => [r.rating_after, r.rating_before]));
  const yOf = (rating: number) => PAD.top + innerH - ((rating - lo) / (hi - lo)) * innerH;

  const points: Point[] = history.map((row, i) => ({
    x: xs[i], y: yOf(row.rating_after), t: times[i], row,
  }));
  const line = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  let peakIndex = 0;
  points.forEach((p, i) => { if (p.row.rating_after >= points[peakIndex].row.rating_after) peakIndex = i; });

  /* Month labels: under the first duel of each month, skipping any that
     would land closer than this to the label before it. */
  const minApart = narrow ? 90 : 76;
  const monthOf = (ms: number) => { const d = new Date(ms); return d.getFullYear() * 12 + d.getMonth(); };
  const labels: { x: number; ms: number; anchor: "start" | "middle" | "end" }[] = [];
  times.forEach((ms, i) => {
    if (i > 0 && monthOf(ms) === monthOf(times[i - 1])) return;
    const x = xs[i];
    if (labels.length && x - labels[labels.length - 1].x < minApart) return;
    // Kept inside the frame: a label near an edge is anchored inward.
    labels.push({ x, ms, anchor: x < x0 + 40 ? "start" : x > x1 - 40 ? "end" : "middle" });
  });
  const monthName = (ms: number) => {
    const d = new Date(ms);
    return `${MONTHS_SHORT[lang][d.getMonth()]} ${d.getFullYear()}`;
  };

  /* Hovering anywhere over the plot picks the nearest duel by x, the way the
     Codeforces graph does: aiming at a 4-unit dot is a chore. */
  const pick = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return;
    const pt = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    let best = 0;
    points.forEach((p, i) => { if (Math.abs(p.x - pt.x) < Math.abs(points[best].x - pt.x)) best = i; });
    setHover(best);
  };

  const active = hover !== null ? points[hover] : null;
  const activeRank = active ? rankOf(active.row.rating_after) : null;

  return (
    <section className={`panel drg ${className || ""}`}>
      <div className="drg-head">
        <h2 className="drg-title">{t.title}</h2>
      </div>

      <div ref={measure} className={`drg-box ${narrow ? "drg-narrow" : ""}`} style={{ aspectRatio: `${W} / ${H}` }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`} className="drg-svg" role="img"
          aria-label={`${t.title}: ${history[history.length - 1].rating_after}`}
          onMouseMove={(e) => pick(e.clientX, e.clientY)}
          onMouseLeave={() => setHover(null)}
        >
          {/* Rank bands, each with its name in its own colour. */}
          {RANKS.map((rank, i) => {
            const top = RANKS[i + 1] ? RANKS[i + 1].min : Infinity;
            const from = Math.max(rank.min, lo);
            const to = Math.min(top, hi);
            if (to <= from) return null;
            const y = yOf(to);
            const height = yOf(from) - y;
            return (
              <g key={rank.min}>
                <rect x={x0} y={y} width={innerW} height={height} fill={rank.color} opacity={0.13} />
                {height >= 18 && (
                  <text x={x1 - 8} y={y + 14} className="drg-band" fill={rank.color} textAnchor="end">
                    {lang === "uz" ? rank.nameUz : rank.nameEn}
                  </text>
                )}
              </g>
            );
          })}

          {yTicks(lo, hi).map((v) => (
            <g key={v}>
              <line x1={x0} x2={x1} y1={yOf(v)} y2={yOf(v)} className="drg-grid" />
              <text x={x0 - 7} y={yOf(v) + 4} className="drg-tick" textAnchor="end">{v}</text>
            </g>
          ))}

          {/* Month boundaries: a faint vertical line and the month below it. */}
          {labels.map((l) => (
            <g key={l.ms}>
              {l.x > x0 + EDGE && (
                <line x1={l.x} x2={l.x} y1={PAD.top} y2={PAD.top + innerH} className="drg-grid drg-vgrid" />
              )}
              <text x={l.x} y={H - 9} className="drg-tick" textAnchor={l.anchor}>{monthName(l.ms)}</text>
            </g>
          ))}

          <rect x={x0} y={PAD.top} width={innerW} height={innerH} className="drg-frame" />

          <polyline points={line} className="drg-line" />

          {active && (
            <line x1={active.x} x2={active.x} y1={PAD.top} y2={PAD.top + innerH} className="drg-cursor" />
          )}

          {/* The peak is ringed, as Codeforces rings a maximum. */}
          <circle cx={points[peakIndex].x} cy={points[peakIndex].y} r={8.5} className="drg-peak">
            <title>{`${t.peak}: ${points[peakIndex].row.rating_after}`}</title>
          </circle>

          {points.map((p, i) => (
            <circle
              key={p.row.id} cx={p.x} cy={p.y} r={hover === i ? 5.5 : 4}
              fill={rankOf(p.row.rating_after).color} className="drg-dot"
              tabIndex={0}
              aria-label={`${p.row.rating_after} · ${fullDateTime(p.row.finished_at, lang)}`}
              onFocus={() => setHover(i)}
              onBlur={() => setHover((h) => (h === i ? null : h))}
            />
          ))}
        </svg>

        {active && activeRank && (
          <div
            className="drg-tip"
            style={{
              left: `${(active.x / W) * 100}%`,
              top: `${(active.y / H) * 100}%`,
              transform: `translate(${active.x > W * 0.62 ? "calc(-100% - 12px)" : "12px"}, ${active.y < H * 0.35 ? "10%" : "-110%"})`,
            }}
          >
            <div className="drg-tip-top">
              <b className="mono" style={{ color: activeRank.color }}>{active.row.rating_after}</b>
              <span className={`mono ${active.row.delta > 0 ? "dh-win" : active.row.delta < 0 ? "dh-loss" : "muted"}`}>
                {active.row.delta === 0 ? t.unrated : `${active.row.delta > 0 ? "+" : ""}${active.row.delta}`}
              </span>
            </div>
            <small className="drg-tip-rank" style={{ color: activeRank.color }}>
              {lang === "uz" ? activeRank.nameUz : activeRank.nameEn}
            </small>
            <small>
              {t.outcome[active.row.outcome]} · <span className="mono">{active.row.my_score}:{active.row.opp_score}</span>
            </small>
            <small className="muted">
              {t.vs}: {active.row.opponent_is_bot
                ? t.bot
                : active.row.opponent || active.row.opponent_username || "—"}
            </small>
            <small className="muted mono">{fullDateTime(active.row.finished_at, lang)}</small>
          </div>
        )}
      </div>
    </section>
  );
}
