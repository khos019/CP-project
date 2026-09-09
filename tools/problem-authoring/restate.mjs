/* Editing the prose of problems that are already in the bank.
 *
 * run.mjs appends new problems; nothing could change the words of one that had
 * already shipped, and the four files are explicitly not to be hand-edited --
 * a statement typed straight into details.ts is how the halves of a problem
 * start disagreeing. This is the missing operation: a rewrite of prose fields,
 * done in place, by id.
 *
 * Two jobs, one file scanner:
 *
 *   node restate.mjs --strip-legend
 *       Removes legendUz/legendEn (and the older storyUz/storyEn) from every
 *       entry. The italic paragraph above the task was topic framing, and it
 *       was read before the task it framed -- which is precisely backwards for
 *       somebody who came to solve the problem.
 *
 *   node restate.mjs patches/<name>.mjs
 *       Applies a patch module: an array of { id, statementUz, statementEn },
 *       replacing those two fields for the ids it names. The I/O fields and the
 *       constraint lists may be patched the same way. Everything else about the
 *       problem -- limits, samples, answer key, reference solution -- is
 *       untouched, because none of it depends on the wording.
 *
 * Nothing here re-runs the judge: prose is the only thing it can change, and a
 * sample output cannot move because a sentence did. `node verify.mjs` still
 * has to pass afterwards, and it is run at the end of every invocation.
 *
 * The scanner is deliberate about strings. details.ts is one line per problem
 * with escaped quotes throughout, so "find the next comma" and "find the
 * closing quote" are both wrong; every field is located by walking the line
 * with the quoting rules in hand.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const DETAILS = join(ROOT, "app/api/problem/details.ts");
const NL = "\n";

/* ------------------------------------------------------------- the scanner */

/** End index (exclusive) of the string literal that starts at `i` (a quote). */
function endOfString(line, i) {
  for (let k = i + 1; k < line.length; k++) {
    if (line[k] === "\\") { k++; continue; }
    if (line[k] === '"') return k + 1;
  }
  throw new Error("unterminated string at " + i);
}

/** End index (exclusive) of the [...] or {...} that starts at `i`. */
function endOfBracket(line, i) {
  const open = line[i];
  const close = open === "[" ? "]" : "}";
  let depth = 0;
  for (let k = i; k < line.length; k++) {
    const c = line[k];
    if (c === '"') { k = endOfString(line, k) - 1; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return k + 1; }
  }
  throw new Error("unterminated bracket at " + i);
}

/** Where `key` lives on this line: the whole `key:value` span, and the value's
    own span. Null when the entry does not carry that field. */
function fieldSpan(line, key) {
  const needle = key + ":";
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { i = endOfString(line, i) - 1; continue; }
    if (c !== needle[0]) continue;
    if (line.slice(i, i + needle.length) !== needle) continue;
    // A key is preceded by the object's brace or by the comma after the
    // previous field -- otherwise this is a substring of a longer key.
    const before = line[i - 1];
    if (before !== "{" && before !== ",") continue;
    const vs = i + needle.length;
    const v = line[vs];
    const ve = v === '"' ? endOfString(line, vs)
      : v === "[" || v === "{" ? endOfBracket(line, vs)
      : (() => { let k = vs; while (k < line.length && line[k] !== "," && line[k] !== "}") k++; return k; })();
    return { start: i, end: ve, valueStart: vs, valueEnd: ve };
  }
  return null;
}

/** The line with `key` and its value removed, comma included. */
function dropField(line, key) {
  const at = fieldSpan(line, key);
  if (!at) return line;
  let end = at.end;
  if (line[end] === ",") end++;                    // the usual case
  else if (line[at.start - 1] === ",") return line.slice(0, at.start - 1) + line.slice(end);
  return line.slice(0, at.start) + line.slice(end);
}

/** The line with `key`'s value replaced by `value`, encoded as JSON -- which
    is how details.ts writes both its strings and its lists. */
function setJsonField(line, key, value) {
  const at = fieldSpan(line, key);
  if (!at) throw new Error("no field " + key + " to replace");
  return line.slice(0, at.valueStart) + JSON.stringify(value) + line.slice(at.valueEnd);
}

const ENTRY = /^ "([A-Z][0-9]+)":\{/;

function readDetails() {
  const text = readFileSync(DETAILS, "utf8");
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  return { lines: text.split(eol), eol };
}
const writeDetails = (lines, eol) => writeFileSync(DETAILS, lines.join(eol));

/* ------------------------------------------------------------------- jobs */

function stripLegend() {
  const { lines, eol } = readDetails();
  let touched = 0;
  const out = lines.map((line) => {
    if (!ENTRY.test(line)) return line;
    let next = line;
    for (const key of ["legendUz", "legendEn", "storyUz", "storyEn"]) next = dropField(next, key);
    if (next !== line) touched++;
    return next;
  });
  writeDetails(out, eol);
  process.stdout.write("stripped the legend from " + touched + " statements" + NL);
}

async function applyPatch(file) {
  const patch = (await import(new URL(file, "file://" + process.cwd().replace(/\\/g, "/") + "/"))).default;
  if (!Array.isArray(patch)) throw new Error(file + ": default export must be an array");

  const { lines, eol } = readDetails();
  const byId = new Map(patch.map((p) => [p.id, p]));
  const seen = new Set();

  const out = lines.map((line) => {
    const m = ENTRY.exec(line);
    if (!m) return line;
    const p = byId.get(m[1]);
    if (!p) return line;
    seen.add(m[1]);
    let next = line;
    for (const key of ["statementUz", "statementEn", "inputUz", "inputEn", "outputUz", "outputEn", "constraints"]) {
      if (typeof p[key] === "string") next = setJsonField(next, key, p[key]);
    }
    /* The bounds are a list, and the two languages have to stay entry for
       entry -- verify.mjs checks exactly that, so a patch that rewrites one
       must rewrite the other. */
    for (const key of ["constraintList", "constraintListUz"]) {
      if (Array.isArray(p[key])) next = setJsonField(next, key, p[key]);
    }
    return next;
  });

  const missing = patch.map((p) => p.id).filter((id) => !seen.has(id));
  if (missing.length) throw new Error("no entry in details.ts for: " + missing.join(", "));

  /* A rewrite that shortens the statement is a mistake in the other direction:
     the whole point of the pass is that the task is explained in the task. */
  for (const p of patch) {
    for (const key of ["statementUz", "statementEn"]) {
      if (typeof p[key] === "string" && p[key].length < 240) {
        throw new Error(p.id + ": " + key + " is " + p[key].length +
          " characters -- a rewritten statement is expected to explain the task in full");
      }
    }
  }

  writeDetails(out, eol);
  process.stdout.write("rewrote " + seen.size + " statements" + NL);
}

/* ------------------------------------------------------------------- entry */

const arg = process.argv[2];
if (!arg) {
  process.stderr.write("usage: node restate.mjs --strip-legend | node restate.mjs <patch.mjs>" + NL);
  process.exit(2);
}

if (arg === "--strip-legend") stripLegend();
else await applyPatch(arg);

// The four files still have to agree, and this touched one of them.
execFileSync(process.execPath, [join(ROOT, "tools/problem-authoring/verify.mjs")], { stdio: "inherit" });
