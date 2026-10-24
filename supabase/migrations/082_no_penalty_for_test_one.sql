-- 082: a submission that fails on the first test is not a wrong attempt.
--
-- Codeforces charges no penalty for a compilation error or for a solution that
-- fails on test 1 (the first sample), and neither does a round here any more.
-- The judge writes passed = the index of the first failing test (judge.ts), so
-- passed = 0 on a rejected submission is exactly "failed on test 1". Rows with
-- passed unknown (null) still count, as before.
--
-- Only the two places that turn submissions into penalty change, each kept
-- otherwise word for word: contest_standings() (from 069) and
-- owner_contest_rate() (from 078). Nothing is deleted: the submissions stay in
-- everybody's history, the board simply stops charging for them, including
-- for rounds already over and for the one running when this is applied.

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
       -- 082: as on Codeforces, failing the first test costs nothing.
       and (s.verdict = 'ACCEPTED' or s.passed is distinct from 0)
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

create or replace function public.owner_contest_rate(p_slug text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_c contests;
  v_users uuid[]; v_r int[]; v_solved int[]; v_pen int[]; v_first boolean[];
  v_rank int[] := '{}'; v_d int[] := '{}'; v_perf int[] := '{}';
  v_e float8[];            -- v_e[x] = sum over everyone of P(r_j beats x), x = 1..8000
  v_n int; i int; j int; k int;
  v_seed float8; v_target float8; v_s float8; v_lo int; v_hi int; v_mid int;
  v_sum bigint; v_inc int; v_top int;
begin
  if not is_owner() then raise exception 'Only the owner can rate a round' using errcode = '42501'; end if;
  -- Locked, so a double click cannot rate the round twice.
  select * into v_c from contests where slug = p_slug for update;
  if not found then raise exception 'not_found'; end if;
  if v_c.kind <> 'custom' then raise exception 'not_custom'; end if;
  if now() < v_c.starts_at + make_interval(mins => v_c.duration_minutes) then raise exception 'not_finished'; end if;
  if v_c.rated_at is not null then raise exception 'already_rated'; end if;

  -- The board, as contest_standings() computes it (082).
  with e as (
    select ce.user_id, ce.idx, s.verdict, s.created_at
      from contest_entries ce
      join bank_submissions s on s.id = ce.submission_id
     where ce.contest_id = v_c.id
       and s.created_at >= v_c.starts_at
       and s.created_at <  v_c.starts_at + make_interval(mins => v_c.duration_minutes)
       and s.verdict not in ('COMPILATION_ERROR', 'JUDGE_ERROR')
       -- 082: as on Codeforces, failing the first test costs nothing.
       and (s.verdict = 'ACCEPTED' or s.passed is distinct from 0)
       and not exists (select 1 from bot_accounts b where b.user_id = ce.user_id)
  ),
  first_ac as (
    select user_id, idx, min(created_at) as ac_at from e where verdict = 'ACCEPTED' group by user_id, idx
  ),
  cells as (
    select e.user_id, e.idx, f.ac_at,
           count(*) filter (where e.verdict <> 'ACCEPTED' and (f.ac_at is null or e.created_at < f.ac_at))::int as wrong,
           case when f.ac_at is null then null
                else floor(extract(epoch from (f.ac_at - v_c.starts_at)) / 60)::int end as minute
      from e left join first_ac f on f.user_id = e.user_id and f.idx = e.idx
     group by e.user_id, e.idx, f.ac_at
  ),
  totals as (
    select user_id, count(ac_at)::int as solved,
           coalesce(sum(minute + v_c.penalty_minutes * wrong) filter (where ac_at is not null), 0)::int as penalty
      from cells group by user_id
  )
  select array_agg(t.user_id order by t.solved desc, t.penalty asc, t.user_id),
         array_agg(coalesce(p.contest_rating, 1200) order by t.solved desc, t.penalty asc, t.user_id),
         array_agg(t.solved order by t.solved desc, t.penalty asc, t.user_id),
         array_agg(t.penalty order by t.solved desc, t.penalty asc, t.user_id),
         array_agg(p.contest_rating is null order by t.solved desc, t.penalty asc, t.user_id)
    into v_users, v_r, v_solved, v_pen, v_first
    from totals t join profiles p on p.id = t.user_id;

  v_n := coalesce(array_length(v_users, 1), 0);
  if v_n < 2 then raise exception 'too_few'; end if;

  -- Places; a tie shares the lowest place of its group.
  i := 1;
  while i <= v_n loop
    j := i;
    while j < v_n and v_solved[j + 1] = v_solved[i] and v_pen[j + 1] = v_pen[i] loop j := j + 1; end loop;
    for k in i .. j loop v_rank[k] := j; end loop;
    i := j + 1;
  end loop;

  -- Everybody's chance of beating each possible rating, once for the whole
  -- round; a participant's own term is taken back out below. Equal ratings are
  -- summed once (a first round is everybody at 1200), in float8: numeric
  -- power() made a 300-person round take most of a minute.
  select array_agg(e order by x) into v_e
    from (select x, sum(d.c / (1.0::float8 + power(10.0::float8, (x - d.r) / 400.0::float8))) as e
            from generate_series(1, 8000) x,
                 (select r, count(*)::float8 as c from unnest(v_r) r group by r) d
           group by x) q;

  for i in 1 .. v_n loop
    v_seed := 1 + v_e[least(greatest(v_r[i], 1), 8000)] - 0.5;  -- P(r_i beats r_i) = 0.5, not a rival
    v_target := sqrt(v_seed * v_rank[i]);
    v_lo := 1; v_hi := 8000;
    while v_hi - v_lo > 1 loop
      v_mid := (v_lo + v_hi) / 2;
      v_s := 1 + v_e[v_mid] - 1.0::float8 / (1.0::float8 + power(10.0::float8, (v_mid - v_r[i]) / 400.0::float8));
      if v_s < v_target then v_hi := v_mid; else v_lo := v_mid; end if;
    end loop;
    v_d[i] := trunc((v_lo - v_r[i]) / 2.0)::int;

    -- Performance: the expected number of rivals ahead equals place - 0.5.
    v_target := v_rank[i] - 0.5;
    v_lo := 1; v_hi := 8000;
    while v_hi - v_lo > 1 loop
      v_mid := (v_lo + v_hi) / 2;
      v_s := v_e[v_mid] - 1.0::float8 / (1.0::float8 + power(10.0::float8, (v_mid - v_r[i]) / 400.0::float8));
      if v_s < v_target then v_hi := v_mid; else v_lo := v_mid; end if;
    end loop;
    v_perf[i] := least(greatest(v_lo, 0), 4000);
  end loop;

  -- Correction 1: the round as a whole gives back slightly less than it takes.
  select sum(d) into v_sum from unnest(v_d) d;
  v_inc := trunc(-v_sum::numeric / v_n)::int - 1;
  for i in 1 .. v_n loop v_d[i] := v_d[i] + v_inc; end loop;

  -- Correction 2: the highest-rated s, by rating before the round (then by
  -- place), do not gain on average.
  v_top := least(v_n, 4 * round(sqrt(v_n))::int);
  select sum(v_d[q.g]) into v_sum
    from (select g from generate_series(1, v_n) g order by v_r[g] desc, g limit v_top) q;
  v_inc := least(greatest(trunc(-v_sum::numeric / v_top)::int, -10), 0);
  for i in 1 .. v_n loop v_d[i] := v_d[i] + v_inc; end loop;

  for i in 1 .. v_n loop
    insert into contest_rating_changes (contest_id, user_id, place, participants, solved, penalty,
                                        rating_before, rating_after, performance, first_rated)
    values (v_c.id, v_users[i], v_rank[i], v_n, v_solved[i], v_pen[i],
            v_r[i], v_r[i] + v_d[i], v_perf[i], v_first[i]);
    update profiles set contest_rating = v_r[i] + v_d[i] where id = v_users[i];
  end loop;
  update contests set rated_at = now() where id = v_c.id;

  return jsonb_build_object('ok', true, 'rated', v_n);
end $$;

revoke all on function public.contest_standings(text) from public;
grant execute on function public.contest_standings(text) to anon, authenticated;
revoke all on function public.owner_contest_rate(text) from public, anon;
grant execute on function public.owner_contest_rate(text) to authenticated;
