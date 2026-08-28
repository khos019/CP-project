-- AlgoYo'l — coins, activity streaks and the shop.
--
-- Coins convert into real-money items (Telegram Stars gifts), so unlike
-- mastery this cannot live in the browser: every balance change goes through a
-- security-definer function and clients are revoked from writing the ledger.
--
-- Earning ladder (a qualifying day = 30+ active minutes AND 3+ duels):
--   3 consecutive days  -> 1 coin
--   5 consecutive days  -> 2 coins
--   7 consecutive days  -> 3 coins
--   8 consecutive days  -> 4 coins
--  10 consecutive days  -> 5 coins
-- Reaching all five milestones totals exactly 15 coins, the price of a
-- 15-star gift.
--
-- Run AFTER 001-012.

-- ---------------------------------------------------------------------------
-- 1. Per-day activity. The client reports heartbeats; the server clamps them.
-- ---------------------------------------------------------------------------
create table if not exists public.daily_activity (
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  day date not null default (now() at time zone 'utc')::date,
  active_seconds int not null default 0 check (active_seconds >= 0),
  duels int not null default 0 check (duels >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);
create index if not exists idx_daily_activity_user on public.daily_activity(user_id, day desc);

create table if not exists public.coin_rules (
  streak_days int primary key,
  coins int not null check (coins > 0),
  active_seconds_required int not null default 1800,
  duels_required int not null default 3
);
insert into public.coin_rules(streak_days, coins) values (3,1),(5,2),(7,3),(8,4),(10,5)
on conflict (streak_days) do update set coins = excluded.coins;

-- ---------------------------------------------------------------------------
-- 2. The ledger. Balance is derived from it, never stored on its own.
-- ---------------------------------------------------------------------------
create table if not exists public.coin_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles on delete cascade,
  delta int not null,
  reason text not null,
  -- A milestone can only ever pay out once.
  dedupe_key text not null,
  created_at timestamptz not null default now()
);
create unique index if not exists idx_coin_dedupe on public.coin_events(user_id, dedupe_key);
create index if not exists idx_coin_user on public.coin_events(user_id, created_at desc);

create or replace function public.coin_balance(p_user uuid default auth.uid())
returns int language sql stable security definer set search_path = public as $$
  select coalesce(sum(delta), 0)::int from coin_events where user_id = p_user
$$;

-- ---------------------------------------------------------------------------
-- 3. Activity heartbeat. Caps growth so a scripted client cannot fabricate a
--    qualifying day in one request.
-- ---------------------------------------------------------------------------
create or replace function public.record_activity(p_seconds int, p_duels int default 0)
returns void language plpgsql security definer set search_path = public as $$
declare v_add int := least(greatest(coalesce(p_seconds, 0), 0), 300); -- 5 min per call
        v_duels int := least(greatest(coalesce(p_duels, 0), 0), 3);
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  insert into daily_activity(user_id, day, active_seconds, duels)
  values (auth.uid(), (now() at time zone 'utc')::date, v_add, v_duels)
  on conflict (user_id, day) do update set
    -- a day cannot bank more than 24h of activity
    active_seconds = least(daily_activity.active_seconds + v_add, 86400),
    duels = daily_activity.duels + v_duels,
    updated_at = now();
end $$;

-- ---------------------------------------------------------------------------
-- 4. Streak length: consecutive qualifying days ending today or yesterday.
-- ---------------------------------------------------------------------------
create or replace function public.qualifying_streak(p_user uuid default auth.uid())
returns int language plpgsql stable security definer set search_path = public as $$
declare v_req_sec int; v_req_duels int; v_day date; v_streak int := 0; v_cursor date;
begin
  select active_seconds_required, duels_required into v_req_sec, v_req_duels
  from coin_rules order by streak_days limit 1;
  v_req_sec := coalesce(v_req_sec, 1800); v_req_duels := coalesce(v_req_duels, 3);

  -- Start from today if today already qualifies, otherwise from yesterday, so
  -- a streak is not lost merely because the current day is still in progress.
  select max(day) into v_day from daily_activity
   where user_id = p_user and active_seconds >= v_req_sec and duels >= v_req_duels
     and day >= (now() at time zone 'utc')::date - 1;
  if v_day is null then return 0; end if;

  v_cursor := v_day;
  loop
    exit when not exists (
      select 1 from daily_activity
       where user_id = p_user and day = v_cursor
         and active_seconds >= v_req_sec and duels >= v_req_duels);
    v_streak := v_streak + 1;
    v_cursor := v_cursor - 1;
  end loop;
  return v_streak;
end $$;

-- Award every milestone the streak has reached, each at most once.
create or replace function public.claim_streak_coins()
returns int language plpgsql security definer set search_path = public as $$
declare v_streak int; v_row record; v_awarded int := 0;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  v_streak := qualifying_streak(auth.uid());
  for v_row in select streak_days, coins from coin_rules where streak_days <= v_streak order by streak_days loop
    insert into coin_events(user_id, delta, reason, dedupe_key)
    values (auth.uid(), v_row.coins, 'streak_' || v_row.streak_days, 'streak:' || v_row.streak_days)
    on conflict (user_id, dedupe_key) do nothing;
    if found then v_awarded := v_awarded + v_row.coins; end if;
  end loop;
  return v_awarded;
end $$;

-- ---------------------------------------------------------------------------
-- 5. Shop.
-- ---------------------------------------------------------------------------
create table if not exists public.shop_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_uz text not null,
  name_en text not null,
  description_uz text not null default '',
  description_en text not null default '',
  cost_coins int not null check (cost_coins > 0),
  telegram_stars int,
  art text not null default 'gift',
  sort_order int not null default 0,
  active boolean not null default true
);

create type public.order_status as enum ('pending','fulfilled','cancelled');

create table if not exists public.shop_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  item_id uuid not null references public.shop_items,
  cost_coins int not null,
  telegram_username text,
  status public.order_status not null default 'pending',
  note text,
  created_at timestamptz not null default now(),
  fulfilled_at timestamptz,
  fulfilled_by uuid references public.profiles(id)
);
create index if not exists idx_orders_user on public.shop_orders(user_id, created_at desc);
create index if not exists idx_orders_pending on public.shop_orders(status, created_at) where status = 'pending';

-- Atomic purchase: balance is re-checked inside the transaction, so two
-- parallel requests cannot both spend the same coins.
create or replace function public.purchase_item(p_slug text, p_telegram text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_item record; v_balance int; v_order uuid;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select * into v_item from shop_items where slug = p_slug and active;
  if v_item is null then raise exception 'item_not_found'; end if;

  if coalesce(trim(p_telegram), '') = '' then raise exception 'telegram_required'; end if;

  -- Serialise this user's ledger for the duration of the transaction.
  perform 1 from coin_events where user_id = auth.uid() for update;
  v_balance := coin_balance(auth.uid());
  if v_balance < v_item.cost_coins then raise exception 'insufficient_coins'; end if;

  insert into shop_orders(user_id, item_id, cost_coins, telegram_username)
  values (auth.uid(), v_item.id, v_item.cost_coins, trim(p_telegram))
  returning id into v_order;

  insert into coin_events(user_id, delta, reason, dedupe_key)
  values (auth.uid(), -v_item.cost_coins, 'purchase:' || v_item.slug, 'order:' || v_order::text);

  return v_order;
end $$;

-- Owner/admin fulfilment, with an audit trail.
create or replace function public.fulfil_order(p_order uuid, p_note text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and role in ('admin','owner')) then
    raise exception 'forbidden';
  end if;
  update shop_orders set status = 'fulfilled', fulfilled_at = now(), fulfilled_by = auth.uid(), note = coalesce(p_note, note)
   where id = p_order and status = 'pending';
  insert into audit_logs(actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'shop.fulfil', 'shop_order', p_order, jsonb_build_object('note', p_note));
end $$;

-- ---------------------------------------------------------------------------
-- 6. Catalogue. 15-star Telegram gift tier, priced at 15 coins.
--    Art is drawn in the app as original SVG; no Telegram artwork is copied.
-- ---------------------------------------------------------------------------
insert into public.shop_items(slug,name_uz,name_en,description_uz,description_en,cost_coins,telegram_stars,art,sort_order) values
 ('tg-bear','Ayiqcha','Teddy Bear','Telegram sovg‘asi — 15 yulduz.','Telegram gift — 15 stars.',15,15,'bear',1),
 ('tg-heart','Yurak','Heart','Telegram sovg‘asi — 15 yulduz.','Telegram gift — 15 stars.',15,15,'heart',2),
 ('tg-cake','Tort','Cake','Telegram sovg‘asi — 15 yulduz.','Telegram gift — 15 stars.',15,15,'cake',3),
 ('tg-star','Yulduz','Star','Telegram sovg‘asi — 15 yulduz.','Telegram gift — 15 stars.',15,15,'star',4),
 ('tg-rocket','Raketa','Rocket','Telegram sovg‘asi — 15 yulduz.','Telegram gift — 15 stars.',15,15,'rocket',5),
 ('tg-rose','Atirgul','Rose','Telegram sovg‘asi — 15 yulduz.','Telegram gift — 15 stars.',15,15,'rose',6)
on conflict (slug) do update set
 name_uz=excluded.name_uz,name_en=excluded.name_en,cost_coins=excluded.cost_coins,
 telegram_stars=excluded.telegram_stars,art=excluded.art,sort_order=excluded.sort_order;

-- ---------------------------------------------------------------------------
-- 7. Security. Read your own; write nothing.
-- ---------------------------------------------------------------------------
alter table public.daily_activity enable row level security;
alter table public.coin_events    enable row level security;
alter table public.coin_rules     enable row level security;
alter table public.shop_items     enable row level security;
alter table public.shop_orders    enable row level security;

drop policy if exists "own activity"    on public.daily_activity;
drop policy if exists "own coins"       on public.coin_events;
drop policy if exists "read coin rules" on public.coin_rules;
drop policy if exists "read shop"       on public.shop_items;
drop policy if exists "own orders"      on public.shop_orders;
drop policy if exists "staff orders"    on public.shop_orders;
drop policy if exists "owner edits shop" on public.shop_items;

create policy "own activity"    on public.daily_activity for select using (user_id = auth.uid());
create policy "own coins"       on public.coin_events    for select using (user_id = auth.uid());
create policy "read coin rules" on public.coin_rules     for select using (true);
create policy "read shop"       on public.shop_items     for select using (active);
create policy "own orders"      on public.shop_orders    for select using (user_id = auth.uid());
create policy "staff orders"    on public.shop_orders    for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','owner')));
create policy "owner edits shop" on public.shop_items for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'));

-- The browser may never mint, spend, or backdate anything.
revoke insert, update, delete on public.coin_events    from anon, authenticated;
revoke insert, update, delete on public.daily_activity from anon, authenticated;
revoke insert, update, delete on public.shop_orders    from anon, authenticated;
revoke all on function public.claim_streak_coins()             from anon;
revoke all on function public.purchase_item(text, text)        from anon;
revoke all on function public.record_activity(int, int)        from anon;
revoke all on function public.fulfil_order(uuid, text)         from anon, authenticated;
grant execute on function public.record_activity(int, int)     to authenticated;
grant execute on function public.claim_streak_coins()          to authenticated;
grant execute on function public.purchase_item(text, text)     to authenticated;
grant execute on function public.coin_balance(uuid)            to authenticated;
grant execute on function public.qualifying_streak(uuid)       to authenticated;
grant execute on function public.fulfil_order(uuid, text)      to authenticated; -- role checked inside
