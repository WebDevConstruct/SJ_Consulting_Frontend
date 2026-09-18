"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      className="focus-gold group relative flex h-9 w-9 items-center justify-center rounded-full border border-ink-line/60 text-current transition-colors hover:border-gold-400 dark:border-ink-line"
    >
      <Sun
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100 text-gold-600"
        }`}
      />
      <Moon
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100 opacity-100 text-gold-200"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
}
