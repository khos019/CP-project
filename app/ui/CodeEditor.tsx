"use client";

import { useRef, useState } from "react";
import { tokenize } from "./highlight";

// Editor-shaped code input with live syntax highlighting.
//
// The colour comes from a highlighted <pre> sitting exactly behind a textarea
// whose own text is transparent — the caret, selection, undo, IME and screen
// reader all stay native, which a contenteditable rewrite would break. The two
// layers must share font, size, line-height, padding, tab-size and wrapping
// exactly, or the glyphs drift apart; that is what the shared .ide-layer rule
// enforces, and why both scroll together on every input.

export type EditorLang = "cpp20" | "python3";

const NAME: Record<EditorLang, string> = { cpp20: "main.cpp", python3: "main.py" };
const LABEL: Record<EditorLang, string> = { cpp20: "C++20", python3: "Python 3" };
const TOKEN_LANG: Record<EditorLang, "cpp" | "python"> = { cpp20: "cpp", python3: "python" };

function verdictTone(v: string): string {
  const s = v.toLowerCase();
  if (!v) return "idle";
  if (s.includes("qabul") || s.includes("accepted") || s.startsWith("ok")) return "ok";
  if (s.includes("navbat") || s.includes("queue") || s.includes("judging") || s.includes("ishlamoqda")) return "busy";
  return "bad";
}

export function CodeEditor({
  code, setCode, lang, setLang, onSubmit, submitLabel, verdict, busy, extraAction, minHeight,
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
  minHeight?: number;
}) {
  const ta = useRef<HTMLTextAreaElement>(null);
  const gutter = useRef<HTMLPreElement>(null);
  const overlay = useRef<HTMLPreElement>(null);
  const [pos, setPos] = useState({ line: 1, col: 1 });

  const lines = code.split("\n");
  const tokens = tokenize(code, TOKEN_LANG[lang]);
  const tone = verdictTone(verdict);

  // The gutter follows vertically; the overlay must follow both axes or the
  // colour slides out from under the text as soon as a line runs long.
  const sync = () => {
    const el = ta.current;
    if (!el) return;
    if (gutter.current) gutter.current.scrollTop = el.scrollTop;
    if (overlay.current) {
      overlay.current.scrollTop = el.scrollTop;
      overlay.current.scrollLeft = el.scrollLeft;
    }
  };

  const updatePos = () => {
    const el = ta.current;
    if (!el) return;
    const upto = el.value.slice(0, el.selectionStart).split("\n");
    setPos({ line: upto.length, col: upto[upto.length - 1].length + 1 });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab" || e.shiftKey) return;
    const el = e.currentTarget;
    e.preventDefault();
    const s = el.selectionStart, t = el.selectionEnd;
    setCode(code.slice(0, s) + "    " + code.slice(t));
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
  };

  const style = minHeight ? { minHeight } : undefined;

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
        <div className="ide-stack" style={style}>
          <pre className="ide-layer ide-highlight" ref={overlay} aria-hidden="true">
            <code>
              {tokens.map((toks, n) => (
                <span key={n}>
                  {toks.map((tk, j) => <span className={tk.c} key={j}>{tk.t}</span>)}
                  {"\n"}
                </span>
              ))}
            </code>
          </pre>
          <textarea
            ref={ta}
            className="ide-layer ide-input"
            aria-label="Code editor"
            value={code}
            spellCheck={false}
            onChange={e => { setCode(e.target.value); updatePos(); sync(); }}
            onScroll={sync}
            onKeyDown={onKeyDown}
            onKeyUp={updatePos}
            onClick={updatePos}
          />
        </div>
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
