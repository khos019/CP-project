-- 052: clients may no longer write their own rating, solved count, suspension
-- or verdicts.
--
-- Run AFTER the deploy of 2026-10-15 (commit "server records verdicts"): from
-- that deploy on, /api/judge writes bank_submissions itself with the service
-- role, so nothing legitimate is lost when the browser's insert goes away.
--
-- 1. profiles. "own profile update" (001) lets a signed-in user update every
--    column of their own row except `role`. That includes duel_rating,
--    solved_count and suspended_at — `PATCH /rest/v1/profiles?id=eq.<me>` with
--    {"duel_rating": 3000} or {"suspended_at": null} worked from any console.
--    016 wrote down the fix and left it for later; this is later. The policy
--    stays (it still scopes updates to one's own row); the column grant is
--    narrowed to what the profile editor actually sends (session.ts
--    ProfilePatch). Rating, counts and suspension are only ever changed by
--    security-definer functions, which are unaffected by these grants.
--
-- 2. bank_submissions. "own submissions write" (015) let a user insert any row
--    with their own user_id — including verdict 'ACCEPTED' for a problem they
--    never solved. That raised solved_count (040's trigger), the leaderboard
--    and, through has_solved(), unlocked other people's source code for that
--    problem. Duel verdicts already arrive through duel_record_submission
--    (security definer); practice verdicts now arrive from /api/judge.

revoke update on public.profiles from anon, authenticated;

do $$
declare
  col text;
begin
  -- bio and country exist only where the extended-profile migration ran; a
  -- grant on a missing column would abort the whole script.
  foreach col in array array['display_name', 'username', 'avatar_url', 'preferred_language', 'bio', 'country'] loop
    if exists (select 1 from information_schema.columns
                where table_schema = 'public' and table_name = 'profiles' and column_name = col) then
      execute format('grant update (%I) on public.profiles to authenticated', col);
    end if;
  end loop;
end $$;

drop policy if exists "own submissions write" on public.bank_submissions;
revoke insert, update, delete on public.bank_submissions from anon, authenticated;
