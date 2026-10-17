import { NextResponse } from "next/server";

/* One problem's prose, on demand.
 *
 * The bank used to arrive whole: app/ui/problem-bank.ts held all 200
 * statements in both languages, it sat in the client component graph, and so
 * every visitor downloaded every statement in order to read one. The index --
 * titles, ratings, tags, judge keys, everything the list and the filters need
 * -- is still bundled, because the list has to render all 200 rows at once.
 * The prose is not: it is a page's worth of text that only matters once
 * somebody opens that page, so it is fetched then, from here.
 *
 * The answer is immutable for a given id -- statements change when the repo
 * changes, not between requests -- so it is cached hard, both in the browser
 * and at the edge. A rebuilt worker serves new text under the same URL, which
 * is why the cache is a day rather than a year.
 *
 * The caller also sends `r`, the revision of the prose (see PROSE_REVISION in
 * app/ui/problem-detail.ts). Nothing here reads it: it is part of the URL so
 * that a rewrite of the statements becomes a new cache key instead of waiting
 * a day behind the old one. Bump it there when the prose changes.
 */
import { problemDetails } from "./details";
import { bankProblems } from "../../ui/problem-bank";

/* `?key=<judge key>` answers with the problem's index row as well as its prose.
 * A duel hands out problems by judge key, and a tab opened before a deploy
 * carries the old bundled index: when the round's key is newer than that tab,
 * the arena used to say "problem not found" in the middle of a duel. It asks
 * here instead. Not cached at the edge for long, because "a key the bundle does
 * not know" is exactly the moment the bank has just changed. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const key = params.get("key");
  if (key) {
    const row = bankProblems.find((p) => p.judge === key);
    const detail = row ? problemDetails[row.id] : undefined;
    if (!row || !detail) return NextResponse.json({ error: "No such problem" }, { status: 404 });
    return NextResponse.json({ row, detail }, { headers: { "cache-control": "public, max-age=300" } });
  }

  const id = params.get("id");
  const detail = id ? problemDetails[id] : undefined;

  if (!detail) {
    return NextResponse.json({ error: "No such problem" }, { status: 404 });
  }

  return NextResponse.json(detail, {
    headers: { "cache-control": "public, max-age=86400, stale-while-revalidate=604800" },
  });
}
