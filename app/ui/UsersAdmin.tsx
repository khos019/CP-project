"use client";

import { useEffect, useRef, useState } from "react";
import {
  ownerSearchUsers,
  ownerSetRole,
  ownerSetSuspended,
  ownerUpdateIdentity,
  type AdminUser,
  type ApiError,
  type Role,
} from "./session";

type Lang = "uz" | "en";

/* Owner-only account administration.
 *
 * Deliberately not folded into the statistics page: statistics is aggregate —
 * it never names an individual — and this page is the opposite, so keeping
 * them apart keeps that promise legible. It is also not inside Admin studio,
 * which admins can open; granting roles must not sit behind a door the people
 * being granted roles can already walk through.
 *
 * Nothing here is a permission decision. Every button calls a security-definer
 * function that re-checks the caller is an owner (migration 010), so a learner
 * who reconstructs these requests by hand is refused by the database. What the
 * UI does is refuse to *offer* an action that would be rejected, and explain
 * why when one is.
 */
const T = {
  uz: {
    eyebrow: "Faqat ega uchun",
    title: "Foydalanuvchilar",
    lede: "Nickname, ism yoki email bo‘yicha qidiring. Topilgan hisob ustida rol, nom va holatni o‘zgartirasiz.",
    search: "Qidirish",
    placeholder: "nickname, ism yoki email…",
    searching: "Qidirilmoqda…",
    noQuery: "Qidiruvni boshlash uchun kamida 2 ta belgi kiriting.",
    empty: "Hech kim topilmadi. Boshqa yozuv bilan urinib ko‘ring.",
    emptyAll: "Hali birorta hisob yo‘q.",
    emptyDay: "Bu kuni hech kim qo‘shilmagan.",
    clear: "Tozalash",
    newestFirst: "eng so‘nggilari birinchi",
    onDay: (d: string) => `${d} kuni qo‘shilganlar`,
    found: (n: number) => `${n} ta hisob topildi`,
    // This page needs 010 (the gate and the actions) and 012 (the browse and
    // day filter). Naming only 010 sent an owner who had already run it
    // looking in the wrong place, so the message names both and the order.
    notMigrated:
      "Foydalanuvchi boshqaruvi to‘liq o‘rnatilmagan. SQL Editor’da 010_user_administration.sql, so‘ng 012_user_browse.sql ni ishga tushiring. 010 ni bajargan bo‘lsangiz — 012 yetishmayapti.",
    forbidden: "Bu sahifa faqat ega (owner) roli uchun.",
    networkErr: "Ma’lumotni olib bo‘lmadi. Internetni tekshirib, qayta urining.",
    joined: "Qo‘shildi",
    lastSeen: "Oxirgi kirish",
    never: "hech qachon",
    rating: "Reyting",
    solved: "Yechgan",
    unconfirmed: "Email tasdiqlanmagan",
    suspended: "BLOKLANGAN",
    role: "Rol",
    makeAdmin: "Admin qilish",
    removeAdmin: "Adminlikdan olish",
    rename: "Nom va nickname",
    username: "Nickname",
    displayName: "Ko‘rinadigan ism",
    save: "Saqlash",
    saving: "Saqlanmoqda…",
    saved: "Saqlandi.",
    message: "Xabar yozish",
    openProfile: "Akkountni ochish",
    suspend: "Hisobni bloklash",
    restore: "Blokdan chiqarish",
    reason: "Sabab (ixtiyoriy, foydalanuvchiga ko‘rinadi)",
    confirmSuspend: "Bloklansinmi? U dars o‘qiy oladi, lekin xabar yoza olmaydi va nomini o‘zgartira olmaydi.",
    confirmRole: (name: string, next: string) => `${name} roli "${next}" ga o‘zgartirilsinmi?`,
    errTaken: "Bu nickname band — nickname’lar takrorlanmaydi.",
    errInvalid: "Nickname 3–24 belgi: faqat harf, raqam va _ . Ism 40 belgidan oshmasin.",
    errForbidden: "Ruxsat yo‘q. Bu amalni faqat ega bajaradi.",
    errSelf: "O‘z rolingizni yoki holatingizni o‘zgartira olmaysiz.",
    errNet: "Amal bajarilmadi. Qaytadan urining.",
    you: "bu siz",
    roles: { user: "O‘quvchi", admin: "Admin", owner: "Ega" } as Record<Role, string>,
  },
  en: {
    eyebrow: "Owner only",
    title: "Users",
    lede: "Search by username, name or email. Change the role, the name and the standing of whoever you find.",
    search: "Search",
    placeholder: "username, name or email…",
    searching: "Searching…",
    noQuery: "Type at least 2 characters to search.",
    empty: "Nobody matched. Try a different spelling.",
    emptyAll: "There are no accounts yet.",
    emptyDay: "Nobody joined on that day.",
    clear: "Clear",
    newestFirst: "newest first",
    onDay: (d: string) => `Joined on ${d}`,
    found: (n: number) => `${n} account${n === 1 ? "" : "s"} found`,
    notMigrated:
      "User administration is not fully installed. Run 010_user_administration.sql, then 012_user_browse.sql, in the SQL Editor. If you already ran 010, the missing one is 012.",
    forbidden: "This page is for the owner role only.",
    networkErr: "Could not load the data. Check your connection and try again.",
    joined: "Joined",
    lastSeen: "Last sign-in",
    never: "never",
    rating: "Rating",
    solved: "Solved",
    unconfirmed: "Email unconfirmed",
    suspended: "SUSPENDED",
    role: "Role",
    makeAdmin: "Make admin",
    removeAdmin: "Remove admin",
    rename: "Name and username",
    username: "Username",
    displayName: "Display name",
    save: "Save",
    saving: "Saving…",
    saved: "Saved.",
    message: "Send a message",
    openProfile: "Open account",
    suspend: "Suspend account",
    restore: "Restore account",
    reason: "Reason (optional, shown to the person)",
    confirmSuspend: "Suspend this account? They keep reading lessons but cannot send messages or rename themselves.",
    confirmRole: (name: string, next: string) => `Change ${name}'s role to "${next}"?`,
    errTaken: "That username is taken — usernames are unique.",
    errInvalid: "Username is 3–24 characters: letters, digits and _ only. Display name is at most 40.",
    errForbidden: "Not allowed. Only the owner can do this.",
    errSelf: "You cannot change your own role or standing.",
    errNet: "That did not go through. Try again.",
    you: "this is you",
    roles: { user: "Learner", admin: "Admin", owner: "Owner" } as Record<Role, string>,
  },
};

const MONTHS = {
  uz: ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
/* The chart hands over a plain UTC date ("2026-08-27"); read it as UTC so the
   chip names the same day the bar counted. */
const dayLabel = (iso: string, lang: Lang) => {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getUTCDate()} ${MONTHS[lang][d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const shortDate = (iso: string | null, lang: Lang, never: string) => {
  if (!iso) return never;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return never;
  return `${d.getUTCDate()} ${MONTHS[lang][d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const errorText = (e: ApiError, t: (typeof T)["uz"]) =>
  e === "username-taken" ? t.errTaken
  : e === "invalid" ? t.errInvalid
  : e === "forbidden" ? t.errForbidden
  : e === "not-migrated" ? t.notMigrated
  : t.errNet;

export function UsersAdmin({
  lang,
  meId,
  goProfile,
  onMessage,
  onOpenProfile,
  initialDay,
  onDayConsumed,
}: {
  lang: Lang;
  meId: string;
  goProfile: () => void;
  onMessage: (userId: string) => void;
  onOpenProfile: (username: string) => void;
  /* A UTC day handed over from the statistics chart: "show me the five people
     behind this bar". Consumed once, so leaving and returning to the page does
     not silently re-apply a filter the owner already cleared. */
  initialDay?: string | null;
  onDayConsumed?: () => void;
}) {
  const t = T[lang];
  const [query, setQuery] = useState("");
  const [day, setDay] = useState<string | null>(initialDay ?? null);
  const [rows, setRows] = useState<AdminUser[] | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [failure, setFailure] = useState<ApiError | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const seq = useRef(0);

  /* The day was already captured by useState above — this screen is mounted
     fresh each time it is opened — so all that is left is to tell the parent
     it has been taken, which stops the filter reappearing on a later visit. */
  useEffect(() => {
    if (initialDay) onDayConsumed?.();
  }, [initialDay, onDayConsumed]);

  const run = async (term: string, onDay: string | null) => {
    const ticket = ++seq.current;
    setState("loading");
    const result = await ownerSearchUsers(term.trim(), onDay, onDay ? 200 : 40);
    // A slower earlier request must not overwrite a newer one's results.
    if (ticket !== seq.current) return;
    if (result.ok) {
      setRows(result.data || []);
      setState("ready");
      setFailure(null);
    } else {
      setFailure(result.error);
      setState("error");
    }
  };

  /* The page opens on the newest accounts rather than on an empty screen: an
     owner who wants to see who is here should not have to guess a name first.
     Typing narrows that list, and does so a moment after the last keystroke —
     one request per word, not one per letter. */
  useEffect(() => {
    const id = setTimeout(() => void run(query, day), query ? 320 : 0);
    return () => clearTimeout(id);
  }, [query, day]);

  const patch = (next: AdminUser) => setRows((list) => (list || []).map((u) => (u.id === next.id ? next : u)));
  const browsing = !query.trim();

  return (
    <>
      <button className="crumb crumb-btn" onClick={goProfile}>
        ← {lang === "uz" ? "Profilga qaytish" : "Back to profile"}
      </button>

      <div className="page-head">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="page-title">{t.title}</h1>
          <p className="muted ua-lede">{t.lede}</p>
        </div>
      </div>

      <div className="ua-toolbar">
        <div className="ua-searchbox">
          <span className="ua-searchic" aria-hidden>
            ⌕
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            autoComplete="off"
            spellCheck={false}
            aria-label={t.search}
          />
          {query && (
            <button className="ua-clear" onClick={() => setQuery("")} aria-label={t.clear}>
              ✕
            </button>
          )}
        </div>
        {day && (
          <button className="ua-daychip" onClick={() => setDay(null)}>
            {t.onDay(dayLabel(day, lang))} <i aria-hidden>✕</i>
          </button>
        )}
      </div>

      <p className="muted ua-hint">
        {state === "loading"
          ? t.searching
          : state === "ready" && rows
            ? `${t.found(rows.length)}${browsing && !day ? ` · ${t.newestFirst}` : ""}`
            : ""}
      </p>

      {state === "error" && failure && (
        <div className="panel">
          <div className="notice notice-error">
            {failure === "not-migrated" ? t.notMigrated : failure === "forbidden" ? t.forbidden : t.networkErr}
          </div>
        </div>
      )}

      {state === "ready" && rows && rows.length === 0 && (
        <div className="panel ua-empty">
          <span aria-hidden>🔍</span>
          <p className="muted">{day ? t.emptyDay : browsing ? t.emptyAll : t.empty}</p>
        </div>
      )}

      {rows && rows.length > 0 && (
        <div className="ua-list">
          {rows.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              lang={lang}
              t={t}
              isMe={u.id === meId}
              open={openId === u.id}
              onToggle={() => setOpenId(openId === u.id ? null : u.id)}
              onPatch={patch}
              onMessage={() => onMessage(u.id)}
              onOpenProfile={() => onOpenProfile(u.username)}
            />
          ))}
        </div>
      )}
    </>
  );
}

function UserRow({
  user,
  lang,
  t,
  isMe,
  open,
  onToggle,
  onPatch,
  onMessage,
  onOpenProfile,
}: {
  user: AdminUser;
  lang: Lang;
  t: (typeof T)["uz"];
  isMe: boolean;
  open: boolean;
  onToggle: () => void;
  onPatch: (u: AdminUser) => void;
  onMessage: () => void;
  onOpenProfile: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [username, setUsername] = useState(user.username);
  const [displayName, setDisplayName] = useState(user.display_name);
  const [reason, setReason] = useState(user.suspended_reason || "");

  const name = user.display_name || user.username;
  const initials = (name.trim()[0] || "A").toUpperCase();
  // An owner is never a target: not demotable, not suspendable, not renamable
  // from here. Neither is your own row.
  const locked = isMe || user.role === "owner";

  const act = async (fn: () => Promise<{ ok: true } | { ok: false; error: ApiError }>, after: () => void) => {
    setBusy(true);
    setNote(null);
    const result = await fn();
    setBusy(false);
    if (result.ok) {
      after();
      setNote({ kind: "ok", text: t.saved });
    } else {
      setNote({ kind: "error", text: errorText(result.error, t) });
    }
  };

  const toggleRole = () => {
    const next: Role = user.role === "admin" ? "user" : "admin";
    if (!confirm(t.confirmRole(name, t.roles[next]))) return;
    void act(
      () => ownerSetRole(user.id, next),
      () => onPatch({ ...user, role: next }),
    );
  };

  const toggleSuspend = () => {
    const next = !user.suspended_at;
    if (next && !confirm(t.confirmSuspend)) return;
    void act(
      () => ownerSetSuspended(user.id, next, reason),
      () =>
        onPatch({
          ...user,
          suspended_at: next ? new Date().toISOString() : null,
          suspended_reason: next ? reason || null : null,
        }),
    );
  };

  const saveIdentity = () =>
    void act(
      () => ownerUpdateIdentity(user.id, username.trim(), displayName.trim()),
      () => onPatch({ ...user, username: username.trim(), display_name: displayName.trim() }),
    );

  return (
    <div className={user.suspended_at ? "panel ua-card suspended" : "panel ua-card"}>
      <button className="ua-row" onClick={onToggle} aria-expanded={open}>
        <span className="ua-avatar" aria-hidden>
          {user.avatar_url ? <img src={user.avatar_url} alt="" /> : initials}
        </span>
        <span className="ua-who">
          <b>
            {name}
            {isMe && <span className="ua-selftag">{t.you}</span>}
          </b>
          <small className="mono">@{user.username}</small>
          <small className="muted">{user.email}</small>
        </span>
        <span className="ua-marks">
          <span className={`ua-role ${user.role}`}>{t.roles[user.role]}</span>
          {user.suspended_at && <span className="ua-flag">{t.suspended}</span>}
          {!user.email_confirmed && <span className="ua-flag soft">{t.unconfirmed}</span>}
        </span>
        <span className="ua-caret" aria-hidden>
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <div className="ua-detail">
          <div className="ua-facts">
            <span>
              {t.joined} <b>{shortDate(user.created_at, lang, t.never)}</b>
            </span>
            <span>
              {t.lastSeen} <b>{shortDate(user.last_sign_in_at, lang, t.never)}</b>
            </span>
            <span>
              {t.rating} <b className="mono">{user.duel_rating}</b>
            </span>
            <span>
              {t.solved} <b className="mono">{user.solved_count}</b>
            </span>
          </div>

          {note && <div className={`notice ${note.kind === "error" ? "notice-error" : ""}`}>{note.text}</div>}

          <div className="ua-actions">
            <button className="secondary" onClick={onOpenProfile} disabled={busy}>
              {t.openProfile}
            </button>
            <button className="secondary" onClick={onMessage} disabled={busy}>
              {t.message}
            </button>
            {!locked && (
              <button className="secondary" onClick={toggleRole} disabled={busy}>
                {user.role === "admin" ? t.removeAdmin : t.makeAdmin}
              </button>
            )}
            {!locked && (
              <button className={user.suspended_at ? "secondary" : "pill danger"} onClick={toggleSuspend} disabled={busy}>
                {user.suspended_at ? t.restore : t.suspend}
              </button>
            )}
          </div>

          {locked ? (
            <p className="muted ua-locked">{t.errSelf}</p>
          ) : (
            <>
              {!user.suspended_at && (
                <label className="field">
                  <span>{t.reason}</span>
                  <input value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} />
                </label>
              )}
              <div className="ua-rename">
                <label className="field">
                  <span>{t.username}</span>
                  <input value={username} onChange={(e) => setUsername(e.target.value)} maxLength={24} spellCheck={false} />
                </label>
                <label className="field">
                  <span>{t.displayName}</span>
                  <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={40} />
                </label>
                <button
                  className="secondary"
                  onClick={saveIdentity}
                  disabled={busy || (username.trim() === user.username && displayName.trim() === user.display_name)}
                >
                  {busy ? t.saving : t.save}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
