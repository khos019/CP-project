-- AlgoYo'l — owner-side user administration.
--
-- Finding a person and acting on them needs three things a browser must never
-- be handed directly:
--
--   auth.users        email, last_sign_in_at, confirmation state — not exposed
--                     to the anon or authenticated roles at all
--   profiles.role     publicly readable, but writable only through a gate;
--                     an open policy would let anyone promote themselves
--   suspension        a moderation verdict, so the check has to live where the
--                     client cannot skip it
--
-- So every operation here is a security-definer function that re-checks the
-- caller is an owner, and every one of them writes an audit_logs row. The
-- client is never trusted with the decision, only with the request.
--
-- Run AFTER 001-009. Safe to re-run.

-- ---------------------------------------------------------------------------
-- 1) Suspension state
-- ---------------------------------------------------------------------------
-- A suspended account can still sign in and read — locking someone out of
-- their own lessons is a punishment we never intended. What it loses is the
-- ability to write to shared surfaces: messages, and profile identity.
alter table public.profiles add column if not exists suspended_at timestamptz;
alter table public.profiles add column if not exists suspended_reason text;

create or replace function public.is_owner(p_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = p_user and role = 'owner');
$$;

create or replace function public.is_suspended(p_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = p_user and suspended_at is not null);
$$;

grant execute on function public.is_owner(uuid) to authenticated;
grant execute on function public.is_suspended(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 2) Search
-- ---------------------------------------------------------------------------
-- Matches username, display name or email. Email is the reason this is a
-- function and not a view: an owner searching for "the person who wrote from
-- this address" needs it, and nobody else may read it.
--
-- The query is used as a LIKE pattern, so its wildcards are escaped — a search
-- for "100%" looks for that text, not for "100" followed by anything.
create or replace function public.owner_search_users(p_query text, p_limit int default 25)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
  needle text;
begin
  if not public.is_owner() then
    raise exception 'Only the owner can search users' using errcode = '42501';
  end if;

  needle := '%' || replace(replace(replace(btrim(coalesce(p_query, '')), '\', '\\'), '%', '\%'), '_', '\_') || '%';

  -- The subquery ranks by relevance; the aggregate has to preserve that order
  -- rather than impose its own, so the rank travels with the row.
  select coalesce(jsonb_agg(payload order by exact desc, prefix desc, handle), '[]'::jsonb) into result
  from (
    select
      (lower(p.username) = lower(btrim(coalesce(p_query, '')))) as exact,
      (p.username ilike replace(replace(btrim(coalesce(p_query, '')), '\', '\\'), '%', '\%') || '%') as prefix,
      p.username as handle,
      jsonb_build_object(
        'id',               p.id,
        'username',         p.username,
        'display_name',     p.display_name,
        'avatar_url',       p.avatar_url,
        'email',            u.email,
        'role',             p.role,
        'duel_rating',      p.duel_rating,
        'solved_count',     p.solved_count,
        'created_at',       p.created_at,
        'last_sign_in_at',  u.last_sign_in_at,
        'email_confirmed',  (u.email_confirmed_at is not null),
        'suspended_at',     p.suspended_at,
        'suspended_reason', p.suspended_reason
      ) as payload
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.username ilike needle
       or p.display_name ilike needle
       or u.email ilike needle
    order by exact desc, prefix desc, handle
    limit greatest(1, least(coalesce(p_limit, 25), 100))
  ) ranked;

  return result;
end
$$;

revoke all on function public.owner_search_users(text, int) from public;
grant execute on function public.owner_search_users(text, int) to authenticated;

-- ---------------------------------------------------------------------------
-- 3) Suspend / restore
-- ---------------------------------------------------------------------------
create or replace function public.owner_set_suspended(p_user uuid, p_suspended boolean, p_reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_owner() then
    raise exception 'Only the owner can suspend an account' using errcode = '42501';
  end if;
  if p_user = auth.uid() then
    raise exception 'You cannot suspend your own account';
  end if;
  if exists (select 1 from public.profiles where id = p_user and role = 'owner') then
    raise exception 'An owner account cannot be suspended';
  end if;

  update public.profiles
     set suspended_at = case when p_suspended then coalesce(suspended_at, now()) else null end,
         suspended_reason = case when p_suspended then nullif(btrim(coalesce(p_reason, '')), '') else null end
   where id = p_user;

  if not found then
    raise exception 'No such account';
  end if;

  insert into public.audit_logs(actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), case when p_suspended then 'user.suspend' else 'user.restore' end,
          'profile', p_user, jsonb_build_object('reason', p_reason));
end
$$;

revoke all on function public.owner_set_suspended(uuid, boolean, text) from public;
grant execute on function public.owner_set_suspended(uuid, boolean, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 4) Identity correction
-- ---------------------------------------------------------------------------
-- Renaming somebody is a moderation act (an abusive handle), not routine
-- editing, so it is owner-only and audited with the previous value — the
-- record of what it *was* is the part that matters later.
create or replace function public.owner_update_identity(p_user uuid, p_username text, p_display_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  before_username text;
  before_display text;
  next_username text := btrim(coalesce(p_username, ''));
  next_display text := btrim(coalesce(p_display_name, ''));
begin
  if not public.is_owner() then
    raise exception 'Only the owner can rename an account' using errcode = '42501';
  end if;

  select username, display_name into before_username, before_display
    from public.profiles where id = p_user;
  if before_username is null then
    raise exception 'No such account';
  end if;

  if next_username !~ '^[a-zA-Z0-9_]{3,24}$' then
    raise exception 'invalid_username' using errcode = '23514';
  end if;
  if length(next_display) > 40 then
    raise exception 'invalid_display_name' using errcode = '23514';
  end if;
  if exists (select 1 from public.profiles where lower(username) = lower(next_username) and id <> p_user) then
    raise exception 'username_taken' using errcode = '23505';
  end if;

  update public.profiles
     set username = next_username, display_name = next_display
   where id = p_user;

  insert into public.audit_logs(actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'user.rename', 'profile', p_user,
          jsonb_build_object('from', jsonb_build_object('username', before_username, 'display_name', before_display),
                             'to',   jsonb_build_object('username', next_username, 'display_name', next_display)));
end
$$;

revoke all on function public.owner_update_identity(uuid, text, text) from public;
grant execute on function public.owner_update_identity(uuid, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 5) Handles stay unique regardless of case
-- ---------------------------------------------------------------------------
-- The column has been UNIQUE since 001, but that comparison is case-sensitive:
-- "Ozodbek" and "ozodbek" were two different handles, which is exactly the
-- confusion a unique handle is supposed to prevent. This closes that.
--
-- If two such handles already exist the index cannot be built; the loop below
-- renames the later ones first, so the migration completes on a live database
-- instead of failing halfway.
do $$
declare
  dup record;
  suffix int;
  candidate text;
begin
  for dup in
    select id, username from public.profiles p
    where exists (
      select 1 from public.profiles q
      where lower(q.username) = lower(p.username) and q.created_at < p.created_at
    )
  loop
    suffix := 2;
    loop
      candidate := left(dup.username, 22) || suffix::text;
      exit when not exists (select 1 from public.profiles where lower(username) = lower(candidate));
      suffix := suffix + 1;
    end loop;
    update public.profiles set username = candidate where id = dup.id;
    insert into public.audit_logs(actor_id, action, entity_type, entity_id, metadata)
    values (null, 'user.rename_dedupe', 'profile', dup.id,
            jsonb_build_object('from', dup.username, 'to', candidate));
  end loop;
end $$;

create unique index if not exists idx_profiles_username_lower on public.profiles (lower(username));

-- The bootstrap trigger from 008 walks to a free variant with a case-sensitive
-- test, which the new index would now reject. This is 008's function verbatim
-- apart from that one comparison — the display-name trim, the avatar fallbacks
-- and the on-conflict guard are all still its own.
create or replace function public.bootstrap_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  requested text := coalesce(meta->>'username', '');
  candidate text;
  suffix int := 0;
  full_name text;
  picture text;
begin
  -- 1) username: explicit request, else the email local part, else a stable id
  candidate := regexp_replace(requested, '[^a-zA-Z0-9_]', '', 'g');

  if length(candidate) < 3 or length(candidate) > 24 then
    candidate := regexp_replace(
      split_part(coalesce(new.email, ''), '@', 1),
      '[^a-zA-Z0-9_]', '', 'g'
    );
    candidate := left(candidate, 24);
  end if;

  if length(candidate) < 3 or length(candidate) > 24 then
    candidate := 'user_' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;

  -- handles are unique without regard to case; walk to the first free variant
  while exists (select 1 from public.profiles where lower(username) = lower(candidate)) loop
    suffix := suffix + 1;
    candidate := substr(candidate, 1, 20) || suffix::text;
  end loop;

  -- 2) display name and avatar, if the provider gave us any
  full_name := coalesce(
    nullif(meta->>'display_name', ''),
    nullif(meta->>'full_name', ''),
    nullif(meta->>'name', ''),
    ''
  );
  picture := coalesce(
    nullif(meta->>'avatar_url', ''),
    nullif(meta->>'picture', '')
  );

  insert into public.profiles(id, username, display_name, avatar_url, role)
  values (
    new.id,
    candidate,
    left(full_name, 40),
    picture,
    case
      when lower(new.email) = any (public.algoyol_owner_emails()) then 'owner'::public.user_role
      else 'user'::public.user_role
    end
  )
  on conflict (id) do nothing;

  return new;
end
$$;
