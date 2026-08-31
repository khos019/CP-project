"use client";

// Original AlgoYo'l concept diagrams.
//
// A lesson that only shows prose and code makes the learner build the picture
// in their head. These draw the mechanism instead: what the pointers do, which
// half survives, how the layers expand. All original SVG — no diagrams copied
// from USACO Guide, CP-Algorithms or anywhere else.
//
// Keyed by the roadmap slug so a unit inherits its roadmap's diagram, with the
// tag as an override where a topic deserves its own picture.

const C = { dim: "#2b3f34", line: "#4a6b58", ink: "#cfe0d6", lime: "#c8ff76", warm: "#ffbd8f", cool: "#8ad8ff", mute: "#7d8f85" };

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <figure className="concept-figure">
      <svg viewBox="0 0 520 150" role="img" aria-label={label}>{children}</svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

const cell = (x: number, y: number, w: number, h: number, fill: string, stroke = C.dim) =>
  <rect x={x} y={y} width={w} height={h} rx="5" fill={fill} stroke={stroke} strokeWidth="1.5" />;

const text = (x: number, y: number, s: string, fill = C.ink, size = 13,
  anchor: "middle" | "start" | "end" = "middle") =>
  <text x={x} y={y} fill={fill} fontSize={size} textAnchor={anchor} fontFamily="ui-monospace, monospace">{s}</text>;

function BinarySearch() {
  return (
    <Frame label="Binary search: har qadamda qidiruv maydoni yarmiga qisqaradi">
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <g key={i}>
          {cell(30 + i * 58, 30, 50, 34, i >= 4 ? "#12261a" : "#0d1310", i >= 4 ? "#3f7a44" : C.dim)}
          {text(55 + i * 58, 52, String((i + 1) * 3))}
        </g>
      ))}
      <path d="M55 76 L55 96" stroke={C.warm} strokeWidth="2" />
      {text(55, 112, "lo", C.warm, 12)}
      <path d="M491 76 L491 96" stroke={C.warm} strokeWidth="2" />
      {text(491, 112, "hi", C.warm, 12)}
      <path d="M263 22 L263 8" stroke={C.lime} strokeWidth="2" />
      {text(263, 132, "mid < x → chap yarmini tashlaymiz", C.lime, 12)}
    </Frame>
  );
}

function TwoPointers() {
  return (
    <Frame label="Ikki ko‘rsatkich: chetlardan markazga qarab yurish">
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <g key={i}>
          {cell(40 + i * 62, 34, 54, 34, i === 1 || i === 5 ? "#12261a" : "#0d1310", i === 1 || i === 5 ? "#3f7a44" : C.dim)}
          {text(67 + i * 62, 56, String([1, 3, 4, 6, 8, 9, 12][i]))}
        </g>
      ))}
      <path d="M129 80 L129 100" stroke={C.lime} strokeWidth="2" />
      {text(129, 116, "l →", C.lime, 12)}
      <path d="M377 80 L377 100" stroke={C.cool} strokeWidth="2" />
      {text(377, 116, "← r", C.cool, 12)}
      {text(260, 24, "yig‘indi kichik bo‘lsa l ni suramiz", C.mute, 12)}
    </Frame>
  );
}

function SlidingWindow() {
  return (
    <Frame label="Sirg‘aluvchi oyna: kiruvchi element qo‘shiladi, chiquvchi ayiriladi">
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <g key={i}>
          {cell(28 + i * 58, 40, 50, 34, i >= 2 && i <= 4 ? "#12261a" : "#0d1310", i >= 2 && i <= 4 ? "#3f7a44" : C.dim)}
          {text(53 + i * 58, 62, String([2, 7, 1, 8, 2, 8, 1, 8][i]))}
        </g>
      ))}
      <rect x="140" y="32" width="178" height="50" rx="8" fill="none" stroke={C.lime} strokeWidth="2" strokeDasharray="5 4" />
      {text(229, 24, "k = 3", C.lime, 12)}
      <path d="M330 57 L360 57" stroke={C.warm} strokeWidth="2" markerEnd="url(#ar)" />
      {text(120, 106, "− chiqdi", C.cool, 12)}
      {text(360, 106, "+ kirdi", C.warm, 12)}
      <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={C.warm} /></marker></defs>
    </Frame>
  );
}

function PrefixSum() {
  return (
    <Frame label="Prefiks yig‘indi: [l, r] = pre[r] − pre[l−1]">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <g key={i}>
          {cell(40 + i * 74, 26, 64, 30, "#0d1310")}
          {text(72 + i * 74, 46, String([3, 1, 4, 1, 5, 9][i]))}
          {cell(40 + i * 74, 72, 64, 30, i <= 3 ? "#12261a" : "#0d1310", i <= 3 ? "#3f7a44" : C.dim)}
          {text(72 + i * 74, 92, String([3, 4, 8, 9, 14, 23][i]), i <= 3 ? C.lime : C.ink)}
        </g>
      ))}
      {text(20, 46, "a", C.mute, 12, "start")}
      {text(20, 92, "pre", C.mute, 12, "start")}
      {text(260, 126, "pre[4] − pre[1] = 9 − 3 = 6", C.lime, 12)}
    </Frame>
  );
}

function BFSLayers() {
  const nodes: [number, number, number][] = [[70, 75, 0], [180, 40, 1], [180, 110, 1], [300, 30, 2], [300, 80, 2], [300, 125, 2], [420, 75, 3]];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [4, 6], [5, 6]];
  const col = ["#c8ff76", "#8ad8ff", "#ffbd8f", "#f5a6ff"];
  return (
    <Frame label="BFS: qatlam-qatlam kengayadi, shuning uchun eng qisqa yo‘lni beradi">
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={C.line} strokeWidth="1.5" />
      ))}
      {nodes.map(([x, y, d], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="17" fill="#0d1310" stroke={col[d]} strokeWidth="2" />
          {text(x, y + 5, String(d), col[d])}
        </g>
      ))}
      {text(70, 132, "boshlanish", C.mute, 11)}
      {text(420, 132, "masofa 3", C.mute, 11)}
    </Frame>
  );
}

function DPTable() {
  return (
    <Frame label="DP jadvali: har katak o‘zidan oldingi ikkitasidan hisoblanadi">
      {[0, 1, 2, 3].map(r => [0, 1, 2, 3, 4].map(c => (
        <g key={`${r}-${c}`}>
          {cell(120 + c * 62, 20 + r * 30, 56, 26, r === 2 && c === 3 ? "#12261a" : "#0d1310", r === 2 && c === 3 ? "#3f7a44" : C.dim)}
          {text(148 + c * 62, 38 + r * 30, String(r === 0 || c === 0 ? 0 : Math.min(r, c)), r === 2 && c === 3 ? C.lime : C.mute, 12)}
        </g>
      )))}
      <path d="M306 76 L306 96 M244 96 L306 96" stroke={C.warm} strokeWidth="1.5" fill="none" />
      {text(214, 92, "↖ ←", C.warm, 13)}
      {text(60, 78, "holat", C.mute, 12, "start")}
      {text(260, 140, "dp[i][j] = f(dp[i−1][j], dp[i][j−1])", C.lime, 12)}
    </Frame>
  );
}

function StackDiagram() {
  return (
    <Frame label="Stek: oxirgi kirgan birinchi chiqadi">
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          {cell(200, 108 - i * 26, 120, 22, i === 3 ? "#12261a" : "#0d1310", i === 3 ? "#3f7a44" : C.dim)}
          {text(260, 124 - i * 26, ["(", "[", "{", "("][i], i === 3 ? C.lime : C.ink, 12)}
        </g>
      ))}
      <path d="M350 22 L350 46" stroke={C.lime} strokeWidth="2" markerEnd="url(#ar2)" />
      {text(392, 30, "push", C.lime, 12)}
      <path d="M150 46 L150 22" stroke={C.warm} strokeWidth="2" markerEnd="url(#ar3)" />
      {text(118, 30, "pop", C.warm, 12)}
      <defs>
        <marker id="ar2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={C.lime} /></marker>
        <marker id="ar3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={C.warm} /></marker>
      </defs>
    </Frame>
  );
}

function SortDiagram() {
  const before = [5, 2, 8, 1, 9, 3];
  const after = [...before].sort((a, b) => a - b);
  return (
    <Frame label="Saralash: tartibsizlikdan tartibga">
      {before.map((v, i) => (
        <g key={`b${i}`}>
          {cell(40 + i * 74, 20, 64, 28, "#0d1310")}
          {text(72 + i * 74, 39, String(v))}
        </g>
      ))}
      {after.map((v, i) => (
        <g key={`a${i}`}>
          {cell(40 + i * 74, 86, 64, 28, "#12261a", "#3f7a44")}
          {text(72 + i * 74, 105, String(v), C.lime)}
        </g>
      ))}
      {text(260, 70, "O(n log n)", C.mute, 12)}
    </Frame>
  );
}

function TreeDiagram() {
  const nodes: [number, number][] = [[260, 28], [170, 76], [350, 76], [120, 124], [220, 124], [400, 124]];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  return (
    <Frame label="Daraxt: sikli yo‘q bog‘langan graf">
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={C.line} strokeWidth="1.5" />
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="16" fill="#0d1310" stroke={i === 0 ? C.lime : C.line} strokeWidth="2" />
          {text(x, y + 5, String(i + 1), i === 0 ? C.lime : C.ink, 12)}
        </g>
      ))}
      {text(300, 24, "ildiz", C.lime, 11, "start")}
      {text(120, 148, "barg", C.mute, 11)}
    </Frame>
  );
}

function GreedyDiagram() {
  return (
    <Frame label="Ochko‘z tanlov: eng erta tugaydiganini olamiz">
      {[[40, 200, 30, true], [120, 300, 62, false], [230, 420, 94, true]].map(([x, x2, y, keep], i) => (
        <g key={i}>
          <rect x={x as number} y={y as number} width={(x2 as number) - (x as number)} height="22" rx="6"
            fill={keep ? "#12261a" : "#0d1310"} stroke={keep ? "#3f7a44" : C.dim} strokeWidth="1.5" />
          {text(((x as number) + (x2 as number)) / 2, (y as number) + 16, keep ? "olindi" : "tashlandi", keep ? C.lime : C.mute, 11)}
        </g>
      ))}
      <line x1="30" y1="130" x2="490" y2="130" stroke={C.dim} strokeWidth="1.5" />
      {text(260, 146, "vaqt →", C.mute, 11)}
    </Frame>
  );
}


function ArrayScan() {
  return (
    <Frame label="Massivni kezish: bitta sikl, bitta hisoblagich">
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <g key={i}>
          {cell(40 + i * 62, 40, 54, 34, i <= 3 ? "#12261a" : "#0d1310", i <= 3 ? "#3f7a44" : C.dim)}
          {text(67 + i * 62, 62, String([4, 8, 15, 16, 23, 42, 7][i]), i <= 3 ? C.lime : C.ink)}
          {text(67 + i * 62, 96, String(i), C.mute, 11)}
        </g>
      ))}
      <path d="M253 26 L253 10" stroke={C.warm} strokeWidth="2" />
      {text(253, 130, "i — hozirgi pozitsiya", C.warm, 12)}
    </Frame>
  );
}

function ComplexityCurve() {
  return (
    <Frame label="O‘sish tezligi: n katta bo‘lganda farq keskin sezilади">
      <line x1="50" y1="120" x2="480" y2="120" stroke={C.dim} strokeWidth="1.5" />
      <line x1="50" y1="120" x2="50" y2="20" stroke={C.dim} strokeWidth="1.5" />
      <path d="M50 118 L480 110" stroke="#6fd17a" strokeWidth="2.5" fill="none" />
      <path d="M50 118 Q300 96 480 62" stroke={C.cool} strokeWidth="2.5" fill="none" />
      <path d="M50 118 Q330 118 470 24" stroke={C.warm} strokeWidth="2.5" fill="none" />
      {text(452, 104, "O(1)", "#6fd17a", 12, "end")}
      {text(470, 56, "O(n log n)", C.cool, 12, "end")}
      {text(462, 20, "O(n²)", C.warm, 12, "end")}
      {text(265, 138, "n →", C.mute, 11)}
    </Frame>
  );
}

function StringIndex() {
  const w = "ALGORITM".split("");
  return (
    <Frame label="Satr — indekslangan belgilar ketma-ketligi">
      {w.map((ch, i) => (
        <g key={i}>
          {cell(50 + i * 54, 42, 46, 36, i >= 2 && i <= 5 ? "#12261a" : "#0d1310", i >= 2 && i <= 5 ? "#3f7a44" : C.dim)}
          {text(73 + i * 54, 66, ch, i >= 2 && i <= 5 ? C.lime : C.ink)}
          {text(73 + i * 54, 98, String(i), C.mute, 11)}
        </g>
      ))}
      {text(260, 28, "s.substr(2, 4) → \"GORI\"", C.lime, 12)}
      {text(260, 130, "indekslar 0 dan boshlanadi", C.mute, 11)}
    </Frame>
  );
}

function DecisionTree() {
  const nodes: [number, number][] = [[260, 24], [160, 72], [360, 72], [110, 122], [212, 122], [312, 122], [412, 122]];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
  return (
    <Frame label="Qaror daraxti: har tugunda tanlaymiz, keyin orqaga qaytamiz">
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={i === 1 || i === 3 ? C.warm : C.line} strokeWidth={i === 1 || i === 3 ? 2 : 1.5}
          strokeDasharray={i === 1 || i === 3 ? "" : "4 3"} />
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="15" fill="#0d1310" stroke={i === 0 || i === 1 || i === 4 ? C.warm : C.line} strokeWidth="2" />
          {text(x, y + 5, i === 0 ? "?" : String(i), i === 0 || i === 1 || i === 4 ? C.warm : C.mute, 12)}
        </g>
      ))}
      {text(260, 146, "qizil yo‘l — hozirgi urinish, punktir — kesilgan shoxlar", C.mute, 11)}
    </Frame>
  );
}

function Vectors() {
  return (
    <Frame label="Vektor ko‘paytmasi ishorasi burilish tomonini aytadi">
      <line x1="60" y1="120" x2="470" y2="120" stroke={C.dim} strokeWidth="1.5" />
      <line x1="60" y1="120" x2="60" y2="20" stroke={C.dim} strokeWidth="1.5" />
      <path d="M120 100 L280 50" stroke={C.lime} strokeWidth="2.5" />
      <path d="M280 50 L420 92" stroke={C.cool} strokeWidth="2.5" />
      <circle cx="120" cy="100" r="5" fill={C.lime} />
      <circle cx="280" cy="50" r="5" fill={C.lime} />
      <circle cx="420" cy="92" r="5" fill={C.cool} />
      {text(112, 118, "A", C.mute, 12)}
      {text(280, 38, "B", C.mute, 12)}
      {text(432, 106, "C", C.mute, 12)}
      {text(265, 140, "cross(B−A, C−A) < 0 → soat yo‘nalishi", C.lime, 12)}
    </Frame>
  );
}

const BY_KEY: Record<string, () => React.JSX.Element> = {
  "programming-basics": ArrayScan,
  foundations: ComplexityCurve,
  strings: StringIndex,
  backtracking: DecisionTree,
  geometry: Vectors,
  math: ComplexityCurve,
  "binary-search": BinarySearch,
  "two-pointers": TwoPointers,
  "sliding window": SlidingWindow,
  "prefix sum": PrefixSum,
  graphs: BFSLayers,
  bfs: BFSLayers,
  "dynamic-programming": DPTable,
  "data-structures": StackDiagram,
  stack: StackDiagram,
  sorting: SortDiagram,
  trees: TreeDiagram,
  greedy: GreedyDiagram,
};

/** Returns a diagram for a roadmap slug / tag, or null when we have none. */
export function ConceptDiagram({ topic, tag }: { topic: string; tag?: string }) {
  const key = (tag || "").toLowerCase();
  const Chosen = BY_KEY[key] || BY_KEY[topic];
  return Chosen ? <Chosen /> : null;
}

export const hasDiagram = (topic: string, tag?: string) =>
  Boolean(BY_KEY[(tag || "").toLowerCase()] || BY_KEY[topic]);
