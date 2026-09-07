-- 029: the insane tier.
--
-- duel_problem_pool.difficulty has been constrained to easy/medium/hard since
-- 016. The bank now has a fourth tier for the problems rated 2000 and above —
-- the advanced-cp end of the ladder — and 027 inserts those rows, so the check
-- has to admit it before the pool can hold them.
alter table public.duel_problem_pool drop constraint if exists duel_problem_pool_difficulty_check;
alter table public.duel_problem_pool add constraint duel_problem_pool_difficulty_check
  check (difficulty in ('easy', 'medium', 'hard', 'insane'));

-- Bring the rows already in the pool into line with the bank's own rule, so a
-- duel's difficulty label matches the rating it selected on. Same boundary as
-- difficultyOf in app/ui/rating.ts: 2000 and above is insane.
update public.duel_problem_pool set difficulty = 'insane'
 where rating >= 2000 and difficulty <> 'insane';
