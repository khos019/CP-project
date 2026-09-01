-- AlgoYo'l — "Mavjud raqiblar: 1" when nobody else was there.
--
-- duel_available_count() counted every learner who was online and free, and
-- the person doing the searching is one of those. So a lone player watching
-- the search screen was told there was one opponent available, which is both
-- wrong and quietly discouraging in the other direction: it suggests the
-- matchmaker is failing to reach somebody who is right there.
--
-- Everything else about the count is unchanged: same presence window, same
-- exclusions the matchmaker itself applies, so the number still means "people
-- this search could actually challenge".
--
-- Run AFTER 017. Safe to re-run.

create or replace function public.duel_available_count()
returns int language sql stable security definer set search_path = public as $$
  select count(*)::int
    from profiles p
    join user_presence pr on pr.user_id = p.id
   where pr.duel_ready
     and p.id <> coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)
     and pr.last_seen_at > now() - (duel_cfg('presence_window_seconds', 45) || ' seconds')::interval
     and p.suspended_at is null
     and not exists (select 1 from duel_match_players mp where mp.user_id = p.id and mp.active)
$$;
grant execute on function public.duel_available_count() to authenticated;
