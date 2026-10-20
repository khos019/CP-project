"use client";
import { useEffect, useState } from "react";
import { ADSTERRA_BANNERS, adOn } from "./config";

type Size = keyof typeof ADSTERRA_BANNERS;

/* The widest banner that fits the slot: 728x90 on a desktop, 468x60 on a
   tablet, 320x50 on a phone. */
const pick = (width: number): Size => (width >= 760 ? "728x90" : width >= 500 ? "468x60" : "320x50");

/* An Adsterra iframe banner. Its code sets a global `atOptions` and writes the
   ad where the script tag stands, so every banner gets a document of its own:
   a sandboxed srcdoc iframe. The ad's loader needs a real origin (with an
   opaque one it never fills), hence allow-same-origin; the sandbox still has
   no allow-top-navigation, so the ad can open its link in a new tab but
   cannot send the page elsewhere. */
export function AdsterraBanner({ lang }: { lang: "uz" | "en" }) {
  const [size, setSize] = useState<Size | null>(null);
  useEffect(() => {
    const update = () => setSize(pick(window.innerWidth - 32));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  if (!adOn("banner") || !size) return null;
  const { key, width, height } = ADSTERRA_BANNERS[size];
  const doc = `<!doctype html><html><head><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>`
    + `<script>atOptions={key:"${key}",format:"iframe",height:${height},width:${width},params:{}};</script>`
    + `<script src="https://bauval.org/22/${key}"></script></body></html>`;
  return (
    <aside className="ad-banner" aria-label={lang === "uz" ? "Reklama" : "Advertisement"}>
      <span className="ad-label">{lang === "uz" ? "Reklama" : "Ad"}</span>
      <iframe
        key={size}
        title={lang === "uz" ? "Reklama" : "Advertisement"}
        srcDoc={doc}
        width={width}
        height={height}
        loading="lazy"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </aside>
  );
}
