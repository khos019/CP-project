-- AlgoYo'l — the owner writes contests on the site.
--
-- Until now a round was something tools/contests/seed.mjs loaded: five bank
-- problems and a simulated field. This adds rounds the owner builds by hand
-- on /contests/new, with problems of their own — statement, limits, samples
-- and hidden tests — judged by /api/judge like any bank problem.
--
-- 1. contests.kind — 'archive' for the seeded rounds, 'custom' for the ones
--    written here. Only a custom round can be edited on the site.
--
-- 2. contest_problem_specs / contest_problem_tests — a custom problem's
--    statement and its hidden tests. The tests have RLS on and no policy:
--    only contest_judge_spec() (service role, called by /api/judge) and the
--    owner's editor ever read them.
--
--    A custom problem's judge key is 'cx:<contest id>:<idx>'. A colon never occurs
--    in a bank key, so the two can never collide, and bank_submissions keeps
--    one shape for both.
--
-- 3. contest_attempts() — one standings cell, attempt by attempt, so a click
--    on "+2 01:14" opens the three submissions behind it (Codeforces does
--    this). contest_submission_code() opens their code: the owner and the
--    author always; everybody once a custom round is over. Bank problems keep
--    submission_code()'s rule, since their code is otherwise paid for.
--
-- Until this is applied the page still works: a cell's attempts are read from
-- contest_status() and their code from submission_code(), and the "add a
-- contest" page says the migration is missing.
--
-- Run AFTER 049. Safe to re-run.

-- ---------------------------------------------------------------------------
-- 1. Rounds.
-- ---------------------------------------------------------------------------
alter table public.contests add column if not exists kind text not null default 'archive';
alter table public.contests drop constraint if exists contests_kind_check;
alter table public.contests add constraint contests_kind_check check (kind in ('archive', 'custom'));
alter table public.contests add column if not exists description text not null default '';
alter table public.contests add column if not exists created_by uuid references public.profiles on delete set null;
alter table public.contests add column if not exists updated_at timestamptz not null default now();

-- ---------------------------------------------------------------------------
-- 2. A custom problem's statement and tests.
-- ---------------------------------------------------------------------------
create table if not exists public.contest_problem_specs (
  contest_id uuid not null,
  idx text not null,
  statement text not null default '',
  input_spec text not null default '',
  output_spec text not null default '',
  notes text not null default '',
  time_limit_ms int not null default 1000 check (time_limit_ms between 250 and 10000),
  memory_mb int not null default 256 check (memory_mb between 16 and 1024),
  samples jsonb not null default '[]'::jsonb,       -- [{input, output}]
  primary key (contest_id, idx),
  foreign key (contest_id, idx) references public.contest_problems (contest_id, idx) on delete cascade
);
alter table public.contest_problem_specs enable row level security;
-- No policy: read through contest_problem(), which checks the round has begun.

create table if not exists public.contest_problem_tests (
  contest_id uuid not null,
  idx text not null,
  n int not null check (n >= 1),
  stdin text not null,
  expected text not null,
  primary key (contest_id, idx, n),
  foreign key (contest_id, idx) references public.contest_problems (contest_id, idx) on delete cascade
);
alter table public.contest_problem_tests enable row level security;
-- No policy: nobody reads hidden tests over REST.

-- ---------------------------------------------------------------------------
-- 3. The list and the board, with what the new pages need.
--    Same functions as 049, plus kind / description / per-problem limits, and
--    a custom round's problem names stay hidden until it starts.
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
             'hidden',           c.hidden,
             'kind',             c.kind,
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
      'hidden', v_c.hidden, 'kind', v_c.kind, 'description', v_c.description),
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

-- ---------------------------------------------------------------------------
-- 4. One standings cell, attempt by attempt.
-- ---------------------------------------------------------------------------
create or replace function public.contest_attempts(p_slug text, p_username text, p_idx text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests;
begin
  select * into v_c from contests where slug = p_slug;
  if not found or (v_c.hidden and not is_owner()) then return null; end if;

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

-- The code behind one of those attempts.
create or replace function public.contest_submission_code(p_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_row bank_submissions; v_c contests; v_custom boolean;
begin
  select * into v_row from bank_submissions where id = p_id;
  if not found then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;
  select c.* into v_c from contest_entries ce join contests c on c.id = ce.contest_id
   where ce.submission_id = p_id;
  if not found then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;
  if v_c.hidden and not is_owner() then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;

  v_custom := v_c.kind = 'custom';
  if (v_me is not null and (is_staff(v_me) or v_row.user_id = v_me))
     or (v_custom and now() >= v_c.starts_at + make_interval(mins => v_c.duration_minutes)) then
    return jsonb_build_object('ok', true, 'source', v_row.source_code, 'language', v_row.language);
  end if;
  if v_custom then
    -- A running round: nobody reads anybody else's code yet.
    return jsonb_build_object('ok', false, 'reason', 'running');
  end if;
  if v_me is null then return jsonb_build_object('ok', false, 'reason', 'not_authenticated'); end if;
  return submission_code(p_id);
end $$;

-- ---------------------------------------------------------------------------
-- 5. A custom problem's statement, once the round has begun.
-- ---------------------------------------------------------------------------
create or replace function public.contest_problem(p_slug text, p_idx text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests; result jsonb;
begin
  select * into v_c from contests where slug = p_slug;
  if not found or (v_c.hidden and not is_owner()) then return null; end if;
  if now() < v_c.starts_at and not is_owner() then
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

-- ---------------------------------------------------------------------------
-- 6. The owner's editor.
-- ---------------------------------------------------------------------------
create or replace function public.owner_contest_get(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests;
begin
  if not is_owner() then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  select * into v_c from contests where slug = p_slug;
  if not found then return null; end if;
  return jsonb_build_object(
    'slug', v_c.slug, 'number', v_c.number, 'kind', v_c.kind,
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

/* Creates or replaces a custom round. p_original is the slug the editor
   opened (null for a new round), so a round can be renamed. Problems the
   payload leaves out are removed, unless somebody already submitted to them —
   that would take submissions off the board. */
create or replace function public.owner_contest_save(p_original text, p jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_id uuid; v_c contests; v_slug text := lower(btrim(p ->> 'slug'));
  v_pr jsonb; v_idx text; v_key text; v_t jsonb; v_n int; v_keep text[] := '{}';
begin
  if not is_owner() then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  if v_slug is null or v_slug !~ '^[a-z0-9-]{3,64}$' or v_slug in ('new', 'edit') then
    raise exception 'bad_slug';
  end if;
  if coalesce(btrim(p ->> 'title_uz'), '') = '' then raise exception 'bad_title'; end if;
  if jsonb_array_length(coalesce(p -> 'problems', '[]'::jsonb)) = 0 then raise exception 'no_problems'; end if;

  if p_original is not null then
    select * into v_c from contests where slug = p_original;
    if not found then raise exception 'not_found'; end if;
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

  for v_pr in select * from jsonb_array_elements(p -> 'problems') loop
    v_idx := upper(btrim(v_pr ->> 'idx'));
    if v_idx !~ '^[A-Z]$' then raise exception 'bad_idx'; end if;
    if coalesce(btrim(v_pr ->> 'title_uz'), '') = '' then raise exception 'bad_problem_title:%', v_idx; end if;
    v_keep := v_keep || v_idx;
    -- The round's id, not its slug: a renamed round keeps its keys, so its
    -- submissions and has_solved() still find them.
    v_key := 'cx:' || v_id::text || ':' || v_idx;

    insert into contest_problems (contest_id, idx, problem_key, bank_id, title_uz, title_en, rating)
    values (v_id, v_idx, v_key, v_key, btrim(v_pr ->> 'title_uz'),
            coalesce(nullif(btrim(v_pr ->> 'title_en'), ''), btrim(v_pr ->> 'title_uz')),
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

create or replace function public.owner_contest_delete(p_slug text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_c contests;
begin
  if not is_owner() then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  select * into v_c from contests where slug = p_slug;
  if not found then return jsonb_build_object('ok', false); end if;
  if v_c.kind <> 'custom' then raise exception 'not_custom'; end if;
  -- The submissions stay on their authors' profiles; only the round goes.
  delete from contests where id = v_c.id;
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------------------
-- 7. For /api/judge (service role only).
-- ---------------------------------------------------------------------------
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
  return jsonb_build_object(
    'ok', true, 'contest_id', v_c.id, 'idx', v_p.idx, 'title', v_p.title_uz,
    'time_limit_ms', v_sp.time_limit_ms, 'memory_mb', v_sp.memory_mb,
    'tests', (select coalesce(jsonb_agg(jsonb_build_object('stdin', t.stdin, 'expected_output', t.expected)
                                        order by t.n), '[]'::jsonb)
                from contest_problem_tests t where t.contest_id = v_p.contest_id and t.idx = v_p.idx));
end $$;

/* Writes the verdict and ties it to the round. Every attempt gets an entry;
   the board and the status page only count the ones inside the window, so a
   practice attempt after the round sits harmlessly beside them. */
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
  insert into contest_entries (submission_id, contest_id, idx, user_id)
  values (v_id, v_p.contest_id, v_p.idx, p_user);
  return jsonb_build_object('ok', true, 'id', v_id);
end $$;

-- ---------------------------------------------------------------------------
-- Grants.
-- ---------------------------------------------------------------------------
revoke all on function public.contest_list() from public;
grant execute on function public.contest_list() to anon, authenticated;
revoke all on function public.contest_standings(text) from public;
grant execute on function public.contest_standings(text) to anon, authenticated;
revoke all on function public.contest_attempts(text, text, text) from public;
grant execute on function public.contest_attempts(text, text, text) to anon, authenticated;
revoke all on function public.contest_submission_code(uuid) from public;
grant execute on function public.contest_submission_code(uuid) to anon, authenticated;
revoke all on function public.contest_problem(text, text) from public;
grant execute on function public.contest_problem(text, text) to anon, authenticated;
revoke all on function public.owner_contest_get(text) from public;
grant execute on function public.owner_contest_get(text) to authenticated;
revoke all on function public.owner_contest_save(text, jsonb) from public;
grant execute on function public.owner_contest_save(text, jsonb) to authenticated;
revoke all on function public.owner_contest_delete(text) from public;
grant execute on function public.owner_contest_delete(text) to authenticated;
-- Service role only: the hidden tests leave the database through this alone.
revoke all on function public.contest_judge_spec(text, uuid) from public, anon, authenticated;
revoke all on function public.contest_record_submission(uuid, text, text, text, int, int, int, int, text) from public, anon, authenticated;
grant execute on function public.contest_judge_spec(text, uuid) to service_role;
grant execute on function public.contest_record_submission(uuid, text, text, text, int, int, int, int, text) to service_role;
