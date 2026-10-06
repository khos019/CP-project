"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- see the note in ./Chrome */

import { useEffect, useState } from "react";
import { tr, type Lang } from "./i18n";
import { supabaseConfig } from "./session";
import { ratingColor } from "./rating";
import { linkTo } from "./Chrome";

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

function Waiting({ lang, load }: { lang: Lang; load: Load<unknown> }) {
  if (load.state === "loading") {
    return <div className="screen-state" role="status"><span className="spinner" aria-hidden /><p className="muted">{tr(lang, "algoYolApp.yuklanmoqda")}</p></div>;
  }
  const key = load.state === "not-migrated" ? "contests.not_migrated"
    : load.state === "missing" ? "contests.not_found" : "contests.load_error";
  return <div className="panel"><div className={`notice ${load.state === "error" ? "notice-error" : ""}`}>{tr(lang, key)}</div></div>;
}

export function Contests({ lang, slug, onOpenContest, onOpenList, onOpenSubmissions, onOpenProblem }: {
  lang: Lang;
  slug: string | null;
  onOpenContest: (slug: string) => void;
  onOpenList: () => void;
  onOpenSubmissions: (handle: string) => void;
  onOpenProblem: (bankId: string) => void;
}) {
  return slug
    ? <ContestStandings key={slug} lang={lang} slug={slug} onOpenList={onOpenList} onOpenSubmissions={onOpenSubmissions} onOpenProblem={onOpenProblem} />
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

/* ------------------------------------------------------------------ standings */

function ContestStandings({ lang, slug, onOpenList, onOpenSubmissions, onOpenProblem }: {
  lang: Lang; slug: string; onOpenList: () => void;
  onOpenSubmissions: (handle: string) => void; onOpenProblem: (bankId: string) => void;
}) {
  const [load, setLoad] = useState<Load<Standings>>({ state: "loading" });
  useEffect(() => {
    let live = true;
    void publicRpc<Standings>("contest_standings", { p_slug: slug }).then((got) => { if (live) setLoad(got); });
    return () => { live = false; };
  }, [slug]);

  const back = <a className="back-link" href="/contests" onClick={linkTo(onOpenList)}>← {tr(lang, "contests.all")}</a>;
  if (load.state !== "ready") return <>{back}<Waiting lang={lang} load={load} /></>;

  const { contest, problems, rows } = load.data;
  const people = rows.length;
  const titleOf = (p: ContestProblem) => (lang === "uz" ? p.title_uz : p.title_en);

  // Who took each problem first. Marked on the board, as most judges do.
  const firstMinute: Record<string, number> = {};
  for (const r of rows) for (const [idx, c] of Object.entries(r.cells)) {
    if (c.ok && c.minute !== null && (firstMinute[idx] === undefined || c.minute < firstMinute[idx])) firstMinute[idx] = c.minute;
  }

  return <>
    {back}
    <div className="page-head cx-hero"><div>
      <p className="eyebrow">{tr(lang, "contests.round_n", { n: contest.number })}{contest.archived ? ` · ${tr(lang, "contests.archive")}` : ""}</p>
      <h1 className="page-title">{lang === "uz" ? contest.title_uz : contest.title_en}</h1>
      <div className="cx-facts">
        <span className="cx-fact">{when(contest.starts_at, lang)}</span>
        <span className="cx-fact">{lasting(contest.duration_minutes, lang)}</span>
        <span className="cx-fact"><b>{people}</b> {tr(lang, "contests.participants_word")}</span>
        <span className="cx-fact">ICPC</span>
      </div>
    </div></div>

    <div className="cx-section-head"><h2>{tr(lang, "contests.problems")}</h2></div>
    <div className="cx-problems">{problems.map((p) => {
      const share = people ? p.solved / people : 0;
      return <a key={p.idx} className="cx-problem" href={`/problem/${p.bank_id}`} onClick={linkTo(() => onOpenProblem(p.bank_id))}>
        <span className="cx-idx" style={{ borderColor: ratingColor(p.rating) }}>{p.idx}</span>
        <span className="cx-ptitle">{titleOf(p)}</span>
        <span className="cx-rating" style={{ color: ratingColor(p.rating) }}>{p.rating}</span>
        <span className="cx-solve" title={tr(lang, "contests.solved_of_tried")}>
          <span className="cx-solve-bar"><i style={{ width: `${Math.round(share * 100)}%` }} /></span>
          <small>{tr(lang, "contests.solved_by", { n: p.solved, of: people })}</small>
        </span>
      </a>;
    })}</div>

    <div className="cx-section-head">
      <h2>{tr(lang, "contests.results")}</h2>
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
