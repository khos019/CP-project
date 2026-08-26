/* The AlgoYo'l mark, inline so it inherits the header's sizing and never
   costs a request. The header pairs it with live HTML text, so the wordmark
   always matches the running typography rather than a baked-in outline.

   The glyph is an "A" drawn as a three-node graph: two edges meeting at an
   apex, a crossbar, and a node at each vertex. Small, it reads as a solid A;
   large, it reads as a traversal from node to node along a path — which is
   what the roadmap actually is. */
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
      <g
        stroke="#071008"
        strokeWidth="6.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#071008"
      >
        <path d="M17.5 47 L32 17 L46.5 47" fill="none" />
        <path d="M22.4 37 L41.6 37" fill="none" />
        <circle cx="32" cy="17" r="5.4" />
        <circle cx="17.5" cy="47" r="4.7" />
        <circle cx="46.5" cy="47" r="4.7" />
      </g>
    </svg>
  );
}
