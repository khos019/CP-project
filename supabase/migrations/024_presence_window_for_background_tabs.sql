-- AlgoYo'l — a friend with the tab open should not read as offline.
--
-- The app heartbeats every 25 seconds and a learner counted as online if the
-- last beat was inside 45. That works while the tab is in front. It does not
-- work when it is behind another one: browsers throttle timers in hidden tabs
-- to roughly one call a minute, so a backgrounded tab beats every ~60s and
-- falls outside a 45-second window.
--
-- Which is exactly the case that matters here. "My friend has the site open"
-- usually means open in another tab, and under the old window the matchmaker
-- would skip them and hand out a bot instead.
--
-- 90 seconds comfortably covers a throttled beat while still noticing somebody
-- who has actually closed the tab within about a minute and a half. The client
-- also now beats the moment a tab becomes visible again, so coming back to the
-- tab restores presence immediately rather than up to 25 seconds later.
--
-- Run AFTER 016. Safe to re-run.

update public.duel_config
   set value = '90'::jsonb, updated_at = now(),
       note = 'online means a heartbeat inside this; 90 covers a throttled background tab'
 where key = 'presence_window_seconds';
