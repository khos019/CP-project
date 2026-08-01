import test from "node:test";
import assert from "node:assert/strict";

const base=process.env.TEST_BASE_URL||"http://localhost:3001";

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
