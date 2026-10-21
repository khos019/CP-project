-- AlgoYo'l — admins write contests too, and the owner approves them.
--
-- 1. contests.status: 'draft' -> 'review' -> 'approved'. A round the owner
--    creates is approved at once. A round an admin creates starts as a draft,
--    its creator becomes its co-author, and it goes to the owner with
--    contest_submit_for_review(). owner_contest_review() approves it or sends
--    it back to draft.
--
--    Until it is approved a round is hidden, whatever anybody sets: a trigger
--    keeps hidden = true, so every read that already respects `hidden` (the
--    list, the board, the problems, the judge) keeps it off the site without
--    being rewritten. owner_contest_set_hidden() says so out loud.
--
-- 2. Deleting a round is now its co-authors' as well as the owner's. Admins
--    who are not on a round's team have no say in it, exactly like anybody.
--
-- Run AFTER 068. Safe to re-run.

alter table public.contests add column if not exists status text not null default 'approved';
alter table public.contests drop constraint if exists contests_status_check;
alter table public.contests add constraint contests_status_check check (status in ('draft', 'review', 'approved'));

create or replace function public.contests_unapproved_stay_hidden()
returns trigger language plpgsql as $$
begin
  if new.status <> 'approved' then new.hidden := true; end if;
  return new;
end $$;
drop trigger if exists contests_unapproved_stay_hidden on public.contests;
create trigger contests_unapproved_stay_hidden before insert or update on public.contests
  for each row execute function public.contests_unapproved_stay_hidden();


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
             'status',           c.status,
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
      'my_role', contest_role(v_c.id), 'status', v_c.status,
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



create or replace function public.owner_contest_get(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests;
begin
  select * into v_c from contests where slug = p_slug;
  if not found then return null; end if;
  if not contest_can_manage(v_c.id) then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  return jsonb_build_object(
    'slug', v_c.slug, 'number', v_c.number, 'kind', v_c.kind, 'my_role', contest_role(v_c.id), 'status', v_c.status,
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
  -- The owner and admins create rounds (an admin's waits for the owner's
  -- approval); editing one is its owner's and co-authors'.
  if p_original is null and not is_staff(auth.uid()) then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
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
    if not is_owner() then
      update contests set status = 'draft' where id = v_id;
      insert into contest_staff (contest_id, user_id, role, status, invited_by, accepted_at)
      values (v_id, auth.uid(), 'author', 'accepted', auth.uid(), now())
      on conflict (contest_id, user_id) do update set role = 'author', status = 'accepted';
    end if;
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



create or replace function public.owner_contest_delete(p_slug text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_c contests;
begin
  select * into v_c from contests where slug = p_slug;
  if not found then return jsonb_build_object('ok', false); end if;
  if not contest_can_manage(v_c.id) then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  if v_c.kind <> 'custom' then raise exception 'not_custom'; end if;
  -- The submissions stay on their authors' profiles; only the round goes.
  delete from contests where id = v_c.id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.owner_contest_set_hidden(p_slug text, p_hidden boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_c contests;
begin
  select * into v_c from contests where slug = p_slug;
  if not found then raise exception 'not_found'; end if;
  if not contest_can_manage(v_c.id) then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  if not p_hidden and v_c.status <> 'approved' then raise exception 'not_approved'; end if;
  update contests set hidden = p_hidden, updated_at = now() where id = v_c.id;
  return jsonb_build_object('ok', true, 'hidden', p_hidden);
end $$;

create or replace function public.contest_submit_for_review(p_slug text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_c contests;
begin
  select * into v_c from contests where slug = p_slug;
  if not found then raise exception 'not_found'; end if;
  if not contest_can_manage(v_c.id) then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  if v_c.status = 'approved' then return jsonb_build_object('ok', true, 'status', 'approved'); end if;
  update contests set status = 'review', updated_at = now() where id = v_c.id;
  return jsonb_build_object('ok', true, 'status', 'review');
end $$;

-- The owner's answer: approve (the round can then be made public), or send
-- it back to its authors as a draft.
create or replace function public.owner_contest_review(p_slug text, p_approve boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_c contests; v_status text := case when p_approve then 'approved' else 'draft' end;
begin
  if not is_owner() then raise exception 'Only the owner can approve contests' using errcode = '42501'; end if;
  select * into v_c from contests where slug = p_slug;
  if not found then raise exception 'not_found'; end if;
  update contests set status = v_status, updated_at = now() where id = v_c.id;
  return jsonb_build_object('ok', true, 'status', v_status);
end $$;

revoke all on function public.contest_list() from public;
grant execute on function public.contest_list() to anon, authenticated;
revoke all on function public.contest_standings(text) from public;
grant execute on function public.contest_standings(text) to anon, authenticated;
revoke all on function public.owner_contest_get(text) from public;
grant execute on function public.owner_contest_get(text) to authenticated;
revoke all on function public.owner_contest_save(text, jsonb) from public;
grant execute on function public.owner_contest_save(text, jsonb) to authenticated;
revoke all on function public.owner_contest_delete(text) from public;
grant execute on function public.owner_contest_delete(text) to authenticated;
revoke all on function public.owner_contest_set_hidden(text, boolean) from public;
grant execute on function public.owner_contest_set_hidden(text, boolean) to authenticated;
revoke all on function public.contest_submit_for_review(text) from public;
grant execute on function public.contest_submit_for_review(text) to authenticated;
revoke all on function public.owner_contest_review(text, boolean) from public;
grant execute on function public.owner_contest_review(text, boolean) to authenticated;
