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
      note?: string };

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
