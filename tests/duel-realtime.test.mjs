/* The bug this file exists for: account A clicks "Find Opponent" and account B,
 * sitting online in another browser, never sees anything.
 *
 * So it reproduces exactly that, against the deployed site: two real accounts,
 * B listening on a real WebSocket, A searching through the real HTTP API. If
 * the challenge does not arrive on B's socket, this fails.
 *
 * Everything it creates is deleted in the last test.
 *
 *   node --test tests/duel-realtime.test.mjs
 *   TEST_BASE_URL=http://localhost:3000 node --test tests/duel-realtime.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const env = await (async () => {
  const merged = { ...process.env };
  try {
    const file = await readFile(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of file.split(/\r?\n/)) {
      if (!line || line.startsWith("#")) continue;
      const at = line.indexOf("=");
      if (at > 0 && !merged[line.slice(0, at)]) merged[line.slice(0, at)] = line.slice(at + 1);
    }
  } catch {}
  return merged;
})();

const SUPABASE = (env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY || "";
const SITE = (env.TEST_BASE_URL || "https://algoyol.cp-project.workers.dev").replace(/\/$/, "");
const ready = Boolean(SUPABASE && ANON && SERVICE);

const svc = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, "content-type": "application/json" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Calls the site's own duel API, exactly as the browser does. */
async function api(token, body) {
  const response = await fetch(`${SITE}/api/duel`, {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

const stamp = Date.now().toString(36);
const made = [];

async function makeLearner(tag, rating) {
  const email = `duel-rt-${stamp}-${tag}@algoyol.test`;
  const password = `Duel-${stamp}-${tag}!`;
  const created = await fetch(`${SUPABASE}/auth/v1/admin/users`, {
    method: "POST", headers: svc,
    body: JSON.stringify({ email, password, email_confirm: true,
      user_metadata: { username: `rt_${stamp}_${tag}`.slice(0, 24) } }),
  });
  if (!created.ok) throw new Error(`create ${tag}: ${created.status} ${await created.text()}`);
  const { id } = await created.json();
  made.push(id);
  await fetch(`${SUPABASE}/rest/v1/profiles?id=eq.${id}`, {
    method: "PATCH", headers: { ...svc, Prefer: "return=minimal" },
    body: JSON.stringify({ duel_rating: rating }),
  });
  const signedIn = await fetch(`${SUPABASE}/auth/v1/token?grant_type=password`, {
    method: "POST", headers: { apikey: ANON, "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!signedIn.ok) throw new Error(`sign in ${tag}: ${signedIn.status}`);
  const { access_token } = await signedIn.json();
  return { id, token: access_token };
}

/** A browser's half of the realtime connection: the same raw WebSocket and the
 *  same Phoenix join the app now makes. */
function listen(topic) {
  const socket = new WebSocket(`${SUPABASE.replace(/^http/, "ws")}/realtime/v1/websocket?apikey=${ANON}&vsn=1.0.0`);
  const received = [];
  let joined = false;
  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({
      topic: `realtime:${topic}`, event: "phx_join",
      payload: { config: { broadcast: { self: false }, presence: { key: "" }, private: false } },
      ref: "1",
    }));
  });
  socket.addEventListener("message", (message) => {
    const frame = JSON.parse(String(message.data));
    if (frame.event === "phx_reply" && frame.payload?.status === "ok") joined = true;
    if (frame.event === "broadcast" && frame.payload?.event) {
      received.push({ event: frame.payload.event, payload: frame.payload.payload || {} });
    }
  });
  return {
    received,
    ready: async () => { for (let i = 0; i < 50 && !joined; i++) await sleep(100); return joined; },
    waitFor: async (name, ms = 6000) => {
      const until = Date.now() + ms;
      while (Date.now() < until) {
        const hit = received.find((e) => e.event === name);
        if (hit) return hit;
        await sleep(100);
      }
      return null;
    },
    close: () => socket.close(),
  };
}

let A, B, socketB;

test("two accounts exist and B is listening on its own channel",
  { skip: !ready && "no Supabase credentials" }, async () => {
    A = await makeLearner("a", 1500);
    B = await makeLearner("b", 1520);
    socketB = listen(`duel:user:${B.id}`);
    assert.equal(await socketB.ready(), true, "B's socket joined its channel");
  });

test("B is online only once its heartbeat has been sent",
  { skip: !ready && "no Supabase credentials" }, async () => {
    // The bug in one line: without this call the server has no idea B exists,
    // and no amount of searching by A will find them.
    const beat = await api(B.token, { action: "heartbeat", ready: true });
    assert.equal(beat.ok, true);
  });

test("A searches and the challenge reaches B's socket",
  { skip: !ready && "no Supabase credentials" }, async () => {
    const search = await api(A.token, { action: "search" });
    assert.equal(search.ok, true, "the search started server-side");

    const tick = await api(A.token, { action: "tick" });
    assert.equal(tick.searching, true);
    assert.ok(tick.challenges.length >= 1, "the server issued a challenge");

    const delivered = await socketB.waitFor("duel_challenge_received");
    assert.ok(delivered, "B received the challenge over realtime");
    assert.equal(delivered.payload.from.id, A.id, "and it says who from");
    assert.ok(delivered.payload.expires_at, "with the server's deadline attached");

    // The card the learner sees is drawn from this, not from the event.
    const state = await api(B.token, { action: "state" });
    assert.ok(state.challenge, "and duel_state confirms it");
    assert.equal(state.challenge.from.duel_rating, 1500);
  });

test("B accepts and both accounts land in the same duel",
  { skip: !ready && "no Supabase credentials" }, async () => {
    const state = await api(B.token, { action: "state" });
    const accepted = await api(B.token, { action: "accept", challenge_id: state.challenge.id });
    assert.equal(accepted.ok, true, `accept failed: ${JSON.stringify(accepted)}`);

    const stateA = await api(A.token, { action: "state" });
    const stateB = await api(B.token, { action: "state" });
    assert.equal(stateA.status, "duel_active");
    assert.equal(stateB.status, "duel_active");
    assert.equal(stateA.duel.id, stateB.duel.id, "the same duel, not two");
    assert.equal(stateA.duel.rounds_detail.length, 3, "with its problems chosen");
    assert.notEqual(stateA.duel.my_seat, stateB.duel.my_seat, "one seat each");
  });

test("cleanup", { skip: !ready && "no Supabase credentials" }, async () => {
    socketB?.close();
    for (const id of made) {
      const response = await fetch(`${SUPABASE}/auth/v1/admin/users/${id}`, { method: "DELETE", headers: svc });
      if (!response.ok && response.status !== 404) {
        assert.fail(`delete ${id} → ${response.status} ${await response.text()}`);
      }
    }
  });
