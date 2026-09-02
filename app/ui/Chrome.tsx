"use client";
/* eslint-disable @next/next/no-html-link-for-pages --
   These are real <a href>s on purpose. The app routes itself with pushState
   inside one mounted tree (see screenToPath in AlgoYolApp); next/link would
   navigate the catch-all route and remount the whole shell, dropping the duel
   channel, the presence heartbeat and every open screen with it. The href is
   here so the address is honest to the browser, not so Next handles it. */

import { useEffect, useRef, useState } from "react";
import { tr } from "./i18n";
import { BrandMark } from "./BrandMark";
import { fetchBalance, fetchStreak, localBalance, localStreak } from "./coins";

/* The chrome around every screen: header, mobile tab bar, footer.
   It used to live inline in AlgoYolApp as one 4,000-character return line, and
   the navigation inside it was seven <button>s. A button says "this performs an
   action"; going to another page is not an action, it is a link — which is why
   the old header read as a row of ten equally loud controls with no way to tell
   the real one apart. Everything that navigates is an <a href> here, so the
   address is real: middle-click, ctrl-click and "copy link" all work, and the
   browser reports the destination on hover. The click handler only intercepts
   the plain left-click that the SPA router can serve faster. */

export type Lang = "uz" | "en";

/* Four destinations, and no more. Do'kon and Kompilyator moved out — a shop is
   something you visit after earning coins, and a scratch compiler is something
   you reach from the problem you are already looking at; neither competes with
   the four screens the platform is actually about. */
const PRIMARY = [
  { view: "roadmaps", href: "/roadmaps", uz: "Yo‘l xaritalari", en: "Roadmaps" },
  { view: "problems", href: "/problems", uz: "Masalalar", en: "Problems" },
  { view: "duel", href: "/duel", uz: "Duel", en: "Duel" },
  { view: "leaderboard", href: "/leaderboard", uz: "Reyting", en: "Rating" },
] as const;

/* On a phone the same four live in a bottom bar, where a thumb can reach them.
   Home returns as the first tab because the bottom bar is the only navigation
   on that screen — the header keeps just the brand and the avatar. */
const TABS = [
  { view: "home", href: "/", uz: "Bosh", en: "Home", icon: "⌂" },
  { view: "roadmaps", href: "/roadmaps", uz: "Yo‘l", en: "Path", icon: "◈" },
  { view: "problems", href: "/problems", uz: "Masala", en: "Problems", icon: "≡" },
  { view: "duel", href: "/duel", uz: "Duel", en: "Duel", icon: "⚔" },
  { view: "profile", href: "/profile", uz: "Profil", en: "Profile", icon: "◉" },
] as const;

/* A plain left-click on an unmodified link is the only one the router should
   swallow. Anything else — a new tab, a new window, a download — belongs to the
   browser, and stealing it is how single-page apps break the back button and
   every "open in new tab" a learner tries. */
export function linkTo(go: () => void) {
  return (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go();
  };
}

type Nav = (view: string) => void;

/* Balance and streak are read locally first so the header never renders an
   empty slot, then corrected from the server. The local numbers are what the
   browser can compute — good enough to display, never authoritative, which is
   why the server answer overwrites them whenever it arrives. */
function useLearnerStats(signed: boolean) {
  const [coins, setCoins] = useState<number | null>(null);
  const [streak, setStreak] = useState<number | null>(null);
  useEffect(() => {
    let live = true;
    /* localStorage is not readable while this renders on the server, so the
       local seed happens here rather than in a state initialiser — reading it
       during render would hand the client a different first paint than the
       HTML it is hydrating. */
    void (async () => {
      if (!signed) { if (live) { setCoins(null); setStreak(null); } return; }
      setCoins(localBalance());
      setStreak(localStreak());
      const [balance, days] = await Promise.all([fetchBalance(), fetchStreak()]);
      if (!live) return;
      if (balance.state === "online") setCoins(balance.balance);
      if (days !== null) setStreak(days);
    })();
    return () => { live = false; };
  }, [signed]);
  return { coins, streak };
}

export function SiteHeader({
  lang, view, go, signed, authLoading, name, unread, swapLang,
}: {
  lang: Lang; view: string; go: Nav; signed: boolean; authLoading: boolean;
  name: string | null; unread: number; swapLang: () => void;
}) {
  const uz = lang === "uz";
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { coins, streak } = useLearnerStats(signed);

  /* A dropdown that outlives the click that should have closed it is the most
     common way this control goes wrong, so it closes on an outside click, on
     Escape, and on any navigation. */
  useEffect(() => {
    if (!menu) return;
    const away = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node)) setMenu(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(false); };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [menu]);

  const item = (to: string, label: string) => (
    <a className="menu-item" role="menuitem" href={to}
      onClick={linkTo(() => { setMenu(false); go(to.slice(1)); })}>{label}</a>
  );

  return (
    <header className="topbar">
      <a className="brand" href="/" onClick={linkTo(() => go("home"))}>
        <BrandMark className="brandmark" />AlgoYo‘l
      </a>

      <nav className="nav" aria-label={tr(lang,"chrome.asosiy_bolimlar")}>
        {PRIMARY.map(link => (
          <a
            key={link.view}
            className={view === link.view ? "nav-link active" : "nav-link"}
            href={link.href}
            aria-current={view === link.view ? "page" : undefined}
            onClick={linkTo(() => go(link.view))}
          >{uz ? link.uz : link.en}</a>
        ))}
      </nav>

      <div className="actions">
        <button className="lang" onClick={swapLang}
          aria-label={tr(lang,"chrome.switch_to_english")}>{tr(lang,"chrome.en")}</button>

        {signed && streak !== null && streak > 0 && (
          <span className="streak" title={uz ? `${streak} kunlik seriya` : `${streak}-day streak`}>
            <span aria-hidden>🔥</span>{streak}
          </span>
        )}

        {signed && (
          <a className="icon-link" href="/messages" onClick={linkTo(() => go("messages"))}
            aria-label={tr(lang,"chrome.xabarlar")}>
            ✉{unread > 0 && <span className="msg-badge">{unread > 99 ? "99+" : unread}</span>}
          </a>
        )}

        {authLoading ? (
          <span className="pill pill-loading" aria-live="polite">…</span>
        ) : signed ? (
          <div className="menu-wrap" ref={menuRef}>
            <button className="avatar-btn" aria-haspopup="menu" aria-expanded={menu}
              onClick={() => setMenu(v => !v)}
              aria-label={tr(lang,"chrome.hisob_menyusi")}>
              {(name || "?").trim().charAt(0).toUpperCase()}
            </button>
            {menu && (
              <div className="menu" role="menu">
                {/* The balance is the shop's doorway: coins mean nothing until you
                    see what they buy, so the number itself is the link. */}
                <a className="menu-balance" role="menuitem" href="/shop"
                  onClick={linkTo(() => { setMenu(false); go("shop"); })}>
                  <span><span aria-hidden>◆</span> {coins ?? 0} {tr(lang,"chrome.tanga")}</span>
                  <span className="menu-balance-go">{tr(lang,"chrome.dokon")}</span>
                </a>
                <div className="menu-sep" />
                {item("/profile", tr(lang,"chrome.profil"))}
                {item("/submissions", tr(lang,"chrome.yechimlarim"))}
                {item("/friends", tr(lang,"chrome.dostlar"))}
                {item("/messages", tr(lang,"chrome.xabarlar"))}
                <div className="menu-sep" />
                {item("/playground", tr(lang,"chrome.kompilyator"))}
              </div>
            )}
          </div>
        ) : (
          <>
            <a className="nav-link" href="/auth" onClick={linkTo(() => go("auth"))}>
              {tr(lang,"chrome.kirish")}
            </a>
            {/* The single solid button on a signed-out page. */}
            <a className="primary" href="/auth" onClick={linkTo(() => go("auth"))}>
              {tr(lang,"chrome.royxatdan_otish")}
            </a>
          </>
        )}
      </div>
    </header>
  );
}

export function MobileTabBar({ lang, view, go }: { lang: Lang; view: string; go: Nav }) {
  const uz = lang === "uz";
  return (
    <nav className="mobile-nav" aria-label={tr(lang,"chrome.asosiy_bolimlar")}>
      {TABS.map(tab => (
        <a key={tab.view} className={view === tab.view ? "active" : ""} href={tab.href}
          aria-current={view === tab.view ? "page" : undefined}
          onClick={linkTo(() => go(tab.view))}>
          <span className="tab-ic" aria-hidden>{tab.icon}</span>
          <span className="tab-label">{uz ? tab.uz : tab.en}</span>
        </a>
      ))}
    </nav>
  );
}

/* The footer used to be a copy of the header's navigation, which tells a reader
   who scrolled to the bottom exactly nothing they did not already have. It now
   carries what the header deliberately dropped — the compiler and the shop —
   plus the one place the tagline is allowed to appear. */
export function SiteFooter({ lang, go }: { lang: Lang; go: Nav }) {
  const uz = lang === "uz";
  const link = (to: string, view: string, label: string) => (
    <a href={to} onClick={linkTo(() => go(view))}>{label}</a>
  );
  return (
    <footer className="footer">
      <div className="footer-cols">
        <div className="footer-about">
          <span className="footer-brand"><BrandMark className="footer-mark" />AlgoYo‘l</span>
          <p>{tr(lang,"chrome.ozbek_tilidagi_algoritmlar_maktabi_tartibl")}</p>
          <span className="footer-tag">{tr(lang,"chrome.bilimdan_natijagacha")}</span>
        </div>
        <nav className="footer-col" aria-label={tr(lang,"chrome.organish")}>
          <h3>{tr(lang,"chrome.organish")}</h3>
          {link("/roadmaps", "roadmaps", tr(lang,"chrome.yol_xaritalari"))}
          {link("/problems", "problems", tr(lang,"algoYolApp.masalalar"))}
          {link("/playground", "playground", tr(lang,"chrome.kompilyator"))}
          {link("/placement", "placement", tr(lang,"chrome.darajani_aniqlash"))}
        </nav>
        <nav className="footer-col" aria-label={tr(lang,"chrome.hamjamiyat")}>
          <h3>{tr(lang,"chrome.hamjamiyat")}</h3>
          {link("/duel", "duel", uz ? "Duel" : "Duel")}
          {link("/leaderboard", "leaderboard", tr(lang,"algoYolApp.reyting_2"))}
          {link("/shop", "shop", tr(lang,"chrome.dokon"))}
        </nav>
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} AlgoYo‘l · {tr(lang,"chrome.toshkent")}</span>
      </div>
    </footer>
  );
}
