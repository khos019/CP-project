"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DuelTable } from "./DuelHistory";
import { OnlineDot, onlineAmong } from "./presence";
import { bankProblems } from "./problem-bank";
import { RatingGraph } from "./RatingGraph";
import { nextRank, rankOf } from "./rating";
import { shortDateTime } from "./dates";
import { fetchPersonByUsername, type PublicPerson, type Role } from "./session";
import {
  fetchFriendIds, fetchProfileSummary, fetchPublicDuelHistory, fetchPublicFriends, fetchSubmissions,
  removeFriend,
  type FriendRow, type ProfileSummary, type PublicDuelRow, type SubmissionRow,
} from "./social";
import { AvatarZoom, FriendStar, SubmissionHistory, verdictLabel } from "./social-ui";

type Lang = "uz" | "en";

/* An account's profile -- anybody's, your own included.
 *
 * Laid out after the profile pages competitive programmers already read:
 * Codeforces' rank title over the name and its sub-pages for submissions and
 * contests, AtCoder's "+171 to promote", kep.uz's identity card with the
 * figures beside it, robocontest's stat tiles. What they share, and what this
 * copies, is the order of the questions a visitor asks: who is this and how
 * strong (the header), how are they doing over time (the curve), and then the
 * detail, one click away on a page of its own.
 *
 * The four sections are four addresses -- /u/<handle>, /u/<handle>/submissions,
 * /u/<handle>/duels, /u/<handle>/friends -- rather than tabs inside one page,
 * the way Codeforces does it: each can be linked, opened in a new tab and
 * returned to with the back button. The component stays mounted across them
 * (the app keys it by handle), so moving between sections does not refetch the
 * header.
 *
 * Your own profile is this same view with three slots filled in by ProfilePage:
 * the actions (edit, messages, the staff menu), the editor under the header,
 * and the learning panels only you can see. One design, not two that drift.
 *
 * What it shows is what a profile is already public about. The friends section
 * lists whom the account follows, never who follows it: 015 made the follower
 * direction private so the star could not become a popularity number.
 */

export type ProfileSection = "overview" | "submissions" | "duels" | "friends";

const T = {
  uz: {
    back: "Ortga",
    loading: "Yuklanmoqda…",
    notFound: "Bunday foydalanuvchi topilmadi",
    notFoundBody: "Nickname o‘zgargan yoki hisob o‘chirilgan bo‘lishi mumkin.",
    networkErr: "Ma’lumotni olib bo‘lmadi. Internetni tekshirib, qayta urining.",
    message: "Xabar yozish",
    joined: "qo‘shildi",
    self: "Profilni tahrirlash",
    signIn: "Kirish",
    signInToWrite: "Xabar yozish uchun kiring",
    roles: { user: "", admin: "ADMIN", owner: "EGA" } as Record<Role, string>,
    nav: { overview: "Umumiy", submissions: "Yechimlari", duels: "Duel tarixi", friends: "Do‘stlari" },
    rating: "Duel reytingi",
    max: "eng yuqori",
    toNext: (gap: number) => `${gap} ball qoldi`,
    top: "Eng yuqori daraja",
    place: "Reytingdagi o‘rin",
    ofMembers: (n: number) => `${n} a’zo ichida`,
    solved: "Yechilgan masalalar",
    subsLine: (subs: number, rate: number) => `${subs} ta yuborish · ${rate}% qabul`,
    duels: "Duellar",
    friends: "Do‘stlari",
    follows: "kuzatadi",
    wl: { win: "G", loss: "M", draw: "D" },
    problems: "Masalalar",
    ofBank: (n: number) => `bankdagi ${n} tadan`,
    diff: { easy: "Oson", medium: "O‘rta", hard: "Qiyin", insane: "Juda qiyin" },
    hardest: "Eng qiyin yechilgani",
    noSolved: "Hali birorta masala yechilmagan.",
    summaryMissing: "Bu statistika serverda hali yoqilmagan (034-migratsiya).",
    recentDuels: "So‘nggi duellar",
    recentSubs: "So‘nggi yechimlar",
    all: "Hammasi",
    noDuels: "Hali duel o‘ynalmagan.",
    noSubs: "Hali yechim yuborilmagan.",
    vsBot: "Algo (AI)",
    duelsMissing: "Duellar tarixi serverda hali yoqilmagan (033-migratsiya).",
    duelsFailed: "Duellar tarixini olib bo‘lmadi.",
    friendsMissing: "Do‘stlar ro‘yxati serverda hali yoqilmagan (033-migratsiya).",
    friendsFailed: "Do‘stlar ro‘yxatini olib bo‘lmadi.",
    friendsNone: "Hali hech kim do‘st sifatida belgilanmagan.",
    friendsNote: "Bu hisob kimni kuzatadi. Uni kim kuzatayotgani ko‘rsatilmaydi.",
    remove: "Do‘stlardan olib tashlash",
    tally: (w: number, l: number, d: number) => `${w} g‘alaba · ${l} mag‘lubiyat · ${d} durang`,
  },
  en: {
    back: "Back",
    loading: "Loading…",
    notFound: "No such user",
    notFoundBody: "The username may have changed, or the account was removed.",
    networkErr: "Could not load the data. Check your connection and try again.",
    message: "Send a message",
    joined: "joined",
    self: "Edit profile",
    signIn: "Sign in",
    signInToWrite: "Sign in to send a message",
    roles: { user: "", admin: "ADMIN", owner: "OWNER" } as Record<Role, string>,
    nav: { overview: "Overview", submissions: "Submissions", duels: "Duel history", friends: "Friends" },
    rating: "Duel rating",
    max: "peak",
    toNext: (gap: number) => `${gap} to go`,
    top: "Top rank",
    place: "Leaderboard place",
    ofMembers: (n: number) => `of ${n} members`,
    solved: "Problems solved",
    subsLine: (subs: number, rate: number) => `${subs} submissions · ${rate}% accepted`,
    duels: "Duels",
    friends: "Friends",
    follows: "following",
    wl: { win: "W", loss: "L", draw: "D" },
    problems: "Problems",
    ofBank: (n: number) => `of ${n} in the bank`,
    diff: { easy: "Easy", medium: "Medium", hard: "Hard", insane: "Insane" },
    hardest: "Hardest solved",
    noSolved: "No problem solved yet.",
    summaryMissing: "These figures are not enabled on the server yet (migration 034).",
    recentDuels: "Recent duels",
    recentSubs: "Recent submissions",
    all: "All",
    noDuels: "No duels played yet.",
    noSubs: "No submissions yet.",
    vsBot: "Algo (AI)",
    duelsMissing: "Duel history is not enabled on the server yet (migration 033).",
    duelsFailed: "Could not load the duel history.",
    friendsMissing: "The friend list is not enabled on the server yet (migration 033).",
    friendsFailed: "Could not load the friend list.",
    friendsNone: "Nobody starred yet.",
    friendsNote: "Who this account follows. Who follows it is not shown.",
    remove: "Remove from friends",
    tally: (w: number, l: number, d: number) => `${w} wins · ${l} losses · ${d} draws`,
  },
};

const MONTHS_LONG = {
  uz: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
const joinedOn = (iso: string, lang: Lang) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const month = MONTHS_LONG[lang][d.getMonth()];
  return lang === "uz" ? `${d.getFullYear()}-yil ${month}` : `${month} ${d.getFullYear()}`;
};

const initialsOf = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0] || "").join("").toUpperCase() || "AY";

const DIFFS = ["easy", "medium", "hard", "insane"] as const;
type Diff = (typeof DIFFS)[number];

/* How many problems of each difficulty the bank holds -- the denominator of
   "12 of 80 easy". Computed once: the bank is a constant of the build. */
const BANK_BY_DIFF = DIFFS.reduce((acc, d) => {
  acc[d] = bankProblems.filter((p) => p.difficulty === d).length;
  return acc;
}, {} as Record<Diff, number>);
const BANK_BY_KEY = new Map(bankProblems.filter((p) => p.judge).map((p) => [p.judge as string, p]));

export function PublicProfile({
  lang, username, section = "overview", meId, signedIn,
  onBack, onSection, onOpenPerson, onOpenProblem, onMessage, onMyProfile, onSignIn,
  override, actions, belowHero, overviewExtra,
}: {
  lang: Lang;
  username: string;
  section?: ProfileSection;
  meId: string | null;
  signedIn: boolean;
  onBack?: () => void;
  onSection: (section: ProfileSection) => void;
  onOpenPerson: (handle: string) => void;
  onOpenProblem?: (problemId: string) => void;
  onMessage?: (userId: string) => void;
  onMyProfile?: () => void;
  onSignIn?: () => void;
  /** Your own profile passes its live record, so an edit shows at once rather
      than after a refetch. */
  override?: PublicPerson;
  /** Replaces the default actions -- the own profile's edit and staff menu. */
  actions?: ReactNode;
  /** Rendered between the header and the section navigation (the editor). */
  belowHero?: ReactNode;
  /** Appended to the overview (the learning panels only the owner sees). */
  overviewExtra?: ReactNode;
}) {
  const t = T[lang];
  const [fetched, setFetched] = useState<PublicPerson | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "not-found" | "error">(override ? "ready" : "loading");
  const person = override || fetched;

  const [summary, setSummary] = useState<ProfileSummary | "missing" | null>(null);
  const [duels, setDuels] = useState<PublicDuelRow[] | null>(null);
  const [duelState, setDuelState] = useState<"loading" | "ready" | "error" | "missing">("loading");
  const [friends, setFriends] = useState<FriendRow[] | null>(null);
  const [friendState, setFriendState] = useState<"idle" | "ready" | "error" | "missing">("idle");
  const [recent, setRecent] = useState<SubmissionRow[] | null>(null);
  const [online, setOnline] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);

  /* The app keys this component by handle, so a different handle starts from
     scratch on its own; nothing here has to reset by hand. */
  useEffect(() => {
    if (override) return;
    let live = true;
    fetchPersonByUsername(username).then((result) => {
      if (!live) return;
      if (result.ok) { setFetched(result.person); setState("ready"); }
      else setState(result.error === "not-found" ? "not-found" : "error");
    });
    return () => { live = false; };
  }, [username, override]);

  const personId = person?.id;

  // The header's figures and the duel rows are read with the profile: the
  // header and the curve both need them whatever section is open.
  useEffect(() => {
    if (!personId) return;
    let live = true;
    fetchProfileSummary(personId).then((result) => {
      if (!live) return;
      setSummary(result === "not-migrated" ? "missing" : result);
    });
    fetchPublicDuelHistory(personId, 200).then((result) => {
      if (!live) return;
      if (result === "not-migrated") { setDuelState("missing"); return; }
      if (!result) { setDuelState("error"); return; }
      setDuels(result);
      setDuelState("ready");
    });
    return () => { live = false; };
  }, [personId]);

  // The rest waits for the section that shows it.
  useEffect(() => {
    if (!personId || section !== "overview" || recent) return;
    let live = true;
    fetchSubmissions(personId, 6).then((result) => {
      if (live) setRecent(Array.isArray(result) ? result : []);
    });
    return () => { live = false; };
  }, [personId, section, recent]);

  /* Asked once per profile. "idle" already renders as loading, so the effect
     does not need to set a state of its own before the request goes out. */
  const friendsAsked = useRef(false);
  useEffect(() => {
    if (!personId || section !== "friends" || friendsAsked.current) return;
    friendsAsked.current = true;
    let live = true;
    fetchPublicFriends(personId).then((result) => {
      if (!live) return;
      if (result === "not-migrated") { setFriendState("missing"); return; }
      if (!result) { setFriendState("error"); return; }
      setFriends(result);
      setFriendState("ready");
    });
    // A section switch mid-request must not drop the answer, so the result is
    // kept even after this effect is cleaned up; only an unmount discards it.
    return () => { if (!mounted.current) live = false; };
  }, [personId, section]);

  useEffect(() => {
    if (!personId || !signedIn) return;
    let live = true;
    const pull = () => { void onlineAmong([personId]).then((set) => { if (live) setOnline(set.has(personId)); }); };
    pull();
    const timer = window.setInterval(pull, 30000);
    return () => { live = false; window.clearInterval(timer); };
  }, [personId, signedIn]);

  useEffect(() => {
    if (!personId || !signedIn) return;
    let live = true;
    fetchFriendIds().then((ids) => { if (live && ids) setIsFriend(ids.has(personId)); });
    return () => { live = false; };
  }, [personId, signedIn]);

  const tally = useMemo(
    () => (duels || []).reduce((acc, r) => { acc[r.outcome] += 1; return acc; }, { win: 0, loss: 0, draw: 0 }),
    [duels],
  );

  if (state === "loading") {
    return (
      <div className="screen-state" role="status">
        <span className="spinner" aria-hidden />
        <p className="muted">{t.loading}</p>
      </div>
    );
  }
  if (state === "not-found") {
    return (
      <>
        {onBack && <button className="crumb crumb-btn" onClick={onBack}>← {t.back}</button>}
        <div className="screen-state panel">
          <span className="screen-state-ic" aria-hidden>🔎</span>
          <h1 className="page-title">{t.notFound}</h1>
          <p className="muted">{t.notFoundBody}</p>
        </div>
      </>
    );
  }
  if (state === "error" || !person) {
    return (
      <>
        {onBack && <button className="crumb crumb-btn" onClick={onBack}>← {t.back}</button>}
        <div className="panel"><div className="notice notice-error">{t.networkErr}</div></div>
      </>
    );
  }

  const isMe = !!meId && person.id === meId;
  const name = person.display_name?.trim() || person.username;
  const rating = person.duel_rating;
  const rank = rankOf(rating);
  const rankName = lang === "uz" ? rank.nameUz : rank.nameEn;
  const next = nextRank(rating);
  const sum = summary && summary !== "missing" ? summary : null;
  const peak = Math.max(rating, sum?.max_rating ?? 0, ...(duels || []).map((d) => d.rating_after));
  const solvedCount = sum ? sum.solved_keys.length : person.solved_count;
  const duelCount = sum ? sum.duels : duels?.length ?? null;

  const suffix: Record<ProfileSection, string> = {
    overview: "", submissions: "/submissions", duels: "/duels", friends: "/friends",
  };
  const hrefOf = (s: ProfileSection) => (override && s === "overview" ? "/profile" : `/u/${person.username}${suffix[s]}`);
  const counts: Partial<Record<ProfileSection, number | null>> = {
    submissions: sum?.submissions ?? null,
    duels: duelCount,
    friends: sum?.friends ?? (friends ? friends.length : null),
  };

  const defaultActions = isMe ? (
    <button className="secondary" onClick={onMyProfile}>{t.self}</button>
  ) : signedIn ? (
    <>
      {onMessage && <button className="primary" onClick={() => onMessage(person.id)}>{t.message}</button>}
      <FriendStar lang={lang} isFriend={isFriend} signedIn={signedIn} userId={person.id} onChange={setIsFriend} solo />
    </>
  ) : (
    <button className="secondary" onClick={onSignIn} title={t.signInToWrite}>{t.signIn}</button>
  );

  // Progress through the current rank, for the bar under the rating.
  const rankSpan = next ? next.rank.min - rank.min : 1;
  const rankProgress = next ? Math.min(100, Math.max(4, ((rating - rank.min) / rankSpan) * 100)) : 100;

  return (
    <div className="pv" style={{ ["--rank" as string]: rank.color }}>
      {onBack && <button className="crumb crumb-btn" onClick={onBack}>← {t.back}</button>}

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="pv-hero">
        <div className="pv-cover" aria-hidden />
        <div className="pv-hero-body">
          <AvatarZoom lang={lang} src={person.avatar_url} name={name}>
            <span className="pv-avatar" aria-hidden>
              {person.avatar_url
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={person.avatar_url} alt="" />
                : initialsOf(name)}
            </span>
          </AvatarZoom>
          <div className="pv-id">
            <p className="pv-rank">{rankName}</p>
            <h1>
              <span className="pv-name">{name}</span>
              <OnlineDot online={online} lang={lang} label={name} />
              {t.roles[person.role] && <i className="pv-role">{t.roles[person.role]}</i>}
            </h1>
            <p className="pv-meta">
              <span className="mono">@{person.username}</span>
              {person.country && <><span aria-hidden>·</span><span>{person.country}</span></>}
              <span aria-hidden>·</span>
              <span>{joinedOn(person.created_at, lang)} {t.joined}</span>
            </p>
            {person.bio && <p className="pv-bio">{person.bio}</p>}
          </div>
          <div className="pv-actions">{actions ?? defaultActions}</div>
        </div>
      </section>

      {belowHero}

      {/* ── Figures ────────────────────────────────────────────────────── */}
      <div className="pv-stats">
        <div className="pv-stat pv-stat-rating">
          <small>{t.rating}</small>
          <b className="mono" style={{ color: rank.color }}>{rating}</b>
          <span className="pv-sub">
            {t.max} <b className="mono" style={{ color: rankOf(peak).color }}>{peak}</b>
          </span>
          <div className="pv-next" title={next ? `${next.rank.min}` : undefined}>
            <span className="pv-next-bar"><i style={{ width: `${rankProgress}%` }} /></span>
            <small>
              {next ? (
                <>
                  {t.toNext(next.gap)} →{" "}
                  <span style={{ color: next.rank.color }}>{lang === "uz" ? next.rank.nameUz : next.rank.nameEn}</span>
                </>
              ) : t.top}
            </small>
          </div>
        </div>
        <div className="pv-stat">
          <small>{t.place}</small>
          <b className="mono">{sum ? `#${sum.place}` : "—"}</b>
          <span className="pv-sub">{sum ? t.ofMembers(sum.members) : ""}</span>
        </div>
        <div className="pv-stat">
          <small>{t.solved}</small>
          <b className="mono">{solvedCount}</b>
          <span className="pv-sub">
            {sum && sum.submissions > 0 ? t.subsLine(sum.submissions, Math.round((sum.accepted / sum.submissions) * 100)) : ""}
          </span>
        </div>
        <div className="pv-stat">
          <small>{t.duels}</small>
          <b className="mono">{duelCount ?? "—"}</b>
          <span className="pv-sub pv-wl">
            <i className="dh-win">{tally.win}{t.wl.win}</i>
            <i className="dh-loss">{tally.loss}{t.wl.loss}</i>
            <i>{tally.draw}{t.wl.draw}</i>
          </span>
        </div>
        <div className="pv-stat">
          <small>{t.friends}</small>
          <b className="mono">{counts.friends ?? "—"}</b>
          <span className="pv-sub">{t.follows}</span>
        </div>
      </div>

      {/* ── Sections: four addresses, like Codeforces' profile menu ─────── */}
      <nav className="pv-nav" aria-label={name}>
        {(["overview", "submissions", "duels", "friends"] as const).map((s) => (
          <a
            key={s} href={hrefOf(s)} className={section === s ? "on" : ""}
            aria-current={section === s ? "page" : undefined}
            onClick={(e) => {
              // A modified click is "open this elsewhere", which the real href serves.
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              if (section !== s) onSection(s);
            }}
          >
            {t.nav[s]}
            {typeof counts[s] === "number" && <i>{counts[s]}</i>}
          </a>
        ))}
      </nav>

      {section === "overview" && (
        <div className="pv-body">
          {duelState === "ready" && duels && <RatingGraph lang={lang} rows={duels} />}
          {duelState === "missing" && <p className="muted os-empty">{t.duelsMissing}</p>}

          <div className="pv-grid">
            <ProblemsCard lang={lang} summary={summary} onOpenProblem={onOpenProblem} />
            <section className="panel pv-card">
              <header className="pv-card-head">
                <h2>{t.recentDuels}</h2>
                {duels && duels.length > 0 && (
                  <a href={hrefOf("duels")} className="pv-all" onClick={(e) => { e.preventDefault(); onSection("duels"); }}>
                    {t.all} →
                  </a>
                )}
              </header>
              {duels && duels.length > 0 ? (
                <ul className="pv-list">
                  {duels.slice(0, 5).map((d) => (
                    <li key={d.id}>
                      <span className={`pv-res pv-res-${d.outcome}`}>{t.wl[d.outcome]}</span>
                      <span className="pv-list-main">
                        {d.opponent_is_bot ? (
                          <b>{t.vsBot}</b>
                        ) : d.opponent_username ? (
                          <button className="link-btn" onClick={() => onOpenPerson(d.opponent_username!)}>
                            {d.opponent || d.opponent_username}
                          </button>
                        ) : <b>{d.opponent || "—"}</b>}
                        <small className="muted">{shortDateTime(d.finished_at, lang)}</small>
                      </span>
                      <span className="mono pv-score">{d.my_score}:{d.opp_score}</span>
                      <span className={`mono pv-delta ${d.delta > 0 ? "dh-win" : d.delta < 0 ? "dh-loss" : "muted"}`}>
                        {d.delta > 0 ? "+" : ""}{d.delta}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted pv-none">{duelState === "loading" ? t.loading : t.noDuels}</p>
              )}
            </section>
          </div>

          <section className="panel pv-card">
            <header className="pv-card-head">
              <h2>{t.recentSubs}</h2>
              {recent && recent.length > 0 && (
                <a href={hrefOf("submissions")} className="pv-all" onClick={(e) => { e.preventDefault(); onSection("submissions"); }}>
                  {t.all} →
                </a>
              )}
            </header>
            {recent && recent.length > 0 ? (
              <ul className="pv-list">
                {recent.map((s) => {
                  const ok = s.verdict === "ACCEPTED";
                  const bank = BANK_BY_KEY.get(s.problem_key);
                  return (
                    <li key={s.id}>
                      <span className={`pv-verdict ${ok ? "ok" : "bad"}`} title={s.verdict}>{ok ? "✓" : "✕"}</span>
                      <span className="pv-list-main">
                        {bank && onOpenProblem ? (
                          <button className="link-btn" onClick={() => onOpenProblem(bank.id)}>
                            {s.problem_title || s.problem_key}
                          </button>
                        ) : <b>{s.problem_title || s.problem_key}</b>}
                        <small className="muted">{shortDateTime(s.created_at, lang)}</small>
                      </span>
                      {bank && <span className="mono pv-prob-rating" style={{ color: rankOf(bank.rating).color }}>{bank.rating}</span>}
                      <span className={`pv-verdict-text ${ok ? "dh-win" : "dh-loss"}`}>
                        {verdictLabel(s.verdict, lang)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="muted pv-none">{recent === null ? t.loading : t.noSubs}</p>
            )}
          </section>

          {overviewExtra}
        </div>
      )}

      {section === "submissions" && (
        <div className="pv-body">
          <SubmissionHistory lang={lang} userId={person.id} isMe={isMe} signedIn={signedIn} />
        </div>
      )}

      {section === "duels" && (
        <div className="pv-body">
          <section className="panel pv-card">
            <header className="pv-card-head">
              <h2>{t.nav.duels}</h2>
              {duels && duels.length > 0 && <span className="muted">{t.tally(tally.win, tally.loss, tally.draw)}</span>}
            </header>
            {duelState === "loading" && <p className="muted pv-none">{t.loading}</p>}
            {duelState === "error" && <p className="muted pv-none">{t.duelsFailed}</p>}
            {duelState === "missing" && <p className="muted pv-none">{t.duelsMissing}</p>}
            {duelState === "ready" && duels && !duels.length && <p className="muted pv-none">{t.noDuels}</p>}
            {duelState === "ready" && duels && duels.length > 0 && (
              <DuelTable lang={lang} rows={duels} onOpenPerson={onOpenPerson} />
            )}
          </section>
        </div>
      )}

      {section === "friends" && (
        <div className="pv-body">
          {friendState === "idle" && <p className="muted pv-none">{t.loading}</p>}
          {friendState === "error" && <div className="panel"><p className="muted pv-none">{t.friendsFailed}</p></div>}
          {friendState === "missing" && <div className="panel"><p className="muted pv-none">{t.friendsMissing}</p></div>}
          {friendState === "ready" && friends && !friends.length && (
            <div className="panel"><p className="muted pv-none">{t.friendsNone}</p></div>
          )}
          {friendState === "ready" && friends && friends.length > 0 && (
            <>
              <ul className="pv-friends">
                {friends.map((f) => {
                  const fr = rankOf(f.duel_rating);
                  const fname = f.display_name?.trim() || f.username;
                  return (
                    <li key={f.id} style={{ ["--rank" as string]: fr.color }}>
                      <button type="button" className="pv-friend" onClick={() => onOpenPerson(f.username)}>
                        <span className="pv-friend-face" aria-hidden>
                          {f.avatar_url
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={f.avatar_url} alt="" />
                            : fname.slice(0, 1).toUpperCase()}
                        </span>
                        <span className="pv-friend-who">
                          <b>{fname}</b>
                          <small className="mono muted">@{f.username}</small>
                          <small className="pv-friend-rank">{lang === "uz" ? fr.nameUz : fr.nameEn}</small>
                        </span>
                        <span className="mono pv-friend-rating">{f.duel_rating}</span>
                      </button>
                      {isMe && (
                        <button
                          type="button" className="pv-friend-drop" title={t.remove} aria-label={t.remove}
                          onClick={async () => {
                            setFriends((prev) => (prev ? prev.filter((x) => x.id !== f.id) : prev));
                            await removeFriend(f.id);
                          }}
                        >★</button>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="muted pv-note">{t.friendsNote}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* Solved problems by difficulty, out of what the bank holds -- kep.uz's
   "Problems" row, drawn as one stacked bar and four counters, plus the single
   hardest problem solved, which says more about strength than any total. */
function ProblemsCard({
  lang, summary, onOpenProblem,
}: {
  lang: Lang;
  summary: ProfileSummary | "missing" | null;
  onOpenProblem?: (problemId: string) => void;
}) {
  const t = T[lang];
  const solved = summary && summary !== "missing"
    ? summary.solved_keys.map((k) => BANK_BY_KEY.get(k)).filter((p): p is NonNullable<typeof p> => !!p)
    : [];
  const byDiff = DIFFS.reduce((acc, d) => { acc[d] = solved.filter((p) => p.difficulty === d).length; return acc; },
    {} as Record<Diff, number>);
  const total = solved.length;
  const hardest = solved.reduce<(typeof solved)[number] | null>((best, p) => (!best || p.rating > best.rating ? p : best), null);

  return (
    <section className="panel pv-card">
      <header className="pv-card-head">
        <h2>{t.problems}</h2>
        {summary && summary !== "missing" && <span className="mono pv-total">{total}<small> / {bankProblems.length}</small></span>}
      </header>
      {summary === "missing" ? (
        <p className="muted pv-none">{t.summaryMissing}</p>
      ) : summary === null ? (
        <p className="muted pv-none">{t.loading}</p>
      ) : (
        <>
          <div className="pv-stack" aria-hidden>
            {DIFFS.map((d) => byDiff[d] > 0 && (
              <i key={d} className={`pv-stack-${d}`} style={{ flexGrow: byDiff[d] }} />
            ))}
            {total === 0 && <i className="pv-stack-empty" style={{ flexGrow: 1 }} />}
          </div>
          <div className="pv-diffs">
            {DIFFS.map((d) => (
              <div key={d} className={`pv-diff pv-diff-${d}`}>
                <b className="mono">{byDiff[d]}</b>
                <span>{t.diff[d]}</span>
                <small className="muted">{t.ofBank(BANK_BY_DIFF[d])}</small>
              </div>
            ))}
          </div>
          {hardest ? (
            <p className="pv-hardest">
              <span className="muted">{t.hardest}:</span>{" "}
              {onOpenProblem ? (
                <button className="link-btn" onClick={() => onOpenProblem(hardest.id)}>
                  {lang === "uz" ? hardest.uz : hardest.en}
                </button>
              ) : <b>{lang === "uz" ? hardest.uz : hardest.en}</b>}{" "}
              <span className="mono" style={{ color: rankOf(hardest.rating).color }}>★ {hardest.rating}</span>
            </p>
          ) : (
            <p className="muted pv-hardest">{t.noSolved}</p>
          )}
        </>
      )}
    </section>
  );
}
