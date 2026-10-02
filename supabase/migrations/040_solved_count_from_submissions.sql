-- AlgoYo'l — profiles.solved_count counts solved problems, not finished lessons.
--
-- 009 derived the counter from unit_progress. That is roadmap progress, and it
-- is not what the leaderboard prints the number as: the row says "37 AC", and
-- AC is an accepted submission to a bank problem. The profile page noticed
-- this in 034 and stopped trusting the column — it counts distinct problems
-- with an ACCEPTED row in bank_submissions — but the leaderboard still read
-- the column, so on 2026-10-02 every row said "0 AC" while nine learners had
-- between 3 and 37 problems solved.
--
-- The column now holds exactly what 034 and has_solved() mean by solved, and
-- is kept by a trigger on the table that decides it. Duel solves are already
-- written through to bank_submissions (017), so they count without anything
-- here knowing about duels.
--
-- Run AFTER 001-039.

create or replace function public.sync_solved_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid := coalesce(new.user_id, old.user_id);
begin
  update public.profiles p
     set solved_count = (select count(distinct s.problem_key) from public.bank_submissions s
                          where s.user_id = target and s.verdict = 'ACCEPTED')
   where p.id = target;
  return coalesce(new, old);
end
$$;

-- The old source. Left attached, a finished lesson would overwrite the count
-- with the number of solved units.
drop trigger if exists trg_sync_solved_count on public.unit_progress;

drop trigger if exists trg_sync_solved_count on public.bank_submissions;
create trigger trg_sync_solved_count
  after insert or update or delete on public.bank_submissions
  for each row execute function public.sync_solved_count();

-- The leaderboard orders by rating, then by this.
create index if not exists idx_bank_sub_accepted
  on public.bank_submissions(user_id, problem_key) where verdict = 'ACCEPTED';

-- Backfill every account, including the ones that go back to zero.
update public.profiles p
   set solved_count = coalesce((select count(distinct s.problem_key) from public.bank_submissions s
                                 where s.user_id = p.id and s.verdict = 'ACCEPTED'), 0);
