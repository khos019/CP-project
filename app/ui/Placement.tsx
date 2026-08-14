"use client";

import { useState } from "react";
import { readStoredToken } from "./AuthPage";
import { useLearning } from "./LearningContext";
import { judgeProblems } from "./problem-data";
import { masteryLabel } from "./mastery";
import { roadmapCatalog } from "./roadmap-data";
import type { Lang } from "./AlgoYolApp";

type Question = { id: string; topic: string; uz: string; en: string; choicesUz: string[]; choicesEn: string[] };
type Step = "intro" | "background" | "quiz" | "coding" | "result";
const codingTasks = [judgeProblems["sum-two"], judgeProblems["max-subarray"]];

async function authorized(path: string, init?: RequestInit) {
  const token = readStoredToken();
  if (!token) throw new Error("Authentication required.");
  const response = await fetch(path, { ...init, headers: { authorization: `Bearer ${token}`, ...(init?.body ? { "content-type": "application/json" } : {}), ...init?.headers }, cache: "no-store" });
  const payload = await response.json() as Record<string, unknown>;
  if (!response.ok) throw new Error(String(payload.error || "Placement request failed."));
  return payload;
}

export function Placement({ lang, onFinish, onRoadmap }: { lang: Lang; onFinish: () => void; onRoadmap: (slug: string) => void }) {
  const { masteryConfig, refresh } = useLearning();
  const [step, setStep] = useState<Step>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [background, setBackground] = useState({ language: "C++", experience: "0-1", goal: "olympiad" });
  const [codingIndex, setCodingIndex] = useState(0);
  const [codeLanguage, setCodeLanguage] = useState<"cpp20" | "python3">("cpp20");
  const [code, setCode] = useState(codingTasks[0].cpp);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ mastery: Record<string, number>; recommended: string } | null>(null);

  const begin = async () => {
    setBusy(true); setMessage("");
    try {
      const payload = await authorized("/api/placement");
      if (payload.completed) { setMessage(lang === "uz" ? "Placement avval tugallangan." : "Placement was already completed."); return; }
      setQuestions((payload.questions || []) as Question[]);
      setStep("background");
    } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Placement is unavailable."); }
    finally { setBusy(false); }
  };

  const nextQuestion = () => {
    if (picked === null || !questions[questionIndex]) return;
    setAnswers((current) => ({ ...current, [questions[questionIndex].id]: picked }));
    setPicked(null);
    if (questionIndex + 1 < questions.length) setQuestionIndex((index) => index + 1);
    else setStep("coding");
  };

  const submitCode = async () => {
    const task = codingTasks[codingIndex];
    setBusy(true); setMessage(lang === "uz" ? "Kod tekshirilmoqda…" : "Judging code…");
    try {
      const payload = await authorized("/api/judge", { method: "POST", body: JSON.stringify({ problemId: task.key, language: codeLanguage, sourceCode: code, context: "placement", clientRequestId: crypto.randomUUID() }) });
      setMessage(payload.verdict === "ACCEPTED" ? (lang === "uz" ? "Qabul qilindi." : "Accepted.") : String(payload.verdict || "Judge error"));
    } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Judge error"); }
    finally { setBusy(false); }
  };

  const nextCoding = () => {
    if (codingIndex + 1 < codingTasks.length) {
      const next = codingIndex + 1;
      setCodingIndex(next); setCode(codeLanguage === "cpp20" ? codingTasks[next].cpp : codingTasks[next].python); setMessage("");
    } else void finishPlacement();
  };

  const finishPlacement = async (empty = false) => {
    setBusy(true); setMessage(lang === "uz" ? "Skill profilingiz saqlanmoqda…" : "Saving your skill profile…");
    try {
      const payload = await authorized("/api/placement", { method: "POST", body: JSON.stringify({ background, answers: empty ? {} : answers }) });
      const next = { mastery: (payload.mastery || {}) as Record<string, number>, recommended: String(payload.recommended || "programming-basics") };
      setResult(next); setStep("result"); setMessage(""); await refresh();
    } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Placement could not be saved."); }
    finally { setBusy(false); }
  };

  if (step === "result" && result) {
    return <div className="pl-page"><div className="page-head"><div><p className="eyebrow">PLACEMENT</p><h1 className="page-title">{lang === "uz" ? "Skill profilingiz tayyor" : "Your skill profile is ready"}</h1></div></div><div className="pl-bars panel">{roadmapCatalog.filter((roadmap) => result.mastery[roadmap.slug]).map((roadmap) => { const score = result.mastery[roadmap.slug] || 0; return <div key={roadmap.slug} className="pl-bar"><span className="pl-bar-name">{lang === "uz" ? roadmap.titleUz : roadmap.titleEn}</span><div className="progress"><span style={{ width: `${score / 10}%` }} /></div><b className="mono">{score}</b><small className="muted">{masteryLabel(score, lang, masteryConfig)}</small></div>; })}</div><div className="panel placement-result"><p className="eyebrow">{lang === "uz" ? "Tavsiya etilgan boshlanish" : "Recommended starting point"}</p><h2>{lang === "uz" ? roadmapCatalog.find((roadmap) => roadmap.slug === result.recommended)?.titleUz : roadmapCatalog.find((roadmap) => roadmap.slug === result.recommended)?.titleEn}</h2><div className="match-actions"><button className="primary" onClick={() => onRoadmap(result.recommended)}>{lang === "uz" ? "Roadmapni ochish" : "Open roadmap"} →</button><button className="secondary" onClick={onFinish}>{lang === "uz" ? "Barcha yo‘llar" : "All roadmaps"}</button></div></div></div>;
  }

  return <div className="pl-page"><div className="auth pl-card">
    {step === "intro" ? <><div className="brand"><span className="brandmark">A›</span>AlgoYo‘l</div><h1>{lang === "uz" ? "Qayerdan boshlashni aniqlaymiz" : "Let’s find your starting point"}</h1><p className="muted">{lang === "uz" ? "Qisqa bilim va kod tekshiruvi siz biladigan mavzularni qayta o‘qimaslikka yordam beradi." : "A short knowledge and coding check helps you skip material you already know."}</p>{message ? <div className="notice error" role="alert">{message}</div> : null}<button className="primary full-button" disabled={busy} onClick={() => void begin()}>{lang === "uz" ? "Baholashni boshlash" : "Start assessment"}</button><button className="secondary full-button" disabled={busy} onClick={() => void finishPlacement(true)}>{lang === "uz" ? "Boshlang‘ichdan boshlash" : "Start from the basics"}</button><button className="lang full-button" onClick={onFinish}>{lang === "uz" ? "Keyinroq" : "Later"}</button></> : null}
    {step === "background" ? <><h1>{lang === "uz" ? "Siz haqingizda" : "About you"}</h1><div className="field"><label htmlFor="placement-language">{lang === "uz" ? "Afzal til" : "Preferred language"}</label><select id="placement-language" value={background.language} onChange={(event) => setBackground({ ...background, language: event.target.value })}><option>C++</option><option>Python</option></select></div><div className="field"><label htmlFor="placement-experience">{lang === "uz" ? "Tajriba" : "Experience"}</label><select id="placement-experience" value={background.experience} onChange={(event) => setBackground({ ...background, experience: event.target.value })}><option value="0-1">0–1</option><option value="1-2">1–2</option><option value="2+">2+</option></select></div><div className="field"><label htmlFor="placement-goal">{lang === "uz" ? "Maqsad" : "Goal"}</label><select id="placement-goal" value={background.goal} onChange={(event) => setBackground({ ...background, goal: event.target.value })}><option value="olympiad">{lang === "uz" ? "Olimpiada" : "Olympiad"}</option><option value="interview">{lang === "uz" ? "Ish intervyusi" : "Job interviews"}</option><option value="general">{lang === "uz" ? "Umumiy bilim" : "General knowledge"}</option></select></div><button className="primary full-button" onClick={() => setStep("quiz")}>{lang === "uz" ? "Davom etish" : "Continue"} →</button></> : null}
    {step === "quiz" && questions[questionIndex] ? <><p className="eyebrow">{lang === "uz" ? "Bilim tekshiruvi" : "Knowledge calibration"} · {questionIndex + 1}/{questions.length}</p><div className="progress"><span style={{ width: `${questionIndex / questions.length * 100}%` }} /></div><h2>{lang === "uz" ? questions[questionIndex].uz : questions[questionIndex].en}</h2><div className="quiz-options" role="radiogroup">{(lang === "uz" ? questions[questionIndex].choicesUz : questions[questionIndex].choicesEn).map((choice, index) => <button role="radio" aria-checked={picked === index} className={picked === index ? "selected" : ""} key={choice} onClick={() => setPicked(index)}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div><button className="primary full-button" disabled={picked === null} onClick={nextQuestion}>{lang === "uz" ? "Keyingi" : "Next"} →</button></> : null}
    {step === "coding" ? <><p className="eyebrow">{lang === "uz" ? "Kod kalibratsiyasi" : "Coding calibration"} · {codingIndex + 1}/{codingTasks.length}</p><h2>{lang === "uz" ? codingTasks[codingIndex].uz : codingTasks[codingIndex].en}</h2><div className="code-tabs"><button className={codeLanguage === "cpp20" ? "active" : ""} onClick={() => { setCodeLanguage("cpp20"); setCode(codingTasks[codingIndex].cpp); }}>C++20</button><button className={codeLanguage === "python3" ? "active" : ""} onClick={() => { setCodeLanguage("python3"); setCode(codingTasks[codingIndex].python); }}>Python 3</button></div><textarea className="pl-code" aria-label={lang === "uz" ? "Placement kodi" : "Placement code"} value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} /><p className="verdict" role="status" aria-live="polite">{message}</p><div className="match-actions"><button className="primary" disabled={busy} onClick={() => void submitCode()}>{lang === "uz" ? "Tekshirish" : "Run tests"}</button><button className="secondary" disabled={busy} onClick={nextCoding}>{codingIndex + 1 < codingTasks.length ? (lang === "uz" ? "Keyingi" : "Next") : (lang === "uz" ? "Natija" : "Results")} →</button></div><button className="lang full-button" disabled={busy} onClick={() => void finishPlacement()}>{lang === "uz" ? "Kod qismini o‘tkazib yuborish" : "Skip coding"}</button></> : null}
  </div></div>;
}
