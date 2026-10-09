"use client";
/* eslint-disable @next/next/no-html-link-for-pages --
   These are real <a href>s on purpose. The app routes itself with pushState
   inside one mounted tree (see screenToPath in AlgoYolApp); next/link would
   navigate the catch-all route and remount the whole shell, dropping the duel
   channel, the presence heartbeat and every open screen with it. The href is
   here so the address is honest to the browser, not so Next handles it. */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { tr } from "./i18n";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";
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

/* The header carries every section of the site, in two groups.
 *
 * The four the platform is about come first. The shop and the compiler follow
 * after a divider: they are real destinations people go looking for, and
 * hiding them behind an avatar menu meant a signed-out visitor had no way to
 * reach the shop at all. What made the old header unreadable was that all
 * seven were <button>s competing with the actual actions beside them — not
 * that there were seven. They are links now, and the divider says which five
 * are the spine and which two are the annexes. */
const PRIMARY = [
  { view: "roadmaps", href: "/roadmaps", uz: "Yo‘l xaritalari", en: "Roadmaps" },
  { view: "problems", href: "/problems", uz: "Masalalar", en: "Problems" },
  { view: "duel", href: "/duel", uz: "Duel", en: "Duel" },
  { view: "contests", href: "/contests", uz: "Kontestlar", en: "Contests" },
  { view: "leaderboard", href: "/leaderboard", uz: "Reyting", en: "Rating" },
] as const;

const SECONDARY = [
  { view: "playground", href: "/playground", uz: "Kompilyator", en: "Compiler" },
  { view: "shop", href: "/shop", uz: "Do‘kon", en: "Shop" },
] as const;

/* On a phone the spine lives in a bottom bar, where a thumb can reach them.
   Home returns as the first tab because the bottom bar is the only navigation
   on that screen — the header keeps just the brand and the avatar. */
const TABS = [
  { view: "home", href: "/", uz: "Bosh", en: "Home", icon: "⌂" },
  { view: "roadmaps", href: "/roadmaps", uz: "Yo‘l", en: "Path", icon: "◈" },
  { view: "problems", href: "/problems", uz: "Masala", en: "Problems", icon: "≡" },
  { view: "duel", href: "/duel", uz: "Duel", en: "Duel", icon: "⚔" },
  { view: "profile", href: "/profile", uz: "Profil", en: "Profile", icon: "◉" },
] as const;

/* What the bottom bar cannot hold. A phone gets five thumb-sized tabs and no
   more, so the rest live one tap away rather than nowhere. */
const MORE = [
  { view: "playground", href: "/playground", uz: "Kompilyator", en: "Compiler", icon: "⌨" },
  { view: "shop", href: "/shop", uz: "Do‘kon", en: "Shop", icon: "◆" },
  { view: "contests", href: "/contests", uz: "Kontestlar", en: "Contests", icon: "⚑" },
  { view: "leaderboard", href: "/leaderboard", uz: "Reyting", en: "Rating", icon: "▲" },
  { view: "placement", href: "/placement", uz: "Darajani aniqlash", en: "Placement", icon: "◎" },
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

/* Flags are drawn rather than emoji: Windows renders 🇺🇿 as the letters "UZ". */
const FLAGS: Record<string, ReactNode> = {
  uz: <><rect width="24" height="6" fill="#0099b5" /><rect y="6" width="24" height="6" fill="#fff" /><rect y="12" width="24" height="6" fill="#1eb53a" />
    <rect y="5.6" width="24" height=".8" fill="#ce1126" /><rect y="11.6" width="24" height=".8" fill="#ce1126" />
    <circle cx="4.6" cy="3" r="1.9" fill="#fff" /><circle cx="5.4" cy="3" r="1.6" fill="#0099b5" /></>,
  en: <><rect width="24" height="18" fill="#012169" /><path d="M0 0l24 18M24 0L0 18" stroke="#fff" strokeWidth="3.6" /><path d="M0 0l24 18M24 0L0 18" stroke="#c8102e" strokeWidth="1.4" />
    <path d="M12 0v18M0 9h24" stroke="#fff" strokeWidth="5" /><path d="M12 0v18M0 9h24" stroke="#c8102e" strokeWidth="3" /></>,
  ru: <><rect width="24" height="6" fill="#fff" /><rect y="6" width="24" height="6" fill="#0039a6" /><rect y="12" width="24" height="6" fill="#d52b1e" /></>,
};
const Flag = ({ code }: { code: string }) => (
  <svg className="flag" viewBox="0 0 24 18" aria-hidden="true">{FLAGS[code]}</svg>
);
const LANGS: { code: string; label: string; soon?: boolean }[] = [
  { code: "uz", label: "O‘zbekcha" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский", soon: true },
];

function LangMenu({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);
  return (
    <div className="lang-menu" ref={ref}>
      <button className="lang-btn" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(v => !v)}
        aria-label={tr(lang, "chrome.til")}>
        <Flag code={lang} /><span>{lang.toUpperCase()}</span>
        <svg className="lang-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <div className="menu lang-list" role="menu">
          {LANGS.map(l => (
            <button key={l.code} role="menuitemradio" aria-checked={l.code === lang} disabled={l.soon}
              className={`menu-item lang-item${l.code === lang ? " active" : ""}`}
              onClick={() => { setOpen(false); if (!l.soon) setLang(l.code as Lang); }}>
              <Flag code={l.code} /><span>{l.label}</span>
              {l.soon ? <small>{tr(lang, "chrome.tez_orada")}</small>
                : l.code === lang && <svg className="lang-check" viewBox="0 0 12 12" aria-hidden="true"><path d="m2.5 6.2 2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader({
  lang, view, go, signed, authLoading, name, unread, setLang,
}: {
  lang: Lang; view: string; go: Nav; signed: boolean; authLoading: boolean;
  name: string | null; unread: number; setLang: (l: Lang) => void;
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
      {/* The theme switch sits with the brand, top-left: it changes the whole
          site rather than anything in the navigation beside it. */}
      <div className="topbar-start">
        <a className="brand" href="/" onClick={linkTo(() => go("home"))}>
          <BrandMark className="brandmark" />AlgoYo‘l
        </a>
        <ThemeToggle lang={lang} />
      </div>

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
        <span className="nav-divider" aria-hidden />
        {SECONDARY.map(link => (
          <a
            key={link.view}
            className={view === link.view ? "nav-link nav-aside active" : "nav-link nav-aside"}
            href={link.href}
            aria-current={view === link.view ? "page" : undefined}
            onClick={linkTo(() => go(link.view))}
          >{uz ? link.uz : link.en}</a>
        ))}
      </nav>

      <div className="actions">
        <LangMenu lang={lang} setLang={setLang} />

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
  const [more, setMore] = useState(false);
  useEffect(() => {
    if (!more) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setMore(false); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [more]);

  return (
    <>
      {more && (
        <>
          <div className="sheet-backdrop" onClick={() => setMore(false)} aria-hidden />
          <div className="sheet" role="dialog" aria-modal="true"
            aria-label={uz ? "Boshqa bo‘limlar" : "More sections"}>
            <span className="sheet-grip" aria-hidden />
            {MORE.map(item => (
              <a key={item.view} className={view === item.view ? "sheet-item active" : "sheet-item"}
                href={item.href}
                onClick={linkTo(() => { setMore(false); go(item.view); })}>
                <span className="sheet-ic" aria-hidden>{item.icon}</span>
                {uz ? item.uz : item.en}
              </a>
            ))}
          </div>
        </>
      )}

      <nav className="mobile-nav" aria-label={tr(lang, "chrome.asosiy_bolimlar")}>
        {TABS.map(tab => (
          <a key={tab.view} className={view === tab.view ? "active" : ""} href={tab.href}
            aria-current={view === tab.view ? "page" : undefined}
            onClick={linkTo(() => { setMore(false); go(tab.view); })}>
            <span className="tab-ic" aria-hidden>{tab.icon}</span>
            <span className="tab-label">{uz ? tab.uz : tab.en}</span>
          </a>
        ))}
        {/* Five tabs is what a thumb can aim at. The rest are one tap away
            rather than nowhere, which is where they were. */}
        <button className={more ? "tab-more active" : "tab-more"} onClick={() => setMore(v => !v)}
          aria-expanded={more} aria-label={uz ? "Boshqa bo‘limlar" : "More sections"}>
          <span className="tab-ic" aria-hidden>⋯</span>
          <span className="tab-label">{uz ? "Ko‘proq" : "More"}</span>
        </button>
      </nav>
    </>
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
          {link("/contests", "contests", uz ? "Kontestlar" : "Contests")}
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
