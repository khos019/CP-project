-- 081: a custom round can be joined while it runs.
--
-- 068 closed registration at the start, so anyone who arrived a few minutes
-- late could only watch. Registration now stays open until the round ends, as
-- on Codeforces with late registration on: a late entrant simply has less time.
-- Their penalty is still counted from the round's start, the same clock as
-- everybody else's, so joining late buys nothing.
--
-- Unregistering is unchanged (only before the start), and contest_judge_spec
-- needs nothing new: it already accepts any registered participant while the
-- round runs.
--
-- Run AFTER 068. Safe to re-run.

create or replace function public.contest_register(p_slug text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_c contests;
begin
  if v_me is null then raise exception 'not_authenticated'; end if;
  select * into v_c from contests where slug = p_slug;
  if not found or (v_c.hidden and not contest_can_preview(v_c.id)) then raise exception 'not_found'; end if;
  if v_c.kind <> 'custom' then raise exception 'not_custom'; end if;
  -- Registration closes when the round ends.
  if now() >= v_c.starts_at + make_interval(mins => v_c.duration_minutes) then raise exception 'finished'; end if;
  insert into contest_registrations (contest_id, user_id) values (v_c.id, v_me) on conflict do nothing;
  return jsonb_build_object('ok', true,
    'registered', (select count(*) from contest_registrations r where r.contest_id = v_c.id));
end $$;

revoke all on function public.contest_register(text) from public;
grant execute on function public.contest_register(text) to authenticated;
