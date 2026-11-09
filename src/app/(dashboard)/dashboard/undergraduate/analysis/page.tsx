"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Search } from "lucide-react";

import { DeepNavHeader } from "@/components/dashboard/deep-nav-header";

import type {
  SessionKind,
  UndergraduateAnalysisResponse,
} from "./types/analysis-types";

const inputClass =
  "w-full rounded-xl border border-paper-line bg-paper px-3.5 py-3 " +
  "text-base text-ink outline-none transition " +
  "focus:border-gold-500 focus:ring-2 focus:ring-gold-400/20 " +
  "dark:border-ink-line dark:bg-ink-surface dark:text-paper";

const primaryClass =
  "inline-flex items-center justify-center rounded-xl " +
  "border border-gold-500/30 bg-gold-metal-soft px-5 py-3 " +
  "text-sm font-semibold text-ink transition hover:brightness-105 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const secondaryClass =
  "inline-flex items-center justify-center rounded-xl " +
  "border border-paper-line bg-paper px-4 py-2.5 text-sm " +
  "font-medium text-ink transition hover:bg-paper-soft " +
  "dark:border-ink-line dark:bg-ink-soft dark:text-paper";

const KIND_OPTIONS: { value: SessionKind | "all"; label: string }[] = [
  { value: "all", label: "All sessions" },
  { value: "solo", label: "Solo" },
  { value: "peer", label: "Peer" },
  { value: "multiplayer", label: "Multiplayer" },
];

export default function UndergraduateAnalysisPage() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<SessionKind | "all">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [data, setData] =
    useState<UndergraduateAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalysis = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (query.trim()) params.set("q", query.trim());
      if (kind !== "all") params.set("kind", kind);
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const response = await fetch(
        `/api/undergraduate/analysis?${params.toString()}`,
        {
          cache: "no-store",
          credentials: "same-origin",
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load analysis.");
      }

      setData(payload);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load analysis.",
      );
    } finally {
      setLoading(false);
    }
  }, [query, kind, from, to]);

  useEffect(() => {
    function runAction(){
    void loadAnalysis();
    }
    runAction()
  }, [loadAnalysis]);

  const sessions = data?.sessions ?? [];
  const summary = data?.summary;
  const chart = data?.chart ?? [];

  const scoreTrend = useMemo(
    () =>
      chart.map((item, index) => ({
        ...item,
        label: `${item.date} #${index + 1}`,
      })),
    [chart],
  );

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
        ]}
      />

      <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700 dark:text-gold-200">
            Undergraduate performance
          </p>

          <h1 className="mt-3 font-display text-4xl font-bold tracking-tightest">
            CBT Analysis
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/65 dark:text-paper/65">
            Review every completed undergraduate CBT session, filter your
            results by date and session type, and open a session for a full
            question-by-question review.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-paper-line bg-paper p-5 dark:border-ink-line dark:bg-ink-soft">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2 text-sm font-medium">
              <span>Search course or session</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="e.g. ENT 211, solo, peer…"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </label>

            <label className="block space-y-2 text-sm font-medium">
              <span>Session type</span>
              <select
                value={kind}
                onChange={(event) =>
                  setKind(event.target.value as SessionKind | "all")
                }
                className={inputClass}
              >
                {KIND_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2 text-sm font-medium">
              <span>From date</span>
              <input
                type="date"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                className={inputClass}
              />
            </label>

            <label className="block space-y-2 text-sm font-medium">
              <span>To date</span>
              <input
                type="date"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className={primaryClass}
              onClick={() => void loadAnalysis()}
              disabled={loading}
            >
              {loading ? "Loading…" : "Run query"}
            </button>

            <button
              className={secondaryClass}
              onClick={() => {
                setQuery("");
                setKind("all");
                setFrom("");
                setTo("");
              }}
            >
              Reset filters
            </button>
          </div>
        </section>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          >
            {error}
          </p>
        )}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-paper-line bg-paper p-5 dark:border-ink-line dark:bg-ink-soft">
            <p className="text-xs text-ink/60 dark:text-paper/60">
              Completed sessions
            </p>
            <p className="mt-2 font-display text-3xl">
              {summary?.total_sessions ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-paper-line bg-paper p-5 dark:border-ink-line dark:bg-ink-soft">
            <p className="text-xs text-ink/60 dark:text-paper/60">
              Wins — 50% or above
            </p>
            <p className="mt-2 font-display text-3xl text-green-600 dark:text-green-400">
              {summary?.wins ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-paper-line bg-paper p-5 dark:border-ink-line dark:bg-ink-soft">
            <p className="text-xs text-ink/60 dark:text-paper/60">
              Losses — below 50%
            </p>
            <p className="mt-2 font-display text-3xl text-red-600 dark:text-red-400">
              {summary?.losses ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-paper-line bg-paper p-5 dark:border-ink-line dark:bg-ink-soft">
            <p className="text-xs text-ink/60 dark:text-paper/60">
              Average score
            </p>
            <p className="mt-2 font-display text-3xl">
              {summary?.average_score ?? 0}%
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-paper-line bg-paper p-5 dark:border-ink-line dark:bg-ink-soft">
          <h2 className="text-sm font-medium text-ink/70 dark:text-paper/70">
            Score trend ({sessions.length} session
            {sessions.length === 1 ? "" : "s"})
          </h2>

          <div className="mt-4 h-64 w-full">
            {scoreTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    opacity={0.1}
                  />

                  <XAxis
                    dataKey="label"
                    tick={{
                      fontSize: 11,
                      fill: "currentColor",
                      opacity: 0.5,
                    }}
                    axisLine={{
                      stroke: "currentColor",
                      opacity: 0.15,
                    }}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{
                      fontSize: 11,
                      fill: "currentColor",
                      opacity: 0.5,
                    }}
                    axisLine={{
                      stroke: "currentColor",
                      opacity: 0.15,
                    }}
                    tickLine={false}
                    width={32}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "var(--tw-color-ink, #0A0A0B)",
                      border: "1px solid #C9A227",
                      borderRadius: 4,
                      fontSize: 12.5,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="score_percent"
                    stroke="#C9A227"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#C9A227" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-ink/45 dark:text-paper/45">
                No completed sessions match these filters yet.
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-paper-line dark:border-ink-line">
          <div className="divide-y divide-paper-line dark:divide-ink-line">
            {loading ? (
              <div className="p-6 text-sm text-ink/60 dark:text-paper/60">
                Loading sessions…
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-6 text-sm text-ink/60 dark:text-paper/60">
                No completed undergraduate CBT sessions match your filters.
              </div>
            ) : (
              sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/dashboard/undergraduate/analysis/${session.id}`}
                  className="flex items-center justify-between gap-4 bg-paper px-5 py-4 transition-colors hover:bg-paper-soft dark:bg-ink dark:hover:bg-ink-surface"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {session.course_code} · {session.course_title}
                    </p>

                    <p className="mt-1 text-xs capitalize text-ink/55 dark:text-paper/55">
                      {session.kind} · {session.mode} ·{" "}
                      {session.question_count} questions
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gold-700 dark:text-gold-200">
                      {session.score_percent === null
                        ? "Pending"
                        : `${session.score_percent}%`}
                    </p>

                    <p className="mt-1 text-xs text-ink/45 dark:text-paper/45">
                      {new Date(
                        session.completed_at ?? session.attempted_at,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}