-- AlgoYo'l — showing who is here.
--
-- 016 added user_presence for matchmaking: one row per learner, overwritten by
-- a heartbeat every 25 seconds. Only the matchmaker could read it, because the
-- table has RLS on with no policies at all and every caller went through a
-- security definer function.
--
-- That is still the right shape. "Who is online" is a question about other
-- people, and the answer should be as small as the question: this returns the
-- subset of a given list that is currently here — not timestamps, not a
-- browsable directory of everybody's activity. A last_seen_at exposed per user
-- is a log of when somebody studies; a boolean is not.
--
-- Signed in only, for the same reason: an anonymous visitor can already read
-- the leaderboard, and adding "and here is who is at their desk right now"
-- to a public page is a different thing from a public ranking.
--
-- Run AFTER 016. Safe to re-run.

-- ---------------------------------------------------------------------------
-- 1. Which of these people are online.
--
-- Takes the ids a screen is already rendering, so the cost is bounded by what
-- is on screen rather than by how many accounts exist.
-- ---------------------------------------------------------------------------
create or replace function public.users_online(p_ids uuid[])
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(pr.user_id), '[]'::jsonb)
    from user_presence pr
   where auth.uid() is not null
     and pr.user_id = any(p_ids)
     and pr.last_seen_at > now() - (duel_cfg('presence_window_seconds', 45) || ' seconds')::interval
$$;
revoke all on function public.users_online(uuid[]) from public;
grant execute on function public.users_online(uuid[]) to authenticated;

-- ---------------------------------------------------------------------------
-- 2. How many people are on the platform right now.
--
-- A count is not about any particular person, so this one is public — it is
-- the honest version of the "1,284 active today" the landing page used to
-- invent before migration 009 replaced it with a real number.
-- ---------------------------------------------------------------------------
create or replace function public.online_now()
returns int language sql stable security definer set search_path = public as $$
  select count(*)::int from user_presence
   where last_seen_at > now() - (duel_cfg('presence_window_seconds', 45) || ' seconds')::interval
$$;
grant execute on function public.online_now() to anon, authenticated;
