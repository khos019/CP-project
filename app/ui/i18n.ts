import uz from "../i18n/uz.json";
import en from "../i18n/en.json";

/* The site's message catalogue.
 *
 * Uzbek and English used to live side by side at every call site, as
 * `lang==="uz"?"…":"…"`. That works until somebody adds a string and only fills
 * in one half — which had already happened in a handful of places — and it
 * makes "what still needs translating" a question you can only answer by
 * reading every file. Both languages are now flat key/value files, so the
 * answer is a diff between two JSON documents.
 *
 * Uzbek is the source language: a key missing from en.json falls back to the
 * Uzbek string rather than rendering the key, because a visitor reading English
 * is better served by a sentence in the wrong language than by
 * `problems.empty_state_title`.
 */

export type Lang = "uz" | "en";

const CATALOGUE: Record<Lang, Record<string, string>> = {
  uz: uz as Record<string, string>,
  en: en as Record<string, string>,
};

/* Values may carry {named} slots. They are named rather than positional
   because word order differs between the two languages, and a positional
   placeholder silently produces nonsense when the order flips. */
export function tr(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const value = CATALOGUE[lang]?.[key] ?? CATALOGUE.uz[key] ?? key;
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in vars ? String(vars[name]) : whole);
}

/* Bound form, for a component that reaches for the same language many times. */
export const translator = (lang: Lang) =>
  (key: string, vars?: Record<string, string | number>) => tr(lang, key, vars);

/* Which keys exist in Uzbek but not in English. The language switch is only
   honest if this is empty; it is exported so a test or a dev screen can say so
   out loud instead of the gap being discovered by a reader. */
export function untranslated(): string[] {
  return Object.keys(CATALOGUE.uz).filter(k => !CATALOGUE.en[k]);
}

/* One component's slice of the catalogue, in the shape components already
   expect — `T[lang].someKey`. Keeping that shape is what let the dictionaries
   move out of the components without touching a single call site. */
export function catalogue(ns: string): { uz: Record<string, string>; en: Record<string, string> } {
  const slice = (cat: Record<string, string>) => {
    const out: Record<string, string> = {};
    const prefix = `${ns}.`;
    for (const key of Object.keys(cat)) {
      if (key.startsWith(prefix)) out[key.slice(prefix.length)] = cat[key];
    }
    return out;
  };
  return { uz: slice(CATALOGUE.uz), en: slice(CATALOGUE.en) };
}
