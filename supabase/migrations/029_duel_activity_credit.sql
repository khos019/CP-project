-- 029: a duel counts as time on the site.
--
-- Until now the only thing that fed active_seconds was the visible-tab
-- heartbeat: a minute banked for every minute the page was on screen. A duel
-- does not fit that model. Half an hour in the arena is half an hour spent
-- here whether the player watched the clock, read the statement in another
-- window, or sat thinking with the tab in the background — and the heartbeat
-- credits none of the last two.
--
-- So the duel reports its own length. Two things make that safe to accept
-- from a browser, and both live here rather than in the client:
--
--   * the credit is capped by the match's ACTUAL duration, read from
--     duel_matches. The client may ask for less — it subtracts whatever the
--     heartbeat already banked during the duel — but never for more;
--   * the credit is idempotent on (user, match). The result screen can be
--     reached again by a reload, and the same duel is reported by both
--     players; each one pays exactly once. The client's own guard is a
--     localStorage set, which is per-device and therefore not a guard at all
--     once somebody opens a second browser.
--
-- record_activity() is left alone: its five-minute clamp is right for a
-- heartbeat, and a lump sum is exactly what it should keep refusing.

-- ---------------------------------------------------------------------------
-- What has already been paid for.
-- ---------------------------------------------------------------------------
create table if not exists public.duel_activity_credit (
  user_id    uuid not null references public.profiles on delete cascade,
  match_id   uuid not null references public.duel_matches on delete cascade,
  seconds    int  not null check (seconds >= 0),
  created_at timestamptz not null default now(),
  primary key (user_id, match_id)
);
-- No policies: nothing outside the definer function below has any business
-- reading or writing this, and RLS with no policy denies everyone.
alter table public.duel_activity_credit enable row level security;

-- ---------------------------------------------------------------------------
-- Credit one finished duel, once.
-- Returns true when this call is the one that paid, false when the duel was
-- already credited, was not this player's, or has not started.
-- ---------------------------------------------------------------------------
create or replace function public.record_duel_activity(p_match uuid, p_seconds int)
returns boolean language plpgsql security definer set search_path = public as $$
declare
  v_me  uuid := auth.uid();
  v_len int;
  v_add int;
begin
  if v_me is null then raise exception 'not_authenticated'; end if;

  -- Only a player of this duel may claim its time.
  if not exists (select 1 from duel_match_players mp
                  where mp.match_id = p_match and mp.user_id = v_me) then
    return false;
  end if;

  -- The ceiling is the duel itself. An unfinished match is measured to now,
  -- which is the most a player could possibly have spent in it so far.
  select greatest(0, extract(epoch from (coalesce(m.finished_at, now()) - m.started_at))::int)
    into v_len
    from duel_matches m where m.id = p_match;
  if v_len is null then return false; end if;

  v_add := least(greatest(coalesce(p_seconds, 0), 0), v_len);

  insert into duel_activity_credit(user_id, match_id, seconds)
  values (v_me, p_match, v_add)
  on conflict (user_id, match_id) do nothing;
  if not found then return false; end if;          -- somebody already paid

  insert into daily_activity(user_id, day, active_seconds, duels, topics)
  values (v_me, (now() at time zone 'utc')::date, v_add, 1, 0)
  on conflict (user_id, day) do update set
    active_seconds = least(daily_activity.active_seconds + v_add, 86400),
    duels          = daily_activity.duels + 1,
    updated_at     = now();

  return true;
end $$;

revoke all on function public.record_duel_activity(uuid, int) from anon;
grant execute on function public.record_duel_activity(uuid, int) to authenticated;
