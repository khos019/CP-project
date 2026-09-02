"use client";

import { useEffect, useMemo, useState } from "react";
import { roadmapCatalog } from "./roadmap-data";
import { roadmapStatus, unitDone } from "./RoadmapHub";
import { loadMastery, masteryLabel } from "./mastery";
import { emptyProgress, loadProgress, type Progress } from "./progress";
import { can } from "./permissions";
import type { Profile, Role } from "./session";

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
const T = {
  uz: {
    continueEyebrow: "Davom ettirish",
    startEyebrow: "Boshlang",
    startTitle: "Birinchi bosqichdan boshlang",
    startBody: "Yo‘l xaritangiz tayyor. Birinchi mavzuni oching va o‘rganishni boshlang.",
    next: "Keyingi bosqich",
    open: "Davom ettirish",
    startCta: "Yo‘l xaritasini ochish",
    allRoadmaps: "Barcha yo‘nalishlar",
    doneOf: "bosqich tugatildi",
    rating: "Duel reytingi",
    findRival: "Raqib topish",
    mastery: "Mavzu mahorati",
    viewProfile: "Profilni ko‘rish",
    allDone: "Barcha bosqichlar tugatildi. Duelda sinab ko‘ring!",
  },
  en: {
    continueEyebrow: "Continue learning",
    startEyebrow: "Get started",
    startTitle: "Start with the first unit",
    startBody: "Your roadmap is ready. Open the first topic and begin.",
    next: "Next unit",
    open: "Continue",
    startCta: "Open the roadmap",
    allRoadmaps: "All tracks",
    doneOf: "units completed",
    rating: "Duel rating",
    findRival: "Find an opponent",
    mastery: "Topic mastery",
    viewProfile: "View profile",
    allDone: "Every unit is done. Put it to the test in the arena.",
  },
};

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
    const statuses = new Map(roadmapCatalog.map((r) => [r.slug, roadmapStatus(r, progress, canReviewAll)]));
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

  return (
    <section className="hero">
      <div className="hero-copy ch-copy">
        <div className="eyebrow">{started ? t.continueEyebrow : t.startEyebrow}</div>
        <h1>{started ? title : t.startTitle}</h1>
        <p className="ch-track">
          <span className="ch-ic" style={{ background: active.color }} aria-hidden>
            {active.icon}
          </span>
          {lang === "uz" ? active.titleUz : active.titleEn}
          <span className="ch-sep" aria-hidden>
            ·
          </span>
          <span className="mono">
            {doneInActive}/{active.units.length}
          </span>{" "}
          {t.doneOf}
        </p>
        {!started && <p className="ch-lede">{t.startBody}</p>}
        {!nextUnit && started && <p className="ch-lede">{t.allDone}</p>}
        <div className="progress ch-progress">
          <span style={{ width: `${pct}%` }} />
        </div>
        <div className="hero-cta">
          <button className="primary" onClick={() => openRoadmap(active.slug)}>
            {started ? t.open : t.startCta}
          </button>
          <button className="secondary" onClick={() => go("roadmaps")}>
            {t.allRoadmaps}
          </button>
        </div>
        <div className="orbit" />
      </div>

      <div className="hero-side">
        <div className="stat-card ch-stat">
          <span className="eyebrow">{t.rating}</span>
          <span className="big mono">{profile.duel_rating}</span>
          <button className="secondary ch-stat-btn" onClick={() => go("duel")}>
            {t.findRival}
          </button>
        </div>
        <div className="stat-card ch-stat">
          <span className="eyebrow">{t.mastery}</span>
          <span className="big mono">
            {doneTotal}
            <small className="ch-dim">/{totalUnits}</small>
          </span>
          <span className="muted ch-stat-note">
            {topRoadmap && topScore > 0
              ? `${lang === "uz" ? topRoadmap.titleUz : topRoadmap.titleEn} · ${masteryLabel(topScore, lang)}`
              : lang === "uz"
                ? "Hali mahorat isboti yo‘q"
                : "No mastery evidence yet"}
          </span>
          <button className="secondary ch-stat-btn" onClick={() => go("profile")}>
            {t.viewProfile}
          </button>
        </div>
      </div>
    </section>
  );
}
