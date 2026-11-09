export type SessionKind = "solo" | "peer" | "multiplayer";

export type UndergraduateSessionSummary = {
  id: string;
  course_title: string;
  course_code: string;
  kind: SessionKind;
  mode: string;
  status: string;
  question_count: number;
  score_percent: number | null;
  correct_count: number | null;
  attempted_at: string;
  completed_at: string | null;
};

export type UndergraduateAnalysisResponse = {
  sessions: UndergraduateSessionSummary[];
  summary: {
    total_sessions: number;
    wins: number;
    losses: number;
    average_score: number;
    best_score: number;
  };
  chart: {
    date: string;
    score_percent: number;
  }[];
};

export type AnalysisQuestionReview = {
  question_id: string;
  position: number;
  prompt: string;
  options: { id: string; text: string }[];
  selected_option: string | null;
  correct_option: string | null;
  is_correct: boolean | null;
  explanation: string | null;
};

export type UndergraduateSessionDetail = {
  session: UndergraduateSessionSummary;
  review: AnalysisQuestionReview[];
};