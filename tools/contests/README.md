# Contest archive

Builds and loads the past rounds shown on `/contests`.

1. Apply `supabase/migrations/044_contests.sql` (by hand, like every migration).
2. `node tools/contests/build.mjs` — chooses five bank problems per round
   (A 800–1000, B 1100–1300, C 1300–1500, D 1400–1600, E 1700–1900, never
   reused), simulates 50–70 participants per round, and writes
   `out/seed.json`. Every submission is compiled with the local `g++` and run
   on the real hidden tests first: accepted rows pass them all, rejected rows
   carry the verdict and `passed` count that judging actually produced, and
   anything too close to a time limit to call is left out.
3. `node tools/contests/seed.mjs` — dry run. `--apply` writes to Supabase with
   the service-role key; `--rollback` removes the rounds and every seeded
   account (their submissions cascade).

Seeded accounts are listed in `bot_accounts`, which is not readable over REST.
The owner's statistics leave them out, and the users page lists them only on
a search.

`SEED=<n>` changes the people and results; `JOBS=<n>` sets judging parallelism.
`out/` holds the verdict cache, so a rebuild only re-judges what changed.
