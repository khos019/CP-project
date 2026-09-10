"use client";

/* The level check.
 *
 * One roadmap section at a time. Each section gets up to six questions — two
 * basic, two core, two deep, easiest first — and every correct answer adds
 * mastery to that section and nowhere else. A section that reaches the
 * completion threshold counts as done, and the sections that depend on it open
 * (see placement-model.ts for the arithmetic and RoadmapHub.tsx for the gate).
 *
 * What the screen owes the learner, and where it pays it:
 *
 *   - The rule, before they start. The intro states the points per tier and the
 *     two thresholds in numbers, taken from the live mastery config, so the
 *     page cannot promise something the roadmap does not do.
 *   - Where they stand, while they answer. The header carries this section's
 *     mastery on a bar marked at "opens" and "complete", and the button says
 *     what the current question is worth.
 *   - An exit that is not a failure. "I don't know this section" moves on
 *     without penalty, two wrong answers end a section on their own, and the
 *     test can be finished at any point with what has been answered so far.
 *   - Why, after every answer. A level check the learner walks away from having
 *     learned nothing is a wasted quarter of an hour.
 */

import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import { catalogue } from "./i18n";
import { BrandMark } from "./BrandMark";
import { roadmapCatalog } from "./roadmap-data";
import { loadMasteryConfig, loadPlacement, savePlacement, useMastery } from "./mastery";
import { readLocal } from "./progress";
import { roadmapStatus } from "./RoadmapHub";
import {
  PER_TIER, TIERS, placementBank, sectionQuestions, shownChoices, shuffleOptions,
  type PlacementQuestion, type ShownQuestion, type Tier,
} from "./placement-bank";
import {
  SECTION_CAP, TIER_POINTS, WRONG_LIMIT, estimateRating, levelLabel, placeTracks, sectionScore,
  type Answer,
} from "./placement-model";

type Lang = "uz" | "en";
type Step = "intro" | "quiz" | "result";

const T = catalogue("placement");
const PER_SECTION = PER_TIER * TIERS.length;
/* Sections that actually have questions. Every roadmap section does today; the
   filter keeps a newly added section from producing an empty quiz step. */
const SECTIONS = roadmapCatalog.filter((r) => placementBank.some((q) => q.track === r.slug));

/** Inline `code` spans inside question and option text. Plain parts stay bare
 *  text nodes: an option button styles its `span` children as the letter badge. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return <>{parts.map((p, i) => p.startsWith("`") && p.endsWith("`") && p.length > 1
    ? <code key={i} className="pl-inline">{p.slice(1, -1)}</code>
    : <Fragment key={i}>{p}</Fragment>)}</>;
}

/** A section's mastery on the 0–1000 scale, with the two thresholds marked. */
function Meter({ score, unlock, complete, color }: { score: number; unlock: number; complete: number; color?: string }) {
  return (
    <span className="pl-meter" aria-hidden="true">
      <i className="pl-meter-fill" style={{ width: `${Math.min(100, score / 10)}%`, background: color }} />
      <i className="pl-meter-tick" style={{ left: `${unlock / 10}%` }} />
      <i className="pl-meter-tick key" style={{ left: `${complete / 10}%` }} />
    </span>
  );
}

type SectionState = "complete" | "open" | "started" | "none" | "untested";

export function Placement({
  lang, onFinish, onRoadmap,
}: { lang: Lang; signed?: boolean; onFinish: () => void; onRoadmap: (slug: string) => void }) {
  const t = T[lang];
  const [step, setStep] = useState<Step>("intro");
  const [config, setConfig] = useState(() => ({ unlock: 450, complete: 700 }));
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const [chosen, setChosen] = useState<Set<string>>(() => new Set(SECTIONS.map((r) => r.slug)));

  const [plan, setPlan] = useState<string[]>([]);
  const [sectionAt, setSectionAt] = useState(0);
  const [queue, setQueue] = useState<PlacementQuestion[]>([]);
  const [qAt, setQAt] = useState(0);
  const [current, setCurrent] = useState<ShownQuestion | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [finished, setFinished] = useState<Answer[]>([]);
  const mastery = useMastery();

  /* Storage is read after mount, never during render — the first render must
     match what the server sent — and again whenever progress or the owner's
     thresholds change. */
  useEffect(() => {
    const sync = () => {
      const c = loadMasteryConfig();
      setConfig({ unlock: c.unlock, complete: c.complete });
      setSeen(new Set(loadPlacement()?.seen || []));
    };
    sync();
    window.addEventListener("algoyol-progress", sync);
    return () => window.removeEventListener("algoyol-progress", sync);
  }, []);

  const slug = plan[sectionAt];
  const section = SECTIONS.find((r) => r.slug === slug);
  const inSection = useMemo(() => answers.filter((a) => a.question.track === slug), [answers, slug]);
  const wrongHere = inSection.filter((a) => !a.correct).length;
  const scoreHere = sectionScore(answers, slug || "");
  /* This reveal closes the section when it was the last question or the second miss. */
  const sectionOver = revealed && (qAt + 1 >= queue.length || wrongHere >= WRONG_LIMIT);

  const title = (s: { titleUz: string; titleEn: string }) => (lang === "uz" ? s.titleUz : s.titleEn);
  const stateOf = (score: number, tested: boolean): SectionState =>
    !tested ? "untested" : score >= config.complete ? "complete" : score >= config.unlock ? "open" : score > 0 ? "started" : "none";
  const stateLabel: Record<SectionState, string> = {
    complete: t.stComplete, open: t.stOpen, started: t.stStarted, none: t.stNone, untested: t.stUntested,
  };
  const tierLabel: Record<Tier, string> = { basic: t.tierBasic, core: t.tierCore, deep: t.tierDeep };

  const openSection = (list: string[], index: number) => {
    const questions = sectionQuestions(list[index], seen);
    setSectionAt(index);
    setQueue(questions);
    setQAt(0);
    setCurrent(questions.length ? shuffleOptions(questions[0]) : null);
    setPicked(null);
    setRevealed(false);
  };

  const begin = () => {
    const list = SECTIONS.map((r) => r.slug).filter((s) => chosen.has(s));
    if (!list.length) return;
    setPlan(list);
    setAnswers([]);
    openSection(list, 0);
    setStep("quiz");
    window.scrollTo({ top: 0 });
  };

  const check = () => {
    if (picked === null || !current || revealed) return;
    setRevealed(true);
    setAnswers((list) => [...list, { question: current.question, correct: picked === current.correctAt }]);
  };

  const finish = (list: Answer[]) => {
    const placed = placeTracks(list, config);
    const shown = list.map((a) => a.question.id);
    savePlacement({
      level: estimateRating(list),
      cleared: Object.fromEntries(placed.filter((p) => p.probed).map((p) => [p.slug, p.cleared])),
      scores: Object.fromEntries(placed.filter((p) => p.probed).map((p) => [p.slug, p.mastery])),
      answered: list.filter((a) => a.correct).length,
      at: Date.now(),
      seen: shown,
    });
    setSeen((prev) => new Set([...prev, ...shown]));
    setFinished(list);
    setStep("result");
    window.scrollTo({ top: 0 });
  };

  const nextSection = (list: Answer[]) => {
    if (sectionAt + 1 >= plan.length) { finish(list); return; }
    openSection(plan, sectionAt + 1);
  };

  const advance = () => {
    if (sectionOver) { nextSection(answers); return; }
    const at = qAt + 1;
    setQAt(at);
    setCurrent(shuffleOptions(queue[at]));
    setPicked(null);
    setRevealed(false);
  };

  /* "I don't know this section": the question on screen is recorded as a skip —
     no mastery, but the overall estimate hears that this is unfamiliar. */
  const skipSection = () => {
    const list = current && !revealed ? [...answers, { question: current.question, correct: false, skipped: true }] : answers;
    setAnswers(list);
    nextSection(list);
  };

  /* Finish with what has been answered; an unanswered question on screen is
     simply not counted. */
  const stopHere = () => finish(answers);

  /* ------------------------------------------------------------- result */
  if (step === "result") {
    const placed = placeTracks(finished, config);
    const bySlug = new Map(placed.map((p) => [p.slug, p]));
    const rating = estimateRating(finished);
    const real = finished.filter((a) => !a.skipped);
    const right = real.filter((a) => a.correct).length;
    const completed = placed.filter((p) => p.probed && p.mastery >= config.complete).length;
    const opened = placed.filter((p) => p.probed && p.mastery >= config.unlock && p.mastery < config.complete).length;
    // Where to go next: the first section in roadmap order the learner can open
    // and has not finished, now that this result has been applied.
    const progress = readLocal();
    const startAt = roadmapCatalog.find((r) => {
      const s = roadmapStatus(r, progress, mastery);
      return s === "available" || s === "in-progress";
    });

    return (
      <div className="pl-page">
        <div className="page-head">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="page-title">{t.resultTitle}</h1>
          </div>
          {real.length > 0 && <span className="tag">{levelLabel(rating, lang)} · ~{rating}</span>}
        </div>

        <div className="pl-summary">
          <div className="pl-stat pl-stat-key"><b>{completed}</b><small>{t.completedCount}</small></div>
          <div className="pl-stat"><b>{opened}</b><small>{t.openedCount}</small></div>
          <div className="pl-stat"><b>{right}/{real.length}</b><small>{t.answered}</small></div>
        </div>

        <p className="muted pl-note">
          {completed > 0 ? t.noteComplete.replace("{n}", String(config.complete))
            : opened > 0 ? t.noteOpen.replace("{n}", String(config.unlock))
            : t.noteNothing}
        </p>

        <p className="eyebrow pl-list-head">{t.tracks}</p>
        <div className="pl-tracks">
          {SECTIONS.map((r) => {
            const p = bySlug.get(r.slug);
            const tested = !!p?.probed;
            const score = p?.mastery ?? 0;
            const state = stateOf(score, tested);
            return (
              <button key={r.slug} className={`pl-track ${state}`} onClick={() => onRoadmap(r.slug)}>
                <span className="pl-track-ic" style={{ background: r.color }}>{r.icon}</span>
                <span className="pl-track-body">
                  <span className="pl-track-line">
                    <b>{title(r)}</b>
                    <span className={`pl-state ${state}`}>{state === "complete" ? "✓ " : ""}{stateLabel[state]}</span>
                  </span>
                  <Meter score={score} unlock={config.unlock} complete={config.complete} color={r.color} />
                  {tested && <small className="muted">
                    {t.trackLine.replace("{right}", String(p!.right)).replace("{asked}", String(p!.asked))}
                    {p!.cleared > 0 && <> · {t.unitsOpened.replace("{n}", String(p!.cleared)).replace("{total}", String(p!.units))}</>}
                  </small>}
                </span>
                <span className="pl-track-pct mono">{tested ? score : "—"}</span>
              </button>
            );
          })}
        </div>

        <div className="pl-actions">
          {startAt && <button className="primary" onClick={() => onRoadmap(startAt.slug)}>{t.startHere}: {title(startAt)}</button>}
          <button className="secondary" onClick={onFinish}>{t.go}</button>
          <button className="lang" onClick={() => { setAnswers([]); setFinished([]); setStep("intro"); }}>{t.retake}</button>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------- quiz */
  if (step === "quiz" && current && section) {
    const q = current.question;
    const choices = shownChoices(current, lang);
    const wasRight = revealed && picked === current.correctAt;
    const points = TIER_POINTS[q.tier];
    const state = stateOf(scoreHere, true);
    const lastSection = sectionAt + 1 >= plan.length;

    return (
      <div className="pl-page">
        <div className="pl-quiz panel">
          <div className="pl-quiz-top">
            <span className="pl-section">
              <span className="pl-track-ic sm" style={{ background: section.color }}>{section.icon}</span>
              <span>
                <b>{title(section)}</b>
                <small className="muted">
                  {t.sectionOf.replace("{i}", String(sectionAt + 1)).replace("{n}", String(plan.length))}
                  {" · "}
                  {t.questionOf.replace("{i}", String(qAt + 1)).replace("{n}", String(queue.length || PER_SECTION))}
                </small>
              </span>
            </span>
            <span className="pl-score mono" title={t.masteryHint}>
              {scoreHere}<small>/1000</small>
            </span>
          </div>
          <Meter score={scoreHere} unlock={config.unlock} complete={config.complete} color={section.color} />
          <div className="pl-meter-legend muted">
            <span style={{ left: `${config.unlock / 10}%` }}>{t.legendOpen.replace("{n}", String(config.unlock))}</span>
            <span className="key" style={{ left: `${config.complete / 10}%` }}>{t.legendComplete.replace("{n}", String(config.complete))}</span>
          </div>

          <div className="pl-steps" aria-hidden="true">
            {queue.map((item, i) => {
              const a = inSection[i];
              const cls = a ? (a.correct ? "ok" : "bad") : i === qAt ? "now" : "";
              return <i key={item.id} className={cls} />;
            })}
          </div>

          <span className={`pl-tier ${q.tier}`}>{tierLabel[q.tier]} · +{points}</span>
          <h2 className="pl-question"><Rich text={lang === "uz" ? q.uz : q.en} /></h2>
          {q.code && <pre className="pl-code"><code>{q.code}</code></pre>}

          <div className="quiz-options pl-options">
            {choices.map((c, i) => {
              const cls = !revealed ? (picked === i ? "selected" : "")
                : i === current.correctAt ? "right"
                : picked === i ? "wrong" : "";
              return (
                <button key={i} className={cls} disabled={revealed} onClick={() => setPicked(i)}>
                  <span>{String.fromCharCode(65 + i)}</span><em><Rich text={c} /></em>
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className={`pl-why ${wasRight ? "ok" : "bad"}`}>
              <b>{wasRight ? `${t.correct} · +${points}` : t.wrong}</b>
              <p><Rich text={lang === "uz" ? q.whyUz : q.whyEn} /></p>
            </div>
          )}

          {sectionOver && (
            <div className={`pl-section-end ${state}`}>
              <b>{title(section)}: {scoreHere} {t.mastery} — {stateLabel[state]}</b>
              <small>
                {wrongHere >= WRONG_LIMIT && qAt + 1 < queue.length ? t.stoppedEarly
                  : state === "complete" ? t.endComplete
                  : state === "open" ? t.endOpen
                  : t.endLow}
              </small>
            </div>
          )}

          {!revealed
            ? <button className="primary pl-cta" disabled={picked === null} onClick={check}>{t.check}</button>
            : <button className="primary pl-cta" onClick={advance}>
                {!sectionOver ? t.next : lastSection ? t.finish : t.nextSection}
              </button>}

          <div className="pl-exits">
            {!sectionOver && !lastSection && <button className="lang" onClick={skipSection}>{t.dontKnow}</button>}
            {!sectionOver && lastSection && <button className="lang" onClick={skipSection}>{t.dontKnowLast}</button>}
            {answers.length > 0 && <button className="lang" onClick={stopHere}>{t.stopHere}</button>}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------- intro */
  const count = chosen.size;
  const toggle = (s: string) => setChosen((prev) => {
    const next = new Set(prev);
    if (next.has(s)) next.delete(s); else next.add(s);
    return next;
  });
  const rule = (text: string, vars: Record<string, number>): ReactNode =>
    Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), text);

  return (
    <div className="pl-page">
      <div className="pl-intro panel">
        <div className="brand"><BrandMark className="brandmark" />AlgoYo‘l</div>
        <p className="eyebrow pl-intro-eyebrow">{t.eyebrow}</p>
        <h1 className="pl-title">{t.welcome}</h1>
        <p className="muted pl-lead">{t.lead}</p>

        <div className="pl-rules">
          <p className="eyebrow">{t.howTitle}</p>
          <div className="pl-tiers">
            {TIERS.map((tier) => (
              <div key={tier} className={`pl-tier-card ${tier}`}>
                <span className={`pl-tier ${tier}`}>{tierLabel[tier]}</span>
                <b className="mono">+{TIER_POINTS[tier]}</b>
                <small>{tier === "basic" ? t.tierBasicD : tier === "core" ? t.tierCoreD : t.tierDeepD}</small>
              </div>
            ))}
          </div>
          <Meter score={SECTION_CAP} unlock={config.unlock} complete={config.complete} />
          <ul className="pl-rule-list">
            <li><b className="mono">{config.unlock}</b> — {t.ruleUnlock}</li>
            <li><b className="mono">{config.complete}</b> — {t.ruleComplete}</li>
            <li>{rule(t.ruleCap, { cap: SECTION_CAP })}</li>
            <li>{rule(t.ruleStop, { n: WRONG_LIMIT })}</li>
            <li>{t.ruleNever}</li>
          </ul>
        </div>

        <div className="pl-pick">
          <div className="pl-pick-head">
            <p className="eyebrow">{t.pickTitle}</p>
            <span>
              <button className="lang" onClick={() => setChosen(new Set(SECTIONS.map((r) => r.slug)))}>{t.pickAll}</button>
              <button className="lang" onClick={() => setChosen(new Set())}>{t.pickNone}</button>
            </span>
          </div>
          <p className="muted pl-pick-hint">{t.pickHint}</p>
          <div className="pl-pick-grid">
            {SECTIONS.map((r) => (
              <button key={r.slug} className={`pl-pick-item ${chosen.has(r.slug) ? "on" : ""}`}
                aria-pressed={chosen.has(r.slug)} onClick={() => toggle(r.slug)}>
                <span className="pl-track-ic sm" style={{ background: r.color }}>{r.icon}</span>
                <span>{title(r)}</span>
                <i aria-hidden="true">{chosen.has(r.slug) ? "✓" : ""}</i>
              </button>
            ))}
          </div>
          <p className="muted pl-pick-count">
            {rule(t.pickCount, { sections: count, questions: count * PER_SECTION, minutes: Math.max(1, Math.round(count * PER_SECTION * 0.5)) })}
          </p>
        </div>

        <button className="primary pl-cta" disabled={count === 0} onClick={begin}>{t.start}</button>
        <button className="secondary pl-cta" onClick={onFinish}>{t.fresh}</button>
        <button className="lang pl-cta" onClick={onFinish}>{t.skip}</button>
      </div>
    </div>
  );
}
