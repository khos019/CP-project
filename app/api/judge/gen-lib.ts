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

def build(code, seed):
    env = {"R": R, "line": line}
    exec("def gen(r):\n" + "\n".join("    " + l for l in code.split("\n")), env)
    out = env["gen"](R(seed))
    return out if out.endswith("\n") else out + "\n"
`;

/** One generated test: Python body of `def gen(r)` returning the input text,
 *  its seed, and the SHA-256 (hex) of the reference output after Judge0's
 *  strip() — every line right-trimmed, then the whole. */
export type GeneratedTest = { code: string; seed: number; sha: string };
