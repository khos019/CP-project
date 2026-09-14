/* Theme bootstrap, shared by the root layout and the toggle.
   Deliberately not a "use client" module: the layout is a server component and
   needs the script as a real string, not as a client reference.

   The script runs in <head>, before the stylesheet has painted anything, so a
   returning dark-mode visitor never sees a frame of the light default. Light is
   the default for everyone without a saved choice — not the OS preference —
   because that is the site's chosen first impression. */

export const THEME_KEY = "algoyol-theme";

export type Theme = "light" | "dark";

export const THEME_INIT_SCRIPT =
  `(function(){var t;try{t=localStorage.getItem(${JSON.stringify(THEME_KEY)})}catch(e){}` +
  `document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light")})();`;
