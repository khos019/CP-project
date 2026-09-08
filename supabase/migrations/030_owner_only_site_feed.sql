-- 030: the site-wide submission feed becomes owner-only.
--
-- 028 shipped recent_submissions as the public pulse of the site: granted to
-- anon, readable signed out, every learner's verdict visible to every other
-- learner. That is the wrong default for this site — a feed of who failed what
-- is a moderation tool, not a social one — so the gate moves to where it can
-- actually hold.
--
-- The UI hiding the button is not the gate. The function is reachable over
-- PostgREST by anyone who knows its name, so the check has to live here.
create or replace function public.recent_submissions(p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare result jsonb; v_me uuid := auth.uid();
begin
  -- Same gate and same errcode as owner_platform_stats in 009, so a caller
  -- that is not the owner gets a refusal it can tell apart from an outage.
  if not exists (select 1 from public.profiles where id = v_me and role = 'owner') then
    raise exception 'Only the owner can read the site submission feed'
      using errcode = '42501';
  end if;

  select coalesce(jsonb_agg(payload order by created_at desc), '[]'::jsonb) into result
  from (
    select s.created_at,
           jsonb_build_object(
             'id',            s.id,
             'problem_key',   s.problem_key,
             'problem_title', s.problem_title,
             'language',      s.language,
             'verdict',       s.verdict,
             'runtime_ms',    s.runtime_ms,
             'memory_kb',     s.memory_kb,
             'passed',        s.passed,
             'total',         s.total,
             'created_at',    s.created_at,
             'author_id',       p.id,
             'author_username', p.username,
             'author_name',     p.display_name,
             'author_avatar',   p.avatar_url,
             'is_me',           (s.user_id = v_me),
             -- Only the owner reaches this line now, and the owner already
             -- holds submission.view_source in the role table, so the unlock
             -- and has_solved conditions 028 checked can no longer be false in
             -- any way that matters. Reading the source is the point of the
             -- screen.
             'readable',      true
           ) as payload
      from bank_submissions s
      join profiles p on p.id = s.user_id
     order by s.created_at desc
     limit least(greatest(coalesce(p_limit, 50), 1), 200)
  ) x;
  return result;
end $$;

-- Signed out has no role, so the grant itself goes.
revoke execute on function public.recent_submissions(int) from anon;
grant execute on function public.recent_submissions(int) to authenticated;
