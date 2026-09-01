/* The bot, end to end, against the deployed site.
 *
 * The claims worth checking are the ones a learner would notice:
 *   - after the human window closes, a bot duel actually appears;
 *   - its rating is near the player's, not a fixed number;
 *   - it is labelled as a bot rather than pretending to be a person;
 *   - it eventually submits, through the ordinary judge, and gets a real
 *     verdict recorded against the round;
 *   - the player is never told the bot's source code.
 *
 * Slow by design: the bot's first attempt is scheduled tens of seconds in,
 * because that is the point of it.
 *
 *   node --test --test-timeout=600000 tests/duel-bot.test.mjs
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
let learner = null;

async function makeLearner(rating) {
  const email = `duel-bot-${stamp}@algoyol.test`;
  const password = `Duel-${stamp}-bot!`;
  const created = await fetch(`${SUPABASE}/auth/v1/admin/users`, {
    method: "POST", headers: svc,
    body: JSON.stringify({ email, password, email_confirm: true,
      user_metadata: { username: `bot_${stamp}`.slice(0, 24) } }),
  });
  if (!created.ok) throw new Error(`create: ${created.status} ${await created.text()}`);
  const { id } = await created.json();
  await fetch(`${SUPABASE}/rest/v1/profiles?id=eq.${id}`, {
    method: "PATCH", headers: { ...svc, Prefer: "return=minimal" },
    body: JSON.stringify({ duel_rating: rating }),
  });
  const signedIn = await fetch(`${SUPABASE}/auth/v1/token?grant_type=password`, {
    method: "POST", headers: { apikey: ANON, "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const { access_token } = await signedIn.json();
  return { id, token: access_token };
}

const RATING = 1100;

test("migration 019 is applied and the bot has problems to play",
  { skip: !ready && "no Supabase credentials" }, async () => {
    const response = await fetch(
      `${SUPABASE}/rest/v1/duel_problem_pool?bot_ready=is.true&select=problem_key`,
      { headers: { ...svc, Prefer: "count=exact", Range: "0-0" } });
    const total = Number((response.headers.get("content-range") || "").split("/")[1] || 0);
    assert.ok(total >= 25, `only ${total} bot-ready problems — run migration 019`);

    const config = await fetch(`${SUPABASE}/rest/v1/duel_config?key=eq.bot_enabled&select=value`,
      { headers: svc });
    const rows = await config.json();
    assert.equal(rows[0]?.value, true, "bot_enabled is still false — run migration 019");
  });

test("no human, so a bot duel appears after the human window",
  { skip: !ready && "no Supabase credentials" }, async () => {
    learner = await makeLearner(RATING);
    const search = await api(learner.token, { action: "search" });
    assert.equal(search.ok, true);

    let state = null;
    // The window is 12 seconds by config; give it room and keep ticking.
    for (let i = 0; i < 25; i++) {
      await sleep(1000);
      const tick = await api(learner.token, { action: "tick" });
      if (tick?.state?.duel) { state = tick.state; break; }
      const now = await api(learner.token, { action: "state" });
      if (now?.duel) { state = now; break; }
    }
    assert.ok(state?.duel, "no bot duel appeared within the window");
    assert.equal(state.duel.mode, "bot");
    assert.equal(state.duel.rounds_detail.length, 3, "the duel has its problems");

    const bot = state.duel.players.find((p) => p.seat !== state.duel.my_seat);
    assert.equal(bot.is_bot, true, "the opponent is labelled as a bot, not disguised as a person");

    // Since 021 the bot is matched to the strength estimate rather than to
    // duel_rating alone — for a fresh account with no solves and no roadmap
    // progress that is the 1200 prior, not whatever the column happens to say.
    // Comparing against duel_rating here would be testing the old behaviour.
    const strength = await fetch(`${SUPABASE}/rest/v1/rpc/duel_player_strength`, {
      method: "POST", headers: svc, body: JSON.stringify({ p_user: learner.id }),
    }).then((r) => r.json()).catch(() => null);
    const target = strength?.strength ?? RATING;
    assert.ok(Math.abs(bot.rating - target) <= 60,
      `bot rating ${bot.rating} should sit near the player's estimated strength ${target}`);
  });

test("the bot submits through the real judge and the verdict is recorded",
  { skip: !ready && "no Supabase credentials" }, async () => {
    const state = await api(learner.token, { action: "state" });
    const matchId = state.duel.id;

    // The first attempt is scheduled tens of seconds in, and a hard round can
    // push it past four minutes legitimately — so read the plan and wait for
    // the time it actually says rather than for a number picked here.
    const plan = await fetch(
      `${SUPABASE}/rest/v1/duel_match_players?match_id=eq.${matchId}&is_bot=is.true&select=bot_plan`,
      { headers: svc }).then((r) => r.json());
    const firstAt = plan[0]?.bot_plan?.rounds?.[0]?.attempts?.[0]?.at;
    assert.ok(typeof firstAt === "number", "the bot was created without a schedule");

    let moved = null;
    let lastReason = "never polled";
    const budget = Math.max(90, firstAt + 90) * 1000;
    const until = Date.now() + budget;
    while (Date.now() < until) {
      const step = await api(learner.token, { action: "bot_step", match_id: matchId });
      if (step?.moved) { moved = step; break; }
      lastReason = step?.reason || JSON.stringify(step);
      // A missing solution is a bug; a judge outage is the outside world.
      assert.notEqual(step?.reason, "no_plan", "the bot lost its schedule mid-duel");
      assert.notEqual(step?.reason, "no_solution", "a round was chosen the bot cannot play");
      await sleep(5000);
    }
    assert.ok(moved,
      `the bot never submitted — first attempt was due at ${firstAt}s, waited ${Math.round(budget / 1000)}s, last reason: ${lastReason}`);
    assert.ok(["ACCEPTED", "WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", "RUNTIME_ERROR", "COMPILATION_ERROR"]
      .includes(moved.verdict), `unexpected verdict ${moved.verdict}`);

    // Recorded against the duel, by the bot's seat, exactly like a human's.
    const rows = await fetch(
      `${SUPABASE}/rest/v1/duel_submissions?match_id=eq.${matchId}&is_bot=is.true&select=round,verdict,seat`,
      { headers: svc }).then((r) => r.json());
    assert.ok(rows.length >= 1, "no bot submission was stored");
    assert.equal(rows[0].verdict, moved.verdict);
  });

test("the player is never given the bot's source",
  { skip: !ready && "no Supabase credentials" }, async () => {
    const state = await api(learner.token, { action: "state" });
    const serialised = JSON.stringify(state);
    assert.ok(!serialised.includes("#include"), "duel state leaked source code");
    assert.ok(!serialised.includes("source_code"), "duel state exposes a source field");
    // Opponent activity carries verdicts and nothing else.
    for (const entry of state.duel?.opponent_activity || []) {
      assert.deepEqual(Object.keys(entry).sort(), ["created_at", "round", "verdict"]);
    }
  });

test("a bot duel does not move the leaderboard rating while unrated",
  { skip: !ready && "no Supabase credentials" }, async () => {
    const state = await api(learner.token, { action: "state" });
    if (state.duel) await api(learner.token, { action: "forfeit", match_id: state.duel.id });

    const config = await fetch(`${SUPABASE}/rest/v1/duel_config?key=eq.bot_duels_affect_rating&select=value`,
      { headers: svc }).then((r) => r.json());
    const rated = config[0]?.value === true;

    const profile = await fetch(`${SUPABASE}/rest/v1/profiles?id=eq.${learner.id}&select=duel_rating`,
      { headers: svc }).then((r) => r.json());
    if (!rated) {
      assert.equal(profile[0].duel_rating, RATING,
        "bot duels are configured as unrated but the rating moved");
    }
  });

test("cleanup", { skip: !ready && "no Supabase credentials" }, async () => {
    if (!learner) return;
    const response = await fetch(`${SUPABASE}/auth/v1/admin/users/${learner.id}`, {
      method: "DELETE", headers: svc,
    });
    if (!response.ok && response.status !== 404) {
      assert.fail(`delete ${learner.id} → ${response.status} ${await response.text()}`);
    }
  });
