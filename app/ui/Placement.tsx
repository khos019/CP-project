"use client";

/* The level check.
 *
 * What it replaces: ten fixed questions scored equally, then two coding tasks,
 * then a screen of bars. It could tell a beginner from somebody who had seen a
 * loop, and past that it said the same thing to everyone. Worse, the roadmap
 * ignored the result — units unlock strictly in order, so a learner who
 * already knew binary search still had to walk every unit before it.
 *
 * What this does instead:
 *
 *   - Asks adaptively. Fourteen questions, each chosen for what is still
 *     unknown: right answers make the next one harder, wrong ones back off,
 *     and a track already probed gets deprioritised so breadth wins over
 *     repetition.
 *   - Places the learner on the same rating scale as the problems and the
 *     duel, then reads each track's advertised band to decide how much of it
 *     they are past.
 *   - Actually unlocks the roadmap. The cleared units are marked "Bilasiz"
 *     rather than "Tugatildi" — the site does not pretend they did the work,
 *     it just stops standing in their way.
 *
 * Every answer is explained on the spot. A placement test the learner walks
 * away from having learned nothing is a wasted fifteen minutes.
 */

import { useMemo, useState } from "react";
import { tr, catalogue } from "./i18n";
import { BrandMark } from "./BrandMark";
import { roadmapCatalog } from "./roadmap-data";
import { savePlacement } from "./mastery";
import { placementBank, pickQuestion, shownChoices, shuffleOptions, type ShownQuestion } from "./placement-bank";
import { estimateRating, levelLabel, nextTarget, placeTracks, START_RATING, type Answer } from "./placement-model";

type Lang = "uz" | "en";
type Step = "intro" | "quiz" | "result";

const TOTAL = 14;

const T = catalogue("placement");

export function Placement({
  lang, onFinish, onRoadmap,
}: { lang: Lang; signed?: boolean; onFinish: () => void; onRoadmap: (slug: string) => void }) {
  const t = T[lang];
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [current, setCurrent] = useState<ShownQuestion | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const rating = useMemo(() => estimateRating(answers), [answers]);
  const asked = useMemo(() => new Set(answers.map((a) => a.question.id)), [answers]);
  const tracks = useMemo(() => new Set(answers.map((a) => a.question.track)), [answers]);

  const begin = () => {
    const first = pickQuestion(START_RATING, new Set(), new Set());
    setCurrent(first ? shuffleOptions(first) : null);
    setPicked(null);
    setRevealed(false);
    setStep("quiz");
  };

  const check = () => {
    if (picked === null || !current || revealed) return;
    setRevealed(true);
    setAnswers((list) => [...list, { question: current.question, correct: picked === current.correctAt }]);
  };

  const advance = () => {
    const done = answers.length;
    if (done >= TOTAL || done >= placementBank.length) {
      finish(answers);
      return;
    }
    const target = nextTarget(estimateRating(answers), done);
    const next = pickQuestion(target, asked, tracks);
    if (!next) { finish(answers); return; }
    setCurrent(shuffleOptions(next));
    setPicked(null);
    setRevealed(false);
  };

  const finish = (list: Answer[]) => {
    const level = estimateRating(list);
    const placed = placeTracks(level, list);
    savePlacement({
      level,
      cleared: Object.fromEntries(placed.map((p) => [p.slug, p.cleared])),
      scores: Object.fromEntries(placed.map((p) => [p.slug, p.mastery])),
      answered: list.filter((a) => a.correct).length,
      at: Date.now(),
    });
    setStep("result");
  };

  /* ------------------------------------------------------------- result */
  if (step === "result") {
    const placed = placeTracks(rating, answers);
    const byTrack = new Map(placed.map((p) => [p.slug, p]));
    const openedUnits = placed.reduce((n, p) => n + p.cleared, 0);
    const correct = answers.filter((a) => a.correct).length;
    // Where to begin: the first track that still has something left in it.
    const startAt = roadmapCatalog.find((r) => (byTrack.get(r.slug)?.cleared ?? 0) < r.units.length);

    return (
      <div className="pl-page">
        <div className="page-head">
          <div>
            <p className="eyebrow" style={{ color: "#637068" }}>{t.eyebrow}</p>
            <h1 className="page-title">{t.resultTitle}</h1>
          </div>
          <span className="tag">{levelLabel(rating, lang)}</span>
        </div>

        <div className="pl-summary">
          <div className="pl-stat"><b>{rating}</b><small>{t.estimate}</small></div>
          <div className="pl-stat"><b>{correct}/{answers.length}</b><small>{t.answered}</small></div>
          <div className="pl-stat pl-stat-key"><b>{openedUnits}</b><small>{t.opened}</small></div>
        </div>

        {openedUnits === 0 && <p className="muted">{t.opensNothing}</p>}
        {openedUnits > 0 && <p className="muted">{t.note}</p>}

        <p className="eyebrow" style={{ color: "#637068", marginTop: 26 }}>{t.tracks}</p>
        <div className="pl-tracks">
          {roadmapCatalog.map((r) => {
            const p = byTrack.get(r.slug);
            const share = p ? p.cleared / Math.max(1, p.units) : 0;
            return (
              <button key={r.slug} className="pl-track" onClick={() => onRoadmap(r.slug)}>
                <span className="pl-track-ic" style={{ background: r.color }}>{r.icon}</span>
                <span className="pl-track-body">
                  <b>{lang === "uz" ? r.titleUz : r.titleEn}</b>
                  <span className="pl-track-bar"><i style={{ width: `${Math.round(share * 100)}%`, background: r.color }} /></span>
                  <small className="muted">
                    {p?.cleared ?? 0}/{r.units.length} {t.known}
                    {p?.probed && <em className="pl-probed"> · {tr(lang,"placement.tekshirildi")}</em>}
                  </small>
                </span>
                <span className="pl-track-pct mono">{Math.round(share * 100)}%</span>
              </button>
            );
          })}
        </div>

        <div className="match-actions" style={{ marginTop: 24 }}>
          <button className="primary" onClick={() => (startAt ? onRoadmap(startAt.slug) : onFinish())}>
            {startAt ? `${t.startHere}: ${lang === "uz" ? startAt.titleUz : startAt.titleEn}` : t.go}
          </button>
          <button className="secondary" onClick={onFinish}>{t.go}</button>
          <button className="lang" onClick={() => { setAnswers([]); setStep("intro"); }}>{t.retake}</button>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------- quiz */
  if (step === "quiz" && current) {
    const index = answers.length + (revealed ? 0 : 1);
    const choices = shownChoices(current, lang);
    const track = roadmapCatalog.find((r) => r.slug === current.question.track);
    const wasRight = revealed && picked === current.correctAt;

    return (
      <div className="pl-page">
        <div className="pl-quiz panel">
          <div className="pl-quiz-top">
            <span className="eyebrow" style={{ color: "#637068" }}>
              {Math.min(index, TOTAL)} {t.of} {TOTAL}
            </span>
            <span className="pl-chip" style={{ borderColor: track?.color }}>
              {track ? (lang === "uz" ? track.titleUz : track.titleEn) : current.question.track}
              <i className="mono"> · {current.question.rating}</i>
            </span>
          </div>
          <div className="progress pl-progress"><span style={{ width: `${(answers.length / TOTAL) * 100}%` }} /></div>

          <h2 className="pl-question">{lang === "uz" ? current.question.uz : current.question.en}</h2>

          <div className="quiz-options pl-options">
            {choices.map((c, i) => {
              const state = !revealed ? (picked === i ? "selected" : "")
                : i === current.correctAt ? "right"
                : picked === i ? "wrong" : "";
              return (
                <button key={i} className={state} disabled={revealed} onClick={() => setPicked(i)}>
                  <span>{String.fromCharCode(65 + i)}</span>{c}
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className={`pl-why ${wasRight ? "ok" : "bad"}`}>
              <b>{wasRight ? t.correct : t.wrong}</b>
              <p>{lang === "uz" ? current.question.whyUz : current.question.whyEn}</p>
            </div>
          )}

          {!revealed
            ? <button className="primary pl-cta" disabled={picked === null} onClick={check}>{t.check}</button>
            : <button className="primary pl-cta" onClick={advance}>
                {answers.length >= TOTAL ? t.finish : t.next}
              </button>}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------- intro */
  return (
    <div className="pl-page">
      <div className="pl-intro panel">
        <div className="brand" style={{ justifyContent: "center" }}><BrandMark className="brandmark" />AlgoYo‘l</div>
        <p className="eyebrow" style={{ color: "#637068", marginTop: 22 }}>{t.eyebrow}</p>
        <h1 className="pl-title">{t.welcome}</h1>
        <p className="muted pl-lead">{t.lead}</p>

        <div className="pl-benefits">
          <div><b>{t.b1}</b><small>{t.b1d}</small></div>
          <div><b>{t.b2}</b><small>{t.b2d}</small></div>
          <div><b>{t.b3}</b><small>{t.b3d}</small></div>
        </div>

        <button className="primary pl-cta" onClick={begin}>{t.start}</button>
        <button className="secondary pl-cta" onClick={onFinish}>{t.fresh}</button>
        <button className="lang pl-cta" onClick={onFinish}>{t.skip}</button>
      </div>
    </div>
  );
}
