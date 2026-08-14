"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readStoredToken } from "./AuthPage";
import {
  DEFAULT_MASTERY_CONFIG,
  EMPTY_MASTERY,
  type MasteryConfig,
  type MasteryEvent,
  type MasteryStore,
} from "./mastery";

export type LearningProgress = {
  quizScores: Record<string, number>;
  solved: Record<string, boolean>;
};

type LearningSnapshot = {
  progress: LearningProgress;
  mastery: MasteryStore;
  events: MasteryEvent[];
  masteryConfig: MasteryConfig;
  duelSettings: { enabled: boolean; durationSeconds: number; problemCount: number; ratingK: number };
};

type LearningContextValue = LearningSnapshot & {
  status: "idle" | "loading" | "ready" | "unauthenticated" | "unavailable";
  error: string | null;
  refresh: () => Promise<void>;
  submitQuiz: (unitId: string, answer: number) => Promise<{ correct: boolean; score: number; delta: number }>;
};

const EMPTY_PROGRESS: LearningProgress = { quizScores: {}, solved: {} };
const EMPTY_SNAPSHOT: LearningSnapshot = {
  progress: EMPTY_PROGRESS,
  mastery: EMPTY_MASTERY,
  events: [],
  masteryConfig: DEFAULT_MASTERY_CONFIG,
  duelSettings: { enabled: false, durationSeconds: 1800, problemCount: 3, ratingK: 32 },
};

const LearningContext = createContext<LearningContextValue | null>(null);

async function authorizedFetch(path: string, init?: RequestInit) {
  const token = readStoredToken();
  if (!token) throw new Error("AUTH_REQUIRED");
  return fetch(path, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });
}

export function notifySessionChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("algoyol-session"));
}

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<LearningSnapshot>(EMPTY_SNAPSHOT);
  const [status, setStatus] = useState<LearningContextValue["status"]>("idle");
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!readStoredToken()) {
      setSnapshot(EMPTY_SNAPSHOT);
      setError(null);
      setStatus("unauthenticated");
      return;
    }

    setStatus("loading");
    try {
      const response = await authorizedFetch("/api/learning");
      const payload = await response.json() as {
        progress?: LearningProgress;
        mastery?: MasteryStore;
        events?: MasteryEvent[];
        settings?: { mastery?: MasteryConfig; duel?: LearningSnapshot["duelSettings"] };
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error || "Learning data is unavailable.");
      setSnapshot({
        progress: payload.progress || EMPTY_PROGRESS,
        mastery: payload.mastery || EMPTY_MASTERY,
        events: payload.events || [],
        masteryConfig: payload.settings?.mastery || DEFAULT_MASTERY_CONFIG,
        duelSettings: payload.settings?.duel || EMPTY_SNAPSHOT.duelSettings,
      });
      setError(null);
      setStatus("ready");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Learning data is unavailable.");
      setStatus("unavailable");
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void refresh(), 0);
    const handleSession = () => void refresh();
    window.addEventListener("algoyol-session", handleSession);
    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener("algoyol-session", handleSession);
    };
  }, [refresh]);

  const submitQuiz = useCallback(async (unitId: string, answer: number) => {
    const response = await authorizedFetch("/api/learning/quiz", {
      method: "POST",
      body: JSON.stringify({ unitId, answer }),
    });
    const payload = await response.json() as {
      correct?: boolean;
      score?: number;
      mastery?: { delta?: number };
      error?: string;
    };
    if (!response.ok) throw new Error(payload.error || "Quiz result could not be saved.");
    await refresh();
    return {
      correct: Boolean(payload.correct),
      score: payload.score || 0,
      delta: Number(payload.mastery?.delta || 0),
    };
  }, [refresh]);

  const value = useMemo<LearningContextValue>(() => ({
    ...snapshot,
    status,
    error,
    refresh,
    submitQuiz,
  }), [snapshot, status, error, refresh, submitQuiz]);

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) throw new Error("useLearning must be used inside LearningProvider");
  return context;
}
