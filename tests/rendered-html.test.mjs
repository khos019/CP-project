import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const base=process.env.TEST_BASE_URL||"http://localhost:3000";

test("server-renders the AlgoYo‘l Uzbek product shell",async()=>{
  const response=await fetch(base);
  assert.equal(response.status,200);
  const html=await response.text();
  assert.match(html,/AlgoYo‘l/);
  assert.match(html,/Algoritmlarni/);
  assert.match(html,/Yo‘l xaritalari/);
  assert.match(html,/Masalalar/);
  assert.match(html,/Duel/);
  assert.doesNotMatch(html,/codex-preview/);
});

test("judge endpoint validates input and returns a real verdict",async()=>{
  const invalid=await fetch(`${base}/api/judge`,{method:"POST",headers:{"content-type":"application/json"},body:"{}"});
  assert.equal(invalid.status,400);
  const valid=await fetch(`${base}/api/judge`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({language:"cpp20",sourceCode:"int main(){}"})});
  assert.equal(valid.status,200);
  const result=await valid.json();
  assert.ok(result.verdict);
  assert.notEqual(result.demo,true);
});

test("social card and bilingual content are present",async()=>{
  const [page,image]=await Promise.all([fetch(base),fetch(`${base}/og.png`)]);
  const html=await page.text();
  assert.match(html,/og:image/);
  assert.equal(image.status,200);
  assert.match(image.headers.get("content-type")||"",/image\/png/);
});

test("mastery catalog and strict unit completion hold",async()=>{
  const [data,experience]=await Promise.all([
    readFile(new URL("../app/ui/roadmap-data.ts",import.meta.url),"utf8"),
    readFile(new URL("../app/ui/RoadmapExperience.tsx",import.meta.url),"utf8"),
  ]);
  const roadmapDefinitions=data.match(/^ \{slug:"[a-z-]+"/gm)||[];
  assert.equal(roadmapDefinitions.length,15);
  assert.match(experience,/quizScores\[u\.id\].*>=70&&progress\.solved\[u\.id\]/);
  assert.match(experience,/algoyol-active-lesson/);
});

test("no screen fabricates a signed-out identity",async()=>{
  const [app,profile]=await Promise.all([
    readFile(new URL("../app/ui/AlgoYolApp.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/ui/ProfilePage.tsx",import.meta.url),"utf8"),
  ]);
  // The old profile and leaderboard invented a learner ("@algoyolchi", 1462
  // Elo, 27 AC) that every visitor saw, signed in or not.
  for(const source of [app,profile]){
    assert.doesNotMatch(source,/@algoyolchi/);
    assert.doesNotMatch(source,/1462/);
  }
  // The profile screen must never render without a real account behind it.
  assert.match(app,/view==="profile"&&\(auth\.status==="loading"/);
  assert.match(app,/SignInRequired/);
});

test("learner storage is namespaced by account",async()=>{
  const [session,mastery,progress]=await Promise.all([
    readFile(new URL("../app/ui/session.ts",import.meta.url),"utf8"),
    readFile(new URL("../app/ui/mastery.ts",import.meta.url),"utf8"),
    readFile(new URL("../app/ui/progress.ts",import.meta.url),"utf8"),
  ]);
  assert.match(session,/scopedKey\s*=\s*\(base: string\)\s*=>\s*`algoyol:\$\{scope\}:\$\{base\}`/);
  // Signing out must drop the account namespace, not just the token.
  assert.match(session,/export function dropScopeData/);
  // Neither store may reach localStorage directly any more.
  for(const source of [mastery,progress]){
    assert.doesNotMatch(source,/localStorage\.(get|set|remove)Item/);
  }
});

test("the OAuth return is captured before the URL is rewritten",async()=>{
  const app=await readFile(new URL("../app/ui/AlgoYolApp.tsx",import.meta.url),"utf8");
  // Google hands the session back as #access_token=... The history effect calls
  // replaceState to put the canonical path in the address bar, which drops the
  // fragment -- so reading it from an effect makes the whole sign-in depend on
  // which effect happens to be declared first. It must be read during render.
  assert.match(app,/const authReturn=useRef<AuthReturn>\(readAuthReturn\(\)\)/);
  // and nowhere else: exactly one place touches location.hash
  const hashReads=app.match(/location\.hash/g)||[];
  assert.equal(hashReads.length,1);
  // the effect consumes the captured value rather than re-reading the URL
  assert.match(app,/const ret=authReturn\.current/);
});
