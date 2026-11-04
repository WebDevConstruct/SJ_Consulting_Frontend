"use client";

import { useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type UseInactivityLogoutOptions = {
  timeoutMinutes?: number;
  warningMinutes?: number;
  redirectTo?: string;
};

export function useInactivityLogout({
  timeoutMinutes = 30,
  warningMinutes = 5,
  redirectTo = "/login",
}: UseInactivityLogoutOptions = {}) {
  const router = useRouter();
  const supabase = createClient();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const signingOutRef = useRef(false);

  const clearTimeouts = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    timeoutRef.current = null;
    warningRef.current = null;
  };

  const signOut = async () => {
    if (signingOutRef.current) return;

    signingOutRef.current = true;
    clearTimeouts();

    try {
      await supabase.auth.signOut({ scope: "local" });
    } finally {
      router.replace(redirectTo);
      router.refresh();
    }
  };

  useEffect(() => {
    const timeoutMs = timeoutMinutes * 60 * 1000;
    const warningMs = Math.max(
      0,
      (timeoutMinutes - warningMinutes) * 60 * 1000,
    );

    const resetTimers = () => {
      if (signingOutRef.current) return;

      clearTimeouts();

      warningRef.current = setTimeout(() => {
        const shouldWarn = window.confirm(
          "You have been inactive. Stay signed in?",
        );

        if (shouldWarn) {
          resetTimers();
        } else {
          void signOut();
        }
      }, warningMs);

      timeoutRef.current = setTimeout(() => {
        void signOut();
      }, timeoutMs);
    };

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ] as const;

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        resetTimers();
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimers, { passive: true });
    });

    document.addEventListener("visibilitychange", handleVisibility);

    resetTimers();

    return () => {
      clearTimeouts();

      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimers);
      });

      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [timeoutMinutes, warningMinutes, redirectTo, router, supabase]);
}