-- 051: duel rating changes scale with how the duel was won, and K goes 40 → 48.
--
-- Who you beat already matters: the Elo expectation compares the two ratings
-- before the duel, so beating a stronger player pays more and losing to a
-- weaker one costs more. What did not matter was HOW: a 600:0 sweep and a
-- 100:0 scrape moved the rating by exactly the same amount.
--
-- Now the Elo delta is multiplied by a performance factor taken from the
-- score margin, as a share of all the points the duel offered:
--
--     margin = |score_1 - score_2| / total_points        (0 … 1)
--     factor = perf_min + (perf_max - perf_min) * margin  (0.7 … 1.3)
--
-- Both seats get the same factor, so a human duel stays zero-sum: a crushing
-- win takes more from the loser, a close loss costs the loser less. With round
-- points 100/200/300 and equal ratings, a win is worth:
--
--     600:0  +31      500:100  +26      400:200  +22      100:0  +19
--
-- (it was a flat +20 under K = 40). A forfeit hands every open round to the
-- other seat, so it lands near the top of the margin scale — walking out is
-- never the cheap way to lose.

insert into duel_config(key, value, note) values
  ('duel_k_factor', '48'::jsonb,  'Elo K for duel rating changes'),
  ('duel_perf_min', '0.7'::jsonb, 'rating factor for a duel won by the narrowest margin (or drawn)'),
  ('duel_perf_max', '1.3'::jsonb, 'rating factor for a duel won by every point on offer')
on conflict (key) do update set value = excluded.value, note = excluded.note, updated_at = now();

create or replace function public.duel_finish(p_match uuid, p_reason text default 'time')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_match duel_matches; v_k numeric; v_rated boolean;
  a duel_match_players; b duel_match_players;
  v_expected numeric; v_actual numeric; v_delta int; v_winner uuid; v_seat int;
  v_total numeric; v_margin numeric; v_factor numeric;
begin
  select * into v_match from duel_matches where id = p_match for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  if v_match.status <> 'active' then return jsonb_build_object('ok', true, 'already_finished', true); end if;

  select * into a from duel_match_players where match_id = p_match and seat = 1;
  select * into b from duel_match_players where match_id = p_match and seat = 2;

  v_seat := case when a.score > b.score then 1
                 when b.score > a.score then 2 else null end;
  v_winner := case v_seat when 1 then a.user_id when 2 then b.user_id else null end;

  v_k := duel_cfg('duel_k_factor', 48);
  v_rated := (v_match.mode = 'human') or duel_cfg_bool('bot_duels_affect_rating', true);

  -- Every point the duel offered, claimed or not. A duel with no rounds (it
  -- should not exist) falls back to the plain Elo delta rather than dividing
  -- by zero.
  select coalesce(sum(points), 0) into v_total from duel_rounds where match_id = p_match;
  v_margin := case when v_total > 0
                   then least(1.0, abs(coalesce(a.score, 0) - coalesce(b.score, 0)) / v_total)
                   else 0.5 end;
  v_factor := duel_cfg('duel_perf_min', 0.7)
            + (duel_cfg('duel_perf_max', 1.3) - duel_cfg('duel_perf_min', 0.7)) * v_margin;

  if v_rated then
    -- Seat 1.
    v_expected := 1.0 / (1.0 + power(10.0, (b.rating_before - a.rating_before) / 400.0));
    v_actual   := case when a.score > b.score then 1.0 when a.score < b.score then 0.0 else 0.5 end;
    v_delta    := round(v_k * v_factor * (v_actual - v_expected));
    update duel_match_players set rating_after = a.rating_before + v_delta, active = false
     where match_id = p_match and seat = 1;
    if a.user_id is not null then
      update profiles set duel_rating = greatest(0, a.rating_before + v_delta) where id = a.user_id;
    end if;

    -- Seat 2.
    v_expected := 1.0 / (1.0 + power(10.0, (a.rating_before - b.rating_before) / 400.0));
    v_actual   := case when b.score > a.score then 1.0 when b.score < a.score then 0.0 else 0.5 end;
    v_delta    := round(v_k * v_factor * (v_actual - v_expected));
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
                            'reason', p_reason, 'rated', v_rated, 'performance', round(v_factor, 2));
end $$;
