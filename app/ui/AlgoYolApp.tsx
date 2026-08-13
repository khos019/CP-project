"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RoadmapExperience } from "./RoadmapExperience";
import { RoadmapHub } from "./RoadmapHub";
import { roadmapCards } from "./roadmap-data";
import { Placement } from "./Placement";
import { AuthPage, readStoredToken, storeToken } from "./AuthPage";
import { HomeDashboard } from "./HomeDashboard";
import { MASTERY_CONFIG, loadMastery, masteryLabel, masteryOf, recordEvidence } from "./mastery";
import { can } from "./permissions";

type Lang="uz"|"en"; type View="home"|"roadmaps"|"roadmap"|"problems"|"problem"|"duel"|"leaderboard"|"profile"|"auth"|"admin"|"placement";
const copy={uz:{home:"Bosh sahifa",roadmaps:"YoвЂl xaritalari",problems:"Masalalar",duel:"Duel",leaderboard:"Reyting",login:"Kirish",hero:"Algoritmlarni oвЂrganing, bellashing va oвЂsing.",sub:"Tushunarli oвЂzbekcha darslar, haqiqiy kod tekshiruvchi va 30 daqiqalik jonli duellar вЂ” barchasi bitta maydonda.",start:"OвЂrganishni boshlash",arena:"Duel maydoni",featured:"Mashhur yoвЂl xaritalari",all:"Barchasini koвЂrish",tasks:"Masalalar banki",solve:"Yechish",submit:"Yechimni yuborish"},en:{home:"Home",roadmaps:"Roadmaps",problems:"Problems",duel:"Duel",leaderboard:"Leaderboard",login:"Sign in",hero:"Learn algorithms, compete, and grow.",sub:"Clear lessons, a real code checker, and live 30-minute duels вЂ” all in one focused arena.",start:"Start learning",arena:"Enter duel arena",featured:"Featured roadmaps",all:"View all",tasks:"Problem library",solve:"Solve",submit:"Submit solution"}};
const roads=[
 {icon:"O(n)",color:"#dfff74",uz:"Murakkablik tahlili",en:"Complexity analysis",descUz:"Tezlik va xotira chegaralarini tushuning.",descEn:"Understand time and memory limits.",units:8,progress:75},
 {icon:"в†•",color:"#ffd4bd",uz:"Saralash",en:"Sorting",descUz:"Oddiy usullardan tezkor saralashgacha.",descEn:"From simple methods to quick sort.",units:10,progress:40},
 {icon:"вЊ•",color:"#dbe2ff",uz:"Ikkilik qidiruv",en:"Binary search",descUz:"Javob boвЂyicha qidirish sirlarini oching.",descEn:"Master searching over the answer.",units:7,progress:20},
 {icon:"в—†",color:"#ffe8a3",uz:"OchkoвЂz algoritmlar",en:"Greedy algorithms",descUz:"Mahalliy tanlovdan optimal yechimgacha.",descEn:"Turn local choices into optimal solutions.",units:9,progress:0},
 {icon:"вЊ",color:"#c9f0de",uz:"Graflar",en:"Graphs",descUz:"BFS, DFS va eng qisqa yoвЂllar.",descEn:"BFS, DFS, and shortest paths.",units:14,progress:0},
 {icon:"в€‘",color:"#ead8ff",uz:"Dinamik dasturlash",en:"Dynamic programming",descUz:"Holatlar, oвЂtishlar va optimallashtirish.",descEn:"States, transitions, and optimization.",units:16,progress:0},
];
const allRoads=roadmapCards;
const problems=[
 {id:"A01",uz:"Ikki son yigвЂindisi",en:"Sum of two numbers",difficulty:"easy",tag:"BoshlangвЂich",points:100,topic:"programming-basics",judge:"sum-two"},
 {id:"A02",uz:"Eng katta element",en:"Maximum element",difficulty:"easy",tag:"Massiv",points:100,topic:"foundations"},
 {id:"A03",uz:"Juftlar soni",en:"Count the evens",difficulty:"easy",tag:"Massiv",points:100,topic:"foundations"},
 {id:"B04",uz:"Eng katta qism-yigвЂindi",en:"Maximum subarray sum",difficulty:"medium",tag:"Massiv",points:200,topic:"foundations",judge:"max-subarray"},
 {id:"B01",uz:"Yashirin son",en:"Hidden number",difficulty:"medium",tag:"Binary search",points:200,topic:"binary-search"},
 {id:"B02",uz:"Bekatlar",en:"Bus stops",difficulty:"medium",tag:"Greedy",points:200,topic:"greedy"},
 {id:"B03",uz:"Labirint yoвЂli",en:"Maze path",difficulty:"medium",tag:"BFS",points:200,topic:"graphs"},
 {id:"C04",uz:"Minimal tangalar",en:"Minimum coins",difficulty:"hard",tag:"DP",points:300,topic:"dynamic-programming",judge:"coin-change"},
 {id:"C01",uz:"Qadimiy daraxt",en:"Ancient tree",difficulty:"hard",tag:"Graph",points:300,topic:"graphs"},
 {id:"C02",uz:"Tanga strategiyasi",en:"Coin strategy",difficulty:"hard",tag:"DP",points:300,topic:"dynamic-programming"},
 {id:"C03",uz:"Eng uzun yoвЂl",en:"Longest route",difficulty:"hard",tag:"DAG",points:300,topic:"graphs"},
];
type BankProblem=typeof problems[number];
const duelTopics:Record<string,string>={"sum-two":"programming-basics","max-subarray":"foundations","coin-change":"dynamic-programming"};
const leaders=[{n:"Sardor",u:"@sardor_ioi",r:1864,w:42},{n:"Madina",u:"@madina_dev",r:1792,w:37},{n:"Azizbek",u:"@aziz_algo",r:1718,w:29},{n:"Siz",u:"@algoyolchi",r:1462,w:12},{n:"Nilufar",u:"@nilufar_py",r:1421,w:18}];
const cpp=`#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long a, b;\n    cin >> a >> b;\n    cout << a + b << "\\n";\n    return 0;\n}`;

/* ---- Supabase: rol (owner / admin / user) va profil ---- */
export type Role="user"|"admin"|"owner";
export type Profile={id:string;email:string;username:string;display_name:string;role:Role;duel_rating:number;solved_count:number};
export const supabaseConfig=()=>({url:process.env.NEXT_PUBLIC_SUPABASE_URL,key:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY});
export const supabaseReady=()=>{const {url,key}=supabaseConfig();return Boolean(url&&key)};
const readToken=()=>typeof window==="undefined"?null:readStoredToken();
export async function fetchProfile(token:string):Promise<Profile|null>{
 const {url,key}=supabaseConfig();if(!url||!key||!token)return null;
 const headers={apikey:key,Authorization:`Bearer ${token}`};
 try{
  const account=await fetch(`${url}/auth/v1/user`,{headers});if(!account.ok)return null;
  const user=await account.json() as {id?:string;email?:string};if(!user.id)return null;
  const rows=await fetch(`${url}/rest/v1/profiles?id=eq.${user.id}&select=id,username,display_name,role,duel_rating,solved_count`,{headers});if(!rows.ok)return null;
  const list=await rows.json() as Array<Omit<Profile,"email">>;if(!list.length)return null;
  sessionStorage.setItem("algoyol-user-id",user.id);
  return {...list[0],email:user.email||""};
 }catch{return null}
}
export async function saveDuelRating(next:number){
 const {url,key}=supabaseConfig(),token=readToken(),id=typeof window==="undefined"?null:sessionStorage.getItem("algoyol-user-id");
 if(!url||!key||!token||!id)return;
 try{await fetch(`${url}/rest/v1/profiles?id=eq.${id}`,{method:"PATCH",headers:{apikey:key,Authorization:`Bearer ${token}`,"content-type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({duel_rating:next})})}catch{}
}
const roleLabel=(role:Role,lang:Lang)=>role==="owner"?(lang==="uz"?"EGA (OWNER)":"OWNER"):role==="admin"?"ADMIN":(lang==="uz"?"FOYDALANUVCHI":"USER");

export function AlgoYolApp(){
 const [lang,setLang]=useState<Lang>("uz"),[view,setView]=useState<View>("home"),[filter,setFilter]=useState("all"),[code,setCode]=useState(cpp),[codeLang,setCodeLang]=useState<"cpp20"|"python3">("cpp20"),[verdict,setVerdict]=useState(""),[signed,setSigned]=useState(false),[selectedRoadmap,setSelectedRoadmap]=useState("foundations"),[activeProblem,setActiveProblem]=useState<BankProblem>(problems[0]); const t=copy[lang];
 const [profile,setProfile]=useState<Profile|null>(null),[loadingProfile,setLoadingProfile]=useState(false);
 const loadProfile=async(token:string)=>{setLoadingProfile(true);const next=await fetchProfile(token);setProfile(next);setSigned(true);setLoadingProfile(false)};
 const signOut=()=>{sessionStorage.removeItem("algoyol-access-token");sessionStorage.removeItem("algoyol-user-id");localStorage.removeItem("algoyol-remember-token");setProfile(null);setSigned(false);setView("home")};
 useEffect(()=>{const saved=localStorage.getItem("algoyol-lang") as Lang|null;if(saved)setLang(saved)},[]);
 useEffect(()=>{const token=readStoredToken();if(token&&supabaseReady())loadProfile(token)},[]);
 useEffect(()=>{const params=new URLSearchParams(window.location.hash.replace(/^#/,""));const token=params.get("access_token"),error=params.get("error_description");if(token){sessionStorage.setItem("algoyol-access-token",token);setSigned(true);setView("profile");loadProfile(token);window.history.replaceState({},"",window.location.pathname)}else if(error){setView("auth");window.history.replaceState({},"",window.location.pathname);window.setTimeout(()=>window.alert(decodeURIComponent(error.replace(/\+/g," "))),50)}},[]);
 useEffect(()=>{if(!verdict.startsWith("Qabul qilindi")&&!verdict.startsWith("Accepted"))return;if(activeProblem.judge){const base=MASTERY_CONFIG.weights.problem[activeProblem.difficulty];recordEvidence(activeProblem.topic,"problem",`problem:${activeProblem.id}`,base)}const lesson=localStorage.getItem("algoyol-active-lesson");if(!lesson)return;let data={quizScores:{},solved:{}} as {quizScores:Record<string,number>;solved:Record<string,boolean>};try{data=JSON.parse(localStorage.getItem("algoyol-roadmap-progress")||JSON.stringify(data))}catch{}if(!data.solved[lesson])recordEvidence(lesson.slice(0,lesson.lastIndexOf("-")),"lesson",`lesson:${lesson}`,MASTERY_CONFIG.weights.lesson);data.solved={...data.solved,[lesson]:true};localStorage.setItem("algoyol-roadmap-progress",JSON.stringify(data));localStorage.removeItem("algoyol-active-lesson");window.dispatchEvent(new Event("algoyol-progress"))},[verdict]);// eslint-disable-line react-hooks/exhaustive-deps
 const go=(v:View)=>{setView(v);window.scrollTo({top:0,behavior:"smooth"})}; const swap=()=>{const n=lang==="uz"?"en":"uz";setLang(n);localStorage.setItem("algoyol-lang",n)};
 const openRoadmap=(slug:string)=>{setSelectedRoadmap(slug);go("roadmap")};
 const filtered=useMemo(()=>filter==="all"?problems:problems.filter(p=>p.difficulty===filter),[filter]);
 const judge=async()=>{if(!signed){setView("auth");return}if(!activeProblem.judge){setVerdict(lang==="uz"?"Bu masala uchun tekshiruvchi tez orada ulanadi":"The judge for this problem is coming soon");return}setVerdict(lang==="uz"?"NavbatdaвЂ¦ testlar tekshirilmoqda":"In queueвЂ¦ running hidden tests");try{const response=await fetch("/api/judge",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({problemId:activeProblem.judge,language:codeLang,sourceCode:code})});const r=await response.json();const names:Record<string,[string,string]>={ACCEPTED:["Qabul qilindi","Accepted"],WRONG_ANSWER:["NotoвЂgвЂri javob","Wrong answer"],COMPILATION_ERROR:["Kompilyatsiya xatosi","Compilation error"],RUNTIME_ERROR:["Bajarilish xatosi","Runtime error"],TIME_LIMIT_EXCEEDED:["Vaqt chegarasi oshdi","Time limit exceeded"],MEMORY_LIMIT_EXCEEDED:["Xotira chegarasi oshdi","Memory limit exceeded"],JUDGE_ERROR:["Tekshiruvchi xatosi","Judge error"]};const title=(names[r.verdict]||names.JUDGE_ERROR)[lang==="uz"?0:1];const test=r.test?` В· ${lang==="uz"?"test":"test"} #${r.test}`:"";const stats=r.verdict==="ACCEPTED"?` В· ${r.passed}/${r.total} В· ${r.runtimeMs} ms В· ${r.memoryKb} KB`:"";setVerdict(`${title}${test}${stats}${r.details?`\n${String(r.details).slice(0,900)}`:""}`)}catch{setVerdict(lang==="uz"?"Tekshiruvchi bilan aloqa uzildi":"Judge connection failed")}};
 return <div className="shell"><header className="topbar"><button className="brand" onClick={()=>go("home")} style={{border:0,background:"transparent"}}><span className="brandmark">AвЂє</span>AlgoYoвЂl</button><nav className="nav">{(["home","roadmaps","problems","duel","leaderboard"] as View[]).map(v=><button key={v} className={view===v?"active":""} onClick={()=>go(v)}>{t[v as keyof typeof t]}</button>)}</nav><div className="actions"><button className="lang" onClick={swap}>{lang==="uz"?"EN":"UZ"}</button><button className="pill" onClick={()=>go(signed?"profile":"auth")}>{signed?(lang==="uz"?"Profil":"Profile"):t.login}</button><button className="primary" onClick={()=>go("duel")}>{lang==="uz"?"Duel topish":"Find duel"}</button></div></header>
 <main className="main">{view==="home"&&(signed?<HomeDashboard lang={lang} go={v=>go(v as View)} openRoadmap={openRoadmap} duelRating={(typeof window==="undefined"?0:Number(localStorage.getItem("algoyol-duel-rating")))||profile?.duel_rating||1462}/>:<Home lang={lang} go={go} openRoadmap={openRoadmap}/>)} {view==="roadmaps"&&<RoadmapHub lang={lang} openRoadmap={openRoadmap}/>} {view==="roadmap"&&<RoadmapExperience slug={selectedRoadmap} lang={lang} onBack={()=>go("roadmaps")} onPractice={()=>go("problem")}/>} {view==="problems"&&<Problems lang={lang} filter={filter} setFilter={setFilter} items={filtered} go={go} onSelect={p=>{setActiveProblem(p);setCode(p.judge==="max-subarray"?duelProblems[1].cpp:p.judge==="coin-change"?duelProblems[2].cpp:cpp);setVerdict("");go("problem")}}/>} {view==="problem"&&<Problem lang={lang} item={activeProblem} code={code} setCode={setCode} codeLang={codeLang} setCodeLang={setCodeLang} verdict={verdict} submit={judge}/>} {view==="duel"&&<DuelMatchmaking lang={lang} profile={profile} signed={signed} needAuth={()=>go("auth")} openRoadmap={openRoadmap}/>} {view==="leaderboard"&&<Leaderboard lang={lang}/>} {view==="profile"&&<Profile lang={lang} go={go} profile={profile} loading={loadingProfile} signOut={signOut}/>} {view==="auth"&&<AuthPage lang={lang} done={token=>{if(token)loadProfile(token);else setSigned(true);if(!localStorage.getItem("algoyol-onboarded"))go("placement");else go("profile")}}/>} {view==="placement"&&<Placement lang={lang} signed={signed} onFinish={()=>go("roadmaps")} onRoadmap={openRoadmap}/>} {view==="admin"&&<Admin lang={lang} profile={profile}/>}</main>
 <nav className="mobile-nav">{(["home","roadmaps","problems","duel","leaderboard"] as View[]).map(v=><button key={v} className={view===v?"active":""} onClick={()=>go(v)}>{t[v as keyof typeof t]}</button>)}</nav><footer className="footer"><span>В© 2026 AlgoYoвЂl В· Toshkent</span><span>{lang==="uz"?"Bilimdan natijagacha.":"From learning to results."}</span></footer></div>
}
function Home({lang,go,openRoadmap}:{lang:Lang,go:(v:View)=>void,openRoadmap:(slug:string)=>void}){const t=copy[lang];return <><section className="hero"><div className="hero-copy"><div className="eyebrow">{lang==="uz"?"OвЂzbekiston dasturchilari uchun":"Built for UzbekistanвЂ™s coders"}</div><h1>{lang==="uz"?<>Algoritmlarni <em>oвЂrganing</em>, bellashing va oвЂsing.</>:<>Learn algorithms, <em>compete</em>, and grow.</>}</h1><p>{t.sub}</p><div className="hero-cta"><button className="primary" onClick={()=>go("roadmaps")}>{t.start} в†’</button><button className="secondary" onClick={()=>go("duel")}>{t.arena}</button></div><div className="orbit"/></div><div className="hero-side"><div className="stat-card"><span className="eyebrow" style={{color:"#637068"}}>{lang==="uz"?"Bugun faol":"Active today"}</span><span className="big">1,284</span><div className="mini-row"><span className="avatar">S</span><span className="avatar">M</span><span className="avatar">A</span><span className="avatar">+9</span></div></div><div className="stat-card duel"><span className="eyebrow" style={{color:"#6f3516"}}>{lang==="uz"?"Jonli duellar":"Live duels"}</span><span className="big">24</span><span>{lang==="uz"?"Hozir bellashmoqda":"competing right now"} вљЎ</span></div></div></section><section><div className="section-head"><div><p className="eyebrow" style={{color:"#637068"}}>{lang==="uz"?"Bosqichma-bosqich":"Step by step"}</p><h2>{t.featured}</h2></div><button className="secondary" onClick={()=>go("roadmaps")}>{t.all} в†’</button></div><RoadGrid lang={lang} roads={allRoads.slice(0,3)} openRoadmap={openRoadmap}/></section><section><div className="section-head"><div><p className="eyebrow" style={{color:"#637068"}}>100 В· 200 В· 300</p><h2>{t.tasks}</h2></div><button className="secondary" onClick={()=>go("problems")}>{t.all} в†’</button></div><ProblemList lang={lang} items={problems.slice(0,4)} go={go}/></section></>}
function RoadGrid({lang,roads,openRoadmap}:{lang:Lang,roads:typeof allRoads,openRoadmap:(slug:string)=>void}){return <div className="grid">{roads.map((r)=><button className="road-card" style={{textAlign:"left"}} key={r.en} onClick={()=>openRoadmap(r.slug)}><span className="road-icon" style={{background:r.color}}>{r.icon}</span><h3>{lang==="uz"?r.uz:r.en}</h3><p className="muted">{lang==="uz"?r.descUz:r.descEn}</p><div className="progress"><span style={{width:r.progress+"%"}}/></div><div className="meta"><span>{r.units} {lang==="uz"?"bosqich":"units"}</span><span>800 в†’ 2200</span></div></button>)}</div>}
function ProblemList({lang,items,go,onSelect}:{lang:Lang;items:typeof problems;go:(v:View)=>void;onSelect?:(p:BankProblem)=>void}){const mastery=loadMastery();return <div className="problem-list">{items.map(p=>{const solved=mastery.evidence[`problem:${p.id}`]!==undefined;return <button className="problem-row" style={{textAlign:"left"}} key={p.id} onClick={()=>onSelect?onSelect(p):go("problem")}><span className="num">{p.id}</span><span><h3>{lang==="uz"?p.uz:p.en}</h3><span className={`difficulty ${p.difficulty}`}>{p.difficulty.toUpperCase()} В· {p.points}</span></span><span className="tag">{p.tag}</span><span className={`pb-status ${solved?"solved":""}`}>{solved?"вњ“":"в—‹"}</span></button>})}</div>}
function Problems({lang,filter,setFilter,items,go,onSelect}:{lang:Lang,filter:string,setFilter:(x:string)=>void,items:typeof problems,go:(v:View)=>void,onSelect:(p:BankProblem)=>void}){
 const [topic,setTopic]=useState("all");
 const topics=useMemo(()=>[...new Set(problems.map(p=>p.topic))],[]);
 const shown=topic==="all"?items:items.filter(p=>p.topic===topic);
 const topicName=(slug:string)=>{const r=roadmapCards.find(x=>x.slug===slug);return r?(lang==="uz"?r.uz:r.en):slug};
 return <><div className="page-head"><div><p className="eyebrow" style={{color:"#637068"}}>{lang==="uz"?"Mashq maydoni":"Practice arena"}</p><h1 className="page-title">{lang==="uz"?"Masalalar banki":"Problem library"}</h1><p className="muted">{lang==="uz"?"Har bir yechim mavzu mahoratiga oвЂtadi.":"Every solve feeds your topic mastery."}</p></div><span className="tag">{problems.length} {lang==="uz"?"masala":"problems"}</span></div><div className="filters">{["all","easy","medium","hard"].map(f=><button className={filter===f?"active":""} onClick={()=>setFilter(f)} key={f}>{f==="all"?(lang==="uz"?"Barchasi":"All"):f}</button>)}</div><div className="filters" style={{marginTop:8}}><button className={topic==="all"?"active":""} onClick={()=>setTopic("all")}>{lang==="uz"?"Barcha mavzu":"All topics"}</button>{topics.map(tp=><button key={tp} className={topic===tp?"active":""} onClick={()=>setTopic(tp)}>{topicName(tp)}</button>)}</div><ProblemList lang={lang} items={shown} go={go} onSelect={onSelect}/></>}
function Problem({lang,item,code,setCode,codeLang,setCodeLang,verdict,submit}:{lang:Lang;item:BankProblem;code:string;setCode:(x:string)=>void;codeLang:"cpp20"|"python3";setCodeLang:(x:"cpp20"|"python3")=>void;verdict:string;submit:()=>void}){
 const judgeable=duelProblems.find(d=>d.key===item.judge);
 const solved=loadMastery().evidence[`problem:${item.id}`]!==undefined;
 return <><div className="page-head"><div><span className="tag">{item.id} В· {item.difficulty.toUpperCase()} В· {item.points}</span> <span className="tag">{item.tag}</span> {solved&&<span className="tag tag-solved">вњ“ {lang==="uz"?"Yechilgan":"Solved"}</span>}<h1 className="page-title" style={{marginTop:12}}>{lang==="uz"?item.uz:item.en}</h1></div><span className="muted mono">1 s В· 256 MB</span></div>
 {judgeable?<div className="workspace"><article className="panel statement"><h2>{lang==="uz"?"Shart":"Statement"}</h2><p>{lang==="uz"?judgeable.stUz:judgeable.stEn}</p><h3>{lang==="uz"?"Kirish":"Input"}</h3><p>{lang==="uz"?judgeable.inUz:judgeable.inEn}</p><h3>{lang==="uz"?"Chiqish":"Output"}</h3><p>{lang==="uz"?judgeable.outUz:judgeable.outEn}</p><h3>{lang==="uz"?"Namuna":"Sample"}</h3><div className="sample">{judgeable.sample}</div></article><section className="editor"><div className="editor-top"><b>{codeLang==="cpp20"?"main.cpp":"main.py"}</b><select aria-label="Language" value={codeLang} onChange={e=>{const value=e.target.value as "cpp20"|"python3";setCodeLang(value);setCode(value==="cpp20"?(item.judge?judgeable.cpp:cpp):"a, b = map(int, input().split())\nprint(a + b)")}}><option value="cpp20">C++20</option><option value="python3">Python 3</option></select></div><textarea aria-label="Code editor" value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}/><div className="editor-actions"><span className="verdict">{verdict||"в—Џ Judge0 online"}</span><button className="primary" onClick={submit}>{copy[lang].submit} в†’</button></div></section></div>
 :<div className="panel" style={{maxWidth:680}}><div className="notice">{lang==="uz"?"Ushbu masala hozircha koвЂrib chiqish rejimida вЂ” tekshiruvchi tez orada ulanadi. Mavzu: ":"This problem is in preview mode вЂ” the judge will be connected soon. Topic: "}<b>{item.tag}</b></div></div>}</>}
type DuelOpponent={name:string;handle:string;rating:number;wins:number;letter:string};
type DuelProblem={key:string;code:string;difficulty:"easy"|"medium"|"hard";points:number;uz:string;en:string;stUz:string;stEn:string;inUz:string;inEn:string;outUz:string;outEn:string;sample:string;cpp:string;py:string;bot:[number,number];fail:number};
type DuelClaim={by:"me"|"opp";at:number}|null;
type DuelEvent={at:number;by:"me"|"opp"|"sys";uz:string;en:string};
type DuelResultState=null|{reason:"time"|"sweep"|"forfeit";outcome:"win"|"loss"|"draw";delta:number;claims:DuelClaim[];at:number};
const DUEL_LENGTH=1800,DUEL_K=32;
const duelOpponents:DuelOpponent[]=[{name:"Jasur",handle:"@jasur_cpp",rating:1488,wins:18,letter:"J"},{name:"Nilufar",handle:"@nilufar_py",rating:1421,wins:18,letter:"N"},{name:"Bekzod",handle:"@bek_ds",rating:1395,wins:9,letter:"B"},{name:"Azizbek",handle:"@aziz_algo",rating:1718,wins:29,letter:"A"},{name:"Madina",handle:"@madina_dev",rating:1792,wins:37,letter:"M"},{name:"Sardor",handle:"@sardor_ioi",rating:1864,wins:42,letter:"S"}];
const duelProblems:DuelProblem[]=[
 {key:"sum-two",code:"A01",difficulty:"easy",points:100,uz:"Ikki son yigвЂindisi",en:"Sum of two numbers",
  stUz:"Sizga ikkita butun a va b sonlari beriladi. Ularning yigвЂindisini toping.",stEn:"You are given two integers a and b. Print their sum.",
  inUz:"Bitta qatorda ikkita butun son: a va b (в€’10вЃ№ в‰¤ a, b в‰¤ 10вЃ№).",inEn:"One line contains two integers a and b (в€’10вЃ№ в‰¤ a, b в‰¤ 10вЃ№).",
  outUz:"Yagona son вЂ” a + b ni chiqaring.",outEn:"Print a single integer вЂ” a + b.",
  sample:"Input\n12 30\n\nOutput\n42",
  cpp:`#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long a, b;\n    cin >> a >> b;\n    cout << a + b << "\\n";\n    return 0;\n}`,
  py:`a, b = map(int, input().split())\nprint(a + b)`,bot:[170,430],fail:.03},
 {key:"max-subarray",code:"B04",difficulty:"medium",points:200,uz:"Eng katta qism-yigвЂindi",en:"Maximum subarray sum",
  stUz:"n ta butun sondan iborat massiv berilgan. BoвЂsh boвЂlmagan ketma-ket qism-massivning eng katta yigвЂindisini toping.",stEn:"Given an array of n integers, find the largest sum of a non-empty contiguous subarray.",
  inUz:"Birinchi qatorda n (1 в‰¤ n в‰¤ 2В·10вЃµ). Ikkinchi qatorda n ta butun son (в€’10вЃ№ в‰¤ aбµў в‰¤ 10вЃ№).",inEn:"The first line contains n (1 в‰¤ n в‰¤ 2В·10вЃµ). The second line contains n integers (в€’10вЃ№ в‰¤ aбµў в‰¤ 10вЃ№).",
  outUz:"Yagona son вЂ” eng katta qism-yigвЂindi.",outEn:"Print a single integer вЂ” the maximum subarray sum.",
  sample:"Input\n9\n-2 1 -3 4 -1 2 1 -5 4\n\nOutput\n6",
  cpp:`#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // TODO: eng katta qism-yig'indini toping / find the maximum subarray sum\n    return 0;\n}`,
  py:`n = int(input())\na = list(map(int, input().split()))\n# TODO: eng katta qism-yig'indini toping / find the maximum subarray sum`,bot:[400,820],fail:.12},
 {key:"coin-change",code:"C04",difficulty:"hard",points:300,uz:"Minimal tangalar",en:"Minimum coins",
  stUz:"n xil nominaldagi tangalar va s summa berilgan. Har bir nominaldan cheksiz olish mumkin. s ni toвЂplash uchun kerak boвЂlgan eng kam tangalar sonini toping, aks holda в€’1 chiqaring.",stEn:"You are given n coin values and a target sum s. Each value may be used any number of times. Print the minimum number of coins that add up to exactly s, or в€’1 if it is impossible.",
  inUz:"Birinchi qatorda n va s (1 в‰¤ n в‰¤ 100, 0 в‰¤ s в‰¤ 10вЃґ). Ikkinchi qatorda n ta nominal (1 в‰¤ cбµў в‰¤ 10вЃґ).",inEn:"The first line contains n and s (1 в‰¤ n в‰¤ 100, 0 в‰¤ s в‰¤ 10вЃґ). The second line contains n coin values (1 в‰¤ cбµў в‰¤ 10вЃґ).",
  outUz:"Eng kam tangalar soni yoki в€’1.",outEn:"The minimum number of coins, or в€’1.",
  sample:"Input\n3 11\n1 2 5\n\nOutput\n3",
  cpp:`#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n, s;\n    cin >> n >> s;\n    // TODO: dinamik dasturlash bilan yeching / solve with dynamic programming\n    return 0;\n}`,
  py:`n, s = map(int, input().split())\ncoins = list(map(int, input().split()))\n# TODO: dinamik dasturlash bilan yeching / solve with dynamic programming`,bot:[650,1250],fail:.3},
];
const clock=(total:number)=>`${String(Math.floor(Math.max(0,total)/60)).padStart(2,"0")}:${String(Math.max(0,total)%60).padStart(2,"0")}`;
const duelStarter=(index:number,codeLang:"cpp20"|"python3")=>codeLang==="cpp20"?duelProblems[index].cpp:duelProblems[index].py;
const expectedScore=(mine:number,theirs:number)=>1/(1+Math.pow(10,(theirs-mine)/400));
const scoreOf=(list:DuelClaim[],who:"me"|"opp")=>list.reduce((n,c,i)=>c&&c.by===who?n+duelProblems[i].points:n,0);
const topicTitle=(slug:string,lang:Lang)=>{const r=roadmapCards.find(x=>x.slug===slug);return r?(lang==="uz"?r.uz:r.en):slug};

function Duel({lang,opponent,rating,matchId,onFinish,onRematch,onExit,openRoadmap}:{lang:Lang;opponent:DuelOpponent;rating:number;matchId:number;onFinish:(next:number)=>void;onRematch:()=>void;onExit:()=>void;openRoadmap:(slug:string)=>void}){
 const [elapsed,setElapsed]=useState(0),[stage,setStage]=useState(0),[claims,setClaims]=useState<DuelClaim[]>([null,null,null]);
 const [gains,setGains]=useState<{topic:string;delta:number}[]>([]);
 const [feed,setFeed]=useState<DuelEvent[]>([{at:0,by:"sys",uz:"Duel boshlandi В· 1-masala ochildi",en:"Duel started В· problem 1 unlocked"}]);
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
  plan.current=null;setResult({reason,outcome,delta,claims:final,at:Math.min(at,DUEL_LENGTH)});onFinish(rating+delta)};
 const claimStage=(by:"me"|"opp",at:number)=>{
  if(result||stage>2||claims[stage])return;
  const problem=duelProblems[stage],next=[...claims];next[stage]={by,at};setClaims(next);setStage(stage+1);
  if(by==="me"){const topic=duelTopics[problem.key]||"foundations";const base=Math.round(MASTERY_CONFIG.weights.problem[problem.difficulty]*MASTERY_CONFIG.weights.duelMultiplier);const g=recordEvidence(topic,"duel",`duel:${matchId}:${problem.key}`,base);if(g.delta>0)setGains(gs=>[...gs,{topic,delta:g.delta}])}
  push(by,by==="me"?`Siz ${problem.code} ni yechdingiz В· +${problem.points}`:`${opponent.name} ${problem.code} ni yechdi В· +${problem.points}`,by==="me"?`You solved ${problem.code} В· +${problem.points}`:`${opponent.name} solved ${problem.code} В· +${problem.points}`,at);
  if(stage<2){push("sys",`${stage+2}-masala ochildi`,`Problem ${stage+2} unlocked`,at);setCode(duelStarter(stage+1,codeLang));setVerdict("");setBad(false)}
  else finish("sweep",next,at)};
 useEffect(()=>{if(result||stage>2){plan.current=null;return}const problem=duelProblems[stage];const skill=Math.min(1.45,Math.max(.6,1-(opponent.rating-rating)/1800));const span=problem.bot[0]+Math.random()*(problem.bot[1]-problem.bot[0]);const duration=Math.max(45,Math.round(span*skill));plan.current={stage,solveAt:elapsed+duration,missAt:elapsed+Math.round(duration*.55),missed:false,fails:Math.random()<problem.fail}},[stage,result]);// eslint-disable-line react-hooks/exhaustive-deps
 useEffect(()=>{if(result)return;const id=window.setInterval(()=>setElapsed(e=>Math.min(DUEL_LENGTH,e+1)),1000);return()=>window.clearInterval(id)},[result]);
 useEffect(()=>{if(result)return;
  if(elapsed>=DUEL_LENGTH){finish("time",claims,DUEL_LENGTH);return}
  const current=plan.current;if(!current||current.stage!==stage||claims[stage])return;
  if(!current.missed&&elapsed>=current.missAt){current.missed=true;setAttempts(a=>({...a,opp:a.opp+1}));push("opp",`${opponent.name} yechim yubordi вЂ” notoвЂgвЂri javob`,`${opponent.name} submitted вЂ” wrong answer`,elapsed)}
  if(!current.fails&&elapsed>=current.solveAt)claimStage("opp",elapsed)},[elapsed]);// eslint-disable-line react-hooks/exhaustive-deps
 const submit=async()=>{if(judging||result||stage>2)return;setJudging(true);setBad(false);setVerdict(lang==="uz"?"NavbatdaвЂ¦ testlar tekshirilmoqda":"In queueвЂ¦ running hidden tests");
  const at=elapsed;
  try{const response=await fetch("/api/judge",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({problemId:duelProblems[stage].key,language:codeLang,sourceCode:code})});const r=await response.json();
   const names:Record<string,[string,string]>={ACCEPTED:["Qabul qilindi","Accepted"],WRONG_ANSWER:["NotoвЂgвЂri javob","Wrong answer"],COMPILATION_ERROR:["Kompilyatsiya xatosi","Compilation error"],RUNTIME_ERROR:["Bajarilish xatosi","Runtime error"],TIME_LIMIT_EXCEEDED:["Vaqt chegarasi oshdi","Time limit exceeded"],MEMORY_LIMIT_EXCEEDED:["Xotira chegarasi oshdi","Memory limit exceeded"],JUDGE_ERROR:["Tekshiruvchi xatosi","Judge error"]};
   const title=(names[r.verdict]||names.JUDGE_ERROR)[lang==="uz"?0:1],test=r.test?` В· test #${r.test}`:"",stats=r.verdict==="ACCEPTED"?` В· ${r.passed}/${r.total} В· ${r.runtimeMs} ms В· ${r.memoryKb} KB`:"";
   setVerdict(`${title}${test}${stats}${r.details?`\n${String(r.details).slice(0,500)}`:""}`);
   if(r.verdict==="ACCEPTED"){setBad(false);claimStage("me",at)}
   else{setBad(true);setAttempts(a=>({...a,me:a.me+1}));push("me",`Siz yechim yubordingiz вЂ” ${title.toLowerCase()}`,`You submitted вЂ” ${title.toLowerCase()}`,at)}}
  catch{setBad(true);setVerdict(lang==="uz"?"Tekshiruvchi bilan aloqa uzildi":"Judge connection failed")}
  finally{setJudging(false)}};
 if(result)return <DuelResult lang={lang} opponent={opponent} result={result} attempts={attempts} rating={rating} gains={gains} onRematch={onRematch} onExit={onExit} openRoadmap={openRoadmap}/>;
 const problem=duelProblems[Math.min(stage,2)],leader=myScore>oppScore?"me":oppScore>myScore?"opp":"";
 return <><div className="page-head"><div><p className="eyebrow" style={{color:"#637068"}}>RATED DUEL В· #{matchId}</p><h1 className="page-title">{lang==="uz"?"Duel maydoni":"Duel arena"}</h1></div><span className="tag">{lang==="uz"?"Ulangan":"Connected"} в—Џ</span></div>
 <div className="duel-layout"><section className="arena"><div className="duel-top"><b>{lang==="uz"?"30 daqiqalik duel":"30-minute duel"}</b><span className={`timer ${remaining<=300?"low":""}`}>{clock(remaining)}</span></div>
  <div className="players"><div className={`player ${leader==="me"?"lead":""}`}><span className="sub">@algoyolchi В· {rating}</span><div className="who">{lang==="uz"?"Siz":"You"}</div><span className="score">{myScore}</span></div><span className="versus">VS</span>
   <div className={`player ${leader==="opp"?"lead":""}`}><span className="sub">{opponent.handle} В· {opponent.rating}</span><div className="who">{opponent.name}</div><span className="score">{oppScore}</span></div></div>
  <div className="duel-steps">{duelProblems.map((p,i)=>{const claim=claims[i],state=claim?(claim.by==="me"?"mine":"theirs"):i===stage?"open":"locked";return <div key={p.key} className={`step ${state}`}><b>{String(i+1).padStart(2,"0")} В· {p.difficulty.toUpperCase()}</b><span>{p.points} {lang==="uz"?"ball":"points"}</span><span className="claim">{claim?`${claim.by==="me"?(lang==="uz"?"Siz":"You"):opponent.name} В· ${clock(claim.at)}`:i===stage?(lang==="uz"?"Ochiq":"Open"):(lang==="uz"?"Qulflangan":"Locked")}</span></div>})}</div>
  <div className="duel-problem"><span className="tag">{problem.code} В· {problem.difficulty.toUpperCase()} В· {problem.points}</span><h2>{lang==="uz"?problem.uz:problem.en}</h2>
   <p className="muted">{lang==="uz"?problem.stUz:problem.stEn}</p>
   <p className="muted"><b>{lang==="uz"?"Kirish":"Input"}:</b> {lang==="uz"?problem.inUz:problem.inEn}</p>
   <p className="muted"><b>{lang==="uz"?"Chiqish":"Output"}:</b> {lang==="uz"?problem.outUz:problem.outEn}</p>
   <div className="sample">{problem.sample}</div>
   <div className="duel-editor"><div className="editor-top"><b>{codeLang==="cpp20"?"main.cpp":"main.py"}</b><select aria-label="Duel language" value={codeLang} onChange={e=>{const value=e.target.value as "cpp20"|"python3";setCodeLang(value);setCode(duelStarter(Math.min(stage,2),value))}}><option value="cpp20">C++20</option><option value="python3">Python 3</option></select></div>
    <textarea aria-label="Duel code editor" value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}/>
    <div className="editor-actions"><span className={`duel-verdict ${bad?"bad":""}`}>{verdict||(lang==="uz"?"в—Џ Birinchi Accepted barcha ballni oladi":"в—Џ First Accepted claims all the points")}</span>
     <button className="primary" disabled={judging} onClick={submit}>{judging?(lang==="uz"?"TekshirilmoqdaвЂ¦":"JudgingвЂ¦"):(lang==="uz"?"Yuborish":"Submit")} в†’</button></div></div></div></section>
  <aside className="side-stack"><div className="duel-card"><h3>{lang==="uz"?"Jonli oqim":"Live feed"}</h3><div className="feed">{feed.map((e,i)=><div key={`${e.at}-${i}`} className={`feed-item ${e.by}`}><span className="feed-time">{clock(e.at)}</span><span>{lang==="uz"?e.uz:e.en}</span></div>)}</div></div>
   <div className="duel-card"><h3>{lang==="uz"?"Statistika":"Statistics"}</h3><div className="duel-stats"><div><b>{attempts.me}</b><small>{lang==="uz"?"sizning xato":"your fails"}</small></div><div><b>{attempts.opp}</b><small>{lang==="uz"?"raqib xato":"rival fails"}</small></div><div><b>{claims.filter(Boolean).length}/3</b><small>{lang==="uz"?"yechildi":"claimed"}</small></div></div></div>
   <div className="duel-card"><h3>{lang==="uz"?"Qoidalar":"Rules"}</h3><p className="muted">{lang==="uz"?"Masalalar ketma-ket ochiladi. Birinchi Accepted barcha ballni oladi. Teng ballda notoвЂgвЂri urinishlar hal qiladi.":"Problems unlock in order. The first Accepted claims all the points. Failed attempts break ties at equal score."}</p>
    <button className="ghost" onClick={()=>{push("sys",lang==="uz"?"Siz duelni tark etdingiz":"You forfeited the duel",lang==="uz"?"Siz duelni tark etdingiz":"You forfeited the duel",elapsed);finish("forfeit",claims,elapsed)}}>{lang==="uz"?"Duelni tark etish":"Forfeit duel"}</button></div></aside></div></>
}

function DuelResult({lang,opponent,result,attempts,rating,gains,onRematch,onExit,openRoadmap}:{lang:Lang;opponent:DuelOpponent;result:NonNullable<DuelResultState>;attempts:{me:number;opp:number};rating:number;gains:{topic:string;delta:number}[];onRematch:()=>void;onExit:()=>void;openRoadmap:(slug:string)=>void}){
 const {outcome,reason,delta,claims,at}=result,myScore=scoreOf(claims,"me"),oppScore=scoreOf(claims,"opp");
 const heading=outcome==="win"?(lang==="uz"?"GвЂalaba!":"Victory!"):outcome==="loss"?(lang==="uz"?"MagвЂlubiyat":"Defeat"):(lang==="uz"?"Durrang":"Draw");
 const why=reason==="forfeit"?(lang==="uz"?"Siz duelni tark etdingiz.":"You forfeited the duel."):reason==="sweep"?(lang==="uz"?"Barcha masalalar yechildi.":"Every problem was claimed."):(lang==="uz"?"Vaqt tugadi.":"Time ran out.");
 return <><div className="page-head"><div><p className="eyebrow" style={{color:"#637068"}}>RATED DUEL В· {lang==="uz"?"Yakun":"Result"}</p><h1 className="page-title">{lang==="uz"?"Duel yakunlandi":"Duel finished"}</h1></div><span className="tag">{clock(at)}</span></div>
 <div className="duel-result panel"><div className={`result-badge ${outcome}`}>{outcome==="win"?"в…":outcome==="loss"?"вњ•":"="}</div><h2>{heading}</h2><p className="muted">{why}</p>
  <div className="result-score">{myScore} : {oppScore}</div>
  <p><span className="muted">{rating} в†’ </span><b>{rating+delta}</b> <span className={`elo-delta ${delta>=0?"up":"down"}`}>{delta>=0?"+":""}{delta}</span> <span className="muted">Elo</span></p>
  <div className="stage-table">{duelProblems.map((p,i)=>{const claim=claims[i];return <div className="stage-row" key={p.key}><span className="tag">{p.code}</span><span>{lang==="uz"?p.uz:p.en}</span><span className="muted">{claim?`${claim.by==="me"?(lang==="uz"?"Siz":"You"):opponent.name} В· ${clock(claim.at)}`:(lang==="uz"?"yechilmadi":"unclaimed")}</span><span className="pts">{claim?(claim.by==="me"?"+":"в€’")+p.points:"0"}</span></div>})}</div>
  <div className="duel-stats"><div><b>{attempts.me}</b><small>{lang==="uz"?"sizning xato urinish":"your failed attempts"}</small></div><div><b>{attempts.opp}</b><small>{lang==="uz"?"raqib xato urinish":"rival failed attempts"}</small></div><div><b>{opponent.rating}</b><small>{lang==="uz"?"raqib reytingi":"rival rating"}</small></div></div>
  <div className="skill-growth"><h3>{lang==="uz"?"Skill oвЂsishi":"Skill growth"}</h3>{gains.length?gains.map((g,i)=><div className="stage-row" key={i}><span className="tag">{lang==="uz"?"Mahorat":"Mastery"}</span><span>{topicTitle(g.topic,lang)}</span><span className="muted mono">{masteryOf(g.topic)}/1000</span><span className="pts" style={{color:"var(--lime)"}}>+{g.delta}</span></div>):<p className="muted">{lang==="uz"?"Bu duelda yangi mahorat isboti boвЂlmadi.":"No new mastery evidence in this duel."}</p>}
   {gains.length>0&&<div className="match-actions" style={{justifyContent:"flex-start",marginTop:14}}>{[...new Set(gains.map(g=>g.topic))].map(tp=><button key={tp} className="secondary" onClick={()=>openRoadmap(tp)}>{topicTitle(tp,lang)} {lang==="uz"?"mavzusiga oвЂtish":"topic"} в†’</button>)}</div>}</div>
  <div className="match-actions"><button className="primary" onClick={onRematch}>{lang==="uz"?"Yangi duel":"New duel"} в†’</button><button className="secondary" onClick={onExit}>{lang==="uz"?"Maydondan chiqish":"Leave arena"}</button></div></div></>
}

function DuelMatchmaking({lang,profile,signed,needAuth,openRoadmap}:{lang:Lang,profile?:Profile|null,signed:boolean,needAuth:()=>void,openRoadmap:(slug:string)=>void}){
 const [phase,setPhase]=useState<"idle"|"searching"|"found"|"active">("idle"),[rating,setRating]=useState(1462),[opponent,setOpponent]=useState<DuelOpponent>(duelOpponents[0]),[matchId,setMatchId]=useState(4821);
 useEffect(()=>{if(profile?.duel_rating){setRating(profile.duel_rating);return}const saved=Number(localStorage.getItem("algoyol-duel-rating"));if(saved>0)setRating(saved)},[profile]);
 useEffect(()=>{if(phase!=="searching")return;const found=window.setTimeout(()=>{const pool=[...duelOpponents].sort((a,b)=>Math.abs(a.rating-rating)-Math.abs(b.rating-rating)).slice(0,3);setOpponent(pool[Math.floor(Math.random()*pool.length)]);setMatchId(4000+Math.floor(Math.random()*1800));setPhase("found")},1800);return()=>window.clearTimeout(found)},[phase,rating]);
 const settle=(next:number)=>{setRating(next);localStorage.setItem("algoyol-duel-rating",String(next));void saveDuelRating(next)};
 if(phase==="active")return <Duel key={matchId} lang={lang} opponent={opponent} rating={rating} matchId={matchId} onFinish={settle} onRematch={()=>setPhase("searching")} onExit={()=>setPhase("idle")} openRoadmap={openRoadmap}/>;
 const gap=Math.abs(opponent.rating-rating);
 return <><div className="page-head"><div><p className="eyebrow" style={{color:"#637068"}}>RATED MATCHMAKING</p><h1 className="page-title">{lang==="uz"?"Duel uchun raqib toping":"Find a duel opponent"}</h1><p className="muted">{lang==="uz"?"Tizim sizga reytingi yaqin boвЂlgan raqibni qidiradi.":"We will match you with a player near your rating."}</p></div><span className="tag">ELO {rating}</span></div>
 <div className="matchmaking panel"><div className={`search-orb ${phase==="searching"?"pulse":""}`}>{phase==="found"?"вњ“":"вљЎ"}</div>
  <h2>{phase==="idle"?(lang==="uz"?"Bellashishga tayyormisiz?":"Ready to compete?"):phase==="searching"?(lang==="uz"?"Raqib qidirilmoqdaвЂ¦":"Searching for an opponentвЂ¦"):(lang==="uz"?"Raqib topildi!":"Opponent found!")}</h2>
  {phase==="found"?<><div className="found-player"><span className="avatar">{opponent.letter}</span><span><b>{opponent.name} В· {opponent.handle}</b><br/><span className="muted">{opponent.rating} Elo В· {opponent.wins} {lang==="uz"?"gвЂalaba":"wins"}</span></span></div>
   <p className="muted">{lang==="uz"?`Reyting farqi: ${gap}. Duel 30 daqiqa davom etadi.`:`Rating difference: ${gap}. The duel lasts 30 minutes.`}</p>
   <div className="match-actions"><button className="primary" onClick={()=>setPhase("active")}>{lang==="uz"?"Duelni boshlash":"Start duel"} в†’</button><button className="secondary" onClick={()=>setPhase("idle")}>{lang==="uz"?"Bekor qilish":"Cancel"}</button></div></>
  :<><p className="muted">{phase==="searching"?(lang==="uz"?"Odatda 10 soniyadan kam vaqt oladi.":"This usually takes less than 10 seconds."):(lang==="uz"?"Easy, Medium va Hard masalalar ketma-ket ochiladi.":"Easy, Medium, and Hard problems unlock in order.")}</p>
    <button className={phase==="searching"?"secondary":"primary"} onClick={()=>{if(!signed){needAuth();return}setPhase(phase==="searching"?"idle":"searching")}}>{phase==="searching"?(lang==="uz"?"Qidiruvni bekor qilish":"Cancel search"):signed?(lang==="uz"?"Raqib qidirish":"Search for competitor"):(lang==="uz"?"Kirish talab qilinadi":"Sign in required")} {phase==="idle"&&signed&&"в†’"}</button></>}</div></>
}
function Leaderboard({lang}:{lang:Lang}){return <><div className="page-head"><div><p className="eyebrow" style={{color:"#637068"}}>ELO В· K=32</p><h1 className="page-title">{lang==="uz"?"Duel reytingi":"Duel leaderboard"}</h1><p className="muted">{lang==="uz"?"Eng kuchli AlgoYoвЂlchilar safi.":"The strongest competitors on AlgoYoвЂl."}</p></div></div><div className="leaderboard">{leaders.map((x,i)=><div className={`leader-row ${x.n==="Siz"?"me":""}`} key={x.u}><span className="rank">#{i+1}</span><span><b>{lang==="en"&&x.n==="Siz"?"You":x.n}</b><br/><span className="muted">{x.u}</span></span><span className="tag">{x.w} W</span><span className="rating">{x.r}</span></div>)}</div></>}
function Profile({lang,go,profile,loading,signOut}:{lang:Lang,go:(v:View)=>void,profile:Profile|null,loading:boolean,signOut:()=>void}){
 const role:Role=profile?.role||"user",staff=role==="admin"||role==="owner";
 const name=profile?.display_name||profile?.username||"AlgoYoвЂlchi",handle=profile?`@${profile.username}`:"@algoyolchi";
 const initials=name.trim().slice(0,2).toUpperCase()||"AY";
 return <><div className="page-head"><h1 className="page-title">{lang==="uz"?"Mening profilim":"My profile"}</h1><div className="actions">{staff&&<button className="secondary" onClick={()=>go("admin")}>{lang==="uz"?"Boshqaruv":"Admin studio"}</button>}<button className="lang" onClick={signOut}>{lang==="uz"?"Chiqish":"Sign out"}</button></div></div>
 {!supabaseReady()&&<div className="notice" style={{marginBottom:18}}>{lang==="uz"?"Supabase ulanmagan вЂ” profil va rollar demo rejimida koвЂrsatilmoqda. .env.local faylga NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY ni yozing.":"Supabase is not connected вЂ” the profile and roles are shown in demo mode. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."}</div>}
 {supabaseReady()&&!profile&&!loading&&<div className="notice" style={{marginBottom:18}}>{lang==="uz"?"Profil topilmadi. SupabaseвЂ™ga kiring вЂ” profil birinchi kirishda avtomatik yaratiladi.":"No profile found. Sign in to Supabase вЂ” the profile is created automatically on first login."}</div>}
 <div className="profile-grid"><div className="panel profile-card"><div className="profile-avatar">{initials}</div><h2>{name}</h2><p className="muted">{handle}{profile?.email?` В· ${profile.email}`:" В· Toshkent"}</p><span className={`tag role-${role}`}>{loading?"вЂ¦":roleLabel(role,lang)}</span>
  <div className="kpis"><div className="kpi"><b>{profile?.duel_rating??1462}</b>Elo</div><div className="kpi"><b>{profile?.solved_count??27}</b>AC</div><div className="kpi"><b>{staff?"в€ћ":"12"}</b>{staff?(lang==="uz"?"Huquq":"Access"):"W"}</div></div>
  <p className="muted" style={{marginTop:18,fontSize:13}}>{role==="owner"?(lang==="uz"?"Owner barcha masalalar, roadmap va adminlarni boshqaradi.":"The owner manages every problem, roadmap, and admin."):role==="admin"?(lang==="uz"?"Admin faqat oвЂzi yaratgan masalalarni tahrirlaydi.":"Admins edit only the problems they created."):(lang==="uz"?"Foydalanuvchi darslarni oвЂqiydi, masalalar yechadi va duellarda qatnashadi.":"Users read lessons, solve problems, and enter duels.")}</p></div>
   <div className="panel"><h2>{lang==="uz"?"Mavzu mahorati":"Topic mastery"}</h2>{roadmapCards.map(r=>{const s=masteryOf(r.slug);return <div key={r.slug} className="pl-bar" style={{margin:"14px 0"}}><span className="pl-bar-name">{lang==="uz"?r.uz:r.en}</span><div className="progress"><span style={{width:`${s/10}%`}}/></div><b className="mono">{s}</b><small className="muted">{masteryLabel(s,lang)}</small></div>})}</div></div></>}
function Admin({lang,profile}:{lang:Lang,profile:Profile|null}){
  const role:Role=profile?.role||"user";
  if(!can(role,"content.view_management"))return <><div className="page-head"><div><span className="tag">ADMIN STUDIO</span><h1 className="page-title" style={{marginTop:12}}>{lang==="uz"?"Ruxsat yoвЂq":"Access denied"}</h1></div></div><div className="panel"><div className="notice">{lang==="uz"?"Bu sahifa faqat admin va owner rollari uchun. SupabaseвЂ™da profilingiz roli hozir: ":"This page is for the admin and owner roles only. Your Supabase profile role is currently: "}<b>{roleLabel(role,lang)}</b>.</div></div></>;
 return <><div className="page-head"><div><span className="tag">ADMIN STUDIO В· {roleLabel(role,lang)}</span><h1 className="page-title" style={{marginTop:12}}>{lang==="uz"?"Yangi masala":"New problem"}</h1></div><button className="primary">{lang==="uz"?"Qoralamani saqlash":"Save draft"}</button></div><div className="panel"><div className="admin-grid"><div className="field"><label>OвЂzbekcha nomi</label><input placeholder="Masala nomi"/></div><div className="field"><label>English title</label><input placeholder="Problem title"/></div><div className="field"><label>{lang==="uz"?"Qiyinlik":"Difficulty"}</label><select><option>Easy В· 100</option><option>Medium В· 200</option><option>Hard В· 300</option></select></div><div className="field"><label>Taglar</label><input placeholder="binary-search, arrays"/></div></div><div className="admin-grid"><div className="field"><label>OвЂzbekcha shart</label><textarea rows={9} placeholder="Masala shartini yozingвЂ¦"/></div><div className="field"><label>English statement</label><textarea rows={9} placeholder="Write the problem statementвЂ¦"/></div></div><div className="admin-grid"><div className="field"><label>{lang==="uz"?"Vaqt chegarasi":"Time limit"}</label><input value="1000 ms" readOnly/></div><div className="field"><label>{lang==="uz"?"Xotira chegarasi":"Memory limit"}</label><input value="256 MB" readOnly/></div></div><div className="field"><label>{lang==="uz"?"Yashirin testlar":"Hidden tests"}</label><textarea rows={5} placeholder="Input в†’ Expected output"/></div><div className="notice">{lang==="uz"?"Admin faqat oвЂzi yaratgan masalalarni tahrirlaydi. Owner barcha masalalarni boshqaradi.":"Admins edit only their own problems. The owner can manage all content."}</div></div></>}
