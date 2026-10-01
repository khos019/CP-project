-- AlgoYo'l — the level check is answered once, per account.
--
-- "Have you dealt with the level check?" used to live only in localStorage,
-- so the offer banner came back on every other browser, after a cache clear,
-- and on the phone of somebody who had already taken the test on a laptop.
-- That is the wrong place for it: taking the test is an account-level fact,
-- like a solved problem, not a per-device preference.
--
-- One row per learner. `taken` is set when a result screen is reached,
-- `dismissed` when the banner's ✕ is pressed or the learner chooses to start
-- from zero. Either one is enough to stop offering; both are kept so the
-- owner can tell "measured themselves" from "said no".
--
-- Run AFTER 001-038. Until it is applied the app keeps the local flags and
-- simply behaves as it did before — per browser.

create table if not exists public.placement_state (
  -- defaulted from the session so the client never sends a user id, and RLS
  -- still refuses anything that is not the caller's own row
  user_id uuid primary key default auth.uid() references public.profiles on delete cascade,
  taken boolean not null default false,
  dismissed boolean not null default false,
  -- the rating the last finished attempt estimated; null while only dismissed
  level int check (level is null or level between 0 and 4000),
  updated_at timestamptz not null default now()
);

alter table public.placement_state enable row level security;

drop policy if exists "own placement read"   on public.placement_state;
drop policy if exists "own placement write"  on public.placement_state;
drop policy if exists "own placement update" on public.placement_state;

create policy "own placement read"   on public.placement_state
  for select using (user_id = auth.uid());
create policy "own placement write"  on public.placement_state
  for insert with check (user_id = auth.uid());
create policy "own placement update" on public.placement_state
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Once true, never false again: an upsert from a second device must not undo
-- what the first one recorded, and the client has no business clearing it.
create or replace function public.keep_placement_flags()
returns trigger language plpgsql as $$
begin
  new.taken     := old.taken     or new.taken;
  new.dismissed := old.dismissed or new.dismissed;
  new.level     := coalesce(new.level, old.level);
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_placement_state_keep on public.placement_state;
create trigger trg_placement_state_keep before update on public.placement_state
  for each row execute function public.keep_placement_flags();
