"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- see the note in ./Chrome */

import { EmptyState } from "./kit";

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
      title={uz ? "Bunday sahifa yo‘q" : "That page does not exist"}
      body={uz
        ? "Havola eskirgan bo‘lishi mumkin. Yo‘l xaritalaridan davom eting yoki masalalar bankiga o‘ting."
        : "The link may be out of date. Continue from the roadmaps, or head to the problem bank."}
      action={{ label: uz ? "Yo‘l xaritalari" : "Roadmaps", onClick: () => go("roadmaps") }}
    />
  );
}
