/* Duel matchmaking — the guarantees, tested against the real database.
 *
 * These are not unit tests. The claims worth testing here are all claims about
 * what Postgres does when two requests arrive at once, and a mock cannot be
 * wrong in the same way a database is wrong — so this drives the actual RPCs
 * with actual tokens against the actual project.
 *
 * It creates its own throwaway accounts and deletes them in the last test, so
 * a run leaves nothing behind. Requires SUPABASE_SERVICE_ROLE_KEY, and is
 * skipped rather than failed when the environment has no credentials.
 *
 *   node --test tests/duel-matchmaking.test.mjs
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

const URL_BASE = (env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY || "";
const ready = Boolean(URL_BASE && ANON && SERVICE);

const svcHeaders = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, "content-type": "application/json" };
const userHeaders = (token) => ({ apikey: ANON, Authorization: `Bearer ${token}`, "content-type": "application/json" });

const rpc = async (token, fn, args = {}) => {
  const response = await fetch(`${URL_BASE}/rest/v1/rpc/${fn}`, {
    method: "POST", headers: userHeaders(token), body: JSON.stringify(args),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${fn} → ${response.status} ${text}`);
  return text ? JSON.parse(text) : null;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* --- fixtures ------------------------------------------------------------ */
const stamp = Date.now().toString(36);
const made = [];

async function makeLearner(tag, rating) {
  const email = `duel-test-${stamp}-${tag}@algoyol.test`;
  const password = `Duel-${stamp}-${tag}!`;
  const created = await fetch(`${URL_BASE}/auth/v1/admin/users`, {
    method: "POST", headers: svcHeaders,
    body: JSON.stringify({
      email, password, email_confirm: true,
      user_metadata: { username: `duel_${stamp}_${tag}`.slice(0, 24) },
    }),
  });
  if (!created.ok) throw new Error(`create ${tag}: ${created.status} ${await created.text()}`);
  const { id } = await created.json();
  made.push(id);

  // Ratings are set with the service role on purpose — from 017 onward a
  // learner's own token cannot write this column, and the test should not be
  // the one thing that still can.
  await fetch(`${URL_BASE}/rest/v1/profiles?id=eq.${id}`, {
    method: "PATCH", headers: { ...svcHeaders, Prefer: "return=minimal" },
    body: JSON.stringify({ duel_rating: rating }),
  });

  const signedIn = await fetch(`${URL_BASE}/auth/v1/token?grant_type=password`, {
    method: "POST", headers: { apikey: ANON, "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!signedIn.ok) throw new Error(`sign in ${tag}: ${signedIn.status} ${await signedIn.text()}`);
  const { access_token } = await signedIn.json();
  return { id, token: access_token, tag };
}

const countRows = async (path) => {
  const response = await fetch(`${URL_BASE}/rest/v1/${path}`, {
    headers: { ...svcHeaders, Prefer: "count=exact", Range: "0-0" },
  });
  const range = response.headers.get("content-range") || "";
  return Number(range.split("/")[1] || 0);
};

/* --- the tests ----------------------------------------------------------- */

let A, B, C;

test("migration 016 is applied and the pool is seeded", { skip: !ready && "no Supabase credentials" }, async () => {
  A = await makeLearner("a", 1450);
  B = await makeLearner("b", 1470);
  C = await makeLearner("c", 1430);

  const state = await rpc(A.token, "duel_state");
  assert.equal(state.status, "idle", "a fresh learner is idle");
  assert.ok((await countRows("duel_problem_pool?select=problem_key")) > 50, "problem pool seeded");
});

test("a search starts, and starting it twice resumes rather than duplicating",
  { skip: !ready && "no Supabase credentials" }, async () => {
    const first = await rpc(A.token, "duel_start_search");
    assert.equal(first.ok, true);
    assert.equal(first.resumed, false);

    const second = await rpc(A.token, "duel_start_search");
    assert.equal(second.ok, true);
    assert.equal(second.resumed, true, "the second call joins the running search");
    assert.equal(second.session_id, first.session_id);

    const live = await countRows(
      `duel_matchmaking_sessions?user_id=eq.${A.id}&status=in.(searching,challenge_sent)&select=id`);
    assert.equal(live, 1, "exactly one live session — the partial unique index holds");
  });

test("the tick challenges nearby opponents who are online",
  { skip: !ready && "no Supabase credentials" }, async () => {
    // Nobody is online yet, so the first tick finds nothing at all.
    const quiet = await rpc(A.token, "duel_tick");
    assert.equal(quiet.challenges.length, 0, "an empty lobby produces no challenges");

    await rpc(B.token, "duel_heartbeat");
    await rpc(C.token, "duel_heartbeat");

    const loud = await rpc(A.token, "duel_tick");
    assert.equal(loud.challenges.length, 2, "both nearby learners are challenged");
    assert.ok(loud.radius >= 100, "the radius starts at the configured minimum");

    const inbox = await rpc(B.token, "duel_state");
    assert.ok(inbox.challenge, "B sees a challenge");
    assert.equal(inbox.challenge.from.id, A.id);
    assert.ok(inbox.challenge.from.duel_rating, "the card has a rating to show");
  });

test("simultaneous accepts: exactly one duel exists afterwards",
  { skip: !ready && "no Supabase credentials" }, async () => {
    const before = await countRows("duel_matches?select=id");

    // The whole point. Both requests are in flight before either has returned.
    const [b, c] = await Promise.all([
      rpc(B.token, "duel_accept_challenge", { p_challenge: (await rpc(B.token, "duel_state")).challenge.id }),
      rpc(C.token, "duel_accept_challenge", { p_challenge: (await rpc(C.token, "duel_state")).challenge.id }),
    ]);

    const winners = [b, c].filter((r) => r.ok === true);
    const losers = [b, c].filter((r) => r.ok !== true);
    assert.equal(winners.length, 1, "exactly one accept succeeds");
    assert.equal(losers.length, 1);
    assert.equal(losers[0].error, "already_taken", "the loser is told why, not left hanging");

    assert.equal(await countRows("duel_matches?select=id"), before + 1, "one duel created, not two");

    // The winner and A are both in it; the loser is in nothing.
    const winnerToken = winners[0] === b ? B.token : C.token;
    const loserToken = winners[0] === b ? C.token : B.token;
    const winnerState = await rpc(winnerToken, "duel_state");
    const loserState = await rpc(loserToken, "duel_state");
    const challengerState = await rpc(A.token, "duel_state");

    assert.equal(winnerState.status, "duel_active");
    assert.equal(challengerState.status, "duel_active");
    assert.equal(challengerState.duel.id, winnerState.duel.id, "both sit in the same duel");
    assert.equal(loserState.status, "idle", "the loser is free, not stuck");
    assert.equal(winnerState.duel.rounds_detail.length, 3, "the duel has its problems");
  });

test("a player already in a duel cannot start another search",
  { skip: !ready && "no Supabase credentials" }, async () => {
    const blocked = await rpc(A.token, "duel_start_search");
    assert.equal(blocked.ok, false);
    assert.equal(blocked.error, "already_in_duel");

    // Clear the way for the remaining tests.
    const duel = (await rpc(A.token, "duel_state")).duel;
    await rpc(A.token, "duel_forfeit", { p_match: duel.id });
    assert.equal((await rpc(A.token, "duel_state")).status, "idle");
  });

test("an accept after the five seconds is refused by the server clock",
  { skip: !ready && "no Supabase credentials" }, async () => {
    await rpc(A.token, "duel_start_search");
    await rpc(B.token, "duel_heartbeat");
    const tick = await rpc(A.token, "duel_tick");
    assert.ok(tick.challenges.length >= 1, "a challenge went out");

    const challenge = (await rpc(B.token, "duel_state")).challenge;
    assert.ok(challenge, "B has it in hand");

    // Past the deadline, with the client's countdown deliberately ignored.
    await sleep(5400);
    const late = await rpc(B.token, "duel_accept_challenge", { p_challenge: challenge.id });
    assert.equal(late.ok, false);
    assert.equal(late.error, "expired");

    const stillIdle = await rpc(B.token, "duel_state");
    assert.equal(stillIdle.status, "idle", "an expired challenge creates nothing");
    await rpc(A.token, "duel_cancel_search");
  });

test("the search resumes only once every card is gone",
  { skip: !ready && "no Supabase credentials" }, async () => {
    await rpc(A.token, "duel_start_search");
    await rpc(B.token, "duel_heartbeat");
    await rpc(C.token, "duel_heartbeat");
    await rpc(A.token, "duel_tick");

    // The fanout is three, so both learners are holding a card. A search with
    // one decline left is still a search waiting on an answer — the first
    // version of this test assumed a single challenge and read that correct
    // behaviour as a failure.
    const holders = [];
    for (const who of [B, C]) {
      const state = await rpc(who.token, "duel_state");
      if (state.challenge) holders.push({ who, id: state.challenge.id });
    }
    assert.ok(holders.length >= 1, "at least one challenge went out");

    for (let i = 0; i < holders.length; i++) {
      const declined = await rpc(holders[i].who.token, "duel_decline_challenge", { p_challenge: holders[i].id });
      assert.equal(declined.ok, true);

      const session = (await rpc(A.token, "duel_state")).session;
      const last = i === holders.length - 1;
      assert.equal(session.status, last ? "searching" : "challenge_sent",
        last ? "the search carries on once the last card is declined"
             : "a search with cards still out keeps waiting");
    }
    await rpc(A.token, "duel_cancel_search");
  });

test("the bot only appears once humans have had their window",
  { skip: !ready && "no Supabase credentials" }, async () => {
    await rpc(A.token, "duel_start_search");
    const early = await rpc(A.token, "duel_start_bot_match");
    assert.equal(early.ok, false);
    assert.equal(early.error, "too_early", "a client cannot summon a bot ahead of schedule");
    await rpc(A.token, "duel_cancel_search");
  });

test("cleanup: the throwaway accounts are removed",
  { skip: !ready && "no Supabase credentials" }, async () => {
    for (const id of made) {
      const response = await fetch(`${URL_BASE}/auth/v1/admin/users/${id}`, {
        method: "DELETE", headers: svcHeaders,
      });
      // The body matters here: this is where a foreign key that forgot its
      // ON DELETE rule shows up, and "assertion failed" alone does not say so.
      if (!response.ok && response.status !== 404) {
        assert.fail(`delete ${id} → ${response.status} ${await response.text()}`);
      }
    }
    const left = await countRows(`profiles?username=like.duel_${stamp}*&select=id`);
    assert.equal(left, 0, "nothing left behind");
  });
