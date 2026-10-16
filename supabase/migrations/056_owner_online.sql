-- 056: who is on the site right now, for the owner's statistics page.
--
-- 018 kept presence deliberately small for everyone else: users_online()
-- answers "which of these ids are here" and online_now() a bare count, never a
-- timestamp. The owner's page needs the list itself, so this is a separate,
-- owner-only function rather than a wider public one.
--
-- Online means the same thing everywhere: a heartbeat (sent every 25 s from
-- any page while signed in) inside presence_window_seconds (45 s). The last
-- 15 minutes come back too, so the page can show who just left.
--
-- Run AFTER 018. Safe to re-run.

create or replace function public.owner_online_users()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_window int := duel_cfg('presence_window_seconds', 45)::int;
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'owner') then
    raise exception 'Only the owner can see who is online' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'window_seconds', v_window,
    'now', now(),
    'users', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', p.id, 'username', p.username, 'display_name', p.display_name,
               'duel_rating', p.duel_rating, 'role', p.role,
               'seconds_ago', floor(extract(epoch from now() - pr.last_seen_at))::int,
               'online', pr.last_seen_at > now() - (v_window || ' seconds')::interval,
               'in_duel', exists (select 1 from duel_match_players mp where mp.user_id = p.id and mp.active))
             order by pr.last_seen_at desc)
        from user_presence pr join profiles p on p.id = pr.user_id
       where pr.last_seen_at > now() - interval '15 minutes'), '[]'::jsonb));
end $$;

revoke all on function public.owner_online_users() from public;
grant execute on function public.owner_online_users() to authenticated;
