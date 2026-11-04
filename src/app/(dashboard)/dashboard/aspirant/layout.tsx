"use client";

import { RequireAuth } from "@/components/dashboard/require-auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { aspirantNavItems } from "@/lib/dashboard-nav";
import {useInactivityLogout} from "../../../../hooks/use-inactivity-logout"
export default function AspirantDashboardLayout({
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
    <RequireAuth profile="aspirant">
      <DashboardShell navItems={aspirantNavItems}>{children}</DashboardShell>
    </RequireAuth>
  );
}
