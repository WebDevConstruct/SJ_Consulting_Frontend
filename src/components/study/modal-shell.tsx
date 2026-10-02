"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export function ModalShell({
  open,
  onClose,
  title,
  description,
  children,
}: ModalShellProps) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0
         z-40 flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative flex max-h-[85vh] w-full flex-col rounded-t-sm border border-paper-line bg-paper p-6 dark:border-ink-line dark:bg-ink-surface sm:max-w-md sm:rounded-sm sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-[20px] leading-tight">
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-current/60">
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="focus-gold flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-current/50 transition-colors hover:text-current"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="mt-5 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
