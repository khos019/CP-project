-- AlgoYo'l — Topic Mastery domain.
--
-- Implements spec sections 7-16, 21, 22 and 65-67:
--   * per-topic mastery separate from Global Duel Rating
--   * evidence-based scoring with anti-farming deduplication
--   * configurable thresholds (owner-editable, not hard-coded)
--   * persistent unlocks that never re-lock
--   * one authoritative server-side service; the browser can never write mastery
--
-- Run AFTER 001, 002, 003, 004.

-- ---------------------------------------------------------------------------
-- 1. Configuration — thresholds live in the database so Owner can tune them.
-- ---------------------------------------------------------------------------
create table if not exists public.mastery_settings (
  key text primary key,
  value jsonb not null,
  description text not null default '',
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

insert into public.mastery_settings(key, value, description) values
  ('scale_max',            '1000'::jsonb, 'Mastery ceiling'),
  ('unlock_threshold',      '500'::jsonb, 'Default mastery needed to unlock a topic'),
  ('completion_threshold',  '700'::jsonb, 'Default mastery treated as topic completion'),
  ('advanced_threshold',    '850'::jsonb, 'Default mastery treated as advanced mastery'),
  ('required_evidence',       '3'::jsonb, 'Distinct evidence events before completion can be claimed'),
  ('repeat_gain_ratio',    '0.05'::jsonb, 'Fraction of normal gain for repeated identical evidence'),
  ('bands', '[
     {"min":0,   "max":199,  "uz":"Boshlanmagan",       "en":"Not started"},
     {"min":200, "max":399,  "uz":"Boshlang''ich",       "en":"Basic familiarity"},
     {"min":400, "max":599,  "uz":"Ishchi bilim",        "en":"Working knowledge"},
     {"min":600, "max":749,  "uz":"Ishonchli",           "en":"Competent"},
     {"min":750, "max":899,  "uz":"Kuchli",              "en":"Strong"},
     {"min":900, "max":1000, "uz":"Yuqori mahorat",      "en":"Advanced mastery"}
   ]'::jsonb, 'Semantic bands shown in the UI')
on conflict (key) do nothing;

create or replace function public.mastery_setting_int(p_key text, p_fallback int)
returns int language sql stable security definer set search_path = public as $$
  select coalesce((select (value #>> '{}')::int from mastery_settings where key = p_key), p_fallback)
$$;

-- ---------------------------------------------------------------------------
-- 2. Topics — the unit that mastery is measured against.
-- ---------------------------------------------------------------------------
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]{2,64}$'),
  name_uz text not null,
  name_en text not null,
  category text not null default 'general',
  roadmap_id uuid references public.roadmaps(id) on delete set null,
  sort_order int not null default 0,
  -- null means "use the global default from mastery_settings"
  unlock_threshold int check (unlock_threshold between 0 and 1000),
  completion_threshold int check (completion_threshold between 0 and 1000),
  required_evidence_count int check (required_evidence_count >= 0),
  required_checkpoint boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_topics_roadmap_order on public.topics(roadmap_id, sort_order) where archived_at is null;

create table if not exists public.topic_prerequisites (
  topic_id uuid not null references public.topics on delete cascade,
  prerequisite_id uuid not null references public.topics on delete cascade,
  primary key (topic_id, prerequisite_id),
  check (topic_id <> prerequisite_id)
);

-- Problem -> topic mapping with weights (spec section 11).
create table if not exists public.problem_topics (
  problem_id uuid not null references public.problems on delete cascade,
  topic_id uuid not null references public.topics on delete cascade,
  weight numeric(3,2) not null default 1.00 check (weight > 0 and weight <= 1),
  is_primary boolean not null default false,
  primary key (problem_id, topic_id)
);
create unique index if not exists idx_problem_one_primary_topic
  on public.problem_topics(problem_id) where is_primary;

create table if not exists public.lesson_topics (
  lesson_id uuid not null references public.lessons on delete cascade,
  topic_id uuid not null references public.topics on delete cascade,
  weight numeric(3,2) not null default 1.00 check (weight > 0 and weight <= 1),
  primary key (lesson_id, topic_id)
);

-- ---------------------------------------------------------------------------
-- 3. Per-user mastery state and its auditable event history.
-- ---------------------------------------------------------------------------
create table if not exists public.user_topic_mastery (
  user_id uuid not null references public.profiles on delete cascade,
  topic_id uuid not null references public.topics on delete cascade,
  mastery int not null default 0 check (mastery between 0 and 1000),
  evidence_count int not null default 0,
  unlocked_at timestamptz,
  completed_at timestamptz,
  validated_at timestamptz,
  last_activity_at timestamptz,
  primary key (user_id, topic_id)
);
create index if not exists idx_mastery_user on public.user_topic_mastery(user_id, mastery desc);

do $$ begin
  create type public.mastery_source as enum ('lesson','quiz','checkpoint','problem','duel','placement','challenge','backfill','manual');
exception when duplicate_object then null; end $$;

create table if not exists public.mastery_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles on delete cascade,
  topic_id uuid not null references public.topics on delete cascade,
  source public.mastery_source not null,
  source_entity_id uuid,
  delta int not null,
  mastery_after int not null,
  -- Anti-farming: the same evidence can only ever be counted once (section 12).
  dedupe_key text not null,
  created_at timestamptz not null default now()
);
create unique index if not exists idx_mastery_dedupe on public.mastery_events(user_id, dedupe_key);
create index if not exists idx_mastery_events_user on public.mastery_events(user_id, created_at desc);

create table if not exists public.placement_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  stage text not null default 'background' check (stage in ('background','knowledge','coding','done','abandoned')),
  background jsonb not null default '{}',
  answers jsonb not null default '[]',
  coding_results jsonb not null default '[]',
  computed_level text,
  computed_mastery jsonb not null default '{}',
  started_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists idx_placement_user on public.placement_attempts(user_id, started_at desc);

-- ---------------------------------------------------------------------------
-- 4. The mastery service. This is the ONLY path that writes mastery.
--    Section 66: one authoritative implementation, never duplicated in
--    controllers or the browser.
-- ---------------------------------------------------------------------------

-- Evidence strength relative to the learner's current level (section 12):
-- material far below them teaches little; material above them proves a lot.
create or replace function public.mastery_evidence_weight(p_current int, p_difficulty int)
returns numeric language sql immutable as $$
  select case
    when p_difficulty is null then 1.0
    -- more than 200 below current mastery: minimal evidence
    when p_difficulty < p_current - 200 then 0.15
    when p_difficulty < p_current - 100 then 0.45
    when p_difficulty > p_current + 200 then 1.60
    when p_difficulty > p_current + 100 then 1.30
    else 1.0
  end::numeric
$$;

create or replace function public.record_mastery_evidence(
  p_user uuid,
  p_topic uuid,
  p_source public.mastery_source,
  p_source_entity uuid,
  p_base_gain int,
  p_difficulty int default null,
  p_weight numeric default 1.0,
  p_dedupe_key text default null
) returns int
language plpgsql security definer set search_path = public as $$
declare
  v_current int;
  v_scale int := mastery_setting_int('scale_max', 1000);
  v_unlock int;
  v_complete int;
  v_required int;
  v_delta int;
  v_key text;
  v_repeat boolean := false;
  v_ratio numeric;
  v_next int;
  v_evidence int;
begin
  if p_user is null or p_topic is null then
    raise exception 'record_mastery_evidence: user and topic are required';
  end if;

  v_key := coalesce(p_dedupe_key, p_source::text || ':' || coalesce(p_source_entity::text, 'none') || ':' || p_topic::text);

  insert into user_topic_mastery(user_id, topic_id)
  values (p_user, p_topic)
  on conflict (user_id, topic_id) do nothing;

  select mastery, evidence_count into v_current, v_evidence
  from user_topic_mastery where user_id = p_user and topic_id = p_topic for update;

  -- Already-counted evidence yields only a token amount, so repeating the
  -- same solve cannot farm mastery.
  v_repeat := exists (select 1 from mastery_events where user_id = p_user and dedupe_key = v_key);

  v_delta := round(
    p_base_gain
    * coalesce(p_weight, 1.0)
    * mastery_evidence_weight(v_current, p_difficulty)
    * case when v_repeat then (select coalesce((value #>> '{}')::numeric, 0.05) from mastery_settings where key = 'repeat_gain_ratio')
           else 1.0 end
  );

  -- Diminishing returns near the ceiling.
  if v_current > 800 then
    v_delta := round(v_delta * 0.6);
  elsif v_current > 650 then
    v_delta := round(v_delta * 0.8);
  end if;

  v_next := least(v_scale, greatest(0, v_current + v_delta));

  select coalesce(t.unlock_threshold, mastery_setting_int('unlock_threshold', 500)),
         coalesce(t.completion_threshold, mastery_setting_int('completion_threshold', 700)),
         coalesce(t.required_evidence_count, mastery_setting_int('required_evidence', 3))
    into v_unlock, v_complete, v_required
  from topics t where t.id = p_topic;

  if not v_repeat then
    v_evidence := v_evidence + 1;
  end if;

  update user_topic_mastery set
    mastery = v_next,
    evidence_count = v_evidence,
    last_activity_at = now(),
    -- Section 14: unlocks are permanent. Never clear a timestamp that is set.
    unlocked_at = coalesce(unlocked_at, case when v_next >= v_unlock then now() end),
    completed_at = coalesce(completed_at,
      case when v_next >= v_complete and v_evidence >= v_required then now() end)
  where user_id = p_user and topic_id = p_topic;

  insert into mastery_events(user_id, topic_id, source, source_entity_id, delta, mastery_after, dedupe_key)
  values (p_user, p_topic, p_source, p_source_entity, v_next - v_current, v_next, v_key)
  on conflict (user_id, dedupe_key) do nothing;

  return v_next - v_current;
end $$;

-- Mark a topic validated through a challenge-out / placement path (section 21).
create or replace function public.validate_topic(p_user uuid, p_topic uuid, p_mastery int)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into user_topic_mastery(user_id, topic_id, mastery, unlocked_at, validated_at, last_activity_at)
  values (p_user, p_topic, least(1000, greatest(0, p_mastery)), now(), now(), now())
  on conflict (user_id, topic_id) do update set
    mastery = greatest(user_topic_mastery.mastery, excluded.mastery),
    unlocked_at = coalesce(user_topic_mastery.unlocked_at, now()),
    validated_at = coalesce(user_topic_mastery.validated_at, now()),
    last_activity_at = now();
end $$;

-- Fan a solved problem out to every mapped topic, weighted (section 11).
create or replace function public.award_problem_mastery(p_user uuid, p_problem uuid, p_source public.mastery_source)
returns int language plpgsql security definer set search_path = public as $$
declare v_total int := 0; v_row record; v_difficulty int;
begin
  select case difficulty when 'easy' then 900 when 'medium' then 1300 else 1700 end
    into v_difficulty from problems where id = p_problem;

  for v_row in select topic_id, weight from problem_topics where problem_id = p_problem loop
    v_total := v_total + record_mastery_evidence(
      p_user, v_row.topic_id, p_source, p_problem,
      45, v_difficulty, v_row.weight,
      p_source::text || ':problem:' || p_problem::text || ':' || v_row.topic_id::text
    );
  end loop;
  return v_total;
end $$;

-- Section 8: roadmap mastery is derived from its topics, never stored raw.
create or replace function public.roadmap_mastery(p_user uuid, p_roadmap uuid)
returns int language sql stable security definer set search_path = public as $$
  select coalesce(round(avg(coalesce(m.mastery, 0)))::int, 0)
  from topics t
  left join user_topic_mastery m on m.topic_id = t.id and m.user_id = p_user
  where t.roadmap_id = p_roadmap and t.archived_at is null
$$;

-- Section 14: a topic is reachable either by prerequisites or by proven skill.
create or replace function public.topic_is_unlocked(p_user uuid, p_topic uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select
    -- already unlocked, permanently
    exists (select 1 from user_topic_mastery m
             where m.user_id = p_user and m.topic_id = p_topic and m.unlocked_at is not null)
    -- or mastery alone clears the bar
    or coalesce((select m.mastery from user_topic_mastery m
                  where m.user_id = p_user and m.topic_id = p_topic), 0)
       >= coalesce((select t.unlock_threshold from topics t where t.id = p_topic),
                   mastery_setting_int('unlock_threshold', 500))
    -- or every prerequisite is complete
    or (
      exists (select 1 from topic_prerequisites where topic_id = p_topic)
      and not exists (
        select 1 from topic_prerequisites tp
        left join user_topic_mastery m on m.topic_id = tp.prerequisite_id and m.user_id = p_user
        where tp.topic_id = p_topic and m.completed_at is null
      )
    )
    -- topics with no prerequisites at all are open
    or not exists (select 1 from topic_prerequisites where topic_id = p_topic)
$$;

-- ---------------------------------------------------------------------------
-- 5. Security — section 67. The browser may READ its own mastery and nothing
--    else; every write goes through the security-definer service above.
-- ---------------------------------------------------------------------------
alter table public.mastery_settings     enable row level security;
alter table public.topics               enable row level security;
alter table public.topic_prerequisites  enable row level security;
alter table public.problem_topics       enable row level security;
alter table public.lesson_topics        enable row level security;
alter table public.user_topic_mastery   enable row level security;
alter table public.mastery_events       enable row level security;
alter table public.placement_attempts   enable row level security;

drop policy if exists "read settings"       on public.mastery_settings;
drop policy if exists "read topics"         on public.topics;
drop policy if exists "read prereqs"        on public.topic_prerequisites;
drop policy if exists "read problem topics" on public.problem_topics;
drop policy if exists "read lesson topics"  on public.lesson_topics;
drop policy if exists "own mastery"         on public.user_topic_mastery;
drop policy if exists "own mastery events"  on public.mastery_events;
drop policy if exists "own placement"       on public.placement_attempts;
drop policy if exists "own placement write" on public.placement_attempts;
drop policy if exists "own placement update" on public.placement_attempts;
drop policy if exists "owner edits settings" on public.mastery_settings;
drop policy if exists "staff edits topics"  on public.topics;
drop policy if exists "staff maps problems" on public.problem_topics;

create policy "read settings"      on public.mastery_settings    for select using (true);
create policy "read topics"        on public.topics              for select using (archived_at is null);
create policy "read prereqs"       on public.topic_prerequisites for select using (true);
create policy "read problem topics" on public.problem_topics     for select using (true);
create policy "read lesson topics" on public.lesson_topics       for select using (true);
create policy "own mastery"        on public.user_topic_mastery  for select using (user_id = auth.uid());
create policy "own mastery events" on public.mastery_events      for select using (user_id = auth.uid());
create policy "own placement"      on public.placement_attempts  for select using (user_id = auth.uid());
create policy "own placement write" on public.placement_attempts for insert with check (user_id = auth.uid());
create policy "own placement update" on public.placement_attempts for update using (user_id = auth.uid());

create policy "owner edits settings" on public.mastery_settings for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'));
create policy "staff edits topics" on public.topics for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','owner')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','owner')));
create policy "staff maps problems" on public.problem_topics for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','owner')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','owner')));

-- No direct writes to mastery from any client, ever.
revoke insert, update, delete on public.user_topic_mastery from anon, authenticated;
revoke insert, update, delete on public.mastery_events      from anon, authenticated;
revoke all on function public.record_mastery_evidence(uuid, uuid, public.mastery_source, uuid, int, int, numeric, text) from anon, authenticated;
revoke all on function public.validate_topic(uuid, uuid, int) from anon, authenticated;
revoke all on function public.award_problem_mastery(uuid, uuid, public.mastery_source) from anon, authenticated;
grant execute on function public.roadmap_mastery(uuid, uuid) to authenticated;
grant execute on function public.topic_is_unlocked(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Seed topics for the roadmaps that already exist (migration 003).
-- ---------------------------------------------------------------------------
insert into public.topics(slug, name_uz, name_en, category, roadmap_id, sort_order)
select v.slug, v.uz, v.en, v.cat, r.id, v.ord
from (values
  ('complexity',        'Murakkablik tahlili',  'Complexity Analysis', 'foundations', 'foundations',       1),
  ('sorting',           'Saralash',             'Sorting',             'algorithms',  'sorting',           1),
  ('binary-search',     'Binary Search',        'Binary Search',       'algorithms',  'binary-search',     1),
  ('binary-search-answer','Javob bo''yicha qidiruv','Binary Search on Answer','algorithms','binary-search', 2),
  ('two-pointers',      'Two Pointers',         'Two Pointers',        'algorithms',  'two-pointers',      1),
  ('sliding-window',    'Sliding Window',       'Sliding Window',      'algorithms',  'two-pointers',      2),
  ('prefix-sum',        'Prefix Sum',           'Prefix Sum',          'algorithms',  'two-pointers',      3),
  ('greedy',            'Greedy',               'Greedy',              'algorithms',  'greedy',            1),
  ('recursion',         'Rekursiya',            'Recursion',           'algorithms',  'backtracking',      1),
  ('backtracking',      'Backtracking',         'Backtracking',        'algorithms',  'backtracking',      2),
  ('stacks-queues',     'Stack va Queue',       'Stacks and Queues',   'structures',  'data-structures',   1),
  ('heaps',             'Heap',                 'Heaps',               'structures',  'data-structures',   2),
  ('dsu',               'DSU',                  'Disjoint Set Union',  'structures',  'data-structures',   3),
  ('fenwick',           'Fenwick Tree',         'Fenwick Tree',        'structures',  'data-structures',   4),
  ('segment-tree',      'Segment Tree',         'Segment Tree',        'structures',  'data-structures',   5),
  ('graph-basics',      'Graf asoslari',        'Graph Basics',        'graphs',      'graphs',            1),
  ('bfs',               'BFS',                  'BFS',                 'graphs',      'graphs',            2),
  ('dfs',               'DFS',                  'DFS',                 'graphs',      'graphs',            3),
  ('topological-sort',  'Topologik tartib',     'Topological Sort',    'graphs',      'graphs',            4),
  ('shortest-paths',    'Eng qisqa yo''llar',   'Shortest Paths',      'graphs',      'graphs',            5),
  ('mst',               'MST',                  'Minimum Spanning Tree','graphs',     'graphs',            6),
  ('tree-basics',       'Daraxt asoslari',      'Tree Basics',         'graphs',      'trees',             1),
  ('lca',               'LCA',                  'Lowest Common Ancestor','graphs',    'trees',             2),
  ('tree-dp',           'Tree DP',              'Tree DP',             'graphs',      'trees',             3),
  ('dp-basics',         'DP asoslari',          'DP Fundamentals',     'dp',          'dynamic-programming', 1),
  ('knapsack',          'Knapsack',             'Knapsack',            'dp',          'dynamic-programming', 2),
  ('lis-lcs',           'LIS va LCS',           'LIS and LCS',         'dp',          'dynamic-programming', 3),
  ('grid-dp',           'Grid DP',              'Grid DP',             'dp',          'dynamic-programming', 4),
  ('bitmask-dp',        'Bitmask DP',           'Bitmask DP',          'dp',          'dynamic-programming', 5),
  ('string-basics',     'Satr asoslari',        'String Basics',       'strings',     'strings',           1),
  ('hashing',           'Hashing',              'Hashing',             'strings',     'strings',           2),
  ('kmp',               'KMP',                  'KMP',                 'strings',     'strings',           3),
  ('modular-arithmetic','Modul arifmetikasi',   'Modular Arithmetic',  'math',        'math',              1),
  ('primes',            'Tub sonlar',           'Primes and Sieve',    'math',        'math',              2),
  ('combinatorics',     'Kombinatorika',        'Combinatorics',       'math',        'math',              3)
) as v(slug, uz, en, cat, roadmap_slug, ord)
join public.roadmaps r on r.slug = v.roadmap_slug
on conflict (slug) do update set
  name_uz = excluded.name_uz, name_en = excluded.name_en,
  category = excluded.category, roadmap_id = excluded.roadmap_id, sort_order = excluded.sort_order;

-- Prerequisite edges (section 14).
insert into public.topic_prerequisites(topic_id, prerequisite_id)
select t.id, p.id from (values
  ('binary-search','sorting'),
  ('binary-search-answer','binary-search'),
  ('sliding-window','two-pointers'),
  ('greedy','sorting'),
  ('backtracking','recursion'),
  ('dsu','stacks-queues'),
  ('fenwick','stacks-queues'),
  ('segment-tree','fenwick'),
  ('bfs','graph-basics'),
  ('dfs','graph-basics'),
  ('topological-sort','dfs'),
  ('shortest-paths','bfs'),
  ('mst','dsu'),
  ('tree-basics','dfs'),
  ('lca','tree-basics'),
  ('tree-dp','tree-basics'),
  ('knapsack','dp-basics'),
  ('lis-lcs','dp-basics'),
  ('grid-dp','dp-basics'),
  ('bitmask-dp','knapsack'),
  ('kmp','string-basics'),
  ('hashing','string-basics'),
  ('combinatorics','modular-arithmetic')
) as v(topic_slug, prereq_slug)
join public.topics t on t.slug = v.topic_slug
join public.topics p on p.slug = v.prereq_slug
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- 7. Backfill for existing users (section 22) — derive mastery from real
--    history only. Where there is no evidence, leave the score at zero rather
--    than inventing one.
-- ---------------------------------------------------------------------------
create or replace function public.backfill_topic_mastery()
returns int language plpgsql security definer set search_path = public as $$
declare v_row record; v_count int := 0;
begin
  for v_row in
    select distinct s.user_id, s.problem_id
    from submissions s
    where s.status = 'accepted'
      and exists (select 1 from problem_topics pt where pt.problem_id = s.problem_id)
  loop
    perform award_problem_mastery(v_row.user_id, v_row.problem_id, 'backfill');
    v_count := v_count + 1;
  end loop;

  for v_row in
    select distinct c.user_id, lt.topic_id
    from lesson_completions c
    join lesson_topics lt on lt.lesson_id = c.lesson_id
    where c.completed_at is not null
  loop
    perform record_mastery_evidence(
      v_row.user_id, v_row.topic_id, 'backfill', null, 25, null, 1.0,
      'backfill:lesson:' || v_row.topic_id::text
    );
    v_count := v_count + 1;
  end loop;

  return v_count;
end $$;

revoke all on function public.backfill_topic_mastery() from anon, authenticated;
