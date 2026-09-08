/* node run.mjs batch01.mjs          -- verify only, touch nothing
 * node run.mjs batch01.mjs --emit   -- verify, then write into the repo
 *
 * Verify-only is the default on purpose: emitting is an append into four
 * tracked files, and doing that with a batch that has not compiled yet leaves
 * the repo half-written.
 */
import { generate, emit } from "./generate.mjs";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [file, ...flags] = process.argv.slice(2);
if (!file) {
  console.error("usage: node run.mjs <batch.mjs> [--emit]");
  process.exit(1);
}

const mod = await import("./" + file);
const only = flags.find((f) => f.startsWith("--only="));
const problems = only
  ? mod.default.filter((p) => only.slice(7).split(",").includes(p.judge))
  : mod.default;
console.log(file + ": " + problems.length + " problems");

/* Collide with a key the bank already uses and the append succeeds while the
   repo ends up with two problems answering to one judge key -- the second
   entry's hidden tests shadow the first's. Catch it before anything is
   written, not after. */
{
  const bank = readFileSync(new URL("../../app/ui/problem-bank.ts", import.meta.url), "utf8");
  const haveKeys = new Set([...bank.matchAll(/judge:"([a-z0-9-]+)"/g)].map((m) => m[1]));
  const haveIds = new Set([...bank.matchAll(/\{id:"([A-Z0-9]+)"/g)].map((m) => m[1]));
  const clashes = [];
  for (const p of problems) {
    if (haveKeys.has(p.judge)) clashes.push("judge key already in the bank: " + p.judge);
    if (haveIds.has(p.id)) clashes.push("problem id already in the bank: " + p.id);
  }
  if (clashes.length) { console.error(clashes.join("\n")); process.exit(1); }
}

const rows = generate(problems);

if (!flags.includes("--emit")) {
  console.log("\nverified, nothing written (pass --emit to append)");
  process.exit(0);
}

const sql = emit(rows);
const out = join(import.meta.dirname, file.replace(/\.mjs$/, "") + ".pool.sql");
writeFileSync(out, sql + "\n");
console.log("\nappended " + rows.length + " problems; pool rows in " + out);
