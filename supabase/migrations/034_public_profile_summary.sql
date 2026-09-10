-- 034: the numbers a profile header shows, in one read.
--
-- The redesigned profile opens with a row of figures -- rating and its peak,
-- place on the leaderboard, problems solved, duels played, friends -- and
-- until now most of them had no honest source:
--
--   * profiles.solved_count is not maintained. Nothing has written it since
--     001; the owner's own profile read "0 solved" while bank_submissions held
--     accepted verdicts. The truth is the set of distinct problem keys with an
--     ACCEPTED submission, the same test has_solved() applies, so that is what
--     comes back -- as the keys themselves, because the page also splits them
--     by difficulty and the ratings live in the client's problem index.
--   * the peak rating was being read off the duel history, which is capped at
--     200 rows; here it is the maximum over every finished duel.
--   * place on the leaderboard is "how many accounts are rated above this one,
--     plus one", which is exactly how the leaderboard orders them.
--
-- Granted to anon, like 033: every figure here is already public one way or
-- another, and a profile link has to work before signing in.
create or replace function public.public_profile_summary(p_user uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_rating int;
begin
  select duel_rating into v_rating from profiles where id = p_user;
  if not found then return null; end if;

  return jsonb_build_object(
    'solved_keys', coalesce((
        select jsonb_agg(k order by k) from (
          select distinct s.problem_key as k
            from bank_submissions s
           where s.user_id = p_user and s.verdict = 'ACCEPTED') d), '[]'::jsonb),
    'submissions', (select count(*) from bank_submissions s where s.user_id = p_user),
    'accepted',    (select count(*) from bank_submissions s
                     where s.user_id = p_user and s.verdict = 'ACCEPTED'),
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
