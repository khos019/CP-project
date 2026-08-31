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
   under the Worker's subrequest ceiling with room for the caller's own reads. */
const MAX_POLLS = 22;
const FIRST_DELAY_MS = 250;
const POLL_DELAY_MS = 450;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const judgeConfigured = () => Boolean(process.env.JUDGE0_URL || true);

function endpoint() {
  const url = (process.env.JUDGE0_URL || "https://ce.judge0.com").replace(/\/$/, "");
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.JUDGE0_API_KEY) {
    if (process.env.JUDGE0_API_HOST) {
      headers["X-RapidAPI-Key"] = process.env.JUDGE0_API_KEY;
      headers["X-RapidAPI-Host"] = process.env.JUDGE0_API_HOST;
    } else headers["X-Auth-Token"] = process.env.JUDGE0_API_KEY;
  }
  return { url, headers };
}

async function execute(submissions: Submission[]): Promise<Result[]> {
  const { url, headers } = endpoint();
  const created = await fetch(`${url}/submissions/batch?base64_encoded=false`, {
    method: "POST", headers, body: JSON.stringify({ submissions }),
  });
  if (!created.ok) throw new Error(`Judge0 returned ${created.status}`);
  const tokens = ((await created.json()) as Array<{ token?: string }>).map((x) => x.token).filter(Boolean) as string[];
  if (tokens.length !== submissions.length) throw new Error("Judge did not accept every test.");

  const query = `${url}/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=false` +
    `&fields=token,status,time,memory,stdout,stderr,compile_output,message`;
  for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
    await sleep(attempt === 0 ? FIRST_DELAY_MS : POLL_DELAY_MS);
    const checked = await fetch(query, { headers });
    if (!checked.ok) continue;
    const results = ((await checked.json()) as { submissions: Result[] }).submissions || [];
    // Status ids 1 and 2 are "in queue" and "processing"; anything above is final.
    if (results.length === tokens.length && results.every((r) => (r.status?.id || 0) > 2)) return results;
  }
  throw new Error("Judging timed out before a verdict was available.");
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
  problemId: string, language: Language, sourceCode: string,
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
    const results = await execute(submissions);
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
