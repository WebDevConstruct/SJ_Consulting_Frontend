"use client";

import { Trophy } from "lucide-react";
import {motion} from "framer-motion"
import type { DashboardPreview } from "@/lib/dashboard-types";

type LeaderboardPreviewProps = {
  preview: DashboardPreview | null;
  loading: boolean;
  error: string | null;
};

export function LeaderboardPreview({
  preview,
  loading,
  error,
}: LeaderboardPreviewProps) {
  const entries = preview?.leaderboard ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.18 }}
      className="rounded-sm border border-paper-line bg-paper-soft p-7 dark:border-ink-line dark:bg-ink-surface"
    >
      <Trophy
        className="h-6 w-6 text-gold-500 dark:text-gold-300"
        strokeWidth={1.6}
      />

      <h2 className="mt-4 font-display text-[19px]">Leaderboard</h2>
      <p className="mt-2 text-[13px] leading-relaxed text-current/55">
        All-time CBT points from Solo, Peer, and Multiplayer sessions.
      </p>

      {loading ? (
        <ul className="mt-5 flex flex-col gap-3">
          {[...Array(5)].map((_, index) => (
            <li
              key={index}
              className="h-10 animate-pulse rounded-sm bg-current/5"
            />
          ))}
        </ul>
      ) : error ? (
        <p className="mt-5 text-[13.5px] text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : entries.length === 0 ? (
        <p className="mt-5 text-[13.5px] text-current/55">
          No leaderboard activity yet. Complete a session to earn points.
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {entries.map((entry, index) => (
            <li
              key={entry.user_id}
              className={`flex items-center justify-between rounded-sm px-3 py-2 text-[13.5px] ${
                entry.is_current_user
                  ? "border border-gold-400/40 bg-gold-400/5 font-medium"
                  : "text-current/70"
              }`}
            >
              <span>
                {entry.rank}. {entry.display_name}
                {entry.is_current_user ? " · You" : ""}
              </span>

              <span className="tabular-nums text-current/50">
                {entry.total_points.toLocaleString()} pts
              </span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}