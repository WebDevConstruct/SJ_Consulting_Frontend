"use client";

import { useState } from "react";
import { Users, User } from "lucide-react";
import { ModalShell } from "@/components/study/modal-shell";

type SessionKind = "solo" | "peer";

interface CbtModeModalProps {
  open: boolean;
  onClose: () => void;
  onChooseSolo: () => void;
  onChoosePeer: () => void;
}

export function CbtModeModal({
  open,
  onClose,
  onChooseSolo,
  onChoosePeer,
}: CbtModeModalProps) {
  const [kind, setKind] = useState<SessionKind>("solo");

  const handleContinue = () => {
    if (kind === "solo") onChooseSolo();
    else onChoosePeer();
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Practice MCQs"
      description="Go at it alone, or bring a friend into the same round."
    >
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setKind("solo")}
          className={`focus-gold flex flex-col items-center gap-2.5 rounded-sm border px-4 py-5 transition-colors ${
            kind === "solo"
              ? "border-gold-400 bg-gold-400/5"
              : "border-paper-line hover:border-current/30 dark:border-ink-line"
          }`}
        >
          <User className="h-6 w-6 text-gold-500 dark:text-gold-300" strokeWidth={1.7} />
          <span className="text-[13.5px] font-medium">Solo</span>
        </button>
        <button
          type="button"
          onClick={() => setKind("peer")}
          className={`focus-gold flex flex-col items-center gap-2.5 rounded-sm border px-4 py-5 transition-colors ${
            kind === "peer"
              ? "border-gold-400 bg-gold-400/5"
              : "border-paper-line hover:border-current/30 dark:border-ink-line"
          }`}
        >
          <Users className="h-6 w-6 text-gold-500 dark:text-gold-300" strokeWidth={1.7} />
          <span className="text-[13.5px] font-medium">Peer session</span>
        </button>
      </div>

      {kind === "peer" ? (
        <p className="mt-4 text-[12.5px] leading-relaxed text-current/50">
          Peer sessions always run in exam mode &mdash; timed, single
          attempt, same questions for both of you.
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleContinue}
        className="focus-gold mt-5 mb-20 w-full rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01]"
      >
        {kind === "solo" ? "Practice past questions" : "Invite friends"}
      </button>
    </ModalShell>
  );
}
