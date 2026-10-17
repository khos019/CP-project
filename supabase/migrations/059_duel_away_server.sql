-- 059: the tab rule, kept by the server.
--
-- Until now "leave the duel tab for more than 5 seconds in total and you lose"
-- was kept entirely in the browser: the time away lived in localStorage and the
-- page itself asked for the forfeit. Anyone could edit the storage, block the
-- forfeit request in DevTools, or simply lose it to a network error (duel
-- 2be7235a showed 17 of 5 seconds and was still active). The browser still
-- watches — it is the only thing that can see the tab — but it now reports to
-- the server, and the server keeps the account and decides.
--
-- What the page reports, through duel_presence(match, state):
--   'here' — every few seconds while the duel is on screen and focused;
--   'away' — the moment it leaves the screen or loses focus;
--   'back' — the moment it returns.
-- The server adds up every absence itself, from its own clock.
--
-- Silence counts as absence. A page that stops reporting — a blocked request,
-- a closed tab, a different site in front — leaves a gap since the last 'here'.
-- A gap longer than presence_gap_ms (20 s, generous enough for a slow
-- connection or a reload) is charged in full, minus the heartbeat interval.
-- So blocking the reports does not hide the absence; it creates one. The
-- one exception is the start: a duel can begin while the player is looking
-- at another tab (the search ran there), so before the first report the page
-- gets presence_first_ms (60 s) to notice before silence is charged.
--
-- Where it is enforced. duel_away_gate(match) is called by the Worker before
-- it judges a duel submission and on every bot step, and by duel_presence
-- itself. Over the allowance (away_grace_ms, 5 s) the caller forfeits and the
-- submission is refused. A round cannot be won without a submission, and a
-- submission cannot get past the gate, so editing anything in the browser
-- buys nothing.
--
-- What it still cannot see: a second device. No web page can.
--
-- Run AFTER 001-058. Safe to re-run.

alter table public.duel_match_players
  add column if not exists away_ms    bigint not null default 0,
  add column if not exists away_since timestamptz,
  add column if not exists away_count int not null default 0,
  add column if not exists seen_at    timestamptz;

insert into public.duel_config(key, value, note) values
  ('away_grace_ms',    '5000'::jsonb,  'total time a player may spend off the duel screen'),
  ('presence_beat_ms', '5000'::jsonb,  'how often the duel page reports that it is on screen'),
  ('presence_gap_ms',  '20000'::jsonb, 'silence longer than this is charged as time away'),
  ('presence_first_ms', '60000'::jsonb, 'before the first report, silence is forgiven this long')
on conflict (key) do nothing;

-- duel_forfeit (016) never checked that the duel was still running: called on
-- a finished duel it handed every unclaimed round to the other seat and
-- rescored a result that was already settled. With the server and the page
-- both able to forfeit now, the second call is ordinary, so it must be a no-op.
create or replace function public.duel_forfeit(p_match uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_seat int; v_status text;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;
  select seat into v_seat from duel_match_players where match_id = p_match and user_id = v_me;
  if v_seat is null then return jsonb_build_object('ok', false, 'error', 'not_a_player'); end if;
  select status::text into v_status from duel_matches where id = p_match for update;
  if v_status is distinct from 'active' then return jsonb_build_object('ok', true, 'already_finished', true); end if;

  update duel_rounds set claimed_by_seat = 3 - v_seat, claimed_at = now()
   where match_id = p_match and claimed_by_seat is null;
  update duel_match_players p set score = (
    select coalesce(sum(r.points), 0) from duel_rounds r
     where r.match_id = p_match and r.claimed_by_seat = p.seat)
   where p.match_id = p_match;

  return duel_finish(p_match, 'forfeit');
end $$;
revoke all on function public.duel_forfeit(uuid) from public;
grant execute on function public.duel_forfeit(uuid) to authenticated;

-- Time away so far for one seat, by the server's clock: absences that ended,
-- the one still open, and any silence long enough to count.
create or replace function public.duel_away_total(p_match uuid, p_seat int)
returns bigint language plpgsql stable security definer set search_path = public as $$
declare
  p duel_match_players;
  m duel_matches;
  v_beat bigint := duel_cfg('presence_beat_ms', 5000)::bigint;
  v_gap  bigint := duel_cfg('presence_gap_ms', 20000)::bigint;
  v_first bigint := duel_cfg('presence_first_ms', 60000)::bigint;
  v_total bigint;
  v_silent bigint;
begin
  select * into p from duel_match_players where match_id = p_match and seat = p_seat;
  if not found then return 0; end if;
  select * into m from duel_matches where id = p_match;
  if not found then return 0; end if;
  v_total := p.away_ms;
  if p.away_since is not null then
    v_total := v_total + floor(extract(epoch from now() - p.away_since) * 1000)::bigint;
  else
    v_silent := floor(extract(epoch from now() - coalesce(p.seen_at, m.started_at)) * 1000)::bigint;
    if p.seen_at is null then
      if v_silent > v_first then v_total := v_total + (v_silent - v_first); end if;
    elsif v_silent > v_gap then v_total := v_total + (v_silent - v_beat); end if;
  end if;
  return v_total;
end $$;
revoke all on function public.duel_away_total(uuid, int) from public;

-- Forfeits the caller if their time away is past the allowance. Returns
-- {ok, lost, away_ms, grace_ms}. Only an active duel of a real player is
-- judged; anything else answers lost = false.
create or replace function public.duel_away_gate(p_match uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me uuid := auth.uid();
  v_seat int;
  v_away bigint;
  v_grace bigint := duel_cfg('away_grace_ms', 5000)::bigint;
  v_status text;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;
  select seat into v_seat from duel_match_players where match_id = p_match and user_id = v_me;
  select status::text into v_status from duel_matches where id = p_match;
  if v_seat is null or v_status is distinct from 'active' then
    return jsonb_build_object('ok', true, 'lost', false);
  end if;
  v_away := duel_away_total(p_match, v_seat);
  if v_away >= v_grace then
    perform duel_forfeit(p_match);
    return jsonb_build_object('ok', true, 'lost', true, 'away_ms', v_away, 'grace_ms', v_grace);
  end if;
  return jsonb_build_object('ok', true, 'lost', false, 'away_ms', v_away, 'grace_ms', v_grace);
end $$;
revoke all on function public.duel_away_gate(uuid) from public;
grant execute on function public.duel_away_gate(uuid) to authenticated;

-- What the page reports. 'here' also settles any silence first, so a page
-- that went quiet and came back pays for the gap before it is forgiven.
create or replace function public.duel_presence(p_match uuid, p_state text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me uuid := auth.uid();
  p duel_match_players;
  m duel_matches;
  v_beat bigint := duel_cfg('presence_beat_ms', 5000)::bigint;
  v_gap  bigint := duel_cfg('presence_gap_ms', 20000)::bigint;
  v_first bigint := duel_cfg('presence_first_ms', 60000)::bigint;
  v_silent bigint;
begin
  if v_me is null then return jsonb_build_object('ok', false, 'error', 'not_authenticated'); end if;
  if p_state not in ('here', 'away', 'back') then return jsonb_build_object('ok', false, 'error', 'bad_state'); end if;
  select * into p from duel_match_players where match_id = p_match and user_id = v_me for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_a_player'); end if;
  select * into m from duel_matches where id = p_match;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_a_player'); end if;
  if m.status::text <> 'active' then return jsonb_build_object('ok', true, 'lost', false, 'finished', true); end if;

  -- Silence since the last report, charged before anything else changes.
  if p.away_since is null then
    v_silent := floor(extract(epoch from now() - coalesce(p.seen_at, m.started_at)) * 1000)::bigint;
    if p.seen_at is null then
      if v_silent > v_first then p.away_ms := p.away_ms + (v_silent - v_first); end if;
    elsif v_silent > v_gap then p.away_ms := p.away_ms + (v_silent - v_beat); end if;
  end if;

  if p_state = 'away' then
    if p.away_since is null then p.away_since := now(); p.away_count := p.away_count + 1; end if;
  elsif p.away_since is not null then
    -- 'back', or a 'here' that arrives while an absence is open: it ended now.
    p.away_ms := p.away_ms + floor(extract(epoch from now() - p.away_since) * 1000)::bigint;
    p.away_since := null;
  end if;

  update duel_match_players
     set away_ms = p.away_ms, away_since = p.away_since, away_count = p.away_count, seen_at = now()
   where match_id = p_match and seat = p.seat;

  return duel_away_gate(p_match);
end $$;
revoke all on function public.duel_presence(uuid, text) from public;
grant execute on function public.duel_presence(uuid, text) to authenticated;
