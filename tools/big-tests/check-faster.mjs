#!/usr/bin/env node
/* Checks a faster reference (tools/big-tests/faster/<key>.cpp, a body in the
 * style of solutions.ts) before it replaces the one in solutions.ts:
 *   1. it prints the stored answer on every hidden test in tests.ts;
 *   2. it agrees with the current reference on many small random inputs,
 *      where the current one is fast enough to run.
 *
 *   node tools/big-tests/check-faster.mjs [key ...]
 */
import { spawnSync, execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const WORK = join(HERE, "work");
mkdirSync(WORK, { recursive: true });
const { solutions } = await import(pathToFileURL(join(ROOT, "app/api/_lib/solutions.ts")).href);
const { tests } = await import(pathToFileURL(join(ROOT, "app/api/judge/tests.ts")).href);
const wrap = (body) => `#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\n${body}\nreturn 0;}\n`;

const norm = (s) => s.split("\n").map((l) => l.trimEnd()).join("\n").trimEnd();
function build(name, source) {
  const src = join(WORK, `${name}.cpp`), exe = join(WORK, `${name}.exe`);
  writeFileSync(src, source);
  execFileSync("g++", ["-std=gnu++17", "-O2", src, "-o", exe], { stdio: ["ignore", "ignore", "inherit"] });
  return exe;
}
const run = (exe, input) => spawnSync(exe, [], { input, encoding: "utf8", maxBuffer: 1 << 28, timeout: 20000 }).stdout || "";

let seed = 12345;
const rnd = (lo, hi) => { seed = (seed * 1103515245 + 12345) % 2147483648; return lo + (seed % (hi - lo + 1)); };
const tree = (n) => Array.from({ length: n - 1 }, (_, i) => `${i + 2} ${rnd(1, i + 1)}`).join("\n");

/* Small random inputs per problem, inside each statement's constraints. */
const SMALL = {
  "bit-fenwick-sum": () => { const n = rnd(1, 30), q = rnd(1, 30); const ops = Array.from({ length: q }, () => (rnd(0, 1) ? `1 ${rnd(1, n)} ${rnd(-20, 20)}` : (() => { const l = rnd(1, n); return `2 ${l} ${rnd(l, n)}`; })())); return `${n} ${q}\n${Array.from({ length: n }, () => rnd(-50, 50)).join(" ")}\n${ops.join("\n")}\n`; },
  "sparse-min": () => { const n = rnd(1, 40), q = rnd(1, 40); return `${n} ${q}\n${Array.from({ length: n }, () => rnd(-50, 50)).join(" ")}\n${Array.from({ length: q }, () => { const l = rnd(1, n); return `${l} ${rnd(l, n)}`; }).join("\n")}\n`; },
  "centroid-paths-within-k": () => { const n = rnd(1, 40); return `${n} ${rnd(0, n)}\n${tree(n)}\n`; },
  "count-binary-no-k-ones": () => { const n = rnd(1, 60); return `${n} ${rnd(1, n)}\n`; },
  "dp-count-dice-sums": () => `${rnd(1, 12)} ${rnd(1, 12)} ${rnd(1, 150)}\n`,
};

const keys = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(join(HERE, "faster")).map((f) => f.replace(/\.cpp$/, ""));
let bad = 0;
for (const key of keys) {
  const body = readFileSync(join(HERE, "faster", `${key}.cpp`), "utf8").trim();
  const fresh = build(`faster-${key}`, wrap(body));
  const old = build(`old-${key}`, solutions[key].solution);
  let stored = 0, storedBad = 0;
  for (const t of tests[key]) { stored++; if (norm(run(fresh, t.stdin)) !== norm(t.expected_output)) storedBad++; }
  let rand = 0, randBad = 0, example = "";
  for (let i = 0; i < 400; i++) {
    const input = SMALL[key]();
    rand++;
    if (norm(run(fresh, input)) !== norm(run(old, input))) { randBad++; if (!example) example = input; }
  }
  const ok = !storedBad && !randBad;
  if (!ok) bad++;
  console.log(`${ok ? "✓" : "✗"} ${key}: stored ${stored - storedBad}/${stored}, random ${rand - randBad}/${rand}` + (example ? `\n  first disagreement on:\n${example}` : ""));
}
process.exit(bad ? 1 : 0);
