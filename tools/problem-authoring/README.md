# Adding problems to the bank

A problem lives in four places, and they have to agree:

| file | holds |
| --- | --- |
| `app/ui/problem-bank.ts` | the statement the learner reads |
| `app/api/judge/tests.ts` | the hidden tests (server-only) |
| `app/api/_lib/solutions.ts` | the duel bot's reference solution and its near misses (server-only) |
| `supabase/migrations/*.sql` | the row that lets a duel select the problem |

Writing those by hand means stating the same facts four times and hoping they
match. They have not always matched: a sample output typed from memory, an
answer key computed by a different mental model than the statement describes, a
pool row whose difficulty label disagrees with its own rating — each of those
has shipped before.

So nothing here is typed twice. A batch file states each problem **once**, with
one reference solution and a list of inputs, and the generator derives the rest.

## Running it

```bash
cd tools/problem-authoring
node run.mjs mybatch.mjs           # verify only, writes nothing
node run.mjs mybatch.mjs --emit    # verify, then append to all four files
node verify.mjs                    # check the four files still agree
```

`--emit` also drops a `mybatch.pool.sql` next to the batch: paste those rows
into a new migration. `--only=key1,key2` restricts a run to named problems,
which is what you want after fixing one entry.

`node unemit.mjs <judge-key>...` removes the **last** entry for a key from the
three appended files — the escape hatch when a batch is emitted and then found
to collide with a key the bank already had.

`example-batch.mjs` is a real batch (the twelve problems of C201–C212) kept as
a reference for the shape of an entry.

## What the generator checks

1. The reference solution compiles (`g++ -O2 -std=c++20`).
2. It is **run** on every sample input to produce the sample outputs, and on
   every hidden input to produce the answer key. Neither is ever typed by hand.
3. If the batch supplies `expect`, the sample outputs must match it. `expect` is
   the answer the author had in mind while writing the sample note — when the
   two disagree, one of them is wrong and the reader would have been the one to
   find out.
4. Every near miss compiles **and fails on at least one hidden test**. A "wrong"
   solution that quietly passes is the worse bug of the pair: the difficulty
   model would think it had made the bot stumble, and the bot would be stronger
   than its rating claims. This check fails a lot in practice, and each failure
   is a hidden test that was not testing anything.
5. Difficulty and points are derived from the rating, never set by hand, using
   the same boundaries as `difficultyOf` in `app/ui/rating.ts`.
5b. `constraintListUz` exists and matches `constraintList` entry for entry.
   Constraints are bilingual like every other prose field; leaving them English
   only would put one English section in the middle of an Uzbek page.
6. `run.mjs` refuses to start if a judge key or problem id is already in the
   bank, because the append would otherwise succeed and leave two problems
   answering to one key.

## Traps worth knowing

- **`]` immediately followed by `}`** in a near miss breaks
  `tests/bot-solutions.test.mjs`, whose regex ends the near-miss array there.
  `st.push_back({v,a[i]})` is enough to do it. Write `make_pair(v,a[i])`
  instead. `verify.mjs` catches this by counting the `cpp(` sources two ways.
- **The judge compares exact output**, so every problem must have exactly one
  correct answer. "Print any valid solution" does not work here.
- **C++ is stored inside a template literal** in `solutions.ts`, so backslashes
  and backticks are escaped on the way out. In a batch file write ordinary C++:
  `"\\n"` in the batch is the C++ escape `\n`.
- `baseline-unparseable.json` records the 99 entries that predate this tool and
  store their near miss as a plain string rather than `cpp(\`...\`)`. The bot
  test's regex has never matched them, so it passes while covering about half
  the bank. They are recorded rather than re-reported on every run.
