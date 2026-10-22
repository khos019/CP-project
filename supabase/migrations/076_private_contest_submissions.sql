-- 076: a round's test runs stay off everybody's profile.
--
-- An attempt on a custom round's problem is private when it was sent
--   * before the round started,
--   * while the round was hidden, or
--   * by the round's own team (owner, co-authors, testers) while it ran.
-- Those are the author testing the problems, and on a profile they would give
-- away the problem names and that the round exists. The flag is set once, when
-- the attempt is recorded, so a round that is rescheduled or unhidden later
-- does not turn old test runs public.
--
-- A private attempt is still the author's own: they see it in their history
-- and on the problem page (bank_submissions RLS is author-only already). Nobody
-- else sees it in user_submissions, it is left out of the profile summary, and
-- it does not count towards solved_count on the leaderboard. The round's board
-- and Submissions page only ever read attempts inside the round's window, and
-- the team's attempts during it never get a contest entry (068), so neither
-- changes here.
--
-- Run AFTER 001-075.

alter table public.bank_submissions add column if not exists private boolean not null default false;

-- ---------------------------------------------------------------------------
-- 1. Recording: same as 068, plus the flag.
-- ---------------------------------------------------------------------------
create or replace function public.contest_record_submission(
  p_user uuid, p_key text, p_language text, p_verdict text, p_runtime_ms int, p_memory_kb int,
  p_passed int, p_total int, p_source text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p contest_problems; v_c contests; v_id uuid; v_team boolean; v_live boolean;
begin
  select * into v_p from contest_problems where problem_key = p_key;
  if not found then raise exception 'unknown_problem'; end if;
  select * into v_c from contests where id = v_p.contest_id;
  v_team := contest_role(v_p.contest_id, p_user) is not null;
  v_live := now() >= v_c.starts_at and now() < v_c.starts_at + make_interval(mins => v_c.duration_minutes);

  insert into bank_submissions (user_id, problem_key, problem_title, language, verdict, runtime_ms,
                                memory_kb, passed, total, source_code, private)
  values (p_user, p_key, v_p.title_uz, p_language, p_verdict, p_runtime_ms, p_memory_kb,
          p_passed, p_total, p_source,
          v_c.hidden or now() < v_c.starts_at or (v_team and v_live))
  returning id into v_id;
  -- The round's own team (owner, co-authors, testers) is judged like anybody,
  -- but never ranked: their attempts while it runs stay off the board (068).
  if not v_team or not v_live then
    insert into contest_entries (submission_id, contest_id, idx, user_id)
    values (v_id, v_p.contest_id, v_p.idx, p_user);
  end if;
  return jsonb_build_object('ok', true, 'id', v_id);
end $$;
revoke all on function public.contest_record_submission(uuid, text, text, text, int, int, int, int, text) from public, anon, authenticated;
grant execute on function public.contest_record_submission(uuid, text, text, text, int, int, int, int, text) to service_role;

-- ---------------------------------------------------------------------------
-- 2. Somebody's history: same as 042, without other people's private rows.
--    The author still gets theirs, marked, so the page can say so.
-- ---------------------------------------------------------------------------
create or replace function public.user_submissions(p_user uuid, p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare result jsonb; v_me uuid := auth.uid(); v_staff boolean := is_staff(auth.uid());
begin
  select coalesce(jsonb_agg(payload order by created_at desc), '[]'::jsonb) into result
  from (
    select s.created_at,
           jsonb_build_object(
             'id',            s.id,
             'problem_key',   s.problem_key,
             'problem_title', s.problem_title,
             'language',      s.language,
             'verdict',       s.verdict,
             'runtime_ms',    s.runtime_ms,
             'memory_kb',     s.memory_kb,
             'passed',        s.passed,
             'total',         s.total,
             'created_at',    s.created_at,
             'private',       s.private,
             'readable',      (v_me is not null and (
                                 v_staff
                                 or s.user_id = v_me
                                 or exists (select 1 from submission_unlocks u
                                             where u.viewer_id = v_me and u.submission_id = s.id)
                                 or has_solved(v_me, s.problem_key)))
           ) as payload
    from bank_submissions s
    where s.user_id = p_user
      and (not s.private or s.user_id = v_me)
    order by s.created_at desc
    limit least(greatest(coalesce(p_limit, 50), 1), 200)
  ) x;
  return result;
end $$;
grant execute on function public.user_submissions(uuid, int) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. The profile summary: same as 034, private rows counted only for the
--    author looking at their own profile.
-- ---------------------------------------------------------------------------
create or replace function public.public_profile_summary(p_user uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_rating int; v_self boolean := p_user = auth.uid();
begin
  select duel_rating into v_rating from profiles where id = p_user;
  if not found then return null; end if;

  return jsonb_build_object(
    'solved_keys', coalesce((
        select jsonb_agg(k order by k) from (
          select distinct s.problem_key as k
            from bank_submissions s
           where s.user_id = p_user and s.verdict = 'ACCEPTED'
             and (not s.private or v_self)) d), '[]'::jsonb),
    'submissions', (select count(*) from bank_submissions s
                     where s.user_id = p_user and (not s.private or v_self)),
    'accepted',    (select count(*) from bank_submissions s
                     where s.user_id = p_user and s.verdict = 'ACCEPTED'
                       and (not s.private or v_self)),
    'place',       (select count(*) + 1 from profiles x where x.duel_rating > v_rating),
    'members',     (select count(*) from profiles),
    'friends',     (select count(*) from friends f where f.user_id = p_user),
    'duels',       (select count(*) from duel_match_players me
                      join duel_matches m on m.id = me.match_id
                     where me.user_id = p_user and m.status = 'finished'),
    'max_rating',  greatest(v_rating, coalesce((
                     select max(coalesce(me.rating_after, me.rating_before))
                       from duel_match_players me
                       join duel_matches m on m.id = me.match_id
                      where me.user_id = p_user and m.status = 'finished'), v_rating))
  );
end $$;
grant execute on function public.public_profile_summary(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. solved_count, shown on the leaderboard to everybody: public rows only.
-- ---------------------------------------------------------------------------
create or replace function public.sync_solved_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid := coalesce(new.user_id, old.user_id);
begin
  update public.profiles p
     set solved_count = (select count(distinct s.problem_key) from public.bank_submissions s
                          where s.user_id = target and s.verdict = 'ACCEPTED' and not s.private)
   where p.id = target;
  return coalesce(new, old);
end
$$;

-- ---------------------------------------------------------------------------
-- 5. Attempts already recorded under the same rule, then every count again.
-- ---------------------------------------------------------------------------
update public.bank_submissions s
   set private = true
  from public.contest_problems p
  join public.contests c on c.id = p.contest_id
 where s.problem_key = p.problem_key
   -- Custom rounds only: an archive round's problems are bank problems, and
   -- their ordinary attempts from before it are nobody's test runs.
   and s.problem_key like 'cx:%'
   and not s.private
   and (s.created_at < c.starts_at
        or c.hidden
        or (contest_role(c.id, s.user_id) is not null
            and s.created_at < c.starts_at + make_interval(mins => c.duration_minutes)));

update public.profiles p
   set solved_count = coalesce((select count(distinct s.problem_key) from public.bank_submissions s
                                 where s.user_id = p.id and s.verdict = 'ACCEPTED' and not s.private), 0);
