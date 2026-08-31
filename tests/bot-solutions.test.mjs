/* Every reference solution is checked by the judge, not by eye.
 *
 * Two claims per problem, and both matter:
 *   - the reference solution really is accepted, so a bot that "solves" a round
 *     actually solves it;
 *   - the near-miss really is rejected, so a bot that is supposed to fumble
 *     does not accidentally pass.
 *
 * A wrong variant that quietly passes is the worse bug of the two: the
 * difficulty model would think it had made the bot miss, and the bot would be
 * stronger than its rating claims.
 *
 * Slow on purpose — it runs real submissions through Judge0.
 *
 *   node --test --test-timeout=900000 tests/bot-solutions.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const BASE = (process.env.TEST_BASE_URL || "https://algoyol.cp-project.workers.dev").replace(/\/$/, "");

/* The solutions live in a server-only TypeScript module; this reads it as text
   and pulls the sources out rather than importing it, so the test cannot become
   a route by which the file reaches somewhere it should not be. */
const source = await readFile(new URL("../app/api/_lib/solutions.ts", import.meta.url), "utf8");

function parseSolutions() {
  const out = {};
  // Each entry: "key": { solution: cpp(`...`), wrong: [cpp(`...`)] }
  const entry = /"([a-z0-9-]+)":\s*\{\s*solution:\s*cpp\(`([\s\S]*?)`\),\s*(?:\/\/[^\n]*\n\s*)*wrong:\s*\[([\s\S]*?)\],?\s*\}/g;
  let m;
  while ((m = entry.exec(source))) {
    const wrongs = [...m[3].matchAll(/cpp\(`([\s\S]*?)`\)/g)].map((w) => w[1]);
    out[m[1]] = { solution: m[2], wrong: wrongs };
  }
  return out;
}

const wrap = (body) =>
  `#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\n${
    body.replace(/\\\\n/g, "\\n").replace(/\\\\"/g, '\\"')
  }\nreturn 0;}\n`;

async function judge(problemId, sourceCode) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(`${BASE}/api/judge`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ problemId, language: "cpp20", sourceCode }),
    });
    const result = await response.json().catch(() => ({}));
    // The judge is a shared external service; a transient failure is not a
    // failure of the solution being tested.
    if (result.verdict && result.verdict !== "JUDGE_ERROR") return result;
    await new Promise((r) => setTimeout(r, 1500));
  }
  return { verdict: "JUDGE_ERROR" };
}

const entries = Object.entries(parseSolutions());

test("the file parses into problems with a solution and a near miss", () => {
  assert.ok(entries.length >= 25, `only ${entries.length} problems parsed`);
  for (const [key, value] of entries) {
    assert.ok(value.solution.trim().length > 20, `${key}: empty solution`);
    assert.ok(value.wrong.length >= 1, `${key}: no wrong variant`);
  }
});

for (const [key, value] of entries) {
  test(`${key}: reference solution is accepted`, async () => {
    const result = await judge(key, wrap(value.solution));
    if (result.verdict === "JUDGE_ERROR") {
      // Do not turn a Judge0 outage into a red build.
      console.log(`  (skipped ${key}: judge unavailable)`);
      return;
    }
    assert.equal(result.verdict, "ACCEPTED",
      `${key} expected ACCEPTED, got ${result.verdict}${result.test ? ` on test ${result.test}` : ""}${result.details ? ` — ${String(result.details).slice(0, 200)}` : ""}`);
  });

  test(`${key}: near miss is rejected`, async () => {
    const result = await judge(key, wrap(value.wrong[0]));
    if (result.verdict === "JUDGE_ERROR") {
      console.log(`  (skipped ${key}: judge unavailable)`);
      return;
    }
    assert.notEqual(result.verdict, "ACCEPTED",
      `${key}: the "wrong" variant passed — the bot would be stronger than its rating says`);
  });
}
