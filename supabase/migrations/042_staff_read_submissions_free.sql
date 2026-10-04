-- 042: admins and the owner read any submission's source for free.
--
-- Since 015 the source opens for its author, for anyone who has solved the
-- problem, and otherwise for 3 coins. Staff review code as part of the job —
-- checking a report, judging a disputed verdict — and charging them for that
-- made the moderation screens cost coins. The role check joins the free cases
-- in all three places the decision is made, so the list's lock, the read and
-- the purchase can never disagree.

create or replace function public.is_staff(p_user uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = p_user and role in ('admin', 'owner'))
$$;

create or replace function public.user_submissions(p_user uuid, p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare result jsonb; v_me uuid := auth.uid(); v_staff boolean := is_staff(auth.uid());
begin
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
             'readable',      (v_me is not null and (
                                 v_staff
                                 or s.user_id = v_me
                                 or exists (select 1 from submission_unlocks u
                                             where u.viewer_id = v_me and u.submission_id = s.id)
                                 or has_solved(v_me, s.problem_key)))
           ) as payload
    from bank_submissions s
    where s.user_id = p_user
    order by s.created_at desc
    limit least(greatest(coalesce(p_limit, 50), 1), 200)
  ) x;
  return result;
end $$;

create or replace function public.submission_code(p_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_row bank_submissions;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'reason', 'not_authenticated'); end if;
  select * into v_row from bank_submissions where id = p_id;
  if not found then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;

  if is_staff(v_me)
     or v_row.user_id = v_me
     or exists (select 1 from submission_unlocks u where u.viewer_id = v_me and u.submission_id = p_id)
     or has_solved(v_me, v_row.problem_key) then
    return jsonb_build_object('ok', true, 'source', v_row.source_code, 'language', v_row.language);
  end if;

  return jsonb_build_object('ok', false, 'reason', 'locked',
                            'cost', submission_unlock_cost(),
                            'balance', coin_balance(v_me));
end $$;

create or replace function public.unlock_submission(p_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_row bank_submissions; v_cost int := submission_unlock_cost();
begin
  if v_me is null then raise exception 'not_authenticated'; end if;
  select * into v_row from bank_submissions where id = p_id;
  if not found then raise exception 'not_found'; end if;

  -- Staff never reach the ledger: a stale client that still shows the buy
  -- button must not charge them.
  if is_staff(v_me)
     or v_row.user_id = v_me
     or exists (select 1 from submission_unlocks u where u.viewer_id = v_me and u.submission_id = p_id)
     or has_solved(v_me, v_row.problem_key) then
    return jsonb_build_object('ok', true, 'charged', 0, 'source', v_row.source_code, 'language', v_row.language);
  end if;

  if coin_balance(v_me) < v_cost then
    raise exception 'insufficient_coins';
  end if;

  insert into coin_events(user_id, delta, reason, dedupe_key)
  values (v_me, -v_cost, 'unlock_submission', 'unlock:' || p_id::text);
  insert into submission_unlocks(viewer_id, submission_id) values (v_me, p_id)
  on conflict do nothing;

  return jsonb_build_object('ok', true, 'charged', v_cost,
                            'source', v_row.source_code, 'language', v_row.language);
end $$;

revoke all on function public.is_staff(uuid) from public;
grant execute on function public.is_staff(uuid) to authenticated;
revoke all on function public.submission_code(uuid) from public;
revoke all on function public.unlock_submission(uuid) from public;
grant execute on function public.submission_code(uuid) to authenticated;
grant execute on function public.unlock_submission(uuid) to authenticated;
grant execute on function public.user_submissions(uuid, int) to anon, authenticated;
