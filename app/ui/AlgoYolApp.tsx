"use client";

import { useCallback, useEffect, useState } from "react";
import { AuthPage, readStoredToken, storeToken } from "./AuthPage";
import { AccountPage } from "./AccountPage";
import { AdminConsole } from "./AdminConsole";
import { DuelPage } from "./DuelPage";
import { HomeDashboard } from "./HomeDashboard";
import { Leaderboard } from "./Leaderboard";
import { notifySessionChanged } from "./LearningContext";
import { ProblemBank } from "./ProblemBank";
import { PublicHome } from "./PublicHome";
import { Placement } from "./Placement";
import { RoadmapExperience } from "./RoadmapExperience";
import { RoadmapHub } from "./RoadmapHub";
import { problems, type BankProblem } from "./problem-data";
import { roadmapCatalog } from "./roadmap-data";

export type Lang = "uz" | "en";
export type Role = "user" | "admin" | "owner";
export type Profile = {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  preferred_language: Lang;
  role: Role;
  duel_rating: number;
  peak_duel_rating: number;
  solved_count: number;
  onboarding_completed_at: string | null;
  suspended_until: string | null;
};

type View = "home" | "roadmaps" | "roadmap" | "problems" | "duel" | "leaderboard" | "account" | "auth" | "placement" | "admin";

const navigation: Array<{ view: View; uz: string; en: string }> = [
  { view: "home", uz: "Bosh sahifa", en: "Home" },
  { view: "roadmaps", uz: "Yo‘l xaritalari", en: "Roadmaps" },
  { view: "problems", uz: "Masalalar", en: "Problems" },
  { view: "duel", uz: "Duel", en: "Duel" },
  { view: "leaderboard", uz: "Reyting", en: "Leaderboard" },
];

async function fetchSession(token: string): Promise<Profile> {
  const response = await fetch("/api/session", {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const payload = await response.json() as { profile?: Profile; error?: string };
  if (!response.ok || !payload.profile) throw new Error(payload.error || "Session is unavailable.");
  return payload.profile;
}

export function AlgoYolApp() {
  const [lang, setLang] = useState<Lang>("uz");
  const [view, setView] = useState<View>("home");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sessionStatus, setSessionStatus] = useState<"idle" | "loading" | "ready" | "guest" | "error">("idle");
  const [sessionNotice, setSessionNotice] = useState("");
  const [selectedRoadmap, setSelectedRoadmap] = useState("foundations");
  const [selectedProblem, setSelectedProblem] = useState<BankProblem | null>(null);
  const [activeUnitKey, setActiveUnitKey] = useState<string | null>(null);

  const go = useCallback((next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const loadSession = useCallback(async (token: string) => {
    setSessionStatus("loading");
    setSessionNotice("");
    try {
      const next = await fetchSession(token);
      setProfile(next);
      setLang(next.preferred_language || "uz");
      setSessionStatus("ready");
      if (!next.onboarding_completed_at) setView("placement");
      notifySessionChanged();
    } catch (caught) {
      setProfile(null);
      setSessionStatus("error");
      setSessionNotice(caught instanceof Error ? caught.message : "Session is unavailable.");
    }
  }, []);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const oauthToken = params.get("access_token");
      const oauthError = params.get("error_description");
      if (oauthToken) {
        storeToken(oauthToken, false);
        window.history.replaceState({}, "", window.location.pathname);
        setView("account");
        void loadSession(oauthToken);
        return;
      }
      if (oauthError) {
        setView("auth");
        setSessionNotice(decodeURIComponent(oauthError.replace(/\+/g, " ")));
        window.history.replaceState({}, "", window.location.pathname);
        return;
      }
      const token = readStoredToken();
      if (token) void loadSession(token);
      else setSessionStatus("guest");
    });
    return () => { active = false; };
  }, [loadSession]);

  const signOut = () => {
    sessionStorage.removeItem("algoyol-access-token");
    localStorage.removeItem("algoyol-remember-token");
    setProfile(null);
    setSessionStatus("guest");
    setSessionNotice("");
    notifySessionChanged();
    go("home");
  };

  const requireAuth = () => {
    setSessionNotice(lang === "uz" ? "Davom etish uchun tizimga kiring." : "Sign in to continue.");
    go("auth");
  };

  const openRoadmap = (slug: string) => {
    setSelectedRoadmap(slug);
    go("roadmap");
  };

  const practiceUnit = (unitId: string) => {
    const unit = roadmapCatalog.flatMap((roadmap) => roadmap.units).find((item) => item.id === unitId);
    const problem = unit?.problemId ? problems.find((item) => item.id === unit.problemId || item.judge === unit.problemId) : null;
    setActiveUnitKey(unitId);
    setSelectedProblem(problem || null);
    go("problems");
  };

  const changeLanguage = () => setLang((current) => current === "uz" ? "en" : "uz");
  const navLabel = (item: typeof navigation[number]) => lang === "uz" ? item.uz : item.en;
  const signedIn = sessionStatus === "ready" && Boolean(profile);

  return <div className="shell">
    <a className="skip-link" href="#main-content">{lang === "uz" ? "Asosiy kontentga o‘tish" : "Skip to main content"}</a>
    <header className="topbar">
      <button className="brand brand-button" onClick={() => go("home")} aria-label={lang === "uz" ? "AlgoYo‘l bosh sahifasi" : "AlgoYo‘l home"}><span className="brandmark" aria-hidden="true">A›</span>AlgoYo‘l</button>
      <nav className="nav" aria-label={lang === "uz" ? "Asosiy navigatsiya" : "Primary navigation"}>
        {navigation.map((item) => <button key={item.view} className={view === item.view ? "active" : ""} aria-current={view === item.view ? "page" : undefined} onClick={() => go(item.view)}>{navLabel(item)}</button>)}
      </nav>
      <div className="actions">
        <button className="lang" onClick={changeLanguage} aria-label={lang === "uz" ? "Tilni inglizchaga almashtirish" : "Switch language to Uzbek"}>{lang === "uz" ? "EN" : "UZ"}</button>
        <button className="pill" onClick={() => go(signedIn ? "account" : "auth")}>{signedIn ? (lang === "uz" ? "Profil" : "Profile") : (lang === "uz" ? "Kirish" : "Sign in")}</button>
        <button className="primary" onClick={() => go("duel")}>{lang === "uz" ? "Duel topish" : "Find duel"}</button>
      </div>
    </header>

    <main id="main-content" className="main" tabIndex={-1}>
      {sessionStatus === "error" && view !== "auth" ? <div className="notice error" role="alert">{sessionNotice}</div> : null}
      {view === "home" && (signedIn && profile
        ? <HomeDashboard lang={lang} go={(next) => go(next as View)} openRoadmap={openRoadmap} duelRating={profile.duel_rating} />
        : <PublicHome lang={lang} go={go} openRoadmap={openRoadmap} />)}
      {view === "roadmaps" ? <RoadmapHub lang={lang} openRoadmap={openRoadmap} /> : null}
      {view === "roadmap" ? <RoadmapExperience slug={selectedRoadmap} lang={lang} onBack={() => go("roadmaps")} onPractice={practiceUnit} onRequireAuth={requireAuth} /> : null}
      {view === "problems" ? <ProblemBank lang={lang} selected={selectedProblem} onSelect={setSelectedProblem} activeUnitKey={activeUnitKey} requireAuth={requireAuth} /> : null}
      {view === "duel" ? <DuelPage lang={lang} profile={profile} requireAuth={requireAuth} /> : null}
      {view === "leaderboard" ? <Leaderboard lang={lang} currentUserId={profile?.id || null} /> : null}
      {view === "account" ? <AccountPage lang={lang} profile={profile} loading={sessionStatus === "loading"} signOut={signOut} requireAuth={requireAuth} startPlacement={() => go("placement")} openAdmin={() => go("admin")} /> : null}
      {view === "placement" ? <Placement lang={lang} onFinish={() => go("roadmaps")} onRoadmap={openRoadmap} /> : null}
      {view === "admin" ? profile && profile.role !== "user" ? <AdminConsole lang={lang} profile={profile} /> : <div className="notice error" role="alert">{lang === "uz" ? "Bu sahifa uchun ruxsat yo‘q." : "You do not have permission to view this page."}</div> : null}
      {view === "auth" ? <AuthPage lang={lang} notice={sessionNotice} done={(token) => { if (!token) return; setView("account"); void loadSession(token); }} /> : null}
    </main>

    <nav className="mobile-nav" aria-label={lang === "uz" ? "Mobil navigatsiya" : "Mobile navigation"}>
      {navigation.map((item) => <button key={item.view} className={view === item.view ? "active" : ""} aria-current={view === item.view ? "page" : undefined} onClick={() => go(item.view)}>{navLabel(item)}</button>)}
    </nav>
    <footer className="footer"><span>© 2026 AlgoYo‘l · Toshkent</span><span>{lang === "uz" ? "Bilimdan natijagacha." : "From learning to results."}</span></footer>
  </div>;
}
