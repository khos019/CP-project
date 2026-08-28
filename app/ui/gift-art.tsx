"use client";

// Gift artwork.
//
// These are Twemoji graphics (public/gifts/*.svg), used under CC-BY 4.0 with
// attribution shown in the shop. They are deliberately NOT Telegram's own gift
// artwork: those designs belong to Telegram and copying them into this app
// would be redistributing someone else's assets.

export const GIFT_ART_KEYS = [
  "heart", "bear", "giftbox", "rose", "cake", "bouquet", "rocket", "trophy", "ring",
] as const;

export function GiftArtwork({ art, size = 96 }: { art: string; size?: number }) {
  const key = (GIFT_ART_KEYS as readonly string[]).includes(art) ? art : "heart";
  return (
    <img
      src={`/gifts/${key}.svg`}
      width={size}
      height={size}
      alt=""
      // Not lazy: these are ~1KB icons, and deferring them only risks the
      // grid rendering as empty boxes when intersection never fires.
      decoding="async"
      draggable={false}
      style={{ display: "block", width: size, height: size }}
    />
  );
}

export const ART_CREDIT = "Rasmlar: Twemoji (CC-BY 4.0)";
export const ART_CREDIT_EN = "Artwork: Twemoji (CC-BY 4.0)";
