"use client";
/* eslint-disable @next/next/no-html-link-for-pages --
   These are real <a href>s on purpose. The app routes itself with pushState
   inside one mounted tree (see screenToPath in AlgoYolApp); next/link would
   navigate the catch-all route and remount the whole shell, dropping the duel
   channel, the presence heartbeat and every open screen with it. The href is
   here so the address is honest to the browser, not so Next handles it. */

import { useEffect, useRef, useState } from "react";
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
function navHandler(go: () => void) {
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
      onClick={navHandler(() => { setMenu(false); go(to.slice(1)); })}>{label}</a>
  );

  return (
    <header className="topbar">
      <a className="brand" href="/" onClick={navHandler(() => go("home"))}>
        <BrandMark className="brandmark" />AlgoYo‘l
      </a>

      <nav className="nav" aria-label={uz ? "Asosiy bo‘limlar" : "Main sections"}>
        {PRIMARY.map(link => (
          <a
            key={link.view}
            className={view === link.view ? "nav-link active" : "nav-link"}
            href={link.href}
            aria-current={view === link.view ? "page" : undefined}
            onClick={navHandler(() => go(link.view))}
          >{uz ? link.uz : link.en}</a>
        ))}
      </nav>

      <div className="actions">
        <button className="lang" onClick={swapLang}
          aria-label={uz ? "Switch to English" : "O‘zbekchaga o‘tish"}>{uz ? "EN" : "UZ"}</button>

        {signed && streak !== null && streak > 0 && (
          <span className="streak" title={uz ? `${streak} kunlik seriya` : `${streak}-day streak`}>
            <span aria-hidden>🔥</span>{streak}
          </span>
        )}

        {signed && (
          <a className="icon-link" href="/messages" onClick={navHandler(() => go("messages"))}
            aria-label={uz ? "Xabarlar" : "Messages"}>
            ✉{unread > 0 && <span className="msg-badge">{unread > 99 ? "99+" : unread}</span>}
          </a>
        )}

        {authLoading ? (
          <span className="pill pill-loading" aria-live="polite">…</span>
        ) : signed ? (
          <div className="menu-wrap" ref={menuRef}>
            <button className="avatar-btn" aria-haspopup="menu" aria-expanded={menu}
              onClick={() => setMenu(v => !v)}
              aria-label={uz ? "Hisob menyusi" : "Account menu"}>
              {(name || "?").trim().charAt(0).toUpperCase()}
            </button>
            {menu && (
              <div className="menu" role="menu">
                {/* The balance is the shop's doorway: coins mean nothing until you
                    see what they buy, so the number itself is the link. */}
                <a className="menu-balance" role="menuitem" href="/shop"
                  onClick={navHandler(() => { setMenu(false); go("shop"); })}>
                  <span><span aria-hidden>◆</span> {coins ?? 0} {uz ? "tanga" : "coins"}</span>
                  <span className="menu-balance-go">{uz ? "Do‘kon" : "Shop"}</span>
                </a>
                <div className="menu-sep" />
                {item("/profile", uz ? "Profil" : "Profile")}
                {item("/submissions", uz ? "Yechimlarim" : "My submissions")}
                {item("/friends", uz ? "Do‘stlar" : "Friends")}
                {item("/messages", uz ? "Xabarlar" : "Messages")}
                <div className="menu-sep" />
                {item("/playground", uz ? "Kompilyator" : "Compiler")}
              </div>
            )}
          </div>
        ) : (
          <>
            <a className="nav-link" href="/auth" onClick={navHandler(() => go("auth"))}>
              {uz ? "Kirish" : "Sign in"}
            </a>
            {/* The single solid button on a signed-out page. */}
            <a className="primary" href="/auth" onClick={navHandler(() => go("auth"))}>
              {uz ? "Ro‘yxatdan o‘tish" : "Create account"}
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
    <nav className="mobile-nav" aria-label={uz ? "Asosiy bo‘limlar" : "Main sections"}>
      {TABS.map(tab => (
        <a key={tab.view} className={view === tab.view ? "active" : ""} href={tab.href}
          aria-current={view === tab.view ? "page" : undefined}
          onClick={navHandler(() => go(tab.view))}>
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
    <a href={to} onClick={navHandler(() => go(view))}>{label}</a>
  );
  return (
    <footer className="footer">
      <div className="footer-cols">
        <div className="footer-about">
          <span className="footer-brand"><BrandMark className="footer-mark" />AlgoYo‘l</span>
          <p>{uz
            ? "O‘zbek tilidagi algoritmlar maktabi: tartibli yo‘l xaritasi, haqiqiy kod tekshiruvchi va jonli duellar."
            : "An algorithms school in Uzbek: an ordered roadmap, a real judge, and live duels."}</p>
          <span className="footer-tag">{uz ? "Bilimdan natijagacha." : "From learning to results."}</span>
        </div>
        <nav className="footer-col" aria-label={uz ? "O‘rganish" : "Learn"}>
          <h3>{uz ? "O‘rganish" : "Learn"}</h3>
          {link("/roadmaps", "roadmaps", uz ? "Yo‘l xaritalari" : "Roadmaps")}
          {link("/problems", "problems", uz ? "Masalalar" : "Problems")}
          {link("/playground", "playground", uz ? "Kompilyator" : "Compiler")}
          {link("/placement", "placement", uz ? "Darajani aniqlash" : "Placement")}
        </nav>
        <nav className="footer-col" aria-label={uz ? "Hamjamiyat" : "Community"}>
          <h3>{uz ? "Hamjamiyat" : "Community"}</h3>
          {link("/duel", "duel", uz ? "Duel" : "Duel")}
          {link("/leaderboard", "leaderboard", uz ? "Reyting" : "Rating")}
          {link("/shop", "shop", uz ? "Do‘kon" : "Shop")}
        </nav>
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} AlgoYo‘l · {uz ? "Toshkent" : "Tashkent"}</span>
      </div>
    </footer>
  );
}
