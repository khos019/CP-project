"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchConversation,
  fetchThreads,
  markThreadRead,
  searchPeople,
  sendMessage,
  setBlocked,
  type ApiError,
  type Message,
  type MessageThread,
  type Person,
  type Profile,
  type Role,
} from "./session";

type Lang = "uz" | "en";

/* Messages between any two accounts, plus site messages from the owner.
 *
 * "Sent as AlgoYo'l" is a claim about who is speaking, so the client does not
 * get to make it: the flag is submitted, and the database (migration 011)
 * overwrites it with false for anyone who is not an owner. What the checkbox
 * below controls is the request, never the outcome.
 *
 * Likewise blocking, suspension and the rate limit are enforced in the same
 * trigger. This screen reports what came back rather than deciding it, which
 * is why a refusal here shows the reason instead of failing quietly.
 */
const T = {
  uz: {
    title: "Xabarlar",
    eyebrow: "Suhbatlar",
    lede: "Har qanday o‘quvchiga yozing. Ega yozganda xabar sayt nomidan boradi.",
    empty: "Hali xabar yo‘q. Pastdagi qidiruv orqali birinchi suhbatni boshlang.",
    newChat: "Yangi suhbat",
    findPerson: "Kimga yozmoqchisiz?",
    searchHint: "Nickname yoki ism bo‘yicha qidiring (kamida 2 belgi).",
    nobody: "Hech kim topilmadi.",
    placeholder: "Xabar yozing…",
    send: "Yuborish",
    sending: "Yuborilmoqda…",
    asSite: "Sayt nomidan yuborish (AlgoYo‘l)",
    asSiteHint: "Bu xabar yonida sizning ismingiz emas, AlgoYo‘l nishoni turadi.",
    site: "AlgoYo‘l",
    official: "RASMIY",
    openProfile: "Akkountni ochish",
    block: "Bloklash",
    unblock: "Blokdan chiqarish",
    blocked: "Siz bu odamni blokladingiz — uning xabarlari sizga yetib kelmaydi.",
    confirmBlock: "Bloklansinmi? Bundan keyin bu odam sizga yoza olmaydi.",
    loading: "Yuklanmoqda…",
    notMigrated:
      "Xabar almashish hali qo‘shilmagan. 011_messaging.sql migratsiyasini SQL Editor’da ishga tushiring.",
    errSuspended: "Hisobingiz bloklangan — xabar yubora olmaysiz.",
    errBlocked: "Bu odam sizni bloklagan, xabar yetib bormadi.",
    errRate: "Juda tez yozyapsiz. Bir daqiqa kutib turing.",
    errNet: "Xabar yuborilmadi. Qaytadan urining.",
    signIn: "Xabar almashish uchun hisobingizga kiring.",
    unread: "o‘qilmagan",
    today: "bugun",
    yesterday: "kecha",
    roles: { user: "", admin: "ADMIN", owner: "EGA" } as Record<Role, string>,
  },
  en: {
    title: "Messages",
    eyebrow: "Conversations",
    lede: "Write to any learner. When the owner writes, the message comes from the site.",
    empty: "No messages yet. Use the search below to start the first conversation.",
    newChat: "New conversation",
    findPerson: "Who do you want to write to?",
    searchHint: "Search by username or name (at least 2 characters).",
    nobody: "Nobody matched.",
    placeholder: "Write a message…",
    send: "Send",
    sending: "Sending…",
    asSite: "Send as the site (AlgoYo‘l)",
    asSiteHint: "This message carries the AlgoYo‘l mark instead of your name.",
    site: "AlgoYo‘l",
    official: "OFFICIAL",
    openProfile: "Open account",
    block: "Block",
    unblock: "Unblock",
    blocked: "You blocked this person — their messages do not reach you.",
    confirmBlock: "Block them? They will not be able to write to you.",
    loading: "Loading…",
    notMigrated: "Messaging is not installed yet. Run 011_messaging.sql in the SQL Editor.",
    errSuspended: "Your account is suspended — you cannot send messages.",
    errBlocked: "This person has blocked you; the message was not delivered.",
    errRate: "You are writing too fast. Wait a minute.",
    errNet: "The message did not send. Try again.",
    signIn: "Sign in to use messages.",
    unread: "unread",
    today: "today",
    yesterday: "yesterday",
    roles: { user: "", admin: "ADMIN", owner: "OWNER" } as Record<Role, string>,
  },
};

const clock = (iso: string, lang: Lang, t: (typeof T)["uz"]) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  if (sameDay) return time;
  const yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return `${t.yesterday} ${time}`;
  const months = lang === "uz"
    ? ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"]
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${time}`;
};

const sendError = (e: ApiError, t: (typeof T)["uz"]) =>
  e === "suspended" ? t.errSuspended
  : e === "blocked" ? t.errBlocked
  : e === "rate-limited" ? t.errRate
  : e === "not-migrated" ? t.notMigrated
  : t.errNet;

export function Messages({
  lang,
  me,
  openWith,
  onOpened,
  onUnreadChange,
  onOpenProfile,
}: {
  lang: Lang;
  me: Profile;
  /* A user id handed over from another screen ("write to this person"),
     consumed once so returning to the inbox later does not reopen it. */
  openWith?: string | null;
  onOpened?: () => void;
  onUnreadChange?: () => void;
  /* "Who am I talking to?" is the question a conversation raises, and until
     now it had no answer: the name at the top of the thread opens the
     account. */
  onOpenProfile: (username: string) => void;
}) {
  const t = T[lang];
  const [threads, setThreads] = useState<MessageThread[] | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Message[] | null>(null);
  const [draft, setDraft] = useState("");
  const [asSite, setAsSite] = useState(me.role === "owner");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [fatal, setFatal] = useState<ApiError | null>(null);
  const [finder, setFinder] = useState("");
  const [people, setPeople] = useState<Person[] | null>(null);
  const [composing, setComposing] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const loadThreads = useCallback(async () => {
    const result = await fetchThreads();
    if (result.ok) {
      setThreads(result.data || []);
      setFatal(null);
    } else if (result.error === "not-migrated") {
      setFatal("not-migrated");
      setThreads([]);
    } else {
      setThreads([]);
    }
  }, []);

  useEffect(() => {
    void loadThreads();
  }, [loadThreads]);

  const openThread = useCallback(
    async (otherId: string) => {
      setActive(otherId);
      setComposing(false);
      setConversation(null);
      const rows = await fetchConversation(otherId, me.id);
      setConversation(rows || []);
      if (rows && rows.some((m) => m.recipient_id === me.id && !m.read_at)) {
        await markThreadRead(otherId);
        setThreads((list) => (list || []).map((x) => (x.user_id === otherId ? { ...x, unread: 0 } : x)));
        onUnreadChange?.();
      }
    },
    [me.id, onUnreadChange],
  );

  // Arriving from "write to this person" on another screen.
  useEffect(() => {
    if (!openWith) return;
    void openThread(openWith);
    onOpened?.();
  }, [openWith, openThread, onOpened]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [conversation]);

  useEffect(() => {
    const id = setTimeout(async () => {
      if (finder.trim().length < 2) {
        setPeople(null);
        return;
      }
      const found = await searchPeople(finder);
      setPeople((found || []).filter((p) => p.id !== me.id));
    }, 320);
    return () => clearTimeout(id);
  }, [finder, me.id]);

  const activeThread = threads?.find((x) => x.user_id === active) || null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !active || busy) return;
    setBusy(true);
    setNote(null);
    const result = await sendMessage(active, body, asSite && me.role === "owner");
    setBusy(false);
    if (!result.ok) {
      setNote(sendError(result.error, t));
      return;
    }
    setDraft("");
    setConversation((list) => [...(list || []), result.data]);
    void loadThreads();
  };

  const toggleBlock = async () => {
    if (!activeThread) return;
    const next = !activeThread.blocked;
    if (next && !confirm(t.confirmBlock)) return;
    const ok = await setBlocked(activeThread.user_id, next);
    if (ok) {
      setThreads((list) => (list || []).map((x) => (x.user_id === activeThread.user_id ? { ...x, blocked: next } : x)));
    }
  };

  const startWith = (person: Person) => {
    // The thread may not exist yet; the list picks it up after the first send.
    setThreads((list) => {
      const current = list || [];
      if (current.some((x) => x.user_id === person.id)) return current;
      return [
        {
          user_id: person.id,
          username: person.username,
          display_name: person.display_name,
          avatar_url: person.avatar_url,
          role: person.role,
          last_body: "",
          last_at: new Date().toISOString(),
          last_as_site: false,
          last_mine: true,
          unread: 0,
          blocked: false,
        },
        ...current,
      ];
    });
    void openThread(person.id);
    setFinder("");
    setPeople(null);
  };

  if (fatal === "not-migrated") {
    return (
      <>
        <div className="page-head">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="page-title">{t.title}</h1>
          </div>
        </div>
        <div className="panel">
          <div className="notice notice-info">{t.notMigrated}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="page-title">{t.title}</h1>
          <p className="muted ua-lede">{t.lede}</p>
        </div>
        <button className="secondary" onClick={() => { setComposing(true); setActive(null); }}>
          {t.newChat}
        </button>
      </div>

      <div className="msg-layout">
        <aside className="panel msg-list">
          {threads === null ? (
            <p className="muted">{t.loading}</p>
          ) : threads.length === 0 ? (
            <p className="muted">{t.empty}</p>
          ) : (
            threads.map((th) => (
              <button
                key={th.user_id}
                className={th.user_id === active ? "msg-thread active" : "msg-thread"}
                onClick={() => void openThread(th.user_id)}
              >
                <span className="ua-avatar" aria-hidden>
                  {th.avatar_url ? <img src={th.avatar_url} alt="" /> : (th.display_name || th.username)[0]?.toUpperCase()}
                </span>
                <span className="msg-thread-copy">
                  <b>
                    {th.display_name || th.username}
                    {t.roles[th.role] && <i className="msg-rolemark">{t.roles[th.role]}</i>}
                  </b>
                  <small className="muted">
                    {th.last_mine ? "→ " : ""}
                    {th.last_body.slice(0, 48) || "…"}
                  </small>
                </span>
                {th.unread > 0 && <span className="msg-badge">{th.unread}</span>}
              </button>
            ))
          )}
        </aside>

        <section className="panel msg-pane">
          {composing || (!active && threads && threads.length === 0) ? (
            <div className="msg-finder">
              <label className="field">
                <span>{t.findPerson}</span>
                <input
                  value={finder}
                  onChange={(e) => setFinder(e.target.value)}
                  placeholder={t.searchHint}
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
              {people && people.length === 0 && <p className="muted">{t.nobody}</p>}
              {people && people.length > 0 && (
                <div className="msg-people">
                  {people.map((p) => (
                    <button key={p.id} className="msg-person" onClick={() => startWith(p)}>
                      <span className="ua-avatar" aria-hidden>
                        {p.avatar_url ? <img src={p.avatar_url} alt="" /> : (p.display_name || p.username)[0]?.toUpperCase()}
                      </span>
                      <span>
                        <b>{p.display_name || p.username}</b>
                        <small className="mono muted">@{p.username}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : !active ? (
            <p className="muted">{t.empty}</p>
          ) : (
            <>
              <header className="msg-head">
                {activeThread ? (
                  <button className="msg-who" onClick={() => onOpenProfile(activeThread.username)} title={t.openProfile}>
                    <span className="ua-avatar" aria-hidden>
                      {activeThread.avatar_url ? (
                        <img src={activeThread.avatar_url} alt="" />
                      ) : (
                        (activeThread.display_name || activeThread.username)[0]?.toUpperCase()
                      )}
                    </span>
                    <span className="msg-who-copy">
                      <b>
                        {activeThread.display_name || activeThread.username}
                        {t.roles[activeThread.role] && <i className="msg-rolemark">{t.roles[activeThread.role]}</i>}
                      </b>
                      <small className="mono muted">@{activeThread.username}</small>
                    </span>
                  </button>
                ) : (
                  <div>
                    <b>…</b>
                  </div>
                )}
                {activeThread && (
                  <button className={activeThread.blocked ? "secondary" : "pill danger"} onClick={() => void toggleBlock()}>
                    {activeThread.blocked ? t.unblock : t.block}
                  </button>
                )}
              </header>

              {activeThread?.blocked && <div className="notice notice-error">{t.blocked}</div>}

              <div className="msg-scroll">
                {conversation === null ? (
                  <p className="muted">{t.loading}</p>
                ) : (
                  conversation.map((m) => {
                    const mine = m.sender_id === me.id;
                    return (
                      <div key={m.id} className={mine ? "msg-bubble mine" : "msg-bubble"}>
                        {m.as_site && (
                          <span className="msg-site">
                            <i>◆</i> {t.site} · {t.official}
                          </span>
                        )}
                        <p>{m.body}</p>
                        <small className="muted">{clock(m.created_at, lang, t)}</small>
                      </div>
                    );
                  })
                )}
                <div ref={endRef} />
              </div>

              {note && <div className="notice notice-error">{note}</div>}

              <form className="msg-compose" onSubmit={submit}>
                {me.role === "owner" && (
                  <label className="msg-assite">
                    <input type="checkbox" checked={asSite} onChange={(e) => setAsSite(e.target.checked)} />
                    <span>
                      {t.asSite}
                      <small className="muted">{t.asSiteHint}</small>
                    </span>
                  </label>
                )}
                <div className="msg-input">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={t.placeholder}
                    maxLength={4000}
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void submit(e as unknown as React.FormEvent);
                      }
                    }}
                  />
                  <button className="primary" type="submit" disabled={busy || !draft.trim()}>
                    {busy ? t.sending : t.send} →
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </>
  );
}
