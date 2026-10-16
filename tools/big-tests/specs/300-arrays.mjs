/* Array problems whose input carries a promise the drafter will not guess at
   (sorted, distinct, 0/1, rotated, unimodal, several arrays, queries). Each
   generator keeps the statement's promise; where the full size would pass the
   sandbox's 4 MB input or 1 MB output cap, n is held lower but stays far past
   where a quadratic solution stops (noted per problem). */

const t = (seed, note, code) => ({ seed, note, code });
// Python building blocks.
const sortedVals = (n, lo, hi) => `sorted(r.ints(${n}, ${lo}, ${hi}))`;
/** n distinct increasing values from lo, steps of 1..step (stays ≤ lo + n·step). */
const increasing = (n, lo, step) => `[${lo} + s for s in __import__("itertools").accumulate(r.ints(${n}, 1, ${step}))]`;

export default {
  "first-not-less": { tests: [
    t(1, "random sorted", `n = 100000\na = ${sortedVals("n", "-10**9", "10**9")}\nreturn line([n, r.int(-10**9, 10**9)]) + "\\n" + line(a)`),
    t(2, "all equal, x equal to them", `n = 100000\nreturn line([n, 7]) + "\\n" + line([7] * n)`),
    t(3, "x above everything", `n = 100000\na = ${sortedVals("n", "-10**9", "10**9 - 1")}\nreturn line([n, 10**9]) + "\\n" + line(a)`),
  ] },
  "remove-duplicates-sorted": { tests: [
    t(1, "many duplicates", `n = 100000\nreturn line([n]) + "\\n" + line(${sortedVals("n", "-500", "500")})`),
    t(2, "all distinct (values kept short so the output fits)", `n = 100000\nreturn line([n]) + "\\n" + line(range(-50000, 50000))`),
  ] },
  "peak-element": { tests: [
    t(1, "random, no equal neighbours", `n = 100000\na = [r.int(-10**9, 10**9)]\nwhile len(a) < n:\n    x = r.int(-10**9, 10**9)\n    if x != a[-1]:\n        a.append(x)\nreturn line([n]) + "\\n" + line(a)`),
    t(2, "strictly increasing: the peak is last", `n = 100000\nreturn line([n]) + "\\n" + line(range(1, n + 1))`),
    t(3, "strictly decreasing: the peak is first", `n = 100000\nreturn line([n]) + "\\n" + line(range(n, 0, -1))`),
  ] },
  "two-pointer-closest": { tests: [
    t(1, "random sorted", `n = 100000\nreturn line([n, r.int(-10**9, 10**9)]) + "\\n" + line(${sortedVals("n", "-10**9", "10**9")})`),
    t(2, "target far outside", `n = 100000\nreturn line([n, 10**9]) + "\\n" + line(${sortedVals("n", "-10**9", "0")})`),
  ] },
  "dsu-queries": { tests: [
    t(1, "random merges and questions", `n = q = 100000\nops = [line([r.int(1, 2), r.int(1, n), r.int(1, n)]) for _ in range(q)]\nreturn line([n, q]) + "\\n" + "\\n".join(ops)`),
    t(2, "a long chain, then questions", `n = q = 100000\nops = [line([1, i, i + 1]) for i in range(1, q // 2 + 1)] + [line([2, 1, r.int(1, n)]) for _ in range(q - q // 2)]\nreturn line([n, q]) + "\\n" + "\\n".join(ops)`),
  ] },
  "knapsack-01": { tests: [
    t(1, "largest size", `n, W = 100, 10**4\nreturn line([n, W]) + "\\n" + "\\n".join(line([r.int(1, 10**4), r.int(1, 10**4)]) for _ in range(n))`),
    t(2, "light items", `n, W = 100, 10**4\nreturn line([n, W]) + "\\n" + "\\n".join(line([r.int(1, 300), r.int(1, 10**4)]) for _ in range(n))`),
  ] },
  // n = m = 50000: the merged output of 2·10^5 values would pass the 1 MB cap.
  "merge-sort-manual": { tests: [
    t(1, "two sorted arrays", `n = m = 50000\nreturn line([n, m]) + "\\n" + line(${sortedVals("n", "-99999", "99999")}) + "\\n" + line(${sortedVals("m", "-99999", "99999")})`),
  ] },
  // n = 30000: every student is printed back.
  "bucket-by-key": { tests: [
    t(1, "distinct identifiers, few scores", `n = 30000\nids = r.shuffle(list(range(1, n + 1)))\nreturn line([n]) + "\\n" + "\\n".join(line([i * 33331 % (10**9) + 1, r.int(0, 100)]) for i in ids)`),
  ] },
  "bs-min-capacity": { tests: [
    t(1, "random", `n = 100000\nreturn line([n, r.int(1, n)]) + "\\n" + line(r.ints(n, 1, 10**4))`),
    t(2, "one day", `n = 100000\nreturn line([n, 1]) + "\\n" + line(r.ints(n, 1, 10**4))`),
  ] },
  "array-index-query": { tests: [
    t(1, "random positions", `n = q = 100000\nreturn line([n, q]) + "\\n" + line(r.ints(n, -99999, 99999)) + "\\n" + "\\n".join(str(r.int(1, n)) for _ in range(q))`),
  ] },
  "bit-fenwick-sum": { tests: [
    t(1, "mixed updates and sums", `n = q = 100000\nops = []\nfor _ in range(q):\n    if r.int(0, 1):\n        ops.append(line([1, r.int(1, n), r.int(-10**9, 10**9)]))\n    else:\n        l = r.int(1, n)\n        ops.append(line([2, l, r.int(l, n)]))\nreturn line([n, q]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + "\\n".join(ops)`),
    t(2, "whole-array sums", `n = q = 100000\nops = [line([2, 1, n]) if i % 2 else line([1, r.int(1, n), 10**9]) for i in range(q)]\nreturn line([n, q]) + "\\n" + line([10**9] * n) + "\\n" + "\\n".join(ops)`),
  ] },
  "bs-first-bad": { tests: [
    t(1, "boundary at random", `n = 100000\nk = r.int(1, n)\nreturn line([n]) + "\\n" + line([0] * (k - 1) + [1] * (n - k + 1))`),
    t(2, "only the last is bad", `n = 100000\nreturn line([n]) + "\\n" + line([0] * (n - 1) + [1])`),
    t(3, "all bad", `n = 100000\nreturn line([n]) + "\\n" + line([1] * n)`),
  ] },
  "sort-kth-smallest": { tests: [
    t(1, "random", `n = q = 100000\nreturn line([n, q]) + "\\n" + line(r.ints(n, -99999, 99999)) + "\\n" + "\\n".join(str(r.int(1, n)) for _ in range(q))`),
  ] },
  "greedy-max-pairs": { tests: [
    t(1, "random", `n = m = 100000\nreturn line([n, m]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + line(r.ints(m, -10**9, 10**9))`),
    t(2, "small values: many ties", `n = m = 100000\nreturn line([n, m]) + "\\n" + line(r.ints(n, 1, 50)) + "\\n" + line(r.ints(m, 1, 50))`),
  ] },
  "bs-count-occurrences": { tests: [
    t(1, "value present many times", `n = 100000\na = ${sortedVals("n", "1", "20")}\nreturn line([n, 7]) + "\\n" + line(a)`),
    t(2, "value absent", `n = 100000\na = ${sortedVals("n", "-10**9", "10**9")}\nreturn line([n, 10**9 + 0 if 10**9 not in a else -10**9]) + "\\n" + line(a)`),
  ] },
  "sort-relative-order": { tests: [
    t(1, "random", `n, m = 40000, 1000\no = r.shuffle(list(range(1, 2001)))[:m]\nreturn line([n, m]) + "\\n" + line(r.ints(n, 1, 3000)) + "\\n" + line(o)`),
  ] },
  "bs-rotated-min": { tests: [
    t(1, "random rotation", `n = 100000\na = ${increasing("n", "-10**9", "10000")}\nk = r.int(0, n - 1)\nreturn line([n]) + "\\n" + line(a[k:] + a[:k])`),
    t(2, "not rotated", `n = 100000\nreturn line([n]) + "\\n" + line(${increasing("n", "-10**9", "10000")})`),
  ] },
  // The peak sits strictly inside: the statement has the array rise to it and fall after it.
  "bs-peak-ternary": { tests: [
    t(1, "peak at random", `n = 100000
p = r.int(2, n - 1)
up = ${increasing("p", "-10**9", "5000")}
down = [up[-1] - s for s in __import__("itertools").accumulate(r.ints(n - p, 1, 5000))]
return line([n]) + "\\n" + line(up + down)`),
    t(2, "peak second", `n = 100000
return line([n]) + "\\n" + line([1, n + 1] + list(range(n, 2, -1)))`),
  ] },
  // q = 10^5: each answer is printed, and 2·10^5 of them would pass the 1 MB cap.
  "sparse-table-rmq": { tests: [
    t(1, "random ranges", `n, q = 200000, 100000\nqs = []\nfor _ in range(q):\n    l = r.int(1, n)\n    qs.append(line([l, r.int(l, n)]))\nreturn line([n, q]) + "\\n" + line(r.ints(n, -99999, 99999)) + "\\n" + "\\n".join(qs)`),
    t(2, "wide ranges", `n, q = 200000, 100000\nqs = [line([r.int(1, 100), r.int(n - 100, n)]) for _ in range(q)]\nreturn line([n, q]) + "\\n" + line(r.ints(n, -99999, 99999)) + "\\n" + "\\n".join(qs)`),
  ] },
  "trie-max-xor": { tests: [
    t(1, "random", `n = 200000\nreturn line([n]) + "\\n" + line(r.ints(n, 0, 2**30 - 1))`),
    t(2, "all equal", `n = 200000\nreturn line([n]) + "\\n" + line([12345] * n)`),
  ] },
  "tsp-bitmask": { tests: [
    t(1, "13 cities", `n = 13\nrows = [line([0 if i == j else r.int(0, 10**6) for j in range(n)]) for i in range(n)]\nreturn line([n]) + "\\n" + "\\n".join(rows)`),
  ] },
  "count-coprime-pairs": { tests: [
    t(1, "random", `n = 200000\nreturn line([n]) + "\\n" + line(r.ints(n, 1, 10**6))`),
    t(2, "small values, many repeats", `n = 200000\nreturn line([n]) + "\\n" + line(r.ints(n, 1, 30))`),
  ] },
  "grundy-subtraction-game": { tests: [
    t(1, "largest", `n, k = 100000, 100\nS = r.shuffle(list(range(1, 10**4 + 1)))[:k]\nreturn line([n, k]) + "\\n" + line(S) + "\\n" + line(r.ints(n, 0, 10**4))`),
  ] },
  "convex-hull-trick-dp": { tests: [
    t(1, "random heights", `n = 200000\nreturn line([n, r.int(0, 10**9)]) + "\\n" + line(${increasing("n", "0", "5000")})`),
    t(2, "no fixed cost", `n = 200000\nreturn line([n, 0]) + "\\n" + line(${increasing("n", "0", "5000")})`),
  ] },
  "divide-conquer-dp-split": { tests: [
    t(1, "largest", `n = 2000\nreturn line([n, r.int(1, n)]) + "\\n" + line(r.ints(n, 0, 10**6))`),
    t(2, "many parts", `n = 2000\nreturn line([n, 1000]) + "\\n" + line(r.ints(n, 0, 10**6))`),
  ] },
  "slope-trick-nondecreasing": { tests: [
    t(1, "random", `n = 200000\nreturn line([n]) + "\\n" + line(r.ints(n, -10**9, 10**9))`),
    t(2, "decreasing", `n = 200000\nreturn line([n]) + "\\n" + line(sorted(r.ints(n, -10**9, 10**9), reverse=True))`),
  ] },
  // 35000 + 35000 coefficients: the product's 70000 coefficients fit the
  // output cap, and a schoolbook product is still 1.2·10^9 multiplications.
  "ntt-polynomial-multiply": { tests: [
    t(1, "random coefficients", `n = m = 35000\nreturn line([n, m]) + "\\n" + line(r.ints(n, 0, 998244352)) + "\\n" + line(r.ints(m, 0, 998244352))`),
  ] },
  // n = q = 5·10^4: full size is a 4.5 MB input and a 3 MB answer.
  "diff-array-range-add": { tests: [
    t(1, "random ranges", `n = q = 50000\nops = []\nfor _ in range(q):\n    l = r.int(1, n)\n    ops.append(line([l, r.int(l, n), r.int(-10**9, 10**9)]))\nreturn line([n, q]) + "\\n" + "\\n".join(ops)`),
    t(2, "every range the whole array", `n = q = 50000\nreturn line([n, q]) + "\\n" + "\\n".join(line([1, n, 10**9]) for _ in range(q))`),
  ] },
  // 700 × 700 entries of one digit and 10^5 queries keep the input under 3 MB;
  // summing each rectangle directly is still ~10^10 operations.
  "prefix-sum-2d": { tests: [
    t(1, "random rectangles", `n = m = 700\nq = 100000\ngrid = [line(r.ints(m, -9, 9)) for _ in range(n)]\nqs = []\nfor _ in range(q):\n    a, b = r.int(1, n), r.int(1, m)\n    qs.append(line([a, b, r.int(a, n), r.int(b, m)]))\nreturn line([n, m, q]) + "\\n" + "\\n".join(grid) + "\\n" + "\\n".join(qs)`),
  ] },
  "sliding-window-min": { tests: [
    t(1, "random k", `n = 100000\nreturn line([n, r.int(1, n)]) + "\\n" + line(r.ints(n, -99999, 99999))`),
    t(2, "k = n / 2, increasing", `n = 100000\nreturn line([n, n // 2]) + "\\n" + line(range(-50000, 50000))`),
  ] },
  "longest-k-distinct": { tests: [
    t(1, "few distinct values", `n = 200000\nreturn line([n, r.int(1, 20)]) + "\\n" + line(r.ints(n, 1, 50))`),
    t(2, "random", `n = 200000\nreturn line([n, r.int(1, n)]) + "\\n" + line(r.ints(n, 1, 10**9))`),
  ] },
  "job-deadline-profit": { tests: [
    t(1, "random", `n = 200000\nreturn line([n]) + "\\n" + "\\n".join(line([r.int(1, n), r.int(1, 10**9)]) for _ in range(n))`),
    t(2, "tight deadlines", `n = 200000\nreturn line([n]) + "\\n" + "\\n".join(line([r.int(1, 100), r.int(1, 10**9)]) for _ in range(n))`),
  ] },
  // n = 3·10^4: the answer is every number written out, and the reference
  // comparator sort needs a third of the limit beyond that.
  "largest-concatenation": { tests: [
    t(1, "random", `n = 30000\nreturn line([n]) + "\\n" + line(r.ints(n, 0, 10**9))`),
    t(2, "prefix-related values", `n = 30000\nreturn line([n]) + "\\n" + line(r.choice([3, 30, 34, 303, 3030, 9, 98, 989]) for _ in range(n))`),
    t(3, "all zero", `n = 30000\nreturn line([n]) + "\\n" + line([0] * n)`),
  ] },
  "ternary-search-lines": { tests: [
    t(1, "random lines", `n = 100000\nL = r.int(-10**9, 0)\nreturn line([n, L, r.int(L, 10**9)]) + "\\n" + "\\n".join(line(r.ints(2, -10**6, 10**6)) for _ in range(n))`),
  ] },
  "max-min-spacing": { tests: [
    t(1, "random distinct", `n = 200000\nc = r.shuffle(${increasing("n", "0", "5000")})\nreturn line([n, r.int(2, n)]) + "\\n" + line(c)`),
    t(2, "k = n", `n = 200000\nc = r.shuffle(${increasing("n", "0", "5000")})\nreturn line([n, n]) + "\\n" + line(c)`),
  ] },
  // n = 6·10^4: every square is printed.
  "sorted-squares": { tests: [
    t(1, "negatives and positives", `n = 60000\nreturn line([n]) + "\\n" + line(${sortedVals("n", "-99999", "99999")})`),
  ] },
  "min-swaps-group-ones": { tests: [
    t(1, "random", `n = 200000\nreturn line([n]) + "\\n" + line(r.ints(n, 0, 1))`),
    t(2, "alternating", `n = 200000\nreturn line([n]) + "\\n" + line([i % 2 for i in range(n)])`),
  ] },
  "longest-ones-k-flips": { tests: [
    t(1, "random", `n = 200000\nreturn line([n, r.int(0, n)]) + "\\n" + line(r.ints(n, 0, 1))`),
    t(2, "mostly zeros, small k", `n = 200000\nreturn line([n, 50]) + "\\n" + line([1 if r.int(0, 9) == 0 else 0 for _ in range(n)])`),
  ] },
  "bs-ship-capacity": { tests: [
    t(1, "random", `n = 200000\nreturn line([n, r.int(1, n)]) + "\\n" + line(r.ints(n, 1, 10**9))`),
    t(2, "one day", `n = 200000\nreturn line([n, 1]) + "\\n" + line(r.ints(n, 1, 10**9))`),
  ] },
  // 300 × 300 and 5·10^4 queries: rows and columns strictly increasing as R_i + C_j.
  "bs-matrix-search": { tests: [
    t(1, "random queries", `n = m = 300\nq = 50000\nR = ${increasing("n", "-10**8", "1000")}\nC = ${increasing("m", "0", "1000")}\ngrid = [line([R[i] + C[j] for j in range(m)]) for i in range(n)]\nqs = [str(R[r.int(0, n - 1)] + C[r.int(0, m - 1)] + r.int(-1, 1)) for _ in range(q)]\nreturn line([n, m, q]) + "\\n" + "\\n".join(grid) + "\\n" + "\\n".join(qs)`),
  ] },
  "greedy-min-refuel": { tests: [
    t(1, "many stations", `n = 200000\nd = 10**9\np = sorted(r.shuffle(list(range(1000, 1000 + 4 * n, 4))))\nreturn line([d, r.int(10**6 + 1, 10**7), n]) + "\\n" + "\\n".join(line([x * 1000 + 1, r.int(1, 10**9)]) for x in p)`),
  ] },
  "greedy-task-cooldown": { tests: [
    t(1, "every kind, longest cooldown", `return line([26, 100]) + "\\n" + line(r.ints(26, 1, 10**6))`),
  ] },
  "greedy-boat-pairs": { tests: [
    t(1, "random", `n = 200000\nlim = r.int(1, 10**9)\nreturn line([n, lim]) + "\\n" + line(r.ints(n, 1, lim))`),
    t(2, "all at the limit", `n = 200000\nreturn line([n, 10**9]) + "\\n" + line([10**9] * n)`),
  ] },
  "greedy-lemonade-change": { tests: [
    t(1, "mostly fives", `n = 200000\nreturn line([n]) + "\\n" + line(r.choice([5, 5, 5, 10, 20]) for _ in range(n))`),
    t(2, "random", `n = 200000\nreturn line([n]) + "\\n" + line(r.choice([5, 10, 20]) for _ in range(n))`),
  ] },
};
