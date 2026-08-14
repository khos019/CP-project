"use client";

import { useMemo } from "react";
import { roadmapCatalog } from "./roadmap-data";
import { masteryLabel } from "./mastery";
import { nodeStatus, statusLabel } from "./RoadmapHub";
import { useLearning } from "./LearningContext";

type Lang="uz"|"en";

export function HomeDashboard({lang,go,openRoadmap,duelRating}:{lang:Lang;go:(v:string)=>void;openRoadmap:(slug:string)=>void;duelRating:number}){
 const {progress,mastery,events,masteryConfig,duelSettings,status,error}=useLearning();
 const statuses=useMemo(()=>new Map(roadmapCatalog.map(r=>[r.slug,nodeStatus(r,progress,mastery,masteryConfig)])),[progress,mastery,masteryConfig]);
 const active=roadmapCatalog.find(r=>statuses.get(r.slug)==="in-progress")||roadmapCatalog.find(r=>statuses.get(r.slug)==="available");
 const activeUnit=active?active.units.find(u=>!((progress.quizScores[u.id]||0)>=70&&progress.solved[u.id])):null;
 const top=useMemo(()=>[...roadmapCatalog].sort((a,b)=>(mastery.scores[b.slug]||0)-(mastery.scores[a.slug]||0)).slice(0,6),[mastery]);
 const recent=useMemo(()=>events.slice(0,5),[events]);
 const topicName=(slug:string)=>{const r=roadmapCatalog.find(x=>x.slug===slug);return r?(lang==="uz"?r.titleUz:r.titleEn):slug};
 return <>
  <div className="page-head"><div><p className="eyebrow" style={{color:"#637068"}}>{lang==="uz"?"Bugungi reja":"Today's plan"}</p><h1 className="page-title">{lang==="uz"?"O‘sish paneli":"Growth dashboard"}</h1></div><span className="tag">ELO {duelRating}</span></div>
  {status==="loading"?<div className="notice" role="status">{lang==="uz"?"Progress yuklanmoqda…":"Loading progress…"}</div>:null}
  {status==="unavailable"?<div className="notice error" role="alert">{error}</div>:null}
  <div className="dash-grid">
   <div className="panel dash-continue">{active?<><p className="eyebrow" style={{color:"#637068"}}>{lang==="uz"?"Davom ettirish":"Continue learning"}</p>
     <div className="rm-active"><span className="rm-node-ic" style={{background:active.color}}>{active.icon}</span><div><b>{lang==="uz"?active.titleUz:active.titleEn}</b><span className="muted">{lang==="uz"?"Keyingi":"Next"}: {activeUnit?(lang==="uz"?activeUnit.titleUz:activeUnit.titleEn):"—"}</span><span className="muted">{lang==="uz"?"Mahorat":"Mastery"}: {mastery.scores[active.slug]||0}/1000 · {statusLabel(statuses.get(active.slug)||"available",lang)}</span></div>
     <button className="primary" onClick={()=>openRoadmap(active.slug)}>{lang==="uz"?"Davom ettirish":"Continue"} →</button></div></>:<p className="muted">—</p>}</div>
   <div className="panel dash-duel"><p className="eyebrow" style={{color:"#637068"}}>DUEL</p><div className="dash-duel-body"><b className="mono dash-elo">{duelRating}</b><span className="muted">{lang==="uz"?"Global reyting":"Global rating"}</span><span className="muted">{duelSettings.problemCount} {lang==="uz"?"masala":"problems"} · {Math.round(duelSettings.durationSeconds/60)} {lang==="uz"?"daqiqa":"min"}</span><button className="primary" disabled={!duelSettings.enabled} onClick={()=>go("duel")}>{duelSettings.enabled?(lang==="uz"?"Raqib topish":"Find opponent"):(lang==="uz"?"Duel hozircha yopiq":"Duels unavailable")}</button></div></div>
  </div>
  <div className="dash-grid" style={{marginTop:14}}>
   <div className="panel"><p className="eyebrow" style={{color:"#637068"}}>{lang==="uz"?"Mavzu mahorati":"Topic mastery"}</p><div className="pl-bars" style={{border:0,padding:0,background:"none"}}>{top.map(r=>{const s=mastery.scores[r.slug]||0;return <div key={r.slug} className="pl-bar"><span className="pl-bar-name">{lang==="uz"?r.titleUz:r.titleEn}</span><div className="progress"><span style={{width:`${s/10}%`}}/></div><b className="mono">{s}</b><small className="muted">{masteryLabel(s,lang,masteryConfig)}</small></div>})}</div></div>
   <div className="panel"><p className="eyebrow" style={{color:"#637068"}}>{lang==="uz"?"So‘nggi faoliyat":"Recent activity"}</p><div className="dash-feed">{recent.length?recent.map((e,i)=><div key={i} className="feed-item me"><span className="feed-time">{e.source.toUpperCase()}</span><span>{topicName(e.topic)} <b className="mono" style={{color:"var(--lime)"}}>+{e.delta}</b></span></div>):<span className="muted">{lang==="uz"?"Hali faoliyat yo‘q — birinchi darsni boshlang.":"No activity yet — start your first lesson."}</span>}</div>
    <p className="eyebrow" style={{color:"#637068",marginTop:22}}>{lang==="uz"?"Keyingi qadam":"Suggested next"}</p>
    {activeUnit&&active?<button className="rm-rec" onClick={()=>openRoadmap(active.slug)}><span className="rm-dot available"/><span><b>{lang==="uz"?activeUnit.titleUz:activeUnit.titleEn}</b><small className="muted">{lang==="uz"?active.titleUz:active.titleEn}</small></span><span>→</span></button>:null}
   </div>
  </div>
 </>;
}
