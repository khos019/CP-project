-- AlgoYo'l — a contest can be hidden without being deleted.
--
-- contests.hidden takes a round off the site for everybody but the owner:
-- contest_list() leaves it out, contest_standings() and contest_status()
-- answer as if it did not exist. Nothing is removed — the round, its board,
-- and every submission on the participants' profiles stay exactly as they
-- are — so showing it again is one update:
--
--   update public.contests set hidden = false;            -- every round
--   update public.contests set hidden = false where slug = 'round-15';
--
-- (or: node tools/contests/seed.mjs --show-contests)
--
-- This migration hides every existing round, as asked on 2026-10-08.
--
-- Run AFTER 048. Safe to re-run, but re-running hides every round again.

alter table public.contests add column if not exists hidden boolean not null default false;

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
             'hidden',           c.hidden,
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
   where not c.hidden or is_owner()
  ) x
$$;

create or replace function public.contest_standings(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_c contests; result jsonb;
begin
  select * into v_c from contests where slug = p_slug;
  -- A hidden round answers like a missing one, to everybody but the owner.
  if not found or (v_c.hidden and not is_owner()) then return null; end if;

  with e as (
    select ce.user_id, ce.idx, s.verdict, s.created_at
      from contest_entries ce
      join bank_submissions s on s.id = ce.submission_id
     where ce.contest_id = v_c.id
       and s.created_at >= v_c.starts_at
       and s.created_at <  v_c.starts_at + make_interval(mins => v_c.duration_minutes)
       and s.verdict not in ('COMPILATION_ERROR', 'JUDGE_ERROR')
  ),
  first_ac as (
    select user_id, idx, min(created_at) as ac_at
      from e where verdict = 'ACCEPTED' group by user_id, idx
  ),
  cells as (
    select e.user_id, e.idx, f.ac_at,
           count(*) filter (where e.verdict <> 'ACCEPTED'
                              and (f.ac_at is null or e.created_at < f.ac_at))::int as wrong,
           case when f.ac_at is null then null
                else floor(extract(epoch from (f.ac_at - v_c.starts_at)) / 60)::int end as minute
      from e left join first_ac f on f.user_id = e.user_id and f.idx = e.idx
     group by e.user_id, e.idx, f.ac_at
  ),
  totals as (
    select user_id,
           count(ac_at)::int as solved,
           coalesce(sum(minute + v_c.penalty_minutes * wrong) filter (where ac_at is not null), 0)::int as penalty,
           max(ac_at) as last_ac
      from cells group by user_id
  ),
  ranked as (
    select t.*, rank() over (order by t.solved desc, t.penalty asc) as place
      from totals t
  )
  select jsonb_build_object(
    'contest', jsonb_build_object(
      'slug', v_c.slug, 'number', v_c.number,
      'title_uz', v_c.title_uz, 'title_en', v_c.title_en,
      'starts_at', v_c.starts_at, 'duration_minutes', v_c.duration_minutes,
      'penalty_minutes', v_c.penalty_minutes, 'archived', v_c.archived,
      'hidden', v_c.hidden),
    'problems', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'idx', p.idx, 'bank_id', p.bank_id, 'problem_key', p.problem_key,
               'title_uz', p.title_uz, 'title_en', p.title_en, 'rating', p.rating,
               'solved', (select count(*) from cells c where c.idx = p.idx and c.ac_at is not null),
               'tried',  (select count(*) from cells c where c.idx = p.idx)
             ) order by p.idx), '[]'::jsonb)
        from contest_problems p where p.contest_id = v_c.id),
    'rows', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'place',        r.place,
               'user_id',      r.user_id,
               'username',     pr.username,
               'display_name', pr.display_name,
               'avatar_url',   pr.avatar_url,
               'solved',       r.solved,
               'penalty',      r.penalty,
               'cells', (select coalesce(jsonb_object_agg(c.idx, jsonb_build_object(
                                  'ok', c.ac_at is not null, 'wrong', c.wrong, 'minute', c.minute)), '{}'::jsonb)
                           from cells c where c.user_id = r.user_id)
             ) order by r.place, r.last_ac nulls last, pr.username), '[]'::jsonb)
        from ranked r join profiles pr on pr.id = r.user_id)
  ) into result;

  return result;
end $$;

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
  if not found or (v_c.hidden and not is_owner()) then return null; end if;

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

revoke all on function public.contest_list() from public;
grant execute on function public.contest_list() to anon, authenticated;
revoke all on function public.contest_standings(text) from public;
grant execute on function public.contest_standings(text) to anon, authenticated;
revoke all on function public.contest_status(text, text, text, int, int) from public;
grant execute on function public.contest_status(text, text, text, int, int) to anon, authenticated;

update public.contests set hidden = true;
