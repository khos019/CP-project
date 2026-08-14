"use client";

/* Own-submission journal. Privacy rule (#37): a user only ever sees their OWN code here.
   Entries are written locally after each judge verdict and synced to Supabase `submissions`
   only for the signed-in user when a connection exists — RLS there already restricts rows
   to user_id = auth.uid(), so no other user's source is ever readable. */
export type OwnSubmission={id:string;problemKey:string;problemCode:string;titleUz:string;titleEn:string;language:"cpp20"|"python3";verdict:string;runtimeMs?:number;memoryKb?:number;source:string;at:number;context:"practice"|"duel"|"placement"|"challenge"};

const KEY="algoyol-submissions";

export function loadSubmissions():OwnSubmission[]{
 if(typeof window==="undefined")return[];
 try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return[]}
}
export function recordSubmission(entry:Omit<OwnSubmission,"id"|"at">):OwnSubmission{
 const row:OwnSubmission={...entry,id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,at:Date.now()};
 if(typeof window!=="undefined"){
  const list=loadSubmissions();
  list.push(row);
  localStorage.setItem(KEY,JSON.stringify(list.slice(-300)));
  window.dispatchEvent(new Event("algoyol-progress"));
 }
 return row;
}
export type ProblemStatus="solved"|"attempted"|"unsolved";
export function problemStatus(problemKey:string,extraSolvedId?:string):ProblemStatus{
 const list=loadSubmissions().filter(s=>s.problemKey===problemKey);
 if(list.some(s=>s.verdict==="ACCEPTED"))return "solved";
 if(list.length)return "attempted";
 if(extraSolvedId){
  try{
   const mastery=JSON.parse(localStorage.getItem("algoyol-mastery")||"{}") as {evidence?:Record<string,number>};
   if(mastery.evidence&&mastery.evidence[`problem:${extraSolvedId}`]!==undefined)return "solved";
  }catch{}
 }
 return "unsolved";
}
export const verdictTone=(verdict:string)=>verdict==="ACCEPTED"?"ok":verdict==="JUDGE_ERROR"?"warn":"bad";
