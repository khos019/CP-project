"use client";

import { useLearning } from "./LearningContext";
import { masteryLabel } from "./mastery";
import { roadmapCatalog } from "./roadmap-data";
import type { Lang, Profile } from "./AlgoYolApp";

export function AccountPage({ lang, profile, loading, signOut, requireAuth, startPlacement, openAdmin }: { lang: Lang; profile: Profile | null; loading: boolean; signOut: () => void; requireAuth: () => void; startPlacement: () => void; openAdmin: () => void }) {
  const { mastery, masteryConfig } = useLearning();
  if (loading) return <div className="notice" role="status">{lang === "uz" ? "Profil yuklanmoqda…" : "Loading profile…"}</div>;
  if (!profile) return <div className="panel empty-state"><h1>{lang === "uz" ? "Profil topilmadi" : "Profile unavailable"}</h1><button className="primary" onClick={requireAuth}>{lang === "uz" ? "Tizimga kirish" : "Sign in"}</button></div>;
  const scores = roadmapCatalog.map((roadmap) => mastery.scores[roadmap.slug] || 0);
  const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  return <>
    {!profile.onboarding_completed_at ? <div className="notice placement-callout"><b>{lang === "uz" ? "Darajangizni aniqlang." : "Find your starting level."}</b> {lang === "uz" ? "Placement siz bilgan mavzularni qayta o‘qimaslikka yordam beradi." : "Placement helps you skip material you already know."} <button className="secondary" onClick={startPlacement}>{lang === "uz" ? "Boshlash" : "Start"}</button></div> : null}
    <div className="page-head"><div><p className="eyebrow">{lang === "uz" ? "Shaxsiy natijalar" : "Personal results"}</p><h1 className="page-title">{profile.display_name || profile.username}</h1><p className="muted">@{profile.username} · {profile.email}</p></div><div className="actions"><span className={`tag role-${profile.role}`}>{profile.role.toUpperCase()}</span>{profile.role !== "user" ? <button className="secondary" onClick={openAdmin}>{lang === "uz" ? "Boshqaruv" : "Manage"}</button> : null}<button className="secondary" onClick={signOut}>{lang === "uz" ? "Chiqish" : "Sign out"}</button></div></div>
    <div className="profile-grid"><section className="panel profile-card"><div className="profile-avatar" aria-hidden="true">{(profile.display_name || profile.username || "A").slice(0, 1).toUpperCase()}</div><h2>{profile.display_name || profile.username}</h2><p className="muted">{masteryLabel(average, lang, masteryConfig)}</p><div className="kpis"><div className="kpi"><b>{profile.duel_rating}</b><small>ELO</small></div><div className="kpi"><b>{profile.solved_count}</b><small>{lang === "uz" ? "Yechim" : "Solves"}</small></div><div className="kpi"><b>{average}</b><small>{lang === "uz" ? "Mahorat" : "Mastery"}</small></div></div></section><section className="panel"><h2>{lang === "uz" ? "Hisob holati" : "Account status"}</h2><div className="status-line"><b>{lang === "uz" ? "Eng yuqori duel reytingi" : "Peak duel rating"}</b><span className="rating">{profile.peak_duel_rating}</span></div><div className="status-line"><b>{lang === "uz" ? "Boshlang‘ich baholash" : "Placement"}</b><span>{profile.onboarding_completed_at ? (lang === "uz" ? "Tugallangan" : "Completed") : (lang === "uz" ? "Boshlanmagan" : "Not started")}</span></div></section></div>
  </>;
}
