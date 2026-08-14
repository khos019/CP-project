"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { readStoredToken } from "./AuthPage";
import { useLearning } from "./LearningContext";
import { judgeProblems, starterFor, type JudgeProblemKey } from "./problem-data";
import type { Lang, Profile } from "./AlgoYolApp";

type DuelSnapshot = {
  status: "idle" | "queued" | "active" | "finished" | "cancelled";
  duel?: {
    id: string;
    endsAt: string | null;
    currentStage: number;
    problems: Array<{ stage: number; problem_key: JudgeProblemKey; points: number; claimed_by: string | null }>;
    participants: Array<{ user_id: string; score: number; rating_before: number; rating_after: number | null; profile: { username: string; display_name: string } | null }>;
  };
};

async function duelFetch(method: "GET" | "POST" | "DELETE" = "GET", duelId?: string) {
  const token = readStoredToken();
  if (!token) throw new Error("AUTH_REQUIRED");
  const response = await fetch(`/api/duels${duelId ? `?duelId=${encodeURIComponent(duelId)}` : ""}`, { method, headers: { authorization: `Bearer ${token}` }, cache: "no-store" });
  const payload = await response.json() as DuelSnapshot & { error?: string };
  if (!response.ok) throw new Error(payload.error || "Duel service is unavailable.");
  return payload;
}

export function DuelPage({ lang, profile, requireAuth }: { lang: Lang; profile: Profile | null; requireAuth: () => void }) {
  const { duelSettings, status: learningStatus, refresh } = useLearning();
  const [snapshot, setSnapshot] = useState<DuelSnapshot>({ status: "idle" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [codeLanguage, setCodeLanguage] = useState<"cpp20" | "python3">("cpp20");
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const duelIdRef = useRef<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!profile) return;
    try { const next = await duelFetch("GET", duelIdRef.current); duelIdRef.current = next.duel?.id; setSnapshot(next); }
    catch (caught) { setMessage(caught instanceof Error ? caught.message : "Duel service is unavailable."); }
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    const first = window.setTimeout(() => void load(), 0);
    const poll = window.setInterval(() => void load(), snapshot.status === "queued" ? 2500 : 5000);
    return () => { window.clearTimeout(first); window.clearInterval(poll); };
  }, [load, profile, snapshot.status]);

  useEffect(() => {
    const endsAt = snapshot.duel?.endsAt;
    if (!endsAt || snapshot.status !== "active") return;
    const update = () => setSecondsLeft(Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 1000)));
    const initial = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 1000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [snapshot.duel?.endsAt, snapshot.status]);

  const activeProblem = useMemo(() => {
    const row = snapshot.duel?.problems.find((problem) => problem.stage === Math.min(snapshot.duel?.currentStage || 0, 2));
    return row ? judgeProblems[row.problem_key] : null;
  }, [snapshot.duel]);

  useEffect(() => {
    if (!activeProblem) return;
    const initial = window.setTimeout(() => setCode(starterFor({ id: activeProblem.code, uz: activeProblem.uz, en: activeProblem.en, difficulty: activeProblem.difficulty, tag: "Duel", points: activeProblem.points, topic: "", judge: activeProblem.key }, codeLanguage)), 0);
    return () => window.clearTimeout(initial);
  }, [activeProblem, codeLanguage]);

  if (!profile) return <DuelGate lang={lang} requireAuth={requireAuth} />;

  const join = async () => {
    setBusy(true); setMessage("");
    try { const next = await duelFetch("POST"); duelIdRef.current = next.duel?.id; setSnapshot(next); }
    catch (caught) { setMessage(caught instanceof Error ? caught.message : "Duel service is unavailable."); }
    finally { setBusy(false); }
  };
  const leave = async () => { setBusy(true); try { const next = await duelFetch("DELETE"); duelIdRef.current = undefined; setSnapshot(next); } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Duel service is unavailable."); } finally { setBusy(false); } };
  const submit = async () => {
    if (!activeProblem || !snapshot.duel) return;
    setBusy(true); setMessage(lang === "uz" ? "Yechim tekshirilmoqda…" : "Judging solution…");
    try {
      const token = readStoredToken();
      const response = await fetch("/api/judge", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ problemId: activeProblem.key, language: codeLanguage, sourceCode: code, context: "duel", duelId: snapshot.duel.id, clientRequestId: crypto.randomUUID() }) });
      const payload = await response.json() as { verdict?: string; error?: string; duelClaim?: { claimed?: boolean; points?: number } };
      if (!response.ok) throw new Error(payload.error || "Submission failed.");
      setMessage(payload.verdict === "ACCEPTED" ? (payload.duelClaim?.claimed ? `${lang === "uz" ? "Qabul qilindi" : "Accepted"} · +${payload.duelClaim.points}` : (lang === "uz" ? "Qabul qilindi, lekin bosqich avval egallangan." : "Accepted, but the stage was already claimed.")) : (payload.verdict || "Judge error"));
      await Promise.all([load(), refresh()]);
    } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Submission failed."); }
    finally { setBusy(false); }
  };

  if (snapshot.status === "active" && snapshot.duel) {
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const seconds = String(secondsLeft % 60).padStart(2, "0");
    return <div className="duel-layout"><section className="arena"><div className="duel-top"><span className="tag">{lang === "uz" ? "Jonli duel" : "Live duel"}</span><span className={`timer ${secondsLeft < 60 ? "low" : ""}`}>{minutes}:{seconds}</span></div><div className="players">{snapshot.duel.participants.map((participant, index) => <span key={participant.user_id}><article className={`player ${participant.user_id === profile.id ? "lead" : ""}`}><span className="who">{participant.profile?.display_name || participant.profile?.username || (lang === "uz" ? "Ishtirokchi" : "Participant")}</span><b className="score">{participant.score}</b><small className="sub">ELO {participant.rating_before}</small></article>{index === 0 ? <span className="versus">VS</span> : null}</span>)}</div>{activeProblem ? <><div className="duel-problem"><span className="tag">{activeProblem.code} · {activeProblem.points}</span><h2>{lang === "uz" ? activeProblem.uz : activeProblem.en}</h2><p>{lang === "uz" ? activeProblem.statementUz : activeProblem.statementEn}</p><pre className="sample">{activeProblem.sample}</pre></div><div className="duel-editor"><div className="editor-top"><b>{codeLanguage === "cpp20" ? "main.cpp" : "main.py"}</b><select aria-label={lang === "uz" ? "Dasturlash tili" : "Programming language"} value={codeLanguage} onChange={(event) => setCodeLanguage(event.target.value as "cpp20" | "python3")}><option value="cpp20">C++20</option><option value="python3">Python 3</option></select></div><textarea aria-label={lang === "uz" ? "Duel yechimi" : "Duel solution"} value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} /><div className="editor-actions"><span className="duel-verdict" role="status" aria-live="polite">{message}</span><button className="primary" disabled={busy} onClick={() => void submit()}>{lang === "uz" ? "Yuborish" : "Submit"}</button></div></div></> : <div className="notice">{lang === "uz" ? "Natija yakunlanmoqda…" : "Finalizing results…"}</div>}</section><aside className="side-stack"><section className="duel-card"><h3>{lang === "uz" ? "Bosqichlar" : "Stages"}</h3>{snapshot.duel.problems.map((problem) => <div className="status-line" key={problem.stage}><span>#{problem.stage + 1} · {problem.points}</span><b>{problem.claimed_by ? "✓" : problem.stage === snapshot.duel?.currentStage ? "▶" : "○"}</b></div>)}</section></aside></div>;
  }

  if (snapshot.status === "finished" && snapshot.duel) return <div className="panel duel-result"><div className="result-badge draw">✓</div><h2>{lang === "uz" ? "Duel yakunlandi" : "Duel finished"}</h2><div className="stage-table">{snapshot.duel.participants.map((participant) => <div className="stage-row" key={participant.user_id}><span className="tag">{participant.user_id === profile.id ? (lang === "uz" ? "Siz" : "You") : (lang === "uz" ? "Raqib" : "Opponent")}</span><span>{participant.profile?.display_name || participant.profile?.username}</span><b>{participant.score}</b><span className="rating">{participant.rating_after ?? participant.rating_before}</span></div>)}</div><button className="primary" onClick={() => { duelIdRef.current = undefined; setSnapshot({ status: "idle" }); }}>{lang === "uz" ? "Yana o‘ynash" : "Play again"}</button></div>;

  return <div className="panel matchmaking"><div className={`search-orb ${snapshot.status === "queued" ? "pulse" : ""}`} aria-hidden="true">⚡</div><h1>{snapshot.status === "queued" ? (lang === "uz" ? "Raqib qidirilmoqda" : "Finding an opponent") : (lang === "uz" ? "Jonli duel" : "Live duel")}</h1><p className="muted">{duelSettings.problemCount} {lang === "uz" ? "masala" : "problems"} · {Math.round(duelSettings.durationSeconds / 60)} {lang === "uz" ? "daqiqa" : "minutes"}</p>{message ? <div className="notice error" role="alert">{message}</div> : null}<div className="match-actions">{snapshot.status === "queued" ? <button className="secondary" disabled={busy} onClick={() => void leave()}>{lang === "uz" ? "Navbatdan chiqish" : "Leave queue"}</button> : <button className="primary" disabled={busy || learningStatus === "loading" || !duelSettings.enabled} onClick={() => void join()}>{duelSettings.enabled ? (lang === "uz" ? "Raqib topish" : "Find opponent") : (lang === "uz" ? "Duel hozircha yopiq" : "Duels unavailable")}</button>}</div></div>;
}

function DuelGate({ lang, requireAuth }: { lang: Lang; requireAuth: () => void }) {
  return <div className="panel matchmaking"><div className="search-orb" aria-hidden="true">⚡</div><h1>{lang === "uz" ? "Jonli duel" : "Live duel"}</h1><p className="muted">{lang === "uz" ? "Raqib topish va natijani saqlash uchun tizimga kiring." : "Sign in to find an opponent and save verified results."}</p><button className="primary" onClick={requireAuth}>{lang === "uz" ? "Tizimga kirish" : "Sign in"}</button></div>;
}
