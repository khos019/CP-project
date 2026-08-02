import { NextResponse } from "next/server";

const languageIds={cpp20:54,python3:71} as const;
const tests={
  "sum-two":[{stdin:"12 30\n",expected_output:"42\n"},{stdin:"-5 2\n",expected_output:"-3\n"},{stdin:"0 0\n",expected_output:"0\n"},{stdin:"1000000000 1000000000\n",expected_output:"2000000000\n"},{stdin:"-1000000000 999999999\n",expected_output:"-1\n"}],
  // Duel stage 2 — maximum contiguous subarray sum.
  "max-subarray":[{stdin:"9\n-2 1 -3 4 -1 2 1 -5 4\n",expected_output:"6\n"},{stdin:"1\n-7\n",expected_output:"-7\n"},{stdin:"5\n1 2 3 4 5\n",expected_output:"15\n"},{stdin:"4\n-1 -2 -3 -4\n",expected_output:"-1\n"},{stdin:"6\n5 -9 6 -2 3 -1\n",expected_output:"7\n"}],
  // Duel stage 3 — minimum number of coins for an exact target.
  "coin-change":[{stdin:"3 11\n1 2 5\n",expected_output:"3\n"},{stdin:"1 3\n2\n",expected_output:"-1\n"},{stdin:"4 0\n1 2 5 10\n",expected_output:"0\n"},{stdin:"2 27\n4 7\n",expected_output:"6\n"},{stdin:"5 63\n1 5 12 19 25\n",expected_output:"3\n"}],
} as const;
type Result={token:string;status?:{id:number;description:string};time?:string;memory?:number;stderr?:string|null;compile_output?:string|null;message?:string|null};
type Submission={language_id:number;source_code:string;stdin:string;expected_output:string;cpu_time_limit:number;wall_time_limit:number;memory_limit:number;max_file_size:number};
const sleep=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));

async function execute(url:string,headers:Record<string,string>,submissions:Submission[]){
  const created=await fetch(`${url}/submissions/batch?base64_encoded=false`,{method:"POST",headers,body:JSON.stringify({submissions})});
  if(!created.ok) throw new Error(`Judge0 returned ${created.status}`);
  const tokens=(await created.json() as Array<{token?:string}>).map(x=>x.token).filter(Boolean) as string[];
  if(tokens.length!==submissions.length) throw new Error("Judge did not accept every test.");
  for(let attempt=0;attempt<60;attempt++){
    await sleep(attempt===0?250:500);
    const checked=await fetch(`${url}/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=false&fields=token,status,time,memory,stderr,compile_output,message`,{headers});
    if(!checked.ok) continue;
    const results=((await checked.json()) as {submissions:Result[]}).submissions||[];
    if(results.length===tokens.length&&results.every(r=>(r.status?.id||0)>2)) return results;
  }
  throw new Error("Judging timed out before a verdict was available.");
}

function verdictFor(result:Result){const id=result.status?.id||0;return id===3?"ACCEPTED":id===4?"WRONG_ANSWER":id===5?"TIME_LIMIT_EXCEEDED":id===6?"COMPILATION_ERROR":id>=7&&id<=12?"RUNTIME_ERROR":String(result.status?.description||"").toLowerCase().includes("memory")?"MEMORY_LIMIT_EXCEEDED":"JUDGE_ERROR"}

export async function POST(request:Request){
  const body=await request.json() as {problemId?:keyof typeof tests;language:keyof typeof languageIds;sourceCode:string};
  const problemId=body.problemId||"sum-two";
  if(!body.language||!languageIds[body.language]||!body.sourceCode?.trim()||!tests[problemId]) return NextResponse.json({error:"Invalid submission"},{status:400});
  const url=(process.env.JUDGE0_URL||"https://ce.judge0.com").replace(/\/$/,"");
  const headers:Record<string,string>={"content-type":"application/json"};
  if(process.env.JUDGE0_API_KEY){if(process.env.JUDGE0_API_HOST){headers["X-RapidAPI-Key"]=process.env.JUDGE0_API_KEY;headers["X-RapidAPI-Host"]=process.env.JUDGE0_API_HOST}else headers["X-Auth-Token"]=process.env.JUDGE0_API_KEY}
  const submissions=tests[problemId].map(test=>({language_id:languageIds[body.language],source_code:body.sourceCode,stdin:test.stdin,expected_output:test.expected_output,cpu_time_limit:1,wall_time_limit:3,memory_limit:262144,max_file_size:1024}));
  try{
    // Run one test first so compilation/runtime errors return promptly instead of queuing five identical failures.
    const first=(await execute(url,headers,[submissions[0]]))[0];
    if(first.status?.id!==3)return NextResponse.json({verdict:verdictFor(first),test:1,passed:0,total:submissions.length,runtimeMs:Math.ceil(Number(first.time||0)*1000),memoryKb:first.memory||0,details:first.compile_output||first.stderr||first.message||first.status?.description});
    const rest=await execute(url,headers,submissions.slice(1));
    const results=[first,...rest],failedIndex=results.findIndex(r=>r.status?.id!==3),runtimeMs=Math.ceil(Math.max(...results.map(r=>Number(r.time||0)))*1000),memoryKb=Math.max(...results.map(r=>r.memory||0));
    if(failedIndex===-1)return NextResponse.json({verdict:"ACCEPTED",passed:results.length,total:results.length,runtimeMs,memoryKb});
    const failed=results[failedIndex];return NextResponse.json({verdict:verdictFor(failed),test:failedIndex+1,passed:failedIndex,total:results.length,runtimeMs,memoryKb,details:failed.compile_output||failed.stderr||failed.message||failed.status?.description});
  }catch(error){return NextResponse.json({verdict:"JUDGE_ERROR",details:error instanceof Error?error.message:"Judge service unavailable"},{status:502})}
}
