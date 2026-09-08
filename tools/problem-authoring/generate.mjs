/* AlgoYo'l problem generator.
 *
 * Authoring a problem by hand means writing the same facts in four places and
 * hoping they agree. They do not: a sample output typed from memory, a hidden
 * test whose answer key was computed by a different mental model than the
 * statement describes, a pool row whose difficulty label disagrees with its
 * rating. Every one of those has already happened in this repo.
 *
 * So nothing here is typed twice. A batch file states the problem once, with
 * ONE reference solution and a list of inputs. This script:
 *
 *   1. compiles the reference solution with g++
 *   2. RUNS it on every sample input   -> the sample outputs
 *   3. RUNS it on every hidden input   -> the answer key
 *   4. compiles each near-miss and CHECKS IT ACTUALLY FAILS on some hidden
 *      test, because a "wrong" solution that quietly passes makes the duel bot
 *      stronger than its rating claims
 *   5. derives difficulty and points from the rating, so the label and the
 *      number cannot disagree
 *   6. emits the four artefacts
 *
 * A problem that does not survive step 4 does not get written out.
 */
import { execFileSync, execSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const HERE = import.meta.dirname;
const WORK = join(HERE, "build");
mkdirSync(WORK, { recursive: true });

const NL = String.fromCharCode(10);
const BS = String.fromCharCode(92);
const TICK = String.fromCharCode(96);

const wrap = (body) =>
  "#include <bits/stdc++.h>" + NL + "using namespace std;" + NL +
  "int main(){ios::sync_with_stdio(false);cin.tie(nullptr);" + NL +
  body + NL + "return 0;}" + NL;

/* A batch file holds C++ as an ordinary JS string, so what the module exports
   is already compilable source -- nothing to un-escape before g++ sees it.
   solutions.ts, though, stores the same source inside a template literal, so
   every backslash and backtick has to be escaped on the way out. Getting this
   backwards is silent: a C++ newline escape written unescaped turns into a
   real newline inside a string literal and the file stops compiling. */
const forTemplateLiteral = (body) =>
  body.split(BS).join(BS + BS).split(TICK).join(BS + TICK).split("${").join(BS + "${");

function build(body, label) {
  const src = join(WORK, label + ".cpp");
  const exe = join(WORK, label + ".exe");
  writeFileSync(src, wrap(body));
  try {
    execSync('g++ -O2 -std=c++20 -o "' + exe + '" "' + src + '"', { stdio: "pipe" });
  } catch (e) {
    throw new Error("compile failed for " + label + ":" + NL + (e.stderr ? e.stderr.toString() : e.message));
  }
  return exe;
}

function run(exe, stdin, ms = 10000) {
  const out = execFileSync(exe, { input: stdin, timeout: ms, maxBuffer: 64 << 20 });
  // Judge0 compares trimmed output; normalise CRLF from the Windows runtime and
  // guarantee exactly one trailing newline so the key never carries whitespace
  // the statement never promised.
  return out.toString().split(String.fromCharCode(13) + NL).join(NL).replace(/\s+$/, "") + NL;
}

const difficultyOf = (r) => (r < 1200 ? "easy" : r < 1800 ? "medium" : r < 2100 ? "hard" : "insane");
const pointsOf = (d) => ({ easy: 100, medium: 200, hard: 300, insane: 400 })[d];

export function generate(problems) {
  const out = [];
  for (const p of problems) {
    const ref = build(p.sol, p.judge + "-ref");

    const samples = p.sampleInputs.map((input) => ({ input, output: run(ref, input) }));
    const tests = p.testInputs.map((stdin) => ({ stdin, expected_output: run(ref, stdin) }));

    /* The sample note explains WHY the answer is what it is, so the author had
       to have an answer in mind while writing it. `expect` is that answer,
       stated up front. When it disagrees with what the reference prints, one of
       the two is wrong and the reader would have been the one to find out. */
    if (p.expect) {
      p.expect.forEach((want, i) => {
        const got = samples[i].output;
        if (got !== want) {
          throw new Error(
            p.judge + ": sample " + (i + 1) + " -- the note explains " + j(want) +
            " but the reference prints " + j(got));
        }
      });
      if (p.expect.length !== samples.length) {
        throw new Error(p.judge + ": expect has " + p.expect.length + " entries for " + samples.length + " samples");
      }
    }

    // A near miss that no hidden test distinguishes is not a near miss; it is a
    // second correct solution, and the bot would pass every round it was meant
    // to fumble.
    (p.wrong || []).forEach((w, i) => {
      const bad = build(w, p.judge + "-wrong" + i);
      let differs = false;
      for (const t of tests) {
        let got;
        try { got = run(bad, t.stdin, 5000); } catch { differs = true; break; }
        if (got !== t.expected_output) { differs = true; break; }
      }
      if (!differs) throw new Error(p.judge + ": wrong[" + i + "] passes every hidden test");
    });

    /* Constraints are bilingual like every other prose field. A batch that
       leaves them English-only would put one English section in the middle of
       an otherwise Uzbek page -- which is what the whole bank looked like until
       the lists were translated, and it is not worth letting back in. */
    if (!p.constraintListUz || p.constraintListUz.length !== p.constraintList.length) {
      throw new Error(p.judge + ": constraintListUz must exist and match constraintList entry for entry" +
        " (" + (p.constraintListUz ? p.constraintListUz.length : "missing") + " vs " + p.constraintList.length + ")");
    }

    const difficulty = difficultyOf(p.rating);
    out.push({ ...p, difficulty, points: pointsOf(difficulty), samples, tests });
    process.stdout.write("  ok " + p.judge + " (" + p.rating + " " + difficulty + ")" + NL);
  }
  return out;
}

/* ---- emitters: each appends to the real file, never rewrites it ---- */

const ROOT = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const j = (v) => JSON.stringify(v);

/* Two of the three targets are CRLF in the working tree and one is LF, and
   git normalises on commit either way -- but an append that mixes the two puts
   a lone LF in the middle of a CRLF file, which shows up as a whole-file diff
   the next time anything touches it. So each file keeps its own ending. */
const eolOf = (text) => (text.includes("\r" + NL) ? "\r" + NL : NL);

/* Insert `block` immediately before the last occurrence of `anchor`. The anchor
   is the literal text that closes the structure being appended to, so a
   mismatch fails loudly here rather than writing into the wrong place -- the
   first version of this looked for "};" in a file that ends "} as const;" and
   left the repo half-written. */
function insertBefore(text, anchor, block, label) {
  const at = text.lastIndexOf(anchor);
  if (at < 0) throw new Error(label + ": anchor " + j(anchor) + " not found");
  return text.slice(0, at) + block + text.slice(at);
}

export function emit(rows) {
  /* 1. The bank is two files. app/ui/problem-bank.ts is the index the client
     bundles for every problem; the prose goes to app/api/problem/details.ts,
     which is server-only and fetched one problem at a time. A problem must
     land in BOTH or it will list without a statement, so they are written
     together and the ids are checked against each other afterwards. */
  const bankPath = join(ROOT, "app/ui/problem-bank.ts");
  const detailPath = join(ROOT, "app/api/problem/details.ts");
  let bank = readFileSync(bankPath, "utf8");
  let detail = readFileSync(detailPath, "utf8");

  const indexLines = rows.map((p) => " {" + [
    "id:" + j(p.id), "uz:" + j(p.uz), "en:" + j(p.en),
    "difficulty:" + j(p.difficulty), "rating:" + p.rating, "tag:" + j(p.tag),
    "points:" + p.points, "topic:" + j(p.topic), "judge:" + j(p.judge),
    "timeLimitMs:" + (p.timeLimitMs ?? 1000), "memoryMb:" + (p.memoryMb ?? 256),
  ].join(",") + "},");

  const detailLines = rows.map((p) => " " + j(p.id) + ":{" + [
    "legendUz:" + j(p.legendUz), "legendEn:" + j(p.legendEn),
    "statementUz:" + j(p.statementUz), "statementEn:" + j(p.statementEn),
    "inputUz:" + j(p.inputUz), "inputEn:" + j(p.inputEn),
    "outputUz:" + j(p.outputUz), "outputEn:" + j(p.outputEn),
    "constraints:" + j(p.constraintList.join("; ")),
    "constraintList:" + j(p.constraintList),
    "constraintListUz:" + j(p.constraintListUz),
    "sampleNotesUz:" + j(p.sampleNotesUz), "sampleNotesEn:" + j(p.sampleNotesEn),
    "samples:" + j(p.samples),
  ].join(",") + "},");

  const bankEol = eolOf(bank);
  bank = insertBefore(bank, "];" + bankEol, indexLines.join(bankEol) + bankEol, "problem-bank.ts");
  writeFileSync(bankPath, bank);

  const detailEol = eolOf(detail);
  detail = insertBefore(detail, "};" + detailEol, detailLines.join(detailEol) + detailEol, "details.ts");
  writeFileSync(detailPath, detail);

  // 2. app/api/judge/tests.ts
  const testsPath = join(ROOT, "app/api/judge/tests.ts");
  let t = readFileSync(testsPath, "utf8");
  const tEol = eolOf(t);
  const tLines = rows.map((p) => "  " + j(p.judge) + ":" + j(p.tests) + ",");
  t = insertBefore(t, "} as const;", tLines.join(tEol) + tEol, "tests.ts");

  /* The judge reads its CPU budget from problemCpuSeconds, so a problem that
     states 2 s and is missing from that table gets judged at 1 s -- a correct
     solution fails on the very problem whose constraints argue about the time
     limit. Regenerate the whole table from the bank rather than appending to
     it, so it cannot drift. */
  const bankNow = readFileSync(bankPath, "utf8");
  const slow = [...bankNow.matchAll(/judge:"([a-z0-9-]+)",timeLimitMs:(\d+),/g)]
    .filter((m) => Number(m[2]) !== 1000)
    .map((m) => "  " + j(m[1]) + ":" + Number(m[2]) / 1000);
  const open = "export const problemCpuSeconds: Record<string, number> = {";
  const from = t.indexOf(open);
  if (from < 0) throw new Error("tests.ts: problemCpuSeconds table not found");
  const to = t.indexOf(tEol + "};", from);
  t = t.slice(0, from + open.length) + tEol + slow.join("," + tEol) + "," + t.slice(to);
  writeFileSync(testsPath, t);

  // 3. app/api/_lib/solutions.ts -- emitted in the exact shape
  //    tests/bot-solutions.test.mjs parses, or the bot's own test stops seeing
  //    these problems and silently covers fewer of them than it reports.
  const solPath = join(ROOT, "app/api/_lib/solutions.ts");
  let s = readFileSync(solPath, "utf8");
  const sEol = eolOf(s);
  const sLines = rows.map((p) => {
    const wrongs = (p.wrong || []).map((w) => "cpp(" + TICK + forTemplateLiteral(w) + TICK + ")").join(", ");
    const note = p.wrongNote ? "    // " + p.wrongNote + sEol : "";
    return "  " + j(p.judge) + ": {" + sEol +
      "    solution: cpp(" + TICK + forTemplateLiteral(p.sol) + TICK + ")," + sEol +
      note + "    wrong: [" + wrongs + "]," + sEol + "  },";
  });
  /* NOT just "};": a reference solution that defines a lambda ends in "};"
     too, so once one of those is appended it becomes the last match and the
     next batch would land inside a C++ string literal. Match the last entry's
     close together with the object's, then insert between the two. */
  const closer = "  }," + sEol + "};" + sEol;
  const cAt = s.lastIndexOf(closer);
  if (cAt < 0) throw new Error("solutions.ts: could not find the end of the solutions object");
  const cut = cAt + ("  }," + sEol).length;
  s = s.slice(0, cut) + sLines.join(sEol) + sEol + s.slice(cut);
  writeFileSync(solPath, s);

  // 4. duel pool rows
  return rows
    .slice()
    .sort((a, b) => a.rating - b.rating || a.judge.localeCompare(b.judge))
    .map((p) => "  ('" + p.judge + "', " + p.rating + ", '" + p.difficulty + "', '" + p.topic + "')")
    .join("," + NL);
}
