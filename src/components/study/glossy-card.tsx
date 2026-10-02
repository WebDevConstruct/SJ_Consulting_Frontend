"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface GlossyCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  delay?: number;
}

export function GlossyCard({
  icon: Icon,
  title,
  description,
  onClick,
  delay = 0,
}: GlossyCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="focus-gold group relative overflow-hidden rounded-sm border border-paper-line bg-paper-soft p-8 text-left transition-colors hover:border-gold-400/50 dark:border-ink-line dark:bg-ink-surface"
    >
      {/* Glossy sheen sweep on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent"
      />

      <span className="relative flex h-12 w-12 items-center justify-center rounded-sm border border-gold-400/40 bg-gold-400/5">
        <Icon
          className="h-6 w-6 text-gold-500 dark:text-gold-300"
          strokeWidth={1.6}
        />
      </span>
      <h3 className="relative mt-5 font-display text-[21px] leading-snug">
        {title}
      </h3>
      <p className="relative mt-2.5 max-w-sm text-[14px] leading-relaxed text-current/60">
        {description}
      </p>
    </motion.button>
  );
}
