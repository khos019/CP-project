-- 028: duel history, a site-wide submission feed, and the reason a loss to the
-- bot said "Draw".
--
-- ---------------------------------------------------------------------------
-- 1. winner_seat.
--
-- duel_finish recorded the winner as `a.user_id` or `b.user_id`. The bot has no
-- account — that is deliberate, an account would put a fake row on the
-- leaderboard — so its user_id is null, and a match the bot won was stored with
-- winner_id null. That is byte for byte how a genuine draw is stored, and
-- duel_recent_result read `winner_id is null` as 'draw'. Players saw "Draw"
-- above a 100:500 scoreline and a -20 rating change.
--
-- The seat always exists, for a bot as much as for a person, so the seat is
-- what gets recorded. winner_id stays as it was: it still carries the profile
-- reference other queries join on.
-- ---------------------------------------------------------------------------
alter table public.duel_matches add column if not exists winner_seat int
  check (winner_seat is null or winner_seat in (1, 2));

comment on column public.duel_matches.winner_seat is
  'Seat that won, or null for a genuine draw. Unlike winner_id this is set even '
  'when the winner is the bot, which has no profile row.';

-- Backfill from the scores already recorded, so history predating this column
-- reads correctly rather than showing every bot win as a draw.
update public.duel_matches m set winner_seat = w.seat
  from (
    select p.match_id, p.seat
      from duel_match_players p
      join duel_match_players o
        on o.match_id = p.match_id and o.seat <> p.seat
     where p.score > o.score
  ) w
 where w.match_id = m.id and m.status = 'finished' and m.winner_seat is null;

create or replace function public.duel_finish(p_match uuid, p_reason text default 'time')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_match duel_matches; v_k numeric; v_rated boolean;
  a duel_match_players; b duel_match_players;
  v_expected numeric; v_actual numeric; v_delta int; v_winner uuid; v_seat int;
begin
  select * into v_match from duel_matches where id = p_match for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  if v_match.status <> 'active' then return jsonb_build_object('ok', true, 'already_finished', true); end if;

  select * into a from duel_match_players where match_id = p_match and seat = 1;
  select * into b from duel_match_players where match_id = p_match and seat = 2;

  -- Seat first, because it is the value that is always meaningful; the profile
  -- id is derived from it and stays null when the winner is the bot.
  v_seat := case when a.score > b.score then 1
                 when b.score > a.score then 2 else null end;
  v_winner := case v_seat when 1 then a.user_id when 2 then b.user_id else null end;

  v_k := duel_cfg('duel_k_factor', 32);
  v_rated := (v_match.mode = 'human') or duel_cfg_bool('bot_duels_affect_rating', true);

  if v_rated then
    -- Seat 1.
    v_expected := 1.0 / (1.0 + power(10.0, (b.rating_before - a.rating_before) / 400.0));
    v_actual   := case when a.score > b.score then 1.0 when a.score < b.score then 0.0 else 0.5 end;
    v_delta    := round(v_k * (v_actual - v_expected));
    update duel_match_players set rating_after = a.rating_before + v_delta, active = false
     where match_id = p_match and seat = 1;
    if a.user_id is not null then
      update profiles set duel_rating = greatest(0, a.rating_before + v_delta) where id = a.user_id;
    end if;

    -- Seat 2.
    v_expected := 1.0 / (1.0 + power(10.0, (a.rating_before - b.rating_before) / 400.0));
    v_actual   := case when b.score > a.score then 1.0 when b.score < a.score then 0.0 else 0.5 end;
    v_delta    := round(v_k * (v_actual - v_expected));
    update duel_match_players set rating_after = b.rating_before + v_delta, active = false
     where match_id = p_match and seat = 2;
    if b.user_id is not null then
      update profiles set duel_rating = greatest(0, b.rating_before + v_delta) where id = b.user_id;
    end if;
  else
    update duel_match_players set rating_after = rating_before, active = false where match_id = p_match;
  end if;

  update duel_matches
     set status = 'finished', finished_at = now(), winner_id = v_winner, winner_seat = v_seat
   where id = p_match;
  return jsonb_build_object('ok', true, 'winner_id', v_winner, 'winner_seat', v_seat,
                            'reason', p_reason, 'rated', v_rated);
end $$;

-- Same correction on the read side: the outcome is the viewer's seat against
-- the winning seat, which needs no account to be true.
create or replace function public.duel_recent_result()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := auth.uid(); r record; v_result jsonb;
begin
  if v_me is null then return null; end if;

  select m.id, m.mode, m.winner_id, m.winner_seat, m.started_at, m.finished_at, p.seat as my_seat into r
    from duel_matches m
    join duel_match_players p on p.match_id = m.id and p.user_id = v_me
   where m.status = 'finished' and m.finished_at > now() - interval '30 minutes'
   order by m.finished_at desc limit 1;
  if not found then return null; end if;

  select jsonb_build_object(
    'id', r.id, 'mode', r.mode, 'my_seat', r.my_seat,
    'winner_id', r.winner_id,
    'outcome', case when r.winner_seat is null then 'draw'
                    when r.winner_seat = r.my_seat then 'win' else 'loss' end,
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

-- ---------------------------------------------------------------------------
-- 2. Duel history.
--
-- Every duel this account has finished, newest first. idx_duel_player_history
-- has existed since 016 for exactly this read; nothing had ever used it,
-- because there was no way to look at a duel once its result toast expired
-- after thirty minutes.
-- ---------------------------------------------------------------------------
create or replace function public.duel_history(p_limit int default 40)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := auth.uid(); result jsonb;
begin
  if v_me is null then return '[]'::jsonb; end if;

  select coalesce(jsonb_agg(payload order by finished_at desc), '[]'::jsonb) into result
  from (
    select m.finished_at,
           jsonb_build_object(
             'id',        m.id,
             'mode',      m.mode,
             'rounds',    m.rounds,
             'my_seat',   me.seat,
             'my_score',  me.score,
             'opp_score', opp.score,
             'outcome',   case when m.winner_seat is null then 'draw'
                               when m.winner_seat = me.seat then 'win' else 'loss' end,
             'delta',     coalesce(me.rating_after, me.rating_before) - me.rating_before,
             'rating_after', coalesce(me.rating_after, me.rating_before),
             'opponent',  case when opp.is_bot then '' else opp.display_name end,
             'opponent_username', (select x.username from profiles x where x.id = opp.user_id),
             'opponent_is_bot',   opp.is_bot,
             'opponent_rating',   coalesce(opp.bot_rating, opp.rating_before),
             'started_at',  m.started_at,
             'finished_at', m.finished_at
           ) as payload
      from duel_match_players me
      join duel_matches m on m.id = me.match_id
      join duel_match_players opp on opp.match_id = m.id and opp.seat <> me.seat
     where me.user_id = v_me and m.status = 'finished'
     order by m.finished_at desc
     limit least(greatest(coalesce(p_limit, 40), 1), 200)
  ) x;
  return result;
end $$;

grant execute on function public.duel_history(int) to authenticated;

-- ---------------------------------------------------------------------------
-- 3. The site-wide submission feed.
--
-- bank_submissions is private to its author by RLS, and stays that way: this
-- returns everything about a submission except the source, exactly as
-- user_submissions has since 015, plus who wrote it. `readable` says whether
-- this particular viewer may open the code, so the list can draw a lock
-- without a request per row.
--
-- Anonymous callers get the feed too — it is the public pulse of the site —
-- but with readable false throughout, since nobody is signed in to have earned
-- or bought anything.
-- ---------------------------------------------------------------------------
create or replace function public.recent_submissions(p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare result jsonb; v_me uuid := auth.uid();
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
             'author_id',       p.id,
             'author_username', p.username,
             'author_name',     p.display_name,
             'author_avatar',   p.avatar_url,
             'is_me',           (v_me is not null and s.user_id = v_me),
             'readable',      (v_me is not null and (
                                 s.user_id = v_me
                                 or exists (select 1 from submission_unlocks u
                                             where u.viewer_id = v_me and u.submission_id = s.id)
                                 or has_solved(v_me, s.problem_key)))
           ) as payload
      from bank_submissions s
      join profiles p on p.id = s.user_id
     order by s.created_at desc
     limit least(greatest(coalesce(p_limit, 50), 1), 200)
  ) x;
  return result;
end $$;

grant execute on function public.recent_submissions(int) to anon, authenticated;
