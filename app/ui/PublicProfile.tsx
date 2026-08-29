"use client";

import { useEffect, useState } from "react";
import { fetchPersonByUsername, type PublicPerson, type Role } from "./session";
import { fetchFriendIds } from "./social";
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
}: {
  lang: Lang;
  username: string;
  meId: string | null;
  signedIn: boolean;
  onBack: () => void;
  onMessage: (userId: string) => void;
  onMyProfile: () => void;
  onSignIn: () => void;
}) {
  const t = T[lang];
  const [person, setPerson] = useState<PublicPerson | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "not-found" | "error">("loading");
  const [isFriend, setIsFriend] = useState(false);

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
              <h1>
                {!isMe && (
                  <FriendStar
                    lang={lang}
                    isFriend={isFriend}
                    signedIn={signedIn}
                    userId={person.id}
                    onChange={setIsFriend}
                  />
                )}
                {name}
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
                <button className="primary" onClick={() => onMessage(person.id)}>
                  {t.message} →
                </button>
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

          <SubmissionHistory lang={lang} userId={person.id} isMe={isMe} signedIn={signedIn} />
        </>
      )}
    </>
  );
}
