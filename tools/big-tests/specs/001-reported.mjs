/* The three problems reported on 2026-10-16. Each keeps the submission that
   passed when it should not have (tools/big-tests/slow/): the build fails if
   any of them still passes. */
import { slow } from "../lib.mjs";

export default {
  "stack-longest-valid-parens": {
    tests: [
      { seed: 1, note: "random", code: `return "".join(r.choice("()") for _ in range(100000))` },
      { seed: 2, note: "all open: a naive scan never stops early", code: `return "(" * 99999 + ")"` },
      { seed: 3, note: "one long valid run", code: `return "()" * 50000` },
      { seed: 4, note: "nested", code: `return "(" * 50000 + ")" * 50000` },
    ],
    slow: slow("stack-longest-valid-parens"),
  },
  "water-container": {
    tests: [
      { seed: 1, note: "random", code: `n = 100000\nreturn str(n) + "\\n" + line(r.ints(n, 0, 10**9))` },
      { seed: 2, note: "increasing", code: `n = 100000\nreturn str(n) + "\\n" + line(range(1, n + 1))` },
      { seed: 3, note: "all 10^9: answer near 10^14", code: `n = 100000\nreturn str(n) + "\\n" + line([10**9] * n)` },
    ],
    slow: slow("water-container"),
  },
  "manhattan-closest": {
    tests: [
      { seed: 1, note: "dense: neighbours in x+y order are not the closest pair",
        code: `n = 1000\nreturn str(n) + "\\n" + "\\n".join(line(r.ints(2, -3000, 3000)) for _ in range(n))` },
      { seed: 2, note: "full coordinate range",
        code: `n = 1000\nreturn str(n) + "\\n" + "\\n".join(line(r.ints(2, -10**9, 10**9)) for _ in range(n))` },
      /* The trap the reported solution falls into. Manhattan distance is the
         larger of |Δ(x+y)| and |Δ(x−y)|, but the closest pair need not be
         adjacent in either order: A(0,0) and B(2,0) are 2 apart, while
         C(51,−50) sits between them in x+y order and D(51,50) in x−y order.
         Comparing neighbours only finds 99. 250 such gadgets, spread far apart
         and shuffled, with the smallest A–B gap in a random one of them. */
      { seed: 3, note: "250 gadgets whose closest pair is never adjacent in x+y or x−y order",
        code: `pts = []\nfor g in range(250):\n    ox, oy = r.int(-4*10**8, 4*10**8), r.int(-4*10**8, 4*10**8)\n    d = r.int(2, 40) * 2\n    k = d * 25\n    pts += [[ox, oy], [ox + d, oy], [ox + k + d // 2, oy - k], [ox + k + d // 2, oy + k]]\nr.shuffle(pts)\nreturn str(len(pts)) + "\\n" + "\\n".join(line(p) for p in pts)` },
      { seed: 4, note: "the four-point gadget alone", code: `return "4\\n0 0\\n51 -50\\n2 0\\n51 50"` },
    ],
    slow: slow("manhattan-closest"),
  },
};
