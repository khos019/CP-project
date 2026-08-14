"use client";

import { useEffect, useState } from "react";
import type { Lang } from "./AlgoYolApp";

type Leader = { id: string; username: string; display_name: string; avatar_url: string | null; duel_rating: number; peak_duel_rating: number; solved_count: number };

export function Leaderboard({ lang, currentUserId }: { lang: Lang; currentUserId: string | null }) {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/leaderboard", { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as { leaders?: Leader[]; error?: string };
        if (!response.ok) throw new Error(payload.error || "Leaderboard is unavailable.");
        setLeaders(payload.leaders || []);
        setStatus("ready");
      })
      .catch((caught) => {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        setError(caught instanceof Error ? caught.message : "Leaderboard is unavailable.");
        setStatus("error");
      });
    return () => controller.abort();
  }, []);

  return <>
    <div className="page-head"><div><p className="eyebrow">{lang === "uz" ? "Tasdiqlangan natijalar" : "Verified results"}</p><h1 className="page-title">{lang === "uz" ? "Reyting" : "Leaderboard"}</h1><p className="muted">{lang === "uz" ? "Reyting serverdagi duel va yechim natijalaridan olinadi." : "Rankings come from server-verified duels and submissions."}</p></div></div>
    {status === "loading" ? <div className="notice" role="status">{lang === "uz" ? "Reyting yuklanmoqda…" : "Loading leaderboard…"}</div> : null}
    {status === "error" ? <div className="notice error" role="alert">{error}</div> : null}
    {status === "ready" && !leaders.length ? <div className="panel empty-state">{lang === "uz" ? "Hali reyting natijalari yo‘q." : "No ranked results yet."}</div> : null}
    <div className="leaderboard">{leaders.map((leader, index) => <article className={`leader-row ${leader.id === currentUserId ? "me" : ""}`} key={leader.id}><span className="rank">#{index + 1}</span><span><b>{leader.display_name || leader.username}</b><small className="muted block">@{leader.username}</small></span><span className="tag">{leader.solved_count} {lang === "uz" ? "yechim" : "solves"}</span><span className="rating">{leader.duel_rating}</span></article>)}</div>
  </>;
}
