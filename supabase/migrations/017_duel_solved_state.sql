-- AlgoYo'l — a duel solve is a solve.
--
-- Two things 016 left undone, both found by looking at what the Problems page
-- actually reads:
--
--   1. A problem solved in a duel left no trace anywhere. The duel's judge call
--      recorded nothing, so winning a round never reached bank_submissions —
--      the table the profile, the submission history and has_solved() all read.
--      A learner could win a duel on problem #42 and still see #42 as untouched.
--
--   2. duel_pick_problems() already excludes problems either player has solved,
--      and it reads bank_submissions. So (1) also meant the exclusion could
--      never see duel history: the same problem could come back next duel.
--
-- Fixing the write fixes both, and it belongs in the same transaction that
-- claims the round — a solve that counts for the duel but not for the profile
-- is exactly the kind of split state this avoids.
--
-- Also here: the searching screen wants to say how many people are online, and
-- that number has to come from the same query that decides eligibility rather
-- than from a second count that could disagree with it.
--
-- Run AFTER 016. Safe to re-run.

-- ---------------------------------------------------------------------------
-- 1. Duel submissions land in the account's submission history.
--
-- Every verdict, not just accepted ones — practice submissions record failures
-- too, and a history that hides your wrong answers is not a history.
--
-- The bot is excluded: it has no account, and a row in somebody's history that
-- nobody wrote would be a lie about who solved what.
-- ---------------------------------------------------------------------------
create or replace function public.duel_record_submission(
  p_match uuid, p_round int, p_language text, p_source text, p_verdict text,
  p_runtime int default null, p_memory int default null, p_passed int default null, p_total int default null,
  p_bot boolean default false, p_title text default '')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me uuid := auth.uid(); v_seat int; v_match duel_matches; v_claimed boolean := false;
  v_points int; v_key text;
begin
  select * into v_match from duel_matches where id = p_match;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;

  if p_bot then
    select seat into v_seat from duel_match_players where match_id = p_match and is_bot;
    if v_me is not null then return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  else
    select seat into v_seat from duel_match_players where match_id = p_match and user_id = v_me;
  end if;
  if v_seat is null then return jsonb_build_object('ok', false, 'error', 'not_a_player'); end if;

  if v_match.status <> 'active' then return jsonb_build_object('ok', false, 'error', 'duel_over'); end if;
  if now() >= v_match.ends_at then
    perform duel_finish(p_match, 'time');
    return jsonb_build_object('ok', false, 'error', 'duel_over');
  end if;

  select problem_key into v_key from duel_rounds where match_id = p_match and round = p_round;
  if v_key is null then return jsonb_build_object('ok', false, 'error', 'no_such_round'); end if;

  insert into duel_submissions(match_id, seat, is_bot, round, language, source_code, verdict,
                               runtime_ms, memory_kb, passed, total)
  values (p_match, v_seat, p_bot, p_round, p_language, p_source, p_verdict,
          p_runtime, p_memory, p_passed, p_total);

  -- The shared source of truth. Same table a practice submission writes to,
  -- same columns, so the Problems page cannot tell the two apart — which is
  -- the entire point.
  if not p_bot and v_me is not null then
    insert into bank_submissions(user_id, problem_key, problem_title, language, verdict,
                                 runtime_ms, memory_kb, passed, total, source_code)
    values (v_me, v_key, coalesce(nullif(p_title, ''), v_key), p_language, p_verdict,
            p_runtime, p_memory, p_passed, p_total, p_source);
  end if;

  if p_verdict = 'ACCEPTED' then
    update duel_rounds set claimed_by_seat = v_seat, claimed_at = now()
     where match_id = p_match and round = p_round and claimed_by_seat is null
     returning points into v_points;
    if found then
      v_claimed := true;
      update duel_match_players set score = score + v_points
       where match_id = p_match and seat = v_seat;
    end if;
  end if;

  if not exists (select 1 from duel_rounds where match_id = p_match and claimed_by_seat is null) then
    perform duel_finish(p_match, 'sweep');
  end if;

  return jsonb_build_object('ok', true, 'claimed', v_claimed, 'seat', v_seat,
                            'problem_key', v_key, 'state', duel_state());
end $$;

revoke all on function public.duel_record_submission(uuid, int, text, text, text, int, int, int, int, boolean, text) from public;
grant execute on function public.duel_record_submission(uuid, int, text, text, text, int, int, int, int, boolean, text) to authenticated;

-- The old nine-argument signature would otherwise sit alongside the new one and
-- PostgREST could resolve to either.
drop function if exists public.duel_record_submission(uuid, int, text, text, text, int, int, int, int, boolean);

-- ---------------------------------------------------------------------------
-- 2. How many people are actually available, reported by the tick.
--
-- Counted with the same presence window and the same exclusions the matchmaker
-- uses, so the number on the searching screen is the number of people who
-- could really be challenged — not everyone who happens to have the tab open.
-- ---------------------------------------------------------------------------
create or replace function public.duel_available_count()
returns int language sql stable security definer set search_path = public as $$
  select count(*)::int
    from profiles p
    join user_presence pr on pr.user_id = p.id
   where pr.duel_ready
     and pr.last_seen_at > now() - (duel_cfg('presence_window_seconds', 45) || ' seconds')::interval
     and p.suspended_at is null
     and not exists (select 1 from duel_match_players mp where mp.user_id = p.id and mp.active)
$$;
grant execute on function public.duel_available_count() to authenticated;

-- ---------------------------------------------------------------------------
-- 3. The result screen needs the duel that just ended.
--
-- duel_state() reports the duel a learner is *in*, and finishing one clears
-- the `active` flag that identifies it — so the moment a duel ends there is
-- nothing left to render a result from. Rather than keep a finished duel
-- looking active (which would break the one-duel-per-user index), the last
-- finished match is a separate question with a separate answer.
--
-- Thirty minutes is long enough to survive a refresh, a closed laptop lid or
-- a walk to the kitchen, and short enough that reopening the site tomorrow
-- does not reopen a scoreboard.
-- ---------------------------------------------------------------------------
create or replace function public.duel_recent_result()
returns jsonb language plpgsql stable security definer set search_path = public as $$
-- A plain record, not a duel_matches row variable: `INTO a, b` gives each
-- target one column, so a composite target would have collected only `m.id`
-- and every field read off it afterwards would have been null.
declare v_me uuid := auth.uid(); r record; v_result jsonb;
begin
  if v_me is null then return null; end if;

  select m.id, m.mode, m.winner_id, m.started_at, m.finished_at, p.seat as my_seat into r
    from duel_matches m
    join duel_match_players p on p.match_id = m.id and p.user_id = v_me
   where m.status = 'finished' and m.finished_at > now() - interval '30 minutes'
   order by m.finished_at desc limit 1;
  if not found then return null; end if;

  select jsonb_build_object(
    'id', r.id, 'mode', r.mode, 'my_seat', r.my_seat,
    'winner_id', r.winner_id,
    'outcome', case when r.winner_id is null then 'draw'
                    when r.winner_id = v_me then 'win' else 'loss' end,
    'finished_at', r.finished_at, 'started_at', r.started_at,
    'players', (select jsonb_agg(jsonb_build_object(
                  'seat', pl.seat, 'is_bot', pl.is_bot, 'score', pl.score,
                  'rating', coalesce(pl.bot_rating, pl.rating_before),
                  'rating_before', pl.rating_before, 'rating_after', pl.rating_after,
                  'delta', coalesce(pl.rating_after, pl.rating_before) - pl.rating_before,
                  'display_name', case when pl.is_bot then '' else pl.display_name end,
                  'username', (select x.username from profiles x where x.id = pl.user_id))
                  order by pl.seat)
                from duel_match_players pl where pl.match_id = r.id),
    'rounds', (select jsonb_agg(jsonb_build_object(
                  'round', rd.round, 'problem_key', rd.problem_key, 'points', rd.points,
                  'claimed_by_seat', rd.claimed_by_seat) order by rd.round)
                from duel_rounds rd where rd.match_id = r.id)
  ) into v_result;
  return v_result;
end $$;
grant execute on function public.duel_recent_result() to authenticated;

-- ---------------------------------------------------------------------------
-- 4. The bot is switched off until it can actually play.
--
-- 016 can already create a bot duel — a seat, a rating, three problems. What
-- it cannot yet do is submit anything, because the reference solutions and the
-- timing model are the next phase. A duel against an opponent who never moves
-- is worse than no bot at all: the learner wins by default and the result is
-- meaningless.
--
-- So the fallback is gated on a config key rather than removed. Phase 6 flips
-- it to true in the same change that teaches the bot to play, and until then a
-- search that finds no human simply keeps looking.
-- ---------------------------------------------------------------------------
insert into public.duel_config(key, value, note) values
  ('bot_enabled', 'false'::jsonb, 'flip to true when the bot can submit — Phase 6')
on conflict (key) do nothing;

create or replace function public.duel_start_bot_match()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me uuid := auth.uid(); v_session duel_matchmaking_sessions;
  v_match uuid; v_rating int; v_bot int; v_jitter int; v_rounds int; v_row record;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;
  if not duel_cfg_bool('bot_enabled', false) then
    return jsonb_build_object('ok', false, 'error', 'bot_disabled');
  end if;
  perform duel_sweep();

  select * into v_session from duel_matchmaking_sessions
   where user_id = v_me and status in ('searching','challenge_sent') for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_searching'); end if;

  if extract(epoch from (now() - v_session.created_at)) < duel_cfg('human_wait_seconds', 12) then
    return jsonb_build_object('ok', false, 'error', 'too_early');
  end if;
  if exists (select 1 from duel_match_players where user_id = v_me and active) then
    return jsonb_build_object('ok', false, 'error', 'already_in_duel');
  end if;

  select duel_rating into v_rating from profiles where id = v_me;
  v_rating := coalesce(v_rating, 1200);
  v_jitter := duel_cfg('bot_rating_jitter', 40);
  v_bot := greatest(800, least(2400, v_rating + (floor(random() * (2 * v_jitter + 1)) - v_jitter)::int));
  v_rounds := duel_cfg('duel_rounds', 3);

  insert into duel_matches(mode, rounds, ends_at)
  values ('bot', v_rounds, now() + (duel_cfg('duel_length_seconds', 1800) || ' seconds')::interval)
  returning id into v_match;

  insert into duel_match_players(match_id, seat, user_id, display_name, rating_before)
  select v_match, 1, v_me, coalesce(nullif(p.display_name,''), p.username), v_rating
    from profiles p where p.id = v_me;
  insert into duel_match_players(match_id, seat, user_id, is_bot, bot_rating, display_name, rating_before)
  values (v_match, 2, null, true, v_bot, '', v_bot);

  for v_row in select * from duel_pick_problems(((v_rating + v_bot) / 2)::int, v_me, v_me, v_rounds, true) loop
    insert into duel_rounds(match_id, round, problem_key, problem_rating, points)
    values (v_match, v_row.round, v_row.problem_key, v_row.problem_rating, v_row.points);
  end loop;

  update duel_matchmaking_sessions
     set status = 'duel_found', match_id = v_match, ended_at = now() where id = v_session.id;

  return jsonb_build_object('ok', true, 'duel_id', v_match, 'bot_rating', v_bot);
end $$;
