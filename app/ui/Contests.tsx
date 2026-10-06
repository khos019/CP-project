"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- see the note in ./Chrome */

import { useEffect, useState } from "react";
import { tr, type Lang } from "./i18n";
import { supabaseConfig } from "./session";
import { ratingColor } from "./rating";
import { linkTo } from "./Chrome";
import { bankProblems } from "./problem-bank";
import { verdictLabel } from "./social-ui";

/* Past rounds and their standings.
 *
 * Nothing on this screen is stored as a result. contest_standings() (044)
 * computes the board from bank_submissions every time it is asked, so a cell
 * that says "+2 01:14" is three real rows on that person's submissions page —
 * which is where the cell links to.
 *
 * Both reads are public: a signed-out visitor sees the archive too. */

type ContestSummary = {
  slug: string; number: number; title_uz: string; title_en: string;
  starts_at: string; duration_minutes: number; archived: boolean;
  participants: number; problems: { idx: string; rating: number }[];
  /** From 047; absent until it is applied, and the card simply leaves it out. */
  winner?: { username: string; display_name: string } | null;
};
type ContestProblem = {
  idx: string; bank_id: string; problem_key: string; title_uz: string; title_en: string;
  rating: number; solved: number; tried: number;
};
type Cell = { ok: boolean; wrong: number; minute: number | null };
type StandingRow = {
  place: number; user_id: string; username: string; display_name: string; avatar_url: string | null;
  solved: number; penalty: number; cells: Record<string, Cell>;
};
type Standings = {
  contest: Omit<ContestSummary, "participants" | "problems" | "winner"> & { penalty_minutes: number };
  problems: ContestProblem[];
  rows: StandingRow[];
};

type Load<T> = { state: "loading" } | { state: "ready"; data: T } | { state: "not-migrated" | "error" | "missing" };

async function publicRpc<T>(name: string, args: Record<string, unknown> = {}): Promise<Load<T>> {
  const { url, key } = supabaseConfig();
  if (!url || !key) return { state: "error" };
  try {
    const res = await fetch(`${url}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify(args),
    });
    // Until 044 is applied the function does not exist, and the page says so
    // rather than looking broken.
    if (res.status === 404) return { state: "not-migrated" };
    if (!res.ok) return { state: "error" };
    const data = (await res.json()) as T | null;
    return data === null ? { state: "missing" } : { state: "ready", data };
  } catch {
    return { state: "error" };
  }
}

/* Rounds are announced in Tashkent time, so they are shown in it too —
   a visitor abroad still reads the time the round actually ran at. Browsers
   spell the uz-UZ locale as "2026 M09 20", so the parts come from Intl (for
   the time zone) and the words are ours. */
const UZ_MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
const UZ_SHORT = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];
const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const tashkent = (iso: string) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tashkent", year: "numeric", month: "numeric", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return { y: Number(p.year), m: Number(p.month) - 1, d: Number(p.day), time: `${p.hour}:${p.minute}` };
};

const when = (iso: string, lang: Lang) => {
  const { y, m, d, time } = tashkent(iso);
  return lang === "uz" ? `${d}-${UZ_MONTHS[m]}, ${y} · ${time}` : `${d} ${EN_MONTHS[m]} ${y} · ${time}`;
};

const lasting = (minutes: number, lang: Lang) => {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return m ? tr(lang, "contests.duration_hm", { h, m }) : tr(lang, "contests.duration_h", { h });
};

const clock = (minute: number) =>
  `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;

function Waiting({ lang, load, notMigrated = "contests.not_migrated" }: { lang: Lang; load: Load<unknown>; notMigrated?: string }) {
  if (load.state === "loading") {
    return <div className="screen-state" role="status"><span className="spinner" aria-hidden /><p className="muted">{tr(lang, "algoYolApp.yuklanmoqda")}</p></div>;
  }
  const key = load.state === "not-migrated" ? notMigrated
    : load.state === "missing" ? "contests.not_found" : "contests.load_error";
  return <div className="panel"><div className={`notice ${load.state === "error" ? "notice-error" : ""}`}>{tr(lang, key)}</div></div>;
}

/* A round's three pages, as on Codeforces: the problems at its root, then
   the standings and every submission sent during it. */
export type ContestTab = "problems" | "standings" | "status";

export function Contests({ lang, slug, tab, onTab, onOpenContest, onOpenList, onOpenSubmissions, onOpenProblem }: {
  lang: Lang;
  slug: string | null;
  tab: ContestTab;
  onTab: (tab: ContestTab) => void;
  onOpenContest: (slug: string) => void;
  onOpenList: () => void;
  onOpenSubmissions: (handle: string) => void;
  onOpenProblem: (bankId: string) => void;
}) {
  return slug
    ? <ContestRound key={slug} lang={lang} slug={slug} tab={tab} onTab={onTab} onOpenList={onOpenList} onOpenSubmissions={onOpenSubmissions} onOpenProblem={onOpenProblem} />
    : <ContestList lang={lang} onOpenContest={onOpenContest} />;
}

/* ------------------------------------------------------------------ list */

function ContestList({ lang, onOpenContest }: { lang: Lang; onOpenContest: (slug: string) => void }) {
  const [load, setLoad] = useState<Load<ContestSummary[]>>({ state: "loading" });
  useEffect(() => {
    let live = true;
    void publicRpc<ContestSummary[]>("contest_list").then((got) => { if (live) setLoad(got); });
    return () => { live = false; };
  }, []);

  const head = <div className="page-head"><div>
    <p className="eyebrow">{tr(lang, "contests.eyebrow")}</p>
    <h1 className="page-title">{tr(lang, "contests.title")}</h1>
    <p className="muted">{tr(lang, "contests.lead")}</p>
  </div></div>;

  if (load.state !== "ready") return <>{head}<Waiting lang={lang} load={load} /></>;
  const list = load.data;
  if (!list.length) return <>{head}<div className="screen-state panel"><p className="muted">{tr(lang, "contests.empty")}</p></div></>;

  // Newest first, under a heading per year: a long archive reads by season.
  const years: { year: number; items: ContestSummary[] }[] = [];
  for (const c of list) {
    const y = tashkent(c.starts_at).y;
    if (!years.length || years[years.length - 1].year !== y) years.push({ year: y, items: [] });
    years[years.length - 1].items.push(c);
  }
  const entries = list.reduce((s, c) => s + c.participants, 0);
  const problems = list.reduce((s, c) => s + c.problems.length, 0);

  return <>
    {head}
    <div className="cx-summary">
      <div className="cx-stat"><b>{list.length}</b><span>{tr(lang, "contests.stat_rounds")}</span></div>
      <div className="cx-stat"><b>{entries}</b><span>{tr(lang, "contests.stat_entries")}</span></div>
      <div className="cx-stat"><b>{problems}</b><span>{tr(lang, "contests.stat_problems")}</span></div>
    </div>

    {years.map(({ year, items }) => <section key={year} aria-label={String(year)}>
      <h2 className="cx-year">{year}</h2>
      <div className="cx-list">{items.map((c) => {
        const t = tashkent(c.starts_at);
        const winner = c.winner ? (c.winner.display_name?.trim() || c.winner.username) : null;
        return <a key={c.slug} className="cx-card" href={`/contests/${c.slug}`} onClick={linkTo(() => onOpenContest(c.slug))}>
          <div className="cx-date" aria-hidden>
            <b>{t.d}</b>
            <span>{lang === "uz" ? UZ_SHORT[t.m] : EN_MONTHS[t.m]}</span>
          </div>
          <div className="cx-main">
            <b className="cx-title">{lang === "uz" ? c.title_uz : c.title_en}</b>
            <span className="cx-meta">
              <span>{t.time}</span>
              <span>{lasting(c.duration_minutes, lang)}</span>
              <span>{tr(lang, "contests.participants_n", { n: c.participants })}</span>
            </span>
            {winner && <span className="cx-winner">{tr(lang, "contests.winner")}: <b>{winner}</b></span>}
          </div>
          <div className="cx-side">
            <span className="cx-chips" aria-label={tr(lang, "contests.problems")}>
              {c.problems.map((p) => <span key={p.idx} className="cx-chip" style={{ color: ratingColor(p.rating) }} title={`${p.idx} · ${p.rating}`}>{p.idx}</span>)}
            </span>
            {c.archived && <span className="tag">{tr(lang, "contests.archive")}</span>}
          </div>
        </a>;
      })}</div>
    </section>)}
  </>;
}

/* ------------------------------------------------------------------ one round */

type StatusRow = {
  id: string; created_at: string; minute: number; idx: string; username: string; display_name: string;
  language: string; verdict: string; passed: number | null; total: number | null;
  runtime_ms: number | null; memory_kb: number | null;
};
type StatusPage = { total: number; rows: StatusRow[] };

const LANGS: Record<string, string> = { cpp20: "C++20", python3: "Python 3" };
const STATUS_PAGE = 50;

function ContestRound({ lang, slug, tab, onTab, onOpenList, onOpenSubmissions, onOpenProblem }: {
  lang: Lang; slug: string; tab: ContestTab; onTab: (tab: ContestTab) => void; onOpenList: () => void;
  onOpenSubmissions: (handle: string) => void; onOpenProblem: (bankId: string) => void;
}) {
  // One read feeds the problems and the standings: the same board, so the
  // "×54" beside a problem and the 54 green cells in its column agree.
  const [load, setLoad] = useState<Load<Standings>>({ state: "loading" });
  useEffect(() => {
    let live = true;
    void publicRpc<Standings>("contest_standings", { p_slug: slug }).then((got) => { if (live) setLoad(got); });
    return () => { live = false; };
  }, [slug]);

  const back = <a className="back-link" href="/contests" onClick={linkTo(onOpenList)}>← {tr(lang, "contests.all")}</a>;
  if (load.state !== "ready") return <>{back}<Waiting lang={lang} load={load} /></>;
  const board = load.data;
  const { contest } = board;

  const tabs: ContestTab[] = ["problems", "standings", "status"];
  const hrefOf = (t: ContestTab) => `/contests/${encodeURIComponent(slug)}${t === "problems" ? "" : `/${t}`}`;

  return <>
    {back}
    <div className="cx-round-head">
      <p className="eyebrow">{tr(lang, "contests.round_n", { n: contest.number })}{contest.archived ? ` · ${tr(lang, "contests.archive")}` : ""}</p>
      <h1 className="page-title">{lang === "uz" ? contest.title_uz : contest.title_en}</h1>
    </div>
    <nav className="cx-tabs" aria-label={tr(lang, "contests.title")}>
      {tabs.map((t) => (
        <a key={t} href={hrefOf(t)} className={tab === t ? "on" : undefined} aria-current={tab === t ? "page" : undefined}
          onClick={linkTo(() => { if (tab !== t) onTab(t); })}>
          {tr(lang, `contests.tab_${t}`)}
        </a>
      ))}
    </nav>

    {tab === "problems" && <ProblemsTab lang={lang} board={board} onOpenProblem={onOpenProblem} onOpenSubmissions={onOpenSubmissions} />}
    {tab === "standings" && <StandingsTab lang={lang} board={board} onOpenSubmissions={onOpenSubmissions} />}
    {tab === "status" && <StatusTab lang={lang} slug={slug} board={board} onOpenSubmissions={onOpenSubmissions} />}
  </>;
}

/* The round's front page: the problems, and beside them what Codeforces puts
   in its sidebar — the round's state, its numbers and how to practise it. */
function ProblemsTab({ lang, board, onOpenProblem, onOpenSubmissions }: {
  lang: Lang; board: Standings; onOpenProblem: (bankId: string) => void; onOpenSubmissions: (handle: string) => void;
}) {
  const { contest, problems, rows } = board;
  const people = rows.length;
  const winner = rows[0];
  const limitsOf = (bankId: string) => {
    const b = bankProblems.find((x) => x.id === bankId);
    if (!b) return null;
    const secs = (b.timeLimitMs ?? 1000) / 1000;
    return tr(lang, "contests.limits", { s: secs, mb: b.memoryMb ?? 256 });
  };

  return <div className="cx-dash">
    <div className="cx-dash-main">
      <div className="cx-ptable" role="table" aria-label={tr(lang, "contests.problems")}>
        <div className="cx-prow cx-prow-head" role="row">
          <span role="columnheader">#</span>
          <span role="columnheader">{tr(lang, "contests.col_name")}</span>
          <span role="columnheader" className="cx-r">{tr(lang, "contests.col_rating")}</span>
          <span role="columnheader" className="cx-r">{tr(lang, "contests.col_solved")}</span>
        </div>
        {problems.map((p) => {
          const share = people ? p.solved / people : 0;
          return <a key={p.idx} role="row" className="cx-prow" href={`/problem/${p.bank_id}`} onClick={linkTo(() => onOpenProblem(p.bank_id))}>
            <span role="cell" className="cx-idx" style={{ borderColor: ratingColor(p.rating) }}>{p.idx}</span>
            <span role="cell" className="cx-pname">
              <b>{lang === "uz" ? p.title_uz : p.title_en}</b>
              <small>{limitsOf(p.bank_id)}</small>
            </span>
            <span role="cell" className="cx-r cx-rating" style={{ color: ratingColor(p.rating) }}>{p.rating}</span>
            <span role="cell" className="cx-r cx-solved" title={tr(lang, "contests.solved_by", { n: p.solved, of: people })}>
              <span className="cx-solved-n">×{p.solved}</span>
              <span className="cx-solve-bar"><i style={{ width: `${Math.round(share * 100)}%` }} /></span>
            </span>
          </a>;
        })}
      </div>
    </div>

    <aside className="cx-dash-side">
      <section className="cx-box">
        <header><b>{lang === "uz" ? contest.title_uz : contest.title_en}</b><span className="cx-state">{tr(lang, "contests.finished")}</span></header>
        <dl>
          <div><dt>{tr(lang, "contests.started")}</dt><dd>{when(contest.starts_at, lang)}</dd></div>
          <div><dt>{tr(lang, "contests.length")}</dt><dd>{lasting(contest.duration_minutes, lang)}</dd></div>
          <div><dt>{tr(lang, "contests.participant")}</dt><dd>{people}</dd></div>
          <div><dt>{tr(lang, "contests.format")}</dt><dd>ICPC</dd></div>
          {winner && <div><dt>{tr(lang, "contests.winner")}</dt><dd>
            <a href={`/u/${encodeURIComponent(winner.username)}/submissions`} onClick={linkTo(() => onOpenSubmissions(winner.username))}>
              {winner.display_name?.trim() || winner.username}
            </a>
          </dd></div>}
        </dl>
      </section>
      <section className="cx-box">
        <header><b>{tr(lang, "contests.practice_title")}</b></header>
        <p>{tr(lang, "contests.practice_text")}</p>
        {problems[0] && <a className="primary cx-practice" href={`/problem/${problems[0].bank_id}`} onClick={linkTo(() => onOpenProblem(problems[0].bank_id))}>
          {tr(lang, "contests.practice_start", { idx: problems[0].idx })}
        </a>}
      </section>
      <section className="cx-box">
        <header><b>{tr(lang, "contests.rules_toggle")}</b></header>
        <p>{tr(lang, "contests.rules", { n: contest.penalty_minutes })}</p>
      </section>
    </aside>
  </div>;
}

function StandingsTab({ lang, board, onOpenSubmissions }: {
  lang: Lang; board: Standings; onOpenSubmissions: (handle: string) => void;
}) {
  const { contest, problems, rows } = board;
  const titleOf = (p: ContestProblem) => (lang === "uz" ? p.title_uz : p.title_en);

  // Who took each problem first. Marked on the board, as most judges do.
  const firstMinute: Record<string, number> = {};
  for (const r of rows) for (const [idx, c] of Object.entries(r.cells)) {
    if (c.ok && c.minute !== null && (firstMinute[idx] === undefined || c.minute < firstMinute[idx])) firstMinute[idx] = c.minute;
  }

  return <>
    <div className="cx-section-head">
      <span className="muted cx-count">{tr(lang, "contests.participants_n", { n: rows.length })}</span>
      <details className="cx-rules">
        <summary>{tr(lang, "contests.rules_toggle")}</summary>
        <p>{tr(lang, "contests.rules", { n: contest.penalty_minutes })} {tr(lang, "contests.first_note")}</p>
      </details>
    </div>

    {rows.length === 0 ? <div className="screen-state panel"><p className="muted">{tr(lang, "contests.no_rows")}</p></div>
      : <div className="standings-wrap"><table className="standings">
        <thead><tr>
          <th className="st-place">#</th>
          <th className="st-who">{tr(lang, "contests.participant")}</th>
          <th className="st-num" title={tr(lang, "contests.solved")}>=</th>
          <th className="st-num">{tr(lang, "contests.penalty")}</th>
          {problems.map((p) => <th key={p.idx} className="st-cell" title={titleOf(p)}>
            {p.idx}<small>{p.solved}</small>
          </th>)}
        </tr></thead>
        <tbody>{rows.map((r) => {
          const name = r.display_name?.trim() || r.username;
          return <tr key={r.user_id} className={r.place <= 3 ? `st-top st-top-${r.place}` : undefined}>
            <td className="st-place">{r.place <= 3 ? <span className={`st-medal st-medal-${r.place}`}>{r.place}</span> : r.place}</td>
            <td className="st-who">
              <a href={`/u/${encodeURIComponent(r.username)}/submissions`} onClick={linkTo(() => onOpenSubmissions(r.username))} title={tr(lang, "contests.open_submissions", { name })}>
                <b>{name}</b> <span className="muted">@{r.username}</span>
              </a>
            </td>
            <td className="st-num"><b>{r.solved}</b></td>
            <td className="st-num st-pen">{r.penalty}</td>
            {problems.map((p) => {
              const c = r.cells[p.idx];
              if (!c) return <td key={p.idx} className="st-cell" />;
              if (c.ok) {
                const first = c.minute !== null && c.minute === firstMinute[p.idx];
                return <td key={p.idx} className={`st-cell st-ok${first ? " st-first" : ""}`} title={first ? tr(lang, "contests.first_solve") : undefined}>
                  <span>{c.wrong ? `+${c.wrong}` : "+"}</span>
                  {c.minute !== null && <small>{clock(c.minute)}</small>}
                </td>;
              }
              return <td key={p.idx} className="st-cell st-bad"><span>−{c.wrong}</span></td>;
            })}
          </tr>;
        })}</tbody>
      </table></div>}
  </>;
}

/* Every attempt sent during the round, newest first: Codeforces' "Status".
   The code itself is not here; the participant's own submissions page holds
   it, behind the usual unlock rule. */
function StatusTab({ lang, slug, board, onOpenSubmissions }: {
  lang: Lang; slug: string; board: Standings; onOpenSubmissions: (handle: string) => void;
}) {
  const [idx, setIdx] = useState("");
  const [verdict, setVerdict] = useState("");
  const [page, setPage] = useState(0);
  // The answer is kept with the question it answers, so a new filter shows
  // "loading" until its own page arrives rather than the last one's rows.
  const query = `${idx}|${verdict}|${page}`;
  const [answer, setAnswer] = useState<{ query: string; load: Load<StatusPage> } | null>(null);
  useEffect(() => {
    let live = true;
    void publicRpc<StatusPage>("contest_status", {
      p_slug: slug, p_idx: idx || null, p_verdict: verdict || null,
      p_limit: STATUS_PAGE, p_offset: page * STATUS_PAGE,
    }).then((got) => { if (live) setAnswer({ query, load: got }); });
    return () => { live = false; };
  }, [slug, idx, verdict, page, query]);
  const load: Load<StatusPage> = answer && answer.query === query ? answer.load : { state: "loading" };

  const titleOf = (i: string) => {
    const p = board.problems.find((x) => x.idx === i);
    return p ? (lang === "uz" ? p.title_uz : p.title_en) : i;
  };
  const stamp = (iso: string) => {
    const { d, m, time } = tashkent(iso);
    return `${d} ${lang === "uz" ? UZ_SHORT[m] : EN_MONTHS[m]} ${time}`;
  };
  const total = load.state === "ready" ? load.data.total : 0;
  const pages = Math.max(1, Math.ceil(total / STATUS_PAGE));

  return <>
    <div className="cx-filters">
      <label>
        <span>{tr(lang, "contests.col_problem")}</span>
        <select value={idx} onChange={(e) => { setIdx(e.target.value); setPage(0); }}>
          <option value="">{tr(lang, "contests.filter_all")}</option>
          {board.problems.map((p) => <option key={p.idx} value={p.idx}>{p.idx} — {lang === "uz" ? p.title_uz : p.title_en}</option>)}
        </select>
      </label>
      <label>
        <span>{tr(lang, "contests.col_verdict")}</span>
        <select value={verdict} onChange={(e) => { setVerdict(e.target.value); setPage(0); }}>
          <option value="">{tr(lang, "contests.filter_all")}</option>
          <option value="ACCEPTED">{tr(lang, "contests.filter_ok")}</option>
          <option value="REJECTED">{tr(lang, "contests.filter_bad")}</option>
        </select>
      </label>
      {load.state === "ready" && <span className="muted cx-count">{tr(lang, "contests.status_total", { n: total })}</span>}
    </div>

    {load.state !== "ready" ? <Waiting lang={lang} load={load} notMigrated="contests.status_not_migrated" />
      : load.data.rows.length === 0 ? <div className="screen-state panel"><p className="muted">{tr(lang, "contests.status_none")}</p></div>
      : <div className="cx-status-wrap"><table className="cx-status">
        <thead><tr>
          <th>{tr(lang, "contests.col_when")}</th>
          <th>{tr(lang, "contests.participant")}</th>
          <th>{tr(lang, "contests.col_problem")}</th>
          <th>{tr(lang, "contests.col_lang")}</th>
          <th>{tr(lang, "contests.col_verdict")}</th>
          <th className="cx-r">{tr(lang, "contests.col_time")}</th>
          <th className="cx-r">{tr(lang, "contests.col_memory")}</th>
        </tr></thead>
        <tbody>{load.data.rows.map((r) => {
          const ok = r.verdict === "ACCEPTED";
          return <tr key={r.id}>
            <td className="cs-when"><span className="mono">{stamp(r.created_at)}</span><small className="mono">+{clock(r.minute)}</small></td>
            <td className="cs-who">
              <a href={`/u/${encodeURIComponent(r.username)}/submissions`} onClick={linkTo(() => onOpenSubmissions(r.username))}>
                {r.display_name?.trim() || r.username}
              </a>
            </td>
            <td className="cs-prob"><b>{r.idx}</b> <span>{titleOf(r.idx)}</span></td>
            <td className="cs-lang mono">{LANGS[r.language] || r.language}</td>
            <td className="cs-verdict">
              <span className={`sub-verdict ${ok ? "ok" : "bad"}`}>
                {verdictLabel(r.verdict, lang)}
                {!ok && r.passed !== null && r.total !== null && <small className="mono"> {r.passed}/{r.total}</small>}
              </span>
            </td>
            <td className="cs-time cx-r mono">{r.runtime_ms === null ? "—" : `${r.runtime_ms} ms`}</td>
            <td className="cs-mem cx-r mono">{r.memory_kb === null ? "—" : `${r.memory_kb} KB`}</td>
          </tr>;
        })}</tbody>
      </table></div>}

    {load.state === "ready" && pages > 1 && <nav className="leader-pager" aria-label={tr(lang, "contests.tab_status")}>
      <button type="button" className="secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>← {tr(lang, "contests.prev")}</button>
      <span className="muted">{page * STATUS_PAGE + 1}–{Math.min(total, (page + 1) * STATUS_PAGE)} / {total}</span>
      <button type="button" className="secondary" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>{tr(lang, "contests.next")} →</button>
    </nav>}
  </>;
}
