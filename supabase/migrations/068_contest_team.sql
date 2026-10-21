-- AlgoYo'l — contest teams (co-authors, testers) and a sealed running round.
--
-- 1. contest_staff: the owner (and the round's co-authors) invite people by
--    username as 'author' or 'tester'. An invitation is pending until the
--    invitee accepts it on the round's page or the contests list.
--      author — edits the round like the owner, sees it while hidden, sees
--               everybody's code even while it runs;
--      tester — sees the round and its problems before it starts and may
--               submit early (those attempts fall outside the window, so they
--               never reach the board). No editing, no other people's code.
--    contest_role() / contest_can_manage() / contest_can_preview() answer
--    "who is this person to this round"; every contest function asks them
--    instead of is_owner().
--
-- 2. Registration closes when the round starts. Somebody who did not register
--    may still read the problems and the standings, but cannot submit until
--    the round is over (then it is open practice, as before).
--
-- 3. While a custom round runs, nobody reads anybody else's code — not
--    through the standings, and not through a profile's submission list
--    (submission_code / unlock_submission, where solving the problem used to
--    open other people's code). The owner and the round's co-authors can.
--    After the round the code opens as 065 decided.
--
-- Creating a round stays the owner's (owner_contest_save with no original),
-- and so does deleting one.
--
-- Run AFTER 067. Safe to re-run.

create table if not exists public.contest_staff (
  contest_id uuid not null references public.contests on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  role text not null check (role in ('author', 'tester')),
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  invited_by uuid references public.profiles on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  primary key (contest_id, user_id)
);
create index if not exists idx_contest_staff_user on public.contest_staff(user_id);
alter table public.contest_staff enable row level security;
-- No policy: read and written through the functions below.

create or replace function public.contest_role(p_contest uuid, p_user uuid default auth.uid())
returns text language sql stable security definer set search_path = public as $$
  select case
    when p_user is null then null
    when is_owner(p_user) then 'owner'
    else (select s.role from contest_staff s
           where s.contest_id = p_contest and s.user_id = p_user and s.status = 'accepted')
  end
$$;

create or replace function public.contest_can_manage(p_contest uuid, p_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(contest_role(p_contest, p_user) in ('owner', 'author'), false)
$$;

create or replace function public.contest_can_preview(p_contest uuid, p_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public as $$
  select contest_role(p_contest, p_user) is not null
$$;


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
             'my_role',          contest_role(c.id),
             'invited',          (select s.role from contest_staff s where s.contest_id = c.id
                                    and s.user_id = auth.uid() and s.status = 'pending'),
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
   where not c.hidden or contest_can_preview(c.id)
  ) x
$$;


create or replace function public.contest_standings(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests; result jsonb; v_secret boolean;
begin
  select * into v_c from contests where slug = p_slug;
  if not found or (v_c.hidden and not contest_can_preview(v_c.id)) then return null; end if;
  -- A custom round's problems are not announced before it starts.
  v_secret := v_c.kind = 'custom' and now() < v_c.starts_at and not contest_can_preview(v_c.id);

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
                                where r.contest_id = v_c.id and r.user_id = auth.uid()),
      'my_role', contest_role(v_c.id),
      'invited', (select s.role from contest_staff s where s.contest_id = v_c.id
                    and s.user_id = auth.uid() and s.status = 'pending')),
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


create or replace function public.contest_attempts(p_slug text, p_username text, p_idx text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests;
begin
  select * into v_c from contests where slug = p_slug;
  if not found or (v_c.hidden and not contest_can_preview(v_c.id)) then return null; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
             'id', s.id, 'created_at', s.created_at,
             'minute', floor(extract(epoch from (s.created_at - v_c.starts_at)) / 60)::int,
             'idx', ce.idx, 'username', pr.username, 'display_name', pr.display_name,
             'language', s.language, 'verdict', s.verdict, 'passed', s.passed, 'total', s.total,
             'runtime_ms', s.runtime_ms, 'memory_kb', s.memory_kb
           ) order by s.created_at)
      from contest_entries ce
      join bank_submissions s on s.id = ce.submission_id
      join profiles pr on pr.id = ce.user_id
     where ce.contest_id = v_c.id
       and ce.idx = upper(p_idx)
       and lower(pr.username) = lower(p_username)
       and s.created_at >= v_c.starts_at
       and s.created_at <  v_c.starts_at + make_interval(mins => v_c.duration_minutes)
  ), '[]'::jsonb);
end $$;


create or replace function public.contest_status(
  p_slug text,
  p_idx text default null,
  p_verdict text default null,     -- 'ACCEPTED', 'REJECTED' (anything else), or null for all
  p_limit int default 50,
  p_offset int default 0
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests; result jsonb;
begin
  select * into v_c from contests where slug = p_slug;
  if not found or (v_c.hidden and not contest_can_preview(v_c.id)) then return null; end if;

  with e as (
    select s.id, s.created_at, s.language, s.verdict, s.passed, s.total, s.runtime_ms, s.memory_kb,
           ce.idx, pr.username, pr.display_name
      from contest_entries ce
      join bank_submissions s on s.id = ce.submission_id
      join profiles pr on pr.id = ce.user_id
     where ce.contest_id = v_c.id
       and s.created_at >= v_c.starts_at
       and s.created_at <  v_c.starts_at + make_interval(mins => v_c.duration_minutes)
       and (p_idx is null or ce.idx = upper(p_idx))
       and (p_verdict is null
            or (p_verdict = 'ACCEPTED' and s.verdict = 'ACCEPTED')
            or (p_verdict = 'REJECTED' and s.verdict <> 'ACCEPTED'))
  )
  select jsonb_build_object(
    'total', (select count(*) from e),
    'rows', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', x.id, 'created_at', x.created_at,
               'minute', floor(extract(epoch from (x.created_at - v_c.starts_at)) / 60)::int,
               'idx', x.idx, 'username', x.username, 'display_name', x.display_name,
               'language', x.language, 'verdict', x.verdict, 'passed', x.passed, 'total', x.total,
               'runtime_ms', x.runtime_ms, 'memory_kb', x.memory_kb
             ) order by x.created_at desc)
        from (select * from e order by created_at desc
               limit least(greatest(coalesce(p_limit, 50), 1), 100)
              offset greatest(coalesce(p_offset, 0), 0)) x), '[]'::jsonb)
  ) into result;
  return result;
end $$;


-- The code behind an attempt. While a custom round runs only its owner and
-- co-authors (and the attempt's own author) read it; afterwards everybody.
create or replace function public.contest_submission_code(p_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_row bank_submissions; v_c contests;
begin
  select * into v_row from bank_submissions where id = p_id;
  if not found then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;
  select c.* into v_c from contest_entries ce join contests c on c.id = ce.contest_id
   where ce.submission_id = p_id;
  if not found then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;
  if v_c.hidden and not contest_can_preview(v_c.id) then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;

  if v_me is not null and (contest_can_manage(v_c.id) or v_row.user_id = v_me) then
    return jsonb_build_object('ok', true, 'source', v_row.source_code, 'language', v_row.language);
  end if;
  if v_c.kind = 'custom' then
    if now() < v_c.starts_at + make_interval(mins => v_c.duration_minutes) then
      return jsonb_build_object('ok', false, 'reason', 'running');
    end if;
    return jsonb_build_object('ok', true, 'source', v_row.source_code, 'language', v_row.language);
  end if;
  if v_me is null then return jsonb_build_object('ok', false, 'reason', 'not_authenticated'); end if;
  return submission_code(p_id);
end $$;


create or replace function public.contest_problem(p_slug text, p_idx text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests; result jsonb;
begin
  select * into v_c from contests where slug = p_slug;
  if not found or (v_c.hidden and not contest_can_preview(v_c.id)) then return null; end if;
  if now() < v_c.starts_at and not contest_can_preview(v_c.id) then
    return jsonb_build_object('ok', false, 'reason', 'not_started', 'starts_at', v_c.starts_at);
  end if;

  select jsonb_build_object(
           'ok', true,
           'idx', p.idx, 'problem_key', p.problem_key,
           'title_uz', p.title_uz, 'title_en', p.title_en, 'rating', p.rating,
           'statement', sp.statement, 'input_spec', sp.input_spec, 'output_spec', sp.output_spec,
           'notes', sp.notes, 'time_limit_ms', sp.time_limit_ms, 'memory_mb', sp.memory_mb,
           'samples', sp.samples,
           'tests', (select count(*) from contest_problem_tests t where t.contest_id = p.contest_id and t.idx = p.idx))
    into result
    from contest_problems p
    join contest_problem_specs sp on sp.contest_id = p.contest_id and sp.idx = p.idx
   where p.contest_id = v_c.id and p.idx = upper(p_idx);
  return result;
end $$;


create or replace function public.contest_registrants(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests;
begin
  select * into v_c from contests where slug = p_slug;
  if not found or (v_c.hidden and not contest_can_preview(v_c.id)) then return null; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
             'username', p.username, 'display_name', p.display_name, 'avatar_url', p.avatar_url,
             'rating', p.duel_rating, 'registered_at', r.created_at) order by r.created_at)
      from contest_registrations r join profiles p on p.id = r.user_id
     where r.contest_id = v_c.id), '[]'::jsonb);
end $$;


create or replace function public.contest_register(p_slug text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_c contests;
begin
  if v_me is null then raise exception 'not_authenticated'; end if;
  select * into v_c from contests where slug = p_slug;
  if not found or (v_c.hidden and not contest_can_preview(v_c.id)) then raise exception 'not_found'; end if;
  if v_c.kind <> 'custom' then raise exception 'not_custom'; end if;
  -- Registration closes when the round starts.
  if now() >= v_c.starts_at then raise exception 'started'; end if;
  insert into contest_registrations (contest_id, user_id) values (v_c.id, v_me) on conflict do nothing;
  return jsonb_build_object('ok', true,
    'registered', (select count(*) from contest_registrations r where r.contest_id = v_c.id));
end $$;


create or replace function public.contest_judge_spec(p_key text, p_user uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests; v_p contest_problems; v_sp contest_problem_specs; v_owner boolean;
begin
  select * into v_p from contest_problems where problem_key = p_key;
  if not found then return null; end if;
  select * into v_c from contests where id = v_p.contest_id;
  -- The round's owner, co-authors and testers submit before it starts and
  -- need no registration.
  v_owner := contest_can_preview(v_c.id, p_user);
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


create or replace function public.owner_contest_get(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests;
begin
  select * into v_c from contests where slug = p_slug;
  if not found then return null; end if;
  if not contest_can_manage(v_c.id) then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  return jsonb_build_object(
    'slug', v_c.slug, 'number', v_c.number, 'kind', v_c.kind, 'my_role', contest_role(v_c.id),
    'title_uz', v_c.title_uz, 'title_en', v_c.title_en, 'description', v_c.description,
    'starts_at', v_c.starts_at, 'duration_minutes', v_c.duration_minutes,
    'penalty_minutes', v_c.penalty_minutes, 'hidden', v_c.hidden,
    'entries', (select count(*) from contest_entries e where e.contest_id = v_c.id),
    'problems', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'idx', p.idx, 'title_uz', p.title_uz, 'title_en', p.title_en, 'rating', p.rating,
               'statement', sp.statement, 'input_spec', sp.input_spec, 'output_spec', sp.output_spec,
               'notes', sp.notes, 'time_limit_ms', sp.time_limit_ms, 'memory_mb', sp.memory_mb,
               'samples', sp.samples,
               'entries', (select count(*) from contest_entries e where e.contest_id = v_c.id and e.idx = p.idx),
               'tests', (select coalesce(jsonb_agg(jsonb_build_object('stdin', t.stdin, 'expected', t.expected)
                                                   order by t.n), '[]'::jsonb)
                           from contest_problem_tests t where t.contest_id = p.contest_id and t.idx = p.idx)
             ) order by p.idx), '[]'::jsonb)
        from contest_problems p
        left join contest_problem_specs sp on sp.contest_id = p.contest_id and sp.idx = p.idx
       where p.contest_id = v_c.id)
  );
end $$;


create or replace function public.owner_contest_save(p_original text, p jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_id uuid; v_c contests; v_slug text := lower(btrim(p ->> 'slug'));
  v_pr jsonb; v_idx text; v_key text; v_t jsonb; v_n int; v_keep text[] := '{}'; v_title text;
begin
  -- Creating a round is the owner's; editing one is also its co-authors'.
  if p_original is null and not is_owner() then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  if v_slug is null or v_slug !~ '^[a-z0-9-]{3,64}$' or v_slug in ('new', 'edit') then
    raise exception 'bad_slug';
  end if;
  if coalesce(btrim(p ->> 'title_uz'), '') = '' then raise exception 'bad_title'; end if;

  if p_original is not null then
    select * into v_c from contests where slug = p_original;
    if not found then raise exception 'not_found'; end if;
    if not contest_can_manage(v_c.id) then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
    if v_c.kind <> 'custom' then raise exception 'not_custom'; end if;
    v_id := v_c.id;
  end if;
  if exists (select 1 from contests where slug = v_slug and (v_id is null or id <> v_id)) then
    raise exception 'slug_taken';
  end if;

  if v_id is null then
    insert into contests (slug, number, title_uz, title_en, description, starts_at, duration_minutes,
                          penalty_minutes, archived, hidden, kind, created_by)
    values (v_slug, coalesce((select max(number) from contests), 0) + 1,
            btrim(p ->> 'title_uz'), coalesce(nullif(btrim(p ->> 'title_en'), ''), btrim(p ->> 'title_uz')),
            coalesce(p ->> 'description', ''), (p ->> 'starts_at')::timestamptz,
            (p ->> 'duration_minutes')::int, coalesce((p ->> 'penalty_minutes')::int, 20),
            false, coalesce((p ->> 'hidden')::boolean, true), 'custom', auth.uid())
    returning id into v_id;
  else
    update contests set
      slug = v_slug,
      title_uz = btrim(p ->> 'title_uz'),
      title_en = coalesce(nullif(btrim(p ->> 'title_en'), ''), btrim(p ->> 'title_uz')),
      description = coalesce(p ->> 'description', ''),
      starts_at = (p ->> 'starts_at')::timestamptz,
      duration_minutes = (p ->> 'duration_minutes')::int,
      penalty_minutes = coalesce((p ->> 'penalty_minutes')::int, 20),
      hidden = coalesce((p ->> 'hidden')::boolean, hidden),
      updated_at = now()
    where id = v_id;
  end if;

  for v_pr in select * from jsonb_array_elements(coalesce(p -> 'problems', '[]'::jsonb)) loop
    v_idx := upper(btrim(v_pr ->> 'idx'));
    if v_idx !~ '^[A-Z]$' then raise exception 'bad_idx'; end if;
    -- A problem may be saved before it has a name; it gets its letter's.
    v_title := coalesce(nullif(btrim(v_pr ->> 'title_uz'), ''), 'Masala ' || v_idx);
    v_keep := v_keep || v_idx;
    -- The round's id, not its slug: a renamed round keeps its keys, so its
    -- submissions and has_solved() still find them.
    v_key := 'cx:' || v_id::text || ':' || v_idx;

    insert into contest_problems (contest_id, idx, problem_key, bank_id, title_uz, title_en, rating)
    values (v_id, v_idx, v_key, v_key, v_title,
            coalesce(nullif(btrim(v_pr ->> 'title_en'), ''), v_title),
            coalesce((v_pr ->> 'rating')::int, 800))
    on conflict (contest_id, idx) do update set
      problem_key = excluded.problem_key, bank_id = excluded.bank_id,
      title_uz = excluded.title_uz, title_en = excluded.title_en, rating = excluded.rating;

    insert into contest_problem_specs (contest_id, idx, statement, input_spec, output_spec, notes,
                                       time_limit_ms, memory_mb, samples)
    values (v_id, v_idx, coalesce(v_pr ->> 'statement', ''), coalesce(v_pr ->> 'input_spec', ''),
            coalesce(v_pr ->> 'output_spec', ''), coalesce(v_pr ->> 'notes', ''),
            coalesce((v_pr ->> 'time_limit_ms')::int, 1000), coalesce((v_pr ->> 'memory_mb')::int, 256),
            coalesce(v_pr -> 'samples', '[]'::jsonb))
    on conflict (contest_id, idx) do update set
      statement = excluded.statement, input_spec = excluded.input_spec, output_spec = excluded.output_spec,
      notes = excluded.notes, time_limit_ms = excluded.time_limit_ms, memory_mb = excluded.memory_mb,
      samples = excluded.samples;

    -- Tests are replaced only when the payload carries them, so a save that
    -- only fixed a typo in the statement does not resend megabytes of input.
    if v_pr ? 'tests' and jsonb_typeof(v_pr -> 'tests') = 'array' then
      delete from contest_problem_tests where contest_id = v_id and idx = v_idx;
      v_n := 0;
      for v_t in select * from jsonb_array_elements(v_pr -> 'tests') loop
        v_n := v_n + 1;
        insert into contest_problem_tests (contest_id, idx, n, stdin, expected)
        values (v_id, v_idx, v_n, coalesce(v_t ->> 'stdin', ''), coalesce(v_t ->> 'expected', ''));
      end loop;
    end if;
  end loop;

  if exists (select 1 from contest_entries e where e.contest_id = v_id and not (e.idx = any (v_keep))) then
    raise exception 'problem_has_submissions';
  end if;
  delete from contest_problems where contest_id = v_id and not (idx = any (v_keep));

  return jsonb_build_object('ok', true, 'slug', v_slug);
end $$;


create or replace function public.owner_contest_settings(p_slug text, p jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_c contests;
begin
  select * into v_c from contests where slug = p_slug;
  if not found then raise exception 'not_found'; end if;
  if not contest_can_manage(v_c.id) then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  if coalesce(btrim(p ->> 'title_uz'), '') = '' then raise exception 'bad_title'; end if;
  update contests set
    title_uz = btrim(p ->> 'title_uz'),
    title_en = coalesce(nullif(btrim(p ->> 'title_en'), ''), btrim(p ->> 'title_uz')),
    description = coalesce(p ->> 'description', description),
    hidden = coalesce((p ->> 'hidden')::boolean, hidden),
    updated_at = now()
  where id = v_c.id;
  return jsonb_build_object('ok', true, 'slug', v_c.slug);
end $$;


create or replace function public.owner_contest_set_hidden(p_slug text, p_hidden boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_c contests;
begin
  select * into v_c from contests where slug = p_slug;
  if not found then raise exception 'not_found'; end if;
  if not contest_can_manage(v_c.id) then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  update contests set hidden = p_hidden, updated_at = now() where id = v_c.id;
  return jsonb_build_object('ok', true, 'hidden', p_hidden);
end $$;


create or replace function public.submission_code(p_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_row bank_submissions;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'reason', 'not_authenticated'); end if;
  select * into v_row from bank_submissions where id = p_id;
  if not found then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;
  -- A running custom round's code stays sealed to everybody but its author
  -- and the round's owner and co-authors (068) — solving the problem or
  -- paying no longer opens it until the round is over.
  if exists (select 1 from contest_entries ce join contests c on c.id = ce.contest_id
              where ce.submission_id = p_id and c.kind = 'custom'
                and now() < c.starts_at + make_interval(mins => c.duration_minutes)
                and v_row.user_id <> v_me and not contest_can_manage(c.id, v_me)) then
    return jsonb_build_object('ok', false, 'reason', 'running');
  end if;

  if is_staff(v_me)
     or v_row.user_id = v_me
     or exists (select 1 from submission_unlocks u where u.viewer_id = v_me and u.submission_id = p_id)
     or has_solved(v_me, v_row.problem_key) then
    return jsonb_build_object('ok', true, 'source', v_row.source_code, 'language', v_row.language);
  end if;

  return jsonb_build_object('ok', false, 'reason', 'locked',
                            'cost', submission_unlock_cost(),
                            'balance', coin_balance(v_me));
end $$;


create or replace function public.unlock_submission(p_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_row bank_submissions; v_cost int := submission_unlock_cost();
begin
  if v_me is null then raise exception 'not_authenticated'; end if;
  select * into v_row from bank_submissions where id = p_id;
  if not found then raise exception 'not_found'; end if;
  -- A running custom round's code stays sealed to everybody but its author
  -- and the round's owner and co-authors (068) — solving the problem or
  -- paying no longer opens it until the round is over.
  if exists (select 1 from contest_entries ce join contests c on c.id = ce.contest_id
              where ce.submission_id = p_id and c.kind = 'custom'
                and now() < c.starts_at + make_interval(mins => c.duration_minutes)
                and v_row.user_id <> v_me and not contest_can_manage(c.id, v_me)) then
    raise exception 'running';
  end if;

  -- Staff never reach the ledger: a stale client that still shows the buy
  -- button must not charge them.
  if is_staff(v_me)
     or v_row.user_id = v_me
     or exists (select 1 from submission_unlocks u where u.viewer_id = v_me and u.submission_id = p_id)
     or has_solved(v_me, v_row.problem_key) then
    return jsonb_build_object('ok', true, 'charged', 0, 'source', v_row.source_code, 'language', v_row.language);
  end if;

  if coin_balance(v_me) < v_cost then
    raise exception 'insufficient_coins';
  end if;

  insert into coin_events(user_id, delta, reason, dedupe_key)
  values (v_me, -v_cost, 'unlock_submission', 'unlock:' || p_id::text);
  insert into submission_unlocks(viewer_id, submission_id) values (v_me, p_id)
  on conflict do nothing;

  return jsonb_build_object('ok', true, 'charged', v_cost,
                            'source', v_row.source_code, 'language', v_row.language);
end $$;


create or replace function public.contest_record_submission(
  p_user uuid, p_key text, p_language text, p_verdict text, p_runtime_ms int, p_memory_kb int,
  p_passed int, p_total int, p_source text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p contest_problems; v_id uuid;
begin
  select * into v_p from contest_problems where problem_key = p_key;
  if not found then raise exception 'unknown_problem'; end if;
  insert into bank_submissions (user_id, problem_key, problem_title, language, verdict, runtime_ms,
                                memory_kb, passed, total, source_code)
  values (p_user, p_key, v_p.title_uz, p_language, p_verdict, p_runtime_ms, p_memory_kb,
          p_passed, p_total, p_source)
  returning id into v_id;
  -- The round's own team (owner, co-authors, testers) is judged like anybody,
  -- but never ranked: their attempts while it runs stay off the board (068).
  if contest_role(v_p.contest_id, p_user) is null
     or not exists (select 1 from contests c where c.id = v_p.contest_id
                     and now() >= c.starts_at
                     and now() < c.starts_at + make_interval(mins => c.duration_minutes)) then
    insert into contest_entries (submission_id, contest_id, idx, user_id)
    values (v_id, v_p.contest_id, v_p.idx, p_user);
  end if;
  return jsonb_build_object('ok', true, 'id', v_id);
end $$;

-- ---------------------------------------------------------------------------
-- Invitations.
-- ---------------------------------------------------------------------------
create or replace function public.contest_invite(p_slug text, p_username text, p_role text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_c contests; v_user profiles;
begin
  select * into v_c from contests where slug = p_slug;
  if not found then raise exception 'not_found'; end if;
  if not contest_can_manage(v_c.id) then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  if p_role not in ('author', 'tester') then raise exception 'bad_role'; end if;
  select * into v_user from profiles where lower(username) = lower(btrim(p_username));
  if not found then raise exception 'no_such_user'; end if;
  if v_user.id = auth.uid() or is_owner(v_user.id) then raise exception 'already_staff'; end if;
  insert into contest_staff (contest_id, user_id, role, status, invited_by)
  values (v_c.id, v_user.id, p_role, 'pending', auth.uid())
  on conflict (contest_id, user_id) do update
    set role = excluded.role, invited_by = excluded.invited_by, created_at = now(),
        -- Changing an accepted member's role keeps them accepted.
        status = contest_staff.status;
  return jsonb_build_object('ok', true, 'username', v_user.username);
end $$;

create or replace function public.contest_staff_list(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests;
begin
  select * into v_c from contests where slug = p_slug;
  if not found then return null; end if;
  if not contest_can_manage(v_c.id) then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
             'username', p.username, 'display_name', p.display_name, 'role', s.role, 'status', s.status,
             'invited_at', s.created_at, 'accepted_at', s.accepted_at) order by s.created_at)
      from contest_staff s join profiles p on p.id = s.user_id
     where s.contest_id = v_c.id), '[]'::jsonb);
end $$;

create or replace function public.contest_staff_remove(p_slug text, p_username text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_c contests;
begin
  select * into v_c from contests where slug = p_slug;
  if not found then raise exception 'not_found'; end if;
  if not contest_can_manage(v_c.id) then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  delete from contest_staff s using profiles p
   where s.contest_id = v_c.id and p.id = s.user_id and lower(p.username) = lower(btrim(p_username));
  return jsonb_build_object('ok', true);
end $$;

-- The invitee's answer: accept, or decline (which also leaves the team).
create or replace function public.contest_invitation_respond(p_slug text, p_accept boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_c contests;
begin
  if v_me is null then raise exception 'not_authenticated'; end if;
  select * into v_c from contests where slug = p_slug;
  if not found then raise exception 'not_found'; end if;
  if p_accept then
    update contest_staff set status = 'accepted', accepted_at = now()
     where contest_id = v_c.id and user_id = v_me;
    if not found then raise exception 'no_invitation'; end if;
  else
    delete from contest_staff where contest_id = v_c.id and user_id = v_me;
  end if;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.my_contest_invitations()
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'slug', c.slug, 'title_uz', c.title_uz, 'title_en', c.title_en, 'starts_at', c.starts_at,
           'role', s.role, 'invited_by', ip.username) order by s.created_at desc), '[]'::jsonb)
    from contest_staff s
    join contests c on c.id = s.contest_id
    left join profiles ip on ip.id = s.invited_by
   where s.user_id = auth.uid() and s.status = 'pending'
$$;

-- ---------------------------------------------------------------------------
-- Grants.
-- ---------------------------------------------------------------------------
revoke all on function public.contest_role(uuid, uuid) from public;
grant execute on function public.contest_role(uuid, uuid) to authenticated;
revoke all on function public.contest_can_manage(uuid, uuid) from public;
grant execute on function public.contest_can_manage(uuid, uuid) to authenticated;
revoke all on function public.contest_can_preview(uuid, uuid) from public;
grant execute on function public.contest_can_preview(uuid, uuid) to authenticated;
revoke all on function public.contest_list() from public;
grant execute on function public.contest_list() to anon, authenticated;
revoke all on function public.contest_standings(text) from public;
grant execute on function public.contest_standings(text) to anon, authenticated;
revoke all on function public.contest_attempts(text, text, text) from public;
grant execute on function public.contest_attempts(text, text, text) to anon, authenticated;
revoke all on function public.contest_status(text, text, text, int, int) from public;
grant execute on function public.contest_status(text, text, text, int, int) to anon, authenticated;
revoke all on function public.contest_submission_code(uuid) from public;
grant execute on function public.contest_submission_code(uuid) to anon, authenticated;
revoke all on function public.contest_problem(text, text) from public;
grant execute on function public.contest_problem(text, text) to anon, authenticated;
revoke all on function public.contest_registrants(text) from public;
grant execute on function public.contest_registrants(text) to anon, authenticated;
revoke all on function public.contest_register(text) from public;
grant execute on function public.contest_register(text) to authenticated;
revoke all on function public.owner_contest_get(text) from public;
grant execute on function public.owner_contest_get(text) to authenticated;
revoke all on function public.owner_contest_save(text, jsonb) from public;
grant execute on function public.owner_contest_save(text, jsonb) to authenticated;
revoke all on function public.owner_contest_settings(text, jsonb) from public;
grant execute on function public.owner_contest_settings(text, jsonb) to authenticated;
revoke all on function public.owner_contest_set_hidden(text, boolean) from public;
grant execute on function public.owner_contest_set_hidden(text, boolean) to authenticated;
revoke all on function public.submission_code(uuid) from public;
grant execute on function public.submission_code(uuid) to authenticated;
revoke all on function public.unlock_submission(uuid) from public;
grant execute on function public.unlock_submission(uuid) to authenticated;
revoke all on function public.contest_invite(text, text, text) from public;
grant execute on function public.contest_invite(text, text, text) to authenticated;
revoke all on function public.contest_staff_list(text) from public;
grant execute on function public.contest_staff_list(text) to authenticated;
revoke all on function public.contest_staff_remove(text, text) from public;
grant execute on function public.contest_staff_remove(text, text) to authenticated;
revoke all on function public.contest_invitation_respond(text, boolean) from public;
grant execute on function public.contest_invitation_respond(text, boolean) to authenticated;
revoke all on function public.my_contest_invitations() from public;
grant execute on function public.my_contest_invitations() to authenticated;
revoke all on function public.contest_judge_spec(text, uuid) from public, anon, authenticated;
grant execute on function public.contest_judge_spec(text, uuid) to service_role;
revoke all on function public.contest_record_submission(uuid, text, text, text, int, int, int, int, text) from public, anon, authenticated;
grant execute on function public.contest_record_submission(uuid, text, text, text, int, int, int, int, text) to service_role;
