"use client";

// Data-driven concept diagrams.
//
// The first version keyed one picture per roadmap, so all 15 units of a bo'lim
// showed the same image. These are primitives instead: a unit supplies a small
// spec and gets its own picture. All original SVG.

export const DC = {
  dim: "#2b3f34", line: "#4a6b58", ink: "#cfe0d6", lime: "#c8ff76",
  warm: "#ffbd8f", cool: "#8ad8ff", pink: "#f5a6ff", mute: "#7d8f85", bg: "#0d1310", on: "#12261a", onLine: "#3f7a44",
};

export type Spec =
  | { kind: "array"; label: string; values: (string | number)[]; hi?: number[]; ptr?: { at: number; text: string; color?: string }[]; note?: string }
  | { kind: "tworow"; label: string; top: (string | number)[]; bottom: (string | number)[]; topName?: string; bottomName?: string; hi?: number[]; note?: string }
  | { kind: "grid"; label: string; rows: string[]; note?: string }
  | { kind: "graph"; label: string; nodes: [number, number, string][]; edges: [number, number, string?][]; note?: string; directed?: boolean }
  | { kind: "stack"; label: string; items: string[]; note?: string }
  | { kind: "flow"; label: string; steps: string[]; note?: string }
  | { kind: "curve"; label: string; note?: string }
  | { kind: "table"; label: string; rows: (string | number)[][]; hi?: [number, number]; note?: string }
  /* Sorting's own vocabulary. Fifteen stages about rearranging one array would
     otherwise all show the same row of boxes; these give each mechanism the
     shape it actually has — heights you can compare at a glance, a tree for a
     heap, labelled regions for an invariant, two streams feeding one, and
     buckets for counting. */
  | { kind: "bars"; label: string; values: number[]; state?: Record<number, BarState>;
      brace?: { from: number; to: number; text: string }[]; note?: string }
  | { kind: "heap"; label: string; values: (string | number)[]; hi?: number[];
      edgeHi?: [number, number][]; note?: string }
  | { kind: "zones"; label: string; values: (string | number)[];
      zones: { from: number; to: number; text: string; tone?: ZoneTone }[];
      ptr?: { at: number; text: string; color?: string }[]; note?: string }
  | { kind: "merge"; label: string; left: (string | number)[]; right: (string | number)[];
      out: (string | number)[]; li?: number; ri?: number; note?: string }
  | { kind: "buckets"; label: string; keys: (string | number)[]; counts: number[];
      hi?: number[]; note?: string };

/** How a bar is taking part in the current step. */
export type BarState = "cmp" | "swap" | "sorted" | "pivot" | "key";
export type ZoneTone = "ok" | "warm" | "cool" | "dim";

const T = (x: number, y: number, s: string, fill = DC.ink, size = 13, anchor: "middle" | "start" | "end" = "middle") => (
  <text x={x} y={y} fill={fill} fontSize={size} textAnchor={anchor} fontFamily="ui-monospace, monospace">{s}</text>
);
const R = (x: number, y: number, w: number, h: number, on: boolean) => (
  <rect x={x} y={y} width={w} height={h} rx="5" fill={on ? DC.on : DC.bg} stroke={on ? DC.onLine : DC.dim} strokeWidth="1.5" />
);

function ArrayView(s: Extract<Spec, { kind: "array" }>) {
  const n = s.values.length, w = Math.min(58, 460 / n), x0 = 260 - (n * w) / 2;
  return <>
    {s.values.map((v, i) => <g key={i}>{R(x0 + i * w, 42, w - 6, 34, !!s.hi?.includes(i))}
      {T(x0 + i * w + (w - 6) / 2, 64, String(v), s.hi?.includes(i) ? DC.lime : DC.ink, 12)}
      {T(x0 + i * w + (w - 6) / 2, 92, String(i), DC.mute, 10)}</g>)}
    {s.ptr?.map((p, i) => <g key={`p${i}`}>
      <path d={`M${x0 + p.at * w + (w - 6) / 2} 34 L${x0 + p.at * w + (w - 6) / 2} 20`} stroke={p.color || DC.warm} strokeWidth="2" />
      {T(x0 + p.at * w + (w - 6) / 2, 15, p.text, p.color || DC.warm, 11)}</g>)}
    {s.note && T(260, 120, s.note, DC.lime, 12)}
  </>;
}

function TwoRow(s: Extract<Spec, { kind: "tworow" }>) {
  const n = s.top.length, w = Math.min(66, 420 / n), x0 = 275 - (n * w) / 2;
  return <>
    {s.topName && T(x0 - 14, 44, s.topName, DC.mute, 11, "end")}
    {s.bottomName && T(x0 - 14, 92, s.bottomName, DC.mute, 11, "end")}
    {s.top.map((v, i) => <g key={`t${i}`}>{R(x0 + i * w, 26, w - 6, 28, false)}{T(x0 + i * w + (w - 6) / 2, 45, String(v), DC.ink, 12)}</g>)}
    {s.bottom.map((v, i) => <g key={`b${i}`}>{R(x0 + i * w, 72, w - 6, 28, !!s.hi?.includes(i))}
      {T(x0 + i * w + (w - 6) / 2, 91, String(v), s.hi?.includes(i) ? DC.lime : DC.ink, 12)}</g>)}
    {s.note && T(260, 126, s.note, DC.lime, 12)}
  </>;
}

function GridView(s: Extract<Spec, { kind: "grid" }>) {
  const r = s.rows.length, c = s.rows[0].length, cell = Math.min(30, 300 / Math.max(r, c));
  const x0 = 260 - (c * cell) / 2, y0 = 26;
  const col = (ch: string) => ch === "#" ? "#1c2320" : ch === "*" ? DC.on : DC.bg;
  return <>
    {s.rows.map((row, y) => row.split("").map((ch, x) => <g key={`${y}-${x}`}>
      <rect x={x0 + x * cell} y={y0 + y * cell} width={cell - 3} height={cell - 3} rx="3"
        fill={col(ch)} stroke={ch === "*" ? DC.onLine : DC.dim} strokeWidth="1.2" />
      {ch === "#" && T(x0 + x * cell + cell / 2 - 1, y0 + y * cell + cell / 2 + 3, "▧", DC.mute, 10)}
      {ch === "*" && T(x0 + x * cell + cell / 2 - 1, y0 + y * cell + cell / 2 + 4, "•", DC.lime, 12)}
    </g>))}
    {s.note && T(260, y0 + r * cell + 22, s.note, DC.lime, 12)}
  </>;
}

function GraphView(s: Extract<Spec, { kind: "graph" }>) {
  const palette = [DC.lime, DC.cool, DC.warm, DC.pink];
  return <>
    <defs><marker id="gm" markerWidth="9" markerHeight="9" refX="16" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 z" fill={DC.line} /></marker></defs>
    {s.edges.map(([a, b, w], i) => {
      const [x1, y1] = s.nodes[a], [x2, y2] = s.nodes[b];
      return <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={DC.line} strokeWidth="1.6" markerEnd={s.directed ? "url(#gm)" : undefined} />
        {w && T((x1 + x2) / 2, (y1 + y2) / 2 - 5, w, DC.mute, 11)}
      </g>;
    })}
    {s.nodes.map(([x, y, lab], i) => <g key={`n${i}`}>
      <circle cx={x} cy={y} r="16" fill={DC.bg} stroke={palette[i % palette.length]} strokeWidth="2" />
      {T(x, y + 5, lab, palette[i % palette.length], 12)}</g>)}
    {s.note && T(260, 142, s.note, DC.lime, 12)}
  </>;
}

function StackView(s: Extract<Spec, { kind: "stack" }>) {
  return <>
    {s.items.map((it, i) => <g key={i}>
      {R(190, 112 - i * 26, 140, 22, i === s.items.length - 1)}
      {T(260, 128 - i * 26, it, i === s.items.length - 1 ? DC.lime : DC.ink, 12)}</g>)}
    <path d="M360 24 L360 48" stroke={DC.lime} strokeWidth="2" />
    {T(400, 32, "push", DC.lime, 12)}
    <path d="M160 48 L160 24" stroke={DC.warm} strokeWidth="2" />
    {T(122, 32, "pop", DC.warm, 12)}
    {s.note && T(260, 142, s.note, DC.mute, 11)}
  </>;
}

function FlowView(s: Extract<Spec, { kind: "flow" }>) {
  const n = s.steps.length, w = Math.min(150, 480 / n), x0 = 260 - (n * w) / 2;
  return <>
    {s.steps.map((st, i) => <g key={i}>
      <rect x={x0 + i * w} y={48} width={w - 22} height={44} rx="9" fill={DC.bg} stroke={i === 0 ? DC.onLine : DC.dim} strokeWidth="1.6" />
      {T(x0 + i * w + (w - 22) / 2, 74, st, i === 0 ? DC.lime : DC.ink, 11)}
      {i < n - 1 && <path d={`M${x0 + i * w + w - 20} 70 L${x0 + (i + 1) * w - 4} 70`} stroke={DC.line} strokeWidth="1.8" />}
    </g>)}
    {s.note && T(260, 122, s.note, DC.lime, 12)}
  </>;
}

function CurveView(s: Extract<Spec, { kind: "curve" }>) {
  return <>
    <line x1="50" y1="120" x2="480" y2="120" stroke={DC.dim} strokeWidth="1.5" />
    <line x1="50" y1="120" x2="50" y2="20" stroke={DC.dim} strokeWidth="1.5" />
    <path d="M50 118 L480 112" stroke="#6fd17a" strokeWidth="2.5" fill="none" />
    <path d="M50 118 Q300 98 480 66" stroke={DC.cool} strokeWidth="2.5" fill="none" />
    <path d="M50 118 Q340 116 470 24" stroke={DC.warm} strokeWidth="2.5" fill="none" />
    {T(455, 106, "O(1)", "#6fd17a", 11, "end")}
    {T(474, 60, "O(n log n)", DC.cool, 11, "end")}
    {T(462, 20, "O(n²)", DC.warm, 11, "end")}
    {T(265, 138, s.note || "n →", DC.mute, 11)}
  </>;
}

function TableView(s: Extract<Spec, { kind: "table" }>) {
  const rows = s.rows.length, cols = s.rows[0].length;
  const cw = Math.min(62, 400 / cols), ch = Math.min(28, 90 / rows);
  const x0 = 260 - (cols * cw) / 2, y0 = 22;
  return <>
    {s.rows.map((row, r) => row.map((v, c) => {
      const on = s.hi ? s.hi[0] === r && s.hi[1] === c : false;
      return <g key={`${r}-${c}`}>{R(x0 + c * cw, y0 + r * ch, cw - 5, ch - 4, on)}
        {T(x0 + c * cw + (cw - 5) / 2, y0 + r * ch + ch / 2 + 4, String(v), on ? DC.lime : DC.mute, 11)}</g>;
    }))}
    {s.note && T(260, y0 + rows * ch + 24, s.note, DC.lime, 12)}
  </>;
}

const BAR_FILL: Record<BarState, string> = {
  cmp: DC.cool, swap: DC.warm, sorted: "#6fd17a", pivot: DC.pink, key: DC.lime,
};
const ZONE_COLOR: Record<ZoneTone, string> = {
  ok: "#6fd17a", warm: DC.warm, cool: DC.cool, dim: DC.mute,
};

/* Heights, not numbers in boxes. The point of a sorting picture is that you
   can see the order is wrong without reading anything. */
function BarsView(s: Extract<Spec, { kind: "bars" }>) {
  const n = s.values.length, w = Math.min(46, 440 / n), x0 = 260 - (n * w) / 2;
  const mx = Math.max(...s.values, 1), base = 116, maxH = 74;
  return <>
    {s.values.map((v, i) => {
      const h = Math.max(7, Math.round((v / mx) * maxH));
      const st = s.state?.[i], col = st ? BAR_FILL[st] : DC.dim;
      return <g key={i}>
        <rect x={x0 + i * w} y={base - h} width={Math.max(6, w - 7)} height={h} rx="3"
          fill={st ? col : "#18241e"} stroke={col} strokeWidth="1.4" opacity={st === "sorted" ? 0.85 : 1} />
        {T(x0 + i * w + (w - 7) / 2, base - h - 5, String(v), st ? col : DC.mute, 10)}
        {T(x0 + i * w + (w - 7) / 2, base + 14, String(i), DC.mute, 9)}
      </g>;
    })}
    {s.brace?.map((b, k) => {
      const xa = x0 + b.from * w, xb = x0 + (b.to + 1) * w - 7;
      return <g key={"br" + k}>
        <path d={"M" + xa + " 26 L" + xa + " 20 L" + xb + " 20 L" + xb + " 26"}
          stroke={DC.line} strokeWidth="1.3" fill="none" />
        {T((xa + xb) / 2, 15, b.text, DC.mute, 10)}
      </g>;
    })}
    {s.note && T(260, 145, s.note, DC.lime, 11)}
  </>;
}

/* A heap is an array, but nobody reasons about it as one. Laid out by index:
   node i sits above 2i+1 and 2i+2. */
function HeapView(s: Extract<Spec, { kind: "heap" }>) {
  const place = (i: number): [number, number] => {
    const lvl = Math.floor(Math.log2(i + 1)), inLvl = i - (2 ** lvl - 1), count = 2 ** lvl;
    return [40 + (440 / (count + 1)) * (inLvl + 1), 28 + lvl * 44];
  };
  const on = (i: number) => !!s.hi?.includes(i);
  const edgeLit = (a: number, b: number) => !!s.edgeHi?.some(([x, y]) => x === a && y === b);
  return <>
    {s.values.map((_, i) => {
      if (i === 0) return null;
      const parent = Math.floor((i - 1) / 2);
      const [x1, y1] = place(parent), [x2, y2] = place(i);
      return <line key={"e" + i} x1={x1} y1={y1 + 14} x2={x2} y2={y2 - 14}
        stroke={edgeLit(parent, i) ? DC.lime : DC.line} strokeWidth={edgeLit(parent, i) ? 2.2 : 1.4} />;
    })}
    {s.values.map((v, i) => {
      const [x, y] = place(i);
      return <g key={"n" + i}>
        <circle cx={x} cy={y} r="15" fill={on(i) ? DC.on : DC.bg}
          stroke={on(i) ? DC.lime : DC.line} strokeWidth={on(i) ? 2.2 : 1.5} />
        {T(x, y + 4, String(v), on(i) ? DC.lime : DC.ink, 12)}
        {T(x + 21, y - 11, String(i), DC.mute, 8)}
      </g>;
    })}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

/* An array carved into named regions. Every in-place sort is really a claim
   about which part is already finished — this draws that claim. */
function ZonesView(s: Extract<Spec, { kind: "zones" }>) {
  const n = s.values.length, w = Math.min(52, 450 / n), x0 = 260 - (n * w) / 2;
  const toneOf = (i: number) => s.zones.find(z => i >= z.from && i <= z.to)?.tone;
  return <>
    {s.zones.map((z, k) => {
      const xa = x0 + z.from * w, xb = x0 + (z.to + 1) * w - 6, col = ZONE_COLOR[z.tone || "dim"];
      return <g key={"z" + k}>
        <path d={"M" + xa + " 44 L" + xa + " 38 L" + xb + " 38 L" + xb + " 44"}
          stroke={col} strokeWidth="1.4" fill="none" />
        {T((xa + xb) / 2, 32, z.text, col, 10)}
      </g>;
    })}
    {s.values.map((v, i) => {
      const tone = toneOf(i), col = tone ? ZONE_COLOR[tone] : DC.dim;
      return <g key={i}>
        <rect x={x0 + i * w} y={56} width={w - 6} height={34} rx="5"
          fill={tone && tone !== "dim" ? DC.on : DC.bg} stroke={col} strokeWidth="1.5" />
        {T(x0 + i * w + (w - 6) / 2, 78, String(v), tone && tone !== "dim" ? col : DC.ink, 12)}
        {T(x0 + i * w + (w - 6) / 2, 104, String(i), DC.mute, 9)}
      </g>;
    })}
    {s.ptr?.map((pt, k) => <g key={"p" + k}>
      <path d={"M" + (x0 + pt.at * w + (w - 6) / 2) + " 112 L" + (x0 + pt.at * w + (w - 6) / 2) + " 122"}
        stroke={pt.color || DC.warm} strokeWidth="2" />
      {T(x0 + pt.at * w + (w - 6) / 2, 136, pt.text, pt.color || DC.warm, 11)}
    </g>)}
    {s.note && T(260, 148, s.note, DC.lime, 11)}
  </>;
}

/* Two sorted streams feeding one output — the picture merge sort deserves and
   that a plain two-row diagram cannot give it. */
function MergeView(s: Extract<Spec, { kind: "merge" }>) {
  const cells = Math.max(s.left.length, s.right.length, s.out.length, 1);
  const w = Math.min(40, 330 / cells), x0 = 150;
  const row = (vals: (string | number)[], y: number, lit: number | undefined, name: string, col: string) => <>
    {T(x0 - 12, y + 17, name, DC.mute, 10, "end")}
    {vals.map((v, i) => <g key={name + i}>
      <rect x={x0 + i * w} y={y} width={w - 5} height={25} rx="4"
        fill={i === lit ? DC.on : DC.bg} stroke={i === lit ? col : DC.dim} strokeWidth={i === lit ? 2 : 1.3} />
      {T(x0 + i * w + (w - 5) / 2, y + 17, String(v), i === lit ? col : DC.ink, 11)}
    </g>)}
  </>;
  return <>
    {row(s.left, 18, s.li, "chap", DC.cool)}
    {row(s.right, 52, s.ri, "o‘ng", DC.warm)}
    <path d="M260 84 L260 96" stroke={DC.line} strokeWidth="1.6" />
    <path d="M254 90 L260 97 L266 90" fill="none" stroke={DC.line} strokeWidth="1.6" />
    {row(s.out, 102, undefined, "natija", DC.lime)}
    {s.note && T(260, 148, s.note, DC.lime, 11)}
  </>;
}

/* Counting sort compares nothing; it drops values into labelled containers.
   So the picture is containers, not a row. */
function BucketsView(s: Extract<Spec, { kind: "buckets" }>) {
  const n = s.keys.length, w = Math.min(56, 450 / n), x0 = 260 - (n * w) / 2;
  const mx = Math.max(...s.counts, 1), top = 30, box = 66;
  return <>
    {s.keys.map((k, i) => {
      const on = !!s.hi?.includes(i);
      const fillH = Math.round((s.counts[i] / mx) * (box - 6));
      const col = on ? DC.lime : DC.line;
      return <g key={i}>
        <rect x={x0 + i * w} y={top} width={w - 8} height={box} rx="4" fill={DC.bg} stroke={col} strokeWidth="1.4" />
        {s.counts[i] > 0 && <rect x={x0 + i * w + 3} y={top + box - fillH - 3} width={w - 14} height={fillH} rx="3"
          fill={on ? "rgba(200,255,118,.22)" : "rgba(122,145,132,.16)"} stroke={col} strokeWidth="1" />}
        {T(x0 + i * w + (w - 8) / 2, top + box - 8, String(s.counts[i]), on ? DC.lime : DC.ink, 12)}
        {T(x0 + i * w + (w - 8) / 2, top + box + 19, String(k), DC.mute, 11)}
      </g>;
    })}
    {T(x0 - 12, top + box / 2, "soni", DC.mute, 10, "end")}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

/* The drawing on its own, with no figure or caption around it. The step
   player reuses it: a simulation is the same picture redrawn frame by frame,
   and it needs the caption slot for the step's own explanation. */
export function DiagramBody({ spec }: { spec: Spec }) {
  switch (spec.kind) {
    case "array": return <ArrayView {...spec} />;
    case "tworow": return <TwoRow {...spec} />;
    case "grid": return <GridView {...spec} />;
    case "graph": return <GraphView {...spec} />;
    case "stack": return <StackView {...spec} />;
    case "flow": return <FlowView {...spec} />;
    case "curve": return <CurveView {...spec} />;
    case "table": return <TableView {...spec} />;
    case "bars": return <BarsView {...spec} />;
    case "heap": return <HeapView {...spec} />;
    case "zones": return <ZonesView {...spec} />;
    case "merge": return <MergeView {...spec} />;
    case "buckets": return <BucketsView {...spec} />;
  }
}

export function DiagramFromSpec({ spec }: { spec: Spec }) {
  return (
    <figure className="concept-figure">
      <svg viewBox="0 0 520 152" role="img" aria-label={spec.label}><DiagramBody spec={spec} /></svg>
      <figcaption>{spec.label}</figcaption>
    </figure>
  );
}
