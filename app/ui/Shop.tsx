"use client";

import { useEffect, useState } from "react";
import { tr } from "./i18n";
import { GiftArtwork, ART_CREDIT, ART_CREDIT_EN } from "./gift-art";
import {
  COIN_RULES, DAY_DUELS_REQUIRED, DAY_SECONDS_REQUIRED, FALLBACK_ITEMS, TOTAL_LADDER_COINS,
  claimLocal, claimServer, coinsForStreak, fetchBalance, fetchOrders, fetchShopItems, fetchStreak,
  localBalance, localStreak, nextMilestone, purchase, readActivity,
  type CoinServer, type Order, type ShopItem,
} from "./coins";

type Lang = "uz" | "en";

const T = {
  uz: {
    title: "Do‘kon markazi", sub: "Faollik uchun tanga yig‘ing va Telegram sovg‘asiga almashtiring.",
    balance: "Tangalaringiz", streak: "Ketma-ket kunlar", day: "kun", coins: "tanga",
    ladder: "Tanga ishlash zinapoyasi", ladderNote: `Hisoblanadigan kun: kamida 30 daqiqa faollik + ${DAY_DUELS_REQUIRED} ta duel.`,
    today: "Bugun", minutes: "daqiqa", duels: "duel", claim: "Tangalarni olish",
    claimed: "tanga qo‘shildi!", nothing: "Hozircha yangi tanga yo‘q.",
    next: "Keyingi bosqich", buy: "Sotib olish", cost: "narxi", stars: "yulduz",
    tgLabel: "Telegram username", tgPlaceholder: "@username",
    need: "Yetarli tanga yo‘q", pending: "Buyurtma qabul qilindi — owner yetkazadi.",
    orders: "Buyurtmalaringiz", none: "Buyurtmalar yo‘q.",
    localWarn: "Hisobga kirmagansiz — tangalar faqat shu qurilmada saqlanmoqda va rasmiy emas.",
    expired: "Sessiya muddati tugagan — tangalar hisobingizdan o‘qilmadi. Qaytadan kiring.",
    offline: "Serverga ulanib bo‘lmadi — ko‘rsatilgan tangalar rasmiy emas.",
    notMigrated: "Do‘kon serverda hali sozlanmagan (013-migratsiya ishga tushmagan) — bu ko‘rinish namuna.",
    fulfilNote: "Sovg‘a Telegram orqali qo‘lda yuboriladi.",
    statusPending: "Kutilmoqda", statusFulfilled: "Yuborildi", statusCancelled: "Bekor qilindi",
  },
  en: {
    title: "Shop centre", sub: "Earn coins for staying active, then trade them for a Telegram gift.",
    balance: "Your coins", streak: "Day streak", day: "days", coins: "coins",
    ladder: "Coin ladder", ladderNote: `A qualifying day is 30+ active minutes and ${DAY_DUELS_REQUIRED} duels.`,
    today: "Today", minutes: "min", duels: "duels", claim: "Claim coins",
    claimed: "coins added!", nothing: "No new coins yet.",
    next: "Next milestone", buy: "Buy", cost: "costs", stars: "stars",
    tgLabel: "Telegram username", tgPlaceholder: "@username",
    need: "Not enough coins", pending: "Order received — the owner will deliver it.",
    orders: "Your orders", none: "No orders yet.",
    localWarn: "You are signed out — coins are stored on this device only and are not official.",
    expired: "Your session has expired — we could not read your account balance. Please sign in again.",
    offline: "The server could not be reached — the coins shown are not official.",
    notMigrated: "The shop is not set up on the server yet (migration 013 has not run) — this view is a preview.",
    fulfilNote: "The gift is sent manually over Telegram.",
    statusPending: "Pending", statusFulfilled: "Sent", statusCancelled: "Cancelled",
  },
};

/* `authLoading` exists for the same reason as `probed` below: a stored token
   is still being verified on the first paint, so a signed-in learner would
   otherwise be told they are signed out for as long as that takes. */
export function Shop({ lang, signed, authLoading }: { lang: Lang; signed: boolean; authLoading: boolean }) {
  const t = T[lang];
  const [items, setItems] = useState<ShopItem[]>(FALLBACK_ITEMS);
  const [balance, setBalance] = useState(0);
  const [streak, setStreak] = useState(0);
  const [server, setServer] = useState(false);
  const [offline, setOffline] = useState<Exclude<CoinServer["state"], "online">>("offline");
  // "The server is unreachable" is a claim about a request that has come back.
  // Until the first read resolves we know nothing, and saying anything at all
  // means flashing a failure notice at every learner for a second.
  const [probed, setProbed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [telegram, setTelegram] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");

  const refresh = async () => {
    const [remoteBalance, remoteStreak, remoteItems, remoteOrders] = await Promise.all([
      fetchBalance(), fetchStreak(), fetchShopItems(), fetchOrders(),
    ]);
    const online = remoteBalance.state === "online";
    setServer(online);
    if (remoteBalance.state !== "online") setOffline(remoteBalance.state);
    setBalance(remoteBalance.state === "online" ? remoteBalance.balance : localBalance());
    setStreak(remoteStreak !== null ? remoteStreak : localStreak());
    if (remoteItems?.length) setItems(remoteItems);
    if (remoteOrders) setOrders(remoteOrders);
    setProbed(true);
  };
  useEffect(() => {
    // Re-read once the session resolves: the first pass can run against a
    // token still being renewed, and its answer would stick otherwise.
    // refresh awaits the four reads before it sets anything, so nothing is
    // written during this render; the rule cannot see past the async boundary.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [signed]);

  const act = readActivity()[new Date().toISOString().slice(0, 10)] || { activeSeconds: 0, duels: 0 };
  const upcoming = nextMilestone(streak);

  const claim = async () => {
    setBusy("claim");
    const gained = server ? await claimServer() : claimLocal();
    setMessage(gained && gained > 0 ? `+${gained} ${t.claimed}` : t.nothing);
    await refresh();
    setBusy("");
  };

  const buy = async (item: ShopItem) => {
    if (balance < item.costCoins) { setMessage(t.need); return; }
    if (!telegram.trim()) { setMessage(t.tgLabel); return; }
    setBusy(item.slug);
    const result = await purchase(item.slug, telegram.trim());
    setMessage(
      result.ok ? t.pending
      : result.error === "insufficient" ? t.need
      : result.error === "telegram" ? t.tgLabel
      : result.error === "auth" ? (signed ? t.expired : t.localWarn)
      : t.offline,
    );
    await refresh();
    setBusy("");
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow" style={{ color: "#637068" }}>SHOP</p>
          <h1 className="page-title">{t.title}</h1>
          <p className="muted">{t.sub}</p>
        </div>
        <span className="coin-balance"><span className="coin-chip">◎</span> {balance} <small>{t.coins}</small></span>
      </div>

      {!signed && !authLoading && <div className="notice" style={{ marginBottom: 16 }}>{t.localWarn}</div>}
      {signed && probed && !server && (
        <div className="notice" style={{ marginBottom: 16 }}>
          {offline === "signed-out" ? t.expired : offline === "not-migrated" ? t.notMigrated : t.offline}
        </div>
      )}

      <div className="shop-top">
        <section className="panel">
          <h3>{t.ladder}</h3>
          <p className="muted">{t.ladderNote}</p>
          <div className="ladder">
            {COIN_RULES.map(rule => {
              const reached = streak >= rule.days;
              return (
                <div key={rule.days} className={`ladder-step ${reached ? "done" : ""}`}>
                  <b>{rule.days} {t.day}</b>
                  <span>+{rule.coins} {t.coins}</span>
                  <i>{reached ? "✓" : "○"}</i>
                </div>
              );
            })}
          </div>
          <div className="ladder-foot">
            <span className="mono">{t.streak}: <b style={{ color: "var(--lime)" }}>{streak}</b> · {t.today}: {Math.floor(act.activeSeconds / 60)}/{DAY_SECONDS_REQUIRED / 60} {t.minutes} · {act.duels}/{DAY_DUELS_REQUIRED} {t.duels}</span>
            <button className="primary" onClick={claim} disabled={busy === "claim"}>{t.claim}</button>
          </div>
          {upcoming && <p className="muted">{t.next}: {upcoming.days} {t.day} → +{upcoming.coins} {t.coins} · {coinsForStreak(streak)}/{TOTAL_LADDER_COINS}</p>}
          {message && <div className="quiz-result" style={{ marginTop: 12 }}>{message}</div>}
        </section>

        <section className="panel">
          <h3>{t.orders}</h3>
          {orders.length === 0 ? <p className="muted">{t.none}</p> : (
            <ul className="order-list">
              {orders.map(o => (
                <li key={o.id}>
                  <b>{o.slug}</b>
                  <span className={`tag ${o.status === "fulfilled" ? "tag-solved" : ""}`}>
                    {o.status === "fulfilled" ? t.statusFulfilled : o.status === "cancelled" ? t.statusCancelled : t.statusPending}
                  </span>
                  <small className="mono">−{o.costCoins}</small>
                </li>
              ))}
            </ul>
          )}
          <p className="muted" style={{ marginTop: 14 }}>{t.fulfilNote}</p>
          <label className="shop-field">
            <span>{t.tgLabel}</span>
            <input value={telegram} onChange={e => setTelegram(e.target.value)} placeholder={t.tgPlaceholder} aria-label={t.tgLabel} />
          </label>
        </section>
      </div>

      <div className="gift-grid">
        {items.map(item => {
          const affordable = balance >= item.costCoins;
          return (
            <article key={item.slug} className={`gift-card ${affordable ? "" : "locked"}`}>
              <div className="gift-art"><GiftArtwork art={item.art} /></div>
              <span className="tier-badge">★ {item.telegramStars}</span>
              <h3>{lang === "uz" ? item.nameUz : item.nameEn}</h3>
              <p className="muted">{lang === "uz" ? item.descriptionUz : item.descriptionEn}</p>
              <div className="gift-meta">
                <span className="mono">{t.cost} <b>{item.costCoins}</b> {t.coins}</span>
                {item.telegramStars && <span className="tag">★ {item.telegramStars} {t.stars}</span>}
              </div>
              {/* A disabled button is a dead end: it refuses and explains
                  nothing. This one stays live and answers the only question
                  the reader has — how much further. */}
              <button className={affordable ? "primary" : "secondary"} disabled={busy === item.slug}
                onClick={() => affordable
                  ? buy(item)
                  : setMessage(tr(lang, "shop.short_by", { n: item.costCoins - balance }))}>
                {affordable ? t.buy : tr(lang, "shop.short_by", { n: item.costCoins - balance })}
              </button>
            </article>
          );
        })}
      </div>
      <p className="muted art-credit">{lang === "uz" ? ART_CREDIT : ART_CREDIT_EN}</p>
    </>
  );
}
