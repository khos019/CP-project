/* node unemit.mjs <judge-key> [...]
 *
 * Removes the LAST entry for each key from the three appended files. Used when
 * a batch was written and then found to collide with a key the bank already
 * had -- the last occurrence is always the one this session appended.
 */
import { readFileSync, writeFileSync } from "node:fs";

const ROOT = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const keys = process.argv.slice(2);
if (keys.length === 0) { console.error("usage: node unemit.mjs <judge-key>..."); process.exit(1); }

function dropLastLine(path, test) {
  const src = readFileSync(ROOT + "/" + path, "utf8");
  const eol = src.includes("\r\n") ? "\r\n" : "\n";
  const lines = src.split(eol);
  for (let i = lines.length - 1; i >= 0; i--) {
    if (test(lines[i])) { lines.splice(i, 1); writeFileSync(ROOT + "/" + path, lines.join(eol)); return true; }
  }
  return false;
}

for (const key of keys) {
  const inBank = dropLastLine("app/ui/problem-bank.ts", (l) => l.includes('judge:"' + key + '"'));
  const inTests = dropLastLine("app/api/judge/tests.ts", (l) => l.startsWith('  "' + key + '":['));

  // A solutions entry spans several lines, so it is cut as a block.
  const solPath = ROOT + "/app/api/_lib/solutions.ts";
  const src = readFileSync(solPath, "utf8");
  const eol = src.includes("\r\n") ? "\r\n" : "\n";
  const open = '  "' + key + '": {';
  const start = src.lastIndexOf(open);
  let inSol = false;
  if (start >= 0) {
    const close = src.indexOf(eol + "  }," + eol, start);
    if (close >= 0) {
      writeFileSync(solPath, src.slice(0, start) + src.slice(close + eol.length + "  },".length + eol.length));
      inSol = true;
    }
  }
  console.log(key + ": bank=" + inBank + " tests=" + inTests + " solutions=" + inSol);
}
