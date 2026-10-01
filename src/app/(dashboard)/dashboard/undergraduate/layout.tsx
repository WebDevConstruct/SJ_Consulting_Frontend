"use client";

import { RequireAuth } from "@/components/dashboard/require-auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { undergraduateNavItems } from "@/lib/dashboard-nav";

export default function UndergraduateDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireAuth profile="undergraduate">
      <DashboardShell navItems={undergraduateNavItems}>
        {children}
      </DashboardShell>
    </RequireAuth>
  );
}
