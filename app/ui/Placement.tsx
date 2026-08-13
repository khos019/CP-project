"use client";

import { useMemo, useState } from "react";
import { roadmapCatalog } from "./roadmap-data";
import { loadMastery, masteryLabel, seedPlacement } from "./mastery";

type Lang="uz"|"en";
type Step="intro"|"background"|"quiz"|"coding"|"result";

const questions:{topic:string;uz:string;en:string;choices:string[];correct:number}[]=[
 {topic:"programming-basics",uz:"C++ da `int x = 5; cout << x % 2;` nima chiqaradi?",en:"In C++, what does `int x = 5; cout << x % 2;` print?",choices:["0","1","2","5"],correct:1},
 {topic:"foundations",uz:"n elementli massivni bir marta kezishning vaqt murakkabligi?",en:"Time complexity of one pass over an array of n elements?",choices:["O(1)","O(log n)","O(n)","O(n log n)"],correct:2},
 {topic:"sorting",uz:"Qaysi algoritm o‘rtacha O(n log n) da ishlaydi?",en:"Which algorithm runs in O(n log n) on average?",choices:["Bubble sort","Merge sort","Selection sort","Insertion sort"],correct:1},
 {topic:"binary-search",uz:"Binary search qo‘llash uchun asosiy shart?",en:"Main requirement for applying binary search?",choices:["Massiv tartiblangan bo‘lishi","Massiv kichik bo‘lishi","Elementlar musbat bo‘lishi","Elementlar unikal bo‘lishi"],correct:0},
 {topic:"two-pointers",uz:"Sliding window texnikasining odatiy murakkabligi?",en:"Typical complexity of the sliding window technique?",choices:["O(n²)","O(n log n)","O(n)","O(log n)"],correct:2},
 {topic:"math",uz:"gcd(12, 18) nechaga teng?",en:"What is gcd(12, 18)?",choices:["2","3","6","9"],correct:2},
 {topic:"data-structures",uz:"LIFO printsipida ishlaydigan tuzilma?",en:"Which structure follows LIFO?",choices:["Queue","Stack","Heap","Set"],correct:1},
 {topic:"graphs",uz:"BFS qaysi ma’lumot tuzilmasidan foydalanadi?",en:"Which data structure does BFS use?",choices:["Stack","Priority queue","Queue","Trie"],correct:2},
 {topic:"dynamic-programming",uz:"Memoization nima uchun ishlatiladi?",en:"What is memoization used for?",choices:["Xotirani tejash","Takroriy hisoblashlarni yo‘qotish","Kodni qisqartirish","Rekursiyani sekinlashtirish"],correct:1},
 {topic:"greedy",uz:"Greedy yondashuvning asosiy g‘oyasi?",en:"Core idea of the greedy approach?",choices:["Barcha variantni tekshirish","Har qadamda mahalliy optimal tanlov","Random tanlov","Rekursiv bo‘lish"],correct:1},
];

const codingTasks=[
 {id:"sum-two",topic:"programming-basics",points:200,uz:"Ikki son yig‘indisi (a + b)",en:"Sum of two numbers (a + b)",cpp:"#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long a, b;\n    cin >> a >> b;\n    // TODO\n    return 0;\n}",py:"a, b = map(int, input().split())\n# TODO"},
 {id:"max-subarray",topic:"foundations",points:250,uz:"Eng katta qism-yig‘indi",en:"Maximum subarray sum",cpp:"#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // TODO\n    return 0;\n}",py:"n = int(input())\na = list(map(int, input().split()))\n# TODO"},
];

const L={uz:{
 welcome:"AlgoYo‘lga xush kelibsiz!",loop:"O‘rganing · Mashq qiling · Duelda bellashing · O‘sing",
 question:"Darajangizni aniqlaymizmi?",assess:"Darajamni aniqlash",fresh:"Boshlang‘ichdan boshlash",later:"Keyinroq",
 bgTitle:"Siz haqingizda",lang:"Afzal til",exp:"Tajriba",goal:"Maqsad",next:"Davom etish",
 quizTitle:"Bilim tekshiruvi",codingTitle:"Kod kalibratsiyasi",skip:"O‘tkazib yuborish",run:"Tekshirish",
 result:"Sizning skill profilingiz",overall:"Umumiy daraja",unlocked:"Ochilgan yo‘llar",rec:"Tavsiya etilgan boshlanish",
 goRoadmap:"Roadmapga o‘tish",beginner:"Beginner",intermediate:"Intermediate",advanced:"Advanced",
 levels:["0–1 yil","1–2 yil","2+ yil"],goals:["Olimpiada","Codeforces reytingi","Ish intervyusi","Umumiy bilim"],
},en:{
 welcome:"Welcome to AlgoYo‘l!",loop:"Learn · Practice · Duel · Grow",
 question:"Shall we find your level?",assess:"Assess my level",fresh:"Start from the basics",later:"Later",
 bgTitle:"About you",lang:"Preferred language",exp:"Experience",goal:"Goal",next:"Continue",
 quizTitle:"Knowledge calibration",codingTitle:"Coding calibration",skip:"Skip",run:"Run tests",
 result:"Your skill profile",overall:"Overall level",unlocked:"Unlocked tracks",rec:"Recommended start",
 goRoadmap:"Go to roadmap",beginner:"Beginner",intermediate:"Intermediate",advanced:"Advanced",
 levels:["0–1 years","1–2 years","2+ years"],goals:["Olympiads","Codeforces rating","Job interviews","General knowledge"],
}};

export function Placement({lang,signed,onFinish,onRoadmap}:{lang:Lang;signed:boolean;onFinish:()=>void;onRoadmap:(slug:string)=>void}){
 const t=L[lang];
 const [step,setStep]=useState<Step>("intro"),[bg,setBg]=useState({lang:"C++",exp:0,goal:0}),[qi,setQi]=useState(0),[picked,setPicked]=useState<number|null>(null),[answers,setAnswers]=useState<Record<string,number>>({});
 const [ci,setCi]=useState(0),[code,setCode]=useState(codingTasks[0].cpp),[codeLang,setCodeLang]=useState<"cpp20"|"python3">("cpp20"),[verdict,setVerdict]=useState(""),[codingScores,setCodingScores]=useState<Record<string,number>>({}),[judging,setJudging]=useState(false);
 const scores=useMemo(()=>{const s:Record<string,number>={};Object.entries(answers).forEach(([k,ok])=>{if(!ok)return;const topic=questions[Number(k)].topic;s[topic]=Math.min(1000,(s[topic]||0)+110)});Object.entries(codingScores).forEach(([id,ok])=>{if(!ok)return;const task=codingTasks.find(x=>x.id===id);if(task)s[task.topic]=Math.min(1000,(s[task.topic]||0)+task.points)});return s},[answers,codingScores]);
 const level=useMemo(()=>{const vals=Object.values(scores);const avg=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0;return avg>=550?t.advanced:avg>=250?t.intermediate:t.beginner},[scores,t]);
 const answer=()=>{if(picked===null)return;setAnswers(a=>({...a,[qi]:picked===questions[qi].correct?1:0}));setPicked(null);if(qi<questions.length-1)setQi(qi+1);else setStep("coding")};
 const submitCode=async()=>{if(judging)return;setJudging(true);setVerdict(lang==="uz"?"Tekshirilmoqda…":"Judging…");try{const r=await (await fetch("/api/judge",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({problemId:codingTasks[ci].id,language:codeLang,sourceCode:code})})).json();const ok=r.verdict==="ACCEPTED";setVerdict(ok?(lang==="uz"?"Qabul qilindi":"Accepted"):(lang==="uz"?"Noto‘g‘ri":"Wrong answer"));if(ok)setCodingScores(s=>({...s,[codingTasks[ci].id]:1}))}catch{setVerdict("Judge error")}finally{setJudging(false)}};
 const nextTask=()=>{if(ci<codingTasks.length-1){const n=ci+1;setCi(n);setCode(codeLang==="cpp20"?codingTasks[n].cpp:codingTasks[n].py);setVerdict("")}else finish()};
 const finish=()=>{seedPlacement(scores);localStorage.setItem("algoyol-onboarded","1");setStep("result")};
 if(step==="result"){
  const mastery=loadMastery(),unlocked=roadmapCatalog.filter(r=>mastery.unlocks[r.slug]||r.prereqs.length===0),rec=unlocked[unlocked.length-1];
  return <div className="pl-page"><div className="page-head"><div><p className="eyebrow" style={{color:"#637068"}}>PLACEMENT</p><h1 className="page-title">{t.result}</h1></div><span className="tag">{t.overall}: {level}</span></div>
   <div className="pl-bars panel">{roadmapCatalog.filter(r=>scores[r.slug]).map(r=><div key={r.slug} className="pl-bar"><span className="pl-bar-name">{lang==="uz"?r.titleUz:r.titleEn}</span><div className="progress"><span style={{width:`${(scores[r.slug]||0)/10}%`}}/></div><b className="mono">{scores[r.slug]||0}</b><small className="muted">{masteryLabel(scores[r.slug]||0,lang)}</small></div>)}</div>
   <div className="panel" style={{marginTop:16}}><p className="eyebrow" style={{color:"#637068"}}>{t.unlocked}</p><div className="rm-recs">{unlocked.slice(0,5).map(r=><button key={r.slug} className="rm-rec" onClick={()=>onRoadmap(r.slug)}><span className="rm-dot available"/><span><b>{lang==="uz"?r.titleUz:r.titleEn}</b><small className="muted">{r.level}</small></span><span>→</span></button>)}</div>
    <p className="muted" style={{marginTop:18}}>{t.rec}: <b>{rec?(lang==="uz"?rec.titleUz:rec.titleEn):"—"}</b></p>
    <button className="primary" onClick={onFinish}>{t.goRoadmap} →</button></div></div>;
 }
 return <div className="pl-page"><div className="auth pl-card">
  {step==="intro"&&<><div className="brand"><span className="brandmark">A›</span>AlgoYo‘l</div><h1>{t.welcome}</h1><p className="muted">{t.loop}</p><h2 style={{margin:"26px 0 6px"}}>{t.question}</h2>
   <button className="primary" style={{width:"100%",marginTop:16}} onClick={()=>signed?setStep("background"):setStep("background")}>{t.assess} →</button>
   <button className="secondary" style={{width:"100%",marginTop:10}} onClick={()=>{localStorage.setItem("algoyol-onboarded","1");onFinish()}}>{t.fresh}</button>
   <button className="lang" style={{width:"100%",marginTop:10}} onClick={onFinish}>{t.later}</button></>}
  {step==="background"&&<><h1>{t.bgTitle}</h1>
   <div className="field"><label>{t.lang}</label><select value={bg.lang} onChange={e=>setBg({...bg,lang:e.target.value})}><option>C++</option><option>Python</option></select></div>
   <div className="field"><label>{t.exp}</label><select value={bg.exp} onChange={e=>setBg({...bg,exp:Number(e.target.value)})}>{t.levels.map((x,i)=><option key={x} value={i}>{x}</option>)}</select></div>
   <div className="field"><label>{t.goal}</label><select value={bg.goal} onChange={e=>setBg({...bg,goal:Number(e.target.value)})}>{t.goals.map((x,i)=><option key={x} value={i}>{x}</option>)}</select></div>
   <button className="primary" style={{width:"100%"}} onClick={()=>setStep("quiz")}>{t.next} →</button></>}
  {step==="quiz"&&<><p className="eyebrow">{t.quizTitle} · {qi+1}/{questions.length}</p><div className="progress" style={{margin:"8px 0 18px"}}><span style={{width:`${qi/questions.length*100}%`}}/></div>
   <h2 style={{fontSize:19,lineHeight:1.5}}>{lang==="uz"?questions[qi].uz:questions[qi].en}</h2>
   <div className="quiz-options">{questions[qi].choices.map((c,i)=><button key={i} className={picked===i?"selected":""} onClick={()=>setPicked(i)}>{String.fromCharCode(65+i)}. {c}</button>)}</div>
   <button className="primary" style={{width:"100%"}} disabled={picked===null} onClick={answer}>{qi<questions.length-1?t.next:t.codingTitle} →</button></>}
  {step==="coding"&&<><p className="eyebrow">{t.codingTitle} · {ci+1}/{codingTasks.length}</p>
   <h2 style={{fontSize:19}}>{lang==="uz"?codingTasks[ci].uz:codingTasks[ci].en}</h2>
   <div className="code-tabs" style={{margin:"14px 0 8px"}}><button className={codeLang==="cpp20"?"active":""} onClick={()=>{setCodeLang("cpp20");setCode(codingTasks[ci].cpp)}}>C++20</button><button className={codeLang==="python3"?"active":""} onClick={()=>{setCodeLang("python3");setCode(codingTasks[ci].py)}}>Python 3</button></div>
   <textarea className="pl-code" value={code} onChange={e=>setCode(e.target.value)} spellCheck={false} aria-label="Placement code"/>
   <p className="verdict" style={{margin:"10px 0"}}>{verdict}</p>
   <div style={{display:"flex",gap:10}}><button className="primary" style={{flex:1}} disabled={judging} onClick={submitCode}>{judging?"…":t.run}</button><button className="secondary" onClick={nextTask}>{ci<codingTasks.length-1?t.next:t.result} →</button></div>
   <button className="lang" style={{width:"100%",marginTop:10}} onClick={finish}>{t.skip}</button></>}
 </div></div>;
}
