"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { roadmapCatalog } from "./roadmap-data";
import { readLocal } from "./progress";
import { roadmapStatus, unitDone } from "./RoadmapHub";

/* The one picture the platform is about: a path with the part you finished
   behind you, the step you are on lit, and the rest still locked.
   It is drawn once here and used in three places — the landing hero, the
   signed-in dashboard and the roadmap list — because a learner who recognises
   the shape on the front page should meet the same shape when they are inside
   it. Anything else and the front page is an advertisement for a different
   product than the one they get. */

export type Lang = "uz" | "en";
export type NodeState = "completed" | "current" | "available" | "locked";
export type GraphNode = {
  slug: string; label: string; units: number; done: number; state: NodeState;
};

/* Nine roadmaps chosen by following the prerequisite chain from the first
   thing a beginner opens to the last thing an ICPC finalist needs, so the
   drawing is the real curriculum rather than nine names that fit. */
const SPINE = [
  "programming-basics", "foundations", "sorting", "binary-search", "data-structures",
  "greedy", "graphs", "dynamic-programming", "advanced-cp",
] as const;

/* Serpentine, in viewBox units. Three rows read left, right, left — the same
   way the eye already reads — with the turns rounded so the path feels walked
   rather than plotted. */
const POINTS = [
  [56, 46], [161, 46], [266, 46],
  [341, 121],
  [266, 196], [161, 196], [56, 196],
  [111, 286], [216, 286],
] as const;

const PATH =
  "M56,46 L266,46 Q341,46 341,121 Q341,196 266,196 L56,196 Q56,251 111,286 L216,286";

/* The compact form drops to a single row of five: below 1024px the graphic
   sits under the hero copy, where three rows would be taller than the text
   that explains it. */
const COMPACT_POINTS = [[40, 60], [130, 60], [220, 60], [310, 60], [400, 60]] as const;
const COMPACT_PATH = "M40,60 L400,60";

const VIEWBOX = { full: "0 0 400 330", compact: "0 0 440 120" };

export function buildSpine(lang: Lang): GraphNode[] {
  const progress = readLocal();
  const nodes: GraphNode[] = [];
  let currentTaken = false;
  for (const slug of SPINE) {
    const road = roadmapCatalog.find(r => r.slug === slug);
    if (!road) continue;
    const status = roadmapStatus(road, progress);
    const done = road.units.filter(u => unitDone(progress, u)).length;
    /* Exactly one node may be "current". It is the first one that is open and
       unfinished — the honest answer to "where am I", which for somebody who
       has just arrived is the very first roadmap. */
    let state: NodeState =
      status === "completed" ? "completed" : status === "locked" ? "locked" : "available";
    if (!currentTaken && state === "available") { state = "current"; currentTaken = true; }
    nodes.push({
      slug, units: road.units.length, done, state,
      label: lang === "uz" ? road.titleUz : road.titleEn,
    });
  }
  return nodes;
}

export function RoadmapGraph({
  lang, nodes, onOpen, compact = false, animate = true,
}: {
  lang: Lang; nodes: GraphNode[]; onOpen: (slug: string) => void;
  compact?: boolean; animate?: boolean;
}) {
  const uz = lang === "uz";
  const [hover, setHover] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(!animate);
  const wrap = useRef<HTMLDivElement | null>(null);

  /* The single page-load animation on the whole site. It runs once, and not at
     all for a reader who asked the system to stop moving things. */
  useEffect(() => {
    if (!animate) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(() => setDrawn(true), still ? 0 : 30);
    return () => window.clearTimeout(id);
  }, [animate]);

  const shown = compact ? nodes.slice(0, 5) : nodes.slice(0, 9);
  const points = compact ? COMPACT_POINTS : POINTS;
  const d = compact ? COMPACT_PATH : PATH;

  /* How far along the line the finished work reaches, as a share of the whole
     path — the same number the dash pattern and the draw-in animation use. */
  const reached = useMemo(() => {
    const last = shown.reduce((n, node, i) => (node.state === "completed" ? i + 1 : n), 0);
    if (last === 0) return 0;
    return Math.min(100, (last / Math.max(1, shown.length - 1)) * 100);
  }, [shown]);

  const tip = hover === null ? null : shown[hover];

  return (
    <div className={compact ? "rg rg-compact" : "rg"} ref={wrap} data-drawn={drawn || undefined}>
      <svg viewBox={compact ? VIEWBOX.compact : VIEWBOX.full} className="rg-svg"
        role="img" aria-label={uz ? "O‘quv yo‘li: tugallangan, joriy va qulflangan bosqichlar" : "Learning path: completed, current and locked stages"}>
        <defs>
          <linearGradient id="rg-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--green)" />
            <stop offset="100%" stopColor="var(--blue)" />
          </linearGradient>
        </defs>

        {/* What is still ahead: dashed, quiet, and drawn first so the finished
            part sits on top of it. */}
        <path className="rg-track" d={d} pathLength={100} />
        {/* What is behind: the only place a gradient appears on this site. */}
        <path className="rg-done" d={d} pathLength={100}
          style={{ strokeDasharray: `${reached} 100`, strokeDashoffset: drawn ? 0 : reached }} />

        {shown.map((node, i) => {
          const [x, y] = points[i];
          const r = node.state === "current" ? 21 : 18;
          return (
            <g key={node.slug} className={`rg-node rg-${node.state}`}
              style={{ transitionDelay: `${340 + i * 60}ms` }}
              tabIndex={0} role="link"
              aria-label={`${node.label} — ${stateWord(node.state, uz)}`}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(h => (h === i ? null : h))}
              onFocus={() => setHover(i)} onBlur={() => setHover(h => (h === i ? null : h))}
              onClick={() => onOpen(node.slug)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(node.slug); } }}>
              {node.state === "current" && <circle className="rg-halo" cx={x} cy={y} r={r + 11} />}
              <circle className="rg-disc" cx={x} cy={y} r={r} />
              <text className="rg-glyph" x={x} y={y} textAnchor="middle" dominantBaseline="central">
                {node.state === "completed" ? "✓" : node.state === "locked" ? "🔒" : i + 1}
              </text>
            </g>
          );
        })}
      </svg>

      {tip && (
        <div className="rg-tip" style={{
          left: `${(points[hover!][0] / (compact ? 440 : 400)) * 100}%`,
          top: `${(points[hover!][1] / (compact ? 120 : 330)) * 100}%`,
        }}>
          <b>{tip.label}</b>
          <span>
            {tip.state === "locked"
              ? (uz ? "Avval oldingi yo‘nalishni tugating" : "Finish the previous track first")
              : `${tip.done}/${tip.units} ${uz ? "bosqich" : "stages"} · ${stateWord(tip.state, uz)}`}
          </span>
        </div>
      )}
    </div>
  );
}

function stateWord(state: NodeState, uz: boolean) {
  if (state === "completed") return uz ? "tugallandi" : "completed";
  if (state === "current") return uz ? "siz shu yerdasiz" : "you are here";
  if (state === "locked") return uz ? "qulflangan" : "locked";
  return uz ? "ochiq" : "open";
}
