-- AlgoYo'l — contests: an archive of past rounds and their standings.
--
-- 1. contests / contest_problems — the round itself: when it ran, how long,
--    and which bank problem sat in each slot (A..E).
--
-- 2. contest_entries — which bank_submissions rows were sent *in* a round.
--    The standings are not stored anywhere: they are computed from
--    bank_submissions every time, so every "+2 01:14" on the board is a real
--    row on that person's submissions page, with its verdict, time and code.
--    A board that kept its own copy of the numbers could disagree with the
--    profile; this one cannot.
--
-- 3. bot_accounts — which accounts are seeded participants. Kept out of
--    profiles on purpose: profiles is readable column by column over REST,
--    and this table has RLS on with no policy, so only security-definer
--    functions see it. The owner's statistics and the users page use it so
--    the owner still sees the real learner count.
--
-- Run AFTER 001-043. Safe to re-run.

-- ---------------------------------------------------------------------------
-- 0. Seeded accounts.
-- ---------------------------------------------------------------------------
create table if not exists public.bot_accounts (
  user_id uuid primary key references public.profiles on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.bot_accounts enable row level security;
-- No policy: nobody reads this over REST.

-- ---------------------------------------------------------------------------
-- 1. Rounds and their problems.
-- ---------------------------------------------------------------------------
create table if not exists public.contests (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,64}$'),
  number int not null unique,
  title_uz text not null,
  title_en text not null,
  starts_at timestamptz not null,
  duration_minutes int not null check (duration_minutes between 30 and 600),
  -- ICPC-style: every rejected attempt before the accepted one costs this many
  -- minutes, and only on problems that end up solved.
  penalty_minutes int not null default 20 check (penalty_minutes between 0 and 60),
  archived boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_contests_starts on public.contests(starts_at desc);

create table if not exists public.contest_problems (
  contest_id uuid not null references public.contests on delete cascade,
  idx text not null check (idx ~ '^[A-Z]$'),
  problem_key text not null,          -- the judge key, as in bank_submissions
  bank_id text not null,              -- the bank id, as in /problem/A01
  title_uz text not null,
  title_en text not null,
  rating int not null,
  primary key (contest_id, idx),
  unique (contest_id, problem_key)
);

alter table public.contests enable row level security;
drop policy if exists "contests are public" on public.contests;
create policy "contests are public" on public.contests for select using (true);

alter table public.contest_problems enable row level security;
drop policy if exists "contest problems are public" on public.contest_problems;
create policy "contest problems are public" on public.contest_problems for select using (true);

-- ---------------------------------------------------------------------------
-- 2. Which submissions belong to a round.
-- ---------------------------------------------------------------------------
create table if not exists public.contest_entries (
  submission_id uuid primary key references public.bank_submissions on delete cascade,
  contest_id uuid not null references public.contests on delete cascade,
  idx text not null,
  user_id uuid not null references public.profiles on delete cascade,
  foreign key (contest_id, idx) references public.contest_problems (contest_id, idx) on delete cascade
);
create index if not exists idx_contest_entries_contest on public.contest_entries(contest_id, user_id);
alter table public.contest_entries enable row level security;
-- No policy: read through the functions below, which never return code.

-- ---------------------------------------------------------------------------
-- 3. The list.
-- ---------------------------------------------------------------------------
create or replace function public.contest_list()
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(x.payload order by x.starts_at desc), '[]'::jsonb)
  from (
    select c.starts_at,
           jsonb_build_object(
             'slug',             c.slug,
             'number',           c.number,
             'title_uz',         c.title_uz,
             'title_en',         c.title_en,
             'starts_at',        c.starts_at,
             'duration_minutes', c.duration_minutes,
             'archived',         c.archived,
             'participants',     (select count(distinct e.user_id) from contest_entries e
                                   where e.contest_id = c.id),
             'problems',         (select coalesce(jsonb_agg(jsonb_build_object(
                                            'idx', p.idx, 'rating', p.rating) order by p.idx), '[]'::jsonb)
                                    from contest_problems p where p.contest_id = c.id)
           ) as payload
    from contests c
  ) x
$$;

-- ---------------------------------------------------------------------------
-- 4. The standings, computed from bank_submissions.
--
--    Only attempts inside the round's window count. A compile error is not
--    penalised (the usual rule); every other rejected attempt before the
--    first accepted one is. Ties on solved and penalty share a rank.
-- ---------------------------------------------------------------------------
create or replace function public.contest_standings(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests; result jsonb;
begin
  select * into v_c from contests where slug = p_slug;
  if not found then return null; end if;

  with e as (
    select ce.user_id, ce.idx, s.verdict, s.created_at
      from contest_entries ce
      join bank_submissions s on s.id = ce.submission_id
     where ce.contest_id = v_c.id
       and s.created_at >= v_c.starts_at
       and s.created_at <  v_c.starts_at + make_interval(mins => v_c.duration_minutes)
       and s.verdict not in ('COMPILATION_ERROR', 'JUDGE_ERROR')
  ),
  first_ac as (
    select user_id, idx, min(created_at) as ac_at
      from e where verdict = 'ACCEPTED' group by user_id, idx
  ),
  cells as (
    select e.user_id, e.idx, f.ac_at,
           count(*) filter (where e.verdict <> 'ACCEPTED'
                              and (f.ac_at is null or e.created_at < f.ac_at))::int as wrong,
           case when f.ac_at is null then null
                else floor(extract(epoch from (f.ac_at - v_c.starts_at)) / 60)::int end as minute
      from e left join first_ac f on f.user_id = e.user_id and f.idx = e.idx
     group by e.user_id, e.idx, f.ac_at
  ),
  totals as (
    select user_id,
           count(ac_at)::int as solved,
           coalesce(sum(minute + v_c.penalty_minutes * wrong) filter (where ac_at is not null), 0)::int as penalty,
           max(ac_at) as last_ac
      from cells group by user_id
  ),
  ranked as (
    select t.*, rank() over (order by t.solved desc, t.penalty asc) as place
      from totals t
  )
  select jsonb_build_object(
    'contest', jsonb_build_object(
      'slug', v_c.slug, 'number', v_c.number,
      'title_uz', v_c.title_uz, 'title_en', v_c.title_en,
      'starts_at', v_c.starts_at, 'duration_minutes', v_c.duration_minutes,
      'penalty_minutes', v_c.penalty_minutes, 'archived', v_c.archived),
    'problems', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'idx', p.idx, 'bank_id', p.bank_id, 'problem_key', p.problem_key,
               'title_uz', p.title_uz, 'title_en', p.title_en, 'rating', p.rating,
               'solved', (select count(*) from cells c where c.idx = p.idx and c.ac_at is not null),
               'tried',  (select count(*) from cells c where c.idx = p.idx)
             ) order by p.idx), '[]'::jsonb)
        from contest_problems p where p.contest_id = v_c.id),
    'rows', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'place',        r.place,
               'user_id',      r.user_id,
               'username',     pr.username,
               'display_name', pr.display_name,
               'avatar_url',   pr.avatar_url,
               'solved',       r.solved,
               'penalty',      r.penalty,
               'cells', (select coalesce(jsonb_object_agg(c.idx, jsonb_build_object(
                                  'ok', c.ac_at is not null, 'wrong', c.wrong, 'minute', c.minute)), '{}'::jsonb)
                           from cells c where c.user_id = r.user_id)
             ) order by r.place, r.last_ac nulls last, pr.username), '[]'::jsonb)
        from ranked r join profiles pr on pr.id = r.user_id)
  ) into result;

  return result;
end $$;

revoke all on function public.contest_list() from public;
revoke all on function public.contest_standings(text) from public;
grant execute on function public.contest_list() to anon, authenticated;
grant execute on function public.contest_standings(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. The owner's numbers count learners, not seeded accounts.
--    Same function as 014 with every profiles / auth.users read filtered.
-- ---------------------------------------------------------------------------
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
    'learners_total',   (select count(*) from public.profiles p
                          where not exists (select 1 from public.bot_accounts b where b.user_id = p.id)),
    'new_today',        (select count(*) from public.profiles p where p.created_at >= date_trunc('day', now())
                          and not exists (select 1 from public.bot_accounts b where b.user_id = p.id)),
    'new_7d',           (select count(*) from public.profiles p where p.created_at >= now() - interval '7 days'
                          and not exists (select 1 from public.bot_accounts b where b.user_id = p.id)),
    'new_30d',          (select count(*) from public.profiles p where p.created_at >= now() - interval '30 days'
                          and not exists (select 1 from public.bot_accounts b where b.user_id = p.id)),

    -- ---- activity, from the auth schema ---------------------------------
    'active_today',     (select count(*) from auth.users u where u.last_sign_in_at >= date_trunc('day', now())
                          and not exists (select 1 from public.bot_accounts b where b.user_id = u.id)),
    'active_7d',        (select count(*) from auth.users u where u.last_sign_in_at >= now() - interval '7 days'
                          and not exists (select 1 from public.bot_accounts b where b.user_id = u.id)),
    'active_30d',       (select count(*) from auth.users u where u.last_sign_in_at >= now() - interval '30 days'
                          and not exists (select 1 from public.bot_accounts b where b.user_id = u.id)),
    'never_signed_in',  (select count(*) from auth.users u where u.last_sign_in_at is null
                          and not exists (select 1 from public.bot_accounts b where b.user_id = u.id)),
    'confirmed',        (select count(*) from auth.users u where u.email_confirmed_at is not null
                          and not exists (select 1 from public.bot_accounts b where b.user_id = u.id)),
    'unconfirmed',      (select count(*) from auth.users u where u.email_confirmed_at is null
                          and not exists (select 1 from public.bot_accounts b where b.user_id = u.id)),

    -- ---- signups per day, last 30 days (zero-filled so the series is honest)
    'signups_daily', (
      select coalesce(jsonb_agg(jsonb_build_object('day', d::date, 'count', c) order by d), '[]'::jsonb)
      from (
        select d, (select count(*) from public.profiles p
                   where p.created_at >= d and p.created_at < d + interval '1 day'
                     and not exists (select 1 from public.bot_accounts b where b.user_id = p.id)) as c
        from generate_series(date_trunc('day', now()) - interval '29 days',
                             date_trunc('day', now()), interval '1 day') as d
      ) series
    ),

    -- ---- time spent on the platform -------------------------------------
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
      from (select p.preferred_language, count(*) n from public.profiles p
             where not exists (select 1 from public.bot_accounts b where b.user_id = p.id) group by 1) x
    ),
    'by_role', (
      select coalesce(jsonb_object_agg(role, n), '{}'::jsonb)
      from (select p.role::text as role, count(*) n from public.profiles p
             where not exists (select 1 from public.bot_accounts b where b.user_id = p.id) group by 1) x
    ),
    'rating_avg', (select coalesce(round(avg(p.duel_rating)), 0) from public.profiles p
                    where not exists (select 1 from public.bot_accounts b where b.user_id = p.id)),
    'rating_max', (select coalesce(max(p.duel_rating), 0) from public.profiles p
                    where not exists (select 1 from public.bot_accounts b where b.user_id = p.id)),

    -- ---- learning activity ----------------------------------------------
    'learners_with_progress', (select count(distinct user_id) from public.unit_progress),
    'units_completed',        (select count(*) from public.unit_progress where solved and quiz_score >= 70),
    'quizzes_passed',         (select count(*) from public.unit_progress where quiz_score >= 70),
    'problems_solved',        (select count(*) from public.unit_progress where solved),

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
-- 6. The users page: browsing (no search term) lists learners only; a search
--    still finds a seeded account, and every row says whether it is one.
--    Same function as 012 otherwise.
-- ---------------------------------------------------------------------------
create or replace function public.owner_search_users(
  p_query text default null,
  p_day date default null,
  p_limit int default 25
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
  term text := btrim(coalesce(p_query, ''));
  needle text;
  browsing boolean := (term = '');
begin
  if not public.is_owner() then
    raise exception 'Only the owner can list users' using errcode = '42501';
  end if;

  needle := '%' || replace(replace(replace(term, '\', '\\'), '%', '\%'), '_', '\_') || '%';

  select coalesce(jsonb_agg(payload order by exact desc, prefix desc, joined desc, handle), '[]'::jsonb)
    into result
  from (
    select
      (not browsing and lower(p.username) = lower(term)) as exact,
      (not browsing and p.username ilike replace(replace(term, '\', '\\'), '%', '\%') || '%') as prefix,
      p.created_at as joined,
      p.username as handle,
      jsonb_build_object(
        'id',               p.id,
        'username',         p.username,
        'display_name',     p.display_name,
        'avatar_url',       p.avatar_url,
        'email',            u.email,
        'role',             p.role,
        'duel_rating',      p.duel_rating,
        'solved_count',     p.solved_count,
        'created_at',       p.created_at,
        'last_sign_in_at',  u.last_sign_in_at,
        'email_confirmed',  (u.email_confirmed_at is not null),
        'suspended_at',     p.suspended_at,
        'suspended_reason', p.suspended_reason,
        'is_bot',           exists (select 1 from public.bot_accounts b where b.user_id = p.id)
      ) as payload
    from public.profiles p
    join auth.users u on u.id = p.id
    where ((browsing and not exists (select 1 from public.bot_accounts b where b.user_id = p.id))
           or (not browsing and (p.username ilike needle
                                 or p.display_name ilike needle
                                 or u.email ilike needle)))
      and (p_day is null
           or (p.created_at >= (p_day::timestamp at time zone 'UTC')
           and p.created_at <  ((p_day + 1)::timestamp at time zone 'UTC')))
    order by exact desc, prefix desc, joined desc, handle
    limit greatest(1, least(coalesce(p_limit, 25), 200))
  ) ranked;

  return result;
end
$$;

revoke all on function public.owner_search_users(text, date, int) from public;
grant execute on function public.owner_search_users(text, date, int) to authenticated;
