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
 */
import { problemDetails } from "./details";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  const detail = id ? problemDetails[id] : undefined;

  if (!detail) {
    return NextResponse.json({ error: "No such problem" }, { status: 404 });
  }

  return NextResponse.json(detail, {
    headers: { "cache-control": "public, max-age=86400, stale-while-revalidate=604800" },
  });
}
