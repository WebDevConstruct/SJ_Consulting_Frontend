"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Check, X } from "lucide-react";

import { DeepNavHeader } from "@/components/dashboard/deep-nav-header";

import type {
  UndergraduateSessionDetail,
} from "../types/analysis-types";

export default function UndergraduateSessionDetailPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  const [detail, setDetail] =
    useState<UndergraduateSessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/undergraduate/analysis/${sessionId}`,
          {
            cache: "no-store",
            credentials: "same-origin",
          },
        );

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(
            payload.error || "Unable to load session details.",
          );
        }

        if (active) setDetail(payload);
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load session details.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [sessionId]);

  const session = detail?.session;
  const review = detail?.review ?? [];

  return (
    <>
      <DeepNavHeader
        trail={[
          {
            label: "Dashboard",
            href: "/dashboard/undergraduate",
          },
          {
            label: "Analysis",
            href: "/dashboard/undergraduate/analysis",
          },
          {
            label: "Session review",
            href: `/dashboard/undergraduate/analysis/${sessionId}`,
          },
        ]}
      />

      <div className="mx-auto max-w-content px-4 py-10  sm:px-6 lg:px-8">
        <Link
          href="/dashboard/undergraduate/analysis"
          className="text-sm bg-gold-metal-soft rounded-lg py-5 px-3 font-medium
     hover:underline dark:text-gold-200 mb-[20px]"
        >
         Back to analysis
        </Link>

        {loading ? (
          <p className="mt-8 text-sm text-ink/60 dark:text-paper/60">
            Loading session review…
          </p>
        ) : error ? (
          <p
            role="alert"
            className="mt-8 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          >
            {error}
          </p>
        ) : session ? (
          <>
            <header className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700 dark:text-gold-200">
                {session.kind} session
              </p>

              <h1 className="mt-3 font-display text-[20px] font-bold tracking-tightest">
                {session.course_code} {session.course_title}
              </h1>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-paper-line bg-paper p-5 dark:border-ink-line dark:bg-ink-soft">
                  <p className="text-xs text-ink/60 dark:text-paper/60">
                    Score
                  </p>
                  <p className="mt-2 text-3xl">
                    {session.score_percent === null
                      ? "Pending"
                      : `${session.score_percent}%`}
                  </p>
                </div>

                <div className="rounded-2xl border border-paper-line bg-paper p-5 dark:border-ink-line dark:bg-ink-soft">
                  <p className="text-xs text-ink/60 dark:text-paper/60">
                    Correct answers
                  </p>
                  <p className="mt-2 text-3xl">
                    {session.correct_count ?? 0}
                    <span className="text-base text-ink/50 dark:text-paper/50">
                      /{session.question_count}
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl border border-paper-line bg-paper p-5 dark:border-ink-line dark:bg-ink-soft">
                  <p className="text-xs text-ink/60 dark:text-paper/60">
                    Result
                  </p>
                  <p className="mt-2 font-display text-3xl">
                    {(session.score_percent ?? 0) >= 50
                      ? "Win"
                      : "Loss"}
                  </p>
                </div>
              </div>
            </header>

            <section className="mt-8 space-y-5">
              {review.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-paper-line p-8 text-center text-sm text-ink/60 dark:border-ink-line dark:text-paper/60">
                  No question review is available for this session.
                </p>
              ) : (
                review.map((item) => {
                  const isCorrect = item.is_correct === true;
                  const isWrong = item.is_correct === false;

                  return (
                    <article
                      key={item.question_id}
                      className="rounded-2xl border border-paper-line bg-paper p-5 dark:border-ink-line dark:bg-ink-soft"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium uppercase tracking-wide text-ink/50 dark:text-paper/50">
                          Question {item.position}
                        </span>

                        <span
                          className={`flex items-center gap-1.5 text-xs font-semibold ${
                            isCorrect
                              ? "text-green-600 dark:text-green-400"
                              : isWrong
                                ? "text-red-600 dark:text-red-400"
                                : "text-ink/50 dark:text-paper/50"
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <Check className="h-4 w-4" />
                              Correct
                            </>
                          ) : isWrong ? (
                            <>
                              <X className="h-4 w-4" />
                              Incorrect
                            </>
                          ) : (
                            "Unanswered"
                          )}
                        </span>
                      </div>

                      <h2 className="mt-3 font-display text-xl leading-snug">
                        {item.prompt}
                      </h2>

                      <div className="mt-4 space-y-2">
                        {item.options.map((option) => {
                          const isSelected =
                            option.id === item.selected_option;
                          const isCorrectOption =
                            option.id === item.correct_option;

                          return (
                            <div
                              key={option.id}
                              className={`rounded-xl border p-3 text-sm ${
                                isCorrectOption
                                  ? "border-green-500 bg-green-500/10"
                                  : isSelected
                                    ? "border-red-500 bg-red-500/10"
                                    : "border-paper-line dark:border-ink-line"
                              }`}
                            >
                              <span className="mr-2 font-semibold">
                                {option.id}.
                              </span>
                              {option.text}
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4 grid gap-2 text-xs text-ink/65 dark:text-paper/65">
                        <p>
                          <span className="font-semibold">
                            Your answer:
                          </span>{" "}
                          {item.selected_option ?? "Unanswered"}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Correct answer:
                          </span>{" "}
                          {item.correct_option ?? "Unavailable"}
                        </p>
                      </div>

                      {item.explanation && (
                        <div className="mt-4 rounded-xl bg-gold-50 p-4 text-sm leading-6 text-gold-700 dark:bg-gold-400/10 dark:text-gold-200">
                          <p className="font-semibold">Explanation</p>
                          <p className="mt-1 whitespace-pre-wrap">
                            {item.explanation}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </section>
          </>
        ) : null}
      </div>
    </>
  );
}