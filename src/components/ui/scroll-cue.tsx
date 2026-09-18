"use client";

import { ChevronDown } from "lucide-react";

interface ScrollCueProps {
  label: string;
  targetId: string;
}

export function ScrollCue({ label, targetId }: ScrollCueProps) {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="focus-gold group relative mx-auto flex flex-col items-center gap-2 py-10 text-center text-current/45 transition-colors hover:text-gold-500 dark:hover:text-gold-300"
    >
      <span className="text-[13px] font-medium tracking-wide">{label}</span>
      <ChevronDown className="h-5 w-5 animate-bounce-slow transition-transform group-hover:translate-y-0.5" />
    </button>
  );
}
