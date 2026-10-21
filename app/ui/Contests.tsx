"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- see the note in ./Chrome */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { tr, type Lang } from "./i18n";
import { ratingColor } from "./rating";
import { linkTo } from "./Chrome";
import { bankProblems } from "./problem-bank";
import { verdictLabel } from "./social-ui";
import { fetchSubmissionCode, unlockSubmissionCode, type CodeResult } from "./social";
import { CodeBlock } from "./CodeBlock";
import { EmptyState } from "./kit";
import {
  publicRpc, ownerRpc, tashkent, when, lasting, clock, phaseOf, windowOf, span, clockUnits, useNow,
  UZ_SHORT, EN_MONTHS, LANGS,
  type Load, type Registrant, type ContestSummary, type ContestProblem, type StandingRow, type Standings, type Attempt, type Phase,
} from "./contest-data";
import { ContestEditor } from "./ContestEditor";
import { ContestProblemPage } from "./ContestProblem";

/* Rounds and their standings.
 *
 * Nothing on this screen is stored as a result. contest_standings() (044)
 * computes the board from bank_submissions every time it is asked, so a cell
 * that says "+2 01:14" is three real rows — and a click on it opens them,
 * code included, the way a Codeforces standings cell does.
 *
 * The reads are public: a signed-out visitor sees the archive too. Writing a
 * round (/contests/new, /contests/<slug>/edit) is the owner's. */

const CxIcon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const CX_TROPHY = "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3";
const CX_USERS = "M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.5A6.5 6.5 0 0 1 21.5 20";
const CX_LIST = "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01";
const CX_FLAG = "M5 21V4M5 4h11l-2 4 2 4H5";
const CX_CAL = "M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z";
const CX_CLOCK = "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z";
const CX_PLUS = "M12 5v14M5 12h14";
const CX_EDIT = "M4 20h4L19 9l-4-4L4 16v4ZM14 6l4 4";
const CX_CODE = "M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14";
const CX_REFRESH = "M20 11a8 8 0 0 0-14.9-4M4 4v4h4M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4";
const CX_LOCK = "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z";
const CX_CHECK = "M5 12.5l4.5 4.5L19 7.5";
const CX_EYE = "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z";
const CX_EYE_OFF = "M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 9 6 9 6a17 17 0 0 1-2.4 3M6.6 6.6C4.3 8.1 3 12 3 12s4 6 9 6a9 9 0 0 0 4.4-1.1M9.9 9.9a3 3 0 0 0 4.2 4.2";

function Waiting({ lang, load, notMigrated = "contests.not_migrated" }: { lang: Lang; load: Load<unknown>; notMigrated?: string }) {
  if (load.state === "loading") {
    return <div className="screen-state" role="status"><span className="spinner" aria-hidden /><p className="muted">{tr(lang, "algoYolApp.yuklanmoqda")}</p></div>;
  }
  const key = load.state === "not-migrated" ? notMigrated
    : load.state === "missing" ? "contests.not_found" : "contests.load_error";
  return <div className="panel"><div className={`notice ${load.state === "error" ? "notice-error" : ""}`}>{tr(lang, key)}</div></div>;
}

/* A countdown as tiles — days, hours, minutes, seconds — in the round's
   accent colour (--cx-acc), not one long monospace string. */
export function Clock({ ms, lang, big }: { ms: number; lang: Lang; big?: boolean }) {
  return <span className={`cx-clock${big ? " big" : ""}`} role="timer">
    {clockUnits(ms, lang).map(([n, label], i) => <span className="cx-clock-u" key={i}><b>{n}</b><small>{label}</small></span>)}
  </span>;
}

const titleOf = (lang: Lang, x: { title_uz: string; title_en: string }) => (lang === "uz" ? x.title_uz : x.title_en) || x.title_uz;

/* A round's pages, as on Codeforces: the problems at its root, then the
   standings and every submission sent during it. "problem" is one custom
   problem (/p/<idx>), "edit" the owner's editor. */
export type ContestTab = "problems" | "standings" | "status" | "registrants" | "problem" | "edit";

export function Contests({ lang, slug, tab, problemIdx, isOwner, signed, onTab, onOpenContest, onOpenList, onOpenSubmissions, onOpenProblem, onOpenContestProblem, onEdit, onSignIn, onPractice }: {
  lang: Lang;
  slug: string | null;
  tab: ContestTab;
  problemIdx: string | null;
  isOwner: boolean;
  signed: boolean;
  onTab: (tab: ContestTab) => void;
  onOpenContest: (slug: string) => void;
  onOpenList: () => void;
  onOpenSubmissions: (handle: string) => void;
  onOpenProblem: (bankId: string) => void;
  onOpenContestProblem: (slug: string, idx: string) => void;
  /** Opens the editor: a slug to edit that round, "new" for a new one. */
  onEdit: (slug: string) => void;
  onSignIn: () => void;
  onPractice?: () => void;
}) {
  if (slug === "new" || (slug && tab === "edit")) {
    return isOwner
      ? <ContestEditor key={slug} lang={lang} slug={slug === "new" ? null : slug} onDone={onOpenContest} onCancel={() => (slug === "new" ? onOpenList() : onOpenContest(slug))} onDeleted={onOpenList} />
      : <div className="panel"><div className="notice notice-error">{tr(lang, "algoYolApp.bu_sahifa_faqat_ega_owner_roli_uchun")}</div></div>;
  }
  return slug
    ? <ContestRound key={slug} lang={lang} slug={slug} tab={tab} problemIdx={problemIdx} isOwner={isOwner} signed={signed} onTab={onTab}
        onOpenList={onOpenList} onOpenSubmissions={onOpenSubmissions} onOpenProblem={onOpenProblem}
        onOpenContestProblem={(idx) => onOpenContestProblem(slug, idx)} onEdit={() => onEdit(slug)} onSignIn={onSignIn} />
    : <ContestList lang={lang} isOwner={isOwner} signed={signed} onSignIn={onSignIn} onOpenContest={onOpenContest} onNew={() => onEdit("new")} onPractice={onPractice} />;
}

/* ------------------------------------------------------------------ list */

type Filter = "all" | Phase;

function ContestList({ lang, isOwner, signed, onSignIn, onOpenContest, onNew, onPractice }: {
  lang: Lang; isOwner: boolean; signed: boolean; onSignIn: () => void;
  onOpenContest: (slug: string) => void; onNew: () => void; onPractice?: () => void;
}) {
  const [load, setLoad] = useState<Load<ContestSummary[]>>({ state: "loading" });
  const [filter, setFilter] = useState<Filter>("all");
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    let live = true;
    void publicRpc<ContestSummary[]>("contest_list").then((got) => {
      // A refresh after registering keeps the cards on screen meanwhile.
      if (live && (got.state === "ready" || nonce === 0)) setLoad(got);
    });
    return () => { live = false; };
  }, [nonce]);
  /* Registering from the card itself (067), without opening the round. */
  const [regBusy, setRegBusy] = useState<string | null>(null);
  const [regError, setRegError] = useState<{ slug: string; text: string } | null>(null);
  const register = async (slug: string) => {
    if (!signed) { onSignIn(); return; }
    setRegBusy(slug);
    setRegError(null);
    const got = await ownerRpc("contest_register", { p_slug: slug });
    setRegBusy(null);
    if (got.ok) { setNonce((n) => n + 1); return; }
    const code = got.error.split(":")[0];
    setRegError({ slug, text: tr(lang, ["not_migrated", "finished", "not_authenticated"].includes(code) ? `contests.reg_err_${code}` : "contests.ed_err_generic", { e: got.error }) });
  };
  const list = useMemo(() => (load.state === "ready" ? load.data : []), [load]);
  // A list with a running or announced round ticks; a pure archive does not.
  const now = useNow((t) => list.some((c) => phaseOf(c, t) !== "finished"));

  const addButton = isOwner && <a className="cx-add" href="/contests/new" onClick={linkTo(onNew)}>
    <CxIcon d={CX_PLUS} /><span>{tr(lang, "contests.add")}</span>
  </a>;
  const head = <header className="cx-hero">
    <div className="cx-hero-copy">
      <p className="eyebrow">{tr(lang, "contests.eyebrow")}</p>
      <h1 className="page-title">{tr(lang, "contests.title")}</h1>
    </div>
    {addButton}
  </header>;

  if (load.state !== "ready") return <>{head}<Waiting lang={lang} load={load} /></>;
  /* No rounds yet: say what a round is, so the page sells the first one. */
  if (!list.length) return <>{head}
    <section className="cx-empty">
      <span className="cx-empty-ic" aria-hidden><CxIcon d={CX_TROPHY} /></span>
      <h2>{tr(lang, "contests.empty")}</h2>
      <p className="muted">{tr(lang, "contests.empty_body")}</p>
      <ul className="cx-empty-facts">
        <li><CxIcon d={CX_LIST} />{tr(lang, "contests.empty_f1")}</li>
        <li><CxIcon d={CX_FLAG} />{tr(lang, "contests.empty_f2")}</li>
        <li><CxIcon d={CX_USERS} />{tr(lang, "contests.empty_f3")}</li>
      </ul>
      {isOwner ? <button className="primary" onClick={onNew}>{tr(lang, "contests.add")} →</button>
        : onPractice && <button className="primary" onClick={onPractice}>{tr(lang, "contests.empty_cta")} →</button>}
    </section>
  </>;

  const phases = list.map((c) => ({ c, phase: phaseOf(c, now) }));
  const counts = { all: list.length, live: 0, upcoming: 0, finished: 0 } as Record<Filter, number>;
  for (const { phase } of phases) counts[phase]++;
  const shown = phases.filter((x) => filter === "all" || x.phase === filter);
  // Running and announced rounds lead, nearest first; the archive follows by year.
  const featured = shown.filter((x) => x.phase !== "finished")
    .sort((a, b) => (a.phase === b.phase ? +new Date(a.c.starts_at) - +new Date(b.c.starts_at) : a.phase === "live" ? -1 : 1));
  const past = shown.filter((x) => x.phase === "finished");
  const years: { year: number; items: ContestSummary[] }[] = [];
  for (const { c } of past) {
    const y = tashkent(c.starts_at).y;
    if (!years.length || years[years.length - 1].year !== y) years.push({ year: y, items: [] });
    years[years.length - 1].items.push(c);
  }
  const entries = list.reduce((s, c) => s + c.participants, 0);
  const problems = list.reduce((s, c) => s + c.problems.length, 0);

  return <>
    {head}
    <div className="cx-stats">
      <div className="cx-stat"><i aria-hidden><CxIcon d={CX_TROPHY} /></i><div><b>{list.length}</b><span>{tr(lang, "contests.stat_rounds")}</span></div></div>
      <div className="cx-stat"><i aria-hidden><CxIcon d={CX_USERS} /></i><div><b>{entries}</b><span>{tr(lang, "contests.stat_entries")}</span></div></div>
      <div className="cx-stat"><i aria-hidden><CxIcon d={CX_LIST} /></i><div><b>{problems}</b><span>{tr(lang, "contests.stat_problems")}</span></div></div>
    </div>

    <div className="cx-seg" role="tablist" aria-label={tr(lang, "contests.title")}>
      {(["all", "live", "upcoming", "finished"] as Filter[]).map((f) => (
        <button key={f} type="button" role="tab" aria-selected={filter === f} className={filter === f ? "on" : undefined}
          disabled={f !== "all" && !counts[f]} onClick={() => setFilter(f)}>
          {f === "live" && <i className="cx-live-dot" aria-hidden />}
          {tr(lang, f === "all" ? "contests.filter_all" : `contests.${f}`)}
          <small>{counts[f]}</small>
        </button>
      ))}
    </div>

    {featured.length > 0 && <section className="cx-featured" aria-label={tr(lang, "contests.current")}>
      {featured.map(({ c, phase }) => <FeatureCard key={c.slug} lang={lang} c={c} phase={phase} now={now} signed={signed}
        busy={regBusy === c.slug} error={regError?.slug === c.slug ? regError.text : ""}
        onRegister={() => void register(c.slug)} onOpen={() => onOpenContest(c.slug)} />)}
    </section>}

    {years.map(({ year, items }) => <section key={year} aria-label={String(year)}>
      <h2 className="cx-year">{year}<small>{tr(lang, "contests.rounds_n", { n: items.length })}</small></h2>
      <div className="cx-list">{items.map((c) => <PastCard key={c.slug} lang={lang} c={c} onOpen={() => onOpenContest(c.slug)} />)}</div>
    </section>)}
  </>;
}

/* A running or announced round: big, with its clock. */
/* The whole card opens the round (its title link is stretched over it), and
   the register button sits above that link so it registers instead. A button
   cannot live inside an <a>, hence the article. */
function FeatureCard({ lang, c, phase, now, signed, busy, error, onRegister, onOpen }: {
  lang: Lang; c: ContestSummary; phase: Phase; now: number; signed: boolean;
  busy: boolean; error: string; onRegister: () => void; onOpen: () => void;
}) {
  const { start, end } = windowOf(c);
  const pct = phase === "live" ? Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100)) : 0;
  const canRegister = c.kind === "custom" && c.registered !== undefined;
  return <article className={`cx-feature cx-${phase}`}>
    <div className="cx-feature-top">
      <span className={`cx-phase ${phase}`}>{phase === "live" && <i className="cx-live-dot" aria-hidden />}{tr(lang, `contests.${phase}`)}</span>
      {c.hidden && <span className="tag cx-hidden-tag"><CxIcon d={CX_EYE_OFF} />{tr(lang, "contests.hidden")}</span>}
      <span className="cx-feature-num">#{c.number}</span>
    </div>
    <a className="cx-feature-title cx-stretch" href={`/contests/${c.slug}`} onClick={linkTo(onOpen)}>{titleOf(lang, c)}</a>
    <span className="cx-meta">
      <span><CxIcon d={CX_CAL} />{when(c.starts_at, lang)}</span>
      <span><CxIcon d={CX_CLOCK} />{lasting(c.duration_minutes, lang)}</span>
      <span><CxIcon d={CX_LIST} />{tr(lang, "contests.problems_n", { n: c.problems.length })}</span>
    </span>
    <div className="cx-feature-clock">
      <small>{tr(lang, phase === "live" ? "contests.ends_label" : "contests.starts_label")}</small>
      <Clock ms={phase === "live" ? end - now : start - now} lang={lang} />
    </div>
    {phase === "live" && <span className="cx-progress" aria-hidden><i style={{ width: `${pct}%` }} /></span>}
    {canRegister && <span className="cx-feature-reg">
      <CxIcon d={CX_USERS} />{tr(lang, "contests.reg_count", { n: c.registered ?? 0 })}
    </span>}
    <div className="cx-feature-foot">
      {canRegister && (c.me_registered
        ? <b className="cx-reg-badge big"><CxIcon d={CX_CHECK} />{tr(lang, "contests.reg_done_short")}</b>
        : <button type="button" className="primary cx-feature-reg-btn" disabled={busy} onClick={onRegister}>
            {tr(lang, signed ? "contests.reg_button" : "contests.reg_sign_in")}
          </button>)}
      <span className="cx-feature-cta">{tr(lang, phase === "live" ? "contests.enter" : "contests.details")} →</span>
    </div>
    {error && <p className="cx-feature-err">{error}</p>}
  </article>;
}

function PastCard({ lang, c, onOpen }: { lang: Lang; c: ContestSummary; onOpen: () => void }) {
  const t = tashkent(c.starts_at);
  const winner = c.winner ? (c.winner.display_name?.trim() || c.winner.username) : null;
  return <a className="cx-card" href={`/contests/${c.slug}`} onClick={linkTo(onOpen)}>
    <div className="cx-date" aria-hidden>
      <b>{t.d}</b>
      <span>{lang === "uz" ? UZ_SHORT[t.m] : EN_MONTHS[t.m]}</span>
    </div>
    <div className="cx-main">
      <span className="cx-title-row">
        <b className="cx-title">{titleOf(lang, c)}</b>
        {c.hidden && <span className="tag cx-hidden-tag"><CxIcon d={CX_EYE_OFF} />{tr(lang, "contests.hidden")}</span>}
      </span>
      <span className="cx-meta">
        <span><CxIcon d={CX_CLOCK} />{t.time} · {lasting(c.duration_minutes, lang)}</span>
        <span><CxIcon d={CX_USERS} />{tr(lang, "contests.participants_n", { n: c.participants })}</span>
        {winner && <span className="cx-winner"><CxIcon d={CX_TROPHY} /><b>{winner}</b></span>}
      </span>
    </div>
    <div className="cx-side">
      <span className="cx-chips" aria-label={tr(lang, "contests.problems")}>
        {c.problems.map((p) => <span key={p.idx} className="cx-chip" style={{ color: ratingColor(p.rating) }} title={`${p.idx} · ${p.rating}`}>{p.idx}</span>)}
      </span>
      <span className="cx-go" aria-hidden>→</span>
    </div>
  </a>;
}

/* ------------------------------------------------------------------ one round */

type StatusPage = { total: number; rows: Attempt[] };
const STATUS_PAGE = 50;

function ContestRound({ lang, slug, tab, problemIdx, isOwner, signed, onTab, onOpenList, onOpenSubmissions, onOpenProblem, onOpenContestProblem, onEdit, onSignIn }: {
  lang: Lang; slug: string; tab: ContestTab; problemIdx: string | null; isOwner: boolean; signed: boolean;
  onTab: (tab: ContestTab) => void; onOpenList: () => void;
  onOpenSubmissions: (handle: string) => void; onOpenProblem: (bankId: string) => void;
  onOpenContestProblem: (idx: string) => void; onEdit: () => void; onSignIn: () => void;
}) {
  // One read feeds the problems and the standings: the same board, so the
  // "×54" beside a problem and the 54 green cells in its column agree.
  const [load, setLoad] = useState<Load<Standings>>({ state: "loading" });
  const [nonce, setNonce] = useState(0);
  const [toggling, setToggling] = useState(false);
  const [toggleError, setToggleError] = useState("");
  const [regBusy, setRegBusy] = useState(false);
  const [regError, setRegError] = useState("");
  const reload = useCallback(() => setNonce((n) => n + 1), []);
  useEffect(() => {
    let live = true;
    void publicRpc<Standings>("contest_standings", { p_slug: slug }).then((got) => {
      // A refresh keeps the board on screen until the new one arrives.
      if (live && (got.state === "ready" || nonce === 0)) setLoad(got);
    });
    return () => { live = false; };
  }, [slug, nonce]);

  const board = load.state === "ready" ? load.data : null;
  const now = useNow((t) => Boolean(board) && phaseOf(board!.contest, t) !== "finished");
  const livePhase = board ? phaseOf(board.contest, now) : "finished";
  // The board of a running round refreshes itself; a phase change reloads it
  // too, so the problems appear the moment an announced round starts.
  useEffect(() => {
    if (livePhase !== "live") return;
    const id = window.setInterval(reload, 30_000);
    return () => window.clearInterval(id);
  }, [livePhase, reload]);
  const seenPhase = useRef<Phase | null>(null);
  useEffect(() => {
    if (!board) return;
    const before = seenPhase.current;
    seenPhase.current = livePhase;
    if (before === null || before === livePhase) return;
    const id = window.setTimeout(reload, 400);
    return () => window.clearTimeout(id);
  }, [board, livePhase, reload]);

  const back = <a className="back-link" href="/contests" onClick={linkTo(onOpenList)}>← {tr(lang, "contests.all")}</a>;
  if (!board) return <>{back}<Waiting lang={lang} load={load} /></>;
  const { contest } = board;
  const { start, end } = windowOf(contest);
  const pct = livePhase === "live" ? Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100)) : livePhase === "finished" ? 100 : 0;
  // A custom round's problems are secret until it starts (065 blanks them).
  const sealed = livePhase === "upcoming" && !isOwner && contest.kind === "custom";
  /* The owner's one-click visibility switch (066), for any round. */
  const toggleHidden = async (hidden: boolean) => {
    setToggling(true);
    setToggleError("");
    const got = await ownerRpc("owner_contest_set_hidden", { p_slug: slug, p_hidden: hidden });
    setToggling(false);
    if (got.ok) reload();
    else setToggleError(tr(lang, got.error === "not_migrated" ? "contests.ed_err_need_066" : "contests.ed_err_generic", { e: got.error }));
  };

  /* Registration (067): open until the round ends, cancellable until it starts. */
  const canRegister = contest.kind === "custom" && livePhase !== "finished" && contest.registered !== undefined;
  const register = async (join: boolean) => {
    if (!signed) { onSignIn(); return; }
    setRegBusy(true);
    setRegError("");
    const got = await ownerRpc(join ? "contest_register" : "contest_unregister", { p_slug: slug });
    setRegBusy(false);
    if (got.ok) { reload(); return; }
    const code = got.error.split(":")[0];
    setRegError(tr(lang, ["not_migrated", "started", "finished", "not_authenticated"].includes(code) ? `contests.reg_err_${code}` : "contests.ed_err_generic", { e: got.error }));
  };
  const regBox = canRegister && <div className={`cx-reg${contest.me_registered ? " done" : ""}`}>
    <div className="cx-reg-copy">
      {contest.me_registered
        ? <b><CxIcon d={CX_CHECK} />{tr(lang, "contests.reg_done")}</b>
        : <b>{tr(lang, livePhase === "live" ? "contests.reg_cta_live" : "contests.reg_cta")}</b>}
      <small>{tr(lang, "contests.reg_count", { n: contest.registered ?? 0 })}</small>
    </div>
    {contest.me_registered
      ? livePhase === "upcoming" && <button type="button" className="cx-ghost-btn" disabled={regBusy} onClick={() => void register(false)}>{tr(lang, "contests.reg_cancel")}</button>
      : <button type="button" className="primary cx-reg-btn" disabled={regBusy} onClick={() => void register(true)}>{tr(lang, signed ? "contests.reg_button" : "contests.reg_sign_in")}</button>}
  </div>;

  const tabs: ContestTab[] = contest.kind === "custom" ? ["problems", "standings", "status", "registrants"] : ["problems", "standings", "status"];
  const hrefOf = (t: ContestTab) => `/contests/${encodeURIComponent(slug)}${t === "problems" ? "" : `/${t}`}`;
  const activeTab = tab === "problem" ? "problems" : tab;

  return <>
    {back}
    <header className={`cx-round-hero cx-${livePhase}${tab === "problem" ? " compact" : ""}`}>
      <div className="cx-round-top">
        <p className="eyebrow">{tr(lang, "contests.round_n", { n: contest.number })} · ICPC</p>
        <span className={`cx-phase ${livePhase}`}>{livePhase === "live" && <i className="cx-live-dot" aria-hidden />}{tr(lang, `contests.${livePhase}`)}</span>
        {contest.hidden && <span className="tag cx-hidden-tag"><CxIcon d={CX_EYE_OFF} />{tr(lang, "contests.hidden")}</span>}
        {isOwner && <span className="cx-owner-tools">
          <button type="button" className="cx-ghost-btn" disabled={toggling} onClick={() => void toggleHidden(!contest.hidden)}>
            <CxIcon d={contest.hidden ? CX_EYE : CX_EYE_OFF} />{tr(lang, contest.hidden ? "contests.make_public" : "contests.make_hidden")}
          </button>
          <button type="button" className="cx-ghost-btn" onClick={onEdit}><CxIcon d={CX_EDIT} />{tr(lang, contest.kind === "custom" ? "contests.edit" : "contests.edit_settings")}</button>
        </span>}
      </div>
      <h1 className="page-title">{titleOf(lang, contest)}</h1>
      {contest.description && <p className="cx-round-desc">{contest.description}</p>}
      <div className="cx-round-meta">
        <span><CxIcon d={CX_CAL} />{when(contest.starts_at, lang)}</span>
        <span><CxIcon d={CX_CLOCK} />{lasting(contest.duration_minutes, lang)}</span>
        <span><CxIcon d={CX_USERS} />{tr(lang, "contests.participants_n", { n: board.rows.length })}</span>
        <span><CxIcon d={CX_LIST} />{tr(lang, "contests.problems_n", { n: board.problems.length })}</span>
      </div>
      {livePhase !== "finished" && <div className="cx-round-clock">
        <div><small>{tr(lang, livePhase === "live" ? "contests.ends_label" : "contests.starts_label")}</small>
          <Clock ms={livePhase === "live" ? end - now : start - now} lang={lang} /></div>
        {livePhase === "live" && <span className="cx-progress"><i style={{ width: `${pct}%` }} /></span>}
      </div>}
      {contest.hidden && <p className="cx-hidden-note">{tr(lang, "contests.hidden_note")}</p>}
      {toggleError && <p className="cx-hidden-note">{toggleError}</p>}
      {regBox}
      {regError && <p className="cx-hidden-note">{regError}</p>}
    </header>

    <nav className="cx-tabs" aria-label={tr(lang, "contests.title")}>
      {tabs.map((t) => (
        <a key={t} href={hrefOf(t)} className={activeTab === t ? "on" : undefined} aria-current={activeTab === t ? "page" : undefined}
          onClick={linkTo(() => { if (tab !== t) onTab(t); })}>
          {tr(lang, `contests.tab_${t}`)}
          {t === "standings" && board.rows.length > 0 && <small>{board.rows.length}</small>}
          {t === "registrants" && (contest.registered ?? 0) > 0 && <small>{contest.registered}</small>}
        </a>
      ))}
    </nav>

    {tab === "problem" && problemIdx
      ? <ContestProblemPage key={problemIdx} lang={lang} slug={slug} idx={problemIdx} board={board} phase={livePhase} isOwner={isOwner}
          signed={signed} onPick={onOpenContestProblem} onSignIn={onSignIn} onSubmitted={reload}
          onRegister={() => register(true)} regBusy={regBusy} />
      : tab === "registrants" ? <RegistrantsTab lang={lang} slug={slug} onOpenSubmissions={onOpenSubmissions} />
      : sealed ? <section className="cx-sealed">
          <span className="cx-empty-ic" aria-hidden><CxIcon d={CX_LOCK} /></span>
          <h2>{tr(lang, "contests.sealed_title")}</h2>
          <p className="muted">{tr(lang, "contests.sealed_body", { t: span(start - now, lang) })}</p>
          <Clock ms={start - now} lang={lang} big />
        </section>
      : <>
        {tab === "problems" && <ProblemsTab lang={lang} slug={slug} board={board} phase={livePhase} isOwner={isOwner} onEdit={onEdit} onOpenProblem={onOpenProblem} onOpenContestProblem={onOpenContestProblem} onOpenSubmissions={onOpenSubmissions} />}
        {tab === "standings" && <StandingsTab lang={lang} slug={slug} board={board} live={livePhase === "live"} onReload={reload} onOpenSubmissions={onOpenSubmissions} />}
        {tab === "status" && <StatusTab lang={lang} slug={slug} board={board} onOpenSubmissions={onOpenSubmissions} />}
      </>}
  </>;
}

/* The round's front page: the problems, and beside them what Codeforces puts
   in its sidebar — the round's state, its numbers and how to practise it. */
function ProblemsTab({ lang, slug, board, phase, isOwner, onEdit, onOpenProblem, onOpenContestProblem, onOpenSubmissions }: {
  lang: Lang; slug: string; board: Standings; phase: Phase; isOwner: boolean; onEdit: () => void; onOpenProblem: (bankId: string) => void;
  onOpenContestProblem: (idx: string) => void; onOpenSubmissions: (handle: string) => void;
}) {
  const { contest, problems, rows } = board;
  const people = rows.length;
  const winner = phase === "finished" ? rows[0] : undefined;
  const limitsOf = (p: ContestProblem) => {
    if (p.custom) return tr(lang, "contests.limits", { s: (p.time_limit_ms ?? 1000) / 1000, mb: p.memory_mb ?? 256 });
    const b = bankProblems.find((x) => x.id === p.bank_id);
    if (!b) return null;
    return tr(lang, "contests.limits", { s: (b.timeLimitMs ?? 1000) / 1000, mb: b.memoryMb ?? 256 });
  };
  const hrefOf = (p: ContestProblem) => (p.custom ? `/contests/${encodeURIComponent(slug)}/p/${p.idx}` : `/problem/${p.bank_id}`);
  const open = (p: ContestProblem) => (p.custom ? onOpenContestProblem(p.idx) : onOpenProblem(p.bank_id));

  return <div className="cx-dash">
    <div className="cx-dash-main">
      {problems.length === 0 && <section className="cx-sealed cx-noproblems">
        <h2>{tr(lang, "contests.no_problems_title")}</h2>
        <p className="muted">{tr(lang, isOwner ? "contests.no_problems_owner" : "contests.no_problems_body")}</p>
        {isOwner && <button type="button" className="primary" onClick={onEdit}>+ {tr(lang, "contests.ed_add_problem")}</button>}
      </section>}
      <div className="cx-plist" role="list" aria-label={tr(lang, "contests.problems")}>
        {problems.map((p) => {
          const share = people ? p.solved / people : 0;
          return <a key={p.idx} role="listitem" className="cx-pcard" href={hrefOf(p)} onClick={linkTo(() => open(p))} style={{ ["--pc" as string]: ratingColor(p.rating) }}>
            <span className="cx-idx">{p.idx}</span>
            <span className="cx-pname">
              <b>{titleOf(lang, p)}</b>
              <small>{limitsOf(p)}</small>
            </span>
            <span className="cx-rating">{p.rating}</span>
            <span className="cx-solved" title={tr(lang, "contests.solved_by", { n: p.solved, of: people })}>
              <span className="cx-solved-n"><CxIcon d={CX_USERS} />{p.solved}<small>/{p.tried}</small></span>
              <span className="cx-solve-bar"><i style={{ width: `${Math.round(share * 100)}%` }} /></span>
            </span>
            <span className="cx-go" aria-hidden>→</span>
          </a>;
        })}
      </div>
    </div>

    <aside className="cx-dash-side">
      <section className="cx-box">
        <header><b>{tr(lang, "contests.about")}</b><span className={`cx-state ${phase}`}>{tr(lang, `contests.${phase}`)}</span></header>
        <dl>
          <div><dt>{tr(lang, phase === "upcoming" ? "contests.starts" : "contests.started")}</dt><dd>{when(contest.starts_at, lang)}</dd></div>
          <div><dt>{tr(lang, "contests.length")}</dt><dd>{lasting(contest.duration_minutes, lang)}</dd></div>
          <div><dt>{tr(lang, "contests.participant")}</dt><dd>{people}</dd></div>
          <div><dt>{tr(lang, "contests.format")}</dt><dd>ICPC · {tr(lang, "contests.penalty_short", { n: contest.penalty_minutes })}</dd></div>
          {winner && <div><dt>{tr(lang, "contests.winner")}</dt><dd>
            <a href={`/u/${encodeURIComponent(winner.username)}/submissions`} onClick={linkTo(() => onOpenSubmissions(winner.username))}>
              {winner.display_name?.trim() || winner.username}
            </a>
          </dd></div>}
        </dl>
      </section>
      {phase === "finished" && problems[0] && <section className="cx-box cx-box-accent">
        <header><b>{tr(lang, "contests.practice_title")}</b></header>
        <p>{tr(lang, "contests.practice_text")}</p>
        <a className="primary cx-practice" href={hrefOf(problems[0])} onClick={linkTo(() => open(problems[0]))}>
          {tr(lang, "contests.practice_start", { idx: problems[0].idx })}
        </a>
      </section>}
      {phase === "live" && <section className="cx-box cx-box-accent">
        <header><b>{tr(lang, "contests.live_title")}</b></header>
        <p>{tr(lang, "contests.live_text")}</p>
      </section>}
    </aside>
  </div>;
}

/* Who signed up, in the order they did: Codeforces' "Registrants". */
function RegistrantsTab({ lang, slug, onOpenSubmissions }: { lang: Lang; slug: string; onOpenSubmissions: (handle: string) => void }) {
  const [load, setLoad] = useState<Load<Registrant[]>>({ state: "loading" });
  useEffect(() => {
    let live = true;
    void publicRpc<Registrant[]>("contest_registrants", { p_slug: slug }).then((got) => { if (live) setLoad(got); });
    return () => { live = false; };
  }, [slug]);
  if (load.state !== "ready") return <Waiting lang={lang} load={load} notMigrated="contests.reg_err_not_migrated" />;
  if (!load.data.length) return <EmptyState lang={lang} icon="podium" title={tr(lang, "contests.reg_none")} body={tr(lang, "contests.reg_none_body")} />;
  return <ol className="cx-registrants">
    {load.data.map((r, i) => {
      const name = r.display_name?.trim() || r.username;
      return <li key={r.username}>
        <span className="cx-reg-n mono">{i + 1}</span>
        <a href={`/u/${encodeURIComponent(r.username)}`} onClick={linkTo(() => onOpenSubmissions(r.username))}>
          <b style={r.rating ? { color: ratingColor(r.rating) } : undefined}>{name}</b> <span className="muted">@{r.username}</span>
        </a>
        {r.rating !== null && <span className="cx-reg-rating mono" style={{ color: ratingColor(r.rating) }}>{r.rating}</span>}
        <span className="cx-reg-when muted">{when(r.registered_at, lang)}</span>
      </li>;
    })}
  </ol>;
}

function StandingsTab({ lang, slug, board, live, onReload, onOpenSubmissions }: {
  lang: Lang; slug: string; board: Standings; live: boolean; onReload: () => void; onOpenSubmissions: (handle: string) => void;
}) {
  const { problems, rows } = board;
  const [cell, setCell] = useState<{ row: StandingRow; problem: ContestProblem } | null>(null);

  // Who took each problem first. Marked on the board, as most judges do.
  const firstMinute: Record<string, number> = {};
  for (const r of rows) for (const [idx, c] of Object.entries(r.cells)) {
    if (c.ok && c.minute !== null && (firstMinute[idx] === undefined || c.minute < firstMinute[idx])) firstMinute[idx] = c.minute;
  }

  return <>
    <div className="cx-section-head">
      <span className="muted cx-count">{tr(lang, "contests.participants_n", { n: rows.length })}
        {rows.length > 0 && <span className="cx-hint"> · {tr(lang, "contests.cell_hint")}</span>}</span>
      <button type="button" className="cx-ghost-btn" onClick={onReload}><CxIcon d={CX_REFRESH} />{tr(lang, live ? "contests.refresh_live" : "contests.refresh")}</button>
    </div>

    {rows.length === 0 ? <EmptyState lang={lang} icon="podium" title={tr(lang, "contests.no_rows")} body={tr(lang, "contests.no_rows_body")} />
      : <div className="standings-wrap"><table className="standings">
        <thead><tr>
          <th className="st-place">#</th>
          <th className="st-who">{tr(lang, "contests.participant")}</th>
          <th className="st-num" title={tr(lang, "contests.solved")}>=</th>
          <th className="st-num">{tr(lang, "contests.penalty")}</th>
          {problems.map((p) => <th key={p.idx} className="st-cell" title={titleOf(lang, p)}>
            {p.idx}<small>{p.solved}/{p.tried}</small>
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
              const first = c.ok && c.minute !== null && c.minute === firstMinute[p.idx];
              const label = tr(lang, "contests.cell_open", { name, idx: p.idx });
              return <td key={p.idx} className={`st-cell ${c.ok ? "st-ok" : "st-bad"}${first ? " st-first" : ""}`}>
                <button type="button" className="st-hit" onClick={() => setCell({ row: r, problem: p })} aria-label={label} title={first ? tr(lang, "contests.first_solve") : label}>
                  {c.ok ? <><span>{c.wrong ? `+${c.wrong}` : "+"}</span>{c.minute !== null && <small>{clock(c.minute)}</small>}</>
                    : <span>−{c.wrong}</span>}
                </button>
              </td>;
            })}
          </tr>;
        })}</tbody>
      </table></div>}

    {cell && <SubmissionsModal lang={lang}
      title={`${cell.problem.idx}. ${titleOf(lang, cell.problem)}`}
      subtitle={cell.row.display_name?.trim() || cell.row.username}
      load={() => attemptsOf(slug, cell.row.username, cell.problem.idx)}
      onClose={() => setCell(null)} />}
  </>;
}

/* One cell's attempts. contest_attempts (065) answers directly; before it is
   applied the same rows are read off contest_status, which can filter by
   problem but not by person, a page at a time. */
async function attemptsOf(slug: string, username: string, idx: string): Promise<Load<Attempt[]>> {
  const direct = await publicRpc<Attempt[]>("contest_attempts", { p_slug: slug, p_username: username, p_idx: idx });
  if (direct.state !== "not-migrated") return direct;
  const mine: Attempt[] = [];
  for (let page = 0; page < 20; page++) {
    const got = await publicRpc<StatusPage>("contest_status", { p_slug: slug, p_idx: idx, p_verdict: null, p_limit: 100, p_offset: page * 100 });
    if (got.state !== "ready") return got;
    mine.push(...got.data.rows.filter((r) => r.username.toLowerCase() === username.toLowerCase()));
    if ((page + 1) * 100 >= got.data.total) break;
  }
  return { state: "ready", data: mine.reverse() };
}

/* The code behind an attempt: contest_submission_code (065) opens custom
   rounds to everybody once they end; before it exists, submission_code's own
   rule applies (staff and the author read free, others may unlock). */
type ContestCode = CodeResult | { state: "running" };
async function codeOf(id: string): Promise<ContestCode> {
  const got = await publicRpc<{ ok: boolean; reason?: string; source?: string; language?: string; cost?: number; balance?: number }>("contest_submission_code", { p_id: id });
  if (got.state === "not-migrated") return fetchSubmissionCode(id);
  if (got.state !== "ready") return { state: "offline" };
  const r = got.data;
  if (r.ok && typeof r.source === "string") return { state: "ok", source: r.source, language: String(r.language || "") };
  if (r.reason === "running") return { state: "running" };
  if (r.reason === "locked") return { state: "locked", cost: Number(r.cost || 0), balance: Number(r.balance || 0) };
  if (r.reason === "not_authenticated") return { state: "signed-out" };
  return { state: "offline" };
}

const verdictClass = (v: string) => (v === "ACCEPTED" ? "ok" : v === "COMPILATION_ERROR" || v === "JUDGE_ERROR" ? "warn" : "bad");

function SubmissionsModal({ lang, title, subtitle, load, onClose, single }: {
  lang: Lang; title: string; subtitle: string; load: () => Promise<Load<Attempt[]>>; onClose: () => void;
  /** Opened from one status row: no list, just its code. */
  single?: boolean;
}) {
  const [list, setList] = useState<Load<Attempt[]>>({ state: "loading" });
  const [picked, setPicked] = useState<string | null>(null);
  const [code, setCode] = useState<{ id: string; result: ContestCode } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    void load().then((got) => {
      if (!live) return;
      setList(got);
      // The attempt that decided the cell — the accepted one, else the last.
      if (got.state === "ready" && got.data.length) {
        const ac = got.data.find((a) => a.verdict === "ACCEPTED");
        setPicked((ac || got.data[got.data.length - 1]).id);
      }
    });
    return () => { live = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!picked) return;
    let live = true;
    void codeOf(picked).then((result) => { if (live) setCode({ id: picked, result }); });
    return () => { live = false; };
  }, [picked]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; };
  }, [onClose]);

  const unlock = async () => {
    if (!picked) return;
    setBusy(true);
    const bought = await unlockSubmissionCode(picked);
    if (bought.state !== "insufficient") setCode({ id: picked, result: bought });
    setBusy(false);
  };

  const attempts = list.state === "ready" ? list.data : [];
  const current = attempts.find((a) => a.id === picked);
  const result = code && code.id === picked ? code.result : null;

  return <div className="lightbox cx-modal-back" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
    <div className="cx-modal" onClick={(e) => e.stopPropagation()}>
      <header className="cx-modal-head">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h3>{title}</h3>
        </div>
        <button type="button" className="lightbox-close static" onClick={onClose} aria-label={tr(lang, "contests.close")}>✕</button>
      </header>

      {list.state !== "ready" ? <Waiting lang={lang} load={list} />
        : !attempts.length ? <p className="muted">{tr(lang, "contests.no_attempts")}</p>
        : <>
          {!single && <ol className="cx-attempts">
            {attempts.map((a, i) => (
              <li key={a.id}>
                <button type="button" className={a.id === picked ? "on" : undefined} onClick={() => setPicked(a.id)}>
                  <span className="cx-att-n mono">#{i + 1}</span>
                  <span className="cx-att-when mono">{clock(Math.max(0, a.minute))}</span>
                  <span className={`cx-att-verdict ${verdictClass(a.verdict)}`}>
                    {verdictLabel(a.verdict, lang)}
                    {a.verdict !== "ACCEPTED" && a.passed !== null && a.total !== null && <small className="mono"> {a.passed}/{a.total}</small>}
                  </span>
                  <span className="cx-att-stat mono">{LANGS[a.language] || a.language}</span>
                  <span className="cx-att-stat mono">{a.runtime_ms === null ? "—" : `${a.runtime_ms} ms`}</span>
                  <span className="cx-att-stat mono">{a.memory_kb === null ? "—" : `${a.memory_kb} KB`}</span>
                </button>
              </li>
            ))}
          </ol>}

          {current && <div className="cx-code">
            <div className="cx-code-bar">
              <span className={`cx-att-verdict ${verdictClass(current.verdict)}`}>{verdictLabel(current.verdict, lang)}</span>
              <span className="mono">{LANGS[current.language] || current.language}</span>
              <span className="mono">{current.runtime_ms === null ? "—" : `${current.runtime_ms} ms`}</span>
              <span className="mono">{current.memory_kb === null ? "—" : `${current.memory_kb} KB`}</span>
              <span className="mono muted">+{clock(Math.max(0, current.minute))}</span>
            </div>
            {!result && <div className="screen-state" role="status"><span className="spinner" aria-hidden /></div>}
            {result?.state === "ok" && <CodeBlock code={result.source}
              lang={(result.language || current.language) === "python3" ? "python" : "cpp"}
              filename={(result.language || current.language) === "python3" ? "main.py" : "main.cpp"} />}
            {result?.state === "running" && <div className="code-locked"><span className="code-locked-ic" aria-hidden><CxIcon d={CX_LOCK} /></span><p className="muted">{tr(lang, "contests.code_running")}</p></div>}
            {result?.state === "locked" && <div className="code-locked">
              <span className="code-locked-ic" aria-hidden><CxIcon d={CX_LOCK} /></span>
              <p className="muted">{tr(lang, "contests.code_locked")}</p>
              <button className="primary" onClick={unlock} disabled={busy || result.balance < result.cost}>{tr(lang, "contests.code_unlock", { n: result.cost })}</button>
              <p className="muted mono">◎ {result.balance}</p>
            </div>}
            {result?.state === "signed-out" && <p className="muted">{tr(lang, "contests.code_sign_in")}</p>}
            {(result?.state === "offline" || result?.state === "insufficient") && <p className="muted">{tr(lang, "contests.code_failed")}</p>}
          </div>}
        </>}
    </div>
  </div>;
}

/* Every attempt sent during the round, newest first: Codeforces' "Status".
   A row opens its code in the same window a standings cell does. */
function StatusTab({ lang, slug, board, onOpenSubmissions }: {
  lang: Lang; slug: string; board: Standings; onOpenSubmissions: (handle: string) => void;
}) {
  const [idx, setIdx] = useState("");
  const [verdict, setVerdict] = useState("");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<Attempt | null>(null);
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

  const problemTitle = (i: string) => {
    const p = board.problems.find((x) => x.idx === i);
    return p ? titleOf(lang, p) : i;
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
          {board.problems.map((p) => <option key={p.idx} value={p.idx}>{p.idx} — {titleOf(lang, p)}</option>)}
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
      : load.data.rows.length === 0 ? <EmptyState lang={lang} icon="search" title={tr(lang, "contests.status_none")} body={tr(lang, "contests.status_none_body")} />
      : <div className="cx-status-wrap"><table className="cx-status">
        <thead><tr>
          <th>{tr(lang, "contests.col_when")}</th>
          <th>{tr(lang, "contests.participant")}</th>
          <th>{tr(lang, "contests.col_problem")}</th>
          <th>{tr(lang, "contests.col_lang")}</th>
          <th>{tr(lang, "contests.col_verdict")}</th>
          <th className="cx-r">{tr(lang, "contests.col_time")}</th>
          <th className="cx-r">{tr(lang, "contests.col_memory")}</th>
          <th aria-label={tr(lang, "contests.code")} />
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
            <td className="cs-prob"><b>{r.idx}</b> <span>{problemTitle(r.idx)}</span></td>
            <td className="cs-lang mono">{LANGS[r.language] || r.language}</td>
            <td className="cs-verdict">
              <span className={`sub-verdict ${ok ? "ok" : "bad"}`}>
                {verdictLabel(r.verdict, lang)}
                {!ok && r.passed !== null && r.total !== null && <small className="mono"> {r.passed}/{r.total}</small>}
              </span>
            </td>
            <td className="cs-time cx-r mono">{r.runtime_ms === null ? "—" : `${r.runtime_ms} ms`}</td>
            <td className="cs-mem cx-r mono">{r.memory_kb === null ? "—" : `${r.memory_kb} KB`}</td>
            <td className="cs-code"><button type="button" className="cx-code-btn" onClick={() => setOpen(r)} aria-label={tr(lang, "contests.code")} title={tr(lang, "contests.code")}><CxIcon d={CX_CODE} /></button></td>
          </tr>;
        })}</tbody>
      </table></div>}

    {load.state === "ready" && pages > 1 && <nav className="leader-pager" aria-label={tr(lang, "contests.tab_status")}>
      <button type="button" className="secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>← {tr(lang, "contests.prev")}</button>
      <span className="muted">{page * STATUS_PAGE + 1}–{Math.min(total, (page + 1) * STATUS_PAGE)} / {total}</span>
      <button type="button" className="secondary" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>{tr(lang, "contests.next")} →</button>
    </nav>}

    {open && <SubmissionsModal lang={lang} single
      title={`${open.idx}. ${problemTitle(open.idx)}`}
      subtitle={open.display_name?.trim() || open.username}
      load={async () => ({ state: "ready", data: [open] })}
      onClose={() => setOpen(null)} />}
  </>;
}
