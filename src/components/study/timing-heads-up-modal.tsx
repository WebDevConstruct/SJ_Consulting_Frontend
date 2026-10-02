"use client";

import { Clock } from "lucide-react";
import { ModalShell } from "@/components/study/modal-shell";

interface TimingHeadsUpModalProps {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
  questionCount: number;
  minutes: number;
}

export function TimingHeadsUpModal({
  open,
  onClose,
  onStart,
  questionCount,
  minutes,
}: TimingHeadsUpModalProps) {
  return (
    <ModalShell open={open} onClose={onClose} title="Before you start">
      <div className="flex items-start gap-4 rounded-sm border border-gold-400/40 bg-gold-400/5 px-4 py-4">
        <Clock className="h-5 w-5 flex-shrink-0 text-gold-600 dark:text-gold-300" strokeWidth={1.7} />
        <div className="text-[13.5px] leading-relaxed text-current/75">
          {questionCount} questions &middot; {minutes} minutes &middot; single
          attempt. Once you start, the timer won&rsquo;t pause.
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="focus-gold mt-5 w-full mb-20 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01]"
      >
        Start
      </button>
    </ModalShell>
  );
}
