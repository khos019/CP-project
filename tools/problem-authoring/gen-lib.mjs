/* Small random inputs for batch files, and the brute-force cross-check.
 *
 * A batch entry may carry
 *   gen(r)    -> one small random input (a string), built from the seeded r
 *   brute     -> an obviously correct brute force for small inputs (body);
 *                crosscheck.mjs compares the reference with it (else slow[0])
 *   slow: []  -> correct but slow solutions (bodies, like `sol`); without a
 *                brute, slow[0] is what crosscheck.mjs compares against;
 *                tools/big-tests/specs/600-batch-521.mjs requires every one
 *                of them to fail a max-size test.
 *   big: []   -> max-size generated tests for tools/big-tests ({seed, note, code}).
 *
 * The generator (generate.mjs) ignores all three. */

export function rng(seed) {
  let s = BigInt(seed) * 0x9e3779b97f4a7c15n + 1n;
  const M = (1n << 64n) - 1n;
  s &= M;
  if (s === 0n) s = 1n;
  const next = () => {
    s ^= s >> 12n; s ^= (s << 25n) & M; s ^= s >> 27n;
    return Number(((s * 0x2545f4914f6cdd1dn) & M) >> 11n);
  };
  const r = {
    int: (lo, hi) => lo + (next() % (hi - lo + 1)),
    ints: (n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi)),
    pick: (a) => a[r.int(0, a.length - 1)],
    shuffle: (a) => { for (let i = a.length - 1; i > 0; i--) { const j = r.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    perm: (n) => r.shuffle(Array.from({ length: n }, (_, i) => i + 1)),
    str: (n, abc) => Array.from({ length: n }, () => abc[r.int(0, abc.length - 1)]).join(""),
    /** A random tree on 1..n as [a, b] pairs. */
    tree: (n) => { const p = r.perm(n); const e = []; for (let i = 1; i < n; i++) { const a = p[i], b = p[r.int(0, i - 1)]; e.push(r.int(0, 1) ? [a, b] : [b, a]); } return r.shuffle(e); },
  };
  return r;
}

export const line = (xs) => xs.join(" ");

/** k random inputs from gen, seeds base..base+k-1. */
export const many = (gen, k, base = 1) => Array.from({ length: k }, (_, i) => gen(rng(base * 1000 + i)));
