-- 071: fifty new problems, A635–B684, enter the duel pool.
--
-- Picked from usage: duels and submissions cluster at 1000–1599, where the
-- bank had the fewest problems per round played, and on foundations,
-- sorting, two pointers, strings, math, geometry, binary search and greedy.
-- 18 problems at 1000–1100, 32 at 1200–1500.
--
-- Generated from tools/problem-authoring/batch-635…675.mjs alongside the
-- problems themselves; difficulty follows difficultyOf in app/ui/rating.ts.
--
-- Run AFTER 001-070.

insert into public.duel_problem_pool(problem_key, rating, difficulty, topic) values
  ('fnd-chessboard-same-colour', 1000, 'easy', 'foundations'),
  ('sort-closest-k-for-a-team', 1000, 'easy', 'sorting'),
  ('str-abbreviate-long-words', 1000, 'easy', 'strings'),
  ('str-pangram-check', 1000, 'easy', 'strings'),
  ('fnd-clock-hands-angle', 1100, 'easy', 'foundations'),
  ('fnd-days-between-dates', 1100, 'easy', 'foundations'),
  ('fnd-snake-fill-grid', 1100, 'easy', 'foundations'),
  ('fnd-weekday-of-a-date', 1100, 'easy', 'foundations'),
  ('sort-one-swap-to-sorted', 1100, 'easy', 'sorting'),
  ('str-alternating-binary-flips', 1100, 'easy', 'strings'),
  ('geo-rectangle-fourth-corner', 1000, 'easy', 'geometry'),
  ('math-lucky-tickets-count', 1000, 'easy', 'math'),
  ('math-odds-then-evens', 1000, 'easy', 'math'),
  ('str-reverse-only-vowels', 1000, 'easy', 'strings'),
  ('tp-taking-cards-from-the-ends', 1000, 'easy', 'two-pointers'),
  ('ds-first-unique-in-a-stream', 1100, 'easy', 'data-structures'),
  ('fnd-matrix-multiplication', 1100, 'easy', 'foundations'),
  ('greedy-every-kth-item-free', 1100, 'easy', 'greedy'),
  ('tp-most-even-team', 1200, 'medium', 'two-pointers'),
  ('tp-palindrome-after-one-deletion', 1200, 'medium', 'two-pointers'),
  ('sort-dance-partners', 1200, 'medium', 'sorting'),
  ('sort-smallest-sum-of-products', 1200, 'medium', 'sorting'),
  ('str-isomorphic-strings', 1200, 'medium', 'strings'),
  ('sort-increments-to-make-unique', 1300, 'medium', 'sorting'),
  ('str-fewest-deletions-a-before-b', 1300, 'medium', 'strings'),
  ('str-zigzag-rows', 1300, 'medium', 'strings'),
  ('tp-candy-eating-rounds', 1300, 'medium', 'two-pointers'),
  ('tp-chocolate-from-both-ends', 1300, 'medium', 'two-pointers'),
  ('sort-car-fleets', 1400, 'medium', 'sorting'),
  ('tp-longest-mountain', 1400, 'medium', 'two-pointers'),
  ('geo-smallest-covering-square', 1200, 'medium', 'geometry'),
  ('math-divisible-by-a-or-b', 1200, 'medium', 'math'),
  ('math-perfect-squares-in-range', 1200, 'medium', 'math'),
  ('geo-point-and-triangle', 1300, 'medium', 'geometry'),
  ('str-count-ip-addresses', 1400, 'medium', 'strings'),
  ('geo-most-points-on-a-line', 1500, 'medium', 'geometry'),
  ('math-divisors-of-a-factorial', 1500, 'medium', 'math'),
  ('math-sum-of-floor-quotients', 1500, 'medium', 'math'),
  ('sort-smallest-maximum-lateness', 1500, 'medium', 'sorting'),
  ('str-decode-nested-repeats', 1500, 'medium', 'strings'),
  ('greedy-can-reach-the-end', 1200, 'medium', 'greedy'),
  ('bs-closest-value-queries', 1300, 'medium', 'binary-search'),
  ('fnd-game-of-life-steps', 1300, 'medium', 'foundations'),
  ('math-last-digit-huge-power', 1300, 'medium', 'math'),
  ('bs-aggressive-cows', 1400, 'medium', 'binary-search'),
  ('bs-machines-production-time', 1400, 'medium', 'binary-search'),
  ('ds-lru-cache-misses', 1400, 'medium', 'data-structures'),
  ('greedy-circular-fuel-start', 1400, 'medium', 'greedy'),
  ('greedy-partition-into-labels', 1500, 'medium', 'greedy'),
  ('tp-subarrays-product-below-k', 1500, 'medium', 'two-pointers')
on conflict (problem_key) do update set rating = excluded.rating,
  difficulty = excluded.difficulty, topic = excluded.topic;

-- Later additions default to bot_ready = false, which would leave these
-- enabled but reachable only in human-vs-human duels.
update public.duel_problem_pool set bot_ready = true where enabled;
