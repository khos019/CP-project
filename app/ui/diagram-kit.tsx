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
      onEdge?: [number, number][]; note?: string }
  /* Dynamic programming's own vocabulary. A DP table drawn as a plain grid of
     numbers hides the only thing that matters — WHICH CELLS FEED WHICH — so
     the table here draws its dependencies. Digit DP needs the tight prefix
     made visible, and expectation DP needs branches carrying weights. */
  | { kind: "dptable"; label: string; rows: (string | number)[][];
      cur?: [number, number]; deps?: [number, number][];
      path?: [number, number][]; done?: [number, number][]; note?: string }
  | { kind: "digits"; label: string; num: string; built?: string;
      at?: number; tight?: number; note?: string }
  | { kind: "prob"; label: string; root: string;
      branches: { p: string; text: string; value?: string }[];
      expect?: string; note?: string }
  /* Two pointers' own vocabulary. The technique is two indices that only ever
     move forward, and the two things a learner needs to see are exactly that:
     the WINDOW they bound right now, and the fact that neither ever goes
     back — which is the whole proof that the walk is linear. */
  | { kind: "window"; label: string; values: (string | number)[];
      l: number; r: number; agg?: string; bad?: boolean;
      best?: [number, number]; note?: string }
  | { kind: "ptrace"; label: string; n: number;
      steps: { l: number; r: number }[]; note?: string }
  /* The trees track's own vocabulary. The generic "tree" picture draws shape
     and nothing else, but every technique here is about something the shape
     does not show: the number a node carries up to its parent, the fact that
     a subtree is a CONTIGUOUS range once the walk is written down, the
     powers of two an ancestor jump is assembled from, the pieces a tree
     falls into when one node is removed, and which of two sets is copied
     into the other. Each of these draws exactly one of those. */
  | { kind: "rooted"; label: string;
      nodes: { id: number; parent: number | null; text: string;
               tone?: RTone; badge?: string; edge?: string }[];
      path?: number[]; sub?: number; note?: string }
  | { kind: "tourline"; label: string; order: (string | number)[];
      spans?: { from: number; to: number; text: string; tone?: SpanTone }[];
      ptr?: { at: number; text: string }[]; idx?: boolean; note?: string }
  | { kind: "jump"; label: string; chain: (string | number)[];
      arcs?: { from: number; to: number; text: string; on?: boolean }[];
      depths?: (string | number)[]; note?: string }
  | { kind: "cutparts"; label: string; removed: string;
      parts: { size: number; text?: string; over?: boolean }[]; note?: string }
  | { kind: "s2l"; label: string;
      sets: { size: number; text?: string; keep?: boolean }[];
      cost?: string; note?: string };

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
/* What a node is doing in a rooted-tree picture: the root it hangs from, a
   node the query names, the meeting point of two paths, the one the walk is
   standing on, or a node deliberately faded because this step is not about
   it. */
export type RTone = "root" | "mark" | "lca" | "cur" | "dim" | "idle";

/* Every label carries a thin halo in the figure's background colour, painted
   under the glyphs. A weight on an edge, a pointer's name, a value beside a
   node -- all of them sit on or next to lines, and without the halo the line
   runs straight through the letters. Inside a box the halo is the box's own
   dark fill and cannot be seen. */
const HALO = "#080d0a";
const T = (x: number, y: number, s: string, fill = DC.ink, size = 13, anchor: "middle" | "start" | "end" = "middle") => (
  <text x={x} y={y} fill={fill} fontSize={size} textAnchor={anchor} fontFamily="ui-monospace, monospace"
    stroke={HALO} strokeWidth={Math.max(2, size * 0.24)} strokeLinejoin="round" paintOrder="stroke">{s}</text>
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
  </>;
}

function GridView(s: Extract<Spec, { kind: "grid" }>) {
  const r = s.rows.length, c = s.rows[0].length, cell = Math.min(30, 300 / Math.max(r, c), 136 / r);
  const x0 = 260 - (c * cell) / 2, y0 = (152 - r * cell) / 2 + 1.5;
  const col = (ch: string) => ch === "#" ? "#1c2320" : ch === "*" ? DC.on : DC.bg;
  return <>
    {s.rows.map((row, y) => row.split("").map((ch, x) => <g key={`${y}-${x}`}>
      <rect x={x0 + x * cell} y={y0 + y * cell} width={cell - 3} height={cell - 3} rx="3"
        fill={col(ch)} stroke={ch === "*" ? DC.onLine : DC.dim} strokeWidth="1.2" />
      {ch === "#" && T(x0 + x * cell + cell / 2 - 1, y0 + y * cell + cell / 2 + 3, "▧", DC.mute, 10)}
      {ch === "*" && T(x0 + x * cell + cell / 2 - 1, y0 + y * cell + cell / 2 + 4, "•", DC.lime, 12)}
    </g>))}
  </>;
}

function GraphView(s: Extract<Spec, { kind: "graph" }>) {
  const palette = [DC.lime, DC.cool, DC.warm, DC.pink];
  /* An edge's weight sits beside the edge, off its midpoint along the normal
     -- above a flat edge, to the left of a steep one. It used to sit 5 units
     above the midpoint whatever the direction, which on a vertical edge is
     on the edge itself. */
  const wlabel = (x1: number, y1: number, x2: number, y2: number, w: string) => {
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    let nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
    if (ny > 0.2 || (Math.abs(ny) <= 0.2 && nx > 0)) { nx = -nx; ny = -ny; }
    const anchor = Math.abs(nx) < 0.4 ? "middle" : nx < 0 ? "end" : "start";
    return T((x1 + x2) / 2 + nx * 8, (y1 + y2) / 2 + ny * 8 + 4, w, DC.mute, 11, anchor);
  };
  return <>
    <defs><marker id="gm" markerWidth="9" markerHeight="9" refX="16" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 z" fill={DC.line} /></marker></defs>
    {s.edges.map(([a, b, w], i) => {
      const [x1, y1] = s.nodes[a], [x2, y2] = s.nodes[b];
      return <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={DC.line} strokeWidth="1.6" markerEnd={s.directed ? "url(#gm)" : undefined} />
        {w && wlabel(x1, y1, x2, y2, w)}
      </g>;
    })}
    {s.nodes.map(([x, y, lab], i) => <g key={`n${i}`}>
      <circle cx={x} cy={y} r="16" fill={DC.bg} stroke={palette[i % palette.length]} strokeWidth="2" />
      {T(x, y + 5, lab, palette[i % palette.length], 12)}</g>)}
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
  </>;
}

function FlowView(s: Extract<Spec, { kind: "flow" }>) {
  const n = s.steps.length, w = Math.min(150, 480 / n), x0 = 260 - (n * w) / 2 + 11;
  // Centred on the canvas, with an arrowhead on each connector: a flow is a
  // direction, and bare lines between boxes did not say which way it went.
  return <>
    <defs><marker id="flm" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 z" fill={DC.line} /></marker></defs>
    {s.steps.map((st, i) => <g key={i}>
      <rect x={x0 + i * w} y={54} width={w - 22} height={44} rx="9" fill={DC.bg} stroke={i === 0 ? DC.onLine : DC.dim} strokeWidth="1.6" />
      {T(x0 + i * w + (w - 22) / 2, 80, st, i === 0 ? DC.lime : DC.ink, fit(st, w - 28, 11))}
      {i < n - 1 && <path d={`M${x0 + i * w + w - 20} 76 L${x0 + (i + 1) * w - 3} 76`} stroke={DC.line} strokeWidth="1.8" markerEnd="url(#flm)" />}
    </g>)}
  </>;
}

// The curve is the same picture every time; its note is drawn by the band.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CurveView(s: Extract<Spec, { kind: "curve" }>) {
  /* The three curves stop short of the right edge and each is named just past
     its own end, level with it. Named beside the curves, "O(n log n)" landed
     on the steep end of O(n²). */
  return <>
    <line x1="50" y1="124" x2="410" y2="124" stroke={DC.dim} strokeWidth="1.5" />
    <line x1="50" y1="124" x2="50" y2="14" stroke={DC.dim} strokeWidth="1.5" />
    <path d="M50 122 L400 116" stroke="#6fd17a" strokeWidth="2.5" fill="none" />
    <path d="M50 122 Q250 104 400 70" stroke={DC.cool} strokeWidth="2.5" fill="none" />
    <path d="M50 122 Q310 120 400 20" stroke={DC.warm} strokeWidth="2.5" fill="none" />
    {T(410, 120, "O(1)", "#6fd17a", 11, "start")}
    {T(410, 74, "O(n log n)", DC.cool, 11, "start")}
    {T(410, 24, "O(n²)", DC.warm, 11, "start")}
    {T(230, 142, "n →", DC.mute, 11)}
    {T(56, 18, "vaqt", DC.mute, 10, "start")}
  </>;
}

function TableView(s: Extract<Spec, { kind: "table" }>) {
  const rows = s.rows.length, cols = s.rows[0].length;
  /* Rows share the whole canvas height and the table is centred in it. They
     were packed into 90 units -- 18 each for five rows -- which left an
     11-point label taller than the box it was written in. */
  const ch = Math.min(30, 132 / rows);
  const y0T = (152 - rows * ch) / 2 + 2;
  const size = Math.min(12, Math.max(8.5, (ch - 4) * 0.62));
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
        {T(xOf(c) + boxW / 2, y0T + r * ch + (ch - 4) / 2 + size * 0.36, txt, on ? DC.lime : DC.mute, fit(txt, boxW - 6, size))}</g>;
    }))}
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
        {T((xa + xb) / 2, 15, b.text, DC.mute, fit(b.text, Math.max(xb - xa, 30), 10))}
      </g>;
    })}
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
  /* The tree is centred in the canvas and spaced to fill it. Its note has a
     band of its own below, so the rows no longer close up to leave it room. */
  const r = maxDepth >= 4 ? 10 : maxDepth >= 3 ? 11 : 13;
  const rowH = maxDepth ? Math.min(46, (152 - 2 * (r + 8)) / maxDepth) : 0;
  const yTop = (152 - maxDepth * rowH) / 2;
  const yOf = (n: typeof nodes[number]) => yTop + depthOf(n) * rowH;
  /* A node is a pill as wide as its label. A state like "{a,b,c}" is wider
     than any disc that fits the row, and in a disc it ran out over the edge. */
  const fs = r > 12 ? 11 : 10;
  const size = (t: string) => fit(t, span - 14, fs);
  const halfW = (t: string) => Math.max(r, textW(t, size(t)) / 2 + 6);

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
        {n.edge && T((x1 + x2) / 2 + (x2 > x1 ? 10 : x2 < x1 ? -10 : 8), (y1 + y2) / 2 + 3, n.edge, DC.mute, 9,
          x2 > x1 ? "start" : x2 < x1 ? "end" : "start")}
      </g>;
    })}
    {nodes.map(n => {
      const st = n.state || "idle", col = TREE_COLOR[st];
      const filled = st === "active" || st === "solution";
      const x = xOf(n.id), y = yOf(n), hw = halfW(n.text);
      return <g key={"n" + n.id}>
        <rect x={x - hw} y={y - r} width={2 * hw} height={2 * r} rx={r}
          fill={filled ? DC.on : DC.bg} stroke={col}
          strokeWidth={filled ? 2.2 : 1.5} strokeDasharray={st === "pruned" ? "3 2" : undefined} />
        {T(x, y + 4, n.text, st === "idle" ? DC.ink : col, size(n.text))}
        {st === "pruned" && T(x + hw + 6, y + 4, "✗", TREE_COLOR.pruned, 10, "start")}
      </g>;
    })}
  </>;
}

/* A board, for the problems whose state IS a board: queens, knights, a maze.
   'Q' a piece, 'x' a square it attacks, '!' a conflict, '*' a candidate. */
function BoardView(s: Extract<Spec, { kind: "board" }>) {
  const rows = s.cells.length, cols = s.cells[0]?.length || 1;
  // As large as the canvas allows, centred -- the room under the board was
  // being kept for a note that now has its own band.
  const cell = Math.min(30, 136 / Math.max(rows, cols));
  const x0 = 260 - (cols * cell) / 2, y0 = (152 - rows * cell) / 2;
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
      {/* Glyphs sit on a baseline scaled to the cell, so they stay centred at
          any board size; an attacked square is a dot drawn as a dot. */}
      {ch === "Q" && T(x0 + c * cell + cell / 2 - 0.75, y0 + r * cell + cell / 2 + cell * 0.2, "♛", DC.lime, cell * 0.62)}
      {ch === "x" && <circle cx={x0 + c * cell + cell / 2 - 0.75} cy={y0 + r * cell + cell / 2 - 0.75} r={Math.max(1.6, cell * 0.07)} fill={DC.mute} />}
      {ch === "!" && T(x0 + c * cell + cell / 2 - 0.75, y0 + r * cell + cell / 2 + cell * 0.17, "✗", "#ff6b6b", cell * 0.5)}
      {ch === "*" && T(x0 + c * cell + cell / 2 - 0.75, y0 + r * cell + cell / 2 + cell * 0.17, "?", DC.cool, cell * 0.5)}
    </g>))}
  </>;
}

/* The call stack. The one thing a beginner cannot see about recursion is that
   every call is still sitting there, waiting for the one above it to return. */
function CallStackView(s: Extract<Spec, { kind: "callstack" }>) {
  const n = s.frames.length, h = Math.min(22, 112 / Math.max(n, 1));
  // The stack is centred on the canvas rather than stood on its bottom edge.
  const baseY = Math.min(136, 80 + (n * (h + 2)) / 2);
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
    {/* "main" names the floor the frames stand on, so it sits beside it. */}
    {T(132, baseY + 8, "main", DC.mute, 10, "end")}
    {s.ret && T(400, 20, "qaytadi: " + s.ret, "#6fd17a", 11)}
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
    {/* The hand starts clear of the centre label rather than under it: drawn
        from the exact centre it ran straight through "5" or "mod 7". */}
    {s.ptr !== undefined && (() => {
      const [x, y] = at(s.ptr);
      const len = Math.hypot(x - cx, y - cy) || 1;
      const ux = (x - cx) / len, uy = (y - cy) / len;
      const clear = s.centre ? Math.min(R * 0.5, textW(s.centre, 13) / 2 * Math.abs(ux) + 9 * Math.abs(uy) + 5) : 0;
      return <line x1={cx + ux * clear} y1={cy + uy * clear} x2={x - (x - cx) * 0.24} y2={y - (y - cy) * 0.24}
        stroke={DC.warm} strokeWidth="1.8" />;
    })()}
  </>;
}

/* A sieve is a grid of numbers being struck out. Showing which are still
   standing, which fell, and which multiple is being crossed right now. */
function NumGridView(s: Extract<Spec, { kind: "numgrid" }>) {
  const total = s.to - s.from + 1;
  const cols = s.cols || Math.min(10, total);
  const rows = Math.ceil(total / cols);
  // Centred in the canvas, and as large as it allows: the space below the
  // grid used to be kept free for a note that now has its own band.
  const w = Math.min(46, 460 / cols), h = Math.min(30, 128 / rows);
  const x0 = 260 - (cols * w) / 2, y0 = (152 - rows * h) / 2 + 1;
  const size = Math.min(12, Math.max(9, h * 0.44));
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
        {/* An untouched number is quiet but readable: the border colour it
            used to share was too dark to read the digits against. */}
        {T(x + (w - 3) / 2, y + (h - 3) / 2 + size * 0.36, String(v), st ? col : DC.mute, fit(String(v), w - 7, size))}
        {strike && <line x1={x + 3} y1={y + (h - 3) / 2} x2={x + w - 6} y2={y + (h - 3) / 2}
          stroke={col} strokeWidth="1.2" />}
      </g>;
    })}
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
  </>;
}

/* Overlapping sets. Inclusion-exclusion is one of those rules that looks
   arbitrary written down and obvious drawn. */
function VennView(s: Extract<Spec, { kind: "venn" }>) {
  const three = s.sets.length >= 3;
  /* Every label is placed where nothing else is drawn. The three-set case is
     the tight one: its lowest circle leaves no room underneath, so the whole
     figure lifts and that label sits below it with the note above instead. */
  /* Two sets overlap by 40 units, not 20: the shared region carries a count,
     and in a 20-unit lens the number sat on both circles' strokes. */
  const R = three ? 31 : 48, cy = three ? 58 : 76;
  const pts: [number, number][] = three
    ? [[234, cy], [286, cy], [260, cy + 30]]
    : [[232, cy], [288, cy]];
  const cols = [DC.lime, DC.cool, DC.warm];
  const labelAt: [number, number][] = three
    ? [[186, cy - 6], [334, cy - 6], [260, cy + 30 + R + 15]]
    : [[164, cy + 4], [356, cy + 4]];
  return <>
    {pts.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={R} fill="none" stroke={cols[i]} strokeWidth="1.8" opacity="0.9" />
    ))}
    {pts.map((_, i) => {
      const [lx, ly] = labelAt[i];
      return <g key={"s" + i}>{T(lx, ly, s.sets[i], cols[i], fit(s.sets[i], three ? 92 : 108, 11))}</g>;
    })}
    {s.counts?.map((c, i) => {
      const spots: [number, number][] = three
        ? [[214, cy - 12], [306, cy - 12], [260, cy + 44], [260, cy - 14], [236, cy + 20], [284, cy + 20], [260, cy + 12]]
        : [[206, cy], [314, cy], [260, cy]];
      const [x, y] = spots[i] || [260, cy];
      return c ? <g key={"c" + i}>{T(x, y + 4, c, DC.ink, 11)}</g> : null;
    })}
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
  </>;
}

/* Which indices one entry is responsible for. A Fenwick tree is impossible to
   picture without this, and a sparse table only slightly easier. */
function RangesView(s: Extract<Spec, { kind: "ranges" }>) {
  const w = Math.min(40, 430 / s.n), x0 = 260 - (s.n * w) / 2;
  const rows = Math.max(...s.spans.map(sp => sp.at)) + 1;
  const rowH = Math.min(26, 100 / Math.max(rows, 1));
  // The cells and the spans under them, centred together on the canvas.
  const cellsY = (152 - (26 + 8 + rows * rowH)) / 2 + 2;
  const spansY = cellsY + 30;
  return <>
    {Array.from({ length: s.n }, (_, i) => (
      <g key={"c" + i}>
        <rect x={x0 + i * w} y={cellsY} width={w - 4} height={24} rx="3" fill={DC.bg} stroke={DC.dim} strokeWidth="1.1" />
        {T(x0 + i * w + (w - 4) / 2, cellsY + 16, String(i + 1), DC.mute, fit(String(i + 1), w - 8, 11))}
      </g>
    ))}
    {s.spans.map((sp, k) => {
      const xa = x0 + sp.from * w, xb = x0 + (sp.to + 1) * w - 4;
      const y = spansY + sp.at * rowH;
      const col = sp.on ? DC.lime : DC.line;
      return <g key={k}>
        <rect x={xa} y={y} width={xb - xa} height={rowH - 5} rx="3"
          fill={sp.on ? DC.on : DC.bg} stroke={col} strokeWidth={sp.on ? 1.8 : 1.1} />
        {sp.text && T((xa + xb) / 2, y + (rowH - 5) / 2 + 4, sp.text, sp.on ? DC.lime : DC.mute,
          fit(sp.text, xb - xa - 6, 11))}
      </g>;
    })}
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
  // Centred vertically: a forest of lone roots used to sit on the top edge
  // above a canvas of empty space.
  const rowH = maxD ? Math.min(46, 100 / maxD) : 0;
  const yTop = (152 - maxD * rowH) / 2;
  const yOf = (n: typeof s.nodes[number]) => yTop + depth(n) * rowH;
  return <>
    {s.nodes.map(n => {
      if (n.parent === null) return null;
      const p = s.nodes.find(x => x.id === n.parent);
      if (!p) return null;
      return <path key={"e" + n.id}
        d={"M" + xOf(n.id) + " " + (yOf(n) - 14) + " L" + xOf(p.id) + " " + (yOf(p) + 14)}
        stroke={n.state === "active" ? DC.lime : DC.line} strokeWidth={n.state === "active" ? 2 : 1.4}
        markerEnd="url(#fom)" fill="none" />;
    })}
    <defs><marker id="fom" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 z" fill={DC.line} /></marker></defs>
    {s.nodes.map(n => {
      const on = n.state === "active" || n.state === "solution";
      const col = n.state === "solution" ? DC.warm : on ? DC.lime : DC.line;
      return <g key={n.id}>
        <circle cx={xOf(n.id)} cy={yOf(n)} r="13" fill={on ? DC.on : DC.bg} stroke={col} strokeWidth={on ? 2.2 : 1.4} />
        {T(xOf(n.id), yOf(n) + 4, String(n.text ?? n.id), on ? col : DC.ink, 11)}
      </g>;
    })}
  </>;
}

/* Slots with chains hanging off them — a hash table's whole story is which
   keys landed together. */
function HashTableView(s: Extract<Spec, { kind: "hashtable" }>) {
  const n = s.slots.length, w = Math.min(60, 440 / n), x0 = 260 - (n * w) / 2;
  // The slot row and its deepest chain, centred together on the canvas.
  const deepest = Math.max(0, ...s.slots.map(c => (c || []).length));
  const top = Math.max(14, (152 - (24 + deepest * 26)) / 2);
  return <>
    {s.slots.map((chain, i) => {
      const on = !!s.hi?.includes(i);
      const col = on ? DC.lime : DC.dim;
      return <g key={i}>
        <rect x={x0 + i * w} y={top} width={w - 6} height={22} rx="3"
          fill={on ? DC.on : DC.bg} stroke={col} strokeWidth={on ? 2 : 1.2} />
        {T(x0 + i * w + (w - 6) / 2, top + 15, String(i), on ? DC.lime : DC.mute, 10)}
        {(chain || []).map((item, k) => (
          <g key={k}>
            <line x1={x0 + i * w + (w - 6) / 2} y1={top + 22 + k * 26} x2={x0 + i * w + (w - 6) / 2} y2={top + 30 + k * 26}
              stroke={DC.line} strokeWidth="1.2" />
            <rect x={x0 + i * w + 3} y={top + 30 + k * 26} width={w - 12} height={20} rx="3"
              fill={DC.bg} stroke={on ? DC.lime : DC.line} strokeWidth="1.2" />
            {T(x0 + i * w + (w - 6) / 2, top + 44 + k * 26, item, on ? DC.lime : DC.ink, fit(item, w - 16, 10))}
          </g>
        ))}
      </g>;
    })}
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
  </>;
}

const MARK_COLOR: Record<string, string> = {
  lo: DC.cool, hi: DC.warm, mid: DC.lime, hit: "#6fd17a",
};

/* A continuous axis. Searching over real numbers or over an unbounded range
   has no cells to draw, only an interval that keeps halving. */
/** Tick values for an axis from a to b: both ends, and between them the
    multiples of a round step (1, 2 or 5 times a power of ten) giving about
    `want` intervals, minus any that would crowd an end. */
function niceTicks(a: number, b: number, want: number): number[] {
  const span = b - a;
  if (!(span > 0)) return [a];
  const raw = span / Math.max(want, 1);
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 5, 10].map(m => m * pow).find(st => st >= raw) || 10 * pow;
  const out = [a];
  for (let v = Math.ceil(a / step) * step; v < b; v += step) {
    if (v - a > step * 0.45 && b - v > step * 0.45) out.push(+v.toPrecision(12));
  }
  out.push(b);
  return out;
}

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
    {/* Ticks on round numbers -- 20, 40, 60, not 20.8, 40.6, 60.4 -- plus the
        two ends. A tick's number is left out where a mark hangs below the
        line at that spot, so "100" and "hi" do not print on each other. */}
    {niceTicks(s.from, s.to, ticks).map((v, i) => {
      const x = at(v);
      const lab = Math.abs(v) >= 1000 ? v.toExponential(0) : String(Math.round(v * 100) / 100);
      const blocked = (s.marks || []).some((m, k) => k % 2 === 1 && Math.abs(at(m.at) - x) < 18);
      return <g key={i}>
        <line x1={x} y1={y - 4} x2={x} y2={y + 4} stroke={DC.dim} strokeWidth="1.2" />
        {!blocked && T(x, y + 20, lab, DC.mute, 9)}
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
    {niceTicks(s.from, s.to, 4).map((v, i) => {
      const x = at(v);
      return <g key={"t" + i}>
        <line x1={x} y1={axisY - 3} x2={x} y2={axisY + 3} stroke={DC.dim} strokeWidth="1.1" />
        {T(x, axisY + 14, String(Math.round(v * 10) / 10), DC.mute, 9)}
      </g>;
    })}
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
  </>;
}

/* Value per kilogram, as area. Fractional knapsack is the one greedy whose
   correctness you can literally see: sort the blocks by height and fill from
   the left, and no rearrangement can put more area under the same width. */
function RatioView(s: Extract<Spec, { kind: "ratio" }>) {
  const baseY = 116, totalW = s.items.reduce((t, it) => t + it.w, 0) || 1;
  const scale = 400 / Math.max(totalW, s.cap || 0);
  const maxR = Math.max(...s.items.map(it => it.v / it.w), 1e-9);
  /* Offsets are derived rather than accumulated in a mutable local: a `let`
     advanced inside .map is a write that happens during render, which React is
     free to memoize around — and then the bars stack on top of each other. */
  const offsets = s.items.reduce<number[]>(
    (acc, it) => [...acc, acc[acc.length - 1] + it.w * scale], [56]);
  const bars = s.items.map((it, i) => {
    const bw = it.w * scale, h = Math.max(10, (it.v / it.w / maxR) * 80);
    const topY = baseY - h, bx = offsets[i];
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
    {/* The word may overhang one popped box: fitted to a single box it came
        out at 7 points, which nobody reads. */}
    {popped.length > 0 && T(mid(kept.length, popped.length), y - 12, "chiqarildi", "#c98f8f",
      fit("chiqarildi", Math.max(popped.length * w, 72), 10, 9))}
    {s.incoming && T(mid(total - 1, 1), y + 48, "kelmoqda", DC.cool, fit("kelmoqda", w + 12, 10))}
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
  const n = Math.max(s.cols.length, 1), colW = 440 / n;
  const cx = (i: number) => 40 + colW * (i + 0.5);
  /* A node is a pill as wide as its label, not a 13-unit disc: "{0,1}" and
     "hammasi" were shrunk to 7-point type inside discs and still ran out of
     them. Rows are spread over the canvas height the column needs. */
  const tallest = Math.max(...s.cols.map(c => c.nodes.length), 1);
  const rowH = Math.min(32, 104 / Math.max(tallest - 1, 1));
  const cy = (i: number, count: number) => 84 + (i - (count - 1) / 2) * rowH;
  const size = (t: string) => fit(t, colW - 22, 11, 9);
  const halfW = (t: string) => Math.max(13, textW(t, size(t)) / 2 + 7);
  return <>
    {s.links?.map(([c, a, b], i) => {
      const ca = s.cols[c], cb = s.cols[c + 1];
      if (!ca || !cb) return null;
      const na = ca.nodes[a], nb = cb.nodes[b];
      if (!na || !nb) return null;
      return <line key={"l" + i} x1={cx(c) + halfW(na.text)} y1={cy(a, ca.nodes.length)}
        x2={cx(c + 1) - halfW(nb.text)} y2={cy(b, cb.nodes.length)} stroke={DC.dim} strokeWidth="1.3" />;
    })}
    {s.cols.map((col, c) => <g key={"c" + c}>
      {T(cx(c), 18, col.text, DC.mute, fit(col.text, colW - 6, 10))}
      {col.nodes.map((nd, i) => {
        const y = cy(i, col.nodes.length), colr = LAYER_COLOR[nd.state || "far"], hw = halfW(nd.text);
        return <g key={i}>
          <rect x={cx(c) - hw} y={y - 12} width={2 * hw} height={24} rx={12}
            fill={nd.state && nd.state !== "far" ? DC.on : DC.bg} stroke={colr} strokeWidth="2" />
          {T(cx(c), y + 4, nd.text, colr, size(nd.text))}
        </g>;
      })}
    </g>)}
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
  // Centred and as large as the canvas allows now that the note is below it.
  const cell = Math.min(30, Math.min(360 / c, 132 / r));
  const x0 = 260 - (c * cell) / 2, y0 = (152 - r * cell) / 2 + 1.5;
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
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
      /* "flow/cap" sits at the middle of its edge -- unless the cut line runs
         through the middle, in which case it moves along the edge to whichever
         third is further from the cut. */
      const at = (f: number) => x1 + dx * f - (dy / len) * 11;
      const f = !s.cut || Math.abs(at(0.5) - s.cut.x) > 20 ? 0.5
        : Math.abs(at(0.3) - s.cut.x) > Math.abs(at(0.7) - s.cut.x) ? 0.3 : 0.7;
      const mx = x1 + dx * f, my = y1 + dy * f;
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
    {/* The entry node has cycle nodes above-right and below-right of it, so
        its mark goes below and to the left, under the empty side of the tail. */}
    {s.marks?.map((m, i) => {
      const [x, y] = pos(m.at);
      if (m.at === t && k > 1) return <g key={"m" + i}>{T(x + 4, y + 30, m.text, DC.warm, 10, "end")}</g>;
      const below = y > cyC;
      return <g key={"m" + i}>{T(x, below ? y + 28 : y - 20, m.text, DC.warm, 10)}</g>;
    })}
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
  </>;
}

/* The suffix array as it is actually used: sorted suffixes with the length of
   the shared prefix printed between neighbours. The LCP column is the point —
   without it the table is just a sort. */
function SArrayView(s: Extract<Spec, { kind: "sarray" }>) {
  /* A header line, then the rows spread over the rest of the canvas. The rows
     used to be packed under a header that sat on top of the first of them. */
  const n = Math.max(s.rows.length, 1), top = 26, rowH = Math.min(22, (145 - top) / n);
  const bh = rowH - 3, size = Math.min(12, Math.max(9, bh * 0.62));
  return <>
    {T(72, 16, "i", DC.mute, 9)}
    {T(104, 16, "suffiks", DC.mute, 9, "start")}
    {T(430, 16, "LCP", DC.mute, 9)}
    {s.rows.map((r, k) => {
      const y = top + k * rowH, on = !!s.hi?.includes(k), base = y + bh / 2 + size * 0.36;
      return <g key={k}>
        <rect x={96} y={y} width={300} height={bh} rx="3"
          fill={on ? DC.on : DC.bg} stroke={on ? DC.onLine : DC.dim} strokeWidth={on ? 1.6 : 1} />
        {T(72, base, String(r.idx), DC.mute, Math.min(10, size))}
        {T(104, base, r.suf, on ? DC.lime : DC.ink, fit(r.suf, 288, size), "start")}
        {r.lcp !== undefined && T(430, base, String(r.lcp), DC.warm, Math.min(10, size))}
      </g>;
    })}
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
  </>;
}

/* States with two kinds of arrow: transitions you follow on a character, and
   suffix links you fall back along. Drawing both the same way hides the whole
   idea behind Aho-Corasick and the suffix automaton. */
function AutomatonView(s: Extract<Spec, { kind: "automaton" }>) {
  return <>
    <defs><marker id="am" markerWidth="9" markerHeight="9" refX="16" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 z" fill={DC.line} /></marker>
      <marker id="amL" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
      <path d="M0 0 L5 3 L0 6 z" fill={DC.warm} /></marker></defs>
    {/* Failure links leave from the bottom of a state and bend below the row,
        deeper the further they reach, so two of them never share a path and
        none of them crosses the forward edges or their letters. */}
    {s.links?.map(([a, b], i) => {
      const [x1, y1] = s.nodes[a], [x2, y2] = s.nodes[b];
      const sx = x1 + (x2 > x1 ? 6 : -6), ex = x2 + (x1 > x2 ? 6 : -6);
      const sy = y1 + 13, ey = y2 + 13;
      const depth = Math.min(146, Math.max(sy, ey) + 16 + Math.abs(x2 - x1) * 0.16);
      return <path key={"l" + i} d={"M " + sx + " " + sy + " Q " + (sx + ex) / 2 + " " + depth + " " + ex + " " + ey}
        fill="none" stroke={DC.warm} strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#amL)" />;
    })}
    {/* A transition's letter sits on the side of its edge facing up, away
        from the failure links underneath. */}
    {s.edges.map((e, i) => {
      const [x1, y1] = s.nodes[e.from], [x2, y2] = s.nodes[e.to];
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
      let nx = dy / len, ny = -dx / len;
      if (ny > 0) { nx = -nx; ny = -ny; }
      return <g key={"e" + i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={DC.line} strokeWidth="1.5" markerEnd="url(#am)" />
        {e.text && T((x1 + x2) / 2 + nx * 9, (y1 + y2) / 2 + ny * 9 + 3.5, e.text, DC.cool, 11)}
      </g>;
    })}
    {s.nodes.map(([x, y, lab], i) => <g key={"n" + i}>
      <circle cx={x} cy={y} r="14" fill={DC.bg} stroke={DC.onLine} strokeWidth="1.8" />
      {T(x, y + 4, lab, DC.ink, fit(lab, 24, 11))}
    </g>)}
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
  // The note has its own band below the canvas now, so the plot may use the
  // canvas's full height instead of stopping 55 units short of it.
  const k = Math.min(430 / w, 112 / h);
  const cx = 262 - ((x0 + x1) / 2) * k, cy = 76 + ((y0 + y1) / 2) * k;
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

/* Labels are pushed away from the middle of the figure, not placed at a fixed
   "9 units above". A fixed offset put p0's name on the polygon's own edge and
   a vector's "(4, 2)" on top of the vector: whichever side is outward is the
   side with nothing drawn on it. */
const near = (a: [number, number], p: { x: number; y: number }) => Math.abs(a[0] - p.x) < 1e-9 && Math.abs(a[1] - p.y) < 1e-9;
/** The polygon's neighbours of a point that is one of its vertices. */
const adjacent = (poly: [number, number][], p: { x: number; y: number }): [number, number][] => {
  const i = poly.findIndex(v => near(v, p));
  if (i < 0 || poly.length < 2) return [];
  return [poly[(i + poly.length - 1) % poly.length], poly[(i + 1) % poly.length]];
};

function geoDraw(m: ReturnType<typeof geoMap>, segs?: GeoSeg[], pts?: GeoPt[], extra: [number, number][] = []) {
  const screen: [number, number][] = [
    ...(pts || []).map(p => [m.X(p.x), m.Y(p.y)] as [number, number]),
    ...(segs || []).flatMap(g => [[m.X(g.a[0]), m.Y(g.a[1])], [m.X(g.b[0]), m.Y(g.b[1])]] as [number, number][]),
    ...extra.map(([x, y]) => [m.X(x), m.Y(y)] as [number, number]),
  ];
  const gx = screen.length ? screen.reduce((a, p) => a + p[0], 0) / screen.length : 260;
  const gy = screen.length ? screen.reduce((a, p) => a + p[1], 0) / screen.length : 76;
  return <>
    {segs?.map((sg, i) => {
      const col = GEO_COLOR[sg.tone || "cool"];
      const [ax, ay] = sg.a, [bx, by] = sg.b;
      const x1 = m.X(ax), y1 = m.Y(ay), x2 = m.X(bx), y2 = m.Y(by);
      // The label sits off the segment's midpoint, along its normal, on the
      // side facing away from the figure's centre.
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      let nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
      if ((mx - gx) * nx + (my - gy) * ny < 0) { nx = -nx; ny = -ny; }
      const lx = mx + nx * 10, ly = my + ny * 10 + 3.5;
      const anchor = Math.abs(nx) < 0.35 ? "middle" : nx > 0 ? "start" : "end";
      return <g key={"s" + i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col}
          strokeWidth="1.8" strokeDasharray={sg.dash ? "4 3" : undefined} />
        {sg.text && T(lx, ly, sg.text, col, 10, anchor)}
      </g>;
    })}
    {pts?.map((pt, i) => {
      const col = GEO_COLOR[pt.tone || "lime"];
      const x = m.X(pt.x), y = m.Y(pt.y);
      /* Away from whatever is attached to this point: the sum of the unit
         vectors pointing back from each neighbour. An endpoint's name goes
         past the end of its segment, a vertex's outside its corner. With no
         neighbours -- or a point in the middle of a straight run, where the
         pulls cancel -- it goes away from the figure's centre. */
      const nbrs = [
        ...(segs || []).flatMap(g => near(g.a, pt) ? [g.b] : near(g.b, pt) ? [g.a] : []),
        ...adjacent(extra, pt),
      ];
      let dx = 0, dy = 0;
      for (const [nxp, nyp] of nbrs) {
        const vx = x - m.X(nxp), vy = y - m.Y(nyp), l = Math.hypot(vx, vy) || 1;
        dx += vx / l; dy += vy / l;
      }
      // A point partway along a segment (not one of its ends) sits on a
      // straight run just as much as one between two neighbours does.
      const through = (segs || []).find(g => {
        const ax = m.X(g.a[0]), ay = m.Y(g.a[1]), bx = m.X(g.b[0]), by = m.Y(g.b[1]);
        const len = Math.hypot(bx - ax, by - ay);
        if (len < 1) return false;
        const t = ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / (len * len);
        const dist = Math.abs((bx - ax) * (ay - y) - (ax - x) * (by - ay)) / len;
        return t > 0.02 && t < 0.98 && dist < 1;
      });
      if ((Math.hypot(dx, dy) < 0.3 && nbrs.length >= 2) || (nbrs.length === 0 && through)) {
        // The middle of a straight run: the pulls cancel, so the name goes
        // square off the line -- to its right, or above a flat one.
        const [nxp, nyp] = through ? through.a : nbrs[0];
        const vx = m.X(nxp) - x, vy = m.Y(nyp) - y, l = Math.hypot(vx, vy) || 1;
        dx = -vy / l; dy = vx / l;
        if (dx < -0.1 || (Math.abs(dx) <= 0.1 && dy > 0)) { dx = -dx; dy = -dy; }
      } else if (Math.hypot(dx, dy) < 0.3) { dx = x - gx; dy = y - gy; }
      const d = Math.hypot(dx, dy);
      if (pt.below) { dx = 0; dy = 1; } else if (d < 1e-6) { dx = 0; dy = -1; } else { dx /= d; dy /= d; }
      const anchor = dx > 0.45 ? "start" : dx < -0.45 ? "end" : "middle";
      const lx = x + dx * 9, ly = y + dy * 9 + (dy > 0.45 ? 8 : dy < -0.45 ? 0 : 3.5);
      return <g key={"p" + i}>
        <circle cx={x} cy={y} r="3.6" fill={col} />
        {pt.text && T(lx, ly, pt.text, col, 10, anchor)}
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
    {geoDraw(m, s.segs, s.pts, s.poly)}
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
    {/* A vector's name goes past its tip, and a vector lying along an axis
        has it lifted off the axis line, which otherwise runs through it. */}
    {[[s.u, s.uName || "u", DC.lime], [s.v, s.vName || "v", DC.cool]].map(([vec, name, col], i) => {
      const v = vec as [number, number], l = Math.hypot(v[0], v[1]) || 1;
      const ux = v[0] / l, uy = -v[1] / l;
      const onAxis = Math.abs(uy) < 0.2 || Math.abs(ux) < 0.2;
      const lx = px(v) + ux * 11 + (Math.abs(ux) < 0.2 ? 7 : 0);
      const ly = clampY(py(v) + uy * 11 + 4 + (Math.abs(uy) < 0.2 ? -9 : 0));
      return <g key={i}>{T(lx, ly, name as string, col as string, 11, ux < -0.3 && !onAxis ? "end" : "start")}</g>;
    })}
    {s.text && T(372, 40, s.text, DC.warm, 11)}
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
  </>;
}

/* A DP table that shows its dependencies. Numbers alone tell a learner what
   the answer was; the arrows tell them where it came from, which is the only
   part they cannot reconstruct on their own. */
function DpTableView(s: Extract<Spec, { kind: "dptable" }>) {
  const nr = s.rows.length, nc = s.rows[0].length;
  /* The cells stand apart, with gaps wide enough for an arrow to be seen in:
     a dependency between neighbours is drawn across the gap between them. The
     arrows used to run centre to centre, through the very numbers they were
     pointing at. The table is centred in the canvas and as large as it fits. */
  /* The first column is usually the row names ("1-buyum", "i−1"), which are
     longer than the numbers; it gets the width its longest name needs, and the
     number columns share what is left. Equal columns shrank those names to
     7-point type. */
  const head = s.rows.map(r => String(r[0] ?? ""));
  const headNeed = Math.max(...head.map(t => textW(t, 11))) + 14;
  const cw0 = Math.min(64, 470 / nc);
  const w0 = Math.max(cw0, Math.min(96, headNeed + Math.min(20, cw0 * 0.32)));
  const cw = nc > 1 ? Math.min(64, (470 - w0) / (nc - 1)) : cw0;
  const ch = Math.min(38, 130 / nr);
  const gx = Math.min(20, cw * 0.32), gy = Math.min(15, ch * 0.4);
  const bh = ch - gy;
  const colX = (c: number) => (c === 0 ? 0 : w0 + (c - 1) * cw);
  const boxW = (c: number) => (c === 0 ? w0 : cw) - gx;
  const bw = cw - gx;
  const x0 = 260 - (w0 + (nc - 1) * cw - gx) / 2, y0 = (152 - (nr * ch - gy)) / 2;
  const cx = (c: number) => x0 + colX(c) + boxW(c) / 2;
  const cy = (r: number) => y0 + r * ch + bh / 2;
  const has = (list: [number, number][] | undefined, r: number, c: number) =>
    !!list?.some(([a, b]) => a === r && b === c);
  // Where a ray from a cell's centre leaves the cell's box.
  const exit = (dx: number, dy: number, w = bw) => Math.min(
    Math.abs(dx) > 1e-9 ? w / 2 / Math.abs(dx) : Infinity,
    Math.abs(dy) > 1e-9 ? bh / 2 / Math.abs(dy) : Infinity);
  return <>
    <defs><marker id="dpm" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 z" fill={DC.warm} /></marker></defs>
    {s.rows.map((row, r) => row.map((v, c) => {
      const isCur = s.cur?.[0] === r && s.cur?.[1] === c;
      const isDep = has(s.deps, r, c), isPath = has(s.path, r, c), isDone = has(s.done, r, c);
      const col = isCur ? DC.lime : isDep ? DC.warm : isPath ? DC.pink : isDone ? DC.onLine : DC.dim;
      const txt = String(v);
      return <g key={r + "-" + c}>
        {/* An empty cell is not drawn -- unless it is the one being filled in,
            which is where the arrows point. */}
        {(txt !== "" || isCur) && (
          <rect x={x0 + colX(c)} y={y0 + r * ch} width={boxW(c)} height={bh} rx="4"
            fill={isCur || isPath ? DC.on : DC.bg} stroke={col} strokeWidth={isCur ? 2 : 1.1} />
        )}
        {T(cx(c), cy(r) + 4, txt, isCur ? DC.lime : isDep ? DC.warm : isPath ? DC.pink : DC.ink,
          fit(txt, boxW(c) - 6, Math.min(12, Math.max(9, bh * 0.6))))}
      </g>;
    }))}
    {s.cur && s.deps?.map(([r, c], i) => {
      const x1 = cx(c), y1 = cy(r), x2 = cx(s.cur![1]), y2 = cy(s.cur![0]);
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const dx = (x2 - x1) / len, dy = (y2 - y1) / len;
      /* A dependency in the same row or column that skips over cells bends
         round them instead of running through their numbers: under the row
         (over it, for the top row), or beside the column. */
      const sameRow = r === s.cur![0], sameCol = c === s.cur![1];
      if ((sameRow && Math.abs(c - s.cur![1]) > 1) || (sameCol && Math.abs(r - s.cur![0]) > 1)) {
        if (sameRow) {
          const down = r === nr - 1 || r > 0 ? 1 : -1;
          const yEdge = y1 + down * (bh / 2 + 1);
          const bend = yEdge + down * Math.min(16, 6 + Math.abs(x2 - x1) * 0.08);
          return <path key={"a" + i} d={`M ${x1} ${yEdge} Q ${(x1 + x2) / 2} ${bend + down * 6} ${x2} ${yEdge + down * 1.5}`}
            fill="none" stroke={DC.warm} strokeWidth="1.5" markerEnd="url(#dpm)" />;
        }
        const xEdge = x1 + boxW(c) / 2 + 1;
        const bend = xEdge + Math.min(16, 6 + Math.abs(y2 - y1) * 0.12);
        return <path key={"a" + i} d={`M ${xEdge} ${y1} Q ${bend + 6} ${(y1 + y2) / 2} ${xEdge + 1.5} ${y2}`}
          fill="none" stroke={DC.warm} strokeWidth="1.5" markerEnd="url(#dpm)" />;
      }
      const t0 = exit(dx, dy, boxW(c)) + 1, t1 = len - exit(dx, dy, boxW(s.cur![1])) - 1.5;
      if (t1 <= t0) return null;
      return <line key={"a" + i} x1={x1 + dx * t0} y1={y1 + dy * t0} x2={x1 + dx * t1} y2={y1 + dy * t1}
        stroke={DC.warm} strokeWidth="1.5" markerEnd="url(#dpm)" />;
    })}
  </>;
}

/* Digit DP is about one thing a row of numbers cannot show: which prefix is
   still PINNED to the bound, and where the digits become free. */
function DigitsView(s: Extract<Spec, { kind: "digits" }>) {
  const d = s.num.split("");
  const w = Math.min(38, 400 / Math.max(d.length, 1)), x0 = 260 - (d.length * w) / 2;
  const built = (s.built || "").split("");
  return <>
    {d.map((ch, i) => {
      const pinned = s.tight !== undefined && i < s.tight;
      const isAt = s.at === i;
      const col = isAt ? DC.lime : pinned ? DC.warm : DC.dim;
      return <g key={"n" + i}>
        <rect x={x0 + i * w} y={22} width={w - 4} height={26} rx="3"
          fill={isAt ? DC.on : DC.bg} stroke={col} strokeWidth={isAt ? 2 : 1.2} />
        {T(x0 + i * w + (w - 4) / 2, 40, ch, isAt ? DC.lime : pinned ? DC.warm : DC.ink,
          fit(ch, w - 8, 13))}
      </g>;
    })}
    {T(x0 - 10, 40, "N", DC.mute, 10, "end")}
    {s.tight !== undefined && s.tight > 0 && <>
      <path d={"M " + x0 + " 54 L " + x0 + " 60 L " + (x0 + s.tight * w - 4) + " 60 L " +
        (x0 + s.tight * w - 4) + " 54"} fill="none" stroke={DC.warm} strokeWidth="1.4" />
      {T(x0 + (s.tight * w - 4) / 2, 72, "tight", DC.warm, 10)}
    </>}
    {built.length > 0 && <>
      {T(x0 - 10, 100, "x", DC.mute, 10, "end")}
      {built.map((ch, i) => (
        <g key={"b" + i}>
          <rect x={x0 + i * w} y={82} width={w - 4} height={26} rx="3" fill={DC.on}
            stroke={DC.onLine} strokeWidth="1.4" />
          {T(x0 + i * w + (w - 4) / 2, 100, ch, DC.lime, fit(ch, w - 8, 13))}
        </g>
      ))}
    </>}
  </>;
}

/* Expectation is a weighted sum over branches, so the weights have to sit on
   the branches — a plain tree hides exactly the numbers being averaged. */
function ProbView(s: Extract<Spec, { kind: "prob" }>) {
  const n = Math.max(s.branches.length, 1);
  const ox = 92, oy = 80;
  const bx = 330;
  const by = (i: number) => 80 + (i - (n - 1) / 2) * Math.min(48, 112 / n);
  /* Each probability sits two thirds of the way along its branch, on the
     branch's outer side: the upper branch's above it, the lower's below.
     Placed at the midpoints, two branches' labels stood one on top of the
     other beside the fork. */
  const pLabel = (i: number) => {
    const x1 = ox + 20, y1 = oy, x2 = bx - 46, y2 = by(i);
    const f = 0.62, mx = x1 + (x2 - x1) * f, my = y1 + (y2 - y1) * f;
    const below = y2 > oy + 1;
    return T(mx, below ? my + 14 : my - 6, s.branches[i].p, DC.warm, 11);
  };
  return <>
    {s.branches.map((b, i) => (
      <g key={i}>
        <line x1={ox + 20} y1={oy} x2={bx - 46} y2={by(i)} stroke={DC.line} strokeWidth="1.5" />
        {pLabel(i)}
        <rect x={bx - 44} y={by(i) - 12} width={88} height={24} rx="4" fill={DC.bg}
          stroke={DC.onLine} strokeWidth="1.3" />
        {T(bx, by(i) + 4, b.text, DC.ink, fit(b.text, 82, 11))}
        {b.value && T(bx + 58, by(i) + 4, b.value, DC.lime, 10, "start")}
      </g>
    ))}
    <circle cx={ox} cy={oy} r="20" fill={DC.on} stroke={DC.lime} strokeWidth="1.8" />
    {T(ox, oy + 4, s.root, DC.lime, fit(s.root, 36, 11))}
    {s.expect && T(260, 20, s.expect, DC.pink, 11)}
  </>;
}

/* The window itself. Drawing the array and leaving l and r to the caption
   hides the one thing the reader is trying to follow. */
function WindowView(s: Extract<Spec, { kind: "window" }>) {
  const v = s.values, n = Math.max(v.length, 1);
  const w = Math.min(46, 440 / n), x0 = 260 - (n * w) / 2;
  const cx = (i: number) => x0 + i * w + (w - 4) / 2;
  const inWin = (i: number) => i >= s.l && i <= s.r;
  const col = s.bad ? DC.warm : DC.lime;
  const empty = s.r < s.l;
  const tick = (x: number) => <line x1={x} y1={83} x2={x} y2={90} stroke={col} strokeWidth="1.4" />;
  return <>
    {s.best && (
      <rect x={x0 + s.best[0] * w - 2} y={26} width={(s.best[1] - s.best[0] + 1) * w} height={38}
        rx="4" fill="none" stroke={DC.cool} strokeWidth="1.2" strokeDasharray="4 3" />
    )}
    {!empty && (
      <rect x={x0 + s.l * w - 2} y={30} width={(s.r - s.l + 1) * w} height={30} rx="4"
        fill={s.bad ? "rgba(255,189,143,.10)" : "rgba(200,255,118,.10)"} stroke={col} strokeWidth="1.8" />
    )}
    {v.map((val, i) => (
      <g key={i}>
        <rect x={x0 + i * w} y={34} width={w - 4} height={24} rx="3"
          fill={inWin(i) ? DC.on : DC.bg} stroke={inWin(i) ? col : DC.dim} strokeWidth="1.1" />
        {T(cx(i), 51, String(val), inWin(i) ? col : DC.ink, fit(String(val), w - 9, 12))}
        {T(cx(i), 78, String(i), DC.mute, Math.min(9, w * 0.42))}
      </g>
    ))}
    {/* Index under each cell, then the pointers under the indices, each with
        a tick up to its cell: the pointers used to sit between the cells and
        the indices, on the edge of the "best so far" frame. */}
    {empty
      ? T(x0 + s.l * w + (w - 4) / 2, 100, "l, r", DC.mute, 10)
      : s.l === s.r
        ? <>{tick(cx(s.l))}{T(cx(s.l), 100, "l = r", col, 10)}</>
        : <>{tick(cx(s.l))}{tick(cx(s.r))}{T(cx(s.l), 100, "l", col, 11)}{T(cx(s.r), 100, "r", col, 11)}</>}
    {s.agg && T(260, 126, s.agg, s.bad ? DC.warm : DC.lime, 11)}
    {s.best && T(x0 + (s.best[0] + (s.best[1] - s.best[0] + 1) / 2) * w - 2, 19,
      "eng yaxshi", DC.cool, 10)}
  </>;
}

/* Why two pointers is linear, drawn. Both indices only ever move right, so
   the total work is bounded by how far they can travel — not by how many
   times the inner loop appears to run. */
function PTraceView(s: Extract<Spec, { kind: "ptrace" }>) {
  const m = Math.max(s.steps.length, 1);
  const x0 = 70, x1 = 460, yTop = 34, yBot = 108;
  const xAt = (i: number) => x0 + (i / Math.max(m - 1, 1)) * (x1 - x0);
  const yAt = (p: number) => yBot - (p / Math.max(s.n, 1)) * (yBot - yTop);
  const path = (get: (st: { l: number; r: number }) => number) =>
    s.steps.map((st, i) => (i ? "L " : "M ") + xAt(i).toFixed(1) + " " + yAt(get(st)).toFixed(1)).join(" ");
  return <>
    <line x1={x0 - 8} y1={yBot} x2={x1 + 6} y2={yBot} stroke={DC.dim} strokeWidth="1.2" />
    <line x1={x0 - 8} y1={yBot} x2={x0 - 8} y2={yTop - 6} stroke={DC.dim} strokeWidth="1.2" />
    <path d={path(st => st.r)} fill="none" stroke={DC.cool} strokeWidth="2.2" />
    <path d={path(st => st.l)} fill="none" stroke={DC.lime} strokeWidth="2.2" />
    {s.steps.map((st, i) => <g key={i}>
      <circle cx={xAt(i)} cy={yAt(st.r)} r="2.6" fill={DC.cool} />
      <circle cx={xAt(i)} cy={yAt(st.l)} r="2.6" fill={DC.lime} />
    </g>)}
    {T(x0 - 14, yTop - 10, "indeks", DC.mute, 9, "start")}
    {T(x1 + 6, yBot + 14, "qadam", DC.mute, 9, "end")}
    <line x1={122} y1={20} x2={144} y2={20} stroke={DC.lime} strokeWidth="2.2" />
    {T(150, 24, "l", DC.lime, 10, "start")}
    <line x1={300} y1={20} x2={322} y2={20} stroke={DC.cool} strokeWidth="2.2" />
    {T(328, 24, "r", DC.cool, 10, "start")}
  </>;
}

const R_COLOR: Record<string, string> = {
  root: DC.lime, mark: DC.cool, lca: DC.pink, cur: DC.warm,
  dim: DC.mute, idle: DC.line,
};

/* A rooted tree that can carry a number per node. Almost every tree algorithm
   is "each node hands one value to its parent", and a picture without those
   values on it is a picture of the shape, not of the algorithm. The badge
   hangs BELOW its node rather than beside it: siblings are only ever a column
   apart horizontally, but the next row down is always a full row away. */
function RootedView(s: Extract<Spec, { kind: "rooted" }>) {
  const nodes = s.nodes;
  const byId = new Map(nodes.map(n => [n.id, n]));
  const depthOf = (n: typeof nodes[number]): number => {
    let d = 0, cur = n;
    while (cur.parent !== null) { const p = byId.get(cur.parent); if (!p) break; cur = p; ++d; }
    return d;
  };
  const kids = (id: number) => nodes.filter(n => n.parent === id);
  const leaves = nodes.filter(n => kids(n.id).length === 0);
  const isLeaf = (id: number) => kids(id).length === 0;
  const span = Math.min(76, 430 / Math.max(leaves.length, 1));
  const lx0 = 260 - ((leaves.length - 1) * span) / 2;
  const leafX = new Map<number, number>();
  leaves.forEach((n, i) => leafX.set(n.id, lx0 + i * span));
  const xOf = (id: number): number => {
    if (leafX.has(id)) return leafX.get(id) as number;
    const ch = kids(id).map(c => xOf(c.id));
    return ch.reduce((a, b) => a + b, 0) / Math.max(ch.length, 1);
  };
  const maxDepth = Math.max(...nodes.map(depthOf), 0);
  const rowH = maxDepth >= 3 ? 30 : 40;
  const r = maxDepth >= 3 ? 11 : 13;
  const yOf = (n: typeof nodes[number]) => 24 + depthOf(n) * rowH;

  /* The shaded subtree: the smallest box holding the marked node and every
     descendant of it. Drawn first so the edges and discs sit on top. */
  const descend = (id: number): number[] => [id, ...kids(id).flatMap(c => descend(c.id))];
  const subIds = s.sub !== undefined && byId.has(s.sub) ? descend(s.sub) : [];
  const subXs = subIds.map(i => xOf(i));
  const subYs = subIds.map(i => yOf(byId.get(i) as typeof nodes[number]));

  const onPath = new Set(s.path || []);

  return <>
    {subIds.length > 1 && (
      <rect x={Math.min(...subXs) - r - 6} y={Math.min(...subYs) - r - 5}
        width={Math.max(...subXs) - Math.min(...subXs) + 2 * r + 12}
        height={Math.max(...subYs) - Math.min(...subYs) + 2 * r + 10
          + (subIds.some(i => byId.get(i)?.badge !== undefined && isLeaf(i)) ? 12 : 0)}
        rx="9" fill="rgba(138,216,255,.09)" stroke={DC.cool} strokeWidth="1"
        strokeDasharray="5 4" />
    )}
    {nodes.map(n => {
      if (n.parent === null) return null;
      const p = byId.get(n.parent);
      if (!p) return null;
      const x1 = xOf(p.id), y1 = yOf(p), x2 = xOf(n.id), y2 = yOf(n);
      const hot = onPath.has(n.id) && onPath.has(p.id);
      return <g key={"e" + n.id}>
        <line x1={x1} y1={y1 + r} x2={x2} y2={y2 - r}
          stroke={hot ? DC.lime : DC.dim} strokeWidth={hot ? 2.6 : 1.4} />
        {n.edge && T((x1 + x2) / 2 + (x2 > x1 ? 11 : -11), (y1 + y2) / 2 + 3, n.edge, DC.mute, 9)}
      </g>;
    })}
    {nodes.map(n => {
      const tone = n.tone || "idle", col = R_COLOR[tone];
      const filled = tone !== "idle" && tone !== "dim";
      const y = yOf(n), x = xOf(n.id);
      return <g key={"n" + n.id}>
        {tone === "lca" && <circle cx={x} cy={y} r={r + 3.5} fill="none" stroke={DC.pink} strokeWidth="1.1" />}
        <circle cx={x} cy={y} r={r} fill={filled ? DC.on : DC.bg} stroke={col}
          strokeWidth={filled ? 2.2 : 1.4} />
        {T(x, y + 4, n.text, tone === "idle" ? DC.ink : col, fit(n.text, 2 * r - 4, r > 12 ? 12 : 11))}
        {n.badge !== undefined && (isLeaf(n.id)
          // A leaf has nothing below it, so its value goes underneath.
          ? T(x, y + r + 10, n.badge, DC.lime, fit(n.badge, span - 6, 10))
          // A parent's children are below it, and the edges to them leave
          // from its bottom; its value goes to the right, level with the disc.
          : T(x + r + 4, y + 4, n.badge, DC.lime, fit(n.badge, Math.max(span - 2 * r - 8, 20), 10), "start"))}
      </g>;
    })}
  </>;
}

/* The same tree after the walk has written it down. This is the one picture a
   learner needs before Euler tours make sense: the subtree that looked like a
   fan of branches is a single unbroken block of cells, which is exactly why a
   Fenwick tree can answer subtree questions at all. */
function TourLineView(s: Extract<Spec, { kind: "tourline" }>) {
  const v = s.order, n = Math.max(v.length, 1);
  const w = Math.min(44, 430 / n), x0 = 260 - (n * w) / 2;
  const cx = (i: number) => x0 + i * w + (w - 5) / 2;
  const cellY = 72;
  /* Overlapping ranges are stacked instead of drawn on top of each other:
     nested subtrees are the normal case here, and two brackets sharing a line
     would print their labels through one another. */
  const spans = s.spans || [];
  const rows: number[] = [];
  spans.forEach((a, i) => {
    let row = 0;
    for (let j = 0; j < i; ++j) {
      const b = spans[j];
      if (!(a.to < b.from || b.to < a.from)) row = Math.max(row, rows[j] + 1);
    }
    rows.push(row);
  });
  const spanY = (row: number) => cellY - 12 - row * 17;
  const tone = (t?: SpanTone) => t === "warm" ? DC.warm : t === "cool" ? DC.cool : DC.lime;
  return <>
    {v.map((val, i) => <g key={i}>
      <rect x={x0 + i * w} y={cellY} width={w - 5} height={26} rx="4"
        fill={DC.bg} stroke={DC.dim} strokeWidth="1.2" />
      {T(cx(i), cellY + 18, String(val), DC.ink, fit(String(val), w - 11, 12))}
      {s.idx !== false && T(cx(i), cellY + 42, String(i), DC.mute, 9)}
    </g>)}
    {spans.map((sp, i) => {
      const y = spanY(rows[i]), col = tone(sp.tone);
      const xa = x0 + sp.from * w, xb = x0 + (sp.to + 1) * w - 5;
      return <g key={"s" + i}>
        <path d={"M " + xa + " " + (y + 5) + " L " + xa + " " + y + " L " + xb + " " + y + " L " + xb + " " + (y + 5)}
          fill="none" stroke={col} strokeWidth="1.5" />
        {T((xa + xb) / 2, y - 4, sp.text, col, fit(sp.text, Math.max(xb - xa, 26), 10))}
      </g>;
    })}
    {(s.ptr || []).map((p, i) =>
      <g key={"p" + i}>
        {/* Under the index row, not through it: the tick used to run across
            the index number of the cell it pointed at. */}
        <path d={"M " + cx(p.at) + " " + (s.idx !== false ? cellY + 47 : cellY + 30) + " L " + cx(p.at) + " " + (s.idx !== false ? cellY + 55 : cellY + 46)}
          stroke={DC.warm} strokeWidth="1.6" />
        {T(cx(p.at), s.idx !== false ? cellY + 67 : cellY + 60, p.text, DC.warm, fit(p.text, w + 10, 10))}
      </g>)}
  </>;
}

/* An ancestor chain with the powers of two written over it. Binary lifting is
   taught as a table, and the table is the implementation; the idea is that
   any climb of k steps is the binary expansion of k, and that is a picture of
   arcs, not of a two-dimensional array. */
function JumpView(s: Extract<Spec, { kind: "jump" }>) {
  const n = Math.max(s.chain.length, 1);
  const gap = Math.min(58, 420 / Math.max(n - 1, 1));
  const x0 = 260 - ((n - 1) * gap) / 2, y = 104, r = 12;
  const cx = (i: number) => x0 + i * gap;
  return <>
    <defs><marker id="jm" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 z" fill={DC.lime} /></marker>
      <marker id="jmo" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 z" fill={DC.line} /></marker></defs>
    {(s.arcs || []).map((a, i) => {
      const lo = Math.min(a.from, a.to), hi = Math.max(a.from, a.to);
      const apex = Math.max(20, y - r - 12 - (hi - lo) * 13);
      const col = a.on ? DC.lime : DC.line;
      return <g key={"a" + i}>
        <path d={"M " + cx(a.from) + " " + (y - r) + " Q " + ((cx(lo) + cx(hi)) / 2) + " " + (apex - 8) + " " + cx(a.to) + " " + (y - r)}
          fill="none" stroke={col} strokeWidth={a.on ? 2.2 : 1.2}
          strokeDasharray={a.on ? undefined : "4 3"}
          markerEnd={a.on ? "url(#jm)" : "url(#jmo)"} />
        {T((cx(lo) + cx(hi)) / 2, apex - 4, a.text, col, fit(a.text, Math.max((hi - lo) * gap, 30), 10))}
      </g>;
    })}
    {s.chain.map((c, i) => <g key={"c" + i}>
      <circle cx={cx(i)} cy={y} r={r} fill={DC.bg} stroke={DC.onLine} strokeWidth="1.6" />
      {T(cx(i), y + 4, String(c), DC.ink, fit(String(c), 2 * r - 4, 11))}
      {s.depths?.[i] !== undefined &&
        T(cx(i), y + r + 11, String(s.depths[i]), DC.mute, fit(String(s.depths[i]), gap - 6, 9))}
    </g>)}
  </>;
}

/* What is left when one node is deleted. Centroid, articulation points and
   every "remove an edge, look at the pieces" DP are the same question — how
   big are the pieces — and the answer is easier to see as discs than as a
   redrawn forest. */
function CutPartsView(s: Extract<Spec, { kind: "cutparts" }>) {
  const parts = s.parts;
  const rad = (k: number) => Math.max(11, Math.min(27, 8.5 * Math.sqrt(Math.max(k, 1))));
  const rs = parts.map(p => rad(p.size));
  const gapX = 16;
  const total = rs.reduce((a, b) => a + 2 * b, 0) + gapX * Math.max(parts.length - 1, 0);
  const cy = 76;
  const remSize = fit(s.removed, 110, 11, 9);
  const remW = Math.max(34, textW(s.removed, remSize) + 16);
  const remX = 20 + remW / 2;
  const arrowX = remX + remW / 2 + 36;
  // Each circle's centre: after the arrow, plus every circle and gap before it,
  // the row as a whole centred in the room left of it.
  const start = Math.max(arrowX + 12, 302 - total / 2);
  const xs = rs.map((rr, i) => start + rs.slice(0, i).reduce((a, b) => a + 2 * b + gapX, 0) + rr);
  return <>
    {/* The removed node is a dashed pill as wide as its name: "har qadam" in
        a 17-unit disc came out at 7 points. */}
    <rect x={remX - remW / 2} y={cy - 14} width={remW} height={28} rx={14} fill={DC.bg}
      stroke={DC.warm} strokeWidth="1.6" strokeDasharray="4 3" />
    {T(remX, cy + 4, s.removed, DC.warm, remSize)}
    {T(remX, cy + 30, "olib tashlandi", DC.mute, 9)}
    <line x1={remX + remW / 2 + 6} y1={cy} x2={arrowX - 8} y2={cy} stroke={DC.line} strokeWidth="1.4" />
    <path d={"M " + (arrowX - 8) + " " + (cy - 4) + " L " + arrowX + " " + cy + " L " + (arrowX - 8) + " " + (cy + 4) + " z"} fill={DC.line} />
    {parts.map((pt, i) => {
      const col = pt.over ? DC.warm : DC.cool;
      return <g key={i}>
        <circle cx={xs[i]} cy={cy} r={rs[i]} fill={DC.bg} stroke={col} strokeWidth="1.7" />
        {T(xs[i], cy + 4, String(pt.size), col, fit(String(pt.size), 2 * rs[i] - 6, 12))}
        {pt.text && T(xs[i], cy + rs[i] + 13, pt.text, DC.mute, fit(pt.text, 2 * rs[i] + gapX, 9))}
      </g>;
    })}
  </>;
}

/* Small to large. The rule is one line — always copy the smaller set into the
   bigger one — and the reason it is fast is that the element being copied at
   least doubles the size of the set it lands in. The picture puts the sizes
   and the arrow direction side by side so that "smaller into larger" stops
   being a slogan. */
function S2LView(s: Extract<Spec, { kind: "s2l" }>) {
  const sets = s.sets, n = Math.max(sets.length, 1);
  const w = Math.min(52, 360 / n), x0 = 260 - (n * w) / 2;
  const mx = Math.max(...sets.map(v => v.size), 1);
  const baseY = 116;
  const hOf = (k: number) => Math.max(12, (k / mx) * 62);
  const cx = (i: number) => x0 + i * w + (w - 8) / 2;
  const keepAt = sets.findIndex(v => v.keep);
  return <>
    <defs><marker id="sm" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0 0 L6 3 L0 6 z" fill={DC.warm} /></marker></defs>
    {sets.map((v, i) => {
      const h = hOf(v.size), col = v.keep ? DC.lime : DC.warm;
      return <g key={i}>
        <rect x={x0 + i * w} y={baseY - h} width={w - 8} height={h} rx="4"
          fill={v.keep ? DC.on : DC.bg} stroke={col} strokeWidth="1.6" />
        {T(cx(i), baseY - h - 6, String(v.size), col, fit(String(v.size), w - 10, 11))}
        {v.text && T(cx(i), baseY + 15, v.text, DC.mute, fit(v.text, w + 4, 9))}
      </g>;
    })}
    {keepAt >= 0 && sets.map((v, i) => {
      if (v.keep) return null;
      const ya = baseY - hOf(v.size) - 18, yb = baseY - hOf(sets[keepAt].size) - 18;
      const apex = Math.min(ya, yb) - 16;
      return <path key={"ar" + i} d={"M " + cx(i) + " " + ya + " Q " + ((cx(i) + cx(keepAt)) / 2) + " " + apex + " " + cx(keepAt) + " " + yb}
        fill="none" stroke={DC.warm} strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#sm)" />;
    })}
    {s.cost && T(260, 20, s.cost, DC.cool, 11)}
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
    case "dptable": return <DpTableView {...spec} />;
    case "digits": return <DigitsView {...spec} />;
    case "prob": return <ProbView {...spec} />;
    case "window": return <WindowView {...spec} />;
    case "ptrace": return <PTraceView {...spec} />;
    case "rooted": return <RootedView {...spec} />;
    case "tourline": return <TourLineView {...spec} />;
    case "jump": return <JumpView {...spec} />;
    case "cutparts": return <CutPartsView {...spec} />;
    case "s2l": return <S2LView {...spec} />;
  }
}

/* ── The note band ─────────────────────────────────────────────────────
   A spec's `note` is the one sentence that says what to look at. It used to
   be drawn inside the 520×152 canvas, each view guessing a free spot for it --
   "under the figure unless the nodes are low, then above" -- and the guesses
   were wrong often enough that notes printed across nodes, rows and arrows.
   The note now has a band of its own below the canvas, so it cannot collide
   with anything the figure draws. Long notes wrap onto a second line rather
   than shrinking to an unreadable size. */
const NOTE_SIZE = 12;
const NOTE_MAX_W = 496;
const NOTE_LINE = 17;

function noteLines(note: string): string[] {
  if (textW(note, NOTE_SIZE) <= NOTE_MAX_W) return [note];
  // Break at the space nearest the middle, so the two lines are balanced.
  const mid = note.length / 2;
  let best = -1;
  for (let i = 0; i < note.length; i++) {
    if (note[i] === " " && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  }
  return best < 0 ? [note] : [note.slice(0, best), note.slice(best + 1)];
}

const noteOf = (spec: Spec) => ("note" in spec && spec.note ? spec.note : "");

/** The height of the band a spec's note needs: nothing, one line or two. */
export function noteBand(spec: Spec): number {
  const note = noteOf(spec);
  if (!note) return 0;
  return 12 + noteLines(note).length * NOTE_LINE;
}

function NoteBand({ note, band }: { note: string; band: number }) {
  const lines = noteLines(note);
  const top = 152 + (band - lines.length * NOTE_LINE) / 2;
  return <>
    <line x1="60" x2="460" y1="152.5" y2="152.5" stroke={DC.dim} strokeWidth="1" strokeDasharray="2 4" />
    {lines.map((line, i) =>
      T(260, top + 12 + i * NOTE_LINE, line, DC.lime, fit(line, NOTE_MAX_W, NOTE_SIZE, 10)))}
  </>;
}

/** The canvas plus its note band. `band` reserves a fixed height -- the step
    player passes the tallest band any of its frames needs, so the picture does
    not jump in size from one frame to the next. */
export function DiagramSvg({ spec, band }: { spec: Spec; band?: number }) {
  const note = noteOf(spec);
  const h = Math.max(band ?? 0, noteBand(spec));
  return (
    <svg viewBox={`0 0 520 ${152 + h}`} role="img" aria-label={spec.label}>
      <DiagramBody spec={spec} />
      {note && <NoteBand note={note} band={h} />}
    </svg>
  );
}

export function DiagramFromSpec({ spec }: { spec: Spec }) {
  return (
    <figure className="concept-figure">
      <DiagramSvg spec={spec} />
      <figcaption>{spec.label}</figcaption>
    </figure>
  );
}
