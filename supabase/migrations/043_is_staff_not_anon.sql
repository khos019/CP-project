-- 043: is_staff stops answering signed-out callers.
--
-- 042 revoked it from public, but Supabase's default privileges grant execute
-- to anon directly, so anyone could still ask whether a given id is staff.
-- user_submissions (granted to anon) keeps working: it is security definer and
-- calls is_staff as its owner, not as the caller.
revoke execute on function public.is_staff(uuid) from anon;
