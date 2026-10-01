"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import type { DashboardNavItem } from "@/lib/dashboard-nav";
import { useSession } from "@/lib/auth/use-session";

interface DashboardShellProps {
  navItems: DashboardNavItem[];
  children: React.ReactNode;
}

export function DashboardShell({ navItems, children }: DashboardShellProps) {
  const pathname = usePathname();
  const { user, logout } = useSession();

  const isActive = (href: string) =>
    href === pathname ||
    (href.split("/").length === 3  
    && (pathname.startsWith(`/${href}`) || pathname?.startsWith(`/${href}`)))



   
  return (
    <div className="flex min-h-screen bg-paper dark:bg-ink">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col border-r border-paper-line bg-paper-soft dark:border-ink-line dark:bg-ink-soft md:flex">
        <Link href="/" className="focus-gold px-7 pt-8">
          <span className="font-display text-[20px] leading-none">
            SJ <span className="text-gold-foil">Consult</span>
          </span>
        </Link>

        <nav className="mt-10 flex flex-1 flex-col gap-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-gold flex items-center gap-3 rounded-sm px-3 
                  py-2.5 text-[14px] font-medium transition-colors ${
                  active
                    ? "bg-gold-400/10 text-gold-600 dark:text-gold-300"
                    : "text-current/65 hover:bg-current/5 hover:text-current"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-paper-line px-4 py-5 dark:border-ink-line">
          <div className="px-3 text-[13px] font-medium text-current/80">
            {user?.name ?? "—"}
          </div>
          <div className="px-3 text-[12px] text-current/45">
            @{user?.username ?? "—"}
          </div>
          <button
            type="button"
            onClick={logout}
            className="focus-gold mt-4 flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 text-[13.5px] font-medium text-current/60 transition-colors hover:bg-current/5 hover:text-red-600 dark:hover:text-red-300"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.7} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 pb-24 md:pb-0">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-paper-line bg-paper/95 backdrop-blur-md dark:border-ink-line dark:bg-ink/95 md:hidden">
          <div className="flex w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`focus-gold flex min-w-[76px] flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium ${
                    active
                      ? "text-gold-600 dark:text-gold-300"
                      : "text-current/55"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.7} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
