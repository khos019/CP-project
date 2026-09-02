/* The AlgoYo'l mark, inline so it inherits the header's sizing and never costs
   a request. The header pairs it with live HTML text, so the wordmark always
   matches the running typography rather than a baked-in outline.

   The shape is the owner's: two uprights with an arrow climbing between them,
   from the foot of the left one to the head of the right. Only the colours are
   the site's. The arrow keeps its two-tone gradient, but it now runs from the
   platform blue at the tail to the platform lime at the head — so the brightest
   point of the logo is the brand colour, and it is the same blue-and-green pair
   the roadmap graph already draws its connector with.

   The tile is a raised dark surface rather than a bright block: on a near-black
   header it reads as a quiet square holding the arrow, which is what the
   original does on white. */
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
        {/* userSpaceOnUse so the gradient runs along the arrow itself rather
            than across the tile's bounding box — the head stays lime at every
            rendered size. */}
        <linearGradient id="brandmark-arrow" gradientUnits="userSpaceOnUse"
          x1="20" y1="47" x2="49" y2="17">
          <stop offset="0" stopColor="#7296ff" />
          <stop offset="1" stopColor="#9aef4f" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="15" fill="#121b17" />

      {/* The uprights sit behind the arrow and stay subordinate to it. */}
      <g stroke="#3b5145" strokeWidth="4.8" strokeLinecap="round">
        <path d="M19 17 V47" />
        <path d="M50 17 V47" />
      </g>

      <g stroke="url(#brandmark-arrow)" strokeWidth="5.2"
        strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M20.5 47 L48.4 17" />
        <path d="M37 17 H48.4 V28.6" />
      </g>
    </svg>
  );
}
