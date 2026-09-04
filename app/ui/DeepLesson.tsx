"use client";

/* Renders a deep lesson: prose, pictures, a step player, and code with a
   commentary tied to its own lines. See deep-lesson.ts for why this exists. */

import { useEffect, useState } from "react";
import { DiagramBody, DiagramFromSpec, type Spec } from "./diagram-kit";
import { tokenize } from "./highlight";
import { CodeBlock } from "./CodeBlock";
import type { Block, CodeNote, DeepLesson } from "./deep-lesson";

type Lang = "uz" | "en";
const pick = (lang: Lang, uz: string, en: string) => (lang === "uz" ? uz : en);

/* ── The step player ──────────────────────────────────────────────────────
   An algorithm is a sequence of states, and a single picture can only show
   one of them. This shows all of them, one at a time, under the learner's own
   thumb: forward, back, or play. Autoplay stops at the last frame rather than
   looping — a loop restarts an explanation somebody is still reading. */
function StepPlayer({ lang, titleUz, titleEn, frames }: {
  lang: Lang; titleUz: string; titleEn: string;
  frames: { spec: Spec; uz: string; en: string }[];
}) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  /* The timer is the external system this effect drives. Nothing is scheduled
     on the last frame, so playback simply runs out of frames rather than the
     effect setting state on its own. */
  useEffect(() => {
    if (!playing || i >= frames.length - 1) return;
    const id = window.setTimeout(() => {
      const next = i + 1;
      setI(next);
      if (next >= frames.length - 1) setPlaying(false);
    }, 1400);
    return () => window.clearTimeout(id);
  }, [playing, i, frames.length]);

  const frame = frames[i];
  const at = (n: number) => { setPlaying(false); setI(Math.max(0, Math.min(frames.length - 1, n))); };
  const uz = lang === "uz";

  return (
    <figure className="sim">
      <figcaption className="sim-head">
        <b>{pick(lang, titleUz, titleEn)}</b>
        <span className="mono sim-count">{i + 1} / {frames.length}</span>
      </figcaption>
      <svg viewBox="0 0 520 152" role="img" aria-label={frame.spec.label}><DiagramBody spec={frame.spec} /></svg>
      <p className="sim-step"><span className="sim-step-no mono">{i + 1}</span>{pick(lang, frame.uz, frame.en)}</p>
      <div className="sim-bar">
        <button onClick={() => at(i - 1)} disabled={i === 0} aria-label={uz ? "Orqaga" : "Back"}>←</button>
        <button className="sim-play" onClick={() => { if (i >= frames.length - 1) setI(0); setPlaying(p => !p); }}>
          {playing ? (uz ? "❚❚ To‘xtatish" : "❚❚ Pause") : (uz ? "▶ Ijro etish" : "▶ Play")}
        </button>
        <button onClick={() => at(i + 1)} disabled={i === frames.length - 1} aria-label={uz ? "Oldinga" : "Forward"}>→</button>
        {/* Every frame is directly reachable: re-reading step 4 should not
            mean clicking back three times. */}
        <span className="sim-dots">
          {frames.map((_, n) => (
            <button key={n} className={n === i ? "on" : ""} onClick={() => at(n)}
              aria-label={`${uz ? "Qadam" : "Step"} ${n + 1}`} aria-current={n === i} />
          ))}
        </span>
      </div>
    </figure>
  );
}

/* ── Code with a commentary ───────────────────────────────────────────────
   Reading somebody else's code is a skill nobody is born with. The notes are
   numbered beside the lines they belong to; selecting one lights those lines
   up, so "what does this block do" is answered by pointing rather than by
   counting lines by hand. */
function CodeWalk({ lang, code, notes, codeLang, captionUz, captionEn }: {
  lang: Lang; code: string; notes: CodeNote[]; codeLang: "cpp" | "python";
  captionUz?: string; captionEn?: string;
}) {
  const [active, setActive] = useState(0);
  const lines = tokenize(code.replace(/\n+$/, ""), codeLang);
  const note = notes[active];
  const lit = (n: number) => !!note && n + 1 >= note.from && n + 1 <= (note.to ?? note.from);

  return (
    <div className="walk">
      <div className="codeblock walk-code">
        <div className="codeblock-bar">
          <span className="codeblock-name">{codeLang === "cpp" ? "main.cpp" : "main.py"}</span>
          <span className="walk-hint">{lang === "uz" ? "izohni tanlang" : "pick a note"}</span>
        </div>
        <div className="codeblock-body">
          <pre className="codeblock-gutter" aria-hidden="true">
            {lines.map((_, n) => <span key={n} className={lit(n) ? "lit" : ""}>{`${n + 1}\n`}</span>)}
          </pre>
          <pre className="codeblock-code"><code>
            {lines.map((toks, n) => (
              <span key={n} className={lit(n) ? "walk-lit" : "walk-dim"}>
                {toks.map((tk, j) => <span className={tk.c} key={j}>{tk.t}</span>)}
                {"\n"}
              </span>
            ))}
          </code></pre>
        </div>
      </div>
      <ol className="walk-notes">
        {notes.map((nt, k) => (
          <li key={k}>
            <button className={k === active ? "on" : ""} onClick={() => setActive(k)}>
              <span className="walk-lines mono">
                {nt.to && nt.to !== nt.from ? `${nt.from}–${nt.to}` : nt.from}
              </span>
              <span>{pick(lang, nt.uz, nt.en)}</span>
            </button>
          </li>
        ))}
      </ol>
      {(captionUz || captionEn) && <p className="walk-cap muted">{pick(lang, captionUz || "", captionEn || "")}</p>}
    </div>
  );
}

/* A question the reader answers before reading on.
   The reveal is React state rather than a native <details>: disclosure is not
   honoured everywhere (some embedded browsers render the content open), and an
   answer that is visible from the start is not an exercise. */
function TryIt({ lang, b }: { lang: Lang; b: Extract<Block, { t: "exercise" }> }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="try">
      <span className="try-tag">{lang === "uz" ? "O‘zingiz sinab ko‘ring" : "Try it yourself"}</span>
      <p className="try-q">{pick(lang, b.qUz, b.qEn)}</p>
      <button className="try-toggle" onClick={() => setShown(s => !s)} aria-expanded={shown}>
        {shown
          ? (lang === "uz" ? "Javobni yashirish" : "Hide the answer")
          : (lang === "uz" ? "Javobni ko‘rsatish" : "Show the answer")}
      </button>
      {shown && <p className="try-a">{pick(lang, b.aUz, b.aEn)}</p>}
    </div>
  );
}

function BlockView({ lang, b }: { lang: Lang; b: Block }) {
  switch (b.t) {
    case "p": return <p>{pick(lang, b.uz, b.en)}</p>;
    case "h": return <h4 className="deep-h">{pick(lang, b.uz, b.en)}</h4>;
    case "list": {
      const items = lang === "uz" ? b.uz : b.en;
      return b.ordered
        ? <ol className="lesson-list ol">{items.map((x, i) => <li key={i}>{x}</li>)}</ol>
        : <ul className="lesson-list">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>;
    }
    case "note": return (
      <div className={`callout ${b.kind}`}>
        <span className="callout-tag">{
          b.kind === "key" ? (lang === "uz" ? "Asosiy g‘oya" : "Key idea")
          : b.kind === "warn" ? (lang === "uz" ? "Ehtiyot bo‘ling" : "Watch out")
          : (lang === "uz" ? "Maslahat" : "Tip")
        }</span>
        <p>{pick(lang, b.uz, b.en)}</p>
      </div>
    );
    case "math": return <p className="deep-math mono">{pick(lang, b.uz, b.en || b.uz)}</p>;
    case "table": {
      const head = lang === "uz" ? b.headUz : b.headEn;
      return (
        <div className="deep-table-wrap">
          <table className="deep-table">
            <thead><tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={j ? "mono" : ""}>{c}</td>)}</tr>)}</tbody>
          </table>
          {(b.captionUz || b.captionEn) && <p className="muted deep-cap">{pick(lang, b.captionUz || "", b.captionEn || "")}</p>}
        </div>
      );
    }
    case "code": {
      const code = b.cpp ?? b.python ?? "";
      return (
        <div className="deep-code">
          <CodeBlock code={code} lang={b.cpp ? "cpp" : "python"} />
          {(b.captionUz || b.captionEn) && <p className="muted deep-cap">{pick(lang, b.captionUz || "", b.captionEn || "")}</p>}
        </div>
      );
    }
    case "codewalk": return (
      <CodeWalk lang={lang} code={b.code} notes={b.notes} codeLang={b.lang || "cpp"}
        captionUz={b.captionUz} captionEn={b.captionEn} />
    );
    case "exercise": return <TryIt lang={lang} b={b} />;
    case "diagram": return <DiagramFromSpec spec={b.spec} />;
    case "sim": return <StepPlayer lang={lang} titleUz={b.titleUz} titleEn={b.titleEn} frames={b.frames} />;
  }
}

export function DeepLessonView({ lang, lesson }: { lang: Lang; lesson: DeepLesson }) {
  return <>
    {lesson.sections.map((sec, i) => (
      <section key={i} className="deep-section">
        <h2>{pick(lang, sec.titleUz, sec.titleEn)}</h2>
        {sec.blocks.map((b, j) => <BlockView key={j} lang={lang} b={b} />)}
      </section>
    ))}
  </>;
}
