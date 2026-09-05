import type { BankProblem } from "./problem-bank";
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
 * which complexity is even allowed), then the legend for the situation, then
 * the formal task, then the exact I/O shape, and only then the samples. Putting
 * constraints at the bottom -- where they were -- means the reader picks an
 * algorithm before learning that n goes to 10^18.
 *
 * Older problems have a single `constraints` string and one `noteUz/noteEn`;
 * rewritten ones have `constraintList` and a note per sample. Both render, so
 * the rewrite can land problem by problem instead of in one commit.
 */
export function ProblemStatement({
  item, lang, stUz, stEn, inUz, inEn, outUz, outEn,
}: {
  item: BankProblem; lang: Lang;
  stUz: string; stEn: string; inUz: string; inEn: string; outUz: string; outEn: string;
}) {
  const pick = (uz?: string, en?: string) => (lang === "uz" ? uz : en) || "";
  const legend = pick(item.legendUz, item.legendEn) || pick(item.storyUz, item.storyEn);
  const bounds = item.constraintList?.length
    ? item.constraintList
    : item.constraints ? [item.constraints] : [];
  const samples = item.samples || [];
  const perSample = (lang === "uz" ? item.sampleNotesUz : item.sampleNotesEn) || [];
  // The legacy single note explains the first sample, so that is where it goes.
  const legacyNote = pick(item.noteUz, item.noteEn);

  return (
    <article className="panel statement">
      <h2>{tr(lang, "algoYolApp.shart")}</h2>
      {/* The limits live in the page header, which already sits above this
          panel -- repeating them here just made the reader check twice. */}
      {legend && <p className="story"><MathText text={legend} /></p>}
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
