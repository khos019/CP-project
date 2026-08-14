"use client";

export type MasterySource="lesson"|"quiz"|"problem"|"duel"|"placement"|"challenge";
export type MasteryStore={scores:Record<string,number>;evidence:Record<string,number>;unlocks:Record<string,boolean>;validated:Record<string,boolean>};
export type MasteryEvent={topic:string;source:MasterySource;sourceId:string;delta:number;at:number};
export type DuelHistoryEntry={matchId:number;opponent:string;opponentRating:number;outcome:"win"|"loss"|"draw";myScore:number;oppScore:number;ratingBefore:number;ratingAfter:number;delta:number;at:number};
export type MasteryConfig={unlock:number;complete:number;advanced:number;weights:{quiz:number;lesson:number;problem:{easy:number;medium:number;hard:number};duelMultiplier:number;placementQuestion:number;challenge:number}};

const KEY="algoyol-mastery";
const LOG="algoyol-mastery-log";
const CONFIG_KEY="algoyol-mastery-config";
const DUEL_HISTORY="algoyol-duel-history";
const BACKFILLED="algoyol-mastery-backfilled";
const empty:MasteryStore={scores:{},evidence:{},unlocks:{},validated:{}};

/* Default thresholds (0–1000 scale). Owner can override every value; overrides live in
   localStorage and mirror the platform_settings table when Supabase is connected. */
export const DEFAULT_MASTERY_CONFIG:MasteryConfig={
 unlock:450,
 complete:700,
 advanced:850,
 weights:{quiz:40,lesson:60,problem:{easy:20,medium:35,hard:50},duelMultiplier:1.5,placementQuestion:70,challenge:520},
};

export function loadMasteryConfig():MasteryConfig{
 if(typeof window==="undefined")return DEFAULT_MASTERY_CONFIG;
 try{
  const raw=localStorage.getItem(CONFIG_KEY);
  if(!raw)return DEFAULT_MASTERY_CONFIG;
  const o=JSON.parse(raw) as Partial<MasteryConfig>;
  return {
   unlock:o.unlock??DEFAULT_MASTERY_CONFIG.unlock,
   complete:o.complete??DEFAULT_MASTERY_CONFIG.complete,
   advanced:o.advanced??DEFAULT_MASTERY_CONFIG.advanced,
   weights:{...DEFAULT_MASTERY_CONFIG.weights,...(o.weights||{}),problem:{...DEFAULT_MASTERY_CONFIG.weights.problem,...((o.weights||{}).problem||{})}},
  };
 }catch{return DEFAULT_MASTERY_CONFIG}
}
export function saveMasteryConfig(next:MasteryConfig){
 if(typeof window==="undefined")return;
 localStorage.setItem(CONFIG_KEY,JSON.stringify(next));
 window.dispatchEvent(new Event("algoyol-progress"));
}
/* Back-compat: existing imports use MASTERY_CONFIG as a constant. */
export const MASTERY_CONFIG=DEFAULT_MASTERY_CONFIG;

export function loadMastery():MasteryStore{
 if(typeof window==="undefined")return empty;
 try{const raw=localStorage.getItem(KEY);if(!raw)return empty;const parsed=JSON.parse(raw) as MasteryStore;return {scores:parsed.scores||{},evidence:parsed.evidence||{},unlocks:parsed.unlocks||{},validated:parsed.validated||{}}}catch{return empty}
}
export function loadMasteryLog():MasteryEvent[]{
 if(typeof window==="undefined")return[];
 try{return JSON.parse(localStorage.getItem(LOG)||"[]")}catch{return[]}
}
const persist=(store:MasteryStore,event?:MasteryEvent)=>{
 localStorage.setItem(KEY,JSON.stringify(store));
 if(event){const log=loadMasteryLog();log.push(event);localStorage.setItem(LOG,JSON.stringify(log.slice(-400)))}
 window.dispatchEvent(new Event("algoyol-progress"));
};

/* Central evidence recorder. Repeated evidence from the same sourceId yields zero gain
   (anti-farming). Unlocks are persistent — a topic NEVER relocks once opened. */
export function recordEvidence(topic:string,source:MasterySource,sourceId:string,base:number):{delta:number;score:number;newlyUnlocked:boolean}{
 const config=loadMasteryConfig();
 const store=loadMastery();
 if(store.evidence[sourceId]!==undefined)return {delta:0,score:store.scores[topic]||0,newlyUnlocked:false};
 const prev=store.scores[topic]||0,next=Math.min(1000,Math.round(prev+base));
 store.evidence[sourceId]=base;store.scores[topic]=next;
 const wasOpen=!!store.unlocks[topic];
 if(next>=config.unlock)store.unlocks[topic]=true;
 if(next>=config.complete)store.validated[topic]=true;
 persist(store,{topic,source,sourceId,delta:next-prev,at:Date.now()});
 const newlyUnlocked=!wasOpen&&!!store.unlocks[topic];
 if(newlyUnlocked)window.dispatchEvent(new CustomEvent("algoyol-unlock",{detail:{topic,score:next,threshold:config.unlock}}));
 return {delta:next-prev,score:next,newlyUnlocked};
}

export const masteryOf=(topic:string)=>loadMastery().scores[topic]||0;
export const isMasteryUnlocked=(topic:string)=>!!loadMastery().unlocks[topic];
export const isMasteryValidated=(topic:string)=>!!loadMastery().validated[topic];
export function masteryLabel(score:number,lang:"uz"|"en"){
 const config=loadMasteryConfig();
 return score>=config.advanced?(lang==="uz"?"Ilg‘or mahorat":"Advanced mastery"):score>=config.complete?(lang==="uz"?"Kuchli":"Strong"):score>=600?(lang==="uz"?"Malakali":"Competent"):score>=400?(lang==="uz"?"Ish bilimi":"Working knowledge"):score>=200?(lang==="uz"?"Boshlang‘ich tanishuv":"Basic familiarity"):(lang==="uz"?"Boshlanmagan":"Not started");
}
export function seedPlacement(scores:Record<string,number>){
 const config=loadMasteryConfig();
 const store=loadMastery();
 Object.entries(scores).forEach(([topic,score])=>{
  const value=Math.min(1000,Math.max(0,Math.round(score)));
  if((store.scores[topic]||0)<value)store.scores[topic]=value;
  if(value>=config.unlock)store.unlocks[topic]=true;
  if(value>=config.complete)store.validated[topic]=true;
 });
 persist(store);
}

/* Challenge-out: passing a topic challenge raises mastery to at least the challenge target
   and marks the topic validated. Also persistent — never relocks. */
export function applyChallengePass(topic:string):{score:number}{
 const config=loadMasteryConfig();
 const store=loadMastery();
 const target=Math.max(config.unlock,config.weights.challenge);
 const prev=store.scores[topic]||0;
 if(prev<target)store.scores[topic]=target;
 store.unlocks[topic]=true;
 persist(store,{topic,source:"challenge",sourceId:`challenge:${topic}:${Date.now()}`,delta:store.scores[topic]-prev,at:Date.now()});
 return {score:store.scores[topic]};
}

/* Existing-users migration: derive initial mastery from evidence that predates the mastery
   system (completed roadmap units, passed quizzes, solved lesson problems). Insufficient
   evidence leaves a topic low — we never invent mastery. Runs exactly once per browser. */
export function backfillMastery(progress:{quizScores:Record<string,number>;solved:Record<string,boolean>}){
 if(typeof window==="undefined")return;
 if(localStorage.getItem(BACKFILLED))return;
 localStorage.setItem(BACKFILLED,"1");
 const store=loadMastery();
 if(Object.keys(store.scores).length>0)return; // mastery already in use — nothing to migrate
 const byTopic:Record<string,{quiz:number;solved:number}>={};
 Object.entries(progress.quizScores||{}).forEach(([unitId,score])=>{
  if(score<70)return;
  const topic=unitId.slice(0,unitId.lastIndexOf("-"));
  (byTopic[topic]=byTopic[topic]||{quiz:0,solved:0}).quiz++;
 });
 Object.entries(progress.solved||{}).forEach(([unitId,ok])=>{
  if(!ok)return;
  const topic=unitId.slice(0,unitId.lastIndexOf("-"));
  (byTopic[topic]=byTopic[topic]||{quiz:0,solved:0}).solved++;
 });
 const config=loadMasteryConfig();
 Object.entries(byTopic).forEach(([topic,n])=>{
  const evidence=Math.min(3,n.quiz)*config.weights.quiz+Math.min(3,n.solved)*config.weights.lesson;
  if(evidence<=0)return;
  const value=Math.min(1000,Math.round(evidence));
  store.scores[topic]=Math.max(store.scores[topic]||0,value);
  if(store.scores[topic]>=config.unlock)store.unlocks[topic]=true;
  if(store.scores[topic]>=config.complete)store.validated[topic]=true;
 });
 persist(store);
}

/* ---- Duel + rating history (profile evidence of growth) ---- */
export function loadDuelHistory():DuelHistoryEntry[]{
 if(typeof window==="undefined")return[];
 try{return JSON.parse(localStorage.getItem(DUEL_HISTORY)||"[]")}catch{return[]}
}
export function recordDuelResult(entry:Omit<DuelHistoryEntry,"at">){
 if(typeof window==="undefined")return;
 const list=loadDuelHistory();
 if(list.some(e=>e.matchId===entry.matchId))return;
 list.push({...entry,at:Date.now()});
 localStorage.setItem(DUEL_HISTORY,JSON.stringify(list.slice(-120)));
 window.dispatchEvent(new Event("algoyol-progress"));
}
