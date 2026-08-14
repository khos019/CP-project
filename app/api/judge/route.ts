import { ApiError, apiErrorResponse, enforceRateLimit, hasServiceRoleConfig, requireProfile, supabaseRequest } from "../../lib/server/supabase";
import { getMasteryConfig } from "../../lib/server/mastery-config";
import { optionalUuid, readJsonObject, requiredString } from "../../lib/server/validation";

export const dynamic = "force-dynamic";

const languageIds = { cpp20: 54, python3: 71 } as const;
const testCatalog = {
  "sum-two": [
    { stdin: "12 30\n", expected_output: "42\n" },
    { stdin: "-5 2\n", expected_output: "-3\n" },
    { stdin: "0 0\n", expected_output: "0\n" },
    { stdin: "1000000000 1000000000\n", expected_output: "2000000000\n" },
    { stdin: "-1000000000 999999999\n", expected_output: "-1\n" },
  ],
  "max-subarray": [
    { stdin: "9\n-2 1 -3 4 -1 2 1 -5 4\n", expected_output: "6\n" },
    { stdin: "1\n-7\n", expected_output: "-7\n" },
    { stdin: "5\n1 2 3 4 5\n", expected_output: "15\n" },
    { stdin: "4\n-1 -2 -3 -4\n", expected_output: "-1\n" },
    { stdin: "6\n5 -9 6 -2 3 -1\n", expected_output: "7\n" },
  ],
  "coin-change": [
    { stdin: "3 11\n1 2 5\n", expected_output: "3\n" },
    { stdin: "1 3\n2\n", expected_output: "-1\n" },
    { stdin: "4 0\n1 2 5 10\n", expected_output: "0\n" },
    { stdin: "2 27\n4 7\n", expected_output: "6\n" },
    { stdin: "5 63\n1 5 12 19 25\n", expected_output: "3\n" },
  ],
} as const;

type ProblemKey = keyof typeof testCatalog;
type Language = keyof typeof languageIds;
type SubmissionContext = "practice" | "duel" | "placement" | "challenge";
type JudgeResult = {
  token: string;
  status?: { id: number; description: string };
  time?: string;
  memory?: number;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
};
type JudgeSubmission = {
  language_id: number;
  source_code: string;
  stdin: string;
  expected_output: string;
  cpu_time_limit: number;
  wall_time_limit: number;
  memory_limit: number;
  max_file_size: number;
};
type Verdict = "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "COMPILATION_ERROR" | "RUNTIME_ERROR" | "MEMORY_LIMIT_EXCEEDED" | "JUDGE_ERROR";

const problemMeta: Record<ProblemKey, { topic: string; difficulty: "easy" | "medium" | "hard" }> = {
  "sum-two": { topic: "programming-basics", difficulty: "easy" },
  "max-subarray": { topic: "foundations", difficulty: "medium" },
  "coin-change": { topic: "dynamic-programming", difficulty: "hard" },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function judgeFetch(url: string, init: RequestInit) {
  return fetch(url, { ...init, signal: AbortSignal.timeout(12_000), cache: "no-store" });
}

async function execute(url: string, headers: Record<string, string>, submissions: JudgeSubmission[]) {
  const created = await judgeFetch(`${url}/submissions/batch?base64_encoded=false`, {
    method: "POST",
    headers,
    body: JSON.stringify({ submissions }),
  });
  if (!created.ok) throw new Error(`Judge0 returned ${created.status}.`);
  const tokens = (await created.json() as Array<{ token?: string }>).map((item) => item.token).filter(Boolean) as string[];
  if (tokens.length !== submissions.length) throw new Error("Judge0 did not accept every test.");

  for (let attempt = 0; attempt < 40; attempt += 1) {
    await sleep(attempt === 0 ? 250 : 500);
    const checked = await judgeFetch(
      `${url}/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=false&fields=token,status,time,memory,stderr,compile_output,message`,
      { headers },
    );
    if (!checked.ok) continue;
    const results = ((await checked.json()) as { submissions?: JudgeResult[] }).submissions || [];
    if (results.length === tokens.length && results.every((result) => (result.status?.id || 0) > 2)) return results;
  }
  throw new Error("Judge0 timed out before a verdict was available.");
}

function verdictFor(result: JudgeResult): Verdict {
  const id = result.status?.id || 0;
  if (id === 3) return "ACCEPTED";
  if (id === 4) return "WRONG_ANSWER";
  if (id === 5) return "TIME_LIMIT_EXCEEDED";
  if (id === 6) return "COMPILATION_ERROR";
  if (id >= 7 && id <= 12) return "RUNTIME_ERROR";
  if (String(result.status?.description || "").toLowerCase().includes("memory")) return "MEMORY_LIMIT_EXCEEDED";
  return "JUDGE_ERROR";
}

const databaseStatus: Record<Verdict, string> = {
  ACCEPTED: "accepted",
  WRONG_ANSWER: "wrong_answer",
  TIME_LIMIT_EXCEEDED: "time_limit",
  COMPILATION_ERROR: "compilation_error",
  RUNTIME_ERROR: "runtime_error",
  MEMORY_LIMIT_EXCEEDED: "memory_limit",
  JUDGE_ERROR: "judge_error",
};

function detailsFor(result: JudgeResult) {
  return result.compile_output || result.stderr || result.message || result.status?.description || undefined;
}

async function persistVerifiedResult(input: {
  userId: string;
  problemId: ProblemKey;
  language: Language;
  sourceCode: string;
  verdict: Verdict;
  runtimeMs: number;
  memoryKb: number;
  context: SubmissionContext;
  clientRequestId: string;
  duelId: string | null;
  unitKey: string | null;
}) {
  const problemRows = await supabaseRequest<Array<{ id: string }>>(`/rest/v1/problems?problem_key=eq.${encodeURIComponent(input.problemId)}&select=id&limit=1`, { mode: "service" });
  const databaseProblemId = problemRows[0]?.id || null;
  const inserted = await supabaseRequest<Array<{ id: string }>>("/rest/v1/submissions?on_conflict=user_id,client_request_id&select=id", {
    mode: "service",
    method: "POST",
    prefer: "resolution=ignore-duplicates,return=representation",
    body: {
      user_id: input.userId,
      problem_id: databaseProblemId,
      problem_key: input.problemId,
      duel_id: input.duelId,
      language: input.language,
      source_code: input.sourceCode,
      status: databaseStatus[input.verdict],
      runtime_ms: input.runtimeMs,
      memory_kb: input.memoryKb,
      context: input.context,
      client_request_id: input.clientRequestId,
      unit_key: input.unitKey,
    },
  });
  const existing = inserted[0] || (await supabaseRequest<Array<{ id: string }>>(
    `/rest/v1/submissions?user_id=eq.${encodeURIComponent(input.userId)}&client_request_id=eq.${encodeURIComponent(input.clientRequestId)}&select=id&limit=1`,
    { mode: "service" },
  ))[0];
  if (!existing) throw new ApiError(500, "Submission persistence failed.", "SUBMISSION_PERSISTENCE_FAILED");

  if (input.verdict !== "ACCEPTED") return { mastery: null, duelClaim: null };
  const meta = problemMeta[input.problemId];
  const source = input.context === "duel" ? "duel" : input.context === "placement" ? "placement" : input.context === "challenge" ? "challenge" : "problem";
  const sourceKey = input.context === "duel" && input.duelId
    ? `duel:${input.duelId}:${input.problemId}`
    : `${source}:${input.problemId}`;
  const masteryConfig = await getMasteryConfig();
  const baseDelta = masteryConfig.weights.problem[meta.difficulty];
  const delta = input.context === "duel"
    ? Math.min(300, Math.round(baseDelta * masteryConfig.weights.duelMultiplier))
    : input.context === "challenge"
      ? Math.min(300, masteryConfig.weights.challenge)
      : baseDelta;
  const mastery = await supabaseRequest("/rest/v1/rpc/apply_mastery_evidence", {
    mode: "service",
    method: "POST",
    body: {
      p_user: input.userId,
      p_topic_slug: meta.topic,
      p_source: source,
      p_source_key: sourceKey,
      p_delta: delta,
      p_metadata: { problemKey: input.problemId, context: input.context },
    },
  });
  const duelClaim = input.context === "duel"
    ? await supabaseRequest("/rest/v1/rpc/settle_duel_submission", {
      mode: "service",
      method: "POST",
      body: { p_submission: existing.id },
    })
    : null;
  return { mastery, duelClaim };
}

export async function POST(request: Request) {
  try {
    const body = await readJsonObject(request, 70_000);
    const problemId = requiredString(body.problemId, "problemId", 64) as ProblemKey;
    const language = requiredString(body.language, "language", 16) as Language;
    const sourceCode = requiredString(body.sourceCode, "sourceCode", 50_000);
    if (!(problemId in testCatalog) || !(language in languageIds)) {
      throw new ApiError(400, "Unsupported problem or language.", "INVALID_SUBMISSION");
    }
    const context = (typeof body.context === "string" ? body.context : "practice") as SubmissionContext;
    if (!["practice", "duel", "placement", "challenge"].includes(context)) {
      throw new ApiError(400, "Invalid submission context.", "INVALID_SUBMISSION");
    }
    const duelId = optionalUuid(body.duelId, "duelId");
    if (context === "duel" && !duelId) throw new ApiError(400, "duelId is required for duel submissions.", "INVALID_SUBMISSION");
    if (context !== "duel" && duelId) throw new ApiError(400, "duelId is only valid for duel submissions.", "INVALID_SUBMISSION");
    const unitKey = typeof body.unitKey === "string" && body.unitKey.length <= 120 ? body.unitKey : null;
    const clientRequestId = optionalUuid(body.clientRequestId, "clientRequestId") || crypto.randomUUID();
    const { profile } = await requireProfile(request);
    if (!hasServiceRoleConfig()) {
      throw new ApiError(503, "Secure judge persistence is not configured.", "JUDGE_PERSISTENCE_NOT_CONFIGURED");
    }
    await enforceRateLimit(`judge:${profile.id}`, 8, 60);

    const url = (process.env.JUDGE0_URL || "").replace(/\/$/, "");
    if (!url) throw new ApiError(503, "Judge0 is not configured.", "JUDGE_NOT_CONFIGURED");
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (process.env.JUDGE0_API_KEY) {
      if (process.env.JUDGE0_API_HOST) {
        headers["X-RapidAPI-Key"] = process.env.JUDGE0_API_KEY;
        headers["X-RapidAPI-Host"] = process.env.JUDGE0_API_HOST;
      } else {
        headers["X-Auth-Token"] = process.env.JUDGE0_API_KEY;
      }
    }

    const submissions = testCatalog[problemId].map((test) => ({
      language_id: languageIds[language],
      source_code: sourceCode,
      stdin: test.stdin,
      expected_output: test.expected_output,
      cpu_time_limit: 1,
      wall_time_limit: 3,
      memory_limit: 262144,
      max_file_size: 1024,
    }));

    const first = (await execute(url, headers, [submissions[0]]))[0];
    let results = [first];
    if (first.status?.id === 3 && submissions.length > 1) {
      results = [first, ...await execute(url, headers, submissions.slice(1))];
    }
    const failedIndex = results.findIndex((result) => result.status?.id !== 3);
    const failed = failedIndex >= 0 ? results[failedIndex] : null;
    const verdict = failed ? verdictFor(failed) : "ACCEPTED";
    const runtimeMs = Math.ceil(Math.max(...results.map((result) => Number(result.time || 0))) * 1000);
    const memoryKb = Math.max(...results.map((result) => result.memory || 0));
    const evidence = await persistVerifiedResult({
      userId: profile.id,
      problemId,
      language,
      sourceCode,
      verdict,
      runtimeMs,
      memoryKb,
      context,
      clientRequestId,
      duelId,
      unitKey,
    });

    return Response.json({
      verdict,
      test: failed ? failedIndex + 1 : undefined,
      passed: failed ? failedIndex : results.length,
      total: submissions.length,
      runtimeMs,
      memoryKb,
      details: failed ? detailsFor(failed) : undefined,
      mastery: evidence?.mastery || null,
      duelClaim: evidence?.duelClaim || null,
      requestId: clientRequestId,
    }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
