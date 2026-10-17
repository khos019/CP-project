/* node bigcheck.mjs batch-521.mjs [--only=a,b]
 *
 * The same checks tools/big-tests/build.mjs makes, run straight from a batch
 * file before anything is emitted: each `big` test is built with the
 * sandbox's own Python prelude, the reference is compiled the way the judge
 * compiles it (g++ -std=gnu++17, no -O2) and must finish within 35% of the
 * problem's limit with at most 900 KB of output, and every `slow` solution
 * must fail at least one test (too slow, or wrong). Nothing is written; the
 * hashes are stored by build.mjs once the batch is emitted. */
import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const HERE = import.meta.dirname;
const WORK = join(HERE, "build", "big");
mkdirSync(WORK, { recursive: true });
const { GEN_PRELUDE } = await import(pathToFileURL(join(HERE, "../../app/api/judge/gen-lib.ts")).href);
const [file, ...flags] = process.argv.slice(2);
const only = (flags.find((f) => f.startsWith("--only=")) || "").slice(7).split(",").filter(Boolean);
const MARGIN = 0.35;

const wrap = (body) => "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\n" + body + "\nreturn 0;}\n";
function exec(cmd, args, { input, timeoutSec } = {}) {
  return new Promise((resolve) => {
    const t = process.hrtime.bigint();
    const child = spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] });
    const out = [], err = [];
    let timedOut = false;
    const timer = timeoutSec ? setTimeout(() => { timedOut = true; child.kill("SIGKILL"); }, timeoutSec * 1000) : null;
    child.stdout.on("data", (d) => out.push(d));
    child.stderr.on("data", (d) => err.push(d));
    child.stdin.on("error", () => {});
    child.on("close", (code) => {
      if (timer) clearTimeout(timer);
      resolve({ code, timedOut, out: Buffer.concat(out), err: Buffer.concat(err).toString(), seconds: Number(process.hrtime.bigint() - t) / 1e9 });
    });
    child.stdin.end(input ?? "");
  });
}
async function compile(name, body) {
  const src = join(WORK, name + ".cpp"), exe = join(WORK, name + ".exe");
  writeFileSync(src, wrap(body));
  const r = await exec("g++", ["-std=gnu++17", src, "-o", exe]);
  if (r.code !== 0) throw new Error(name + " does not compile: " + r.err.slice(0, 400));
  return exe;
}
let gid = 0;
async function generate(code, seed) {
  const script = join(WORK, `gen-${gid++}.py`);
  writeFileSync(script, `${GEN_PRELUDE}\nimport sys\nsys.stdout.buffer.write(build(${JSON.stringify(code)}, ${seed}).encode("utf-8"))\n`);
  const r = await exec("python", ["-I", script]);
  rmSync(script, { force: true });
  if (r.code !== 0) throw new Error("generator failed: " + r.err.slice(-400));
  return r.out;
}
const norm = (b) => b.toString().replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\s+$/, "");

const problems = (await import("./" + file)).default.filter((p) => !only.length || only.includes(p.judge));
let bad = 0;
for (const p of problems) {
  if (!p.big?.length) { console.log(`  - ${p.judge}: no big tests`); continue; }
  const limit = (p.timeLimitMs ?? 1000) / 1000;
  const ref = await compile(p.judge + "-ref", p.sol);
  const slows = await Promise.all((p.slow || []).map((s, i) => compile(`${p.judge}-slow${i}`, s)));
  const caught = slows.map(() => false);
  let ok = true;
  for (const [i, t] of p.big.entries()) {
    const input = await generate(t.code, t.seed);
    const r = await exec(ref, [], { input, timeoutSec: limit * 10 });
    const fast = r.seconds <= limit * MARGIN, fits = r.out.length <= 900 * 1024, size = input.length <= 4000 * 1024;
    const verdicts = [];
    for (const [j, exe] of slows.entries()) {
      const s = await exec(exe, [], { input, timeoutSec: limit * 3 });
      const v = s.timedOut || s.seconds > limit ? `TLE ${s.seconds.toFixed(2)}s` : norm(s.out) !== norm(r.out) ? "WA" : `passes ${s.seconds.toFixed(2)}s`;
      if (!v.startsWith("passes")) caught[j] = true;
      verdicts.push(v);
    }
    const good = fast && fits && size && r.code === 0;
    if (!good) ok = false;
    console.log(`  ${good ? "✓" : "✗"} ${p.judge} #${i + 1} in ${(input.length / 1024).toFixed(0)} KB out ${(r.out.length / 1024).toFixed(0)} KB ref ${r.seconds.toFixed(3)}s/${limit}s` +
      (r.code !== 0 ? ` exit ${r.code}` : "") + (verdicts.length ? `  slow: ${verdicts.join(", ")}` : "") + (t.note ? `  (${t.note})` : ""));
  }
  caught.forEach((c, j) => { if (!c) { ok = false; console.log(`  ✗ ${p.judge}: slow #${j + 1} passes every big test`); } });
  if (!ok) bad++;
}
console.log(bad ? `\n${bad} problem(s) failed` : "\nall big tests fine");
process.exit(bad ? 1 : 0);
