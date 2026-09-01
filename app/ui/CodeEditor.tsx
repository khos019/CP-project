"use client";

import { useRef, useState } from "react";

// Editor-shaped code input for submitting solutions.
//
// A bare textarea gives no sense of where you are in the file. This adds the
// parts that actually help while solving: a tab bar per language, a line-number
// gutter that scrolls with the text, Tab inserting an indent instead of leaving
// the field, and a status bar showing the cursor position and the last verdict.
//
// The text itself stays a real <textarea>: it keeps native caret handling,
// selection, undo, IME and screen-reader support, which a contenteditable
// re-implementation would quietly break.

export type EditorLang = "cpp20" | "python3";

const NAME: Record<EditorLang, string> = { cpp20: "main.cpp", python3: "main.py" };
const LABEL: Record<EditorLang, string> = { cpp20: "C++20", python3: "Python 3" };

/** Colour the verdict line by outcome rather than printing it all the same. */
function verdictTone(v: string): string {
  const s = v.toLowerCase();
  if (!v) return "idle";
  if (s.includes("qabul") || s.includes("accepted") || s.startsWith("ok")) return "ok";
  if (s.includes("navbat") || s.includes("queue") || s.includes("judging") || s.includes("ishlamoqda")) return "busy";
  return "bad";
}

export function CodeEditor({
  code, setCode, lang, setLang, onSubmit, submitLabel, verdict, busy, extraAction,
}: {
  code: string;
  setCode: (v: string) => void;
  lang: EditorLang;
  setLang: (v: EditorLang) => void;
  onSubmit: () => void;
  submitLabel: string;
  verdict: string;
  busy?: boolean;
  extraAction?: React.ReactNode;
}) {
  const ta = useRef<HTMLTextAreaElement>(null);
  const gutter = useRef<HTMLPreElement>(null);
  const [pos, setPos] = useState({ line: 1, col: 1 });

  const lines = code.split("\n");
  const tone = verdictTone(verdict);

  const syncScroll = () => {
    if (gutter.current && ta.current) gutter.current.scrollTop = ta.current.scrollTop;
  };

  const updatePos = () => {
    const el = ta.current;
    if (!el) return;
    const upto = el.value.slice(0, el.selectionStart);
    const nl = upto.split("\n");
    setPos({ line: nl.length, col: nl[nl.length - 1].length + 1 });
  };

  // Tab should indent, not jump to the next control — but Escape then Tab still
  // lets a keyboard user leave the field.
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab" || e.shiftKey) return;
    const el = e.currentTarget;
    e.preventDefault();
    const s = el.selectionStart, t = el.selectionEnd;
    const next = code.slice(0, s) + "    " + code.slice(t);
    setCode(next);
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
  };

  return (
    <section className="ide">
      <div className="ide-tabs">
        {(["cpp20", "python3"] as EditorLang[]).map(l => (
          <button key={l} className={`ide-tab ${l === lang ? "active" : ""}`} onClick={() => setLang(l)}>
            <span className="ide-dot" aria-hidden="true" />{NAME[l]}
          </button>
        ))}
        <span className="ide-tabs-fill" />
        {extraAction}
      </div>

      <div className="ide-body">
        <pre className="ide-gutter" ref={gutter} aria-hidden="true">
          {lines.map((_, i) => `${i + 1}\n`).join("")}
        </pre>
        <textarea
          ref={ta}
          className="ide-input"
          aria-label="Code editor"
          value={code}
          spellCheck={false}
          onChange={e => { setCode(e.target.value); updatePos(); }}
          onScroll={syncScroll}
          onKeyDown={onKeyDown}
          onKeyUp={updatePos}
          onClick={updatePos}
        />
      </div>

      <div className="ide-status">
        <span className={`ide-verdict ${tone}`}>{verdict || "Judge0 tayyor"}</span>
        <span className="ide-meta">
          <span>Ln {pos.line}, Col {pos.col}</span>
          <span>{lines.length} qator</span>
          <span>{LABEL[lang]}</span>
        </span>
        <button className="primary ide-run" onClick={onSubmit} disabled={busy}>
          {busy ? "…" : submitLabel}
        </button>
      </div>
    </section>
  );
}
