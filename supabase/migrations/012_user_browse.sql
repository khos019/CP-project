-- AlgoYo'l — browsing accounts, not just searching for one.
--
-- 010 shipped a search that answered "who is this person?". Two questions it
-- could not answer turned out to matter more day to day:
--
--   "who is on the platform?"      — an empty search box returned nothing, so
--                                    the page was blank until you already knew
--                                    a name to type
--   "who joined on this day?"      — the statistics chart shows a bar of five
--                                    sign-ups with no way to see which five
--
-- Both are the same query with a different filter, so this replaces the
-- function rather than adding two more beside it: one shape of row, one place
-- where the owner gate and the email exposure are decided.
--
-- Run AFTER 001-011. Safe to re-run.

-- The old two-argument form has to go: leaving it in place would make
-- owner_search_users ambiguous to PostgREST when only p_query is supplied.
drop function if exists public.owner_search_users(text, int);

create or replace function public.owner_search_users(
  p_query text default null,
  p_day date default null,
  p_limit int default 25
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
  term text := btrim(coalesce(p_query, ''));
  needle text;
  browsing boolean := (term = '');
begin
  if not public.is_owner() then
    raise exception 'Only the owner can list users' using errcode = '42501';
  end if;

  -- Used as a LIKE pattern, so the caller's own wildcards are escaped: a
  -- search for "100%" looks for that text, not for "100" followed by anything.
  needle := '%' || replace(replace(replace(term, '\', '\\'), '%', '\%'), '_', '\_') || '%';

  -- With no search term the answer is "the newest accounts", so the ranking
  -- swaps from relevance to recency. Both orders travel beside the row: an
  -- aggregate imposes its own order otherwise.
  select coalesce(jsonb_agg(payload order by exact desc, prefix desc, joined desc, handle), '[]'::jsonb)
    into result
  from (
    select
      (not browsing and lower(p.username) = lower(term)) as exact,
      (not browsing and p.username ilike replace(replace(term, '\', '\\'), '%', '\%') || '%') as prefix,
      p.created_at as joined,
      p.username as handle,
      jsonb_build_object(
        'id',               p.id,
        'username',         p.username,
        'display_name',     p.display_name,
        'avatar_url',       p.avatar_url,
        'email',            u.email,
        'role',             p.role,
        'duel_rating',      p.duel_rating,
        'solved_count',     p.solved_count,
        'created_at',       p.created_at,
        'last_sign_in_at',  u.last_sign_in_at,
        'email_confirmed',  (u.email_confirmed_at is not null),
        'suspended_at',     p.suspended_at,
        'suspended_reason', p.suspended_reason
      ) as payload
    from public.profiles p
    join auth.users u on u.id = p.id
    where (browsing
           or p.username ilike needle
           or p.display_name ilike needle
           or u.email ilike needle)
      -- 009 buckets the chart on UTC midnight boundaries, so the drill-down
      -- uses the same half-open range: a different clock, or a date cast on
      -- the column, would make the bar's count and this list disagree. Kept as
      -- a range on the raw column so an index on created_at can still serve it.
      and (p_day is null
           or (p.created_at >= (p_day::timestamp at time zone 'UTC')
           and p.created_at <  ((p_day + 1)::timestamp at time zone 'UTC')))
    order by exact desc, prefix desc, joined desc, handle
    limit greatest(1, least(coalesce(p_limit, 25), 200))
  ) ranked;

  return result;
end
$$;

revoke all on function public.owner_search_users(text, date, int) from public;
grant execute on function public.owner_search_users(text, date, int) to authenticated;
