"use client";
import { useEffect } from "react";
import { NO_INTRUSIVE_ADS, ADSTERRA, adOn, loadScriptOnce } from "./config";

/* Popunder and social bar, mounted once at the app root. They are loaded the
   first time the learner lands on a screen outside NO_INTRUSIVE_ADS, never on
   the server and never twice. A loaded script cannot be unloaded, so after
   that it stays for the rest of the visit; the social bar is hidden on the
   blocked screens by the body attribute below (see globals.css). */
export function AdsterraGlobal({ view }: { view: string }) {
  const blocked = NO_INTRUSIVE_ADS.has(view);
  useEffect(() => {
    /* The app's first render is always "home" (the server cannot know the
       path), so a direct visit to /problem/A01 would load the scripts before
       the real view arrives. The address bar's first segment names the view
       for every blocked screen, so it is checked too. */
    const pathBlocked = NO_INTRUSIVE_ADS.has(window.location.pathname.split("/")[1] || "");
    document.body.toggleAttribute("data-ads-quiet", blocked || pathBlocked);
    if (blocked || pathBlocked) return;
    if (adOn("popunder")) loadScriptOnce("adsterra-popunder", ADSTERRA.popunder.src);
    if (adOn("socialBar")) loadScriptOnce("adsterra-socialbar", ADSTERRA.socialBar.src);
  }, [blocked]);
  return null;
}
