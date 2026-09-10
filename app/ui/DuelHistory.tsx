"use client";

/* Every duel this account has finished.
 *
 * `duelRecentResult` only reaches back thirty minutes — it exists to draw the
 * result screen after a match, and it expires so that reopening the duel tab
 * the next day does not greet you with an old scoreboard. That left no way to
 * look at anything you had played, which is what this screen is for.
 *
 * The win/loss/draw label comes from the scores rather than from the winner's
 * account id. The bot has no account, so a loss to the bot used to arrive
 * indistinguishable from a draw; migration 028 records the winning seat for
 * that reason, and the scores agree with it in every case.
 */
import { useEffect, useState } from "react";
import { duelHistory, type DuelHistoryRow } from "./duel-client";
import { tr, type Lang } from "./i18n";
import { shortDateTime } from "./dates";

const T = {
  uz: {
    title: "Duellar tarixi",
    sub: "Yakunlangan barcha duellaringiz — eng yangisi birinchi.",
    back: "Profilga qaytish",
    loading: "Yuklanmoqda…",
    failed: "Tarixni olib bo‘lmadi.",
    missing: "Duellar tarixi serverda hali yoqilmagan (028-migratsiya).",
    none: "Hali duel o‘ynamagansiz",
    noneHint: "Duel bo‘limida raqib toping yoki Algo bilan mashq qiling — natijalar shu yerda to‘planadi.",
    when: "Vaqti", opponent: "Raqib", score: "Hisob", result: "Natija", change: "Reyting",
    won: "G‘alaba", lost: "Mag‘lubiyat", draw: "Durang",
    bot: "Algo", human: "Reytingli", botMode: "AI",
    wins: "g‘alaba", losses: "mag‘lubiyat", draws: "durang",
  },
  en: {
    title: "Duel history",
    sub: "Every duel you have finished, newest first.",
    back: "Back to profile",
    loading: "Loading…",
    failed: "Could not load the history.",
    missing: "Duel history is not enabled on the server yet (migration 028).",
    none: "No duels yet",
    noneHint: "Find an opponent in the duel section, or practise against Algo — results collect here.",
    when: "When", opponent: "Opponent", score: "Score", result: "Result", change: "Rating",
    won: "Win", lost: "Loss", draw: "Draw",
    bot: "Algo", human: "Rated", botMode: "AI",
    wins: "wins", losses: "losses", draws: "draws",
  },
} as const;


/* The table itself, without the screen around it.
 *
 * A profile page shows the same rows in a tab, and the row is where the
 * subtleties live — the bot has no handle to link to, a zero delta is not the
 * same as a win by nothing, a loss reads as a loss rather than as a negative
 * number. Two copies of that would drift, so there is one, and the screen and
 * the tab both render it. `rows` is structural on purpose: the private
 * duel_history row and the public one differ by a field this table does not
 * read. */
export type DuelTableRow = {
  id: string;
  my_score: number; opp_score: number;
  outcome: "win" | "loss" | "draw";
  delta: number; rating_after: number;
  opponent: string; opponent_username: string | null;
  opponent_is_bot: boolean; opponent_rating: number;
  finished_at: string;
};

export function DuelTable({
  lang, rows, onOpenPerson,
}: {
  lang: Lang;
  rows: DuelTableRow[];
  onOpenPerson: (username: string) => void;
}) {
  const t = T[lang];
  return (
    <div className="sub-table-wrap">
      <table className="sub-table">
        <thead>
          <tr>
            <th>{t.when}</th>
            <th>{t.opponent}</th>
            <th>{t.score}</th>
            <th>{t.result}</th>
            <th>{t.change}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="mono sub-when">{shortDateTime(row.finished_at, lang)}</td>
              <td>
                {row.opponent_is_bot ? (
                  <span>{t.bot} <span className="tag feed-me-tag">{t.botMode}</span></span>
                ) : row.opponent_username ? (
                  <button className="link-btn" onClick={() => onOpenPerson(row.opponent_username!)}>
                    {row.opponent || row.opponent_username}
                  </button>
                ) : (
                  <span className="muted">{row.opponent || "—"}</span>
                )}
                <small className="muted mono dh-elo"> · {row.opponent_rating} Elo</small>
              </td>
              <td className="mono">{row.my_score} : {row.opp_score}</td>
              <td>
                <span className={`sub-verdict ${row.outcome === "win" ? "ok" : row.outcome === "loss" ? "bad" : ""}`}>
                  {row.outcome === "win" ? t.won : row.outcome === "loss" ? t.lost : t.draw}
                </span>
              </td>
              <td className="mono">
                <span className={row.delta > 0 ? "dh-win" : row.delta < 0 ? "dh-loss" : "muted"}>
                  {row.delta > 0 ? "+" : ""}{row.delta}
                </span>
                <small className="muted"> → {row.rating_after}</small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DuelHistoryScreen({
  lang, onBack, onOpenPerson,
}: {
  lang: Lang;
  onBack: () => void;
  onOpenPerson: (username: string) => void;
}) {
  const t = T[lang];
  const [rows, setRows] = useState<DuelHistoryRow[] | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error" | "missing">("loading");

  useEffect(() => {
    let live = true;
    duelHistory(60).then((result) => {
      if (!live) return;
      if (Array.isArray(result)) { setRows(result); setState("ready"); return; }
      // PostgREST answers PGRST202 when the function is not in the schema, so a
      // missing migration reads as "not set up yet" rather than as a failure.
      const error = String((result as { error?: string })?.error || "");
      setState(/PGRST202|not_found|does not exist|schema cache/i.test(error) ? "missing" : "error");
    });
    return () => { live = false; };
  }, []);

  const tally = rows
    ? rows.reduce((acc, r) => { acc[r.outcome] += 1; return acc; }, { win: 0, loss: 0, draw: 0 })
    : null;

  return (
    <>
      <button className="crumb crumb-btn" onClick={onBack}>← {t.back}</button>
      <div className="page-head">
        <div>
          <p className="eyebrow">{tr(lang, "algoYolApp.duel")}</p>
          <h1 className="page-title">{t.title}</h1>
          <p className="muted feed-sub">{t.sub}</p>
        </div>
        {tally && rows && rows.length > 0 && (
          <div className="duel-tally">
            <span className="dh-win">{tally.win} {t.wins}</span>
            <span className="dh-loss">{tally.loss} {t.losses}</span>
            <span className="muted">{tally.draw} {t.draws}</span>
          </div>
        )}
      </div>

      <section className="panel">
        {state === "loading" && <p className="muted os-empty">{t.loading}</p>}
        {state === "error" && <p className="muted os-empty">{t.failed}</p>}
        {state === "missing" && <p className="muted os-empty">{t.missing}</p>}
        {state === "ready" && rows && !rows.length && (
          <div className="os-blank">
            <span className="os-blank-ic" aria-hidden>⚔</span>
            <b>{t.none}</b>
            <p>{t.noneHint}</p>
          </div>
        )}
        {state === "ready" && rows && rows.length > 0 && (
          <DuelTable lang={lang} rows={rows} onOpenPerson={onOpenPerson} />
        )}
      </section>
    </>
  );
}
