"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
const LABEL: Record<EditorLang, string> = { cpp20: "C++17", python3: "Python 3" };
const TOKEN_LANG: Record<EditorLang, "cpp" | "python"> = { cpp20: "cpp", python3: "python" };

/* Bracket behaviour, the part of an editor people only notice when it is
   missing. An opener types its partner and keeps the caret between them; the
   partner types over itself rather than doubling; backspace inside an empty
   pair removes both. Quotes are their own closer, which is why they need the
   word check below — an apostrophe in don't must not open a string. */
const CLOSE_OF: Record<string, string> = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'" };
const OPENERS = Object.keys(CLOSE_OF).filter(k => k !== CLOSE_OF[k]);
const CLOSERS = Object.values(CLOSE_OF);
const INDENT = "    ";

/* Where the caret goes after we rewrite the text.
 *
 * The textarea is controlled, so React writes `value` during its commit — and
 * assigning value to a textarea drops the caret at the end. Restoring it from
 * a requestAnimationFrame, which is what the Tab key used to do, is a race:
 * React commits after that frame often enough that Tab in the middle of a line
 * would send the caret to the end of the file. A layout effect is not a race,
 * because it runs as part of the same commit that wrote the value. */
const useCommitEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function verdictTone(v: string): string {
  const s = v.toLowerCase();
  if (!v) return "idle";
  if (s.includes("qabul") || s.includes("accepted") || s.startsWith("ok")) return "ok";
  // "tekshirilmoqda" is the in-flight line, "tekshiruvchi xatosi" is a
  // failure — near-identical words, opposite tones, so match the whole word.
  if (s.includes("tekshirilmoqda") || s.includes("navbat") || s.includes("queue") || s.includes("judging") || s.includes("ishlamoqda")) return "busy";
  return "bad";
}

export function CodeEditor({
  code, setCode, lang, setLang, onSubmit, submitLabel, verdict, busy, extraAction, minHeight,
  onRun, runLabel, runBusy,
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
  /* A second button beside the first, for editors that can run the code
     against your own input before committing it to a judge. Ctrl+Enter runs,
     Ctrl+Shift+Enter submits — the shortcuts an editor is expected to have,
     and the reason they are here rather than on the page is that both belong
     to the keyboard that is already inside the textarea. */
  onRun?: () => void;
  runLabel?: string;
  runBusy?: boolean;
}) {
  const ta = useRef<HTMLTextAreaElement>(null);
  const gutter = useRef<HTMLPreElement>(null);
  const overlay = useRef<HTMLPreElement>(null);
  const [pos, setPos] = useState({ line: 1, col: 1 });
  const pendingCaret = useRef<number | null>(null);

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

  /* Replace [from, to) with `text` and ask for the caret at `caret`; the effect
     below puts it there once React has written the new value. */
  const apply = (from: number, to: number, text: string, caret: number) => {
    pendingCaret.current = caret;
    setCode(code.slice(0, from) + text + code.slice(to));
  };

  /* Every edit the editor makes on its own goes through the browser's
     insertText command rather than through setCode. Writing `value` from
     React wipes the textarea's native undo history, so after the first
     auto-indent or auto-closed bracket Ctrl+Z did nothing at all. insertText
     is recorded like typing: Ctrl+Z / Ctrl+Y (and Ctrl+Shift+Z) walk back
     through auto-edits, comments and cut lines exactly as through keystrokes.
     The input event it raises reaches onChange, so React still owns the text.
     `apply` remains as the fallback for a browser that refuses the command. */
  const edit = (el: HTMLTextAreaElement, from: number, to: number, text: string, selStart: number, selEnd = selStart) => {
    if (from === to && !text) return;
    el.focus();
    el.setSelectionRange(from, to);
    const done = text ? document.execCommand("insertText", false, text) : document.execCommand("delete");
    if (!done) { apply(from, to, text, selStart); return; }
    el.setSelectionRange(selStart, selEnd);
    updatePos();
    sync();
  };

  /* Ctrl+/ comments or uncomments every line the selection touches, the way
     VS Code does: if every non-blank line is already commented the markers
     come off, otherwise one is added at the block's shallowest indent so the
     comment column lines up. */
  const toggleComment = (el: HTMLTextAreaElement) => {
    const marker = lang === "python3" ? "#" : "//";
    const s = el.selectionStart, t = el.selectionEnd;
    const start = code.lastIndexOf("\n", s - 1) + 1;
    // A selection that ends at the very start of a line does not include it.
    const last = t > s && code[t - 1] === "\n" ? t - 1 : t;
    const nl = code.indexOf("\n", last);
    const end = nl === -1 ? code.length : nl;
    const lines = code.slice(start, end).split("\n");
    const strip = marker === "#" ? /^(\s*)# ?/ : /^(\s*)\/\/ ?/;
    const filled = lines.filter((l) => l.trim());
    const uncomment = filled.length > 0 && filled.every((l) => strip.test(l));
    const indentOf = (l: string) => (l.match(/^\s*/) || [""])[0].length;
    const depth = filled.length ? Math.min(...filled.map(indentOf)) : indentOf(lines[0]);
    const next = lines.map((l) => {
      if (uncomment) return l.replace(strip, "$1");
      if (!l.trim() && filled.length) return l;
      return l.slice(0, depth) + marker + " " + l.slice(depth);
    });
    const text = next.join("\n");
    if (lines.length === 1 && s === t) {
      // A lone caret stays on its character.
      const caret = Math.max(start, Math.min(start + text.length, s + text.length - (end - start)));
      edit(el, start, end, text, caret);
    } else {
      edit(el, start, end, text, start, start + text.length);
    }
  };

  /* Ctrl+X with nothing selected cuts the whole line, newline included, as
     every code editor does; with a selection it stays the browser's own cut. */
  const cutLine = (el: HTMLTextAreaElement) => {
    const s = el.selectionStart;
    const start = code.lastIndexOf("\n", s - 1) + 1;
    const nl = code.indexOf("\n", s);
    const line = code.slice(start, nl === -1 ? code.length : nl);
    void navigator.clipboard?.writeText(line + "\n").catch(() => {});
    if (nl !== -1) edit(el, start, nl + 1, "", start);
    else if (start > 0) edit(el, start - 1, code.length, "", start - 1);   // last line: take the newline before it
    else edit(el, 0, code.length, "", 0);
  };

  useCommitEffect(() => {
    const caret = pendingCaret.current;
    if (caret === null) return;
    pendingCaret.current = null;
    const el = ta.current;
    if (!el) return;
    el.selectionStart = el.selectionEnd = caret;
    updatePos();
    sync();
  }, [code]);   // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) { if (!busy) onSubmit(); }
      else if (onRun) { if (!runBusy) onRun(); }
      else if (!busy) onSubmit();
      return;
    }
    /* Matched on e.code as well as e.key: on a Cyrillic layout Ctrl+X arrives
       as key "ч", and on some layouts "/" sits on another physical key. */
    const mod = (e.ctrlKey || e.metaKey) && !e.altKey;
    if (mod && !e.nativeEvent.isComposing && (e.key === "/" || e.code === "Slash")) {
      e.preventDefault();
      toggleComment(e.currentTarget);
      return;
    }
    if (mod && !e.shiftKey && (e.key === "x" || e.key === "X" || e.code === "KeyX")
        && e.currentTarget.selectionStart === e.currentTarget.selectionEnd) {
      e.preventDefault();
      cutLine(e.currentTarget);
      return;
    }
    // While an IME is composing, the keys belong to the IME.
    if (e.ctrlKey || e.metaKey || e.altKey || e.nativeEvent.isComposing) return;

    const el = e.currentTarget;
    const s = el.selectionStart, t = el.selectionEnd;
    const before = code.slice(0, s), after = code.slice(t);
    const prev = before.slice(-1), next = after.slice(0, 1);

    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      edit(el, s, t, INDENT, s + INDENT.length);
      return;
    }

    /* Enter keeps the block you are inside. The indent of the current line is
       carried down; an unclosed opener adds one level; and a closer waiting on
       the right is pushed onto a line of its own, so the caret lands in the
       empty body rather than beside the brace. */
    if (e.key === "Enter" && !e.shiftKey) {
      const lineStart = before.lastIndexOf("\n") + 1;
      const indent = (before.slice(lineStart).match(/^[ \t]*/) || [""])[0];
      const opensBlock = OPENERS.includes(prev) || (lang === "python3" && /:\s*$/.test(before.slice(lineStart)));
      const inner = opensBlock ? indent + INDENT : indent;
      e.preventDefault();
      if (opensBlock && CLOSE_OF[prev] === next) {
        edit(el, s, t, "\n" + inner + "\n" + indent, s + 1 + inner.length);
      } else {
        edit(el, s, t, "\n" + inner, s + 1 + inner.length);
      }
      return;
    }

    // Backspace between the halves of an empty pair takes both.
    if (e.key === "Backspace" && s === t && CLOSE_OF[prev] === next) {
      e.preventDefault();
      edit(el, s - 1, t + 1, "", s - 1);
      return;
    }

    /* Backspace inside the leading indentation removes a whole level. Tab puts
       four spaces in, so one press taking one space back out meant four presses
       to undo one — and the editor looked broken rather than merely fussy.
       The step lands on the previous multiple of four rather than always
       removing four, so an indent that is out by a space or two is straightened
       instead of over-shooting. Only spaces before the caret qualify: mid-line
       and after any real character, Backspace stays ordinary. */
    if (e.key === "Backspace" && s === t && s > 0) {
      const lineStart = before.lastIndexOf("\n") + 1;
      const lead = before.slice(lineStart);
      if (lead.length > 0 && /^ +$/.test(lead)) {
        const back = ((lead.length - 1) % INDENT.length) + 1;
        e.preventDefault();
        edit(el, s - back, t, "", s - back);
        return;
      }
    }

    // Typing the closer that is already sitting there steps over it instead of
    // adding a second one — otherwise every auto-inserted bracket is doubled.
    if (s === t && next === e.key && CLOSERS.includes(e.key)) {
      e.preventDefault();
      el.selectionStart = el.selectionEnd = s + 1;   // no re-render to race with
      updatePos();
      return;
    }

    if (CLOSE_OF[e.key]) {
      const close = CLOSE_OF[e.key];
      // A quote after a word is an apostrophe, not the start of a string.
      if (e.key === close && (/[\w]/.test(prev) || /[\w]/.test(next))) return;
      e.preventDefault();
      if (s !== t) edit(el, s, t, e.key + code.slice(s, t) + close, s + 1, t + 1);   // wrap the selection
      else edit(el, s, t, e.key + close, s + 1);
      return;
    }
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
        {onRun && (
          <button className="secondary ide-play" onClick={onRun} disabled={runBusy || busy}>
            {runBusy ? "…" : runLabel || "Run ▶"}
          </button>
        )}
        <button className="primary ide-run" onClick={onSubmit} disabled={busy || runBusy}>
          {busy ? "…" : submitLabel}
        </button>
      </div>
    </section>
  );
}
