-- AlgoYo'l — every submission sent in a round, for the round's "Yechimlar" tab.
--
-- The Codeforces "Status" page: newest first, filterable by problem and by
-- verdict, a page at a time. Like contest_standings() it reads the attempts
-- inside the round's window from bank_submissions through contest_entries, so
-- a row here is the same row as on that person's submissions page. Never the
-- code: that stays behind submission_code() and its unlock rules.
--
-- Run AFTER 044. Safe to re-run.

create or replace function public.contest_status(
  p_slug text,
  p_idx text default null,
  p_verdict text default null,     -- 'ACCEPTED', 'REJECTED' (anything else), or null for all
  p_limit int default 50,
  p_offset int default 0
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests; result jsonb;
begin
  select * into v_c from contests where slug = p_slug;
  if not found then return null; end if;

  with e as (
    select s.id, s.created_at, s.language, s.verdict, s.passed, s.total, s.runtime_ms, s.memory_kb,
           ce.idx, pr.username, pr.display_name
      from contest_entries ce
      join bank_submissions s on s.id = ce.submission_id
      join profiles pr on pr.id = ce.user_id
     where ce.contest_id = v_c.id
       and s.created_at >= v_c.starts_at
       and s.created_at <  v_c.starts_at + make_interval(mins => v_c.duration_minutes)
       and (p_idx is null or ce.idx = upper(p_idx))
       and (p_verdict is null
            or (p_verdict = 'ACCEPTED' and s.verdict = 'ACCEPTED')
            or (p_verdict = 'REJECTED' and s.verdict <> 'ACCEPTED'))
  )
  select jsonb_build_object(
    'total', (select count(*) from e),
    'rows', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', x.id, 'created_at', x.created_at,
               'minute', floor(extract(epoch from (x.created_at - v_c.starts_at)) / 60)::int,
               'idx', x.idx, 'username', x.username, 'display_name', x.display_name,
               'language', x.language, 'verdict', x.verdict, 'passed', x.passed, 'total', x.total,
               'runtime_ms', x.runtime_ms, 'memory_kb', x.memory_kb
             ) order by x.created_at desc)
        from (select * from e order by created_at desc
               limit least(greatest(coalesce(p_limit, 50), 1), 100)
              offset greatest(coalesce(p_offset, 0), 0)) x), '[]'::jsonb)
  ) into result;
  return result;
end $$;

revoke all on function public.contest_status(text, text, text, int, int) from public;
grant execute on function public.contest_status(text, text, text, int, int) to anon, authenticated;
