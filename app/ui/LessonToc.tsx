"use client";

import { useEffect, useState } from "react";

import { tr } from "./i18n";
// Sticky table of contents for a lesson.
//
// Lessons now run ten sections plus diagrams, code, resources and a practice
// table, which is far past what fits on a screen. This reads the headings that
// are actually rendered rather than duplicating a list of them, so a lesson
// that gains or loses a section cannot drift out of sync with its own contents.

type Entry = { id: string; text: string };

export function LessonToc({ lang, unitId }: { lang: "uz" | "en"; unitId: string }) {
  const [items, setItems] = useState<Entry[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const heads = [...document.querySelectorAll<HTMLHeadingElement>(".lesson-content h2")];
    const entries = heads.map((h, i) => {
      if (!h.id) h.id = `lesson-sec-${i + 1}`;
      return { id: h.id, text: h.textContent || `${i + 1}` };
    });
    // Reads the rendered headings: the state is a consequence of the DOM the
    // lesson just produced, not of this component rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(entries);
    setActive(entries[0]?.id || "");

    // rootMargin pulls the trigger line near the top of the viewport, so the
    // highlighted entry is the section you are reading, not one below the fold
    const io = new IntersectionObserver(
      es => {
        const visible = es.filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 },
    );
    heads.forEach(h => io.observe(h));
    return () => io.disconnect();
  }, [unitId]);

  if (items.length < 3) return null;

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <nav className="lesson-toc panel" aria-label={tr(lang,"lessonToc.bolimlar")}>
      <h3>{tr(lang,"lessonToc.bolimlar_2")}</h3>
      <ol>
        {items.map((it, i) => (
          <li key={it.id}>
            <button className={active === it.id ? "active" : ""} onClick={() => go(it.id)}>
              <span className="toc-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="toc-text">{it.text}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Previous / next unit, so a finished lesson leads straight into the next. */
export function LessonNav({
  lang, prev, next, onOpen,
}: {
  lang: "uz" | "en";
  prev: { id: string; title: string } | null;
  next: { id: string; title: string; locked: boolean } | null;
  onOpen: (id: string) => void;
}) {
  if (!prev && !next) return null;
  return (
    <nav className="lesson-nav" aria-label={tr(lang,"lessonToc.bosqichlar")}>
      {prev ? (
        <button className="lesson-nav-btn" onClick={() => onOpen(prev.id)}>
          <small>← {tr(lang,"lessonToc.oldingi")}</small>
          <b>{prev.title}</b>
        </button>
      ) : <span />}
      {next && (
        <button
          className={`lesson-nav-btn next ${next.locked ? "locked" : ""}`}
          onClick={() => !next.locked && onOpen(next.id)}
          disabled={next.locked}
          title={next.locked ? (tr(lang,"lessonToc.avval_quizdan_oting_va_masalani_yeching")) : undefined}
        >
          <small>{tr(lang,"lessonToc.keyingi")} →</small>
          <b>{next.title}</b>
          {next.locked && <em>{tr(lang,"lessonToc.qulflangan")}</em>}
        </button>
      )}
    </nav>
  );
}
