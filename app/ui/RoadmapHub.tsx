"use client";

import { useEffect, useMemo, useState } from "react";
import { roadmapCatalog, type LessonUnit, type MasteryRoadmap } from "./roadmap-data";
import { masteryOf, MASTERY_CONFIG } from "./mastery";

type Lang="uz"|"en";
type Progress={quizScores:Record<string,number>;solved:Record<string,boolean>};
type Status="locked"|"available"|"in-progress"|"completed";
type HubView="path"|"map";
const empty:Progress={quizScores:{},solved:{}};

export const unitDone=(p:Progress,u:LessonUnit)=>(p.quizScores[u.id]||0)>=70&&!!p.solved[u.id];
const bySlug=(s:string)=>roadmapCatalog.find(r=>r.slug===s);
export const roadmapStatus=(r:MasteryRoadmap,p:Progress):Status=>{
 if(r.units.every(u=>unitDone(p,u)))return "completed";
 const open=r.prereqs.every(s=>{const pre=bySlug(s);return !pre||pre.units.every(u=>unitDone(p,u))});
 if(!open&&masteryOf(r.slug)<MASTERY_CONFIG.unlock)return "locked";
 return r.units.some(u=>unitDone(p,u)||(p.quizScores[u.id]||0)>0)?"in-progress":"available";
};

const L={uz:{
 title:"O‘rganish yo‘l xaritasi",sub:"Birinchi mavzuni tugating — keyingisi ochiladi. Beginnerdan ICPC darajasigacha bitta yo‘l.",
 overall:"Umumiy progress",units:"Bosqichlar tugatildi",rating:"Taxminiy reyting",xp:"Tajriba ballari",
 continue:"O‘rganishni davom ettirish",start:"O‘rganishni boshlash",recommended:"Sizga tavsiya etiladi",
 search:"Mavzu qidirish…",path:"O‘rganish yo‘li",map:"Skill xaritasi",all:"Barchasi",
 completed:"Tugatildi",inProgress:"Jarayonda",available:"Ochiq",locked:"Qulflangan",
 requires:"Talab qiladi",begin:"START",expert:"EXPERT · ICPC",unitsShort:"bosqich",open:"Ochish",
 empty:"Hech narsa topilmadi — qidiruv yoki filtrni o‘zgartiring."
},en:{
 title:"Learning roadmap",sub:"Finish the current topic to unlock the next. One guided path from beginner to ICPC.",
 overall:"Overall progress",units:"Units completed",rating:"Estimated rating",xp:"Experience points",
 continue:"Continue learning",start:"Start learning",recommended:"Recommended for you",
 search:"Search topics…",path:"Learning path",map:"Skill map",all:"All",
 completed:"Completed",inProgress:"In progress",available:"Available",locked:"Locked",
 requires:"Requires",begin:"START",expert:"EXPERT · ICPC",unitsShort:"units",open:"Open",
 empty:"Nothing found — adjust the search or filters."
}};
export const statusLabel=(s:Status,lang:Lang)=>s==="completed"?L[lang].completed:s==="in-progress"?L[lang].inProgress:s==="available"?L[lang].available:L[lang].locked;
const rankOf=(rating:number,lang:Lang)=>rating<1200?(lang==="uz"?"Yangi boshlovchi":"Newbie"):rating<1400?"Pupil":rating<1600?"Specialist":rating<1900?"Expert":rating<2100?"Candidate Master":"Master";

export function RoadmapHub({lang,openRoadmap}:{lang:Lang;openRoadmap:(slug:string)=>void}){
 const t=L[lang];
 const [progress,setProgress]=useState<Progress>(empty),[view,setView]=useState<HubView>("path"),[query,setQuery]=useState(""),[statusFilter,setStatusFilter]=useState<"all"|Status>("all");
 useEffect(()=>{const read=()=>{try{setProgress(JSON.parse(localStorage.getItem("algoyol-roadmap-progress")||JSON.stringify(empty)))}catch{setProgress(empty)}};read();window.addEventListener("algoyol-progress",read);return()=>window.removeEventListener("algoyol-progress",read)},[]);
 const stats=useMemo(()=>{
  const all=roadmapCatalog.flatMap(r=>r.units),done=all.filter(u=>unitDone(progress,u));
  const xp=roadmapCatalog.reduce((n,r)=>n+r.units.reduce((m,u)=>m+((progress.quizScores[u.id]||0)>=70?10:0)+(progress.solved[u.id]?20:0),0)+(r.units.every(u=>unitDone(progress,u))?100:0),0);
  const rating=Math.min(2400,800+done.length*35);
  return {total:all.length,done:done.length,pct:Math.round(done.length/all.length*100),xp,rating};
 },[progress]);
 const statuses=useMemo(()=>new Map(roadmapCatalog.map(r=>[r.slug,roadmapStatus(r,progress)])),[progress]);
 const tiers=useMemo(()=>{
  const depth=(r:MasteryRoadmap):number=>r.prereqs.length?Math.max(...r.prereqs.map(s=>{const pre=bySlug(s);return pre?depth(pre)+1:0})):0;
  const map=new Map<number,MasteryRoadmap[]>();
  roadmapCatalog.forEach(r=>{const d=depth(r);map.set(d,[...(map.get(d)||[]),r])});
  return [...map.entries()].sort((a,b)=>a[0]-b[0]).map(([,list])=>list);
 },[]);
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
 const categories=useMemo(()=>{const map=new Map<string,MasteryRoadmap[]>();roadmapCatalog.forEach(r=>map.set(r.category,[...(map.get(r.category)||[]),r]));return[...map.entries()]},[]);
 return <>
  <div className="page-head"><div><p className="eyebrow" style={{color:"#637068"}}>{t.begin} → {t.expert}</p><h1 className="page-title">{t.title}</h1><p className="muted">{t.sub}</p></div><span className="tag">{roadmapCatalog.length} {lang==="uz"?"yo‘nalish":"tracks"}</span></div>
  <div className="rm-stats">
   <div className="rm-stat"><small>{t.overall}</small><b>{stats.pct}%</b><div className="progress"><span style={{width:`${stats.pct}%`}}/></div></div>
   <div className="rm-stat"><small>{t.units}</small><b>{stats.done}<span className="rm-dim">/{stats.total}</span></b></div>
   <div className="rm-stat"><small>{t.rating}</small><b>{stats.rating}</b><span className="rm-rank">{rankOf(stats.rating,lang)}</span></div>
   <div className="rm-stat"><small>{t.xp}</small><b>{stats.xp}<span className="rm-dim"> XP</span></b></div>
  </div>
  <div className="rm-next">
   <div className="rm-panel">{active?<><p className="eyebrow" style={{color:"#637068"}}>{stats.done>0?t.continue:t.start}</p><div className="rm-active"><span className="rm-node-ic" style={{background:active.color}}>{active.icon}</span><div><b>{lang==="uz"?active.titleUz:active.titleEn}</b><span className="muted">{doneIn(active)}/{active.units.length} {t.unitsShort} · {active.level}</span><div className="progress"><span style={{width:`${doneIn(active)/active.units.length*100}%`}}/></div></div><button className="primary" onClick={()=>openRoadmap(active.slug)}>{t.open} →</button></div></>:<p className="muted">{t.empty}</p>}</div>
   <div className="rm-panel"><p className="eyebrow" style={{color:"#637068"}}>{t.recommended}</p><div className="rm-recs">{recommended.length?recommended.map(r=><button key={r.slug} className="rm-rec" onClick={()=>openRoadmap(r.slug)}><span className="rm-dot available"/><span><b>{lang==="uz"?r.titleUz:r.titleEn}</b><small className="muted">{r.level} · {r.units.length} {t.unitsShort}</small></span><span>→</span></button>):<span className="muted">—</span>}</div></div>
  </div>
  <div className="rm-toolbar">
   <input className="rm-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} aria-label={t.search}/>
   <div className="filters">{(["all","completed","in-progress","available","locked"] as const).map(f=><button key={f} className={statusFilter===f?"active":""} onClick={()=>setStatusFilter(f)}>{f==="all"?t.all:statusLabel(f,lang)}</button>)}</div>
   <div className="rm-toggle"><button className={view==="path"?"active":""} onClick={()=>setView("path")}>{t.path}</button><button className={view==="map"?"active":""} onClick={()=>setView("map")}>{t.map}</button></div>
  </div>
  {view==="path"?<div className="rm-tree">
   <div className="rm-cap">{t.begin}</div>
   {tiers.map((tier,ti)=><div className={`rm-tier ${ti>0?"linked":""}`} key={ti}>{tier.filter(matches).map(r=>{
     const s=statuses.get(r.slug)||"locked",done=doneIn(r),pct=Math.round(done/r.units.length*100);
     const lockedBy=r.prereqs.map(bySlug).filter((p):p is MasteryRoadmap=>!!p&&statuses.get(p.slug)!=="completed");
     return <button key={r.slug} className={`rm-node ${s}`} disabled={s==="locked"} onClick={()=>openRoadmap(r.slug)}>
      <span className={`rm-badge ${s}`}>{s==="completed"?"✓":s==="locked"?"✕":s==="in-progress"?"◔":"▶"} {statusLabel(s,lang)}</span>
      <span className="rm-node-top"><span className="rm-node-ic" style={{background:r.color}}>{r.icon}</span><span><b>{lang==="uz"?r.titleUz:r.titleEn}</b><small>{r.level}</small></span></span>
      <span className="rm-node-meta"><span>{done}/{r.units.length} {t.unitsShort}</span><span className="mono" style={{color:"var(--lime)"}}>{lang==="uz"?"Mahorat":"Mastery"} {masteryOf(r.slug)}</span><span>{pct}%</span></span>
      <span className="progress"><span style={{width:`${pct}%`}}/></span>
      {s==="locked"&&lockedBy.length>0&&<span className="rm-req">{t.requires}: {lockedBy.map(p=>lang==="uz"?p.titleUz:p.titleEn).join(" + ")}{lang==="uz"?` \u00b7 yoki ${MASTERY_CONFIG.unlock} mahorat`:` \u00b7 or ${MASTERY_CONFIG.unlock} mastery`}</span>}
     </button>})}</div>)}
   <div className="rm-cap end">{t.expert}</div>
  </div>
  :<div className="rm-map">{categories.map(([cat,list])=><div className="rm-col" key={cat}><h3>{lang==="uz"?list[0].categoryUz:cat}</h3>{list.filter(matches).map(r=>{const s=statuses.get(r.slug)||"locked";return <button key={r.slug} className="rm-item" disabled={s==="locked"} onClick={()=>openRoadmap(r.slug)}><span className={`rm-dot ${s}`}/><span className="rm-item-copy"><b>{lang==="uz"?r.titleUz:r.titleEn}</b><small className="muted">{r.level} · {doneIn(r)}/{r.units.length} · {masteryOf(r.slug)}</small></span><span className="rm-item-state">{s==="completed"?"✓":""}</span></button>})}</div>)}</div>}
 </>;
}

// HomeDashboard calls this with the mastery store as a third argument; the
// store is read directly by masteryOf, so the parameter is accepted and ignored.
export const nodeStatus=(r:MasteryRoadmap,p:Progress,_mastery?:unknown):Status=>roadmapStatus(r,p);
