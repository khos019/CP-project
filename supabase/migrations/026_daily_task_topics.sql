-- AlgoYo'l — the qualifying day, restated.
--
-- Until now a day counted when the learner banked 30 active minutes and three
-- duels. Duels were the whole ask, so a learner could hold a streak without
-- ever opening a lesson. The day is now:
--
--   50+ active minutes  AND  1+ duel  AND  1+ topic finished
--
-- A finished topic is a roadmap unit crossing into done (quiz >= 70% and the
-- problem accepted); the client reports that transition once, the same way it
-- reports a finished duel.
--
-- Run AFTER 013.

alter table public.daily_activity
  add column if not exists topics int not null default 0 check (topics >= 0);

alter table public.coin_rules
  add column if not exists topics_required int not null default 1;

update public.coin_rules
   set active_seconds_required = 3000, duels_required = 1, topics_required = 1;

alter table public.coin_rules
  alter column active_seconds_required set default 3000,
  alter column duels_required set default 1;

-- ---------------------------------------------------------------------------
-- Heartbeat, now carrying finished topics. The old two-argument function is
-- dropped rather than kept: leaving it in place would make record_activity(
-- p_seconds, p_duels) ambiguous against the defaulted third argument.
-- ---------------------------------------------------------------------------
drop function if exists public.record_activity(int, int);

create or replace function public.record_activity(p_seconds int, p_duels int default 0, p_topics int default 0)
returns void language plpgsql security definer set search_path = public as $$
declare v_add int := least(greatest(coalesce(p_seconds, 0), 0), 300); -- 5 min per call
        v_duels int := least(greatest(coalesce(p_duels, 0), 0), 3);
        v_topics int := least(greatest(coalesce(p_topics, 0), 0), 3);
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  insert into daily_activity(user_id, day, active_seconds, duels, topics)
  values (auth.uid(), (now() at time zone 'utc')::date, v_add, v_duels, v_topics)
  on conflict (user_id, day) do update set
    -- a day cannot bank more than 24h of activity
    active_seconds = least(daily_activity.active_seconds + v_add, 86400),
    duels = daily_activity.duels + v_duels,
    topics = daily_activity.topics + v_topics,
    updated_at = now();
end $$;

-- ---------------------------------------------------------------------------
-- Streak length and streak start, both reading the third requirement.
-- ---------------------------------------------------------------------------
create or replace function public.qualifying_streak(p_user uuid default auth.uid())
returns int language plpgsql stable security definer set search_path = public as $$
declare v_req_sec int; v_req_duels int; v_req_topics int; v_day date; v_streak int := 0; v_cursor date;
begin
  select active_seconds_required, duels_required, topics_required
    into v_req_sec, v_req_duels, v_req_topics
  from coin_rules order by streak_days limit 1;
  v_req_sec := coalesce(v_req_sec, 3000);
  v_req_duels := coalesce(v_req_duels, 1);
  v_req_topics := coalesce(v_req_topics, 1);

  -- Start from today if today already qualifies, otherwise from yesterday, so
  -- a streak is not lost merely because the current day is still in progress.
  select max(day) into v_day from daily_activity
   where user_id = p_user and active_seconds >= v_req_sec and duels >= v_req_duels
     and topics >= v_req_topics
     and day >= (now() at time zone 'utc')::date - 1;
  if v_day is null then return 0; end if;

  v_cursor := v_day;
  loop
    exit when not exists (
      select 1 from daily_activity
       where user_id = p_user and day = v_cursor
         and active_seconds >= v_req_sec and duels >= v_req_duels
         and topics >= v_req_topics);
    v_streak := v_streak + 1;
    v_cursor := v_cursor - 1;
  end loop;
  return v_streak;
end $$;

create or replace function public.streak_start(p_user uuid default auth.uid())
returns date language plpgsql stable security definer set search_path = public as $$
declare v_streak int; v_last date; v_req_sec int; v_req_duels int; v_req_topics int;
begin
  v_streak := qualifying_streak(p_user);
  if v_streak = 0 then return null; end if;
  select active_seconds_required, duels_required, topics_required
    into v_req_sec, v_req_duels, v_req_topics
  from coin_rules order by streak_days limit 1;
  select max(day) into v_last from daily_activity
   where user_id = p_user
     and active_seconds >= coalesce(v_req_sec, 3000)
     and duels >= coalesce(v_req_duels, 1)
     and topics >= coalesce(v_req_topics, 1)
     and day >= (now() at time zone 'utc')::date - 1;
  return v_last - (v_streak - 1);
end $$;

revoke all on function public.record_activity(int, int, int)   from anon;
grant execute on function public.record_activity(int, int, int) to authenticated;
