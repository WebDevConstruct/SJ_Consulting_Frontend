"use client";

import { RequireAuth } from "@/components/dashboard/require-auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { undergraduateNavItems } from "@/lib/dashboard-nav";
import { useInactivityLogout} from "../../../../hooks/use-inactivity-logout"
export default function UndergraduateDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useInactivityLogout({
    timeoutMinutes: 30,
    warningMinutes: 5,
    redirectTo: "/signin",
  });
  return (
    <RequireAuth profile="undergraduate">
      <DashboardShell navItems={undergraduateNavItems}>
        {children}
      </DashboardShell>
    </RequireAuth>
  );
}
