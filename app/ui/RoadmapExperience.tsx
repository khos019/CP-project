"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { tr } from "./i18n";
import { roadmapCatalog, type MasteryRoadmap } from "./roadmap-data";
import { unitContent } from "./roadmap-content";
import { DiagramFromSpec } from "./diagram-kit";
import { CodeBlock } from "./CodeBlock";
import { LessonToc, LessonNav } from "./LessonToc";
import { specForUnit } from "./unit-diagrams";
import { bankProblems } from "./problem-bank";
import { ratingColor } from "./rating";
import { unitCode } from "./unit-code";
import { deepContent } from "./dp-deep-content";
import { emptyProgress as empty, loadProgress, saveUnit, type Progress } from "./progress";
import { clearedUnits, masteryOf, masteryLabel, recordEvidence, MASTERY_CONFIG } from "./mastery";
import { writeScoped } from "./session";
import { can } from "./permissions";
import type { Role } from "./AlgoYolApp";

type Lang="uz"|"en";

export function RoadmapExperience({slug,lang,role,unitId,onOpenUnit,onBack,onPractice,onOpenProblem}:{slug:string;lang:Lang;role:Role;unitId:string|null;onOpenUnit:(id:string)=>void;onBack:()=>void;onPractice:(lessonId:string)=>void;onOpenProblem?:(id:string)=>void}){
 const roadmap=roadmapCatalog.find(r=>r.slug===slug)||roadmapCatalog[0];
 const [progress,setProgress]=useState<Progress>(empty);
 /* Units the placement test says this learner is already past. Read from
    storage in the effect below rather than during render — same reason as
    progress: a render must not depend on what localStorage happens to say. */
 const [cleared,setCleared]=useState(0);
 /* Which unit the learner has tapped open. A node on the path is a question
    before it is a destination — "what is in this one, and why can I not open
    it yet" — and answering that in a panel beside the path keeps them on the
    map instead of bouncing into a lesson to find out. */
 const [peek,setPeek]=useState<string|null>(null);
 useEffect(()=>{let live=true;const sync=()=>{loadProgress().then(p=>{if(!live)return;setProgress(p);setCleared(clearedUnits(slug))})};sync();window.addEventListener("algoyol-progress",sync);return()=>{live=false;window.removeEventListener("algoyol-progress",sync)}},[slug]);
 const canReviewAll=can(role,"roadmap.manage");

 const completed=useMemo(()=>roadmap.units.filter(u=>(progress.quizScores[u.id]||0)>=70&&progress.solved[u.id]).length,[progress,roadmap]);
 const isOpen=(index:number)=>canReviewAll||index===0||index<=cleared||roadmap.units.slice(0,index).every(u=>(progress.quizScores[u.id]||0)>=70&&progress.solved[u.id]);
 const firstOpen=roadmap.units.findIndex((_,i)=>isOpen(i)&&!(((progress.quizScores[roadmap.units[i].id]||0)>=70)&&progress.solved[roadmap.units[i].id]));
 const unit=roadmap.units.find(u=>u.id===unitId),unitIndex=unit?roadmap.units.indexOf(unit):-1;
 // A locked id — a stale history entry, say — just falls through to the path.
 if(unit&&isOpen(unitIndex))return <Lesson roadmap={roadmap} unit={unit} index={unitIndex} lang={lang} progress={progress} setProgress={setProgress} onBack={onBack} onPractice={onPractice} onOpenProblem={onOpenProblem} onOpenUnit={onOpenUnit} isOpen={isOpen}/>;
 return <div className="mastery-page"><button className="crumb" onClick={onBack}>← {tr(lang,"chrome.yol_xaritalari")}</button><section className="mastery-hero"><div><span className="road-icon" style={{background:roadmap.color}}>{roadmap.icon}</span><p className="eyebrow">{roadmap.level} · {roadmap.units.reduce((n,u)=>n+u.minutes,0)} min</p><h1>{lang==="uz"?roadmap.titleUz:roadmap.titleEn}</h1><p>{lang==="uz"?roadmap.descriptionUz:roadmap.descriptionEn}</p></div>{canReviewAll&&<div className="notice">{tr(lang,"roadmapExperience.owner_rejimi_barcha_bosqichlar_tekshirish")}</div>}{firstOpen>=0&&<button className="primary continue-btn" onClick={()=>onOpenUnit(roadmap.units[firstOpen].id)}>{lang==="uz"?(completed?"Davom ettirish":"Boshlash"):(completed?"Continue":"Start")} · {lang==="uz"?roadmap.units[firstOpen].titleUz:roadmap.units[firstOpen].titleEn}</button>}<div className="mastery-score"><b>{Math.round(completed/roadmap.units.length*100)}%</b><span>{tr(lang,"roadmapExperience.ozlashtirildi")}</span><div className="progress"><span style={{width:`${completed/roadmap.units.length*100}%`}}/></div><small>{completed}/{roadmap.units.length} {tr(lang,"roadmapExperience.bosqich")}</small><small className="mono mastery-line">{tr(lang,"roadmapExperience.mahorat")} {masteryOf(roadmap.slug)}/1000 · {masteryLabel(masteryOf(roadmap.slug),lang)}</small></div></section><div className="mastery-layout"><aside className="mastery-info panel"><h3>{tr(lang,"roadmapExperience.yol_haqida")}</h3><p className="muted">{tr(lang,"roadmapExperience.talab")}</p><b>{lang==="uz"?roadmap.prerequisiteUz:roadmap.prerequisiteEn}</b><p className="muted">{tr(lang,"roadmapExperience.tugatish_sharti")}</p><b>Quiz ≥ 70% + Accepted</b><p className="muted">{tr(lang,"roadmapExperience.qolgan_vaqt")}</p><b>{roadmap.units.slice(completed).reduce((n,u)=>n+u.minutes,0)} min</b></aside><section className="cloud-path">{roadmap.units.map((u,index)=>{const stageSize=5,stageNo=Math.floor(index/stageSize)+1,startsStage=index%stageSize===0;const stageUnits=roadmap.units.slice((stageNo-1)*stageSize,stageNo*stageSize);const stageDone=stageUnits.filter(x=>(progress.quizScores[x.id]||0)>=70&&progress.solved[x.id]).length;const open=isOpen(index),quiz=progress.quizScores[u.id]||0,solved=!!progress.solved[u.id],done=quiz>=70&&solved,placed=!done&&index<cleared,started=quiz>0||solved,side=index%2?"right":"left";const state=done?"done":placed?"placed":!open?"locked":started?"learning":index===firstOpen?"current":"available";const icon=done?"✓":state==="placed"?"⤻":state==="locked"?"✕":state==="learning"?"◔":state==="current"?"▶":"○";const label=lang==="uz"?(done?"Tugatildi":state==="placed"?"Bilasiz":state==="locked"?"Qulflangan":state==="learning"?"Jarayonda":state==="current"?"Hozirgi":"Ochiq"):(done?"Completed":state==="placed"?"Known":state==="locked"?"Locked":state==="learning"?"In progress":state==="current"?"Current":"Available");const frac=(quiz>=70?0.5:0)+(solved?0.5:0),R=19,CIRC=2*Math.PI*R;const prereq=index>0?(lang==="uz"?roadmap.units[index-1].titleUz:roadmap.units[index-1].titleEn):null;return <div key={u.id} className="cloud-slot">{startsStage&&<div className="stage-head"><span className="stage-no">{tr(lang,"roadmapExperience.bosqich_2")} {stageNo}</span><span className="stage-bar"><i style={{width:`${stageDone/stageUnits.length*100}%`}}/></span><span className="stage-count mono">{stageDone}/{stageUnits.length}</span></div>}<div className={`cloud-step ${side} ${state}`}>{index>0&&<svg className="cloud-link" viewBox="0 0 300 92" preserveAspectRatio="none" aria-hidden="true"><path d={side==="right"?"M0,0 C0,58 300,34 300,92":"M300,0 C300,58 0,34 0,92"}/></svg>}<div className="cloud-wrap"><button className="cloud-unit" onClick={()=>setPeek(u.id)} aria-expanded={peek===u.id} aria-label={`${lang==="uz"?u.titleUz:u.titleEn} — ${label}`}><span className="cloud-puffs" aria-hidden="true"><i/><i/><i/><i/><i/></span><span className="cloud-node"><svg className="node-ring" viewBox="0 0 44 44" aria-hidden="true"><circle className="ring-bg" cx="22" cy="22" r={R}/><circle className="ring-fg" cx="22" cy="22" r={R} strokeDasharray={CIRC} strokeDashoffset={CIRC*(1-frac)}/></svg><i>{done?"✓":open?String(index+1).padStart(2,"0"):"●"}</i></span><span className="path-copy"><small>{u.rating} · {u.minutes} min</small><b>{lang==="uz"?u.titleUz:u.titleEn}</b><em>{lang==="uz"?u.summaryUz:u.summaryEn}</em><span className="unit-checks"><i className={quiz>=70?"ok":""}>Quiz {quiz||0}%</i><i className={solved?"ok":""}>Problem {solved?"AC":"—"}</i></span></span><span className={`unit-status ${state}`}><b aria-hidden="true">{icon}</b> {label}</span></button></div></div></div>})}</section></div>{peek&&<UnitPanel roadmap={roadmap} unitId={peek} lang={lang} progress={progress} isOpen={isOpen} onClose={()=>setPeek(null)} onOpenUnit={onOpenUnit}/>}</div>
}


/* The panel a path node opens.
 *
 * The path is a map, and a map you have to leave in order to read is a bad map.
 * Tapping a node answers the two questions worth asking from the map — what is
 * in this unit, and what still stands between me and it — without changing the
 * page, so a learner can look at three units in a row and keep their place.
 * Only the button inside it navigates.
 */
function UnitPanel({roadmap,unitId,lang,progress,isOpen,onClose,onOpenUnit}:{
 roadmap:MasteryRoadmap;unitId:string;lang:Lang;progress:Progress;
 isOpen:(i:number)=>boolean;onClose:()=>void;onOpenUnit:(id:string)=>void;
}){
 const index=roadmap.units.findIndex(u=>u.id===unitId);
 const unit=roadmap.units[index];
 const panelRef=useRef<HTMLDivElement|null>(null);
 useEffect(()=>{
  const esc=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose()};
  document.addEventListener("keydown",esc);
  /* Focus moves into the panel so the keyboard follows the eye, and so Escape
     is being pressed at something rather than into the page behind it. */
  panelRef.current?.focus();
  return()=>document.removeEventListener("keydown",esc);
 },[onClose]);
 if(!unit)return null;

 const open=isOpen(index),quiz=progress.quizScores[unit.id]||0,solved=!!progress.solved[unit.id];
 const done=quiz>=70&&solved;
 const blocker=index>0?roadmap.units[index-1]:null;
 const uz=lang==="uz";

 return <>
  <div className="drawer-backdrop" onClick={onClose} aria-hidden/>
  <aside className="drawer" role="dialog" aria-modal="true" tabIndex={-1} ref={panelRef}
   aria-label={uz?unit.titleUz:unit.titleEn}>
   <div className="drawer-top">
    <span className="drawer-step">{tr(lang,"drawer.stage_of",{n:index+1,total:roadmap.units.length})}</span>
    <button className="drawer-close" onClick={onClose} aria-label={uz?"Yopish":"Close"}>✕</button>
   </div>

   <h2>{uz?unit.titleUz:unit.titleEn}</h2>
   <p className="muted">{uz?unit.summaryUz:unit.summaryEn}</p>

   <dl className="drawer-facts">
    <div><dt>{uz?"Reyting":"Rating"}</dt><dd className="mono">{unit.rating}</dd></div>
    <div><dt>{uz?"Vaqt":"Time"}</dt><dd className="mono">{unit.minutes} min</dd></div>
    <div><dt>{uz?"Murakkablik":"Complexity"}</dt><dd className="mono">{unit.complexity}</dd></div>
   </dl>

   <div className="drawer-checks">
    <span className={quiz>=70?"ok":""}>
     <i aria-hidden>{quiz>=70?"✓":"○"}</i> Quiz {quiz}% / 70%
    </span>
    <span className={solved?"ok":""}>
     <i aria-hidden>{solved?"✓":"○"}</i> {uz?"Masala":"Problem"} {solved?"AC":"—"}
    </span>
   </div>

   {open
    ? <button className="primary drawer-go" onClick={()=>{onClose();onOpenUnit(unit.id)}}>
       {done?(uz?"Qayta ko‘rish":"Review"):quiz>0||solved?(uz?"Davom ettirish":"Continue"):(uz?"Bosqichni boshlash":"Start this stage")}
      </button>
    /* A locked node names the exact thing standing in the way, because
       "locked" on its own is the least useful thing a lock can say. */
    : <div className="drawer-locked">
       <b>{uz?"Bu bosqich hali yopiq":"This stage is still locked"}</b>
       <span>{blocker
        ? (uz?`Avval «${blocker.titleUz}» bosqichini tugating: testda 70% va masalada Accepted.`
             :`Finish “${blocker.titleEn}” first: 70% on the quiz and an Accepted verdict.`)
        : (uz?"Oldingi yo‘nalishni tugating.":"Finish the previous track first.")}</span>
      </div>}
  </aside>
 </>;
}

function Lesson({roadmap,unit,index,lang,progress,setProgress,onBack,onPractice,onOpenProblem,onOpenUnit,isOpen}:{roadmap:MasteryRoadmap;unit:MasteryRoadmap["units"][number];index:number;lang:Lang;progress:Progress;setProgress:(p:Progress)=>void;onBack:()=>void;onPractice:(id:string)=>void;onOpenProblem?:(id:string)=>void;onOpenUnit?:(id:string)=>void;isOpen?:(i:number)=>boolean}){
 const [codeLang,setCodeLang]=useState<"cpp"|"python">("cpp"),[answer,setAnswer]=useState<number|null>(null),[result,setResult]=useState(""),[checked,setChecked]=useState(false);
 const content=unitContent[unit.id],quiz=content.quiz,code=unitCode[unit.id]||{cpp:unit.cpp,python:unit.python};
 // Problems tagged to this roadmap, easiest first — the USACO-style practice
 // table that turns a lesson into something you can immediately act on.
 // Clearing the quiz when the learner opens a different unit — a reset keyed
 // to a prop change, which is what this rule exists to allow.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{setChecked(false);setAnswer(null);setResult("")},[unit.id]);
 const unitSpec=specForUnit(unit.titleUz,roadmap.slug);
 const prevUnit=index>0?roadmap.units[index-1]:null;
 const nextUnit=index<roadmap.units.length-1?roadmap.units[index+1]:null;
 // This unit's own problem first, then the rest of the roadmap by rating, so
 // each unit leads somewhere different instead of showing one shared list.
 const own=bankProblems.filter(p=>p.judge===unit.problemId||p.id===unit.problemId);
 const rest=bankProblems.filter(p=>p.topic===roadmap.slug&&!own.includes(p)).sort((a,b)=>a.rating-b.rating);
 const practice=[...own,...rest].slice(0,8);
 const saveQuiz=()=>{if(answer===null)return;setChecked(true);const score=answer===quiz.correct?100:0;saveUnit(progress,unit.id,{quizScore:score}).then(setProgress);
  if(score>=70){const gain=recordEvidence(roadmap.slug,"quiz",`quiz:${unit.id}`,MASTERY_CONFIG.weights.quiz);setResult(lang==="uz"?`To‘g‘ri — quizdan o‘tdingiz! +${gain.delta} mahorat`:`Correct — quiz passed! +${gain.delta} mastery`)}
  else setResult(tr(lang,"roadmapExperience.notogri_nazariyani_qayta_korib_chiqing"))};
 // Left/right move between units, but not while typing in the editor or a
 // quiz field, where the arrows belong to the caret.
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{
  const t=e.target as HTMLElement|null;
  if(e.metaKey||e.ctrlKey||e.altKey)return;
  if(t&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))return;
  if(t&&t.isContentEditable)return;
  if(e.key==="ArrowLeft"&&prevUnit&&onOpenUnit)onOpenUnit(prevUnit.id);
  if(e.key==="ArrowRight"&&nextUnit&&onOpenUnit&&(isOpen?isOpen(index+1):false))onOpenUnit(nextUnit.id);
 };window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[prevUnit,nextUnit,onOpenUnit,isOpen,index]);
 const solved=!!progress.solved[unit.id],passed=(progress.quizScores[unit.id]||0)>=70;
 return <div className="lesson-page"><button className="crumb" onClick={onBack}>← {lang==="uz"?roadmap.titleUz:roadmap.titleEn}</button><div className="lesson-head"><div><p className="eyebrow">{tr(lang,"roadmapExperience.bosqich_3")} {index+1}/{roadmap.units.length} · {unit.rating}</p><h1>{lang==="uz"?unit.titleUz:unit.titleEn}</h1><p className="muted">{lang==="uz"?unit.summaryUz:unit.summaryEn}</p></div><div className="lesson-state"><span className={passed?"passed":""}>Quiz {progress.quizScores[unit.id]||0}%</span><span className={solved?"passed":""}>Problem {solved?"AC":"—"}</span></div></div><div className="lesson-grid"><article className="lesson-content panel">
  <h2>{tr(lang,"roadmapExperience.maqsad")}</h2><p>{lang==="uz"?content.goalUz:content.goalEn}</p><p>{lang==="uz"?content.intuitionUz:content.intuitionEn}</p><div className="concept-box"><b>{tr(lang,"roadmapExperience.murakkablik")}</b><code>{unit.complexity}</code></div>
  <h2>{tr(lang,"roadmapExperience.asosiy_tushuncha")}</h2><p>{lang==="uz"?content.coreUz:content.coreEn}</p>
  {unitSpec&&<DiagramFromSpec spec={unitSpec}/>}<h2>{tr(lang,"roadmapExperience.kod_namunasi")}</h2><div className="code-tabs"><button className={codeLang==="cpp"?"active":""} onClick={()=>setCodeLang("cpp")}>C++20</button><button className={codeLang==="python"?"active":""} onClick={()=>setCodeLang("python")}>Python 3</button></div><CodeBlock code={codeLang==="cpp"?code.cpp:code.python} lang={codeLang}/>
  <h2>{tr(lang,"roadmapExperience.bosqichma_bosqich")}</h2><p>{lang==="uz"?content.walkUz:content.walkEn}</p>
  <h2>{tr(lang,"roadmapExperience.keng_tarqalgan_xatolar")}</h2><ul className="lesson-list">{(lang==="uz"?content.mistakesUz:content.mistakesEn).map(m=><li key={m}>{m}</li>)}</ul>
  <h2>{tr(lang,"roadmapExperience.naqsh_va_maslahatlar")}</h2><p>{lang==="uz"?content.patternUz:content.patternEn}</p><ul className="lesson-list">{(lang==="uz"?content.hintsUz:content.hintsEn).map(h=><li key={h}>{h}</li>)}</ul>
  <h2>{tr(lang,"roadmapExperience.xulosa")}</h2><p>{lang==="uz"?content.recapUz:content.recapEn}</p><p className="muted">{lang==="uz"?content.nextUz:content.nextEn}</p>
  {deepContent[unit.id]&&<><h2>{tr(lang,"roadmapExperience.chuqur_mavzular")}</h2><div className="deep-list">{deepContent[unit.id].subLessons.map((s,i)=><details key={s.titleEn} className="deep-item"><summary><b>{i+1}.</b> {lang==="uz"?s.titleUz:s.titleEn}<span className="deep-min">{s.minutes} min</span></summary><p>{lang==="uz"?s.bodyUz:s.bodyEn}</p>{s.cpp&&<CodeBlock code={s.cpp} lang="cpp"/>}</details>)}</div></>}
 <h2>{tr(lang,"roadmapExperience.manbalar")}</h2><ul className="resource-list"><li><a href="https://cp-algorithms.com/" target="_blank" rel="noopener noreferrer">CP-Algorithms</a><span>{tr(lang,"roadmapExperience.algoritm_nazariyasi_va_isbotlar")}</span></li><li><a href="https://usaco.guide/" target="_blank" rel="noopener noreferrer">USACO Guide</a><span>{tr(lang,"roadmapExperience.organish_tartibi_va_qoshimcha_mashqlar")}</span></li><li><a href="https://cses.fi/problemset/" target="_blank" rel="noopener noreferrer">CSES Problem Set</a><span>{tr(lang,"roadmapExperience.mavzu_boyicha_tasniflangan_masalalar")}</span></li></ul><h2>{tr(lang,"roadmapExperience.shu_mavzudagi_masalalar")}</h2>{practice.length?<table className="practice-table"><thead><tr><th>{tr(lang,"algoYolApp.reyting_2")}</th><th>{tr(lang,"algoYolApp.masala")}</th><th>{tr(lang,"roadmapExperience.mavzu")}</th></tr></thead><tbody>{practice.map(p=><tr key={p.id}><td className="mono" style={{color:ratingColor(p.rating)}}>{p.rating}</td><td><button className="link-cell rated" style={{color:ratingColor(p.rating)}} onClick={()=>onOpenProblem&&onOpenProblem(p.id)}>{lang==="uz"?p.uz:p.en}</button>{p.judge===unit.problemId&&<span className="focus-badge">{tr(lang,"roadmapExperience.asosiy")}</span>}</td><td className="muted">{p.tag}</td></tr>)}</tbody></table>:<p className="muted">{tr(lang,"roadmapExperience.bu_mavzu_uchun_masalalar_hali_qoshilmagan")}</p>}<LessonNav lang={lang} prev={prevUnit?{id:prevUnit.id,title:lang==="uz"?prevUnit.titleUz:prevUnit.titleEn}:null} next={nextUnit?{id:nextUnit.id,title:lang==="uz"?nextUnit.titleUz:nextUnit.titleEn,locked:!(isOpen?isOpen(index+1):false)}:null} onOpen={id=>onOpenUnit&&onOpenUnit(id)}/></article><aside className="lesson-actions"><LessonToc lang={lang} unitId={unit.id}/><div className="quiz-card panel"><h3>{tr(lang,"roadmapExperience.bilimni_tekshiring")}</h3><p>{lang==="uz"?quiz.questionUz:quiz.questionEn}</p><div className="quiz-options">{(lang==="uz"?quiz.choicesUz:quiz.choicesEn).map((choice,i)=><button key={choice} className={`${answer===i?"selected":""} ${checked&&i===quiz.correct?"right":""} ${checked&&answer===i&&i!==quiz.correct?"wrong":""}`} disabled={checked} onClick={()=>setAnswer(i)}><span>{String.fromCharCode(65+i)}</span>{choice}</button>)}</div>{checked?<button className="secondary" onClick={()=>{setChecked(false);setAnswer(null);setResult("")}}>{tr(lang,"roadmapExperience.qayta_urinish")}</button>:<button className="primary" disabled={answer===null} onClick={saveQuiz}>{tr(lang,"roadmapExperience.javobni_tekshirish")}</button>}{result&&<div className="quiz-result">{result}</div>}</div><div className="practice-card panel"><h3>{tr(lang,"roadmapExperience.amaliy_masala")}</h3><p className="muted">{unit.problemId} · {tr(lang,"roadmapExperience.tekshiruvchida_accepted_olish_shart")}</p><button className="primary" onClick={()=>{writeScoped("algoyol-active-lesson",unit.id);onPractice(unit.id)}}>{solved?(tr(lang,"roadmapExperience.qayta_yechish")):(tr(lang,"roadmapExperience.masalani_yechish"))}</button></div><div className={`unlock-card ${passed&&solved?"ready":""}`}><b>{passed&&solved?(tr(lang,"roadmapExperience.keyingi_bosqich_ochildi")):(tr(lang,"roadmapExperience.keyingi_bosqich_qulflangan"))}</b><small>{tr(lang,"roadmapExperience.quiz_70_va_masalada_ac_kerak")}</small></div></aside></div></div>
}
