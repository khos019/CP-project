"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- see the note in ./Chrome */

import { useEffect, useMemo, useRef, useState } from "react";
import { RoadmapExperience } from "./RoadmapExperience";
import { RoadmapHub, roadmapStatus, unitDone } from "./RoadmapHub";
import { roadmapCards } from "./roadmap-data";
import { roadmapCatalog } from "./roadmap-data";
import { bankProblems, type BankProblem } from "./problem-bank";
import { applySolve, ratingColor } from "./rating";
import { Shop } from "./Shop";
import { Playground } from "./Playground";
import { CodeEditor } from "./CodeEditor";
import { ChallengeOverlay, DuelMatchmaking, DUEL_EVENT } from "./DuelArena";
import { OnlineDot, onlineAmong } from "./presence";
import { loadPlacement } from "./mastery";
import { openDuelChannel, userTopic, matchTopic, type DuelChannel } from "./duel-realtime";
import { acceptChallenge, declineChallenge, duelHeartbeat, duelState, type DuelState } from "./duel-client";
import { addLocalActivity, pushActivity } from "./coins";
import { Placement } from "./Placement";
import { AuthPage } from "./AuthPage";
import { ContinueHero } from "./ContinueHero";
import { OwnerStats } from "./OwnerStats";
import { BrandMark } from "./BrandMark";
import { MobileTabBar, SiteFooter, SiteHeader, linkTo } from "./Chrome";
import { RoadmapGraph, buildSpine } from "./RoadmapGraph";
import { EmptyState, ProgressBar, Skeleton } from "./kit";
import { ProfilePage } from "./ProfilePage";
import { UsersAdmin } from "./UsersAdmin";
import { Messages } from "./Messages";
import { PublicProfile } from "./PublicProfile";
import { MASTERY_CONFIG, backfillMastery, loadMastery, masteryOf, recordEvidence } from "./mastery";
import { emptyProgress, loadProgress, readLocal as readLocalProgress, syncUp } from "./progress";
import { can } from "./permissions";
import { fetchFriends, recordSubmission, type FriendRow } from "./social";
import { FriendsScreen, PersonSubmissions, SubmissionsScreen } from "./social-ui";
import {
 GUEST_SCOPE, adoptGuestInto, adoptLegacyInto, clearSession, dropScopeData, ensureFreshToken, fetchLeaderboard,
 fetchLearnerCount,
 fetchProfile, fetchUnreadCount, readScoped, readStoredUserId, readToken, removeScoped, searchPeople, setScope,
 storeSession, supabaseReady, writeScoped, type LeaderRow, type Profile, type Role,
} from "./session";

type Lang="uz"|"en"; type View="home"|"roadmaps"|"roadmap"|"problems"|"problem"|"duel"|"leaderboard"|"profile"|"auth"|"admin"|"placement"|"stats"|"users"|"messages"|"person"|"shop"|"friends"|"submissions"|"person-submissions"|"playground";
const copy={uz:{home:"Bosh sahifa",roadmaps:"Yo‘l xaritalari",problems:"Masalalar",duel:"Duel",leaderboard:"Reyting",shop:"Do‘kon",playground:"Kompilyator",login:"Kirish",hero:"Algoritmlarni o‘rganing, bellashing va o‘sing.",sub:"Tushunarli o‘zbekcha darslar, haqiqiy kod tekshiruvchi va 30 daqiqalik jonli duellar — barchasi bitta maydonda.",start:"O‘rganishni boshlash",arena:"Duel maydoni",featured:"Mashhur yo‘l xaritalari",all:"Barchasini ko‘rish",tasks:"Masalalar banki",solve:"Yechish",submit:"Yechimni yuborish"},en:{home:"Home",roadmaps:"Roadmaps",problems:"Problems",duel:"Duel",leaderboard:"Leaderboard",shop:"Shop",playground:"Compiler",login:"Sign in",hero:"Learn algorithms, compete, and grow.",sub:"Clear lessons, a real code checker, and live 30-minute duels — all in one focused arena.",start:"Start learning",arena:"Enter duel arena",featured:"Featured roadmaps",all:"View all",tasks:"Problem library",solve:"Solve",submit:"Submit solution"}};
const allRoads=roadmapCards;
const roadmapCatalogSize=()=>({tracks:roadmapCards.length,units:roadmapCards.reduce((n,r)=>n+r.units,0)});
// Every problem now comes from the generated bank: each one has a rating, a
// full statement and real hidden tests. The old inline entries were mostly
// decorative — they had no judge key, so they could never be solved.
const problems:BankProblem[]=[...bankProblems];
const cpp=`#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long a, b;\n    cin >> a >> b;\n    cout << a + b << "\\n";\n    return 0;\n}`;

/* Session, profile and role handling live in ./session — one module owns the
   difference between a guest and an account. Re-exported so existing imports
   ({ Role } from "./AlgoYolApp") keep resolving. */
export type { Role, Profile } from "./session";
export { supabaseConfig, supabaseReady, fetchProfile } from "./session";

/* Three states, never guessed: a stored token is being verified, there is no
   account, or there is one. "authenticated" always carries a real profile. */
type Auth={status:"loading"}|{status:"guest"}|{status:"authenticated";profile:Profile};

/* What an OAuth / email-link redirect left in the URL.
   This has to be read during the first render, not from an effect: the history
   effect calls replaceState to put the canonical path in the address bar, which
   drops the fragment. Reading it from an effect made the result depend on the
   order the effects happen to be declared in — and a reorder silently threw
   every Google sign-in away. */
type AuthReturn={kind:"token";token:string;refresh:string|null}|{kind:"code";code:string}|{kind:"error";message:string}|null;
function readAuthReturn():AuthReturn{
 if(typeof window==="undefined")return null;
 const hash=new URLSearchParams(window.location.hash.replace(/^#/,""));
 const query=new URLSearchParams(window.location.search);
 const token=hash.get("access_token");
 // The refresh token rides along in the same fragment; without it the session
 // would die an hour later with no way to renew it.
 if(token)return {kind:"token",token,refresh:hash.get("refresh_token")};
 const error=hash.get("error_description")||query.get("error_description")||hash.get("error")||query.get("error");
 if(error)return {kind:"error",message:decodeURIComponent(error.replace(/\+/g," "))};
 const code=query.get("code");
 if(code)return {kind:"code",code};
 return null;
}

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
 // Unread count for the inbox badge, and the person a message screen should
 // open on when another screen sends the learner there.
 const [unread,setUnread]=useState(0);
 // Duel: the server's view of what this learner is doing, when it was read
 // (so a countdown can be drawn against the server clock rather than the
 // device's), the socket state, and a one-line explanation for the cases that
 // need one — "another player took this opponent" being the common one.
 const [duel,setDuel]=useState<DuelState|null>(null);
 const [duelAt,setDuelAt]=useState(()=>Date.now());
 const [duelOnline,setDuelOnline]=useState(false);
 const [duelNotice,setDuelNotice]=useState("");
 const channelRef=useRef<DuelChannel|null>(null);
 /* Offer the level check to anybody signed in who has not taken it. Read in an
    effect rather than during render: it comes from storage, and a render must
    not depend on what storage happens to say. */
 const [offerPlacement,setOfferPlacement]=useState(false);
 const [messageWith,setMessageWith]=useState<string|null>(null);
 // A UTC day carried from the statistics chart to the users page.
 const [usersDay,setUsersDay]=useState<string|null>(null);
 // The handle whose public profile is on screen.
 const [person,setPerson]=useState<string|null>(null);
 const authReturn=useRef<AuthReturn>(readAuthReturn());
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

 // Seeded after mount on purpose: the server has no localStorage, so reading
 // it during the first render would make the two disagree and break hydration.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{const saved=localStorage.getItem("algoyol-lang") as Lang|null;if(saved)setLang(saved)},[]);
 // Boot: adopt the stored scope synchronously so the first paint reads the
 // right namespace, then verify the token. The "loading" flip has to happen
 // here for the same hydration reason as the language above.
 useEffect(()=>{
  const token=readToken(),storedId=readStoredUserId();
  if(storedId)setScope(storedId);
  if(!token||!supabaseReady()){setScope(GUEST_SCOPE);adoptLegacyInto(GUEST_SCOPE);return}
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setAuth({status:"loading"});
  let live=true;
  // Renew the token first when it is stale, so a returning learner is verified
  // against a live one instead of being silently dropped back to guest.
  ensureFreshToken().then(fresh=>fresh?fetchProfile(fresh):null).then(next=>{
   if(!live)return;
   if(!next){clearSession();setScope(GUEST_SCOPE);setAuth({status:"guest"});return}
   setScope(next.id);adoptLegacyInto(next.id);
   setAuth({status:"authenticated",profile:next});
   void hydrateAccountState();
  });
  return()=>{live=false};
 },[]);
 /* Access tokens expire after an hour. Every authenticated read in the app
    takes the stored token as-is, so it is kept fresh here rather than in each
    caller: without this the session quietly stopped working mid-visit and the
    shop blamed it on an unapplied migration. */
 useEffect(()=>{
  if(auth.status!=="authenticated")return;
  const id=window.setInterval(()=>{void ensureFreshToken()},5*60*1000);
  return()=>window.clearInterval(id);
 },[auth.status]);
 /* Inbox badge. Polled rather than pushed: a realtime subscription is a
    second connection to keep alive for a number that changes a few times a
    day, and a stale badge is corrected the moment the inbox is opened. */
 // Reads storage on mount and whenever progress changes; the state it sets is
 // a consequence of what it read, not of rendering.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{
  if(auth.status!=="authenticated")return;
  const seen=()=>{setOfferPlacement(!loadPlacement()&&readScoped("algoyol-placement-dismissed")!=="1")};
  seen();
  window.addEventListener("algoyol-progress",seen);
  return()=>window.removeEventListener("algoyol-progress",seen);
 },[auth.status]);
 const refreshUnread=async()=>{
  if(auth.status!=="authenticated"){setUnread(0);return}
  const result=await fetchUnreadCount();
  setUnread(result.ok?Number(result.data)||0:0);
 };
 useEffect(()=>{
  // No badge to keep for a guest, and nothing to clear either: the button it
  // sits on is only rendered while signed in.
  if(auth.status!=="authenticated")return;
  let live=true;
  const tick=async()=>{const r=await fetchUnreadCount();if(live)setUnread(r.ok?Number(r.data)||0:0)};
  void tick();
  const id=setInterval(tick,60000);
  return()=>{live=false;clearInterval(id)};
 },[auth.status]);

 // Reacts to a verdict that arrived from the judge, so the state it sets is a
 // consequence of a response rather than of rendering.
 useEffect(()=>{if(!verdict.startsWith("Qabul qilindi")&&!verdict.startsWith("Accepted"))return;if(activeProblem.judge){applySolve(activeProblem.id,activeProblem.rating||1200);const base=MASTERY_CONFIG.weights.problem[activeProblem.difficulty as keyof typeof MASTERY_CONFIG.weights.problem];recordEvidence(activeProblem.topic,"problem",`problem:${activeProblem.id}`,base)}const lesson=readScoped("algoyol-active-lesson");if(!lesson)return;let data={quizScores:{},solved:{}} as {quizScores:Record<string,number>;solved:Record<string,boolean>};try{data=JSON.parse(readScoped("algoyol-roadmap-progress")||JSON.stringify(data))}catch{}if(!data.solved[lesson])recordEvidence(lesson.slice(0,lesson.lastIndexOf("-")),"lesson",`lesson:${lesson}`,MASTERY_CONFIG.weights.lesson);data.solved={...data.solved,[lesson]:true};writeScoped("algoyol-roadmap-progress",JSON.stringify(data));removeScoped("algoyol-active-lesson");window.dispatchEvent(new Event("algoyol-progress"))},[verdict]);// eslint-disable-line react-hooks/exhaustive-deps
 // The address bar reflects the current screen — /roadmaps/{slug}/{unit} —
 // so two roadmaps (or two units) are never one indistinguishable URL.
 /* A screen is a view plus whatever that view is *about*. `person` is a handle
    rather than an id so the address is /u/ozodbek — something worth sending to
    somebody, which is the whole reason the page exists. */
 type Screen={view:View;roadmap:string;unit:string|null;person:string|null};
 const screenToPath=(s:Screen):string=>{
  if(s.view==="home")return "/";
  if(s.view==="roadmaps")return "/roadmaps";
  if(s.view==="roadmap")return s.unit?`/roadmaps/${s.roadmap}/${s.unit}`:`/roadmaps/${s.roadmap}`;
  if(s.view==="person")return s.person?`/u/${s.person}`:"/";
  if(s.view==="person-submissions")return s.person?`/u/${s.person}/submissions`:"/";
  return `/${s.view}`;
 };
 const pathToScreen=(path:string):Screen=>{
  const parts=path.split("/").filter(Boolean);
  const base={roadmap:"foundations",unit:null,person:null};
  if(parts[0]==="roadmaps"&&parts[1])return {...base,view:"roadmap",roadmap:parts[1],unit:parts[2]||null};
  if(parts[0]==="u"&&parts[1])return {...base,view:parts[2]==="submissions"?"person-submissions":"person",person:decodeURIComponent(parts[1])};
  const known:View[]=["home","roadmaps","problems","problem","duel","leaderboard","profile","auth","placement","admin","stats","users","messages","friends","submissions"];
  const v=known.find(x=>x===parts[0]);
  return {...base,view:v||"home"};
 };
 const screenRef=useRef<Screen>(typeof window==="undefined"?{view:"home",roadmap:"foundations",unit:null,person:null}:pathToScreen(window.location.pathname)),navDepth=useRef(0);
 const applyScreen=(s:Screen)=>{screenRef.current=s;setView(s.view);setSelectedRoadmap(s.roadmap);setSelectedUnit(s.unit);setPerson(s.person)};
 const pushScreen=(patch:Partial<Screen>)=>{const next={...screenRef.current,...patch};applyScreen(next);window.history.pushState(next,"",screenToPath(next));navDepth.current++;window.scrollTo({top:0,behavior:"smooth"})};
 const go=(v:View)=>pushScreen({view:v,unit:null});
 /* Duel presence and realtime.
    Three things were missing and a challenge needs all three: the server has
    to be told this learner is here (heartbeat), the browser has to be
    listening (channel), and the card has to be able to appear on whatever
    screen they happen to be on — a notification that only shows up on the
    duel page is not a notification. This lives in the shell for that last
    reason. */
 useEffect(()=>{
  if(auth.status!=="authenticated"||!profile)return;
  let live=true;
  const beat=()=>{void duelHeartbeat(true)};
  beat();
  const beatId=window.setInterval(beat,25000);
  /* A hidden tab has its timers throttled to about one call a minute, so the
     interval alone lets a learner who is sitting on another tab drift out of
     the presence window. Beating the moment the tab comes back puts them
     online again immediately rather than up to 25 seconds later. */
  const wake=()=>{if(document.visibilityState==="visible")beat()};
  document.addEventListener("visibilitychange",wake);
  window.addEventListener("focus",wake);
  const pull=async()=>{const next=await duelState();if(live&&next&&"status" in next){setDuel(next);setDuelAt(Date.now())}};
  void pull();
  const channel=openDuelChannel(event=>{
   if(!live)return;
   // The payload is never the source of truth — it says something happened,
   // and the server is asked what. Public channels make that the only safe
   // reading, and it also means a dropped event costs a second, not a duel.
   if(event.event==="duel_challenge_cancelled")setDuelNotice(lang==="uz"?"Raqibni boshqa o‘yinchi oldi.":"Another player took this opponent.");
   // A message arrives on the same channel the duel already keeps open, so the
   // badge updates now rather than on the next minute's poll. The event carries
   // no text — only that there is something to re-read.
   if(event.event==="message_received"){void refreshUnread();return}
   if(event.event==="match_found"){const id=String((event.payload as {duel_id?:string}).duel_id||"");if(id)channelRef.current?.join(matchTopic(id));go("duel")}
   void pull();
   window.dispatchEvent(new Event(DUEL_EVENT));
  },status=>setDuelOnline(status==="open"));
  channelRef.current=channel;
  channel.join(userTopic(profile.id));
  return()=>{live=false;window.clearInterval(beatId);
   document.removeEventListener("visibilitychange",wake);window.removeEventListener("focus",wake);
   channel.close();channelRef.current=null};
 },[auth.status,profile?.id]);// eslint-disable-line react-hooks/exhaustive-deps
 /* A duel in progress gets its own topic, so submissions and the finish reach
    both players without either of them polling for it. */
 useEffect(()=>{
  const id=duel?.duel?.id;
  if(!id||!channelRef.current)return;
  channelRef.current.join(matchTopic(id));
  return()=>{channelRef.current?.leave(matchTopic(id))};
 },[duel?.duel?.id]);
 const back=()=>{if(navDepth.current>0)window.history.back();else pushScreen({view:"roadmaps",unit:null})};
 // Coin streaks need real engaged time, so the clock stops on a hidden tab
 // and time is banked in 60s chunks rather than trusted as one large number.
 useEffect(()=>{const tick=()=>{if(document.visibilityState!=="visible")return;addLocalActivity(60);void pushActivity(60)};const id=window.setInterval(tick,60000);return()=>window.clearInterval(id)},[]);
 // Browser back/forward: each screen change pushes an entry, popstate restores it.
 useEffect(()=>{applyScreen(screenRef.current);window.history.replaceState(screenRef.current,"",screenToPath(screenRef.current));const onPop=(e:PopStateEvent)=>{const st=e.state as Screen|null;applyScreen(st&&typeof st==="object"&&"view" in st?st:pathToScreen(window.location.pathname));navDepth.current=Math.max(0,navDepth.current-1)};window.addEventListener("popstate",onPop);return()=>window.removeEventListener("popstate",onPop)},[]); const applyLang=(n:Lang)=>{setLang(n);localStorage.setItem("algoyol-lang",n)};
 const swap=()=>applyLang(lang==="uz"?"en":"uz");
 const enterSession=async(token:string,remember:boolean,isNew:boolean,refreshToken?:string)=>{
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
  storeSession(token,remember,next.id,refreshToken);
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
 const openPerson=(handle:string)=>{pushScreen({view:"person",person:handle,unit:null})};
 /* Answering a challenge. Every outcome here is the server's word: "ok" means
    a duel exists, and a refusal names its reason so the card can say what
    happened rather than just vanishing. */
 const pullDuel=async()=>{const next=await duelState();if(next&&"status" in next){setDuel(next);setDuelAt(Date.now())}};
 const onAcceptChallenge=async(id:string)=>{
  setDuelNotice("");
  const outcome=await acceptChallenge(id);
  if(outcome&&"ok" in outcome&&outcome.ok){await pullDuel();window.dispatchEvent(new Event(DUEL_EVENT));go("duel");return}
  const reason=outcome&&"error" in outcome?String(outcome.error):"";
  setDuelNotice(reason==="expired"?(lang==="uz"?"Chaqiriq muddati tugadi.":"The challenge expired.")
   :reason==="already_taken"?(lang==="uz"?"Kech qoldingiz — raqibni boshqa o‘yinchi oldi.":"Too slow — another player took this opponent.")
   :(lang==="uz"?"Chaqiriqni qabul qilib bo‘lmadi.":"That challenge could not be accepted."));
  await pullDuel();
 };
 const onDeclineChallenge=async(id:string)=>{await declineChallenge(id);await pullDuel()};
 // OAuth / email-link return, consumed from the value captured at first render.
 useEffect(()=>{
  const ret=authReturn.current;
  authReturn.current=null;
  if(!ret)return;
  window.history.replaceState({},"",window.location.pathname);
  if(ret.kind==="token"){void enterSession(ret.token,true,false,ret.refresh||undefined);return}
  if(ret.kind==="error"){setAuthNotice(ret.message);setView("auth");return}
  // A PKCE authorisation code needs the verifier that produced its challenge.
  // We never issued one, so say so plainly rather than failing in silence.
  setAuthNotice(lang==="uz"
   ?"Google javobi PKCE rejimida qaytdi. Administratorga xabar bering."
   :"Google returned a PKCE authorisation code this client cannot exchange. Please report this.");
  setView("auth");
 },[]);// eslint-disable-line react-hooks/exhaustive-deps
 const filtered=useMemo(()=>filter==="all"?problems:problems.filter(p=>p.difficulty===filter),[filter]);
 const judge=async()=>{if(!signed){setView("auth");return}if(!activeProblem.judge){setVerdict(lang==="uz"?"Bu masala uchun tekshiruvchi tez orada ulanadi":"The judge for this problem is coming soon");return}setVerdict(lang==="uz"?"Navbatda… testlar tekshirilmoqda":"In queue… running hidden tests");try{const response=await fetch("/api/judge",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({problemId:activeProblem.judge,language:codeLang,sourceCode:code})});const r=await response.json();const names:Record<string,[string,string]>={ACCEPTED:["Qabul qilindi","Accepted"],WRONG_ANSWER:["Noto‘g‘ri javob","Wrong answer"],COMPILATION_ERROR:["Kompilyatsiya xatosi","Compilation error"],RUNTIME_ERROR:["Bajarilish xatosi","Runtime error"],TIME_LIMIT_EXCEEDED:["Vaqt chegarasi oshdi","Time limit exceeded"],MEMORY_LIMIT_EXCEEDED:["Xotira chegarasi oshdi","Memory limit exceeded"],JUDGE_ERROR:["Tekshiruvchi xatosi","Judge error"]};const title=(names[r.verdict]||names.JUDGE_ERROR)[lang==="uz"?0:1];const test=r.test?` · ${lang==="uz"?"test":"test"} #${r.test}`:"";const stats=r.verdict==="ACCEPTED"?` · ${r.passed}/${r.total} · ${r.runtimeMs} ms · ${r.memoryKb} KB`:"";setVerdict(`${title}${test}${stats}${r.details?`\n${String(r.details).slice(0,900)}`:""}`);
  // The verdict belongs to the account, not to this tab: it is what a profile
  // shows, and what decides whether this person may read other people's code
  // for the same problem. Written after the fact, so a failed write costs the
  // learner nothing.
  void recordSubmission({problemKey:activeProblem.judge,problemTitle:lang==="uz"?activeProblem.uz:activeProblem.en,language:codeLang,verdict:String(r.verdict||"JUDGE_ERROR"),runtimeMs:r.runtimeMs??null,memoryKb:r.memoryKb??null,passed:r.passed??null,total:r.total??null,source:code})}catch{setVerdict(lang==="uz"?"Tekshiruvchi bilan aloqa uzildi":"Judge connection failed")}};
 const zone=(["duel","leaderboard"] as View[]).includes(view)?"compete":"learn";
 return <div className="shell" data-zone={zone}><SiteHeader lang={lang} view={view} go={v=>go(v as View)} signed={signed} authLoading={auth.status==="loading"} name={profile?.display_name||profile?.username||null} unread={unread} swapLang={swap} />
 {signed&&offerPlacement&&view!=="placement"&&<div className="placement-offer">
  <span className="po-ic" aria-hidden>◎</span>
  <span className="po-copy"><b>{lang==="uz"?"Darajangizni aniqlaymizmi?":"Shall we find your level?"}</b>
   <small>{lang==="uz"?"14 ta savol · 6 daqiqa. Bilgan bosqichlaringiz ochib beriladi.":"Fourteen questions, six minutes. Units you already know get opened for you."}</small></span>
  <button className="primary" onClick={()=>go("placement")}>{lang==="uz"?"Boshlash":"Start"}</button>
  <button className="po-close" aria-label={lang==="uz"?"Yopish":"Dismiss"}
   onClick={()=>{writeScoped("algoyol-placement-dismissed","1");setOfferPlacement(false)}}>✕</button>
 </div>}
 <main className="main">{view==="home"&&(auth.status==="loading"?<ScreenLoading lang={lang}/>:signed&&profile?<><Dashboard lang={lang} profile={profile} go={go} openRoadmap={openRoadmap} onSelectProblem={p=>{setActiveProblem(p);setVerdict("");go("problem")}}/></>:<Home lang={lang} go={go} openRoadmap={openRoadmap}/>)} {view==="roadmaps"&&<RoadmapHub lang={lang} role={role} openRoadmap={openRoadmap}/>} {view==="roadmap"&&<RoadmapExperience slug={selectedRoadmap} lang={lang} role={role} unitId={selectedUnit} onOpenUnit={id=>pushScreen({unit:id})} onBack={back} onPractice={()=>pushScreen({view:"problem"})} onOpenProblem={(id:string)=>{const p=bankProblems.find(x=>x.id===id);if(p){setActiveProblem(p);setVerdict("");pushScreen({view:"problem"})}}}/>} {view==="problems"&&<Problems lang={lang} filter={filter} setFilter={setFilter} items={filtered} go={go} onSelect={p=>{setActiveProblem(p);setCode(p.judge==="max-subarray"?duelProblems[1].cpp:p.judge==="coin-change"?duelProblems[2].cpp:cpp);setVerdict("");go("problem")}}/>} {view==="problem"&&<Problem lang={lang} item={activeProblem} code={code} setCode={setCode} codeLang={codeLang} setCodeLang={setCodeLang} verdict={verdict} submit={judge} onBack={back}/>} {view==="duel"&&<DuelMatchmaking lang={lang} signed={signed} authLoading={auth.status==="loading"} needAuth={()=>go("auth")}/>} {view==="leaderboard"&&<Leaderboard lang={lang} me={profile} signed={signed} onOpenPerson={openPerson}/>} {view==="profile"&&(auth.status==="loading"?<ScreenLoading lang={lang}/>:profile?<ProfilePage lang={lang} profile={profile} onProfileChange={next=>setAuth({status:"authenticated",profile:next})} signOut={signOut} goAdmin={()=>go("admin")} goStats={()=>go("stats")} goUsers={()=>go("users")} goMessages={()=>go("messages")} isOwner={can(role,"user.manage_roles")} goRoadmaps={()=>go("roadmaps")} openRoadmap={openRoadmap} isStaff={can(role,"content.view_management")} goFriends={()=>go("friends")} goSubmissions={()=>go("submissions")}/>:<SignInRequired lang={lang} go={go} what="profile"/>)} {view==="auth"&&<AuthPage lang={lang} notice={authNotice} onAuthenticated={(token,remember,isNew,refreshToken)=>{void enterSession(token,remember,isNew,refreshToken)}}/>} {view==="placement"&&(auth.status==="loading"?<ScreenLoading lang={lang}/>:signed?<Placement lang={lang} signed={signed} onFinish={()=>go("roadmaps")} onRoadmap={openRoadmap}/>:<SignInRequired lang={lang} go={go} what="placement"/>)} {view==="admin"&&(auth.status==="loading"?<ScreenLoading lang={lang}/>:profile?<Admin lang={lang} profile={profile}/>:<SignInRequired lang={lang} go={go} what="admin"/>)} {view==="person"&&(person?<PublicProfile key={person} lang={lang} username={person} meId={profile?.id||null} signedIn={signed} onBack={back} onMessage={id=>{setMessageWith(id);go("messages")}} onMyProfile={()=>go("profile")} onSignIn={()=>go("auth")} onOpenSubmissions={h=>pushScreen({view:"person-submissions",person:h})}/>:<ScreenLoading lang={lang}/>)} {view==="shop"&&<Shop lang={lang} signed={signed} authLoading={auth.status==="loading"}/>} {view==="playground"&&<Playground lang={lang}/>} {view==="friends"&&(auth.status==="loading"?<ScreenLoading lang={lang}/>:signed?<FriendsScreen lang={lang} onBack={()=>go("profile")} onOpenPerson={openPerson}/>:<SignInRequired lang={lang} go={go} what="profile"/>)} {view==="submissions"&&(auth.status==="loading"?<ScreenLoading lang={lang}/>:profile?<SubmissionsScreen lang={lang} userId={profile.id} who={profile.display_name||profile.username} isMe signedIn onBack={()=>go("profile")}/>:<SignInRequired lang={lang} go={go} what="profile"/>)} {view==="person-submissions"&&(person?<PersonSubmissions key={person} lang={lang} handle={person} meId={profile?.id||null} signedIn={signed} onBack={back}/>:<ScreenLoading lang={lang}/>)} {view==="messages"&&(auth.status==="loading"?<ScreenLoading lang={lang}/>:profile?<Messages lang={lang} me={profile} openWith={messageWith} onOpened={()=>setMessageWith(null)} onUnreadChange={()=>{void refreshUnread()}} onOpenProfile={openPerson}/>:<SignInRequired lang={lang} go={go} what="messages"/>)} {view==="users"&&(auth.status==="loading"?<ScreenLoading lang={lang}/>:!profile?<SignInRequired lang={lang} go={go} what="users"/>:can(role,"user.manage_roles")?<UsersAdmin lang={lang} meId={profile.id} goProfile={()=>go("profile")} onMessage={id=>{setMessageWith(id);go("messages")}} onOpenProfile={openPerson} initialDay={usersDay} onDayConsumed={()=>setUsersDay(null)}/>:<div className="panel"><div className="notice notice-error">{lang==="uz"?"Bu sahifa faqat ega (owner) roli uchun.":"This page is for the owner role only."}</div></div>)} {view==="stats"&&(auth.status==="loading"?<ScreenLoading lang={lang}/>:!profile?<SignInRequired lang={lang} go={go} what="stats"/>:can(role,"stats.view")?<OwnerStats lang={lang} goProfile={()=>go("profile")} onPickDay={day=>{setUsersDay(day);go("users")}}/>:<div className="panel"><div className="notice notice-error">{lang==="uz"?"Bu sahifa faqat ega (owner) roli uchun.":"This page is for the owner role only."}</div></div>)}</main>
 <MobileTabBar lang={lang} view={view} go={v=>go(v as View)} /><SiteFooter lang={lang} go={v=>go(v as View)} />
 {/* Above every screen: a challenge can arrive while the learner is halfway
     through a lesson, and five seconds is not long enough to go looking. */}
 <ChallengeOverlay lang={lang} challenge={duel?.challenge||null} serverNow={duel?.now||new Date().toISOString()}
  drawnAt={duelAt} notice={duelNotice} onAccept={id=>{void onAcceptChallenge(id)}}
  onDecline={id=>{void onDeclineChallenge(id)}} onExpire={()=>{void pullDuel()}}/>
 {signed&&duel?.status==="searching"&&!duelOnline&&<div className="duel-toast" role="status">{lang==="uz"?"Aloqa uzildi — qayta ulanmoqda…":"Connection lost — reconnecting…"}</div>}
 </div>
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
 ctaInTitle:"Keyingi bosqichga o‘ting.",
 ctaInBody:"Yo‘l xaritangiz sizni kutmoqda. Tayyor bo‘lsangiz, duelda bilimingizni sinab ko‘ring.",
 ctaInPrimary:"O‘rganishni davom ettirish",
 ctaInSecondary:"Duel maydoni",
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
 ctaInTitle:"On to the next unit.",
 ctaInBody:"Your roadmap is waiting. When you feel ready, put it to the test in the arena.",
 ctaInPrimary:"Continue learning",
 ctaInSecondary:"Duel arena",
}};

/* The explanation of what AlgoYo'l is and how it works is not marketing that
   stops being true once you register — the unlock rule and the mastery scale
   are the mechanics a learner lives inside. So the introduction is split from
   the guest hero and shown in both states: a guest gets hero + introduction, a
   signed-in learner gets their dashboard first and the same introduction below
   it. Only the pieces that would contradict the state change: the marketing
   hero and the "create an account" call to action. */
/* The four-step loop. Numbered because the order is the mechanic — this is the
   one place on the site where a number is allowed to be decoration-adjacent,
   because it is not decoration. Laid out as a ring that closes back on itself,
   since that is what the loop actually does. */
/* The signed-in home. A learner who has an account does not need the pitch —
   they need the answer to "where was I", which is why the marketing sections
   are replaced rather than merely re-headed. Left column: what to do next.
   Right column: how it is going, and the same path drawing from the landing
   page, now filled in with their real progress. */
function Dashboard({lang,profile,go,openRoadmap,onSelectProblem}:{
 lang:Lang;profile:Profile;go:(v:View)=>void;openRoadmap:(slug:string)=>void;
 onSelectProblem:(p:BankProblem)=>void;
}){
 const uz=lang==="uz";
 const [nodes,setNodes]=useState<ReturnType<typeof buildSpine>>([]);
 useEffect(()=>{
  const read=()=>setNodes(buildSpine(lang));
  read();
  window.addEventListener("algoyol-progress",read);
  return()=>window.removeEventListener("algoyol-progress",read);
 },[lang]);

 /* Practice is suggested from the weakest topics rather than from the top of
    the bank: a recommendation that ignores what you are bad at is just a list. */
 const suggestions=useMemo(()=>{
  const mastery=loadMastery();
  const weakest=[...new Set(problems.map(p=>p.topic))]
   .sort((a,b)=>masteryOf(a)-masteryOf(b))
   .slice(0,3);
  const unsolved=problems.filter(p=>mastery.evidence[`problem:${p.id}`]===undefined);
  const picked=weakest.flatMap(topic=>unsolved.filter(p=>p.topic===topic).slice(0,2));
  return (picked.length?picked:unsolved).slice(0,4);
 },[]);

 const done=nodes.reduce((n,x)=>n+x.done,0);
 const total=nodes.reduce((n,x)=>n+x.units,0);

 return <>
  <ContinueHero lang={lang} profile={profile} go={v=>go(v as View)} openRoadmap={openRoadmap}/>
  <section className="dash">
   <div className="dash-main">
    <div className="section-head">
     <h2>{uz?"Sizga tavsiya etilgan masalalar":"Recommended problems"}</h2>
     <a className="see-all" href="/problems" onClick={linkTo(()=>go("problems"))}>{uz?"Barchasini ko‘rish":"View all"}</a>
    </div>
    {suggestions.length
     ? <ProblemList lang={lang} items={suggestions} go={go} onSelect={onSelectProblem}/>
     : <EmptyState lang={lang} icon="◎"
        title={uz?"Tavsiya qoldi emas":"Nothing left to suggest"}
        body={uz?"Bankdagi masalalarni yechib bo‘ldingiz. Duelda sinab ko‘ring.":"You have solved the bank. Try the arena."}
        action={{label:uz?"Duel topish":"Find a duel",onClick:()=>go("duel")}}/>}
   </div>

   <aside className="dash-side">
    <div className="panel dash-path">
     <div className="dash-path-top">
      <h3>{uz?"Sizning yo‘lingiz":"Your path"}</h3>
      <span className="muted">{done}/{total}</span>
     </div>
     <RoadmapGraph lang={lang} nodes={nodes} onOpen={openRoadmap} animate={false}/>
     <a className="see-all" href="/roadmaps" onClick={linkTo(()=>go("roadmaps"))}>
      {uz?"Barcha yo‘nalishlar":"All tracks"}
     </a>
    </div>
   </aside>
  </section>
 </>;
}

function LandingLoop({lang}:{lang:Lang}){
 const L=LAND[lang];
 return <section className="lp-block">
  <div className="section-head"><h2>{L.howTitle}</h2></div>
  <p className="lp-lede muted">{L.howLede}</p>
  <ol className="loop">{L.how.map(([title,body],i)=>
   <li className="loop-step" key={title}>
    <span className="loop-n">{i+1}</span>
    <b>{title}</b>
    <span className="muted">{body}</span>
   </li>)}
   <li className="loop-back" aria-hidden>{lang==="uz"?"va yana boshidan":"and around again"}</li>
  </ol>
 </section>;
}

function LandingBrowse({lang,go,openRoadmap}:{lang:Lang;go:(v:View)=>void;openRoadmap:(slug:string)=>void}){
 const t=copy[lang];
 return <section className="lp-block">
  <div className="section-head">
   <h2>{t.featured}</h2>
   <a className="see-all" href="/roadmaps" onClick={linkTo(()=>go("roadmaps"))}>{t.all}</a>
  </div>
  {/* Six, not three: three cards read as a sample, six read as a catalogue —
      and the catalogue is the product. */}
  <RoadGrid lang={lang} roads={allRoads.slice(0,6)} openRoadmap={openRoadmap}/>
 </section>;
}

function LandingCta({lang,go,signed}:{lang:Lang;go:(v:View)=>void;signed:boolean}){
 const L=LAND[lang];
 return <section className="lp-cta">
  <div>
   <h2>{signed?L.ctaInTitle:L.ctaTitle}</h2>
   <p className="muted">{signed?L.ctaInBody:L.ctaBody}</p>
  </div>
  <button className="primary" onClick={()=>go("roadmaps")}>{signed?L.ctaInPrimary:L.ctaPrimary}</button>
 </section>;
}

function Home({lang,go,openRoadmap}:{lang:Lang,go:(v:View)=>void,openRoadmap:(slug:string)=>void}){
 const t=copy[lang],L=LAND[lang];
 const nodes=useMemo(()=>buildSpine(lang),[lang]);
 return <>
  <section className="hero">
   <div className="hero-copy">
    {/* No eyebrow label above the heading, and no single word painted a
        different colour: the emphasis is carried by size and weight. */}
    <h1>{lang==="uz"?"Algoritmlarni ona tilingizda o‘rganing va bellashing.":"Learn algorithms in your own language, then compete."}</h1>
    <p>{L.what}</p>
    <div className="hero-cta">
     <button className="primary" onClick={()=>go(t.start==="Start learning"?"roadmaps":"roadmaps")}>{t.start}</button>
     <a className="text-link" href="/duel" onClick={linkTo(()=>go("duel"))}>{t.arena}</a>
    </div>
    <PlatformStats lang={lang}/>
   </div>
   <div className="hero-graph"><RoadmapGraph lang={lang} nodes={nodes} onOpen={openRoadmap}/></div>
  </section>
  <LandingLoop lang={lang}/>
  <LandingBrowse lang={lang} go={go} openRoadmap={openRoadmap}/>
  <LandingCta lang={lang} go={go} signed={false}/>
 </>;
}

/* Real platform numbers only, on one line under the hero rather than in a
   section of their own — four large digits do not need a heading to introduce
   them. The learner count is shown only once it is worth showing: a public
   "5 registered" argues against the product it is meant to sell. */
function PlatformStats({lang}:{lang:Lang}){
 const [learners,setLearners]=useState<number|null>(null);
 useEffect(()=>{let live=true;fetchLearnerCount().then(n=>{if(live)setLearners(n)});return()=>{live=false}},[]);
 const size=useMemo(()=>roadmapCatalogSize(),[]);
 const uz=lang==="uz";
 return <div className="hero-facts">
  <span><b>{size.tracks}</b> {uz?"yo‘nalish":"tracks"}</span>
  <span><b>{size.units}</b> {uz?"bosqich":"stages"}</span>
  <span><b>C++</b> {uz?"va Python":"and Python"}</span>
  {learners!==null&&learners>=500&&
   <span><b>{String(learners).replace(/\B(?=(\d{3})+(?!\d))/g," ")}</b> {uz?"o‘quvchi":"learners"}</span>}
 </div>;
}

/* Roadmap cards. The whole card is the link — an "Open" button inside a card
   that is already clickable gives the reader two targets for one destination
   and makes them decide which is real. Progress is mandatory here: this is a
   learning platform, so "6/15" is the most useful thing the card can say, and
   the old card said everything except that. */
function RoadGrid({lang,roads,openRoadmap}:{lang:Lang,roads:typeof allRoads,openRoadmap:(slug:string)=>void}){
 const [progress,setProgress]=useState(emptyProgress);
 useEffect(()=>{
  const read=()=>setProgress(readLocalProgress());
  read();window.addEventListener("algoyol-progress",read);
  return()=>window.removeEventListener("algoyol-progress",read);
 },[]);
 return <div className="grid">{roads.map(r=>{
  const road=roadmapCatalog.find(x=>x.slug===r.slug);
  const total=road?road.units.length:r.units;
  const done=road?road.units.filter(u=>unitDone(progress,u)).length:0;
  const status=road?roadmapStatus(road,progress):"available";
  return <a className={`road-card road-${status}`} key={r.slug} href={`/roadmaps/${r.slug}`}
   onClick={linkTo(()=>openRoadmap(r.slug))}>
   <span className="road-top">
    <span className="road-icon" style={{background:r.color}}>{r.icon}</span>
    {status==="locked"&&<span className="road-lock" aria-hidden>🔒</span>}
    {status==="completed"&&<span className="road-done" aria-hidden>✓</span>}
   </span>
   <h3>{lang==="uz"?r.uz:r.en}</h3>
   <p className="muted">{lang==="uz"?r.descUz:r.descEn}</p>
   <ProgressBar done={done} total={total}/>
   <span className="road-meta">
    <span>{done}/{total} {lang==="uz"?"bosqich":"stages"}</span>
    <span className="road-level">{r.level}</span>
   </span>
  </a>;
 })}</div>;
}

function ProblemList({lang,items,go,onSelect}:{lang:Lang;items:BankProblem[];go:(v:View)=>void;onSelect?:(p:BankProblem)=>void}){
 const mastery=loadMastery();
 return <div className="problem-list">{items.map(p=>{
  const solved=mastery.evidence[`problem:${p.id}`]!==undefined;
  return <a className="problem-row" key={p.id} href={`/problems`}
   onClick={linkTo(()=>onSelect?onSelect(p):go("problem"))}>
   <span className={`pb-status ${solved?"solved":""}`} aria-hidden>{solved?"✓":"○"}</span>
   <span className="num mono">{p.id}</span>
   <span className="problem-name">{lang==="uz"?p.uz:p.en}</span>
   <span className="rating-chip mono" style={{color:ratingColor(p.rating||1200)}}>{p.rating||1200}</span>
   <span className={`difficulty ${p.difficulty}`}>{p.difficulty.toUpperCase()}</span>
   <span className="tag">{p.tag}</span>
  </a>;
 })}</div>;
}

function Problems({lang,filter,setFilter,items,go,onSelect}:{lang:Lang,filter:string,setFilter:(x:string)=>void,items:BankProblem[],go:(v:View)=>void,onSelect:(p:BankProblem)=>void}){
 const [topic,setTopic]=useState("all");
 const topics=useMemo(()=>[...new Set(problems.map(p=>p.topic))],[]);
 const shown=topic==="all"?items:items.filter(p=>p.topic===topic);
 const topicName=(slug:string)=>{const r=roadmapCards.find(x=>x.slug===slug);return r?(lang==="uz"?r.uz:r.en):slug};
 return <><div className="page-head"><div><p className="eyebrow" style={{color:"#637068"}}>{lang==="uz"?"Mashq maydoni":"Practice arena"}</p><h1 className="page-title">{lang==="uz"?"Masalalar banki":"Problem library"}</h1><p className="muted">{lang==="uz"?"Har bir yechim mavzu mahoratiga o‘tadi.":"Every solve feeds your topic mastery."}</p></div><span className="tag">{problems.length} {lang==="uz"?"masala":"problems"}</span></div><div className="filters">{["all","easy","medium","hard"].map(f=><button className={filter===f?"active":""} onClick={()=>setFilter(f)} key={f}>{f==="all"?(lang==="uz"?"Barchasi":"All"):f}</button>)}</div><div className="filters" style={{marginTop:8}}><button className={topic==="all"?"active":""} onClick={()=>setTopic("all")}>{lang==="uz"?"Barcha mavzu":"All topics"}</button>{topics.map(tp=><button key={tp} className={topic===tp?"active":""} onClick={()=>setTopic(tp)}>{topicName(tp)}</button>)}</div><ProblemList lang={lang} items={shown} go={go} onSelect={onSelect}/></>}
function Problem({lang,item,code,setCode,codeLang,setCodeLang,verdict,submit,onBack}:{lang:Lang;item:BankProblem;code:string;setCode:(x:string)=>void;codeLang:"cpp20"|"python3";setCodeLang:(x:"cpp20"|"python3")=>void;verdict:string;submit:()=>void;onBack:()=>void}){
 const starter={cpp:"#include <bits/stdc++.h>\nusing namespace std;\n\nint main(){\n  ios::sync_with_stdio(false);\n  cin.tie(nullptr);\n  // yechimingizni shu yerga yozing\n  return 0;\n}\n",py:"import sys\ninput = sys.stdin.readline\n\n# yechimingizni shu yerga yozing\n"};
 // Bank problems carry their own statement; the three duel problems keep theirs.
 const duel=duelProblems.find(d=>d.key===item.judge);
 const judgeable=item.statementUz?{stUz:item.statementUz,stEn:item.statementEn||"",inUz:item.inputUz||"",inEn:item.inputEn||"",outUz:item.outputUz||"",outEn:item.outputEn||"",sample:(item.samples||[]).map(x=>`${x.input}${x.output}`).join("\n"),cpp:starter.cpp,py:starter.py}:duel;
 const solved=loadMastery().evidence[`problem:${item.id}`]!==undefined;
 return <><button className="crumb crumb-btn" onClick={onBack}>← {lang==="uz"?"Ortga":"Back"}</button><div className="page-head"><div><span className="tag">{item.id}</span> <span className="tag rating-tag" style={{color:ratingColor(item.rating||1200)}}>★ {item.rating||1200}</span> <span className="tag">{item.tag}</span> {solved&&<span className="tag tag-solved">✓ {lang==="uz"?"Yechilgan":"Solved"}</span>}<h1 className="page-title" style={{marginTop:12}}>{lang==="uz"?item.uz:item.en}</h1></div><span className="muted mono">1 s · 256 MB</span></div>
 {judgeable?<div className="workspace"><article className="panel statement"><h2>{lang==="uz"?"Shart":"Statement"}</h2>{(lang==="uz"?item.storyUz:item.storyEn)&&<p className="story">{lang==="uz"?item.storyUz:item.storyEn}</p>}<p>{lang==="uz"?judgeable.stUz:judgeable.stEn}</p><h3>{lang==="uz"?"Kirish":"Input"}</h3><p>{lang==="uz"?judgeable.inUz:judgeable.inEn}</p><h3>{lang==="uz"?"Chiqish":"Output"}</h3><p>{lang==="uz"?judgeable.outUz:judgeable.outEn}</p>{item.constraints&&<><h3>{lang==="uz"?"Cheklovlar":"Constraints"}</h3><p className="mono">{item.constraints}</p></>}<h3>{lang==="uz"?"Namunalar":"Samples"}</h3>{(item.samples||[]).map((x,si)=><div className="sample" key={si}><b>{lang==="uz"?"Kirish":"Input"}</b><pre>{x.input}</pre><b>{lang==="uz"?"Chiqish":"Output"}</b><pre>{x.output}</pre></div>)}{(lang==="uz"?item.noteUz:item.noteEn)&&<><h3>{lang==="uz"?"Izoh":"Note"}</h3><p className="muted">{lang==="uz"?item.noteUz:item.noteEn}</p></>}</article><CodeEditor code={code} setCode={setCode} lang={codeLang} setLang={v=>{setCodeLang(v);setCode(v==="cpp20"?judgeable.cpp:judgeable.py)}} onSubmit={submit} submitLabel={copy[lang].submit} verdict={verdict}/></div>
 :<div className="panel" style={{maxWidth:680}}><div className="notice">{lang==="uz"?"Ushbu masala hozircha ko‘rib chiqish rejimida — tekshiruvchi tez orada ulanadi. Mavzu: ":"This problem is in preview mode — the judge will be connected soon. Topic: "}<b>{item.tag}</b></div></div>}</>}
type DuelProblem={key:string;code:string;difficulty:"easy"|"medium"|"hard";points:number;uz:string;en:string;stUz:string;stEn:string;inUz:string;inEn:string;outUz:string;outEn:string;sample:string;cpp:string;py:string;bot:[number,number];fail:number};
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

function ScreenLoading({lang}:{lang:Lang}){
 return <div className="screen-state" role="status" aria-live="polite"><span className="spinner" aria-hidden/><p className="muted">{lang==="uz"?"Sessiya tekshirilmoqda…":"Checking your session…"}</p></div>;
}

/* A guest who lands on a protected URL gets a real explanation and a way in,
   not a profile made of placeholder numbers. */
function SignInRequired({lang,go,what}:{lang:Lang;go:(v:View)=>void;what:"profile"|"admin"|"placement"|"stats"|"messages"|"users"}){
 const copyUz={profile:["Profilingizni ko‘rish uchun kiring","Profil, progress va reyting faqat hisobingizga bog‘langan. Hisob yarating yoki kiring."],admin:["Bu sahifa uchun kirish talab qilinadi","Boshqaruv studiyasi faqat admin va owner rollari uchun."],placement:["Darajani aniqlash uchun kiring","Natijalar hisobingizga saqlanadi, shuning uchun avval kiring."],stats:["Statistika uchun kirish talab qilinadi","Platforma statistikasi faqat ega (owner) roli uchun."],messages:["Xabarlar uchun kiring","Suhbatlar hisobingizga bog‘langan. Kirsangiz yozishni boshlaysiz."],users:["Bu sahifa uchun kirish talab qilinadi","Foydalanuvchilarni boshqarish faqat ega (owner) roli uchun."]}[what];
 const copyEn={profile:["Sign in to see your profile","Your profile, progress and rating belong to an account. Create one or sign in."],admin:["Sign in to continue","The admin studio is available to the admin and owner roles only."],placement:["Sign in to take the placement","Your results are saved to your account, so sign in first."],stats:["Sign in to continue","Platform statistics are available to the owner role only."],messages:["Sign in to use messages","Conversations belong to an account. Sign in and start writing."],users:["Sign in to continue","User administration is available to the owner role only."]}[what];
 const [title,body]=lang==="uz"?copyUz:copyEn;
 return <div className="screen-state panel">
  <span className="screen-state-ic" aria-hidden>🔒</span>
  <h1 className="page-title">{title}</h1>
  <p className="muted">{body}</p>
  <div className="match-actions"><button className="primary" onClick={()=>go("auth")}>{lang==="uz"?"Kirish yoki ro‘yxatdan o‘tish":"Sign in or register"}</button><button className="secondary" onClick={()=>go("roadmaps")}>{lang==="uz"?"Yo‘l xaritalarini ko‘rish":"Browse roadmaps"}</button></div>
 </div>;
}

/* The ranking is read from the profiles table. It used to be a hard-coded list
   containing a row called "Siz" (You) with an invented rating — every visitor,
   signed in or not, appeared to hold 4th place. */
/* Reyting is also where you look somebody up: it is the one screen that
   already lists people, so a search box here beats a second screen that lists
   them again. Three views share the row: the top of the ladder, a search, and
   your own friends. */
function Leaderboard({lang,me,signed,onOpenPerson}:{lang:Lang;me:Profile|null;signed:boolean;onOpenPerson:(handle:string)=>void}){
 const [rows,setRows]=useState<LeaderRow[]|null>(null),[state,setState]=useState<"loading"|"ready"|"error">("loading");
 // The result carries the term it answers, so "are we still searching?" is a
 // comparison rather than a second piece of state to keep in step with it.
 const [query,setQuery]=useState(""),[found,setFound]=useState<{q:string;rows:LeaderRow[]}|null>(null);
 const [mode,setMode]=useState<"top"|"friends">("top");
 const [friends,setFriends]=useState<FriendRow[]|null>(null);
 useEffect(()=>{let live=true;fetchLeaderboard(50).then(list=>{if(!live)return;if(!list){setState("error");return}setRows(list);setState("ready")});return()=>{live=false}},[]);
 // Typing is not a query. The search waits for a pause, so a five-letter
 // handle costs one request rather than five.
 useEffect(()=>{const q=query.trim();if(!q)return;
  const id=window.setTimeout(()=>{void searchPeople(q).then(list=>setFound({q,rows:list||[]}))},250);
  return()=>window.clearTimeout(id)},[query]);
 useEffect(()=>{if(mode!=="friends"||!signed)return;let live=true;void fetchFriends().then(list=>{if(live)setFriends(list||[])});return()=>{live=false}},[mode,signed]);
 const myRank=me&&rows?rows.findIndex(r=>r.id===me.id):-1;
 const searchOn=query.trim().length>0;
 const searching=searchOn&&found?.q!==query.trim();
 // A rank is a position in the whole ladder, so it is shown only where it is
 // actually known: inventing "#1" for the best of three search hits would be a
 // different number with the same shape.
 const rankOf=(id:string)=>{const i=rows?rows.findIndex(r=>r.id===id):-1;return i>=0?i+1:null};
 const list:LeaderRow[]|null=searchOn?(found&&found.q===query.trim()?found.rows:null)
  :mode==="friends"?(friends?friends.map(f=>({id:f.id,username:f.username,display_name:f.display_name,duel_rating:f.duel_rating,solved_count:f.solved_count})):null)
  :rows;
 /* Who on this page is here right now. Asked for the rows actually being
    rendered, and re-asked on the same cadence as the heartbeat that feeds it —
    a dot that lags a minute behind is worse than no dot. */
 const [online,setOnline]=useState<Set<string>>(new Set());
 const ids=(list||[]).map(x=>x.id).join(",");
 useEffect(()=>{
  if(!signed||!ids)return;
  let live=true;
  const pull=()=>{void onlineAmong(ids.split(",")).then(set=>{if(live)setOnline(set)})};
  pull();
  const id=window.setInterval(pull,30000);
  return()=>{live=false;window.clearInterval(id)};
 },[ids,signed]);
 const empty=lang==="uz"
  ?(searchOn?"Bunday foydalanuvchi topilmadi.":mode==="friends"?"Do‘stlar ro‘yxati bo‘sh. Kimningdir profiliga kirib, ism yonidagi ☆ ni bosing.":"Hali reytingda hech kim yo‘q. Birinchi bo‘ling!")
  :(searchOn?"No such user.":mode==="friends"?"No friends yet. Open somebody's profile and press the ☆ beside their name.":"Nobody is ranked yet. Be the first.");
 return <><div className="page-head"><div><p className="eyebrow">ELO · K=32</p><h1 className="page-title">{lang==="uz"?"Duel reytingi":"Duel leaderboard"}</h1><p className="muted">{lang==="uz"?"Reyting duel natijalaridan hisoblanadi. Odam qidiring yoki ismiga bosib profilini oching.":"Ratings come from real duel results. Search for a person, or open a profile by name."}</p></div>{me&&myRank>=0&&<span className="tag">{lang==="uz"?"Sizning o‘rningiz":"Your rank"} #{myRank+1}</span>}</div>
 <div className="leader-tools">
  <input className="leader-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={lang==="uz"?"Nickname yoki ism bo‘yicha qidirish…":"Search by handle or name…"} aria-label={lang==="uz"?"Foydalanuvchi qidirish":"Search users"}/>
  {signed&&!searchOn&&<div className="leader-modes">
   <button className={mode==="top"?"active":""} onClick={()=>setMode("top")}>{lang==="uz"?"Reyting":"Top"}</button>
   <button className={mode==="friends"?"active":""} onClick={()=>setMode("friends")}>{lang==="uz"?"Do‘stlarim":"Friends"} ★</button>
  </div>}
 </div>
 {(state==="loading"||(searchOn&&searching)||(!searchOn&&mode==="friends"&&friends===null))&&<div className="screen-state" role="status"><span className="spinner" aria-hidden/><p className="muted">{lang==="uz"?"Yuklanmoqda…":"Loading…"}</p></div>}
 {state==="error"&&!searchOn&&<div className="panel"><div className="notice notice-error">{lang==="uz"?"Reytingni yuklab bo‘lmadi. Keyinroq urinib ko‘ring.":"Could not load the leaderboard. Try again later."}</div></div>}
 {list&&!(searchOn&&searching)&&(list.length?<div className="leaderboard">{list.map(x=>{const mine=me?.id===x.id;const name=x.display_name?.trim()||x.username;const rank=rankOf(x.id);return <button type="button" className={`leader-row ${mine?"me":""}`} key={x.id} onClick={()=>onOpenPerson(x.username)} title={lang==="uz"?`${name} profilini ochish`:`Open ${name}'s profile`}><span className="rank">{rank?`#${rank}`:"—"}</span><span className="leader-who"><b>{name}<OnlineDot online={signed&&online.has(x.id)} lang={lang} label={name}/>{mine&&<span className="tag tag-you">{lang==="uz"?"Siz":"You"}</span>}</b><span className="muted">@{x.username}</span></span><span className="tag">{x.solved_count} AC</span><span className="rating">{x.duel_rating}</span></button>})}</div>
 :<div className="screen-state panel"><p className="muted">{empty}</p></div>)}</>;
}

function Admin({lang,profile}:{lang:Lang,profile:Profile}){
  const role:Role=profile.role;
  if(!can(role,"content.view_management"))return <><div className="page-head"><div><span className="tag">ADMIN STUDIO</span><h1 className="page-title" style={{marginTop:12}}>{lang==="uz"?"Ruxsat yo‘q":"Access denied"}</h1></div></div><div className="panel"><div className="notice">{lang==="uz"?"Bu sahifa faqat admin va owner rollari uchun. Supabase’da profilingiz roli hozir: ":"This page is for the admin and owner roles only. Your Supabase profile role is currently: "}<b>{roleLabel(role,lang)}</b>.</div></div></>;
 return <><div className="page-head"><div><span className="tag">ADMIN STUDIO · {roleLabel(role,lang)}</span><h1 className="page-title" style={{marginTop:12}}>{lang==="uz"?"Yangi masala":"New problem"}</h1></div><button className="primary" disabled title={lang==="uz"?"Masala muharriri hali ulanmagan":"The problem editor is not connected yet"}>{lang==="uz"?"Qoralamani saqlash":"Save draft"}</button></div><div className="panel"><div className="admin-grid"><div className="field"><label>O‘zbekcha nomi</label><input placeholder="Masala nomi"/></div><div className="field"><label>English title</label><input placeholder="Problem title"/></div><div className="field"><label>{lang==="uz"?"Qiyinlik":"Difficulty"}</label><select><option>Easy · 100</option><option>Medium · 200</option><option>Hard · 300</option></select></div><div className="field"><label>Taglar</label><input placeholder="binary-search, arrays"/></div></div><div className="admin-grid"><div className="field"><label>O‘zbekcha shart</label><textarea rows={9} placeholder="Masala shartini yozing…"/></div><div className="field"><label>English statement</label><textarea rows={9} placeholder="Write the problem statement…"/></div></div><div className="admin-grid"><div className="field"><label>{lang==="uz"?"Vaqt chegarasi":"Time limit"}</label><input value="1000 ms" readOnly/></div><div className="field"><label>{lang==="uz"?"Xotira chegarasi":"Memory limit"}</label><input value="256 MB" readOnly/></div></div><div className="field"><label>{lang==="uz"?"Yashirin testlar":"Hidden tests"}</label><textarea rows={5} placeholder="Input → Expected output"/></div><div className="notice notice-info">{lang==="uz"?"Bu forma ko‘rib chiqish rejimida — masala muharriri hali backendga ulanmagan, shuning uchun saqlash o‘chirilgan. Admin faqat o‘zi yaratgan masalalarni tahrirlaydi, owner esa barchasini.":"This form is a preview — the problem editor is not connected to the backend yet, so saving is disabled. Admins edit only their own problems; the owner manages all content."}</div></div></>}
