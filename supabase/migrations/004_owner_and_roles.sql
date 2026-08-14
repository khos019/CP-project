-- AlgoYo‘l — owner emailini yangilash va rollarni boshqarish yordamchilari.
-- 001, 002, 003 dan KEYIN ishga tushiring.

-- 1) Owner emaillari ro'yxati. Kerak bo'lsa shu yerga qator qo'shing/olib tashlang.
create or replace function public.algoyol_owner_emails()
returns text[]
language sql
immutable
as $$
  select array[
    'm.u.ubaydullayev@gmail.com'
    -- , 'ozodbekhaydaraliyev2000@gmail.com'   -- ikkinchi founder ham owner bo'lsin desangiz shu qatorni oching
  ]::text[]
$$;

-- 2) Yangi ro'yxatdan o'tgan foydalanuvchi uchun profil yaratish va rolni belgilash.
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
      when lower(new.email) = any (public.algoyol_owner_emails()) then 'owner'::public.user_role
      else 'user'::public.user_role
    end
  )
  on conflict (id) do nothing;
  return new;
end
$$;

-- 3) Allaqachon ro'yxatdan o'tgan owner(lar)ni ko'tarish.
update public.profiles as profile
set role = 'owner'::public.user_role
from auth.users as account
where account.id = profile.id
  and lower(account.email) = any (public.algoyol_owner_emails());

-- 4) Foydalanuvchi o'z profilini o'qiy olishi kerak (rol UI'da ishlashi uchun).
--    001 dagi "public profiles" policy allaqachon select ga ruxsat beradi;
--    quyidagisi o'sha policy o'chirilgan bo'lsa ham ishlashi uchun.
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles
  for select using (auth.uid() = id or true);

-- 5) Faqat owner boshqa foydalanuvchining rolini o'zgartira oladi.
create or replace function public.set_user_role(p_user uuid, p_role public.user_role)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'owner') then
    raise exception 'Faqat owner rol bera oladi';
  end if;
  if p_user = auth.uid() then
    raise exception 'Owner o''z rolini o''zgartira olmaydi';
  end if;
  update public.profiles set role = p_role where id = p_user;
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'role.set', 'profile', p_user, jsonb_build_object('role', p_role));
end
$$;

revoke all on function public.set_user_role(uuid, public.user_role) from public;
grant execute on function public.set_user_role(uuid, public.user_role) to authenticated;
