-- AlgoYo'l — a duel winner's account has to be deletable.
--
-- 016 created duel_matches.winner_id as a plain reference to profiles with no
-- ON DELETE rule, so Postgres refuses to delete any account that has ever won
-- a duel:
--
--   update or delete on table "profiles" violates foreign key constraint
--   "duel_matches_winner_id_fkey" on table "duel_matches"
--
-- That is not a test-only inconvenience. It blocks deleting a real learner's
-- account, which is a thing an owner has to be able to do.
--
-- The fix went into 016 as an idempotent ALTER for fresh installs, but a
-- database that already ran 016 never sees it — `create table if not exists`
-- does not amend an existing table, and nobody re-runs a migration they have
-- already applied. So it gets its own file.
--
-- The match itself survives: it is still the other player's history, with the
-- winner recorded as nobody.
--
-- Run AFTER 016. Safe to re-run.

do $$ begin
  alter table public.duel_matches drop constraint if exists duel_matches_winner_id_fkey;
  alter table public.duel_matches add constraint duel_matches_winner_id_fkey
    foreign key (winner_id) references public.profiles(id) on delete set null;
end $$;
