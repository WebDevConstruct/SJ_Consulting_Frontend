"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/use-session";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { status, user } = useSession();

  useEffect(() => {
    // if (status === "unauthenticated") {
    //   router.replace("/signin");
    //   return;
    // }
    if (status === "authenticated" && user) {
      router.replace(`/dashboard/${user.userProfile}`);
    }
  }, [status, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-ink">
      <span className="text-[13.5px] text-current/45">Loading your dashboard…</span>
    </div>
  );
}
