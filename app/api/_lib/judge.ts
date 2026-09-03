/* The judge, extracted so humans and bots reach it the same way.
 *
 * This is lifted from app/api/judge/route.ts rather than rewritten: same
 * Judge0 call, same verdict mapping, same hidden tests. Two things changed.
 *
 * 1. One batch, not two. The old code submitted test 1, waited for a verdict,
 *    then submitted the other four — nice for reporting a compile error early,
 *    but it doubled the polling. Judge0 returns per-test statuses anyway, so a
 *    single batch gives the same early answer with half the traffic.
 *
 * 2. A bounded poll loop. The old one polled up to 60 times per batch, and a
 *    Cloudflare Worker gets a limited number of subrequests per invocation —
 *    production really did return
 *      {"verdict":"JUDGE_ERROR","details":"Too many subrequests…"}
 *    on a C++ submission. The budget below keeps one judged submission at 25
 *    subrequests worst case, and bot duels are about to double how often this
 *    runs.
 */

import { tests } from "../judge/tests";
import { serverEnv } from "./env";

export type Language = "cpp20" | "python3";
export const languageIds = { cpp20: 54, python3: 71 } as const;

export type JudgeVerdict =
  | "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "COMPILATION_ERROR"
  | "RUNTIME_ERROR" | "MEMORY_LIMIT_EXCEEDED" | "JUDGE_ERROR";

export type JudgeOutcome = {
  verdict: JudgeVerdict;
  passed: number;
  total: number;
  test?: number;
  runtimeMs: number;
  memoryKb: number;
  details?: string;
};

export type RunOutcome = { stdout: string; stderr: string; status: string; runtimeMs: number; memoryKb: number };

type Result = {
  token: string; status?: { id: number; description: string };
  time?: string; memory?: number; stdout?: string | null; stderr?: string | null;
  compile_output?: string | null; message?: string | null;
};
type Submission = {
  language_id: number; source_code: string; stdin: string; expected_output?: string;
  cpu_time_limit: number; wall_time_limit: number; memory_limit: number; max_file_size: number;
};

/* Worst case per judged submission: 1 create + MAX_POLLS checks. Kept well
   under the Worker's subrequest ceiling with room for the caller's own reads.
 *
 * The delays back off instead of standing still, and that is the whole point.
 * The old loop polled 22 times at a flat 450ms, which spent its entire budget
 * in 9.7 seconds — fine when the shared judge is idle (a submission settles in
 * about a second) and useless the moment it is not. ce.judge0.com is a queue
 * other people are also standing in: six concurrent submissions from this site
 * alone already push a verdict from 2.3s to 3.6s, and a classroom submitting
 * together pushes it past ten. The learner then got "Judging timed out" for a
 * program that was about to be accepted.
 *
 * Backing off spends the same number of subrequests over 45 seconds rather
 * than 10, and keeps the early polls dense so the common fast case is still
 * answered in about a second.
 */
const MAX_POLLS = 20;
const BUDGET_MS = 45_000;
const pollDelay = (attempt: number) => Math.min(4000, Math.round(250 * 1.35 ** attempt));

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const judgeConfigured = () => Boolean(serverEnv("JUDGE0_URL"));

function endpoint() {
  const url = (serverEnv("JUDGE0_URL") || "https://ce.judge0.com").replace(/\/$/, "");
  const headers: Record<string, string> = { "content-type": "application/json" };
  const apiKey = serverEnv("JUDGE0_API_KEY"), apiHost = serverEnv("JUDGE0_API_HOST");
  if (apiKey) {
    if (apiHost) {
      headers["X-RapidAPI-Key"] = apiKey;
      headers["X-RapidAPI-Host"] = apiHost;
    } else headers["X-Auth-Token"] = apiKey;
  }
  return { url, headers };
}

/* Thrown when the budget runs out. It carries how much of the batch had
   settled, because "the judge is busy, try again" and "the judge is broken"
   are different problems and the learner is the one who has to tell them
   apart. */
class JudgeTimeout extends Error {
  constructor(readonly done: number, readonly total: number) {
    super(
      `The judge did not return a verdict within ${Math.round(BUDGET_MS / 1000)}s ` +
      `(${done}/${total} tests finished). The shared judge queue is busy — try again in a moment.`,
    );
    this.name = "JudgeTimeout";
  }
}

const isFinal = (r: Result) => (r.status?.id || 0) > 2;

/** Called as tests settle, so a caller can stream "test 3/5" to the learner
 *  while the batch is still running. */
export type JudgeProgress = (settled: number, total: number) => void;

async function execute(submissions: Submission[], onProgress?: JudgeProgress): Promise<Result[]> {
  const { url, headers } = endpoint();
  const created = await fetch(`${url}/submissions/batch?base64_encoded=false`, {
    method: "POST", headers, body: JSON.stringify({ submissions }),
  });
  if (!created.ok) throw new Error(`Judge0 returned ${created.status}`);
  const tokens = ((await created.json()) as Array<{ token?: string }>).map((x) => x.token).filter(Boolean) as string[];
  if (tokens.length !== submissions.length) throw new Error("Judge did not accept every test.");

  const query = `${url}/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=false` +
    `&fields=token,status,time,memory,stdout,stderr,compile_output,message`;
  const started = Date.now();
  let settled = 0;
  for (let attempt = 0; attempt < MAX_POLLS && Date.now() - started < BUDGET_MS; attempt++) {
    await sleep(pollDelay(attempt));
    const checked = await fetch(query, { headers });
    if (!checked.ok) continue;
    const results = ((await checked.json()) as { submissions: Result[] }).submissions || [];
    if (results.length !== tokens.length) continue;
    settled = results.filter(isFinal).length;
    onProgress?.(settled, tokens.length);
    // Status ids 1 and 2 are "in queue" and "processing"; anything above is final.
    if (results.every(isFinal)) return results;
    /* A verdict can be decided before the batch is: once a test has failed and
       every test ahead of it has settled, the tests still queued behind it
       cannot change the answer, and the learner should not wait on them. */
    const failed = results.findIndex((r) => isFinal(r) && r.status!.id !== 3);
    if (failed !== -1 && results.slice(0, failed).every(isFinal)) return results;
  }
  throw new JudgeTimeout(settled, tokens.length);
}

export function verdictFor(result: Result): JudgeVerdict {
  const id = result.status?.id || 0;
  if (id === 3) return "ACCEPTED";
  if (id === 4) return "WRONG_ANSWER";
  if (id === 5) return "TIME_LIMIT_EXCEEDED";
  if (id === 6) return "COMPILATION_ERROR";
  if (id >= 7 && id <= 12) return "RUNTIME_ERROR";
  if (String(result.status?.description || "").toLowerCase().includes("memory")) return "MEMORY_LIMIT_EXCEEDED";
  return "JUDGE_ERROR";
}

export const isJudgeableProblem = (key: string): key is keyof typeof tests => key in tests;

/** Runs a submission against a problem's hidden tests. The one path to a
 *  verdict — a duel submission, a practice submission and a bot submission all
 *  arrive here, which is what makes a bot's WRONG_ANSWER a real one. */
export async function judgeSource(
  problemId: string, language: Language, sourceCode: string, onProgress?: JudgeProgress,
): Promise<JudgeOutcome> {
  if (!isJudgeableProblem(problemId)) {
    return { verdict: "JUDGE_ERROR", passed: 0, total: 0, runtimeMs: 0, memoryKb: 0, details: "Unknown problem." };
  }
  const cases = tests[problemId];
  const submissions: Submission[] = cases.map((test) => ({
    language_id: languageIds[language], source_code: sourceCode,
    stdin: test.stdin, expected_output: test.expected_output,
    cpu_time_limit: 1, wall_time_limit: 3, memory_limit: 262144, max_file_size: 1024,
  }));

  try {
    const results = await execute(submissions, onProgress);
    const runtimeMs = Math.ceil(Math.max(...results.map((r) => Number(r.time || 0))) * 1000);
    const memoryKb = Math.max(...results.map((r) => r.memory || 0));
    const failedIndex = results.findIndex((r) => r.status?.id !== 3);
    if (failedIndex === -1) {
      return { verdict: "ACCEPTED", passed: results.length, total: results.length, runtimeMs, memoryKb };
    }
    const failed = results[failedIndex];
    return {
      verdict: verdictFor(failed), test: failedIndex + 1, passed: failedIndex, total: results.length,
      runtimeMs, memoryKb,
      details: failed.compile_output || failed.stderr || failed.message || failed.status?.description || undefined,
    };
  } catch (error) {
    return {
      verdict: "JUDGE_ERROR", passed: 0, total: submissions.length, runtimeMs: 0, memoryKb: 0,
      details: error instanceof Error ? error.message : "Judge service unavailable",
    };
  }
}

/** Playground mode: the learner's own stdin, no expected output, no verdict.
 *  A compiler, not a judge — it must never touch the hidden tests. */
export async function runSource(language: Language, sourceCode: string, stdin: string): Promise<RunOutcome> {
  const result = (await execute([{
    language_id: languageIds[language], source_code: sourceCode, stdin: stdin || "",
    cpu_time_limit: 5, wall_time_limit: 10, memory_limit: 262144, max_file_size: 1024,
  }]))[0];
  return {
    stdout: result.stdout || "",
    stderr: result.stderr || result.compile_output || result.message || "",
    status: result.status?.id === 3 ? "OK" : result.status?.description || "",
    runtimeMs: Math.ceil(Number(result.time || 0) * 1000),
    memoryKb: result.memory || 0,
  };
}
