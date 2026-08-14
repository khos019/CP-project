import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";

const externalBase = process.env.TEST_BASE_URL;
const port = 3317;
const base = externalBase || `http://127.0.0.1:${port}`;
let server;

before(async () => {
  if (externalBase) return;
  server = spawn("npm", ["run", "start", "--", "--port", String(port), "--hostname", "127.0.0.1"], {
    env: { ...process.env },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let lastError;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(base);
      if (response.ok) return;
    } catch (error) { lastError = error; }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw lastError || new Error("Production test server did not start.");
});

after(() => { if (server && !server.killed) server.kill("SIGTERM"); });

test("server-renders the AlgoYo‘l product shell without fake activity", async () => {
  const response = await fetch(base);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  const html = await response.text();
  assert.match(html, /AlgoYo‘l/);
  assert.match(html, /Algoritmlarni/);
  assert.match(html, /Yo‘l xaritalari/);
  assert.match(html, /Masalalar/);
  assert.match(html, /Duel/);
  assert.doesNotMatch(html, /1,284|Hozir bellashmoqda|codex-preview/);
  assert.doesNotMatch(html, /вЂ|вњ|в—/);
});

test("protected API routes reject guests", async () => {
  const validSubmission = { problemId: "sum-two", language: "cpp20", sourceCode: "int main(){}", context: "practice", clientRequestId: crypto.randomUUID() };
  const [judge, session, duel, placement, submissions] = await Promise.all([
    fetch(`${base}/api/judge`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(validSubmission) }),
    fetch(`${base}/api/session`),
    fetch(`${base}/api/duels`, { method: "POST" }),
    fetch(`${base}/api/placement`),
    fetch(`${base}/api/submissions?scope=all`),
  ]);
  assert.equal(judge.status, 401);
  assert.equal(session.status, 401);
  assert.equal(duel.status, 401);
  assert.equal(placement.status, 401);
  assert.equal(submissions.status, 401);
});

test("judge rejects malformed input before contacting external services", async () => {
  const invalidJson = await fetch(`${base}/api/judge`, { method: "POST", headers: { "content-type": "application/json" }, body: "{" });
  const missingFields = await fetch(`${base}/api/judge`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  const wrongType = await fetch(`${base}/api/judge`, { method: "POST", headers: { "content-type": "text/plain" }, body: "{}" });
  assert.equal(invalidJson.status, 400);
  assert.equal(missingFields.status, 400);
  assert.equal(wrongType.status, 415);
});

test("social card and bilingual metadata are present", async () => {
  const [page, image] = await Promise.all([fetch(base), fetch(`${base}/og.png`)]);
  const html = await page.text();
  assert.match(html, /og:image/);
  assert.equal(image.status, 200);
  assert.match(image.headers.get("content-type") || "", /image\/png/);
});

test("roadmap cloud identity and strict completion rules remain", async () => {
  const [data, experience, hub, content, answerKey] = await Promise.all([
    readFile(new URL("../app/ui/roadmap-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/ui/RoadmapExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ui/RoadmapHub.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ui/roadmap-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/server/roadmap-answer-key.ts", import.meta.url), "utf8"),
  ]);
  assert.equal((data.match(/\{slug:"/g) || []).length, 15);
  assert.match(data, /units:d\.units\.map/);
  assert.match(experience, /quizScores\[unit\.id\].*>= 70 && progress\.solved\[unit\.id\]/);
  assert.match(hub, /rm-tree/);
  assert.doesNotMatch(data, /correct:number|correct:0/);
  assert.equal((content.match(/^"[^"]+":c\(/gm) || []).length, 90);
  assert.doesNotMatch(content, /correct\s*:/);
  assert.equal((answerKey.match(/^  "[^"]+": [0-9],/gm) || []).length, 90);
});

test("production migration enforces anti-farming, RBAC, and server-owned ratings", async () => {
  const migration = await readFile(new URL("../supabase/migrations/005_production_foundation.sql", import.meta.url), "utf8");
  assert.match(migration, /unique\(user_id, topic_slug, source, source_key\)/i);
  assert.match(migration, /revoke update on public\.profiles from (?:anon, )?authenticated/i);
  assert.match(migration, /grant update\(username, display_name, avatar_url, preferred_language\)/i);
  assert.match(migration, /grant execute on function public\.apply_mastery_evidence.*to service_role/i);
  assert.match(migration, /placement_already_completed/i);
  assert.match(migration, /repeated_problem_count/i);
  assert.match(migration, /update public\.topics set\s+unlock_threshold/i);
  assert.match(migration, /legacy-problem:/i);
  assert.match(migration, /rating_history/i);
  assert.match(migration, /settle_duel_submission/i);
  assert.match(migration, /audit_logs/i);
  assert.doesNotMatch(migration, /or true/i);
});

test("submission source access is permission-gated", async () => {
  const [route, auth] = await Promise.all([
    readFile(new URL("../app/api/submissions/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/server/authorization.ts", import.meta.url), "utf8"),
  ]);
  assert.match(route, /scope === "all".*submission\.view_all/s);
  assert.match(route, /includeSource.*submission\.view_source/s);
  assert.match(auth, /profile\.role === "owner"/);
  assert.match(auth, /profile\.role !== "admin"/);
});
