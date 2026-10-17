-- 058: page views, for the owner's statistics page.
--
-- The site is one page that changes screens in place, so a "page view" here is
-- a screen opened: the problem list, a problem, the duel screen, a profile...
-- Every time the screen changes the client calls log_page_view() once. Staying
-- on a screen adds nothing — a duel is one view however long it lasts, and its
-- polling does not count.
--
-- Counts are kept per day (the day in Tashkent), not per request: the owner
-- asks how many, not who, and a counter row per day stays tiny forever.
--
-- History. Counting starts when this runs. The days before it are imported
-- from Cloudflare's analytics for algoyol.uz (zone active since 2026-09-24),
-- marked imported = true. Those are Cloudflare's own page views — full page
-- loads of the HTML, bots included — so they are a different measure from the
-- screen views counted from here on; the page says so. 2026-10-17 holds what
-- Cloudflare had counted by 14:00 Tashkent time, and screen views add to it.
--
-- Run AFTER 001-057. Safe to re-run (the import does not overwrite days that
-- already have counted views).

create table if not exists public.page_views_daily (
  day      date primary key,
  views    bigint not null default 0,
  imported boolean not null default false
);
alter table public.page_views_daily enable row level security;
-- No policies: read through owner_page_views(), written through log_page_view().

insert into public.page_views_daily(day, views, imported) values
  ('2026-09-24', 305, true), ('2026-09-25', 1069, true), ('2026-09-26', 796, true),
  ('2026-09-27', 215, true), ('2026-09-28', 281, true), ('2026-09-29', 94, true),
  ('2026-09-30', 35, true),  ('2026-10-01', 58, true),  ('2026-10-02', 470, true),
  ('2026-10-03', 37, true),  ('2026-10-04', 313, true), ('2026-10-05', 440, true),
  ('2026-10-06', 257, true), ('2026-10-07', 599, true), ('2026-10-08', 7561, true),
  ('2026-10-09', 179, true), ('2026-10-10', 335, true), ('2026-10-11', 212, true),
  ('2026-10-12', 159, true), ('2026-10-13', 848, true), ('2026-10-14', 1207, true),
  ('2026-10-15', 1440, true), ('2026-10-16', 461, true), ('2026-10-17', 122, true)
on conflict (day) do nothing;

-- One screen opened. Anyone may call it, signed in or not: visitors who never
-- sign in are most of the traffic worth counting.
create or replace function public.log_page_view()
returns void language sql volatile security definer set search_path = public as $$
  insert into page_views_daily(day, views) values ((now() at time zone 'Asia/Tashkent')::date, 1)
  on conflict (day) do update set views = page_views_daily.views + 1;
$$;
revoke all on function public.log_page_view() from public;
grant execute on function public.log_page_view() to anon, authenticated;

create or replace function public.owner_page_views()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  today date := (now() at time zone 'Asia/Tashkent')::date;
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'owner') then
    raise exception 'Only the owner can read platform statistics' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'today', coalesce((select views from page_views_daily where day = today), 0),
    'd7',    coalesce((select sum(views) from page_views_daily where day > today - 7), 0),
    'd30',   coalesce((select sum(views) from page_views_daily where day > today - 30), 0),
    'all',   coalesce((select sum(views) from page_views_daily), 0),
    'since', (select min(day) from page_views_daily),
    'counted_since', (select min(day) from page_views_daily where not imported),
    'daily', (select jsonb_agg(jsonb_build_object('day', d::date, 'views', coalesce(p.views, 0)) order by d)
                from generate_series(today - 29, today, interval '1 day') d
                left join page_views_daily p on p.day = d::date));
end $$;
revoke all on function public.owner_page_views() from public;
grant execute on function public.owner_page_views() to authenticated;
