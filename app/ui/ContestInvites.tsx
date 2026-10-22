"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tr, type Lang } from "./i18n";
import { ownerRpc, when, type Invitation } from "./contest-data";

/* Contest team invitations (068), wherever the invitee happens to be.
 *
 * An invitation used to be visible only on the contests page or inside the
 * round, so somebody who was invited and never went there never found out.
 * Now the shell asks for them on sign-in, every minute and whenever the tab
 * comes back, and shows them twice over: a bell in the header with a count,
 * and — once per invitation — a card in the corner of whatever screen is
 * open.
 *
 * The reads go straight to Supabase (my_contest_invitations), not through a
 * Worker, so polling costs no Cloudflare requests. */

const POLL_MS = 60_000;
const SEEN_KEY = "algoyol:contest-invites-seen";

const readSeen = (): string[] => {
  try { return JSON.parse(sessionStorage.getItem(SEEN_KEY) || "[]") as string[]; } catch { return []; }
};
const writeSeen = (list: string[]) => {
  try { sessionStorage.setItem(SEEN_KEY, JSON.stringify(list.slice(-50))); } catch { /* private mode */ }
};
/* One invitation is one (round, role, moment) — a re-invite to another role
   is news again, a re-read of the same one is not. */
const idOf = (i: Invitation) => `${i.slug}:${i.role}`;

export function useContestInvites(signed: boolean) {
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [nonce, setNonce] = useState(0);
  const refresh = useCallback(() => setNonce((n) => n + 1), []);
  useEffect(() => {
    if (!signed) return;
    let live = true;
    const load = () => {
      void ownerRpc<Invitation[]>("my_contest_invitations", {}).then((got) => {
        // A missing migration or a lapsed session simply means no invitations.
        if (live && got.ok) setInvites(got.data || []);
      });
    };
    load();
    const id = window.setInterval(() => { if (document.visibilityState === "visible") load(); }, POLL_MS);
    const wake = () => { if (document.visibilityState === "visible") load(); };
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("focus", wake);
    return () => { live = false; window.clearInterval(id); document.removeEventListener("visibilitychange", wake); window.removeEventListener("focus", wake); };
  }, [signed, nonce]);
  const respond = useCallback(async (inv: Invitation, accept: boolean) => {
    const got = await ownerRpc("contest_invitation_respond", { p_slug: inv.slug, p_accept: accept });
    if (got.ok) setInvites((list) => list.filter((x) => idOf(x) !== idOf(inv)));
    return got.ok;
  }, []);
  return { invites: signed ? invites : [], respond, refresh };
}

const titleOf = (lang: Lang, i: Invitation) => (lang === "uz" ? i.title_uz : i.title_en) || i.title_uz;
const BellIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9ZM10 19a2 2 0 0 0 4 0" />
  </svg>
);

function InviteRow({ lang, inv, onAnswer, onOpen }: {
  lang: Lang; inv: Invitation; onAnswer: (accept: boolean) => Promise<boolean>; onOpen: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const answer = async (accept: boolean) => {
    setBusy(true);
    setFailed(false);
    const ok = await onAnswer(accept);
    setBusy(false);
    // A lapsed session or a dropped connection must not look like "done".
    if (!ok) setFailed(true);
  };
  return <div className="ci-row">
    <span className={`ci-role ${inv.role}`}>{tr(lang, `contests.role_${inv.role}`)}</span>
    <div className="ci-copy">
      <b>{tr(lang, `contests.inv_text_${inv.role}`, { title: titleOf(lang, inv), who: inv.invited_by ? `@${inv.invited_by}` : "owner" })}</b>
      <small>{tr(lang, "contests.inv_starts", { t: when(inv.starts_at, lang) })} · <button type="button" className="ci-link" onClick={onOpen}>{tr(lang, "contests.inv_view")}</button></small>
    </div>
    <span className="ci-actions">
      <button type="button" className="primary" disabled={busy} onClick={() => void answer(true)}>{tr(lang, "contests.inv_accept")}</button>
      <button type="button" className="cx-ghost-btn" disabled={busy} onClick={() => void answer(false)}>{tr(lang, "contests.inv_decline")}</button>
    </span>
    {failed && <small className="ci-error">{tr(lang, "contests.inv_failed")}</small>}
  </div>;
}

/* The header bell: a count, and the list one click away. */
export function InviteBell({ lang, invites, onAnswer, onOpen }: {
  lang: Lang; invites: Invitation[];
  onAnswer: (inv: Invitation, accept: boolean) => Promise<boolean>; onOpen: (slug: string) => void;
}) {
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
  const n = invites.length;
  return <div className="ci-bell-wrap" ref={ref}>
    <button type="button" className={`icon-link ci-bell${n ? " has" : ""}`} aria-haspopup="dialog" aria-expanded={open}
      aria-label={tr(lang, "contests.inv_bell", { n })} title={tr(lang, "contests.inv_bell", { n })} onClick={() => setOpen((v) => !v)}>
      <BellIcon />
      {n > 0 && <span className="msg-badge ci-badge">{n > 9 ? "9+" : n}</span>}
    </button>
    {open && <div className="ci-panel" role="dialog" aria-label={tr(lang, "contests.inv_title")}>
      <header><b>{tr(lang, "contests.inv_title")}</b></header>
      {n === 0 ? <p className="ci-empty">{tr(lang, "contests.inv_none")}</p>
        : invites.map((inv) => <InviteRow key={idOf(inv)} lang={lang} inv={inv}
            onAnswer={(accept) => onAnswer(inv, accept)} onOpen={() => { setOpen(false); onOpen(inv.slug); }} />)}
    </div>}
  </div>;
}

/* The corner card: the newest invitation this browser session has not shown
   yet. "Keyinroq" puts it away until the next session; the bell keeps it. */
export function InviteToast({ lang, invites, onAnswer, onOpen }: {
  lang: Lang; invites: Invitation[];
  onAnswer: (inv: Invitation, accept: boolean) => Promise<boolean>; onOpen: (slug: string) => void;
}) {
  const [seen, setSeen] = useState<string[]>(() => (typeof window === "undefined" ? [] : readSeen()));
  const fresh = invites.find((i) => !seen.includes(idOf(i)));
  if (!fresh) return null;
  const dismiss = () => { const next = [...seen, idOf(fresh)]; setSeen(next); writeSeen(next); };
  return <div className="ci-toast" role="status" aria-live="polite">
    <div className="ci-toast-head">
      <span className="ci-toast-ic" aria-hidden><BellIcon /></span>
      <b>{tr(lang, "contests.inv_new")}</b>
      <button type="button" className="ci-close" aria-label={tr(lang, "contests.inv_later")} onClick={dismiss}>✕</button>
    </div>
    <InviteRow lang={lang} inv={fresh} onAnswer={async (accept) => { const ok = await onAnswer(fresh, accept); if (ok) dismiss(); return ok; }}
      onOpen={() => { dismiss(); onOpen(fresh.slug); }} />
    <button type="button" className="ci-later" onClick={dismiss}>{tr(lang, "contests.inv_later")}</button>
  </div>;
}
