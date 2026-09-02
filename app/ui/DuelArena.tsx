"use client";

/* The duel, driven by the server.
 *
 * What this replaces: a matchmaking screen that was a 1.8-second setTimeout
 * over six hard-coded names, and an arena whose opponent was a countdown. The
 * components kept their looks — the CSS here is the CSS that was already in
 * globals.css — and lost every decision they used to make. Which problems,
 * who the opponent is, what the clock says, who claimed a round, who won and
 * what it did to a rating are all read from duel_state() now.
 *
 * The one rule the whole file follows: an event never carries truth. A realtime
 * message means "ask again", and this asks again. That is what lets two tabs,
 * a refresh, a reconnect and a phone on the same account all agree.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { tr } from "./i18n";
import { bankProblems } from "./problem-bank";
import { CodeEditor } from "./CodeEditor";
import { useTabGuard } from "./duel-guard";
import {
  // Accept and decline are the shell's job, not this screen's: the card can
  // appear anywhere in the app, so the handlers live where it is rendered.
  botStep, cancelSearch, duelRecentResult, duelState, duelTick,
  forfeitDuel, secondsLeft, startSearch, submitToDuel,
  type ActiveDuel, type DuelResult, type DuelState, type IncomingChallenge,
} from "./duel-client";

type Lang = "uz" | "en";
type CodeLang = "cpp20" | "python3";

/* The event the app shell raises when a realtime message arrives. Same idiom
   the rest of the app already uses for progress changes. */
export const DUEL_EVENT = "algoyol-duel";

const STARTER: Record<CodeLang, string> = {
  cpp20: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main(){\n  ios::sync_with_stdio(false);\n  cin.tie(nullptr);\n  // yechimingizni shu yerga yozing\n  return 0;\n}\n",
  python3: "import sys\ninput = sys.stdin.readline\n\n# yechimingizni shu yerga yozing\n",
};

/* How long an absence is forgiven. See app/ui/duel-guard.ts for why this is
   not zero: browsers raise blur and visibility events for notifications, the
   address bar and OS popups, and none of those are somebody reading an
   editorial. Ten seconds is far shorter than looking anything up. */
const AWAY_GRACE_MS = 10_000;

const clock = (total: number) =>
  `${String(Math.floor(Math.max(0, total) / 60)).padStart(2, "0")}:${String(Math.floor(Math.max(0, total)) % 60).padStart(2, "0")}`;

const problemFor = (key: string) => bankProblems.find((p) => p.judge === key);
const seatOf = (duel: ActiveDuel, seat: number) => duel.players.find((p) => p.seat === seat);
const nameOf = (player: { is_bot: boolean; display_name: string; username: string | null } | undefined, lang: Lang) =>
  !player ? "—" : player.is_bot ? (tr(lang,"duelArena.ai_raqib")) : player.display_name || player.username || "—";

const T = {
  uz: {
    eyebrow: "Reytingli matchmaking", title: "Duel uchun raqib toping",
    sub: "Tizim sizga reytingi yaqin bo‘lgan raqibni qidiradi.",
    ready: "Bellashishga tayyormisiz?", searching: "Raqib qidirilmoqda…",
    find: "Raqib qidirish", cancel: "Qidiruvni bekor qilish", needAuth: "Kirish talab qilinadi",
    range: "Reyting oralig‘i", online: "Mavjud raqiblar", elapsed: "Vaqt",
    expanding: "Raqib topilmasa, oraliq kengayadi.", botSoon: "Odam topilmadi — AI raqib tayyorlanmoqda…",
    challenge: "Duel chaqirig‘i", accept: "Qabul qilish", decline: "Rad etish",
    tooLate: "Kech qoldingiz — raqibni boshqa o‘yinchi oldi.", expired: "Chaqiriq muddati tugadi.",
    vs: "qarshi", you: "Siz", bot: "AI raqib", points: "ball", locked: "Qulflangan", open: "Ochiq",
    submit: "Yuborish", judging: "Tekshirilmoqda…", forfeit: "Taslim bo‘lish",
    won: "G‘alaba!", lost: "Mag‘lubiyat", draw: "Durang", rematch: "Yangi duel", leave: "Chiqish",
    ratingChange: "Reyting o‘zgarishi", unrated: "Bu duel reytingga ta’sir qilmadi",
    opponentSolved: "raqib yechdi", youSolved: "siz yechdingiz", opponentTried: "raqib urinib ko‘rdi",
    noProblem: "Masala topilmadi.", connecting: "Ulanmoqda…", offline: "Aloqa uzildi — qayta ulanmoqda…",
    run: "Ishga tushirish", running: "Ishlamoqda…", stdin: "Kirish (stdin)", stdout: "Chiqish (stdout)",
    expected: "Kutilgan chiqish", stderr: "Xatolar", noRun: "Hali ishga tushirilmadi.",
    useSample: "Namunani qo‘yish", matches: "Namuna bilan mos", differs: "Namunadan farq qiladi",
    runNote: "Ishga tushirish tekshiruvchi emas — bu yerda verdikt qo‘yilmaydi, faqat dasturingiz nima chiqarganini ko‘rasiz.",
    shortcuts: "Ctrl+Enter — ishga tushirish · Ctrl+Shift+Enter — yuborish",
    ruleTitle: "Duel shu tabda o‘tadi",
    ruleBody: "Kodni faqat shu yerda yozing. Boshqa tabga yoki boshqa dasturga o‘tsangiz, duel avtomatik yutqaziladi.",
    ruleGrace: (s: number) => `${s} soniyadan uzoq g‘oyib bo‘lsangiz — mag‘lubiyat.`,
    strayTitle: "Duel tabidan chiqdingiz",
    strayBody: (s: number, n: number, g: number) =>
      `${s} soniya g‘oyib bo‘ldingiz — bu ${n}-marta. ${g} soniyadan oshsa duel avtomatik yutqaziladi.`,
    strayOk: "Tushunarli, davom etaman",
    strayCount: (n: number) => `${n} marta chiqdingiz`,
    awayNow: "Duelga qayting",
    lostByLeaving: "Duel tabini tashlab ketganingiz uchun mag‘lub bo‘ldingiz.",
  },
  en: {
    eyebrow: "Rated matchmaking", title: "Find a duel opponent",
    sub: "We will match you with a player near your rating.",
    ready: "Ready to compete?", searching: "Searching for an opponent…",
    find: "Search for competitor", cancel: "Cancel search", needAuth: "Sign in required",
    range: "Rating range", online: "Available opponents", elapsed: "Elapsed",
    expanding: "The range widens if nobody suitable is found.", botSoon: "No human found — preparing an AI opponent…",
    challenge: "Duel challenge", accept: "Accept", decline: "Decline",
    tooLate: "Too slow — another player took this opponent.", expired: "The challenge expired.",
    vs: "vs", you: "You", bot: "AI opponent", points: "points", locked: "Locked", open: "Open",
    submit: "Submit", judging: "Judging…", forfeit: "Forfeit",
    won: "You won!", lost: "You lost", draw: "Draw", rematch: "New duel", leave: "Leave",
    ratingChange: "Rating change", unrated: "This duel did not affect your rating",
    opponentSolved: "opponent solved", youSolved: "you solved", opponentTried: "opponent attempted",
    noProblem: "Problem not found.", connecting: "Connecting…", offline: "Connection lost — reconnecting…",
    run: "Run", running: "Running…", stdin: "Input (stdin)", stdout: "Output (stdout)",
    expected: "Expected output", stderr: "Errors", noRun: "Nothing run yet.",
    useSample: "Load the sample", matches: "Matches the sample", differs: "Differs from the sample",
    runNote: "Running is not the judge — no verdict is given here, only what your program printed.",
    shortcuts: "Ctrl+Enter to run · Ctrl+Shift+Enter to submit",
    ruleTitle: "The duel happens in this tab",
    ruleBody: "Write your code here and nowhere else. Switching to another tab or another application forfeits the duel.",
    ruleGrace: (s: number) => `Away for more than ${s} seconds and you lose.`,
    strayTitle: "You left the duel tab",
    strayBody: (s: number, n: number, g: number) =>
      `You were away ${s}s — that is time ${n}. Longer than ${g}s and the duel is forfeited automatically.`,
    strayOk: "Understood, carry on",
    strayCount: (n: number) => `left ${n} times`,
    awayNow: "Come back to the duel",
    lostByLeaving: "You lost because you left the duel tab.",
  },
};

/* ------------------------------------------------------------------ challenge
 * Rendered by the app shell, not by the duel screen: a challenge can arrive
 * while the learner is reading a lesson, and a notification that only appears
 * on the page you are already on is not a notification.
 *
 * The ring is decoration. The deadline is the server's, drawn against the
 * server's own clock, and an accept past it is refused there — this only stops
 * showing a card that cannot be accepted any more.
 */
export function ChallengeOverlay({
  lang, challenge, serverNow, drawnAt, onAccept, onDecline, onExpire, notice,
}: {
  lang: Lang; challenge: IncomingChallenge | null; serverNow: string; drawnAt: number;
  onAccept: (id: string) => void; onDecline: (id: string) => void; onExpire: () => void;
  notice: string;
}) {
  const t = T[lang];
  // Tagged with the challenge it belongs to. The effect below cannot run until
  // after the first paint, so an untagged number would show the *previous*
  // challenge's countdown for a frame — and on the very first one, whatever
  // number was hardcoded here.
  const [left, setLeft] = useState<{ id: string; seconds: number } | null>(null);
  const expired = useRef(false);

  useEffect(() => {
    if (!challenge) return;
    expired.current = false;
    const tick = () => {
      const remaining = secondsLeft(challenge.expires_at, serverNow, drawnAt);
      setLeft({ id: challenge.id, seconds: remaining });
      if (remaining <= 0 && !expired.current) {
        expired.current = true;
        onExpire();
      }
    };
    tick();
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [challenge, serverNow, drawnAt, onExpire]);

  if (notice && !challenge) {
    return (
      <div className="duel-toast" role="status" aria-live="polite">{notice}</div>
    );
  }
  if (!challenge) return null;

  /* How long the card lives is the server's decision — duel_config's
     challenge_ttl_seconds, which has already been five and is now seven. The
     ring was drawn against a 5 hardcoded here, so it sat full for two seconds
     and then drained over the remaining five while the number counted down
     from seven. Both timestamps come from the server in the same message, so
     their difference IS the deadline, whatever it is set to next. */
  const total = Math.max(1, (Date.parse(challenge.expires_at) - Date.parse(challenge.created_at)) / 1000) || 5;
  const seconds = left && left.id === challenge.id ? left.seconds : total;
  const fraction = Math.max(0, Math.min(1, seconds / total));
  const circumference = 2 * Math.PI * 26;

  return (
    <div className="challenge-backdrop" role="dialog" aria-modal="true" aria-label={t.challenge}>
      <div className="challenge-card">
        <p className="eyebrow" style={{ color: "#9aef4f" }}>⚔️ {t.challenge}</p>
        <div className="challenge-who">
          <span className="avatar" aria-hidden>
            {(challenge.from.display_name || challenge.from.username || "?").slice(0, 1).toUpperCase()}
          </span>
          <span>
            <b>{challenge.from.display_name || challenge.from.username}</b>
            <br />
            <span className="muted">@{challenge.from.username} · {challenge.from.duel_rating} Elo</span>
          </span>
          <svg className="challenge-ring" viewBox="0 0 60 60" aria-hidden>
            <circle cx="30" cy="30" r="26" fill="none" stroke="#22302a" strokeWidth="5" />
            <circle
              cx="30" cy="30" r="26" fill="none" stroke="#9aef4f" strokeWidth="5" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - fraction)}
              transform="rotate(-90 30 30)"
            />
            <text x="30" y="36" textAnchor="middle" fontSize="20" fontWeight="800" fill="#f2f7f3">
              {Math.ceil(seconds)}
            </text>
          </svg>
        </div>
        <div className="match-actions">
          <button className="primary" onClick={() => onAccept(challenge.id)}>{t.accept}</button>
          <button className="secondary" onClick={() => onDecline(challenge.id)}>{t.decline}</button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- matchmaking */
export function DuelMatchmaking({
  lang, signed, authLoading, needAuth,
}: {
  lang: Lang; signed: boolean; authLoading: boolean; needAuth: () => void;
}) {
  const t = T[lang];
  const [state, setState] = useState<DuelState | null>(null);
  const [drawnAt, setDrawnAt] = useState(() => Date.now());
  const [tick, setTick] = useState<{ elapsed: number; radius: number; available: number; botDue: boolean }>(
    { elapsed: 0, radius: 100, available: 0, botDue: false });
  const [result, setResult] = useState<DuelResult | null>(null);
  /* Why the duel ended, when the reason is one the server does not record. The
     forfeit reaches the database as an ordinary forfeit — it is one — so the
     result screen would otherwise say "you lost" and leave the player to guess
     which of the things they were warned about happened. */
  const [lostByLeaving, setLostByLeaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const hadDuel = useRef(false);

  const refresh = useCallback(async () => {
    const next = await duelState();
    if (next && "status" in next) {
      setState(next);
      setDrawnAt(Date.now());
      if (next.duel) { hadDuel.current = true; setResult(null); }
      // The duel we were in has gone: it finished. duel_state() stops
      // reporting it at that moment, so the scoreboard is a second question.
      else if (hadDuel.current) {
        hadDuel.current = false;
        const finished = await duelRecentResult();
        if (finished && "id" in finished) setResult(finished);
      }
    }
  }, []);

  // Reads the server on mount. The state it sets is a response, not a render.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (signed) void refresh(); }, [signed, refresh]);

  // Realtime says something changed; the server says what.
  useEffect(() => {
    const onDuelEvent = () => { void refresh(); };
    window.addEventListener(DUEL_EVENT, onDuelEvent);
    return () => window.removeEventListener(DUEL_EVENT, onDuelEvent);
  }, [refresh]);

  const status = state?.status || "idle";

  // The search tick. Every value it acts on is recomputed server-side, so a
  // faster interval here buys nothing but its own traffic.
  useEffect(() => {
    if (status !== "searching" && status !== "challenge_sent") return;
    let live = true;
    const run = async () => {
      const outcome = await duelTick();
      // `ok` is on both shapes, so it cannot tell them apart — `searching` is
      // the field only a real tick answer carries.
      if (!live || !outcome || !("searching" in outcome)) return;
      setTick({
        elapsed: outcome.elapsed ?? 0,
        radius: outcome.radius ?? 100,
        available: outcome.available ?? 0,
        botDue: outcome.bot_fallback_due === true,
      });
      if (outcome.state) { setState(outcome.state); setDrawnAt(Date.now()); }
    };
    void run();
    const id = window.setInterval(run, 1000);
    return () => { live = false; window.clearInterval(id); };
  }, [status]);

  const begin = async () => {
    if (!signed) { needAuth(); return; }
    setBusy(true); setResult(null);
    await startSearch();
    await refresh();
    setBusy(false);
  };
  const stop = async () => { setBusy(true); await cancelSearch(); await refresh(); setBusy(false); };

  if (authLoading) return <div className="screen-state" role="status"><span className="spinner" aria-hidden /></div>;

  if (state?.duel) {
    return (
      <Arena
        lang={lang} duel={state.duel} serverNow={state.now} drawnAt={drawnAt} refresh={refresh}
        onLeftTab={() => setLostByLeaving(true)}
      />
    );
  }
  if (result) {
    return (
      <ResultScreen
        lang={lang} result={result} onRematch={begin}
        onExit={() => { setResult(null); setLostByLeaving(false); }}
        note={lostByLeaving ? t.lostByLeaving : ""}
      />
    );
  }

  const searching = status === "searching" || status === "challenge_sent";
  const rating = state?.session?.rating;

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow" style={{ color: "#637068" }}>{t.eyebrow}</p>
          <h1 className="page-title">{t.title}</h1>
          <p className="muted">{t.sub}</p>
        </div>
        {signed && rating !== undefined && <span className="tag">ELO {rating}</span>}
      </div>

      <div className="matchmaking panel">
        <div className={`search-orb ${searching ? "pulse" : ""}`}>{searching ? "⚡" : "⚔"}</div>
        <h2>{searching ? t.searching : t.ready}</h2>

        <p className="duel-rule-lite">
          <b>⚠ {t.ruleTitle}.</b> {t.ruleBody}
        </p>

        {searching ? (
          <>
            <div className="search-stats">
              <div><b>{clock(tick.elapsed)}</b><small>{t.elapsed}</small></div>
              <div>
                <b>{rating !== undefined ? `${rating - tick.radius}–${rating + tick.radius}` : "—"}</b>
                <small>{t.range}</small>
              </div>
              <div><b>{tick.available}</b><small>{t.online}</small></div>
            </div>
            <p className="muted">{tick.botDue ? t.botSoon : t.expanding}</p>
            <button className="secondary" onClick={stop} disabled={busy}>{t.cancel}</button>
          </>
        ) : (
          <>
            <p className="muted">{t.sub}</p>
            <button className="primary" onClick={begin} disabled={busy}>
              {signed ? t.find : t.needAuth}
            </button>
          </>
        )}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------- arena */
function Arena({
  lang, duel, serverNow, drawnAt, refresh, onLeftTab,
}: {
  lang: Lang; duel: ActiveDuel; serverNow: string; drawnAt: number; refresh: () => Promise<void>;
  onLeftTab: () => void;
}) {
  const t = T[lang];
  const me = seatOf(duel, duel.my_seat);
  const them = seatOf(duel, duel.my_seat === 1 ? 2 : 1);

  const openRound = duel.rounds_detail.find((r) => r.claimed_by_seat === null)
    || duel.rounds_detail[duel.rounds_detail.length - 1];

  /* One problem is open at a time, and the next one exists only after this one
     has been claimed — by either player. That was always what the locked/open
     labels claimed, but nothing enforced it: clicking a "locked" step still
     showed its statement, so B and C could be read and worked on while A was
     untouched. The gate is a rule about the duel, not a hint about it.

     Which round is on screen is derived, not stored: a learner can click back
     to a round already settled, and the fallback happens in the expression
     rather than in an effect that would have to notice and correct itself. */
  const unlocked = (r: { round: number }) => r.round <= (openRound?.round ?? 0);
  const [picked, setPicked] = useState<number | null>(null);
  const pickedRound = picked === null ? undefined : duel.rounds_detail.find((r) => r.round === picked);
  const round = pickedRound && unlocked(pickedRound) ? pickedRound : openRound;
  const roundId = round?.round ?? 0;

  const [codeLang, setCodeLang] = useState<CodeLang>("cpp20");
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const compute = () => setRemaining(secondsLeft(duel.ends_at, serverNow, drawnAt));
    compute();
    const id = window.setInterval(compute, 1000);
    return () => window.clearInterval(id);
  }, [duel.ends_at, serverNow, drawnAt]);

  // The clock running out is the server's business; this only asks it to look.
  useEffect(() => { if (remaining <= 0) void refresh(); }, [remaining, refresh]);

  /* The duel's own pulse. Realtime tells us when the opponent does something,
     but a bot's move is not triggered by anyone — it is due at a time decided
     before the duel started, and something has to ask. So this asks, and picks
     up any missed event on the same beat. */
  useEffect(() => {
    let live = true;
    const beat = async () => {
      if (duel.mode === "bot") await botStep(duel.id);
      if (live) await refresh();
    };
    const id = window.setInterval(() => { void beat(); }, 4000);
    return () => { live = false; window.clearInterval(id); };
  }, [duel.id, duel.mode, refresh]);

  const problem = round ? problemFor(round.problem_key) : undefined;
  const over = remaining <= 0;

  /* The rule, enforced. A duel is the one screen where looking something up is
     cheating, and whether this page is still the page you are looking at is the
     only thing the browser will tell us about that — so that is what is
     measured, and it is measured in the open: the banner says the rule before
     the first round, and a stray is shown the moment you come back. */
  const guard = useTabGuard({
    active: !over,
    graceMs: AWAY_GRACE_MS,
    onLose: useCallback(() => {
      onLeftTab();
      void (async () => { await forfeitDuel(duel.id); await refresh(); })();
    }, [duel.id, refresh, onLeftTab]),
  });

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow" style={{ color: "#637068" }}>
            {duel.mode === "bot" ? "AI duel" : "Reytingli duel"} · #{duel.id.slice(0, 8)}
          </p>
          <h1 className="page-title">{tr(lang,"duelArena.duel_maydoni")}</h1>
        </div>
        <span className={`timer ${remaining <= 300 ? "low" : ""}`}>{clock(remaining)}</span>
      </div>

      {/* Said before it can be broken, and said again for as long as the duel
          lasts. A rule a player only discovers by losing to it is a trap. */}
      <div className={`duel-rule ${guard.strays ? "warned" : ""}`} role="note">
        <b>⚠ {t.ruleTitle}.</b> <span>{t.ruleBody} {t.ruleGrace(Math.round(AWAY_GRACE_MS / 1000))}</span>
        {guard.strays > 0 && <em className="duel-stray-count">{t.strayCount(guard.strays)}</em>}
      </div>

      {/* Back inside the grace period. Nothing has happened yet — this is the
          warning that says what nearly did. */}
      {guard.lastStray !== null && !guard.away && (
        <div className="challenge-backdrop" role="alertdialog" aria-modal="true">
          <div className="challenge-card">
            <p className="eyebrow" style={{ color: "#ff875c" }}>⚠ {t.strayTitle}</p>
            <p style={{ margin: "14px 0 20px" }}>
              {t.strayBody(guard.lastStray, guard.strays, Math.round(AWAY_GRACE_MS / 1000))}
            </p>
            <div className="match-actions">
              <button className="primary" onClick={guard.clearStray}>{t.strayOk}</button>
            </div>
          </div>
        </div>
      )}

      <div className="duel-layout">
        <section className="arena">
          <div className="players">
            <div className="player">
              <b>{t.you}</b>
              <div className="score">{me?.score ?? 0}</div>
              <span className="muted">{me?.rating ?? "—"} Elo</span>
            </div>
            <span className="versus">{t.vs}</span>
            <div className="player">
              <b>{them?.is_bot ? `🤖 ${t.bot}` : nameOf(them, lang)}</b>
              <div className="score">{them?.score ?? 0}</div>
              <span className="muted">{them?.rating ?? "—"} Elo</span>
            </div>
          </div>

          <div className="duel-steps">
            {duel.rounds_detail.map((r) => {
              const mine = r.claimed_by_seat === duel.my_seat;
              const theirs = r.claimed_by_seat !== null && !mine;
              const open = unlocked(r);
              const state = mine ? "mine" : theirs ? "theirs" : open ? "open" : "locked";
              const p = problemFor(r.problem_key);
              return (
                <button
                  key={r.round}
                  className={`step ${state}`}
                  disabled={!open}
                  aria-disabled={!open}
                  title={open ? undefined : t.locked}
                  onClick={() => { if (open) setPicked(r.round); }}
                >
                  {/* A locked step says its number and what it is worth and
                      nothing else — the difficulty is a fact about a problem
                      that has not been handed out yet. */}
                  <b>{String(r.round + 1).padStart(2, "0")}{open ? ` · ${(p?.difficulty || "").toUpperCase()}` : ""}</b>
                  <span>{r.points} {t.points}</span>
                  <span className="claim">
                    {mine ? t.youSolved : theirs ? t.opponentSolved : open ? t.open : t.locked}
                  </span>
                </button>
              );
            })}
          </div>

          {problem ? (
            /* Statement on one side, the editor and its console on the other.
               Stacked, the two halves of the same task were a scroll apart —
               and reading a bound while checking your loop against it is most
               of what solving one of these actually is. */
            <div className="duel-work">
              <div className="duel-problem">
              <span className="tag">{problem.id} · {problem.difficulty.toUpperCase()} · {problem.rating}</span>
              <h2>{lang === "uz" ? problem.uz : problem.en}</h2>
              <p>{lang === "uz" ? problem.statementUz : problem.statementEn}</p>
              <p><b>{tr(lang,"algoYolApp.kirish")}:</b> {lang === "uz" ? problem.inputUz : problem.inputEn}</p>
              <p><b>{tr(lang,"algoYolApp.chiqish")}:</b> {lang === "uz" ? problem.outputUz : problem.outputEn}</p>
              {problem.constraints && <p className="muted">{problem.constraints}</p>}
              {problem.samples?.[0] && (
                <pre className="sample">{problem.samples[0].input}{"\n"}{problem.samples[0].output}</pre>
              )}
              </div>

              {/* Keyed by round and language: a new problem gets a clean editor
                  because React remounts it, not because something reset it. */}
              <RoundEditor
                key={`${roundId}:${codeLang}`}
                lang={lang} duelId={duel.id} round={roundId} codeLang={codeLang}
                onCodeLang={setCodeLang} refresh={refresh}
                sampleIn={problem.samples?.[0]?.input || ""}
                sampleOut={problem.samples?.[0]?.output || ""}
                locked={(round?.claimed_by_seat ?? null) !== null || remaining <= 0}
              />
            </div>
          ) : (
            <p className="muted">{t.noProblem}</p>
          )}
        </section>

        <aside className="side-stack">
          <div className="duel-card">
            <h3>{tr(lang,"duelArena.jonli_tasma")}</h3>
            {[...duel.opponent_activity.map((a) => ({ ...a, mine: false })),
              ...duel.my_submissions.map((a) => ({ ...a, mine: true }))]
              .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
              .slice(0, 12)
              .map((a, i) => (
                <div className="status-line" key={`${a.created_at}-${i}`}>
                  <span className="feed-time">#{a.round + 1}</span>{" "}
                  {a.mine ? t.you : nameOf(them, lang)} ·{" "}
                  <b style={{ color: a.verdict === "ACCEPTED" ? "#9aef4f" : "#ff875c" }}>{a.verdict}</b>
                </div>
              ))}
            {!duel.opponent_activity.length && !duel.my_submissions.length && (
              <p className="muted" style={{ fontSize: 13 }}>—</p>
            )}
          </div>
          <div className="duel-card">
            <button className="secondary" onClick={async () => { await forfeitDuel(duel.id); await refresh(); }}>
              {t.forfeit}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

/* One round's workspace: the editor, and a console that runs what is in it.
 *
 * Why a compiler lives inside a duel at all. The rule the site now enforces is
 * that a duel is written here and nowhere else — no VS Code on the other
 * monitor, no online compiler in the next tab. That rule is only fair if this
 * page can do the thing people open those for: run the code against an input
 * you typed and see what came out. Take that away and "stay in the tab" stops
 * being an anti-cheat measure and becomes an obstacle to solving the problem.
 *
 * Running is deliberately NOT judging. It reaches /api/judge in `run` mode,
 * which has no expected output and no access to the hidden tests, so no amount
 * of running tells anyone what the tests contain. The verdict still only comes
 * from submitting.
 *
 * Its own component so that moving to the next problem is a remount — the
 * alternative is an effect that watches the round and resets the code, the
 * verdict, the console and the pending flag, which is four chances to leave one
 * of them stale.
 */
function RoundEditor({
  lang, duelId, round, codeLang, onCodeLang, refresh, locked, sampleIn, sampleOut,
}: {
  lang: Lang; duelId: string; round: number; codeLang: CodeLang;
  onCodeLang: (next: CodeLang) => void; refresh: () => Promise<void>; locked: boolean;
  sampleIn: string; sampleOut: string;
}) {
  const t = T[lang];
  const [code, setCode] = useState(STARTER[codeLang]);
  const [verdict, setVerdict] = useState("");
  const [sending, setSending] = useState(false);

  // The sample is already on screen above; starting the input box with it
  // means the first run is one keystroke away instead of a copy job.
  const [stdin, setStdin] = useState(withNewline(sampleIn));
  const [out, setOut] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    if (running || sending) return;
    setRunning(true);
    setOut(null);
    try {
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "run", language: codeLang, sourceCode: code, stdin }),
      });
      const data = await response.json();
      setOut(response.ok
        ? {
            stdout: String(data.stdout || ""), stderr: String(data.stderr || ""),
            status: String(data.status || ""), runtimeMs: Number(data.runtimeMs) || 0,
            memoryKb: Number(data.memoryKb) || 0,
          }
        : { stdout: "", stderr: String(data.error || "…"), status: "", runtimeMs: 0, memoryKb: 0 });
    } catch {
      setOut({ stdout: "", stderr: "network", status: "", runtimeMs: 0, memoryKb: 0 });
    } finally {
      setRunning(false);
    }
  };

  const send = async () => {
    if (sending) return;
    setSending(true);
    setVerdict(t.judging);
    const outcome = await submitToDuel(duelId, round, codeLang, code);
    setSending(false);
    if (!outcome || !("verdict" in outcome) || !outcome.verdict) {
      setVerdict(outcome && "error" in outcome && outcome.error ? String(outcome.error) : "network");
      await refresh();
      return;
    }
    setVerdict(
      outcome.verdict === "ACCEPTED"
        ? `✅ ${outcome.verdict} · ${outcome.passed}/${outcome.total}`
        : `❌ ${outcome.verdict}${outcome.test ? ` · test ${outcome.test}` : ""}`,
    );
    await refresh();
  };

  // Only meaningful when the input actually IS the sample — comparing your
  // output against the sample's while feeding the program something else would
  // report a mismatch that is not one.
  const onSample = normalise(stdin) === normalise(sampleIn);
  const agrees = out && !out.stderr && sampleOut && onSample
    ? normalise(out.stdout) === normalise(sampleOut)
    : null;

  return (
    <div className="duel-code">
      <CodeEditor
        code={code} setCode={setCode}
        lang={codeLang} setLang={(next) => onCodeLang(next as CodeLang)}
        onSubmit={send} submitLabel={t.submit} busy={sending || locked}
        onRun={run} runLabel={`${t.run} ▶`} runBusy={running}
        verdict={verdict || (out ? `${out.status} · ${out.runtimeMs} ms · ${out.memoryKb} KB` : "")}
        // The same height the compiler page gives it. A duel is where you most
        // need to see the whole solution at once, so it should not be the one
        // screen that shows the least of it.
        minHeight={420}
      />

      <div className="duel-console">
        <div className="dc-pane">
          <div className="dc-head">
            <h4>{t.stdin}</h4>
            {sampleIn && !onSample && (
              <button className="dc-mini" onClick={() => setStdin(withNewline(sampleIn))}>{t.useSample}</button>
            )}
          </div>
          <textarea
            aria-label={t.stdin} value={stdin} spellCheck={false}
            onChange={(e) => setStdin(e.target.value)}
          />
        </div>

        <div className="dc-pane">
          <div className="dc-head">
            <h4>{t.stdout}</h4>
            {agrees !== null && (
              <span className={`dc-verdict ${agrees ? "ok" : "bad"}`}>
                {agrees ? `✓ ${t.matches}` : `≠ ${t.differs}`}
              </span>
            )}
          </div>
          <pre className={out?.stdout ? "" : "muted"}>{running ? t.running : out?.stdout || t.noRun}</pre>
        </div>

        {sampleOut && (
          <div className="dc-pane">
            <div className="dc-head"><h4>{t.expected}</h4></div>
            <pre>{sampleOut}</pre>
          </div>
        )}

        {out?.stderr && (
          <div className="dc-pane dc-err">
            <div className="dc-head"><h4>{t.stderr}</h4></div>
            <pre>{out.stderr}</pre>
          </div>
        )}
      </div>

      <p className="dc-note muted">{t.runNote} <span className="dc-keys">{t.shortcuts}</span></p>
    </div>
  );
}

type RunResult = { stdout: string; stderr: string; status: string; runtimeMs: number; memoryKb: number };

/* Trailing spaces and a missing final newline are not wrong answers, and the
   judge does not treat them as such either — so the "matches the sample" hint
   must not call them one, or it teaches a rule the judge does not have. */
const normalise = (text: string) =>
  text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");

/** stdin a program can read: the sample as it is shown, plus the newline a
 *  terminal would have added when you pressed enter. */
const withNewline = (text: string) => (text ? `${text.replace(/\n+$/, "")}\n` : "");

/* ------------------------------------------------------------------- result */
function ResultScreen({
  lang, result, onRematch, onExit, note,
}: { lang: Lang; result: DuelResult; onRematch: () => void; onExit: () => void; note?: string }) {
  const t = T[lang];
  const me = result.players.find((p) => p.seat === result.my_seat);
  const them = result.players.find((p) => p.seat !== result.my_seat);
  const rated = (me?.rating_after ?? null) !== null && (me?.delta ?? 0) !== 0;

  return (
    <div className="duel-result panel">
      <p className="eyebrow" style={{ color: "#637068" }}>{result.mode === "bot" ? "AI duel" : "Reytingli duel"}</p>
      <h2>{result.outcome === "win" ? t.won : result.outcome === "loss" ? t.lost : t.draw}</h2>
      <div className="result-score">{me?.score ?? 0} : {them?.score ?? 0}</div>
      {note && <p className="notice notice-error result-why">{note}</p>}
      <p className="muted">
        {t.you} {t.vs} {them?.is_bot ? `🤖 ${t.bot}` : nameOf(them, lang)} · {them?.rating ?? "—"} Elo
      </p>

      <div className="duel-stats">
        <div><b>{me?.score ?? 0}</b><small>{t.you}</small></div>
        <div><b>{them?.score ?? 0}</b><small>{them?.is_bot ? t.bot : nameOf(them, lang)}</small></div>
        <div>
          <b style={{ color: (me?.delta ?? 0) >= 0 ? "#9aef4f" : "#ff875c" }}>
            {rated ? `${(me?.delta ?? 0) > 0 ? "+" : ""}${me?.delta ?? 0}` : "—"}
          </b>
          <small>{t.ratingChange}</small>
        </div>
      </div>
      {!rated && <p className="muted">{t.unrated}</p>}

      <div className="match-actions">
        <button className="primary" onClick={onRematch}>{t.rematch}</button>
        <button className="secondary" onClick={onExit}>{t.leave}</button>
      </div>
    </div>
  );
}
