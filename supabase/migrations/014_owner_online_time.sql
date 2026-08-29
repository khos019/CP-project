-- AlgoYo'l — online time on the owner dashboard.
--
-- Migration 013 already banks engaged time: the client sends a heartbeat once a
-- minute while its tab is visible, and record_activity() clamps it, so
-- daily_activity.active_seconds is a per-learner, per-UTC-day total the browser
-- cannot inflate. Nothing read it back, so the dashboard still said session
-- length was not tracked.
--
-- This replaces owner_platform_stats() with the same aggregate plus the online
-- figures. The whole body is repeated because that is what "create or replace"
-- means — 009 is superseded, not amended.
--
-- daily_activity holds one row per learner per day, which is exactly the shape
-- an owner must never see: the totals below are summed and counted, never
-- returned per person.
--
-- Run AFTER 001-013. Safe to re-run.

create or replace function public.owner_platform_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
  today date := (now() at time zone 'utc')::date;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'owner') then
    raise exception 'Only the owner can read platform statistics'
      using errcode = '42501';
  end if;

  select jsonb_build_object(
    'generated_at', now(),

    -- ---- accounts -------------------------------------------------------
    'learners_total',   (select count(*) from public.profiles),
    'new_today',        (select count(*) from public.profiles where created_at >= date_trunc('day', now())),
    'new_7d',           (select count(*) from public.profiles where created_at >= now() - interval '7 days'),
    'new_30d',          (select count(*) from public.profiles where created_at >= now() - interval '30 days'),

    -- ---- activity, from the auth schema ---------------------------------
    'active_today',     (select count(*) from auth.users where last_sign_in_at >= date_trunc('day', now())),
    'active_7d',        (select count(*) from auth.users where last_sign_in_at >= now() - interval '7 days'),
    'active_30d',       (select count(*) from auth.users where last_sign_in_at >= now() - interval '30 days'),
    'never_signed_in',  (select count(*) from auth.users where last_sign_in_at is null),
    'confirmed',        (select count(*) from auth.users where email_confirmed_at is not null),
    'unconfirmed',      (select count(*) from auth.users where email_confirmed_at is null),

    -- ---- signups per day, last 30 days (zero-filled so the series is honest)
    'signups_daily', (
      select coalesce(jsonb_agg(jsonb_build_object('day', d::date, 'count', c) order by d), '[]'::jsonb)
      from (
        select d, (select count(*) from public.profiles p
                   where p.created_at >= d and p.created_at < d + interval '1 day') as c
        from generate_series(date_trunc('day', now()) - interval '29 days',
                             date_trunc('day', now()), interval '1 day') as d
      ) series
    ),

    -- ---- time spent on the platform -------------------------------------
    -- A learner who never opened the site on a given day has no row, which is
    -- a real zero rather than missing data: the series is zero-filled so the
    -- chart cannot imply activity on days nobody showed up.
    'online_daily', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'day', d::date, 'seconds', s, 'learners', l) order by d), '[]'::jsonb)
      from (
        select d,
               (select coalesce(sum(a.active_seconds), 0)::bigint from public.daily_activity a
                 where a.day = d::date) as s,
               (select count(*)::int from public.daily_activity a
                 where a.day = d::date and a.active_seconds > 0) as l
        from generate_series(date_trunc('day', now()) - interval '29 days',
                             date_trunc('day', now()), interval '1 day') as d
      ) series
    ),
    'online_today_seconds',  (select coalesce(sum(active_seconds), 0)::bigint from public.daily_activity where day = today),
    'online_today_learners', (select count(*)::int from public.daily_activity where day = today and active_seconds > 0),
    'online_7d_seconds',     (select coalesce(sum(active_seconds), 0)::bigint from public.daily_activity where day >= today - 6),
    'online_30d_seconds',    (select coalesce(sum(active_seconds), 0)::bigint from public.daily_activity where day >= today - 29),
    -- Longest single day any one learner has spent, so an outlier behind a
    -- total is visible without naming who it was.
    'online_max_day_seconds',(select coalesce(max(active_seconds), 0)::int from public.daily_activity where day >= today - 29),

    -- ---- composition ----------------------------------------------------
    'by_language', (
      select coalesce(jsonb_object_agg(preferred_language, n), '{}'::jsonb)
      from (select preferred_language, count(*) n from public.profiles group by 1) x
    ),
    'by_role', (
      select coalesce(jsonb_object_agg(role, n), '{}'::jsonb)
      from (select role::text as role, count(*) n from public.profiles group by 1) x
    ),
    'rating_avg', (select coalesce(round(avg(duel_rating)), 0) from public.profiles),
    'rating_max', (select coalesce(max(duel_rating), 0) from public.profiles),

    -- ---- learning activity ----------------------------------------------
    'learners_with_progress', (select count(distinct user_id) from public.unit_progress),
    'units_completed',        (select count(*) from public.unit_progress where solved and quiz_score >= 70),
    'quizzes_passed',         (select count(*) from public.unit_progress where quiz_score >= 70),
    'problems_solved',        (select count(*) from public.unit_progress where solved),

    -- ---- which topics people actually study ------------------------------
    -- unit slugs look like 'programming-basics-1'; the trailing index is the
    -- unit number, so trimming it yields the track.
    'top_topics', (
      select coalesce(jsonb_agg(t order by t->>'units' desc), '[]'::jsonb)
      from (
        select jsonb_build_object(
                 'topic',    regexp_replace(unit_slug, '-[0-9]+$', ''),
                 'units',    count(*),
                 'learners', count(distinct user_id)
               ) as t
        from public.unit_progress
        group by regexp_replace(unit_slug, '-[0-9]+$', '')
        limit 10
      ) x
    )
  ) into result;

  return result;
end
$$;

revoke all on function public.owner_platform_stats() from public;
grant execute on function public.owner_platform_stats() to authenticated;

-- The dashboard reads whole days off daily_activity; without this every load is
-- a sequential scan once the table has a season of rows in it.
create index if not exists idx_daily_activity_day on public.daily_activity(day);
