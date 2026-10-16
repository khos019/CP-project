/* Helpers for spec files. */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SLOW = join(dirname(fileURLToPath(import.meta.url)), "slow");

/** Every tools/big-tests/slow/<key>-<n>.cpp: programs that must now fail. */
export function slow(key) {
  const out = [];
  for (let n = 1; existsSync(join(SLOW, `${key}-${n}.cpp`)); n++) out.push(readFileSync(join(SLOW, `${key}-${n}.cpp`), "utf8"));
  return out;
}
