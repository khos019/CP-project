import { NextResponse } from "next/server";

/* The judging itself now lives in ../_lib/judge so duel and bot submissions
   reach the same verdicts through the same tests — see the note there about
   the subrequest budget this used to blow through. The response shapes below
   are unchanged: the problem screen, the duel and the playground all read
   them, and this route is not the place to renegotiate that. */
import { judgeSource, judgeCases, runSource, languageIds, isJudgeableProblem, type Language } from "../_lib/judge";
import { bearerFrom, insertAsService, rpcAsService } from "../_lib/supabase";
import { bankProblems } from "../../ui/problem-bank";
import { allow, verifiedUserId } from "../_lib/guard";

/* The verdict is written here, by the server that produced it, not by the
   browser that received it. While the browser wrote its own row, anyone could
   POST {"verdict":"ACCEPTED"} to bank_submissions and collect solved counts,
   leaderboard places and — through has_solved() — other people's code. 052
   takes the insert away from clients; this is what replaces it. JUDGE_ERROR is
   kept too: it is how an outage shows up in the history. */
type Outcome = Awaited<ReturnType<typeof judgeSource>>;
async function record(userId: string, problemId: string, language: Language, sourceCode: string, outcome: Outcome) {
  const problem = bankProblems.find((p) => p.judge === problemId);
  await insertAsService("bank_submissions", {
    user_id: userId, problem_key: problemId, problem_title: problem?.uz || problemId,
    language, verdict: outcome.verdict, runtime_ms: outcome.runtimeMs ?? null, memory_kb: outcome.memoryKb ?? null,
    passed: outcome.passed ?? null, total: outcome.total ?? null, source_code: sourceCode,
  });
}

/* A problem the owner wrote for a contest (065). Its key is
   "cx:<contest id>:<idx>"; its tests and limits are read from the database
   with the service role, and only after the database has agreed this account
   may submit (the round has begun, or the account is the owner). */
type ContestSpec = {
  ok: boolean; reason?: string; title?: string; time_limit_ms: number; memory_mb: number;
  tests: { stdin: string; expected_output: string }[];
};
const isContestKey = (key: string) => key.startsWith("cx:");

async function recordContest(userId: string, problemId: string, language: Language, sourceCode: string, outcome: Outcome) {
  await rpcAsService("contest_record_submission", {
    p_user: userId, p_key: problemId, p_language: language, p_verdict: outcome.verdict,
    p_runtime_ms: outcome.runtimeMs ?? null, p_memory_kb: outcome.memoryKb ?? null,
    p_passed: outcome.passed ?? null, p_total: outcome.total ?? null, p_source: sourceCode,
  });
}

export async function POST(request: Request) {
  /* An account, then a budget, before anything reaches Judge0 — see guard.ts
     for the flood that made this necessary. Both answers are cheap: the token
     check is cached per isolate and the limiter is a local counter. */
  const userId = await verifiedUserId(bearerFrom(request));
  if (!userId) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  if (!(await allow("JUDGE_LIMITER", userId))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "retry-after": "60" } });
  }

  const body = (await request.json().catch(() => null)) as {
    problemId?: string; language: Language; sourceCode: string;
    mode?: "judge" | "run"; stdin?: string; stream?: boolean;
  };

  if (!body) return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  const validLanguage = Boolean(body.language && languageIds[body.language]);

  // Playground mode: run the given source against the user's own stdin and
  // hand back whatever it printed. No expected output, so no verdict.
  if (body.mode === "run") {
    if (!validLanguage || !body.sourceCode?.trim()) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }
    try {
      return NextResponse.json(await runSource(body.language, body.sourceCode, body.stdin || ""));
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Judge service unavailable" },
        { status: 502 },
      );
    }
  }

  const problemId = body.problemId || "sum-two";
  if (!validLanguage || !body.sourceCode?.trim()) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  // The two kinds of problem differ only in where the tests come from and
  // where the verdict is written; everything after this is shared.
  let judgeIt: (onProgress?: (settled: number, total: number) => void) => Promise<Outcome>;
  let save: (outcome: Outcome) => Promise<void>;
  if (isContestKey(problemId)) {
    const spec = await rpcAsService<ContestSpec | null>("contest_judge_spec", { p_key: problemId, p_user: userId });
    if (!spec.ok) return NextResponse.json({ error: spec.error }, { status: spec.error === "not_migrated" ? 501 : 502 });
    if (!spec.data) return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    if (!spec.data.ok) return NextResponse.json({ error: spec.data.reason || "forbidden" }, { status: 403 });
    const s = spec.data;
    judgeIt = (onProgress) => judgeCases(s.tests, s.time_limit_ms, s.memory_mb, body.language, body.sourceCode, onProgress);
    save = (outcome) => recordContest(userId, problemId, body.language, body.sourceCode, outcome);
  } else {
    if (!isJudgeableProblem(problemId)) return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    judgeIt = (onProgress) => judgeSource(problemId, body.language, body.sourceCode, onProgress);
    save = (outcome) => record(userId, problemId, body.language, body.sourceCode, outcome);
  }

  /* Streaming mode. The judge already learns how many tests have settled on
     every poll — it just used to throw that away and answer once, which is why
     a submission looked identical for its first second and its fortieth. The
     stream is newline-delimited JSON: any number of {type:"progress"} lines,
     then exactly one {type:"result"}. A client that cannot read a stream, or
     an environment that buffers it, still gets the result line — so nothing
     depends on the progress arriving. */
  if (body.stream) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (value: unknown) => controller.enqueue(encoder.encode(JSON.stringify(value) + "\n"));
        try {
          const outcome = await judgeIt((settled, total) => send({ type: "progress", settled, total }));
          // Recorded before the result line, so a history the page reloads on
          // seeing the verdict already contains it.
          await save(outcome);
          send({ type: "result", ...outcome });
        } catch (error) {
          send({ type: "result", verdict: "JUDGE_ERROR", passed: 0, total: 0, runtimeMs: 0, memoryKb: 0,
                 details: error instanceof Error ? error.message : "Judge service unavailable" });
        }
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        "content-type": "application/x-ndjson; charset=utf-8",
        "cache-control": "no-store, no-transform",
        "x-accel-buffering": "no",
      },
    });
  }

  const outcome = await judgeIt();
  await save(outcome);
  if (outcome.verdict === "JUDGE_ERROR") {
    return NextResponse.json({ verdict: outcome.verdict, details: outcome.details }, { status: 502 });
  }
  return NextResponse.json(outcome);
}
