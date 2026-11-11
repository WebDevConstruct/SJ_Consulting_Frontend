"use client";

import { useEffect, useState } from "react";
import { getCandidateDashboard } from "@/lib/api";
import type { DashboardPreview } from "@lib/dashboard-types";

export function useDashboardPreview() {
  const [preview, setPreview] = useState<DashboardPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPreview = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getCandidateDashboard();
        if (cancelled) return;

        const mapped: DashboardPreview = {
          summary: {
            total_sessions: data.analysis?.total_attempts ?? 0,
            solo_sessions: (data.recent_attempts ?? []).filter((a) => a.mode === "solo").length,
            peer_sessions: (data.recent_attempts ?? []).filter((a) => a.mode === "peer").length,
            multiplayer_sessions: 0,
            wins: 0,
            total_points: data.leaderboard?.caller_score ?? 0,
            average_score_percent: Math.round(data.analysis?.avg_score_pct ?? 0),
          },
          recent_sessions: (data.recent_attempts ?? []).map((att) => ({
            session_id: att.id,
            kind: att.mode === "peer" ? "peer" : "solo",
            mode: "exam",
            track_type: att.track_type,
            course_id: null,
            completed_at: att.attempted_at,
            total_questions: att.total_questions,
            correct_answers: att.score,
            score_percent: Math.round(
              att.score_pct ?? (att.score / (att.total_questions || 1)) * 100
            ),
            points_awarded: att.score * 10,
            final_rank: null,
            is_winner: false,
          })),
          leaderboard: (data.leaderboard?.nearby ?? []).map((entry) => ({
            user_id: entry.username,
            display_name: entry.username,
            total_points: entry.leaderboard_score,
            sessions_completed: 0,
            wins: 0,
            rank: entry.rank,
            is_current_user: entry.is_caller,
          })),
        };

        setPreview(mapped);
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.message ?? "Failed to load dashboard preview");
        setPreview(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadPreview();

    return () => {
      cancelled = true;
    };
  }, []);

  return { preview, loading, error };
}
