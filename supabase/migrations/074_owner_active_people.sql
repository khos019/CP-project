-- 074: who was on the site on a given day, for the owner's statistics page.
--
-- Asked for on 22 Oct 2026: the page counted the learners active each day
-- (owner_platform_stats.online_daily.learners, from daily_activity) but never
-- said who they were. This returns that day's list: everybody with at least
-- one active second, longest time first, with their duels that day and
-- whether the account was opened that same day.
--
-- The day is daily_activity's UTC day, the same one the chart counts, so the
-- list for a bar always has as many people as the bar says.
--
-- Owner only, like owner_online_users (056). Run AFTER 013. Safe to re-run.

create or replace function public.owner_active_people(p_day date default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_day date := coalesce(p_day, (now() at time zone 'utc')::date);
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'owner') then
    raise exception 'Only the owner can see who was active' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'day', v_day,
    'users', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', p.id, 'username', p.username, 'display_name', p.display_name,
               'duel_rating', p.duel_rating, 'seconds', a.active_seconds, 'duels', a.duels,
               'joined', (p.created_at at time zone 'utc')::date = v_day)
             order by a.active_seconds desc, p.username)
        from daily_activity a join profiles p on p.id = a.user_id
       where a.day = v_day and a.active_seconds > 0), '[]'::jsonb));
end $$;

revoke all on function public.owner_active_people(date) from public;
grant execute on function public.owner_active_people(date) to authenticated;
