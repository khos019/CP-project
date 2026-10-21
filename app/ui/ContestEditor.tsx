"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { tr, type Lang } from "./i18n";
import { MathText } from "./math-text";
import { ratingColor } from "./rating";
import { ownerRpc, toTashkentInput, fromTashkentInput, lasting } from "./contest-data";

/* The owner's contest editor: /contests/new and /contests/<slug>/edit.
 *
 * Laid out the way a judge's problem-setting page is (Robocontest, Polygon):
 * the round's own settings first, then one page per problem with its limits,
 * statement, samples and hidden tests. Tests can be typed, picked as files or
 * dropped in as a ZIP; files pair up by name (1.in / 1.out, 01 / 01.a,
 * input1.txt / output1.txt, input/1.txt / output/1.txt).
 *
 * Everything is saved in one call, owner_contest_save (065), which checks the
 * caller is the owner. A problem's tests travel only when they changed, so
 * fixing a typo in a statement does not resend megabytes of input. */

type Sample = { input: string; output: string };
type Test = { stdin: string; expected: string };
type Problem = {
  key: number;                 // React key; idx can change when problems move
  origIdx: string | null;      // the slot it was loaded from, for "did its tests move"
  idx: string; title_uz: string; title_en: string; rating: number;
  statement: string; input_spec: string; output_spec: string; notes: string;
  time_limit_ms: number; memory_mb: number;
  samples: Sample[]; tests: Test[]; testsDirty: boolean; entries: number;
};
type Draft = {
  slug: string; title_uz: string; title_en: string; description: string;
  starts: string; duration: number; penalty: number; hidden: boolean;
  problems: Problem[];
};
type Loaded = {
  slug: string; kind: string; title_uz: string; title_en: string; description: string;
  starts_at: string; duration_minutes: number; penalty_minutes: number; hidden: boolean; entries: number;
  problems: (Omit<Problem, "key" | "origIdx" | "testsDirty" | "samples" | "tests" | "statement" | "input_spec" | "output_spec" | "notes" | "time_limit_ms" | "memory_mb"> & {
    statement: string | null; input_spec: string | null; output_spec: string | null; notes: string | null;
    time_limit_ms: number | null; memory_mb: number | null; samples: Sample[] | null; tests: Test[];
  })[];
};

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let nextKey = 1;
const blankProblem = (idx: string): Problem => ({
  key: nextKey++, origIdx: null, idx, title_uz: "", title_en: "", rating: 800,
  statement: "", input_spec: "", output_spec: "", notes: "", time_limit_ms: 1000, memory_mb: 256,
  samples: [{ input: "", output: "" }], tests: [], testsDirty: true, entries: 0,
});
const nextHour = () => {
  const d = new Date(Date.now() + 24 * 3600_000);
  d.setUTCMinutes(0, 0, 0);
  return toTashkentInput(d.toISOString());
};
const blankDraft = (): Draft => ({
  slug: "", title_uz: "", title_en: "", description: "", starts: nextHour(), duration: 120, penalty: 20, hidden: true,
  // A round is created first and filled later (066), so it starts empty.
  problems: [],
});

/* "AlgoYo'l Raund #3 — Bahor" → "algoyol-raund-3-bahor". */
const slugify = (s: string) => s.toLowerCase()
  .replace(/[‘’ʻʼ'`]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);

const bytes = (n: number) => (n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`);
const sizeOf = (t: Test) => t.stdin.length + t.expected.length;
const preview = (s: string) => {
  const one = s.replace(/\s+/g, " ").trim();
  return one.length > 48 ? `${one.slice(0, 48)}…` : one || "∅";
};

/* ------------------------------------------------------------ test files */

/* Which half of a test a file is, and the name it pairs on. */
function classify(path: string): { key: string; role: "in" | "out" } | null {
  const clean = path.replace(/\\/g, "/");
  const base = clean.split("/").pop() || "";
  if (!base || base.startsWith(".") || clean.includes("__MACOSX/")) return null;
  const lower = clean.toLowerCase();
  const ext = /\.([a-z0-9]+)$/i.exec(base)?.[1]?.toLowerCase() || "";
  const stem = ext ? clean.slice(0, -(ext.length + 1)) : clean;
  if (["in", "inp", "input"].includes(ext)) return { key: stem.toLowerCase(), role: "in" };
  if (["out", "ans", "a", "sol", "ok", "output", "res", "answer"].includes(ext)) return { key: stem.toLowerCase(), role: "out" };
  // input1.txt / output1.txt, input/1.txt / output/1.txt
  if (/input/.test(lower)) return { key: lower.replace(/input/g, "#").replace(/\.[a-z0-9]+$/, ""), role: "in" };
  if (/output|answer/.test(lower)) return { key: lower.replace(/output|answer/g, "#").replace(/\.[a-z0-9]+$/, ""), role: "out" };
  // Polygon: "01" is the input, "01.a" the answer.
  if (!ext) return { key: lower, role: "in" };
  return null;
}

const natural = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

function pairFiles(files: { path: string; text: string }[]): { tests: Test[]; unpaired: string[] } {
  const groups = new Map<string, { in?: string; out?: string; names: string[] }>();
  const unpaired: string[] = [];
  for (const f of files) {
    const c = classify(f.path);
    if (!c) { unpaired.push(f.path); continue; }
    const g = groups.get(c.key) || { names: [] };
    g[c.role] = f.text;
    g.names.push(f.path);
    groups.set(c.key, g);
  }
  const tests: Test[] = [];
  for (const key of [...groups.keys()].sort(natural)) {
    const g = groups.get(key)!;
    if (g.in !== undefined && g.out !== undefined) tests.push({ stdin: g.in, expected: g.out });
    else unpaired.push(...g.names);
  }
  return { tests, unpaired };
}

/* A ZIP, read with the browser's own inflater — no library for one format.
   Central directory first (it has the true sizes even when the local headers
   defer them to a data descriptor), then each entry's data. */
async function readZip(file: File): Promise<{ path: string; text: string }[]> {
  const buf = new Uint8Array(await file.arrayBuffer());
  const view = new DataView(buf.buffer);
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("zip");
  const count = view.getUint16(eocd + 10, true);
  let p = view.getUint32(eocd + 16, true);
  const out: { path: string; text: string }[] = [];
  const decoder = new TextDecoder();
  for (let n = 0; n < count; n++) {
    if (view.getUint32(p, true) !== 0x02014b50) throw new Error("zip");
    const method = view.getUint16(p + 10, true);
    const csize = view.getUint32(p + 20, true);
    const nameLen = view.getUint16(p + 28, true), extraLen = view.getUint16(p + 30, true), commentLen = view.getUint16(p + 32, true);
    const local = view.getUint32(p + 42, true);
    const path = decoder.decode(buf.subarray(p + 46, p + 46 + nameLen));
    p += 46 + nameLen + extraLen + commentLen;
    if (path.endsWith("/")) continue;
    const lNameLen = view.getUint16(local + 26, true), lExtraLen = view.getUint16(local + 28, true);
    const start = local + 30 + lNameLen + lExtraLen;
    const raw = buf.slice(start, start + csize);
    let data: Uint8Array;
    if (method === 0) data = raw;
    else if (method === 8) {
      const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
      data = new Uint8Array(await new Response(stream).arrayBuffer());
    } else continue;
    out.push({ path, text: decoder.decode(data) });
  }
  return out;
}

/* Windows line endings are the commonest way a correct answer is judged
   wrong; the judge compares trimmed lines, but the input reaches the program
   as written, so it is normalised here once. */
const normalise = (s: string) => s.replace(/\r\n?/g, "\n");

/* ------------------------------------------------------------ the editor */

export function ContestEditor({ lang, slug, onDone, onCancel, onDeleted }: {
  lang: Lang; slug: string | null; onDone: (slug: string) => void; onCancel: () => void; onDeleted: () => void;
}) {
  const [draft, setDraft] = useState<Draft | null>(slug ? null : blankDraft());
  const [state, setState] = useState<"loading" | "ready" | "not-migrated" | "error" | "missing">(slug ? "loading" : "ready");
  // A seeded archive round: its problems are bank problems and its window
  // holds the board, so only its titles and visibility are editable.
  const [archive, setArchive] = useState(false);
  const [section, setSection] = useState<"round" | number>("round");
  const [slugTouched, setSlugTouched] = useState(Boolean(slug));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "bad"; text: string } | null>(null);
  const [roundEntries, setRoundEntries] = useState(0);

  useEffect(() => {
    if (!slug) return;
    let live = true;
    void ownerRpc<Loaded | null>("owner_contest_get", { p_slug: slug }).then((got) => {
      if (!live) return;
      if (!got.ok) { setState(got.error === "not_migrated" ? "not-migrated" : "error"); return; }
      const c = got.data;
      if (!c) { setState("missing"); return; }
      setArchive(c.kind !== "custom");
      setRoundEntries(c.entries);
      setDraft({
        slug: c.slug, title_uz: c.title_uz, title_en: c.title_en === c.title_uz ? "" : c.title_en, description: c.description || "",
        starts: toTashkentInput(c.starts_at), duration: c.duration_minutes, penalty: c.penalty_minutes, hidden: c.hidden,
        problems: c.kind !== "custom" ? [] : c.problems.map((p) => ({
          key: nextKey++, origIdx: p.idx, idx: p.idx, title_uz: p.title_uz, title_en: p.title_en === p.title_uz ? "" : p.title_en,
          rating: p.rating, statement: p.statement || "", input_spec: p.input_spec || "", output_spec: p.output_spec || "",
          notes: p.notes || "", time_limit_ms: p.time_limit_ms || 1000, memory_mb: p.memory_mb || 256,
          samples: p.samples || [], tests: p.tests || [], testsDirty: false, entries: p.entries || 0,
        })),
      });
      setState("ready");
    });
    return () => { live = false; };
  }, [slug]);

  const issues = useMemo(() => (draft ? validate(draft, lang) : []), [draft, lang]);

  if (state !== "ready" || !draft) {
    const text = state === "loading" ? null
      : tr(lang, state === "not-migrated" ? "contests.editor_not_migrated" : state === "missing" ? "contests.not_found" : "contests.load_error");
    return <>
      <button type="button" className="back-link" onClick={onCancel}>← {tr(lang, "contests.ed_back")}</button>
      {text ? <div className="panel"><div className={`notice ${state === "error" ? "notice-error" : ""}`}>{text}</div></div>
        : <div className="screen-state" role="status"><span className="spinner" aria-hidden /></div>}
    </>;
  }

  const set = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d));
  const setProblem = (i: number, patch: Partial<Problem>) => setDraft((d) => d && ({
    ...d, problems: d.problems.map((p, j) => (j === i ? { ...p, ...patch } : p)),
  }));
  // Letters follow the order; a problem that changes letter carries its tests
  // to the new slot, so they are resent.
  const relabel = (list: Problem[]) => list.map((p, i) => {
    const idx = LETTERS[i];
    return { ...p, idx, testsDirty: p.testsDirty || p.origIdx !== idx };
  });
  const addProblem = () => {
    if (draft.problems.length >= 26) return;
    set({ problems: [...draft.problems, blankProblem(LETTERS[draft.problems.length])] });
    setSection(draft.problems.length);
  };
  const removeProblem = (i: number) => {
    const p = draft.problems[i];
    if (p.entries > 0) { setMessage({ tone: "bad", text: tr(lang, "contests.ed_err_problem_has_submissions") }); return; }
    if (!window.confirm(tr(lang, "contests.ed_confirm_remove", { idx: p.idx }))) return;
    set({ problems: relabel(draft.problems.filter((_, j) => j !== i)) });
    setSection(i > 0 ? i - 1 : "round");
  };
  const moveProblem = (i: number, by: -1 | 1) => {
    const j = i + by;
    if (j < 0 || j >= draft.problems.length) return;
    const list = [...draft.problems];
    [list[i], list[j]] = [list[j], list[i]];
    set({ problems: relabel(list) });
    setSection(j);
  };

  const blocking = issues.filter((x) => x.block);
  const warnings = issues.filter((x) => !x.block);
  const failed = (error: string) => {
    const code = error.split(":")[0];
    // no_problems comes from 065's version of the function; 066 lifts it.
    if (code === "no_problems" || (code === "not_migrated" && archive)) { setMessage({ tone: "bad", text: tr(lang, "contests.ed_err_need_066") }); return; }
    const known = ["slug_taken", "bad_slug", "bad_title", "problem_has_submissions", "not_migrated", "bad_problem_title", "not_authenticated"];
    setMessage({ tone: "bad", text: known.includes(code) ? tr(lang, `contests.ed_err_${code}`) : tr(lang, "contests.ed_err_generic", { e: error }) });
  };

  const save = async () => {
    if (blocking.length) { setMessage({ tone: "bad", text: tr(lang, "contests.ed_fix_first", { n: blocking.length }) }); return; }
    setSaving(true);
    setMessage(null);
    if (archive && slug) {
      const got = await ownerRpc<{ ok: boolean; slug: string }>("owner_contest_settings", {
        p_slug: slug, p: { title_uz: draft.title_uz.trim(), title_en: draft.title_en.trim(), description: draft.description.trim(), hidden: draft.hidden },
      });
      setSaving(false);
      if (!got.ok) { failed(got.error); return; }
      onDone(slug);
      return;
    }
    const payload = {
      slug: draft.slug, title_uz: draft.title_uz.trim(), title_en: draft.title_en.trim(), description: draft.description.trim(),
      starts_at: fromTashkentInput(draft.starts), duration_minutes: draft.duration, penalty_minutes: draft.penalty, hidden: draft.hidden,
      problems: draft.problems.map((p) => ({
        idx: p.idx, title_uz: p.title_uz.trim(), title_en: p.title_en.trim(), rating: p.rating,
        statement: p.statement, input_spec: p.input_spec, output_spec: p.output_spec, notes: p.notes,
        time_limit_ms: p.time_limit_ms, memory_mb: p.memory_mb,
        samples: p.samples.filter((s) => s.input.trim() || s.output.trim()),
        ...(p.testsDirty ? { tests: p.tests } : {}),
      })),
    };
    const got = await ownerRpc<{ ok: boolean; slug: string }>("owner_contest_save", { p_original: slug, p: payload });
    setSaving(false);
    if (!got.ok) { failed(got.error); return; }
    onDone(got.data.slug);
  };

  const remove = async () => {
    if (!slug) return;
    if (!window.confirm(tr(lang, "contests.ed_confirm_delete", { n: roundEntries }))) return;
    const got = await ownerRpc("owner_contest_delete", { p_slug: slug });
    if (got.ok) onDeleted();
    else setMessage({ tone: "bad", text: tr(lang, "contests.ed_err_generic", { e: got.error }) });
  };

  const totalTests = draft.problems.reduce((s, p) => s + p.tests.length, 0);
  const current = typeof section === "number" ? draft.problems[section] : null;

  return <div className="cxe">
    <div className="cxe-bar">
      <button type="button" className="back-link" onClick={onCancel}>← {tr(lang, "contests.ed_back")}</button>
      <div className="cxe-bar-title">
        <p className="eyebrow">{tr(lang, slug ? "contests.ed_edit_eyebrow" : "contests.ed_new_eyebrow")}</p>
        <h1 className="page-title">{draft.title_uz.trim() || tr(lang, "contests.ed_untitled")}</h1>
      </div>
      <div className="cxe-bar-actions">
        <button type="button" className="secondary" onClick={onCancel}>{tr(lang, "contests.ed_cancel")}</button>
        <button type="button" className="primary" onClick={save} disabled={saving}>{saving ? tr(lang, "contests.ed_saving") : tr(lang, slug ? "contests.ed_save" : "contests.ed_create")}</button>
      </div>
    </div>
    {message && <div className={`notice ${message.tone === "bad" ? "notice-error" : ""} cxe-msg`} role="alert">{message.text}</div>}

    <div className="cxe-layout">
      <aside className="cxe-nav" aria-label={tr(lang, "contests.ed_sections")}>
        <button type="button" className={section === "round" ? "on" : undefined} onClick={() => setSection("round")}>
          <span className="cxe-nav-ic">⚙</span><span><b>{tr(lang, "contests.ed_round")}</b><small>{lasting(draft.duration, lang)} · {draft.hidden ? tr(lang, "contests.hidden") : tr(lang, "contests.ed_public")}</small></span>
        </button>
        {archive ? <p className="cxe-archive-note muted">{tr(lang, "contests.ed_archive_note")}</p> : <>
        <p className="cxe-nav-label">{tr(lang, "contests.problems")} · {draft.problems.length}</p>
        {draft.problems.length === 0 && <p className="cxe-archive-note muted">{tr(lang, "contests.ed_no_problems_yet")}</p>}
        {draft.problems.map((p, i) => {
          const bad = issues.some((x) => x.where === p.idx);
          return <button type="button" key={p.key} className={section === i ? "on" : undefined} onClick={() => setSection(i)}>
            <span className="cxe-nav-idx" style={{ ["--pc" as string]: ratingColor(p.rating) }}>{p.idx}</span>
            <span><b>{p.title_uz.trim() || tr(lang, "contests.ed_untitled")}</b><small>{tr(lang, "contests.ed_tests_n", { n: p.tests.length })} · {p.time_limit_ms / 1000}s · {p.memory_mb}MB</small></span>
            {bad && <i className="cxe-dot" aria-label={tr(lang, "contests.ed_has_issues")} />}
          </button>;
        })}
        {draft.problems.length < 26 && <button type="button" className="cxe-add-problem" onClick={addProblem}>+ {tr(lang, "contests.ed_add_problem")}</button>}
        </>}

        <div className="cxe-check">
          <b>{blocking.length ? tr(lang, "contests.ed_issues_n", { n: blocking.length }) : tr(lang, "contests.ed_ready")}</b>
          {!blocking.length && warnings.length > 0 && <p className="muted">{tr(lang, "contests.ed_warnings_note", { n: warnings.length })}</p>}
          {issues.length > 0 ? <ul>{issues.slice(0, 8).map((x, i) => <li key={i} className={x.block ? undefined : "warn"}><button type="button" onClick={() => {
            const k = draft.problems.findIndex((p) => p.idx === x.where);
            setSection(k >= 0 ? k : "round");
          }}>{x.where !== "round" && <b>{x.where}: </b>}{x.text}</button></li>)}</ul>
            : <p className="muted">{tr(lang, "contests.ed_ready_body", { p: draft.problems.length, t: totalTests })}</p>}
        </div>
      </aside>

      <section className="cxe-main">
        {section === "round" && <RoundSettings lang={lang} draft={draft} set={set} slugTouched={slugTouched}
          onSlugTouched={() => setSlugTouched(true)} canDelete={Boolean(slug) && !archive} onDelete={remove} entries={roundEntries} archive={archive} />}
        {current && typeof section === "number" && <ProblemEditor key={current.key} lang={lang} p={current} count={draft.problems.length} index={section}
          set={(patch) => setProblem(section, patch)} onMove={(by) => moveProblem(section, by)} onRemove={() => removeProblem(section)} />}
      </section>
    </div>
  </div>;
}

/* Only the round's own fields block a save. A problem can stay half-written
   for as long as the owner likes; its gaps are listed as reminders. */
type Issue = { where: string; text: string; block: boolean };
function validate(d: Draft, lang: Lang): Issue[] {
  const out: Issue[] = [];
  const t = (k: string, v?: Record<string, string | number>) => tr(lang, `contests.ed_v_${k}`, v);
  const round = (text: string) => out.push({ where: "round", text, block: true });
  if (!d.title_uz.trim()) round(t("title"));
  if (!/^[a-z0-9-]{3,64}$/.test(d.slug) || d.slug === "new" || d.slug === "edit") round(t("slug"));
  if (!d.starts || Number.isNaN(Date.parse(`${d.starts}:00+05:00`))) round(t("start"));
  if (!(d.duration >= 30 && d.duration <= 600)) round(t("duration"));
  if (!(d.penalty >= 0 && d.penalty <= 60)) round(t("penalty"));
  for (const p of d.problems) {
    // The database refuses these limits, so they do block.
    if (!(p.time_limit_ms >= 250 && p.time_limit_ms <= 10000)) out.push({ where: p.idx, text: t("p_tl"), block: true });
    if (!(p.memory_mb >= 16 && p.memory_mb <= 1024)) out.push({ where: p.idx, text: t("p_ml"), block: true });
    if (!p.title_uz.trim()) out.push({ where: p.idx, text: t("p_title"), block: false });
    if (!p.statement.trim()) out.push({ where: p.idx, text: t("p_statement"), block: false });
    if (!p.tests.length) out.push({ where: p.idx, text: t("p_tests"), block: false });
    if (p.tests.some((x) => !x.expected.trim())) out.push({ where: p.idx, text: t("p_empty_answer"), block: false });
  }
  return out;
}

/* ------------------------------------------------------------ round settings */

function Field({ label, hint, children, wide }: { label: string; hint?: string; children: React.ReactNode; wide?: boolean }) {
  return <label className={`cxe-field${wide ? " wide" : ""}`}>
    <span className="cxe-label">{label}</span>
    {children}
    {hint && <small className="cxe-hint">{hint}</small>}
  </label>;
}

function RoundSettings({ lang, draft, set, slugTouched, onSlugTouched, canDelete, onDelete, entries, archive }: {
  lang: Lang; draft: Draft; set: (patch: Partial<Draft>) => void; slugTouched: boolean; onSlugTouched: () => void;
  canDelete: boolean; onDelete: () => void; entries: number; archive: boolean;
}) {
  const hours = Math.floor(draft.duration / 60), minutes = draft.duration % 60;
  const ends = (() => {
    const at = Date.parse(`${draft.starts}:00+05:00`);
    return Number.isNaN(at) ? "" : new Date(at + draft.duration * 60000 + 5 * 3600_000).toISOString().slice(0, 16).replace("T", " ");
  })();
  return <div className="cxe-card">
    <header className="cxe-card-head"><h2>{tr(lang, "contests.ed_round")}</h2><p className="muted">{tr(lang, archive ? "contests.ed_archive_lead" : "contests.ed_round_lead")}</p></header>
    <div className="cxe-grid">
      <Field label={tr(lang, "contests.ed_title_uz")} wide>
        <input value={draft.title_uz} maxLength={120} placeholder="AlgoYo‘l Raund #1"
          onChange={(e) => set({ title_uz: e.target.value, ...(slugTouched || archive ? {} : { slug: slugify(e.target.value) }) })} />
      </Field>
      <Field label={tr(lang, "contests.ed_title_en")} hint={tr(lang, "contests.ed_title_en_hint")} wide>
        <input value={draft.title_en} maxLength={120} placeholder="AlgoYol Round #1" onChange={(e) => set({ title_en: e.target.value })} />
      </Field>
      <Field label={tr(lang, "contests.ed_slug")} hint={`algoyol.uz/contests/${draft.slug || "…"}`} wide>
        <input value={draft.slug} maxLength={64} className="mono" placeholder="raund-1" disabled={archive}
          onChange={(e) => { onSlugTouched(); set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }); }} />
      </Field>
      <Field label={tr(lang, "contests.ed_starts")} hint={tr(lang, "contests.ed_starts_hint")}>
        <input type="datetime-local" value={draft.starts} disabled={archive} onChange={(e) => set({ starts: e.target.value })} />
      </Field>
      <Field label={tr(lang, "contests.ed_duration")} hint={ends ? tr(lang, "contests.ed_ends_at", { t: ends }) : undefined}>
        <span className="cxe-pair">
          <input type="number" min={0} max={10} value={hours} disabled={archive} onChange={(e) => set({ duration: Math.max(0, Number(e.target.value) || 0) * 60 + minutes })} />
          <em>{tr(lang, "contests.ed_hours")}</em>
          <input type="number" min={0} max={59} step={5} value={minutes} disabled={archive} onChange={(e) => set({ duration: hours * 60 + Math.min(59, Math.max(0, Number(e.target.value) || 0)) })} />
          <em>{tr(lang, "contests.ed_minutes")}</em>
        </span>
      </Field>
      <Field label={tr(lang, "contests.ed_penalty")} hint={tr(lang, "contests.ed_penalty_hint")}>
        <input type="number" min={0} max={60} value={draft.penalty} disabled={archive} onChange={(e) => set({ penalty: Number(e.target.value) || 0 })} />
      </Field>
      <Field label={tr(lang, "contests.ed_visibility")}>
        <span className="cxe-toggle">
          <button type="button" className={draft.hidden ? "on" : undefined} onClick={() => set({ hidden: true })}>{tr(lang, "contests.hidden")}</button>
          <button type="button" className={!draft.hidden ? "on" : undefined} onClick={() => set({ hidden: false })}>{tr(lang, "contests.ed_public")}</button>
        </span>
        <small className="cxe-hint">{tr(lang, draft.hidden ? "contests.ed_hidden_hint" : "contests.ed_public_hint")}</small>
      </Field>
      <Field label={tr(lang, "contests.ed_description")} hint={tr(lang, "contests.ed_description_hint")} wide>
        <textarea rows={3} value={draft.description} maxLength={1000} onChange={(e) => set({ description: e.target.value })} />
      </Field>
    </div>
    {canDelete && <div className="cxe-danger">
      <div><b>{tr(lang, "contests.ed_delete")}</b><p className="muted">{tr(lang, "contests.ed_delete_body", { n: entries })}</p></div>
      <button type="button" className="cxe-danger-btn" onClick={onDelete}>{tr(lang, "contests.ed_delete")}</button>
    </div>}
  </div>;
}

/* ------------------------------------------------------------ one problem */

function ProblemEditor({ lang, p, count, index, set, onMove, onRemove }: {
  lang: Lang; p: Problem; count: number; index: number;
  set: (patch: Partial<Problem>) => void; onMove: (by: -1 | 1) => void; onRemove: () => void;
}) {
  const [tab, setTab] = useState<"statement" | "samples" | "tests">("statement");
  const [showPreview, setShowPreview] = useState(false);
  const tabs: { id: typeof tab; label: string; n?: number }[] = [
    { id: "statement", label: tr(lang, "contests.ed_tab_statement") },
    { id: "samples", label: tr(lang, "contests.ed_tab_samples"), n: p.samples.length },
    { id: "tests", label: tr(lang, "contests.ed_tab_tests"), n: p.tests.length },
  ];
  return <div className="cxe-card">
    <header className="cxe-card-head cxe-problem-head">
      <span className="cxe-big-idx" style={{ ["--pc" as string]: ratingColor(p.rating) }}>{p.idx}</span>
      <div className="cxe-problem-title">
        <input className="cxe-title-input" value={p.title_uz} maxLength={120} placeholder={tr(lang, "contests.ed_problem_title")} onChange={(e) => set({ title_uz: e.target.value })} />
        <input className="cxe-subtitle-input" value={p.title_en} maxLength={120} placeholder={tr(lang, "contests.ed_problem_title_en")} onChange={(e) => set({ title_en: e.target.value })} />
      </div>
      <div className="cxe-problem-tools">
        <button type="button" className="cx-ghost-btn" disabled={index === 0} onClick={() => onMove(-1)} aria-label={tr(lang, "contests.ed_move_up")}>↑</button>
        <button type="button" className="cx-ghost-btn" disabled={index === count - 1} onClick={() => onMove(1)} aria-label={tr(lang, "contests.ed_move_down")}>↓</button>
        <button type="button" className="cx-ghost-btn cxe-del" onClick={onRemove}>{tr(lang, "contests.ed_remove")}</button>
      </div>
    </header>

    <div className="cxe-limits">
      <Field label={tr(lang, "contests.ed_tl")}>
        <span className="cxe-unit"><input type="number" min={0.25} max={10} step={0.25} value={p.time_limit_ms / 1000}
          onChange={(e) => set({ time_limit_ms: Math.round((Number(e.target.value) || 0) * 1000) })} /><em>s</em></span>
      </Field>
      <Field label={tr(lang, "contests.ed_ml")}>
        <span className="cxe-unit"><input type="number" min={16} max={1024} step={16} value={p.memory_mb}
          onChange={(e) => set({ memory_mb: Number(e.target.value) || 0 })} /><em>MB</em></span>
      </Field>
      <Field label={tr(lang, "contests.ed_rating")}>
        <span className="cxe-unit"><input type="number" min={800} max={3500} step={100} value={p.rating} style={{ color: ratingColor(p.rating) }}
          onChange={(e) => set({ rating: Number(e.target.value) || 800 })} /><em>★</em></span>
      </Field>
      <div className="cxe-limits-note muted">{tr(lang, "contests.ed_tl_note")}</div>
    </div>

    <nav className="cxe-tabs">
      {tabs.map((t) => <button key={t.id} type="button" className={tab === t.id ? "on" : undefined} onClick={() => setTab(t.id)}>
        {t.label}{t.n !== undefined && <small>{t.n}</small>}
      </button>)}
      {tab === "statement" && <button type="button" className={`cxe-preview-btn${showPreview ? " on" : ""}`} onClick={() => setShowPreview((v) => !v)}>
        {tr(lang, showPreview ? "contests.ed_hide_preview" : "contests.ed_show_preview")}
      </button>}
    </nav>

    {tab === "statement" && <div className={`cxe-statement${showPreview ? " split" : ""}`}>
      <div className="cxe-grid one">
        <Field label={tr(lang, "contests.ed_statement")} hint={tr(lang, "contests.ed_math_hint")} wide>
          <textarea rows={10} value={p.statement} onChange={(e) => set({ statement: e.target.value })} placeholder={tr(lang, "contests.ed_statement_ph")} />
        </Field>
        <Field label={tr(lang, "contests.ed_input")} wide>
          <textarea rows={4} value={p.input_spec} onChange={(e) => set({ input_spec: e.target.value })} placeholder={tr(lang, "contests.ed_input_ph")} />
        </Field>
        <Field label={tr(lang, "contests.ed_output")} wide>
          <textarea rows={3} value={p.output_spec} onChange={(e) => set({ output_spec: e.target.value })} placeholder={tr(lang, "contests.ed_output_ph")} />
        </Field>
        <Field label={tr(lang, "contests.ed_notes")} wide>
          <textarea rows={3} value={p.notes} onChange={(e) => set({ notes: e.target.value })} placeholder={tr(lang, "contests.ed_notes_ph")} />
        </Field>
      </div>
      {showPreview && <StatementPreview lang={lang} p={p} />}
    </div>}

    {tab === "samples" && <SamplesEditor lang={lang} p={p} set={set} />}
    {tab === "tests" && <TestsEditor lang={lang} p={p} set={set} />}
  </div>;
}

function StatementPreview({ lang, p }: { lang: Lang; p: Problem }) {
  const prose = (text: string) => text.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)
    .map((x, i) => <p key={i} className="cxp-para"><MathText text={x} /></p>);
  return <article className="cxe-preview statement">
    <p className="eyebrow">{tr(lang, "contests.ed_preview")}</p>
    <h2>{p.idx}. {p.title_uz || tr(lang, "contests.ed_untitled")}</h2>
    <div className="cxp-limits"><span>⏱ {p.time_limit_ms / 1000} s</span><span>▦ {p.memory_mb} MB</span></div>
    {prose(p.statement)}
    {p.input_spec && <><h3>{tr(lang, "algoYolApp.kirish")}</h3>{prose(p.input_spec)}</>}
    {p.output_spec && <><h3>{tr(lang, "algoYolApp.chiqish")}</h3>{prose(p.output_spec)}</>}
    {p.samples.filter((s) => s.input || s.output).map((s, i) => <div className="cxp-sample" key={i}>
      <div><b>{tr(lang, "contests.p_input_n", { n: i + 1 })}</b><pre>{s.input}</pre></div>
      <div><b>{tr(lang, "contests.p_output_n", { n: i + 1 })}</b><pre>{s.output}</pre></div>
    </div>)}
    {p.notes && <><h3>{tr(lang, "contests.p_notes")}</h3>{prose(p.notes)}</>}
  </article>;
}

function SamplesEditor({ lang, p, set }: { lang: Lang; p: Problem; set: (patch: Partial<Problem>) => void }) {
  const update = (i: number, patch: Partial<Sample>) => set({ samples: p.samples.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
  const copyToTests = () => {
    const fresh = p.samples.filter((s) => s.input.trim() && s.output.trim())
      .filter((s) => !p.tests.some((t) => t.stdin === normalise(s.input) && t.expected === normalise(s.output)))
      .map((s) => ({ stdin: normalise(s.input), expected: normalise(s.output) }));
    if (fresh.length) set({ tests: [...fresh, ...p.tests], testsDirty: true });
  };
  return <div className="cxe-samples">
    <p className="muted cxe-lead">{tr(lang, "contests.ed_samples_lead")}</p>
    {p.samples.map((s, i) => <div className="cxe-sample" key={i}>
      <div className="cxe-sample-head"><b>{tr(lang, "contests.ed_sample_n", { n: i + 1 })}</b>
        <button type="button" className="cx-ghost-btn cxe-del" onClick={() => set({ samples: p.samples.filter((_, j) => j !== i) })}>{tr(lang, "contests.ed_remove")}</button></div>
      <div className="cxe-io">
        <label><span>{tr(lang, "algoYolApp.kirish")}</span><textarea rows={4} className="mono" value={s.input} onChange={(e) => update(i, { input: e.target.value })} /></label>
        <label><span>{tr(lang, "algoYolApp.chiqish")}</span><textarea rows={4} className="mono" value={s.output} onChange={(e) => update(i, { output: e.target.value })} /></label>
      </div>
    </div>)}
    <div className="cxe-row-actions">
      <button type="button" className="secondary" onClick={() => set({ samples: [...p.samples, { input: "", output: "" }] })}>+ {tr(lang, "contests.ed_add_sample")}</button>
      <button type="button" className="secondary" onClick={copyToTests} disabled={!p.samples.some((s) => s.input.trim() && s.output.trim())}>{tr(lang, "contests.ed_samples_to_tests")}</button>
    </div>
  </div>;
}

function TestsEditor({ lang, p, set }: { lang: Lang; p: Problem; set: (patch: Partial<Problem>) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const [note, setNote] = useState<{ tone: "ok" | "bad"; text: string } | null>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const filesRef = useRef<HTMLInputElement>(null);
  const total = p.tests.reduce((s, t) => s + sizeOf(t), 0);
  const put = (tests: Test[]) => set({ tests, testsDirty: true });

  const ingest = async (list: FileList | File[]) => {
    const files = Array.from(list);
    if (!files.length) return;
    setBusy(true);
    setNote(null);
    try {
      const read: { path: string; text: string }[] = [];
      for (const f of files) {
        if (/\.zip$/i.test(f.name)) read.push(...(await readZip(f)));
        else read.push({ path: (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name, text: await f.text() });
      }
      const { tests, unpaired } = pairFiles(read.map((x) => ({ path: x.path, text: normalise(x.text) })));
      if (!tests.length) {
        setNote({ tone: "bad", text: tr(lang, "contests.ed_tests_none_paired") });
      } else {
        const replace = p.tests.length > 0 && window.confirm(tr(lang, "contests.ed_tests_replace_q", { n: p.tests.length, m: tests.length }));
        put(replace ? tests : [...p.tests, ...tests]);
        setNote({ tone: "ok", text: tr(lang, "contests.ed_tests_added", { n: tests.length }) + (unpaired.length ? ` ${tr(lang, "contests.ed_tests_unpaired", { n: unpaired.length, list: unpaired.slice(0, 4).join(", ") })}` : "") });
      }
    } catch {
      setNote({ tone: "bad", text: tr(lang, "contests.ed_tests_zip_failed") });
    } finally {
      setBusy(false);
    }
  };

  const update = (i: number, patch: Partial<Test>) => put(p.tests.map((t, j) => (j === i ? { ...t, ...patch } : t)));
  const move = (i: number, by: -1 | 1) => {
    const j = i + by;
    if (j < 0 || j >= p.tests.length) return;
    const list = [...p.tests];
    [list[i], list[j]] = [list[j], list[i]];
    put(list);
    setOpen(j);
  };

  return <div className="cxe-tests">
    <div className={`cxe-drop${drag ? " drag" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); void ingest(e.dataTransfer.files); }}>
      <span className="cxe-drop-ic" aria-hidden>⇪</span>
      <div>
        <b>{busy ? tr(lang, "contests.ed_tests_reading") : tr(lang, "contests.ed_tests_drop")}</b>
        <small className="muted">{tr(lang, "contests.ed_tests_formats")}</small>
      </div>
      <button type="button" className="secondary" disabled={busy} onClick={() => filesRef.current?.click()}>{tr(lang, "contests.ed_tests_pick")}</button>
      <input ref={filesRef} type="file" multiple hidden onChange={(e) => { if (e.target.files) void ingest(e.target.files); e.target.value = ""; }} />
    </div>
    {note && <p className={`cxe-note ${note.tone}`}>{note.text}</p>}

    <div className="cxe-tests-head">
      <span className="muted">{tr(lang, "contests.ed_tests_summary", { n: p.tests.length, size: bytes(total) })}</span>
      {total > 8 * 1048576 && <span className="cxe-warn">{tr(lang, "contests.ed_tests_big")}</span>}
      <span className="cxe-tests-actions">
        <button type="button" className="secondary" onClick={() => { put([...p.tests, { stdin: "", expected: "" }]); setOpen(p.tests.length); }}>+ {tr(lang, "contests.ed_add_test")}</button>
        {p.tests.length > 0 && <button type="button" className="cx-ghost-btn cxe-del" onClick={() => { if (window.confirm(tr(lang, "contests.ed_tests_clear_q"))) put([]); }}>{tr(lang, "contests.ed_tests_clear")}</button>}
      </span>
    </div>

    {p.tests.length === 0 ? <p className="cxe-empty muted">{tr(lang, "contests.ed_tests_empty")}</p>
      : <ol className="cxe-test-list">
        {p.tests.map((t, i) => <li key={i} className={open === i ? "open" : undefined}>
          <div className="cxe-test-row">
            <button type="button" className="cxe-test-toggle" onClick={() => setOpen(open === i ? null : i)}>
              <span className="cxe-test-n mono">#{i + 1}</span>
              <span className="cxe-test-pre mono">{preview(t.stdin)}</span>
              <span className="cxe-test-arrow">→</span>
              <span className={`cxe-test-pre mono${t.expected.trim() ? "" : " bad"}`}>{preview(t.expected)}</span>
              <span className="cxe-test-size mono">{bytes(sizeOf(t))}</span>
            </button>
            <span className="cxe-test-tools">
              <button type="button" className="cx-ghost-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label={tr(lang, "contests.ed_move_up")}>↑</button>
              <button type="button" className="cx-ghost-btn" disabled={i === p.tests.length - 1} onClick={() => move(i, 1)} aria-label={tr(lang, "contests.ed_move_down")}>↓</button>
              <button type="button" className="cx-ghost-btn cxe-del" onClick={() => { put(p.tests.filter((_, j) => j !== i)); setOpen(null); }} aria-label={tr(lang, "contests.ed_remove")}>✕</button>
            </span>
          </div>
          {open === i && <div className="cxe-io">
            <label><span>{tr(lang, "algoYolApp.kirish")}</span>
              <textarea rows={6} className="mono" value={t.stdin.length > 200_000 ? t.stdin.slice(0, 200_000) : t.stdin} readOnly={t.stdin.length > 200_000}
                onChange={(e) => update(i, { stdin: normalise(e.target.value) })} />
              {t.stdin.length > 200_000 && <small className="cxe-hint">{tr(lang, "contests.ed_test_too_big")}</small>}</label>
            <label><span>{tr(lang, "contests.ed_expected")}</span>
              <textarea rows={6} className="mono" value={t.expected.length > 200_000 ? t.expected.slice(0, 200_000) : t.expected} readOnly={t.expected.length > 200_000}
                onChange={(e) => update(i, { expected: normalise(e.target.value) })} /></label>
          </div>}
        </li>)}
      </ol>}
  </div>;
}
