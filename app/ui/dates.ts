"use client";

/* Short dates, formatted from a table.
 *
 * Not through toLocaleString: the uz-UZ locale data is not always present, and
 * where it is missing the month comes back as "M09". That is what the duel
 * table showed on every public profile — "M09 03 20:20" — and what the
 * submission lists showed beside every verdict. ProfilePage has been
 * formatting its own dates from a table since the same bug hit it there.
 *
 * The times are the reader's own, so the local getters are the right ones:
 * a duel finished at 15:20 UTC reads 20:20 in Tashkent, which is when the
 * person playing it remembers finishing it. Everything here is called after a
 * fetch, from a client component, so there is no server-rendered text for a
 * timezone to disagree with.
 */

export type Lang = "uz" | "en";

/** Three-letter month names. The long Uzbek forms ("avgust") live in
    ProfilePage, which writes join dates as "2026-yil avgust". */
export const MONTHS_SHORT = {
  uz: ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
} as const;

const pad = (n: number) => String(n).padStart(2, "0");

/** "3 Sen 20:20" — a moment inside the current year, which is what a list of
    recent duels or submissions is showing. */
export function shortDateTime(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getDate()} ${MONTHS_SHORT[lang][d.getMonth()]} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "3 Sen 2026, 20:20" — the same moment where the year matters too, as in a
    tooltip on a curve that may span years. */
export function fullDateTime(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getDate()} ${MONTHS_SHORT[lang][d.getMonth()]} ${d.getFullYear()}, ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
