import { NextResponse } from "next/server";

const languageIds={cpp20:54,python3:71} as const;
// moved to ./tests so the browser bundle never carries expected outputs
import { tests } from "./tests";

type Result={token:string;status?:{id:number;description:string};time?:string;memory?:number;stdout?:string|null;stderr?:string|null;compile_output?:string|null;message?:string|null};
type Submission={language_id:number;source_code:string;stdin:string;expected_output?:string;cpu_time_limit:number;wall_time_limit:number;memory_limit:number;max_file_size:number};
const sleep=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));

async function execute(url:string,headers:Record<string,string>,submissions:Submission[]){
  const created=await fetch(`${url}/submissions/batch?base64_encoded=false`,{method:"POST",headers,body:JSON.stringify({submissions})});
  if(!created.ok) throw new Error(`Judge0 returned ${created.status}`);
  const tokens=(await created.json() as Array<{token?:string}>).map(x=>x.token).filter(Boolean) as string[];
  if(tokens.length!==submissions.length) throw new Error("Judge did not accept every test.");
  for(let attempt=0;attempt<60;attempt++){
    await sleep(attempt===0?250:500);
    const checked=await fetch(`${url}/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=false&fields=token,status,time,memory,stdout,stderr,compile_output,message`,{headers});
    if(!checked.ok) continue;
    const results=((await checked.json()) as {submissions:Result[]}).submissions||[];
    if(results.length===tokens.length&&results.every(r=>(r.status?.id||0)>2)) return results;
  }
  throw new Error("Judging timed out before a verdict was available.");
}

function verdictFor(result:Result){const id=result.status?.id||0;return id===3?"ACCEPTED":id===4?"WRONG_ANSWER":id===5?"TIME_LIMIT_EXCEEDED":id===6?"COMPILATION_ERROR":id>=7&&id<=12?"RUNTIME_ERROR":String(result.status?.description||"").toLowerCase().includes("memory")?"MEMORY_LIMIT_EXCEEDED":"JUDGE_ERROR"}

export async function POST(request:Request){
  const body=await request.json() as {problemId?:keyof typeof tests;language:keyof typeof languageIds;sourceCode:string;mode?:"judge"|"run";stdin?:string};
  const url0=(process.env.JUDGE0_URL||"https://ce.judge0.com").replace(/\/$/,"");
  const headers0:Record<string,string>={"content-type":"application/json"};
  if(process.env.JUDGE0_API_KEY){if(process.env.JUDGE0_API_HOST){headers0["X-RapidAPI-Key"]=process.env.JUDGE0_API_KEY;headers0["X-RapidAPI-Host"]=process.env.JUDGE0_API_HOST}else headers0["X-Auth-Token"]=process.env.JUDGE0_API_KEY}

  // Playground mode: run the given source against the user's own stdin and
  // hand back whatever it printed. No expected output, so no verdict — this is
  // a compiler, not a judge, and it must never touch the hidden tests.
  if(body.mode==="run"){
    if(!body.language||!languageIds[body.language]||!body.sourceCode?.trim())
      return NextResponse.json({error:"Invalid submission"},{status:400});
    try{
      const result=(await execute(url0,headers0,[{language_id:languageIds[body.language],source_code:body.sourceCode,
        stdin:body.stdin||"",cpu_time_limit:5,wall_time_limit:10,memory_limit:262144,max_file_size:1024}]))[0];
      return NextResponse.json({
        stdout:result.stdout||"",
        stderr:result.stderr||result.compile_output||result.message||"",
        status:result.status?.id===3?"OK":(result.status?.description||""),
        runtimeMs:Math.ceil(Number(result.time||0)*1000),
        memoryKb:result.memory||0,
      });
    }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Judge service unavailable"},{status:502})}
  }

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
