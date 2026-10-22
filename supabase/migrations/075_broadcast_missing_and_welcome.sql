-- 075: the owner's broadcast reaches the people it missed, and new accounts
-- get it on their own.
--
-- Asked for on 22 Oct 2026. The Telegram invitation went out once through
-- owner_broadcast (055) on 16 Oct; everybody who signed up after that never
-- saw it.
--
-- 1. "Already has it" means: some owner has sent this person a message that
--    contains the announcement's link (broadcast_marker: the first URL in the
--    text, or the whole text when it has none). Rewording the announcement
--    keeps the same link, so the people from 16 Oct are not written to twice.
--    owner_broadcast_missing_count() and owner_broadcast_missing() count and
--    send to everybody else, with 055's recipient rules.
--
-- 2. welcome_message holds one announcement that every new account receives
--    from the owner who switched it on. A deferred trigger on profiles sends
--    it when the sign-up commits, so the seeded contest accounts, whose
--    bot_accounts row is written in the same transaction, are skipped.
--    messages_guard (011) wants the sender to be the caller; the trigger
--    speaks as the owner for that one insert and puts the caller back.
--
-- Run AFTER 055. Safe to re-run.

create or replace function public.broadcast_marker(p_body text)
returns text language sql immutable as $$
  select coalesce(substring(btrim(coalesce(p_body, '')) from 'https?://[^[:space:]]+'), btrim(coalesce(p_body, '')));
$$;

-- Everybody 055 would write to who has not had this announcement yet.
create or replace function public.broadcast_missing_recipients(p_sender uuid, p_marker text)
returns setof uuid language sql stable security definer set search_path = public as $$
  select p.id from profiles p
   where p.id <> p_sender and p.suspended_at is null
     and not exists (select 1 from bot_accounts b where b.user_id = p.id)
     and not exists (select 1 from messages m join profiles s on s.id = m.sender_id and s.role = 'owner'
                      where m.recipient_id = p.id and strpos(m.body, p_marker) > 0);
$$;
revoke all on function public.broadcast_missing_recipients(uuid, text) from public, anon, authenticated;

create or replace function public.owner_broadcast_missing_count(p_body text)
returns int language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'owner') then
    raise exception 'Only the owner can broadcast' using errcode = '42501';
  end if;
  if broadcast_marker(p_body) = '' then return 0; end if;
  return (select count(*) from broadcast_missing_recipients(auth.uid(), broadcast_marker(p_body)));
end $$;

create or replace function public.owner_broadcast_missing(p_body text, p_as_site boolean default false)
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
  select auth.uid(), r, btrim(p_body), coalesce(p_as_site, false)
    from broadcast_missing_recipients(auth.uid(), broadcast_marker(p_body)) r;
  get diagnostics v_sent = row_count;
  return jsonb_build_object('ok', true, 'sent', v_sent);
end $$;

-- ---------------------------------------------------------------------------
-- 2. The announcement new accounts receive.
-- ---------------------------------------------------------------------------
create table if not exists public.welcome_message (
  id int primary key default 1 check (id = 1),
  enabled boolean not null default false,
  body text not null default '',
  as_site boolean not null default false,
  sender_id uuid references public.profiles on delete set null,
  updated_at timestamptz not null default now()
);
alter table public.welcome_message enable row level security;
-- No policy: read and written through the owner_welcome_* functions.

create or replace function public.owner_welcome_get()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare w welcome_message;
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'owner') then
    raise exception 'Only the owner can broadcast' using errcode = '42501';
  end if;
  select * into w from welcome_message where id = 1;
  return jsonb_build_object('enabled', coalesce(w.enabled, false), 'body', coalesce(w.body, ''),
    'as_site', coalesce(w.as_site, false), 'updated_at', w.updated_at,
    'sender', (select username from profiles where id = w.sender_id));
end $$;

create or replace function public.owner_welcome_set(p_enabled boolean, p_body text, p_as_site boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'owner') then
    raise exception 'Only the owner can broadcast' using errcode = '42501';
  end if;
  if coalesce(p_enabled, false) and length(btrim(coalesce(p_body, ''))) not between 1 and 4000 then
    return jsonb_build_object('ok', false, 'error', 'bad_length');
  end if;
  insert into welcome_message (id, enabled, body, as_site, sender_id, updated_at)
  values (1, coalesce(p_enabled, false), btrim(coalesce(p_body, '')), coalesce(p_as_site, false), auth.uid(), now())
  on conflict (id) do update set enabled = excluded.enabled, body = excluded.body,
    as_site = excluded.as_site, sender_id = excluded.sender_id, updated_at = now();
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.profiles_send_welcome()
returns trigger language plpgsql security definer set search_path = public as $$
declare w welcome_message; v_prev text;
begin
  select * into w from welcome_message where id = 1;
  if not found or not w.enabled or btrim(w.body) = '' or w.sender_id is null or w.sender_id = new.id then return null; end if;
  if not exists (select 1 from profiles where id = w.sender_id and role = 'owner') then return null; end if;
  if exists (select 1 from bot_accounts b where b.user_id = new.id) then return null; end if;
  if not exists (select 1 from profiles where id = new.id) then return null; end if;
  -- Speak as the owner for this one insert, then hand the caller back.
  v_prev := current_setting('request.jwt.claim.sub', true);
  perform set_config('request.jwt.claim.sub', w.sender_id::text, true);
  begin
    insert into messages(sender_id, recipient_id, body, as_site)
    values (w.sender_id, new.id, w.body, w.as_site);
  exception when others then
    -- A failed welcome must never fail a sign-up.
    null;
  end;
  perform set_config('request.jwt.claim.sub', coalesce(v_prev, ''), true);
  return null;
end $$;

drop trigger if exists profiles_send_welcome on public.profiles;
create constraint trigger profiles_send_welcome after insert on public.profiles
  deferrable initially deferred
  for each row execute function public.profiles_send_welcome();

revoke all on function public.owner_broadcast_missing_count(text) from public;
revoke all on function public.owner_broadcast_missing(text, boolean) from public;
revoke all on function public.owner_welcome_get() from public;
revoke all on function public.owner_welcome_set(boolean, text, boolean) from public;
revoke all on function public.profiles_send_welcome() from public, anon, authenticated;
grant execute on function public.owner_broadcast_missing_count(text) to authenticated;
grant execute on function public.owner_broadcast_missing(text, boolean) to authenticated;
grant execute on function public.owner_welcome_get() to authenticated;
grant execute on function public.owner_welcome_set(boolean, text, boolean) to authenticated;
