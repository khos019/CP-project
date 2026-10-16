-- 054: duels against a chosen opponent.
--
-- The sender names the opponent by username, picks a rating for each of the
-- three problems and the length of the duel. The opponent gets an invitation
-- like a matchmaking challenge — on whatever screen they are on — and the duel
-- starts the moment they accept.
--
-- Friend duels are unrated: both players chose the difficulty, so letting the
-- result move a rating would make the rating something two friends can set.
-- duel_finish is re-created below for that; everything else about a duel (the
-- arena, rounds, submissions, history) is the same machinery as before.
--
-- Run AFTER 051. Safe to re-run.

-- 1. A third kind of duel.
alter table public.duel_matches drop constraint if exists duel_matches_mode_check;
alter table public.duel_matches add constraint duel_matches_mode_check check (mode in ('human', 'bot', 'friend'));

insert into public.duel_config(key, value, note) values
  ('friend_invite_ttl_seconds', '120'::jsonb, 'how long a friend-duel invitation waits for an answer')
on conflict (key) do nothing;

-- 2. Invitations. Read and written only through the functions below. Named
--    friend_duel_invites because 001 already created an unrelated, unused
--    duel_invites (token links) that "create table if not exists" would skip.
do $$ begin
  create type public.duel_invite_status as enum ('pending', 'accepted', 'declined', 'cancelled', 'expired');
exception when duplicate_object then null; end $$;

-- Named friend_duel_invites: 001 already created an unrelated, unused
-- duel_invites (token links), which "create table if not exists" would skip.
create table if not exists public.friend_duel_invites (
  id           uuid primary key default gen_random_uuid(),
  sender_id    uuid not null references public.profiles on delete cascade,
  receiver_id  uuid not null references public.profiles on delete cascade,
  ratings      int[] not null,
  minutes      int not null,
  status       public.duel_invite_status not null default 'pending',
  match_id     uuid references public.duel_matches on delete set null,
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null,
  responded_at timestamptz,
  constraint duel_invite_not_self check (sender_id <> receiver_id),
  constraint duel_invite_three check (array_length(ratings, 1) = 3),
  constraint duel_invite_minutes check (minutes between 5 and 120)
);
create index if not exists idx_friend_invite_inbox on public.friend_duel_invites(receiver_id, expires_at) where status = 'pending';
create index if not exists idx_friend_invite_outbox on public.friend_duel_invites(sender_id, expires_at) where status = 'pending';
alter table public.friend_duel_invites enable row level security;

-- 3. Send. Any earlier invitation of the sender's that is still waiting is
--    withdrawn: one open invitation per person keeps the inbox honest.
create or replace function public.duel_invite_friend(p_username text, p_ratings int[], p_minutes int)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me uuid := auth.uid();
  v_to uuid;
  v_id uuid;
  v_cancelled jsonb;
  r int;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;
  select id into v_to from profiles where lower(username) = lower(trim(both '@' from trim(p_username)));
  if v_to is null then return jsonb_build_object('ok', false, 'error', 'no_such_user'); end if;
  if v_to = v_me then return jsonb_build_object('ok', false, 'error', 'self'); end if;
  if coalesce(array_length(p_ratings, 1), 0) <> 3 then return jsonb_build_object('ok', false, 'error', 'bad_ratings'); end if;
  foreach r in array p_ratings loop
    if r is null or r < 800 or r > 2800 then return jsonb_build_object('ok', false, 'error', 'bad_ratings'); end if;
  end loop;
  if p_minutes is null or p_minutes < 5 or p_minutes > 120 then return jsonb_build_object('ok', false, 'error', 'bad_minutes'); end if;
  if exists (select 1 from duel_match_players where user_id = v_me and active) then
    return jsonb_build_object('ok', false, 'error', 'already_in_duel');
  end if;
  if exists (select 1 from duel_match_players where user_id = v_to and active) then
    return jsonb_build_object('ok', false, 'error', 'opponent_in_duel');
  end if;

  with gone as (
    update friend_duel_invites set status = 'cancelled', responded_at = now()
     where sender_id = v_me and status = 'pending'
     returning id, receiver_id)
  select coalesce(jsonb_agg(jsonb_build_object('invite_id', id, 'receiver_id', receiver_id)), '[]'::jsonb)
    into v_cancelled from gone;

  insert into friend_duel_invites(sender_id, receiver_id, ratings, minutes, expires_at)
  values (v_me, v_to, p_ratings, p_minutes,
          now() + (duel_cfg('friend_invite_ttl_seconds', 120) || ' seconds')::interval)
  returning id into v_id;

  return jsonb_build_object('ok', true, 'invite_id', v_id, 'receiver_id', v_to, 'cancelled', v_cancelled);
end $$;

-- 4. Answer. Accepting creates the duel in the same transaction; the partial
--    unique index on active players settles a race with any other duel.
create or replace function public.duel_invite_respond(p_invite uuid, p_accept boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me uuid := auth.uid();
  v_inv friend_duel_invites;
  v_match uuid;
  pts jsonb := (select value from duel_config where key = 'round_points');
  chosen text[] := '{}';
  v_key text;
  v_rate int;
  i int;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;
  select * into v_inv from friend_duel_invites where id = p_invite for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  if v_inv.receiver_id <> v_me then return jsonb_build_object('ok', false, 'error', 'not_yours'); end if;
  if v_inv.status <> 'pending' then return jsonb_build_object('ok', false, 'error', v_inv.status::text); end if;
  if now() >= v_inv.expires_at then
    update friend_duel_invites set status = 'expired', responded_at = now() where id = p_invite;
    return jsonb_build_object('ok', false, 'error', 'expired', 'sender_id', v_inv.sender_id);
  end if;

  if not p_accept then
    update friend_duel_invites set status = 'declined', responded_at = now() where id = p_invite;
    return jsonb_build_object('ok', true, 'accepted', false, 'sender_id', v_inv.sender_id);
  end if;

  if exists (select 1 from duel_match_players where user_id in (v_me, v_inv.sender_id) and active) then
    return jsonb_build_object('ok', false, 'error', 'in_another_duel', 'sender_id', v_inv.sender_id);
  end if;

  insert into duel_matches(mode, rounds, ends_at)
  values ('friend', 3, now() + (v_inv.minutes || ' minutes')::interval)
  returning id into v_match;

  insert into duel_match_players(match_id, seat, user_id, display_name, rating_before)
  select v_match, 1, p.id, coalesce(nullif(p.display_name, ''), p.username), coalesce(p.duel_rating, 1200)
    from profiles p where p.id = v_inv.sender_id;
  insert into duel_match_players(match_id, seat, user_id, display_name, rating_before)
  select v_match, 2, p.id, coalesce(nullif(p.display_name, ''), p.username), coalesce(p.duel_rating, 1200)
    from profiles p where p.id = v_me;

  -- One problem per chosen rating, nearest first, preferring one neither
  -- player has solved — the same rule duel_pick_problems applies.
  for i in 1 .. 3 loop
    select p.problem_key, p.rating into v_key, v_rate
      from duel_problem_pool p
     where p.enabled and not (p.problem_key = any(chosen))
       and not exists (select 1 from bank_submissions b
                        where b.problem_key = p.problem_key and b.verdict = 'ACCEPTED'
                          and b.user_id in (v_inv.sender_id, v_me))
     order by abs(p.rating - v_inv.ratings[i]), random() limit 1;
    if not found then
      select p.problem_key, p.rating into v_key, v_rate
        from duel_problem_pool p
       where p.enabled and not (p.problem_key = any(chosen))
       order by abs(p.rating - v_inv.ratings[i]), random() limit 1;
    end if;
    exit when not found;
    chosen := chosen || v_key;
    insert into duel_rounds(match_id, round, problem_key, problem_rating, points)
    values (v_match, i - 1, v_key, v_rate, coalesce((pts -> (i - 1) #>> '{}')::int, 100 * i));
  end loop;

  update friend_duel_invites set status = 'accepted', responded_at = now(), match_id = v_match where id = p_invite;
  return jsonb_build_object('ok', true, 'accepted', true, 'duel_id', v_match, 'sender_id', v_inv.sender_id);
end $$;

-- 5. Withdraw an invitation that has not been answered.
create or replace function public.duel_invite_cancel(p_invite uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_to uuid;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;
  update friend_duel_invites set status = 'cancelled', responded_at = now()
   where id = p_invite and sender_id = v_me and status = 'pending'
   returning receiver_id into v_to;
  if v_to is null then return jsonb_build_object('ok', false, 'error', 'not_pending'); end if;
  return jsonb_build_object('ok', true, 'receiver_id', v_to);
end $$;

-- 6. What the page needs to draw: the invitation waiting for me, and mine
--    waiting for an answer (or answered in the last half minute, so the
--    sender sees "declined" rather than a card that silently vanishes).
create or replace function public.duel_invites_state()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_in jsonb; v_out jsonb;
begin
  if v_me is null then return jsonb_build_object('incoming', null, 'outgoing', null, 'now', now()); end if;
  select jsonb_build_object('id', i.id, 'ratings', to_jsonb(i.ratings), 'minutes', i.minutes,
           'created_at', i.created_at, 'expires_at', i.expires_at,
           'from', jsonb_build_object('id', p.id, 'username', p.username, 'display_name', p.display_name,
                                      'duel_rating', p.duel_rating))
    into v_in
    from friend_duel_invites i join profiles p on p.id = i.sender_id
   where i.receiver_id = v_me and i.status = 'pending' and i.expires_at > now()
   order by i.created_at desc limit 1;
  select jsonb_build_object('id', i.id, 'ratings', to_jsonb(i.ratings), 'minutes', i.minutes,
           'created_at', i.created_at, 'expires_at', i.expires_at,
           'status', case when i.status = 'pending' and i.expires_at <= now() then 'expired' else i.status::text end,
           'to', jsonb_build_object('id', p.id, 'username', p.username, 'display_name', p.display_name))
    into v_out
    from friend_duel_invites i join profiles p on p.id = i.receiver_id
   where i.sender_id = v_me
     and ((i.status = 'pending' and i.expires_at > now() - interval '30 seconds')
          or i.responded_at > now() - interval '30 seconds')
   order by i.created_at desc limit 1;
  return jsonb_build_object('incoming', v_in, 'outgoing', v_out, 'now', now());
end $$;

revoke all on function public.duel_invite_friend(text, int[], int) from public;
revoke all on function public.duel_invite_respond(uuid, boolean) from public;
revoke all on function public.duel_invite_cancel(uuid) from public;
revoke all on function public.duel_invites_state() from public;
grant execute on function public.duel_invite_friend(text, int[], int) to authenticated;
grant execute on function public.duel_invite_respond(uuid, boolean) to authenticated;
grant execute on function public.duel_invite_cancel(uuid) to authenticated;
grant execute on function public.duel_invites_state() to authenticated;

-- 7. duel_finish from 051, with friend duels left unrated: v_rated used to be
--    "human, or any non-human when bot duels are rated", which would have
--    rated a friend duel as if it were a bot one.
create or replace function public.duel_finish(p_match uuid, p_reason text default 'time')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_match duel_matches; v_k numeric; v_rated boolean;
  a duel_match_players; b duel_match_players;
  v_expected numeric; v_actual numeric; v_delta int; v_winner uuid; v_seat int;
  v_total numeric; v_margin numeric; v_factor numeric;
begin
  select * into v_match from duel_matches where id = p_match for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  if v_match.status <> 'active' then return jsonb_build_object('ok', true, 'already_finished', true); end if;

  select * into a from duel_match_players where match_id = p_match and seat = 1;
  select * into b from duel_match_players where match_id = p_match and seat = 2;

  v_seat := case when a.score > b.score then 1
                 when b.score > a.score then 2 else null end;
  v_winner := case v_seat when 1 then a.user_id when 2 then b.user_id else null end;

  v_k := duel_cfg('duel_k_factor', 48);
  v_rated := v_match.mode = 'human' or (v_match.mode = 'bot' and duel_cfg_bool('bot_duels_affect_rating', true));

  select coalesce(sum(points), 0) into v_total from duel_rounds where match_id = p_match;
  v_margin := case when v_total > 0
                   then least(1.0, abs(coalesce(a.score, 0) - coalesce(b.score, 0)) / v_total)
                   else 0.5 end;
  v_factor := duel_cfg('duel_perf_min', 0.7)
            + (duel_cfg('duel_perf_max', 1.3) - duel_cfg('duel_perf_min', 0.7)) * v_margin;

  if v_rated then
    v_expected := 1.0 / (1.0 + power(10.0, (b.rating_before - a.rating_before) / 400.0));
    v_actual   := case when a.score > b.score then 1.0 when a.score < b.score then 0.0 else 0.5 end;
    v_delta    := round(v_k * v_factor * (v_actual - v_expected));
    update duel_match_players set rating_after = a.rating_before + v_delta, active = false
     where match_id = p_match and seat = 1;
    if a.user_id is not null then
      update profiles set duel_rating = greatest(0, a.rating_before + v_delta) where id = a.user_id;
    end if;

    v_expected := 1.0 / (1.0 + power(10.0, (a.rating_before - b.rating_before) / 400.0));
    v_actual   := case when b.score > a.score then 1.0 when b.score < a.score then 0.0 else 0.5 end;
    v_delta    := round(v_k * v_factor * (v_actual - v_expected));
    update duel_match_players set rating_after = b.rating_before + v_delta, active = false
     where match_id = p_match and seat = 2;
    if b.user_id is not null then
      update profiles set duel_rating = greatest(0, b.rating_before + v_delta) where id = b.user_id;
    end if;
  else
    update duel_match_players set rating_after = rating_before, active = false where match_id = p_match;
  end if;

  update duel_matches
     set status = 'finished', finished_at = now(), winner_id = v_winner, winner_seat = v_seat
   where id = p_match;
  return jsonb_build_object('ok', true, 'winner_id', v_winner, 'winner_seat', v_seat,
                            'reason', p_reason, 'rated', v_rated, 'performance', round(v_factor, 2));
end $$;
