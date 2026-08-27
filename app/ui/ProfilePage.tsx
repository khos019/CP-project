"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { roadmapCatalog } from "./roadmap-data";
import { loadMastery, loadMasteryLog, loadDuelHistory, masteryLabel, MASTERY_CONFIG } from "./mastery";
import { emptyProgress, loadProgress, type Progress } from "./progress";
import { uploadAvatar, avatarStorageReady } from "./avatar";
import { hasExtendedProfile, updateProfile, type Profile, type Role } from "./session";

type Lang = "uz" | "en";

const T = {
  uz: {
    title: "Profil",
    edit: "Profilni tahrirlash",
    cancel: "Bekor qilish",
    save: "Saqlash",
    saving: "Saqlanmoqda…",
    saved: "Profil yangilandi.",
    signOut: "Chiqish",
    admin: "Boshqaruv",
    stats: "Statistika",
    joined: "Qo‘shildi",
    rating: "Duel reytingi",
    units: "Tugatilgan bosqichlar",
    topics: "Boshlangan mavzular",
    mastered: "O‘zlashtirilgan mavzular",
    solved: "Yechilgan masalalar",
    duels: "Duellar",
    streak: "Ketma-ket kunlar",
    overview: "Mavzu mahorati",
    activity: "So‘nggi faoliyat",
    noActivity: "Hali faoliyat yo‘q. Birinchi darsni boshlang — bu yerda ko‘rinadi.",
    noTopics: "Hali birorta mavzu boshlanmagan.",
    startLearning: "O‘rganishni boshlash",
    showAll: "Barchasini ko‘rsatish",
    showLess: "Kamroq ko‘rsatish",
    personal: "Shaxsiy ma’lumot",
    account: "Hisob",
    displayName: "Ko‘rinadigan ism",
    username: "Foydalanuvchi nomi",
    bio: "Qisqacha ma’lumot",
    country: "Shahar yoki davlat",
    language: "Afzal til",
    email: "Email",
    emailNote: "Email faqat sizga ko‘rinadi va bu yerda o‘zgartirilmaydi.",
    publicNote: "Ko‘rinadigan ism, foydalanuvchi nomi, avatar, bio va joylashuv ommaviy — ularni reyting va profilingizda hamma ko‘radi.",
    privateNote: "Email, rolingiz va o‘rganish progressingiz shaxsiy.",
    avatar: "Avatar",
    upload: "Rasm yuklash",
    uploading: "Yuklanmoqda…",
    remove: "Rasmni olib tashlash",
    avatarRules: "JPG, PNG, WebP yoki GIF · 2 MB gacha",
    errName: "Ko‘rinadigan ism 2–40 belgidan iborat bo‘lsin.",
    errUser: "Faqat lotin harflari, raqamlar va _ · 3–24 belgi.",
    errBio: "Bio 280 belgidan oshmasin.",
    errTaken: "Bu foydalanuvchi nomi band.",
    errSave: "Saqlab bo‘lmadi. Internetni tekshirib, qayta urining.",
    errType: "Faqat JPG, PNG, WebP yoki GIF rasm.",
    errSize: "Rasm 2 MB dan katta bo‘lmasin.",
    errBucket: "Avatar saqlagichi hali sozlanmagan (007-migratsiyani qo‘llang).",
    extendedOff: "Bio va joylashuv maydonlari 007-migratsiya qo‘llangandan keyin ochiladi.",
    win: "g‘alaba",
    loss: "mag‘lubiyat",
    draw: "durrang",
    of: "dan",
  },
  en: {
    title: "Profile",
    edit: "Edit profile",
    cancel: "Cancel",
    save: "Save changes",
    saving: "Saving…",
    saved: "Profile updated.",
    signOut: "Sign out",
    admin: "Admin studio",
    stats: "Statistics",
    joined: "Joined",
    rating: "Duel rating",
    units: "Units completed",
    topics: "Topics started",
    mastered: "Topics mastered",
    solved: "Problems solved",
    duels: "Duels",
    streak: "Day streak",
    overview: "Topic mastery",
    activity: "Recent activity",
    noActivity: "No activity yet. Start your first lesson and it will show up here.",
    noTopics: "No topic started yet.",
    startLearning: "Start learning",
    showAll: "Show all topics",
    showLess: "Show fewer",
    personal: "Personal information",
    account: "Account",
    displayName: "Display name",
    username: "Username",
    bio: "Short bio",
    country: "City or country",
    language: "Preferred language",
    email: "Email",
    emailNote: "Your email is private and cannot be changed here.",
    publicNote:
      "Display name, username, avatar, bio and location are public — everyone sees them on your profile and the leaderboard.",
    privateNote: "Your email, your role and your learning progress stay private.",
    avatar: "Avatar",
    upload: "Upload image",
    uploading: "Uploading…",
    remove: "Remove image",
    avatarRules: "JPG, PNG, WebP or GIF · up to 2 MB",
    errName: "Display name must be 2–40 characters.",
    errUser: "Letters, digits and _ only · 3–24 characters.",
    errBio: "Bio must be 280 characters or fewer.",
    errTaken: "That username is already taken.",
    errSave: "Could not save. Check your connection and try again.",
    errType: "Only JPG, PNG, WebP or GIF images.",
    errSize: "The image must be under 2 MB.",
    errBucket: "Avatar storage is not provisioned yet (apply migration 007).",
    extendedOff: "Bio and location unlock once migration 007 is applied.",
    win: "win",
    loss: "loss",
    draw: "draw",
    of: "of",
  },
};

const roleLabel = (role: Role, lang: Lang) =>
  role === "owner" ? (lang === "uz" ? "EGA" : "OWNER") : role === "admin" ? "ADMIN" : lang === "uz" ? "O‘QUVCHI" : "LEARNER";

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase() || "AY";

/* Formatted from an explicit table rather than toLocaleDateString: the server
   and the browser resolve locale data differently, which produced a hydration
   mismatch, and the uz-UZ fallback rendered months as "M03". */
const MONTHS = {
  uz: ["yanvar","fevral","mart","aprel","may","iyun","iyul","avgust","sentabr","oktabr","noyabr","dekabr"],
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
};
const formatDate = (iso: string, lang: Lang) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const month = MONTHS[lang][date.getUTCMonth()];
  return lang === "uz" ? `${date.getUTCFullYear()}-yil ${month}` : `${month} ${date.getUTCFullYear()}`;
};

const shortDate = (at: number, lang: Lang) => {
  const d = new Date(at);
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[lang][d.getMonth()].slice(0, 3)}`;
};

const emptyMastery = { scores: {}, evidence: {}, unlocks: {}, validated: {} } as ReturnType<typeof loadMastery>;

const USERNAME_RE = /^[a-zA-Z0-9_]{3,24}$/;

export function ProfilePage({
  lang,
  profile,
  onProfileChange,
  signOut,
  goAdmin,
  goStats,
  goRoadmaps,
  openRoadmap,
  isStaff,
}: {
  lang: Lang;
  profile: Profile;
  onProfileChange: (next: Profile) => void;
  signOut: () => void;
  goAdmin: () => void;
  goStats: () => void;
  goRoadmaps: () => void;
  openRoadmap: (slug: string) => void;
  isStaff: boolean;
}) {
  const t = T[lang];
  const [editing, setEditing] = useState(false);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  /* Learner state lives in localStorage, which the server cannot see. Reading
     it during the first render made the server and client disagree and threw a
     hydration error; it is loaded in the effect below instead. */
  const [mastery, setMastery] = useState(emptyMastery);
  const [log, setLog] = useState<ReturnType<typeof loadMasteryLog>>([]);
  const [duels, setDuels] = useState<ReturnType<typeof loadDuelHistory>>([]);
  const [showAllTopics, setShowAllTopics] = useState(false);

  useEffect(() => {
    let live = true;
    const read = () => {
      setMastery(loadMastery());
      setLog(loadMasteryLog());
      setDuels(loadDuelHistory());
      loadProgress().then((p) => {
        if (live) setProgress(p);
      });
    };
    read();
    window.addEventListener("algoyol-progress", read);
    return () => {
      live = false;
      window.removeEventListener("algoyol-progress", read);
    };
  }, []);

  /* Every number below is derived from something the learner actually did.
     Nothing here is a placeholder. */
  const stats = useMemo(() => {
    const allUnits = roadmapCatalog.flatMap((r) => r.units);
    const unitsDone = allUnits.filter((u) => (progress.quizScores[u.id] || 0) >= 70 && progress.solved[u.id]).length;
    const started = Object.values(mastery.scores).filter((s) => s > 0).length;
    const masteredTopics = Object.values(mastery.scores).filter((s) => s >= MASTERY_CONFIG.complete).length;
    const solved = Object.keys(mastery.evidence).filter((k) => k.startsWith("problem:") || k.startsWith("duel:")).length
      + Object.values(progress.solved).filter(Boolean).length;
    const record = duels.reduce(
      (acc, d) => ({ ...acc, [d.outcome]: acc[d.outcome] + 1 }),
      { win: 0, loss: 0, draw: 0 } as Record<"win" | "loss" | "draw", number>,
    );
    const days = new Set(log.map((e) => new Date(e.at).toDateString()));
    let streak = 0;
    for (let i = 0; ; i++) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      if (!days.has(day.toDateString())) {
        if (i === 0) continue; // today may simply not have started yet
        break;
      }
      streak++;
    }
    return { totalUnits: allUnits.length, unitsDone, started, masteredTopics, solved, record, streak };
  }, [progress, mastery, duels, log]);

  const rankedTopics = useMemo(
    () =>
      roadmapCatalog
        .map((r) => ({ roadmap: r, score: mastery.scores[r.slug] || 0 }))
        .sort((a, b) => b.score - a.score),
    [mastery],
  );
  const startedTopics = rankedTopics.filter((x) => x.score > 0);
  const visibleTopics = showAllTopics ? rankedTopics : startedTopics.slice(0, 6);
  const recent = useMemo(() => [...log].reverse().slice(0, 8), [log]);
  const topicName = (slug: string) => {
    const r = roadmapCatalog.find((x) => x.slug === slug);
    return r ? (lang === "uz" ? r.titleUz : r.titleEn) : slug;
  };

  const name = profile.display_name?.trim() || profile.username;
  const totalDuels = stats.record.win + stats.record.loss + stats.record.draw;

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">{t.title}</p>
          <h1 className="page-title">{name}</h1>
        </div>
        <div className="actions">
          {profile.role === "owner" && (
            <button className="secondary" onClick={goStats}>
              {t.stats}
            </button>
          )}
          {isStaff && (
            <button className="secondary" onClick={goAdmin}>
              {t.admin}
            </button>
          )}
          <button className="pill danger" onClick={signOut}>
            {t.signOut}
          </button>
        </div>
      </div>

      <section className="pf-header panel">
        <Avatar profile={profile} name={name} />
        <div className="pf-identity">
          <h2>{name}</h2>
          <p className="pf-handle">@{profile.username}</p>
          <div className="pf-badges">
            <span className={`tag role-${profile.role}`}>{roleLabel(profile.role, lang)}</span>
            {profile.country ? <span className="tag">{profile.country}</span> : null}
            <span className="tag">
              {t.joined} {formatDate(profile.created_at, lang)}
            </span>
          </div>
          {profile.bio ? <p className="pf-bio">{profile.bio}</p> : null}
        </div>
        <button className="primary pf-edit" onClick={() => setEditing((v) => !v)} aria-expanded={editing}>
          {editing ? t.cancel : t.edit}
        </button>
      </section>

      {editing && (
        <ProfileEditor
          lang={lang}
          profile={profile}
          onProfileChange={onProfileChange}
          onDone={() => setEditing(false)}
        />
      )}

      <div className="pf-stats">
        <Stat label={t.rating} value={String(profile.duel_rating)} />
        <Stat label={t.units} value={`${stats.unitsDone}`} sub={`/ ${stats.totalUnits}`} />
        <Stat label={t.solved} value={String(stats.solved)} />
        <Stat label={t.topics} value={String(stats.started)} sub={`/ ${roadmapCatalog.length}`} />
        <Stat label={t.mastered} value={String(stats.masteredTopics)} />
        <Stat
          label={t.duels}
          value={String(totalDuels)}
          sub={totalDuels ? `${stats.record.win}${lang === "uz" ? "G" : "W"} · ${stats.record.loss}${lang === "uz" ? "M" : "L"} · ${stats.record.draw}D` : undefined}
        />
        <Stat label={t.streak} value={String(stats.streak)} />
      </div>

      <div className="pf-grid">
        <section className="panel">
          <div className="pf-section-head">
            <h2>{t.overview}</h2>
            {startedTopics.length > 0 && (
              <button className="lang" onClick={() => setShowAllTopics((v) => !v)}>
                {showAllTopics ? t.showLess : t.showAll}
              </button>
            )}
          </div>
          {visibleTopics.length ? (
            <div className="pf-bars">
              {visibleTopics.map(({ roadmap, score }) => (
                <button key={roadmap.slug} className="pf-bar" onClick={() => openRoadmap(roadmap.slug)}>
                  <span className="pf-bar-ic" style={{ background: roadmap.color }} aria-hidden>
                    {roadmap.icon}
                  </span>
                  <span className="pf-bar-copy">
                    <b>{lang === "uz" ? roadmap.titleUz : roadmap.titleEn}</b>
                    <small className="muted">{masteryLabel(score, lang)}</small>
                  </span>
                  <span className="pf-bar-track">
                    <span className="progress">
                      <span style={{ width: `${score / 10}%` }} />
                    </span>
                    <small className="mono">{score}/1000</small>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="pf-empty">
              <p className="muted">{t.noTopics}</p>
              <button className="primary" onClick={goRoadmaps}>
                {t.startLearning} →
              </button>
            </div>
          )}
        </section>

        <section className="panel">
          <h2>{t.activity}</h2>
          {recent.length ? (
            <ul className="pf-feed">
              {recent.map((e, i) => (
                <li key={`${e.sourceId}-${i}`}>
                  <span className="pf-feed-src">{e.source.toUpperCase()}</span>
                  <span className="pf-feed-body">
                    <b>{topicName(e.topic)}</b>
                    <small className="muted">{shortDate(e.at, lang)}</small>
                  </span>
                  <span className="pf-feed-delta mono">+{e.delta}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="pf-empty">
              <p className="muted">{t.noActivity}</p>
              <button className="secondary" onClick={goRoadmaps}>
                {t.startLearning} →
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="pf-stat">
      <b>{value}</b>
      {sub ? <small className="pf-stat-sub">{sub}</small> : null}
      <small>{label}</small>
    </div>
  );
}

function Avatar({ profile, name }: { profile: Profile; name: string }) {
  // Keyed on the URL so a new upload resets the "broken" flag without an effect.
  const [broken, setBroken] = useState("");
  if (profile.avatar_url && broken !== profile.avatar_url)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="pf-avatar"
        src={profile.avatar_url}
        alt={name}
        key={profile.avatar_url}
        onError={() => setBroken(profile.avatar_url || "")}
        width={112}
        height={112}
      />
    );
  return (
    <div className="pf-avatar pf-avatar-fallback" aria-hidden>
      {initialsOf(name)}
    </div>
  );
}

function ProfileEditor({
  lang,
  profile,
  onProfileChange,
  onDone,
}: {
  lang: Lang;
  profile: Profile;
  onProfileChange: (next: Profile) => void;
  onDone: () => void;
}) {
  const t = T[lang];
  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || "");
  const [country, setCountry] = useState(profile.country || "");
  const [preferred, setPreferred] = useState<Lang>(profile.preferred_language);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [banner, setBanner] = useState("");
  const [extended, setExtended] = useState<boolean | null>(null);
  const [storageReady, setStorageReady] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    hasExtendedProfile().then(setExtended);
    avatarStorageReady().then(setStorageReady);
  }, []);

  const validate = () => {
    const next: Record<string, string> = {};
    const name = displayName.trim();
    if (name.length < 2 || name.length > 40) next.displayName = t.errName;
    if (!USERNAME_RE.test(username.trim())) next.username = t.errUser;
    if (bio.length > 280) next.bio = t.errBio;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const pickFile = async (file: File) => {
    setBanner("");
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
      setErrors((e) => ({ ...e, avatar: t.errType }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((e) => ({ ...e, avatar: t.errSize }));
      return;
    }
    setErrors((e) => ({ ...e, avatar: "" }));
    setUploading(true);
    const result = await uploadAvatar(profile.id, file);
    setUploading(false);
    if (!result.ok) {
      setErrors((e) => ({ ...e, avatar: result.error === "no-bucket" ? t.errBucket : t.errSave }));
      return;
    }
    setAvatarUrl(result.url);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "saving") return;
    if (!validate()) return;
    setStatus("saving");
    setBanner("");
    const patch = {
      display_name: displayName.trim(),
      username: username.trim(),
      preferred_language: preferred,
      avatar_url: avatarUrl,
      ...(extended ? { bio: bio.trim(), country: country.trim() } : {}),
    };
    const result = await updateProfile(profile.id, patch);
    if (!result.ok) {
      setStatus("error");
      if (result.error === "username-taken") setErrors((e) => ({ ...e, username: t.errTaken }));
      setBanner(result.error === "username-taken" ? t.errTaken : t.errSave);
      return;
    }
    onProfileChange({ ...profile, ...patch });
    setStatus("saved");
    setBanner(t.saved);
    window.setTimeout(onDone, 900);
  };

  const initials = initialsOf(displayName || username);

  return (
    <form className="panel pf-editor" onSubmit={submit} noValidate>
      {banner && (
        <div className={status === "error" ? "notice notice-error" : "notice"} role="status">
          {banner}
        </div>
      )}

      <fieldset className="pf-fieldset">
        <legend>{t.avatar}</legend>
        <div className="pf-avatar-row">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="pf-avatar sm" src={avatarUrl} alt="" width={72} height={72} />
          ) : (
            <div className="pf-avatar sm pf-avatar-fallback" aria-hidden>
              {initials}
            </div>
          )}
          <div className="pf-avatar-actions">
            <input
              ref={fileRef}
              id="pf-avatar-file"
              className="pf-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void pickFile(file);
                e.target.value = "";
              }}
              disabled={uploading || storageReady === false}
              aria-describedby="pf-avatar-help"
            />
            <label className="secondary pf-file-label" htmlFor="pf-avatar-file">
              {uploading ? t.uploading : t.upload}
            </label>
            {avatarUrl && (
              <button type="button" className="lang" onClick={() => setAvatarUrl(null)}>
                {t.remove}
              </button>
            )}
            <small id="pf-avatar-help" className="muted">
              {storageReady === false ? t.errBucket : t.avatarRules}
            </small>
            {errors.avatar ? (
              <small className="field-error" role="alert">
                {errors.avatar}
              </small>
            ) : null}
          </div>
        </div>
      </fieldset>

      <fieldset className="pf-fieldset">
        <legend>{t.personal}</legend>
        <p className="muted pf-note">{t.publicNote}</p>
        <div className="pf-form-grid">
          <Field
            id="pf-display"
            label={t.displayName}
            value={displayName}
            onChange={setDisplayName}
            error={errors.displayName}
            maxLength={40}
            autoComplete="name"
          />
          <Field
            id="pf-username"
            label={t.username}
            value={username}
            onChange={setUsername}
            error={errors.username}
            maxLength={24}
            prefix="@"
            autoComplete="username"
          />
        </div>
        {extended === false ? (
          <p className="muted pf-note">{t.extendedOff}</p>
        ) : (
          <>
            <div className="field">
              <label htmlFor="pf-bio">{t.bio}</label>
              <textarea
                id="pf-bio"
                rows={3}
                value={bio}
                maxLength={280}
                onChange={(e) => setBio(e.target.value)}
                aria-invalid={!!errors.bio}
                aria-describedby={errors.bio ? "pf-bio-error" : "pf-bio-count"}
                disabled={extended === null}
              />
              <small id="pf-bio-count" className="muted">
                {bio.length}/280
              </small>
              {errors.bio ? (
                <small id="pf-bio-error" className="field-error" role="alert">
                  {errors.bio}
                </small>
              ) : null}
            </div>
            <Field
              id="pf-country"
              label={t.country}
              value={country}
              onChange={setCountry}
              maxLength={60}
              autoComplete="country-name"
              disabled={extended === null}
            />
          </>
        )}
      </fieldset>

      <fieldset className="pf-fieldset">
        <legend>{t.account}</legend>
        <p className="muted pf-note">{t.privateNote}</p>
        <div className="pf-form-grid">
          <div className="field">
            <label htmlFor="pf-email">{t.email}</label>
            <input id="pf-email" value={profile.email} readOnly aria-describedby="pf-email-help" />
            <small id="pf-email-help" className="muted">
              {t.emailNote}
            </small>
          </div>
          <div className="field">
            <label htmlFor="pf-lang">{t.language}</label>
            <select id="pf-lang" value={preferred} onChange={(e) => setPreferred(e.target.value as Lang)}>
              <option value="uz">O‘zbekcha</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </fieldset>

      <div className="pf-editor-actions">
        <button className="primary" type="submit" disabled={status === "saving"}>
          {status === "saving" ? t.saving : t.save}
        </button>
        <button className="secondary" type="button" onClick={onDone}>
          {t.cancel}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  maxLength,
  prefix,
  autoComplete,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  maxLength?: number;
  prefix?: string;
  autoComplete?: string;
  disabled?: boolean;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className={prefix ? "input-prefix" : undefined}>
        {prefix ? <span aria-hidden>{prefix}</span> : null}
        <input
          id={id}
          value={value}
          maxLength={maxLength}
          autoComplete={autoComplete}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error ? (
        <small id={`${id}-error`} className="field-error" role="alert">
          {error}
        </small>
      ) : null}
    </div>
  );
}
