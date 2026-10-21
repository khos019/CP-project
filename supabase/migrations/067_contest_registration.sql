-- AlgoYo'l — registering for a contest.
--
-- A custom round (065) now has a participant list, as on Codeforces:
--
--   * contest_register() signs the caller up — any time until the round
--     ends, so somebody who arrives late can still join it;
--   * contest_unregister() takes them off it, but only before it starts;
--   * contest_registrants() is the public list (the round's "Ishtirokchilar"
--     tab);
--   * contest_list() / contest_standings() carry the count and whether the
--     caller is on it;
--   * contest_judge_spec() refuses a running round's problems to anybody who
--     has not registered. After the round they are open practice again.
--
-- Archive rounds are not touched: they are history, nobody registers.
--
-- Run AFTER 066. Safe to re-run.

create table if not exists public.contest_registrations (
  contest_id uuid not null references public.contests on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  created_at timestamptz not null default now(),
  primary key (contest_id, user_id)
);
create index if not exists idx_contest_registrations_user on public.contest_registrations(user_id);
alter table public.contest_registrations enable row level security;
-- No policy: read and written through the functions below.

create or replace function public.contest_register(p_slug text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_c contests;
begin
  if v_me is null then raise exception 'not_authenticated'; end if;
  select * into v_c from contests where slug = p_slug;
  if not found or (v_c.hidden and not is_owner()) then raise exception 'not_found'; end if;
  if v_c.kind <> 'custom' then raise exception 'not_custom'; end if;
  if now() >= v_c.starts_at + make_interval(mins => v_c.duration_minutes) then raise exception 'finished'; end if;
  insert into contest_registrations (contest_id, user_id) values (v_c.id, v_me) on conflict do nothing;
  return jsonb_build_object('ok', true,
    'registered', (select count(*) from contest_registrations r where r.contest_id = v_c.id));
end $$;

create or replace function public.contest_unregister(p_slug text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_c contests;
begin
  if v_me is null then raise exception 'not_authenticated'; end if;
  select * into v_c from contests where slug = p_slug;
  if not found then raise exception 'not_found'; end if;
  if now() >= v_c.starts_at then raise exception 'started'; end if;
  delete from contest_registrations where contest_id = v_c.id and user_id = v_me;
  return jsonb_build_object('ok', true,
    'registered', (select count(*) from contest_registrations r where r.contest_id = v_c.id));
end $$;

create or replace function public.contest_registrants(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests;
begin
  select * into v_c from contests where slug = p_slug;
  if not found or (v_c.hidden and not is_owner()) then return null; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
             'username', p.username, 'display_name', p.display_name, 'avatar_url', p.avatar_url,
             'rating', p.duel_rating, 'registered_at', r.created_at) order by r.created_at)
      from contest_registrations r join profiles p on p.id = r.user_id
     where r.contest_id = v_c.id), '[]'::jsonb);
end $$;

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
             'hidden',           c.hidden,
             'kind',             c.kind,
             'registered',       (select count(*) from contest_registrations r where r.contest_id = c.id),
             'me_registered',    exists (select 1 from contest_registrations r
                                          where r.contest_id = c.id and r.user_id = auth.uid()),
             'participants',     (select count(distinct e.user_id) from contest_entries e
                                   where e.contest_id = c.id),
             'problems',         (select coalesce(jsonb_agg(jsonb_build_object(
                                            'idx', p.idx, 'rating', p.rating) order by p.idx), '[]'::jsonb)
                                    from contest_problems p where p.contest_id = c.id),
             'winner',           (select jsonb_build_object('username', w ->> 'username',
                                                            'display_name', w ->> 'display_name')
                                    from jsonb_array_elements(contest_standings(c.slug) -> 'rows') w
                                   limit 1)
           ) as payload
    from contests c
   where not c.hidden or is_owner()
  ) x
$$;

create or replace function public.contest_standings(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests; result jsonb; v_secret boolean;
begin
  select * into v_c from contests where slug = p_slug;
  if not found or (v_c.hidden and not is_owner()) then return null; end if;
  -- A custom round's problems are not announced before it starts.
  v_secret := v_c.kind = 'custom' and now() < v_c.starts_at and not is_owner();

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
      'penalty_minutes', v_c.penalty_minutes, 'archived', v_c.archived,
      'hidden', v_c.hidden, 'kind', v_c.kind, 'description', v_c.description,
      'registered', (select count(*) from contest_registrations r where r.contest_id = v_c.id),
      'me_registered', exists (select 1 from contest_registrations r
                                where r.contest_id = v_c.id and r.user_id = auth.uid())),
    'problems', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'idx', p.idx,
               'bank_id', case when v_secret then '' else p.bank_id end,
               'problem_key', case when v_secret then '' else p.problem_key end,
               'title_uz', case when v_secret then '' else p.title_uz end,
               'title_en', case when v_secret then '' else p.title_en end,
               'rating', p.rating,
               'custom', sp.idx is not null,
               'time_limit_ms', sp.time_limit_ms,
               'memory_mb', sp.memory_mb,
               'solved', (select count(*) from cells c where c.idx = p.idx and c.ac_at is not null),
               'tried',  (select count(*) from cells c where c.idx = p.idx)
             ) order by p.idx), '[]'::jsonb)
        from contest_problems p
        left join contest_problem_specs sp on sp.contest_id = p.contest_id and sp.idx = p.idx
       where p.contest_id = v_c.id),
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

create or replace function public.contest_judge_spec(p_key text, p_user uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests; v_p contest_problems; v_sp contest_problem_specs; v_owner boolean := is_owner(p_user);
begin
  select * into v_p from contest_problems where problem_key = p_key;
  if not found then return null; end if;
  select * into v_c from contests where id = v_p.contest_id;
  select * into v_sp from contest_problem_specs where contest_id = v_p.contest_id and idx = v_p.idx;
  if not found then return null; end if;
  if v_c.hidden and not v_owner then return jsonb_build_object('ok', false, 'reason', 'hidden'); end if;
  if now() < v_c.starts_at and not v_owner then return jsonb_build_object('ok', false, 'reason', 'not_started'); end if;
  -- While a custom round runs, only its registered participants submit.
  -- Once it is over the problems are open practice for everybody.
  if v_c.kind = 'custom' and not v_owner
     and now() < v_c.starts_at + make_interval(mins => v_c.duration_minutes)
     and not exists (select 1 from contest_registrations r where r.contest_id = v_c.id and r.user_id = p_user) then
    return jsonb_build_object('ok', false, 'reason', 'not_registered');
  end if;
  return jsonb_build_object(
    'ok', true, 'contest_id', v_c.id, 'idx', v_p.idx, 'title', v_p.title_uz,
    'time_limit_ms', v_sp.time_limit_ms, 'memory_mb', v_sp.memory_mb,
    'tests', (select coalesce(jsonb_agg(jsonb_build_object('stdin', t.stdin, 'expected_output', t.expected)
                                        order by t.n), '[]'::jsonb)
                from contest_problem_tests t where t.contest_id = v_p.contest_id and t.idx = v_p.idx));
end $$;

revoke all on function public.contest_list() from public;
grant execute on function public.contest_list() to anon, authenticated;
revoke all on function public.contest_standings(text) from public;
grant execute on function public.contest_standings(text) to anon, authenticated;
revoke all on function public.contest_registrants(text) from public;
grant execute on function public.contest_registrants(text) to anon, authenticated;
revoke all on function public.contest_register(text) from public;
grant execute on function public.contest_register(text) to authenticated;
revoke all on function public.contest_unregister(text) from public;
grant execute on function public.contest_unregister(text) to authenticated;
revoke all on function public.contest_judge_spec(text, uuid) from public, anon, authenticated;
grant execute on function public.contest_judge_spec(text, uuid) to service_role;
