"use client";
import { useEffect, useRef } from "react";
import { ADSTERRA, adOn } from "./config";

/* The native banner. Adsterra's script fills the container that exists when it
   runs, so the container renders first and the script is (re)appended after
   it on every mount — an SPA visit to a second page gets a fresh container
   that the first run never saw. */
export function AdsterraNative({ lang }: { lang: "uz" | "en" }) {
  const box = useRef<HTMLDivElement>(null);
  const on = adOn("native");
  useEffect(() => {
    if (!on || !box.current) return;
    document.getElementById("adsterra-native")?.remove();
    const s = document.createElement("script");
    s.id = "adsterra-native";
    s.src = ADSTERRA.native.src;
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    box.current.after(s);
    return () => s.remove();
  }, [on]);
  if (!on) return null;
  return (
    <aside className="ad-native" aria-label={lang === "uz" ? "Reklama" : "Advertisement"}>
      <span className="ad-label">{lang === "uz" ? "Reklama" : "Ad"}</span>
      <div id={ADSTERRA.native.container} ref={box} />
    </aside>
  );
}
