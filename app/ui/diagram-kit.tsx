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
  | { kind: "table"; label: string; rows: (string | number)[][]; hi?: [number, number]; note?: string };

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

/* The drawing on its own, with no figure or caption around it. The step
   player reuses it: a simulation is the same picture redrawn frame by frame,
   and it needs the caption slot for the step's own explanation. */
export function DiagramBody({ spec }: { spec: Spec }) {
  return (
    spec.kind === "array" ? <ArrayView {...spec} /> :
    spec.kind === "tworow" ? <TwoRow {...spec} /> :
    spec.kind === "grid" ? <GridView {...spec} /> :
    spec.kind === "graph" ? <GraphView {...spec} /> :
    spec.kind === "stack" ? <StackView {...spec} /> :
    spec.kind === "flow" ? <FlowView {...spec} /> :
    spec.kind === "curve" ? <CurveView {...spec} /> :
    <TableView {...spec} />
  );
}

export function DiagramFromSpec({ spec }: { spec: Spec }) {
  return (
    <figure className="concept-figure">
      <svg viewBox="0 0 520 152" role="img" aria-label={spec.label}><DiagramBody spec={spec} /></svg>
      <figcaption>{spec.label}</figcaption>
    </figure>
  );
}
