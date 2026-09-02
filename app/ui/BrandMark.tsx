/* The AlgoYo'l mark, inline so it inherits the header's sizing and never costs
   a request. The header pairs it with live HTML text, so the wordmark always
   matches the running typography rather than a baked-in outline.

   The glyph is a staircase climbing left to right, with a node on the step it
   is heading for. It keeps the rising motion of the arrow it replaces — but an
   arrow only says "up", while steps say what the climbing is made of, which is
   the whole premise of a roadmap you unlock one stage at a time.

   The tile stays bright. On a near-black header the mark has to be the lit
   object, and a dark tile with a bright glyph — which reads well on white —
   would dissolve into the bar it sits in. */
export function BrandMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="brandmark-tile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c8ff76" />
          <stop offset="1" stopColor="#67ce44" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="17" fill="url(#brandmark-tile)" />
      <g stroke="#071008" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* A staircase, not an arrow and not a ring. The site's two most-used
            words are "yo‘l" and "bosqich" — path and stage — and two risers say
            both at once. The ring this replaces read as a key at large sizes
            and vanished at sixteen pixels; orthogonal steps survive both. */}
        <path d="M14 48 H28 V34 H42 V20 H51" strokeWidth="6.4" />
      </g>
      {/* The stage you are climbing toward. */}
      <circle cx="51" cy="20" r="5.4" fill="#071008" />
    </svg>
  );
}
