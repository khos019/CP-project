-- AlgoYo'l — a message should arrive, not be discovered a minute later.
--
-- The inbox badge polls once a minute. That was a reasonable trade when there
-- was no realtime connection to speak of: a second socket for a number that
-- changes a few times a day is not worth keeping alive.
--
-- The duel changed the arithmetic. Every signed-in learner now holds an open
-- channel on `duel:user:<id>` for challenges, so telling them about a message
-- costs nothing extra — it is the socket they already have.
--
-- Messages are inserted straight into the table by the browser (there is no
-- API route in between), so the push has to come from the database. A trigger
-- calls realtime.send() on the recipient's own topic.
--
-- Three things this deliberately does not do:
--
--   * It does not send the message text. The topic is a uuid, not a
--     permission, and the body of somebody's private message has no business
--     travelling on a channel anyone holding the anon key could join. The
--     event says "you have a new message"; the client then reads it the
--     authenticated way it always has.
--   * It does not replace the poll. If realtime is unavailable the exception
--     is swallowed and the minute-long poll still corrects the badge — a
--     failed notification must never fail the message.
--   * It does not fire for a message you sent yourself.
--
-- Run AFTER 011 and 016. Safe to re-run.

create or replace function public.messages_notify()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  begin
    perform realtime.send(
      jsonb_build_object(
        'message_id', new.id,
        'sender_id',  new.sender_id,
        'as_site',    new.as_site,
        'created_at', new.created_at),
      'message_received',
      'duel:user:' || new.recipient_id::text,
      false);
  exception when others then
    -- Realtime missing, renamed, or refusing: the badge still catches up on
    -- its next poll, and the message itself is already committed.
    null;
  end;
  return new;
end $$;

drop trigger if exists messages_notify_recipient on public.messages;
create trigger messages_notify_recipient
  after insert on public.messages
  for each row execute function public.messages_notify();
