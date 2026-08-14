-- AlgoYo'l — per-account roadmap progress.
--
-- Until now every quiz score and solve lived in the browser's localStorage,
-- so progress was per-device and vanished on a new browser. This moves it to
-- the account. Keys match the unit ids the app already uses (e.g.
-- 'binary-search-3'), so existing local progress maps across unchanged.
--
-- Run AFTER 001-005.

create table if not exists public.unit_progress (
  -- defaulted from the session so the client never sends a user id, and RLS
  -- still refuses anything that is not the caller's own row
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  unit_slug text not null check (unit_slug ~ '^[a-z0-9-]{3,64}$'),
  quiz_score int not null default 0 check (quiz_score between 0 and 100),
  solved boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, unit_slug)
);

create index if not exists idx_unit_progress_user on public.unit_progress(user_id);

alter table public.unit_progress enable row level security;

drop policy if exists "own unit progress read"   on public.unit_progress;
drop policy if exists "own unit progress write"  on public.unit_progress;
drop policy if exists "own unit progress update" on public.unit_progress;

create policy "own unit progress read"   on public.unit_progress
  for select using (user_id = auth.uid());
create policy "own unit progress write"  on public.unit_progress
  for insert with check (user_id = auth.uid());
create policy "own unit progress update" on public.unit_progress
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Keep updated_at honest without trusting the client.
create or replace function public.touch_unit_progress()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists trg_touch_unit_progress on public.unit_progress;
create trigger trg_touch_unit_progress before insert or update on public.unit_progress
  for each row execute function public.touch_unit_progress();
