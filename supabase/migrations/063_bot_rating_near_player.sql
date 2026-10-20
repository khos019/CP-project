-- 063: the bot's rating stays within ±50 of the player's duel rating.
--
-- Until now the bot was rated from duel_player_strength (solved problems),
-- capped at bot_max_rating (2000). A player whose duel rating had climbed past
-- that strength met bots 100-300 below: Jahonali at 1758 got a 1697 bot, at
-- 1747 a 1593 one. Elo then paid little for a win and charged a lot for a loss.
--
--   bot_rating_window (50) — the bot's rating is the player's duel rating
--                  ± this, drawn per duel. The top-N players keep their bot
--                  at +30..+50 above them (061), now counted from their duel
--                  rating as well.
--
-- Problem choice and the bot's solving skill are unchanged (still v_bot).
-- duel_start_bot_match is the function from 061 with only that block changed.
-- Run AFTER 001-062. Safe to re-run.

insert into public.duel_config(key, value, note) values
  ('bot_rating_window', '50'::jsonb, 'bot rating = player duel rating ± this')
on conflict (key) do nothing;

create or replace function public.duel_start_bot_match()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me uuid := auth.uid(); v_session duel_matchmaking_sessions;
  v_match uuid; v_rating int; v_strength jsonb; v_bot int; v_jitter int;
  v_rounds int; v_row record; v_rank int; v_top boolean := false; v_play int; v_skill int;
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

  select coalesce(duel_rating, 1200) into v_rating from profiles where id = v_me;
  -- Everything the account knows about this person, not just their duel record.
  v_strength := duel_player_strength(v_me);
  v_jitter := duel_cfg('bot_rating_jitter', 40);
  v_bot := greatest(duel_cfg('bot_min_rating', 800)::int,
           least(duel_cfg('bot_max_rating', 2000)::int,
             (v_strength ->> 'strength')::int + (floor(random() * (2 * v_jitter + 1)) - v_jitter)::int));

  -- 061: the leaderboard's top players get a stronger bot. Their place is counted
  -- among real accounts (the seeded contest-archive accounts are not players).
  select count(*) + 1 into v_rank from profiles p
   where p.duel_rating > v_rating
     and not exists (select 1 from bot_accounts b where b.user_id = p.id);
  v_top := v_rank <= duel_cfg('bot_top_n', 4);
  -- v_bot picks the problems, v_play is the bot's rating, v_skill how well it
  -- solves. The top players get the usual problems and a better solver.
  -- 063: the bot's rating is drawn around the player's DUEL rating (± bot_rating_window),
  -- not around v_bot: v_bot follows solved problems and sat 100-300 below
  -- players whose duel rating had climbed, so every loss cost a lot and every
  -- win paid little. v_bot still picks the problems and how well the bot solves.
  v_play := greatest(0, v_rating + (floor(random() * (2 * duel_cfg('bot_rating_window', 50) + 1))
                                    - duel_cfg('bot_rating_window', 50))::int);
  v_skill := v_bot;
  if v_top then
    v_play  := v_rating + duel_cfg('bot_top_rating_min', 30)::int
             + floor(random() * (duel_cfg('bot_top_rating_max', 50) - duel_cfg('bot_top_rating_min', 30) + 1))::int;
    v_skill := v_bot + duel_cfg('bot_top_skill', 75)::int;
  end if;
  v_rounds := duel_cfg('duel_rounds', 3);

  insert into duel_matches(mode, rounds, ends_at)
  values ('bot', v_rounds, now() + (duel_cfg('duel_length_seconds', 1800) || ' seconds')::interval)
  returning id into v_match;

  insert into duel_match_players(match_id, seat, user_id, display_name, rating_before)
  select v_match, 1, v_me, coalesce(nullif(p.display_name,''), p.username), v_rating
    from profiles p where p.id = v_me;
  insert into duel_match_players(match_id, seat, user_id, is_bot, bot_rating, display_name, rating_before)
  values (v_match, 2, null, true, v_play, '', v_play);

  -- Problems are chosen for the bot's level, which is now the player's real
  -- level rather than a duel_rating that may never have moved.
  for v_row in select * from duel_pick_problems(v_bot, v_me, v_me, v_rounds, true) loop
    insert into duel_rounds(match_id, round, problem_key, problem_rating, points)
    values (v_match, v_row.round, v_row.problem_key, v_row.problem_rating, v_row.points);
  end loop;

  update duel_matchmaking_sessions
     set status = 'duel_found', match_id = v_match, ended_at = now() where id = v_session.id;

  return jsonb_build_object('ok', true, 'duel_id', v_match, 'bot_rating', v_play,
                            'bot_base', v_bot, 'bot_skill', v_skill, 'strength', v_strength, 'top', v_top);
end $$;
