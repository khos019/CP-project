-- 083: everybody starts from 0, as on Codeforces, and a small round stops
-- taxing everyone.
--
-- Raund #1 was rated with 078's rule: everybody entered at 1200 and 7 of 19
-- went up. The arithmetic was Codeforces' to the point (recomputed outside the
-- database, all 19 deltas equal), but two parts of it fit a round of
-- thousands, not one of twenty:
--
-- 1. Codeforces shows newcomers 0 and keeps a hidden 1400; the first six rated
--    rounds add 500, 350, 250, 150, 100 and 50 on top of the real change, so
--    taking part shows progress early on, and the shown rating meets the real
--    one after six rounds. profiles.contest_rating stays the shown figure
--    (every reader keeps working); contest_rating_real is the one the formula
--    uses, contest_rounds counts the rounds behind it. A change row keeps
--    both, so taking a round back restores both.
--
-- 2. Correction 2 (the top 4 sqrt(n) by rating may not gain on average)
--    covered 17 of 19 people and cost nearly everybody 10 points. It now
--    applies only while that group is at most half the round.
--
-- The one rated round so far is taken back here, so the owner rates it again
-- from the button under the new rule. Nothing else is touched.
--
-- Run AFTER 001-082.

alter table public.profiles add column if not exists contest_rating_real int;
alter table public.profiles add column if not exists contest_rounds int not null default 0;
alter table public.contest_rating_changes add column if not exists real_before int;
alter table public.contest_rating_changes add column if not exists real_after int;

-- Back to unrated everywhere: a first-rated row's rating_before is 078's 1200,
-- which nobody should be left on.
update public.profiles set contest_rating = null, contest_rating_real = null, contest_rounds = 0
 where contest_rating is not null or contest_rating_real is not null or contest_rounds <> 0;
delete from public.contest_rating_changes;
update public.contests set rated_at = null where rated_at is not null;

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
  v_rounds int[]; v_shown int[]; v_k int; v_after int; v_display int;
  -- 083: Codeforces' newcomer boosts (codeforces.com/blog/entry/77890).
  v_boost int[] := array[500, 350, 250, 150, 100, 50];
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
         array_agg(coalesce(p.contest_rating_real, 1400) order by t.solved desc, t.penalty asc, t.user_id),
         array_agg(t.solved order by t.solved desc, t.penalty asc, t.user_id),
         array_agg(t.penalty order by t.solved desc, t.penalty asc, t.user_id),
         array_agg(p.contest_rating_real is null order by t.solved desc, t.penalty asc, t.user_id),
         array_agg(coalesce(p.contest_rounds, 0) order by t.solved desc, t.penalty asc, t.user_id),
         array_agg(coalesce(p.contest_rating, 0) order by t.solved desc, t.penalty asc, t.user_id)
    into v_users, v_r, v_solved, v_pen, v_first, v_rounds, v_shown
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
  -- place), do not gain on average. 083: only while they are a minority of
  -- the round. 4 sqrt(n) is a small elite among thousands, but it was 17 of
  -- 19 in Raund #1, where the "correction" was a flat -10 on nearly everybody.
  v_top := least(v_n, 4 * round(sqrt(v_n))::int);
  if 2 * v_top <= v_n then
    select sum(v_d[q.g]) into v_sum
      from (select g from generate_series(1, v_n) g order by v_r[g] desc, g limit v_top) q;
    v_inc := least(greatest(trunc(-v_sum::numeric / v_top)::int, -10), 0);
    for i in 1 .. v_n loop v_d[i] := v_d[i] + v_inc; end loop;
  end if;

  -- 083: the rating above is the real one (from 1400). What people see is
  -- real - 1400 + the boosts earned so far, so a newcomer starts from 0 and
  -- climbs over their first six rated rounds, after which the two agree.
  for i in 1 .. v_n loop
    v_after := v_r[i] + v_d[i];
    v_k := v_rounds[i] + 1;
    select v_after - 1400 + coalesce(sum(b), 0) into v_display
      from unnest(v_boost[1:least(v_k, 6)]) b;
    insert into contest_rating_changes (contest_id, user_id, place, participants, solved, penalty,
                                        rating_before, rating_after, performance, first_rated,
                                        real_before, real_after)
    values (v_c.id, v_users[i], v_rank[i], v_n, v_solved[i], v_pen[i],
            case when v_first[i] then 0 else v_shown[i] end, v_display, v_perf[i], v_first[i],
            v_r[i], v_after);
    update profiles set contest_rating = v_display, contest_rating_real = v_after, contest_rounds = v_k
     where id = v_users[i];
  end loop;
  update contests set rated_at = now() where id = v_c.id;

  return jsonb_build_object('ok', true, 'rated', v_n);
end $$;

create or replace function public.owner_contest_unrate(p_slug text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_c contests; v_n int;
begin
  if not is_owner() then raise exception 'Only the owner can rate a round' using errcode = '42501'; end if;
  select * into v_c from contests where slug = p_slug for update;
  if not found then raise exception 'not_found'; end if;
  if v_c.rated_at is null then raise exception 'not_rated'; end if;
  if exists (select 1 from contest_rating_changes mine
               join contest_rating_changes later on later.user_id = mine.user_id and later.contest_id <> mine.contest_id
               join contests lc on lc.id = later.contest_id
              where mine.contest_id = v_c.id and lc.rated_at > v_c.rated_at) then
    raise exception 'later_round_rated';
  end if;
  update profiles p
     set contest_rating = case when ch.first_rated then null else ch.rating_before end,
         contest_rating_real = case when ch.first_rated then null else ch.real_before end,
         contest_rounds = greatest(coalesce(p.contest_rounds, 0) - 1, 0)
    from contest_rating_changes ch
   where ch.contest_id = v_c.id and p.id = ch.user_id;
  delete from contest_rating_changes where contest_id = v_c.id;
  get diagnostics v_n = row_count;
  update contests set rated_at = null where id = v_c.id;
  return jsonb_build_object('ok', true, 'unrated', v_n);
end $$;

revoke all on function public.owner_contest_rate(text) from public, anon;
grant execute on function public.owner_contest_rate(text) to authenticated;
revoke all on function public.owner_contest_unrate(text) from public, anon;
grant execute on function public.owner_contest_unrate(text) to authenticated;
