-- AlgoYo'l — the bot can play now.
--
-- 017 switched the bot off, on the grounds that a duel against an opponent who
-- never submits anything is worse than no bot at all. This turns it back on,
-- because the two things it was missing now exist: reference solutions on the
-- server, and a difficulty model that decides what to submit and when.
--
-- Nothing in this file knows how the bot thinks. The schedule is computed in
-- TypeScript at duel creation and stored here as an opaque plan; Postgres's job
-- is to hold it, and to make sure the bot's submissions go through exactly the
-- same door a human's do.
--
-- Run AFTER 016-018. Safe to re-run.

-- ---------------------------------------------------------------------------
-- 1. The plan.
--
-- Stored rather than kept in memory: a Cloudflare Worker cannot hold a timer
-- for twenty minutes, and an isolate that dies between two rounds must not
-- take the bot's schedule with it. Every later request re-reads the plan and
-- asks what was due by now.
-- ---------------------------------------------------------------------------
alter table public.duel_match_players
  add column if not exists bot_plan jsonb;

create or replace function public.duel_set_bot_plan(p_match uuid, p_plan jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  -- Service role only. auth.uid() is null exactly when this is the server
  -- acting as the bot; a learner's token cannot write their opponent's plan.
  if auth.uid() is not null then return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  update duel_match_players set bot_plan = p_plan where match_id = p_match and is_bot;
  return jsonb_build_object('ok', found);
end $$;
revoke all on function public.duel_set_bot_plan(uuid, jsonb) from public;

-- What the server needs in order to run the bot's next move: the plan, the
-- clock, and how many submissions it has already made in each round. Readable
-- by the human in the duel, because it says nothing they should not know —
-- no source code, and no future moves beyond what the plan already committed
-- to before the duel started.
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
    'rounds', (select coalesce(jsonb_agg(jsonb_build_object(
                 'round', r.round, 'problem_key', r.problem_key,
                 'problem_rating', r.problem_rating, 'claimed_by_seat', r.claimed_by_seat)
                 order by r.round), '[]'::jsonb)
               from duel_rounds r where r.match_id = p_match),
    -- How many attempts the bot has already made per round, so the runner is
    -- idempotent: two overlapping requests cannot make the same move twice.
    'done', (select coalesce(jsonb_object_agg(s.round::text, s.n), '{}'::jsonb)
             from (select round, count(*) as n from duel_submissions
                    where match_id = p_match and is_bot group by round) s));
end $$;
grant execute on function public.duel_bot_status(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Tuning knobs.
--
-- The difficulty model lives in TypeScript, but every number it uses lives
-- here, so balancing the bot after watching real duels is an UPDATE rather
-- than a deploy.
-- ---------------------------------------------------------------------------
insert into public.duel_config(key, value, note) values
  ('bot_difficulty_scale', '1'::jsonb,   'stretches the skill curve; >1 makes rating gaps matter more'),
  ('bot_time_scale',       '1'::jsonb,   'multiplies every thinking time'),
  ('bot_mistake_rate',     '1'::jsonb,   'how readily the bot submits a wrong answer first'),
  ('bot_min_delay',        '35'::jsonb,  'seconds — the bot never submits sooner than this'),
  ('bot_max_delay',        '900'::jsonb, 'seconds — nor later than this')
on conflict (key) do nothing;

create or replace function public.duel_bot_config()
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb)
    from duel_config where key like 'bot\_%'
$$;
grant execute on function public.duel_bot_config() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. The problems the bot can actually play.
--
-- Marked from app/api/_lib/solutions.ts — every one of these has a reference
-- solution that the judge accepted and a near miss the judge rejected, checked
-- by tests/bot-solutions.test.mjs rather than by eye.
--
-- duel_pick_problems() prefers this subset for bot duels and falls back to the
-- whole bank if it is ever empty, so widening it later is one UPDATE.
-- ---------------------------------------------------------------------------
update public.duel_problem_pool set bot_ready = false;
update public.duel_problem_pool set bot_ready = true where problem_key in (
  'sum-two','array-reverse','count-parity','digit-sum','vowel-count','range-spread',
  'temperature-average','multiples-sum','gcd-lcm','palindrome-word','power-of-two',
  'running-max','second-largest','factorial-mod','anagram-check','bit-count',
  'count-distinct','word-count','char-frequency','balanced-brackets','max-subarray',
  'window-sum','first-not-less','kth-largest','binary-search-sqrt','rotate-array',
  'prime-count','fast-power','stairs-ways','collatz-steps');

-- ---------------------------------------------------------------------------
-- 4. Switch it on.
-- ---------------------------------------------------------------------------
update public.duel_config set value = 'true'::jsonb, updated_at = now() where key = 'bot_enabled';
