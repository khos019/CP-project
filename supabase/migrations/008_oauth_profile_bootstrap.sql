-- AlgoYo'l — sensible profiles for OAuth (Google) sign-ups.
--
-- Email sign-up sends a username in raw_user_meta_data. Google does not: it
-- sends full_name / name / avatar_url / picture and no username at all. With
-- migration 007's trigger a Google user still gets a valid profile, but a
-- charmless one — username "user_a1b2c3d4", empty display name, no avatar,
-- even though Google just handed us all three.
--
-- This derives them instead:
--   * username     from the email local part, sanitised to the column's
--                  '^[a-zA-Z0-9_]{3,24}$' shape, de-duplicated on collision
--   * display_name from full_name / name
--   * avatar_url   from avatar_url / picture
--
-- An explicitly supplied username (email sign-up) still wins. Nothing is
-- invented: every value comes from the identity provider or is left empty.
--
-- Run AFTER 001-007. Safe to re-run.

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

  -- usernames are unique; walk to the first free variant instead of failing
  while exists (select 1 from public.profiles where username = candidate) loop
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
