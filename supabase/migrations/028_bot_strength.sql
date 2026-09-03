-- AlgoYo'l — the bot plays a little above the player, and keeps playing.
--
-- The model in app/api/_lib/bot.ts derives everything from
-- performance = botRating - problemRating, and the bot's rating is the
-- player's own strength while the problems are picked for that same rating.
-- Elo then puts the bot at a coin flip on every round, and the flips it lost
-- it lost in silence: one wrong answer and nothing for the rest of the round.
--
-- Two knobs, so this stays tunable without a deploy like every other bot
-- number:
--
--   bot_skill_bonus  rating points the bot plays above the level it is matched
--                    at. +120 turns an even round into roughly 2:1 for the bot
--                    before mistakes are counted.
--   bot_late_solve   a second read, as a fraction of the first chance. A
--                    player who misses a problem at first often gets it on the
--                    second pass; the bot now does too.
--
-- Run AFTER 019 (and after 027, which renumbered this one out of its way).

insert into public.duel_config(key, value, note) values
  ('bot_skill_bonus', '120'::jsonb, 'rating points the bot plays above the level it is matched at'),
  ('bot_late_solve',  '0.5'::jsonb, 'second-read solve chance, as a fraction of the first')
on conflict (key) do nothing;
