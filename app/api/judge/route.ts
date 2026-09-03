import { NextResponse } from "next/server";

/* The judging itself now lives in ../_lib/judge so duel and bot submissions
   reach the same verdicts through the same tests — see the note there about
   the subrequest budget this used to blow through. The response shapes below
   are unchanged: the problem screen, the duel and the playground all read
   them, and this route is not the place to renegotiate that. */
import { judgeSource, runSource, languageIds, isJudgeableProblem, type Language } from "../_lib/judge";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    problemId?: string; language: Language; sourceCode: string;
    mode?: "judge" | "run"; stdin?: string; stream?: boolean;
  };

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
  if (!validLanguage || !body.sourceCode?.trim() || !isJudgeableProblem(problemId)) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
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
          const outcome = await judgeSource(problemId, body.language, body.sourceCode,
            (settled, total) => send({ type: "progress", settled, total }));
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

  const outcome = await judgeSource(problemId, body.language, body.sourceCode);
  if (outcome.verdict === "JUDGE_ERROR") {
    return NextResponse.json({ verdict: outcome.verdict, details: outcome.details }, { status: 502 });
  }
  return NextResponse.json(outcome);
}
