-- AlgoYo'l — profile identity fields and avatar storage.
--
-- The profile page lets a learner manage who they are on the platform. Until
-- now the only editable identity was display_name/username, and avatar_url had
-- nowhere to store an image. This adds:
--   * bio and country columns (public, optional, length-bounded)
--   * a public "avatars" storage bucket with per-account write isolation
--
-- The app capability-detects both, so it keeps working before this runs — the
-- bio/location fields and the upload control stay disabled with an explanation
-- instead of failing silently.
--
-- Run AFTER 001-006.

alter table public.profiles
  add column if not exists bio text not null default '',
  add column if not exists country text not null default '';

-- Trim anything that would fail the length checks below, so applying this on a
-- live database can never abort halfway.
update public.profiles set display_name = left(display_name, 40) where length(display_name) > 40;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_bio_length') then
    alter table public.profiles add constraint profiles_bio_length check (length(bio) <= 280);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_country_length') then
    alter table public.profiles add constraint profiles_country_length check (length(country) <= 60);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_display_name_length') then
    alter table public.profiles add constraint profiles_display_name_length check (length(display_name) <= 40);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Avatar storage. Public read (avatars appear on the leaderboard and profiles),
-- writes restricted to the caller's own folder: avatars/<uid>/<file>.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152,
        array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update
  set public = true,
      file_size_limit = 2097152,
      allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];

drop policy if exists "avatars public read"   on storage.objects;
drop policy if exists "avatars own insert"    on storage.objects;
drop policy if exists "avatars own update"    on storage.objects;
drop policy if exists "avatars own delete"    on storage.objects;

create policy "avatars public read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars own insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars own update" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars own delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------------------------------------
-- The bootstrap trigger inserts a profile whose username must satisfy
-- '^[a-zA-Z0-9_]{3,24}$'. A signup with a username outside that shape used to
-- fail the trigger and leave an auth user with no profile. The client now
-- validates the same shape, and this sanitises anything that still slips past.
-- ---------------------------------------------------------------------------
create or replace function public.bootstrap_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested text := coalesce(new.raw_user_meta_data->>'username', '');
  candidate text;
  suffix int := 0;
begin
  candidate := regexp_replace(requested, '[^a-zA-Z0-9_]', '', 'g');
  if length(candidate) < 3 or length(candidate) > 24 then
    candidate := 'user_' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;
  -- usernames are unique; walk to the first free variant instead of failing
  while exists (select 1 from public.profiles where username = candidate) loop
    suffix := suffix + 1;
    candidate := substr(candidate, 1, 20) || suffix::text;
  end loop;

  insert into public.profiles(id, username, display_name, role)
  values (
    new.id,
    candidate,
    left(coalesce(new.raw_user_meta_data->>'display_name', ''), 40),
    case
      when lower(new.email) = any (public.algoyol_owner_emails()) then 'owner'::public.user_role
      else 'user'::public.user_role
    end
  )
  on conflict (id) do nothing;
  return new;
end
$$;
