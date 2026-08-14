"use client";

import { problems } from "./problem-data";
import { roadmapCards } from "./roadmap-data";
import type { Lang } from "./AlgoYolApp";

type PublicView = "home" | "roadmaps" | "roadmap" | "problems" | "duel" | "leaderboard" | "account" | "auth" | "placement" | "admin";

export function PublicHome({ lang, go, openRoadmap }: { lang: Lang; go: (view: PublicView) => void; openRoadmap: (slug: string) => void }) {
  return <>
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">{lang === "uz" ? "O‘zbekiston dasturchilari uchun" : "Built for Uzbekistan’s coders"}</p>
        <h1>{lang === "uz" ? <>Algoritmlarni <em>o‘rganing</em>, mashq qiling va o‘sing.</> : <>Learn algorithms, <em>practice</em>, and grow.</>}</h1>
        <p>{lang === "uz" ? "Tushunarli o‘zbekcha darslar, tekshiriladigan kod masalalari va bilimni mavzu bo‘yicha ko‘rsatadigan bitta o‘quv yo‘li." : "Clear lessons, verified coding problems, and one learning path that measures skill topic by topic."}</p>
        <div className="hero-cta"><button className="primary" onClick={() => go("roadmaps")}>{lang === "uz" ? "O‘rganishni boshlash" : "Start learning"} →</button><button className="secondary" onClick={() => go("problems")}>{lang === "uz" ? "Masalalarni ko‘rish" : "Explore problems"}</button></div>
        <div className="orbit" aria-hidden="true" />
      </div>
      <div className="hero-side">
        <article className="stat-card"><span className="eyebrow">{lang === "uz" ? "Tuzilgan dastur" : "Structured curriculum"}</span><span className="big">{roadmapCards.length}</span><p className="muted">{lang === "uz" ? "Boshlang‘ich mavzulardan olimpiada algoritmlarigacha." : "From foundations to olympiad algorithms."}</p></article>
        <article className="stat-card duel"><span className="eyebrow">{lang === "uz" ? "Tekshiriladigan masalalar" : "Verified problems"}</span><span className="big">{problems.filter((problem) => problem.judge).length}</span><p>{lang === "uz" ? "Server testlari ulangan amaliy topshiriqlar." : "Practice tasks connected to server-side tests."}</p></article>
      </div>
    </section>
    <section>
      <div className="section-head"><div><p className="eyebrow">{lang === "uz" ? "Bosqichma-bosqich" : "Step by step"}</p><h2>{lang === "uz" ? "Yo‘l xaritalari" : "Learning roadmaps"}</h2></div><button className="secondary" onClick={() => go("roadmaps")}>{lang === "uz" ? "Barchasini ko‘rish" : "View all"} →</button></div>
      <div className="grid">{roadmapCards.slice(0, 3).map((roadmap) => <button className="road-card text-left" key={roadmap.slug} onClick={() => openRoadmap(roadmap.slug)}><span className="road-icon" style={{ background: roadmap.color }}>{roadmap.icon}</span><h3>{lang === "uz" ? roadmap.uz : roadmap.en}</h3><p className="muted">{lang === "uz" ? roadmap.descUz : roadmap.descEn}</p><div className="meta"><span>{roadmap.units} {lang === "uz" ? "bosqich" : "units"}</span><span>→</span></div></button>)}</div>
    </section>
  </>;
}
