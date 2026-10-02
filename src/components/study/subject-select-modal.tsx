"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { ModalShell } from "@/components/study/modal-shell";
import { subjectCombinations } from "@/lib/study/mock-data";

interface SubjectSelectModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: (combinationSlug: string) => void;
}

export function SubjectSelectModal({
  open,
  onClose,
  onContinue,
}: SubjectSelectModalProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Choose what to study"
      description="Pick the subject combination you want verified topic materials for."
    >
      <div className="flex max-h-[45vh]   flex-col gap-3 overflow-y-auto pr-1">
        {subjectCombinations.map((combo) => {
          const active = combo.slug === selected;
          return (
            <button
              key={combo.slug}
              type="button"
              onClick={() => setSelected(combo.slug)}
              className={`focus-gold flex items-start justify-between gap-4 rounded-sm border px-4 py-3.5 text-left transition-colors ${
                active
                  ? "border-gold-400 bg-gold-400/5"
                  : "border-paper-line hover:border-current/30 dark:border-ink-line"
              }`}
            >
              <div>
                <div className="text-[14.5px] font-medium">{combo.label}</div>
                <div className="mt-1 text-[13px] text-current/55">
                  {combo.description}
                </div>
              </div>
              {active ? (
                <Check
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500 dark:text-gold-300"
                  strokeWidth={2}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!selected}
        onClick={() => selected && onContinue(selected)}
        className="focus-gold mt-5 w-full
         mb-20 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        View topics
      </button>
    </ModalShell>
  );
}
