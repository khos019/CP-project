-- AlgoYo'l — the contest list names each round's winner.
--
-- The archive card shows "G'olib: …". The winner is read off the same board
-- contest_standings() computes, never stored, so the list and the standings
-- page cannot name different people.
--
-- Same function as 044 with one field added. The page works without it and
-- simply leaves the line out until this is applied.
--
-- Run AFTER 044. Safe to re-run.

create or replace function public.contest_list()
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(x.payload order by x.starts_at desc), '[]'::jsonb)
  from (
    select c.starts_at,
           jsonb_build_object(
             'slug',             c.slug,
             'number',           c.number,
             'title_uz',         c.title_uz,
             'title_en',         c.title_en,
             'starts_at',        c.starts_at,
             'duration_minutes', c.duration_minutes,
             'archived',         c.archived,
             'participants',     (select count(distinct e.user_id) from contest_entries e
                                   where e.contest_id = c.id),
             'problems',         (select coalesce(jsonb_agg(jsonb_build_object(
                                            'idx', p.idx, 'rating', p.rating) order by p.idx), '[]'::jsonb)
                                    from contest_problems p where p.contest_id = c.id),
             'winner',           (select jsonb_build_object('username', w ->> 'username',
                                                            'display_name', w ->> 'display_name')
                                    from jsonb_array_elements(contest_standings(c.slug) -> 'rows') w
                                   limit 1)
           ) as payload
    from contests c
  ) x
$$;

revoke all on function public.contest_list() from public;
grant execute on function public.contest_list() to anon, authenticated;
