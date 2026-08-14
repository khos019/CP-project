"use client";

import { useMemo, useState } from "react";
import { curriculumGuide } from "./curriculum-guides";
import { unitContent } from "./roadmap-content";
import { roadmapCatalog, type MasteryRoadmap } from "./roadmap-data";
import { masteryLabel } from "./mastery";
import { useLearning, type LearningProgress } from "./LearningContext";

type Lang = "uz" | "en";

export function RoadmapExperience({ slug, lang, onBack, onPractice, onRequireAuth }: { slug: string; lang: Lang; onBack: () => void; onPractice: (lessonId: string) => void; onRequireAuth: () => void }) {
  const roadmap = roadmapCatalog.find((item) => item.slug === slug) || roadmapCatalog[0];
  const [selected, setSelected] = useState<string | null>(null);
  const { progress, mastery, masteryConfig, status, error } = useLearning();
  const completed = useMemo(() => roadmap.units.filter((unit) => (progress.quizScores[unit.id] || 0) >= 70 && progress.solved[unit.id]).length, [progress, roadmap]);
  const isOpen = (index: number) => index === 0 || roadmap.units.slice(0, index).every((unit) => (progress.quizScores[unit.id] || 0) >= 70 && progress.solved[unit.id]);
  const unit = roadmap.units.find((item) => item.id === selected);
  if (unit) {
    const index = roadmap.units.indexOf(unit);
    if (isOpen(index) && status !== "unauthenticated") return <Lesson roadmap={roadmap} unit={unit} index={index} lang={lang} progress={progress} onBack={() => setSelected(null)} onPractice={onPractice} />;
  }
  const topicScore = mastery.scores[roadmap.slug] || 0;
  const progressPercent = Math.round(completed / roadmap.units.length * 100);
  return <div className="mastery-page">
    <button className="crumb" onClick={onBack}>← {lang === "uz" ? "Yo‘l xaritalari" : "Roadmaps"}</button>
    {status === "unavailable" ? <div className="notice error" role="alert">{error}</div> : null}
    {status === "unauthenticated" ? <div className="notice" role="status">{lang === "uz" ? "Yo‘lni ko‘rishingiz mumkin. Darsni boshlash va progressni saqlash uchun tizimga kiring." : "You can preview the path. Sign in to start lessons and save progress."}</div> : null}
    <section className="mastery-hero"><div><span className="road-icon" style={{ background: roadmap.color }}>{roadmap.icon}</span><p className="eyebrow">{roadmap.level} · {roadmap.units.reduce((sum, item) => sum + item.minutes, 0)} MIN</p><h1>{lang === "uz" ? roadmap.titleUz : roadmap.titleEn}</h1><p>{lang === "uz" ? roadmap.descriptionUz : roadmap.descriptionEn}</p></div><div className="mastery-score"><b>{progressPercent}%</b><span>{lang === "uz" ? "o‘rganildi" : "studied"}</span><div className="progress"><span style={{ width: `${progressPercent}%` }} /></div><small>{completed}/{roadmap.units.length} {lang === "uz" ? "bosqich" : "units"}</small><small className="mono mastery-accent">{lang === "uz" ? "Mahorat" : "Mastery"} {topicScore}/1000 · {masteryLabel(topicScore, lang, masteryConfig)}</small></div></section>
    <div className="mastery-layout"><aside className="mastery-info panel"><h3>{lang === "uz" ? "Yo‘l haqida" : "About this path"}</h3><p className="muted">{lang === "uz" ? "Talab" : "Prerequisite"}</p><b>{lang === "uz" ? roadmap.prerequisiteUz : roadmap.prerequisiteEn}</b><p className="muted">{lang === "uz" ? "Tugatish sharti" : "Completion rule"}</p><b>Quiz ≥ 70% + Accepted</b><p className="muted">{lang === "uz" ? "Qolgan vaqt" : "Time remaining"}</p><b>{roadmap.units.slice(completed).reduce((sum, item) => sum + item.minutes, 0)} min</b></aside>
      <section className="path-list" aria-label={lang === "uz" ? "Mavzu bosqichlari" : "Topic units"}>{roadmap.units.map((item, index) => { const open = isOpen(index); const quiz = progress.quizScores[item.id] || 0; const solved = Boolean(progress.solved[item.id]); const done = quiz >= 70 && solved; return <button key={item.id} className={`path-unit ${done ? "done" : open ? "current" : "locked"}`} onClick={() => { if (!open) return; if (status === "unauthenticated") onRequireAuth(); else setSelected(item.id); }} disabled={!open} aria-label={`${lang === "uz" ? item.titleUz : item.titleEn}: ${done ? (lang === "uz" ? "tugallangan" : "completed") : open ? (lang === "uz" ? "ochiq" : "available") : (lang === "uz" ? "qulflangan" : "locked")}`}><span className="path-node" aria-hidden="true">{done ? "✓" : open ? String(index + 1).padStart(2, "0") : "●"}</span><span className="path-copy"><small>{item.rating} · {item.minutes} MIN</small><b>{lang === "uz" ? item.titleUz : item.titleEn}</b><em>{lang === "uz" ? item.summaryUz : item.summaryEn}</em><span className="unit-checks"><i className={quiz >= 70 ? "ok" : ""}>Quiz {quiz || 0}%</i><i className={solved ? "ok" : ""}>Problem {solved ? "AC" : "—"}</i></span></span><span className="unit-arrow">{open ? "→" : lang === "uz" ? "QULFLANGAN" : "LOCKED"}</span></button>; })}</section>
    </div>
  </div>;
}

function Lesson({ roadmap, unit, index, lang, progress, onBack, onPractice }: { roadmap: MasteryRoadmap; unit: MasteryRoadmap["units"][number]; index: number; lang: Lang; progress: LearningProgress; onBack: () => void; onPractice: (id: string) => void }) {
  const guide = curriculumGuide(roadmap.slug);
  const content = unitContent[unit.id];
  const localized = <T extends { uz: string; en: string }>(value: T) => lang === "uz" ? value.uz : value.en;
  const [codeLang, setCodeLang] = useState<"cpp" | "python">("cpp");
  const [answer, setAnswer] = useState<number | null>(null);
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const { submitQuiz } = useLearning();
  const solved = Boolean(progress.solved[unit.id]);
  const passed = (progress.quizScores[unit.id] || 0) >= 70;
  const saveQuiz = async () => { if (answer === null || busy) return; setBusy(true); setResult(""); try { const outcome = await submitQuiz(unit.id, answer); setResult(outcome.correct ? (lang === "uz" ? `To‘g‘ri — +${outcome.delta} mahorat` : `Correct — +${outcome.delta} mastery`) : (lang === "uz" ? "Noto‘g‘ri. Invariant va misolni qayta ko‘ring." : "Not quite. Review the invariant and worked example.")); } catch (caught) { setResult(caught instanceof Error ? caught.message : (lang === "uz" ? "Natija saqlanmadi." : "Result was not saved.")); } finally { setBusy(false); } };
  return <div className="lesson-page">
    <button className="crumb" onClick={onBack}>← {lang === "uz" ? roadmap.titleUz : roadmap.titleEn}</button>
    <div className="lesson-head"><div><p className="eyebrow">UNIT {index + 1}/{roadmap.units.length} · {unit.rating}</p><h1>{lang === "uz" ? unit.titleUz : unit.titleEn}</h1><p className="muted">{lang === "uz" ? unit.summaryUz : unit.summaryEn}</p></div><div className="lesson-state"><span className={passed ? "passed" : ""}>Quiz {progress.quizScores[unit.id] || 0}%</span><span className={solved ? "passed" : ""}>Problem {solved ? "AC" : "—"}</span></div></div>
    <div className="lesson-grid"><article className="lesson-content panel">
      <LessonSection number="01" title={lang === "uz" ? "Maqsad" : "Goal"}><p>{content ? (lang === "uz" ? content.goalUz : content.goalEn) : (lang === "uz" ? unit.summaryUz : unit.summaryEn)}</p></LessonSection>
      <LessonSection number="02" title={lang === "uz" ? "Oldingi bilim" : "Prerequisites"}><p>{lang === "uz" ? roadmap.prerequisiteUz : roadmap.prerequisiteEn}</p></LessonSection>
      <LessonSection number="03" title={lang === "uz" ? "Intuitsiya" : "Intuition"}><p>{content ? (lang === "uz" ? content.intuitionUz : content.intuitionEn) : localized(guide.intuition)}</p></LessonSection>
      <LessonSection number="04" title={lang === "uz" ? "Asosiy tushuncha va invariant" : "Core concept and invariant"}><p>{content ? (lang === "uz" ? content.coreUz : content.coreEn) : localized(guide.invariant)}</p></LessonSection>
      <LessonSection number="05" title={lang === "uz" ? "Lug‘at" : "Vocabulary"}><p className="lesson-vocabulary">{localized(guide.vocabulary)}</p></LessonSection>
      <LessonSection number="06" title={lang === "uz" ? "Vizual model" : "Visual model"}><div className="concept-flow"><span>{lang === "uz" ? "Cheklov" : "Constraint"}</span><b>→</b><span>{lang === "uz" ? "Holat" : "State"}</span><b>→</b><span>{lang === "uz" ? "Invariant" : "Invariant"}</span><b>→</b><span>{lang === "uz" ? "Javob" : "Answer"}</span></div></LessonSection>
      <LessonSection number="07" title={lang === "uz" ? "Murakkablik" : "Complexity"}><div className="concept-box"><b>{lang === "uz" ? "Kutilgan chegara" : "Expected bound"}</b><code>{unit.complexity}</code></div></LessonSection>
      <LessonSection number="08" title={lang === "uz" ? "Ishlangan misol" : "Worked example"}><p>{content ? (lang === "uz" ? content.walkUz : content.walkEn) : localized(guide.workedExample)}</p></LessonSection>
      <LessonSection number="09" title={lang === "uz" ? "Implementatsiya" : "Implementation"}><div className="code-tabs" role="group" aria-label={lang === "uz" ? "Kod tili" : "Code language"}><button className={codeLang === "cpp" ? "active" : ""} onClick={() => setCodeLang("cpp")}>C++20</button><button className={codeLang === "python" ? "active" : ""} onClick={() => setCodeLang("python")}>Python 3</button></div><pre className="lesson-code"><code>{codeLang === "cpp" ? unit.cpp : unit.python}</code></pre></LessonSection>
      <LessonSection number="10" title={lang === "uz" ? "Qadam-baqadam tekshiruv" : "Walkthrough"}><ol className="lesson-checklist">{content ? (lang === "uz" ? content.hintsUz : content.hintsEn).map((hint) => <li key={hint}>{hint}</li>) : <><li>{lang === "uz" ? "Kirish chegarasidan mos murakkablikni chiqaring." : "Derive the allowed complexity from constraints."}</li><li>{lang === "uz" ? "Holat va invariantni bitta jumlada yozing." : "State the data and invariant in one sentence."}</li></>}</ol></LessonSection>
      <LessonSection number="11" title={lang === "uz" ? "Ko‘p uchraydigan xatolar" : "Common mistakes"}><ul className="lesson-checklist">{content ? (lang === "uz" ? content.mistakesUz : content.mistakesEn).map((mistake) => <li key={mistake}>{mistake}</li>) : guide.mistakes.map((mistake) => <li key={mistake.en}>{localized(mistake)}</li>)}</ul></LessonSection>
      <LessonSection number="12" title={lang === "uz" ? "Patternni tanish" : "Pattern recognition"}><p>{content ? (lang === "uz" ? content.patternUz : content.patternEn) : localized(guide.recognition)}</p></LessonSection>
      <LessonSection number="17" title={lang === "uz" ? "Qisqa xulosa" : "Recap"}><p>{content ? (lang === "uz" ? content.recapUz : content.recapEn) : (lang === "uz" ? `Masala ${unit.titleUz} ga o‘xshasa, avval cheklovni tekshiring.` : `When a task resembles ${unit.titleEn}, check its constraints first.`)}</p></LessonSection>
      <LessonSection number="18" title={lang === "uz" ? "Keyingi qadam" : "Next step"}><p>{content ? (lang === "uz" ? content.nextUz : content.nextEn) : (lang === "uz" ? "Quiz va mustaqil masalani tugating." : "Complete the quiz and independent problem.")}</p></LessonSection>
    </article><aside className="lesson-actions">
      <div className="quiz-card panel"><span className="lesson-number">13</span><h3>{lang === "uz" ? "Bilimni tekshiring" : "Check your understanding"}</h3><p>{lang === "uz" ? unit.quiz.questionUz : unit.quiz.questionEn}</p><div className="quiz-options" role="radiogroup" aria-label={lang === "uz" ? "Javob variantlari" : "Answer choices"}>{(lang === "uz" ? unit.quiz.choicesUz : unit.quiz.choicesEn).map((choice, choiceIndex) => <button key={choice} role="radio" aria-checked={answer === choiceIndex} className={answer === choiceIndex ? "selected" : ""} onClick={() => setAnswer(choiceIndex)}><span>{String.fromCharCode(65 + choiceIndex)}</span>{choice}</button>)}</div><button className="primary" disabled={answer === null || busy} onClick={() => void saveQuiz()}>{busy ? (lang === "uz" ? "Saqlanmoqda…" : "Saving…") : (lang === "uz" ? "Javobni tekshirish" : "Check answer")}</button>{result ? <div className="quiz-result" role="status" aria-live="polite">{result}</div> : null}</div>
      <div className="practice-card panel"><span className="lesson-number">14–15</span><h3>{lang === "uz" ? "Yo‘naltirilgan va mustaqil mashq" : "Guided and independent practice"}</h3><p className="muted">{lang === "uz" ? "Avval misolni qog‘ozda yuring, so‘ng yechimga qaramasdan kod yozing." : "Trace the example first, then code without looking at a solution."}</p><p className="muted">{unit.problemId} · {lang === "uz" ? "Tekshiruvchida Accepted shart." : "An Accepted verdict is required."}</p><button className="primary" onClick={() => onPractice(unit.id)}>{solved ? (lang === "uz" ? "Qayta yechish" : "Solve again") : (lang === "uz" ? "Masalani yechish" : "Solve problem")} →</button></div>
      <div className={`unlock-card ${passed && solved ? "ready" : ""}`}><span className="lesson-number">16</span><b>{passed && solved ? (lang === "uz" ? "Mastery checkpoint o‘tdi" : "Mastery checkpoint passed") : (lang === "uz" ? "Keyingi bosqich qulflangan" : "Next unit locked")}</b><small>{lang === "uz" ? "Quiz ≥70% va masalada AC kerak" : "Quiz ≥70% and problem AC required"}</small></div>
    </aside></div>
  </div>;
}

function LessonSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <section className="lesson-section"><span className="lesson-number">{number}</span><h2>{title}</h2>{children}</section>;
}
