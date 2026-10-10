"use client";

import { useEffect, useMemo, useState } from "react";
import { tr, catalogue } from "./i18n";
import { LockIcon } from "./icons";
import { roadmapCatalog, type LessonUnit, type MasteryRoadmap } from "./roadmap-data";
import { MASTERY_CONFIG, useMastery, type MasteryStore } from "./mastery";
import { readLocal } from "./progress";
import { can } from "./permissions";
import type { Role } from "./AlgoYolApp";

type Lang="uz"|"en";
type Progress={quizScores:Record<string,number>;solved:Record<string,boolean>};
type Status="locked"|"available"|"in-progress"|"completed";
type HubView="path"|"map";
const empty:Progress={quizScores:{},solved:{}};

export const unitDone=(p:Progress,u:LessonUnit)=>(p.quizScores[u.id]||0)>=70&&!!p.solved[u.id];
const bySlug=(s:string)=>roadmapCatalog.find(r=>r.slug===s);
/* A section is done either way: every unit walked, or mastery at the
   completion threshold — from the level check, solved problems or duels. The
   second is what lets somebody who already knows sorting go straight on to
   binary search without re-reading eighteen units first. */
/* Mastery comes in as an argument rather than being read from storage here:
   these run during render, and a render that reads localStorage disagrees with
   the server's and fails hydration. Components pass `useMastery()`. */
type MasteryView=Pick<MasteryStore,"scores"|"validated">;
export const sectionDone=(r:MasteryRoadmap,p:Progress,m:MasteryView)=>r.units.every(u=>unitDone(p,u))||!!m.validated[r.slug];
/* Done by mastery, not by walking every unit — labelled differently so the
   roadmap does not claim lessons the learner never opened. */
export const sectionValidatedOnly=(r:MasteryRoadmap,p:Progress,m:MasteryView)=>!r.units.every(u=>unitDone(p,u))&&!!m.validated[r.slug];
export const roadmapStatus=(r:MasteryRoadmap,p:Progress,m:MasteryView,canReviewAll=false):Status=>{
 if(sectionDone(r,p,m))return "completed";
 const open=r.prereqs.every(s=>{const pre=bySlug(s);return !pre||sectionDone(pre,p,m)});
 if(!canReviewAll&&!open&&(m.scores[r.slug]||0)<MASTERY_CONFIG.unlock)return "locked";
 return r.units.some(u=>unitDone(p,u)||(p.quizScores[u.id]||0)>0)?"in-progress":"available";
};

const L = catalogue("roadmapHub");
export const statusLabel=(s:Status,lang:Lang)=>s==="completed"?L[lang].completed:s==="in-progress"?L[lang].inProgress:s==="available"?L[lang].available:L[lang].locked;
const rankOf=(rating:number,lang:Lang)=>rating<1200?(tr(lang,"roadmapHub.yangi_boshlovchi")):rating<1400?"Pupil":rating<1600?"Specialist":rating<1900?"Expert":rating<2100?"Candidate Master":"Master";

const StatIc=({d}:{d:string})=><svg className="rm-stat-ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;

export function RoadmapHub({lang,role,openRoadmap}:{lang:Lang;role:Role;openRoadmap:(slug:string)=>void}){
 const t=L[lang];
 const canReviewAll=can(role,"roadmap.manage");
 const [progress,setProgress]=useState<Progress>(empty),[view,setView]=useState<HubView>("path"),[query,setQuery]=useState(""),[statusFilter,setStatusFilter]=useState<"all"|Status>("all");
 useEffect(()=>{const read=()=>{setProgress(readLocal())};read();window.addEventListener("algoyol-progress",read);return()=>window.removeEventListener("algoyol-progress",read)},[]);
 const stats=useMemo(()=>{
  const all=roadmapCatalog.flatMap(r=>r.units),done=all.filter(u=>unitDone(progress,u));
  const xp=roadmapCatalog.reduce((n,r)=>n+r.units.reduce((m,u)=>m+((progress.quizScores[u.id]||0)>=70?10:0)+(progress.solved[u.id]?20:0),0)+(r.units.every(u=>unitDone(progress,u))?100:0),0);
  const rating=Math.min(2400,800+done.length*35);
  return {total:all.length,done:done.length,pct:Math.round(done.length/all.length*100),xp,rating};
 },[progress]);
 const mastery=useMastery();
 const masteryOf=(slug:string)=>mastery.scores[slug]||0;
 const statuses=useMemo(()=>new Map(roadmapCatalog.map(r=>[r.slug,roadmapStatus(r,progress,mastery,canReviewAll)])),[progress,mastery,canReviewAll]);
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
  <div className="page-head"><div><h1 className="page-title">{t.title}</h1><p className="muted">{t.sub}</p></div><span className="tag">{roadmapCatalog.length} {tr(lang,"algoYolApp.yonalish")}</span></div>
  <div className="rm-stats">
   <div className="rm-stat"><small><StatIc d="M12 3a9 9 0 1 0 9 9h-9V3Z"/>{t.overall}</small><b>{stats.pct}%</b><div className="progress"><span style={{width:`${stats.pct}%`}}/></div></div>
   <div className="rm-stat"><small><StatIc d="m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5"/>{t.units}</small><b>{stats.done}<span className="rm-dim">/{stats.total}</span></b></div>
   <div className="rm-stat"><small><StatIc d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z"/>{t.rating}</small><b>{stats.rating}</b><span className="rm-rank">{rankOf(stats.rating,lang)}</span></div>
   <div className="rm-stat"><small><StatIc d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z"/>{t.xp}</small><b>{stats.xp}<span className="rm-dim"> XP</span></b></div>
  </div>
  <div className={`rm-next${recommended.length ? "" : " solo"}`}>
   <div className="rm-panel">{active?<><p className="eyebrow">{stats.done>0?t.continue:t.start}</p><div className="rm-active"><span className="rm-node-ic" style={{background:active.color}}>{active.icon}</span><div><b>{lang==="uz"?active.titleUz:active.titleEn}</b><span className="muted">{doneIn(active)}/{active.units.length} {t.unitsShort} · {active.level}</span><div className="progress"><span style={{width:`${doneIn(active)/active.units.length*100}%`}}/></div></div><button className="primary" onClick={()=>openRoadmap(active.slug)}>{t.open}</button></div></>:<p className="muted">{t.empty}</p>}</div>
   {recommended.length>0&&<div className="rm-panel"><p className="eyebrow">{t.recommended}</p><div className="rm-recs">{recommended.map(r=><button key={r.slug} className="rm-rec" onClick={()=>openRoadmap(r.slug)}><span className="rm-dot available"/><span><b>{lang==="uz"?r.titleUz:r.titleEn}</b><small className="muted">{r.level} · {r.units.length} {t.unitsShort}</small></span></button>)}</div></div>}
  </div>
  <div className="rm-toolbar">
   <input className="rm-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} aria-label={t.search}/>
   <div className="filters">{(["all","completed","in-progress","available","locked"] as const).map(f=><button key={f} className={statusFilter===f?"active":""} onClick={()=>setStatusFilter(f)}>{f==="all"?t.all:statusLabel(f,lang)}</button>)}</div>
   <div className="rm-toggle"><button className={view==="path"?"active":""} onClick={()=>setView("path")}>{t.path}</button><button className={view==="map"?"active":""} onClick={()=>setView("map")}>{t.map}</button></div>
  </div>
  {view==="path"?<div className="rm-tree">
   <div className="rm-cap">{t.begin}</div>
   {tiers.map((tier,ti)=>{const shown=tier.filter(matches);if(!shown.length)return null;
    const tierState=tier.every(r=>statuses.get(r.slug)==="completed")?"done":tier.some(r=>{const s=statuses.get(r.slug);return s==="in-progress"||s==="available"})?"open":"locked";
    return <div className={`rm-tier ${ti>0?"linked":""} ${tierState}`} key={ti}>
     <span className="rm-tier-n" aria-hidden>{tierState==="done"?"✓":ti+1}</span>
     <div className="rm-tier-row">{shown.map(r=>{
     const s=statuses.get(r.slug)||"locked",done=doneIn(r),pct=Math.round(done/r.units.length*100);
     const lockedBy=r.prereqs.map(bySlug).filter((p):p is MasteryRoadmap=>!!p&&statuses.get(p.slug)!=="completed");
     return <button key={r.slug} className={`rm-node ${s}`} disabled={s==="locked"} onClick={()=>openRoadmap(r.slug)}>
      <span className={`rm-badge ${s}`}>{s==="locked"?<LockIcon/>:<i className="rm-badge-ic">{s==="completed"?"✓":s==="in-progress"?"◔":"▶"}</i>} {s==="completed"&&sectionValidatedOnly(r,progress,mastery)?t.validated:statusLabel(s,lang)}</span>
      <span className="rm-node-top"><span className="rm-node-ic" style={{background:r.color}}>{r.icon}</span><span><b>{lang==="uz"?r.titleUz:r.titleEn}</b><small>{r.level}</small></span></span>
      <span className="rm-node-meta"><span>{done}/{r.units.length} {t.unitsShort}</span><span className="mono">{tr(lang,"roadmapExperience.mahorat")} {masteryOf(r.slug)}</span><span>{pct}%</span></span>
      <span className="progress"><span style={{width:`${pct}%`}}/></span>
      {s==="locked"&&lockedBy.length>0&&<span className="rm-req">{t.requires}: {lockedBy.map(p=>lang==="uz"?p.titleUz:p.titleEn).join(" + ")}{lang==="uz"?` \u00b7 yoki ${MASTERY_CONFIG.unlock} mahorat`:` \u00b7 or ${MASTERY_CONFIG.unlock} mastery`}</span>}
     </button>})}</div></div>})}
   <div className="rm-cap end">{t.expert}</div>
  </div>
  :<div className="rm-map">{categories.map(([cat,list])=>{
    /* A category's mastery is the mean of its sections, on the same 0–1000
       scale; the two marks on each bar are where a section opens and where it
       counts as done. */
    const avg=Math.round(list.reduce((n,r)=>n+masteryOf(r.slug),0)/list.length);
    const doneN=list.filter(r=>statuses.get(r.slug)==="completed").length;
    const shown=list.filter(matches);
    if(!shown.length)return null;
    return <section className="rm-col" key={cat}>
     <header className="rm-col-head">
      <h3>{lang==="uz"?list[0].categoryUz:cat}</h3>
      <span className="rm-col-count mono">{doneN}/{list.length}</span>
     </header>
     <span className="rm-col-bar" aria-hidden><i style={{width:`${Math.min(100,avg/10)}%`}}/></span>
     <div className="rm-col-items">{shown.map(r=>{const s=statuses.get(r.slug)||"locked",m=masteryOf(r.slug);
      return <button key={r.slug} className={`rm-item ${s}`} disabled={s==="locked"} onClick={()=>openRoadmap(r.slug)}>
       <span className="rm-item-ic" style={{background:r.color}} aria-hidden>{s==="locked"?<LockIcon/>:r.icon}</span>
       <span className="rm-item-copy">
        <span className="rm-item-top"><b>{lang==="uz"?r.titleUz:r.titleEn}</b>{s==="completed"&&<i className="rm-item-done" aria-label={statusLabel(s,lang)}>✓</i>}</span>
        <small className="muted">{r.level} · {doneIn(r)}/{r.units.length} {t.unitsShort}</small>
        <span className="rm-skill" title={`${tr(lang,"roadmapExperience.mahorat")} ${m}/1000`}>
         <i style={{width:`${Math.min(100,m/10)}%`}}/>
         <b className="mark" style={{left:`${MASTERY_CONFIG.unlock/10}%`}}/>
         <b className="mark" style={{left:`${MASTERY_CONFIG.complete/10}%`}}/>
        </span>
       </span>
       <span className="rm-item-score mono">{m}</span>
      </button>})}</div>
    </section>})}</div>}
 </>;
}
