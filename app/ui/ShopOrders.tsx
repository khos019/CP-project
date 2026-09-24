"use client";

import { useEffect, useState } from "react";
import { fetchAllOrders, fulfilOrder, type StaffOrder } from "./coins";
import { sendMessage } from "./session";

type Lang = "uz" | "en";

const T = {
  uz: {
    title: "Sovg‘a buyurtmalari", back: "Profil",
    sub: "Sovg‘ani Telegram orqali yuboring, so‘ng bu yerda yopib qo‘ying.",
    waiting: "kutilmoqda", done: "yopilgan",
    none: "Hozircha buyurtma yo‘q.", loading: "Yuklanmoqda…",
    mark: "Yopish va xabar berish", marking: "Yuborilmoqda…",
    statusPending: "Kutilmoqda", statusFulfilled: "Yuborilgan", statusCancelled: "Bekor qilingan",
    marked: "Buyurtma yopildi, foydalanuvchiga xabar ketdi.",
    failed: "Yopib bo‘lmadi — qayta urinib ko‘ring.",
    offline: "Buyurtmalarni o‘qib bo‘lmadi.",
    showDone: "Yopilganlarni ham ko‘rsatish",
    sentMessage: (gift: string, tg: string) =>
      `Sovg‘angiz yuborildi: ${gift}. Telegram: ${tg.startsWith("@") ? tg : `@${tg}`}. Kelmagan bo‘lsa shu yerga yozing.`,
  },
  en: {
    title: "Gift orders", back: "Profile",
    sub: "Send the gift over Telegram, then close the order here.",
    waiting: "waiting", done: "closed",
    none: "No orders yet.", loading: "Loading…",
    mark: "Close and notify", marking: "Sending…",
    statusPending: "Pending", statusFulfilled: "Sent", statusCancelled: "Cancelled",
    marked: "Order closed, the buyer has been told.",
    failed: "Could not close it — try again.",
    offline: "Could not read the orders.",
    showDone: "Show closed ones too",
    sentMessage: (gift: string, tg: string) =>
      `Your gift is on its way: ${gift}. Telegram: ${tg.startsWith("@") ? tg : `@${tg}`}. Tell us here if it does not arrive.`,
  },
};

/* The fulfilment queue lives on its own page rather than inside the shop: the
   people who work it never buy anything, and a list that grows with every
   learner does not belong underneath one owner's coin balance. */
export function ShopOrders({ lang, isOwner, onBack }: { lang: Lang; isOwner: boolean; onBack: () => void }) {
  const t = T[lang];
  const [orders, setOrders] = useState<StaffOrder[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [showDone, setShowDone] = useState(false);

  const load = async () => {
    const all = await fetchAllOrders();
    if (all) { setOrders(all); setFailed(false); } else { setFailed(true); }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  const markSent = async (order: StaffOrder) => {
    /* Re-read rather than trust the row in hand: two staff may be looking at
       the same queue, and a second press must not send a second message. */
    if (order.status !== "pending" || busy) return;
    setBusy(order.id);
    const ok = await fulfilOrder(order.id);
    if (ok) await sendMessage(order.userId, t.sentMessage(order.slug, order.telegram), isOwner);
    setMessage(ok ? t.marked : t.failed);
    await load();
    setBusy("");
  };

  const pending = (orders || []).filter(o => o.status === "pending");
  const closed = (orders || []).filter(o => o.status !== "pending");
  const visible = showDone ? [...pending, ...closed] : pending;

  return (
    <section className="panel">
      <div className="page-head">
        <button className="ghost" onClick={onBack}>← {t.back}</button>
      </div>
      <h2>{t.title}</h2>
      <p className="muted">{t.sub}</p>

      {orders === null && !failed && <p className="muted">{t.loading}</p>}
      {failed && <div className="notice notice-error">{t.offline}</div>}
      {message && <div className="shop-msg">{message}</div>}

      {orders !== null && (
        <>
          <p className="muted mono">
            {pending.length} {t.waiting} · {closed.length} {t.done}
          </p>
          {closed.length > 0 && (
            <label className="shop-toggle">
              <input type="checkbox" checked={showDone} onChange={e => setShowDone(e.target.checked)} />
              <span>{t.showDone}</span>
            </label>
          )}
          {visible.length === 0 ? (
            <p className="muted">{t.none}</p>
          ) : (
            <ul className="order-list queue-list">
              {visible.map(o => (
                <li key={o.id}>
                  <b>{o.displayName || o.username}</b>
                  <span className="muted">@{o.username}</span>
                  <span>{o.slug}</span>
                  <a className="mono" href={`https://t.me/${o.telegram.replace(/^@/, "")}`} target="_blank" rel="noreferrer">
                    {o.telegram.startsWith("@") ? o.telegram : `@${o.telegram}`}
                  </a>
                  <small className="mono">−{o.costCoins}</small>
                  {o.status === "pending" ? (
                    <button className="primary" onClick={() => void markSent(o)} disabled={busy === o.id}>
                      {busy === o.id ? t.marking : t.mark}
                    </button>
                  ) : (
                    <span className={`tag ${o.status === "fulfilled" ? "tag-solved" : ""}`}>
                      {o.status === "fulfilled" ? t.statusFulfilled : t.statusCancelled}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
