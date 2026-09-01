-- AlgoYo'l — the duel engine: presence, matchmaking, challenges, matches.
--
-- What this replaces. The duel a learner plays today never leaves the browser:
-- `duelOpponents` is six hard-coded names, matchmaking is a 1.8-second
-- setTimeout, the opponent is a countdown with a failure chance, and the Elo
-- delta is computed in React and PATCHed straight onto profiles.duel_rating.
-- Every one of those decisions moves into this file, because every one of them
-- is a decision the client is not entitled to make.
--
-- Why new tables when 001 already has `duels`. 001's duel_problems keys to a
-- row in `problems`, and the app judges a static bank identified by text — the
-- same fork migration 015 hit with submissions, and it went the same way then:
-- bending one shape into the other costs more than a clean table. The 001 duel
-- tables stay where they are, still empty, still unused.
--
-- The two guarantees this file is really about, both enforced by an index
-- rather than by application code, because an `if` in TypeScript is not a
-- guarantee when two requests arrive in the same millisecond:
--
--   one live search per user   -> idx_duel_mm_one_live
--   one active duel per user   -> idx_duel_one_active
--
-- Everything is reachable only through the functions at the bottom. RLS is on
-- for every table with no policies at all, which means direct PostgREST reads
-- and writes return nothing and change nothing: the security definer functions
-- are the entire API, and each one re-derives the caller from auth.uid().
--
-- Run AFTER 001-015. Safe to re-run.

-- ---------------------------------------------------------------------------
-- 0. Tunables.
--
-- Bot difficulty needs tuning against real games, and a tuning pass that
-- requires a redeploy is a tuning pass that does not happen. Every number the
-- engine reads lives here, so balancing is an UPDATE.
-- ---------------------------------------------------------------------------
create table if not exists public.duel_config (
  key text primary key,
  value jsonb not null,
  note text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.duel_config enable row level security;

-- `do nothing` on purpose: re-running the migration must never undo tuning.
insert into public.duel_config(key, value, note) values
  ('initial_rating_range',    '100'::jsonb,  'Elo radius searched at t=0'),
  ('rating_range_step',       '100'::jsonb,  'radius widens by this…'),
  ('rating_range_interval',   '2'::jsonb,    '…every this many seconds'),
  ('max_rating_range',        '400'::jsonb,  'radius stops widening here'),
  ('challenge_ttl_seconds',   '5'::jsonb,    'a challenge is dead after this'),
  ('challenge_fanout',        '3'::jsonb,    'simultaneous challenges per tick'),
  ('human_wait_seconds',      '12'::jsonb,   'humans get this long before a bot appears'),
  ('search_ttl_seconds',      '60'::jsonb,   'a search this old is swept, never stuck'),
  ('presence_window_seconds', '45'::jsonb,   'online means a heartbeat inside this'),
  ('duel_length_seconds',     '1800'::jsonb, 'unchanged from the current duel'),
  ('duel_rounds',             '3'::jsonb,    'problems per duel'),
  ('duel_k_factor',           '32'::jsonb,   'Elo K — same value the browser used'),
  ('bot_duels_affect_rating', 'true'::jsonb, 'decided: bot results are rated'),
  ('bot_rating_jitter',       '40'::jsonb,   'bot rating is player rating ± this'),
  ('round_points',            '[100,200,300]'::jsonb, 'points per round, easy to hard')
on conflict (key) do nothing;

create or replace function public.duel_cfg(p_key text, p_default numeric)
returns numeric language sql stable security definer set search_path = public as $$
  select coalesce((select (value #>> '{}')::numeric from duel_config where key = p_key), p_default)
$$;

create or replace function public.duel_cfg_bool(p_key text, p_default boolean)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select (value #>> '{}')::boolean from duel_config where key = p_key), p_default)
$$;

-- ---------------------------------------------------------------------------
-- 1. Presence.
--
-- daily_activity already carries a heartbeat, but it is a once-a-minute coin
-- counter clamped to whole days — it can tell you somebody was here today, not
-- whether they are here now. Matchmaking needs the second question, so it gets
-- its own row per user, overwritten in place.
-- ---------------------------------------------------------------------------
create table if not exists public.user_presence (
  user_id      uuid primary key references public.profiles on delete cascade,
  last_seen_at timestamptz not null default now(),
  -- False while the learner is mid-lesson and does not want to be interrupted.
  -- Nothing sets it yet; the column exists so "available" is a stored fact
  -- rather than something the matchmaker has to infer later.
  duel_ready   boolean not null default true
);
create index if not exists idx_presence_seen on public.user_presence(last_seen_at desc) where duel_ready;
alter table public.user_presence enable row level security;

-- ---------------------------------------------------------------------------
-- 2. The problem pool.
--
-- The bank lives in TypeScript, but problem selection is a matchmaking
-- decision and matchmaking is authoritative here — so the ratings the picker
-- needs are mirrored into a table. `bot_ready` marks the problems the bot has
-- authored solution variants for; until Phase 6 fills them in, human duels use
-- the whole pool and bot duels prefer the marked subset.
-- ---------------------------------------------------------------------------
create table if not exists public.duel_problem_pool (
  problem_key text primary key,
  rating      int  not null,
  difficulty  text not null check (difficulty in ('easy','medium','hard')),
  topic       text not null default '',
  bot_ready   boolean not null default false,
  enabled     boolean not null default true
);
create index if not exists idx_pool_rating on public.duel_problem_pool(rating) where enabled;
alter table public.duel_problem_pool enable row level security;
-- Statements are public already; the pool is only metadata about them.
drop policy if exists "pool is public" on public.duel_problem_pool;
create policy "pool is public" on public.duel_problem_pool for select using (true);

-- Seeded from app/ui/problem-bank.ts. Regenerate rather than hand-edit:
-- the rating a duel picks on must be the rating the bank shows the learner.
insert into public.duel_problem_pool(problem_key, rating, difficulty, topic) values
  ('array-reverse', 800, 'easy', 'programming-basics'),
  ('count-parity', 800, 'easy', 'programming-basics'),
  ('digit-sum', 800, 'easy', 'math'),
  ('multiples-sum', 800, 'easy', 'math'),
  ('range-spread', 800, 'easy', 'foundations'),
  ('sum-two', 800, 'easy', 'programming-basics'),
  ('temperature-average', 800, 'easy', 'foundations'),
  ('vowel-count', 800, 'easy', 'strings'),
  ('factorial-mod', 900, 'easy', 'math'),
  ('gcd-lcm', 900, 'easy', 'math'),
  ('palindrome-word', 900, 'easy', 'strings'),
  ('power-of-two', 900, 'easy', 'math'),
  ('running-max', 900, 'easy', 'foundations'),
  ('second-largest', 900, 'easy', 'foundations'),
  ('anagram-check', 1000, 'easy', 'strings'),
  ('bit-count', 1000, 'easy', 'math'),
  ('char-frequency', 1000, 'easy', 'strings'),
  ('count-distinct', 1000, 'easy', 'data-structures'),
  ('word-count', 1000, 'easy', 'strings'),
  ('caesar-shift', 1100, 'easy', 'strings'),
  ('diagonal-sum', 1100, 'easy', 'foundations'),
  ('frequency-mode', 1100, 'easy', 'data-structures'),
  ('sum-of-squares', 1100, 'easy', 'math'),
  ('balanced-brackets', 1200, 'medium', 'data-structures'),
  ('count-divisors', 1200, 'medium', 'math'),
  ('first-not-less', 1200, 'medium', 'binary-search'),
  ('kth-largest', 1200, 'medium', 'sorting'),
  ('longest-equal-run', 1200, 'medium', 'foundations'),
  ('matrix-transpose', 1200, 'medium', 'foundations'),
  ('perfect-number', 1200, 'medium', 'math'),
  ('prefix-queries', 1200, 'medium', 'two-pointers'),
  ('remove-duplicates-sorted', 1200, 'medium', 'two-pointers'),
  ('run-length', 1200, 'medium', 'strings'),
  ('stairs-ways', 1200, 'medium', 'dynamic-programming'),
  ('window-sum', 1200, 'medium', 'two-pointers'),
  ('bracket-depth', 1300, 'medium', 'data-structures'),
  ('collatz-steps', 1300, 'medium', 'math'),
  ('count-sort-range', 1300, 'medium', 'sorting'),
  ('fibonacci-mod', 1300, 'medium', 'math'),
  ('matrix-spiral', 1300, 'medium', 'foundations'),
  ('max-subarray', 1300, 'medium', 'dynamic-programming'),
  ('pair-sum-count', 1300, 'medium', 'two-pointers'),
  ('prime-count', 1300, 'medium', 'math'),
  ('queue-simulation', 1300, 'medium', 'data-structures'),
  ('rotate-array', 1300, 'medium', 'foundations'),
  ('triangle-area', 1300, 'medium', 'geometry'),
  ('xor-range', 1300, 'medium', 'math'),
  ('binary-search-sqrt', 1400, 'medium', 'binary-search'),
  ('components-count', 1400, 'medium', 'graphs'),
  ('fast-power', 1400, 'medium', 'math'),
  ('flood-fill-area', 1400, 'medium', 'graphs'),
  ('manhattan-closest', 1400, 'medium', 'geometry'),
  ('merge-intervals', 1400, 'medium', 'sorting'),
  ('peak-element', 1400, 'medium', 'binary-search'),
  ('string-rotation', 1400, 'medium', 'strings'),
  ('tree-leaf-count', 1400, 'medium', 'trees'),
  ('two-pointer-closest', 1400, 'medium', 'two-pointers'),
  ('activity-select', 1500, 'medium', 'greedy'),
  ('bfs-levels', 1500, 'medium', 'graphs'),
  ('fractional-tasks', 1500, 'medium', 'greedy'),
  ('grid-paths', 1500, 'medium', 'dynamic-programming'),
  ('grid-shortest', 1500, 'medium', 'graphs'),
  ('house-robber', 1500, 'medium', 'dynamic-programming'),
  ('longest-distinct', 1500, 'medium', 'two-pointers'),
  ('max-heap-k', 1500, 'medium', 'data-structures'),
  ('permutations-count', 1500, 'medium', 'backtracking'),
  ('sort-by-frequency', 1500, 'medium', 'sorting'),
  ('stack-next-greater', 1500, 'medium', 'data-structures'),
  ('substring-occurrences', 1500, 'medium', 'strings'),
  ('coin-change', 1600, 'medium', 'dynamic-programming'),
  ('cycle-detect-undirected', 1600, 'medium', 'graphs'),
  ('inversion-count', 1600, 'medium', 'sorting'),
  ('min-path-sum', 1600, 'medium', 'dynamic-programming'),
  ('min-platforms', 1600, 'medium', 'greedy'),
  ('subarray-sum-k', 1600, 'medium', 'two-pointers'),
  ('topological-possible', 1600, 'medium', 'graphs'),
  ('bipartite-check', 1700, 'medium', 'graphs'),
  ('candy-distribution', 1700, 'medium', 'greedy'),
  ('coin-ways', 1700, 'medium', 'dynamic-programming'),
  ('dsu-queries', 1700, 'medium', 'data-structures'),
  ('knapsack-01', 1700, 'medium', 'dynamic-programming'),
  ('lis-length', 1700, 'medium', 'dynamic-programming'),
  ('median-stream', 1700, 'medium', 'data-structures'),
  ('min-jumps', 1700, 'medium', 'dynamic-programming'),
  ('modular-inverse', 1700, 'medium', 'math'),
  ('tree-subtree-sizes', 1700, 'medium', 'trees'),
  ('water-container', 1700, 'medium', 'two-pointers'),
  ('binary-answer-split', 1800, 'hard', 'binary-search'),
  ('binomial-mod', 1800, 'hard', 'math'),
  ('distinct-substrings-small', 1800, 'hard', 'strings'),
  ('interval-cover', 1800, 'hard', 'greedy'),
  ('lcs-length', 1800, 'hard', 'dynamic-programming'),
  ('partition-equal', 1800, 'hard', 'dynamic-programming'),
  ('subset-sum-exists', 1800, 'hard', 'backtracking'),
  ('tree-diameter', 1800, 'hard', 'trees'),
  ('dijkstra-shortest', 1900, 'hard', 'graphs'),
  ('edit-distance', 1900, 'hard', 'dynamic-programming'),
  ('longest-palindrome-sub', 1900, 'hard', 'dynamic-programming'),
  ('mst-weight', 1900, 'hard', 'graphs'),
  ('nqueens-count', 1900, 'hard', 'backtracking'),
  ('trapping-rain', 1900, 'hard', 'two-pointers')
on conflict (problem_key) do update set rating = excluded.rating,
  difficulty = excluded.difficulty, topic = excluded.topic;

-- ---------------------------------------------------------------------------
-- 3. Matchmaking sessions and challenges.
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.duel_mm_status as enum ('searching','challenge_sent','duel_found','cancelled','expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.duel_challenge_status as enum ('pending','accepted','declined','cancelled','expired');
exception when duplicate_object then null; end $$;

create table if not exists public.duel_matchmaking_sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles on delete cascade,
  status     public.duel_mm_status not null default 'searching',
  rating     int  not null,
  match_id   uuid,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  ended_at   timestamptz
);

-- Guarantee one: a user cannot hold two live searches. `duel_found` is not in
-- the predicate because a found session is finished work — the duel itself is
-- what stops a second search from mattering, and that is guaranteed below.
create unique index if not exists idx_duel_mm_one_live
  on public.duel_matchmaking_sessions(user_id)
  where status in ('searching','challenge_sent');
create index if not exists idx_duel_mm_live_scan
  on public.duel_matchmaking_sessions(status, expires_at);
alter table public.duel_matchmaking_sessions enable row level security;

create table if not exists public.duel_challenges (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references public.duel_matchmaking_sessions on delete cascade,
  sender_id    uuid not null references public.profiles on delete cascade,
  receiver_id  uuid not null references public.profiles on delete cascade,
  status       public.duel_challenge_status not null default 'pending',
  created_at   timestamptz not null default now(),
  -- Written here, by the server clock. The countdown the learner sees is a CSS
  -- animation; this column is what an accept is actually measured against.
  expires_at   timestamptz not null,
  responded_at timestamptz,
  constraint duel_challenge_not_self check (sender_id <> receiver_id),
  -- One search never challenges the same person twice.
  unique (session_id, receiver_id)
);
create index if not exists idx_duel_challenge_inbox
  on public.duel_challenges(receiver_id, expires_at) where status = 'pending';
alter table public.duel_challenges enable row level security;

-- ---------------------------------------------------------------------------
-- 4. The duel itself.
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.duel_match_status as enum ('active','finished','abandoned');
exception when duplicate_object then null; end $$;

create table if not exists public.duel_matches (
  id          uuid primary key default gen_random_uuid(),
  status      public.duel_match_status not null default 'active',
  mode        text not null check (mode in ('human','bot')),
  rounds      int  not null,
  started_at  timestamptz not null default now(),
  -- Authoritative end. If both players vanish, the first request after this
  -- timestamp settles the duel on the scores actually recorded.
  ends_at     timestamptz not null,
  finished_at timestamptz,
  winner_id   uuid references public.profiles,
  created_at  timestamptz not null default now()
);
create index if not exists idx_duel_match_open on public.duel_matches(ends_at) where status = 'active';
alter table public.duel_matches enable row level security;

-- winner_id has to release its reference when an account goes away. Written as
-- an alter rather than inline because `create table if not exists` will not
-- amend a table that already exists, and the first cut of this migration shipped
-- without the rule: deleting a learner who had ever won a duel failed on the
-- foreign key, which would have blocked account deletion in production. The
-- match itself survives — it is still the other player's history — with the
-- winner recorded as nobody.
do $$ begin
  alter table public.duel_matches drop constraint if exists duel_matches_winner_id_fkey;
  alter table public.duel_matches add constraint duel_matches_winner_id_fkey
    foreign key (winner_id) references public.profiles(id) on delete set null;
end $$;

create table if not exists public.duel_match_players (
  match_id      uuid not null references public.duel_matches on delete cascade,
  seat          int  not null check (seat in (1,2)),
  -- Null for the bot: it has no account, and giving it one would put a fake
  -- row on the leaderboard.
  user_id       uuid references public.profiles on delete cascade,
  is_bot        boolean not null default false,
  bot_rating    int,
  display_name  text not null default '',
  score         int  not null default 0,
  rating_before int  not null,
  rating_after  int,
  -- Cleared when the duel finishes; the partial index below reads it.
  active        boolean not null default true,
  primary key (match_id, seat),
  constraint duel_player_identity check ((is_bot and user_id is null) or (not is_bot and user_id is not null))
);

-- Guarantee two: a user is in at most one duel. Two concurrent accepts, a
-- replayed request, a second tab — all of them fail on this index, and because
-- the insert happens inside the accepting transaction, failing it rolls the
-- whole accept back.
create unique index if not exists idx_duel_one_active
  on public.duel_match_players(user_id) where active and user_id is not null;
create index if not exists idx_duel_player_history on public.duel_match_players(user_id, match_id);
alter table public.duel_match_players enable row level security;

create table if not exists public.duel_rounds (
  match_id       uuid not null references public.duel_matches on delete cascade,
  round          int  not null check (round >= 0),
  problem_key    text not null,
  problem_rating int  not null,
  points         int  not null,
  claimed_by_seat int,
  claimed_at     timestamptz,
  primary key (match_id, round)
);
alter table public.duel_rounds enable row level security;

create table if not exists public.duel_submissions (
  id          uuid primary key default gen_random_uuid(),
  match_id    uuid not null references public.duel_matches on delete cascade,
  seat        int  not null,
  is_bot      boolean not null default false,
  round       int  not null,
  language    text not null check (language in ('cpp20','python3')),
  source_code text not null,
  verdict     text not null,
  runtime_ms  int, memory_kb int, passed int, total int,
  created_at  timestamptz not null default now()
);
create index if not exists idx_duel_sub_match on public.duel_submissions(match_id, created_at);
alter table public.duel_submissions enable row level security;

-- ---------------------------------------------------------------------------
-- 5. Sweeping.
--
-- Cloudflare Workers cannot hold a timer, so nothing wakes up at t+5s to kill
-- a challenge. Expiry is therefore evaluated rather than scheduled: this runs
-- at the top of every function that could be misled by a stale row, which
-- means a challenge is dead the moment its timestamp passes whether or not
-- anybody is looking.
-- ---------------------------------------------------------------------------
create or replace function public.duel_sweep()
returns void language plpgsql security definer set search_path = public as $$
begin
  update duel_challenges
     set status = 'expired', responded_at = now()
   where status = 'pending' and expires_at <= now();

  -- A search whose challenges have all died goes back to searching, so the
  -- next tick can widen the radius and try somebody else.
  update duel_matchmaking_sessions s
     set status = 'searching'
   where s.status = 'challenge_sent'
     and not exists (select 1 from duel_challenges c
                      where c.session_id = s.id and c.status = 'pending');

  update duel_matchmaking_sessions
     set status = 'expired', ended_at = now()
   where status in ('searching','challenge_sent') and expires_at <= now();
end $$;

-- ---------------------------------------------------------------------------
-- 6. Problem selection.
--
-- Three problems straddling the midpoint of the two ratings: one below to open
-- with, one at level, one above to separate the players. Anything either of
-- them has already solved is excluded — a duel decided by who happened to have
-- seen the problem before is not a duel.
-- ---------------------------------------------------------------------------
create or replace function public.duel_pick_problems(
  p_target int, p_user_a uuid, p_user_b uuid, p_rounds int, p_bot boolean default false)
returns table(round int, problem_key text, problem_rating int, points int)
language plpgsql stable security definer set search_path = public as $$
declare
  offsets int[] := array[-150, 0, 200];
  pts     jsonb := (select value from duel_config where key = 'round_points');
  i       int;
  want    int;
  chosen  text[] := '{}';
  v_key   text;
  v_rate  int;
begin
  for i in 0 .. p_rounds - 1 loop
    want := p_target + coalesce(offsets[least(i + 1, array_length(offsets, 1))], 0);

    select p.problem_key, p.rating into v_key, v_rate
      from duel_problem_pool p
     where p.enabled
       and not (p.problem_key = any(chosen))
       -- Bot duels prefer problems with authored variants, but never fail for
       -- the want of one: an empty bot_ready set must not break matchmaking.
       and (not p_bot or p.bot_ready or not exists (select 1 from duel_problem_pool q where q.enabled and q.bot_ready))
       and not exists (select 1 from bank_submissions b
                        where b.problem_key = p.problem_key and b.verdict = 'ACCEPTED'
                          and b.user_id in (p_user_a, p_user_b))
     order by abs(p.rating - want), random()
     limit 1;

    -- Every candidate excluded because both players have solved it? Take the
    -- nearest one anyway: a duel with a repeated problem beats a duel with a
    -- missing round.
    if not found then
      select p.problem_key, p.rating into v_key, v_rate
        from duel_problem_pool p
       where p.enabled and not (p.problem_key = any(chosen))
       order by abs(p.rating - want), random() limit 1;
      exit when not found;
    end if;

    chosen := chosen || v_key;
    round := i;
    problem_key := v_key;
    problem_rating := v_rate;
    points := coalesce((pts -> i #>> '{}')::int, 100 * (i + 1));
    return next;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 7. Starting and cancelling a search.
-- ---------------------------------------------------------------------------
create or replace function public.duel_start_search()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me      uuid := auth.uid();
  v_rating  int;
  v_session duel_matchmaking_sessions;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;
  perform duel_sweep();

  -- Already duelling? Say so and hand back the duel rather than starting a
  -- search that the unique index would refuse three lines later.
  if exists (select 1 from duel_match_players where user_id = v_me and active) then
    return jsonb_build_object('ok', false, 'error', 'already_in_duel', 'state', duel_state());
  end if;

  -- A live search is not an error either — reconnecting after a dropped
  -- connection must land on the search that is already running.
  select * into v_session from duel_matchmaking_sessions
   where user_id = v_me and status in ('searching','challenge_sent') limit 1;
  if found then
    return jsonb_build_object('ok', true, 'resumed', true, 'session_id', v_session.id, 'state', duel_state());
  end if;

  select duel_rating into v_rating from profiles where id = v_me;

  insert into duel_matchmaking_sessions(user_id, rating, expires_at)
  values (v_me, coalesce(v_rating, 1200), now() + (duel_cfg('search_ttl_seconds', 60) || ' seconds')::interval)
  returning * into v_session;

  -- Searching counts as being here, so the first tick does not have to wait
  -- for the next heartbeat to consider this player online.
  insert into user_presence(user_id, last_seen_at) values (v_me, now())
  on conflict (user_id) do update set last_seen_at = now();

  return jsonb_build_object('ok', true, 'resumed', false, 'session_id', v_session.id,
                            'rating', v_session.rating, 'state', duel_state());
end $$;

create or replace function public.duel_cancel_search()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_ids jsonb;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;

  -- The challenges this search sent die with it — a card counting down on
  -- somebody else's screen for an opponent who has left is a lie. The ids come
  -- back so the route can say so over realtime; a CTE because RETURNING INTO
  -- keeps only the last row, and there can be three.
  with killed as (
    update duel_challenges c set status = 'cancelled', responded_at = now()
      from duel_matchmaking_sessions s
     where c.session_id = s.id and s.user_id = v_me and c.status = 'pending'
     returning c.id, c.receiver_id)
  select coalesce(jsonb_agg(jsonb_build_object('challenge_id', id, 'receiver_id', receiver_id)), '[]'::jsonb)
    into v_ids from killed;

  update duel_matchmaking_sessions set status = 'cancelled', ended_at = now()
   where user_id = v_me and status in ('searching','challenge_sent');

  return jsonb_build_object('ok', true, 'cancelled', v_ids);
end $$;

-- ---------------------------------------------------------------------------
-- 8. The tick.
--
-- Called about once a second by the searching client. It owns no authority of
-- its own — every value it uses is read here, so a client that ticks faster
-- only widens its own radius no sooner than the clock allows.
--
-- Returns the challenges it created so the route can broadcast them; the
-- database does not reach out to the network.
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

  -- Challenges are already out. Nothing to do but let them run their five
  -- seconds — issuing more now is how one player ends up holding four cards.
  if v_session.status = 'challenge_sent' then
    return jsonb_build_object('ok', true, 'searching', true, 'waiting_on_challenge', true,
                              'state', duel_state());
  end if;

  v_elapsed := extract(epoch from (now() - v_session.created_at));
  v_radius  := least(
      duel_cfg('initial_rating_range', 100)
        + floor(v_elapsed / greatest(duel_cfg('rating_range_interval', 2), 1)) * duel_cfg('rating_range_step', 100),
      duel_cfg('max_rating_range', 400));
  v_fanout  := duel_cfg('challenge_fanout', 3);
  v_ttl     := duel_cfg('challenge_ttl_seconds', 5);
  v_window  := (duel_cfg('presence_window_seconds', 45) || ' seconds')::interval;

  -- Everyone eligible, nearest rating first. Eligibility is the whole list
  -- from the brief in one place: online, available, not me, not already in a
  -- duel, not already searching against me, not blocked either way, and not
  -- somebody this search has already asked.
  for v_row in
    select p.id, abs(p.duel_rating - v_session.rating) as gap
      from profiles p
      join user_presence pr on pr.user_id = p.id
     where p.id <> v_me
       and pr.duel_ready
       and pr.last_seen_at > now() - v_window
       and abs(p.duel_rating - v_session.rating) <= v_radius
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
       and coalesce((select suspended_at is null from profiles x where x.id = p.id), true)
     order by gap asc, pr.last_seen_at desc
     limit v_fanout
  loop
    insert into duel_challenges(session_id, sender_id, receiver_id, expires_at)
    values (v_session.id, v_me, v_row.id, now() + (v_ttl || ' seconds')::interval)
    on conflict (session_id, receiver_id) do nothing
    returning id, expires_at into v_new_id, v_new_expiry;

    -- Nothing returned means this search had already asked them; the unique
    -- constraint is doing the deduplication rather than a lookup beforehand.
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
    -- The route reads this to decide whether to start a bot duel. The decision
    -- is the database's; the route only carries it out.
    'bot_fallback_due', v_elapsed >= duel_cfg('human_wait_seconds', 12)
                        and jsonb_array_length(v_created) = 0,
    'state', duel_state());
end $$;

-- ---------------------------------------------------------------------------
-- 9. Accepting — the part everything else is built around.
--
-- Three people can be looking at the same challenge with two seconds left.
-- Exactly one duel may exist afterwards, and the others must be told why.
--
-- The serialisation point is the challenger's session row: every accept for a
-- given search locks that one row before it looks at anything else, which
-- turns simultaneous accepts into a queue of one. The winner commits a whole
-- duel; everyone behind it reads a session that is no longer 'challenge_sent'
-- and is refused. Same lock, same order, every caller — nothing to interleave,
-- nothing to deadlock.
-- ---------------------------------------------------------------------------
create or replace function public.duel_accept_challenge(p_challenge uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me       uuid := auth.uid();
  v_ch       duel_challenges;
  v_session  duel_matchmaking_sessions;
  v_match    uuid;
  v_mine     int;
  v_theirs   int;
  v_target   int;
  v_rounds   int;
  v_losers   jsonb;
  v_row      record;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;

  select * into v_ch from duel_challenges where id = p_challenge;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  if v_ch.receiver_id <> v_me then return jsonb_build_object('ok', false, 'error', 'not_yours'); end if;

  -- (2) The lock. Everything after this line is serialised per search.
  select * into v_session from duel_matchmaking_sessions where id = v_ch.session_id for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;

  -- (3) Somebody already won this search.
  if v_session.status <> 'challenge_sent' then
    return jsonb_build_object('ok', false, 'error', 'already_taken');
  end if;

  -- (4) and (5) — re-read the challenge under the lock, and measure the five
  -- seconds against the server clock. A client that held its countdown open,
  -- or replayed the request, lands here.
  select * into v_ch from duel_challenges where id = p_challenge;
  if v_ch.status <> 'pending' then
    return jsonb_build_object('ok', false, 'error',
      case v_ch.status when 'expired' then 'expired' when 'cancelled' then 'cancelled' else 'already_taken' end);
  end if;
  if now() >= v_ch.expires_at then
    update duel_challenges set status = 'expired', responded_at = now() where id = p_challenge;
    return jsonb_build_object('ok', false, 'error', 'expired');
  end if;

  -- Neither side may already be duelling. The insert below would catch this
  -- anyway; checking first turns a constraint violation into a clear answer.
  if exists (select 1 from duel_match_players where user_id in (v_me, v_ch.sender_id) and active) then
    return jsonb_build_object('ok', false, 'error', 'in_another_duel');
  end if;

  select duel_rating into v_mine   from profiles where id = v_me;
  select duel_rating into v_theirs from profiles where id = v_ch.sender_id;
  v_target := ((coalesce(v_mine,1200) + coalesce(v_theirs,1200)) / 2)::int;
  v_rounds := duel_cfg('duel_rounds', 3);

  insert into duel_matches(mode, rounds, ends_at)
  values ('human', v_rounds, now() + (duel_cfg('duel_length_seconds', 1800) || ' seconds')::interval)
  returning id into v_match;

  -- (6) Seat 1 is the challenger. The partial unique index on user_id is the
  -- last word here: if either player is somehow already active, this insert
  -- fails and the entire accept — challenge, cancellations, match — rolls back.
  insert into duel_match_players(match_id, seat, user_id, display_name, rating_before)
  select v_match, 1, v_ch.sender_id, coalesce(nullif(p.display_name,''), p.username), coalesce(p.duel_rating,1200)
    from profiles p where p.id = v_ch.sender_id;
  insert into duel_match_players(match_id, seat, user_id, display_name, rating_before)
  select v_match, 2, v_me, coalesce(nullif(p.display_name,''), p.username), coalesce(p.duel_rating,1200)
    from profiles p where p.id = v_me;

  for v_row in select * from duel_pick_problems(v_target, v_ch.sender_id, v_me, v_rounds, false) loop
    insert into duel_rounds(match_id, round, problem_key, problem_rating, points)
    values (v_match, v_row.round, v_row.problem_key, v_row.problem_rating, v_row.points);
  end loop;

  update duel_challenges set status = 'accepted', responded_at = now() where id = p_challenge;

  -- (7) Everyone else in this search finds out immediately. The ids come back
  -- so the route can tell them over realtime rather than making them wait for
  -- their own countdown to run out.
  with killed as (
    update duel_challenges set status = 'cancelled', responded_at = now()
     where session_id = v_session.id and status = 'pending' and id <> p_challenge
     returning id, receiver_id)
  select coalesce(jsonb_agg(jsonb_build_object('challenge_id', id, 'receiver_id', receiver_id)), '[]'::jsonb)
    into v_losers from killed;

  -- (8)
  update duel_matchmaking_sessions
     set status = 'duel_found', match_id = v_match, ended_at = now()
   where id = v_session.id;

  return jsonb_build_object('ok', true, 'duel_id', v_match,
                            'opponent_id', v_ch.sender_id, 'cancelled', v_losers);
end $$;

create or replace function public.duel_decline_challenge(p_challenge uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_ch duel_challenges;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;
  update duel_challenges set status = 'declined', responded_at = now()
   where id = p_challenge and receiver_id = v_me and status = 'pending'
   returning * into v_ch;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;

  -- The search carries on with whoever is left, and widens next tick.
  update duel_matchmaking_sessions s set status = 'searching'
   where s.id = v_ch.session_id and s.status = 'challenge_sent'
     and not exists (select 1 from duel_challenges c where c.session_id = s.id and c.status = 'pending');

  return jsonb_build_object('ok', true, 'sender_id', v_ch.sender_id);
end $$;

-- ---------------------------------------------------------------------------
-- 10. Bot duels.
--
-- Same table, same rounds, same result path — the only difference is a seat
-- with no account behind it. Called by the server when a tick reports that the
-- human wait has run out.
-- ---------------------------------------------------------------------------
create or replace function public.duel_start_bot_match()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me uuid := auth.uid(); v_session duel_matchmaking_sessions;
  v_match uuid; v_rating int; v_bot int; v_jitter int; v_rounds int; v_row record;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;
  perform duel_sweep();

  select * into v_session from duel_matchmaking_sessions
   where user_id = v_me and status in ('searching','challenge_sent') for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_searching'); end if;

  -- The wait is checked here too. The route asking early does not make a bot
  -- appear early; humans keep their head start regardless of the caller.
  if extract(epoch from (now() - v_session.created_at)) < duel_cfg('human_wait_seconds', 12) then
    return jsonb_build_object('ok', false, 'error', 'too_early');
  end if;
  if exists (select 1 from duel_match_players where user_id = v_me and active) then
    return jsonb_build_object('ok', false, 'error', 'already_in_duel');
  end if;

  select duel_rating into v_rating from profiles where id = v_me;
  v_rating := coalesce(v_rating, 1200);
  v_jitter := duel_cfg('bot_rating_jitter', 40);
  -- Near the player, either side, clamped to a band the problem bank can
  -- actually express.
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

-- ---------------------------------------------------------------------------
-- 11. Inside a duel: claiming a round, and finishing.
--
-- claim_duel_problem() in 001 got this right and it is copied rather than
-- reinvented: one UPDATE with `claimed_by_seat is null` in the WHERE clause is
-- the whole race. Whoever loses sees zero rows updated.
-- ---------------------------------------------------------------------------
create or replace function public.duel_record_submission(
  p_match uuid, p_round int, p_language text, p_source text, p_verdict text,
  p_runtime int default null, p_memory int default null, p_passed int default null, p_total int default null,
  p_bot boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me uuid := auth.uid(); v_seat int; v_match duel_matches; v_claimed boolean := false; v_points int;
begin
  select * into v_match from duel_matches where id = p_match;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;

  if p_bot then
    -- The bot seat is never claimable by a person: it is the seat with no
    -- account, and only the service role reaches this branch.
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

  insert into duel_submissions(match_id, seat, is_bot, round, language, source_code, verdict,
                               runtime_ms, memory_kb, passed, total)
  values (p_match, v_seat, p_bot, p_round, p_language, p_source, p_verdict,
          p_runtime, p_memory, p_passed, p_total);

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

  -- Last round gone means the duel is over now, not in twenty-five minutes.
  if not exists (select 1 from duel_rounds where match_id = p_match and claimed_by_seat is null) then
    perform duel_finish(p_match, 'sweep');
  end if;

  return jsonb_build_object('ok', true, 'claimed', v_claimed, 'seat', v_seat, 'state', duel_state());
end $$;

-- The Elo the browser used to compute, moved to the only place it can be
-- trusted. Formula and K are unchanged — this is the existing rating system
-- relocated, not a new one.
create or replace function public.duel_finish(p_match uuid, p_reason text default 'time')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_match duel_matches; v_k numeric; v_rated boolean;
  a duel_match_players; b duel_match_players;
  v_expected numeric; v_actual numeric; v_delta int; v_winner uuid;
begin
  select * into v_match from duel_matches where id = p_match for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  if v_match.status <> 'active' then return jsonb_build_object('ok', true, 'already_finished', true); end if;

  select * into a from duel_match_players where match_id = p_match and seat = 1;
  select * into b from duel_match_players where match_id = p_match and seat = 2;

  v_winner := case when a.score > b.score then a.user_id
                   when b.score > a.score then b.user_id else null end;
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

  update duel_matches set status = 'finished', finished_at = now(), winner_id = v_winner where id = p_match;
  return jsonb_build_object('ok', true, 'winner_id', v_winner, 'reason', p_reason, 'rated', v_rated);
end $$;

-- Leaving mid-duel hands the round to the opponent. Same settlement path, so
-- there is no second way for a duel to end.
create or replace function public.duel_forfeit(p_match uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_seat int;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;
  select seat into v_seat from duel_match_players where match_id = p_match and user_id = v_me;
  if v_seat is null then return jsonb_build_object('ok', false, 'error', 'not_a_player'); end if;

  -- Every unclaimed round goes to the other seat, which makes the forfeiting
  -- player the loser through the ordinary score comparison.
  update duel_rounds set claimed_by_seat = 3 - v_seat, claimed_at = now()
   where match_id = p_match and claimed_by_seat is null;
  update duel_match_players p set score = (
    select coalesce(sum(r.points), 0) from duel_rounds r
     where r.match_id = p_match and r.claimed_by_seat = p.seat)
   where p.match_id = p_match;

  return duel_finish(p_match, 'forfeit');
end $$;

-- ---------------------------------------------------------------------------
-- 12. State.
--
-- The one read the client makes. Everything it renders comes from here, so a
-- reconnect, a refresh or a second tab all resolve to the same truth without
-- the frontend keeping a copy it could get wrong.
--
-- Note what is missing: source code belonging to the other player. A duel is
-- live competition, and handing over an opponent's solution mid-round would be
-- the same mistake migration 015 exists to avoid.
-- ---------------------------------------------------------------------------
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
                  from duel_submissions s where s.match_id = m.id and s.seat <> v_seat))
      into v_match from duel_matches m where m.id = v_match_id;
  end if;

  return jsonb_build_object(
    'status', case when v_match is not null then 'duel_active'
                   when v_session is not null then (v_session ->> 'status')
                   else 'idle' end,
    'session', v_session, 'challenge', v_challenge, 'duel', v_match, 'now', now());
end $$;

create or replace function public.duel_heartbeat(p_ready boolean default true)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := auth.uid();
begin
  if v_me is null then return jsonb_build_object('ok', false); end if;
  insert into user_presence(user_id, last_seen_at, duel_ready) values (v_me, now(), p_ready)
  on conflict (user_id) do update set last_seen_at = now(), duel_ready = excluded.duel_ready;
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------------------
-- 13. Grants.
--
-- The functions are the API. Nothing here is granted to anon: a duel needs an
-- account, and the pool is the only readable table.
-- ---------------------------------------------------------------------------
revoke all on function public.duel_sweep() from public;
revoke all on function public.duel_finish(uuid, text) from public;
revoke all on function public.duel_pick_problems(int, uuid, uuid, int, boolean) from public;
revoke all on function public.duel_record_submission(uuid, int, text, text, text, int, int, int, int, boolean) from public;

grant execute on function public.duel_start_search()            to authenticated;
grant execute on function public.duel_cancel_search()           to authenticated;
grant execute on function public.duel_tick()                    to authenticated;
grant execute on function public.duel_accept_challenge(uuid)    to authenticated;
grant execute on function public.duel_decline_challenge(uuid)   to authenticated;
grant execute on function public.duel_start_bot_match()         to authenticated;
grant execute on function public.duel_forfeit(uuid)             to authenticated;
grant execute on function public.duel_state()                   to authenticated;
grant execute on function public.duel_heartbeat(boolean)        to authenticated;
grant execute on function public.duel_record_submission(uuid, int, text, text, text, int, int, int, int, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- 14. Deliberately not here: the rating revoke.
--
-- The browser currently computes its own Elo delta and PATCHes it onto its own
-- profile row, which the "own profile update" policy in 001 allows — so
-- `duel_rating: 3000` is a console away and the leaderboard cannot be trusted.
-- The fix is one line:
--
--   revoke update (duel_rating, solved_count) on public.profiles from authenticated;
--
-- It belongs in 017, alongside the change that removes saveDuelRating() and
-- routes results through duel_finish(). Running it today would take the write
-- away from the duel that is still live, and a learner would finish a match
-- and silently keep their old rating. Everything above is additive: nothing
-- currently running behaves differently once this migration is applied.
-- ---------------------------------------------------------------------------
