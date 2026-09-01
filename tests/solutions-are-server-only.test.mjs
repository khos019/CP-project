/* The reference solutions must not reach the browser.
 *
 * Hiding them with CSS or a conditional render is not security — anything in
 * the client bundle is readable by anyone who opens devtools, and a learner who
 * can read the bot's solution can read their own answer key. The only real
 * guarantee is that the file is never imported into client code, and the only
 * way to keep that true over time is to check the built output.
 *
 * This is deliberately a check on `dist/`, not on the import graph: a re-export
 * through three modules would still be an import, and a build is the thing that
 * actually decides what ships.
 *
 *   npm run build && node --test tests/solutions-are-server-only.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const CLIENT_DIR = new URL("../dist/client", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const MARKER = "ALGOYOL_SERVER_ONLY_SOLUTIONS";

// Fragments that only appear in reference solutions, not in starter code or
// lesson snippets. If one of these turns up in the client bundle, something
// imported the solutions module.
const FINGERPRINTS = [
  "__builtin_popcountll",
  "a.erase(unique(a.begin(),a.end()),a.end())",
  "sort(a.rbegin(),a.rend())",
];

async function walk(dir) {
  const found = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(full)));
    else if (/\.(js|mjs|css|html|json|map)$/.test(entry.name)) found.push(full);
  }
  return found;
}

test("the client bundle exists to be checked", async () => {
  const info = await stat(CLIENT_DIR).catch(() => null);
  assert.ok(info?.isDirectory(), `run the build first — ${CLIENT_DIR} is missing`);
});

test("no reference solution reaches the browser", async () => {
  const files = await walk(CLIENT_DIR);
  assert.ok(files.length > 0, "no client assets found");

  const offenders = [];
  for (const file of files) {
    const text = await readFile(file, "utf8").catch(() => "");
    if (text.includes(MARKER)) offenders.push(`${file}: contains the module marker`);
    for (const print of FINGERPRINTS) {
      if (text.includes(print)) offenders.push(`${file}: contains "${print}"`);
    }
  }
  assert.deepEqual(offenders, [], `reference solutions leaked into the client bundle:\n${offenders.join("\n")}`);
});

test("hidden judge tests stay server-side too", async () => {
  const files = await walk(CLIENT_DIR);
  const offenders = [];
  for (const file of files) {
    const text = await readFile(file, "utf8").catch(() => "");
    // An expected output from tests.ts that no statement or sample contains.
    if (text.includes("457992974") || text.includes("918091266")) offenders.push(file);
  }
  assert.deepEqual(offenders, [], `hidden expected outputs leaked into the client bundle:\n${offenders.join("\n")}`);
});
