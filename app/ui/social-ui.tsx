"use client";

/* The three pieces that both profile screens need: the friend star, the avatar
   viewer, and the submission history with its paywall. They live here rather
   than in either screen because "somebody's profile" and "my profile" are the
   same page seen from two sides, and duplicating the paywall in particular is
   how the two sides end up disagreeing about who may read what. */

import { useEffect, useState } from "react";
import { tr } from "./i18n";
import { fetchPersonByUsername } from "./session";
import { OnlineDot, onlineAmong } from "./presence";
import { CodeBlock } from "./CodeBlock";
import { LockIcon } from "./icons";
import {
  addFriend, fetchFriends, fetchMySubmissionsFor, fetchSubmissionCode, fetchSubmissions, removeFriend,
  unlockSubmissionCode,
  type CodeResult, type FriendRow, type OwnSubmissionRow, type SubmissionRow,
} from "./social";

type Lang = "uz" | "en";

const T = {
  uz: {
    add: "Do‘stlarga qo‘shish",
    added: "Do‘stlaringizda",
    signInToAdd: "Do‘st qo‘shish uchun kiring",
    submissions: "Yuborilgan yechimlar",
    none: "Hali yechim yuborilmagan",
    noneHint: "Masalani yechib, tekshiruvchiga yuborsangiz — barchasi shu yerda to‘planadi.",
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
    friendsTitle: "Do‘stlarim",
    friendsSub: "Yulduzcha bosgan odamlaringiz. Ismiga bosing — profili ochiladi.",
    friendsEmpty: "Hali hech kim qo‘shilmagan. Kimningdir profilini ochib, ismi yonidagi ☆ ni bosing.",
    remove: "Ro‘yxatdan olib tashlash",
    back: "Profilga qaytish",
    backPerson: "Profilga qaytish",
    mySubs: "Yechimlarim",
    pastTitle: "Oldingi yuborishlaringiz",
    pastNone: "Bu masalaga hali kod yubormagansiz.",
    pastFailed: "Oldingi yuborishlarni olib bo'lmadi.",
    pastSignIn: "Yuborishlar tarixi hisobingizga bog'langan — kiring.",
    pastShow: "Kodni ko'rish",
    pastHide: "Yopish",
    pastReuse: "Muharrirga qo'yish",
    theirSubs: (who: string) => `${who} — yuborilgan yechimlar`,
    openSubs: "Yechimlarini ko‘rish",
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
    none: "No submissions yet",
    noneHint: "Solve a problem and send it to the judge — everything you submit collects here.",
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
    friendsTitle: "My friends",
    friendsSub: "The people you starred. Click a name to open their profile.",
    friendsEmpty: "Nobody here yet. Open somebody's profile and press the ☆ beside their name.",
    remove: "Remove from the list",
    back: "Back to profile",
    backPerson: "Back to profile",
    mySubs: "My submissions",
    pastTitle: "Your earlier submissions",
    pastNone: "You have not sent any code for this problem yet.",
    pastFailed: "Could not load your earlier submissions.",
    pastSignIn: "Submission history lives on your account — sign in to see it.",
    pastShow: "View code",
    pastHide: "Close",
    pastReuse: "Load into the editor",
    theirSubs: (who: string) => `${who} — submissions`,
    openSubs: "See their submissions",
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
  const date = d.toLocaleDateString(tr(lang,"socialui.uz_uz"), { day: "2-digit", month: "short" });
  const time = d.toLocaleTimeString(tr(lang,"socialui.uz_uz"), { hour: "2-digit", minute: "2-digit" });
  return `${date} ${time}`;
};
const LANG_LABEL: Record<string, string> = { cpp20: "C++20", python3: "Python 3" };

/* Codeforces puts a star beside the handle and fills it in when the person is
   on your list; it is the one control on the page that is understood without a
   label, so it is worth borrowing outright. The label stays for screen readers
   and as a tooltip, which the original does not do. */
export function FriendStar({
  lang, isFriend, signedIn, userId, onChange, solo = false,
}: {
  lang: Lang;
  isFriend: boolean;
  signedIn: boolean;
  userId: string;
  onChange: (next: boolean) => void;
  /* Standing on its own rather than tucked against a name: same star, bigger
     target. The wording stays in the tooltip and the accessible name — spelling
     it out beside the glyph only repeats what the glyph already says. */
  solo?: boolean;
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
      className={`friend-star${solo ? " friend-star-solo" : ""}${isFriend ? " on" : ""}`}
      onClick={toggle}
      disabled={!signedIn || busy}
      aria-pressed={isFriend}
      title={label}
      aria-label={label}
    >
      <span aria-hidden>{isFriend ? "★" : "☆"}</span>
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
      {state === "loading" && <p className="muted os-empty">{t.loading}</p>}
      {state === "error" && <p className="muted os-empty">{t.failed}</p>}
      {state === "missing" && <p className="muted os-empty">{t.missing}</p>}
      {state === "ready" && rows && !rows.length && (
        <div className="os-blank">
          <span className="os-blank-ic" aria-hidden>⌘</span>
          <b>{t.none}</b>
          <p>{t.noneHint}</p>
        </div>
      )}
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
                      {row.readable || isMe ? t.view : <><LockIcon /> {t.locked}</>}
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
        {/* The same highlighter the editor and the lesson blocks use. A
            submission opened here used to be one flat green wall of text —
            the one place on the site where code was not coloured. */}
        {result?.state === "ok" && (
          <CodeBlock
            code={result.source}
            lang={(result.language || row.language) === "python3" ? "python" : "cpp"}
            filename={(result.language || row.language) === "python3" ? "main.py" : "main.cpp"}
          />
        )}
        {result?.state === "locked" && (
          <div className="code-locked">
            <span className="code-locked-ic" aria-hidden><LockIcon /></span>
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

/* The two screens the profile used to carry inline. They were a scroll away at
   the bottom of a page nobody scrolls, which is the same as not being there:
   both are now a button in the profile header and a URL of their own. */

/* One problem's own history, shown under the editor.
 *
 * Every verdict a person gets for a problem is theirs to look back at: what
 * they tried last time is the most useful thing on the page when they come
 * back to a problem they failed. The rows come from the account, so they are
 * still there after a sign-out, and on any other device. The code is their
 * own, which is why it is opened inline here rather than through the paywalled
 * viewer that guards other people's solutions. */
export function ProblemSubmissions({
  lang, problemKey, signedIn, reloadKey, onReuse,
}: {
  lang: Lang;
  problemKey: string;
  signedIn: boolean;
  /** Changes when a new verdict lands, so the list picks it up. */
  reloadKey?: string;
  onReuse?: (source: string, language: "cpp20" | "python3") => void;
}) {
  const t = T[lang];
  const [rows, setRows] = useState<OwnSubmissionRow[] | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error" | "missing">("loading");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!signedIn || !problemKey) return;
    let live = true;
    const pull = () => {
      void fetchMySubmissionsFor(problemKey).then((list) => {
        if (!live) return;
        if (list === "not-migrated") { setState("missing"); return; }
        if (!list) { setState("error"); return; }
        setRows(list);
        setState("ready");
      });
    };
    pull();
    /* A verdict is written to the account just after it is shown, so the reload
       that follows one asks again a moment later rather than racing it. */
    const id = reloadKey ? window.setTimeout(pull, 1500) : 0;
    return () => { live = false; if (id) window.clearTimeout(id); };
  }, [problemKey, signedIn, reloadKey]);

  if (!signedIn) return null;

  return (
    <section className="panel ps-panel">
      <h3 className="ps-title">{t.pastTitle}</h3>
      {state === "loading" && <p className="muted">{t.loading}</p>}
      {state === "error" && <p className="muted">{t.pastFailed}</p>}
      {state === "missing" && <p className="muted">{t.missing}</p>}
      {state === "ready" && rows && !rows.length && <p className="muted">{t.pastNone}</p>}
      {state === "ready" && rows && rows.length > 0 && (
        <ul className="ps-list">
          {rows.map((row) => (
            <li key={row.id} className="ps-item">
              <div className="ps-head">
                <span className={`sub-verdict ${row.verdict === "ACCEPTED" ? "ok" : "bad"}`}>
                  {t.verdicts[row.verdict] || row.verdict}
                  {row.passed !== null && row.total !== null && row.verdict !== "ACCEPTED" && (
                    <small className="mono"> {row.passed}/{row.total}</small>
                  )}
                </span>
                <span className="mono ps-when">{when(row.created_at, lang)}</span>
                <span className="mono ps-lang">{LANG_LABEL[row.language] || row.language}</span>
                <span className="mono ps-time">{row.runtime_ms === null ? "—" : `${row.runtime_ms} ms`}</span>
                <button className="link-btn" onClick={() => setOpenId(openId === row.id ? null : row.id)}>
                  {openId === row.id ? t.pastHide : t.pastShow}
                </button>
              </div>
              {openId === row.id && (
                <div className="ps-code">
                  <CodeBlock
                    code={row.source_code}
                    lang={row.language === "python3" ? "python" : "cpp"}
                    filename={row.language === "python3" ? "main.py" : "main.cpp"}
                  />
                  {onReuse && (
                    <button className="secondary" onClick={() => onReuse(row.source_code, row.language)}>
                      {t.pastReuse}
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function FriendsScreen({
  lang, onBack, onOpenPerson,
}: {
  lang: Lang;
  onBack: () => void;
  onOpenPerson: (handle: string) => void;
}) {
  const t = T[lang];
  const [rows, setRows] = useState<FriendRow[] | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  // Which of these people are here now. Refreshed on the heartbeat's cadence
  // so the dot means "now" rather than "at some point since you opened this".
  const [online, setOnline] = useState<Set<string>>(new Set());
  const ids = (rows || []).map((r) => r.id).join(",");
  useEffect(() => {
    if (!ids) return;
    let live = true;
    const pull = () => { void onlineAmong(ids.split(",")).then((set) => { if (live) setOnline(set); }); };
    pull();
    const id = window.setInterval(pull, 30000);
    return () => { live = false; window.clearInterval(id); };
  }, [ids]);

  useEffect(() => {
    let live = true;
    fetchFriends().then((list) => {
      if (!live) return;
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
  }, []);

  const drop = async (id: string) => {
    setRows((prev) => (prev ? prev.filter((r) => r.id !== id) : prev));
    await removeFriend(id);
  };

  return (
    <>
      <button className="crumb crumb-btn" onClick={onBack}>
        ← {t.back}
      </button>
      <div className="page-head">
        <div>
          <p className="eyebrow">★</p>
          <h1 className="page-title">{t.friendsTitle}</h1>
          <p className="muted">{t.friendsSub}</p>
        </div>
        {rows && rows.length > 0 && <span className="tag">{rows.length}</span>}
      </div>
      {state === "loading" && (
        <div className="screen-state" role="status">
          <span className="spinner" aria-hidden />
          <p className="muted">{t.loading}</p>
        </div>
      )}
      {state === "error" && (
        <div className="panel">
          <div className="notice notice-error">{t.failed}</div>
        </div>
      )}
      {state === "ready" && rows && !rows.length && (
        <div className="screen-state panel">
          <p className="muted">{t.friendsEmpty}</p>
        </div>
      )}
      {state === "ready" && rows && rows.length > 0 && (
        <ul className="friend-list">
          {rows.map((f) => (
            <li key={f.id}>
              <button type="button" className="friend-open" onClick={() => onOpenPerson(f.username)}>
                <span className="friend-face" aria-hidden>
                  {f.avatar_url ? <img src={f.avatar_url} alt="" /> : (f.display_name || f.username).slice(0, 1).toUpperCase()}
                </span>
                <span className="friend-who">
                  <b>
                    {f.display_name?.trim() || f.username}
                    <OnlineDot online={online.has(f.id)} lang={lang} label={f.display_name?.trim() || f.username} />
                  </b>
                  <small className="muted">@{f.username}</small>
                </span>
                <span className="tag">{f.solved_count} AC</span>
                <span className="rating">{f.duel_rating}</span>
              </button>
              <button type="button" className="friend-drop" onClick={() => drop(f.id)} title={t.remove} aria-label={t.remove}>
                ★
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function SubmissionsScreen({
  lang, userId, who, isMe, signedIn, onBack,
}: {
  lang: Lang;
  userId: string;
  who: string;
  isMe: boolean;
  signedIn: boolean;
  onBack: () => void;
}) {
  const t = T[lang];
  return (
    <>
      <button className="crumb crumb-btn" onClick={onBack}>
        ← {isMe ? t.back : t.backPerson}
      </button>
      <div className="page-head">
        <div>
          <p className="eyebrow">{t.submissions}</p>
          <h1 className="page-title">{isMe ? t.mySubs : t.theirSubs(who)}</h1>
        </div>
      </div>
      <SubmissionHistory lang={lang} userId={userId} isMe={isMe} signedIn={signedIn} />
    </>
  );
}

/* /u/<handle>/submissions is a link somebody can be sent, so it has to work
   without having been to the profile first: the handle is resolved here rather
   than being handed down from a screen that may never have rendered. */
export function PersonSubmissions({
  lang, handle, meId, signedIn, onBack,
}: {
  lang: Lang;
  handle: string;
  meId: string | null;
  signedIn: boolean;
  onBack: () => void;
}) {
  const t = T[lang];
  const [person, setPerson] = useState<{ id: string; name: string } | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let live = true;
    fetchPersonByUsername(handle).then((result) => {
      if (!live) return;
      if (!result.ok) {
        setState("missing");
        return;
      }
      setPerson({ id: result.person.id, name: result.person.display_name || result.person.username });
      setState("ready");
    });
    return () => {
      live = false;
    };
  }, [handle]);

  if (state === "loading")
    return (
      <div className="screen-state" role="status">
        <span className="spinner" aria-hidden />
        <p className="muted">{t.loading}</p>
      </div>
    );
  if (state === "missing" || !person)
    return (
      <div className="panel">
        <div className="notice notice-error">{t.failed}</div>
      </div>
    );
  return (
    <SubmissionsScreen
      lang={lang}
      userId={person.id}
      who={person.name}
      isMe={!!meId && meId === person.id}
      signedIn={signedIn}
      onBack={onBack}
    />
  );
}
