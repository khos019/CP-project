#!/usr/bin/env node
/* Builds app/api/judge/big-tests.ts from tools/big-tests/specs/*.mjs.
 *
 * For every generated test it
 *   1. builds the input with the same Python the sandbox runs (GEN_PRELUDE),
 *   2. runs the problem's reference solution (app/api/_lib/solutions.ts),
 *      compiled the way the judge compiles it — g++ -std=gnu++17, no -O2 —
 *      and refuses a test the reference does not finish well inside the
 *      problem's CPU limit,
 *   3. stores the SHA-256 of the stripped output, never the output itself,
 *   4. if the spec lists `slow` solutions (the O(n²) programs that slipped
 *      through), checks that each one now fails: too slow, or wrong.
 *
 *   node tools/big-tests/build.mjs              # check and write
 *   node tools/big-tests/build.mjs --only=a,b   # just these problems (others kept)
 *   node tools/big-tests/build.mjs --check      # check, write nothing
 *
 * Needs g++ and python on PATH. Timing is this machine's; the margin below is
 * there because the judge's VPS is not this machine. */

import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const WORK = join(HERE, "work");
const OUT = join(ROOT, "app", "api", "judge", "big-tests.ts");
mkdirSync(WORK, { recursive: true });

const { GEN_PRELUDE } = await import(pathToFileURL(join(ROOT, "app/api/judge/gen-lib.ts")).href);
const { solutions } = await import(pathToFileURL(join(ROOT, "app/api/_lib/solutions.ts")).href);
const { problemCpuSeconds } = await import(pathToFileURL(join(ROOT, "app/api/judge/tests.ts")).href);

const args = process.argv.slice(2);
const only = (args.find((a) => a.startsWith("--only=")) || "").slice(7).split(",").filter(Boolean);
const checkOnly = args.includes("--check");
const CPP_CPU = 1;              // judge.ts limits.cpp20.cpu
const MARGIN = 0.35;            // reference must finish within 35% of the limit here

const specs = {};
for (const file of readdirSync(join(HERE, "specs")).filter((f) => f.endsWith(".mjs")).sort()) {
  const mod = await import(pathToFileURL(join(HERE, "specs", file)).href);
  for (const [key, spec] of Object.entries(mod.default)) {
    if (specs[key]) throw new Error(`${key} is specified twice (${file})`);
    specs[key] = spec;
  }
}

const WS = new Set([0x20, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x00]);
const rstrip = (buf) => { let e = buf.length; while (e > 0 && WS.has(buf[e - 1])) e--; return buf.subarray(0, e); };
/* Judge0's strip(): every line right-trimmed, then the whole. */
function strip(buf) {
  const lines = [];
  let start = 0;
  for (let i = 0; i <= buf.length; i++) {
    if (i === buf.length || buf[i] === 0x0a) { lines.push(rstrip(buf.subarray(start, i))); start = i + 1; }
  }
  return rstrip(Buffer.concat(lines.flatMap((l, i) => (i ? [Buffer.from("\n"), l] : [l]))));
}
const sha = (buf) => createHash("sha256").update(strip(buf)).digest("hex");

/* Child processes, run asynchronously so several problems are checked at
   once (JOBS, default 6). Timings are taken per process, so parallel work
   inflates them a little; MARGIN leaves room for that, and a problem refused
   for speed can be re-checked alone with --only. */
function exec(cmd, cmdArgs, { input, timeoutSec } = {}) {
  return new Promise((resolve) => {
    const t = process.hrtime.bigint();
    const child = spawn(cmd, cmdArgs, { stdio: ["pipe", "pipe", "pipe"] });
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

let scriptId = 0;
async function generate(code, seed) {
  const script = join(WORK, `gen-${process.pid}-${scriptId++}.py`);
  writeFileSync(script, `${GEN_PRELUDE}\nimport sys\nsys.stdout.buffer.write(build(${JSON.stringify(code)}, ${seed}).encode("utf-8"))\n`);
  const r = await exec("python", ["-I", script]);
  rmSync(script, { force: true });
  if (r.code !== 0) throw new Error(`generator failed: ${r.err.slice(-400)}`);
  return r.out;
}

const compiled = new Map();
function compile(name, source) {
  if (!compiled.has(source)) {
    const src = join(WORK, `${name}.cpp`), exe = join(WORK, `${name}.exe`);
    writeFileSync(src, source);
    compiled.set(source, exec("g++", ["-std=gnu++17", src, "-o", exe]).then((r) => {
      if (r.code !== 0) throw new Error(`${name} does not compile: ${r.err.slice(0, 400)}`);
      return exe;
    }));
  }
  return compiled.get(source);
}

const run = (exe, input, timeoutSec) => exec(exe, [], { input, timeoutSec });

const existing = existsSync(OUT)
  ? Object.fromEntries([...readFileSync(OUT, "utf8").matchAll(/^  ("[^"]+"): (\[.*\]),$/gm)].map((m) => [JSON.parse(m[1]), m[2]]))
  : {};
// A full run rebuilds from the specs alone, so a problem dropped from them is dropped here too.
const result = only.length ? { ...existing } : {};
let failed = 0;

async function check(key, spec) {
  const log = [];
  const reference = solutions[key]?.solution;
  if (!reference) return { ok: false, log: [`✗ ${key}: no reference solution`] };
  const limit = CPP_CPU * ((problemCpuSeconds[key] ?? CPP_CPU) / CPP_CPU);
  const refExe = await compile(`ref-${key}`, reference);
  const slowExes = await Promise.all((spec.slow || []).map((source, i) => compile(`slow-${key}-${i}`, source)));
  const rows = [];
  let ok = true;
  for (const [i, t] of spec.tests.entries()) {
    const input = await generate(t.code, t.seed);
    const ref = await run(refExe, input, limit * 10);
    const digest = sha(ref.out);
    const fast = ref.seconds <= limit * MARGIN;
    // The sandbox caps a program's output at 1024 KB; a test whose correct
    // answer is longer would fail the reference itself.
    const fits = ref.out.length <= 900 * 1024;
    const verdicts = [];
    for (const exe of slowExes) {
      const s = await run(exe, input, limit * 3);
      verdicts.push(s.timedOut || s.seconds > limit ? `TLE ${s.seconds.toFixed(2)}s` : sha(s.out) !== digest ? "WA" : `passes ${s.seconds.toFixed(2)}s`);
    }
    log.push(`${fast && fits && ref.code === 0 ? "✓" : "✗"} ${key} #${i + 1}  input ${(input.length / 1024).toFixed(0)} KB  output ${(ref.out.length / 1024).toFixed(0)} KB  reference ${ref.seconds.toFixed(3)}s / ${limit}s` +
      (ref.code !== 0 ? `  exit ${ref.code}` : "") + (verdicts.length ? `  slow: ${verdicts.join(", ")}` : "") + (t.note ? `  (${t.note})` : ""));
    if (!fast || !fits || ref.code !== 0) ok = false;
    rows.push({ code: t.code, seed: t.seed, sha: digest, passes: verdicts.map((v) => v.startsWith("passes")) });
  }
  // Each slow solution has to fail at least one test, or the tests did not do their job.
  slowExes.forEach((_, j) => {
    if (rows.every((r) => r.passes[j])) { log.push(`✗ ${key}: slow solution #${j + 1} still passes every generated test`); ok = false; }
  });
  return { ok, log, rows };
}

const queue = Object.entries(specs).filter(([key]) => !only.length || only.includes(key));
const JOBS = Number(process.env.JOBS) || 6;
await Promise.all(Array.from({ length: JOBS }, async () => {
  while (queue.length) {
    const [key, spec] = queue.shift();
    let res;
    try { res = await check(key, spec); } catch (error) { res = { ok: false, log: [`✗ ${key}: ${error.message}`] }; }
    console.log(res.log.join("\n"));
    if (!res.ok) { failed++; continue; }
    result[key] = JSON.stringify(res.rows.map(({ code, seed, sha }) => ({ code, seed, sha })));
  }
}));

if (failed) console.log(`\n${failed} problem(s) not written.`);
if (!checkOnly) {
  const body = Object.keys(result).sort().map((k) => `  ${JSON.stringify(k)}: ${result[k]},`).join("\n");
  writeFileSync(OUT, `/* Generated by tools/big-tests/build.mjs — do not edit by hand.
 * Max-size tests per problem, built inside the sandbox (see gen-lib.ts). */
import type { GeneratedTest } from "./gen-lib";

export const bigTests: Record<string, GeneratedTest[]> = {
${body}
};
`);
  console.log(`wrote ${Object.keys(result).length} problem(s) to app/api/judge/big-tests.ts`);
}
process.exit(failed ? 1 : 0);
