"use client";

/* Small line icons, drawn rather than typed.
 *
 * Locks used to be the 🔒 emoji, which is not an icon: it is somebody else's
 * artwork, rendered by the operating system in its own colours and its own
 * weight, so the same lock is a yellow cartoon on Windows and a grey padlock
 * on a phone — beside a design that is otherwise thin strokes on a dark green
 * ground. These are strokes at the site's own weight, inheriting colour from
 * whatever they sit in, so a locked roadmap and a locked submission look like
 * the same idea for the first time.
 */

const SHACKLE = "M5.2 7V5.1a2.8 2.8 0 0 1 5.6 0V7";
const BODY = { x: 3.35, y: 6.95, width: 9.3, height: 6.6, rx: 2 };
const KEYHOLE = { cx: 8, cy: 10.25, r: 1.05 };

/** A padlock for ordinary markup. Sized in `em`, so it matches its text. */
export function LockIcon({ title }: { title?: string }) {
  return (
    <svg className="ic ic-lock" viewBox="0 0 16 16" width="1em" height="1em"
      role={title ? "img" : undefined} aria-hidden={title ? undefined : true} focusable="false">
      {title && <title>{title}</title>}
      <path d={SHACKLE} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect {...BODY} fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle {...KEYHOLE} fill="currentColor" />
    </svg>
  );
}

/** The same padlock for the inside of an existing <svg>, centred on (x, y). */
export function LockGlyph({ x, y, size = 15 }: { x: number; y: number; size?: number }) {
  const k = size / 16;
  return (
    <g className="ic-lock" transform={`translate(${x - size / 2} ${y - size / 2}) scale(${k})`} aria-hidden="true">
      <path d={SHACKLE} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        vectorEffect="non-scaling-stroke" />
      <rect {...BODY} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle {...KEYHOLE} fill="currentColor" />
    </g>
  );
}
