/* C289 — "Summing the multiples of two numbers" — a correction, not a rewrite.
 *
 * Two things were wrong, and they are the same thing said twice:
 *
 *   - The last bound read "the sum can reach about 5·10^23, so it is taken
 *     modulo nothing -- use a 128-bit intermediate or note that it stays below
 *     10^24 only in the worst case; here n ≤ 10^12 keeps it under 10^24 / 2".
 *     That is a note to the author arguing with itself, printed to the reader
 *     as a constraint, and it tells them how to implement it.
 *   - The statement said the answer "does not fit in a 32-bit type", which is
 *     true and badly understates it. The hidden test for n = 10^12, a = b = 1
 *     expects 500000000000500000000000 — past 10^23, so past 64 bits as well.
 *     A solver who reads "not 32 bits" reaches for a 64-bit type and gets a
 *     wrong answer on a bound the statement never mentioned.
 *
 * The fix states the magnitude and stops there: how to hold a number that
 * large is the solver's problem, which is the whole point of the bound.
 *
 * What this patch does NOT fix is that a problem needing 128-bit arithmetic is
 * rated 900 and labelled easy. That is a rating question, not a prose one.
 *
 * Applied with: node restate.mjs patches/batch-14-c289.mjs
 */
const bounds = [
  "1 ≤ n ≤ 10^12",
  "1 ≤ a, b ≤ 10^6",
  "a and b may be equal",
  "the answer can reach about 5·10^23, which is past the range of a 64-bit integer type",
];
const boundsUz = [
  "1 ≤ n ≤ 10^12",
  "1 ≤ a, b ≤ 10^6",
  "a va b teng bo‘lishi mumkin",
  "javob taxminan 5·10^23 gacha yetadi, ya'ni 64-bitli butun turning chegarasidan ham chiqib ketadi",
];

export default [
  {
    id: "C289",
    statementUz: "Sizga uchta son — n, a va b — berilgan. 1 dan n gacha bo'lgan (n ning o'zi ham kiradi) butun sonlar orasidan a ga qoldiqsiz bo'linadigan yoki b ga qoldiqsiz bo'linadigan barchasini qaraymiz; ikkalasiga ham bo'linadigan son bu to'plamda bir marta hisoblanadi. Shu sonlarning yig'indisini hisoblang va uni chiqaring. a va b teng bo'lishi mumkin — bunday holda shart bitta bo'linuvchanlikka aylanadi. Javob taxminan 5·10^23 gacha yetadi, ya'ni u nafaqat 32-bitli, balki 64-bitli butun turga ham sig'maydi.",
    statementEn: "You are given three numbers: n, a and b. Consider the integers from 1 to n inclusive that are divisible by a or divisible by b; a number divisible by both belongs to that collection once. Compute the sum of those numbers and print it. Note that a and b may be equal, in which case the condition collapses to a single divisibility. The answer reaches about 5·10^23, so it fits neither a 32-bit nor a 64-bit integer type.",
    constraints: bounds.join("; "),
    constraintList: bounds,
    constraintListUz: boundsUz,
  },
];
