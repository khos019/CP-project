"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- see the note in ./Chrome */

import { EmptyState } from "./kit";

import { tr } from "./i18n";
type Lang = "uz" | "en";

/* A wrong address is not an error the reader caused, so the page does not
   scold them: it names what happened in one line and offers the two places
   they were most likely trying to reach. */
export function NotFound({ lang, go }: { lang: Lang; go: (v: string) => void }) {
  const uz = lang === "uz";
  return (
    <EmptyState
      lang={lang}
      icon="⌘"
      title={tr(lang,"notFound.bunday_sahifa_yoq")}
      body={tr(lang,"notFound.havola_eskirgan_bolishi_mumkin_yol_xarital")}
      action={{ label: tr(lang,"chrome.yol_xaritalari"), onClick: () => go("roadmaps") }}
    />
  );
}
