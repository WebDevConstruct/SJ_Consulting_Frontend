"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Info, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

type AlertTone = "error" | "info" | "success";

interface InlineAlertProps {
  tone: AlertTone;
  children: ReactNode;
}

const TONE_STYLES: Record<AlertTone, string> = {
  error:
    "border-red-400/40 bg-red-500/5 text-red-700 dark:text-red-300",
  info: "border-gold-400/40 bg-gold-400/5 text-gold-700 dark:text-gold-200",
  success:
    "border-emerald-400/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300",
};

const TONE_ICONS: Record<AlertTone, typeof AlertCircle> = {
  error: AlertCircle,
  info: Info,
  success: CheckCircle2,
};

export function InlineAlert({ tone, children }: InlineAlertProps) {
  const Icon = TONE_ICONS[tone];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -8, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -8, height: 0 }}
        transition={{ duration: 0.25 }}
        className={`flex items-start gap-2.5 overflow-hidden rounded-sm border px-4 py-3 text-[13.5px] leading-relaxed ${TONE_STYLES[tone]}`}
        role={tone === "error" ? "alert" : "status"}
      >
        <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={1.8} />
        <div>{children}</div>
      </motion.div>
    </AnimatePresence>
  );
}
