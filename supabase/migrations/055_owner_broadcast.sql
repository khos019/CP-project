-- 055: an owner can write one message to every learner at once.
--
-- The messages trigger (011) insists that the sender is the caller, so this
-- does not get around it: the function runs for a signed-in owner and inserts
-- with sender_id = auth.uid(), one row per recipient, through the same trigger
-- that checks every other message. Owners are exempt from the per-minute and
-- per-day limits there already.
--
-- Recipients: every profile except the sender, the seeded contest-archive
-- accounts (bot_accounts — nobody reads their inbox) and suspended accounts.
--
-- Run AFTER 044. Safe to re-run.

create or replace function public.owner_broadcast_recipients()
returns int language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'owner') then
    raise exception 'Only the owner can broadcast' using errcode = '42501';
  end if;
  return (select count(*) from profiles p
           where p.id <> auth.uid() and p.suspended_at is null
             and not exists (select 1 from bot_accounts b where b.user_id = p.id));
end $$;

create or replace function public.owner_broadcast(p_body text, p_as_site boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_sent int;
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'owner') then
    raise exception 'Only the owner can broadcast' using errcode = '42501';
  end if;
  if length(btrim(coalesce(p_body, ''))) not between 1 and 4000 then
    return jsonb_build_object('ok', false, 'error', 'bad_length');
  end if;
  insert into messages(sender_id, recipient_id, body, as_site)
  select auth.uid(), p.id, btrim(p_body), coalesce(p_as_site, false)
    from profiles p
   where p.id <> auth.uid() and p.suspended_at is null
     and not exists (select 1 from bot_accounts b where b.user_id = p.id);
  get diagnostics v_sent = row_count;
  return jsonb_build_object('ok', true, 'sent', v_sent);
end $$;

revoke all on function public.owner_broadcast_recipients() from public;
revoke all on function public.owner_broadcast(text, boolean) from public;
grant execute on function public.owner_broadcast_recipients() to authenticated;
grant execute on function public.owner_broadcast(text, boolean) to authenticated;
