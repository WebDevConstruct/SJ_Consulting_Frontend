"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Users,
  X,
} from "lucide-react";
import { usePeerSession } from "@/lib/study/peer-session-store";
import { subjectCombinations } from "@/lib/study/mock-data";
import type { PacingMode, PeerSession, Track } from "@/lib/study/types";

type Step = "invite" | "configure" | "pending" | "accepted";

interface InvitePeerOverlayProps {
  open: boolean;
  onClose: () => void;
  onProceed: (session: PeerSession) => void;
}

const ALL_SUBJECTS = Array.from(
  new Set(subjectCombinations.flatMap((c) => c.subjects))
);

export function InvitePeerOverlay({
  open,
  onClose,
  onProceed,
}: InvitePeerOverlayProps) {
  const { session, send, simulateAccept, clear } = usePeerSession();

  const [step, setStep] = useState<Step>("invite");
  const [identifier, setIdentifier] = useState("");
  const [track, setTrack] = useState<Track>("combination");
  const [pacing, setPacing] = useState<PacingMode>("self-paced");
  const [subject, setSubject] = useState(ALL_SUBJECTS[0]);
  const [sending, setSending] = useState(false);

  // When the overlay (re)opens, resume wherever the persisted session is.
  useEffect(() => {
    if (!open) return;
    // Resume at whichever step matches the persisted session whenever the
    // overlay (re)opens, since the person may have closed it mid-flow.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (session?.status === "accepted") setStep("accepted");
    else if (session?.status === "pending") setStep("pending");
    else setStep("invite");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [open, session]);

  if (!open) return null;

  const handleSendRequest = async () => {
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    send({ invitee: identifier, track, pacing, subject });
    setSending(false);
    setStep("pending");
  };

  const handleProceed = () => {
    if (session) {
      onProceed(session);
      clear();
    }
  };

  const handleCancel = () => {
    clear();
    setStep("invite");
    setIdentifier("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper dark:bg-ink">
      <div className="flex items-center justify-between border-b border-paper-line px-5 py-4 dark:border-ink-line">
        {step === "configure" ? (
          <button
            type="button"
            onClick={() => setStep("invite")}
            className="focus-gold flex items-center gap-1.5 text-[13.5px] font-medium text-current/60 hover:text-gold-500"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Back
          </button>
        ) : (
          <span className="font-display text-[16px]">Peer session</span>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="focus-gold flex h-9 w-9 items-center justify-center rounded-full text-current/50 hover:text-current"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {step === "invite" ? (
            <motion.div
              key="invite"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm"
            >
              <Users className="h-7 w-7 text-gold-500 dark:text-gold-300" strokeWidth={1.6} />
              <p className="mt-4 text-[14px] leading-relaxed text-current/60">
                Study the same set of questions, at the same time, as a
                friend. They&rsquo;ll get a request to join your round.
              </p>
              <h2 className="mt-5 font-display text-[22px]">Invite a friend</h2>

              <label
                htmlFor="invite-identifier"
                className="mt-5 block text-[13.5px] font-medium text-current/80"
              >
                Username or email
              </label>
              <input
                id="invite-identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. feranmi_a"
                className="focus-gold mt-2 w-full rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current placeholder:text-current/35 dark:border-ink-line dark:bg-ink-surface md:text-[14.5px]"
              />

              <button
                type="button"
                disabled={!identifier.trim()}
                onClick={() => setStep("configure")}
                className="focus-gold mt-6 w-full rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3.5 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                Request
              </button>
            </motion.div>
          ) : null}

          {step === "configure" ? (
            <motion.div
              key="configure"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm"
            >
              <h2 className="font-display text-[22px]">Set up the round</h2>
              <p className="mt-2 text-[13.5px] text-current/60">
                Inviting <strong>{identifier}</strong>.
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <span className="text-[13.5px] font-medium text-current/80">
                  Subject
                </span>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="focus-gold rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-[14.5px]"
                >
                  {ALL_SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <span className="text-[13.5px] font-medium text-current/80">
                  Track
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["subject", "topic", "combination"] as Track[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTrack(t)}
                      className={`focus-gold rounded-sm border px-2 py-2.5 text-[12.5px] font-medium capitalize transition-colors ${
                        track === t
                          ? "border-gold-400 bg-gold-400/5 text-gold-600 dark:text-gold-300"
                          : "border-paper-line text-current/60 hover:border-current/30 dark:border-ink-line"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <span className="text-[13.5px] font-medium text-current/80">
                  Pacing
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { value: "self-paced", label: "Self-paced" },
                      { value: "time-initiated", label: "Time-initiated" },
                    ] as { value: PacingMode; label: string }[]
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPacing(option.value)}
                      className={`focus-gold rounded-sm border px-3 py-2.5 text-[12.5px] font-medium transition-colors ${
                        pacing === option.value
                          ? "border-gold-400 bg-gold-400/5 text-gold-600 dark:text-gold-300"
                          : "border-paper-line text-current/60 hover:border-current/30 dark:border-ink-line"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={sending}
                onClick={handleSendRequest}
                className="focus-gold mt-7 flex w-full items-center justify-center gap-2 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3.5 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send request"
                )}
              </button>
            </motion.div>
          ) : null}

          {step === "pending" ? (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex w-full max-w-sm flex-col items-center text-center"
            >
              <Loader2 className="h-8 w-8 animate-spin text-gold-500 dark:text-gold-300" />
              <h2 className="mt-5 font-display text-[20px]">
                Waiting for {session?.invitee ?? "your friend"}
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-current/60">
                You can leave this screen &mdash; message them, do something
                else &mdash; we&rsquo;ll keep this open in the background
                until they respond.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="focus-gold mt-6 rounded-sm border border-paper-line px-5 py-2.5 text-[13.5px] font-medium text-current/70 hover:border-current/30 dark:border-ink-line"
              >
                Close and keep waiting
              </button>

              <button
                type="button"
                onClick={simulateAccept}
                className="focus-gold mt-3 text-[12.5px] text-current/40 underline underline-offset-2 hover:text-gold-500"
              >
                Dev preview: simulate {session?.invitee ?? "friend"} accepting
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="focus-gold mt-5 text-[12.5px] text-current/40 hover:text-red-500"
              >
                Cancel request
              </button>
            </motion.div>
          ) : null}

          {step === "accepted" ? (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex w-full max-w-sm flex-col items-center text-center"
            >
              <CheckCircle2 className="h-9 w-9 text-gold-500 dark:text-gold-300" />
              <h2 className="mt-5 font-display text-[20px]">
                {session?.invitee} accepted
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-current/60">
                You&rsquo;re both connected on {session?.subject}. Ready when
                you are.
              </p>
              <button
                type="button"
                onClick={handleProceed}
                className="focus-gold mt-6 w-full rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3.5 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01]"
              >
                Continue
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
