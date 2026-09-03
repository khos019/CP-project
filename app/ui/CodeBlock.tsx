"use client";

import { useState } from "react";
import { tokenize, type Lang } from "./highlight";

// Syntax-highlighted code block.
//
// The old block was one flat colour with pre-wrap, so a long statement broke
// mid-expression and read as gibberish. This highlights, numbers the lines and
// scrolls horizontally instead of wrapping — the way an editor does.
//
// Hand-rolled rather than pulling in a highlighter: the whole tokeniser is
// smaller than the dependency would be, and section 69 asks us not to add heavy
// libraries for simple UI.

export function CodeBlock({ code, lang, filename }: { code: string; lang: Lang; filename?: string }) {
  const [copied, setCopied] = useState(false);
  const lines = tokenize(code.replace(/\n+$/, ""), lang);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked; the code is still selectable */ }
  };

  return (
    <div className="codeblock">
      <div className="codeblock-bar">
        <span className="codeblock-name">{filename || (lang === "cpp" ? "main.cpp" : "main.py")}</span>
        <button className="codeblock-copy" onClick={copy} aria-label="Copy code">
          {copied ? "✓ nusxalandi" : "nusxalash"}
        </button>
      </div>
      <div className="codeblock-body">
        <pre className="codeblock-gutter" aria-hidden="true">{lines.map((_, n) => `${n + 1}\n`).join("")}</pre>
        <pre className="codeblock-code"><code>
          {/* One span per line, for the key — and no class on it: nothing
              styles a line on its own, and a class no rule matches is a
              promise the stylesheet does not keep. */}
          {lines.map((toks, n) => (
            <span key={n}>
              {toks.map((tk, j) => <span className={tk.c} key={j}>{tk.t}</span>)}
              {"\n"}
            </span>
          ))}
        </code></pre>
      </div>
    </div>
  );
}
