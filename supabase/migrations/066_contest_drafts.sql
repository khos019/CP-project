-- AlgoYo'l — a round is created first and filled in later; old rounds get
-- their own visibility switch.
--
-- 1. owner_contest_save() no longer insists on problems. The owner sets the
--    round up, saves it, and adds problems whenever they are ready — the
--    round waits on /contests (hidden by default) in the meantime. A problem
--    saved before it has a name is called "Masala A".
--
-- 2. owner_contest_settings() edits what a seeded archive round can safely
--    change: its titles, description and visibility. Its start and length
--    stay put, because the board counts only the submissions inside that
--    window — moving it would empty the standings.
--
-- 3. owner_contest_set_hidden() is the one-click switch on a round's page,
--    for any round.
--
-- Run AFTER 065. Safe to re-run.

/* Creates or replaces a custom round. p_original is the slug the editor
   opened (null for a new round), so a round can be renamed. Problems the
   payload leaves out are removed, unless somebody already submitted to them —
   that would take submissions off the board. */
create or replace function public.owner_contest_save(p_original text, p jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_id uuid; v_c contests; v_slug text := lower(btrim(p ->> 'slug'));
  v_pr jsonb; v_idx text; v_key text; v_t jsonb; v_n int; v_keep text[] := '{}'; v_title text;
begin
  if not is_owner() then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  if v_slug is null or v_slug !~ '^[a-z0-9-]{3,64}$' or v_slug in ('new', 'edit') then
    raise exception 'bad_slug';
  end if;
  if coalesce(btrim(p ->> 'title_uz'), '') = '' then raise exception 'bad_title'; end if;

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
  if not is_owner() then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  select * into v_c from contests where slug = p_slug;
  if not found then raise exception 'not_found'; end if;
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
begin
  if not is_owner() then raise exception 'Only the owner can edit contests' using errcode = '42501'; end if;
  update contests set hidden = p_hidden, updated_at = now() where slug = p_slug;
  if not found then raise exception 'not_found'; end if;
  return jsonb_build_object('ok', true, 'hidden', p_hidden);
end $$;

revoke all on function public.owner_contest_save(text, jsonb) from public;
grant execute on function public.owner_contest_save(text, jsonb) to authenticated;
revoke all on function public.owner_contest_settings(text, jsonb) from public;
grant execute on function public.owner_contest_settings(text, jsonb) to authenticated;
revoke all on function public.owner_contest_set_hidden(text, boolean) from public;
grant execute on function public.owner_contest_set_hidden(text, boolean) to authenticated;
