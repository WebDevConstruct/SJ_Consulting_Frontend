"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/use-session";
import type { UserProfile } from "@/lib/auth/types";

interface RequireAuthProps {
  profile: UserProfile;
  children: ReactNode;
}

export function RequireAuth({ profile, children }: RequireAuthProps) {
  const router = useRouter();
  const { status, user } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
      return;
    }
    if (status === "authenticated" && user && user.userProfile !== profile) {
      router.replace(`/dashboard/${user.userProfile}`);
    }
  }, [status, user, profile, router]);

  const ready =
    status === "authenticated" && user && user.userProfile === profile;

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center
      font-ui-sans-serif bg-paper dark:bg-ink">
        <span className="text-[13.5px] text-current/45">Loading…</span>
      </div>
    );
  }

  return <>{children}</>;
}
