-- AlgoYo'l — how strong is this learner, really, and who do they play.
--
-- Three changes, and the first one is a bug.
--
-- 1. TWO PEOPLE SEARCHING NEVER MET.
--
--    duel_tick() excluded anybody who already had a live matchmaking session,
--    on the reasoning that a person mid-search should not be interrupted. But
--    somebody who has pressed "find opponent" is the *best* possible match:
--    they are not being interrupted, they are waiting. So two learners could
--    sit in the same rating band, both searching, and both eventually get a
--    bot. Now they are paired on the spot, with no challenge card at all —
--    there is nothing to accept when both have already said yes.
--
-- 2. A CHALLENGE NOW LASTS SEVEN SECONDS, not five. Still enforced by the
--    server; the client's ring is still only a ring.
--
-- 3. THE BOT'S STRENGTH IS ESTIMATED FROM EVERYTHING THE ACCOUNT KNOWS,
--    not from duel_rating alone.
--
--    duel_rating answers "how have their duels gone". For most accounts here
--    that is 1200 and no games, which says nothing at all. Two other records
--    say a great deal:
--
--      bank_submissions — the difficulty of problems they have actually
--                         solved. A ceiling, measured rather than claimed.
--      unit_progress    — how far through the roadmap they have come, and
--                         which tracks, each of which carries a rating band.
--
--    Each signal is mapped onto the same 800-2400 scale and blended by how
--    much evidence stands behind it, so a brand-new account leans on the
--    default and a heavy solver leans on their solves. The details are in
--    duel_player_strength() below.
--
-- Run AFTER 019. Safe to re-run.

-- ---------------------------------------------------------------------------
-- 0. Seven seconds.
-- ---------------------------------------------------------------------------
update public.duel_config set value = '7'::jsonb, updated_at = now()
 where key = 'challenge_ttl_seconds';

insert into public.duel_config(key, value, note) values
  ('strength_prior_weight',  '0.5'::jsonb,  'pull toward 1200 for accounts with no evidence'),
  ('strength_duel_k',        '5'::jsonb,    'rated duels before duel_rating is trusted'),
  ('strength_solve_k',       '8'::jsonb,    'solves before the solved ceiling is trusted'),
  ('strength_learn_k',       '15'::jsonb,   'units before roadmap progress is trusted'),
  ('strength_solve_percent', '0.75'::jsonb, 'percentile of solved ratings taken as the ceiling'),
  ('strength_solve_headroom','60'::jsonb,   'a solver can usually reach a little past their best'),
  ('bot_min_rating',         '800'::jsonb,  'the floor the problem bank can express'),
  ('bot_max_rating',        '2000'::jsonb,  'the ceiling the problem bank can express')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- 1. Roadmap bands.
--
-- Each track advertises the rating range it takes a learner through — the same
-- "900 → 1900" the roadmap page shows. Finishing units inside a track is
-- therefore evidence about a rating, not just a count of clicks, and this is
-- the table that turns one into the other.
--
-- Mirrored from app/ui/roadmap-data.ts. If a track's band changes there, it
-- changes here; nothing computes it from the other.
-- ---------------------------------------------------------------------------
create table if not exists public.roadmap_bands (
  slug text primary key,
  low  int not null,
  high int not null
);
alter table public.roadmap_bands enable row level security;
drop policy if exists "bands are public" on public.roadmap_bands;
create policy "bands are public" on public.roadmap_bands for select using (true);

insert into public.roadmap_bands(slug, low, high) values
  ('programming-basics', 0, 900),
  ('foundations', 800, 1300),
  ('sorting', 800, 1500),
  ('backtracking', 900, 1900),
  ('math', 900, 2100),
  ('data-structures', 1000, 2100),
  ('binary-search', 900, 1900),
  ('greedy', 1000, 1900),
  ('graphs', 1000, 2300),
  ('strings', 1000, 2200),
  ('geometry', 1400, 2500),
  ('two-pointers', 900, 1800),
  ('dynamic-programming', 1100, 2400),
  ('trees', 1100, 2400),
  ('advanced-cp', 1900, 3000)
on conflict (slug) do update set low = excluded.low, high = excluded.high;

-- ---------------------------------------------------------------------------
-- 2. The strength estimate — the bot's brain.
--
-- Returns the three component ratings, the confidence in each, and the blend.
-- Exposed as jsonb rather than a bare number so the model can be tuned against
-- what it actually saw rather than against a single figure with no provenance.
--
--   R_duel  = profiles.duel_rating
--             confidence = duels / (duels + strength_duel_k)
--
--   R_solve = the 75th percentile of the ratings of the distinct problems this
--             account has an ACCEPTED submission for, plus a little headroom.
--             A percentile rather than a maximum, so one lucky hard solve does
--             not define somebody, and a maximum rather than a mean, so a
--             hundred easy solves do not drag a strong player down.
--             confidence = solves / (solves + strength_solve_k)
--
--   R_learn = for every unit finished (quiz passed AND problem solved), the
--             point inside its track's band that the unit sits at: unit 1 of
--             15 is at the low end, unit 15 at the high end. Averaged over the
--             learner's best tracks.
--             confidence = units / (units + strength_learn_k)
--
-- Blended with a prior at 1200 so an account with no evidence lands on the
-- platform default instead of dividing by zero.
-- ---------------------------------------------------------------------------
create or replace function public.duel_player_strength(p_user uuid default auth.uid())
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_prior     numeric := duel_cfg('strength_prior_weight', 0.5);
  v_duel_k    numeric := duel_cfg('strength_duel_k', 5);
  v_solve_k   numeric := duel_cfg('strength_solve_k', 8);
  v_learn_k   numeric := duel_cfg('strength_learn_k', 15);
  v_pct       numeric := duel_cfg('strength_solve_percent', 0.75);
  v_headroom  numeric := duel_cfg('strength_solve_headroom', 60);
  v_lo        int := duel_cfg('bot_min_rating', 800);
  v_hi        int := duel_cfg('bot_max_rating', 2000);

  v_duel_rating int;
  v_duels       int;
  v_solves      int;
  v_solve_rating numeric;
  v_units       int;
  v_learn_rating numeric;
  w_duel numeric; w_solve numeric; w_learn numeric;
  v_blend numeric;
begin
  if p_user is null then
    return jsonb_build_object('strength', 1200, 'reason', 'anonymous');
  end if;

  select coalesce(duel_rating, 1200) into v_duel_rating from profiles where id = p_user;
  v_duel_rating := coalesce(v_duel_rating, 1200);

  select count(*)::int into v_duels
    from duel_match_players p join duel_matches m on m.id = p.match_id
   where p.user_id = p_user and m.status = 'finished';

  -- The solved ceiling. Distinct problems only: submitting the same solve
  -- twice is not more evidence.
  select count(*)::int,
         percentile_cont(v_pct) within group (order by pool.rating)
    into v_solves, v_solve_rating
    from (select distinct b.problem_key from bank_submissions b
           where b.user_id = p_user and b.verdict = 'ACCEPTED') solved
    join duel_problem_pool pool on pool.problem_key = solved.problem_key;

  -- Roadmap evidence. A unit counts once the quiz is passed and the problem is
  -- solved — the same bar RoadmapExperience uses to call a unit complete.
  -- Its position inside the track decides where in the band it lands.
  select count(*)::int,
         avg(b.low + (b.high - b.low) *
             least(1.0, greatest(0.0, (split_part(u.unit_slug, '-', -1))::numeric / 15.0)))
    into v_units, v_learn_rating
    from unit_progress u
    join roadmap_bands b
      on u.unit_slug like b.slug || '-%'
   where u.user_id = p_user and u.quiz_score >= 70 and u.solved
     and split_part(u.unit_slug, '-', -1) ~ '^[0-9]+$';

  w_duel  := case when v_duels  > 0 then v_duels ::numeric / (v_duels  + v_duel_k)  else 0 end;
  w_solve := case when v_solves > 0 then v_solves::numeric / (v_solves + v_solve_k) else 0 end;
  w_learn := case when v_units  > 0 then v_units ::numeric / (v_units  + v_learn_k) else 0 end;

  v_blend := (
      w_duel  * v_duel_rating
    + w_solve * coalesce(v_solve_rating + v_headroom, 0)
    + w_learn * coalesce(v_learn_rating, 0)
    + v_prior * 1200
  ) / nullif(w_duel + w_solve + w_learn + v_prior, 0);

  return jsonb_build_object(
    'strength', greatest(v_lo, least(v_hi, round(coalesce(v_blend, 1200))))::int,
    'duel',  jsonb_build_object('rating', v_duel_rating, 'count', v_duels, 'weight', round(w_duel, 3)),
    'solve', jsonb_build_object('rating', round(coalesce(v_solve_rating + v_headroom, 0)), 'count', v_solves, 'weight', round(w_solve, 3)),
    'learn', jsonb_build_object('rating', round(coalesce(v_learn_rating, 0)), 'count', v_units, 'weight', round(w_learn, 3)));
end $$;
grant execute on function public.duel_player_strength(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Pair two searchers directly, and only then fall back to challenges.
--
-- Locking: both session rows are taken with `for update` in id order, always.
-- Two ticks racing to pair the same pair therefore queue behind each other
-- rather than deadlocking, and the loser finds the other session already
-- 'duel_found' and does nothing.
-- ---------------------------------------------------------------------------
create or replace function public.duel_try_pair(p_session uuid, p_radius int)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_mine duel_matchmaking_sessions; v_other duel_matchmaking_sessions;
  v_first uuid; v_second uuid; v_match uuid; v_target int; v_rounds int; v_row record;
begin
  select * into v_mine from duel_matchmaking_sessions where id = p_session;
  if not found or v_mine.status <> 'searching' then return null; end if;

  -- The nearest other searcher inside the radius, oldest first so nobody
  -- waits behind a queue of newcomers.
  select s.* into v_other
    from duel_matchmaking_sessions s
    join profiles p on p.id = s.user_id
    join user_presence pr on pr.user_id = s.user_id
   where s.id <> v_mine.id
     and s.status = 'searching'
     and s.user_id <> v_mine.user_id
     and abs(s.rating - v_mine.rating) <= p_radius
     and pr.last_seen_at > now() - (duel_cfg('presence_window_seconds', 45) || ' seconds')::interval
     and p.suspended_at is null
     and not exists (select 1 from duel_match_players mp where mp.user_id = s.user_id and mp.active)
     and not exists (select 1 from message_blocks b
                      where (b.blocker_id = s.user_id and b.blocked_id = v_mine.user_id)
                         or (b.blocker_id = v_mine.user_id and b.blocked_id = s.user_id))
   order by abs(s.rating - v_mine.rating), s.created_at
   limit 1;
  if not found then return null; end if;

  -- Deterministic lock order.
  v_first  := least(v_mine.id, v_other.id);
  v_second := greatest(v_mine.id, v_other.id);
  perform 1 from duel_matchmaking_sessions where id = v_first  for update;
  perform 1 from duel_matchmaking_sessions where id = v_second for update;

  -- Re-read under the lock: anything could have happened while we queued.
  select * into v_mine  from duel_matchmaking_sessions where id = v_mine.id;
  select * into v_other from duel_matchmaking_sessions where id = v_other.id;
  if v_mine.status <> 'searching' or v_other.status <> 'searching' then return null; end if;
  if exists (select 1 from duel_match_players
              where user_id in (v_mine.user_id, v_other.user_id) and active) then
    return null;
  end if;

  v_target := ((v_mine.rating + v_other.rating) / 2)::int;
  v_rounds := duel_cfg('duel_rounds', 3);

  insert into duel_matches(mode, rounds, ends_at)
  values ('human', v_rounds, now() + (duel_cfg('duel_length_seconds', 1800) || ' seconds')::interval)
  returning id into v_match;

  insert into duel_match_players(match_id, seat, user_id, display_name, rating_before)
  select v_match, 1, v_other.user_id, coalesce(nullif(p.display_name,''), p.username), v_other.rating
    from profiles p where p.id = v_other.user_id;
  insert into duel_match_players(match_id, seat, user_id, display_name, rating_before)
  select v_match, 2, v_mine.user_id, coalesce(nullif(p.display_name,''), p.username), v_mine.rating
    from profiles p where p.id = v_mine.user_id;

  for v_row in select * from duel_pick_problems(v_target, v_mine.user_id, v_other.user_id, v_rounds, false) loop
    insert into duel_rounds(match_id, round, problem_key, problem_rating, points)
    values (v_match, v_row.round, v_row.problem_key, v_row.problem_rating, v_row.points);
  end loop;

  -- Any cards either of them had out are void: they are both in a duel now.
  update duel_challenges set status = 'cancelled', responded_at = now()
   where status = 'pending'
     and (session_id in (v_mine.id, v_other.id)
       or receiver_id in (v_mine.user_id, v_other.user_id));

  update duel_matchmaking_sessions
     set status = 'duel_found', match_id = v_match, ended_at = now()
   where id in (v_mine.id, v_other.id);

  -- The caller's tick returns this so the route can announce the match to the
  -- other player as well; their own tick would find it a second later anyway,
  -- but a second is a long time when you are staring at a spinner.
  return v_match;
end $$;
revoke all on function public.duel_try_pair(uuid, int) from public;

-- ---------------------------------------------------------------------------
-- 4. The tick, with pairing first.
--
-- Order matters and is the product decision the whole feature turns on:
-- somebody who is already searching beats somebody who has to be interrupted,
-- and a human beats a bot. So each tick asks, in order — is anyone else
-- waiting? then, who can I ask? then, has the human window closed?
-- ---------------------------------------------------------------------------
create or replace function public.duel_tick()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me       uuid := auth.uid();
  v_session  duel_matchmaking_sessions;
  v_elapsed  numeric;
  v_radius   int;
  v_fanout   int;
  v_window   interval;
  v_created  jsonb := '[]'::jsonb;
  v_ttl      int;
  v_row      record;
  v_new_id   uuid;
  v_new_expiry timestamptz;
  v_paired   uuid;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;
  perform duel_sweep();

  select * into v_session from duel_matchmaking_sessions
   where user_id = v_me and status in ('searching','challenge_sent') limit 1;
  if not found then
    return jsonb_build_object('ok', true, 'searching', false, 'state', duel_state());
  end if;

  insert into user_presence(user_id, last_seen_at) values (v_me, now())
  on conflict (user_id) do update set last_seen_at = now();

  v_elapsed := extract(epoch from (now() - v_session.created_at));
  v_radius  := least(
      duel_cfg('initial_rating_range', 100)
        + floor(v_elapsed / greatest(duel_cfg('rating_range_interval', 2), 1)) * duel_cfg('rating_range_step', 100),
      duel_cfg('max_rating_range', 400));

  -- (a) Somebody else is already waiting. No card, no five seconds, no
  --     decision to make — they pressed the button too.
  if v_session.status = 'searching' then
    v_paired := duel_try_pair(v_session.id, v_radius);
    if v_paired is not null then
      return jsonb_build_object('ok', true, 'searching', false, 'paired', true,
        'duel_id', v_paired,
        'opponent_id', (select mp.user_id from duel_match_players mp
                         where mp.match_id = v_paired and mp.user_id <> v_me limit 1),
        'state', duel_state());
    end if;
  end if;

  -- (b) Cards are already out; let them run their seven seconds.
  if v_session.status = 'challenge_sent' then
    return jsonb_build_object('ok', true, 'searching', true, 'waiting_on_challenge', true,
                              'radius', v_radius, 'elapsed', round(v_elapsed)::int,
                              'state', duel_state());
  end if;

  v_fanout  := duel_cfg('challenge_fanout', 3);
  v_ttl     := duel_cfg('challenge_ttl_seconds', 7);
  v_window  := (duel_cfg('presence_window_seconds', 45) || ' seconds')::interval;

  -- (c) Everyone online, in range, free, and not already asked by this search.
  --     People who are themselves searching are handled above, so they are
  --     excluded here rather than being sent a card they never needed.
  for v_row in
    select p.id, abs(p.duel_rating - v_session.rating) as gap
      from profiles p
      join user_presence pr on pr.user_id = p.id
     where p.id <> v_me
       and pr.duel_ready
       and pr.last_seen_at > now() - v_window
       and abs(p.duel_rating - v_session.rating) <= v_radius
       and p.suspended_at is null
       and not exists (select 1 from duel_match_players mp where mp.user_id = p.id and mp.active)
       and not exists (select 1 from duel_matchmaking_sessions s2
                        where s2.user_id = p.id and s2.status in ('searching','challenge_sent'))
       and not exists (select 1 from duel_challenges c
                        where c.receiver_id = p.id and c.status = 'pending')
       and not exists (select 1 from duel_challenges c
                        where c.session_id = v_session.id and c.receiver_id = p.id)
       and not exists (select 1 from message_blocks b
                        where (b.blocker_id = p.id and b.blocked_id = v_me)
                           or (b.blocker_id = v_me and b.blocked_id = p.id))
     order by gap asc, pr.last_seen_at desc
     limit v_fanout
  loop
    insert into duel_challenges(session_id, sender_id, receiver_id, expires_at)
    values (v_session.id, v_me, v_row.id, now() + (v_ttl || ' seconds')::interval)
    on conflict (session_id, receiver_id) do nothing
    returning id, expires_at into v_new_id, v_new_expiry;

    if v_new_id is not null then
      v_created := v_created || jsonb_build_array(jsonb_build_object(
        'challenge_id', v_new_id, 'receiver_id', v_row.id, 'expires_at', v_new_expiry));
      v_new_id := null;
    end if;
  end loop;

  if jsonb_array_length(v_created) > 0 then
    update duel_matchmaking_sessions set status = 'challenge_sent' where id = v_session.id;
  end if;

  return jsonb_build_object(
    'ok', true, 'searching', true,
    'session_id', v_session.id,
    'elapsed', round(v_elapsed)::int,
    'radius', v_radius,
    'challenges', v_created,
    'bot_fallback_due', v_elapsed >= duel_cfg('human_wait_seconds', 12)
                        and jsonb_array_length(v_created) = 0,
    'state', duel_state());
end $$;

-- ---------------------------------------------------------------------------
-- 5. The bot takes its rating from the strength estimate, not from duel_rating.
-- ---------------------------------------------------------------------------
create or replace function public.duel_start_bot_match()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me uuid := auth.uid(); v_session duel_matchmaking_sessions;
  v_match uuid; v_rating int; v_strength jsonb; v_bot int; v_jitter int;
  v_rounds int; v_row record;
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
  v_rounds := duel_cfg('duel_rounds', 3);

  insert into duel_matches(mode, rounds, ends_at)
  values ('bot', v_rounds, now() + (duel_cfg('duel_length_seconds', 1800) || ' seconds')::interval)
  returning id into v_match;

  insert into duel_match_players(match_id, seat, user_id, display_name, rating_before)
  select v_match, 1, v_me, coalesce(nullif(p.display_name,''), p.username), v_rating
    from profiles p where p.id = v_me;
  insert into duel_match_players(match_id, seat, user_id, is_bot, bot_rating, display_name, rating_before)
  values (v_match, 2, null, true, v_bot, '', v_bot);

  -- Problems are chosen for the bot's level, which is now the player's real
  -- level rather than a duel_rating that may never have moved.
  for v_row in select * from duel_pick_problems(v_bot, v_me, v_me, v_rounds, true) loop
    insert into duel_rounds(match_id, round, problem_key, problem_rating, points)
    values (v_match, v_row.round, v_row.problem_key, v_row.problem_rating, v_row.points);
  end loop;

  update duel_matchmaking_sessions
     set status = 'duel_found', match_id = v_match, ended_at = now() where id = v_session.id;

  return jsonb_build_object('ok', true, 'duel_id', v_match, 'bot_rating', v_bot,
                            'strength', v_strength);
end $$;

-- ---------------------------------------------------------------------------
-- 6. Every problem is now playable by the bot.
--
-- 019 marked the 30 problems that had a reference solution at the time. The
-- library now covers all 101, each one verified by submitting it to the real
-- judge, so the bot can be given any problem the matchmaker would give a
-- person — which is what stops bot duels from drawing on a visibly smaller
-- pool than human ones.
-- ---------------------------------------------------------------------------
update public.duel_problem_pool set bot_ready = true where enabled;
