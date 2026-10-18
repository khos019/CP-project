-- 062: nine problems, A621-C629, enter the duel pool.
--
-- Written for the roadmap units that had no problem of their own and borrowed
-- the nearest one (app/ui/roadmap-practice.ts): bubble sort, extended Euclid,
-- parallel binary search, Catalan numbers, the persistent segment tree, the
-- implicit treap, the palindromic tree, the virtual tree and tree isomorphism.
-- Each rating sits in its unit's band in app/ui/roadmap-data.ts.
--
-- Generated from tools/problem-authoring/batch-621.mjs alongside the problems
-- themselves; difficulty follows difficultyOf in app/ui/rating.ts.
--
-- Run AFTER 001-061.

insert into public.duel_problem_pool(problem_key, rating, difficulty, topic) values
  ('sort-bubble-swaps-and-passes', 900, 'easy', 'sorting'),
  ('math-bezout-smallest-x', 1100, 'easy', 'math'),
  ('bs-parallel-first-day-watered', 1600, 'medium', 'binary-search'),
  ('math-brackets-complete-prefix', 1700, 'medium', 'math'),
  ('adv-persistent-kth-smallest', 2000, 'hard', 'advanced-cp'),
  ('adv-treap-reverse-and-move', 2100, 'insane', 'advanced-cp'),
  ('str-eertree-distinct-palindromes', 2100, 'insane', 'strings'),
  ('tree-virtual-sum-pair-distances', 2200, 'insane', 'trees'),
  ('tree-isomorphism-unrooted', 2300, 'insane', 'trees')
on conflict (problem_key) do update set rating = excluded.rating,
  difficulty = excluded.difficulty, topic = excluded.topic;

-- Later additions default to bot_ready = false, which would leave these
-- enabled but reachable only in human-vs-human duels.
update public.duel_problem_pool set bot_ready = true where enabled;
