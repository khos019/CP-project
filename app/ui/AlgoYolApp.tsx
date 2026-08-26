"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RoadmapExperience } from "./RoadmapExperience";
import { RoadmapHub } from "./RoadmapHub";
import { roadmapCards } from "./roadmap-data";
import { Placement } from "./Placement";
import { AuthPage } from "./AuthPage";
import { HomeDashboard } from "./HomeDashboard";
import { BrandMark } from "./BrandMark";
import { ProfilePage } from "./ProfilePage";
import { MASTERY_CONFIG, backfillMastery, loadMastery, masteryOf, recordDuelResult, recordEvidence } from "./mastery";
import { loadProgress, readLocal as readLocalProgress, syncUp } from "./progress";
import { can } from "./permissions";
import {
 GUEST_SCOPE, adoptGuestInto, adoptLegacyInto, clearSession, dropScopeData, fetchLeaderboard, fetchLearnerCount,
 fetchProfile, readScoped, readStoredUserId, readToken, removeScoped, saveDuelRating, setScope, storeSession,
 supabaseReady, writeScoped, type LeaderRow, type Profile, type Role,
} from "./session";

type Lang="uz"|"en"; type View="home"|"roadmaps"|"roadmap"|"problems"|"problem"|"duel"|"leaderboard"|"profile"|"auth"|"admin"|"placement";
const copy={uz:{home:"Bosh sahifa",roadmaps:"Yo‘l xaritalari",problems:"Masalalar",duel:"Duel",leaderboard:"Reyting",login:"Kirish",hero:"Algoritmlarni o‘rganing, bellashing va o‘sing.",sub:"Tushunarli o‘zbekcha darslar, haqiqiy kod tekshiruvchi va 30 daqiqalik jonli duellar — barchasi bitta maydonda.",start:"O‘rganishni boshlash",arena:"Duel maydoni",featured:"Mashhur yo‘l xaritalari",all:"Barchasini ko‘rish",tasks:"Masalalar banki",solve:"Yechish",submit:"Yechimni yuborish"},en:{home:"Home",roadmaps:"Roadmaps",problems:"Problems",duel:"Duel",leaderboard:"Leaderboard",login:"Sign in",hero:"Learn algorithms, compete, and grow.",sub:"Clear lessons, a real code checker, and live 30-minute duels — all in one focused arena.",start:"Start learning",arena:"Enter duel arena",featured:"Featured roadmaps",all:"View all",tasks:"Problem library",solve:"Solve",submit:"Submit solution"}};
const allRoads=roadmapCards;
const roadmapCatalogSize=()=>({tracks:roadmapCards.length,units:roadmapCards.reduce((n,r)=>n+r.units,0)});
const problems=[
 {id:"A01",uz:"Ikki son yig‘indisi",en:"Sum of two numbers",difficulty:"easy",tag:"Boshlang‘ich",points:100,topic:"programming-basics",judge:"sum-two"},
 {id:"A02",uz:"Eng katta element",en:"Maximum element",difficulty:"easy",tag:"Massiv",points:100,topic:"foundations"},
 {id:"A03",uz:"Juftlar soni",en:"Count the evens",difficulty:"easy",tag:"Massiv",points:100,topic:"foundations"},
 {id:"B04",uz:"Eng katta qism-yig‘indi",en:"Maximum subarray sum",difficulty:"medium",tag:"Massiv",points:200,topic:"foundations",judge:"max-subarray"},
 {id:"B01",uz:"Yashirin son",en:"Hidden number",difficulty:"medium",tag:"Binary search",points:200,topic:"binary-search"},
 {id:"B02",uz:"Bekatlar",en:"Bus stops",difficulty:"medium",tag:"Greedy",points:200,topic:"greedy"},
 {id:"B03",uz:"Labirint yo‘li",en:"Maze path",difficulty:"medium",tag:"BFS",points:200,topic:"graphs"},
 {id:"C04",uz:"Minimal tangalar",en:"Minimum coins",difficulty:"hard",tag:"DP",points:300,topic:"dynamic-programming",judge:"coin-change"},
 {id:"C01",uz:"Qadimiy daraxt",en:"Ancient tree",difficulty:"hard",tag:"Graph",points:300,topic:"graphs"},
 {id:"C02",uz:"Tanga strategiyasi",en:"Coin strategy",difficulty:"hard",tag:"DP",points:300,topic:"dynamic-programming"},
 {id:"C03",uz:"Eng uzun yo‘l",en:"Longest route",difficulty:"hard",tag:"DAG",points:300,topic:"graphs"},
];
type BankProblem=typeof problems[number];
const duelTopics:Record<string,string>={"sum-two":"programming-basics","max-subarray":"foundations","coin-change":"dynamic-programming"};
const cpp=`#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long a, b;\n    cin >> a >> b;\n    cout << a + b << "\\n";\n    return 0;\n}`;

/* Session, profile and role handling live in ./session — one module owns the
   difference between a guest and an account. Re-exported so existing imports
   ({ Role } from "./AlgoYolApp") keep resolving. */
export type { Role, Profile } from "./session";
export { supabaseConfig, supabaseReady, fetchProfile } from "./session";

/* Three states, never guessed: a stored token is being verified, there is no
   account, or there is one. "authenticated" always carries a real profile. */
type Auth={status:"loading"}|{status:"guest"}|{status:"authenticated";profile:Profile};

const roleLabel=(role:Role,lang:Lang)=>role==="owner"?(lang==="uz"?"EGA (OWNER)":"OWNER"):role==="admin"?"ADMIN":(lang==="uz"?"FOYDALANUVCHI":"USER");

export function AlgoYolApp(){
 const [lang,setLang]=useState<Lang>("uz"),[view,setView]=useState<View>("home"),[filter,setFilter]=useState("all"),[code,setCode]=useState(cpp),[codeLang,setCodeLang]=useState<"cpp20"|"python3">("cpp20"),[verdict,setVerdict]=useState(""),[selectedRoadmap,setSelectedRoadmap]=useState("foundations"),[selectedUnit,setSelectedUnit]=useState<string|null>(null),[activeProblem,setActiveProblem]=useState<BankProblem>(problems[0]); const t=copy[lang];
 // A stored token is not proof of an account: it can be expired or revoked.
 // The app stays in "loading" until Supabase confirms it, then commits to
 // exactly one of guest / authenticated. It never renders account-shaped UI
 // on the strength of a token alone.
 // The first render must be identical on the server and in the browser. The
 // server has no session (the token lives in sessionStorage, not a cookie), so
 // both start as "guest"; the effect below promotes to "loading" on the very
 // next tick when a stored token exists. Deriving the initial value from
 // readToken() made the two disagree and threw a hydration error.
 const [auth,setAuth]=useState<Auth>({status:"guest"});
 const [authNotice,setAuthNotice]=useState("");
 const profile=auth.status==="authenticated"?auth.profile:null;
 const signed=auth.status==="authenticated";
 const role:Role=profile?.role||"user";

 /* Signing out clears the account's local namespace, so a later sign-in on the
    same browser starts empty. Quiz scores and solves live on the account
    (unit_progress), so mastery is re-derived from that recorded evidence
    instead of being lost — nothing is invented, and a topic the learner never
    touched stays at zero. */
 const hydrateAccountState=async()=>{
  const progress=await loadProgress();
  backfillMastery(progress);
  window.dispatchEvent(new Event("algoyol-progress"));
 };

 useEffect(()=>{const saved=localStorage.getItem("algoyol-lang") as Lang|null;if(saved)setLang(saved)},[]);
 // Boot: adopt the stored scope synchronously so the first paint reads the
 // right namespace, then verify the token.
 useEffect(()=>{
  const token=readToken(),storedId=readStoredUserId();
  if(storedId)setScope(storedId);
  if(!token||!supabaseReady()){setScope(GUEST_SCOPE);adoptLegacyInto(GUEST_SCOPE);return}
  setAuth({status:"loading"});
  let live=true;
  fetchProfile(token).then(next=>{
   if(!live)return;
   if(!next){clearSession();setScope(GUEST_SCOPE);setAuth({status:"guest"});return}
   setScope(next.id);adoptLegacyInto(next.id);
   setAuth({status:"authenticated",profile:next});
   void hydrateAccountState();
  });
  return()=>{live=false};
 },[]);
 useEffect(()=>{if(!verdict.startsWith("Qabul qilindi")&&!verdict.startsWith("Accepted"))return;if(activeProblem.judge){const base=MASTERY_CONFIG.weights.problem[activeProblem.difficulty as keyof typeof MASTERY_CONFIG.weights.problem];recordEvidence(activeProblem.topic,"problem",`problem:${activeProblem.id}`,base)}const lesson=readScoped("algoyol-active-lesson");if(!lesson)return;let data={quizScores:{},solved:{}} as {quizScores:Record<string,number>;solved:Record<string,boolean>};try{data=JSON.parse(readScoped("algoyol-roadmap-progress")||JSON.stringify(data))}catch{}if(!data.solved[lesson])recordEvidence(lesson.slice(0,lesson.lastIndexOf("-")),"lesson",`lesson:${lesson}`,MASTERY_CONFIG.weights.lesson);data.solved={...data.solved,[lesson]:true};writeScoped("algoyol-roadmap-progress",JSON.stringify(data));removeScoped("algoyol-active-lesson");window.dispatchEvent(new Event("algoyol-progress"))},[verdict]);// eslint-disable-line react-hooks/exhaustive-deps
 // The address bar reflects the current screen — /roadmaps/{slug}/{unit} —
 // so two roadmaps (or two units) are never one indistinguishable URL.
 const screenToPath=(s:{view:View;roadmap:string;unit:string|null}):string=>{
  if(s.view==="home")return "/";
  if(s.view==="roadmaps")return "/roadmaps";
  if(s.view==="roadmap")return s.unit?`/roadmaps/${s.roadmap}/${s.unit}`:`/roadmaps/${s.roadmap}`;
  return `/${s.view}`;
 };
 const pathToScreen=(path:string):{view:View;roadmap:string;unit:string|null}=>{
  const parts=path.split("/").filter(Boolean);
  if(parts[0]==="roadmaps"&&parts[1])return {view:"roadmap",roadmap:parts[1],unit:parts[2]||null};
  const known:View[]=["home","roadmaps","problems","problem","duel","leaderboard","profile","auth","placement","admin"];
  const v=known.find(x=>x===parts[0]);
  return {view:v||"home",roadmap:"foundations",unit:null};
 };
 const screenRef=useRef<{view:View;roadmap:string;unit:string|null}>(typeof window==="undefined"?{view:"home",roadmap:"foundations",unit:null}:pathToScreen(window.location.pathname)),navDepth=useRef(0);
 const applyScreen=(s:{view:View;roadmap:string;unit:string|null})=>{screenRef.current=s;setView(s.view);setSelectedRoadmap(s.roadmap);setSelectedUnit(s.unit)};
 const pushScreen=(patch:Partial<{view:View;roadmap:string;unit:string|null}>)=>{const next={...screenRef.current,...patch};applyScreen(next);window.history.pushState(next,"",screenToPath(next));navDepth.current++;window.scrollTo({top:0,behavior:"smooth"})};
 const go=(v:View)=>pushScreen({view:v,unit:null});
 const back=()=>{if(navDepth.current>0)window.history.back();else pushScreen({view:"roadmaps",unit:null})};
 // Browser back/forward: each screen change pushes an entry, popstate restores it.
 useEffect(()=>{applyScreen(screenRef.current);window.history.replaceState(screenRef.current,"",screenToPath(screenRef.current));const onPop=(e:PopStateEvent)=>{const st=e.state as {view:View;roadmap:string;unit:string|null}|null;applyScreen(st&&typeof st==="object"&&"view" in st?st:pathToScreen(window.location.pathname));navDepth.current=Math.max(0,navDepth.current-1)};window.addEventListener("popstate",onPop);return()=>window.removeEventListener("popstate",onPop)},[]); const applyLang=(n:Lang)=>{setLang(n);localStorage.setItem("algoyol-lang",n)};
 const swap=()=>applyLang(lang==="uz"?"en":"uz");
 const enterSession=async(token:string,remember:boolean,isNew:boolean)=>{
  setAuth({status:"loading"});
  const next=await fetchProfile(token);
  if(!next){
   // Token rejected, or the profile row is missing (a signup whose bootstrap
   // trigger failed). Either way this is not a signed-in user — say so.
   clearSession();setScope(GUEST_SCOPE);setAuth({status:"guest"});
   setAuthNotice(lang==="uz"?"Sessiya tasdiqlanmadi. Iltimos, qaytadan kiring.":"We could not verify that session. Please sign in again.");
   setView("auth");
   return;
  }
  storeSession(token,remember,next.id);
  setScope(next.id);
  adoptLegacyInto(next.id);
  // Lessons finished before registering belong to the same person — carry them
  // into the new account once, then clear the guest namespace.
  if(adoptGuestInto(next.id))void syncUp(readLocalProgress());
  setAuth({status:"authenticated",profile:next});
  setAuthNotice("");
  void hydrateAccountState();
  if(next.preferred_language&&next.preferred_language!==lang)applyLang(next.preferred_language);
  window.dispatchEvent(new Event("algoyol-progress"));
  if(isNew&&!readScoped("algoyol-onboarded"))go("placement");else go("home");
 };

 const signOut=()=>{
  // Everything the previous learner did stays with the previous learner: the
  // account namespace is removed so the next person on this browser starts clean.
  const owner=profile?.id;
  clearSession();
  if(owner)dropScopeData(owner);
  setScope(GUEST_SCOPE);
  setAuth({status:"guest"});
  setAuthNotice("");
  window.dispatchEvent(new Event("algoyol-progress"));
  pushScreen({view:"home",unit:null});
 };

 const openRoadmap=(slug:string)=>{pushScreen({view:"roadmap",roadmap:slug,unit:null})};
 // OAuth / magic-link return: the token arrives in the URL fragment.
 useEffect(()=>{const params=new URLSearchParams(window.location.hash.replace(/^#/,""));const token=params.get("access_token"),error=params.get("error_description");if(token){window.history.replaceState({},"",window.location.pathname);void enterSession(token,true,false)}else if(error){window.history.replaceState({},"",window.location.pathname);setAuthNotice(decodeURIComponent(error.replace(/\+/g," ")));setView("auth")}},[]);// eslint-disable-line react-hooks/exhaustive-deps
 const filtered=useMemo(()=>filter==="all"?problems:problems.filter(p=>p.difficulty===filter),[filter]);
 const judge=async()=>{if(!signed){setView("auth");return}if(!activeProblem.judge){setVerdict(lang==="uz"?"Bu masala uchun tekshiruvchi tez orada ulanadi":"The judge for this problem is coming soon");return}setVerdict(lang==="uz"?"Navbatda… testlar tekshirilmoqda":"In queue… running hidden tests");try{const response=await fetch("/api/judge",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({problemId:activeProblem.judge,language:codeLang,sourceCode:code})});const r=await response.json();const names:Record<string,[string,string]>={ACCEPTED:["Qabul qilindi","Accepted"],WRONG_ANSWER:["Noto‘g‘ri javob","Wrong answer"],COMPILATION_ERROR:["Kompilyatsiya xatosi","Compilation error"],RUNTIME_ERROR:["Bajarilish xatosi","Runtime error"],TIME_LIMIT_EXCEEDED:["Vaqt chegarasi oshdi","Time limit exceeded"],MEMORY_LIMIT_EXCEEDED:["Xotira chegarasi oshdi","Memory limit exceeded"],JUDGE_ERROR:["Tekshiruvchi xatosi","Judge error"]};const title=(names[r.verdict]||names.JUDGE_ERROR)[lang==="uz"?0:1];const test=r.test?` · ${lang==="uz"?"test":"test"} #${r.test}`:"";const stats=r.verdict==="ACCEPTED"?` · ${r.passed}/${r.total} · ${r.runtimeMs} ms · ${r.memoryKb} KB`:"";setVerdict(`${title}${test}${stats}${r.details?`\n${String(r.details).slice(0,900)}`:""}`)}catch{setVerdict(lang==="uz"?"Tekshiruvchi bilan aloqa uzildi":"Judge connection failed")}};
 return <div className="shell"><header className="topbar"><button className="brand" onClick={()=>go("home")} style={{border:0,background:"transparent"}}><BrandMark className="brandmark" />AlgoYo‘l</button><nav className="nav">{(["home","roadmaps","problems","duel","leaderboard"] as View[]).map(v=><button key={v} className={view===v?"active":""} onClick={()=>go(v)}>{t[v as keyof typeof t]}</button>)}</nav><div className="actions"><button className="lang" onClick={swap} aria-label={lang==="uz"?"Switch to English":"O‘zbekchaga o‘tish"}>{lang==="uz"?"EN":"UZ"}</button>{auth.status==="loading"?<span className="pill pill-loading" aria-live="polite">…</span>:<button className="pill" onClick={()=>go(signed?"profile":"auth")}>{signed?(lang==="uz"?"Profil":"Profile"):t.login}</button>}<button className="primary" onClick={()=>go("duel")}>{lang==="uz"?"Duel topish":"Find duel"}</button></div></header>
 <main className="main">{view==="home"&&(auth.status==="loading"?<ScreenLoading lang={lang}/>:signed&&profile?<HomeDashboard lang={lang} role={role} go={v=>go(v as View)} openRoadmap={openRoadmap} duelRating={profile.duel_rating}/>:<Home lang={lang} go={go} openRoadmap={openRoadmap}/>)} {view==="roadmaps"&&<RoadmapHub lang={lang} role={role} openRoadmap={openRoadmap}/>} {view==="roadmap"&&<RoadmapExperience slug={selectedRoadmap} lang={lang} role={role} unitId={selectedUnit} onOpenUnit={id=>pushScreen({unit:id})} onBack={back} onPractice={()=>pushScreen({view:"problem"})}/>} {view==="problems"&&<Problems lang={lang} filter={filter} setFilter={setFilter} items={filtered} go={go} onSelect={p=>{setActiveProblem(p);setCode(p.judge==="max-subarray"?duelProblems[1].cpp:p.judge==="coin-change"?duelProblems[2].cpp:cpp);setVerdict("");go("problem")}}/>} {view==="problem"&&<Problem lang={lang} item={activeProblem} code={code} setCode={setCode} codeLang={codeLang} setCodeLang={setCodeLang} verdict={verdict} submit={judge}/>} {view==="duel"&&<DuelMatchmaking lang={lang} profile={profile} signed={signed} authLoading={auth.status==="loading"} needAuth={()=>go("auth")} openRoadmap={openRoadmap}/>} {view==="leaderboard"&&<Leaderboard lang={lang} me={profile}/>} {view==="profile"&&(auth.status==="loading"?<ScreenLoading lang={lang}/>:profile?<ProfilePage lang={lang} profile={profile} onProfileChange={next=>setAuth({status:"authenticated",profile:next})} signOut={signOut} goAdmin={()=>go("admin")} goRoadmaps={()=>go("roadmaps")} openRoadmap={openRoadmap} isStaff={can(role,"content.view_management")}/>:<SignInRequired lang={lang} go={go} what="profile"/>)} {view==="auth"&&<AuthPage lang={lang} notice={authNotice} onAuthenticated={(token,remember,isNew)=>{void enterSession(token,remember,isNew)}}/>} {view==="placement"&&(auth.status==="loading"?<ScreenLoading lang={lang}/>:signed?<Placement lang={lang} signed={signed} onFinish={()=>go("roadmaps")} onRoadmap={openRoadmap}/>:<SignInRequired lang={lang} go={go} what="placement"/>)} {view==="admin"&&(auth.status==="loading"?<ScreenLoading lang={lang}/>:profile?<Admin lang={lang} profile={profile}/>:<SignInRequired lang={lang} go={go} what="admin"/>)}</main>
 <nav className="mobile-nav">{(["home","roadmaps","problems","duel","leaderboard"] as View[]).map(v=><button key={v} className={view===v?"active":""} onClick={()=>go(v)}>{t[v as keyof typeof t]}</button>)}</nav><footer className="footer"><span>© {new Date().getFullYear()} AlgoYo‘l · Toshkent</span><span>{lang==="uz"?"Bilimdan natijagacha.":"From learning to results."}</span></footer></div>
}
/* Landing copy. The old page opened straight into a roadmap grid and a problem
   list, so a first-time visitor learned what AlgoYo'l *contains* but never what
   it is for or how it works. Every claim below is something the product
   actually does — the counts come from the catalogue, and the unlock rule and
   duel format are the real mechanics. */
const LAND={uz:{
 what:"AlgoYo‘l — o‘zbek tilidagi to‘liq algoritmlar maktabi. Tartibli yo‘l xaritasi, har bosqichda tekshiruv, haqiqiy kod tekshiruvchi va jonli duellar. Noldan ICPC darajasigacha.",
 whyEyebrow:"Nega AlgoYo‘l",
 whyTitle:"Algoritmlarni ona tilingizda o‘rganing.",
 whyLede:"Algoritmlar bo‘yicha material ko‘p, lekin deyarli barchasi chet tilida va tarqoq. AlgoYo‘l shu ikkala muammoni yechadi: bilim o‘zbek tilida va bitta tartibli yo‘lga tizilgan.",
 why:[
  ["Ona tilida","Har bir dars — maqsad, intuitsiya, kod namunasi, keng tarqalgan xatolar va naqshlar — o‘zbek tilida yozilgan. Ingliz tili kerak bo‘lsa, bir tugma bilan almashtiring."],
  ["Tarqoq emas, tartibli","Nimani birinchi o‘rganishni o‘zingiz o‘ylab topmaysiz. Yo‘nalishlar bir-biriga bog‘langan: oldingisini tugatmasdan keyingisi ochilmaydi."],
  ["Bilim emas, ko‘nikma","O‘qib chiqish yetarli emas. Har bosqichda testdan o‘tasiz va masalani haqiqiy tekshiruvchida yechasiz — shundan keyingina keyingi bosqich ochiladi."],
 ],
 howEyebrow:"Qanday ishlaydi",
 howTitle:"To‘rt qadamli halqa",
 howLede:"Har bir bosqich shu to‘rt qadamdan iborat. Bittasini tashlab ketib bo‘lmaydi — tizim ataylab shunday qurilgan.",
 how:[
  ["O‘rganing","Darsni o‘qiysiz: maqsad, asosiy tushuncha, C++ va Python kodi, bosqichma-bosqich tahlil, keng tarqalgan xatolar."],
  ["Tekshiring","Qisqa test. Kamida 70% to‘plashingiz kerak — aks holda nazariyaga qaytasiz."],
  ["Yeching","Masalani yozib, tekshiruvchiga yuborasiz. Yashirin testlar, vaqt va xotira chegarasi — haqiqiy musobaqadagidek."],
  ["Bellashing","Tayyor bo‘lsangiz duelga chiqasiz: 30 daqiqa, 3 masala, Elo reyting."],
 ],
 ruleEyebrow:"Ochilish qoidasi",
 ruleTitle:"Keyingi bosqich qachon ochiladi?",
 ruleBody:"Bosqich faqat ikkala shart bajarilganda yopiladi: testda kamida 70% va masalada Accepted. Har bir isbot mavzu mahoratingizni 0 dan 1000 gacha shkalada oshiradi, bir xil ish uchun esa ikki marta ball berilmaydi.",
 ruleQuiz:"Test ≥ 70%",
 ruleSolve:"Masalada Accepted",
 ruleMastery:"Mahorat 0 → 1000",
 factsEyebrow:"Ichida nima bor",
 factsTitle:"Raqamlarda",
 facts:[["yo‘nalish","Asoslardan ilg‘or algoritmlargacha"],["bosqich","Har biri dars, test va masala"],["til","C++20 va Python 3"],["daqiqa","Duel uzunligi · 3 masala"]],
 ctaTitle:"Birinchi bosqichdan boshlang.",
 ctaBody:"Ro‘yxatdan o‘tmasdan ham darslarni o‘qishingiz mumkin. Progress, mahorat va reyting esa hisobingizga saqlanadi.",
 ctaPrimary:"O‘rganishni boshlash",
 ctaSecondary:"Hisob yaratish",
},en:{
 what:"AlgoYo‘l is a complete algorithms school in Uzbek. A structured roadmap, a check at every step, a real code judge, and live duels — from zero to ICPC level.",
 whyEyebrow:"Why AlgoYo‘l",
 whyTitle:"Learn algorithms in your own language.",
 whyLede:"There is no shortage of algorithms material — but almost all of it is in another language and scattered across dozens of sources. AlgoYo‘l fixes both: the knowledge is in Uzbek, and it is arranged into one ordered path.",
 why:[
  ["In Uzbek","Every lesson — goal, intuition, code in C++ and Python, common mistakes, patterns — is written in Uzbek. Switch to English with one button whenever you want."],
  ["Ordered, not scattered","You never have to guess what to learn next. The tracks are wired together: the next one stays locked until you finish what it builds on."],
  ["Skill, not just reading","Reading is not enough. Each unit makes you pass a check and solve a problem on a real judge before the next one opens."],
 ],
 howEyebrow:"How it works",
 howTitle:"A four-step loop",
 howLede:"Every unit is these four steps. None of them can be skipped — the system is built that way on purpose.",
 how:[
  ["Learn","Read the lesson: the goal, the core concept, C++ and Python examples, a step-by-step walkthrough, and the mistakes people actually make."],
  ["Check","A short quiz. You need at least 70% — below that, you go back to the theory."],
  ["Solve","Write the solution and submit it to the judge. Hidden tests, time and memory limits — the same as a real contest."],
  ["Duel","When you are ready, enter the arena: 30 minutes, 3 problems, an Elo rating."],
 ],
 ruleEyebrow:"The unlock rule",
 ruleTitle:"When does the next unit open?",
 ruleBody:"A unit closes only when both conditions are met: at least 70% on the quiz and an Accepted verdict on the problem. Every piece of evidence raises your mastery in that topic on a 0–1000 scale, and the same work is never counted twice.",
 ruleQuiz:"Quiz ≥ 70%",
 ruleSolve:"Problem Accepted",
 ruleMastery:"Mastery 0 → 1000",
 factsEyebrow:"What is inside",
 factsTitle:"In numbers",
 facts:[["tracks","From the basics to advanced algorithms"],["units","Each with a lesson, a quiz and a problem"],["languages","C++20 and Python 3"],["minutes","Duel length · 3 problems"]],
 ctaTitle:"Start with the first unit.",
 ctaBody:"You can read the lessons without registering. Progress, mastery and rating are saved to your account.",
 ctaPrimary:"Start learning",
 ctaSecondary:"Create an account",
}};

function Home({lang,go,openRoadmap}:{lang:Lang,go:(v:View)=>void,openRoadmap:(slug:string)=>void}){
 const t=copy[lang],L=LAND[lang];
 const size=roadmapCatalogSize();
 const factValues=[String(size.tracks),String(size.units),"2","30"];
 return <>
  <section className="hero">
   <div className="hero-copy">
    <div className="eyebrow">{lang==="uz"?"O‘zbekiston dasturchilari uchun":"Built for Uzbekistan’s coders"}</div>
    <h1>{lang==="uz"?<>Algoritmlarni <em>o‘rganing</em>, bellashing va o‘sing.</>:<>Learn algorithms, <em>compete</em>, and grow.</>}</h1>
    <p>{L.what}</p>
    <div className="hero-cta">
     <button className="primary" onClick={()=>go("roadmaps")}>{t.start} →</button>
     <button className="secondary" onClick={()=>go("duel")}>{t.arena}</button>
    </div>
    <div className="orbit"/>
   </div>
   <div className="hero-side"><PlatformStats lang={lang}/></div>
  </section>

  <section className="lp-block">
   <div className="section-head"><div><p className="eyebrow">{L.whyEyebrow}</p><h2>{L.whyTitle}</h2></div></div>
   <p className="lp-lede muted">{L.whyLede}</p>
   <div className="lp-cards">{L.why.map(([title,body])=>
    <div className="panel lp-card" key={title}><h3>{title}</h3><p className="muted">{body}</p></div>)}</div>
  </section>

  <section className="lp-block">
   <div className="section-head"><div><p className="eyebrow">{L.howEyebrow}</p><h2>{L.howTitle}</h2></div></div>
   <p className="lp-lede muted">{L.howLede}</p>
   {/* Numbered because this genuinely is a sequence — the order is the mechanic. */}
   <ol className="lp-loop">{L.how.map(([title,body],i)=>
    <li className="lp-step" key={title}>
     <span className="lp-step-n mono">{String(i+1).padStart(2,"0")}</span>
     <b>{title}</b>
     <span className="muted">{body}</span>
    </li>)}</ol>
  </section>

  <section className="lp-block">
   <div className="panel lp-rule">
    <div className="lp-rule-copy">
     <p className="eyebrow">{L.ruleEyebrow}</p>
     <h2>{L.ruleTitle}</h2>
     <p className="muted">{L.ruleBody}</p>
    </div>
    <div className="lp-rule-chips">
     <span className="lp-chip"><i>✓</i>{L.ruleQuiz}</span>
     <span className="lp-chip"><i>✓</i>{L.ruleSolve}</span>
     <span className="lp-chip lime">{L.ruleMastery}</span>
    </div>
   </div>
  </section>

  <section className="lp-block">
   <div className="section-head"><div><p className="eyebrow">{L.factsEyebrow}</p><h2>{L.factsTitle}</h2></div></div>
   <div className="lp-facts">{L.facts.map(([label,note],i)=>
    <div className="lp-fact" key={label}><b className="mono">{factValues[i]}</b><span>{label}</span><small className="muted">{note}</small></div>)}</div>
  </section>

  <section className="lp-block">
   <div className="section-head">
    <div><p className="eyebrow">{lang==="uz"?"Bosqichma-bosqich":"Step by step"}</p><h2>{t.featured}</h2></div>
    <button className="secondary" onClick={()=>go("roadmaps")}>{t.all} →</button>
   </div>
   <RoadGrid lang={lang} roads={allRoads.slice(0,3)} openRoadmap={openRoadmap}/>
  </section>

  <section className="lp-block">
   <div className="section-head">
    <div><p className="eyebrow">100 · 200 · 300</p><h2>{t.tasks}</h2></div>
    <button className="secondary" onClick={()=>go("problems")}>{t.all} →</button>
   </div>
   <ProblemList lang={lang} items={problems.slice(0,4)} go={go}/>
  </section>

  <section className="lp-cta">
   <h2>{L.ctaTitle}</h2>
   <p className="muted">{L.ctaBody}</p>
   <div className="hero-cta">
    <button className="primary" onClick={()=>go("roadmaps")}>{L.ctaPrimary} →</button>
    <button className="secondary" onClick={()=>go("auth")}>{L.ctaSecondary}</button>
   </div>
  </section>
 </>;
}

/* Real platform numbers only: how much curriculum exists, and how many people
   have registered. Nothing here is a decorative invention. */
function PlatformStats({lang}:{lang:Lang}){
 const [learners,setLearners]=useState<number|null>(null);
 useEffect(()=>{let live=true;fetchLearnerCount().then(n=>{if(live)setLearners(n)});return()=>{live=false}},[]);
 const units=useMemo(()=>roadmapCatalogSize(),[]);
 return <>
  <div className="stat-card"><span className="eyebrow">{lang==="uz"?"O‘quv dasturi":"Curriculum"}</span><span className="big">{units.tracks}</span><span className="muted">{lang==="uz"?`yo‘nalish · ${units.units} bosqich`:`tracks · ${units.units} units`}</span></div>
  <div className="stat-card duel"><span className="eyebrow" style={{color:"#6f3516"}}>{lang==="uz"?"Ro‘yxatdan o‘tganlar":"Registered learners"}</span><span className="big">{learners===null?"—":String(learners).replace(/\B(?=(\d{3})+(?!\d))/g," ")}</span><span>{lang==="uz"?"AlgoYo‘lda o‘rganmoqda":"learning on AlgoYo‘l"} ⚡</span></div>
 </>;
}

function RoadGrid({lang,roads,openRoadmap}:{lang:Lang,roads:typeof allRoads,openRoadmap:(slug:string)=>void}){return <div className="grid">{roads.map((r)=><button className="road-card" style={{textAlign:"left"}} key={r.en} onClick={()=>openRoadmap(r.slug)}><span className="road-icon" style={{background:r.color}}>{r.icon}</span><h3>{lang==="uz"?r.uz:r.en}</h3><p className="muted">{lang==="uz"?r.descUz:r.descEn}</p><div className="meta"><span>{r.units} {lang==="uz"?"bosqich":"units"}</span><span>800 → 2200</span></div></button>)}</div>}
function ProblemList({lang,items,go,onSelect}:{lang:Lang;items:typeof problems;go:(v:View)=>void;onSelect?:(p:BankProblem)=>void}){const mastery=loadMastery();return <div className="problem-list">{items.map(p=>{const solved=mastery.evidence[`problem:${p.id}`]!==undefined;return <button className="problem-row" style={{textAlign:"left"}} key={p.id} onClick={()=>onSelect?onSelect(p):go("problem")}><span className="num">{p.id}</span><span><h3>{lang==="uz"?p.uz:p.en}</h3><span className={`difficulty ${p.difficulty}`}>{p.difficulty.toUpperCase()} · {p.points}</span></span><span className="tag">{p.tag}</span><span className={`pb-status ${solved?"solved":""}`}>{solved?"✓":"○"}</span></button>})}</div>}
function Problems({lang,filter,setFilter,items,go,onSelect}:{lang:Lang,filter:string,setFilter:(x:string)=>void,items:typeof problems,go:(v:View)=>void,onSelect:(p:BankProblem)=>void}){
 const [topic,setTopic]=useState("all");
 const topics=useMemo(()=>[...new Set(problems.map(p=>p.topic))],[]);
 const shown=topic==="all"?items:items.filter(p=>p.topic===topic);
 const topicName=(slug:string)=>{const r=roadmapCards.find(x=>x.slug===slug);return r?(lang==="uz"?r.uz:r.en):slug};
 return <><div className="page-head"><div><p className="eyebrow" style={{color:"#637068"}}>{lang==="uz"?"Mashq maydoni":"Practice arena"}</p><h1 className="page-title">{lang==="uz"?"Masalalar banki":"Problem library"}</h1><p className="muted">{lang==="uz"?"Har bir yechim mavzu mahoratiga o‘tadi.":"Every solve feeds your topic mastery."}</p></div><span className="tag">{problems.length} {lang==="uz"?"masala":"problems"}</span></div><div className="filters">{["all","easy","medium","hard"].map(f=><button className={filter===f?"active":""} onClick={()=>setFilter(f)} key={f}>{f==="all"?(lang==="uz"?"Barchasi":"All"):f}</button>)}</div><div className="filters" style={{marginTop:8}}><button className={topic==="all"?"active":""} onClick={()=>setTopic("all")}>{lang==="uz"?"Barcha mavzu":"All topics"}</button>{topics.map(tp=><button key={tp} className={topic===tp?"active":""} onClick={()=>setTopic(tp)}>{topicName(tp)}</button>)}</div><ProblemList lang={lang} items={shown} go={go} onSelect={onSelect}/></>}
function Problem({lang,item,code,setCode,codeLang,setCodeLang,verdict,submit}:{lang:Lang;item:BankProblem;code:string;setCode:(x:string)=>void;codeLang:"cpp20"|"python3";setCodeLang:(x:"cpp20"|"python3")=>void;verdict:string;submit:()=>void}){
 const judgeable=duelProblems.find(d=>d.key===item.judge);
 const solved=loadMastery().evidence[`problem:${item.id}`]!==undefined;
 return <><div className="page-head"><div><span className="tag">{item.id} · {item.difficulty.toUpperCase()} · {item.points}</span> <span className="tag">{item.tag}</span> {solved&&<span className="tag tag-solved">✓ {lang==="uz"?"Yechilgan":"Solved"}</span>}<h1 className="page-title" style={{marginTop:12}}>{lang==="uz"?item.uz:item.en}</h1></div><span className="muted mono">1 s · 256 MB</span></div>
 {judgeable?<div className="workspace"><article className="panel statement"><h2>{lang==="uz"?"Shart":"Statement"}</h2><p>{lang==="uz"?judgeable.stUz:judgeable.stEn}</p><h3>{lang==="uz"?"Kirish":"Input"}</h3><p>{lang==="uz"?judgeable.inUz:judgeable.inEn}</p><h3>{lang==="uz"?"Chiqish":"Output"}</h3><p>{lang==="uz"?judgeable.outUz:judgeable.outEn}</p><h3>{lang==="uz"?"Namuna":"Sample"}</h3><div className="sample">{judgeable.sample}</div></article><section className="editor"><div className="editor-top"><b>{codeLang==="cpp20"?"main.cpp":"main.py"}</b><select aria-label="Language" value={codeLang} onChange={e=>{const value=e.target.value as "cpp20"|"python3";setCodeLang(value);setCode(value==="cpp20"?(item.judge?judgeable.cpp:cpp):"a, b = map(int, input().split())\nprint(a + b)")}}><option value="cpp20">C++20</option><option value="python3">Python 3</option></select></div><textarea aria-label="Code editor" value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}/><div className="editor-actions"><span className="verdict">{verdict||"● Judge0 online"}</span><button className="primary" onClick={submit}>{copy[lang].submit} →</button></div></section></div>
 :<div className="panel" style={{maxWidth:680}}><div className="notice">{lang==="uz"?"Ushbu masala hozircha ko‘rib chiqish rejimida — tekshiruvchi tez orada ulanadi. Mavzu: ":"This problem is in preview mode — the judge will be connected soon. Topic: "}<b>{item.tag}</b></div></div>}</>}
type DuelOpponent={name:string;handle:string;rating:number;wins:number;letter:string};
type DuelProblem={key:string;code:string;difficulty:"easy"|"medium"|"hard";points:number;uz:string;en:string;stUz:string;stEn:string;inUz:string;inEn:string;outUz:string;outEn:string;sample:string;cpp:string;py:string;bot:[number,number];fail:number};
type DuelClaim={by:"me"|"opp";at:number}|null;
type DuelEvent={at:number;by:"me"|"opp"|"sys";uz:string;en:string};
type DuelResultState=null|{reason:"time"|"sweep"|"forfeit";outcome:"win"|"loss"|"draw";delta:number;claims:DuelClaim[];at:number};
const DUEL_LENGTH=1800,DUEL_K=32,DEFAULT_RATING=1200;
const duelOpponents:DuelOpponent[]=[{name:"Jasur",handle:"@jasur_cpp",rating:1488,wins:18,letter:"J"},{name:"Nilufar",handle:"@nilufar_py",rating:1421,wins:18,letter:"N"},{name:"Bekzod",handle:"@bek_ds",rating:1395,wins:9,letter:"B"},{name:"Azizbek",handle:"@aziz_algo",rating:1718,wins:29,letter:"A"},{name:"Madina",handle:"@madina_dev",rating:1792,wins:37,letter:"M"},{name:"Sardor",handle:"@sardor_ioi",rating:1864,wins:42,letter:"S"}];
const duelProblems:DuelProblem[]=[
 {key:"sum-two",code:"A01",difficulty:"easy",points:100,uz:"Ikki son yig‘indisi",en:"Sum of two numbers",
  stUz:"Sizga ikkita butun a va b sonlari beriladi. Ularning yig‘indisini toping.",stEn:"You are given two integers a and b. Print their sum.",
  inUz:"Bitta qatorda ikkita butun son: a va b (−10⁹ ≤ a, b ≤ 10⁹).",inEn:"One line contains two integers a and b (−10⁹ ≤ a, b ≤ 10⁹).",
  outUz:"Yagona son — a + b ni chiqaring.",outEn:"Print a single integer — a + b.",
  sample:"Input\n12 30\n\nOutput\n42",
  cpp:`#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long a, b;\n    cin >> a >> b;\n    cout << a + b << "\\n";\n    return 0;\n}`,
  py:`a, b = map(int, input().split())\nprint(a + b)`,bot:[170,430],fail:.03},
 {key:"max-subarray",code:"B04",difficulty:"medium",points:200,uz:"Eng katta qism-yig‘indi",en:"Maximum subarray sum",
  stUz:"n ta butun sondan iborat massiv berilgan. Bo‘sh bo‘lmagan ketma-ket qism-massivning eng katta yig‘indisini toping.",stEn:"Given an array of n integers, find the largest sum of a non-empty contiguous subarray.",
  inUz:"Birinchi qatorda n (1 ≤ n ≤ 2·10⁵). Ikkinchi qatorda n ta butun son (−10⁹ ≤ aᵢ ≤ 10⁹).",inEn:"The first line contains n (1 ≤ n ≤ 2·10⁵). The second line contains n integers (−10⁹ ≤ aᵢ ≤ 10⁹).",
  outUz:"Yagona son — eng katta qism-yig‘indi.",outEn:"Print a single integer — the maximum subarray sum.",
  sample:"Input\n9\n-2 1 -3 4 -1 2 1 -5 4\n\nOutput\n6",
  cpp:`#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // TODO: eng katta qism-yig'indini toping / find the maximum subarray sum\n    return 0;\n}`,
  py:`n = int(input())\na = list(map(int, input().split()))\n# TODO: eng katta qism-yig'indini toping / find the maximum subarray sum`,bot:[400,820],fail:.12},
 {key:"coin-change",code:"C04",difficulty:"hard",points:300,uz:"Minimal tangalar",en:"Minimum coins",
  stUz:"n xil nominaldagi tangalar va s summa berilgan. Har bir nominaldan cheksiz olish mumkin. s ni to‘plash uchun kerak bo‘lgan eng kam tangalar sonini toping, aks holda −1 chiqaring.",stEn:"You are given n coin values and a target sum s. Each value may be used any number of times. Print the minimum number of coins that add up to exactly s, or −1 if it is impossible.",
  inUz:"Birinchi qatorda n va s (1 ≤ n ≤ 100, 0 ≤ s ≤ 10⁴). Ikkinchi qatorda n ta nominal (1 ≤ cᵢ ≤ 10⁴).",inEn:"The first line contains n and s (1 ≤ n ≤ 100, 0 ≤ s ≤ 10⁴). The second line contains n coin values (1 ≤ cᵢ ≤ 10⁴).",
  outUz:"Eng kam tangalar soni yoki −1.",outEn:"The minimum number of coins, or −1.",
  sample:"Input\n3 11\n1 2 5\n\nOutput\n3",
  cpp:`#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n, s;\n    cin >> n >> s;\n    // TODO: dinamik dasturlash bilan yeching / solve with dynamic programming\n    return 0;\n}`,
  py:`n, s = map(int, input().split())\ncoins = list(map(int, input().split()))\n# TODO: dinamik dasturlash bilan yeching / solve with dynamic programming`,bot:[650,1250],fail:.3},
];
const clock=(total:number)=>`${String(Math.floor(Math.max(0,total)/60)).padStart(2,"0")}:${String(Math.max(0,total)%60).padStart(2,"0")}`;
const duelStarter=(index:number,codeLang:"cpp20"|"python3")=>codeLang==="cpp20"?duelProblems[index].cpp:duelProblems[index].py;
const expectedScore=(mine:number,theirs:number)=>1/(1+Math.pow(10,(theirs-mine)/400));
const scoreOf=(list:DuelClaim[],who:"me"|"opp")=>list.reduce((n,c,i)=>c&&c.by===who?n+duelProblems[i].points:n,0);
const topicTitle=(slug:string,lang:Lang)=>{const r=roadmapCards.find(x=>x.slug===slug);return r?(lang==="uz"?r.uz:r.en):slug};

function Duel({lang,opponent,rating,matchId,onFinish,onRematch,onExit,openRoadmap}:{lang:Lang;opponent:DuelOpponent;rating:number;matchId:number;onFinish:(next:number,entry:{outcome:"win"|"loss"|"draw";myScore:number;oppScore:number;delta:number})=>void;onRematch:()=>void;onExit:()=>void;openRoadmap:(slug:string)=>void}){
 const [elapsed,setElapsed]=useState(0),[stage,setStage]=useState(0),[claims,setClaims]=useState<DuelClaim[]>([null,null,null]);
 const [gains,setGains]=useState<{topic:string;delta:number}[]>([]);
 const [feed,setFeed]=useState<DuelEvent[]>([{at:0,by:"sys",uz:"Duel boshlandi · 1-masala ochildi",en:"Duel started · problem 1 unlocked"}]);
 const [attempts,setAttempts]=useState({me:0,opp:0}),[codeLang,setCodeLang]=useState<"cpp20"|"python3">("cpp20"),[code,setCode]=useState(duelProblems[0].cpp);
 const [verdict,setVerdict]=useState(""),[bad,setBad]=useState(false),[judging,setJudging]=useState(false);
 const [result,setResult]=useState<DuelResultState>(null);
 const plan=useRef<{stage:number;solveAt:number;missAt:number;missed:boolean;fails:boolean}|null>(null);
 const remaining=Math.max(0,DUEL_LENGTH-elapsed);
 const myScore=scoreOf(claims,"me"),oppScore=scoreOf(claims,"opp");
 const push=(by:DuelEvent["by"],uz:string,en:string,at:number)=>setFeed(f=>[{at,by,uz,en},...f].slice(0,40));
 const finish=(reason:"time"|"sweep"|"forfeit",final:DuelClaim[],at:number)=>{
  const mine=scoreOf(final,"me"),theirs=scoreOf(final,"opp");
  const outcome=reason==="forfeit"?"loss":mine>theirs?"win":mine<theirs?"loss":"draw";
  const delta=Math.round(DUEL_K*((outcome==="win"?1:outcome==="draw"?.5:0)-expectedScore(rating,opponent.rating)));
  plan.current=null;setResult({reason,outcome,delta,claims:final,at:Math.min(at,DUEL_LENGTH)});onFinish(rating+delta,{outcome,myScore:mine,oppScore:theirs,delta})};
 const claimStage=(by:"me"|"opp",at:number)=>{
  if(result||stage>2||claims[stage])return;
  const problem=duelProblems[stage],next=[...claims];next[stage]={by,at};setClaims(next);setStage(stage+1);
  if(by==="me"){const topic=duelTopics[problem.key]||"foundations";const base=Math.round(MASTERY_CONFIG.weights.problem[problem.difficulty]*MASTERY_CONFIG.weights.duelMultiplier);const g=recordEvidence(topic,"duel",`duel:${matchId}:${problem.key}`,base);if(g.delta>0)setGains(gs=>[...gs,{topic,delta:g.delta}])}
  push(by,by==="me"?`Siz ${problem.code} ni yechdingiz · +${problem.points}`:`${opponent.name} ${problem.code} ni yechdi · +${problem.points}`,by==="me"?`You solved ${problem.code} · +${problem.points}`:`${opponent.name} solved ${problem.code} · +${problem.points}`,at);
  if(stage<2){push("sys",`${stage+2}-masala ochildi`,`Problem ${stage+2} unlocked`,at);setCode(duelStarter(stage+1,codeLang));setVerdict("");setBad(false)}
  else finish("sweep",next,at)};
 useEffect(()=>{if(result||stage>2){plan.current=null;return}const problem=duelProblems[stage];const skill=Math.min(1.45,Math.max(.6,1-(opponent.rating-rating)/1800));const span=problem.bot[0]+Math.random()*(problem.bot[1]-problem.bot[0]);const duration=Math.max(45,Math.round(span*skill));plan.current={stage,solveAt:elapsed+duration,missAt:elapsed+Math.round(duration*.55),missed:false,fails:Math.random()<problem.fail}},[stage,result]);// eslint-disable-line react-hooks/exhaustive-deps
 useEffect(()=>{if(result)return;const id=window.setInterval(()=>setElapsed(e=>Math.min(DUEL_LENGTH,e+1)),1000);return()=>window.clearInterval(id)},[result]);
 useEffect(()=>{if(result)return;
  if(elapsed>=DUEL_LENGTH){finish("time",claims,DUEL_LENGTH);return}
  const current=plan.current;if(!current||current.stage!==stage||claims[stage])return;
  if(!current.missed&&elapsed>=current.missAt){current.missed=true;setAttempts(a=>({...a,opp:a.opp+1}));push("opp",`${opponent.name} yechim yubordi — noto‘g‘ri javob`,`${opponent.name} submitted — wrong answer`,elapsed)}
  if(!current.fails&&elapsed>=current.solveAt)claimStage("opp",elapsed)},[elapsed]);// eslint-disable-line react-hooks/exhaustive-deps
 const submit=async()=>{if(judging||result||stage>2)return;setJudging(true);setBad(false);setVerdict(lang==="uz"?"Navbatda… testlar tekshirilmoqda":"In queue… running hidden tests");
  const at=elapsed;
  try{const response=await fetch("/api/judge",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({problemId:duelProblems[stage].key,language:codeLang,sourceCode:code})});const r=await response.json();
   const names:Record<string,[string,string]>={ACCEPTED:["Qabul qilindi","Accepted"],WRONG_ANSWER:["Noto‘g‘ri javob","Wrong answer"],COMPILATION_ERROR:["Kompilyatsiya xatosi","Compilation error"],RUNTIME_ERROR:["Bajarilish xatosi","Runtime error"],TIME_LIMIT_EXCEEDED:["Vaqt chegarasi oshdi","Time limit exceeded"],MEMORY_LIMIT_EXCEEDED:["Xotira chegarasi oshdi","Memory limit exceeded"],JUDGE_ERROR:["Tekshiruvchi xatosi","Judge error"]};
   const title=(names[r.verdict]||names.JUDGE_ERROR)[lang==="uz"?0:1],test=r.test?` · test #${r.test}`:"",stats=r.verdict==="ACCEPTED"?` · ${r.passed}/${r.total} · ${r.runtimeMs} ms · ${r.memoryKb} KB`:"";
   setVerdict(`${title}${test}${stats}${r.details?`\n${String(r.details).slice(0,500)}`:""}`);
   if(r.verdict==="ACCEPTED"){setBad(false);claimStage("me",at)}
   else{setBad(true);setAttempts(a=>({...a,me:a.me+1}));push("me",`Siz yechim yubordingiz — ${title.toLowerCase()}`,`You submitted — ${title.toLowerCase()}`,at)}}
  catch{setBad(true);setVerdict(lang==="uz"?"Tekshiruvchi bilan aloqa uzildi":"Judge connection failed")}
  finally{setJudging(false)}};
 if(result)return <DuelResult lang={lang} opponent={opponent} result={result} attempts={attempts} rating={rating} gains={gains} onRematch={onRematch} onExit={onExit} openRoadmap={openRoadmap}/>;
 const problem=duelProblems[Math.min(stage,2)],leader=myScore>oppScore?"me":oppScore>myScore?"opp":"";
 return <><div className="page-head"><div><p className="eyebrow" style={{color:"#637068"}}>RATED DUEL · #{matchId}</p><h1 className="page-title">{lang==="uz"?"Duel maydoni":"Duel arena"}</h1></div><span className="tag">{lang==="uz"?"Ulangan":"Connected"} ●</span></div>
 <div className="duel-layout"><section className="arena"><div className="duel-top"><b>{lang==="uz"?"30 daqiqalik duel":"30-minute duel"}</b><span className={`timer ${remaining<=300?"low":""}`}>{clock(remaining)}</span></div>
  <div className="players"><div className={`player ${leader==="me"?"lead":""}`}><span className="sub">{rating} Elo</span><div className="who">{lang==="uz"?"Siz":"You"}</div><span className="score">{myScore}</span></div><span className="versus">VS</span>
   <div className={`player ${leader==="opp"?"lead":""}`}><span className="sub">{opponent.handle} · {opponent.rating}</span><div className="who">{opponent.name}</div><span className="score">{oppScore}</span></div></div>
  <div className="duel-steps">{duelProblems.map((p,i)=>{const claim=claims[i],state=claim?(claim.by==="me"?"mine":"theirs"):i===stage?"open":"locked";return <div key={p.key} className={`step ${state}`}><b>{String(i+1).padStart(2,"0")} · {p.difficulty.toUpperCase()}</b><span>{p.points} {lang==="uz"?"ball":"points"}</span><span className="claim">{claim?`${claim.by==="me"?(lang==="uz"?"Siz":"You"):opponent.name} · ${clock(claim.at)}`:i===stage?(lang==="uz"?"Ochiq":"Open"):(lang==="uz"?"Qulflangan":"Locked")}</span></div>})}</div>
  <div className="duel-problem"><span className="tag">{problem.code} · {problem.difficulty.toUpperCase()} · {problem.points}</span><h2>{lang==="uz"?problem.uz:problem.en}</h2>
   <p className="muted">{lang==="uz"?problem.stUz:problem.stEn}</p>
   <p className="muted"><b>{lang==="uz"?"Kirish":"Input"}:</b> {lang==="uz"?problem.inUz:problem.inEn}</p>
   <p className="muted"><b>{lang==="uz"?"Chiqish":"Output"}:</b> {lang==="uz"?problem.outUz:problem.outEn}</p>
   <div className="sample">{problem.sample}</div>
   <div className="duel-editor"><div className="editor-top"><b>{codeLang==="cpp20"?"main.cpp":"main.py"}</b><select aria-label="Duel language" value={codeLang} onChange={e=>{const value=e.target.value as "cpp20"|"python3";setCodeLang(value);setCode(duelStarter(Math.min(stage,2),value))}}><option value="cpp20">C++20</option><option value="python3">Python 3</option></select></div>
    <textarea aria-label="Duel code editor" value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}/>
    <div className="editor-actions"><span className={`duel-verdict ${bad?"bad":""}`}>{verdict||(lang==="uz"?"● Birinchi Accepted barcha ballni oladi":"● First Accepted claims all the points")}</span>
     <button className="primary" disabled={judging} onClick={submit}>{judging?(lang==="uz"?"Tekshirilmoqda…":"Judging…"):(lang==="uz"?"Yuborish":"Submit")} →</button></div></div></div></section>
  <aside className="side-stack"><div className="duel-card"><h3>{lang==="uz"?"Jonli oqim":"Live feed"}</h3><div className="feed">{feed.map((e,i)=><div key={`${e.at}-${i}`} className={`feed-item ${e.by}`}><span className="feed-time">{clock(e.at)}</span><span>{lang==="uz"?e.uz:e.en}</span></div>)}</div></div>
   <div className="duel-card"><h3>{lang==="uz"?"Statistika":"Statistics"}</h3><div className="duel-stats"><div><b>{attempts.me}</b><small>{lang==="uz"?"sizning xato":"your fails"}</small></div><div><b>{attempts.opp}</b><small>{lang==="uz"?"raqib xato":"rival fails"}</small></div><div><b>{claims.filter(Boolean).length}/3</b><small>{lang==="uz"?"yechildi":"claimed"}</small></div></div></div>
   <div className="duel-card"><h3>{lang==="uz"?"Qoidalar":"Rules"}</h3><p className="muted">{lang==="uz"?"Masalalar ketma-ket ochiladi. Birinchi Accepted barcha ballni oladi. Teng ballda noto‘g‘ri urinishlar hal qiladi.":"Problems unlock in order. The first Accepted claims all the points. Failed attempts break ties at equal score."}</p>
    <button className="ghost" onClick={()=>{push("sys",lang==="uz"?"Siz duelni tark etdingiz":"You forfeited the duel",lang==="uz"?"Siz duelni tark etdingiz":"You forfeited the duel",elapsed);finish("forfeit",claims,elapsed)}}>{lang==="uz"?"Duelni tark etish":"Forfeit duel"}</button></div></aside></div></>
}

function DuelResult({lang,opponent,result,attempts,rating,gains,onRematch,onExit,openRoadmap}:{lang:Lang;opponent:DuelOpponent;result:NonNullable<DuelResultState>;attempts:{me:number;opp:number};rating:number;gains:{topic:string;delta:number}[];onRematch:()=>void;onExit:()=>void;openRoadmap:(slug:string)=>void}){
 const {outcome,reason,delta,claims,at}=result,myScore=scoreOf(claims,"me"),oppScore=scoreOf(claims,"opp");
 const heading=outcome==="win"?(lang==="uz"?"G‘alaba!":"Victory!"):outcome==="loss"?(lang==="uz"?"Mag‘lubiyat":"Defeat"):(lang==="uz"?"Durrang":"Draw");
 const why=reason==="forfeit"?(lang==="uz"?"Siz duelni tark etdingiz.":"You forfeited the duel."):reason==="sweep"?(lang==="uz"?"Barcha masalalar yechildi.":"Every problem was claimed."):(lang==="uz"?"Vaqt tugadi.":"Time ran out.");
 return <><div className="page-head"><div><p className="eyebrow" style={{color:"#637068"}}>RATED DUEL · {lang==="uz"?"Yakun":"Result"}</p><h1 className="page-title">{lang==="uz"?"Duel yakunlandi":"Duel finished"}</h1></div><span className="tag">{clock(at)}</span></div>
 <div className="duel-result panel"><div className={`result-badge ${outcome}`}>{outcome==="win"?"★":outcome==="loss"?"✕":"="}</div><h2>{heading}</h2><p className="muted">{why}</p>
  <div className="result-score">{myScore} : {oppScore}</div>
  <p><span className="muted">{rating} → </span><b>{rating+delta}</b> <span className={`elo-delta ${delta>=0?"up":"down"}`}>{delta>=0?"+":""}{delta}</span> <span className="muted">Elo</span></p>
  <div className="stage-table">{duelProblems.map((p,i)=>{const claim=claims[i];return <div className="stage-row" key={p.key}><span className="tag">{p.code}</span><span>{lang==="uz"?p.uz:p.en}</span><span className="muted">{claim?`${claim.by==="me"?(lang==="uz"?"Siz":"You"):opponent.name} · ${clock(claim.at)}`:(lang==="uz"?"yechilmadi":"unclaimed")}</span><span className="pts">{claim?(claim.by==="me"?"+":"−")+p.points:"0"}</span></div>})}</div>
  <div className="duel-stats"><div><b>{attempts.me}</b><small>{lang==="uz"?"sizning xato urinish":"your failed attempts"}</small></div><div><b>{attempts.opp}</b><small>{lang==="uz"?"raqib xato urinish":"rival failed attempts"}</small></div><div><b>{opponent.rating}</b><small>{lang==="uz"?"raqib reytingi":"rival rating"}</small></div></div>
  <div className="skill-growth"><h3>{lang==="uz"?"Skill o‘sishi":"Skill growth"}</h3>{gains.length?gains.map((g,i)=><div className="stage-row" key={i}><span className="tag">{lang==="uz"?"Mahorat":"Mastery"}</span><span>{topicTitle(g.topic,lang)}</span><span className="muted mono">{masteryOf(g.topic)}/1000</span><span className="pts" style={{color:"var(--lime)"}}>+{g.delta}</span></div>):<p className="muted">{lang==="uz"?"Bu duelda yangi mahorat isboti bo‘lmadi.":"No new mastery evidence in this duel."}</p>}
   {gains.length>0&&<div className="match-actions" style={{justifyContent:"flex-start",marginTop:14}}>{[...new Set(gains.map(g=>g.topic))].map(tp=><button key={tp} className="secondary" onClick={()=>openRoadmap(tp)}>{topicTitle(tp,lang)} {lang==="uz"?"mavzusiga o‘tish":"topic"} →</button>)}</div>}</div>
  <div className="match-actions"><button className="primary" onClick={onRematch}>{lang==="uz"?"Yangi duel":"New duel"} →</button><button className="secondary" onClick={onExit}>{lang==="uz"?"Maydondan chiqish":"Leave arena"}</button></div></div></>
}

function DuelMatchmaking({lang,profile,signed,authLoading,needAuth,openRoadmap}:{lang:Lang,profile?:Profile|null,signed:boolean,authLoading:boolean,needAuth:()=>void,openRoadmap:(slug:string)=>void}){
 const [phase,setPhase]=useState<"idle"|"searching"|"found"|"active">("idle"),[rating,setRating]=useState(profile?.duel_rating??DEFAULT_RATING),[opponent,setOpponent]=useState<DuelOpponent>(duelOpponents[0]),[matchId,setMatchId]=useState(4821);
 // The account is the source of truth for rating; the local copy is only a
 // cache for a session that has not synced yet.
 useEffect(()=>{if(profile?.duel_rating!==undefined){setRating(profile.duel_rating);return}const saved=Number(readScoped("algoyol-duel-rating"));if(saved>0)setRating(saved)},[profile]);
 useEffect(()=>{if(phase!=="searching")return;const found=window.setTimeout(()=>{const pool=[...duelOpponents].sort((a,b)=>Math.abs(a.rating-rating)-Math.abs(b.rating-rating)).slice(0,3);setOpponent(pool[Math.floor(Math.random()*pool.length)]);setMatchId(4000+Math.floor(Math.random()*1800));setPhase("found")},1800);return()=>window.clearTimeout(found)},[phase,rating]);
 const settle=(next:number,entry:{outcome:"win"|"loss"|"draw";myScore:number;oppScore:number;delta:number})=>{
  setRating(next);writeScoped("algoyol-duel-rating",String(next));
  // Recorded so the profile can show a real duel record instead of a guess.
  recordDuelResult({matchId,opponent:opponent.name,opponentRating:opponent.rating,outcome:entry.outcome,myScore:entry.myScore,oppScore:entry.oppScore,ratingBefore:rating,ratingAfter:next,delta:entry.delta});
  if(profile?.id)void saveDuelRating(profile.id,next);
 };
 if(authLoading)return <ScreenLoading lang={lang}/>;
 if(phase==="active")return <Duel key={matchId} lang={lang} opponent={opponent} rating={rating} matchId={matchId} onFinish={settle} onRematch={()=>setPhase("searching")} onExit={()=>setPhase("idle")} openRoadmap={openRoadmap}/>;
 const gap=Math.abs(opponent.rating-rating);
 return <><div className="page-head"><div><p className="eyebrow" style={{color:"#637068"}}>RATED MATCHMAKING</p><h1 className="page-title">{lang==="uz"?"Duel uchun raqib toping":"Find a duel opponent"}</h1><p className="muted">{lang==="uz"?"Tizim sizga reytingi yaqin bo‘lgan raqibni qidiradi.":"We will match you with a player near your rating."}</p></div>{signed&&<span className="tag">ELO {rating}</span>}</div>
 <div className="matchmaking panel"><div className={`search-orb ${phase==="searching"?"pulse":""}`}>{phase==="found"?"✓":"⚡"}</div>
  <h2>{phase==="idle"?(lang==="uz"?"Bellashishga tayyormisiz?":"Ready to compete?"):phase==="searching"?(lang==="uz"?"Raqib qidirilmoqda…":"Searching for an opponent…"):(lang==="uz"?"Raqib topildi!":"Opponent found!")}</h2>
  {phase==="found"?<><div className="found-player"><span className="avatar">{opponent.letter}</span><span><b>{opponent.name} · {opponent.handle}</b><br/><span className="muted">{opponent.rating} Elo · {opponent.wins} {lang==="uz"?"g‘alaba":"wins"}</span></span></div>
   <p className="muted">{lang==="uz"?`Reyting farqi: ${gap}. Duel 30 daqiqa davom etadi.`:`Rating difference: ${gap}. The duel lasts 30 minutes.`}</p>
   <div className="match-actions"><button className="primary" onClick={()=>setPhase("active")}>{lang==="uz"?"Duelni boshlash":"Start duel"} →</button><button className="secondary" onClick={()=>setPhase("idle")}>{lang==="uz"?"Bekor qilish":"Cancel"}</button></div></>
  :<><p className="muted">{phase==="searching"?(lang==="uz"?"Odatda 10 soniyadan kam vaqt oladi.":"This usually takes less than 10 seconds."):(lang==="uz"?"Easy, Medium va Hard masalalar ketma-ket ochiladi.":"Easy, Medium, and Hard problems unlock in order.")}</p>
    <button className={phase==="searching"?"secondary":"primary"} onClick={()=>{if(!signed){needAuth();return}setPhase(phase==="searching"?"idle":"searching")}}>{phase==="searching"?(lang==="uz"?"Qidiruvni bekor qilish":"Cancel search"):signed?(lang==="uz"?"Raqib qidirish":"Search for competitor"):(lang==="uz"?"Kirish talab qilinadi":"Sign in required")} {phase==="idle"&&signed&&"→"}</button></>}</div></>
}
/* Shown while a stored session is being verified — the app commits to neither
   guest nor account until it knows which one is true. */
function ScreenLoading({lang}:{lang:Lang}){
 return <div className="screen-state" role="status" aria-live="polite"><span className="spinner" aria-hidden/><p className="muted">{lang==="uz"?"Sessiya tekshirilmoqda…":"Checking your session…"}</p></div>;
}

/* A guest who lands on a protected URL gets a real explanation and a way in,
   not a profile made of placeholder numbers. */
function SignInRequired({lang,go,what}:{lang:Lang;go:(v:View)=>void;what:"profile"|"admin"|"placement"}){
 const copyUz={profile:["Profilingizni ko‘rish uchun kiring","Profil, progress va reyting faqat hisobingizga bog‘langan. Hisob yarating yoki kiring."],admin:["Bu sahifa uchun kirish talab qilinadi","Boshqaruv studiyasi faqat admin va owner rollari uchun."],placement:["Darajani aniqlash uchun kiring","Natijalar hisobingizga saqlanadi, shuning uchun avval kiring."]}[what];
 const copyEn={profile:["Sign in to see your profile","Your profile, progress and rating belong to an account. Create one or sign in."],admin:["Sign in to continue","The admin studio is available to the admin and owner roles only."],placement:["Sign in to take the placement","Your results are saved to your account, so sign in first."]}[what];
 const [title,body]=lang==="uz"?copyUz:copyEn;
 return <div className="screen-state panel">
  <span className="screen-state-ic" aria-hidden>🔒</span>
  <h1 className="page-title">{title}</h1>
  <p className="muted">{body}</p>
  <div className="match-actions"><button className="primary" onClick={()=>go("auth")}>{lang==="uz"?"Kirish yoki ro‘yxatdan o‘tish":"Sign in or register"} →</button><button className="secondary" onClick={()=>go("roadmaps")}>{lang==="uz"?"Yo‘l xaritalarini ko‘rish":"Browse roadmaps"}</button></div>
 </div>;
}

/* The ranking is read from the profiles table. It used to be a hard-coded list
   containing a row called "Siz" (You) with an invented rating — every visitor,
   signed in or not, appeared to hold 4th place. */
function Leaderboard({lang,me}:{lang:Lang;me:Profile|null}){
 const [rows,setRows]=useState<LeaderRow[]|null>(null),[state,setState]=useState<"loading"|"ready"|"error">("loading");
 useEffect(()=>{let live=true;fetchLeaderboard(50).then(list=>{if(!live)return;if(!list){setState("error");return}setRows(list);setState("ready")});return()=>{live=false}},[]);
 const myRank=me&&rows?rows.findIndex(r=>r.id===me.id):-1;
 return <><div className="page-head"><div><p className="eyebrow">ELO · K=32</p><h1 className="page-title">{lang==="uz"?"Duel reytingi":"Duel leaderboard"}</h1><p className="muted">{lang==="uz"?"Reyting duel natijalaridan hisoblanadi.":"Ratings come from real duel results."}</p></div>{me&&myRank>=0&&<span className="tag">{lang==="uz"?"Sizning o‘rningiz":"Your rank"} #{myRank+1}</span>}</div>
 {state==="loading"&&<div className="screen-state" role="status"><span className="spinner" aria-hidden/><p className="muted">{lang==="uz"?"Yuklanmoqda…":"Loading…"}</p></div>}
 {state==="error"&&<div className="panel"><div className="notice notice-error">{lang==="uz"?"Reytingni yuklab bo‘lmadi. Keyinroq urinib ko‘ring.":"Could not load the leaderboard. Try again later."}</div></div>}
 {state==="ready"&&(rows&&rows.length?<div className="leaderboard">{rows.map((x,i)=>{const mine=me?.id===x.id;const name=x.display_name?.trim()||x.username;return <div className={`leader-row ${mine?"me":""}`} key={x.id}><span className="rank">#{i+1}</span><span className="leader-who"><b>{name}{mine&&<span className="tag tag-you">{lang==="uz"?"Siz":"You"}</span>}</b><span className="muted">@{x.username}</span></span><span className="tag">{x.solved_count} AC</span><span className="rating">{x.duel_rating}</span></div>})}</div>
 :<div className="screen-state panel"><p className="muted">{lang==="uz"?"Hali reytingda hech kim yo‘q. Birinchi bo‘ling!":"Nobody is ranked yet. Be the first."}</p></div>)}</>;
}

function Admin({lang,profile}:{lang:Lang,profile:Profile}){
  const role:Role=profile.role;
  if(!can(role,"content.view_management"))return <><div className="page-head"><div><span className="tag">ADMIN STUDIO</span><h1 className="page-title" style={{marginTop:12}}>{lang==="uz"?"Ruxsat yo‘q":"Access denied"}</h1></div></div><div className="panel"><div className="notice">{lang==="uz"?"Bu sahifa faqat admin va owner rollari uchun. Supabase’da profilingiz roli hozir: ":"This page is for the admin and owner roles only. Your Supabase profile role is currently: "}<b>{roleLabel(role,lang)}</b>.</div></div></>;
 return <><div className="page-head"><div><span className="tag">ADMIN STUDIO · {roleLabel(role,lang)}</span><h1 className="page-title" style={{marginTop:12}}>{lang==="uz"?"Yangi masala":"New problem"}</h1></div><button className="primary" disabled title={lang==="uz"?"Masala muharriri hali ulanmagan":"The problem editor is not connected yet"}>{lang==="uz"?"Qoralamani saqlash":"Save draft"}</button></div><div className="panel"><div className="admin-grid"><div className="field"><label>O‘zbekcha nomi</label><input placeholder="Masala nomi"/></div><div className="field"><label>English title</label><input placeholder="Problem title"/></div><div className="field"><label>{lang==="uz"?"Qiyinlik":"Difficulty"}</label><select><option>Easy · 100</option><option>Medium · 200</option><option>Hard · 300</option></select></div><div className="field"><label>Taglar</label><input placeholder="binary-search, arrays"/></div></div><div className="admin-grid"><div className="field"><label>O‘zbekcha shart</label><textarea rows={9} placeholder="Masala shartini yozing…"/></div><div className="field"><label>English statement</label><textarea rows={9} placeholder="Write the problem statement…"/></div></div><div className="admin-grid"><div className="field"><label>{lang==="uz"?"Vaqt chegarasi":"Time limit"}</label><input value="1000 ms" readOnly/></div><div className="field"><label>{lang==="uz"?"Xotira chegarasi":"Memory limit"}</label><input value="256 MB" readOnly/></div></div><div className="field"><label>{lang==="uz"?"Yashirin testlar":"Hidden tests"}</label><textarea rows={5} placeholder="Input → Expected output"/></div><div className="notice notice-info">{lang==="uz"?"Bu forma ko‘rib chiqish rejimida — masala muharriri hali backendga ulanmagan, shuning uchun saqlash o‘chirilgan. Admin faqat o‘zi yaratgan masalalarni tahrirlaydi, owner esa barchasini.":"This form is a preview — the problem editor is not connected to the backend yet, so saving is disabled. Admins edit only their own problems; the owner manages all content."}</div></div></>}
