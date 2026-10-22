-- 070: a slightly weaker bot, and more time on problems that take long to write.
--
-- Both are read by the Worker when it plans a bot duel (app/api/_lib/bot.ts,
-- planDuel via givePlan in app/api/duel/route.ts); nothing here changes SQL
-- behaviour, only duel_config.
--
--   bot_strength_factor (0.88)  — the bot's chance of solving a round is
--                  multiplied by this and its thinking time divided by it:
--                  12% less likely to solve, ~14% slower. Asked for on
--                  22 Oct 2026 ("10-15% weaker").
--   bot_full_strength_users     — the players who still meet the full-strength
--                  bot: Jahonali (@jahonalix), who beats it routinely. A list
--                  of profile ids; add or remove one with an UPDATE.
--   bot_time_heavy (1.4) / bot_time_medium (1.2) — extra thinking time on
--                  problems that take a lot of code: segment trees, treaps,
--                  flows, advanced-cp (heavy); simulation, matrices, graphs,
--                  trees, geometry, data structures (medium). Which problem is
--                  which comes from its tag and topic in the problem bank.
--
-- Run AFTER 069. Safe to re-run (keeps values already set by hand).

insert into public.duel_config(key, value, note) values
  ('bot_strength_factor', '0.88'::jsonb, 'bot solve chance x this, thinking time / this (1 = full strength)'),
  ('bot_time_heavy',      '1.4'::jsonb,  'thinking time x this on implementation-heavy problems'),
  ('bot_time_medium',     '1.2'::jsonb,  'thinking time x this on moderately heavy problems'),
  ('bot_full_strength_users',
     coalesce((select jsonb_agg(id::text) from public.profiles where lower(username) in ('jahonalix')), '[]'::jsonb),
     'profile ids that always meet the full-strength bot')
on conflict (key) do nothing;
