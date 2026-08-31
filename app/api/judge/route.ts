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
    mode?: "judge" | "run"; stdin?: string;
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

  const outcome = await judgeSource(problemId, body.language, body.sourceCode);
  if (outcome.verdict === "JUDGE_ERROR") {
    return NextResponse.json({ verdict: outcome.verdict, details: outcome.details }, { status: 502 });
  }
  return NextResponse.json(outcome);
}
