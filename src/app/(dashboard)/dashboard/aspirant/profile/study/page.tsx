"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenCheck, Loader2, ScrollText } from "lucide-react";
import { GlossyCard } from "@/components/study/glossy-card";
import { SubjectSelectModal } from "@/components/study/subject-select-modal";
import { CbtModeModal } from "@/components/study/cbt-mode-modal";
import { SoloModeModal } from "@/components/study/solo-mode-modal";
import { TimingHeadsUpModal } from "@/components/study/timing-heads-up-modal";
import { InvitePeerOverlay } from "@/components/study/invite-peer-overlay";
import { CbtRunnerOverlay } from "@/components/study/cbt-runner-overlay";
import { usePeerSession } from "@/lib/study/peer-session-store";
import type { CbtMode, PeerSession, SubmissionResult } from "@/lib/study/types";

type Modal =
  | "none"
  | "subject-select"
  | "cbt-mode"
  | "solo-mode"
  | "timing";

const DEFAULT_SOLO_SUBJECT = "Mathematics";
const QUESTIONS_PER_ROUND = 10;

export default function StudyHubPage() {
  const router = useRouter();
  const { session: peerSession } = usePeerSession();

  const [modal, setModal] = useState<Modal>("none");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [runnerOpen, setRunnerOpen] = useState(false);
  const [runnerSubject, setRunnerSubject] = useState(DEFAULT_SOLO_SUBJECT);
  const [runnerMode, setRunnerMode] = useState<CbtMode>("practice");
  const [lastResult, setLastResult] = useState<SubmissionResult | null>(null);

  const closeAll = () => setModal("none");

  const handleStudyContinue = (slug: string) => {
    closeAll();
    router.push(`/dashboard/aspirant/study/materials/${slug}`);
  };

  const handleChooseSolo = () => setModal("solo-mode");
  const handleChoosePeer = () => {
    setModal("none");
    setInviteOpen(true);
  };

  const handleSoloPick = (mode: CbtMode) => {
    setRunnerSubject(DEFAULT_SOLO_SUBJECT);
    setRunnerMode(mode);
    if (mode === "practice") {
      closeAll();
      setRunnerOpen(true);
    } else {
      setModal("timing");
    }
  };

  const handleInviteProceed = (accepted: PeerSession) => {
    setInviteOpen(false);
    setRunnerSubject(accepted.subject);
    setRunnerMode("exam"); // peer sessions are always exam mode
    setModal("timing");
  };

  const handleStart = () => {
    closeAll();
    setRunnerOpen(true);
  };

  const handleRunnerFinish = (result: SubmissionResult) => {
    setLastResult(result);
    setRunnerOpen(false);
  };

  return (
    <div className="px-6 py-10 md:px-12 md:py-14">
      <div className="h-[2px] w-12 bg-gold-metal" />
      <h1 className="mt-6 font-display text-[28px] leading-tight sm:text-[32px]">
        Study
      </h1>
      <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-current/65">
        Everything here opens as a quick step-by-step flow rather than a new
        page to hunt through: pick a card, answer a couple of short prompts,
        and you&rsquo;re straight into it. Topic materials open as their own
        page (with a way back to Study at the top); solo and peer practice
        rounds open full-screen so nothing distracts from the questions.
      </p>

      {peerSession ? (
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="focus-gold mt-6 flex w-full max-w-lg items-center gap-3 rounded-sm border border-gold-400/40 bg-gold-400/5 px-4 py-3 text-left"
        >
          <Loader2
            className={`h-4 w-4 flex-shrink-0 text-gold-600 dark:text-gold-300 ${
              peerSession.status === "pending" ? "animate-spin" : ""
            }`}
          />
          <span className="text-[13.5px] text-current/75">
            {peerSession.status === "pending"
              ? `Waiting for ${peerSession.invitee} to accept your peer session…`
              : `${peerSession.invitee} accepted — tap to continue.`}
          </span>
        </button>
      ) : null}

      {lastResult ? (
        <div className="mt-6 max-w-lg rounded-sm border border-paper-line bg-paper-soft px-4 py-3 text-[13.5px] text-current/70 dark:border-ink-line dark:bg-ink-surface">
          Last round: {lastResult.correct}/{lastResult.total} (
          {lastResult.scorePercent}%)
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <GlossyCard
          icon={BookOpenCheck}
          title="Study"
          description="Pick a subject combination and open verified topic breakdowns, subject by subject."
          onClick={() => setModal("subject-select")}
        />
        <GlossyCard
          icon={ScrollText}
          title="Practice MCQs (CBT)"
          description="Solo or with a friend — leaderboard ranking and incentives, split by subject, topic or combination."
          onClick={() => setModal("cbt-mode")}
          delay={0.08}
        />
      </div>

      <SubjectSelectModal
        open={modal === "subject-select"}
        onClose={closeAll}
        onContinue={handleStudyContinue}
      />

      <CbtModeModal
        open={modal === "cbt-mode"}
        onClose={closeAll}
        onChooseSolo={handleChooseSolo}
        onChoosePeer={handleChoosePeer}
      />

      <SoloModeModal
        open={modal === "solo-mode"}
        onClose={closeAll}
        onPick={handleSoloPick}
      />

      <TimingHeadsUpModal
        open={modal === "timing"}
        onClose={closeAll}
        onStart={handleStart}
        questionCount={QUESTIONS_PER_ROUND}
        minutes={QUESTIONS_PER_ROUND}
      />

      <InvitePeerOverlay
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onProceed={handleInviteProceed}
      />

      <CbtRunnerOverlay
        open={runnerOpen}
        subject={runnerSubject}
        mode={runnerMode}
        questionCount={QUESTIONS_PER_ROUND}
        onExit={() => setRunnerOpen(false)}
        onFinish={handleRunnerFinish}
      />
    </div>
  );
}
