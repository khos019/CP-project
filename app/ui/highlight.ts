"use client";

// Shared tokeniser for the code block and the live editors.
// Hand-rolled: the whole thing is smaller than a highlighting dependency,
// and section 69 asks us not to add heavy libraries for simple UI.

export type Lang = "cpp" | "python";

const KEYWORDS: Record<Lang, string[]> = {
  cpp: ["alignas","auto","bool","break","case","catch","char","class","const","constexpr","continue","decltype",
    "default","delete","do","double","else","enum","explicit","export","extern","false","float","for","friend",
    "goto","if","inline","int","long","mutable","namespace","new","noexcept","nullptr","operator","private",
    "protected","public","register","return","short","signed","sizeof","static","struct","switch","template",
    "this","throw","true","try","typedef","typename","union","unsigned","using","virtual","void","volatile","while"],
  python: ["and","as","assert","async","await","break","class","continue","def","del","elif","else","except",
    "False","finally","for","from","global","if","import","in","is","lambda","None","nonlocal","not","or","pass",
    "raise","return","True","try","while","with","yield"],
};

const TYPES: Record<Lang, string[]> = {
  cpp: ["vector","string","pair","map","set","unordered_map","unordered_set","queue","deque","stack",
    "priority_queue","size_t","int64_t","uint64_t","array","tuple","optional","ostream","istream"],
  python: ["int","str","float","list","dict","set","tuple","bool","range","len","print","input","map","sorted",
    "sum","min","max","abs","enumerate","zip"],
};

type Tok = { t: string; c: string };

function tokenize(src: string, lang: Lang): Tok[][] {
  const kw = new Set(KEYWORDS[lang]);
  const ty = new Set(TYPES[lang]);
  const lineComment = lang === "cpp" ? "//" : "#";
  return src.replace(/\t/g, "    ").split("\n").map(line => {
    const out: Tok[] = [];
    let i = 0;
    while (i < line.length) {
      const rest = line.slice(i);
      // comment to end of line
      if (rest.startsWith(lineComment)) { out.push({ t: rest, c: "c-com" }); break; }
      // preprocessor
      if (lang === "cpp" && /^\s*#/.test(line) && i === line.search(/\S/)) {
        out.push({ t: rest, c: "c-pre" }); break;
      }
      // string or char literal
      const str = rest.match(/^(["'])(?:\\.|(?!\1)[^\\])*\1?/);
      if (str) { out.push({ t: str[0], c: "c-str" }); i += str[0].length; continue; }
      // number
      const num = rest.match(/^\d[\d'.]*(?:[eE][+-]?\d+)?[uUlLfF]*/);
      if (num) { out.push({ t: num[0], c: "c-num" }); i += num[0].length; continue; }
      // identifier
      const id = rest.match(/^[A-Za-z_]\w*/);
      if (id) {
        const w = id[0];
        const after = rest.slice(w.length).match(/^\s*\(/);
        const cls = kw.has(w) ? "c-kw" : ty.has(w) ? "c-ty" : after ? "c-fn" : "c-id";
        out.push({ t: w, c: cls }); i += w.length; continue;
      }
      // operators and punctuation
      const op = rest.match(/^[+\-*/%=<>!&|^~?:;,.()[\]{}]+/);
      if (op) { out.push({ t: op[0], c: "c-op" }); i += op[0].length; continue; }
      const ws = rest.match(/^\s+/);
      if (ws) { out.push({ t: ws[0], c: "c-ws" }); i += ws[0].length; continue; }
      out.push({ t: rest[0], c: "c-id" }); i += 1;
    }
    return out;
  });
}


export { tokenize };
