"use client";

import { Fragment, type ReactNode } from "react";

/* Maths inside a sentence.
 *
 * The bank writes constraints and statements the way you would type them into
 * a chat window — "1 <= a, b <= 10^9", "a_i", "O(n log n)". On a problem page
 * that is exactly wrong: 10^9 is a power, not a caret, and a_i is a subscript,
 * not an underscore. Every contest site the learners already use renders these
 * properly, and reading "10^9" next to robocontest's 10⁹ makes this one look
 * like a draft.
 *
 * A tokeniser, not LaTeX. The content is not LaTeX and turning it into LaTeX
 * would mean rewriting 101 problems and shipping a maths engine to render
 * them; this reads what is already written. It stays deliberately timid —
 * a superscript is at most four characters, a subscript at most three, and a
 * `_` inside a longer word (`max_element`, `long_long`) is left alone, because
 * the cost of a wrong guess is code turned into gibberish.
 */

const OPERATORS: [RegExp, string][] = [
  [/<=/g, "\u2264"],
  [/>=/g, "\u2265"],
  [/!=/g, "\u2260"],
  [/(\d)\s*\*\s*(?=\d)/g, "$1\u00b7"],
];

const tidy = (text: string) => OPERATORS.reduce((s, [from, to]) => s.replace(from, to), text);

/** Splits "a_i <= 10^9" into text, <sub> and <sup> pieces. */
export function mathNodes(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let plain = "";
  let i = 0;
  const flush = () => { if (plain) { out.push(tidy(plain)); plain = ""; } };

  while (i < text.length) {
    const ch = text[i];
    if (ch === "^" || ch === "_") {
      const before = text[i - 1] || "";
      const braced = text[i + 1] === "{" ? text.indexOf("}", i + 2) : -1;
      // A brace group says what it means, so it is taken whole.
      let body = "";
      let next = i;
      if (braced > 0) {
        body = text.slice(i + 2, braced);
        next = braced + 1;
      } else {
        const limit = ch === "^" ? 4 : 3;
        const run = /^[A-Za-z0-9+\-]+/.exec(text.slice(i + 1, i + 1 + limit + 1));
        // Longer than the limit means this is a word, not a script: `max_element`
        // is an identifier and must survive untouched.
        if (run && run[0].length <= limit && /[A-Za-z0-9)\]]/.test(before)) {
          body = run[0];
          next = i + 1 + run[0].length;
        }
      }
      if (body) {
        flush();
        out.push(ch === "^"
          ? <sup key={out.length} className="mth-sup">{body}</sup>
          : <sub key={out.length} className="mth-sub">{body}</sub>);
        i = next;
        continue;
      }
    }
    plain += ch;
    i++;
  }
  flush();
  return out;
}

/** Inline maths for a run of statement prose. */
export function MathText({ text }: { text: string }) {
  if (!text) return null;
  return <>{mathNodes(text).map((node, i) => <Fragment key={i}>{node}</Fragment>)}</>;
}
