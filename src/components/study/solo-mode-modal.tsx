"use client";

import { Clock, PenLine } from "lucide-react";
import { ModalShell } from "@/components/study/modal-shell";
import type { CbtMode } from "@/lib/study/types";

interface SoloModeModalProps {
  open: boolean;
  onClose: () => void;
  onPick: (mode: CbtMode) => void;
}

export function SoloModeModal({ open, onClose, onPick }: SoloModeModalProps) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Practice or simulate?"
      description="Exam mode times you and locks answers once submitted, just like the real thing."
    >
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onPick("practice")}
          className="focus-gold flex items-center gap-4 rounded-sm border border-paper-line px-4 py-4 text-left transition-colors hover:border-gold-400/50 dark:border-ink-line"
        >
          <PenLine className="h-5 w-5 flex-shrink-0 text-gold-500 dark:text-gold-300" strokeWidth={1.7} />
          <div>
            <div className="text-[14px] font-medium">Practice</div>
            <div className="mt-0.5 text-[12.5px] text-current/55">
              No timer. Move at your own pace.
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onPick("exam")}
          className="focus-gold flex items-center mb-20 gap-4 rounded-sm border border-paper-line px-4 py-4 text-left transition-colors hover:border-gold-400/50 dark:border-ink-line"
        >
          <Clock className="h-5 w-5 flex-shrink-0 text-gold-500 dark:text-gold-300" strokeWidth={1.7} />
          <div>
            <div className="text-[14px] font-medium">Exam mode</div>
            <div className="mt-0.5 text-[12.5px] text-current/55">
              Timed, single attempt &mdash; simulates the real thing.
            </div>
          </div>
        </button>
      </div>
    </ModalShell>
  );
}
