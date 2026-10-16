/* Graphs, trees and polygons. Built on GEN_PRELUDE's tree_edges, graph_edges
   and convex, which keep the usual promises: trees are trees, graphs have no
   loops or repeated edges (always valid, even where repeats are allowed), a
   DAG has no cycle, a convex polygon is strictly convex and counter-clockwise.
   Trees come as random (shallow), path (deepest possible — recursion must
   survive it) and star. Sizes are held where a full-size input would pass the
   4 MB input cap or the answer the 1 MB output cap; each such case says so. */

const t = (seed, note, code) => ({ seed, note, code });
const E = (edges) => `"\\n".join(line(e) for e in ${edges})`;
const W = (edges, lo, hi) => `[(a, b, r.int(${lo}, ${hi})) for a, b in ${edges}]`;

/** n, then n−1 tree edges. */
const treeOnly = (n, kinds = ["random", "path", "star"]) =>
  kinds.map((k, i) => t(i + 1, `${k} tree`, `n = ${n}\nreturn str(n) + "\\n" + ${E(`tree_edges(r, n, "${k}")`)}`));
/** n, a line of n values, then n−1 tree edges. */
const treeValues = (n, lo, hi, kinds = ["random", "path"], head = "str(n)") =>
  kinds.map((k, i) => t(i + 1, `${k} tree`, `n = ${n}\nreturn ${head} + "\\n" + line(r.ints(n, ${lo}, ${hi})) + "\\n" + ${E(`tree_edges(r, n, "${k}")`)}`));
/** n m, then m undirected edges. */
const undirected = (n, m, extra = []) => [
  t(1, "random connected", `n, m = ${n}, ${m}\ne = graph_edges(r, n, m)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  t(2, "sparse, many components", `n = ${n}\ne = graph_edges(r, n, n // 2, connected=False)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  t(3, "one long path", `n = ${n}\ne = tree_edges(r, n, "path")\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ...extra,
];
const bipartiteGraph = (n, m, seed, note = "bipartite") => t(seed, note,
  `n, m = ${n}, ${m}\nside = [r.int(0, 1) for _ in range(n + 1)]\nL = [v for v in range(1, n + 1) if side[v] == 0]\nRr = [v for v in range(1, n + 1) if side[v] == 1]\nseen = set()\ne = []\nwhile len(e) < m:\n    a, b = r.choice(L), r.choice(Rr)\n    if (a, b) not in seen:\n        seen.add((a, b))\n        e.append((a, b) if r.int(0, 1) else (b, a))\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`);
/** A DAG whose hidden order starts at 1 and ends at n, so paths from 1 to n exist. */
const dag1n = (n, m) => `order = [1] + r.shuffle(list(range(2, ${n}))) + [${n}]\nseen = set()\ne = []\nfor i in range(1, ${n}):\n    e.append((order[r.int(0, i - 1)], order[i]))\n    seen.add(e[-1])\nwhile len(e) < ${m}:\n    i, j = r.int(0, ${n} - 1), r.int(0, ${n} - 1)\n    if i < j and (order[i], order[j]) not in seen:\n        seen.add((order[i], order[j]))\n        e.append((order[i], order[j]))\ne = r.shuffle(e)`;
const polygon = (k, head = "str(len(p))") => `p = convex(${k})\ns = r.int(0, len(p) - 1)\np = p[s:] + p[:s]\nout = ${head} + "\\n" + "\\n".join(line(v) for v in p)`;

export default {
  "components-count": { tests: undirected(100000, 200000) },
  "tree-leaf-count": { tests: treeOnly(100000) },
  "bfs-levels": { tests: undirected(100000, 200000) },
  "cycle-detect-undirected": { tests: [
    t(1, "a tree: no cycle", `n = 100000\ne = tree_edges(r, n)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "random: cycles", `n = 100000\ne = graph_edges(r, n, 200000)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(3, "a forest", `n = 100000\ne = graph_edges(r, n, 0, connected=False) + tree_edges(r, n // 2, "path")\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "topological-possible": { tests: [
    t(1, "a DAG", `n = 100000\ne = graph_edges(r, n, 200000, dag=True)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "a DAG plus one edge closing a long cycle", `n = 100000\ne = [(i, i + 1) for i in range(1, n)] + [(n, 1)]\nreturn line([n, len(e)]) + "\\n" + ${E("r.shuffle(e)")}`),
  ] },
  "bipartite-check": { tests: [
    bipartiteGraph(100000, 200000, 1),
    t(2, "random: an odd cycle somewhere", `n = 100000\ne = graph_edges(r, n, 200000)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "tree-subtree-sizes": { tests: treeOnly(100000) },
  "tree-diameter": { tests: treeOnly(100000) },
  // m = 1.5·10^5 weighted edges keep the input under 4 MB.
  "dijkstra-shortest": { tests: [
    t(1, "random weighted", `n = 100000\ne = ${W("graph_edges(r, n, 150000)", 1, "10**9")}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "a long path of heavy edges", `n = 100000\ne = ${W("tree_edges(r, n, 'path')", "10**9", "10**9")}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "mst-weight": { tests: [
    t(1, "random weighted", `n = 100000\ne = ${W("graph_edges(r, n, 150000)", 1, "10**9")}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "few distinct weights", `n = 100000\ne = ${W("graph_edges(r, n, 150000)", 1, 3)}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "tree-height": { tests: treeOnly(100000) },
  "polygon-area2": { tests: [
    t(1, "convex, 10^5 vertices", `${polygon(25000)}\nreturn out`),
  ] },
  "tree-centroid": { tests: treeOnly(100000) },
  "graph-degree-max": { tests: undirected(100000, 200000) },
  "graph-weight-total": { tests: [
    t(1, "heaviest", `n = 100000\ne = ${W("graph_edges(r, n, 150000)", "10**9", "10**9")}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "graph-count-edges-tree": { tests: undirected(100000, 200000, [
    t(4, "exactly a tree", `n = 100000\ne = tree_edges(r, n)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ]) },
  "graph-indegree-zero": { tests: [
    t(1, "random directed", `n = 100000\ne = graph_edges(r, n, 200000, directed=True, connected=False)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "a DAG", `n = 100000\ne = graph_edges(r, n, 200000, dag=True)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "graph-farthest": { tests: undirected(100000, 200000) },
  "graph-bfs-bipartite-sides": { tests: [
    bipartiteGraph(100000, 200000, 1),
    t(2, "a long path", `n = 100000\ne = tree_edges(r, n, "path")\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  // n = 5·10^4: every distance is printed.
  "dijkstra-all-dist": { tests: [
    t(1, "random weighted", `n = 50000\ne = ${W("graph_edges(r, n, 100000)", 1, "10**9")}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "disconnected", `n = 50000\ne = ${W("graph_edges(r, n, 30000, connected=False)", 1, "10**9")}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "geo-perimeter": { tests: [
    t(1, "convex, 5·10^4 vertices", `${polygon(12500)}\nreturn out`),
  ] },
  // n = 6·10^4: a parent and a depth are printed per node.
  "tree-parent-depth": { tests: treeOnly(60000, ["random", "path"]) },
  "tree-count-paths-len2": { tests: treeOnly(100000) },
  // n = 5·10^4: a subtree sum is printed per node.
  "tree-sum-subtree": { tests: treeValues(50000, "-10**9", "10**9") },
  "tree-is-balanced": { tests: treeOnly(100000, ["random", "binary", "path"]) },
  // m = 2.5·10^5 rather than 4·10^5 keeps the input under 4 MB.
  "scc-count": { tests: [
    t(1, "random directed", `n = 200000\ne = graph_edges(r, n, 250000, directed=True, connected=False)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "one big cycle", `n = 200000\np = r.perm(n)\ne = [(p[i], p[(i + 1) % n]) for i in range(n)]\nreturn line([n, len(e)]) + "\\n" + ${E("r.shuffle(e)")}`),
    t(3, "a DAG: every vertex its own component", `n = 200000\ne = graph_edges(r, n, 250000, dag=True)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "bridges-count": { tests: [
    t(1, "random", `n = 200000\ne = graph_edges(r, n, 250000, connected=False)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "a path: every edge a bridge", `n = 200000\ne = tree_edges(r, n, "path")\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "articulation-count": { tests: [
    t(1, "random", `n = 200000\ne = graph_edges(r, n, 250000, connected=False)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "a path", `n = 200000\ne = tree_edges(r, n, "path")\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "zero-one-bfs": { tests: [
    t(1, "random 0/1 weights", `n = 200000\ne = ${W("graph_edges(r, n, 200000)", 0, 1)}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  // n = 1.5·10^5 and q = 10^5: the edges and queries together stay under 4 MB.
  "lca-binary-lifting": { tests: ["random", "path"].map((k, i) => t(i + 1, `${k} tree`,
    `n, q = 150000, 100000\ne = tree_edges(r, n, "${k}")\nqs = [line(r.ints(2, 1, n)) for _ in range(q)]\nreturn line([n, q]) + "\\n" + ${E("e")} + "\\n" + "\\n".join(qs)`)) },
  "euler-tour-subtree-sum": { tests: ["random", "path"].map((k, i) => t(i + 1, `${k} tree`,
    `n, q = 100000, 50000\ne = tree_edges(r, n, "${k}")\nqs = [line([1, r.int(1, n), r.int(-10**9, 10**9)]) if r.int(0, 1) else line([2, r.int(1, n)]) for _ in range(q)]\nreturn line([n, q]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + ${E("e")} + "\\n" + "\\n".join(qs)`)) },
  // n = 1.2·10^5: the weights and edges together stay under 4 MB.
  "tree-dp-independent-set": { tests: treeValues(120000, "-10**9", "10**9") },
  // n = 7·10^4: a distance sum is printed per vertex.
  "tree-rerooting-distances": { tests: treeOnly(70000) },
  "floyd-all-pairs": { tests: [
    t(1, "n = 250: the reference O(n³) needs most of the limit at 400 without -O2", `n, m, q = 250, 50000, 100000\ne = ${W("graph_edges(r, n, m, directed=True, connected=False)", 0, "10**6")}\nqs = [line(r.ints(2, 1, n)) for _ in range(q)]\nreturn line([n, len(e), q]) + "\\n" + ${E("e")} + "\\n" + "\\n".join(qs)`),
  ] },
  "bellman-negative-cycle": { tests: [
    t(1, "random signed weights", `n = 2000\ne = ${W("graph_edges(r, n, 10000, directed=True)", "-10**6", "10**6")}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "non-negative: no cycle to find", `n = 2000\ne = ${W("graph_edges(r, n, 10000, directed=True)", 0, "10**6")}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(3, "negative weights on a DAG: no cycle", `n = 2000\ne = ${W("graph_edges(r, n, 10000, dag=True)", "-10**6", "10**6")}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "bipartite-matching-kuhn": { tests: [
    t(1, "1000 × 1000, 10^5 edges", `n = m = 1000\nseen = set()\ne = []\nwhile len(e) < 100000:\n    a, b = r.int(1, n), r.int(1, m)\n    if (a, b) not in seen:\n        seen.add((a, b))\n        e.append((a, b))\nreturn line([n, m, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "minimax-path": { tests: [
    t(1, "random weighted", `n = 100000\ne = ${W("graph_edges(r, n, 150000)", 1, "10**9")}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "dijkstra-count-paths": { tests: [
    t(1, "small weights: many equal shortest paths", `n = 100000\ne = ${W("graph_edges(r, n, 150000)", 1, 3)}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "a ladder: the count doubles at every rung", `k = 50000\ne = []\nfor i in range(1, k):\n    a, b = 2 * i - 1, 2 * i\n    e += [(a, a + 2, 1), (a, b + 2, 1), (b, a + 2, 1), (b, b + 2, 1)]\nreturn line([2 * k, len(e)]) + "\\n" + ${E("r.shuffle(e)")}`),
  ] },
  "point-in-convex-polygon": { tests: [
    t(1, "5·10^4 vertices, 10^5 queries", `${polygon(12500)}\nq = 100000\nqs = []\nfor _ in range(q):\n    if r.int(0, 3) == 0:\n        qs.append(line(r.choice(p)))\n    else:\n        qs.append(line([r.int(-13000, 13000), r.int(-2 * 10**8, 2 * 10**8)]))\nreturn out + "\\n" + str(q) + "\\n" + "\\n".join(qs)`),
  ] },
  "picks-theorem-interior": { tests: [
    t(1, "convex, coordinates up to 10^6", `${polygon(1000)}\nreturn out`),
  ] },
  "subtree-distinct-colors": { tests: treeValues(100000, 1, 50).concat([
    t(3, "path, many colours", `n = 100000\nreturn str(n) + "\\n" + line(r.ints(n, 1, 10**9)) + "\\n" + ${E(`tree_edges(r, n, "path")`)}`),
  ]) },
  // n = 10^5: the reference decomposition sorts depth lists at every level and
  // needed half the limit at 2·10^5 without -O2; a BFS from every vertex is
  // still 10^10 steps here.
  "centroid-paths-within-k": { tests: [
    t(1, "random tree", `n = 100000\nreturn line([n, r.int(0, 50)]) + "\\n" + ${E(`tree_edges(r, n)`)}`),
    t(2, "path, k = n / 2", `n = 100000\nreturn line([n, n // 2]) + "\\n" + ${E(`tree_edges(r, n, "path")`)}`),
  ] },
  "dinic-max-flow": { tests: [
    t(1, "500 vertices, 10^4 edges", `n = 500\ne = ${W("graph_edges(r, n, 10000, directed=True)", 1, "10**9")}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  // q = 10^5: each answer is printed.
  "tree-kth-ancestor": { tests: [
    t(1, "random parents", `n, q = 200000, 100000\npar = [r.int(1, i) for i in range(1, n)]\nqs = [line([r.int(1, n), r.int(0, 30)]) for _ in range(q)]\nreturn line([n, q]) + "\\n" + line(par) + "\\n" + "\\n".join(qs)`),
    t(2, "a chain, deep questions", `n, q = 200000, 100000\npar = list(range(1, n))\nqs = [line([r.int(1, n), r.int(0, n)]) for _ in range(q)]\nreturn line([n, q]) + "\\n" + line(par) + "\\n" + "\\n".join(qs)`),
  ] },
  // n = 10^5: every vertex is printed.
  "tree-level-order": { tests: treeOnly(100000) },
  // n = 1.5·10^5 weighted edges keep the input under 4 MB.
  "tree-diameter-weighted": { tests: ["random", "path", "star"].map((k, i) => t(i + 1, `${k} tree`,
    `n = 150000\nreturn str(n) + "\\n" + ${E(W(`tree_edges(r, n, "${k}")`, 1, "10**9"))}`)) },
  "tree-path-sum-exists": { tests: [
    t(1, "random S (−10^9 ≤ S ≤ 10^18)", `n = 100000\nreturn line([n, r.int(-10**9, 10**18)]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + ${E("tree_edges(r, n)")}`),
    t(2, "S is a real root-to-leaf sum", `n = 100000\nval = r.ints(n, -10**9, 10**9)\ne = tree_edges(r, n)\nadj = [[] for _ in range(n + 1)]\nfor a, b in e:\n    adj[a].append(b)\n    adj[b].append(a)\ndist = [None] * (n + 1)\ndist[1] = val[0]\nst = [1]\nleaves = []\nwhile st:\n    v = st.pop()\n    kids = 0\n    for u in adj[v]:\n        if dist[u] is None:\n            dist[u] = dist[v] + val[u - 1]\n            st.append(u)\n            kids += 1\n    if kids == 0 and v != 1:\n        leaves.append(v)\nok = [v for v in leaves if dist[v] >= -10**9] or [None]
S = dist[r.choice(ok)] if ok[0] else 0
return line([n, S]) + "\\n" + line(val) + "\\n" + ${E("e")}`),
  ] },
  "tree-count-depth-k": { tests: [
    t(1, "random tree, small k", `n = 100000\nreturn line([n, r.int(0, 20)]) + "\\n" + ${E("tree_edges(r, n)")}`),
    t(2, "path, k = n / 2", `n = 100000\nreturn line([n, n // 2]) + "\\n" + ${E(`tree_edges(r, n, "path")`)}`),
  ] },
  "graph-eulerian-path": { tests: [
    t(1, "random", `n = 100000\ne = graph_edges(r, n, 200000)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "one long cycle: an Eulerian path exists", `n = 100000\np = r.perm(n)\ne = [(p[i], p[(i + 1) % n]) for i in range(n)]\nreturn line([n, len(e)]) + "\\n" + ${E("r.shuffle(e)")}`),
  ] },
  "graph-count-components-size-k": { tests: [
    t(1, "sparse, random k", `n = 100000\ne = graph_edges(r, n, 60000, connected=False)\nreturn line([n, len(e), r.int(1, 5)]) + "\\n" + ${E("e")}`),
  ] },
  "tree-dp-max-matching": { tests: treeOnly(100000) },
  // m = 1.2·10^5: a component count is printed after every removal.
  "dsu-offline-connectivity": { tests: [
    t(1, "random edges", `n = 100000\ne = graph_edges(r, n, 120000, connected=False)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "count-paths-dag-mod": { tests: [
    t(1, "a DAG from 1 to n", `n, m = 100000, 200000\n${dag1n(100000, 200000)}\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "layers: astronomically many paths", `k = 1000\nw = 100\nn = k * w\nnode = lambda i, j: i * w + j + 1\ne = []\nfor i in range(k - 1):\n    for j in range(w):\n        e.append((node(i, j), node(i + 1, j)))\n        e.append((node(i, j), node(i + 1, (j + 1) % w)))\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
  ] },
  "tree-sum-distances-root": { tests: treeOnly(100000) },
  "tree-count-even-subtrees": { tests: treeOnly(100000) },
  "graph-count-connected-pairs": { tests: undirected(100000, 200000) },
  "tree-count-centroids": { tests: treeOnly(100000) },
  "tree-max-path-sum-any": { tests: treeValues(100000, "-10**9", "10**9") },
  "graph-longest-path-dag": { tests: [
    t(1, "random DAG", `n = 100000\ne = graph_edges(r, n, 200000, dag=True)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "one long chain", `n = 100000\np = r.perm(n)\ne = [(p[i], p[i + 1]) for i in range(n - 1)]\nreturn line([n, len(e)]) + "\\n" + ${E("r.shuffle(e)")}`),
  ] },
  "tree-remove-edges-even-components": { tests: treeOnly(100000) },
  // n = 10^5: a distance is printed per vertex.
  "tree-reroot-max-distance": { tests: treeOnly(100000) },
  "tree-count-vertices-at-even-depth": { tests: treeOnly(200000) },
  "graph-topo-count-fixed-order": { tests: [
    t(1, "random DAG", `n = 100000\ne = graph_edges(r, n, 200000, dag=True)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "a chain: exactly one order", `n = 100000\np = r.perm(n)\ne = [(p[i], p[i + 1]) for i in range(n - 1)]\nreturn line([n, len(e)]) + "\\n" + ${E("r.shuffle(e)")}`),
  ] },
  // q = 7·10^4: each answer is printed.
  "tree-max-edge-on-path-queries": { tests: ["random", "path"].map((k, i) => t(i + 1, `${k} tree`,
    `n, q = 100000, 70000\ne = ${W(`tree_edges(r, n, "${k}")`, 1, "10**9")}\nqs = [line(r.ints(2, 1, n)) for _ in range(q)]\nreturn line([n, q]) + "\\n" + ${E("e")} + "\\n" + "\\n".join(qs)`)) },
  "graph-count-paths-fixed-length-dag": { tests: [
    t(1, "random DAG, k = 100", `n = 100000\ne = graph_edges(r, n, 200000, dag=True)\nreturn line([n, len(e), 100]) + "\\n" + ${E("e")}`),
  ] },
  "tree-count-leaves-per-depth-max": { tests: treeOnly(200000) },
  "tree-deepest-level-sum": { tests: treeValues(100000, "-10**9", "10**9") },
  // n = 10^5: the whole order is printed.
  // n = 10^5: the whole order is printed.
  "topo-lexicographic": { tests: [
    t(1, "random DAG", `n = 100000\ne = graph_edges(r, n, 200000, dag=True)\nreturn line([n, len(e)]) + "\\n" + ${E("e")}`),
    t(2, "no edges", `return "100000 0"`),
  ] },
};
