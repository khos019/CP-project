// Hidden judge tests. Server-only: this module is imported by the API route
// and never reaches the browser, so expected outputs stay private
// (neeed.md section 44).
//
// Everything below the first three entries is generated from reference
// solutions, so a statement and its answer key cannot drift apart.

export const tests={
  "sum-two":[{stdin:"12 30\n",expected_output:"42\n"},{stdin:"-5 2\n",expected_output:"-3\n"},{stdin:"0 0\n",expected_output:"0\n"},{stdin:"1000000000 1000000000\n",expected_output:"2000000000\n"},{stdin:"-1000000000 999999999\n",expected_output:"-1\n"}],
  "max-subarray":[{stdin:"9\n-2 1 -3 4 -1 2 1 -5 4\n",expected_output:"6\n"},{stdin:"1\n-7\n",expected_output:"-7\n"},{stdin:"5\n1 2 3 4 5\n",expected_output:"15\n"},{stdin:"4\n-1 -2 -3 -4\n",expected_output:"-1\n"},{stdin:"6\n5 -9 6 -2 3 -1\n",expected_output:"7\n"}],
  "coin-change":[{stdin:"3 11\n1 2 5\n",expected_output:"3\n"},{stdin:"1 3\n2\n",expected_output:"-1\n"},{stdin:"4 0\n1 2 5 10\n",expected_output:"0\n"},{stdin:"2 27\n4 7\n",expected_output:"6\n"},{stdin:"5 63\n1 5 12 19 25\n",expected_output:"3\n"}],
  "count-parity":[{stdin:"6\n1 2 3 4 5 6\n",expected_output:"3 3\n"},{stdin:"1\n7\n",expected_output:"0 1\n"},{stdin:"8\n2 4 6 8 10 12 14 16\n",expected_output:"8 0\n"},{stdin:"5\n-3 -2 0 9 4\n",expected_output:"3 2\n"}],
  "digit-sum":[{stdin:"9875\n",expected_output:"29\n"},{stdin:"0\n",expected_output:"0\n"},{stdin:"1000000000\n",expected_output:"1\n"},{stdin:"999999999\n",expected_output:"81\n"}],
  "array-reverse":[{stdin:"5\n1 2 3 4 5\n",expected_output:"5 4 3 2 1\n"},{stdin:"1\n42\n",expected_output:"42\n"},{stdin:"6\n-1 -2 -3 4 5 6\n",expected_output:"6 5 4 -3 -2 -1\n"},{stdin:"3\n7 7 7\n",expected_output:"7 7 7\n"}],
  "range-spread":[{stdin:"5\n3 9 1 7 4\n",expected_output:"8\n"},{stdin:"2\n-5 5\n",expected_output:"10\n"},{stdin:"4\n8 8 8 8\n",expected_output:"0\n"},{stdin:"6\n-100 40 0 99 -7 3\n",expected_output:"199\n"}],
  "vowel-count":[{stdin:"algoritm\n",expected_output:"3\n"},{stdin:"aeiou\n",expected_output:"5\n"},{stdin:"xyz\n",expected_output:"0\n"},{stdin:"competitiveprogramming\n",expected_output:"8\n"}],
  "factorial-mod":[{stdin:"5\n",expected_output:"120\n"},{stdin:"1\n",expected_output:"1\n"},{stdin:"20\n",expected_output:"146326063\n"},{stdin:"100000\n",expected_output:"457992974\n"}],
  "multiples-sum":[{stdin:"10\n",expected_output:"23\n"},{stdin:"1\n",expected_output:"0\n"},{stdin:"1000\n",expected_output:"233168\n"},{stdin:"1000000\n",expected_output:"233333166668\n"}],
  "palindrome-word":[{stdin:"level\n",expected_output:"YES\n"},{stdin:"algoyol\n",expected_output:"NO\n"},{stdin:"a\n",expected_output:"YES\n"},{stdin:"abccba\n",expected_output:"YES\n"}],
  "gcd-lcm":[{stdin:"12 18\n",expected_output:"6 36\n"},{stdin:"7 13\n",expected_output:"1 91\n"},{stdin:"1000000000 8\n",expected_output:"8 1000000000\n"},{stdin:"36 36\n",expected_output:"36 36\n"}],
  "running-max":[{stdin:"5\n3 1 4 1 5\n",expected_output:"3 3 4 4 5\n"},{stdin:"1\n-9\n",expected_output:"-9\n"},{stdin:"4\n5 4 3 2\n",expected_output:"5 5 5 5\n"},{stdin:"6\n1 2 2 8 8 9\n",expected_output:"1 2 2 8 8 9\n"}],
  "prefix-queries":[{stdin:"5 3\n1 2 3 4 5\n1 3\n2 5\n1 5\n",expected_output:"6\n14\n15\n"},{stdin:"1 1\n10\n1 1\n",expected_output:"10\n"},{stdin:"6 2\n-1 -2 -3 -4 -5 -6\n2 4\n1 6\n",expected_output:"-9\n-21\n"},{stdin:"4 2\n1000000000 1000000000 1000000000 1000000000\n1 4\n2 3\n",expected_output:"4000000000\n2000000000\n"}],
  "first-not-less":[{stdin:"5 4\n1 3 5 7 9\n",expected_output:"3\n"},{stdin:"3 10\n1 2 3\n",expected_output:"-1\n"},{stdin:"4 1\n1 2 3 4\n",expected_output:"1\n"},{stdin:"6 6\n2 4 6 6 8 10\n",expected_output:"3\n"}],
  "pair-sum-count":[{stdin:"5 6\n1 2 3 4 5\n",expected_output:"2\n"},{stdin:"4 8\n4 4 4 4\n",expected_output:"6\n"},{stdin:"3 100\n1 2 3\n",expected_output:"0\n"},{stdin:"6 0\n-3 -2 -1 1 2 3\n",expected_output:"3\n"}],
  "longest-distinct":[{stdin:"abcabcbb\n",expected_output:"3\n"},{stdin:"bbbbb\n",expected_output:"1\n"},{stdin:"pwwkew\n",expected_output:"3\n"},{stdin:"abcdefg\n",expected_output:"7\n"}],
  "balanced-brackets":[{stdin:"([])\n",expected_output:"YES\n"},{stdin:"([)]\n",expected_output:"NO\n"},{stdin:"((()))\n",expected_output:"YES\n"},{stdin:"(\n",expected_output:"NO\n"}],
  "kth-largest":[{stdin:"5 2\n3 1 4 1 5\n",expected_output:"4\n"},{stdin:"1 1\n7\n",expected_output:"7\n"},{stdin:"6 6\n9 8 7 6 5 4\n",expected_output:"4\n"},{stdin:"5 3\n2 2 2 2 2\n",expected_output:"2\n"}],
  "merge-intervals":[{stdin:"4\n1 3\n2 6\n8 10\n15 18\n",expected_output:"3\n"},{stdin:"1\n5 5\n",expected_output:"1\n"},{stdin:"3\n1 10\n2 3\n4 5\n",expected_output:"1\n"},{stdin:"4\n1 2\n2 3\n3 4\n4 5\n",expected_output:"1\n"}],
  "window-sum":[{stdin:"6 3\n1 2 3 4 5 6\n",expected_output:"15\n"},{stdin:"1 1\n-5\n",expected_output:"-5\n"},{stdin:"5 5\n1 1 1 1 1\n",expected_output:"5\n"},{stdin:"7 2\n-3 -1 -4 -1 -5 -9 -2\n",expected_output:"-4\n"}],
  "prime-count":[{stdin:"10\n",expected_output:"4\n"},{stdin:"1\n",expected_output:"0\n"},{stdin:"2\n",expected_output:"1\n"},{stdin:"1000000\n",expected_output:"78498\n"}],
  "fast-power":[{stdin:"2 10 1000\n",expected_output:"24\n"},{stdin:"3 0 7\n",expected_output:"1\n"},{stdin:"5 1000000000 1000000007\n",expected_output:"142848001\n"},{stdin:"123456789 987654321 1000000007\n",expected_output:"652541198\n"}],
  "grid-shortest":[{stdin:"3 3\n...\n.#.\n...\n",expected_output:"4\n"},{stdin:"1 1\n.\n",expected_output:"0\n"},{stdin:"3 3\n.#.\n.#.\n.#.\n",expected_output:"-1\n"},{stdin:"4 4\n....\n###.\n....\n.###\n",expected_output:"-1\n"}],
  "components-count":[{stdin:"5 3\n1 2\n2 3\n4 5\n",expected_output:"2\n"},{stdin:"1 0\n",expected_output:"1\n"},{stdin:"4 0\n",expected_output:"4\n"},{stdin:"6 5\n1 2\n2 3\n3 4\n4 5\n5 6\n",expected_output:"1\n"}],
  "lis-length":[{stdin:"6\n10 9 2 5 3 7\n",expected_output:"3\n"},{stdin:"1\n1\n",expected_output:"1\n"},{stdin:"5\n1 2 3 4 5\n",expected_output:"5\n"},{stdin:"5\n5 4 3 2 1\n",expected_output:"1\n"}],
  "knapsack-01":[{stdin:"3 5\n2 3\n3 4\n4 5\n",expected_output:"7\n"},{stdin:"1 1\n2 10\n",expected_output:"0\n"},{stdin:"4 10\n5 10\n4 40\n6 30\n3 50\n",expected_output:"90\n"},{stdin:"2 0\n1 1\n1 1\n",expected_output:"0\n"}],
  "edit-distance":[{stdin:"kitten\nsitting\n",expected_output:"3\n"},{stdin:"abc\nabc\n",expected_output:"0\n"},{stdin:"\nabc\n",expected_output:"3\n"},{stdin:"algoritm\nalgorithm\n",expected_output:"1\n"}],
  "coin-ways":[{stdin:"3 4\n1 2 3\n",expected_output:"4\n"},{stdin:"1 5\n2\n",expected_output:"0\n"},{stdin:"2 10\n2 5\n",expected_output:"2\n"},{stdin:"4 100\n1 5 10 25\n",expected_output:"242\n"}],
  "inversion-count":[{stdin:"5\n5 4 3 2 1\n",expected_output:"10\n"},{stdin:"1\n1\n",expected_output:"0\n"},{stdin:"4\n1 2 3 4\n",expected_output:"0\n"},{stdin:"6\n2 4 1 3 5 0\n",expected_output:"8\n"}],
  "substring-occurrences":[{stdin:"ababab\nab\n",expected_output:"3\n"},{stdin:"aaaa\naa\n",expected_output:"3\n"},{stdin:"abc\nd\n",expected_output:"0\n"},{stdin:"algoyolalgo\nalgo\n",expected_output:"2\n"}],
  "topological-possible":[{stdin:"3 2\n1 2\n2 3\n",expected_output:"YES\n"},{stdin:"2 2\n1 2\n2 1\n",expected_output:"NO\n"},{stdin:"1 0\n",expected_output:"YES\n"},{stdin:"4 4\n1 2\n2 3\n3 4\n4 2\n",expected_output:"NO\n"}],
  "dijkstra-shortest":[{stdin:"4 4\n1 2 1\n2 3 2\n1 3 5\n3 4 1\n",expected_output:"4\n"},{stdin:"2 1\n1 2 7\n",expected_output:"7\n"},{stdin:"3 1\n1 2 4\n",expected_output:"-1\n"},{stdin:"5 6\n1 2 2\n2 5 5\n1 3 1\n3 4 1\n4 5 1\n2 3 1\n",expected_output:"3\n"}],
  "tree-diameter":[{stdin:"4\n1 2\n2 3\n3 4\n",expected_output:"3\n"},{stdin:"2\n1 2\n",expected_output:"1\n"},{stdin:"5\n1 2\n1 3\n1 4\n1 5\n",expected_output:"2\n"},{stdin:"7\n1 2\n1 3\n2 4\n2 5\n3 6\n6 7\n",expected_output:"5\n"}],
  "activity-select":[{stdin:"3\n1 3\n2 5\n4 7\n",expected_output:"2\n"},{stdin:"1\n0 1\n",expected_output:"1\n"},{stdin:"4\n1 2\n2 3\n3 4\n1 4\n",expected_output:"3\n"},{stdin:"5\n1 9\n2 3\n3 4\n4 5\n5 6\n",expected_output:"4\n"}],
  "stack-next-greater":[{stdin:"5\n2 1 2 4 3\n",expected_output:"4 2 4 -1 -1\n"},{stdin:"1\n9\n",expected_output:"-1\n"},{stdin:"4\n5 4 3 2\n",expected_output:"-1 -1 -1 -1\n"},{stdin:"6\n1 2 3 4 5 6\n",expected_output:"2 3 4 5 6 -1\n"}],
  "binary-answer-split":[{stdin:"5 2\n1 2 3 4 5\n",expected_output:"9\n"},{stdin:"3 3\n1 1 1\n",expected_output:"1\n"},{stdin:"4 1\n7 2 5 10\n",expected_output:"24\n"},{stdin:"6 3\n7 2 5 10 8 1\n",expected_output:"14\n"}],
  "subset-sum-exists":[{stdin:"4 9\n3 34 4 12\n",expected_output:"NO\n"},{stdin:"3 1\n2 4 6\n",expected_output:"NO\n"},{stdin:"1 5\n5\n",expected_output:"YES\n"},{stdin:"5 30\n1 2 5 9 13\n",expected_output:"YES\n"}],
  "matrix-spiral":[{stdin:"3 3\n1 2 3\n4 5 6\n7 8 9\n",expected_output:"1 2 3 6 9 8 7 4 5\n"},{stdin:"1 4\n1 2 3 4\n",expected_output:"1 2 3 4\n"},{stdin:"4 1\n1\n2\n3\n4\n",expected_output:"1 2 3 4\n"},{stdin:"2 3\n1 2 3\n4 5 6\n",expected_output:"1 2 3 6 5 4\n"}],
  "two-pointer-closest":[{stdin:"5 8\n1 3 4 7 10\n",expected_output:"8\n"},{stdin:"2 100\n1 2\n",expected_output:"3\n"},{stdin:"4 0\n-5 -2 2 6\n",expected_output:"0\n"},{stdin:"6 13\n1 2 3 9 10 11\n",expected_output:"13\n"}],
  "frequency-mode":[{stdin:"6\n1 3 3 2 3 1\n",expected_output:"3\n"},{stdin:"1\n5\n",expected_output:"5\n"},{stdin:"4\n4 4 2 2\n",expected_output:"2\n"},{stdin:"5\n9 8 7 6 5\n",expected_output:"5\n"}],
} as const;

export type ProblemKey=keyof typeof tests;
