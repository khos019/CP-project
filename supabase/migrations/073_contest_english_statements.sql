-- 073: a custom round's problems carry an English statement too.
--
-- Asked for on 22 Oct 2026: rounds were written in Uzbek only, so somebody
-- reading the site in English met an Uzbek statement. contest_problem_specs.en
-- holds {statement, input_spec, output_spec, notes} in English; the problem
-- page shows each part in the reader's language and falls back to the Uzbek
-- text for any part left empty, so an untranslated round reads as before.
--
-- contest_problem() and owner_contest_get() return it; owner_contest_save()
-- stores it when the payload carries "en" and leaves it alone otherwise, so a
-- page still running the previous code cannot wipe a translation.
--
-- Run AFTER 069. Safe to re-run.

alter table public.contest_problem_specs add column if not exists en jsonb not null default '{}'::jsonb;


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
           'samples', sp.samples, 'en', sp.en,
           'tests', (select count(*) from contest_problem_tests t where t.contest_id = p.contest_id and t.idx = p.idx))
    into result
    from contest_problems p
    join contest_problem_specs sp on sp.contest_id = p.contest_id and sp.idx = p.idx
   where p.contest_id = v_c.id and p.idx = upper(p_idx);
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
               'samples', sp.samples, 'en', coalesce(sp.en, '{}'::jsonb),
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
                                       time_limit_ms, memory_mb, samples, en)
    values (v_id, v_idx, coalesce(v_pr ->> 'statement', ''), coalesce(v_pr ->> 'input_spec', ''),
            coalesce(v_pr ->> 'output_spec', ''), coalesce(v_pr ->> 'notes', ''),
            coalesce((v_pr ->> 'time_limit_ms')::int, 1000), coalesce((v_pr ->> 'memory_mb')::int, 256),
            coalesce(v_pr -> 'samples', '[]'::jsonb), case when jsonb_typeof(v_pr -> 'en') = 'object' then v_pr -> 'en' else '{}'::jsonb end)
    on conflict (contest_id, idx) do update set
      statement = excluded.statement, input_spec = excluded.input_spec, output_spec = excluded.output_spec,
      notes = excluded.notes, time_limit_ms = excluded.time_limit_ms, memory_mb = excluded.memory_mb,
      samples = excluded.samples,
      en = case when jsonb_typeof(v_pr -> 'en') = 'object' then excluded.en else contest_problem_specs.en end;

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


