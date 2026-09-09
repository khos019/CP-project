"use client";

import { useEffect, useRef, useState } from "react";
import { DuelTable } from "./DuelHistory";
import { OnlineDot, onlineAmong } from "./presence";
import { RatingGraph } from "./RatingGraph";
import { fetchPersonByUsername, type PublicPerson, type Role } from "./session";
import {
  fetchFriendIds, fetchPublicDuelHistory, fetchPublicFriends,
  type FriendRow, type PublicDuelRow,
} from "./social";
import { AvatarZoom, FriendStar, SubmissionHistory } from "./social-ui";

type Lang = "uz" | "en";

/* Somebody else's account, reachable at /u/<handle>.
 *
 * The point of the page is the click that leads to it: a name in a
 * conversation, or a row in the owner's users panel. Both are moments where
 * "who is this?" is the next question, and until now there was nowhere to ask
 * it.
 *
 * It shows only what a profile is already public about — handle, name, avatar,
 * bio, location, rating, solves, join date. Not the email, and not whether the
 * account is suspended: that is between the account and the owner, and the
 * owner has a page that says so.
 *
 * Below the header the page is three tabs — solutions, duels, friends — over a
 * rating graph, because "who is this?" is really three questions: what do they
 * solve, how do they play, and who do they play with. Until 033 only the first
 * was answerable, and only by leaving the page for a separate screen.
 *
 * The friends tab shows whom this account follows, never who follows it: 015
 * made the follower direction private so the star could not become a
 * popularity number, and that has not changed.
 */
const T = {
  uz: {
    back: "Ortga",
    loading: "Yuklanmoqda…",
    notFound: "Bunday foydalanuvchi topilmadi",
    notFoundBody: "Nickname o‘zgargan yoki hisob o‘chirilgan bo‘lishi mumkin.",
    networkErr: "Ma’lumotni olib bo‘lmadi. Internetni tekshirib, qayta urining.",
    eyebrow: "Foydalanuvchi",
    message: "Xabar yozish",
    joined: "Qo‘shildi",
    rating: "Duel reytingi",
    solved: "Yechilgan masalalar",
    submissions: "Yuborilgan yechimlarini ko‘rish",
    tabSolutions: "Yechimlari",
    tabDuels: "Duel tarixi",
    tabFriends: "Do‘stlari",
    duelsLoading: "Duellar yuklanmoqda…",
    duelsFailed: "Duellar tarixini olib bo‘lmadi.",
    duelsMissing: "Duellar tarixi serverda hali yoqilmagan (033-migratsiya).",
    duelsNone: "Bu hisob hali duel o‘ynamagan.",
    friendsLoading: "Do‘stlar yuklanmoqda…",
    friendsFailed: "Do‘stlar ro‘yxatini olib bo‘lmadi.",
    friendsMissing: "Do‘stlar ro‘yxati serverda hali yoqilmagan (033-migratsiya).",
    friendsNone: "Bu hisob hali hech kimni do‘st sifatida belgilamagan.",
    friendsNote: "Bu hisob kimni kuzatadi. Uni kim kuzatayotgani ko‘rsatilmaydi.",
    openFull: "Alohida sahifada ochish",
    self: "Bu sizning hisobingiz",
    myProfile: "Profilimni ochish",
    signInToWrite: "Xabar yozish uchun hisobingizga kiring.",
    signIn: "Kirish",
    roles: { user: "", admin: "ADMIN", owner: "EGA" } as Record<Role, string>,
  },
  en: {
    back: "Back",
    loading: "Loading…",
    notFound: "No such user",
    notFoundBody: "The username may have changed, or the account was removed.",
    networkErr: "Could not load the data. Check your connection and try again.",
    eyebrow: "Member",
    message: "Send a message",
    joined: "Joined",
    rating: "Duel rating",
    solved: "Problems solved",
    submissions: "See their submissions",
    tabSolutions: "Solutions",
    tabDuels: "Duel history",
    tabFriends: "Friends",
    duelsLoading: "Loading duels…",
    duelsFailed: "Could not load the duel history.",
    duelsMissing: "Duel history is not enabled on the server yet (migration 033).",
    duelsNone: "This account has not played a duel yet.",
    friendsLoading: "Loading friends…",
    friendsFailed: "Could not load the friend list.",
    friendsMissing: "The friend list is not enabled on the server yet (migration 033).",
    friendsNone: "This account has not starred anybody yet.",
    friendsNote: "Who this account follows. Who follows it is not shown.",
    openFull: "Open as its own page",
    self: "This is your account",
    myProfile: "Open my profile",
    signInToWrite: "Sign in to send a message.",
    signIn: "Sign in",
    roles: { user: "", admin: "ADMIN", owner: "OWNER" } as Record<Role, string>,
  },
};

const MONTHS = {
  uz: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
const joinedOn = (iso: string, lang: Lang) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const month = MONTHS[lang][d.getUTCMonth()];
  return lang === "uz" ? `${d.getUTCFullYear()}-yil ${month}` : `${month} ${d.getUTCFullYear()}`;
};

const initialsOf = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0] || "").join("").toUpperCase() || "AY";

export function PublicProfile({
  lang,
  username,
  meId,
  signedIn,
  onBack,
  onMessage,
  onMyProfile,
  onSignIn,
  onOpenSubmissions,
  onOpenPerson,
}: {
  lang: Lang;
  username: string;
  meId: string | null;
  signedIn: boolean;
  onBack: () => void;
  onMessage: (userId: string) => void;
  onMyProfile: () => void;
  onSignIn: () => void;
  onOpenSubmissions: (handle: string) => void;
  /** Following a name out of the duel table or the friend list. */
  onOpenPerson: (handle: string) => void;
}) {
  const t = T[lang];
  const [person, setPerson] = useState<PublicPerson | null>(null);
  // One person, so one id — the same call the lists use, asked for a set of one.
  const [online, setOnline] = useState(false);

  const [state, setState] = useState<"loading" | "ready" | "not-found" | "error">("loading");
  const [isFriend, setIsFriend] = useState(false);

  /* The three tabs. The duels are fetched with the profile rather than on the
     click, because the rating graph above the tabs is drawn from the same rows
     — one request answers both, and the graph is not behind a tab. The friends
     wait for their tab: nothing above the fold needs them. */
  const [tab, setTab] = useState<"solutions" | "duels" | "friends">("solutions");
  const [duels, setDuels] = useState<PublicDuelRow[] | null>(null);
  const [duelState, setDuelState] = useState<"loading" | "ready" | "error" | "missing">("loading");
  const [friends, setFriends] = useState<FriendRow[] | null>(null);
  const [friendState, setFriendState] = useState<"idle" | "loading" | "ready" | "error" | "missing">("idle");

  /* No reset of state here: the parent keys this screen by the handle, so a
     different handle is a different component and starts at "loading" on its
     own. Clearing it by hand would be a second render for the same effect. */
  useEffect(() => {
    let live = true;
    fetchPersonByUsername(username).then((result) => {
      if (!live) return;
      if (result.ok) {
        setPerson(result.person);
        setState("ready");
      } else {
        setState(result.error === "not-found" ? "not-found" : "error");
      }
    });
    return () => {
      live = false;
    };
  }, [username]);

  /* Whether the star is lit is about the viewer, not about this page, so it is
     read separately — the profile renders without waiting for it. */
  useEffect(() => {
    const id = person?.id;
    if (!id || !signedIn) return;
    let live = true;
    const pull = () => { void onlineAmong([id]).then((set) => { if (live) setOnline(set.has(id)); }); };
    pull();
    const timer = window.setInterval(pull, 30000);
    return () => { live = false; window.clearInterval(timer); };
  }, [person?.id, signedIn]);

  const personId = person?.id;

  useEffect(() => {
    if (!personId) return;
    let live = true;
    // No setDuelState("loading") here: that is the initial state, and this
    // screen is keyed by the handle, so a different person is a new component.
    fetchPublicDuelHistory(personId).then((result) => {
      if (!live) return;
      if (result === "not-migrated") { setDuelState("missing"); return; }
      if (!result) { setDuelState("error"); return; }
      setDuels(result);
      setDuelState("ready");
    });
    return () => { live = false; };
  }, [personId]);

  /* Whether the friend list has been asked for. A ref rather than the state
     itself, so opening the tab does not have to write "loading" on the way in
     -- the render treats "idle" and "loading" alike, and the state only moves
     when the answer arrives. */
  const friendsAsked = useRef(false);
  useEffect(() => {
    if (!personId || tab !== "friends" || friendsAsked.current) return;
    friendsAsked.current = true;
    let live = true;
    fetchPublicFriends(personId).then((result) => {
      if (!live) return;
      if (result === "not-migrated") { setFriendState("missing"); return; }
      if (!result) { setFriendState("error"); return; }
      setFriends(result);
      setFriendState("ready");
    });
    return () => { live = false; };
  }, [personId, tab]);

  useEffect(() => {
    if (!signedIn) return;
    let live = true;
    fetchFriendIds().then((ids) => {
      if (live && ids && person) setIsFriend(ids.has(person.id));
    });
    return () => {
      live = false;
    };
  }, [signedIn, person]);

  const isMe = !!person && !!meId && person.id === meId;
  const name = person ? person.display_name || person.username : username;

  return (
    <>
      <button className="crumb crumb-btn" onClick={onBack}>
        ← {t.back}
      </button>

      {state === "loading" && (
        <div className="screen-state" role="status">
          <span className="spinner" aria-hidden />
          <p className="muted">{t.loading}</p>
        </div>
      )}

      {state === "not-found" && (
        <div className="screen-state panel">
          <span className="screen-state-ic" aria-hidden>
            🔎
          </span>
          <h1 className="page-title">{t.notFound}</h1>
          <p className="muted">{t.notFoundBody}</p>
        </div>
      )}

      {state === "error" && (
        <div className="panel">
          <div className="notice notice-error">{t.networkErr}</div>
        </div>
      )}

      {state === "ready" && person && (
        <>
          <section className="panel pp-card">
            <AvatarZoom lang={lang} src={person.avatar_url} name={name}>
              <span className="pp-avatar" aria-hidden>
                {person.avatar_url ? <img src={person.avatar_url} alt="" /> : initialsOf(name)}
              </span>
            </AvatarZoom>
            <div className="pp-identity">
              <p className="eyebrow">{t.eyebrow}</p>
              {/* The star used to sit here, inside the heading and ahead of the
                  name — which pushed the name out of line with the eyebrow
                  above it and left a bare glyph for the reader to interpret.
                  It is an action on this person, so it lives with the other
                  actions now. */}
              <h1>
                {name}
                <OnlineDot online={online} lang={lang} label={name} />
                {t.roles[person.role] && <i className="pp-role">{t.roles[person.role]}</i>}
              </h1>
              <p className="pp-handle mono">@{person.username}</p>
              {person.bio && <p className="pp-bio">{person.bio}</p>}
              <p className="muted pp-meta">
                {person.country && (
                  <>
                    <span>{person.country}</span>
                    <span className="pp-dot" aria-hidden>
                      ·
                    </span>
                  </>
                )}
                <span>
                  {t.joined} {joinedOn(person.created_at, lang)}
                </span>
              </p>
            </div>
            <div className="pp-actions">
              {isMe ? (
                <>
                  <p className="muted pp-self">{t.self}</p>
                  <button className="secondary" onClick={onMyProfile}>
                    {t.myProfile}
                  </button>
                </>
              ) : signedIn ? (
                <>
                  <button className="primary" onClick={() => onMessage(person.id)}>
                    {t.message}
                  </button>
                  <FriendStar
                    lang={lang} isFriend={isFriend} signedIn={signedIn}
                    userId={person.id} onChange={setIsFriend} solo
                  />
                </>
              ) : (
                <>
                  <p className="muted pp-self">{t.signInToWrite}</p>
                  <button className="secondary" onClick={onSignIn}>
                    {t.signIn}
                  </button>
                </>
              )}
            </div>
          </section>

          <div className="pp-stats">
            <div className="os-tile accent">
              <b className="mono">{person.duel_rating}</b>
              <small>{t.rating}</small>
            </div>
            <div className="os-tile">
              <b className="mono">{person.solved_count}</b>
              <small>{t.solved}</small>
            </div>
          </div>

          {/* Drawn from the duel rows, so it appears with them and says
              nothing while they are still on the way. */}
          {duelState === "ready" && duels && <RatingGraph lang={lang} rows={duels} />}

          <div className="pp-tabs" role="tablist" aria-label={t.eyebrow}>
            <button role="tab" aria-selected={tab === "solutions"}
                    className={tab === "solutions" ? "on" : ""}
                    onClick={() => setTab("solutions")}>
              {t.tabSolutions}
            </button>
            <button role="tab" aria-selected={tab === "duels"}
                    className={tab === "duels" ? "on" : ""}
                    onClick={() => setTab("duels")}>
              {t.tabDuels}
              {duels && duels.length > 0 && <i className="pp-count">{duels.length}</i>}
            </button>
            <button role="tab" aria-selected={tab === "friends"}
                    className={tab === "friends" ? "on" : ""}
                    onClick={() => setTab("friends")}>
              {t.tabFriends}
              {friends && friends.length > 0 && <i className="pp-count">{friends.length}</i>}
            </button>
          </div>

          {tab === "solutions" && (
            <>
              <SubmissionHistory
                lang={lang} userId={person.id}
                isMe={isMe} signedIn={signedIn}
              />
              <button className="link-btn pp-subs" onClick={() => onOpenSubmissions(person.username)}>
                {t.openFull} →
              </button>
            </>
          )}

          {tab === "duels" && (
            <section className="panel">
              {duelState === "loading" && <p className="muted os-empty">{t.duelsLoading}</p>}
              {duelState === "error" && <p className="muted os-empty">{t.duelsFailed}</p>}
              {duelState === "missing" && <p className="muted os-empty">{t.duelsMissing}</p>}
              {duelState === "ready" && duels && !duels.length && (
                <p className="muted os-empty">{t.duelsNone}</p>
              )}
              {duelState === "ready" && duels && duels.length > 0 && (
                <DuelTable lang={lang} rows={duels} onOpenPerson={onOpenPerson} />
              )}
            </section>
          )}

          {tab === "friends" && (
            <section className="panel">
              {(friendState === "idle" || friendState === "loading") && (
                <p className="muted os-empty">{t.friendsLoading}</p>
              )}
              {friendState === "error" && <p className="muted os-empty">{t.friendsFailed}</p>}
              {friendState === "missing" && <p className="muted os-empty">{t.friendsMissing}</p>}
              {friendState === "ready" && friends && !friends.length && (
                <p className="muted os-empty">{t.friendsNone}</p>
              )}
              {friendState === "ready" && friends && friends.length > 0 && (
                <>
                  <ul className="friend-list">
                    {friends.map((f) => (
                      <li key={f.id}>
                        <button type="button" className="friend-open" onClick={() => onOpenPerson(f.username)}>
                          <span className="friend-face" aria-hidden>
                            {f.avatar_url
                              ? <img src={f.avatar_url} alt="" />
                              : (f.display_name || f.username).slice(0, 1).toUpperCase()}
                          </span>
                          <span className="friend-who">
                            <b>{f.display_name?.trim() || f.username}</b>
                            <small className="muted">@{f.username}</small>
                          </span>
                          <span className="tag">{f.solved_count} AC</span>
                          <span className="rating">{f.duel_rating}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="muted os-empty">{t.friendsNote}</p>
                </>
              )}
            </section>
          )}
        </>
      )}
    </>
  );
}
