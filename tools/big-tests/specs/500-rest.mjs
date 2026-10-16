/* The last hand-written group: operation sequences (stacks, queues, segment
   trees, order statistics), pairs of sorted arrays, word lists and the other
   layouts the drafter does not read. Every generator keeps its statement's
   promises — a pop never meets an empty stack, a removal names a value that is
   present, debts sum to zero, points are distinct where they must be. Sizes are
   held where the input would pass 4 MB or the answer 1 MB; each says so. */

const t = (seed, note, code) => ({ seed, note, code });
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const q = JSON.stringify;
const sortedVals = (n, lo, hi) => `sorted(r.ints(${n}, ${lo}, ${hi}))`;
const increasing = (n, lo, step) => `[${lo} + s for s in __import__("itertools").accumulate(r.ints(${n}, 1, ${step}))]`;
/** q range queries "l r" over 1..n. */
const ranges = (qn, n) => `[line([l, r.int(l, ${n})]) for l in r.ints(${qn}, 1, ${n})]`;

export default {
  // q = 6·10^4: every sum is printed.
  "prefix-queries": { tests: [
    t(1, "random ranges", `n, qn = 100000, 60000\nreturn line([n, qn]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + "\\n".join(${ranges("qn", "n")})`),
  ] },
  "sparse-min": { tests: [
    t(1, "random ranges", `n, qn = 100000, 70000\nreturn line([n, qn]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + "\\n".join(${ranges("qn", "n")})`),
  ] },
  "sparse-max-queries": { tests: [
    t(1, "random ranges", `n, qn = 200000, 80000\nreturn line([n, qn]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + "\\n".join(${ranges("qn", "n")})`),
  ] },
  "bs-count-in-range-queries": { tests: [
    t(1, "random value ranges", `n = qn = 100000\nqs = []\nfor _ in range(qn):\n    l = r.int(-10**9, 10**9)\n    qs.append(line([l, r.int(l, 10**9)]))\nreturn line([n, qn]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + "\\n".join(qs)`),
  ] },
  "prefix-count-less-than": { tests: [
    t(1, "random", `n = qn = 100000\nreturn line([n, qn]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + "\\n".join(map(str, r.ints(qn, -10**9, 10**9)))`),
  ] },
  "adv-offline-range-distinct-count": { tests: [
    t(1, "few distinct values", `n, qn = 200000, 150000\nreturn line([n, qn]) + "\\n" + line(r.ints(n, 1, 1000)) + "\\n" + "\\n".join(${ranges("qn", "n")})`),
  ] },

  "queue-simulation": { tests: [
    t(1, "pushes and pops, never from an empty queue", `qn = 100000\nops = []\nsize = 0\nfor _ in range(qn):\n    if size and r.int(0, 2) == 0:\n        ops.append("2")\n        size -= 1\n    else:\n        ops.append(line([1, r.int(-10**9, 10**9)]))\n        size += 1\nreturn str(qn) + "\\n" + "\\n".join(ops)`),
  ] },
  "stack-min-tracking": { tests: [
    t(1, "push, pop and minimum; never on an empty stack", `qn = 200000\nops = []\nsize = 0\nfor _ in range(qn):\n    k = r.int(0, 3)\n    if size and k == 0:\n        ops.append("2")\n        size -= 1\n    elif size and k == 1:\n        ops.append("3")\n    else:\n        ops.append(line([1, r.int(-10**9, 10**9)]))\n        size += 1\nreturn str(qn) + "\\n" + "\\n".join(ops)`),
  ] },
  "queue-from-two-stacks": { tests: [
    t(1, "pushes and removals; never from an empty queue", `qn = 200000\nops = []\nsize = 0\nfor _ in range(qn):\n    if size and r.int(0, 2) == 0:\n        ops.append("2")\n        size -= 1\n    else:\n        ops.append(line([1, r.int(-10**9, 10**9)]))\n        size += 1\nreturn str(qn) + "\\n" + "\\n".join(ops)`),
  ] },
  "fenwick-kth-element": { tests: [
    t(1, "inserts, removals of present values, k-th queries", `qn = 200000\nops = []\nbag = []\nfor _ in range(qn):\n    k = r.int(0, 3)\n    if bag and k == 0:\n        i = r.int(0, len(bag) - 1)\n        bag[i], bag[-1] = bag[-1], bag[i]\n        ops.append(line([2, bag.pop()]))\n    elif bag and k == 1:\n        ops.append(line([3, r.int(1, len(bag))]))\n    else:\n        x = r.int(1, 10**6)\n        bag.append(x)\n        ops.append(line([1, x]))\nreturn str(qn) + "\\n" + "\\n".join(ops)`),
  ] },
  // n = q = 1.2·10^5: the array and the operations together stay under 4 MB.
  "segtree-point-max": { tests: [
    t(1, "updates and range maxima", `n = qn = 120000\nops = [line([1, r.int(1, n), r.int(-10**9, 10**9)]) if r.int(0, 1) else "2 " + x for x in ${ranges("qn", "n")}]\nreturn line([n, qn]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + "\\n".join(ops)`),
  ] },
  // n = q = 10^5: the array and the operations together stay under 4 MB.
  "segtree-lazy-range-add": { tests: [
    t(1, "range adds and range sums", `n, qn = 100000, 100000\nops = []\nfor x in ${ranges("qn", "n")}:\n    ops.append("1 " + x + " " + str(r.int(-10**9, 10**9)) if r.int(0, 1) else "2 " + x)\nreturn line([n, qn]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + "\\n".join(ops)`),
  ] },
  // q = 6·10^4: the reference needs a third of the limit at 10^5.
  "segtree-range-assign-sum": { tests: [
    t(1, "range assignments and range sums", `n, qn = 200000, 60000\nops = []\nfor x in ${ranges("qn", "n")}:\n    ops.append("1 " + x + " " + str(r.int(0, 10**9)) if r.int(0, 1) else "2 " + x)\nreturn line([n, qn]) + "\\n" + "\\n".join(ops)`),
  ] },
  // n = q = 1.2·10^5: the array and the operations together stay under 4 MB.
  "segtree-range-min-queries": { tests: [
    t(1, "updates and range minima", `n, qn = 120000, 120000\nops = [line([1, r.int(1, n), r.int(-10**9, 10**9)]) if r.int(0, 1) else "2 " + x for x in ${ranges("qn", "n")}]\nreturn line([n, qn]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + "\\n".join(ops)`),
  ] },
  "sqrt-decomp-range-sum": { tests: [
    t(1, "updates and range sums", `n = qn = 100000\nops = [line([1, r.int(1, n), r.int(-10**9, 10**9)]) if r.int(0, 1) else "2 " + x for x in ${ranges("qn", "n")}]\nreturn line([n, qn]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + "\\n".join(ops)`),
  ] },

  // 700 × 700: a 1000 × 1000 grid of numbers up to 10^4 is a 5 MB input.
  "min-path-sum": { tests: [
    t(1, "700 × 700", `n = 700\nreturn line([n, n]) + "\\n" + "\\n".join(line(r.ints(n, 0, 10**4)) for _ in range(n))`),
  ] },
  "matrix-max-line-sum": { tests: [
    t(1, "500 × 500", `n = 500\nreturn line([n, n]) + "\\n" + "\\n".join(line(r.ints(n, -10**6, 10**6)) for _ in range(n))`),
  ] },
  "grid-count-rectangles-ones": { tests: [
    t(1, "500 × 500, 10^5 rectangles", `n, qn = 500, 100000\ngrid = [text(r, n, "01") for _ in range(n)]\nqs = []\nfor _ in range(qn):\n    a, b = r.int(1, n), r.int(1, n)\n    qs.append(line([a, b, r.int(a, n), r.int(b, n)]))\nreturn line([n, n, qn]) + "\\n" + "\\n".join(grid) + "\\n" + "\\n".join(qs)`),
  ] },
  "bitmask-assignment": { tests: [
    t(1, "18 workers", `n = 18\nreturn str(n) + "\\n" + "\\n".join(line(r.ints(n, 0, 10**6)) for _ in range(n))`),
  ] },
  "bitmask-min-cost-cover": { tests: [
    t(1, "18 skills, 100 courses", `n, m = 18, 100\nreturn line([n, m]) + "\\n" + "\\n".join(str(r.int(1, 10**6)) + " " + text(r, n, "0001") for _ in range(m))`),
  ] },

  "sort-by-length": { tests: [
    t(1, "10^5 short words", `n = 100000\nreturn str(n) + "\\n" + "\\n".join(text(r, r.int(1, 8), ${q(LOWER)}) for _ in range(n))`),
  ] },
  // 8·10^4 words from three letters, so groups are large.
  "sort-anagram-group": { tests: [
    t(1, "many anagrams", `n = 80000\nreturn str(n) + "\\n" + "\\n".join(text(r, r.int(1, 6), "abc") for _ in range(n))`),
  ] },
  "str-longest-common-prefix": { tests: [
    t(1, "a shared prefix", `n = 100000\np = text(r, 5, ${q(LOWER)})\nreturn str(n) + "\\n" + "\\n".join(p + text(r, r.int(0, 5), ${q(LOWER)}) for _ in range(n))`),
    t(2, "nothing shared", `n = 100000\nreturn str(n) + "\\n" + "\\n".join(text(r, r.int(1, 8), ${q(LOWER)}) for _ in range(n))`),
  ] },
  // 3·10^4 words of up to 60 letters keep the input under 1 MB.
  "count-words-with-prefix": { tests: [
    t(1, "mixed case", `n = 30000\nA = ${q(LOWER + LOWER.toUpperCase())}\nreturn str(n) + " " + r.choice(A) + "\\n" + "\\n".join(text(r, r.int(1, 60), A) for _ in range(n))`),
  ] },
  "str-most-frequent-word": { tests: [
    t(1, "10^5 words, few distinct", `n = 100000\npool = [text(r, r.int(1, 6), ${q(LOWER)}) for _ in range(30)]\nreturn str(n) + "\\n" + "\\n".join(r.choice(pool) for _ in range(n))`),
  ] },
  "str-longest-word-chain-prefix": { tests: [
    t(1, "10^4 words", `n = 10000\nreturn str(n) + "\\n" + "\\n".join("ab" + text(r, r.int(0, 98), "abc") for _ in range(n)) + "\\n" + "ab" + text(r, 3, "abc")`),
  ] },
  "str-count-words-length-k": { tests: [
    t(1, "spaces and words", `parts = [text(r, r.int(1, 8), ${q(LOWER)}) for _ in range(15000)]\nline_ = " ".join(p + " " * r.int(0, 1) for p in parts)[:99999]\nreturn str(r.int(1, 8)) + "\\n" + line_.strip()`),
  ] },
  "str-alternating-case-check": { tests: [
    t(1, "alternating", `n = 100000\nreturn "".join(("a" if i % 2 else "B") for i in range(n))`),
    t(2, "random case", `return text(r, 100000, ${q(LOWER + LOWER.toUpperCase())})`),
  ] },
  "min-window-substring": { tests: [
    t(1, "three letters", `return text(r, 200000, "abc") + "\\n" + text(r, 50, "abc")`),
    t(2, "long pattern", `return text(r, 200000, ${q(LOWER)}) + "\\n" + text(r, 2000, ${q(LOWER)})`),
  ] },
  "str-is-subsequence": { tests: [
    t(1, "a subsequence", `tt = text(r, 200000, ${q(LOWER)})\ns = "".join(c for c in tt if r.int(0, 1))\nreturn s + "\\n" + tt`),
    t(2, "random", `return text(r, 1000, "ab") + "\\n" + text(r, 200000, "ab")`),
  ] },

  // n = 1·10^5: a rank is printed per score.
  "sort-relative-ranks": { tests: [
    t(1, "distinct scores", `n = 100000\nreturn str(n) + "\\n" + line(r.shuffle(${increasing("n", "-10**9", "10000")}))`),
  ] },
  "sort-min-swaps": { tests: [
    t(1, "distinct, random order", `n = 100000\nreturn str(n) + "\\n" + line(r.shuffle(${increasing("n", "-10**9", "10000")}))`),
    t(2, "reversed", `n = 100000\nreturn str(n) + "\\n" + line(range(n, 0, -1))`),
  ] },
  "sum-multiples-two": { tests: [
    t(1, "random", `return line([r.int(1, 10**12), r.int(1, 10**6), r.int(1, 10**6)])`),
    t(2, "largest, small divisors", `return line([10**12, 1, 2])`),
  ] },
  // n = m = 4·10^4 over a narrow range: the union and intersection are printed.
  "set-union-intersection": { tests: [
    t(1, "overlapping lists with repeats", `n = m = 40000\nreturn line([n, m]) + "\\n" + line(r.ints(n, -30000, 30000)) + "\\n" + line(r.ints(m, -30000, 30000))`),
  ] },
  "greedy-max-units-boxes": { tests: [
    t(1, "random", `n = 100000\nreturn line([n, r.int(1, 10**9)]) + "\\n" + "\\n".join(line([r.int(1, 10**4), r.int(1, 10**4)]) for _ in range(n))`),
  ] },
  "two-pointers-count-common": { tests: [
    t(1, "two sorted arrays with repeats", `n = m = 100000\nreturn line([n, m]) + "\\n" + line(${sortedVals("n", "-50000", "50000")}) + "\\n" + line(${sortedVals("m", "-50000", "50000")})`),
  ] },
  "bs-median-two-sorted": { tests: [
    t(1, "two sorted arrays", `n = m = 100000\nreturn line([n, m]) + "\\n" + line(${sortedVals("n", "-10**9", "10**9")}) + "\\n" + line(${sortedVals("m", "-10**9", "10**9")})`),
    t(2, "uneven sizes", `n, m = 1, 100000\nreturn line([n, m]) + "\\n" + line(${sortedVals("n", "-10**9", "10**9")}) + "\\n" + line(${sortedVals("m", "-10**9", "10**9")})`),
  ] },
  // k = 7·10^4: every sum is printed.
  "heap-kth-smallest-pair-sum": { tests: [
    t(1, "two sorted arrays", `n = m = 100000\nreturn line([n, m, 70000]) + "\\n" + line(${sortedVals("n", "-10**9", "10**9")}) + "\\n" + line(${sortedVals("m", "-10**9", "10**9")})`),
  ] },
  "bs-min-speed-finish": { tests: [
    t(1, "random", `n = 100000\nreturn line([n, r.int(n, 10**9)]) + "\\n" + line(r.ints(n, 1, 10**9))`),
    t(2, "H = n", `n = 100000\nreturn line([n, n]) + "\\n" + line(r.ints(n, 1, 10**9))`),
  ] },
  "array-is-rotated-sorted": { tests: [
    t(1, "a rotated sorted array", `n = 100000\na = ${sortedVals("n", "-10**9", "10**9")}\nk = r.int(0, n - 1)\nreturn str(n) + "\\n" + line(a[k:] + a[:k])`),
    t(2, "random", `n = 100000\nreturn str(n) + "\\n" + line(r.ints(n, -10**9, 10**9))`),
    t(3, "sorted with duplicates", `n = 100000\nreturn str(n) + "\\n" + line(${sortedVals("n", "1", "100")})`),
  ] },
  "geo-max-points-line": { tests: [
    t(1, "distinct points, many on a few lines", `pts = set()\nwhile len(pts) < 1000:\n    if r.int(0, 1):\n        x = r.int(-1000, 1000)\n        pts.add((x, 2 * x + 7))\n    else:\n        pts.add((r.int(-10**6, 10**6), r.int(-10**6, 10**6)))\nreturn "1000\\n" + "\\n".join(line(p) for p in r.shuffle(sorted(pts)))`),
  ] },
  "sort-min-pair-diff-sum": { tests: [
    t(1, "even n", `n = 100000\nreturn str(n) + "\\n" + line(r.ints(n, -10**9, 10**9))`),
  ] },
  "bs-kth-missing-positive": { tests: [
    t(1, "strictly increasing", `n = 100000\nreturn line([n, r.int(1, 10**9)]) + "\\n" + line(${increasing("n", "0", "5000")})`),
    t(2, "dense from 1", `n = 100000\nreturn line([n, 10**9]) + "\\n" + line(range(1, n + 1))`),
  ] },
  "graph-shortest-path-one-free-edge": { tests: [
    t(1, "random roads", `n = 100000\ne = [(a, b, r.int(1, 10**9)) for a, b in graph_edges(r, n, 150000)]\nreturn line([n, len(e)]) + "\\n" + "\\n".join(line(x) for x in e)`),
  ] },
  "graph-functional-longest-cycle": { tests: [
    t(1, "random function", `n = 200000\nreturn str(n) + "\\n" + line(r.ints(n, 1, n))`),
    t(2, "one cycle through everything", `n = 200000\np = r.perm(n)\nf = [0] * (n + 1)\nfor i in range(n):\n    f[p[i]] = p[(i + 1) % n]\nreturn str(n) + "\\n" + line(f[1:])`),
  ] },
  "adv-kth-smallest-subarray-sum": { tests: [
    t(1, "random k", `n = 100000\nreturn line([n, r.int(1, n * (n + 1) // 2)]) + "\\n" + line(r.ints(n, 0, 10**9))`),
  ] },
  "greedy-min-coins-cancel-debts": { tests: [
    t(1, "accounts summing to zero", `n = 100000\nh = r.ints(n // 2, -10**9, 10**9)\nreturn str(n) + "\\n" + line(r.shuffle(h + [-x for x in h]))`),
  ] },
  "dp-max-sum-k-non-adjacent-pairs": { tests: [
    t(1, "random", `n = 100000\nreturn str(n) + "\\n" + line(r.ints(n, -10**9, 10**9))`),
  ] },
  "bs-min-max-adjacent-after-inserts": { tests: [
    t(1, "strictly increasing markers", `n = 100000\nreturn line([n, r.int(0, 100000)]) + "\\n" + line(${increasing("n", "0", "5000")})`),
  ] },
  "adv-count-subarrays-bounded-max": { tests: [
    t(1, "random", `n = 100000\nL = r.int(-10**9, 10**9)\nreturn line([n, L, r.int(L, 10**9)]) + "\\n" + line(r.ints(n, -10**9, 10**9))`),
  ] },
  "dsu-earliest-all-connected": { tests: [
    t(1, "random times", `n = 100000\ne = [(a, b, r.int(1, 10**9)) for a, b in graph_edges(r, n, 150000)]\nreturn line([n, len(e)]) + "\\n" + "\\n".join(line(x) for x in e)`),
  ] },
  "array-count-sign-changes": { tests: [
    t(1, "non-zero values", `n = 100000\nreturn str(n) + "\\n" + line(r.int(1, 10**9) * (1 if r.int(0, 1) else -1) for _ in range(n))`),
  ] },
  "adv-min-cost-assign-two-groups": { tests: [
    t(1, "6·10^4 pairs of candidates", `n = 60000\nreturn str(n) + "\\n" + "\\n".join(line(r.ints(2, 0, 10**9)) for _ in range(2 * n))`),
  ] },
  "greedy-min-platforms-meetings": { tests: [
    t(1, "short meetings", `n = 100000\nrows = []\nfor _ in range(n):\n    s = r.int(0, 10**9 - 1)\n    rows.append(line([s, r.int(s + 1, min(10**9, s + 10**6))]))\nreturn str(n) + "\\n" + "\\n".join(rows)`),
  ] },
  "dp-longest-chain-of-pairs": { tests: [
    t(1, "short pairs", `n = 100000\nrows = []\nfor _ in range(n):\n    a = r.int(-10**9, 10**9 - 1)\n    rows.append(line([a, r.int(a + 1, min(10**9, a + 10**5))]))\nreturn str(n) + "\\n" + "\\n".join(rows)`),
  ] },
  "dp-weighted-interval-schedule": { tests: [
    t(1, "short jobs", `n = 100000\nrows = []\nfor _ in range(n):\n    s = r.int(0, 10**9 - 1)\n    rows.append(line([s, r.int(s + 1, min(10**9, s + 10**5)), r.int(1, 10**9)]))\nreturn str(n) + "\\n" + "\\n".join(rows)`),
  ] },
  "adv-count-subarrays-sum-divisible": { tests: [
    t(1, "random", `n = 100000\nreturn line([n, r.int(1, 10**5)]) + "\\n" + line(r.ints(n, -10**9, 10**9))`),
  ] },
  "greedy-min-refills-to-reach": { tests: [
    // The goal sits within one tank of the last station, so the trip is possible.
    t(1, "many stations", `n = 100000\nx = ${increasing("n", "0", "9000")}\nk = r.int(10000, 10**6)\nreturn line([n, x[-1] + r.int(1, k), k]) + "\\n" + line(x)`),
  ] },
  "geo-count-axis-right-triangles": { tests: [
    t(1, "distinct points on a small grid: long rows and columns", `pts = set()\nwhile len(pts) < 100000:\n    pts.add((r.int(0, 399), r.int(0, 399)))\nreturn "100000\\n" + "\\n".join(line(p) for p in r.shuffle(sorted(pts)))`),
  ] },
  /* Written here so the drafter's "every value at its maximum" test is not
     used: at n = f = 500, s = 10^5 even the best O(n·s) solution needs about
     half the limit when compiled without -O2. 250 dice still rule out
     anything that loops over the faces. */
  "dp-count-dice-sums": { tests: [
    t(1, "250 dice, 500 faces, sum 10^5", `return "250 500 100000"`),
    t(2, "random sum", `return line([250, 500, r.int(250, 100000)])`),
  ] },
  "greedy-max-content-children": { tests: [
    t(1, "random", `n = m = 100000\nreturn line([n, m]) + "\\n" + line(r.ints(n, 1, 10**9)) + "\\n" + line(r.ints(m, 1, 10**9))`),
  ] },
};
