"use client";

// Coins, activity tracking and the streak ladder.
//
// Coins buy real-money items, so the account copy is authoritative: the server
// awards milestones and settles purchases. The localStorage path below is a
// display fallback for signed-out/unmigrated use only — it is clearly marked
// as unofficial in the UI, because anything the browser can compute the user
// can also edit.

import { readScoped, writeScoped, readToken, supabaseConfig } from "./session";

export type ShopItem = {
  slug: string; nameUz: string; nameEn: string; descriptionUz: string; descriptionEn: string;
  costCoins: number; telegramStars: number | null; art: string;
};
export type Order = { id: string; slug: string; status: string; costCoins: number; createdAt: string };
export type DayActivity = { day: string; activeSeconds: number; duels: number };

// Mirrors coin_rules in migration 013. 1+2+3+4+5 = 15 = one 15-star gift.
export const COIN_RULES = [
  { days: 3, coins: 1 },
  { days: 5, coins: 2 },
  { days: 7, coins: 3 },
  { days: 8, coins: 4 },
  { days: 10, coins: 5 },
] as const;
export const DAY_SECONDS_REQUIRED = 30 * 60;
export const DAY_DUELS_REQUIRED = 3;
export const TOTAL_LADDER_COINS = COIN_RULES.reduce((n, r) => n + r.coins, 0); // 15

const ACT_KEY = "algoyol-activity";
const CLAIM_KEY = "algoyol-coin-claims";
const today = () => new Date().toISOString().slice(0, 10);
const rest = (path: string) => {
  const { url, key } = supabaseConfig();
  const auth = readToken();
  if (!url || !key || !auth) return null;
  return { url: `${url}/rest/v1/${path}`, headers: { apikey: key, Authorization: `Bearer ${auth}`, "content-type": "application/json" } };
};

// ---------------------------------------------------------------- local copy
export function readActivity(): Record<string, DayActivity> {
  try { return JSON.parse(readScoped(ACT_KEY) || "{}"); } catch { return {}; }
}
function writeActivity(all: Record<string, DayActivity>) {
  try { writeScoped(ACT_KEY, JSON.stringify(all)); } catch {}
}

/** Add watched time (and optionally finished duels) to today. */
export function addLocalActivity(seconds: number, duels = 0) {
  const all = readActivity();
  const day = today();
  const cur = all[day] || { day, activeSeconds: 0, duels: 0 };
  cur.activeSeconds = Math.min(cur.activeSeconds + Math.max(0, Math.min(seconds, 300)), 86400);
  cur.duels += Math.max(0, duels);
  all[day] = cur;
  writeActivity(all);
}

/** Consecutive qualifying days ending today or yesterday — mirrors the SQL. */
export function localStreak(all = readActivity()): number {
  const qualifies = (d: string) => {
    const a = all[d];
    return !!a && a.activeSeconds >= DAY_SECONDS_REQUIRED && a.duels >= DAY_DUELS_REQUIRED;
  };
  const shift = (d: string, n: number) => {
    const t = new Date(d + "T00:00:00Z");
    t.setUTCDate(t.getUTCDate() + n);
    return t.toISOString().slice(0, 10);
  };
  let cursor = qualifies(today()) ? today() : qualifies(shift(today(), -1)) ? shift(today(), -1) : null;
  if (!cursor) return 0;
  let streak = 0;
  while (qualifies(cursor)) { streak++; cursor = shift(cursor, -1); }
  return streak;
}

/** Coins the ladder has unlocked at this streak length. */
export function coinsForStreak(streak: number): number {
  return COIN_RULES.filter(r => r.days <= streak).reduce((n, r) => n + r.coins, 0);
}

export function nextMilestone(streak: number) {
  return COIN_RULES.find(r => r.days > streak) || null;
}

function localClaims(): number[] {
  try { return JSON.parse(readScoped(CLAIM_KEY) || "[]"); } catch { return []; }
}
export function localBalance(): number {
  const claimed = localClaims();
  const earned = COIN_RULES.filter(r => claimed.includes(r.days)).reduce((n, r) => n + r.coins, 0);
  let spent = 0;
  try { spent = JSON.parse(readScoped("algoyol-coin-spent") || "0") || 0; } catch {}
  return earned - spent;
}
/** Records milestones reached locally; returns coins newly granted. */
export function claimLocal(): number {
  const streak = localStreak();
  const claimed = localClaims();
  const fresh = COIN_RULES.filter(r => r.days <= streak && !claimed.includes(r.days));
  if (!fresh.length) return 0;
  writeScoped(CLAIM_KEY, JSON.stringify([...claimed, ...fresh.map(r => r.days)]));
  return fresh.reduce((n, r) => n + r.coins, 0);
}

// ---------------------------------------------------------------- server copy
/** null when the account copy is unavailable (signed out / 013 not applied). */
export async function fetchBalance(): Promise<number | null> {
  const r = rest("rpc/coin_balance");
  if (!r) return null;
  try {
    const res = await fetch(r.url, { method: "POST", headers: r.headers, body: "{}" });
    if (!res.ok) return null;
    const value = await res.json();
    return typeof value === "number" ? value : null;
  } catch { return null; }
}

export async function fetchStreak(): Promise<number | null> {
  const r = rest("rpc/qualifying_streak");
  if (!r) return null;
  try {
    const res = await fetch(r.url, { method: "POST", headers: r.headers, body: "{}" });
    if (!res.ok) return null;
    const value = await res.json();
    return typeof value === "number" ? value : null;
  } catch { return null; }
}

export async function pushActivity(seconds: number, duels = 0): Promise<boolean> {
  const r = rest("rpc/record_activity");
  if (!r) return false;
  try {
    const res = await fetch(r.url, { method: "POST", headers: r.headers, body: JSON.stringify({ p_seconds: seconds, p_duels: duels }) });
    return res.ok;
  } catch { return false; }
}

export async function claimServer(): Promise<number | null> {
  const r = rest("rpc/claim_streak_coins");
  if (!r) return null;
  try {
    const res = await fetch(r.url, { method: "POST", headers: r.headers, body: "{}" });
    if (!res.ok) return null;
    const value = await res.json();
    return typeof value === "number" ? value : null;
  } catch { return null; }
}

export async function fetchShopItems(): Promise<ShopItem[] | null> {
  const { url, key } = supabaseConfig();
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}/rest/v1/shop_items?select=slug,name_uz,name_en,description_uz,description_en,cost_coins,telegram_stars,art&active=eq.true&order=sort_order`, { headers: { apikey: key } });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows)) return null;
    return rows.map((r: Record<string, unknown>) => ({
      slug: String(r.slug), nameUz: String(r.name_uz), nameEn: String(r.name_en),
      descriptionUz: String(r.description_uz || ""), descriptionEn: String(r.description_en || ""),
      costCoins: Number(r.cost_coins), telegramStars: r.telegram_stars == null ? null : Number(r.telegram_stars),
      art: String(r.art || "gift"),
    }));
  } catch { return null; }
}

export async function purchase(slug: string, telegram: string): Promise<{ ok: boolean; error?: string }> {
  const r = rest("rpc/purchase_item");
  if (!r) return { ok: false, error: "offline" };
  try {
    const res = await fetch(r.url, { method: "POST", headers: r.headers, body: JSON.stringify({ p_slug: slug, p_telegram: telegram }) });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    const message = String((body as { message?: string }).message || "");
    if (message.includes("insufficient_coins")) return { ok: false, error: "insufficient" };
    if (message.includes("telegram_required")) return { ok: false, error: "telegram" };
    if (message.includes("not_authenticated")) return { ok: false, error: "auth" };
    return { ok: false, error: "failed" };
  } catch { return { ok: false, error: "offline" }; }
}

export async function fetchOrders(): Promise<Order[] | null> {
  const r = rest("shop_orders?select=id,cost_coins,status,created_at,shop_items(slug)&order=created_at.desc");
  if (!r) return null;
  try {
    const res = await fetch(r.url, { headers: r.headers });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows)) return null;
    return rows.map((o: Record<string, unknown>) => ({
      id: String(o.id), costCoins: Number(o.cost_coins), status: String(o.status),
      createdAt: String(o.created_at), slug: String((o.shop_items as { slug?: string } | null)?.slug || ""),
    }));
  } catch { return null; }
}

/** Fallback catalogue so the shop still renders before migration 013 runs. */
export const FALLBACK_ITEMS: ShopItem[] = [
  { slug: "tg-bear", nameUz: "Ayiqcha", nameEn: "Teddy Bear", descriptionUz: "Telegram sovg‘asi — 15 yulduz.", descriptionEn: "Telegram gift — 15 stars.", costCoins: 15, telegramStars: 15, art: "bear" },
  { slug: "tg-heart", nameUz: "Yurak", nameEn: "Heart", descriptionUz: "Telegram sovg‘asi — 15 yulduz.", descriptionEn: "Telegram gift — 15 stars.", costCoins: 15, telegramStars: 15, art: "heart" },
  { slug: "tg-cake", nameUz: "Tort", nameEn: "Cake", descriptionUz: "Telegram sovg‘asi — 15 yulduz.", descriptionEn: "Telegram gift — 15 stars.", costCoins: 15, telegramStars: 15, art: "cake" },
  { slug: "tg-star", nameUz: "Yulduz", nameEn: "Star", descriptionUz: "Telegram sovg‘asi — 15 yulduz.", descriptionEn: "Telegram gift — 15 stars.", costCoins: 15, telegramStars: 15, art: "star" },
  { slug: "tg-rocket", nameUz: "Raketa", nameEn: "Rocket", descriptionUz: "Telegram sovg‘asi — 15 yulduz.", descriptionEn: "Telegram gift — 15 stars.", costCoins: 15, telegramStars: 15, art: "rocket" },
  { slug: "tg-rose", nameUz: "Atirgul", nameEn: "Rose", descriptionUz: "Telegram sovg‘asi — 15 yulduz.", descriptionEn: "Telegram gift — 15 stars.", costCoins: 15, telegramStars: 15, art: "rose" },
];
