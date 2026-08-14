-- Legacy bootstrap migration. Authority comes from trusted auth app_metadata,
-- never from a personal email committed to source control.
create or replace function public.bootstrap_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, username, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'display_name', ''),
    case when new.raw_app_meta_data->>'role' in ('owner','admin')
      then (new.raw_app_meta_data->>'role')::public.user_role
      else 'user'::public.user_role end
  );
  return new;
end
$$;
