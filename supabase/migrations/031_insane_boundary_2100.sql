-- 031: insane starts at 2100, not 2000.
--
-- 029 drew the line at 2000 because that was the bank's ceiling at the time,
-- so "the top of the ladder" and "2000" happened to mean the same thing. They
-- no longer do. A 2000 is a hard problem solved carefully; the jump in kind --
-- to a named algorithm you either know or you do not -- happens at 2100.
--
-- Same boundary as difficultyOf in app/ui/rating.ts. If these two ever
-- disagree, a duel shows one label while the problem page shows another.
update public.duel_problem_pool set difficulty = 'hard'
 where rating = 2000 and difficulty <> 'hard';

update public.duel_problem_pool set difficulty = 'insane'
 where rating >= 2100 and difficulty <> 'insane';
