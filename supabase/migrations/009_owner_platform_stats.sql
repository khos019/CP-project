-- AlgoYo'l — owner-only platform statistics.
--
-- The numbers an owner wants are spread across three places, and two of them
-- are deliberately unreadable from a browser:
--
--   profiles       readable by anyone (RLS "public profiles") — signups, roles,
--                  language, ratings
--   unit_progress  RLS restricts every caller to their OWN rows, so no client
--                  can aggregate learning activity across the platform
--   auth.users     last_sign_in_at and email confirmation live here and are
--                  never exposed to the anon or authenticated roles at all
--
-- Relaxing either RLS policy to make a dashboard possible would leak every
-- learner's progress and sign-in times to anyone holding the public anon key.
-- Instead this is one security-definer function that refuses anybody who is not
-- an owner and returns only aggregates — never a row about an individual.
--
-- Run AFTER 001-008. Safe to re-run.

create or replace function public.owner_platform_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
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

-- ---------------------------------------------------------------------------
-- profiles.solved_count was never written by anything, so it sat at 0 for every
-- account and the leaderboard showed "0 AC" for everyone. unit_progress already
-- records solves server-side, so the counter is derived from it by trigger
-- rather than incremented from the browser, where it could simply be lied about.
-- ---------------------------------------------------------------------------
create or replace function public.sync_solved_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid := coalesce(new.user_id, old.user_id);
begin
  update public.profiles p
     set solved_count = (select count(*) from public.unit_progress up
                          where up.user_id = target and up.solved)
   where p.id = target;
  return coalesce(new, old);
end
$$;

drop trigger if exists trg_sync_solved_count on public.unit_progress;
create trigger trg_sync_solved_count
  after insert or update or delete on public.unit_progress
  for each row execute function public.sync_solved_count();

-- Backfill the accounts that already have progress.
update public.profiles p
   set solved_count = coalesce((select count(*) from public.unit_progress up
                                 where up.user_id = p.id and up.solved), 0);
