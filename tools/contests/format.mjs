/* Re-lays out a C++ source in one participant's style.
 *
 * Fifty people who solved the same problem do not send byte-identical files:
 * they indent differently, put braces in different places, space their
 * operators or don't, and some sign the top of the file. This turns the one
 * reference solution into that many plausible submissions.
 *
 * Only whitespace between tokens changes (plus an optional leading comment),
 * which cannot change what the program does: literals, comments and
 * preprocessor lines are emitted verbatim, and a space is forced wherever two
 * tokens would otherwise lex as one. build.mjs still compiles and judges every
 * variant rather than trusting that argument.
 */

const PUNCT = [
  ">>=", "<<=", "<=>", "...", "->*",
  "::", "->", "++", "--", "<<", ">>", "<=", ">=", "==", "!=", "&&", "||",
  "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", ".*", "##",
];

export function lex(src) {
  const out = [];
  let i = 0, lineStart = true;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === "\n") { lineStart = true; i++; continue; }
    if (c === " " || c === "\t" || c === "\r" || c === "\f" || c === "\v") { i++; continue; }
    // A preprocessor line, with its continuations, is one opaque token.
    if (c === "#" && lineStart) {
      let j = i;
      while (j < n && src[j] !== "\n") { if (src[j] === "\\" && src[j + 1] === "\n") j += 2; else j++; }
      out.push({ t: "pp", v: src.slice(i, j).replace(/\s+$/, "") });
      i = j; continue;
    }
    lineStart = false;
    if (c === "/" && src[i + 1] === "/") {
      let j = i; while (j < n && src[j] !== "\n") j++;
      out.push({ t: "lc", v: src.slice(i, j).replace(/\s+$/, "") }); i = j; continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      const j = src.indexOf("*/", i + 2); const end = j < 0 ? n : j + 2;
      out.push({ t: "bc", v: src.slice(i, end) }); i = end; continue;
    }
    // Raw string: R"delim( ... )delim", possibly with an encoding prefix.
    const raw = /^(?:u8|u|U|L)?R"([^()\\\s]{0,16})\(/.exec(src.slice(i, i + 24));
    if (raw) {
      const close = ")" + raw[1] + '"';
      const j = src.indexOf(close, i + raw[0].length); const end = j < 0 ? n : j + close.length;
      out.push({ t: "str", v: src.slice(i, end) }); i = end; continue;
    }
    const pre = /^(?:u8|u|U|L)?["']/.exec(src.slice(i, i + 3));
    if (pre) {
      const q = pre[0].at(-1); let j = i + pre[0].length;
      while (j < n && src[j] !== q) { if (src[j] === "\\") j++; j++; }
      out.push({ t: "str", v: src.slice(i, j + 1) }); i = j + 1; continue;
    }
    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] || ""))) {
      // pp-number: digits, letters, dots, digit separators, signed exponents.
      let j = i + 1;
      while (j < n) {
        if (/[eEpP]/.test(src[j]) && /[+-]/.test(src[j + 1] || "")) { j += 2; continue; }
        if (/[0-9A-Za-z_.]/.test(src[j]) || (src[j] === "'" && /[0-9A-Za-z]/.test(src[j + 1] || ""))) { j++; continue; }
        break;
      }
      out.push({ t: "num", v: src.slice(i, j) }); i = j; continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i + 1; while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      out.push({ t: "id", v: src.slice(i, j) }); i = j; continue;
    }
    const p = PUNCT.find((x) => src.startsWith(x, i));
    out.push({ t: "op", v: p || c }); i += p ? p.length : 1;
  }
  return out;
}

/* Would writing a then b with nothing between change the tokens? */
const glue = (a, b) => {
  const got = lex(a + b);
  return !(got.length === 2 && got[0].v === a && got[1].v === b);
};

const SPACED = new Set(["=", "==", "!=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=",
  "<=", ">=", "&&", "||", "<<", "<<=", ">>="]);
const KEYWORD_PAREN = new Set(["if", "for", "while", "switch", "catch"]);
const BLOCK_BEFORE = new Set([")", "else", "do", "try", ";", "{", "}", "const", "noexcept", "override", "mutable"]);

/** style: { indent: "  " | "    " | "\t", allman: bool, ops: bool, comma: bool, kw: bool, header: string } */
export function formatCpp(src, style) {
  const toks = lex(src);
  const out = [];
  let line = "", depth = 0, paren = 0;
  const frames = []; // { block, paren, decl }
  let stmtHasCin = false;
  // After struct/class/namespace/enum/union the next { opens a declaration block.
  let declPending = false;

  const flush = () => { if (line.trim() !== "") out.push(line.replace(/\s+$/, "")); line = ""; };
  const ind = () => style.indent.repeat(Math.max(0, depth));
  const put = (v, spaceBefore) => {
    if (line === "") { line = ind() + v; return; }
    const last = line.at(-1);
    const prevTok = lastTok;
    const need = spaceBefore || (prevTok && glue(prevTok, v));
    line += (need && last !== " " ? " " : "") + v;
  };
  let lastTok = null;

  for (let k = 0; k < toks.length; k++) {
    const { t, v } = toks[k];
    const next = toks[k + 1];
    const prev = k > 0 ? toks[k - 1] : null;

    if (t === "pp") { flush(); out.push(v); lastTok = null; continue; }
    if (t === "lc") { put(v, line !== ""); flush(); lastTok = null; continue; }

    if (t === "id" && (v === "struct" || v === "class" || v === "namespace" || v === "enum" || v === "union")) declPending = true;

    if (v === "(") { const sp = style.kw && prev && prev.t === "id" && KEYWORD_PAREN.has(prev.v); put(v, sp); paren++; lastTok = v; continue; }
    if (v === ")") { put(v, false); paren = Math.max(0, paren - 1); lastTok = v; continue; }

    if (v === "{") {
      const block = declPending || (prev && (BLOCK_BEFORE.has(prev.v) || (prev.t === "id" && prev.v === "else")));
      const isDecl = declPending; declPending = false;
      frames.push({ block, paren, decl: isDecl, afterDo: !!(prev && prev.v === "do") });
      if (block) {
        if (style.allman) { flush(); line = ind() + "{"; }
        else put("{", line !== "");
        flush(); depth++; paren = 0; lastTok = null;
      } else { put("{", false); lastTok = v; }
      continue;
    }
    if (v === "}") {
      const f = frames.pop() || { block: true, paren: 0 };
      if (f.block) {
        flush(); depth = Math.max(0, depth - 1); paren = f.paren; line = ind() + "}"; lastTok = "}";
        const nv = next && next.v;
        if (nv === ";" || nv === "," || nv === ")" || (f.decl && next && next.t === "id")) continue;
        if (nv === "else") { if (style.allman) { flush(); lastTok = null; } continue; }
        if (nv === "while" && f.afterDo) continue;
        flush(); lastTok = null;
      } else { put("}", false); lastTok = v; }
      continue;
    }
    if (v === ";") {
      put(";", false); lastTok = ";";
      if (paren === 0) { flush(); lastTok = null; stmtHasCin = false; }
      else if (style.comma) line += " ";
      continue;
    }
    if (v === ",") { put(",", false); if (style.comma) line += " "; lastTok = ","; continue; }

    if (t === "id" && (v === "cin" || v === "cout" || v === "cerr")) stmtHasCin = true;
    const spacedOp = style.ops && t === "op" && (SPACED.has(v) || (v === ">>" && stmtHasCin));
    if (spacedOp) { put(v, true); line += " "; lastTok = v; continue; }
    // `else` after a K&R closing brace sits on the brace's line.
    put(v, prev && (prev.v === "}" || (prev.t === "id" && t === "id") || (prev.t === "num" && t === "id")));
    lastTok = v;
  }
  flush();
  const body = out.join("\n") + "\n";
  return (style.header ? style.header + "\n" : "") + body;
}
