"use client";

import { useEffect, useMemo, useState } from "react";
import { roadmapCatalog, type LessonUnit, type MasteryRoadmap } from "./roadmap-data";
import { loadMastery, masteryLabel, MASTERY_CONFIG } from "./mastery";

type Lang="uz"|"en";
type Progress={quizScores:Record<string,number>;solved:Record<string,boolean>};
export type NodeStatus="locked"|"available"|"in-progress"|"completed"|"validated";
const empty:Progress={quizScores:{},solved:{}};

export const unitDone=(p:Progress,u:LessonUnit)=>(p.quizScores[u.id]||0)>=70&&!!p.solved[u.id];
const bySlug=(s:string)=>roadmapCatalog.find(r=>r.slug===s);

/* Unlock = prerequisites completed OR proven external skill (persistent mastery unlock). Completion ≠ unlock. */
export function nodeStatus(r:MasteryRoadmap,p:Progress,mastery:ReturnType<typeof loadMastery>):NodeStatus{
 const studied=r.units.every(u=>unitDone(p,u));
 const score=mastery.scores[r.slug]||0;
 if(studied)return "completed";
 if(score>=MASTERY_CONFIG.complete)return "validated";
 const open=mastery.unlocks[r.slug]||r.prereqs.every(s=>{const pre=bySlug(s);return !pre||pre.units.every(u=>unitDone(p,u))||(mastery.scores[pre.slug]||0)>=MASTERY_CONFIG.complete});
 if(!open)return "locked";
 return r.units.some(u=>unitDone(p,u)||(p.quizScores[u.id]||0)>0)?"in-progress":"available";
}

const L={uz:{
 title:"O‘rganish yo‘l xaritasi",sub:"Birinchi mavzuni tugating — keyingisi ochiladi. Yoki bilimingizni isbotlab, yo‘lni qisqartiring.",
 overall:"Umumiy progress",units:"Bosqichlar",mastery:"O‘rtacha mahorat",unlocked:"Ochiq mavzular",
 continue:"Davom ettirish",start:"O‘rganishni boshlash",recommended:"Sizga tavsiya etiladi",
 search:"Mavzu qidirish…",all:"Barchasi",completed:"Tugatildi",validated:"Tasdiqlangan",inProgress:"Jarayonda",available:"Ochiq",locked:"Qulflangan",
 requires:"Talab qiladi",unitsShort:"bosqich",masteryShort:"Mahorat",open:"Ochish",empty:"Hech narsa topilmadi."
},en:{
 title:"Learning roadmap",sub:"Finish the current topic to unlock the next — or prove your skill and skip ahead.",
 overall:"Overall progress",units:"Units",mastery:"Average mastery",unlocked:"Unlocked topics",
 continue:"Continue learning",start:"Start learning",recommended:"Recommended for you",
 search:"Search topics…",all:"All",completed:"Completed",validated:"Validated",inProgress:"In progress",available:"Available",locked:"Locked",
 requires:"Requires",unitsShort:"units",masteryShort:"Mastery",open:"Open",empty:"Nothing found."
}};
export const statusLabel=(s:NodeStatus,lang:Lang)=>s==="completed"?L[lang].completed:s==="validated"?L[lang].validated:s==="in-progress"?L[lang].inProgress:s==="available"?L[lang].available:L[lang].locked;
const statusIcon=(s:NodeStatus)=>s==="completed"?"✓":s==="validated"?"★":s==="in-progress"?"◔":s==="available"?"▶":"✕";

export function RoadmapHub({lang,openRoadmap}:{lang:Lang;openRoadmap:(slug:string)=>void}){
 const t=L[lang];
 const [progress,setProgress]=useState<Progress>(empty),[mastery,setMastery]=useState(loadMastery()),[query,setQuery]=useState(""),[statusFilter,setStatusFilter]=useState<"all"|NodeStatus>("all");
 useEffect(()=>{const read=()=>{try{setProgress(JSON.parse(localStorage.getItem("algoyol-roadmap-progress")||JSON.stringify(empty)))}catch{setProgress(empty)}setMastery(loadMastery())};read();window.addEventListener("algoyol-progress",read);return()=>window.removeEventListener("algoyol-progress",read)},[]);
 const statuses=useMemo(()=>new Map(roadmapCatalog.map(r=>[r.slug,nodeStatus(r,progress,mastery)])),[progress,mastery]);
 const stats=useMemo(()=>{
  const all=roadmapCatalog.flatMap(r=>r.units),done=all.filter(u=>unitDone(progress,u));
  const scores=roadmapCatalog.map(r=>mastery.scores[r.slug]||0),avg=Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
  const open=roadmapCatalog.filter(r=>statuses.get(r.slug)!=="locked").length;
  return {total:all.length,done:done.length,pct:Math.round(done.length/all.length*100),avg,open};
 },[progress,mastery,statuses]);
 const matches=(r:MasteryRoadmap)=>{
  const s=statuses.get(r.slug)||"locked";
  if(statusFilter!=="all"&&s!==statusFilter)return false;
  if(!query.trim())return true;
  const q=query.trim().toLowerCase();
  return [r.titleUz,r.titleEn,r.category,r.categoryUz,...r.units.flatMap(u=>[u.titleUz,u.titleEn])].some(x=>x.toLowerCase().includes(q));
 };
 const active=roadmapCatalog.find(r=>statuses.get(r.slug)==="in-progress")||roadmapCatalog.find(r=>statuses.get(r.slug)==="available");
 const recommended=roadmapCatalog.filter(r=>{const s=statuses.get(r.slug);return (s==="available"||s==="in-progress")&&r.slug!==active?.slug}).slice(0,3);
 const doneIn=(r:MasteryRoadmap)=>r.units.filter(u=>unitDone(progress,u)).length;
 return <>
  <div className="page-head"><div><p className="eyebrow" style={{color:"#637068"}}>0 → 3000+</p><h1 className="page-title">{t.title}</h1><p className="muted">{t.sub}</p></div><span className="tag">{roadmapCatalog.length} {lang==="uz"?"yo‘nalish":"tracks"}</span></div>
  <div className="rm-stats">
   <div className="rm-stat"><small>{t.overall}</small><b>{stats.pct}%</b><div className="progress"><span style={{width:`${stats.pct}%`}}/></div></div>
   <div className="rm-stat"><small>{t.units}</small><b>{stats.done}<span className="rm-dim">/{stats.total}</span></b></div>
   <div className="rm-stat"><small>{t.mastery}</small><b>{stats.avg}<span className="rm-dim">/1000</span></b><span className="rm-rank">{masteryLabel(stats.avg,lang)}</span></div>
   <div className="rm-stat"><small>{t.unlocked}</small><b>{stats.open}<span className="rm-dim">/{roadmapCatalog.length}</span></b></div>
  </div>
  <div className="rm-next">
   <div className="rm-panel">{active?<><p className="eyebrow" style={{color:"#637068"}}>{stats.done>0?t.continue:t.start}</p><div className="rm-active"><span className="rm-node-ic" style={{background:active.color}}>{active.icon}</span><div><b>{lang==="uz"?active.titleUz:active.titleEn}</b><span className="muted">{doneIn(active)}/{active.units.length} {t.unitsShort} · {t.masteryShort} {mastery.scores[active.slug]||0}/1000</span><div className="progress"><span style={{width:`${doneIn(active)/active.units.length*100}%`}}/></div></div><button className="primary" onClick={()=>openRoadmap(active.slug)}>{t.open} →</button></div></>:<p className="muted">{t.empty}</p>}</div>
   <div className="rm-panel"><p className="eyebrow" style={{color:"#637068"}}>{t.recommended}</p><div className="rm-recs">{recommended.length?recommended.map(r=><button key={r.slug} className="rm-rec" onClick={()=>openRoadmap(r.slug)}><span className="rm-dot available"/><span><b>{lang==="uz"?r.titleUz:r.titleEn}</b><small className="muted">{r.level} · {r.units.length} {t.unitsShort}</small></span><span>→</span></button>):<span className="muted">—</span>}</div></div>
  </div>
  <div className="rm-toolbar">
   <input className="rm-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} aria-label={t.search}/>
   <div className="filters">{(["all","completed","validated","in-progress","available","locked"] as const).map(f=><button key={f} className={statusFilter===f?"active":""} onClick={()=>setStatusFilter(f)}>{f==="all"?t.all:statusLabel(f,lang)}</button>)}</div>
  </div>
  <div className="grid rm-grid">{roadmapCatalog.filter(matches).map(r=>{
   const s=statuses.get(r.slug)||"locked",done=doneIn(r),pct=Math.round(done/r.units.length*100),score=mastery.scores[r.slug]||0;
   const lockedBy=r.prereqs.map(bySlug).filter((p):p is MasteryRoadmap=>!!p&&statuses.get(p.slug)!=="completed"&&statuses.get(p.slug)!=="validated");
   return <button key={r.slug} className={`road-card rm-card ${s}`} style={{textAlign:"left"}} disabled={s==="locked"} onClick={()=>openRoadmap(r.slug)} title={s==="locked"&&lockedBy.length?`${t.requires}: ${lockedBy.map(p=>lang==="uz"?p.titleUz:p.titleEn).join(" + ")}`:`${t.masteryShort}: ${score}/1000 · ${statusLabel(s,lang)}`}>
    <span className={`rm-badge ${s}`}>{statusIcon(s)} {statusLabel(s,lang)}</span>
    <span className="road-icon" style={{background:r.color}}>{r.icon}</span>
    <h3>{lang==="uz"?r.titleUz:r.titleEn}</h3>
    <p className="muted">{lang==="uz"?r.descriptionUz:r.descriptionEn}</p>
    <div className="rm-mastery"><span>{t.masteryShort}</span><b className="mono">{score}</b><div className="progress"><span style={{width:`${score/10}%`}}/></div></div>
    <div className="progress"><span style={{width:`${pct}%`}}/></div>
    <div className="meta"><span>{done}/{r.units.length} {t.unitsShort}</span><span>{r.level}</span></div>
    {s==="locked"&&lockedBy.length>0&&<span className="rm-req">{t.requires}: {lockedBy.map(p=>lang==="uz"?p.titleUz:p.titleEn).join(" + ")} · {lang==="uz"?`yoki ${MASTERY_CONFIG.unlock} mahorat`:`or ${MASTERY_CONFIG.unlock} mastery`}</span>}
   </button>})}</div>
 </>;
}
