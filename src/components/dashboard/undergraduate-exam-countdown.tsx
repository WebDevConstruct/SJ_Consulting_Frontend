"use client";

import { useEffect, useState } from "react";

type ExamCountdownProps = {
  examDate: string;
  examLabel?: string;
};

function getRemainingTime(targetTime: number) {
  const now = Date.now();
  const difference = Math.max(0, targetTime - now);

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor(
    (difference % (1000 * 60 * 60)) / (1000 * 60),
  );
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  const milliseconds = Math.floor(difference % 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    isExpired: difference === 0,
  };
}

export function UndergraduateExamCountdown({
  examDate,
  examLabel = "Exam",
}: ExamCountdownProps) {
  const targetTime = new Date(examDate).getTime();

  const [time, setTime] = useState(() =>
    getRemainingTime(targetTime),
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    function handleVisibilityChange(){
    setIsMounted(true);
    }

    handleVisibilityChange();

    const interval = window.setInterval(() => {
      setTime(getRemainingTime(targetTime));
    }, 50);

    return () => window.clearInterval(interval);
  }, [targetTime]);

  const pad = (value: number, length = 2) =>
    value.toString().padStart(length, "0");

  return (
    <section
      aria-label={`${examLabel} countdown`}
      className=" border-b border-gold-300/60 w-full 
       bg-gold-metal-soft/40 backdrop-blur dark:border-gold-600/40 dark:bg-ink/95"
    >
      <div className="flex w-full lg:flex-row flex-col items-end justify-center lg:items-center lg:justify-end gap-x-4 gap-y-1 px-4 py-2.5 sm:px-6">
        <p className="lg:text-[11px] text-[7px] font-bold uppercase tracking-[0.18em] text-gold-700 dark:text-gold-200">
          {time.isExpired
            ? `${examLabel} day`
            : `${time.days} days to ${examLabel}`}
        </p>

        <div className="flex items-center gap-1.5  text-lg font-bold tabular-nums text-ink dark:text-paper sm:text-xl">
          {time.isExpired ? (
            <span>Good luck!</span>
          ) : (
            <>
              <span>{pad(time.days)}</span>
              <span className="text-[10px] font-semibold uppercase text-ink/45 dark:text-paper/45">
                d
              </span>

              <span className="text-ink/25 dark:text-paper/25">:</span>

              <span>{pad(time.hours)}</span>
              <span className="text-[10px] font-semibold uppercase text-ink/45 dark:text-paper/45">
                h
              </span>

              <span className="text-ink/25 dark:text-paper/25">:</span>

              <span>{pad(time.minutes)}</span>
              <span className="text-[10px] font-semibold uppercase text-ink/45 dark:text-paper/45">
                m
              </span>

              <span className="text-ink/25 dark:text-paper/25">:</span>

              <span>{pad(time.seconds)}</span>
              <span className="text-[10px] font-semibold uppercase text-ink/45 dark:text-paper/45">
                s
              </span>

              <span className="text-ink/25 dark:text-paper/25">.</span>

              {/* <span className="text-gold-700 dark:text-gold-200">
                {pad(time.milliseconds, 3)}
              </span>
              <span className="text-[10px] font-semibold uppercase text-ink/45 dark:text-paper/45">
                ms
              </span> */}
            </>
          )}
        </div>
      </div>
    </section>
  );
}