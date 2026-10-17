-- 060: ending a duel by agreement, like a draw offer in chess.
--
-- In a duel between two people (a rated human duel or a friend duel — never
-- against the bot) either player may offer to end it. The other sees the offer
-- and accepts or declines. Accepted, the duel finishes on the scores as they
-- stand: more points wins, equal points is a draw, rated exactly as a duel
-- that ran out of time (duel_finish with reason 'agreed').
--
-- Declined, the player who offered may not offer again for two minutes
-- (end_offer_cooldown_seconds), so an offer cannot be used to pester. Offering
-- while the other player's offer stands is accepting it, as in chess.
--
-- An offer lapses when the score changes: one made at 0 : 0 must not be
-- accepted after the other player has solved a round, turning "let us stop
-- here" into a loss its author never offered. A round claimed after the offer
-- voids it; it disappears from the state and cannot be accepted.
--
-- duel_state is redefined (from 016) only to carry `end_offer` and
-- `end_blocked_until`; nothing else in it changes.
--
-- Run AFTER 001-059. Safe to re-run.

alter table public.duel_matches
  add column if not exists end_offer_seat int,
  add column if not exists end_offer_at   timestamptz,
  add column if not exists end_blocks     jsonb not null default '{}'::jsonb;

insert into public.duel_config(key, value, note) values
  ('end_offer_cooldown_seconds', '120'::jsonb, 'after a declined offer to end a duel, its author waits this long')
on conflict (key) do nothing;

-- The offer stands: someone made it, and no round was claimed since.
create or replace function public.duel_end_offer_valid(m public.duel_matches)
returns boolean language sql stable security definer set search_path = public as $$
  select m.end_offer_seat is not null and m.status::text = 'active'
     and not exists (select 1 from duel_rounds r where r.match_id = m.id
                      and r.claimed_at is not null and r.claimed_at >= m.end_offer_at)
$$;

-- p_action: 'offer' | 'accept' | 'decline' | 'cancel'.
-- Returns {ok, finished?} or {ok:false, error}. Errors: not_authenticated,
-- not_a_player, not_active, bot_duel, cooldown (with until), no_offer.
create or replace function public.duel_end_offer(p_match uuid, p_action text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me uuid := auth.uid();
  v_seat int;
  m duel_matches;
  v_until timestamptz;
  v_valid boolean;
  v_done jsonb;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;
  if p_action not in ('offer', 'accept', 'decline', 'cancel') then return jsonb_build_object('ok', false, 'error', 'bad_action'); end if;
  select seat into v_seat from duel_match_players where match_id = p_match and user_id = v_me;
  if v_seat is null then return jsonb_build_object('ok', false, 'error', 'not_a_player'); end if;
  select * into m from duel_matches where id = p_match for update;
  if m.status::text <> 'active' then return jsonb_build_object('ok', false, 'error', 'not_active'); end if;
  if m.mode = 'bot' then return jsonb_build_object('ok', false, 'error', 'bot_duel'); end if;
  v_valid := duel_end_offer_valid(m);

  if p_action = 'offer' then
    -- The other player already offered: offering back is agreeing.
    if v_valid and m.end_offer_seat <> v_seat then p_action := 'accept';
    elsif v_valid and m.end_offer_seat = v_seat then return jsonb_build_object('ok', true);
    else
      v_until := nullif(m.end_blocks ->> v_seat::text, '')::timestamptz;
      if v_until is not null and v_until > now() then
        return jsonb_build_object('ok', false, 'error', 'cooldown', 'until', v_until);
      end if;
      update duel_matches set end_offer_seat = v_seat, end_offer_at = now() where id = p_match;
      return jsonb_build_object('ok', true);
    end if;
  end if;

  if p_action = 'cancel' then
    if v_valid and m.end_offer_seat = v_seat then
      update duel_matches set end_offer_seat = null, end_offer_at = null where id = p_match;
    end if;
    return jsonb_build_object('ok', true);
  end if;

  -- accept / decline answer the other player's standing offer.
  if not v_valid or m.end_offer_seat = v_seat then return jsonb_build_object('ok', false, 'error', 'no_offer'); end if;

  if p_action = 'decline' then
    update duel_matches
       set end_offer_seat = null, end_offer_at = null,
           end_blocks = end_blocks || jsonb_build_object(m.end_offer_seat::text,
             now() + (duel_cfg('end_offer_cooldown_seconds', 120) || ' seconds')::interval)
     where id = p_match;
    return jsonb_build_object('ok', true);
  end if;

  update duel_matches set end_offer_seat = null, end_offer_at = null where id = p_match;
  v_done := duel_finish(p_match, 'agreed');
  return jsonb_build_object('ok', true, 'finished', true, 'winner_id', v_done -> 'winner_id');
end $$;
revoke all on function public.duel_end_offer(uuid, text) from public;
grant execute on function public.duel_end_offer(uuid, text) to authenticated;

create or replace function public.duel_state()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_me uuid := auth.uid(); v_session jsonb; v_challenge jsonb; v_match jsonb; v_match_id uuid; v_seat int;
begin
  if v_me is null then return jsonb_build_object('status', 'idle'); end if;

  select jsonb_build_object('id', s.id, 'status', s.status, 'rating', s.rating,
                            'created_at', s.created_at, 'expires_at', s.expires_at, 'match_id', s.match_id)
    into v_session from duel_matchmaking_sessions s
   where s.user_id = v_me and s.status in ('searching','challenge_sent')
   order by s.created_at desc limit 1;

  -- An incoming challenge, with just enough of the challenger to render the
  -- card: who they are and how strong. Nothing else travels.
  select jsonb_build_object('id', c.id, 'expires_at', c.expires_at, 'created_at', c.created_at,
           'from', jsonb_build_object('id', p.id, 'username', p.username,
                     'display_name', p.display_name, 'avatar_url', p.avatar_url,
                     'duel_rating', p.duel_rating))
    into v_challenge
    from duel_challenges c join profiles p on p.id = c.sender_id
   where c.receiver_id = v_me and c.status = 'pending' and c.expires_at > now()
   order by c.expires_at asc limit 1;

  select mp.match_id, mp.seat into v_match_id, v_seat
    from duel_match_players mp where mp.user_id = v_me and mp.active limit 1;

  if v_match_id is not null then
    select jsonb_build_object(
      'id', m.id, 'mode', m.mode, 'status', m.status, 'rounds', m.rounds,
      'started_at', m.started_at, 'ends_at', m.ends_at, 'my_seat', v_seat,
      'players', (select jsonb_agg(jsonb_build_object(
                    'seat', pl.seat, 'is_bot', pl.is_bot, 'score', pl.score,
                    'rating', coalesce(pl.bot_rating, pl.rating_before),
                    'display_name', case when pl.is_bot then '' else pl.display_name end,
                    'username', (select x.username from profiles x where x.id = pl.user_id),
                    'avatar_url', (select x.avatar_url from profiles x where x.id = pl.user_id))
                    order by pl.seat)
                  from duel_match_players pl where pl.match_id = m.id),
      'rounds_detail', (select jsonb_agg(jsonb_build_object(
                    'round', r.round, 'problem_key', r.problem_key, 'points', r.points,
                    'claimed_by_seat', r.claimed_by_seat, 'claimed_at', r.claimed_at)
                    order by r.round)
                  from duel_rounds r where r.match_id = m.id),
      'my_submissions', (select coalesce(jsonb_agg(jsonb_build_object(
                    'round', s.round, 'verdict', s.verdict, 'created_at', s.created_at) order by s.created_at), '[]'::jsonb)
                  from duel_submissions s where s.match_id = m.id and s.seat = v_seat),
      'opponent_activity', (select coalesce(jsonb_agg(jsonb_build_object(
                    'round', s.round, 'verdict', s.verdict, 'created_at', s.created_at) order by s.created_at), '[]'::jsonb)
                  from duel_submissions s where s.match_id = m.id and s.seat <> v_seat),
      -- 060: an offer to end the duel by agreement, while it still stands.
      'end_offer', case when duel_end_offer_valid(m) then jsonb_build_object(
                    'seat', m.end_offer_seat, 'at', m.end_offer_at) end,
      'end_blocked_until', nullif(m.end_blocks ->> v_seat::text, '')::timestamptz)
      into v_match from duel_matches m where m.id = v_match_id;
  end if;

  return jsonb_build_object(
    'status', case when v_match is not null then 'duel_active'
                   when v_session is not null then (v_session ->> 'status')
                   else 'idle' end,
    'session', v_session, 'challenge', v_challenge, 'duel', v_match, 'now', now());
end $$;
