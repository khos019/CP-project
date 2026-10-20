/* Adsterra blocks, switched from one place. ADSTERRA_ENABLED turns all of them
   off at once; each block also has its own flag, so the aggressive formats
   (popunder, social bar) can be dropped without losing the native banner. */
export const ADSTERRA_ENABLED = false;

export const ADSTERRA = {
  native: {
    enabled: true,
    src: "https://bauval.org/21/eb0a5757d9ee3c3219bdff625af3bbd1",
    container: "container-eb0a5757d9ee3c3219bdff625af3bbd1",
  },
  // Off: a popunder hijacks the first click anywhere on the page (any button,
  // any link) and opens the ad instead, so learners got sent elsewhere.
  popunder: { enabled: false, src: "https://abscloud.org/1/eb14ea621ccd2c11224c211f117ef45d" },
  // Off for the same reason: with the popunder already off, a click on the
  // "Masalalar" nav link still tried to open mks98.com, and the tab title was
  // rewritten to a fake "(1) New Message!".
  socialBar: { enabled: false, src: "https://bauval.org/14/8b07ed5477b060e7f4d9c558ee0cc9f5" },
  // Iframe banners (AdsterraBanner): one slot at the top of the content pages.
  banner: { enabled: true },
  smartlink: { enabled: true, href: "https://araplhn.org/4/9d52200f50a58cb272cd9c806ae8d67c" },
} as const;

/* Iframe banner keys from the Adsterra dashboard, by size. */
export const ADSTERRA_BANNERS = {
  "728x90": { key: "c87746ede00ecf97ed16f83324034b27", width: 728, height: 90 },
  "468x60": { key: "5b108a94774889af2b246757511001c8", width: 468, height: 60 },
  "320x50": { key: "2cc8d3b878d7c174cf6544c121dcd5a8", width: 320, height: 50 },
  "300x250": { key: "166f754e61c0baea9166ad525e2ebc65", width: 300, height: 250 },
  "160x600": { key: "997d108dd2c76df3b87399b85c4d329d", width: 160, height: 600 },
  "160x300": { key: "d81f30ed50dc3199b5d96bdbba307e1a", width: 160, height: 300 },
} as const;

/* Screens where a popunder or a bar over the page would cost the learner
   something real: writing code (problem, playground), a timed round (duel,
   contests, placement test), signing in, and their own account settings. */
export const NO_INTRUSIVE_ADS = new Set([
  "problem", "problem-submissions", "playground", "duel", "contests", "placement", "auth", "profile",
]);

export const adOn = (block: keyof typeof ADSTERRA) => ADSTERRA_ENABLED && ADSTERRA[block].enabled;

/* Appends an external script once per page load; a second call with the same
   id is a no-op, so remounts and SPA navigation never load it twice. */
export function loadScriptOnce(id: string, src: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.src = src;
  s.async = true;
  s.setAttribute("data-cfasync", "false");
  document.body.appendChild(s);
}
