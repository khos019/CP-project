-- AlgoYo'l — friends, a public submission history, and paid code viewing.
--
-- Three things the platform could not do:
--
--   1. Follow somebody. There was no way to keep a person you met in a duel.
--   2. See what anyone has been solving. Verdicts existed only in the browser
--      that produced them, so a profile could not show a history at all.
--   3. Read somebody else's solution. Which is the hard one: showing every
--      source publicly turns every problem into a copy-paste, and hiding it
--      completely means nobody ever learns from a better solution.
--
-- The rule this settles on: if you have solved the problem yourself, other
-- people's code for it is free — you already have nothing to gain by copying.
-- If you have not, it costs coins. So the paywall only ever stands in front of
-- the one person it is meant to stop.
--
-- 001 has a `submissions` table, but it is keyed to a `problems` row and the
-- app judges a static problem bank identified by text. Rather than bend one
-- into the other, bank submissions get their own table.
--
-- Run AFTER 001-014. Safe to re-run.

-- ---------------------------------------------------------------------------
-- 1. Friends. One-directional, like Codeforces: adding somebody is a note to
--    yourself, not a request they have to accept, so there is nothing to
--    approve and nothing to notify.
-- ---------------------------------------------------------------------------
create table if not exists public.friends (
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  friend_id uuid not null references public.profiles on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  constraint friends_not_self check (user_id <> friend_id)
);
create index if not exists idx_friends_user on public.friends(user_id, created_at desc);

alter table public.friends enable row level security;
-- Who you follow is your own business: only you can read or change your list.
-- Nobody can see who has added them, which is also what keeps the star from
-- turning into a popularity number people play for.
drop policy if exists "own friends read" on public.friends;
create policy "own friends read" on public.friends for select using (user_id = auth.uid());
drop policy if exists "own friends add" on public.friends;
create policy "own friends add" on public.friends for insert with check (user_id = auth.uid());
drop policy if exists "own friends remove" on public.friends;
create policy "own friends remove" on public.friends for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 2. Submissions against the static problem bank.
--
--    The title is stored beside the key on purpose: a history that renders
--    "problem-17" after the bank is renamed is not a history.
-- ---------------------------------------------------------------------------
create table if not exists public.bank_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  problem_key text not null,
  problem_title text not null default '',
  language text not null check (language in ('cpp20', 'python3')),
  verdict text not null,
  runtime_ms int,
  memory_kb int,
  passed int,
  total int,
  source_code text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_bank_sub_user on public.bank_submissions(user_id, created_at desc);
create index if not exists idx_bank_sub_problem on public.bank_submissions(problem_key);

alter table public.bank_submissions enable row level security;
-- RLS is per row, and the secret here is one column. So the table itself stays
-- private to its author and every other reader goes through the functions
-- below, which decide column by column what may leave.
drop policy if exists "own submissions read" on public.bank_submissions;
create policy "own submissions read" on public.bank_submissions for select using (user_id = auth.uid());
drop policy if exists "own submissions write" on public.bank_submissions;
create policy "own submissions write" on public.bank_submissions for insert with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 3. Who has bought which source. An unlock is permanent: paying twice for the
--    same page would be a trap, not a price.
-- ---------------------------------------------------------------------------
create table if not exists public.submission_unlocks (
  viewer_id uuid not null default auth.uid() references public.profiles on delete cascade,
  submission_id uuid not null references public.bank_submissions on delete cascade,
  created_at timestamptz not null default now(),
  primary key (viewer_id, submission_id)
);
alter table public.submission_unlocks enable row level security;
drop policy if exists "own unlocks read" on public.submission_unlocks;
create policy "own unlocks read" on public.submission_unlocks for select using (viewer_id = auth.uid());

-- The price lives in one place, and the client is told it rather than being
-- trusted to know it — a UI that says "3" while the ledger charges something
-- else is how people end up feeling cheated.
create or replace function public.submission_unlock_cost()
returns int language sql immutable as $$ select 3 $$;

-- Has this account solved this problem itself? The whole free/paid decision
-- turns on it.
create or replace function public.has_solved(p_user uuid, p_key text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from bank_submissions
     where user_id = p_user and problem_key = p_key and verdict = 'ACCEPTED')
$$;

-- ---------------------------------------------------------------------------
-- 4. The public history: everything about a submission except the code.
-- ---------------------------------------------------------------------------
create or replace function public.user_submissions(p_user uuid, p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare result jsonb; v_me uuid := auth.uid();
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
             -- Whether this viewer may read the source, so the list can show a
             -- lock or a link without a request per row.
             'readable',      (v_me is not null and (
                                 s.user_id = v_me
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

-- ---------------------------------------------------------------------------
-- 5. The code itself, and buying access to it.
-- ---------------------------------------------------------------------------
create or replace function public.submission_code(p_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_row bank_submissions;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'reason', 'not_authenticated'); end if;
  select * into v_row from bank_submissions where id = p_id;
  if not found then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;

  if v_row.user_id = v_me
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

  -- Free cases are answered rather than charged, so a client that asks the
  -- wrong question does not cost its user coins.
  if v_row.user_id = v_me
     or exists (select 1 from submission_unlocks u where u.viewer_id = v_me and u.submission_id = p_id)
     or has_solved(v_me, v_row.problem_key) then
    return jsonb_build_object('ok', true, 'charged', 0, 'source', v_row.source_code, 'language', v_row.language);
  end if;

  if coin_balance(v_me) < v_cost then
    raise exception 'insufficient_coins';
  end if;

  -- The ledger is the record; the unlock row is the index. Both or neither:
  -- this is one statement's transaction.
  insert into coin_events(user_id, delta, reason, dedupe_key)
  values (v_me, -v_cost, 'unlock_submission', 'unlock:' || p_id::text);
  insert into submission_unlocks(viewer_id, submission_id) values (v_me, p_id)
  on conflict do nothing;

  return jsonb_build_object('ok', true, 'charged', v_cost,
                            'source', v_row.source_code, 'language', v_row.language);
end $$;

revoke all on function public.submission_code(uuid) from public;
revoke all on function public.unlock_submission(uuid) from public;
grant execute on function public.submission_code(uuid) to authenticated;
grant execute on function public.unlock_submission(uuid) to authenticated;
grant execute on function public.user_submissions(uuid, int) to anon, authenticated;
grant execute on function public.submission_unlock_cost() to anon, authenticated;
