/* String problems, written by hand from each statement (draft.mjs leaves
   string input alone). The usual set for one string over an alphabet is
   random / one letter / period 2 / a short random block repeated: the last
   three are what quadratic scans, naive period and border searches and
   centre expansion choke on. */

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const q = JSON.stringify;

/** One line holding one string of length n over `alpha`. */
function single(n, alpha = LOWER, extra = []) {
  return [
    { seed: 1, note: "random", code: `return text(r, ${n}, ${q(alpha)})` },
    { seed: 2, note: "one letter", code: `return ${q(alpha[0])} * ${n}` },
    { seed: 3, note: "period 2", code: `return (${q(alpha.slice(0, 2))} * ${n})[:${n}]` },
    { seed: 4, note: "short random block repeated", code: `b = text(r, r.int(2, 9), ${q(alpha)})\nreturn (b * (${n} // len(b) + 1))[:${n}]` },
    ...extra,
  ];
}
const palindrome = (n, alpha = LOWER, seed = 5) =>
  ({ seed, note: "a palindrome", code: `h = text(r, ${Math.floor(n / 2)}, ${q(alpha)})\nreturn h + h[::-1]` });
/** Two lines, each one string. */
const two = (seed, note, code) => ({ seed, note, code });

/** A correct bracket sequence of length n over the given pairs, as a random walk. */
const balanced = (n, pairs, seed, note = "random correct sequence") => ({
  seed, note,
  code: `n = ${n}\nP = ${q(pairs)}\nout = []\nst = []\nfor i in range(n):\n    left = n - i\n    if st and (len(st) == left or r.int(0, 1)):\n        out.append(st.pop())\n    else:\n        k = r.int(0, len(P) // 2 - 1)\n        out.append(P[2 * k])\n        st.append(P[2 * k + 1])\nreturn "".join(out)`,
});

const words = (count, maxLen, seed, note, sep = `" "`) => ({
  seed, note,
  code: `return ${sep}.join(text(r, r.int(1, ${maxLen}), ${q(LOWER)}) for _ in range(${count}))`,
});

export default {
  "vowel-count": { tests: single(100000) },
  "palindrome-word": { tests: single(100000, LOWER, [palindrome(100000)]) },
  "char-frequency": { tests: single(100000) },
  "run-length": { tests: single(100000) },
  "longest-distinct": { tests: single(100000) },
  "distinct-substrings-small": { tests: single(300) },
  "longest-palindrome-sub": { tests: single(2000, LOWER, [palindrome(2000)]) },
  "string-upper": { tests: single(100000) },
  "string-min-period": { tests: single(1000000) },
  // Every border is printed; one letter repeated has |s|−1 of them, so the
  // length is held where that list still fits the output cap.
  "string-all-borders": { tests: single(120000) },
  "manacher-longest-pal": { tests: single(1000000, LOWER, [palindrome(1000000)]) },
  "count-palindromic-substrings": { tests: single(1000000) },
  // 6·10^4 rather than the allowed 2·10^5: on periodic input the reference
  // suffix array needs a third of the limit even at 10^5. A quadratic
  // comparison of suffixes is still 3.6·10^9 steps here.
  "suffix-array-lrs": { tests: single(60000) },
  "z-function-sum": { tests: single(1000000) },
  "string-first-unique": { tests: single(100000) },
  "stack-remove-adjacent-equal": { tests: single(100000, LOWER, [palindrome(100000)]) },
  "string-count-distinct-rotations": { tests: single(100000) },
  "string-remove-vowels": { tests: single(100000) },
  "count-good-substrings-mod": { tests: single(100000, "abcdefghij") },
  "dp-min-deletions-palindrome": { tests: single(1000, LOWER, [palindrome(1000)]) },
  "dp-min-palindrome-cuts": { tests: single(1000, LOWER, [palindrome(1000)]) },
  "string-smallest-rotation": { tests: single(100000) },
  "str-count-adjacent-equal": { tests: single(100000) },
  "str-can-form-palindrome": { tests: single(100000, LOWER, [palindrome(100000)]) },
  "str-count-same-end-substrings": { tests: single(100000) },
  "greedy-min-deletions-unique-freq": { tests: single(100000) },
  "str-min-append-palindrome": { tests: single(100000, LOWER, [palindrome(100000)]) },
  "str-shortest-repeating-unit": { tests: single(100000) },
  "str-min-deletions-sorted": { tests: single(100000) },
  "adv-count-distinct-subsequences": { tests: single(100000) },
  // 5·10^4: the reference hash search needed half the limit at 10^5.
  "adv-longest-repeated-substring-hash": { tests: single(50000) },
  "count-letter-case": { tests: single(100000, LOWER + LOWER.toUpperCase()) },
  "string-swap-case": { tests: single(200000, LOWER + LOWER.toUpperCase() + "0123456789") },
  "prefix-longest-balanced-zero-one": { tests: single(100000, "01") },
  "dp-count-decodings": { tests: [
    { seed: 1, note: "random digits, no zero", code: `return text(r, 100000, "123456789")` },
    { seed: 2, note: "only 1s and 2s: every split is valid", code: `return text(r, 100000, "12")` },
    { seed: 3, note: "all ones", code: `return "1" * 100000` },
    { seed: 4, note: "tens with zeros in valid places", code: `return "10" * 50000` },
  ] },

  "balanced-brackets": { tests: [
    balanced(100000, "()[]{}", 1),
    { seed: 2, note: "random, almost surely broken", code: `return text(r, 100000, "()[]{}")` },
    { seed: 3, note: "deep nesting", code: `return "([{" * 16666 + "}])" * 16666` },
  ] },
  "bracket-depth": { tests: [
    balanced(100000, "()", 1),
    { seed: 2, note: "one deep nest", code: `return "(" * 50000 + ")" * 50000` },
    { seed: 3, note: "flat", code: `return "()" * 50000` },
  ] },
  "greedy-min-swaps-balance-brackets": { tests: [
    { seed: 1, note: "random with equal counts", code: `a = list("[" * 50000 + "]" * 50000)\nr.shuffle(a)\nreturn "".join(a)` },
    { seed: 2, note: "all closings first", code: `return "]" * 50000 + "[" * 50000` },
  ] },

  "anagram-check": { tests: [
    two(1, "an anagram", `a = text(r, 100000, ${q(LOWER)})\nb = list(a)\nr.shuffle(b)\nreturn a + "\\n" + "".join(b)`),
    two(2, "random, not an anagram", `return text(r, 100000, ${q(LOWER)}) + "\\n" + text(r, 100000, ${q(LOWER)})`),
  ] },
  "string-rotation": { tests: [
    two(1, "a rotation, worst for a naive rotate-and-compare", `n = 100000\ns = "a" * (n - 1) + "b"\nreturn s + "\\n" + s[n // 2:] + s[:n // 2]`),
    two(2, "not a rotation", `n = 100000\nreturn "a" * (n - 1) + "b" + "\\n" + "a" * (n - 2) + "bb"`),
    two(3, "random rotation", `s = text(r, 100000, ${q(LOWER)})\nk = r.int(0, 99999)\nreturn s + "\\n" + s[k:] + s[:k]`),
  ] },
  "substring-occurrences": { tests: [
    two(1, "one letter: a naive match is |s|·|p|", `return "a" * 100000 + "\\n" + "a" * 50000`),
    two(2, "near-miss pattern", `return "a" * 100000 + "\\n" + "a" * 49999 + "b"`),
    two(3, "random over two letters", `return text(r, 100000, "ab") + "\\n" + text(r, 8, "ab")`),
  ] },
  "lcs-length": { tests: [
    two(1, "random", `return text(r, 2000, ${q(LOWER)}) + "\\n" + text(r, 2000, ${q(LOWER)})`),
    two(2, "two letters", `return text(r, 2000, "ab") + "\\n" + text(r, 2000, "ab")`),
  ] },
  "edit-distance": { tests: [
    two(1, "random", `return text(r, 2000, ${q(LOWER)}) + "\\n" + text(r, 2000, ${q(LOWER)})`),
    two(2, "one empty", `return text(r, 2000, ${q(LOWER)}) + "\\n"`),
  ] },
  "longest-common-substring": { tests: [
    two(1, "random over two letters", `return text(r, 2000, "ab") + "\\n" + text(r, 2000, "ab")`),
    two(2, "identical", `s = text(r, 2000, ${q(LOWER)})\nreturn s + "\\n" + s`),
  ] },
  "hamming-distance": { tests: [
    two(1, "random", `return text(r, 100000, ${q(LOWER)}) + "\\n" + text(r, 100000, ${q(LOWER)})`),
    two(2, "identical", `s = text(r, 100000, ${q(LOWER)})\nreturn s + "\\n" + s`),
  ] },
  "str-min-chars-to-anagram": { tests: [
    two(1, "random", `return text(r, 100000, ${q(LOWER)}) + "\\n" + text(r, 100000, ${q(LOWER)})`),
    two(2, "disjoint letters", `return "a" * 100000 + "\\n" + "b" * 100000`),
  ] },
  "caesar-shift": { tests: [
    two(1, "random", `return text(r, 100000, ${q(LOWER)}) + "\\n" + str(r.int(0, 10**9))`),
    two(2, "largest shift", `return text(r, 100000, ${q(LOWER)}) + "\\n" + str(10**9)`),
  ] },
  "string-count-char": { tests: [
    two(1, "random", `return text(r, 100000, ${q(LOWER)}) + "\\n" + r.choice(${q(LOWER)})`),
    two(2, "every letter matches", `return "q" * 100000 + "\\nq"`),
  ] },
  "greedy-remove-digits": { tests: [
    two(1, "random, half removed", `return r.choice("123456789") + text(r, 99999, "0123456789") + "\\n" + str(50000)`),
    two(2, "decreasing digits", `return ("9876543210" * 10000) + "\\n" + str(r.int(0, 100000))`),
    two(3, "nothing removed", `return r.choice("123456789") + text(r, 99999, "0123456789") + "\\n0"`),
  ] },
  "str-longest-repeating-replace": { tests: [
    two(1, "random", `return text(r, 100000, "ABCDEFGHIJKLMNOPQRSTUVWXYZ") + "\\n" + str(r.int(0, 100000))`),
    two(2, "two letters, small k", `return text(r, 100000, "AB") + "\\n" + str(r.int(0, 50))`),
  ] },
  "aho-corasick-count": { tests: [
    two(1, "one letter: every pattern matches almost everywhere",
      `pats = []\ntotal = 0\nL = 1\nwhile total + L <= 200000 and len(pats) < 100000:\n    pats.append("a" * L)\n    total += L\n    L += 1\nreturn "a" * 200000 + "\\n" + str(len(pats)) + "\\n" + "\\n".join(pats)`),
    two(2, "random text, many short patterns",
      `pats = [text(r, r.int(1, 4), "ab") for _ in range(50000)]\nreturn text(r, 200000, "ab") + "\\n" + str(len(pats)) + "\\n" + "\\n".join(pats)`),
  ] },

  "word-count": { tests: [
    words(15000, 6, 1, "many words"),
    { seed: 2, note: "runs of spaces, leading and trailing", code: `parts = [text(r, r.int(1, 5), ${q(LOWER)}) for _ in range(12000)]\nreturn "   " + "".join(p + " " * r.int(1, 3) for p in parts)[:99000] + "a  "` },
  ] },
  "map-word-freq": { tests: [
    words(100000, 3, 1, "100000 short words: many repeats"),
    { seed: 2, note: "few distinct words", code: `pool = [text(r, 4, ${q(LOWER)}) for _ in range(20)]\nreturn " ".join(r.choice(pool) for _ in range(100000))` },
  ] },
  "str-reverse-words": { tests: [
    words(14000, 6, 1, "many words"),
    { seed: 2, note: "extra spaces", code: `return "  " + "   ".join(text(r, r.int(1, 6), ${q(LOWER)}) for _ in range(10000)) + "  "` },
  ] },
  "str-capitalize-words": { tests: [
    { seed: 1, note: "mixed case and runs of spaces", code: `A = ${q(LOWER + LOWER.toUpperCase())}\nparts = [text(r, r.int(1, 8), A) for _ in range(30000)]\nreturn (" " + "".join(p + " " * r.int(1, 3) for p in parts))[:199999] + "x"` },
  ] },
  "str-longest-word-in-line": { tests: [
    words(10000, 100, 1, "10^4 words up to 100 letters"),
  ] },
};
