-- AlgoYo'l — the qualifying day drops from 50 active minutes to 40.
--
-- 026 set the day at 50+ active minutes, 1+ duel and 1+ finished topic. The
-- minutes are the part a learner cannot shorten by being good at the work: a
-- fast solver still has to sit out the clock. 40 leaves the other two asks
-- untouched.
--
-- The client's DAY_SECONDS_REQUIRED (app/ui/coins.ts) is the same number and
-- must move with this file — the client draws the progress bar from its own
-- constant while the coin is awarded from this table, so a table left at 3000
-- shows a full bar and pays nothing.
--
-- Run AFTER 026.

update public.coin_rules
   set active_seconds_required = 2400;

alter table public.coin_rules
  alter column active_seconds_required set default 2400;
