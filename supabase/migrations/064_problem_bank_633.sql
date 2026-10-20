-- 064: four problems, B630-C633, enter the duel pool.
--
-- Written for the roadmap units whose main problem sat more than 400 rating
-- away from the unit's band (app/ui/roadmap-practice.ts): the exchange
-- argument, inclusion-exclusion, circle geometry and FFT/NTT. Each rating
-- sits in its unit's band in app/ui/roadmap-data.ts.
--
-- Generated from tools/problem-authoring/batch-630.mjs alongside the problems
-- themselves; difficulty follows difficultyOf in app/ui/rating.ts.
--
-- Run AFTER 001-063.

insert into public.duel_problem_pool(problem_key, rating, difficulty, topic) values
  ('greedy-weighted-completion-order', 1600, 'medium', 'greedy'),
  ('math-divisible-by-exactly-m', 1900, 'hard', 'math'),
  ('geo-disk-most-points', 2000, 'hard', 'geometry'),
  ('adv-ntt-count-triangles', 2200, 'insane', 'advanced-cp')
on conflict (problem_key) do update set rating = excluded.rating,
  difficulty = excluded.difficulty, topic = excluded.topic;

-- Later additions default to bot_ready = false, which would leave these
-- enabled but reachable only in human-vs-human duels.
update public.duel_problem_pool set bot_ready = true where enabled;
