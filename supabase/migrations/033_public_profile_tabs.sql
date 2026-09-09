-- 033: what a profile page shows about somebody else.
--
-- Until now /u/<handle> could show the header and a link to that person's
-- submissions, and nothing else: their duels and their friends were readable
-- only by themselves. duel_history() takes no argument and answers for
-- auth.uid(); friends is RLS-restricted to its owner. So a profile was a name
-- and a number, and the interesting part of an account -- who it plays, how it
-- is doing, whom it follows -- was invisible from outside.
--
-- Two security-definer reads fix that, one per tab, both granted to anon so a
-- profile link works before signing in.
--
-- On the friends read, a deliberate asymmetry, kept from 015: this returns the
-- people an account *follows*, never the people who follow it. 015's rule that
-- "nobody can see who has added them" is what keeps the star from becoming a
-- popularity number people play for, and that rule still holds -- a follow is
-- a bookmark you made, and a bookmark is a thing you can be seen to have made.
--
-- ---------------------------------------------------------------------------
-- 1. One account's finished duels, for anybody to read.
--
-- Same shape as duel_history() so one client type describes both, plus
-- rating_before -- the graph needs the point the account started a duel from,
-- not only where it landed, or the first duel in the list would have no left
-- end. `my_seat`/`my_score` are read as "the seat of the account being looked
-- at", which is what they already mean; the viewer does not appear at all.
-- ---------------------------------------------------------------------------
create or replace function public.public_duel_history(p_user uuid, p_limit int default 60)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare result jsonb;
begin
  if p_user is null then return '[]'::jsonb; end if;

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
             'rating_before', me.rating_before,
             'rating_after',  coalesce(me.rating_after, me.rating_before),
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
     where me.user_id = p_user and m.status = 'finished'
     order by m.finished_at desc
     limit least(greatest(coalesce(p_limit, 60), 1), 200)
  ) x;
  return result;
end $$;

grant execute on function public.public_duel_history(uuid, int) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. The people one account follows.
--
-- Only what a profile is already public about comes back -- handle, name,
-- avatar, rating, solves -- so the list can be rendered with the same row as
-- the owner's own friends screen, and following somebody discloses nothing
-- about them that their own profile page does not already show.
-- ---------------------------------------------------------------------------
create or replace function public.public_friends(p_user uuid, p_limit int default 200)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare result jsonb;
begin
  if p_user is null then return '[]'::jsonb; end if;

  select coalesce(jsonb_agg(payload order by since desc), '[]'::jsonb) into result
  from (
    select f.created_at as since,
           jsonb_build_object(
             'id',            p.id,
             'username',      p.username,
             'display_name',  p.display_name,
             'avatar_url',    p.avatar_url,
             'duel_rating',   p.duel_rating,
             'solved_count',  p.solved_count,
             'since',         f.created_at
           ) as payload
      from friends f
      join profiles p on p.id = f.friend_id
     where f.user_id = p_user
     order by f.created_at desc
     limit least(greatest(coalesce(p_limit, 200), 1), 500)
  ) x;
  return result;
end $$;

grant execute on function public.public_friends(uuid, int) to anon, authenticated;
