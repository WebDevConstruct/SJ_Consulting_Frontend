"use client";

import { RequireAuth } from "@/components/dashboard/require-auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { aspirantNavItems } from "@/lib/dashboard-nav";

export default function AspirantDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireAuth profile="aspirant">
      <DashboardShell navItems={aspirantNavItems}>{children}</DashboardShell>
    </RequireAuth>
  );
}
