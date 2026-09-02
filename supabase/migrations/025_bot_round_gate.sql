-- AlgoYo'l — one problem at a time, for the bot as well as the player.
--
-- The duel always claimed to hand out its problems one at a time: the steps
-- read "open" and "locked", and the next one was supposed to unlock when the
-- current one was claimed by either player. Nothing enforced it. The browser
-- would happily show a locked round's statement, and the bot worked its own
-- schedule regardless of which round was open — so it could claim C while A
-- was still untouched.
--
-- Enforcing the gate needs one fact this function did not return: WHEN a round
-- was claimed. The bot's schedule is now written relative to the moment its
-- round opens rather than to the duel's start, because the plan is written
-- before the duel begins and cannot know when the player will finish A.
--
-- Nothing else changes: same name, same shape, two extra fields.
--
-- Run AFTER 019. Safe to re-run.

create or replace function public.duel_bot_status(p_match uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_match duel_matches; v_bot duel_match_players;
begin
  select * into v_match from duel_matches where id = p_match;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  if v_match.mode <> 'bot' then return jsonb_build_object('ok', false, 'error', 'not_a_bot_duel'); end if;

  -- Either the player whose duel this is, or the server itself.
  if v_me is not null and not exists (
      select 1 from duel_match_players where match_id = p_match and user_id = v_me) then
    return jsonb_build_object('ok', false, 'error', 'not_a_player');
  end if;

  select * into v_bot from duel_match_players where match_id = p_match and is_bot;
  return jsonb_build_object(
    'ok', true,
    'status', v_match.status,
    'elapsed', extract(epoch from (now() - v_match.started_at)),
    'seat', v_bot.seat,
    'bot_rating', v_bot.bot_rating,
    'plan', v_bot.bot_plan,
    -- `claimed_elapsed` is seconds from the duel's start, in the same unit as
    -- `elapsed` above, so the runner never has to parse a timestamp or trust
    -- the Worker's own clock. A round opens when the one before it was claimed.
    'rounds', (select coalesce(jsonb_agg(jsonb_build_object(
                 'round', r.round, 'problem_key', r.problem_key,
                 'problem_rating', r.problem_rating, 'claimed_by_seat', r.claimed_by_seat,
                 'claimed_elapsed', case when r.claimed_at is null then null
                   else extract(epoch from (r.claimed_at - v_match.started_at)) end)
                 order by r.round), '[]'::jsonb)
               from duel_rounds r where r.match_id = p_match),
    -- How many attempts the bot has already made per round, so the runner is
    -- idempotent: two overlapping requests cannot make the same move twice.
    'done', (select coalesce(jsonb_object_agg(s.round::text, s.n), '{}'::jsonb)
             from (select round, count(*) as n from duel_submissions
                    where match_id = p_match and is_bot group by round) s));
end $$;
grant execute on function public.duel_bot_status(uuid) to authenticated;
