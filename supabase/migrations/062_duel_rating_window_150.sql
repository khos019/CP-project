-- AlgoYo'l — a ranked search only pairs people within ±150 rating.
--
-- The search radius started at ±100 and widened by 100 every 2 seconds up to
-- ±400, so a 1700 player could be matched with a 1300 one. Now it starts at
-- ±100, reaches ±150 after 2 seconds and stops there. Nobody inside that
-- window within human_wait_seconds (12) → the existing fallback starts a bot
-- duel, exactly as before.
--
-- duel_tick() and duel_try_pair() already read these keys, so only the
-- config changes. The "available opponents" count on the search screen now
-- counts only people inside the window, so it no longer promises opponents
-- the search would never pick.
--
-- Run AFTER 023. Safe to re-run.

insert into public.duel_config(key, value, note) values
  ('initial_rating_range', '100'::jsonb, 'Elo radius searched at t=0'),
  ('rating_range_step',    '50'::jsonb,  'radius widens by this…'),
  ('rating_range_interval','2'::jsonb,   '…every this many seconds'),
  ('max_rating_range',     '150'::jsonb, 'radius stops widening here')
on conflict (key) do update set value = excluded.value, updated_at = now();

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
     and abs(coalesce(p.duel_rating, 1200)
             - coalesce((select me.duel_rating from profiles me where me.id = auth.uid()), 1200))
         <= duel_cfg('max_rating_range', 150)
$$;
grant execute on function public.duel_available_count() to authenticated;
