"use client";

import { useEffect, useMemo, useState } from "react";
import { tr, catalogue } from "./i18n";
import { roadmapCatalog } from "./roadmap-data";
import { roadmapStatus, unitDone } from "./RoadmapHub";
import { loadMastery, masteryLabel } from "./mastery";
import { emptyProgress, loadProgress, type Progress } from "./progress";
import { can } from "./permissions";
import type { Profile, Role } from "./session";
import { nextRank, rankOf } from "./rating";

type Lang = "uz" | "en";

/* The signed-in home used to swap the whole page for a two-panel "growth
   dashboard" whose six class names had no CSS at all, so it rendered as
   unspaced blocks with the button jammed against its own label.
 *
 * Rather than restyle a second, competing layout, the signed-in home now keeps
 * the guest page exactly as it is and swaps only the hero: the marketing pitch
 * becomes the learner's own next step, in the same slot, at the same size, in
 * the same shape. One page, one structure, two states.
 *
 * Topic mastery and the activity feed are not duplicated here — the profile
 * already presents both properly, and this hero links to it. */
const T = catalogue("continueHero");

export function ContinueHero({
  lang,
  profile,
  go,
  openRoadmap,
}: {
  lang: Lang;
  profile: Profile;
  go: (v: string) => void;
  openRoadmap: (slug: string) => void;
}) {
  const t = T[lang];
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [mastery, setMastery] = useState<ReturnType<typeof loadMastery>>({
    scores: {},
    evidence: {},
    unlocks: {},
    validated: {},
  });
  const canReviewAll = can((profile.role || "user") as Role, "roadmap.manage");

  useEffect(() => {
    let live = true;
    const read = () => {
      setMastery(loadMastery());
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

  const view = useMemo(() => {
    const statuses = new Map(roadmapCatalog.map((r) => [r.slug, roadmapStatus(r, progress, mastery, canReviewAll)]));
    const active =
      roadmapCatalog.find((r) => statuses.get(r.slug) === "in-progress") ||
      roadmapCatalog.find((r) => statuses.get(r.slug) === "available") ||
      roadmapCatalog[0];
    const nextUnit = active.units.find((u) => !unitDone(progress, u)) || null;
    const doneInActive = active.units.filter((u) => unitDone(progress, u)).length;
    const allUnits = roadmapCatalog.flatMap((r) => r.units);
    const doneTotal = allUnits.filter((u) => unitDone(progress, u)).length;
    const started = doneTotal > 0 || Object.values(mastery.scores).some((s) => s > 0);
    const topScore = Math.max(0, ...Object.values(mastery.scores));
    const topSlug = Object.entries(mastery.scores).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topRoadmap = roadmapCatalog.find((r) => r.slug === topSlug);
    return { active, nextUnit, doneInActive, doneTotal, totalUnits: allUnits.length, started, topScore, topRoadmap };
  }, [progress, mastery, canReviewAll]);

  const { active, nextUnit, doneInActive, doneTotal, totalUnits, started, topScore, topRoadmap } = view;
  const pct = Math.round((doneInActive / active.units.length) * 100);
  const title = nextUnit
    ? lang === "uz"
      ? nextUnit.titleUz
      : nextUnit.titleEn
    : lang === "uz"
      ? active.titleUz
      : active.titleEn;

  const uz = lang === "uz";
  const rank = rankOf(profile.duel_rating);
  const next = nextRank(profile.duel_rating);
  const rankPct = next ? Math.max(4, Math.min(100, ((profile.duel_rating - rank.min) / (next.rank.min - rank.min)) * 100)) : 100;
  const firstName = (profile.display_name?.trim() || profile.username).split(/\s+/)[0];
  const overall = totalUnits ? doneTotal / totalUnits : 0;
  // A ring for overall progress: 2πr with r=26.
  const C = 2 * Math.PI * 26;
  const quick: { to: string; label: string; d: string }[] = [
    { to: "problems", label: uz ? "Masalalar" : "Problems", d: "M9 11l2 2 4-4M5 4h14v16H5zM9 4v2h6V4" },
    { to: "duel", label: uz ? "Duel" : "Duel", d: "M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M14.5 6.5 18 3h3v3l-3.5 3.5M5 14l4 4M7 17l-3 3" },
    { to: "contests", label: uz ? "Kontestlar" : "Contests", d: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" },
    { to: "playground", label: uz ? "Kompilyator" : "Compiler", d: "m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" },
  ];

  return (
    <>
      <p className="dh-greet">{uz ? `Xush kelibsiz, ${firstName}` : `Welcome back, ${firstName}`} <span aria-hidden>👋</span></p>
      <section className="dh">
        {/* The next step, tinted with its own track's colour. */}
        <div className="dh-continue" style={{ ["--track" as string]: active.color }}>
          <div className="dh-continue-top">
            <span className="dh-track-ic" aria-hidden>{active.icon}</span>
            <span className="dh-track">
              <small>{started ? t.continueEyebrow : t.startEyebrow}</small>
              <b>{lang === "uz" ? active.titleUz : active.titleEn}</b>
            </span>
            <span className="dh-pct mono">{pct}%</span>
          </div>
          <h1>{started ? title : t.startTitle}</h1>
          {!started && <p className="dh-lede">{t.startBody}</p>}
          {!nextUnit && started && <p className="dh-lede">{t.allDone}</p>}
          <div className="dh-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${pct}%` }} />
          </div>
          <div className="dh-continue-foot">
            <span className="muted"><span className="mono">{doneInActive}/{active.units.length}</span> {t.doneOf}</span>
            <span className="dh-actions">
              <button className="secondary" onClick={() => go("roadmaps")}>{t.allRoadmaps}</button>
              <button className="primary" onClick={() => openRoadmap(active.slug)}>{started ? t.open : t.startCta} →</button>
            </span>
          </div>
        </div>

        <div className="dh-side">
          <div className="dh-stat" style={{ ["--rank" as string]: rank.color }}>
            <span className="dh-stat-head"><small>{t.rating}</small><i className="dh-rank">{uz ? rank.nameUz : rank.nameEn}</i></span>
            <b className="mono dh-rating">{profile.duel_rating}</b>
            <span className="dh-next">
              <span className="dh-next-bar"><i style={{ width: `${rankPct}%` }} /></span>
              <small>{next ? (uz ? `${next.gap} ball → ${next.rank.nameUz}` : `${next.gap} to ${next.rank.nameEn}`) : "—"}</small>
            </span>
            <button className="secondary dh-stat-btn" onClick={() => go("duel")}>{t.findRival}</button>
          </div>
          <div className="dh-stat dh-stat-mastery">
            <svg className="dh-ring" viewBox="0 0 64 64" aria-hidden>
              <circle cx="32" cy="32" r="26" />
              <circle cx="32" cy="32" r="26" className="on" strokeDasharray={C} strokeDashoffset={C * (1 - overall)} />
            </svg>
            <span className="dh-ring-copy">
              <small>{t.mastery}</small>
              <b className="mono">{doneTotal}<span className="ch-dim">/{totalUnits}</span></b>
              <span className="muted dh-note">
                {topRoadmap && topScore > 0
                  ? `${lang === "uz" ? topRoadmap.titleUz : topRoadmap.titleEn} · ${masteryLabel(topScore, lang)}`
                  : tr(lang,"continueHero.hali_mahorat_isboti_yoq")}
              </span>
              <button className="dh-link" onClick={() => go("profile")}>{t.viewProfile} →</button>
            </span>
          </div>
        </div>
      </section>

      <nav className="dh-quick" aria-label={uz ? "Tezkor havolalar" : "Quick links"}>
        {quick.map((q) => (
          <a key={q.to} href={`/${q.to}`} onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); go(q.to); }}>
            <span className="dh-quick-ic" aria-hidden><svg viewBox="0 0 24 24"><path d={q.d} /></svg></span>
            {q.label}
            <span className="dh-quick-go" aria-hidden>→</span>
          </a>
        ))}
      </nav>
    </>
  );
}
