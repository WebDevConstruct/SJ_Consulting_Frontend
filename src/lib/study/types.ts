export interface SubjectCombination {
  slug: string;
  label: string;
  description: string;
  subjects: string[];
}

export interface Topic {
  id: string;
  title: string;
  summary: string;
}

export type CbtTrack = "subject" | "topic" | "combination" | "courses";
export type PacingMode = "self-paced" | "time-initiated";
export type CbtMode = "practice" | "exam";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  subject: string;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
}

export type PeerSessionStatus = "pending" | "accepted";

export interface PeerSession {
  session_id: string;
  invitee: string;
  track: CbtTrack;
  kind : "peer"
   question_count : number;
   duration_seconds : number;
   submit_deadline : string | null;
  subject: string;
  status: PeerSessionStatus;
  connectionId: string | null;
  createdAt: number;
}

export interface AnswerMap {
  [questionId: string]: string | null;
}

export interface SubmissionResult {
  total: number;
  correct: number;
  scorePercent: number;
  answers: AnswerMap;
}
