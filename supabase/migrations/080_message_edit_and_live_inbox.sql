-- 080: a message can be corrected, and the inbox keeps up while it is open.
--
-- Three gaps in direct messages, closed here:
--
-- 1. Editing. There is still no UPDATE policy on public.messages, for the
--    reason 011 gives: a policy cannot say which column changed, so one that
--    let the author fix a typo would also let them rewrite created_at,
--    recipient_id or as_site. The body moves through edit_message() instead,
--    which checks that the caller wrote the message and touches nothing but
--    body and edited_at. Deleting needs nothing new: 011 already lets the
--    author, and only the author, delete a row, and a deleted row is gone for
--    both sides.
--
-- 2. Telling the other side. 022 pushes "you have a message" on insert. An
--    edit, a deletion and "they have read it" are just as much news to the
--    person on the other end, so the same topic carries a message_changed
--    event for each. Like 022 it carries no text, only that something should
--    be re-read, and a realtime failure never fails the change itself.
--    The triggers are per statement: marking a thread read touches every
--    unread row at once, and fifty rows should be one event, not fifty.
--
-- 3. Ticks in the inbox. my_message_threads now says whether the latest
--    message was read and whether it was edited, so the list can draw the same
--    sent/read marks the conversation does.
--
-- Run AFTER 011 and 022. Safe to re-run.

alter table public.messages add column if not exists edited_at timestamptz;

-- edited_at is the server's statement about a message, like read_at: whatever
-- a client submits with a new message, it starts unedited.
create or replace function public.messages_fresh() returns trigger
language plpgsql
as $$
begin
  new.edited_at := null;
  return new;
end
$$;

drop trigger if exists messages_fresh on public.messages;
create trigger messages_fresh before insert on public.messages
  for each row execute function public.messages_fresh();

-- ---------------------------------------------------------------------------
-- 1) Editing one's own message
-- ---------------------------------------------------------------------------
create or replace function public.edit_message(p_id uuid, p_body text)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  clean text := btrim(coalesce(p_body, ''));
  stamp timestamptz;
begin
  if me is null then
    raise exception 'Sign in first' using errcode = '42501';
  end if;
  -- A suspended account cannot send, and an edit is a way of sending new
  -- words into an existing conversation, so it is refused the same way.
  if exists (select 1 from public.profiles where id = me and suspended_at is not null) then
    raise exception 'account_suspended' using errcode = '42501';
  end if;
  if length(clean) not between 1 and 4000 then
    raise exception 'invalid_body' using errcode = '23514';
  end if;

  -- The sender_id test is the whole permission: a message somebody else wrote
  -- matches no row and is reported exactly like one that does not exist.
  update public.messages
     set body = clean,
         edited_at = case when body = clean then edited_at else now() end
   where id = p_id and sender_id = me
  returning edited_at into stamp;

  if not found then
    raise exception 'Not your message' using errcode = '42501';
  end if;
  return stamp;
end
$$;

revoke all on function public.edit_message(uuid, text) from public;
grant execute on function public.edit_message(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 2) Telling the other participant
-- ---------------------------------------------------------------------------
create or replace function public.messages_changed_notify()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  target record;
begin
  -- An edit or a deletion is news to the recipient; a read is news to the
  -- sender. Which of the two a row is depends on what changed, so the target
  -- is chosen per row and the events are de-duplicated per person.
  for target in
    select distinct who, actor from (
      select case when tg_op = 'UPDATE' and o.read_at is null and n.read_at is not null
                  then n.sender_id else n.recipient_id end as who,
             case when tg_op = 'UPDATE' and o.read_at is null and n.read_at is not null
                  then n.recipient_id else n.sender_id end as actor
        from stale o
        join fresh n on n.id = o.id
    ) changed
  loop
    begin
      perform realtime.send(
        jsonb_build_object('other_id', target.actor),
        'message_changed',
        'duel:user:' || target.who::text,
        false);
    exception when others then
      -- As in 022: the next poll catches up, and the change is committed.
      null;
    end;
  end loop;
  return null;
end $$;

-- A deletion has no new rows to compare against, so it gets its own, simpler
-- function: whoever received the deleted message is the one to tell.
create or replace function public.messages_deleted_notify()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  target record;
begin
  for target in select distinct recipient_id as who, sender_id as actor from gone loop
    begin
      perform realtime.send(
        jsonb_build_object('other_id', target.actor),
        'message_changed',
        'duel:user:' || target.who::text,
        false);
    exception when others then
      null;
    end;
  end loop;
  return null;
end $$;

drop trigger if exists messages_changed_notify on public.messages;
create trigger messages_changed_notify
  after update on public.messages
  referencing old table as stale new table as fresh
  for each statement execute function public.messages_changed_notify();

drop trigger if exists messages_deleted_notify on public.messages;
create trigger messages_deleted_notify
  after delete on public.messages
  referencing old table as gone
  for each statement execute function public.messages_deleted_notify();

-- ---------------------------------------------------------------------------
-- 3) The inbox, with the latest message's read and edited state
-- ---------------------------------------------------------------------------
-- Same as 011 apart from last_read and last_edited.
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
      'last_read',    (last_message.read_at is not null),
      'last_edited',  (last_message.edited_at is not null),
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
      select body, created_at, as_site, sender_id, read_at, edited_at
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
