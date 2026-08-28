"use client";

// Original AlgoYo'l gift artwork.
//
// Drawn here as SVG rather than shipping Telegram's own gift images: those are
// their artwork, and copying them into this app would be redistributing
// someone else's assets. These are our own shapes in the AlgoYo'l palette.

export type GiftArt = "bear" | "heart" | "cake" | "star" | "rocket" | "rose" | "gift";

export function GiftArtwork({ art, size = 96 }: { art: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 96 96", "aria-hidden": true as const };
  switch (art) {
    case "bear":
      return (
        <svg {...common}>
          <circle cx="26" cy="26" r="12" fill="#a9743f" />
          <circle cx="70" cy="26" r="12" fill="#a9743f" />
          <circle cx="26" cy="26" r="6" fill="#d8a06a" />
          <circle cx="70" cy="26" r="6" fill="#d8a06a" />
          <circle cx="48" cy="52" r="30" fill="#c58a4e" />
          <ellipse cx="48" cy="62" rx="15" ry="12" fill="#efd0aa" />
          <circle cx="38" cy="46" r="4" fill="#2a1a10" />
          <circle cx="58" cy="46" r="4" fill="#2a1a10" />
          <ellipse cx="48" cy="58" rx="5" ry="4" fill="#2a1a10" />
          <path d="M48 62v6" stroke="#2a1a10" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path
            d="M48 80S14 60 14 38a19 19 0 0 1 34-11 19 19 0 0 1 34 11c0 22-34 42-34 42Z"
            fill="#ff5d7a"
          />
          <path d="M32 30a12 12 0 0 1 9-4" stroke="#ffd0da" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "cake":
      return (
        <svg {...common}>
          <rect x="18" y="46" width="60" height="30" rx="6" fill="#f6d7a8" />
          <rect x="18" y="46" width="60" height="10" rx="5" fill="#ff8fae" />
          <rect x="44" y="24" width="8" height="18" rx="3" fill="#fff3cf" />
          <ellipse cx="48" cy="22" rx="5" ry="7" fill="#ffc94d" />
          <circle cx="30" cy="64" r="3" fill="#ff8fae" />
          <circle cx="48" cy="66" r="3" fill="#8ad8ff" />
          <circle cx="66" cy="64" r="3" fill="#c8ff76" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path
            d="M48 12l10.5 22.5L83 38 65 55.5 69.5 80 48 68.5 26.5 80 31 55.5 13 38l24.5-3.5Z"
            fill="#ffc94d"
          />
          <path d="M48 24l6 13" stroke="#fff0c4" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "rocket":
      return (
        <svg {...common}>
          <path d="M48 10c12 10 18 24 18 38l-8 12H38l-8-12c0-14 6-28 18-38Z" fill="#dfe8f0" />
          <circle cx="48" cy="38" r="8" fill="#38bdf8" />
          <path d="M30 52l-10 14 16-4Z" fill="#ff7a59" />
          <path d="M66 52l10 14-16-4Z" fill="#ff7a59" />
          <path d="M40 72h16l-8 14Z" fill="#ffc94d" />
        </svg>
      );
    case "rose":
      return (
        <svg {...common}>
          <path d="M48 46v36" stroke="#3f7a44" strokeWidth="5" strokeLinecap="round" />
          <path d="M48 62c-10 0-16-6-16-14 8 0 16 6 16 14Z" fill="#3f7a44" />
          <circle cx="48" cy="32" r="18" fill="#e8456b" />
          <circle cx="48" cy="32" r="11" fill="#ff6f8d" />
          <circle cx="48" cy="32" r="5" fill="#ffb3c4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="16" y="40" width="64" height="40" rx="6" fill="#8ad8ff" />
          <rect x="12" y="30" width="72" height="14" rx="5" fill="#5cc4f5" />
          <rect x="42" y="30" width="12" height="50" fill="#ffc94d" />
          <path d="M48 30c-8-14-22-6-12 4M48 30c8-14 22-6 12 4" fill="#ffc94d" />
        </svg>
      );
  }
}
