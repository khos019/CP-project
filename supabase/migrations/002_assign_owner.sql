-- Assign the single AlgoYo‘l owner by verified Supabase Auth email.
-- This migration also promotes the account if it already exists.
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
    case
      when lower(new.email) = 'ozodbekhaydaraliyev2000@gmail.com' then 'owner'::public.user_role
      else 'user'::public.user_role
    end
  );
  return new;
end
$$;

update public.profiles as profile
set role = 'owner'::public.user_role
from auth.users as account
where account.id = profile.id
  and lower(account.email) = 'ozodbekhaydaraliyev2000@gmail.com';
