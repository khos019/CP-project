"use client";

import { useEffect, useMemo, useRef } from "react";

type Lang = "uz" | "en";

const MONTHS = {
  uz: ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
const DAYS = { uz: ["Du", "", "Cho", "", "Ju", "", ""], en: ["Mon", "", "Wed", "", "Fri", "", ""] };

const T = {
  uz: {
    title: "Faollik", year: "so‘nggi yil", active: "faol kun", streak: "eng uzun seriya", now: "joriy seriya",
    days: (n: number) => `${n} kun`, less: "Kam", more: "Ko‘p",
    cell: (n: number, d: string) => (n ? `${d}: ${n} ta harakat` : `${d}: faollik yo‘q`),
    total: (n: number) => `${n} ta yechim va duel`,
  },
  en: {
    title: "Activity", year: "past year", active: "active days", streak: "longest streak", now: "current streak",
    days: (n: number) => `${n} ${n === 1 ? "day" : "days"}`, less: "Less", more: "More",
    cell: (n: number, d: string) => (n ? `${d}: ${n} ${n === 1 ? "action" : "actions"}` : `${d}: no activity`),
    total: (n: number) => `${n} submissions and duels`,
  },
};

/* Local calendar day, so a submission at 00:30 Tashkent time lands on the
   day the learner lived it, not the UTC one. */
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

/** A year of activity as a grid of days — weeks across, Monday to Sunday down,
 *  like GitHub's and LeetCode's. Each submission and each duel is one action. */
export function ActivityHeatmap({ lang, dates }: { lang: Lang; dates: string[] }) {
  const t = T[lang];
  // On a narrow screen the year scrolls sideways; open on the recent end.
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => { const el = scroller.current; if (el) el.scrollLeft = el.scrollWidth; }, []);
  const model = useMemo(() => {
    const counts = new Map<string, number>();
    for (const iso of dates) {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) continue;
      const k = dayKey(d);
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    const today = new Date(); today.setHours(0, 0, 0, 0);
    // Start on the Monday 52 weeks before this week's Monday.
    const start = new Date(today);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - 52 * 7);
    const weeks: { date: Date; n: number; future: boolean }[][] = [];
    const months: { col: number; label: string }[] = [];
    let total = 0, active = 0, run = 0, best = 0, max = 0;
    for (let w = 0; w < 53; w++) {
      const col: { date: Date; n: number; future: boolean }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start); date.setDate(start.getDate() + w * 7 + d);
        const future = date > today;
        const n = future ? 0 : counts.get(dayKey(date)) || 0;
        if (!future) {
          total += n; if (n) active++;
          run = n ? run + 1 : 0; best = Math.max(best, run);
          max = Math.max(max, n);
        }
        if (date.getDate() === 1 && !future) months.push({ col: w, label: MONTHS[lang][date.getMonth()] });
        col.push({ date, n, future });
      }
      weeks.push(col);
    }
    // The current streak may still be alive if today is empty but yesterday was not.
    let current = 0;
    const back = new Date(today);
    if (!counts.get(dayKey(back))) back.setDate(back.getDate() - 1);
    while (counts.get(dayKey(back))) { current++; back.setDate(back.getDate() - 1); }
    return { weeks, months, total, active, best, current, max };
  }, [dates, lang]);

  // Four steps relative to this person's own busiest day, so a light year still shows texture.
  const level = (n: number) => (!n ? 0 : Math.min(4, Math.ceil((n / Math.max(1, model.max)) * 4)));
  const fmt = (d: Date) => d.toLocaleDateString(lang === "uz" ? "uz-UZ" : "en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <section className="panel pv-card ah">
      <header className="pv-card-head">
        <h2>{t.title} <small className="ah-year">· {t.year}</small></h2>
        <span className="muted ah-total">{t.total(model.total)}</span>
      </header>
      <div className="ah-stats">
        <div><b className="mono">{model.active}</b><small>{t.active}</small></div>
        <div><b className="mono">{t.days(model.best)}</b><small>{t.streak}</small></div>
        <div className={model.current ? "on" : ""}><b className="mono">{model.current ? "🔥 " : ""}{t.days(model.current)}</b><small>{t.now}</small></div>
      </div>
      <div className="ah-scroll" ref={scroller}>
        <div className="ah-grid" role="img" aria-label={`${t.title}: ${t.total(model.total)}`}>
          <div className="ah-months" aria-hidden="true">
            {model.months.map((m) => <span key={`${m.col}-${m.label}`} style={{ gridColumn: m.col + 1 }}>{m.label}</span>)}
          </div>
          <div className="ah-days" aria-hidden="true">{DAYS[lang].map((d, i) => <span key={i}>{d}</span>)}</div>
          <div className="ah-cells">
            {model.weeks.map((col, w) => (
              <div className="ah-week" key={w}>
                {col.map((c) => (
                  <i key={c.date.getTime()} className={c.future ? "ah-c future" : `ah-c l${level(c.n)}`}
                    title={c.future ? undefined : t.cell(c.n, fmt(c.date))} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ah-legend" aria-hidden="true">
        <span>{t.less}</span>{[0, 1, 2, 3, 4].map((l) => <i key={l} className={`ah-c l${l}`} />)}<span>{t.more}</span>
      </div>
    </section>
  );
}
