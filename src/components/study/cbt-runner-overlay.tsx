"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock, Grid3x3, X } from "lucide-react";
import { getMockQuestions } from "@/lib/study/mock-data";
import type { AnswerMap, CbtMode, SubmissionResult } from "@/lib/study/types";

interface CbtRunnerOverlayProps {
  open: boolean;
  subject: string;
  mode: CbtMode;
  questionCount?: number;
  onExit: () => void;
  onFinish: (result: SubmissionResult) => void;
}

const SECONDS_PER_QUESTION = 60;

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function CbtRunnerOverlay({
  open,
  subject,
  mode,
  questionCount = 10,
  onExit,
  onFinish,
}: CbtRunnerOverlayProps) {
  const questions = useMemo(
    () => getMockQuestions(subject, questionCount),
    [subject, questionCount]
  );

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [showJump, setShowJump] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(
    questions.length * SECONDS_PER_QUESTION
  );

  const handleSubmit = () => {
    const correct = questions.filter(
      (q) => answers[q.id] === q.correctOptionId
    ).length;
    const finalResult: SubmissionResult = {
      total: questions.length,
      correct,
      scorePercent: Math.round((correct / questions.length) * 100),
      answers,
    };
    setResult(finalResult);
  };

  useEffect(() => {
    if (!open || mode !== "exam" || result) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [open, mode, result]);

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    // Auto-submits once the exam timer runs out — a direct response to an
    // external timer, not state derived from props.
    if (mode === "exam" && secondsLeft === 0 && !result) {
      handleSubmit();
    }
  }, [secondsLeft]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  if (!open) return null;

  const current = questions[index];
  const answeredCount = Object.values(answers).filter(Boolean).length;

  const selectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
  };

  const goTo = (i: number) => {
    setIndex(Math.max(0, Math.min(questions.length - 1, i)));
    setShowJump(false);
  };

  if (result) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper px-6 dark:bg-ink">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold-400/40 bg-gold-400/5">
            <span className="font-display text-[26px] text-gold-600 dark:text-gold-300">
              {result.scorePercent}%
            </span>
          </div>
          <h2 className="mt-6 font-display text-[22px]">Round complete</h2>
          <p className="mt-2 text-[14px] text-current/60">
            {result.correct} of {result.total} correct &middot; {subject}
          </p>

          <button
            type="button"
            onClick={() => onFinish(result)}
            className="focus-gold mt-8 w-full rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3.5 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01]"
          >
            Done
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper dark:bg-ink">
      <div className="flex items-center justify-between border-b border-paper-line px-5 py-4 dark:border-ink-line">
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit session"
          className="focus-gold flex h-9 w-9 items-center justify-center rounded-full text-current/50 hover:text-current"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-[13.5px] font-medium text-current/70">
          Question {index + 1} of {questions.length}
        </div>

        <div className="flex items-center gap-3">
          {mode === "exam" ? (
            <span className="flex items-center gap-1.5 text-[13.5px] font-medium text-gold-600 dark:text-gold-300">
              <Clock className="h-4 w-4" strokeWidth={1.8} />
              {formatTime(secondsLeft)}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setShowJump((v) => !v)}
            aria-label="Jump to question"
            className="focus-gold flex h-9 w-9 items-center justify-center rounded-full text-current/50 hover:text-current"
          >
            <Grid3x3 className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {showJump ? (
        <div className="border-b border-paper-line bg-paper-soft px-5 py-4 dark:border-ink-line dark:bg-ink-soft">
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => {
              const answered = Boolean(answers[q.id]);
              const isCurrent = i === index;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`focus-gold flex h-9 w-9 items-center justify-center rounded-sm border text-[12.5px] font-medium transition-colors ${
                    isCurrent
                      ? "border-gold-400 bg-gold-metal-soft text-ink"
                      : answered
                        ? "border-gold-400/40 bg-gold-400/10 text-gold-600 dark:text-gold-300"
                        : "border-paper-line text-current/55 dark:border-ink-line"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-10 md:items-center">
        <div className="w-full max-w-xl">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-[12px] font-medium uppercase tracking-wide text-current/40">
              {current.subject}
            </p>
            <h2 className="mt-2 font-display text-[19px] leading-snug sm:text-[21px]">
              {current.prompt}
            </h2>

            <div className="mt-7 flex flex-col gap-3">
              {current.options.map((option) => {
                const selected = answers[current.id] === option.id;
                return (
                  <label
                    key={option.id}
                    className={`focus-gold flex cursor-pointer items-center gap-3 rounded-sm border px-4 py-3.5 transition-colors ${
                      selected
                        ? "border-gold-400 bg-gold-400/5"
                        : "border-paper-line hover:border-current/30 dark:border-ink-line"
                    }`}
                  >
                    <input
                      type="radio"
                      name={current.id}
                      checked={selected}
                      onChange={() => selectOption(option.id)}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? "border-gold-400 bg-gold-metal-soft"
                          : "border-current/30"
                      }`}
                    >
                      {selected ? (
                        <Check className="h-3 w-3 text-ink" strokeWidth={3} />
                      ) : null}
                    </span>
                    <span className="text-[14.5px]">{option.text}</span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-paper-line px-5 py-4 dark:border-ink-line">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="focus-gold rounded-sm border border-paper-line px-5 py-2.5 text-[13.5px] font-medium text-current/70 transition-colors hover:border-current/30 disabled:cursor-not-allowed disabled:opacity-40 dark:border-ink-line"
        >
          Previous
        </button>

        <span className="text-[12.5px] text-current/40">
          {answeredCount}/{questions.length} answered
        </span>

        {index === questions.length - 1 ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="focus-gold rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-2.5 text-[13.5px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.02]"
          >
            Submit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="focus-gold rounded-sm border border-paper-line px-5 py-2.5 text-[13.5px] font-medium text-current/70 transition-colors hover:border-current/30 dark:border-ink-line"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="focus-gold rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-2.5 text-[13.5px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.02]"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
