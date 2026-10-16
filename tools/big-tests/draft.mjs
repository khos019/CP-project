#!/usr/bin/env node
/* Drafts specs/100-auto.mjs: max-size tests for every problem whose input
 * can be read off its own statement with confidence.
 *
 * A problem qualifies only when
 *   - its input is one of the plain layouts: a header line of named integers,
 *     optionally followed by one line of n values or by n lines of fixed-width
 *     tuples (read from the first sample, matched against the header);
 *   - every constraint is either a bound chain ("1 ≤ k ≤ n ≤ 10^5") over
 *     those names, or a note that changes nothing about valid input ("the
 *     answer needs a 64-bit type");
 *   - it is not a multi-test format.
 * Anything else — sorted input, distinct values, permutations, graphs,
 * strings, "guaranteed" — is reported and left for a hand-written spec, because
 * an input that breaks a promise of the statement would fail correct
 * solutions. build.mjs then runs the reference on every drafted test.
 *
 *   node tools/big-tests/draft.mjs      # writes specs/100-auto.mjs, prints what it skipped
 */

import { readdirSync, writeFileSync } from "node:fs";
import { CLEARED } from "./cleared.mjs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const imp = (p) => import(pathToFileURL(join(ROOT, p)).href);
const { tests } = await imp("app/api/judge/tests.ts");
const detailsMod = await imp("app/api/problem/details.ts");
const details = Object.values(detailsMod).find((v) => v && typeof v === "object" && Object.keys(v).length > 100);
const { bankProblems } = await imp("app/ui/problem-bank.ts");

const handWritten = new Set();
// Every hand-written spec file wins over a draft.
for (const f of readdirSync(join(HERE, "specs")).filter((x) => x.endsWith(".mjs") && x !== "100-auto.mjs")) {
  Object.keys((await import(pathToFileURL(join(HERE, "specs", f)).href)).default).forEach((k) => handWritten.add(k));
}
// Too large for the sandbox at full size even with narrow values; written by hand.
for (const k of ["diff-array-range-add"]) handWritten.add(k);

const N_CAP = 200000;          // tokens per line; keeps a test well under the 4 MB job file cap
/* Problems that print about as much as they read: at full size the correct
   answer passes the sandbox's 1 MB output cap. They get n ≤ 10^5 and values
   from a narrower slice of the allowed range, which is still valid input. */
const OUTPUT_HEAVY = new Set(["array-reverse", "running-max", "rotate-array", "sort-by-frequency", "stl-sort-unique",
  "queue-rotate", "array-swap-ends", "stack-previous-smaller-index", "stack-next-greater", "deque-window-min",
  "sort-descending", "sort-abs", "array-shift-left-one", "sort-by-digit-sum", "sort-parity-then-value"]);
const BENIGN = /answer|64-bit|2\^31|2\^63|needs a|can reach|can exceed|exceed|fits|strict|only immediate|may cover|not reordered|must be consecutive|for even|touch|not given in sorted|never split|merely|modulo|modulus|is prime|reduced|counted|ties|either|any of|count(s|ed)? once|inclusive|1-indexed|0-indexed|indexed|positions|order of|output|print|wrap/i;
/* Constraints read one by one and found to say nothing about what a valid
   input may contain — they explain the task, not the data. Exact text, so a
   reworded constraint is looked at again. */
const READ_AND_CLEARED = new Set(CLEARED);
const RISKY_PROSE = /simple polygon|in (?:counter-?)?clockwise order|polygon|given in (?:non-decreasing|increasing|sorted|ascending)|already sorted|pairwise distinct|all (?:values |numbers |elements )?(?:are )?distinct|is a permutation|guaranteed/i;
const RISKY = /sorted|non-decreasing|non-increasing|increasing|decreasing|distinct|permutation|≠|guarantee|pairwise|unique|sum of|divid|exactly|at least|at most|palindrome|connected|tree|valid|balanced|different|no two|each .* once|appears|multiple of|power of|square|even|odd|consecutive|\bnot\b/i;

/** "−10^9" → "-10**9", "2·10^5" → "2*10**5"; null if it is not arithmetic over known names. */
function expr(raw, names) {
  const e = raw.trim().replace(/−/g, "-").replace(/·|×/g, "*").replace(/\^/g, "**").replace(/\s+/g, " ");
  if (!/^[-+*/(), 0-9a-z_]+$/i.test(e)) return null;
  for (const w of e.match(/[a-z_]+/gi) || []) if (!names.includes(w) && w !== "min" && w !== "max") return null;
  // Problem names are prefixed in the generated Python: a problem with an
  // "r" or a "line" must not shadow the generator's own names. min and max
  // are Python's own.
  // "n(n − 1)/2" is a product, not a call: a name, digit or ")" directly
  // before "(" gets its "*" (min and max stay calls).
  const product = e.replace(/\b(?!min\b|max\b)([a-z0-9_]+|\))\s*\(/gi, "$1*(").replace(/\)\s*\(/g, ")*(");
  return product.replace(/\//g, "//").replace(/[a-z_]+/gi, (w) => (w === "min" || w === "max" ? w : `v_${w}`));
}

/** Bound chains: "1 ≤ k ≤ n ≤ 10^5" → { k: [1, "n"], n: ["k"?...] } as [lo, hi] expressions. */
const IDENT = /^[a-zA-Z][a-zA-Z0-9]*(?:_\{?[a-z0-9]+\}?)?$/;
/** Bound chains: "1 ≤ k ≤ n ≤ 10^5" → { k: ["1", "n"], n: ["k", "10^5"] }.
 *  A middle part may list several names ("−10^9 ≤ x, y ≤ 10^9"). */
function chainOf(c) {
  // Split keeping the operators: a strict "<" moves that side's bound by one,
  // so "0 ≤ a_i < 2^30" bounds a_i by 2^30 − 1 and "0 ≤ s < e" keeps s below e.
  const parts = c.split(/\s*(<=|≤|<)\s*/);
  if (parts.length < 5) return null;
  const terms = parts.filter((_, i) => i % 2 === 0), ops = parts.filter((_, i) => i % 2 === 1);
  const mids = terms.slice(1, -1).map((p) => p.split(/\s*,\s*/).map((x) => x.trim().replace(/_\{?i\}?$/, "_i")));
  if (!mids.every((group) => group.every((x) => IDENT.test(x)))) return null;
  const out = {};
  for (let i = 0; i < mids.length; i++) {
    let lo = i === 0 ? terms[0] : mids[i - 1][0].replace(/_i$/, "");
    let hi = i === mids.length - 1 ? terms[terms.length - 1] : mids[i + 1][0].replace(/_i$/, "");
    if (ops[i] === "<") lo = `(${lo}) + 1`;
    if (ops[i + 1] === "<") hi = `(${hi}) - 1`;
    for (const v of mids[i]) out[v] = [lo, hi];
  }
  return out;
}
function bounds(constraints) {
  return Object.assign({}, ...constraints.map(chainOf).filter(Boolean));
}

const ord = { one: 1, two: 2, three: 3, four: 4, five: 5 };
const drafted = {}, skipped = [], strings = [];

for (const p of bankProblems) {
  const key = p.judge, d = details[p.id];
  if (!key || !d || !tests[key] || handWritten.has(key)) continue;
  const why = (reason) => skipped.push(`${key}: ${reason}`);
  const input = d.inputEn || "", cons = d.constraintList || [];
  if (/test case/i.test(input)) { why("multi-test"); continue; }
  const sample = (d.samples?.[0]?.input || "").trim().split("\n").map((l) => l.trim().split(/\s+/).filter(Boolean));
  if (!sample.length) { why("no sample"); continue; }

  // Header names, in order, from "The first line contains two integers n and k".
  const head = /^(?:The |A )?(?:first|only|single) line(?: of (?:the )?input)? contains (?:the |one |two |three |four |five |six )?(?:non-negative |positive |space-separated )*(?:integers?|numbers?)?\s*([^.—:;]+)/i.exec(input);
  if (!head) { why("header not stated"); continue; }
  if (/string|word|characters?|text/i.test(head[1])) { strings.push(key); why("string input"); continue; }
  // Single letters, minus articles in front of words.
  const headNames = head[1].replace(/\b(?:a|an|the)\s+(?=[a-z]{2,})/gi, "").match(/\b[a-zA-Z]\b/g) || [];
  if (!headNames.length || headNames.length !== sample[0].length) { why(`header names ${headNames} vs sample ${sample[0].length}`); continue; }

  // Body layout from the sample: nothing, one line of n values, or n lines of w tuples.
  /* The count is whichever header value equals the body's length in the
     sample — and only if exactly one does: "4 4" over four edges cannot say
     whether n or m counts them, and guessing wrong writes an invalid test. */
  const countOf = (len) => {
    const hits = headNames.filter((_, i) => Number(sample[0][i]) === len);
    return hits.length === 1 ? hits[0] : null;
  };
  let layout, nName = null;
  if (sample.length === 1) layout = { kind: "header" };
  else if (sample.length === 2 && (nName = countOf(sample[1].length))) layout = { kind: "line" };
  else if (sample.length > 2 && (nName = countOf(sample.length - 1)) && sample.slice(1).every((l) => l.length === sample[1].length)) layout = { kind: "rows", width: sample[1].length };
  else { why("layout"); continue; }
  /* A header value equal to the row width means the width is itself an input
     (an n × m grid). Rows drawn at the sample's width would then disagree
     with a freshly drawn m — and a program reading m numbers per row would
     still exit cleanly on the misaligned data, which is worse than failing. */
  if (layout.kind === "rows" && layout.width > 1 && headNames.some((h, i) => h !== nName && Number(sample[0][i]) === layout.width)) { why("grid: the row width is an input"); continue; }
  // Values are drawn as integers, so every sample token must be one: a grid
  // of '#' and '.' rows reads as one token per row and is not a list of numbers.
  if (layout.kind !== "header" && !sample.slice(1).flat().every((tok) => /^-?\d+$/.test(tok))) { why("non-numeric body"); continue; }
  // The statement's own prose may promise what the constraint list does not.
  if (RISKY_PROSE.test(`${d.statementEn || ""} ${input}`)) { why("statement promises structure"); continue; }

  // Names of the body values, from the statement.
  let bodyNames = [];
  if (layout.kind === "line") {
    const m = /(?:contains|follow)[^.]*?\b([a-z])_1\b/i.exec(input) || /(?:contains|follow)[^.]*?\b([a-z])_i\b/i.exec(input);
    bodyNames = m ? [`${m[1]}_i`] : ["values"];
  } else if (layout.kind === "rows") {
    const m = /(?:each|every|the next|following)[^.]*?(?:contains|has|gives) (?:one |two |three |four )?(?:the )?(?:non-negative |positive )?(?:integers?|numbers?|coordinates)?s*([^.—:]+)/i.exec(input);
    // Deduplicated: "two integers s and e with s ≤ e" names s and e once each.
    bodyNames = m ? [...new Set(m[1].match(/\b[a-zA-Z]\b/g) || [])] : [];
    if (bodyNames.length !== layout.width) { why(`row names ${bodyNames} vs width ${layout.width}`); continue; }
  }

  // Every constraint must be a bound chain over known names, or benign prose.
  const known = [...headNames, ...bodyNames.map((b) => b.replace(/_i$/, "")), ...bodyNames];
  const B = bounds(cons);
  let bad = null;
  for (const c of cons) {
    if (chainOf(c)) continue;
    if (READ_AND_CLEARED.has(c)) continue;
    if (RISKY.test(c) || !BENIGN.test(c)) { bad = c; break; }
  }
  if (bad) { why(`constraint "${bad}"`); continue; }

  // Bounds for every name we must generate.
  const want = [...headNames, ...bodyNames.map((b) => (b === "values" ? b : b))];
  const range = {};
  for (const v of want) {
    let b = B[v] || B[v.replace(/_i$/, "")];
    // One line of values whose name the statement did not spell the way the
    // constraints do: take the one bounded name that is not in the header.
    if (!b && layout.kind === "line") {
      const others = Object.keys(B).filter((x) => !headNames.includes(x) && !headNames.includes(x.replace(/_i$/, "")));
      if (others.length === 1) b = B[others[0]];
    }
    if (!b) { bad = `no bound for ${v}`; break; }
    const scope = [...headNames, ...bodyNames.map((x) => x.replace(/_i$/, ""))].filter((x) => x !== v.replace(/_i$/, ""));
    const lo = expr(b[0], scope), hi = expr(b[1], scope);
    if (lo === null || hi === null) { bad = `bound of ${v}: ${b.join(" … ")}`; break; }
    range[v] = [lo, hi];
  }
  if (bad) { why(bad); continue; }
  // Header values are drawn in an order that respects references between them.
  const order = [];
  const pending = [...headNames];
  for (let guard = 0; pending.length && guard < 10; guard++) {
    for (const v of [...pending]) {
      // The size takes its maximum, so only its upper bound can depend on anything.
      const used = v === nName && layout.kind !== "header" ? [range[v][1]] : range[v];
      const refs = used.flatMap((e) => [...e.matchAll(/v_([a-z_]+)/gi)].map((m) => m[1]));
      if (refs.every((r) => order.includes(r) || !headNames.includes(r))) { order.push(v); pending.splice(pending.indexOf(v), 1); }
    }
  }
  /* "0 ≤ k ≤ n ≤ 10^5" read as k ∈ [0, n] and n ∈ [k, 10^5] is a cycle. It is
     broken at a name whose upper bound waits on nothing: its lower bound's
     references are replaced by their own lower bounds (n ∈ [0, 10^5]), and
     the rest follow once it is drawn (k ∈ [0, n]). */
  while (pending.length) {
    const free = pending.find((v) => ![...range[v][1].matchAll(/v_([a-z_]+)/gi)].some((m) => pending.includes(m[1])));
    if (!free) break;
    range[free][0] = range[free][0].replace(/v_([a-z_]+)/gi, (w, name) => (pending.includes(name) && name !== free ? `(${range[name][0]})` : w));
    order.push(free);
    pending.splice(pending.indexOf(free), 1);
    for (let guard = 0; pending.length && guard < 10; guard++) {
      for (const v of [...pending]) {
        const used = v === nName && layout.kind !== "header" ? [range[v][1]] : range[v];
        const refs = used.flatMap((e) => [...e.matchAll(/v_([a-z_]+)/gi)].map((m) => m[1]));
        if (refs.every((r) => order.includes(r) || !headNames.includes(r))) { order.push(v); pending.splice(pending.indexOf(v), 1); }
      }
    }
  }
  if (pending.length) { why("circular header bounds"); continue; }

  const py = (name) => `v_${name.replace(/_i$/, "")}`;
  // The size name takes its maximum (capped), the rest are drawn at random.
  const heavy = OUTPUT_HEAVY.has(key);
  const cap = heavy ? 100000 : N_CAP;
  if (heavy && layout.kind === "line") {
    const [lo, hi] = range[bodyNames[0]];
    range[bodyNames[0]] = [`max(${lo}, -9999)`, `min(${hi}, 99999)`];
  }
  // A header-only problem has no size: every value is just a value.
  if (layout.kind === "header") nName = null;
  const headerCode = order.map((v) => v === nName
    ? `${py(v)} = min(${range[v][1]}, ${cap})`
    : `${py(v)} = r.int(${range[v][0]}, ${range[v][1]})`).join("\n");
  const headLine = `line([${headNames.map(py).join(", ")}])`;
  const variants = [];
  if (layout.kind === "header") {
    variants.push({ note: "random values across the whole range", code: `${headerCode}\nreturn ${headLine}` });
    // Every header value at its maximum, where that is a plain number.
    const allMax = order.map((v) => `${py(v)} = ${v === nName ? `min(${range[v][1]}, ${cap})` : range[v][1]}`).join("\n");
    variants.push({ note: "every value at its maximum", code: `${allMax}\nreturn ${headLine}` });
  } else if (layout.kind === "line") {
    const [lo, hi] = range[bodyNames[0]];
    variants.push({ note: "maximum n, random values", code: `${headerCode}\nreturn ${headLine} + "\\n" + line(r.ints(${py(nName)}, ${lo}, ${hi}))` });
    variants.push({ note: "maximum n, ascending values", code: `${headerCode}\nreturn ${headLine} + "\\n" + line(sorted(r.ints(${py(nName)}, ${lo}, ${hi})))` });
    variants.push({ note: "maximum n, descending values", code: `${headerCode}\nreturn ${headLine} + "\\n" + line(sorted(r.ints(${py(nName)}, ${lo}, ${hi}), reverse=True))` });
    variants.push({ note: "maximum n, every value at its maximum", code: `${headerCode}\nreturn ${headLine} + "\\n" + line([${hi}] * ${py(nName)})` });
  } else {
    // Rows: tuple members may bound one another ("0 ≤ s ≤ e ≤ 10^9"), so they
    // are drawn in row order, each within its own bounds.
    /* "1 ≤ l ≤ r ≤ n": l's upper bound names r, which is drawn after it. A
       bound on a row member not drawn yet is replaced by that member's own
       bound on the same side, so l comes from [1, n] and r from [l, n]. */
    const rowNames = bodyNames.map(py);
    const resolve = (e, side, drawn) => e.replace(/v_[a-z_]+/gi, (w) => {
      const j = rowNames.indexOf(w);
      return j >= 0 && !drawn.includes(w) ? `(${range[bodyNames[j]][side]})` : w;
    });
    const row = bodyNames.map((b, i) => {
      const drawn = rowNames.slice(0, i);
      return `${py(b)} = r.int(${resolve(range[b][0], 0, drawn)}, ${resolve(range[b][1], 1, drawn)})`;
    }).join("; ");
    variants.push({ note: "maximum n, random rows",
      code: `${headerCode}\nrows = []\nfor _ in range(${py(nName)}):\n    ${row}\n    rows.append(line([${bodyNames.map(py).join(", ")}]))\nreturn ${headLine} + "\\n" + "\\n".join(rows)` });
  }
  drafted[key] = variants.map((v, i) => ({ seed: i + 1, ...v }));
}

const body = Object.entries(drafted).map(([k, ts]) =>
  `  ${JSON.stringify(k)}: { tests: [\n${ts.map((t) => `    { seed: ${t.seed}, note: ${JSON.stringify(t.note)}, code: ${JSON.stringify(t.code)} },`).join("\n")}\n  ] },`).join("\n");
writeFileSync(join(HERE, "specs", "100-auto.mjs"), `/* Drafted by tools/big-tests/draft.mjs from each problem's own statement — re-run it rather than editing. */\nexport default {\n${body}\n};\n`);
writeFileSync(join(HERE, "work", "skipped.txt"), skipped.join("\n") + "\n");
console.log(`drafted ${Object.keys(drafted).length}, skipped ${skipped.length} (tools/big-tests/work/skipped.txt)`);
