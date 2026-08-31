"use client";

/* The realtime connection the duel needs, and the app did not have.
 *
 * Until now nothing in the browser opened a socket at all. The inbox polls
 * once a minute, which is fine for a message and useless for a challenge that
 * lives five seconds — so a duel challenge had no way of arriving, and the
 * second account never saw one.
 *
 * This talks to Supabase Realtime directly over a WebSocket rather than
 * pulling in @supabase/supabase-js for it. The Phoenix wire protocol is four
 * message shapes, all of them below, and the alternative is a dependency an
 * order of magnitude larger than the thing it would do.
 *
 * What it guarantees to callers:
 *   - topics are re-joined after a reconnect, so a dropped Wi-Fi connection
 *     does not silently stop delivering challenges
 *   - a heartbeat keeps the socket alive through proxies that cut idle ones
 *   - it never becomes the source of truth. An event means "ask the server
 *     again", never "this is now the case" — the payloads travel on a channel
 *     whose topic is a uuid rather than a permission.
 */

import { supabaseConfig } from "./session";

export type DuelEventName =
  | "matchmaking_started"
  | "duel_challenge_received"
  | "duel_challenge_cancelled"
  | "duel_challenge_expired"
  | "match_found"
  | "duel_started"
  | "submission_received"
  | "submission_result"
  | "duel_finished";

export type DuelEvent = { event: DuelEventName; payload: Record<string, unknown> };
export type ChannelStatus = "connecting" | "open" | "closed";

const HEARTBEAT_MS = 25_000;
const BACKOFF_START_MS = 800;
const BACKOFF_MAX_MS = 15_000;

export type DuelChannel = {
  /** Start listening on a topic. Safe to call twice with the same one. */
  join(topic: string): void;
  leave(topic: string): void;
  close(): void;
};

export function openDuelChannel(
  onEvent: (event: DuelEvent) => void,
  onStatus?: (status: ChannelStatus) => void,
): DuelChannel {
  const { url, key } = supabaseConfig();
  if (typeof window === "undefined" || !url || !key) {
    return { join() {}, leave() {}, close() {} };
  }

  const endpoint = `${url.replace(/^http/, "ws")}/realtime/v1/websocket?apikey=${key}&vsn=1.0.0`;
  const wanted = new Set<string>();
  let socket: WebSocket | null = null;
  let heartbeat: number | null = null;
  let retry: number | null = null;
  let backoff = BACKOFF_START_MS;
  let ref = 0;
  let closed = false;

  const nextRef = () => String(++ref);
  const send = (message: Record<string, unknown>) => {
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
  };
  const joinTopic = (topic: string) =>
    send({
      topic: `realtime:${topic}`,
      event: "phx_join",
      // Not a private channel: that needs RLS on realtime.messages, which is
      // the hardening step. Nothing sensitive travels here in the meantime.
      payload: { config: { broadcast: { self: false }, presence: { key: "" }, private: false } },
      ref: nextRef(),
    });

  const connect = () => {
    if (closed) return;
    onStatus?.("connecting");
    let live: WebSocket;
    try {
      live = new WebSocket(endpoint);
    } catch {
      schedule();
      return;
    }
    socket = live;

    live.addEventListener("open", () => {
      if (closed) { live.close(); return; }
      backoff = BACKOFF_START_MS;
      onStatus?.("open");
      for (const topic of wanted) joinTopic(topic);
      // Supabase closes a socket that says nothing for a minute, and so do
      // several mobile networks.
      heartbeat = window.setInterval(
        () => send({ topic: "phoenix", event: "heartbeat", payload: {}, ref: nextRef() }),
        HEARTBEAT_MS,
      );
    });

    live.addEventListener("message", (message) => {
      let frame: { event?: string; payload?: { event?: string; payload?: Record<string, unknown> } };
      try {
        frame = JSON.parse(String(message.data));
      } catch {
        return;
      }
      // Everything else on the wire is join replies and heartbeat acks.
      if (frame.event !== "broadcast" || !frame.payload?.event) return;
      onEvent({
        event: frame.payload.event as DuelEventName,
        payload: frame.payload.payload || {},
      });
    });

    const drop = () => {
      if (heartbeat !== null) { window.clearInterval(heartbeat); heartbeat = null; }
      if (socket === live) socket = null;
      onStatus?.("closed");
      schedule();
    };
    live.addEventListener("close", drop);
    live.addEventListener("error", () => live.close());
  };

  const schedule = () => {
    if (closed || retry !== null) return;
    retry = window.setTimeout(() => {
      retry = null;
      connect();
    }, backoff);
    backoff = Math.min(backoff * 2, BACKOFF_MAX_MS);
  };

  connect();

  return {
    join(topic) {
      if (wanted.has(topic)) return;
      wanted.add(topic);
      if (socket?.readyState === WebSocket.OPEN) joinTopic(topic);
    },
    leave(topic) {
      if (!wanted.delete(topic)) return;
      send({ topic: `realtime:${topic}`, event: "phx_leave", payload: {}, ref: nextRef() });
    },
    close() {
      closed = true;
      if (heartbeat !== null) window.clearInterval(heartbeat);
      if (retry !== null) window.clearTimeout(retry);
      socket?.close();
      socket = null;
    },
  };
}

export const userTopic = (userId: string) => `duel:user:${userId}`;
export const matchTopic = (matchId: string) => `duel:match:${matchId}`;
