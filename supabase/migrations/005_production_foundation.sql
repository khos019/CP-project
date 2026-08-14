-- AlgoYo‘l production foundation.
-- Apply after 001-004. This migration is additive and intentionally leaves old data intact.

alter table public.profiles add column if not exists peak_duel_rating integer not null default 1200;
alter table public.profiles add column if not exists onboarding_completed_at timestamptz;
alter table public.profiles add column if not exists suspended_until timestamptz;
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

-- System-authored problems are allowed. Ownership still applies to user-authored content.
alter table public.problems alter column author_id drop not null;
alter table public.problems add column if not exists problem_key text unique;
alter table public.problems add column if not exists primary_topic_slug text;

-- Judge submissions may reference a stable system problem key before an editable problem row exists.
alter table public.submissions alter column problem_id drop not null;
alter table public.submissions add column if not exists problem_key text;
alter table public.submissions add column if not exists context text not null default 'practice'
  check (context in ('practice','duel','placement','challenge'));
alter table public.submissions add column if not exists client_request_id uuid;
alter table public.submissions add column if not exists unit_key text;
create unique index if not exists idx_submissions_user_request
  on public.submissions(user_id, client_request_id) where client_request_id is not null;

-- Duel stages reference the immutable judge key. Keeping problem_id nullable preserves
-- historical rows while allowing system-authored judge tasks.
alter table public.duel_problems alter column problem_id drop not null;
alter table public.duel_problems add column if not exists problem_key text;
create unique index if not exists idx_duel_problem_key
  on public.duel_problems(duel_id, problem_key) where problem_key is not null;

create table if not exists public.topics (
  slug text primary key,
  title_uz text not null,
  title_en text not null,
  unlock_threshold integer not null default 450 check (unlock_threshold between 0 and 1000),
  completion_threshold integer not null default 700 check (completion_threshold between 0 and 1000),
  advanced_threshold integer not null default 850 check (advanced_threshold between 0 and 1000),
  created_at timestamptz not null default now(),
  check (unlock_threshold <= completion_threshold and completion_threshold <= advanced_threshold)
);

create table if not exists public.problem_topics (
  problem_id uuid not null references public.problems on delete cascade,
  topic_slug text not null references public.topics on delete cascade,
  weight numeric(4,3) not null default 1 check (weight > 0 and weight <= 1),
  is_primary boolean not null default false,
  primary key(problem_id, topic_slug)
);
create table if not exists public.topic_prerequisites (
  topic_slug text not null references public.topics on delete cascade,
  prerequisite_slug text not null references public.topics on delete cascade,
  primary key(topic_slug, prerequisite_slug),
  check(topic_slug <> prerequisite_slug)
);
create unique index if not exists idx_problem_topics_one_primary
  on public.problem_topics(problem_id) where is_primary;

create table if not exists public.user_topic_mastery (
  user_id uuid not null references public.profiles on delete cascade,
  topic_slug text not null references public.topics on delete cascade,
  score integer not null default 0 check (score between 0 and 1000),
  evidence_count integer not null default 0 check (evidence_count >= 0),
  unlocked_at timestamptz,
  validated_at timestamptz,
  last_activity_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key(user_id, topic_slug)
);

create table if not exists public.mastery_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  topic_slug text not null references public.topics on delete cascade,
  source text not null check (source in ('lesson','quiz','problem','duel','placement','challenge','migration')),
  source_key text not null,
  score_before integer not null check (score_before between 0 and 1000),
  score_after integer not null check (score_after between 0 and 1000),
  delta integer generated always as (score_after - score_before) stored,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(user_id, topic_slug, source, source_key)
);

create table if not exists public.user_learning_state (
  user_id uuid not null references public.profiles on delete cascade,
  unit_key text not null,
  topic_slug text not null references public.topics on delete cascade,
  quiz_score integer check (quiz_score between 0 and 100),
  quiz_passed_at timestamptz,
  problem_accepted_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key(user_id, unit_key)
);

create table if not exists public.roadmap_unlocks (
  user_id uuid not null references public.profiles on delete cascade,
  topic_slug text not null references public.topics on delete cascade,
  source text not null check (source in ('prerequisite','mastery','placement','challenge','migration')),
  unlocked_at timestamptz not null default now(),
  primary key(user_id, topic_slug)
);

create table if not exists public.placement_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  answers jsonb not null default '{}',
  coding_results jsonb not null default '{}',
  calculated_mastery jsonb not null default '{}',
  recommended_topic text references public.topics(slug),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_permissions (
  user_id uuid not null references public.profiles on delete cascade,
  permission text not null,
  granted_by uuid not null references public.profiles,
  granted_at timestamptz not null default now(),
  primary key(user_id, permission)
);

create table if not exists public.platform_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.profiles,
  updated_at timestamptz not null default now()
);

create table if not exists public.api_rate_limits (
  key text primary key,
  bucket_start timestamptz not null,
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now()
);

create index if not exists idx_mastery_events_user_created on public.mastery_events(user_id, created_at desc);
create index if not exists idx_mastery_topic_score on public.user_topic_mastery(topic_slug, score desc);
create index if not exists idx_learning_state_user_topic on public.user_learning_state(user_id, topic_slug);
create index if not exists idx_placement_attempts_user on public.placement_attempts(user_id, created_at desc);

alter table public.topics enable row level security;
alter table public.problem_topics enable row level security;
alter table public.topic_prerequisites enable row level security;
alter table public.user_topic_mastery enable row level security;
alter table public.mastery_events enable row level security;
alter table public.user_learning_state enable row level security;
alter table public.roadmap_unlocks enable row level security;
alter table public.placement_attempts enable row level security;
alter table public.admin_permissions enable row level security;
alter table public.platform_settings enable row level security;
alter table public.api_rate_limits enable row level security;

drop policy if exists "topics public read" on public.topics;
create policy "topics public read" on public.topics for select using (true);
drop policy if exists "problem topics public read" on public.problem_topics;
create policy "problem topics public read" on public.problem_topics for select using (true);
drop policy if exists "topic prerequisites public read" on public.topic_prerequisites;
create policy "topic prerequisites public read" on public.topic_prerequisites for select using (true);
drop policy if exists "own topic mastery read" on public.user_topic_mastery;
create policy "own topic mastery read" on public.user_topic_mastery for select using (user_id = auth.uid());
drop policy if exists "own mastery events read" on public.mastery_events;
create policy "own mastery events read" on public.mastery_events for select using (user_id = auth.uid());
drop policy if exists "own learning state read" on public.user_learning_state;
create policy "own learning state read" on public.user_learning_state for select using (user_id = auth.uid());
drop policy if exists "own roadmap unlocks read" on public.roadmap_unlocks;
create policy "own roadmap unlocks read" on public.roadmap_unlocks for select using (user_id = auth.uid());
drop policy if exists "own placement attempts read" on public.placement_attempts;
create policy "own placement attempts read" on public.placement_attempts for select using (user_id = auth.uid());
drop policy if exists "own permissions read" on public.admin_permissions;
create policy "own permissions read" on public.admin_permissions for select using (user_id = auth.uid());
drop policy if exists "settings public read" on public.platform_settings;
create policy "settings public read" on public.platform_settings for select using (true);

create or replace function public.consume_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  bucket timestamptz;
  next_count integer;
begin
  if length(p_key) > 200 or p_limit < 1 or p_window_seconds < 1 then raise exception 'invalid_rate_limit'; end if;
  bucket := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  insert into public.api_rate_limits(key, bucket_start, request_count, updated_at)
    values(p_key, bucket, 1, now())
    on conflict(key) do update set
      bucket_start = case when api_rate_limits.bucket_start = bucket then api_rate_limits.bucket_start else bucket end,
      request_count = case when api_rate_limits.bucket_start = bucket then api_rate_limits.request_count + 1 else 1 end,
      updated_at = now()
    returning request_count into next_count;
  return next_count <= p_limit;
end
$$;
revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;

-- Users may edit public profile fields only. Role/rating/suspension remain server-owned.
drop policy if exists "public profiles" on public.profiles;
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles for select using (auth.uid() = id);
revoke update on public.profiles from anon, authenticated;
grant update(username, display_name, avatar_url, preferred_language) on public.profiles to authenticated;
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Submissions are created by the judge service after a verified result, never directly by browsers.
drop policy if exists "own submission insert" on public.submissions;
revoke insert, update, delete on public.submissions from anon, authenticated;
revoke all on public.problem_tests from anon, authenticated;
revoke insert, update, delete on public.user_topic_mastery, public.mastery_events,
  public.user_learning_state, public.roadmap_unlocks, public.placement_attempts,
  public.rating_history, public.duel_participants, public.duel_problems, public.duels,
  public.api_rate_limits from anon, authenticated;

-- Quiz choices are public, answer flags are server-only.
revoke select on public.quiz_options from public, anon, authenticated;
grant select(id, quiz_id, text_uz, text_en, sort_order) on public.quiz_options to anon, authenticated;
revoke all on function public.refresh_lesson_completion(uuid) from public, anon;

-- Do not hard-code owner email addresses in version control. Supabase app_metadata or an
-- explicit one-time SQL promotion is the source of owner authority.
create or replace function public.bootstrap_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare requested_role public.user_role;
begin
  requested_role := case
    when new.raw_app_meta_data->>'role' in ('owner','admin')
      then (new.raw_app_meta_data->>'role')::public.user_role
    else 'user'::public.user_role
  end;
  insert into public.profiles(id, username, display_name, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'username',''), 'user_' || substr(new.id::text,1,8)),
    coalesce(new.raw_user_meta_data->>'display_name',''),
    requested_role
  )
  on conflict (id) do nothing;
  return new;
end
$$;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.has_permission(p_permission text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    public.current_user_role() = 'owner'
    or (public.current_user_role() = 'admin' and (
      p_permission = any(array[
        'problem.create','problem.update','problem.publish','problem.manage_topics','problem.manage_testcases',
        'submission.view_all','submission.view_source','user.view','moderation.basic','content.view_management'
      ]::text[])
      or exists(select 1 from public.admin_permissions where user_id = auth.uid() and permission = p_permission)
    )), false
  )
$$;

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;
revoke all on function public.has_permission(text) from public;
grant execute on function public.has_permission(text) to authenticated;

create or replace function public.set_user_role(p_user uuid, p_role public.user_role)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare old_role public.user_role;
begin
  if public.current_user_role() <> 'owner' then raise exception 'owner_required'; end if;
  if p_user = auth.uid() then raise exception 'owner_cannot_change_own_role'; end if;
  select role into old_role from public.profiles where id = p_user for update;
  if old_role is null then raise exception 'profile_not_found'; end if;
  update public.profiles set role = p_role, updated_at = now() where id = p_user;
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'role.set', 'profile', p_user, jsonb_build_object('before', old_role, 'after', p_role));
end
$$;
revoke all on function public.set_user_role(uuid, public.user_role) from public;
grant execute on function public.set_user_role(uuid, public.user_role) to authenticated;

create or replace function public.set_admin_permission(p_user uuid, p_permission text, p_enabled boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.current_user_role() <> 'owner' then raise exception 'owner_required'; end if;
  if not exists(select 1 from public.profiles where id = p_user and role = 'admin') then
    raise exception 'admin_required';
  end if;
  if p_enabled then
    insert into public.admin_permissions(user_id, permission, granted_by)
    values (p_user, p_permission, auth.uid())
    on conflict(user_id, permission) do update set granted_by = excluded.granted_by, granted_at = now();
  else
    delete from public.admin_permissions where user_id = p_user and permission = p_permission;
  end if;
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'permission.set', 'profile', p_user,
    jsonb_build_object('permission', p_permission, 'enabled', p_enabled));
end
$$;
revoke all on function public.set_admin_permission(uuid, text, boolean) from public;
grant execute on function public.set_admin_permission(uuid, text, boolean) to authenticated;

create or replace function public.suspend_user(p_user uuid, p_until timestamptz)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare previous_until timestamptz;
begin
  if not public.has_permission('user.suspend') then raise exception 'permission_denied'; end if;
  if p_user = auth.uid() then raise exception 'cannot_suspend_self'; end if;
  select suspended_until into previous_until from public.profiles where id = p_user for update;
  if not found then raise exception 'profile_not_found'; end if;
  update public.profiles set suspended_until = p_until, updated_at = now() where id = p_user;
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, metadata)
    values(auth.uid(), case when p_until is null then 'user.unsuspend' else 'user.suspend' end, 'profile', p_user,
      jsonb_build_object('before', previous_until, 'after', p_until));
end
$$;
revoke all on function public.suspend_user(uuid, timestamptz) from public;
grant execute on function public.suspend_user(uuid, timestamptz) to authenticated;

create or replace function public.update_platform_setting(p_key text, p_value jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare previous_value jsonb;
begin
  if not public.has_permission('settings.manage') then raise exception 'permission_denied'; end if;
  if p_key not in ('mastery','duel') then raise exception 'unknown_setting'; end if;
  if p_key = 'mastery' then
    if not (p_value ?& array['unlock','complete','advanced','weights'])
      or (p_value->>'unlock')::integer < 0
      or (p_value->>'advanced')::integer > 1000
      or (p_value->>'unlock')::integer > (p_value->>'complete')::integer
      or (p_value->>'complete')::integer > (p_value->>'advanced')::integer then
      raise exception 'invalid_mastery_setting';
    end if;
  elsif not (p_value ?& array['durationSeconds','problemCount','ratingK','enabled'])
    or (p_value->>'durationSeconds')::integer not between 60 and 7200
    or (p_value->>'problemCount')::integer not between 1 and 10
    or (p_value->>'ratingK')::integer not between 1 and 64
    or jsonb_typeof(p_value->'enabled') <> 'boolean' then
    raise exception 'invalid_duel_setting';
  end if;
  select value into previous_value from public.platform_settings where key = p_key for update;
  insert into public.platform_settings(key, value, updated_by, updated_at)
    values(p_key, p_value, auth.uid(), now())
    on conflict(key) do update set value = excluded.value, updated_by = excluded.updated_by, updated_at = excluded.updated_at;
  if p_key = 'mastery' then
    update public.topics set
      unlock_threshold = (p_value->>'unlock')::integer,
      completion_threshold = (p_value->>'complete')::integer,
      advanced_threshold = (p_value->>'advanced')::integer;
  end if;
  insert into public.audit_logs(actor_id, action, entity_type, metadata)
    values(auth.uid(), 'setting.update', 'platform_setting', jsonb_build_object('key', p_key, 'before', previous_value, 'after', p_value));
end
$$;
revoke all on function public.update_platform_setting(text, jsonb) from public;
grant execute on function public.update_platform_setting(text, jsonb) to authenticated;

-- Only trusted server code may award evidence. The unique event key makes retries idempotent.
create or replace function public.apply_mastery_evidence(
  p_user uuid,
  p_topic_slug text,
  p_source text,
  p_source_key text,
  p_delta integer,
  p_metadata jsonb default '{}'
)
returns table(score integer, applied_delta integer, newly_unlocked boolean, newly_validated boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  before_score integer;
  after_score integer;
  unlock_at integer;
  complete_at integer;
  inserted_event uuid;
  was_unlocked boolean;
  was_validated boolean;
  effective_delta integer;
  repeated_problem_count integer := 0;
  evidence_problem_key text;
begin
  if p_delta < 0 or p_delta > 300 then raise exception 'invalid_mastery_delta'; end if;
  if p_source not in ('lesson','quiz','problem','duel','placement','challenge','migration') then
    raise exception 'invalid_mastery_source';
  end if;
  select unlock_threshold, completion_threshold into unlock_at, complete_at
    from public.topics where slug = p_topic_slug;
  if unlock_at is null then raise exception 'unknown_topic'; end if;

  insert into public.user_topic_mastery(user_id, topic_slug)
    values (p_user, p_topic_slug) on conflict do nothing;
  select m.score, m.unlocked_at is not null, m.validated_at is not null
    into before_score, was_unlocked, was_validated
    from public.user_topic_mastery m
    where m.user_id = p_user and m.topic_slug = p_topic_slug for update;

  effective_delta := p_delta;
  evidence_problem_key := nullif(p_metadata->>'problemKey', '');
  if evidence_problem_key is not null and p_source in ('problem','duel','placement','challenge') then
    select count(*) into repeated_problem_count
      from public.mastery_events
      where user_id = p_user and topic_slug = p_topic_slug
        and metadata->>'problemKey' = evidence_problem_key;
    effective_delta := case
      when repeated_problem_count = 0 then p_delta
      when repeated_problem_count = 1 then round(p_delta * 0.25)::integer
      else 0
    end;
  end if;

  after_score := least(1000, before_score + effective_delta);
  insert into public.mastery_events(user_id, topic_slug, source, source_key, score_before, score_after, metadata)
    values (p_user, p_topic_slug, p_source, p_source_key, before_score, after_score, coalesce(p_metadata,'{}'))
    on conflict(user_id, topic_slug, source, source_key) do nothing
    returning id into inserted_event;

  if inserted_event is null then
    return query select before_score, 0, false, false;
    return;
  end if;

  update public.user_topic_mastery
    set score = after_score,
        evidence_count = evidence_count + 1,
        unlocked_at = case when unlocked_at is null and after_score >= unlock_at then now() else unlocked_at end,
        validated_at = case when validated_at is null and after_score >= complete_at then now() else validated_at end,
        last_activity_at = now(),
        updated_at = now()
    where user_id = p_user and topic_slug = p_topic_slug;

  if after_score >= unlock_at then
    insert into public.roadmap_unlocks(user_id, topic_slug, source)
      values (p_user, p_topic_slug,
        case when p_source = 'placement' then 'placement'
             when p_source = 'challenge' then 'challenge'
             when p_source = 'migration' then 'migration'
             else 'mastery' end)
      on conflict(user_id, topic_slug) do nothing;
  end if;

  return query select after_score, after_score - before_score,
    (not was_unlocked and after_score >= unlock_at),
    (not was_validated and after_score >= complete_at);
end
$$;
revoke all on function public.apply_mastery_evidence(uuid, text, text, text, integer, jsonb) from public, authenticated;
grant execute on function public.apply_mastery_evidence(uuid, text, text, text, integer, jsonb) to service_role;

create or replace function public.record_quiz_result(
  p_user uuid,
  p_unit_key text,
  p_topic_slug text,
  p_score integer,
  p_mastery_delta integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare mastery_result record;
begin
  if p_score not in (0, 100) then raise exception 'invalid_quiz_score'; end if;
  insert into public.user_learning_state(
    user_id, unit_key, topic_slug, quiz_score, quiz_passed_at, updated_at
  ) values (
    p_user, p_unit_key, p_topic_slug, p_score,
    case when p_score >= 70 then now() end, now()
  )
  on conflict(user_id, unit_key) do update
    set quiz_score = greatest(coalesce(user_learning_state.quiz_score, 0), excluded.quiz_score),
        quiz_passed_at = coalesce(user_learning_state.quiz_passed_at, excluded.quiz_passed_at),
        completed_at = case
          when coalesce(user_learning_state.quiz_passed_at, excluded.quiz_passed_at) is not null
           and user_learning_state.problem_accepted_at is not null
          then coalesce(user_learning_state.completed_at, now())
          else user_learning_state.completed_at
        end,
        updated_at = now();

  if p_score >= 70 then
    select * into mastery_result from public.apply_mastery_evidence(
      p_user, p_topic_slug, 'quiz', 'quiz:' || p_unit_key, p_mastery_delta,
      jsonb_build_object('unitKey', p_unit_key, 'score', p_score)
    );
    return jsonb_build_object(
      'score', mastery_result.score,
      'delta', mastery_result.applied_delta,
      'newlyUnlocked', mastery_result.newly_unlocked,
      'newlyValidated', mastery_result.newly_validated
    );
  end if;
  return jsonb_build_object('score', null, 'delta', 0, 'newlyUnlocked', false, 'newlyValidated', false);
end
$$;
revoke all on function public.record_quiz_result(uuid, text, text, integer, integer) from public, authenticated;
grant execute on function public.record_quiz_result(uuid, text, text, integer, integer) to service_role;

create or replace function public.complete_placement(
  p_user uuid,
  p_answers jsonb,
  p_coding_results jsonb,
  p_mastery jsonb,
  p_recommended text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  attempt_id uuid;
  entry record;
  award integer;
begin
  if exists(select 1 from public.profiles where id = p_user and onboarding_completed_at is not null) then
    raise exception 'placement_already_completed';
  end if;
  insert into public.placement_attempts(user_id, answers, coding_results, calculated_mastery, recommended_topic, completed_at)
    values(p_user, coalesce(p_answers,'{}'), coalesce(p_coding_results,'{}'), coalesce(p_mastery,'{}'), p_recommended, now())
    returning id into attempt_id;
  for entry in select key, value from jsonb_each(coalesce(p_mastery,'{}')) loop
    award := least(300, greatest(0, (entry.value #>> '{}')::integer));
    if award > 0 then
      perform public.apply_mastery_evidence(
        p_user, entry.key, 'placement', 'placement:' || attempt_id::text || ':' || entry.key,
        award, jsonb_build_object('attemptId', attempt_id)
      );
    end if;
  end loop;
  update public.profiles set onboarding_completed_at = now(), updated_at = now() where id = p_user;
  return attempt_id;
end
$$;
revoke all on function public.complete_placement(uuid, jsonb, jsonb, jsonb, text) from public, authenticated;
grant execute on function public.complete_placement(uuid, jsonb, jsonb, jsonb, text) to service_role;

create or replace function public.after_verified_submission()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status <> 'accepted' then return new; end if;

  if new.unit_key is not null then
    insert into public.user_learning_state(
      user_id, unit_key, topic_slug, problem_accepted_at, completed_at, updated_at
    ) values (
      new.user_id,
      new.unit_key,
      coalesce((select primary_topic_slug from public.problems where id = new.problem_id),
               (select slug from public.topics where slug = regexp_replace(new.unit_key, '-[0-9]+$', '')),
               'foundations'),
      now(),
      null,
      now()
    )
    on conflict(user_id, unit_key) do update
      set problem_accepted_at = coalesce(user_learning_state.problem_accepted_at, excluded.problem_accepted_at),
          completed_at = case
            when user_learning_state.quiz_passed_at is not null
            then coalesce(user_learning_state.completed_at, now())
            else user_learning_state.completed_at
          end,
          updated_at = now();
  end if;

  if not exists (
    select 1 from public.submissions older
    where older.user_id = new.user_id
      and older.status = 'accepted'
      and older.id <> new.id
      and coalesce(older.problem_key, older.problem_id::text) = coalesce(new.problem_key, new.problem_id::text)
  ) then
    update public.profiles
      set solved_count = solved_count + 1, updated_at = now()
      where id = new.user_id;
  end if;
  return new;
end
$$;
drop trigger if exists on_verified_submission on public.submissions;
create trigger on_verified_submission
  after insert on public.submissions
  for each row execute function public.after_verified_submission();

-- Correct recursive duel RLS policies by using a definer helper.
create or replace function public.is_duel_participant(p_duel uuid, p_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select exists(select 1 from public.duel_participants where duel_id = p_duel and user_id = p_user) $$;
revoke all on function public.is_duel_participant(uuid, uuid) from public;
grant execute on function public.is_duel_participant(uuid, uuid) to authenticated, service_role;

drop policy if exists "duel participant read" on public.duels;
create policy "duel participant read" on public.duels for select using (public.is_duel_participant(id));
drop policy if exists "participant rows" on public.duel_participants;
create policy "participant rows" on public.duel_participants for select using (public.is_duel_participant(duel_id));
drop policy if exists "sanitized duel problems" on public.duel_problems;
create policy "sanitized duel problems" on public.duel_problems for select using (
  public.is_duel_participant(duel_id)
  and stage <= (select current_stage from public.duels where id = duel_id)
);

-- Atomic matchmaking. The advisory lock prevents two requests pairing the same user.
create or replace function public.join_duel_queue()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  my_rating integer;
  opponent uuid;
  opponent_rating integer;
  match_id uuid;
  duration_seconds integer;
  duel_enabled boolean;
begin
  if me is null then raise exception 'authentication_required'; end if;
  if exists(select 1 from public.profiles where id = me and suspended_until > now()) then
    raise exception 'account_suspended';
  end if;
  select coalesce((value->>'enabled')::boolean, false), coalesce((value->>'durationSeconds')::integer, 1800)
    into duel_enabled, duration_seconds from public.platform_settings where key = 'duel';
  if not coalesce(duel_enabled, false) then raise exception 'duel_disabled'; end if;

  select dp.duel_id into match_id
    from public.duel_participants dp join public.duels d on d.id = dp.duel_id
    where dp.user_id = me and d.status in ('waiting','active') and coalesce(d.ends_at, now() + interval '1 minute') > now()
    order by d.created_at desc limit 1;
  if match_id is not null then return jsonb_build_object('status','matched','duelId',match_id); end if;

  perform pg_advisory_xact_lock(hashtext('algoyol-duel-matchmaking'));
  delete from public.matchmaking_entries where created_at < now() - interval '10 minutes';
  select duel_rating into my_rating from public.profiles where id = me for update;
  if my_rating is null then raise exception 'profile_not_found'; end if;

  select q.user_id, q.rating into opponent, opponent_rating
    from public.matchmaking_entries q
    where q.user_id <> me
      and abs(q.rating - my_rating) <= least(500, 100 + floor(extract(epoch from (now() - q.created_at)) / 10)::integer * 25)
    order by abs(q.rating - my_rating), q.created_at
    for update skip locked limit 1;

  if opponent is null then
    insert into public.matchmaking_entries(user_id, rating, created_at)
      values(me, my_rating, now())
      on conflict(user_id) do update set rating = excluded.rating, created_at = excluded.created_at;
    return jsonb_build_object('status','queued');
  end if;

  delete from public.matchmaking_entries where user_id in (me, opponent);
  insert into public.duels(status, started_at, ends_at, current_stage)
    values('active', now(), now() + make_interval(secs => duration_seconds), 0)
    returning id into match_id;
  insert into public.duel_participants(duel_id, user_id, rating_before)
    values(match_id, me, my_rating), (match_id, opponent, opponent_rating);
  insert into public.duel_problems(duel_id, stage, problem_key, points)
    values(match_id, 0, 'sum-two', 100), (match_id, 1, 'max-subarray', 200), (match_id, 2, 'coin-change', 300);
  return jsonb_build_object('status','matched','duelId',match_id);
end
$$;
revoke all on function public.join_duel_queue() from public;
grant execute on function public.join_duel_queue() to authenticated;

create or replace function public.leave_duel_queue()
returns void
language sql
security definer
set search_path = public
as $$ delete from public.matchmaking_entries where user_id = auth.uid() $$;
revoke all on function public.leave_duel_queue() from public;
grant execute on function public.leave_duel_queue() to authenticated;

-- Finalize exactly once and keep competitive ELO separate from topic mastery.
create or replace function public.finalize_duel(p_duel uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  first_player record;
  second_player record;
  expected_first numeric;
  actual_first numeric;
  next_first integer;
  next_second integer;
  k_factor integer;
begin
  select * into first_player from public.duel_participants where duel_id = p_duel order by user_id limit 1;
  select * into second_player from public.duel_participants where duel_id = p_duel and user_id <> first_player.user_id limit 1;
  if first_player.user_id is null or second_player.user_id is null then return; end if;
  if exists(select 1 from public.rating_history where duel_id = p_duel) then return; end if;

  select coalesce((value->>'ratingK')::integer, 32) into k_factor from public.platform_settings where key = 'duel';
  expected_first := 1.0 / (1.0 + power(10.0, (second_player.rating_before - first_player.rating_before)::numeric / 400.0));
  actual_first := case when first_player.score > second_player.score then 1.0 when first_player.score < second_player.score then 0.0 else 0.5 end;
  next_first := greatest(0, round(first_player.rating_before + k_factor * (actual_first - expected_first))::integer);
  next_second := greatest(0, round(second_player.rating_before + k_factor * ((1.0 - actual_first) - (1.0 - expected_first)))::integer);

  insert into public.rating_history(duel_id, user_id, rating_before, rating_after)
    values(p_duel, first_player.user_id, first_player.rating_before, next_first),
          (p_duel, second_player.user_id, second_player.rating_before, next_second)
    on conflict(duel_id, user_id) do nothing;
  update public.duel_participants set rating_after = case when user_id = first_player.user_id then next_first else next_second end where duel_id = p_duel;
  update public.profiles set
    duel_rating = case when id = first_player.user_id then next_first else next_second end,
    peak_duel_rating = greatest(peak_duel_rating, case when id = first_player.user_id then next_first else next_second end),
    updated_at = now()
    where id in (first_player.user_id, second_player.user_id);
  update public.duels set status = 'finished', finished_at = coalesce(finished_at, now()) where id = p_duel;
end
$$;
revoke all on function public.finalize_duel(uuid) from public, authenticated;
grant execute on function public.finalize_duel(uuid) to service_role;

-- Called only by the application server after an Accepted Judge0 submission has been persisted.
revoke all on function public.claim_duel_problem(uuid, integer, uuid) from public, anon, authenticated;
create or replace function public.settle_duel_submission(p_submission uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  submitted public.submissions%rowtype;
  duel_row public.duels%rowtype;
  stage_row public.duel_problems%rowtype;
  claimed_rows integer;
begin
  select * into submitted from public.submissions where id = p_submission for update;
  if submitted.id is null or submitted.status <> 'accepted' or submitted.context <> 'duel' or submitted.duel_id is null then
    raise exception 'verified_duel_submission_required';
  end if;
  if not exists(select 1 from public.duel_participants where duel_id = submitted.duel_id and user_id = submitted.user_id) then
    raise exception 'not_a_duel_participant';
  end if;
  select * into duel_row from public.duels where id = submitted.duel_id for update;
  if duel_row.status <> 'active' or now() > duel_row.ends_at then
    perform public.finalize_duel(submitted.duel_id);
    return jsonb_build_object('claimed',false,'reason','duel_finished');
  end if;
  select * into stage_row from public.duel_problems
    where duel_id = submitted.duel_id and problem_key = submitted.problem_key for update;
  if stage_row.duel_id is null or stage_row.stage > duel_row.current_stage then
    return jsonb_build_object('claimed',false,'reason','stage_locked');
  end if;
  update public.duel_problems set claimed_by = submitted.user_id, claimed_at = now()
    where duel_id = submitted.duel_id and stage = stage_row.stage and claimed_by is null;
  get diagnostics claimed_rows = row_count;
  if claimed_rows = 1 then
    update public.duel_participants set score = score + stage_row.points
      where duel_id = submitted.duel_id and user_id = submitted.user_id;
    update public.duels set current_stage = least(3, current_stage + 1) where id = submitted.duel_id;
    if stage_row.stage = 2 then perform public.finalize_duel(submitted.duel_id); end if;
  end if;
  return jsonb_build_object('claimed',claimed_rows = 1,'stage',stage_row.stage,'points',case when claimed_rows = 1 then stage_row.points else 0 end);
end
$$;
revoke all on function public.settle_duel_submission(uuid) from public, authenticated;
grant execute on function public.settle_duel_submission(uuid) to service_role;

-- Seed stable topics used by the repository curriculum.
insert into public.topics(slug, title_uz, title_en) values
('programming-basics','Dasturlash asoslari','Programming Basics'),
('foundations','Asoslar va murakkablik','Foundations & Complexity'),
('sorting','Saralash algoritmlari','Sorting Algorithms'),
('backtracking','Rekursiya va backtracking','Recursion & Backtracking'),
('math','Matematika va sonlar nazariyasi','Math & Number Theory'),
('data-structures','Ma’lumot tuzilmalari','Data Structures'),
('binary-search','Ikkilik qidiruv','Binary Search'),
('greedy','Ochko‘z algoritmlar','Greedy Algorithms'),
('graphs','Graf algoritmlari','Graph Algorithms'),
('strings','Satr algoritmlari','String Algorithms'),
('geometry','Hisoblash geometriyasi','Computational Geometry'),
('two-pointers','Ikki ko‘rsatkich va oyna','Two Pointers & Sliding Window'),
('dynamic-programming','Dinamik dasturlash','Dynamic Programming'),
('trees','Daraxt algoritmlari','Tree Algorithms'),
('advanced-cp','Ilg‘or CP va ICPC','Advanced CP & ICPC')
on conflict(slug) do update set title_uz = excluded.title_uz, title_en = excluded.title_en;

do $$ begin
  if not exists(select 1 from pg_constraint where conname = 'problems_primary_topic_fk') then
    alter table public.problems add constraint problems_primary_topic_fk
      foreign key(primary_topic_slug) references public.topics(slug);
  end if;
end $$;

insert into public.topic_prerequisites(topic_slug, prerequisite_slug) values
('foundations','programming-basics'),
('sorting','foundations'),('backtracking','foundations'),('math','foundations'),('data-structures','foundations'),
('binary-search','sorting'),('greedy','sorting'),('graphs','data-structures'),('graphs','backtracking'),
('strings','data-structures'),('geometry','math'),('two-pointers','binary-search'),
('dynamic-programming','backtracking'),('dynamic-programming','greedy'),('trees','graphs'),
('advanced-cp','dynamic-programming'),('advanced-cp','graphs')
on conflict do nothing;

-- Stable judge problems preserve existing identifiers and connect every verified solve to a topic.
insert into public.problems(author_id, slug, problem_key, primary_topic_slug, difficulty, points, tags, published)
values
(null,'sum-two','sum-two','programming-basics','easy',100,array['basics'],true),
(null,'max-subarray','max-subarray','foundations','medium',200,array['array','dp'],true),
(null,'coin-change','coin-change','dynamic-programming','hard',300,array['dp'],true)
on conflict(slug) do update set problem_key=excluded.problem_key, primary_topic_slug=excluded.primary_topic_slug,
  difficulty=excluded.difficulty, points=excluded.points, tags=excluded.tags, published=true, archived_at=null;

-- Connect pre-existing problems and submissions without replacing their IDs or history.
update public.problems p set problem_key = p.slug where p.problem_key is null;
update public.problems p set primary_topic_slug = (
  select t.slug from public.topics t
  where t.slug = any(p.tags)
  order by t.slug limit 1
)
where p.primary_topic_slug is null
  and exists(select 1 from public.topics t where t.slug = any(p.tags));
update public.submissions s set
  problem_key = coalesce(s.problem_key, p.problem_key),
  context = case when s.duel_id is not null then 'duel' else s.context end
from public.problems p
where p.id = s.problem_id
  and (s.problem_key is null or (s.duel_id is not null and s.context <> 'duel'));

insert into public.problem_topics(problem_id, topic_slug, weight, is_primary)
select id, primary_topic_slug, 1, true from public.problems where primary_topic_slug is not null
on conflict(problem_id, topic_slug) do update set weight=excluded.weight, is_primary=true;

-- Preserve existing server progress and seed mastery once. Existing ratings, history,
-- submissions, and accounts are never reset.
insert into public.user_learning_state(user_id, unit_key, topic_slug, quiz_passed_at, problem_accepted_at, completed_at, updated_at)
select lc.user_id, r.slug || '-' || l.sort_order::text, r.slug,
       lc.quiz_passed_at, lc.problem_accepted_at, lc.completed_at, now()
from public.lesson_completions lc
join public.lessons l on l.id = lc.lesson_id
join public.roadmap_sections rs on rs.id = l.section_id
join public.roadmaps r on r.id = rs.roadmap_id
join public.topics t on t.slug = r.slug
where lc.completed_at is not null
on conflict(user_id, unit_key) do update set
  quiz_passed_at = coalesce(user_learning_state.quiz_passed_at, excluded.quiz_passed_at),
  problem_accepted_at = coalesce(user_learning_state.problem_accepted_at, excluded.problem_accepted_at),
  completed_at = coalesce(user_learning_state.completed_at, excluded.completed_at),
  updated_at = now();

do $$
declare legacy record;
begin
  for legacy in
    select lc.user_id, r.slug as topic_slug, lc.lesson_id
    from public.lesson_completions lc
    join public.lessons l on l.id = lc.lesson_id
    join public.roadmap_sections rs on rs.id = l.section_id
    join public.roadmaps r on r.id = rs.roadmap_id
    join public.topics t on t.slug = r.slug
    where lc.completed_at is not null
  loop
    perform public.apply_mastery_evidence(legacy.user_id, legacy.topic_slug, 'migration',
      'legacy-lesson:' || legacy.lesson_id::text, 60, jsonb_build_object('legacyLessonId',legacy.lesson_id));
  end loop;
end
$$;

do $$
declare legacy_problem record;
begin
  for legacy_problem in
    select distinct on (s.user_id, p.id)
      s.user_id, p.id as problem_id, p.problem_key, p.primary_topic_slug, p.difficulty
    from public.submissions s
    join public.problems p on p.id = s.problem_id
    where s.status = 'accepted' and p.primary_topic_slug is not null
    order by s.user_id, p.id, s.created_at
  loop
    perform public.apply_mastery_evidence(
      legacy_problem.user_id,
      legacy_problem.primary_topic_slug,
      'migration',
      'legacy-problem:' || legacy_problem.problem_id::text,
      case legacy_problem.difficulty when 'easy' then 20 when 'medium' then 35 else 50 end,
      jsonb_build_object('problemKey', legacy_problem.problem_key, 'source', 'historical-submission')
    );
  end loop;
end
$$;

insert into public.platform_settings(key, value) values
('mastery', '{"unlock":450,"complete":700,"advanced":850,"weights":{"quiz":40,"lesson":60,"problem":{"easy":20,"medium":35,"hard":50},"duelMultiplier":1.5,"placementQuestion":70,"placementCoding":{"easy":100,"medium":150,"hard":200},"challenge":520}}'::jsonb),
('duel', '{"durationSeconds":1800,"problemCount":3,"ratingK":32,"enabled":false}'::jsonb)
on conflict(key) do nothing;

-- Realtime clients subscribe only to duel rows they are authorized to read.
do $$ begin
  alter publication supabase_realtime add table public.duels;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.duel_participants;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.duel_problems;
exception when duplicate_object then null; end $$;
