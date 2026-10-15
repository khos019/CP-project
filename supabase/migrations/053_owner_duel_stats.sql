-- 053: duel counts for the owner's statistics page.
--
-- Separate from owner_platform_stats on purpose: that function is the one the
-- page cannot load without, and a new figure should not be able to break it.
-- The page asks for this alongside it and shows a dash until this is applied.
--
-- What counts as a duel played:
--   * finished — an abandoned search never became a duel, and one still in
--     progress is reported apart as `live`;
--   * with at least one real learner in it. The duel history generated for
--     the contest archive (tools/contests/duels.mjs) is seeded accounts
--     playing each other; it fills the archive's profiles but nobody played
--     it, so it is left out here.
--
-- "Today" is the day in Tashkent, not in UTC: the owner reads this page in
-- Uzbekistan, where a UTC day would roll over at 05:00.
--
-- Run AFTER 044. Safe to re-run.

create or replace function public.owner_duel_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  day_start timestamptz := date_trunc('day', now() at time zone 'Asia/Tashkent') at time zone 'Asia/Tashkent';
  result jsonb;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'owner') then
    raise exception 'Only the owner can read platform statistics' using errcode = '42501';
  end if;

  with played as (
    select m.mode, m.finished_at
      from public.duel_matches m
     where m.status = 'finished'
       and exists (select 1 from public.duel_match_players p
                    where p.match_id = m.id and p.user_id is not null
                      and not exists (select 1 from public.bot_accounts b where b.user_id = p.user_id))
  ),
  windows as (
    select 'today' as k, day_start as since union all
    select 'd7',  now() - interval '7 days' union all
    select 'd30', now() - interval '30 days' union all
    select 'all', '-infinity'::timestamptz
  )
  select jsonb_object_agg(w.k, jsonb_build_object(
           'total', (select count(*) from played where finished_at >= w.since),
           'ai',    (select count(*) from played where finished_at >= w.since and mode = 'bot'),
           'rated', (select count(*) from played where finished_at >= w.since and mode = 'human')))
         || jsonb_build_object(
           'live', (select count(*) from public.duel_matches where status = 'active'),
           'players_today', (
             select count(distinct p.user_id)
               from public.duel_matches m
               join public.duel_match_players p on p.match_id = m.id
              where m.status = 'finished' and m.finished_at >= day_start
                and p.user_id is not null
                and not exists (select 1 from public.bot_accounts b where b.user_id = p.user_id)))
    into result
    from windows w;

  return result;
end
$$;

revoke all on function public.owner_duel_stats() from public;
grant execute on function public.owner_duel_stats() to authenticated;
