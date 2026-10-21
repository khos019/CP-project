-- 069: one problem, C634, enters the duel pool.
--
-- Written for the roadmap unit geometry-12 (sweep line in geometry), whose
-- main problem had been a 1500 two-rectangle overlap while the unit's band is
-- 2000-2200: the union area of up to 10^5 rectangles, a sweep line over x
-- with a segment tree over y.
--
-- Generated from tools/problem-authoring/batch-634.mjs alongside the problem
-- itself; difficulty follows difficultyOf in app/ui/rating.ts.
--
-- Run AFTER 001-064 (068 belongs to the contest work and is independent).

insert into public.duel_problem_pool(problem_key, rating, difficulty, topic) values
  ('geo-union-of-rectangles-area', 2100, 'insane', 'geometry')
on conflict (problem_key) do update set rating = excluded.rating,
  difficulty = excluded.difficulty, topic = excluded.topic;

-- Later additions default to bot_ready = false, which would leave these
-- enabled but reachable only in human-vs-human duels.
update public.duel_problem_pool set bot_ready = true where enabled;
