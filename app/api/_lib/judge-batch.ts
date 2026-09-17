/* One compile per submission, not one per test.
 *
 * Judge0 treats every test as its own submission, so a C++ solution with five
 * tests was compiled five times. The program itself runs for ~10 ms a test;
 * the compile is 1-3 s, and with <bits/stdc++.h> nearer the top of that. On the
 * self-hosted 4-core VPS that made compiling nearly all of the work: twelve
 * submissions arriving together were 60 compiles, and seven of them outlived
 * the 45 s poll budget as JUDGE_ERROR.
 *
 * This module packs a whole submission into ONE Judge0 "Multi-file program"
 * (language 89): the source, a `compile` script with exactly the command
 * language 54 uses, and a small runner that executes the binary against every
 * test in turn. What the runner reproduces from Judge0 1.13.1, so a verdict does
 * not change with the path it took:
 *
 *  - the commands: `g++ main.cpp` with no flags, `python3 script.py`, and the
 *    LD_LIBRARY_PATH the C++ run command sets;
 *  - the limits per test: CPU (user+sys of the process, the same number isolate
 *    reports), wall clock, address space, stack and output size;
 *  - the status ids, so verdictFor() maps them unchanged: 3 AC, 4 WA, 5 TLE,
 *    7 SIGSEGV, 8 SIGXFSZ, 9 SIGFPE, 10 SIGABRT, 11 non-zero exit, 12 other;
 *  - the output comparison: Judge0's strip() — rstrip every line, rstrip the
 *    whole — applied to both sides.
 *
 * Nothing a program does can produce a verdict for it. Every result line is
 * signed with a per-job key the program never sees; a test may not fork, and
 * whatever it leaves running is killed before the next test.
 *
 * Expected outputs never touch the sandbox's disk. They arrive on the runner's
 * stdin, which it reads and closes before running anything, so a program
 * cannot open them as files, and the compile step (which could #include a
 * file) runs before they exist anywhere at all. Each test's input is written
 * just before its run and removed just after.
 *
 * Anything this path cannot finish — Judge0 refusing the job, a runner killed
 * by the job's own limits — is not a verdict. judge.ts judges whatever is left
 * the old way, test by test.
 */

export type BatchLanguage = "cpp20" | "python3";
export type BatchTest = { stdin: string; expected_output: string };
export type BatchLimits = { cpu: number; wall: number; memoryKb: number; outputKb: number };

/** One settled test, in the shape judge.ts already reads from Judge0. */
export type BatchResult = {
  status: { id: number; description: string };
  time: string; memory: number; stderr: string | null;
};

export const MULTI_FILE_LANGUAGE_ID = 89;

/* The job's own limits, not a test's. They only have to contain the runner,
   which enforces the real ones itself; they are kept at or under Judge0's
   stock maxima (15 s CPU, 20 s wall) so a default install accepts the job. A
   job cut short by them is judged the rest of the way test by test. */
export const JOB_LIMITS = { cpu: 15, wall: 20 } as const;

const DESCRIPTIONS: Record<number, string> = {
  3: "Accepted", 4: "Wrong Answer", 5: "Time Limit Exceeded", 7: "Runtime Error (SIGSEGV)",
  8: "Runtime Error (SIGXFSZ)", 9: "Runtime Error (SIGFPE)", 10: "Runtime Error (SIGABRT)",
  11: "Runtime Error (NZEC)", 12: "Runtime Error (Other)",
};

/* Python 3.8 is what the sandbox has (it is language 71's interpreter), so the
   runner is written for it: no walrus-free guarantees needed beyond 3.8. */
const RUNNER = String.raw`import hashlib, hmac, json, os, resource, signal, sys

WS = b" \t\n\v\f\r\x00"
def strip(b):
    return b"\n".join(line.rstrip(WS) for line in b.split(b"\n")).rstrip(WS)

job = json.loads(sys.stdin.buffer.read().decode("utf-8"))
# The expected outputs live only in this process from here on. fd 0 is
# pointed at /dev/null rather than left closed: a closed 0 is the next number
# open() hands out, and the child would then close its own stdin.
null = os.open(os.devnull, os.O_RDONLY)
os.dup2(null, 0)
os.close(null)

key = job["key"].encode("ascii")
cmd, env = job["cmd"], dict(os.environ, **job["env"])
cpu, wall, mem, fsize = job["cpu"], job["wall"], job["mem"], job["fsize"]
SIGNAL_STATUS = {signal.SIGSEGV: 7, signal.SIGXFSZ: 8, signal.SIGFPE: 9, signal.SIGABRT: 10}

state = {"pid": 0, "walled": False}
def on_alarm(signum, frame):
    # Only a kill that landed counts: the timer can fire in the instant after
    # the child exited on its own, and that program was not too slow.
    if state["pid"]:
        try:
            os.kill(state["pid"], signal.SIGKILL)
            state["walled"] = True
        except OSError:
            pass
signal.signal(signal.SIGALRM, on_alarm)

# Signed, because the program can reach this stdout: /proc/<runner>/fd/1 is
# openable by the same uid, and an unsigned "s": 3 written there would be an
# accepted verdict. The key came in on stdin and exists only in memory.
def emit(**row):
    payload = json.dumps(row, sort_keys=True)
    mac = hmac.new(key, payload.encode("ascii"), hashlib.sha256).hexdigest()
    sys.stdout.write(payload + "\t" + mac + "\n")
    sys.stdout.flush()

# Whatever a test left running dies before the next one starts: pid 1 is
# isolate's, the parent is the run script, and nothing else belongs here.
def sweep():
    keep = {1, os.getpid(), os.getppid()}
    for name in os.listdir("/proc"):
        if name.isdigit() and int(name) not in keep:
            try:
                os.kill(int(name), signal.SIGKILL)
            except OSError:
                pass

for index, test in enumerate(job["tests"]):
    with open("t.in", "wb") as f:
        f.write(test["in"].encode("utf-8"))
    pid = os.fork()
    if pid == 0:
        try:
            fin = os.open("t.in", os.O_RDONLY)
            fout = os.open("t.out", os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
            ferr = os.open("t.err", os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
            os.dup2(fin, 0); os.dup2(fout, 1); os.dup2(ferr, 2)
            for fd in (fin, fout, ferr):
                if fd > 2:
                    os.close(fd)
            soft = int(cpu) + 1
            resource.setrlimit(resource.RLIMIT_CPU, (soft, soft + 1))
            resource.setrlimit(resource.RLIMIT_AS, (mem * 1024, mem * 1024))
            resource.setrlimit(resource.RLIMIT_FSIZE, (fsize * 1024, fsize * 1024))
            # No fork, no threads. CPU time is read off this one process, and a
            # child it never waited for would compute uncounted.
            resource.setrlimit(resource.RLIMIT_NPROC, (0, 0))
            os.execve(cmd[0], cmd, env)
        finally:
            os._exit(127)
    state["pid"], state["walled"] = pid, False
    signal.setitimer(signal.ITIMER_REAL, wall)
    _, raw, usage = os.wait4(pid, 0)
    signal.setitimer(signal.ITIMER_REAL, 0)
    state["pid"] = 0
    sweep()

    used = usage.ru_utime + usage.ru_stime
    with open("t.err", "rb") as f:
        err = f.read(4000).decode("utf-8", "replace")
    if state["walled"] or used > cpu:
        status = 5
    elif os.WIFSIGNALED(raw):
        status = SIGNAL_STATUS.get(os.WTERMSIG(raw), 12)
    elif os.WEXITSTATUS(raw) != 0:
        status = 11
    else:
        with open("t.out", "rb") as f:
            status = 3 if strip(f.read()) == strip(test["out"].encode("utf-8")) else 4
    for name in ("t.in", "t.out", "t.err"):
        try:
            os.remove(name)
        except OSError:
            pass
    emit(i=index, s=status, t=round(used, 3), m=usage.ru_maxrss, e=err if status != 3 else "")
    if status != 3:
        break
`;

const PROGRAMS: Record<BatchLanguage, { file: string; compile?: string; cmd: string[]; env: Record<string, string> }> = {
  // Language 54's compile_cmd with no compiler options, and its run_cmd.
  cpp20: {
    file: "main.cpp", compile: "/usr/local/gcc-9.2.0/bin/g++ main.cpp\n",
    cmd: ["./a.out"], env: { LD_LIBRARY_PATH: "/usr/local/gcc-9.2.0/lib64" },
  },
  // Language 71's run_cmd.
  python3: { file: "script.py", cmd: ["/usr/local/python-3.8.1/bin/python3", "script.py"], env: {} },
};

/* ── A stored (uncompressed) zip ──────────────────────────────────────────
   Judge0 wants additional_files as a base64 zip. The files are a few KB of
   text, so compression buys nothing, and a stored archive is small enough to
   write here rather than pull a library into the Worker. */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();
const crc32 = (bytes: Uint8Array) => {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

export function storedZip(files: Record<string, string>): Uint8Array {
  const encoder = new TextEncoder();
  const locals: Uint8Array[] = [], centrals: Uint8Array[] = [];
  let offset = 0;
  for (const [name, text] of Object.entries(files)) {
    const nameBytes = encoder.encode(name), data = encoder.encode(text), crc = crc32(data);
    const local = new Uint8Array(30 + nameBytes.length + data.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true);
    lv.setUint32(14, crc, true); lv.setUint32(18, data.length, true); lv.setUint32(22, data.length, true);
    lv.setUint16(26, nameBytes.length, true);
    local.set(nameBytes, 30); local.set(data, 30 + nameBytes.length);

    const central = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true);
    cv.setUint32(16, crc, true); cv.setUint32(20, data.length, true); cv.setUint32(24, data.length, true);
    cv.setUint16(28, nameBytes.length, true); cv.setUint32(42, offset, true);
    central.set(nameBytes, 46);

    locals.push(local); centrals.push(central);
    offset += local.length;
  }
  const centralSize = centrals.reduce((n, c) => n + c.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, centrals.length, true); ev.setUint16(10, centrals.length, true);
  ev.setUint32(12, centralSize, true); ev.setUint32(16, offset, true);

  const out = new Uint8Array(offset + centralSize + end.length);
  let at = 0;
  for (const part of [...locals, ...centrals, end]) { out.set(part, at); at += part.length; }
  return out;
}

const toBase64 = (bytes: Uint8Array) => {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
};

/** The one Judge0 submission that judges every test. */
export function buildBatchSubmission(
  language: BatchLanguage, sourceCode: string, tests: ReadonlyArray<BatchTest>, limits: BatchLimits, key: string,
) {
  const program = PROGRAMS[language];
  const files: Record<string, string> = {
    [program.file]: sourceCode,
    "runner.py": RUNNER,
    run: "/usr/local/python-3.8.1/bin/python3 runner.py\n",
  };
  if (program.compile) files.compile = program.compile;
  return {
    language_id: MULTI_FILE_LANGUAGE_ID,
    additional_files: toBase64(storedZip(files)),
    stdin: JSON.stringify({
      key, cmd: program.cmd, env: program.env,
      cpu: limits.cpu, wall: limits.wall, mem: limits.memoryKb, fsize: limits.outputKb,
      tests: tests.map((t) => ({ in: t.stdin, out: t.expected_output })),
    }),
    cpu_time_limit: JOB_LIMITS.cpu, wall_time_limit: JOB_LIMITS.wall,
    memory_limit: limits.memoryKb, max_file_size: limits.outputKb,
    // Per process, as C++ is judged elsewhere: no cgroup, so the compile's
    // CPU and memory cannot be charged to the runner.
    enable_per_process_and_thread_time_limit: true,
    enable_per_process_and_thread_memory_limit: true,
  };
}

/** A fresh signing key per job: 32 random bytes, hex. */
export function newBatchKey(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, "0")).join("");
}

const hex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");

/** Reads the runner's lines. Stops at the first line it cannot trust -- bad
 *  signature, out of order, unparseable -- so a job killed mid-write or a
 *  program scribbling on the runner's stdout leaves only genuine results, and
 *  the rest is judged the old way. */
export async function parseBatchOutput(
  stdout: string | null | undefined, total: number, key: string,
): Promise<BatchResult[]> {
  const encoder = new TextEncoder();
  const hmacKey = await crypto.subtle.importKey("raw", encoder.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const results: BatchResult[] = [];
  for (const line of String(stdout || "").split("\n")) {
    if (!line.trim()) continue;
    const cut = line.lastIndexOf("\t");
    if (cut < 0) break;
    const payload = line.slice(0, cut), mac = line.slice(cut + 1).trim();
    if (hex(await crypto.subtle.sign("HMAC", hmacKey, encoder.encode(payload))) !== mac) break;
    let row: { i?: unknown; s?: unknown; t?: unknown; m?: unknown; e?: unknown };
    try { row = JSON.parse(payload); } catch { break; }
    const status = Number(row.s);
    if (row.i !== results.length || results.length >= total || !DESCRIPTIONS[status]) break;
    results.push({
      status: { id: status, description: DESCRIPTIONS[status] },
      time: String(Number(row.t) || 0), memory: Number(row.m) || 0,
      stderr: typeof row.e === "string" && row.e ? row.e : null,
    });
    if (status !== 3) break;
  }
  return results;
}
