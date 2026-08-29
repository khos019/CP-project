"use client";

/* The three pieces that both profile screens need: the friend star, the avatar
   viewer, and the submission history with its paywall. They live here rather
   than in either screen because "somebody's profile" and "my profile" are the
   same page seen from two sides, and duplicating the paywall in particular is
   how the two sides end up disagreeing about who may read what. */

import { useEffect, useState } from "react";
import {
  addFriend, fetchSubmissionCode, fetchSubmissions, removeFriend, unlockSubmissionCode,
  type CodeResult, type SubmissionRow,
} from "./social";

type Lang = "uz" | "en";

const T = {
  uz: {
    add: "Do‘stlarga qo‘shish",
    added: "Do‘stlaringizda",
    signInToAdd: "Do‘st qo‘shish uchun kiring",
    submissions: "Yuborilgan yechimlar",
    none: "Hali yechim yuborilmagan.",
    loading: "Yuklanmoqda…",
    failed: "Ro‘yxatni olib bo‘lmadi.",
    missing: "Yechimlar tarixi serverda hali yoqilmagan (015-migratsiya).",
    when: "Vaqti",
    problem: "Masala",
    lang: "Til",
    verdict: "Natija",
    time: "Vaqt",
    code: "Kod",
    view: "Ko‘rish",
    locked: "Qulflangan",
    buy: (n: number) => `${n} tangaga ochish`,
    bought: (n: number) => `${n} tanga yechildi.`,
    free: "Siz bu masalani yechgansiz — kod bepul ochildi.",
    mine: "Sizning kodingiz",
    need: "Tanga yetarli emas.",
    signInToBuy: "Kodni ko‘rish uchun hisobingizga kiring.",
    offline: "Kodni olib bo‘lmadi. Qaytadan urinib ko‘ring.",
    close: "Yopish",
    whyPaid: "Masalani o‘zingiz yechsangiz, boshqalarning kodi shu masala uchun bepul ochiladi.",
    avatarOpen: "Rasmni kattalashtirish",
    verdicts: {
      ACCEPTED: "Qabul qilindi", WRONG_ANSWER: "Noto‘g‘ri javob", COMPILATION_ERROR: "Kompilyatsiya xatosi",
      RUNTIME_ERROR: "Bajarilish xatosi", TIME_LIMIT_EXCEEDED: "Vaqt chegarasi", MEMORY_LIMIT_EXCEEDED: "Xotira chegarasi",
      JUDGE_ERROR: "Tekshiruvchi xatosi",
    } as Record<string, string>,
  },
  en: {
    add: "Add to friends",
    added: "In your friends",
    signInToAdd: "Sign in to add friends",
    submissions: "Submissions",
    none: "No submissions yet.",
    loading: "Loading…",
    failed: "Could not load the list.",
    missing: "The submission history is not enabled on the server yet (migration 015).",
    when: "When",
    problem: "Problem",
    lang: "Lang",
    verdict: "Verdict",
    time: "Time",
    code: "Code",
    view: "View",
    locked: "Locked",
    buy: (n: number) => `Unlock for ${n} coins`,
    bought: (n: number) => `${n} coins spent.`,
    free: "You have solved this problem — the code opened for free.",
    mine: "Your own code",
    need: "Not enough coins.",
    signInToBuy: "Sign in to read the code.",
    offline: "Could not load the code. Try again.",
    close: "Close",
    whyPaid: "Solve the problem yourself and everyone's code for it opens for free.",
    avatarOpen: "Enlarge the picture",
    verdicts: {
      ACCEPTED: "Accepted", WRONG_ANSWER: "Wrong answer", COMPILATION_ERROR: "Compilation error",
      RUNTIME_ERROR: "Runtime error", TIME_LIMIT_EXCEEDED: "Time limit", MEMORY_LIMIT_EXCEEDED: "Memory limit",
      JUDGE_ERROR: "Judge error",
    } as Record<string, string>,
  },
};

const when = (iso: string, lang: Lang) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString(lang === "uz" ? "uz-UZ" : "en-GB", { day: "2-digit", month: "short" });
  const time = d.toLocaleTimeString(lang === "uz" ? "uz-UZ" : "en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${date} ${time}`;
};
const LANG_LABEL: Record<string, string> = { cpp20: "C++20", python3: "Python 3" };

/* Codeforces puts a star beside the handle and fills it in when the person is
   on your list; it is the one control on the page that is understood without a
   label, so it is worth borrowing outright. The label stays for screen readers
   and as a tooltip, which the original does not do. */
export function FriendStar({
  lang, isFriend, signedIn, userId, onChange,
}: {
  lang: Lang;
  isFriend: boolean;
  signedIn: boolean;
  userId: string;
  onChange: (next: boolean) => void;
}) {
  const t = T[lang];
  const [busy, setBusy] = useState(false);
  const label = !signedIn ? t.signInToAdd : isFriend ? t.added : t.add;

  const toggle = async () => {
    if (!signedIn || busy) return;
    setBusy(true);
    // Flipped first: the star is a toggle, and waiting for a round trip before
    // it moves makes it feel broken. A failure puts it back.
    onChange(!isFriend);
    const ok = isFriend ? await removeFriend(userId) : await addFriend(userId);
    if (!ok) onChange(isFriend);
    setBusy(false);
  };

  return (
    <button
      type="button"
      className={`friend-star${isFriend ? " on" : ""}`}
      onClick={toggle}
      disabled={!signedIn || busy}
      aria-pressed={isFriend}
      title={label}
      aria-label={label}
    >
      {isFriend ? "★" : "☆"}
    </button>
  );
}

/* People do want to see the face full size — and the picture is already public
   at its own URL, so opening it is not a disclosure, just a convenience. */
export function AvatarZoom({ lang, src, name, children }: { lang: Lang; src: string | null; name: string; children: React.ReactNode }) {
  const t = T[lang];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!src) return <>{children}</>;
  return (
    <>
      <button type="button" className="avatar-zoom-trigger" onClick={() => setOpen(true)} title={t.avatarOpen} aria-label={t.avatarOpen}>
        {children}
      </button>
      {open && (
        // Clicking anywhere closes it: there is one thing on screen, so every
        // click that is not on the picture means "I am done looking".
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={name} onClick={() => setOpen(false)}>
          <img src={src} alt={name} onClick={(e) => e.stopPropagation()} />
          <button type="button" className="lightbox-close" onClick={() => setOpen(false)} aria-label={t.close}>
            ✕
          </button>
        </div>
      )}
    </>
  );
}

export function SubmissionHistory({
  lang, userId, isMe, signedIn,
}: {
  lang: Lang;
  userId: string;
  isMe: boolean;
  signedIn: boolean;
}) {
  const t = T[lang];
  const [rows, setRows] = useState<SubmissionRow[] | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error" | "missing">("loading");
  const [openRow, setOpenRow] = useState<SubmissionRow | null>(null);

  useEffect(() => {
    let live = true;
    fetchSubmissions(userId).then((list) => {
      if (!live) return;
      if (list === "not-migrated") {
        setState("missing");
        return;
      }
      if (!list) {
        setState("error");
        return;
      }
      setRows(list);
      setState("ready");
    });
    return () => {
      live = false;
    };
  }, [userId]);

  return (
    <section className="panel">
      <h2 className="os-h2">{t.submissions}</h2>
      {state === "loading" && <p className="muted os-empty">{t.loading}</p>}
      {state === "error" && <p className="muted os-empty">{t.failed}</p>}
      {state === "missing" && <p className="muted os-empty">{t.missing}</p>}
      {state === "ready" && rows && !rows.length && <p className="muted os-empty">{t.none}</p>}
      {state === "ready" && rows && rows.length > 0 && (
        <div className="sub-table-wrap">
          <table className="sub-table">
            <thead>
              <tr>
                <th>{t.when}</th>
                <th>{t.problem}</th>
                <th>{t.lang}</th>
                <th>{t.verdict}</th>
                <th>{t.time}</th>
                <th>{t.code}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="mono sub-when">{when(row.created_at, lang)}</td>
                  <td>{row.problem_title || row.problem_key}</td>
                  <td className="mono">{LANG_LABEL[row.language] || row.language}</td>
                  <td>
                    <span className={`sub-verdict ${row.verdict === "ACCEPTED" ? "ok" : "bad"}`}>
                      {t.verdicts[row.verdict] || row.verdict}
                      {row.passed !== null && row.total !== null && row.verdict !== "ACCEPTED" && (
                        <small className="mono"> {row.passed}/{row.total}</small>
                      )}
                    </span>
                  </td>
                  <td className="mono">{row.runtime_ms === null ? "—" : `${row.runtime_ms} ms`}</td>
                  <td>
                    <button className="link-btn" onClick={() => setOpenRow(row)}>
                      {row.readable || isMe ? t.view : `🔒 ${t.locked}`}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!isMe && state === "ready" && <p className="muted os-empty">{t.whyPaid}</p>}
      {openRow && <CodeViewer lang={lang} row={openRow} isMe={isMe} signedIn={signedIn} onClose={() => setOpenRow(null)} />}
    </section>
  );
}

function CodeViewer({
  lang, row, isMe, signedIn, onClose,
}: {
  lang: Lang;
  row: SubmissionRow;
  isMe: boolean;
  signedIn: boolean;
  onClose: () => void;
}) {
  const t = T[lang];
  const [result, setResult] = useState<CodeResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    let live = true;
    // Asking is free: the read only ever reports the price, it never charges.
    fetchSubmissionCode(row.id).then((r) => {
      if (live) setResult(r);
    });
    return () => {
      live = false;
    };
  }, [row.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const buy = async () => {
    setBusy(true);
    const bought = await unlockSubmissionCode(row.id);
    if (bought.state === "ok") setNote(bought.charged ? t.bought(bought.charged) : t.free);
    if (bought.state === "insufficient") setNote(t.need);
    setResult(bought.state === "insufficient" ? result : bought);
    setBusy(false);
  };

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={row.problem_title} onClick={onClose}>
      <div className="code-sheet" onClick={(e) => e.stopPropagation()}>
        <header>
          <div>
            <p className="eyebrow">{isMe ? t.mine : t.code}</p>
            <h3>{row.problem_title || row.problem_key}</h3>
          </div>
          <button type="button" className="lightbox-close static" onClick={onClose} aria-label={t.close}>
            ✕
          </button>
        </header>
        {!result && <p className="muted">{t.loading}</p>}
        {result?.state === "ok" && <pre className="code-view">{result.source}</pre>}
        {result?.state === "locked" && (
          <div className="code-locked">
            <span aria-hidden>🔒</span>
            <p className="muted">{t.whyPaid}</p>
            <button className="primary" onClick={buy} disabled={busy || result.balance < result.cost}>
              {t.buy(result.cost)}
            </button>
            <p className="muted mono">
              ◎ {result.balance}
              {result.balance < result.cost ? ` · ${t.need}` : ""}
            </p>
          </div>
        )}
        {result?.state === "signed-out" && <p className="muted">{signedIn ? t.offline : t.signInToBuy}</p>}
        {result?.state === "offline" && <p className="muted">{t.offline}</p>}
        {note && <p className="quiz-result">{note}</p>}
      </div>
    </div>
  );
}
