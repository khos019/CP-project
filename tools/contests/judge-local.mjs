/* A local stand-in for the judge, for checking seeded submissions.
 *
 * Same inputs as production — the hidden tests in app/api/judge/tests.ts and
 * the per-problem CPU limits beside them — and the same verdict rules as
 * judgeSource() in app/api/_lib/judge.ts: run every test, the first one that
 * does not pass decides the verdict, `passed` is how many came before it.
 *
 * Timing is this machine's, not the VPS's, so a program near its limit is
 * reported as "unsure" rather than guessed at; build.mjs never uses those.
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, readFileSync, copyFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const GXX = process.env.GXX || "g++";
const FLAGS = ["-O2", "-std=c++20", "-pipe"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Windows keeps a freshly linked .exe locked for a moment (the linker, and
   often an antivirus scan), and spawning it then fails with EBUSY. That is the
   file being busy, not the program failing, so it is retried. */
async function run(cmd, args, opts = {}) {
  for (let attempt = 0; ; attempt++) {
    try { return await runOnce(cmd, args, opts); }
    catch (e) {
      if (["EBUSY", "EPERM", "EACCES"].includes(e.code) && attempt < 20) { await sleep(150 * (attempt + 1)); continue; }
      throw e;
    }
  }
}

const runOnce = (cmd, args, { input = "", timeoutMs = 0, cwd } = {}) => new Promise((resolve, reject) => {
  const started = process.hrtime.bigint();
  let child;
  try { child = spawn(cmd, args, { cwd, windowsHide: true }); } catch (e) { reject(e); return; }
  let out = "", err = "", killed = false;
  child.stdout.on("data", (d) => { if (out.length < 4e6) out += d; });
  child.stderr.on("data", (d) => { if (err.length < 1e5) err += d; });
  const timer = timeoutMs ? setTimeout(() => { killed = true; child.kill("SIGKILL"); }, timeoutMs) : null;
  // A process that never started has no verdict; run() decides whether to retry.
  child.on("error", (e) => { if (timer) clearTimeout(timer); reject(e); });
  child.on("close", (code) => {
    if (timer) clearTimeout(timer);
    resolve({ code, out, err, killed, ms: Number(process.hrtime.bigint() - started) / 1e6 });
  });
  child.stdin.on("error", () => {});
  child.stdin.end(input);
});

/* Trailing whitespace on a line and trailing blank lines are not an answer. */
const norm = (s) => s.replace(/\r/g, "").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "");

export async function makeJudge(workDir) {
  mkdirSync(workDir, { recursive: true });
  const pchDir = join(workDir, "pch");
  const gch = join(pchDir, "bits", "stdc++.h.gch");
  if (!existsSync(gch)) {
    // Find the toolchain's own <bits/stdc++.h> and precompile it next to a copy.
    const probe = await run(GXX, ["-std=c++20", "-x", "c++", "-E", "-H", "-"], { input: "#include <bits/stdc++.h>\n" });
    const line = probe.err.split("\n").find((l) => /^\. .*stdc\+\+\.h\s*$/.test(l));
    if (!line) throw new Error("could not locate bits/stdc++.h:\n" + probe.err.slice(0, 500));
    mkdirSync(join(pchDir, "bits"), { recursive: true });
    copyFileSync(line.slice(2).trim(), join(pchDir, "bits", "stdc++.h"));
    const r = await run(GXX, [...FLAGS, "-x", "c++-header", join(pchDir, "bits", "stdc++.h"), "-o", gch]);
    if (r.code !== 0) throw new Error("PCH build failed: " + r.err.slice(0, 500));
  }

  // Process start-up on Windows is tens of milliseconds the real judge never
  // sees, so it is measured once and taken off every reported runtime.
  const emptyDir = join(workDir, "empty");
  mkdirSync(emptyDir, { recursive: true });
  const emptySrc = join(emptyDir, "e.cpp");
  writeFileSync(emptySrc, "int main(){return 0;}\n");
  await run(GXX, [...FLAGS, emptySrc, "-o", join(emptyDir, "e.exe")]);
  let base = Infinity;
  for (let i = 0; i < 8; i++) base = Math.min(base, (await run(join(emptyDir, "e.exe"), [])).ms);

  const cacheFile = join(workDir, "verdicts.json");
  const cache = existsSync(cacheFile) ? JSON.parse(readFileSync(cacheFile, "utf8")) : {};
  let dirty = 0;
  const save = () => { writeFileSync(cacheFile, JSON.stringify(cache)); dirty = 0; };

  /* The same text can be asked for twice at once (two people with the same
     style send the same solution); both wait on one compile. */
  const inflight = new Map();
  function judge(problemKey, source, tests, cpuSeconds) {
    const id = createHash("sha256").update(problemKey + "\0" + source).digest("hex").slice(0, 24);
    if (cache[id]) return Promise.resolve(cache[id]);
    if (!inflight.has(id)) inflight.set(id, judgeOnce(id, source, tests, cpuSeconds).finally(() => inflight.delete(id)));
    return inflight.get(id);
  }

  /** Returns { verdict, passed, total, runtimeMs, unsure? }. */
  async function judgeOnce(id, source, tests, cpuSeconds) {
    const dir = join(workDir, "b", id.slice(0, 2));
    mkdirSync(dir, { recursive: true });
    const src = join(dir, id + ".cpp"), exe = join(dir, id + ".exe");
    writeFileSync(src, source);
    const c = await run(GXX, [...FLAGS, "-I", pchDir, src, "-o", exe]);
    let result;
    if (c.code !== 0) {
      result = { verdict: "COMPILATION_ERROR", passed: 0, total: tests.length, runtimeMs: 0, detail: c.err.slice(0, 400) };
    } else {
      const limitMs = cpuSeconds * 1000;
      let worst = 0, failed = null, unsure = false;
      for (let i = 0; i < tests.length; i++) {
        let r = await run(exe, [], { input: tests[i].stdin, timeoutMs: limitMs * 3 + 500 });
        // A first run is often slowed by a scan of the new binary; a slow
        // test is timed again and the best of three is the one that counts.
        for (let again = 0; again < 2 && (r.killed || r.ms - base > limitMs * 0.6); again++) {
          const r2 = await run(exe, [], { input: tests[i].stdin, timeoutMs: limitMs * 3 + 500 });
          if (!r2.killed && (r.killed || r2.ms < r.ms)) r = r2;
        }
        const ms = Math.max(0, r.ms - base);
        worst = Math.max(worst, ms);
        if (r.killed || ms > limitMs * 2) { failed = { i, v: "TIME_LIMIT_EXCEEDED" }; break; }
        if (ms > limitMs * 0.6) unsure = true;           // too close to call on another machine
        if (r.code !== 0) { failed = { i, v: "RUNTIME_ERROR" }; break; }
        if (norm(r.out) !== norm(tests[i].expected_output)) { failed = { i, v: "WRONG_ANSWER" }; break; }
      }
      if (failed && failed.v === "TIME_LIMIT_EXCEEDED") unsure = false; // 2x over is over anywhere
      result = failed
        ? { verdict: failed.v, passed: failed.i, total: tests.length, runtimeMs: Math.ceil(worst), unsure }
        : { verdict: "ACCEPTED", passed: tests.length, total: tests.length, runtimeMs: Math.ceil(worst), unsure };
    }
    cache[id] = result;
    if (++dirty >= 50) save();
    return result;
  }

  /* Clean timing for one source: compiled (or reused), then every test run
     one at a time with nothing else in flight, best of five. The parallel
     judging above is right about verdicts and wrong about milliseconds. */
  async function time(problemKey, source, tests) {
    const id = createHash("sha256").update(problemKey + "\0" + source).digest("hex").slice(0, 24);
    const dir = join(workDir, "b", id.slice(0, 2));
    const src = join(dir, id + ".cpp"), exe = join(dir, id + ".exe");
    if (!existsSync(exe)) {
      mkdirSync(dir, { recursive: true });
      writeFileSync(src, source);
      await run(GXX, [...FLAGS, "-I", pchDir, src, "-o", exe]);
    }
    let worst = 0;
    for (const t of tests) {
      let best = Infinity;
      for (let k = 0; k < 5; k++) best = Math.min(best, (await run(exe, [], { input: t.stdin, timeoutMs: 10000 })).ms);
      worst = Math.max(worst, best - base);
    }
    return Math.max(0, Math.round(worst));
  }

  return { judge, time, save, baseMs: base };
}

/* Run fn over items with `width` in flight at once. */
export async function pool(items, width, fn, onTick) {
  let next = 0, done = 0;
  const out = new Array(items.length);
  await Promise.all(Array.from({ length: Math.min(width, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
      done++;
      if (onTick) onTick(done, items.length);
    }
  }));
  return out;
}
