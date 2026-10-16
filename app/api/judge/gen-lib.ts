/* Large tests, generated where they run.
 *
 * Until 2026-10-16 every hidden test in the bank was under 1 KB — the largest
 * input of a "n ≤ 10^5" problem was a handful of numbers — so an O(n²)
 * solution passed anything (two were found that day: water-container and
 * stack-longest-valid-parens). Writing max-size inputs into tests.ts is not an
 * option: a few hundred megabyte-sized inputs would not fit a Worker, and
 * building them per request would blow the Worker's CPU budget.
 *
 * So a large test is stored as a few lines of Python and a seed. The batch
 * runner (judge-batch.ts) builds the input inside the Judge0 sandbox just
 * before running the program, and compares the program's output with the
 * SHA-256 of the reference solution's output, computed offline by
 * tools/big-tests. Nothing larger than the generator crosses the network.
 *
 * The generator must produce byte-identical input in the sandbox (Python 3.8)
 * and on the machine that computed the hash (whatever Python it has), so it
 * never touches the `random` module: R below is a self-contained xorshift64*
 * whose every step is integer arithmetic masked to 64 bits.
 *
 * Shared by the runner and by tools/big-tests/build.mjs — change it and every
 * stored hash is wrong until the tool is re-run. */

export const GEN_PRELUDE = String.raw`
M64 = (1 << 64) - 1
class R:
    def __init__(self, seed):
        self.s = ((seed + 1) * 0x9E3779B97F4A7C15) & M64 or 1
    def next(self):
        x = self.s
        x ^= x >> 12
        x ^= (x << 25) & M64
        x ^= x >> 27
        self.s = x
        return (x * 0x2545F4914F6CDD1D) & M64
    def int(self, lo, hi):
        return lo + self.next() % (hi - lo + 1)
    def ints(self, n, lo, hi):
        return [lo + self.next() % (hi - lo + 1) for _ in range(n)]
    def shuffle(self, a):
        for i in range(len(a) - 1, 0, -1):
            j = self.next() % (i + 1)
            a[i], a[j] = a[j], a[i]
        return a
    def choice(self, a):
        return a[self.next() % len(a)]
    def perm(self, n, start=1):
        return self.shuffle(list(range(start, start + n)))

def line(xs):
    return " ".join(map(str, xs))

def text(r, n, alphabet):
    # Eight characters per 64-bit draw: a million-letter string in a fraction
    # of a second even on the sandbox's Python. (Appended to the prelude after
    # the first hashes were stored; R itself is unchanged, so they still hold.)
    out = []
    k = len(alphabet)
    while len(out) < n:
        x = r.next()
        for _ in range(8):
            out.append(alphabet[(x & 255) % k])
            x >>= 8
    return "".join(out[:n])

def tree_edges(r, n, kind="random", root_one=False):
    # A tree on 1..n as (a, b) pairs, labels and edge order shuffled.
    # random: each vertex hangs off an earlier one (shallow, ~log n deep);
    # path: one chain (as deep as a tree gets); star; binary.
    par = [0, 0]
    for i in range(2, n + 1):
        if kind == "path":
            par.append(i - 1)
        elif kind == "star":
            par.append(1)
        elif kind == "binary":
            par.append(i // 2)
        else:
            par.append(r.int(1, i - 1))
    lab = [0] + ([1] + r.shuffle(list(range(2, n + 1))) if root_one else r.perm(n))
    edges = []
    for i in range(2, n + 1):
        a, b = lab[i], lab[par[i]]
        edges.append((a, b) if r.int(0, 1) else (b, a))
    return r.shuffle(edges)

def graph_edges(r, n, m, directed=False, dag=False, connected=True):
    # m distinct edges, no loops; connected (a spanning tree first) when asked
    # and when m allows; for a DAG every edge runs forward in a hidden order.
    order = r.perm(n)
    seen = set()
    edges = []
    def add(a, b):
        key = (a, b) if directed or dag else (min(a, b), max(a, b))
        if a == b or key in seen:
            return False
        seen.add(key)
        edges.append((a, b))
        return True
    if connected:
        for i in range(1, n):
            j = r.int(0, i - 1)
            a, b = order[j], order[i]
            if not (directed or dag) and r.int(0, 1):
                a, b = b, a
            add(a, b)
    limit = n * (n - 1) // (1 if directed and not dag else 2)
    m = min(m, limit)
    while len(edges) < m:
        i, j = r.int(0, n - 1), r.int(0, n - 1)
        if dag:
            if i == j:
                continue
            i, j = min(i, j), max(i, j)
        add(order[i], order[j])
    return r.shuffle(edges)

def convex(k):
    # A strictly convex lattice polygon, counter-clockwise: the arc
    # y = x² − k² from x = −k to k, then y = k² − x² back. 4k vertices.
    low = [(x, x * x - k * k) for x in range(-k, k + 1)]
    high = [(x, k * k - x * x) for x in range(k - 1, -k, -1)]
    return low + high

def build(code, seed):
    env = {"R": R, "line": line, "text": text, "tree_edges": tree_edges, "graph_edges": graph_edges, "convex": convex}
    exec("def gen(r):\n" + "\n".join("    " + l for l in code.split("\n")), env)
    out = env["gen"](R(seed))
    return out if out.endswith("\n") else out + "\n"
`;

/** One generated test: Python body of `def gen(r)` returning the input text,
 *  its seed, and the SHA-256 (hex) of the reference output after Judge0's
 *  strip() — every line right-trimmed, then the whole. */
export type GeneratedTest = { code: string; seed: number; sha: string };
