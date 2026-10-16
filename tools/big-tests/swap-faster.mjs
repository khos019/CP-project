#!/usr/bin/env node
/* Puts each tools/big-tests/faster/<key>.cpp body into solutions.ts as that
 * problem's reference, after check-faster.mjs has passed for it. The stored
 * answers are unchanged (the new body reproduces them); only the speed is.
 *
 *   node tools/big-tests/check-faster.mjs key && node tools/big-tests/swap-faster.mjs key
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, "..", "..", "app", "api", "_lib", "solutions.ts");
let s = readFileSync(FILE, "utf8");
for (const key of process.argv.slice(2)) {
  const body = readFileSync(join(HERE, "faster", `${key}.cpp`), "utf8").trim();
  if (body.includes("`") || body.includes("${")) throw new Error(`${key}: the body cannot sit in a template literal`);
  // The working copy may have CRLF line ends (core.autocrlf on Windows).
  const head = new RegExp(`  "${key}": \\{\\r?\\n    solution: cpp\\(\``).exec(s);
  if (!head) throw new Error(`${key}: no such entry`);
  const start = head.index + head[0].length, end = s.indexOf("`),", start);
  // solutions.ts keeps C++ in a template literal: every backslash doubles.
  s = s.slice(0, start) + body.split("\\").join("\\\\") + s.slice(end);
  console.log(`replaced ${key}`);
}
writeFileSync(FILE, s);
