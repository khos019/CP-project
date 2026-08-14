"use client";

import { useMemo, useState } from "react";
import { readStoredToken } from "./AuthPage";
import { useLearning } from "./LearningContext";
import { judgeProblems, problems, starterFor, type BankProblem, type ProblemDifficulty } from "./problem-data";
import { roadmapCards } from "./roadmap-data";

type Lang = "uz" | "en";
type CodeLanguage = "cpp20" | "python3";

const verdictNames: Record<string, [string, string]> = {
  ACCEPTED: ["Qabul qilindi", "Accepted"],
  WRONG_ANSWER: ["Noto‘g‘ri javob", "Wrong answer"],
  COMPILATION_ERROR: ["Kompilyatsiya xatosi", "Compilation error"],
  RUNTIME_ERROR: ["Bajarilish xatosi", "Runtime error"],
  TIME_LIMIT_EXCEEDED: ["Vaqt chegarasi oshdi", "Time limit exceeded"],
  MEMORY_LIMIT_EXCEEDED: ["Xotira chegarasi oshdi", "Memory limit exceeded"],
  JUDGE_ERROR: ["Tekshiruvchi xatosi", "Judge error"],
};

export function ProblemBank({
  lang,
  selected,
  onSelect,
  activeUnitKey,
  requireAuth,
}: {
  lang: Lang;
  selected: BankProblem | null;
  onSelect: (problem: BankProblem | null) => void;
  activeUnitKey: string | null;
  requireAuth: () => void;
}) {
  if (selected) {
    return <ProblemWorkspace lang={lang} item={selected} activeUnitKey={activeUnitKey} requireAuth={requireAuth} onBack={() => onSelect(null)} />;
  }
  return <ProblemLibrary lang={lang} onSelect={onSelect} />;
}

function ProblemLibrary({ lang, onSelect }: { lang: Lang; onSelect: (problem: BankProblem) => void }) {
  const [difficulty, setDifficulty] = useState<"all" | ProblemDifficulty>("all");
  const [topic, setTopic] = useState("all");
  const { events } = useLearning();
  const solvedKeys = useMemo(() => new Set(events.filter((event) => event.source === "problem").map((event) => event.sourceKey.replace(/^problem:/, ""))), [events]);
  const topics = useMemo(() => [...new Set(problems.map((problem) => problem.topic))], []);
  const shown = problems.filter((problem) => (difficulty === "all" || problem.difficulty === difficulty) && (topic === "all" || problem.topic === topic));
  const topicName = (slug: string) => {
    const roadmap = roadmapCards.find((item) => item.slug === slug);
    return roadmap ? (lang === "uz" ? roadmap.uz : roadmap.en) : slug;
  };

  return <>
    <div className="page-head">
      <div>
        <p className="eyebrow">{lang === "uz" ? "Mashq maydoni" : "Practice arena"}</p>
        <h1 className="page-title">{lang === "uz" ? "Masalalar banki" : "Problem library"}</h1>
        <p className="muted">{lang === "uz" ? "Faqat tekshiruvchi bilan ulangan masalalar mastery hisobiga o‘tadi." : "Only verified problems contribute to mastery."}</p>
      </div>
      <span className="tag">{problems.length} {lang === "uz" ? "masala" : "problems"}</span>
    </div>
    <div className="filters" aria-label={lang === "uz" ? "Qiyinlik filtri" : "Difficulty filter"}>
      {(["all", "easy", "medium", "hard"] as const).map((value) => <button key={value} className={difficulty === value ? "active" : ""} aria-pressed={difficulty === value} onClick={() => setDifficulty(value)}>{value === "all" ? (lang === "uz" ? "Barchasi" : "All") : value}</button>)}
    </div>
    <div className="filters filter-row-secondary" aria-label={lang === "uz" ? "Mavzu filtri" : "Topic filter"}>
      <button className={topic === "all" ? "active" : ""} aria-pressed={topic === "all"} onClick={() => setTopic("all")}>{lang === "uz" ? "Barcha mavzu" : "All topics"}</button>
      {topics.map((value) => <button key={value} className={topic === value ? "active" : ""} aria-pressed={topic === value} onClick={() => setTopic(value)}>{topicName(value)}</button>)}
    </div>
    <div className="problem-list">
      {shown.map((problem) => {
        const solved = Boolean(problem.judge && solvedKeys.has(problem.judge));
        return <button className="problem-row" key={problem.id} onClick={() => onSelect(problem)}>
          <span className="num">{problem.id}</span>
          <span><h3>{lang === "uz" ? problem.uz : problem.en}</h3><span className={`difficulty ${problem.difficulty}`}>{problem.difficulty.toUpperCase()} · {problem.points}</span></span>
          <span className="tag">{problem.tag}</span>
          <span className={`pb-status ${solved ? "solved" : ""}`} aria-label={solved ? (lang === "uz" ? "Yechilgan" : "Solved") : (lang === "uz" ? "Yechilmagan" : "Unsolved")}>{solved ? "✓" : "○"}</span>
        </button>;
      })}
    </div>
  </>;
}

function ProblemWorkspace({ lang, item, activeUnitKey, requireAuth, onBack }: { lang: Lang; item: BankProblem; activeUnitKey: string | null; requireAuth: () => void; onBack: () => void }) {
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>("cpp20");
  const [code, setCode] = useState(() => starterFor(item, "cpp20"));
  const [verdict, setVerdict] = useState("");
  const [busy, setBusy] = useState(false);
  const { events, refresh } = useLearning();
  const judgeProblem = item.judge ? judgeProblems[item.judge] : null;
  const solved = Boolean(item.judge && events.some((event) => event.source === "problem" && event.sourceKey === `problem:${item.judge}`));

  const submit = async () => {
    if (!item.judge || busy) return;
    const token = readStoredToken();
    if (!token) {
      requireAuth();
      return;
    }
    setBusy(true);
    setVerdict(lang === "uz" ? "Navbatda… testlar tekshirilmoqda" : "Queued… running hidden tests");
    try {
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({
          problemId: item.judge,
          language: codeLanguage,
          sourceCode: code,
          context: "practice",
          unitKey: activeUnitKey,
          clientRequestId: crypto.randomUUID(),
        }),
      });
      const payload = await response.json() as { verdict?: string; test?: number; passed?: number; total?: number; runtimeMs?: number; memoryKb?: number; details?: string; error?: string };
      if (!response.ok) throw new Error(payload.error || (lang === "uz" ? "Tekshiruvchi so‘rovni qabul qilmadi." : "The judge rejected the request."));
      const title = (verdictNames[payload.verdict || "JUDGE_ERROR"] || verdictNames.JUDGE_ERROR)[lang === "uz" ? 0 : 1];
      const test = payload.test ? ` · test #${payload.test}` : "";
      const stats = payload.verdict === "ACCEPTED" ? ` · ${payload.passed}/${payload.total} · ${payload.runtimeMs} ms · ${payload.memoryKb} KB` : "";
      setVerdict(`${title}${test}${stats}${payload.details ? `\n${payload.details.slice(0, 900)}` : ""}`);
      if (payload.verdict === "ACCEPTED") await refresh();
    } catch (caught) {
      setVerdict(caught instanceof Error ? caught.message : (lang === "uz" ? "Tekshiruvchi bilan aloqa uzildi." : "Judge connection failed."));
    } finally {
      setBusy(false);
    }
  };

  return <>
    <button className="crumb" onClick={onBack}>← {lang === "uz" ? "Masalalar banki" : "Problem library"}</button>
    <div className="page-head">
      <div><span className="tag">{item.id} · {item.difficulty.toUpperCase()} · {item.points}</span> <span className="tag">{item.tag}</span> {solved ? <span className="tag tag-solved">✓ {lang === "uz" ? "Yechilgan" : "Solved"}</span> : null}<h1 className="page-title page-title-spaced">{lang === "uz" ? item.uz : item.en}</h1></div>
      <span className="muted mono">1 s · 256 MB</span>
    </div>
    {judgeProblem ? <div className="workspace">
      <article className="panel statement">
        <h2>{lang === "uz" ? "Shart" : "Statement"}</h2><p>{lang === "uz" ? judgeProblem.statementUz : judgeProblem.statementEn}</p>
        <h3>{lang === "uz" ? "Kirish" : "Input"}</h3><p>{lang === "uz" ? judgeProblem.inputUz : judgeProblem.inputEn}</p>
        <h3>{lang === "uz" ? "Chiqish" : "Output"}</h3><p>{lang === "uz" ? judgeProblem.outputUz : judgeProblem.outputEn}</p>
        <h3>{lang === "uz" ? "Namuna" : "Sample"}</h3><pre className="sample">{judgeProblem.sample}</pre>
      </article>
      <section className="editor" aria-label={lang === "uz" ? "Kod muharriri" : "Code editor"}>
        <div className="editor-top"><b>{codeLanguage === "cpp20" ? "main.cpp" : "main.py"}</b><label className="visually-hidden" htmlFor="problem-language">{lang === "uz" ? "Dasturlash tili" : "Programming language"}</label><select id="problem-language" value={codeLanguage} onChange={(event) => { const next = event.target.value as CodeLanguage; setCodeLanguage(next); setCode(starterFor(item, next)); }}><option value="cpp20">C++20</option><option value="python3">Python 3</option></select></div>
        <textarea aria-label={lang === "uz" ? "Yechim kodi" : "Solution code"} value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} />
        <div className="editor-actions"><span className="verdict" role="status" aria-live="polite">{verdict || (lang === "uz" ? "Yechim yuborishga tayyor" : "Ready to submit")}</span><button className="primary" disabled={busy} onClick={() => void submit()}>{busy ? (lang === "uz" ? "Tekshirilmoqda…" : "Judging…") : (lang === "uz" ? "Yechimni yuborish" : "Submit solution")}</button></div>
      </section>
    </div> : <div className="panel preview-panel"><div className="notice" role="status">{lang === "uz" ? "Bu masala hozircha faqat ko‘rib chiqish uchun ochiq. Server testlari tayyor bo‘lgach yuborish tugmasi yoqiladi." : "This problem is currently available as a preview. Submission will open after server tests are ready."}</div></div>}
  </>;
}
