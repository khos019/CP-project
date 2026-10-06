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
  contest: Omit<ContestSummary, "participants" | "problems"> & { penalty_minutes: number };
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
   a visitor abroad still reads the time the round actually ran at. */
const UZ_MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/* Browsers spell the uz-UZ locale as "2026 M09 20", so the parts are taken
   from Intl (for the time zone) and the words are ours. */
const when = (iso: string, lang: Lang) => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tashkent", year: "numeric", month: "numeric", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date(iso)).map((p) => [p.type, p.value]));
  const m = Number(parts.month) - 1, d = Number(parts.day), time = `${parts.hour}:${parts.minute}`;
  return lang === "uz"
    ? `${d}-${UZ_MONTHS[m]}, ${parts.year} · ${time}`
    : `${d} ${EN_MONTHS[m]} ${parts.year} · ${time}`;
};

const length = (minutes: number) =>
  `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;

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

function ContestList({ lang, onOpenContest }: { lang: Lang; onOpenContest: (slug: string) => void }) {
  const [load, setLoad] = useState<Load<ContestSummary[]>>({ state: "loading" });
  useEffect(() => {
    let live = true;
    void publicRpc<ContestSummary[]>("contest_list").then((got) => { if (live) setLoad(got); });
    return () => { live = false; };
  }, []);

  return <>
    <div className="page-head"><div>
      <p className="eyebrow">{tr(lang, "contests.eyebrow")}</p>
      <h1 className="page-title">{tr(lang, "contests.title")}</h1>
      <p className="muted">{tr(lang, "contests.lead")}</p>
    </div></div>
    {load.state !== "ready" ? <Waiting lang={lang} load={load} />
      : load.data.length === 0 ? <div className="screen-state panel"><p className="muted">{tr(lang, "contests.empty")}</p></div>
      : <div className="contest-list">{load.data.map((c) => {
          const href = `/contests/${c.slug}`;
          return <a key={c.slug} className="contest-card" href={href} onClick={linkTo(() => onOpenContest(c.slug))}>
            <div className="contest-card-main">
              <b className="contest-card-title">{lang === "uz" ? c.title_uz : c.title_en}</b>
              <span className="muted contest-card-meta">
                {when(c.starts_at, lang)} · {length(c.duration_minutes)} · {tr(lang, "contests.participants_n", { n: c.participants })}
              </span>
            </div>
            <div className="contest-card-side">
              <span className="contest-chips" aria-label={tr(lang, "contests.problems")}>
                {c.problems.map((p) => <span key={p.idx} className="contest-chip" style={{ color: ratingColor(p.rating) }} title={`${p.idx} · ${p.rating}`}>{p.idx}</span>)}
              </span>
              {c.archived && <span className="tag">{tr(lang, "contests.archive")}</span>}
            </div>
          </a>;
        })}</div>}
  </>;
}

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
  return <>
    {back}
    <div className="page-head"><div>
      <p className="eyebrow">{tr(lang, "contests.round_n", { n: contest.number })}{contest.archived ? ` · ${tr(lang, "contests.archive")}` : ""}</p>
      <h1 className="page-title">{lang === "uz" ? contest.title_uz : contest.title_en}</h1>
      <p className="muted">
        {when(contest.starts_at, lang)} · {length(contest.duration_minutes)} · {tr(lang, "contests.participants_n", { n: rows.length })}
      </p>
    </div></div>

    <div className="contest-problems">{problems.map((p) => (
      <a key={p.idx} className="contest-problem" href={`/problem/${p.bank_id}`} onClick={linkTo(() => onOpenProblem(p.bank_id))}>
        <span className="contest-problem-idx">{p.idx}</span>
        <span className="contest-problem-title">{lang === "uz" ? p.title_uz : p.title_en}</span>
        <span className="contest-problem-meta">
          <span style={{ color: ratingColor(p.rating) }}>{p.rating}</span>
          <span className="muted" title={tr(lang, "contests.solved_of_tried")}>{p.solved}/{p.tried}</span>
        </span>
      </a>
    ))}</div>

    <p className="muted contest-rules">{tr(lang, "contests.rules", { n: contest.penalty_minutes })}</p>

    {rows.length === 0 ? <div className="screen-state panel"><p className="muted">{tr(lang, "contests.no_rows")}</p></div>
      : <div className="standings-wrap"><table className="standings">
        <thead><tr>
          <th className="st-place">#</th>
          <th className="st-who">{tr(lang, "contests.participant")}</th>
          <th className="st-num" title={tr(lang, "contests.solved")}>=</th>
          <th className="st-num">{tr(lang, "contests.penalty")}</th>
          {problems.map((p) => <th key={p.idx} className="st-cell" title={lang === "uz" ? p.title_uz : p.title_en}>{p.idx}</th>)}
        </tr></thead>
        <tbody>{rows.map((r) => {
          const name = r.display_name?.trim() || r.username;
          return <tr key={r.user_id}>
            <td className="st-place">{r.place}</td>
            <td className="st-who">
              <a href={`/u/${encodeURIComponent(r.username)}/submissions`} onClick={linkTo(() => onOpenSubmissions(r.username))} title={tr(lang, "contests.open_submissions", { name })}>
                <b>{name}</b> <span className="muted">@{r.username}</span>
              </a>
            </td>
            <td className="st-num"><b>{r.solved}</b></td>
            <td className="st-num">{r.penalty}</td>
            {problems.map((p) => {
              const c = r.cells[p.idx];
              if (!c) return <td key={p.idx} className="st-cell" />;
              if (c.ok) return <td key={p.idx} className="st-cell st-ok">
                <span>{c.wrong ? `+${c.wrong}` : "+"}</span>
                {c.minute !== null && <small>{clock(c.minute)}</small>}
              </td>;
              return <td key={p.idx} className="st-cell st-bad"><span>−{c.wrong}</span></td>;
            })}
          </tr>;
        })}</tbody>
      </table></div>}
  </>;
}
