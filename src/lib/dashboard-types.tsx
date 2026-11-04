export type SessionKind = "solo" | "peer" | "multiplayer";
export type SessionMode = "practice" | "exam";

export type RecentSession = {
  session_id: string;
  kind: SessionKind;
  mode: SessionMode;
  track_type: string;
  course_id: string | null;
  completed_at: string | null;
  total_questions: number;
  correct_answers: number;
  score_percent: number;
  points_awarded: number;
  final_rank: number | null;
  is_winner: boolean;
};

export type PerformanceSummary = {
  total_sessions: number;
  solo_sessions: number;
  peer_sessions: number;
  multiplayer_sessions: number;
  wins: number;
  total_points: number;
  average_score_percent: number;
};

export type LeaderboardEntry = {
  user_id: string;
  display_name: string;
  total_points: number;
  sessions_completed: number;
  wins: number;
  rank: number;
  is_current_user: boolean;
};

export type DashboardPreview = {
  summary: PerformanceSummary;
  recent_sessions: RecentSession[];
  leaderboard: LeaderboardEntry[];
};