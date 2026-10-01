"use client";

import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { useSession } from "@/lib/auth/use-session";

function SettingRow({
  label,
  description,
  action,
}: {
  label: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-paper-line py-5 last:border-b-0 dark:border-ink-line">
      <div>
        <div className="text-[14px] font-medium">{label}</div>
        <div className="mt-1 text-[13px] text-current/55">{description}</div>
      </div>
      {action}
    </div>
  );
}

export default function AspirantProfilePage() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useSession();
  const isDark = theme === "dark";

  return (
    <div className="px-6 py-10 md:px-12 md:py-14">
      <div className="h-[2px] w-12 bg-gold-metal" />
      <h1 className="mt-6 font-display text-[28px] leading-tight sm:text-[32px]">
        Profile settings
      </h1>
      <p className="mt-2 max-w-md text-[14.5px] text-current/60">
        Signed in as {user?.name} (@{user?.username}).
      </p>

      <div className="mt-8 max-w-xl rounded-sm border border-paper-line bg-paper-soft px-6 dark:border-ink-line dark:bg-ink-surface">
        <SettingRow
          label="Theme"
          description="Switch between light and dark across the whole dashboard."
          action={
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={isDark}
              className="focus-gold flex items-center gap-2 rounded-sm border border-current/20 px-4 py-2 text-[13px] font-medium transition-colors hover:border-gold-400 hover:text-gold-500"
            >
              {isDark ? (
                <Moon className="h-4 w-4" strokeWidth={1.7} />
              ) : (
                <Sun className="h-4 w-4" strokeWidth={1.7} />
              )}
              {isDark ? "Dark" : "Light"}
            </button>
          }
        />
        <SettingRow
          label="Username"
          description="Change the username other users see. Your email can't be changed."
          action={
            <span className="text-[12.5px] text-current/40">Coming soon</span>
          }
        />
        <SettingRow
          label="Password"
          description="Update your account password."
          action={
            <span className="text-[12.5px] text-current/40">Coming soon</span>
          }
        />
        <SettingRow
          label="Migrate to undergraduate"
          description="Moving to UNILAG? Switch your account type — this logs you out and removes aspirant-only features."
          action={
            <span className="text-[12.5px] text-current/40">Coming soon</span>
          }
        />
      </div>

      <button
        type="button"
        onClick={logout}
        className="focus-gold mt-8 flex items-center gap-2.5 rounded-sm border border-paper-line px-5 py-2.5 text-[13.5px] font-medium text-current/70 transition-colors hover:border-red-400/50 hover:text-red-600 dark:border-ink-line dark:hover:text-red-300"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.7} />
        Log out
      </button>
    </div>
  );
}
