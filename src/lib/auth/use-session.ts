"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mockApi } from "./mock-api";
import { session, SESSION_IDLE_MS } from "./session";
import type { PublicUser } from "./types";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"];
const IDLE_CHECK_INTERVAL_MS = 20_000;

export function useSession() {
  const router = useRouter();
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [user, setUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    const current = mockApi.getCurrentUser();
    // One-time sync from localStorage (unavailable during SSR), so this
    // can't be expressed as a useState initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(current);
    setStatus(current ? "authenticated" : "unauthenticated");
  }, []);

  // Refresh "last activity" on genuine user interaction, matching the
  // brief's 15-minute-inactivity cookie expiry.
  useEffect(() => {
    if (status !== "authenticated") return;

    const handleActivity = () => session.touch();
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true })
    );

    const interval = window.setInterval(() => {
      if (!session.get()) {
        setStatus("unauthenticated");
        setUser(null);
        router.replace("/signin");
      }
    }, IDLE_CHECK_INTERVAL_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      window.clearInterval(interval);
    };
  }, [status, router]);

  const logout = async () => {
    await mockApi.signOut();
    setStatus("unauthenticated");
    setUser(null);
    router.replace("/signin");
  };

  return { status, user, logout, idleMs: SESSION_IDLE_MS };
}
