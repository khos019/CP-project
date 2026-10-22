-- 078: a contest rating, apart from the duel rating.
--
-- Two ratings, as AtCoder keeps two: the duel rating stays the main one (the
-- leaderboard, the header, matchmaking), and a custom round now moves a second
-- one, profiles.contest_rating. Nobody has one until their first rated round;
-- everybody enters it from 1200.
--
-- The update is Codeforces' (Mirzayanov, "Open Codeforces Rating System",
-- codeforces.com/blog/entry/20762), chosen over AtCoder's because it is driven
-- by exactly the two things a round gives -- the place and the ratings of the
-- people in it -- and behaves with a few dozen participants:
--
--   P(a beats b) = 1 / (1 + 10^((b - a) / 400))
--   seed_i       = 1 + sum over j != i of P(r_j beats r_i)    the expected place
--   m_i          = sqrt(seed_i * place_i)                      halfway, geometrically
--   R_i          = the rating whose seed against the others is m_i (binary search)
--   d_i          = trunc((R_i - r_i) / 2)
--
-- then two corrections, also Codeforces': every d shifts by trunc(-sum d / n) - 1
-- so the round takes slightly more than it gives (ratings do not inflate), and
-- by min(max(trunc(-sum / s), -10), 0) over the s = min(n, 4 round(sqrt n))
-- highest-rated, so the top of the table does not drift up either.
--
-- Tied participants (same solved and penalty) share the lowest of their places,
-- as on Codeforces. A participant is anybody on the round's board: at least one
-- judged attempt inside the round's window. Registered people who sent nothing
-- are not rated, and neither is the round's team (their attempts never reach
-- the board, 068) nor a bot.
--
-- The performance stored with each change is display only: the rating at which
-- the expected number of people ahead equals place - 0.5 (AtCoder's way, which
-- stays finite for the winner), clamped to 0..4000.
--
-- Rating is the owner's button: owner_contest_rate() once the round is over,
-- owner_contest_unrate() to take it back while no later round has been rated
-- on top of it.
--
-- Run AFTER 001-077.

alter table public.profiles add column if not exists contest_rating int;
alter table public.contests add column if not exists rated_at timestamptz;

create table if not exists public.contest_rating_changes (
  contest_id uuid not null references public.contests on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  place int not null,
  participants int not null,
  solved int not null,
  penalty int not null,
  rating_before int not null,
  rating_after int not null,
  performance int not null,
  -- The round that gave this account its first contest rating: taking it back
  -- leaves the account unrated again rather than at 1200.
  first_rated boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (contest_id, user_id)
);
create index if not exists idx_contest_rating_changes_user on public.contest_rating_changes(user_id, created_at);
alter table public.contest_rating_changes enable row level security;
-- No policy: read through contest_rating_history() and contest_rating_changes().

-- ---------------------------------------------------------------------------
-- 1. Rating a round.
-- ---------------------------------------------------------------------------
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

  -- The board, as contest_standings() computes it (069).
  with e as (
    select ce.user_id, ce.idx, s.verdict, s.created_at
      from contest_entries ce
      join bank_submissions s on s.id = ce.submission_id
     where ce.contest_id = v_c.id
       and s.created_at >= v_c.starts_at
       and s.created_at <  v_c.starts_at + make_interval(mins => v_c.duration_minutes)
       and s.verdict not in ('COMPILATION_ERROR', 'JUDGE_ERROR')
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
revoke all on function public.owner_contest_rate(text) from public, anon;
grant execute on function public.owner_contest_rate(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Taking it back: only the latest rated round of every participant, so the
--    ratings it restores are still the ones the next round started from.
-- ---------------------------------------------------------------------------
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
     set contest_rating = case when ch.first_rated then null else ch.rating_before end
    from contest_rating_changes ch
   where ch.contest_id = v_c.id and p.id = ch.user_id;
  delete from contest_rating_changes where contest_id = v_c.id;
  get diagnostics v_n = row_count;
  update contests set rated_at = null where id = v_c.id;
  return jsonb_build_object('ok', true, 'unrated', v_n);
end $$;
revoke all on function public.owner_contest_unrate(text) from public, anon;
grant execute on function public.owner_contest_unrate(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Reading: one account's history (the profile's contest curve) and one
--    round's changes (a column on its board).
-- ---------------------------------------------------------------------------
create or replace function public.contest_rating_history(p_user uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'slug', c.slug, 'number', c.number, 'title_uz', c.title_uz, 'title_en', c.title_en,
           'ended_at', c.starts_at + make_interval(mins => c.duration_minutes),
           'place', ch.place, 'participants', ch.participants, 'solved', ch.solved,
           'rating_before', ch.rating_before, 'rating_after', ch.rating_after,
           'delta', ch.rating_after - ch.rating_before, 'performance', ch.performance
         ) order by c.starts_at), '[]'::jsonb)
    from contest_rating_changes ch
    join contests c on c.id = ch.contest_id
   where ch.user_id = p_user and not c.hidden;
$$;
revoke all on function public.contest_rating_history(uuid) from public;
grant execute on function public.contest_rating_history(uuid) to anon, authenticated;

create or replace function public.contest_rating_changes(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests;
begin
  select * into v_c from contests where slug = p_slug;
  if not found or (v_c.hidden and not contest_can_preview(v_c.id)) then return null; end if;
  return jsonb_build_object(
    'rated_at', v_c.rated_at,
    'rows', coalesce((
      select jsonb_agg(jsonb_build_object(
               'username', pr.username, 'place', ch.place,
               'rating_before', ch.rating_before, 'rating_after', ch.rating_after,
               'delta', ch.rating_after - ch.rating_before, 'performance', ch.performance
             ) order by ch.place)
        from contest_rating_changes ch join profiles pr on pr.id = ch.user_id
       where ch.contest_id = v_c.id), '[]'::jsonb));
end $$;
revoke all on function public.contest_rating_changes(text) from public;
grant execute on function public.contest_rating_changes(text) to anon, authenticated;
