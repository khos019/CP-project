/* node lint.mjs batch-549.mjs — the cheap checks before a full run: prose
 * lengths, bilingual constraint lists, ids and keys not already in the bank
 * or repeated within the batches being written. */
import { readFileSync } from "node:fs";
const bank = readFileSync(new URL("../../app/ui/problem-bank.ts", import.meta.url), "utf8");
const haveKeys = new Set([...bank.matchAll(/judge:"([a-z0-9-]+)"/g)].map((m) => m[1]));
const haveIds = new Set([...bank.matchAll(/\{id:"([A-Z0-9]+)"/g)].map((m) => m[1]));
const seenK = new Set(), seenI = new Set();
let bad = 0;
const say = (m) => { bad++; console.log("  ✗ " + m); };
for (const file of process.argv.slice(2)) {
  for (const p of (await import("./" + file)).default) {
    for (const k of ["statementUz", "statementEn"]) if ((p[k] || "").length < 250) say(`${p.judge}: ${k} is ${(p[k] || "").length} characters`);
    if ((p.constraintListUz || []).length !== p.constraintList.length) say(`${p.judge}: constraint lists differ`);
    if (haveKeys.has(p.judge) || seenK.has(p.judge)) say(`${p.judge}: judge key taken`);
    if (haveIds.has(p.id) || seenI.has(p.id)) say(`${p.id}: id taken`);
    for (const w of p.wrong || []) if (/\]\s*\}/.test(w)) say(`${p.judge}: a near miss has ] followed by } (breaks the bot test regex)`);
    if (/\]\s*\}/.test(p.sol)) say(`${p.judge}: the reference has ] followed by }`);
    seenK.add(p.judge); seenI.add(p.id);
  }
}
console.log(bad ? `${bad} problem(s)` : "lint clean");
process.exit(bad ? 1 : 0);
