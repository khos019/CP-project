"use client";

import { useEffect, useRef, useState } from "react";
import { tr, type Lang } from "./i18n";
import { linkTo } from "./Chrome";
import { ratingColor } from "./rating";
import { MathText } from "./math-text";
import { CodeEditor, type EditorLang } from "./CodeEditor";
import { judgeFetch, judgeRefusal } from "./judge-client";
import { readDraft, writeDraft } from "./drafts";
import { verdictLabel } from "./social-ui";
import { Clock } from "./Contests";
import { publicRpc, windowOf, type Load, type Standings, type Phase } from "./contest-data";

/* One problem the owner wrote for a round (065): its statement, then an
 * editor that submits to /api/judge under the problem's "cx:" key. The judge
 * reads the hidden tests and limits from the database and ties the verdict to
 * the round, so a submission here is a cell on the standings the moment it is
 * judged. */

type Spec = {
  ok: boolean; reason?: string; starts_at?: string;
  idx: string; problem_key: string; title_uz: string; title_en: string; rating: number;
  statement: string; input_spec: string; output_spec: string; notes: string;
  en?: Partial<Record<"statement" | "input_spec" | "output_spec" | "notes", string>> | null;   // 073
  time_limit_ms: number; memory_mb: number; samples: { input: string; output: string }[]; tests: number;
};
type JudgeReply = { verdict?: string; passed?: number; total?: number; test?: number; runtimeMs?: number; memoryKb?: number; details?: string; error?: string };

const STARTER: Record<EditorLang, string> = {
  cpp20: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    // yechimingizni shu yerga yozing\n    return 0;\n}\n",
  python3: "import sys\ninput = sys.stdin.readline\n\n# yechimingizni shu yerga yozing\n",
};

/* Paragraphs as the owner typed them: a blank line starts a new one. */
function Prose({ text }: { text: string }) {
  const parts = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return <>{parts.map((p, i) => <p key={i} className="cxp-para"><MathText text={p} /></p>)}</>;
}

/* isOwner here means "on the round's team" (owner, co-author or tester): they
   read the problems early and submit without registering. */
export function ContestProblemPage({ lang, slug, idx, board, phase, isOwner, signed, onPick, onSignIn, onSubmitted }: {
  lang: Lang; slug: string; idx: string; board: Standings; phase: Phase; isOwner: boolean; signed: boolean;
  onPick: (idx: string) => void; onSignIn: () => void; onSubmitted: () => void;
}) {
  // A running round takes submissions from its registered participants only,
  // and registration closed when it started (068).
  const mustRegister = phase === "live" && !isOwner && board.contest.kind === "custom"
    && board.contest.me_registered === false;
  const [load, setLoad] = useState<Load<Spec>>({ state: "loading" });
  const [language, setLanguage] = useState<EditorLang>("cpp20");
  const [code, setCode] = useState(STARTER.cpp20);
  const [verdict, setVerdict] = useState("");
  const [busy, setBusy] = useState(false);
  const keyRef = useRef("");

  useEffect(() => {
    let live = true;
    void publicRpc<Spec>("contest_problem", { p_slug: slug, p_idx: idx }).then((got) => {
      if (!live) return;
      setLoad(got);
      if (got.state === "ready" && got.data.ok) {
        keyRef.current = got.data.problem_key;
        setCode(readDraft(got.data.problem_key, "cpp20") ?? STARTER.cpp20);
      }
    });
    return () => { live = false; };
  }, [slug, idx]);

  const edit = (next: string) => { setCode(next); writeDraft(keyRef.current, language, next, STARTER[language]); };
  const switchLang = (next: EditorLang) => {
    setLanguage(next);
    setCode(readDraft(keyRef.current, next) ?? STARTER[next]);
  };

  const line = (r: JudgeReply) => {
    const name = verdictLabel(String(r.verdict || "JUDGE_ERROR"), lang);
    const at = r.test && r.verdict !== "ACCEPTED" ? (lang === "uz" ? ` · ${r.test}-test` : ` on test ${r.test}`) : "";
    const stats = r.verdict === "ACCEPTED" ? ` · ${r.passed}/${r.total} · ${r.runtimeMs} ms · ${r.memoryKb} KB` : r.total ? ` · ${r.passed ?? 0}/${r.total}` : "";
    return `${name}${at}${stats}${r.details ? `\n${String(r.details).slice(0, 900)}` : ""}`;
  };

  const submit = async () => {
    if (!signed) { onSignIn(); return; }
    if (!keyRef.current || busy) return;
    const judging = tr(lang, "algoYolApp.navbatda_testlar_tekshirilmoqda");
    setBusy(true);
    setVerdict(judging);
    try {
      const response = await judgeFetch({ problemId: keyRef.current, language, sourceCode: code, stream: true });
      const refusal = judgeRefusal(response.status, lang);
      if (refusal) { setVerdict(refusal); return; }
      if (response.status === 403) {
        const body = (await response.json().catch(() => ({}))) as JudgeReply;
        setVerdict(tr(lang, body.error === "not_started" ? "contests.p_not_started" : body.error === "not_registered" ? "contests.reg_needed" : "contests.p_forbidden"));
        return;
      }
      // Newline-delimited JSON: progress lines, then one result (see the route).
      let result: JudgeReply | null = null;
      const reader = response.body?.getReader();
      if (reader) {
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (value) buffer += decoder.decode(value, { stream: true });
          for (let cut = buffer.indexOf("\n"); cut >= 0; cut = buffer.indexOf("\n")) {
            const text = buffer.slice(0, cut).trim();
            buffer = buffer.slice(cut + 1);
            if (!text) continue;
            let msg: JudgeReply & { type?: string; settled?: number };
            try { msg = JSON.parse(text); } catch { continue; }
            if (msg.type === "progress") setVerdict(`${judging} ${msg.settled}/${msg.total}`);
            else if (msg.type === "result" || msg.verdict) result = msg;
          }
          if (done) break;
        }
        if (!result && buffer.trim()) { try { result = JSON.parse(buffer); } catch { /* not JSON */ } }
      } else result = await response.json().catch(() => null);
      setVerdict(line(result || { verdict: "JUDGE_ERROR" }));
      onSubmitted();
    } catch {
      setVerdict(tr(lang, "algoYolApp.tekshiruvchi_bilan_aloqa_uzildi"));
    } finally {
      setBusy(false);
    }
  };

  const picker = <nav className="cxp-picker" aria-label={tr(lang, "contests.problems")}>
    {board.problems.map((p) => (
      <a key={p.idx} href={`/contests/${encodeURIComponent(slug)}/p/${p.idx}`} className={p.idx === idx ? "on" : undefined}
        style={{ ["--pc" as string]: ratingColor(p.rating) }}
        onClick={linkTo(() => { if (p.idx !== idx) onPick(p.idx); })}>
        <b>{p.idx}</b><span>{(lang === "uz" ? p.title_uz : p.title_en) || p.title_uz}</span>
      </a>
    ))}
  </nav>;

  if (load.state !== "ready") {
    return <>{picker}{load.state === "loading"
      ? <div className="screen-state" role="status"><span className="spinner" aria-hidden /></div>
      : <div className="panel"><div className="notice">{tr(lang, load.state === "not-migrated" ? "contests.editor_not_migrated" : load.state === "missing" ? "contests.not_found" : "contests.load_error")}</div></div>}</>;
  }
  const p = load.data;
  if (!p.ok) {
    const { start } = windowOf(board.contest);
    return <>{picker}<section className="cx-sealed"><h2>{tr(lang, "contests.sealed_title")}</h2>
      <span className="cx-upcoming"><Clock ms={start - Date.now()} lang={lang} big /></span></section></>;
  }
  const title = (lang === "uz" ? p.title_uz : p.title_en) || p.title_uz;
  // Each part in the reader's language; an untranslated part stays Uzbek.
  const text = (k: "statement" | "input_spec" | "output_spec" | "notes") => (lang === "en" && p.en?.[k]?.trim()) || p[k];

  return <>
    {picker}
    <div className="workspace cxp-workspace">
      <article className="panel statement cxp-statement">
        <header className="cxp-head">
          <span className="cxp-idx" style={{ ["--pc" as string]: ratingColor(p.rating) }}>{p.idx}</span>
          <div>
            <h2>{title}</h2>
            <div className="cxp-limits">
              <span>⏱ {p.time_limit_ms / 1000} s</span>
              <span>▦ {p.memory_mb} MB</span>
              <span>{tr(lang, "contests.p_tests", { n: p.tests })}</span>
              <span style={{ color: ratingColor(p.rating) }}>★ {p.rating}</span>
            </div>
          </div>
        </header>
        <Prose text={text("statement")} />
        {text("input_spec") && <><h3>{tr(lang, "algoYolApp.kirish")}</h3><Prose text={text("input_spec")} /></>}
        {text("output_spec") && <><h3>{tr(lang, "algoYolApp.chiqish")}</h3><Prose text={text("output_spec")} /></>}
        {p.samples.length > 0 && <h3>{tr(lang, "algoYolApp.namunalar")}</h3>}
        {p.samples.map((s, i) => <div className="cxp-sample" key={i}>
          <div><b>{tr(lang, "contests.p_input_n", { n: i + 1 })}</b><pre>{s.input}</pre></div>
          <div><b>{tr(lang, "contests.p_output_n", { n: i + 1 })}</b><pre>{s.output}</pre></div>
        </div>)}
        {text("notes") && <><h3>{tr(lang, "contests.p_notes")}</h3><Prose text={text("notes")} /></>}
      </article>
      <div className="cxp-side">
        {phase === "finished" && <p className="notice cxp-note">{tr(lang, "contests.p_practice")}</p>}
        {phase === "upcoming" && isOwner && <p className="notice cxp-note">{tr(lang, "contests.p_owner_early")}</p>}
        {mustRegister && <div className="cx-reg cxp-reg closed">
          <div className="cx-reg-copy"><b>{tr(lang, "contests.reg_closed")}</b><small>{tr(lang, "contests.reg_closed_problem")}</small></div>
        </div>}
        {!mustRegister && <CodeEditor code={code} setCode={edit} lang={language} setLang={switchLang} onSubmit={submit}
          submitLabel={signed ? tr(lang, "contests.p_submit") : tr(lang, "contests.p_sign_in")} verdict={verdict} busy={busy} />}
      </div>
    </div>
  </>;
}
