-- Larger rating swings per duel: Elo K 32 → 40.
--
-- duel_finish() reads duel_k_factor on every finish, so this takes effect from
-- the next duel that ends; nothing already recorded is recomputed. At equal
-- ratings a win is now +20 / a loss −20 (was ±16).

insert into duel_config(key, value, note)
values ('duel_k_factor', '40'::jsonb, 'Elo K for duel rating changes')
on conflict (key) do update set value = excluded.value, note = excluded.note, updated_at = now();
