"use client";

import { useCallback, useEffect, useState } from "react";
import type { PacingMode, PeerSession, Track } from "./types";

const STORAGE_KEY = "sj-consult-peer-session";

function read(): PeerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PeerSession) : null;
  } catch {
    return null;
  }
}

function write(session: PeerSession | null) {
  if (session) {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    window.sessionStorage.removeItem(STORAGE_KEY);
  }
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

/**
 * Tracks a pending/accepted peer CBT invite in sessionStorage, so the "waiting
 * for acceptance" state survives the user leaving the Study page (or even
 * refreshing the tab) to do something else while they wait.
 */
export function usePeerSession() {
  const [session, setSession] = useState<PeerSession | null>(null);

  useEffect(() => {
    // One-time sync from sessionStorage (unavailable during SSR), so this
    // can't be expressed as a useState initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(read());
  }, []);

  const send = useCallback(
    (params: { invitee: string; track: Track; pacing: PacingMode; subject: string }) => {
      const next: PeerSession = {
        id: generateId("peer"),
        invitee: params.invitee,
        track: params.track,
        pacing: params.pacing,
        subject: params.subject,
        status: "pending",
        connectionId: null,
        createdAt: Date.now(),
      };
      write(next);
      setSession(next);
      return next;
    },
    []
  );

  /** Dev-only stand-in for the friend accepting the invite on their end. */
  const simulateAccept = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const accepted: PeerSession = {
        ...prev,
        status: "accepted",
        connectionId: generateId("conn"),
      };
      write(accepted);
      return accepted;
    });
  }, []);

  const clear = useCallback(() => {
    write(null);
    setSession(null);
  }, []);

  return { session, send, simulateAccept, clear };
}
