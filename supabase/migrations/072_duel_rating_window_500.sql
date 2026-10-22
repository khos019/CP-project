-- 072: a ranked search pairs people within ±500 rating (was ±150, see 062).
--
-- Asked for on 22 Oct 2026: with ±150 too few people ever met, so most
-- searches ended in a bot duel. The radius still starts at ±100 and widens by
-- 100 every 2 seconds, so the nearest opponent is preferred, and it reaches
-- ±500 after 8 seconds — inside human_wait_seconds (12), before the bot
-- fallback. Both duel_try_pair (someone else searching) and the challenge
-- cards in duel_tick read this radius; duel_available_count reads
-- max_rating_range, so the "available opponents" count follows on its own.
--
-- Friend duels (054) are invitations and stay unrestricted.
--
-- Only duel_config changes. Run AFTER 062. Safe to re-run.

insert into public.duel_config(key, value, note) values
  ('initial_rating_range', '100'::jsonb, 'Elo radius searched at t=0'),
  ('rating_range_step',    '100'::jsonb, 'radius widens by this…'),
  ('rating_range_interval','2'::jsonb,   '…every this many seconds'),
  ('max_rating_range',     '500'::jsonb, 'radius stops widening here')
on conflict (key) do update set value = excluded.value, updated_at = now();
