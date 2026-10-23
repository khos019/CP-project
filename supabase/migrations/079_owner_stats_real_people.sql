-- 079: the owner's account figures count real people, and "active" means
-- opened the site.
--
-- Two things made the Hisoblar cards disagree with the site:
--
-- 1. Seeded accounts were counted as people. 045 put every profile back into
--    the statistics so the total matches the leaderboard, and that stays:
--    learners_total is still every profile. But two kinds of seeded account
--    sit in it, and every other figure (new, confirmed, never signed in,
--    language, rating) counted them too:
--      * bot_accounts (044): the contest archive's participants, 96 today;
--      * the 100 empty accounts created on 2026-10-02 with
--        raw_user_meta_data.seed = true (seed-N@seed.algoyol.test). They were
--        never in bot_accounts, so even the duel figures' bot filter missed
--        them. Their email is confirmed and nobody ever signed in to them,
--        which is why "Hech kirmagan" said 230 when 34 real people had never
--        signed in.
--    learners_real and learners_seeded are new; every other account figure
--    now leaves seeded accounts out.
--
-- 2. "Tizimga kirgan" read auth.users.last_sign_in_at. That moves only on a
--    fresh password or Google sign-in, not when a learner who stayed signed in
--    comes back, so it said 65 for the week while 85 people had the site open.
--    visited_today / visited_7d / visited_30d are new and come from
--    user_presence.last_seen_at, which the app shell's heartbeat moves for
--    every signed-in learner on every screen. The active_* sign-in figures
--    stay for the page's "Bugun tizimga kirgan" card, without seeded accounts.
--
-- Days are still UTC, as in 014: daily_activity is recorded by UTC day, and a
-- page whose cards rolled over at different hours would disagree with itself.
--
-- Run AFTER 044 and 045. Safe to re-run.

create or replace function public.owner_platform_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
  today date := (now() at time zone 'utc')::date;
  seeded uuid[];
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'owner') then
    raise exception 'Only the owner can read platform statistics'
      using errcode = '42501';
  end if;

  seeded := array(
    select user_id from public.bot_accounts
    union
    select id from auth.users where raw_user_meta_data->>'seed' = 'true'
  );

  with people as (
    select p.* from public.profiles p where not (p.id = any(seeded))
  ),
  people_auth as (
    select u.* from auth.users u where not (u.id = any(seeded))
  )
  select jsonb_build_object(
    'generated_at', now(),

    -- ---- accounts -------------------------------------------------------
    'learners_total',   (select count(*) from public.profiles),
    'learners_real',    (select count(*) from people),
    'learners_seeded',  (select count(*) from public.profiles where id = any(seeded)),
    'new_today',        (select count(*) from people where created_at >= date_trunc('day', now())),
    'new_7d',           (select count(*) from people where created_at >= now() - interval '7 days'),
    'new_30d',          (select count(*) from people where created_at >= now() - interval '30 days'),

    -- ---- opened the site, from the presence heartbeat --------------------
    'visited_today',    (select count(*) from public.user_presence
                          where last_seen_at >= date_trunc('day', now()) and not (user_id = any(seeded))),
    'visited_7d',       (select count(*) from public.user_presence
                          where last_seen_at >= now() - interval '7 days' and not (user_id = any(seeded))),
    'visited_30d',      (select count(*) from public.user_presence
                          where last_seen_at >= now() - interval '30 days' and not (user_id = any(seeded))),

    -- ---- sign-ins, from the auth schema ---------------------------------
    'active_today',     (select count(*) from people_auth where last_sign_in_at >= date_trunc('day', now())),
    'active_7d',        (select count(*) from people_auth where last_sign_in_at >= now() - interval '7 days'),
    'active_30d',       (select count(*) from people_auth where last_sign_in_at >= now() - interval '30 days'),
    'never_signed_in',  (select count(*) from people_auth where last_sign_in_at is null),
    'confirmed',        (select count(*) from people_auth where email_confirmed_at is not null),
    'unconfirmed',      (select count(*) from people_auth where email_confirmed_at is null),

    -- ---- signups per day, last 30 days (zero-filled so the series is honest)
    'signups_daily', (
      select coalesce(jsonb_agg(jsonb_build_object('day', d::date, 'count', c) order by d), '[]'::jsonb)
      from (
        select d, (select count(*) from people p
                   where p.created_at >= d and p.created_at < d + interval '1 day') as c
        from generate_series(date_trunc('day', now()) - interval '29 days',
                             date_trunc('day', now()), interval '1 day') as d
      ) series
    ),

    -- ---- time spent on the platform -------------------------------------
    -- Seeded accounts never open the site, so these need no filter.
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
    'online_max_day_seconds',(select coalesce(max(active_seconds), 0)::int from public.daily_activity where day >= today - 29),

    -- ---- composition ----------------------------------------------------
    'by_language', (
      select coalesce(jsonb_object_agg(preferred_language, n), '{}'::jsonb)
      from (select preferred_language, count(*) n from people group by 1) x
    ),
    'by_role', (
      select coalesce(jsonb_object_agg(role, n), '{}'::jsonb)
      from (select role::text as role, count(*) n from people group by 1) x
    ),
    'rating_avg', (select coalesce(round(avg(duel_rating)), 0) from people),
    'rating_max', (select coalesce(max(duel_rating), 0) from people),

    -- ---- learning activity ----------------------------------------------
    'learners_with_progress', (select count(distinct user_id) from public.unit_progress where not (user_id = any(seeded))),
    'units_completed',        (select count(*) from public.unit_progress where solved and quiz_score >= 70 and not (user_id = any(seeded))),
    'quizzes_passed',         (select count(*) from public.unit_progress where quiz_score >= 70 and not (user_id = any(seeded))),
    'problems_solved',        (select count(*) from public.unit_progress where solved and not (user_id = any(seeded))),

    -- ---- which topics people actually study ------------------------------
    'top_topics', (
      select coalesce(jsonb_agg(t order by t->>'units' desc), '[]'::jsonb)
      from (
        select jsonb_build_object(
                 'topic',    regexp_replace(unit_slug, '-[0-9]+$', ''),
                 'units',    count(*),
                 'learners', count(distinct user_id)
               ) as t
        from public.unit_progress
        where not (user_id = any(seeded))
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
