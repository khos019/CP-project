-- AlgoYo'l — direct messages between learners, and site messages from the owner.
--
-- Anyone may write to anyone, which is also the whole risk: an open write path
-- to every account on the platform is a spam channel unless the limits live in
-- the database. They do, in one BEFORE INSERT trigger, because a check the
-- client performs is a check an attacker skips by calling PostgREST directly.
--
-- The trigger refuses a message when the sender is suspended, when the
-- recipient has blocked them, or when they have already sent 20 in the last
-- minute or 300 in the last day. It also decides `as_site` rather than
-- trusting it: only an owner can speak as AlgoYo'l, so for everybody else the
-- flag is forced back to false no matter what was submitted.
--
-- Run AFTER 001-010. Safe to re-run.

-- ---------------------------------------------------------------------------
-- 1) Tables
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(btrim(body)) between 1 and 4000),
  -- Set by the trigger, never by the client: true means "shown as AlgoYo'l".
  as_site boolean not null default false,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  constraint messages_not_self check (sender_id <> recipient_id)
);

-- A conversation is read newest-first for one participant at a time, and the
-- unread badge counts unread rows for one recipient. Both are covered here.
create index if not exists idx_messages_recipient on public.messages (recipient_id, created_at desc);
create index if not exists idx_messages_sender on public.messages (sender_id, created_at desc);
create index if not exists idx_messages_unread on public.messages (recipient_id) where read_at is null;

-- Blocking is one-directional and private to the blocker: the blocked person
-- is never told, they simply stop getting through.
create table if not exists public.message_blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint message_blocks_not_self check (blocker_id <> blocked_id)
);

-- ---------------------------------------------------------------------------
-- 2) The gate every message passes through
-- ---------------------------------------------------------------------------
create or replace function public.messages_guard() returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  sender_role public.user_role;
  sender_suspended timestamptz;
  recent int;
  daily int;
begin
  -- The sender is always the caller. Passing somebody else's id is not an
  -- error to be reported, it is an impersonation attempt to be refused.
  if new.sender_id <> auth.uid() then
    raise exception 'You can only send messages as yourself' using errcode = '42501';
  end if;

  select role, suspended_at into sender_role, sender_suspended
    from public.profiles where id = new.sender_id;
  if sender_role is null then
    raise exception 'No such sender';
  end if;
  if sender_suspended is not null then
    raise exception 'account_suspended' using errcode = '42501';
  end if;

  if not exists (select 1 from public.profiles where id = new.recipient_id) then
    raise exception 'No such recipient';
  end if;

  -- Only an owner speaks as the site. Everyone else writes as themselves,
  -- whatever they submitted.
  new.as_site := (sender_role = 'owner') and coalesce(new.as_site, false);

  -- A block stops learners, not the platform: an owner still has to be able to
  -- reach an account about its own suspension, and that is the one message a
  -- person with something to hide would block first.
  if sender_role <> 'owner'
     and exists (select 1 from public.message_blocks
                  where blocker_id = new.recipient_id and blocked_id = new.sender_id) then
    raise exception 'blocked_by_recipient' using errcode = '42501';
  end if;

  if sender_role <> 'owner' then
    select count(*) into recent from public.messages
      where sender_id = new.sender_id and created_at > now() - interval '1 minute';
    if recent >= 20 then
      raise exception 'rate_limited' using errcode = '53400';
    end if;
    select count(*) into daily from public.messages
      where sender_id = new.sender_id and created_at > now() - interval '1 day';
    if daily >= 300 then
      raise exception 'rate_limited_daily' using errcode = '53400';
    end if;
  end if;

  -- Read state belongs to the recipient and starts empty however it was sent.
  new.read_at := null;
  new.created_at := now();
  return new;
end
$$;

drop trigger if exists messages_guard on public.messages;
create trigger messages_guard before insert on public.messages
  for each row execute function public.messages_guard();

-- ---------------------------------------------------------------------------
-- 3) Row level security
-- ---------------------------------------------------------------------------
alter table public.messages enable row level security;
alter table public.message_blocks enable row level security;

drop policy if exists "read own conversations" on public.messages;
create policy "read own conversations" on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);

drop policy if exists "send as self" on public.messages;
create policy "send as self" on public.messages
  for insert with check (auth.uid() = sender_id);

-- Deleting removes it for both sides, so only the author may do it.
drop policy if exists "delete own message" on public.messages;
create policy "delete own message" on public.messages
  for delete using (auth.uid() = sender_id);

drop policy if exists "own blocks" on public.message_blocks;
create policy "own blocks" on public.message_blocks
  for all using (auth.uid() = blocker_id) with check (auth.uid() = blocker_id);

-- Marking as read is the one update a recipient makes, and UPDATE policies
-- cannot restrict *which* column changed — so there is no update policy at
-- all, and read state moves through this function instead.
create or replace function public.mark_thread_read(p_other uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  touched int;
begin
  if auth.uid() is null then
    raise exception 'Sign in first' using errcode = '42501';
  end if;
  update public.messages
     set read_at = now()
   where recipient_id = auth.uid() and sender_id = p_other and read_at is null;
  get diagnostics touched = row_count;
  return touched;
end
$$;

revoke all on function public.mark_thread_read(uuid) from public;
grant execute on function public.mark_thread_read(uuid) to authenticated;

grant select, insert, delete on public.messages to authenticated;
grant select, insert, delete on public.message_blocks to authenticated;

-- ---------------------------------------------------------------------------
-- 4) The inbox
-- ---------------------------------------------------------------------------
-- One row per correspondent: their identity, the latest message, and how many
-- of theirs are still unread. Done in SQL because doing it in the client means
-- downloading every message ever exchanged to group them.
create or replace function public.my_message_threads(p_limit int default 50)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  result jsonb;
begin
  if me is null then
    raise exception 'Sign in first' using errcode = '42501';
  end if;

  -- Sorted on the real timestamp, not on its JSON rendering: the aggregate
  -- carries the key beside the row so the order is a date comparison.
  select coalesce(jsonb_agg(t order by sort_at desc), '[]'::jsonb) into result
  from (
    select grouped.last_at as sort_at, jsonb_build_object(
      'user_id',      other.id,
      'username',     other.username,
      'display_name', other.display_name,
      'avatar_url',   other.avatar_url,
      'role',         other.role,
      'last_body',    last_message.body,
      'last_at',      last_message.created_at,
      'last_as_site', last_message.as_site,
      'last_mine',    (last_message.sender_id = me),
      'unread',       (select count(*) from public.messages m
                        where m.recipient_id = me and m.sender_id = other.id and m.read_at is null),
      'blocked',      exists (select 1 from public.message_blocks
                               where blocker_id = me and blocked_id = other.id)
    ) as t
    from (
      select case when sender_id = me then recipient_id else sender_id end as other_id,
             max(created_at) as last_at
        from public.messages
       where sender_id = me or recipient_id = me
       group by 1
    ) grouped
    join public.profiles other on other.id = grouped.other_id
    join lateral (
      select body, created_at, as_site, sender_id
        from public.messages m
       where (m.sender_id = me and m.recipient_id = grouped.other_id)
          or (m.recipient_id = me and m.sender_id = grouped.other_id)
       order by m.created_at desc
       limit 1
    ) last_message on true
    order by grouped.last_at desc
    limit greatest(1, least(coalesce(p_limit, 50), 200))
  ) threads;

  return result;
end
$$;

revoke all on function public.my_message_threads(int) from public;
grant execute on function public.my_message_threads(int) to authenticated;

create or replace function public.my_unread_count()
returns int
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(count(*), 0)::int from public.messages
   where recipient_id = auth.uid() and read_at is null;
$$;

grant execute on function public.my_unread_count() to authenticated;
