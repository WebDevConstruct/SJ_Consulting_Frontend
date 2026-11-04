"use client";

import { useMemo } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Award, Swords, User } from "lucide-react";

import type { DashboardPreview, RecentSession } from "@/lib/dashboard-types";

type PerformanceAnalysisProps = {
  preview: DashboardPreview | null;
  loading: boolean;
  error: string | null;
};

const kindLabels: Record<RecentSession["kind"], string> = {
  solo: "Solo",
  peer: "Peer",
  multiplayer: "Multiplayer",
};

export function PerformanceAnalysis({
  preview,
  loading,
  error,
}: PerformanceAnalysisProps) {
  const chartData = useMemo(
    () =>
      (preview?.recent_sessions ?? [])
        .slice()
        .reverse()
        .map((session, index) => ({
          name: `Session ${index + 1}`,
          score: session.score_percent,
          kind: kindLabels[session.kind],
        })),
    [preview?.recent_sessions],
  );

  const summary = preview?.summary;

  return (
    <section className="rounded-sm border border-paper-line bg-paper-soft p-7 dark:border-ink-line dark:bg-ink-surface">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-[21px]">Performance analysis</h2>
          <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-current/60">
            A quick view of your most recent Solo and Peer sessions, including
            your score trend and competition results.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatChip
            icon={<User className="h-4 w-4" />}
            label="Solo"
            value={summary?.solo_sessions ?? 0}
          />
          <StatChip
            icon={<Swords className="h-4 w-4" />}
            label="Peer"
            value={summary?.peer_sessions ?? 0}
          />
          <StatChip
            icon={<Award className="h-4 w-4" />}
            label="Wins"
            value={summary?.wins ?? 0}
          />
        </div>
      </div>

      {loading ? (
        <div className="mt-8 h-[240px] animate-pulse rounded-sm bg-current/5" />
      ) : error ? (
        <p className="mt-8 text-[13.5px] text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : chartData.length === 0 ? (
        <div className="mt-8 rounded-sm border border-dashed border-paper-line p-8 text-center dark:border-ink-line">
          <p className="text-[14px] font-medium">No completed sessions yet</p>
          <p className="mt-2 text-[13px] text-current/55">
            Start a Solo or Peer session to see your performance trend here.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#d4af37"
                  strokeWidth={2}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {preview?.recent_sessions.map((session) => (
              <article
                key={session.session_id}
                className="rounded-sm border border-paper-line p-4 dark:border-ink-line"
              >
                <p className="text-[12px] uppercase tracking-wide text-current/45">
                  {kindLabels[session.kind]} · {session.mode}
                </p>

                <p className="mt-2 font-display text-[22px]">
                  {session.score_percent}%
                </p>

                <p className="mt-1 text-[12.5px] text-current/55">
                  {session.correct_answers}/{session.total_questions} correct
                </p>

                <p className="mt-3 text-[12.5px] font-medium text-gold-600 dark:text-gold-300">
                  +{session.points_awarded} pts
                  {session.is_winner ? " · Winner" : ""}
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function StatChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2 rounded-sm border border-paper-line px-3 py-2 text-[13px] dark:border-ink-line">
      <span className="text-gold-500 dark:text-gold-300">{icon}</span>
      <span className="text-current/60">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}