"use client";

// Data-driven concept diagrams.
//
// The first version keyed one picture per roadmap, so all 15 units of a bo'lim
// showed the same image. These are primitives instead: a unit supplies a small
// spec and gets its own picture. All original SVG.

export type PickState = "pick" | "drop" | "idle";
export type LayerState = "src" | "seen" | "frontier" | "far";
export type SpanTone = "ok" | "warm" | "cool";

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
      hi?: number[]; note?: string }
  /* Recursion's own vocabulary. What a learner cannot see here is the machine:
     the frames piling up on the stack, the branch being abandoned, the board
     state a queen forbids, the bits standing in for a subset. Each of these
     draws one of those invisible things. */
  | { kind: "tree"; label: string;
      nodes: { id: number; parent: number | null; text: string; state?: TreeState; edge?: string }[];
      note?: string }
  | { kind: "board"; label: string; cells: string[]; note?: string }
  | { kind: "callstack"; label: string;
      frames: { text: string; state?: FrameState }[]; ret?: string; note?: string }
  | { kind: "bits"; label: string; value: number; width: number;
      names?: string[]; hi?: number[]; note?: string }
  /* Number theory's own vocabulary. Arithmetic modulo m is a circle, a sieve
     is a grid being crossed out, binomials are a triangle, counting overlaps
     is a Venn diagram, and Euclid's algorithm is a rectangle being peeled
     into squares. Drawing any of these as a row of boxes loses the idea. */
  | { kind: "wheel"; label: string; m: number; hi?: number[]; ptr?: number;
      arc?: [number, number]; centre?: string; note?: string }
  | { kind: "numgrid"; label: string; from: number; to: number; cols?: number;
      state?: Record<number, NumState>; note?: string }
  | { kind: "pascal"; label: string; rows: number; hi?: [number, number][];
      note?: string }
  | { kind: "venn"; label: string; sets: string[]; counts?: string[]; note?: string }
  | { kind: "squares"; label: string; w: number; h: number; note?: string }
  /* Data structures' own vocabulary. What matters about each of these is a
     relationship a row of boxes cannot show: which range a node owns, which
     indices one counter covers, which set a element belongs to, which slot a
     key hashed into, and which end of a queue is moving. */
  | { kind: "segtree"; label: string; n: number; hi?: string[]; note?: string }
  | { kind: "ranges"; label: string; n: number;
      spans: { at: number; from: number; to: number; text?: string; on?: boolean }[];
      note?: string }
  | { kind: "forest"; label: string;
      nodes: { id: number; parent: number | null; text?: string; state?: TreeState }[];
      note?: string }
  | { kind: "hashtable"; label: string; slots: (string[] | null)[]; hi?: number[]; note?: string }
  | { kind: "queue"; label: string; items: (string | number)[]; front?: number; back?: number;
      note?: string }
  /* Binary search's own vocabulary. What it does is shrink something — an
     interval on a line, a region of a plot, a corner of a matrix — and the
     shrinking is the whole idea, so the pictures have to show it. */
  | { kind: "numberline"; label: string; from: number; to: number;
      marks?: { at: number; text: string; tone?: "lo" | "hi" | "mid" | "hit" }[];
      span?: [number, number]; ticks?: number; note?: string }
  | { kind: "plot"; label: string; values: number[];
      marks?: { at: number; text: string }[]; drop?: [number, number]; note?: string }
  | { kind: "matrix"; label: string; rows: (string | number)[][];
      hi?: [number, number][]; dim?: [number, number][]; note?: string }
  /* Greedy's own vocabulary. A greedy algorithm is a sequence of commitments,
     and every classic one commits to a different kind of thing: a slot on a
     timeline, a swap that proves a choice was safe, a value-per-kilogram, a
     lead that is never given up, a stack that throws away what it regrets. */
  | { kind: "timeline"; label: string; from: number; to: number;
      items: { s: number; e: number; text?: string; state?: PickState }[];
      cut?: { at: number; text: string }; note?: string }
  | { kind: "exchange"; label: string; opt: (string | number)[]; greedy: (string | number)[];
      swap?: [number, number]; optName?: string; greedyName?: string; note?: string }
  | { kind: "ratio"; label: string; items: { w: number; v: number; text?: string }[];
      cap?: number; note?: string }
  | { kind: "stairs"; label: string; a: number[]; b: number[];
      aName?: string; bName?: string; note?: string }
  | { kind: "mstack"; label: string; kept: (string | number)[]; popped?: (string | number)[];
      incoming?: string; note?: string }
  /* The graph track's own vocabulary. A generic node-and-edge picture hides
     the very things these algorithms are about: the wavefront moving outward
     in levels, a grid being flooded, capacity against flow on an edge, the
     rho shape a successor function always makes, two sides being matched. */
  | { kind: "layers"; label: string;
      cols: { text: string; nodes: { text: string; state?: LayerState }[] }[];
      links?: [number, number, number][]; note?: string }
  | { kind: "gridpath"; label: string; rows: string[]; nums?: (string | number)[][];
      note?: string }
  | { kind: "flownet"; label: string; nodes: [number, number, string][];
      edges: { from: number; to: number; cap: number; flow?: number; on?: boolean }[];
      cut?: { x: number; text: string }; note?: string }
  | { kind: "rho"; label: string; tail: (string | number)[]; cycle: (string | number)[];
      hi?: number[]; marks?: { at: number; text: string }[]; note?: string }
  | { kind: "bip"; label: string; left: string[]; right: string[];
      edges: [number, number][]; match?: [number, number][]; note?: string }
  /* The strings track's own vocabulary. Everything here happens to a row of
     characters: a pattern slides under a text, a border is a span that repeats
     at both ends, a suffix array is a sorted list with LCP between neighbours,
     a palindrome is a radius around a centre, and an automaton is states with
     suffix links. A plain array of boxes shows none of that. */
  | { kind: "align"; label: string; text: string; pat: string; at: number;
      match?: number; mism?: number; note?: string }
  | { kind: "strspans"; label: string; text: string;
      spans: { from: number; to: number; text: string; tone?: SpanTone }[];
      note?: string }
  | { kind: "sarray"; label: string;
      rows: { idx: string | number; suf: string; lcp?: string | number }[];
      hi?: number[]; note?: string }
  | { kind: "palin"; label: string; text: string; radii?: number[];
      centre?: number; note?: string }
  | { kind: "automaton"; label: string; nodes: [number, number, string][];
      edges: { from: number; to: number; text?: string }[];
      links?: [number, number][]; note?: string }
  /* Geometry's own vocabulary. Everything here lives on a plane, and a plane
     drawn with the wrong aspect ratio is worse than no picture at all — a
     right angle that does not look right teaches the wrong thing. So these
     all share one mapper that preserves shape. */
  | { kind: "plane"; label: string; view?: Box4;
      pts?: GeoPt[]; segs?: GeoSeg[]; poly?: [number, number][];
      fill?: boolean; note?: string }
  | { kind: "angle"; label: string; u: [number, number]; v: [number, number];
      uName?: string; vName?: string; text?: string; note?: string }
  | { kind: "sweep"; label: string; view?: Box4;
      rects: { x1: number; y1: number; x2: number; y2: number; on?: boolean }[];
      at?: number; atText?: string; note?: string }
  | { kind: "circle"; label: string; view?: Box4;
      circles: { x: number; y: number; r: number; text?: string; tone?: GeoTone }[];
      pts?: GeoPt[]; segs?: GeoSeg[]; note?: string }
  | { kind: "lattice"; label: string; w: number; h: number;
      poly: [number, number][]; inside?: [number, number][];
      onEdge?: [number, number][]; note?: string };

export type Box4 = [number, number, number, number];
export type GeoTone = "ink" | "lime" | "cool" | "warm" | "pink";
export type GeoPt = { x: number; y: number; text?: string; tone?: GeoTone; below?: boolean };
export type GeoSeg = { a: [number, number]; b: [number, number]; text?: string;
                       tone?: GeoTone; dash?: boolean };

/** How one number of a sieve grid is doing. */
export type NumState = "prime" | "composite" | "current" | "marked" | "picked";

/** How a node of a search tree is taking part in the current step. */
export type TreeState = "active" | "done" | "pruned" | "solution" | "idle";
/** A stack frame is either running, waiting for a callee, or finished. */
export type FrameState = "active" | "waiting" | "returned";

/** How a bar is taking part in the current step. */
export type BarState = "cmp" | "swap" | "sorted" | "pivot" | "key";
export type ZoneTone = "ok" | "warm" | "cool" | "dim";

const T = (x: number, y: number, s: string, fill = DC.ink, size = 13, anchor: "middle" | "start" | "end" = "middle") => (
  <text x={x} y={y} fill={fill} fontSize={size} textAnchor={anchor} fontFamily="ui-monospace, monospace">{s}</text>
);
const R = (x: number, y: number, w: number, h: number, on: boolean) => (
  <rect x={x} y={y} width={w} height={h} rx="5" fill={on ? DC.on : DC.bg} stroke={on ? DC.onLine : DC.dim} strokeWidth="1.5" />
);

/* Text in these diagrams sits inside boxes of a fixed width, and a label that
   is wider than its box does not clip — it runs over its neighbour. Rather
   than trimming the words, the type shrinks until it fits, down to a floor
   where it would stop being readable. The mono face used here averages about
   0.62em per character, which is close enough to place a label safely. */
const CHAR_W = 0.62;
const textW = (t: string, size: number) => t.length * size * CHAR_W;
const fit = (t: string, boxW: number, base: number, min = 7.5) =>
  Math.max(min, Math.min(base, boxW / Math.max(t.length * CHAR_W, 0.001)));

function ArrayView(s: Extract<Spec, { kind: "array" }>) {
  const n = s.values.length, w = Math.min(58, 460 / n), x0 = 260 - (n * w) / 2;
  return <>
    {s.values.map((v, i) => <g key={i}>{R(x0 + i * w, 42, w - 6, 34, !!s.hi?.includes(i))}
      {T(x0 + i * w + (w - 6) / 2, 64, String(v), s.hi?.includes(i) ? DC.lime : DC.ink, fit(String(v), w - 10, 12))}
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
    {s.top.map((v, i) => <g key={`t${i}`}>{R(x0 + i * w, 26, w - 6, 28, false)}{T(x0 + i * w + (w - 6) / 2, 45, String(v), DC.ink, fit(String(v), w - 10, 12))}</g>)}
    {s.bottom.map((v, i) => <g key={`b${i}`}>{R(x0 + i * w, 72, w - 6, 28, !!s.hi?.includes(i))}
      {T(x0 + i * w + (w - 6) / 2, 91, String(v), s.hi?.includes(i) ? DC.lime : DC.ink, fit(String(v), w - 10, 12))}</g>)}
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
    {s.note && T(260, Math.min(146, y0 + r * cell + 22), s.note, DC.lime, 12)}
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
    {/* A note under the figure only works when the figure leaves room for it;
        with nodes this low it goes above instead of on top of them. */}
    {s.note && T(260, Math.max(...s.nodes.map(n => n[1])) > 108 ? 12 : 142, s.note, DC.lime, 12)}
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
      {T(x0 + i * w + (w - 22) / 2, 74, st, i === 0 ? DC.lime : DC.ink, fit(st, w - 28, 11))}
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
  const ch = Math.min(28, 90 / rows);
  /* Columns take the width their content asks for. Equal columns look tidy
     until one holds "= |A| + |B| − |A ∩ B|" and the next holds "67", at which
     point the long one spills across its neighbour. */
  const widest = Array.from({ length: cols }, (_, c) =>
    Math.max(...s.rows.map(r => String(r[c] ?? "").length), 1));
  const weight = widest.reduce((a, b) => a + b, 0);
  const avail = 470;
  const colW = widest.map(w => Math.max(34, (avail * w) / weight));
  const total = colW.reduce((a, b) => a + b, 0);
  const scale = total > avail ? avail / total : 1;
  const w = colW.map(v => v * scale);
  const left = 260 - w.reduce((a, b) => a + b, 0) / 2;
  const xOf = (c: number) => left + w.slice(0, c).reduce((a, b) => a + b, 0);
  return <>
    {s.rows.map((row, r) => row.map((v, c) => {
      const on = s.hi ? s.hi[0] === r && s.hi[1] === c : false;
      const txt = String(v), boxW = w[c] - 5;
      return <g key={`${r}-${c}`}>{R(xOf(c), y0T + r * ch, boxW, ch - 4, on)}
        {T(xOf(c) + boxW / 2, y0T + r * ch + ch / 2 + 4, txt, on ? DC.lime : DC.mute, fit(txt, boxW - 6, 11))}</g>;
    }))}
    {s.note && T(260, Math.min(148, y0T + rows * ch + 24), s.note, DC.lime, 12)}
  </>;
}
const y0T = 22;

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
        {T((xa + xb) / 2, 15, b.text, DC.mute, fit(b.text, Math.max(xb - xa, 30), 10))}
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
        {T((xa + xb) / 2, 32, z.text, col, fit(z.text, Math.max(xb - xa, 30), 10))}
      </g>;
    })}
    {s.values.map((v, i) => {
      const tone = toneOf(i), col = tone ? ZONE_COLOR[tone] : DC.dim;
      return <g key={i}>
        <rect x={x0 + i * w} y={56} width={w - 6} height={34} rx="5"
          fill={tone && tone !== "dim" ? DC.on : DC.bg} stroke={col} strokeWidth="1.5" />
        {T(x0 + i * w + (w - 6) / 2, 78, String(v), tone && tone !== "dim" ? col : DC.ink, fit(String(v), w - 10, 12))}
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
      {T(x0 + i * w + (w - 5) / 2, y + 17, String(v), i === lit ? col : DC.ink, fit(String(v), w - 9, 11))}
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
        {T(x0 + i * w + (w - 8) / 2, top + box + 19, String(k), DC.mute, fit(String(k), w - 8, 11))}
      </g>;
    })}
    {T(x0 - 12, top + box / 2, "soni", DC.mute, 10, "end")}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

const TREE_COLOR: Record<TreeState, string> = {
  active: DC.lime, done: "#6fd17a", pruned: "#7a5a5a", solution: DC.warm, idle: DC.line,
};
const FRAME_COLOR: Record<FrameState, string> = {
  active: DC.lime, waiting: DC.line, returned: "#6fd17a",
};

/* The search tree, laid out automatically from parent links. Backtracking is
   a walk over this shape, and drawing it by hand for every step would be
   unmaintainable — so a node only says who its parent is. */
function TreeView(s: Extract<Spec, { kind: "tree" }>) {
  const nodes = s.nodes;
  const byId = new Map(nodes.map(n => [n.id, n]));
  const depthOf = (n: typeof nodes[number]): number => {
    let d = 0, cur = n;
    while (cur.parent !== null) { const p = byId.get(cur.parent); if (!p) break; cur = p; ++d; }
    return d;
  };
  const kids = (id: number) => nodes.filter(n => n.parent === id);
  const leaves = nodes.filter(n => kids(n.id).length === 0);
  const leafX = new Map<number, number>();
  const span = Math.min(78, 440 / Math.max(leaves.length, 1));
  const x0 = 260 - ((leaves.length - 1) * span) / 2;
  leaves.forEach((n, i) => leafX.set(n.id, x0 + i * span));
  const xOf = (id: number): number => {
    if (leafX.has(id)) return leafX.get(id) as number;
    const ch = kids(id);
    const xs = ch.map(c => xOf(c.id));
    return xs.reduce((a, b) => a + b, 0) / Math.max(xs.length, 1);
  };
  const maxDepth = Math.max(...nodes.map(depthOf), 0);
  /* A four-level tree has to leave room for the note underneath it, so the
     rows close up and the discs shrink rather than running off the canvas. */
  const rowH = maxDepth >= 3 ? 32 : 44;
  const yOf = (n: typeof nodes[number]) => 22 + depthOf(n) * rowH;
  const r = maxDepth >= 3 ? 11 : 14;

  return <>
    {nodes.map(n => {
      if (n.parent === null) return null;
      const p = byId.get(n.parent);
      if (!p) return null;
      const x1 = xOf(p.id), y1 = yOf(p), x2 = xOf(n.id), y2 = yOf(n);
      const col = n.state === "pruned" ? TREE_COLOR.pruned : DC.line;
      return <g key={"e" + n.id}>
        <line x1={x1} y1={y1 + r} x2={x2} y2={y2 - r} stroke={col} strokeWidth="1.5"
          strokeDasharray={n.state === "pruned" ? "3 3" : undefined} />
        {n.edge && T((x1 + x2) / 2 + (x2 > x1 ? 12 : -12), (y1 + y2) / 2 + 3, n.edge, DC.mute, 9)}
      </g>;
    })}
    {nodes.map(n => {
      const st = n.state || "idle", col = TREE_COLOR[st];
      const filled = st === "active" || st === "solution";
      return <g key={"n" + n.id}>
        <circle cx={xOf(n.id)} cy={yOf(n)} r={r} fill={filled ? DC.on : DC.bg} stroke={col}
          strokeWidth={filled ? 2.2 : 1.5} strokeDasharray={st === "pruned" ? "3 2" : undefined} />
        {T(xOf(n.id), yOf(n) + 4, n.text, st === "idle" ? DC.ink : col, r > 12 ? 11 : 10)}
        {st === "pruned" && T(xOf(n.id) + r + 6, yOf(n) + 4, "✗", TREE_COLOR.pruned, 10)}
      </g>;
    })}
    {/* Deep trees reach the bottom of the canvas, so their note moves up top
        rather than printing over the last row of nodes. */}
    {s.note && T(260, 24 + maxDepth * rowH + r + 14 > 148 ? 12 : 24 + maxDepth * rowH + r + 14, s.note, DC.lime, 11)}
  </>;
}

/* A board, for the problems whose state IS a board: queens, knights, a maze.
   'Q' a piece, 'x' a square it attacks, '!' a conflict, '*' a candidate. */
function BoardView(s: Extract<Spec, { kind: "board" }>) {
  const rows = s.cells.length, cols = s.cells[0]?.length || 1;
  const cell = Math.min(26, 118 / Math.max(rows, cols));
  const x0 = 260 - (cols * cell) / 2, y0 = 16;
  const bg = (ch: string, r: number, c: number) =>
    ch === "!" ? "rgba(255,107,107,.20)" :
    ch === "Q" ? "rgba(200,255,118,.18)" :
    ch === "x" ? "rgba(122,145,132,.13)" :
    ch === "*" ? "rgba(138,216,255,.14)" :
    (r + c) % 2 ? "#0f1713" : DC.bg;
  return <>
    {s.cells.map((row, r) => row.split("").map((ch, c) => <g key={r + "-" + c}>
      <rect x={x0 + c * cell} y={y0 + r * cell} width={cell - 1.5} height={cell - 1.5} rx="2"
        fill={bg(ch, r, c)} stroke={ch === "Q" ? DC.lime : ch === "!" ? "#ff6b6b" : DC.dim}
        strokeWidth={ch === "Q" || ch === "!" ? 1.6 : 1} />
      {ch === "Q" && T(x0 + c * cell + cell / 2 - 0.75, y0 + r * cell + cell / 2 + 4, "♛", DC.lime, cell * 0.62)}
      {ch === "x" && T(x0 + c * cell + cell / 2 - 0.75, y0 + r * cell + cell / 2 + 3, "·", DC.mute, cell * 0.7)}
      {ch === "!" && T(x0 + c * cell + cell / 2 - 0.75, y0 + r * cell + cell / 2 + 4, "✗", "#ff6b6b", cell * 0.5)}
      {ch === "*" && T(x0 + c * cell + cell / 2 - 0.75, y0 + r * cell + cell / 2 + 4, "?", DC.cool, cell * 0.5)}
    </g>))}
    {s.note && T(260, Math.min(144, y0 + rows * cell + 16), s.note, DC.lime, 11)}
  </>;
}

/* The call stack. The one thing a beginner cannot see about recursion is that
   every call is still sitting there, waiting for the one above it to return. */
function CallStackView(s: Extract<Spec, { kind: "callstack" }>) {
  const n = s.frames.length, h = Math.min(21, 118 / Math.max(n, 1));
  const baseY = 132;
  return <>
    {T(16, 20, "chaqiruvlar steki", DC.mute, 10, "start")}
    {s.frames.map((f, i) => {
      const st = f.state || "waiting", col = FRAME_COLOR[st];
      const y = baseY - (i + 1) * (h + 2);
      const indent = i * 12;
      return <g key={i}>
        <rect x={150 + indent} y={y} width={Math.max(90, 250 - indent)} height={h} rx="4"
          fill={st === "active" ? DC.on : DC.bg} stroke={col} strokeWidth={st === "active" ? 2 : 1.3} />
        {T(160 + indent, y + h / 2 + 4, f.text, st === "waiting" ? DC.ink : col, 11, "start")}
        {st === "returned" && T(150 + indent + Math.max(90, 250 - indent) + 10, y + h / 2 + 4, "↩", "#6fd17a", 11, "start")}
      </g>;
    })}
    <line x1="140" y1={baseY + 4} x2="440" y2={baseY + 4} stroke={DC.dim} strokeWidth="1.4" />
    {T(16, baseY + 18, "main", DC.mute, 10, "start")}
    {s.ret && T(400, 20, "qaytadi: " + s.ret, "#6fd17a", 11)}
    {s.note && T(260, 144, s.note, DC.lime, 11)}
  </>;
}

/* Bits, for when a subset is being carried inside an integer. Element i is
   present exactly when bit i is set, and the picture says so directly. */
function BitsView(s: Extract<Spec, { kind: "bits" }>) {
  const w = Math.min(46, 400 / s.width), x0 = 260 - (s.width * w) / 2;
  return <>
    {Array.from({ length: s.width }, (_, k) => {
      const bit = s.width - 1 - k;              // MSB on the left, as written
      const on = ((s.value >> bit) & 1) === 1;
      const lit = !!s.hi?.includes(bit);
      const col = lit ? DC.warm : on ? DC.lime : DC.dim;
      return <g key={k}>
        <rect x={x0 + k * w} y={44} width={w - 6} height={32} rx="4"
          fill={on ? DC.on : DC.bg} stroke={col} strokeWidth={lit ? 2.2 : 1.4} />
        {T(x0 + k * w + (w - 6) / 2, 65, on ? "1" : "0", col, 13)}
        {T(x0 + k * w + (w - 6) / 2, 92, "bit " + bit, DC.mute, 9)}
        {s.names?.[bit] && T(x0 + k * w + (w - 6) / 2, 34, s.names[bit], on ? DC.lime : DC.mute, 10)}
      </g>;
    })}
    {T(x0 - 12, 65, "mask", DC.mute, 10, "end")}
    {T(260, 116, "= " + s.value, DC.ink, 12)}
    {s.note && T(260, 140, s.note, DC.lime, 11)}
  </>;
}

const NUM_COLOR: Record<NumState, string> = {
  prime: "#6fd17a", composite: DC.mute, current: DC.lime, marked: DC.warm, picked: DC.cool,
};

/* Arithmetic modulo m is not a line, it is a circle — and every confusing
   thing about it (negative remainders, wrap-around, cycles) stops being
   confusing the moment you see the circle. */
function WheelView(s: Extract<Spec, { kind: "wheel" }>) {
  const cx = 260, cy = 78, R = 56;
  const at = (i: number): [number, number] => {
    const a = (-Math.PI / 2) + (2 * Math.PI * i) / s.m;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  };
  return <>
    <circle cx={cx} cy={cy} r={R} fill="none" stroke={DC.dim} strokeWidth="1.3" />
    {s.arc && (() => {
      const [f, t] = s.arc;
      const [x1, y1] = at(f), [x2, y2] = at(t);
      const span = ((t - f) % s.m + s.m) % s.m;
      return <path d={"M" + x1 + " " + y1 + " A " + R + " " + R + " 0 " + (span * 2 > s.m ? 1 : 0) + " 1 " + x2 + " " + y2}
        fill="none" stroke={DC.warm} strokeWidth="2.4" />;
    })()}
    {/* The discs shrink as the modulus grows, so a mod-15 wheel does not
        collide with itself the way a mod-7 one never would. */}
    {Array.from({ length: s.m }, (_, i) => {
      const [x, y] = at(i);
      const rad = s.m > 12 ? 9 : s.m > 8 ? 10.5 : 12;
      const on = !!s.hi?.includes(i), isPtr = s.ptr === i;
      const col = isPtr ? DC.warm : on ? DC.lime : DC.mute;
      return <g key={i}>
        <circle cx={x} cy={y} r={rad} fill={on || isPtr ? DC.on : DC.bg} stroke={col} strokeWidth={on || isPtr ? 2 : 1.2} />
        {T(x, y + 4, String(i), col, s.m > 12 ? 9 : 11)}
      </g>;
    })}
    {s.centre && T(cx, cy + 5, s.centre, DC.ink, 13)}
    {s.ptr !== undefined && (() => {
      const [x, y] = at(s.ptr);
      return <line x1={cx} y1={cy} x2={x - (x - cx) * 0.24} y2={y - (y - cy) * 0.24} stroke={DC.warm} strokeWidth="1.8" />;
    })()}
    {s.note && T(260, 148, s.note, DC.lime, 11)}
  </>;
}

/* A sieve is a grid of numbers being struck out. Showing which are still
   standing, which fell, and which multiple is being crossed right now. */
function NumGridView(s: Extract<Spec, { kind: "numgrid" }>) {
  const total = s.to - s.from + 1;
  const cols = s.cols || Math.min(10, total);
  const rows = Math.ceil(total / cols);
  const w = Math.min(42, 440 / cols), h = Math.min(24, 112 / rows);
  const x0 = 260 - (cols * w) / 2, y0 = 18;
  return <>
    {Array.from({ length: total }, (_, k) => {
      const v = s.from + k, r = Math.floor(k / cols), c = k % cols;
      const st = s.state?.[v], col = st ? NUM_COLOR[st] : DC.dim;
      const strike = st === "composite" || st === "marked";
      const x = x0 + c * w, y = y0 + r * h;
      return <g key={v}>
        <rect x={x} y={y} width={w - 3} height={h - 3} rx="3"
          fill={st === "current" || st === "prime" || st === "picked" ? DC.on : DC.bg}
          stroke={col} strokeWidth={st === "current" ? 2.2 : 1.1} />
        {T(x + (w - 3) / 2, y + (h - 3) / 2 + 4, String(v), col, 10)}
        {strike && <line x1={x + 3} y1={y + (h - 3) / 2} x2={x + w - 6} y2={y + (h - 3) / 2}
          stroke={col} strokeWidth="1.2" />}
      </g>;
    })}
    {s.note && T(260, Math.min(146, y0 + rows * h + 14), s.note, DC.lime, 11)}
  </>;
}

/* Pascal's triangle. Every identity about binomial coefficients is visible in
   it, so the picture does more explaining than the formula does. */
function PascalView(s: Extract<Spec, { kind: "pascal" }>) {
  const rows = Math.min(s.rows, 6);
  const cell = Math.min(46, 300 / rows), rowH = Math.min(22, 118 / rows);
  const val: number[][] = [];
  for (let r = 0; r < rows; ++r) {
    val.push([]);
    for (let c = 0; c <= r; ++c) val[r].push(c === 0 || c === r ? 1 : val[r - 1][c - 1] + val[r - 1][c]);
  }
  const lit = (r: number, c: number) => !!s.hi?.some(([a, b]) => a === r && b === c);
  return <>
    {val.map((row, r) => row.map((v, c) => {
      const x = 260 + (c - r / 2) * cell, y = 22 + r * rowH;
      const on = lit(r, c);
      return <g key={r + "-" + c}>
        <rect x={x - cell / 2 + 3} y={y - rowH / 2 + 2} width={cell - 6} height={rowH - 4} rx="3"
          fill={on ? DC.on : DC.bg} stroke={on ? DC.lime : DC.dim} strokeWidth={on ? 2 : 1} />
        {T(x, y + 4, String(v), on ? DC.lime : DC.ink, 10)}
      </g>;
    }))}
    {s.note && T(260, Math.min(146, 22 + rows * rowH + 16), s.note, DC.lime, 11)}
  </>;
}

/* Overlapping sets. Inclusion-exclusion is one of those rules that looks
   arbitrary written down and obvious drawn. */
function VennView(s: Extract<Spec, { kind: "venn" }>) {
  const three = s.sets.length >= 3;
  /* Every label is placed where nothing else is drawn. The three-set case is
     the tight one: its lowest circle leaves no room underneath, so the whole
     figure lifts and that label sits below it with the note above instead. */
  const R = three ? 31 : 42, cy = three ? 58 : 74;
  const pts: [number, number][] = three
    ? [[234, cy], [286, cy], [260, cy + 30]]
    : [[228, cy], [292, cy]];
  const cols = [DC.lime, DC.cool, DC.warm];
  const labelAt: [number, number][] = three
    ? [[186, cy - 6], [334, cy - 6], [260, cy + 30 + R + 15]]
    : [[168, cy + 4], [352, cy + 4]];
  return <>
    {pts.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={R} fill="none" stroke={cols[i]} strokeWidth="1.8" opacity="0.9" />
    ))}
    {pts.map((_, i) => {
      const [lx, ly] = labelAt[i];
      return T(lx, ly, s.sets[i], cols[i], fit(s.sets[i], three ? 92 : 108, 11));
    })}
    {s.counts?.map((c, i) => {
      const spots: [number, number][] = three
        ? [[214, cy - 12], [306, cy - 12], [260, cy + 44], [260, cy - 14], [236, cy + 20], [284, cy + 20], [260, cy + 12]]
        : [[218, cy], [302, cy], [260, cy]];
      const [x, y] = spots[i] || [260, cy];
      return c ? T(x, y + 4, c, DC.ink, 11) : null;
    })}
    {/* Three sets fill the bottom, so their note goes above the figure. */}
    {s.note && T(260, three ? 14 : 148, s.note, DC.lime, 11)}
  </>;
}

/* Euclid's algorithm, the way the Greeks saw it: peel the largest square you
   can off a rectangle and repeat. The last square is the gcd. */
function SquaresView(s: Extract<Spec, { kind: "squares" }>) {
  /* 92, not 104: the rectangle has to leave room for the dimension label and
     the note beneath it without either clearing the bottom of the canvas. */
  const scale = Math.min(300 / Math.max(s.w, 1), 92 / Math.max(s.h, 1));
  const x0 = 260 - (s.w * scale) / 2, y0 = 20;
  const parts: { x: number; y: number; side: number; i: number }[] = [];
  let w = s.w, h = s.h, ox = 0, oy = 0, guard = 0;
  while (w > 0 && h > 0 && guard++ < 40) {
    const side = Math.min(w, h);
    if (w >= h) { parts.push({ x: ox, y: oy, side, i: parts.length }); ox += side; w -= side; }
    else { parts.push({ x: ox, y: oy, side, i: parts.length }); oy += side; h -= side; }
  }
  const last = parts.length ? parts[parts.length - 1].side : 0;
  return <>
    {parts.map(pt => {
      const isLast = pt.side === last;
      return <g key={pt.i}>
        <rect x={x0 + pt.x * scale} y={y0 + pt.y * scale} width={pt.side * scale} height={pt.side * scale}
          fill={isLast ? "rgba(200,255,118,.12)" : DC.bg} stroke={isLast ? DC.lime : DC.line} strokeWidth="1.4" />
        {pt.side * scale > 20 && T(x0 + (pt.x + pt.side / 2) * scale, y0 + (pt.y + pt.side / 2) * scale + 4,
          String(pt.side), isLast ? DC.lime : DC.mute, 10)}
      </g>;
    })}
    {T(x0 + (s.w * scale) / 2, y0 + s.h * scale + 13, s.w + " × " + s.h, DC.mute, 10)}
    {s.note && T(260, Math.min(145, y0 + s.h * scale + 30), s.note, DC.lime, 11)}
  </>;
}

/* A segment tree drawn over the array it indexes: every node shows the range
   it owns, which is the one thing the code never says out loud. */
function SegTreeView(s: Extract<Spec, { kind: "segtree" }>) {
  const nodes: { l: number; r: number; d: number }[] = [];
  const build = (l: number, r: number, d: number) => {
    nodes.push({ l, r, d });
    if (l === r || d >= 3) return;
    const m = Math.floor((l + r) / 2);
    build(l, m, d + 1); build(m + 1, r, d + 1);
  };
  build(0, s.n - 1, 0);
  const maxD = Math.max(...nodes.map(n => n.d));
  const rowH = maxD >= 3 ? 30 : 38;
  const key = (n: { l: number; r: number }) => n.l + "-" + n.r;
  const lit = (n: { l: number; r: number }) => !!s.hi?.includes(key(n));
  const cellW = Math.min(64, 440 / s.n);
  const x0 = 260 - (s.n * cellW) / 2;
  const xOf = (n: { l: number; r: number }) => x0 + ((n.l + n.r + 1) / 2) * cellW;
  return <>
    {nodes.map((n, i) => {
      if (n.d === 0) return null;
      const parent = nodes.find(p => p.d === n.d - 1 && p.l <= n.l && p.r >= n.r);
      if (!parent) return null;
      return <line key={"e" + i} x1={xOf(parent)} y1={18 + (n.d - 1) * rowH + 9}
        x2={xOf(n)} y2={18 + n.d * rowH - 9} stroke={DC.line} strokeWidth="1.3" />;
    })}
    {nodes.map((n, i) => {
      const w = Math.max(26, (n.r - n.l + 1) * cellW - 8), y = 18 + n.d * rowH;
      const on = lit(n);
      const txt = n.l === n.r ? String(n.l) : n.l + ".." + n.r;
      return <g key={i}>
        <rect x={xOf(n) - w / 2} y={y - 9} width={w} height={18} rx="4"
          fill={on ? DC.on : DC.bg} stroke={on ? DC.lime : DC.dim} strokeWidth={on ? 2 : 1.2} />
        {T(xOf(n), y + 4, txt, on ? DC.lime : DC.mute, fit(txt, w - 6, 10))}
      </g>;
    })}
    {s.note && T(260, Math.min(148, 18 + (maxD + 1) * rowH + 8), s.note, DC.lime, 11)}
  </>;
}

/* Which indices one entry is responsible for. A Fenwick tree is impossible to
   picture without this, and a sparse table only slightly easier. */
function RangesView(s: Extract<Spec, { kind: "ranges" }>) {
  const w = Math.min(40, 430 / s.n), x0 = 260 - (s.n * w) / 2;
  const rows = Math.max(...s.spans.map(sp => sp.at)) + 1;
  const rowH = Math.min(22, 96 / Math.max(rows, 1));
  return <>
    {Array.from({ length: s.n }, (_, i) => (
      <g key={"c" + i}>
        <rect x={x0 + i * w} y={18} width={w - 4} height={20} rx="3" fill={DC.bg} stroke={DC.dim} strokeWidth="1.1" />
        {T(x0 + i * w + (w - 4) / 2, 32, String(i + 1), DC.mute, 10)}
      </g>
    ))}
    {s.spans.map((sp, k) => {
      const xa = x0 + sp.from * w, xb = x0 + (sp.to + 1) * w - 4;
      const y = 46 + sp.at * rowH;
      const col = sp.on ? DC.lime : DC.line;
      return <g key={k}>
        <rect x={xa} y={y} width={xb - xa} height={rowH - 5} rx="3"
          fill={sp.on ? DC.on : DC.bg} stroke={col} strokeWidth={sp.on ? 1.8 : 1.1} />
        {sp.text && T((xa + xb) / 2, y + rowH / 2 + 2, sp.text, sp.on ? DC.lime : DC.mute,
          fit(sp.text, xb - xa - 4, 10))}
      </g>;
    })}
    {s.note && T(260, Math.min(148, 46 + rows * rowH + 14), s.note, DC.lime, 11)}
  </>;
}

/* Several parent-pointer trees at once: the shape a DSU actually has, and the
   only way to see a union or a path compression happen. */
function ForestView(s: Extract<Spec, { kind: "forest" }>) {
  const roots = s.nodes.filter(n => n.parent === null);
  const kids = (id: number) => s.nodes.filter(n => n.parent === id);
  const depth = (n: typeof s.nodes[number]): number => {
    let d = 0, cur = n;
    while (cur.parent !== null) {
      const p = s.nodes.find(x => x.id === cur.parent);
      if (!p) break;
      cur = p; ++d;
    }
    return d;
  };
  const order: number[] = [];
  const walk = (id: number) => { const c = kids(id); if (!c.length) { order.push(id); return; } c.forEach(x => walk(x.id)); };
  roots.forEach(r => walk(r.id));
  const span = Math.min(60, 450 / Math.max(order.length, 1));
  const x0 = 260 - ((order.length - 1) * span) / 2;
  const leafX = new Map(order.map((id, i) => [id, x0 + i * span]));
  const xOf = (id: number): number => {
    if (leafX.has(id)) return leafX.get(id) as number;
    const c = kids(id);
    return c.reduce((a, k) => a + xOf(k.id), 0) / Math.max(c.length, 1);
  };
  const maxD = Math.max(...s.nodes.map(depth), 0);
  const rowH = maxD >= 2 ? 40 : 46;
  const yOf = (n: typeof s.nodes[number]) => 30 + depth(n) * rowH;
  return <>
    {s.nodes.map(n => {
      if (n.parent === null) return null;
      const p = s.nodes.find(x => x.id === n.parent);
      if (!p) return null;
      return <path key={"e" + n.id}
        d={"M" + xOf(n.id) + " " + (yOf(n) - 14) + " L" + xOf(p.id) + " " + (yOf(p) + 14)}
        stroke={n.state === "active" ? DC.lime : DC.line} strokeWidth={n.state === "active" ? 2 : 1.4}
        markerEnd="url(#fm)" fill="none" />;
    })}
    <defs><marker id="fm" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 z" fill={DC.line} /></marker></defs>
    {s.nodes.map(n => {
      const on = n.state === "active" || n.state === "solution";
      const col = n.state === "solution" ? DC.warm : on ? DC.lime : DC.line;
      return <g key={n.id}>
        <circle cx={xOf(n.id)} cy={yOf(n)} r="13" fill={on ? DC.on : DC.bg} stroke={col} strokeWidth={on ? 2.2 : 1.4} />
        {T(xOf(n.id), yOf(n) + 4, String(n.text ?? n.id), on ? col : DC.ink, 11)}
      </g>;
    })}
    {s.note && T(260, Math.min(148, 30 + (maxD + 1) * rowH + 6), s.note, DC.lime, 11)}
  </>;
}

/* Slots with chains hanging off them — a hash table's whole story is which
   keys landed together. */
function HashTableView(s: Extract<Spec, { kind: "hashtable" }>) {
  const n = s.slots.length, w = Math.min(60, 440 / n), x0 = 260 - (n * w) / 2;
  return <>
    {s.slots.map((chain, i) => {
      const on = !!s.hi?.includes(i);
      const col = on ? DC.lime : DC.dim;
      return <g key={i}>
        <rect x={x0 + i * w} y={20} width={w - 6} height={22} rx="3"
          fill={on ? DC.on : DC.bg} stroke={col} strokeWidth={on ? 2 : 1.2} />
        {T(x0 + i * w + (w - 6) / 2, 35, String(i), col, 10)}
        {(chain || []).map((item, k) => (
          <g key={k}>
            <line x1={x0 + i * w + (w - 6) / 2} y1={42 + k * 26} x2={x0 + i * w + (w - 6) / 2} y2={50 + k * 26}
              stroke={DC.line} strokeWidth="1.2" />
            <rect x={x0 + i * w + 3} y={50 + k * 26} width={w - 12} height={20} rx="3"
              fill={DC.bg} stroke={on ? DC.lime : DC.line} strokeWidth="1.2" />
            {T(x0 + i * w + (w - 6) / 2, 64 + k * 26, item, on ? DC.lime : DC.ink, fit(item, w - 16, 10))}
          </g>
        ))}
      </g>;
    })}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

/* A queue, with the two ends named. Everything confusing about a deque is
   which end an operation touches. */
function QueueView(s: Extract<Spec, { kind: "queue" }>) {
  const n = Math.max(s.items.length, 1), w = Math.min(58, 420 / n), x0 = 260 - (n * w) / 2;
  return <>
    {s.items.map((v, i) => {
      const isF = s.front === i, isB = s.back === i;
      const col = isF ? DC.lime : isB ? DC.warm : DC.dim;
      return <g key={i}>
        <rect x={x0 + i * w} y={54} width={w - 6} height={32} rx="4"
          fill={isF || isB ? DC.on : DC.bg} stroke={col} strokeWidth={isF || isB ? 2 : 1.3} />
        {T(x0 + i * w + (w - 6) / 2, 75, String(v), isF || isB ? col : DC.ink, fit(String(v), w - 12, 12))}
      </g>;
    })}
    {s.front !== undefined && <>
      <path d={"M" + (x0 + s.front * w + (w - 6) / 2) + " 46 L" + (x0 + s.front * w + (w - 6) / 2) + " 38"}
        stroke={DC.lime} strokeWidth="2" />
      {T(x0 + s.front * w + (w - 6) / 2, 32, "front", DC.lime, 10)}
    </>}
    {s.back !== undefined && <>
      <path d={"M" + (x0 + s.back * w + (w - 6) / 2) + " 94 L" + (x0 + s.back * w + (w - 6) / 2) + " 102"}
        stroke={DC.warm} strokeWidth="2" />
      {T(x0 + s.back * w + (w - 6) / 2, 116, "back", DC.warm, 10)}
    </>}
    {s.note && T(260, 143, s.note, DC.lime, 11)}
  </>;
}

const MARK_COLOR: Record<string, string> = {
  lo: DC.cool, hi: DC.warm, mid: DC.lime, hit: "#6fd17a",
};

/* A continuous axis. Searching over real numbers or over an unbounded range
   has no cells to draw, only an interval that keeps halving. */
function NumberLineView(s: Extract<Spec, { kind: "numberline" }>) {
  const x0 = 60, x1 = 460, y = 82;
  const at = (v: number) => x0 + ((v - s.from) / Math.max(s.to - s.from, 1e-9)) * (x1 - x0);
  const ticks = s.ticks ?? 5;
  return <>
    {s.span && (
      <rect x={at(s.span[0])} y={y - 13} width={Math.max(2, at(s.span[1]) - at(s.span[0]))} height={26}
        rx="3" fill="rgba(200,255,118,.10)" stroke={DC.onLine} strokeWidth="1.2" />
    )}
    <line x1={x0} y1={y} x2={x1} y2={y} stroke={DC.line} strokeWidth="1.6" />
    {Array.from({ length: ticks + 1 }, (_, i) => {
      const v = s.from + ((s.to - s.from) * i) / ticks;
      const x = at(v);
      const lab = Math.abs(v) >= 1000 ? v.toExponential(0) : String(Math.round(v * 100) / 100);
      return <g key={i}>
        <line x1={x} y1={y - 4} x2={x} y2={y + 4} stroke={DC.dim} strokeWidth="1.2" />
        {T(x, y + 20, lab, DC.mute, 9)}
      </g>;
    })}
    {s.marks?.map((m, i) => {
      const x = at(m.at), col = MARK_COLOR[m.tone || "mid"];
      const up = i % 2 === 0;
      return <g key={"m" + i}>
        <line x1={x} y1={up ? y - 14 : y + 14} x2={x} y2={up ? y - 30 : y + 30} stroke={col} strokeWidth="2" />
        <circle cx={x} cy={y} r="4" fill={col} />
        {T(x, up ? y - 34 : y + 42, m.text, col, 10)}
      </g>;
    })}
    {s.note && T(260, 142, s.note, DC.lime, 11)}
  </>;
}

/* A sampled function. Ternary search and peak finding are about the SHAPE of
   the values, which a row of numbers hides and a curve makes obvious. */
function PlotView(s: Extract<Spec, { kind: "plot" }>) {
  const n = s.values.length, x0 = 56, x1 = 464, baseY = 112, h = 76;
  const mn = Math.min(...s.values), mx = Math.max(...s.values);
  const xAt = (i: number) => x0 + (i / Math.max(n - 1, 1)) * (x1 - x0);
  const yAt = (v: number) => baseY - ((v - mn) / Math.max(mx - mn, 1e-9)) * h;
  const path = s.values.map((v, i) => (i ? "L" : "M") + xAt(i).toFixed(1) + " " + yAt(v).toFixed(1)).join(" ");
  return <>
    {s.drop && (
      <rect x={xAt(s.drop[0])} y={baseY - h - 8} width={Math.max(2, xAt(s.drop[1]) - xAt(s.drop[0]))}
        height={h + 16} rx="3" fill="rgba(255,107,107,.08)" stroke="#5a3a3a" strokeWidth="1" strokeDasharray="3 3" />
    )}
    <line x1={x0 - 6} y1={baseY} x2={x1 + 6} y2={baseY} stroke={DC.dim} strokeWidth="1.3" />
    <path d={path} fill="none" stroke={DC.cool} strokeWidth="2.2" />
    {s.values.map((v, i) => <circle key={i} cx={xAt(i)} cy={yAt(v)} r="2.6" fill={DC.cool} />)}
    {s.marks?.map((m, i) => (
      <g key={"k" + i}>
        <line x1={xAt(m.at)} y1={yAt(s.values[m.at])} x2={xAt(m.at)} y2={baseY} stroke={DC.lime} strokeWidth="1.6" />
        <circle cx={xAt(m.at)} cy={yAt(s.values[m.at])} r="4.5" fill={DC.on} stroke={DC.lime} strokeWidth="2" />
        {T(xAt(m.at), baseY + 16, m.text, DC.lime, 10)}
      </g>
    ))}
    {s.note && T(260, 144, s.note, DC.lime, 11)}
  </>;
}

/* A small matrix with cells you can single out. Searching a sorted matrix is a
   walk from one corner, and the discarded quadrant is the point. */
function MatrixView(s: Extract<Spec, { kind: "matrix" }>) {
  const rows = s.rows.length, cols = s.rows[0].length;
  const cw = Math.min(56, 380 / cols), chh = Math.min(26, 104 / rows);
  const x0 = 260 - (cols * cw) / 2, y0 = 18;
  const isHi = (r: number, c: number) => !!s.hi?.some(([a, b]) => a === r && b === c);
  const isDim = (r: number, c: number) => !!s.dim?.some(([a, b]) => a === r && b === c);
  return <>
    {s.rows.map((row, r) => row.map((v, c) => {
      const on = isHi(r, c), off = isDim(r, c);
      const col = on ? DC.lime : off ? "#3a4a42" : DC.dim;
      return <g key={r + "-" + c}>
        <rect x={x0 + c * cw} y={y0 + r * chh} width={cw - 4} height={chh - 4} rx="3"
          fill={on ? DC.on : DC.bg} stroke={col} strokeWidth={on ? 2 : 1.1} opacity={off ? 0.45 : 1} />
        {T(x0 + c * cw + (cw - 4) / 2, y0 + r * chh + chh / 2 + 3, String(v),
          on ? DC.lime : off ? "#5a6a62" : DC.ink, fit(String(v), cw - 10, 11))}
      </g>;
    }))}
    {s.note && T(260, Math.min(146, y0 + rows * chh + 16), s.note, DC.lime, 11)}
  </>;
}

const PICK_COLOR: Record<string, string> = { pick: DC.lime, drop: "#8a5a5a", idle: DC.line };

/* Intervals on a real time axis. Activity selection, interval merging and
   deadline scheduling all argue about WHEN things sit next to each other,
   which a row of boxes cannot show and a timeline shows immediately. */
function TimelineView(s: Extract<Spec, { kind: "timeline" }>) {
  const x0 = 48, x1 = 472, n = Math.max(s.items.length, 1);
  const rowH = Math.min(22, 88 / n);
  const at = (v: number) => x0 + ((v - s.from) / Math.max(s.to - s.from, 1e-9)) * (x1 - x0);
  const axisY = 18 + n * rowH + 8;
  return <>
    {s.cut && <>
      <line x1={at(s.cut.at)} y1={16} x2={at(s.cut.at)} y2={axisY} stroke={DC.warm}
        strokeWidth="1.4" strokeDasharray="4 3" />
      {T(at(s.cut.at), 13, s.cut.text, DC.warm, 10)}
    </>}
    {s.items.map((it, i) => {
      const xa = at(it.s), xb = Math.max(at(it.e), xa + 8);
      const y = 18 + i * rowH, col = PICK_COLOR[it.state || "idle"];
      const picked = it.state === "pick";
      return <g key={i}>
        <rect x={xa} y={y} width={xb - xa} height={rowH - 5} rx="3"
          fill={picked ? DC.on : DC.bg} stroke={col} strokeWidth={picked ? 2 : 1.2}
          opacity={it.state === "drop" ? 0.6 : 1} strokeDasharray={it.state === "drop" ? "3 3" : undefined} />
        {it.text && T((xa + xb) / 2, y + (rowH - 5) / 2 + 3, it.text,
          picked ? DC.lime : it.state === "drop" ? "#a97b7b" : DC.ink,
          fit(it.text, xb - xa - 4, 10))}
      </g>;
    })}
    <line x1={x0} y1={axisY} x2={x1} y2={axisY} stroke={DC.line} strokeWidth="1.4" />
    {Array.from({ length: 5 }, (_, i) => {
      const v = s.from + ((s.to - s.from) * i) / 4, x = at(v);
      return <g key={"t" + i}>
        <line x1={x} y1={axisY - 3} x2={x} y2={axisY + 3} stroke={DC.dim} strokeWidth="1.1" />
        {T(x, axisY + 14, String(Math.round(v * 10) / 10), DC.mute, 9)}
      </g>;
    })}
    {s.note && T(260, Math.min(147, axisY + 30), s.note, DC.lime, 11)}
  </>;
}

/* The exchange argument, drawn. Two solutions side by side and the single
   swap that turns one into the other: that swap IS the proof, and a learner
   who sees it stops treating greedy correctness as a matter of faith. */
function ExchangeView(s: Extract<Spec, { kind: "exchange" }>) {
  const n = Math.max(s.opt.length, s.greedy.length);
  const w = Math.min(48, 380 / Math.max(n, 1)), x0 = 300 - (n * w) / 2;
  const row = (vals: (string | number)[], y: number, hi: number[]) => vals.map((v, i) => (
    <g key={y + "-" + i}>
      {R(x0 + i * w, y, w - 5, 26, hi.includes(i))}
      {T(x0 + i * w + (w - 5) / 2, y + 17, String(v), hi.includes(i) ? DC.lime : DC.ink,
        fit(String(v), w - 11, 12))}
    </g>
  ));
  const sw = s.swap;
  const cx = (i: number) => x0 + i * w + (w - 5) / 2;
  return <>
    {T(8, 71, s.optName || "OPT", DC.mute, 10, "start")}
    {T(8, 119, s.greedyName || "greedy", DC.mute, 10, "start")}
    {row(s.opt, 54, sw ? [sw[0], sw[1]] : [])}
    {row(s.greedy, 102, [])}
    {sw && <>
      <path d={"M " + cx(sw[0]) + " 50 C " + cx(sw[0]) + " 26, " + cx(sw[1]) + " 26, " + cx(sw[1]) + " 50"}
        fill="none" stroke={DC.warm} strokeWidth="1.6" />
      {T((cx(sw[0]) + cx(sw[1])) / 2, 24, "almashtiramiz", DC.warm, 10)}
    </>}
    {s.note && T(260, 145, s.note, DC.lime, 11)}
  </>;
}

/* Value per kilogram, as area. Fractional knapsack is the one greedy whose
   correctness you can literally see: sort the blocks by height and fill from
   the left, and no rearrangement can put more area under the same width. */
function RatioView(s: Extract<Spec, { kind: "ratio" }>) {
  const baseY = 116, totalW = s.items.reduce((t, it) => t + it.w, 0) || 1;
  const scale = 400 / Math.max(totalW, s.cap || 0);
  const maxR = Math.max(...s.items.map(it => it.v / it.w), 1e-9);
  let x = 56;
  const bars = s.items.map((it, i) => {
    const bw = it.w * scale, h = Math.max(10, (it.v / it.w / maxR) * 80);
    const topY = baseY - h, bx = x; x += bw;
    return <g key={i}>
      <rect x={bx} y={topY} width={Math.max(bw - 3, 4)} height={h} rx="3"
        fill={DC.on} stroke={DC.onLine} strokeWidth="1.4" />
      {T(bx + (bw - 3) / 2, Math.max(34, topY - 5),
        String(Math.round((it.v / it.w) * 10) / 10), DC.lime, fit(String(it.v / it.w), bw - 4, 10))}
      {it.text && T(bx + (bw - 3) / 2, baseY + 15, it.text, DC.mute, fit(it.text, bw - 2, 10))}
    </g>;
  });
  const capX = 56 + (s.cap || 0) * scale;
  return <>
    {T(6, 74, "qiymat/kg", DC.mute, 8, "start")}
    {bars}
    <line x1={50} y1={baseY} x2={470} y2={baseY} stroke={DC.line} strokeWidth="1.4" />
    {s.cap !== undefined && <>
      <line x1={capX} y1={30} x2={capX} y2={baseY + 6} stroke={DC.warm} strokeWidth="1.6" strokeDasharray="4 3" />
      {T(capX, 18, "sig‘im", DC.warm, 10)}
    </>}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

/* Two running totals, step by step. "Stays ahead" is a claim about every
   prefix at once, so the picture has to be two curves, never two numbers. */
function StairsView(s: Extract<Spec, { kind: "stairs" }>) {
  const n = Math.max(s.a.length, s.b.length), x0 = 60, x1 = 468, baseY = 116;
  const mx = Math.max(...s.a, ...s.b, 1);
  const xAt = (i: number) => x0 + (i / Math.max(n - 1, 1)) * (x1 - x0);
  const yAt = (v: number) => baseY - (v / mx) * 74;
  const step = (vals: number[]) => vals.map((v, i) =>
    (i ? "L " + xAt(i) + " " + yAt(vals[i - 1]) + " L " + xAt(i) + " " + yAt(v)
       : "M " + xAt(0) + " " + yAt(v))).join(" ");
  return <>
    <line x1={x0 - 8} y1={baseY} x2={x1 + 4} y2={baseY} stroke={DC.dim} strokeWidth="1.3" />
    <path d={step(s.b)} fill="none" stroke={DC.line} strokeWidth="2" strokeDasharray="5 3" />
    <path d={step(s.a)} fill="none" stroke={DC.lime} strokeWidth="2.4" />
    {s.a.map((v, i) => <circle key={i} cx={xAt(i)} cy={yAt(v)} r="2.8" fill={DC.lime} />)}
    {Array.from({ length: n }, (_, i) => <g key={"x" + i}>{T(xAt(i), baseY + 15, String(i + 1), DC.mute, 9)}</g>)}
    <line x1={92} y1={22} x2={116} y2={22} stroke={DC.lime} strokeWidth="2.4" />
    {T(122, 26, s.aName || "greedy", DC.lime, 10, "start")}
    <line x1={280} y1={22} x2={304} y2={22} stroke={DC.line} strokeWidth="2" strokeDasharray="5 3" />
    {T(310, 26, s.bName || "optimal", DC.mute, 10, "start")}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

/* A stack that regrets. Lexicographic greedy keeps a monotone prefix and
   throws away everything it now wishes it had not taken — the discarded
   items have to stay visible, or the rule looks arbitrary. */
function MStackView(s: Extract<Spec, { kind: "mstack" }>) {
  const kept = s.kept, popped = s.popped || [];
  const total = kept.length + popped.length + (s.incoming ? 1 : 0);
  const w = Math.min(46, 400 / Math.max(total, 1)), y = 62;
  const x0 = 260 - (total * w) / 2;
  const box = (v: string | number, i: number, tone: "kept" | "pop" | "in") => {
    const x = x0 + i * w;
    const col = tone === "kept" ? DC.onLine : tone === "pop" ? "#8a5a5a" : DC.cool;
    return <g key={tone + i}>
      <rect x={x} y={y} width={w - 5} height={28} rx="4" fill={tone === "kept" ? DC.on : DC.bg}
        stroke={col} strokeWidth={tone === "kept" ? 1.8 : 1.3}
        strokeDasharray={tone === "pop" ? "3 3" : undefined} opacity={tone === "pop" ? 0.65 : 1} />
      {T(x + (w - 5) / 2, y + 19, String(v),
        tone === "kept" ? DC.lime : tone === "pop" ? "#a97b7b" : DC.cool, fit(String(v), w - 11, 13))}
    </g>;
  };
  const mid = (from: number, count: number) => x0 + from * w + (count * w - 5) / 2;
  return <>
    {kept.map((v, i) => box(v, i, "kept"))}
    {popped.map((v, i) => box(v, kept.length + i, "pop"))}
    {s.incoming && box(s.incoming, total - 1, "in")}
    {kept.length > 0 && T(mid(0, kept.length), y - 12, "stek", DC.lime, fit("stek", kept.length * w, 10))}
    {popped.length > 0 && T(mid(kept.length, popped.length), y - 12, "chiqarildi", "#a97b7b",
      fit("chiqarildi", popped.length * w, 10))}
    {s.incoming && T(mid(total - 1, 1), y + 48, "kelmoqda", DC.cool, fit("kelmoqda", w + 12, 10))}
    {s.note && T(260, 140, s.note, DC.lime, 11)}
  </>;
}

const LAYER_COLOR: Record<string, string> = {
  src: DC.pink, seen: DC.lime, frontier: DC.cool, far: DC.line,
};

/* BFS in the shape it actually has: a wavefront, one column per distance.
   Drawn as a normal tangle of nodes, the single most important fact — that
   everything at distance k is finished before distance k+1 begins — is
   invisible. Here it is the whole picture. */
function LayersView(s: Extract<Spec, { kind: "layers" }>) {
  const n = Math.max(s.cols.length, 1), colW = 400 / n;
  const cx = (i: number) => 60 + colW * (i + 0.5);
  const cy = (i: number, count: number) => 80 + (i - (count - 1) / 2) * 30;
  return <>
    {s.links?.map(([c, a, b], i) => {
      const ca = s.cols[c], cb = s.cols[c + 1];
      if (!ca || !cb) return null;
      return <line key={"l" + i} x1={cx(c) + 13} y1={cy(a, ca.nodes.length)}
        x2={cx(c + 1) - 13} y2={cy(b, cb.nodes.length)} stroke={DC.dim} strokeWidth="1.3" />;
    })}
    {s.cols.map((col, c) => <g key={"c" + c}>
      {T(cx(c), 18, col.text, DC.mute, fit(col.text, colW - 6, 10))}
      {col.nodes.map((nd, i) => {
        const y = cy(i, col.nodes.length), colr = LAYER_COLOR[nd.state || "far"];
        return <g key={i}>
          <circle cx={cx(c)} cy={y} r="13" fill={nd.state && nd.state !== "far" ? DC.on : DC.bg}
            stroke={colr} strokeWidth="2" />
          {T(cx(c), y + 4, nd.text, colr, fit(nd.text, 22, 11))}
        </g>;
      })}
    </g>)}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

const CELL_COLOR: Record<string, [string, string]> = {
  "#": ["#161c19", "#243029"], ".": [DC.bg, DC.dim], S: [DC.on, DC.pink],
  T: [DC.on, DC.warm], o: [DC.on, DC.onLine], f: [DC.bg, DC.cool], "*": [DC.on, DC.lime],
};

/* A grid being flooded. Most graph problems in practice are grids, and on a
   grid the interesting thing is WHICH cells are already reached and how far
   they are — so the cells carry their distance. */
function GridPathView(s: Extract<Spec, { kind: "gridpath" }>) {
  const r = s.rows.length, c = s.rows[0].length;
  const cell = Math.min(26, Math.min(300 / c, 104 / r));
  const x0 = 260 - (c * cell) / 2, y0 = 20;
  return <>
    {s.rows.map((row, y) => row.split("").map((ch, x) => {
      const [fill, stroke] = CELL_COLOR[ch] || CELL_COLOR["."];
      const txt = s.nums?.[y]?.[x];
      const ink = ch === "#" ? DC.mute : ch === "S" ? DC.pink : ch === "T" ? DC.warm
        : ch === "f" ? DC.cool : ch === "*" ? DC.lime : DC.ink;
      return <g key={y + "-" + x}>
        <rect x={x0 + x * cell} y={y0 + y * cell} width={cell - 3} height={cell - 3} rx="3"
          fill={fill} stroke={stroke} strokeWidth="1.2" />
        {txt !== undefined && txt !== "" &&
          T(x0 + x * cell + (cell - 3) / 2, y0 + y * cell + cell / 2 + 3, String(txt), ink,
            fit(String(txt), cell - 6, 11))}
      </g>;
    }))}
    {s.note && T(260, Math.min(147, y0 + r * cell + 18), s.note, DC.lime, 11)}
  </>;
}

/* Capacity against flow. An edge in a flow network carries two numbers and
   the whole algorithm is about the gap between them, so the label has to
   show both — and the augmenting path has to be visible as a path. */
function FlowNetView(s: Extract<Spec, { kind: "flownet" }>) {
  return <>
    <defs><marker id="fm" markerWidth="9" markerHeight="9" refX="17" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 z" fill={DC.line} /></marker>
      <marker id="fmOn" markerWidth="9" markerHeight="9" refX="17" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 z" fill={DC.lime} /></marker></defs>
    {s.cut && <>
      <line x1={s.cut.x} y1={26} x2={s.cut.x} y2={124} stroke={DC.warm} strokeWidth="1.5"
        strokeDasharray="5 3" />
      {T(s.cut.x, 18, s.cut.text, DC.warm, 10)}
    </>}
    {s.edges.map((e, i) => {
      const [x1, y1] = s.nodes[e.from], [x2, y2] = s.nodes[e.to];
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
      const lab = (e.flow ?? 0) + "/" + e.cap;
      return <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={e.on ? DC.lime : DC.line}
          strokeWidth={e.on ? 2.4 : 1.5} markerEnd={e.on ? "url(#fmOn)" : "url(#fm)"} />
        {T(mx - (dy / len) * 11, my + (dx / len) * 11 + 4, lab, e.on ? DC.lime : DC.mute, 10)}
      </g>;
    })}
    {s.nodes.map(([x, y, lab], i) => <g key={"n" + i}>
      <circle cx={x} cy={y} r="15" fill={DC.bg} stroke={DC.cool} strokeWidth="2" />
      {T(x, y + 5, lab, DC.cool, fit(lab, 26, 12))}
    </g>)}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

/* The rho. Follow a successor function from any start and you walk a tail
   into a cycle, always — the shape is the theorem, and it is the reason
   tortoise-and-hare works at all. */
function RhoView(s: Extract<Spec, { kind: "rho" }>) {
  const t = s.tail.length, k = Math.max(s.cycle.length, 1);
  const step = Math.min(46, 200 / Math.max(t, 1));
  const cr = Math.min(38, 300 / k + 12);
  const cxC = 40 + t * step + cr + 16, cyC = 76;
  const pos = (i: number): [number, number] => {
    if (i < t) return [40 + i * step, cyC];
    const a = Math.PI - ((i - t) * 2 * Math.PI) / k;
    return [cxC + cr * Math.cos(a), cyC - cr * Math.sin(a)];
  };
  const total = t + k;
  const isHi = (i: number) => !!s.hi?.includes(i);
  return <>
    {Array.from({ length: total }, (_, i) => {
      const nxt = i < total - 1 ? i + 1 : t;
      if (i === total - 1 && k === 1) return null;
      const [x1, y1] = pos(i), [x2, y2] = pos(nxt);
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
      return <line key={"e" + i} x1={x1 + (dx / len) * 13} y1={y1 + (dy / len) * 13}
        x2={x2 - (dx / len) * 14} y2={y2 - (dy / len) * 14} stroke={DC.line} strokeWidth="1.5" />;
    })}
    {Array.from({ length: total }, (_, i) => {
      const [x, y] = pos(i), on = isHi(i);
      return <g key={"n" + i}>
        <circle cx={x} cy={y} r="13" fill={on ? DC.on : DC.bg} stroke={on ? DC.lime : DC.line}
          strokeWidth={on ? 2.2 : 1.6} />
        {T(x, y + 4, String(i < t ? s.tail[i] : s.cycle[i - t]), on ? DC.lime : DC.ink,
          fit(String(i < t ? s.tail[i] : s.cycle[i - t]), 22, 11))}
      </g>;
    })}
    {s.marks?.map((m, i) => {
      const [x, y] = pos(m.at);
      const below = y > cyC;
      return <g key={"m" + i}>{T(x, below ? y + 28 : y - 20, m.text, DC.warm, 10)}</g>;
    })}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

/* Two sides and the edges between them. Matching is the one graph problem
   whose picture must separate the parts, because "which side" is the whole
   constraint. Matched edges are thick; the rest are the options not taken. */
function BipView(s: Extract<Spec, { kind: "bip" }>) {
  const xa = 150, xb = 370;
  const yAt = (i: number, n: number) => 76 + (i - (n - 1) / 2) * Math.min(34, 96 / Math.max(n, 1));
  const matched = (a: number, b: number) => !!s.match?.some(([p, q]) => p === a && q === b);
  return <>
    {s.edges.map(([a, b], i) => (
      <line key={i} x1={xa + 14} y1={yAt(a, s.left.length)} x2={xb - 14} y2={yAt(b, s.right.length)}
        stroke={matched(a, b) ? DC.lime : DC.dim} strokeWidth={matched(a, b) ? 2.6 : 1.2} />
    ))}
    {s.left.map((v, i) => <g key={"a" + i}>
      <circle cx={xa} cy={yAt(i, s.left.length)} r="14" fill={DC.bg} stroke={DC.cool} strokeWidth="1.8" />
      {T(xa, yAt(i, s.left.length) + 4, v, DC.cool, fit(v, 24, 11))}
    </g>)}
    {s.right.map((v, i) => <g key={"b" + i}>
      <circle cx={xb} cy={yAt(i, s.right.length)} r="14" fill={DC.bg} stroke={DC.warm} strokeWidth="1.8" />
      {T(xb, yAt(i, s.right.length) + 4, v, DC.warm, fit(v, 24, 11))}
    </g>)}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

const SPAN_COLOR: Record<string, string> = { ok: DC.lime, warm: DC.warm, cool: DC.cool };

/* A pattern sitting under a text at some shift. Every matching algorithm in
   this track is a rule for choosing the NEXT shift, so the shift itself has
   to be the thing the picture shows. */
function AlignView(s: Extract<Spec, { kind: "align" }>) {
  const t = s.text.split(""), pt = s.pat.split("");
  const w = Math.min(30, 452 / Math.max(t.length, 1)), x0 = 260 - (t.length * w) / 2;
  const cell = (ch: string, i: number, y: number, col: string, on: boolean) => (
    <g key={y + "-" + i}>
      <rect x={x0 + i * w} y={y} width={w - 3} height={26} rx="3"
        fill={on ? DC.on : DC.bg} stroke={col} strokeWidth={on ? 2 : 1.1} />
      {T(x0 + i * w + (w - 3) / 2, y + 18, ch, on ? col : DC.ink, fit(ch, w - 6, 13))}
    </g>
  );
  return <>
    {t.map((ch, i) => cell(ch, i, 26, DC.dim, false))}
    {pt.map((ch, j) => {
      const i = s.at + j;
      const good = s.match !== undefined && j < s.match;
      const bad = s.mism !== undefined && j === s.mism;
      return cell(ch, i, 64, bad ? DC.warm : good ? DC.onLine : DC.line, good || bad);
    })}
    {t.map((_, i) => <g key={"x" + i}>{T(x0 + i * w + (w - 3) / 2, 110, String(i), DC.mute,
      Math.min(9, w * 0.5))}</g>)}
    {s.note && T(260, 138, s.note, DC.lime, 11)}
  </>;
}

/* Brackets under a string. Borders, periods and repeated blocks are all
   claims about which SPANS are equal, and a bracket says that directly. */
function StrSpansView(s: Extract<Spec, { kind: "strspans" }>) {
  const t = s.text.split("");
  const w = Math.min(30, 452 / Math.max(t.length, 1)), x0 = 260 - (t.length * w) / 2;
  const rowH = Math.min(24, 66 / Math.max(s.spans.length, 1));
  return <>
    {t.map((ch, i) => <g key={i}>
      <rect x={x0 + i * w} y={22} width={w - 3} height={26} rx="3" fill={DC.bg}
        stroke={DC.dim} strokeWidth="1.1" />
      {T(x0 + i * w + (w - 3) / 2, 40, ch, DC.ink, fit(ch, w - 6, 13))}
    </g>)}
    {s.spans.map((sp, k) => {
      const xa = x0 + sp.from * w, xb = x0 + (sp.to + 1) * w - 3;
      const y = 58 + k * rowH, col = SPAN_COLOR[sp.tone || "ok"];
      return <g key={"s" + k}>
        <path d={"M " + xa + " " + y + " L " + xa + " " + (y + 6) + " L " + xb + " " + (y + 6) +
          " L " + xb + " " + y} fill="none" stroke={col} strokeWidth="1.6" />
        {T((xa + xb) / 2, y + rowH - 2, sp.text, col, fit(sp.text, xb - xa, 10))}
      </g>;
    })}
    {s.note && T(260, Math.min(147, 58 + s.spans.length * rowH + 14), s.note, DC.lime, 11)}
  </>;
}

/* The suffix array as it is actually used: sorted suffixes with the length of
   the shared prefix printed between neighbours. The LCP column is the point —
   without it the table is just a sort. */
function SArrayView(s: Extract<Spec, { kind: "sarray" }>) {
  const n = Math.max(s.rows.length, 1), rowH = Math.min(20, 104 / n), y0 = 34;
  return <>
    {T(72, 22, "i", DC.mute, 9)}
    {T(120, 22, "suffiks", DC.mute, 9, "start")}
    {T(430, 22, "LCP", DC.mute, 9)}
    {s.rows.map((r, k) => {
      const y = y0 + k * rowH, on = !!s.hi?.includes(k);
      return <g key={k}>
        <rect x={96} y={y - rowH + 5} width={300} height={rowH - 2} rx="3"
          fill={on ? DC.on : DC.bg} stroke={on ? DC.onLine : DC.dim} strokeWidth={on ? 1.6 : 1} />
        {T(72, y, String(r.idx), DC.mute, 10)}
        {T(104, y, r.suf, on ? DC.lime : DC.ink, fit(r.suf, 288, 12), "start")}
        {r.lcp !== undefined && T(430, y, String(r.lcp), DC.warm, 10)}
      </g>;
    })}
    {s.note && T(260, Math.min(147, y0 + n * rowH + 12), s.note, DC.lime, 11)}
  </>;
}

/* A palindrome is a radius around a centre, so the picture is a bar per
   position. Manacher's whole trick is reusing a neighbour's bar. */
function PalinView(s: Extract<Spec, { kind: "palin" }>) {
  const t = s.text.split("");
  const w = Math.min(30, 452 / Math.max(t.length, 1)), x0 = 260 - (t.length * w) / 2;
  const mx = Math.max(...(s.radii || [1]), 1);
  return <>
    {t.map((ch, i) => {
      const on = s.centre === i;
      return <g key={i}>
        <rect x={x0 + i * w} y={20} width={w - 3} height={26} rx="3"
          fill={on ? DC.on : DC.bg} stroke={on ? DC.pink : DC.dim} strokeWidth={on ? 2 : 1.1} />
        {T(x0 + i * w + (w - 3) / 2, 38, ch, on ? DC.pink : DC.ink, fit(ch, w - 6, 13))}
      </g>;
    })}
    {s.radii?.map((r, i) => {
      const h = (r / mx) * 52;
      return <g key={"r" + i}>
        <rect x={x0 + i * w + 2} y={112 - h} width={Math.max(w - 7, 3)} height={Math.max(h, 1)}
          rx="2" fill={DC.on} stroke={DC.onLine} strokeWidth="1.1" />
        {w >= 16 && T(x0 + i * w + (w - 3) / 2, 126, String(r), DC.lime, Math.min(9, w * 0.5))}
      </g>;
    })}
    {s.note && T(260, 145, s.note, DC.lime, 11)}
  </>;
}

/* States with two kinds of arrow: transitions you follow on a character, and
   suffix links you fall back along. Drawing both the same way hides the whole
   idea behind Aho-Corasick and the suffix automaton. */
function AutomatonView(s: Extract<Spec, { kind: "automaton" }>) {
  return <>
    <defs><marker id="am" markerWidth="9" markerHeight="9" refX="16" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 z" fill={DC.line} /></marker>
      <marker id="amL" markerWidth="8" markerHeight="8" refX="15" refY="3" orient="auto">
      <path d="M0 0 L5 3 L0 6 z" fill={DC.warm} /></marker></defs>
    {s.links?.map(([a, b], i) => {
      const [x1, y1] = s.nodes[a], [x2, y2] = s.nodes[b];
      const mx = (x1 + x2) / 2, my = Math.max(y1, y2) + 26;
      return <path key={"l" + i} d={"M " + x1 + " " + y1 + " Q " + mx + " " + my + " " + x2 + " " + y2}
        fill="none" stroke={DC.warm} strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#amL)" />;
    })}
    {s.edges.map((e, i) => {
      const [x1, y1] = s.nodes[e.from], [x2, y2] = s.nodes[e.to];
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
      return <g key={"e" + i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={DC.line} strokeWidth="1.5" markerEnd="url(#am)" />
        {e.text && T((x1 + x2) / 2 - (dy / len) * 10, (y1 + y2) / 2 + (dx / len) * 10 - 3,
          e.text, DC.cool, 10)}
      </g>;
    })}
    {s.nodes.map(([x, y, lab], i) => <g key={"n" + i}>
      <circle cx={x} cy={y} r="14" fill={DC.bg} stroke={DC.onLine} strokeWidth="1.8" />
      {T(x, y + 4, lab, DC.ink, fit(lab, 24, 11))}
    </g>)}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

const GEO_COLOR: Record<string, string> = {
  ink: DC.ink, lime: DC.lime, cool: DC.cool, warm: DC.warm, pink: DC.pink,
};

/* One mapper for every geometry picture. It preserves the aspect ratio on
   purpose: a diagram where a right angle does not look like a right angle
   teaches the reader something false. */
function geoMap(view: Box4) {
  const [x0, y0, x1, y1] = view;
  const w = Math.max(x1 - x0, 1e-9), h = Math.max(y1 - y0, 1e-9);
  const k = Math.min(430 / w, 96 / h);
  const cx = 262 - ((x0 + x1) / 2) * k, cy = 74 + ((y0 + y1) / 2) * k;
  return {
    X: (x: number) => cx + x * k,
    Y: (y: number) => cy - y * k,
    k,
  };
}

function geoBounds(pts: [number, number][]): Box4 {
  if (!pts.length) return [0, 0, 1, 1];
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const pad = 0.6;
  return [Math.min(...xs) - pad, Math.min(...ys) - pad,
          Math.max(...xs) + pad, Math.max(...ys) + pad];
}

function geoDraw(m: ReturnType<typeof geoMap>, segs?: GeoSeg[], pts?: GeoPt[]) {
  return <>
    {segs?.map((sg, i) => {
      const col = GEO_COLOR[sg.tone || "cool"];
      const [ax, ay] = sg.a, [bx, by] = sg.b;
      return <g key={"s" + i}>
        <line x1={m.X(ax)} y1={m.Y(ay)} x2={m.X(bx)} y2={m.Y(by)} stroke={col}
          strokeWidth="1.8" strokeDasharray={sg.dash ? "4 3" : undefined} />
        {sg.text && T((m.X(ax) + m.X(bx)) / 2, (m.Y(ay) + m.Y(by)) / 2 - 6, sg.text, col, 10)}
      </g>;
    })}
    {pts?.map((pt, i) => {
      const col = GEO_COLOR[pt.tone || "lime"];
      return <g key={"p" + i}>
        <circle cx={m.X(pt.x)} cy={m.Y(pt.y)} r="3.6" fill={col} />
        {pt.text && T(m.X(pt.x), m.Y(pt.y) + (pt.below ? 16 : -9), pt.text, col, 10)}
      </g>;
    })}
  </>;
}

/* Points, segments and a polygon on a plane — the workhorse of the track. */
function PlaneView(s: Extract<Spec, { kind: "plane" }>) {
  const all: [number, number][] = [
    ...(s.pts || []).map(p => [p.x, p.y] as [number, number]),
    ...(s.segs || []).flatMap(g => [g.a, g.b]),
    ...(s.poly || []),
  ];
  const m = geoMap(s.view || geoBounds(all));
  return <>
    {s.poly && s.poly.length > 1 && (
      <polygon points={s.poly.map(([x, y]) => m.X(x) + "," + m.Y(y)).join(" ")}
        fill={s.fill ? "rgba(200,255,118,.10)" : "none"} stroke={DC.onLine} strokeWidth="1.8" />
    )}
    {geoDraw(m, s.segs, s.pts)}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

/* Two vectors from one origin, with the arc between them. Dot and cross
   products are statements about that angle, so the angle has to be drawn. */
function AngleView(s: Extract<Spec, { kind: "angle" }>) {
  const ox = 176, oy = 88;
  const len = Math.max(Math.hypot(...s.u), Math.hypot(...s.v), 1e-9);
  const k = 66 / len;
  const px = (v: [number, number]) => ox + v[0] * k;
  const py = (v: [number, number]) => oy - v[1] * k;
  const arcR = 26;
  const clampY = (y: number) => Math.max(24, Math.min(132, y));
  const au = Math.atan2(s.u[1], s.u[0]), av = Math.atan2(s.v[1], s.v[0]);
  const arc = "M " + (ox + arcR * Math.cos(au)) + " " + (oy - arcR * Math.sin(au)) +
    " A " + arcR + " " + arcR + " 0 0 " + (av > au ? 0 : 1) + " " +
    (ox + arcR * Math.cos(av)) + " " + (oy - arcR * Math.sin(av));
  return <>
    <line x1={ox - 78} y1={oy} x2={ox + 96} y2={oy} stroke={DC.dim} strokeWidth="1.1" />
    <line x1={ox} y1={oy - 62} x2={ox} y2={oy + 50} stroke={DC.dim} strokeWidth="1.1" />
    <path d={arc} fill="none" stroke={DC.warm} strokeWidth="1.4" />
    <line x1={ox} y1={oy} x2={px(s.u)} y2={py(s.u)} stroke={DC.lime} strokeWidth="2.4" />
    <line x1={ox} y1={oy} x2={px(s.v)} y2={py(s.v)} stroke={DC.cool} strokeWidth="2.4" />
    <circle cx={ox} cy={oy} r="3" fill={DC.mute} />
    {T(px(s.u) + 12, clampY(py(s.u) + 4), s.uName || "u", DC.lime, 11, "start")}
    {T(px(s.v) + 12, clampY(py(s.v) + 4), s.vName || "v", DC.cool, 11, "start")}
    {s.text && T(372, 40, s.text, DC.warm, 11)}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

/* A vertical line moving across rectangles. The sweep is an ORDER of events,
   and the line is the only honest way to show which ones are open. */
function SweepView(s: Extract<Spec, { kind: "sweep" }>) {
  const all: [number, number][] = s.rects.flatMap(r =>
    [[r.x1, r.y1], [r.x2, r.y2]] as [number, number][]);
  const m = geoMap(s.view || geoBounds(all));
  return <>
    {s.rects.map((r, i) => (
      <rect key={i} x={m.X(Math.min(r.x1, r.x2))} y={m.Y(Math.max(r.y1, r.y2))}
        width={Math.abs(m.X(r.x2) - m.X(r.x1))} height={Math.abs(m.Y(r.y1) - m.Y(r.y2))}
        rx="2" fill={r.on ? "rgba(200,255,118,.13)" : "rgba(120,140,130,.07)"}
        stroke={r.on ? DC.onLine : DC.dim} strokeWidth={r.on ? 1.8 : 1.1} />
    ))}
    {s.at !== undefined && <>
      <line x1={m.X(s.at)} y1={16} x2={m.X(s.at)} y2={128} stroke={DC.warm}
        strokeWidth="1.8" strokeDasharray="5 3" />
      {T(m.X(s.at), 13, s.atText || "sweep", DC.warm, 10)}
    </>}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

/* Circles, with the points and lines that meet them. */
function CircleView(s: Extract<Spec, { kind: "circle" }>) {
  const all: [number, number][] = s.circles.flatMap(c =>
    [[c.x - c.r, c.y - c.r], [c.x + c.r, c.y + c.r]] as [number, number][]);
  const m = geoMap(s.view || geoBounds(all));
  return <>
    {s.circles.map((c, i) => {
      const col = GEO_COLOR[c.tone || "cool"];
      return <g key={i}>
        <circle cx={m.X(c.x)} cy={m.Y(c.y)} r={c.r * m.k} fill="none" stroke={col} strokeWidth="1.8" />
        <circle cx={m.X(c.x)} cy={m.Y(c.y)} r="2.4" fill={col} />
        {c.text && T(m.X(c.x), m.Y(c.y) - c.r * m.k - 6, c.text, col, 10)}
      </g>;
    })}
    {geoDraw(m, s.segs, s.pts)}
    {s.note && T(260, 146, s.note, DC.lime, 11)}
  </>;
}

/* Integer points under a polygon: Pick's theorem is a statement about which
   dots are inside and which sit on the edge, so the dots have to be drawn. */
function LatticeView(s: Extract<Spec, { kind: "lattice" }>) {
  const m = geoMap([-0.5, -0.5, s.w + 0.5, s.h + 0.5]);
  const isIn = (x: number, y: number) => !!s.inside?.some(([a, b]) => a === x && b === y);
  const isOn = (x: number, y: number) => !!s.onEdge?.some(([a, b]) => a === x && b === y);
  const dots = [];
  for (let x = 0; x <= s.w; ++x)
    for (let y = 0; y <= s.h; ++y) {
      const on = isOn(x, y), inn = isIn(x, y);
      dots.push(<circle key={x + "," + y} cx={m.X(x)} cy={m.Y(y)}
        r={on || inn ? 3.4 : 1.8} fill={on ? DC.warm : inn ? DC.lime : DC.dim} />);
    }
  return <>
    <polygon points={s.poly.map(([x, y]) => m.X(x) + "," + m.Y(y)).join(" ")}
      fill="rgba(200,255,118,.09)" stroke={DC.onLine} strokeWidth="1.8" />
    {dots}
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
    case "tree": return <TreeView {...spec} />;
    case "board": return <BoardView {...spec} />;
    case "callstack": return <CallStackView {...spec} />;
    case "bits": return <BitsView {...spec} />;
    case "wheel": return <WheelView {...spec} />;
    case "numgrid": return <NumGridView {...spec} />;
    case "pascal": return <PascalView {...spec} />;
    case "venn": return <VennView {...spec} />;
    case "squares": return <SquaresView {...spec} />;
    case "segtree": return <SegTreeView {...spec} />;
    case "ranges": return <RangesView {...spec} />;
    case "forest": return <ForestView {...spec} />;
    case "hashtable": return <HashTableView {...spec} />;
    case "queue": return <QueueView {...spec} />;
    case "numberline": return <NumberLineView {...spec} />;
    case "plot": return <PlotView {...spec} />;
    case "matrix": return <MatrixView {...spec} />;
    case "timeline": return <TimelineView {...spec} />;
    case "exchange": return <ExchangeView {...spec} />;
    case "ratio": return <RatioView {...spec} />;
    case "stairs": return <StairsView {...spec} />;
    case "mstack": return <MStackView {...spec} />;
    case "layers": return <LayersView {...spec} />;
    case "gridpath": return <GridPathView {...spec} />;
    case "flownet": return <FlowNetView {...spec} />;
    case "rho": return <RhoView {...spec} />;
    case "bip": return <BipView {...spec} />;
    case "align": return <AlignView {...spec} />;
    case "strspans": return <StrSpansView {...spec} />;
    case "sarray": return <SArrayView {...spec} />;
    case "palin": return <PalinView {...spec} />;
    case "automaton": return <AutomatonView {...spec} />;
    case "plane": return <PlaneView {...spec} />;
    case "angle": return <AngleView {...spec} />;
    case "sweep": return <SweepView {...spec} />;
    case "circle": return <CircleView {...spec} />;
    case "lattice": return <LatticeView {...spec} />;
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
