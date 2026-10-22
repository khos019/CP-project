/* What the three contest screens (the archive, the editor, a problem page)
 * share: the shapes the RPCs return, the one way they are called, and the
 * Tashkent clock every round is announced in. */

import { useEffect, useState } from "react";
import { tr, type Lang } from "./i18n";
import { readToken, supabaseConfig, ensureFreshToken } from "./session";

export type ContestSummary = {
  slug: string; number: number; title_uz: string; title_en: string;
  starts_at: string; duration_minutes: number; archived: boolean;
  participants: number; problems: { idx: string; rating: number }[];
  /** From 047; absent until it is applied, and the card simply leaves it out. */
  winner?: { username: string; display_name: string } | null;
  /** From 049: only the owner ever receives a hidden round. */
  hidden?: boolean;
  /** From 065: 'custom' rounds were written on the site and can be edited. */
  kind?: "archive" | "custom";
  /** From 067: how many signed up, and whether the viewer is one of them. */
  registered?: number; me_registered?: boolean;
  /** From 068: the viewer's place on the round's team, and a pending invitation. */
  my_role?: ContestRole | null; invited?: "author" | "tester" | null;
  /** From 069: an admin's round waits for the owner's approval. */
  status?: "draft" | "review" | "approved";
};
export type ContestRole = "owner" | "author" | "tester";
export type StaffMember = { username: string; display_name: string | null; role: "author" | "tester"; status: "pending" | "accepted"; invited_at: string };
export type Invitation = { slug: string; title_uz: string; title_en: string; starts_at: string; role: "author" | "tester"; invited_by: string | null };
export type ContestProblem = {
  idx: string; bank_id: string; problem_key: string; title_uz: string; title_en: string;
  rating: number; solved: number; tried: number;
  /** From 065: a problem written for this round, opened at /contests/<slug>/p/<idx>. */
  custom?: boolean; time_limit_ms?: number | null; memory_mb?: number | null;
};
export type Cell = { ok: boolean; wrong: number; minute: number | null };
export type StandingRow = {
  place: number; user_id: string; username: string; display_name: string; avatar_url: string | null;
  solved: number; penalty: number; cells: Record<string, Cell>;
};
export type Standings = {
  contest: Omit<ContestSummary, "participants" | "problems" | "winner"> & { penalty_minutes: number; description?: string };
  problems: ContestProblem[];
  rows: StandingRow[];
};
export type Registrant = { username: string; display_name: string | null; avatar_url: string | null; rating: number | null; registered_at: string };
export type Attempt = {
  id: string; created_at: string; minute: number; idx: string; username: string; display_name: string;
  language: string; verdict: string; passed: number | null; total: number | null;
  runtime_ms: number | null; memory_kb: number | null;
};

export type Load<T> = { state: "loading" } | { state: "ready"; data: T } | { state: "not-migrated" | "error" | "missing" };

/* Signed in, the request carries the session, because a hidden round (049)
   is shown to the owner. A stale session is not worth an error page: the
   same question is asked again as a visitor. */
export async function publicRpc<T>(name: string, args: Record<string, unknown> = {}): Promise<Load<T>> {
  const { url, key } = supabaseConfig();
  if (!url || !key) return { state: "error" };
  const ask = (bearer: string) => fetch(`${url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${bearer}`, "content-type": "application/json" },
    body: JSON.stringify(args),
  });
  try {
    const token = readToken();
    let res = await ask(token || key);
    if (token && res.status === 401) res = await ask(key);
    // A function that is not there yet means a migration has not been
    // applied, and the page says so rather than looking broken.
    if (res.status === 404) return { state: "not-migrated" };
    if (!res.ok) return { state: "error" };
    const data = (await res.json()) as T | null;
    return data === null ? { state: "missing" } : { state: "ready", data };
  } catch {
    return { state: "error" };
  }
}

/** The owner's writes. The message PostgREST returns is the reason the
 *  function raised ("slug_taken", "problem_has_submissions"…). */
export async function ownerRpc<T>(name: string, args: Record<string, unknown>): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  const { url, key } = supabaseConfig();
  const token = await ensureFreshToken();
  if (!url || !key || !token) return { ok: false, error: "not_authenticated" };
  try {
    const res = await fetch(`${url}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(args),
    });
    if (res.status === 404) return { ok: false, error: "not_migrated" };
    const text = await res.text();
    if (!res.ok) {
      let message = `http_${res.status}`;
      try { message = (JSON.parse(text) as { message?: string }).message || message; } catch { /* keep the status */ }
      return { ok: false, error: message };
    }
    return { ok: true, data: (text ? JSON.parse(text) : null) as T };
  } catch {
    return { ok: false, error: "network" };
  }
}

/* Rounds are announced in Tashkent time, so they are shown in it too —
   a visitor abroad still reads the time the round actually ran at. Browsers
   spell the uz-UZ locale as "2026 M09 20", so the parts come from Intl (for
   the time zone) and the words are ours. */
export const UZ_MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
export const UZ_SHORT = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];
export const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const tashkent = (iso: string) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tashkent", year: "numeric", month: "numeric", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return { y: Number(p.year), m: Number(p.month) - 1, d: Number(p.day), time: `${p.hour}:${p.minute}` };
};

export const when = (iso: string, lang: Lang) => {
  const { y, m, d, time } = tashkent(iso);
  return lang === "uz" ? `${d}-${UZ_MONTHS[m]}, ${y} · ${time}` : `${d} ${EN_MONTHS[m]} ${y} · ${time}`;
};

/* <input type="datetime-local"> speaks the browser's zone; rounds are set in
   Tashkent's (UTC+5, no daylight saving), whatever the owner's laptop says. */
export const toTashkentInput = (iso: string) => {
  const t = new Date(new Date(iso).getTime() + 5 * 3600_000);
  return t.toISOString().slice(0, 16);
};
export const fromTashkentInput = (value: string) => new Date(`${value}:00+05:00`).toISOString();

export const lasting = (minutes: number, lang: Lang) => {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  if (!h) return lang === "uz" ? `${m} daqiqa` : `${m} min`;
  return m ? tr(lang, "contests.duration_hm", { h, m }) : tr(lang, "contests.duration_h", { h });
};

export const clock = (minute: number) =>
  `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;

/* Where a round is in its life, from its start and length. */
export type Phase = "upcoming" | "live" | "finished";
export const phaseOf = (c: { starts_at: string; duration_minutes: number }, now: number): Phase => {
  const start = new Date(c.starts_at).getTime(), end = start + c.duration_minutes * 60000;
  return now < start ? "upcoming" : now < end ? "live" : "finished";
};
export const windowOf = (c: { starts_at: string; duration_minutes: number }) => {
  const start = new Date(c.starts_at).getTime();
  return { start, end: start + c.duration_minutes * 60000 };
};

/* "2 kun 3 soat" / "45 daqiqa" — the two largest units, enough for a chip. */
export const span = (ms: number, lang: Lang) => {
  const m = Math.max(1, Math.round(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60;
  const u = lang === "uz" ? { d: "kun", h: "soat", m: "daqiqa" } : { d: "d", h: "h", m: "m" };
  const j = (n: number, x: string) => (lang === "uz" ? `${n} ${x}` : `${n}${x}`);
  return d ? `${j(d, u.d)}${h ? ` ${j(h, u.h)}` : ""}` : h ? `${j(h, u.h)}${mm ? ` ${j(mm, u.m)}` : ""}` : j(mm, u.m);
};

/* "01:23:45", or "2 kun 03:14:07" — the ticking clock on a running round. */
export const countdown = (ms: number, lang: Lang) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  const hms = [h, m, x].map((n) => String(n).padStart(2, "0")).join(":");
  return d ? `${d} ${lang === "uz" ? "kun" : "d"} ${hms}` : hms;
};

/* The same countdown as separate units, for the tile clock: days only when
   there are any, so a running round reads 01 · 23 · 45. */
export const clockUnits = (ms: number, lang: Lang): [string, string][] => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  const L = lang === "uz" ? ["kun", "soat", "daq", "son"] : ["days", "hrs", "min", "sec"];
  const pad = (n: number) => String(n).padStart(2, "0");
  const units: [string, string][] = [[pad(h), L[1]], [pad(m), L[2]], [pad(x), L[3]]];
  return d ? [[String(d), L[0]], ...units] : units;
};

/** The current time, re-read every `ms` while isActive(now) holds. A
 *  finished archive answers false and does not re-render once a second for
 *  nothing; a round that is about to start or still running ticks. */
export function useNow(isActive: (now: number) => boolean, ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  const active = isActive(now);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), ms);
    return () => window.clearInterval(id);
  }, [active, ms]);
  return now;
}

export const LANGS: Record<string, string> = { cpp20: "C++17", python3: "Python 3" };

/* "Is there a round to remind people of?" — for the dot beside Kontestlar in
 * the header. A public round that is running, or starts within a week. Read
 * straight from Supabase (no Worker), once on load and every five minutes;
 * the phase itself is recomputed every half minute so the dot turns into
 * "Jonli" at the start without waiting for the next read. */
export type ContestPulse = { phase: "live" | "soon"; title_uz: string; title_en: string; starts_at: string; duration_minutes: number } | null;
const PULSE_AHEAD_MS = 7 * 86400_000;
export function useContestPulse(): { pulse: ContestPulse; now: number } {
  const [list, setList] = useState<ContestSummary[]>([]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let live = true;
    const load = () => { void publicRpc<ContestSummary[]>("contest_list").then((got) => { if (live && got.state === "ready") setList(got.data); }); };
    load();
    const read = window.setInterval(load, 5 * 60_000);
    const tick = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => { live = false; window.clearInterval(read); window.clearInterval(tick); };
  }, []);
  let pulse: ContestPulse = null;
  for (const c of list) {
    // A hidden round is the owner's draft, not something to remind anybody of.
    if (c.hidden) continue;
    const { start, end } = windowOf(c);
    const phase = now >= start && now < end ? "live" : start > now && start - now <= PULSE_AHEAD_MS ? "soon" : null;
    if (!phase) continue;
    // A running round outranks an announced one; among announced, the nearest.
    if (!pulse || (phase === "live" && pulse.phase !== "live") || (phase === pulse.phase && start < windowOf(pulse).start)) {
      pulse = { phase, title_uz: c.title_uz, title_en: c.title_en, starts_at: c.starts_at, duration_minutes: c.duration_minutes };
    }
  }
  return { pulse, now };
}
