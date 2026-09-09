import type { ProblemDetail } from "./problem-bank";
import { tr, type Lang } from "./i18n";
import { MathText } from "./math-text";

/* The problem statement, laid out the way a competitive-programming statement
 * is conventionally laid out.
 *
 * Every prose field goes through MathText, so `10^18` and `a_i` render as a
 * real exponent and subscript rather than as literal carets and underscores.
 * The statements are written with that notation on purpose.
 *
 * The order is not decoration. A solver reads the limits first (they decide
 * which complexity is even allowed), then the task, then the exact I/O shape,
 * and only then the samples. Putting constraints at the bottom -- where they
 * were -- means the reader picks an algorithm before learning that n goes to
 * 10^18.
 *
 * There used to be an italic paragraph above the task: a legend, framing the
 * topic -- why answers are taken modulo a prime, what a border of a string is
 * for. It was the first thing read and the last thing needed, and somebody who
 * opened the problem to solve it had to get past it to find out what to
 * compute. It is gone, from here and from the data (`node restate.mjs
 * --strip-legend` removed the field from all 302 entries), and
 * what it was carrying that belonged to the task belongs in the task.
 *
 * The prose arrives from /api/problem rather than from the bundle, so `detail`
 * is what the page fetched for this problem; the caller owns the loading state
 * and only renders this once it has one. The statement/input/output text stays
 * a prop because the three duel problems supply their own.
 *
 * Older problems have a single `constraints` string and one `noteUz/noteEn`;
 * rewritten ones have `constraintList` and a note per sample. Both render, so
 * the rewrite can land problem by problem instead of in one commit.
 *
 * `constraintList` is the English list and `constraintListUz` its Uzbek
 * counterpart, so the constraints are not the one section left in English on
 * an otherwise Uzbek page. The Uzbek list falls back to the English one when
 * it is missing, exactly as the other bilingual fields do.
 */
export function ProblemStatement({
  detail, lang, stUz, stEn, inUz, inEn, outUz, outEn,
}: {
  detail: ProblemDetail; lang: Lang;
  stUz: string; stEn: string; inUz: string; inEn: string; outUz: string; outEn: string;
}) {
  const pick = (uz?: string, en?: string) => (lang === "uz" ? uz : en) || "";
  // Same fallback as `pick`, one list up: the Uzbek constraints when the page
  // is Uzbek and they exist, the English ones otherwise. A problem whose
  // bounds are pure formulas needs no Uzbek list at all.
  const list = (lang === "uz" ? detail.constraintListUz : undefined) || detail.constraintList;
  const bounds = list?.length
    ? list
    : detail.constraints ? [detail.constraints] : [];
  const samples = detail.samples || [];
  const perSample = (lang === "uz" ? detail.sampleNotesUz : detail.sampleNotesEn) || [];
  // The legacy single note explains the first sample, so that is where it goes.
  const legacyNote = pick(detail.noteUz, detail.noteEn);

  return (
    <article className="panel statement">
      <h2>{tr(lang, "algoYolApp.shart")}</h2>
      {/* The limits live in the page header, which already sits above this
          panel -- repeating them here just made the reader check twice. */}
      <p><MathText text={lang === "uz" ? stUz : stEn} /></p>

      <h3>{tr(lang, "algoYolApp.kirish")}</h3>
      <p><MathText text={lang === "uz" ? inUz : inEn} /></p>

      <h3>{tr(lang, "algoYolApp.chiqish")}</h3>
      <p><MathText text={lang === "uz" ? outUz : outEn} /></p>

      {bounds.length > 0 && (
        <>
          <h3>{tr(lang, "algoYolApp.cheklovlar")}</h3>
          <ul className="constraints">
            {bounds.map((c, i) => <li className="mono" key={i}><MathText text={c} /></li>)}
          </ul>
        </>
      )}

      <h3>{tr(lang, "algoYolApp.namunalar")}</h3>
      {samples.map((x, si) => {
        const note = perSample[si] || (si === 0 ? legacyNote : "");
        return (
          <div className="sample" key={si}>
            <div className="sample-head">{tr(lang, "problem.sampleN", { n: si + 1 })}</div>
            <b>{tr(lang, "algoYolApp.kirish")}</b>
            <pre>{x.input}</pre>
            <b>{tr(lang, "algoYolApp.chiqish")}</b>
            <pre>{x.output}</pre>
            {note && (
              <div className="sample-note">
                <b>{tr(lang, "problem.explainN", { n: si + 1 })}</b>
                <p className="muted"><MathText text={note} /></p>
              </div>
            )}
          </div>
        );
      })}
    </article>
  );
}
