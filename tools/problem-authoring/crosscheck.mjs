/* node crosscheck.mjs batch-521.mjs [--n=300] [--only=a,b]
 *
 * For every entry with gen() and slow[0]: compile the reference and the brute
 * force, feed both n random small inputs from gen, and fail on the first
 * disagreement. A reference that agrees with an obviously-correct brute force
 * on hundreds of random cases is the evidence the answer key is right; the
 * hidden tests alone only show the reference agrees with itself. */
import { execFileSync, execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { rng } from "./gen-lib.mjs";

const HERE = import.meta.dirname;
const WORK = join(HERE, "build", "cross");
mkdirSync(WORK, { recursive: true });
const [file, ...flags] = process.argv.slice(2);
const N = Number((flags.find((f) => f.startsWith("--n=")) || "--n=300").slice(4));
const only = (flags.find((f) => f.startsWith("--only=")) || "").slice(7).split(",").filter(Boolean);

const wrap = (body) => "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\n" + body + "\nreturn 0;}\n";
function build(body, label) {
  const src = join(WORK, label + ".cpp"), exe = join(WORK, label + ".exe");
  writeFileSync(src, wrap(body));
  execSync(`g++ -O2 -std=gnu++17 -o "${exe}" "${src}"`, { stdio: "pipe" });
  return exe;
}
const norm = (b) => b.toString().replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\s+$/, "");
const run = (exe, input) => norm(execFileSync(exe, { input, timeout: 20000, maxBuffer: 64 << 20 }));

const problems = (await import("./" + file)).default.filter((p) => !only.length || only.includes(p.judge));
let bad = 0;
for (const p of problems) {
  const bruteSrc = p.brute ?? p.slow?.[0];
  if (!p.gen || !bruteSrc) { console.log(`  - ${p.judge}: no gen/brute, skipped`); continue; }
  const ref = build(p.sol, p.judge + "-ref"), brute = build(bruteSrc, p.judge + "-brute");
  let fail = null;
  for (let i = 0; i < N && !fail; i++) {
    const input = p.gen(rng(777000 + i));
    const a = run(ref, input), b = run(brute, input);
    if (a !== b) fail = { input, a, b };
  }
  if (fail) {
    bad++;
    console.log(`  ✗ ${p.judge}\n--- input\n${fail.input}--- reference\n${fail.a.slice(0, 400)}\n--- brute\n${fail.b.slice(0, 400)}`);
  } else console.log(`  ✓ ${p.judge} agrees with the brute force on ${N} random inputs`);
}
process.exit(bad ? 1 : 0);
