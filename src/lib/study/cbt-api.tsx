"use client";

import type { CbtMode, CbtTrack } from "@/lib/study/types";
import { startCBTSession, submitCBTSession } from "@/lib/api";

export type CbtOption = {
  id?: string;
  label?: string;
  text?: string;
};

export type CbtQuestion = {
  id: string;
  subject_id?: string | null;
  prompt: string;
  options: CbtOption[];
  answer?: string | null;
  explanation?: string | null;
};

export type StartedSession = {
  session_id: string;
  kind: "solo" | "peer" | "multiplayer";
  mode: CbtMode;
  track_type: CbtTrack;
  submit_deadline?: string | null;
  subjectId?: string | null;
  courseId?: string | null;
  question_count: number;
  duration_seconds: number;
  questions: CbtQuestion[];
};

export type SubmittedAnswer = {
  question_id: string;
  prompt: string;
  options: {
    label: string;
    text: string;
  }[];
  selected_option: string | null;
  correct_option: string | null;
  is_correct: boolean;
  explanation: string;
};

export type SubmissionResult = {
  session_id: string;
  total: number;
  correct: number;
  score_percent: number;
  answers: SubmittedAnswer[];
};

type StartSessionInput = {
  kind: "solo" | "peer";
  mode: CbtMode;
  trackType: CbtTrack;
  subjectId?: string | null;
  topicId?: string | null;
  courseId?: string | null;
  subjectIds?: string[] | null;
  questionCount?: number;
  durationSeconds?: number;
};

export async function startCbtSession(
  _supabase: any,
  input: StartSessionInput,
): Promise<StartedSession> {
  const subject = input.subjectId || "economics";
  const track =
    input.trackType === "topic" || input.trackType === "combination"
      ? input.trackType
      : "subject";

  const res = await startCBTSession({
    subject: subject.toLowerCase(),
    track_type: track,
    mode: input.kind === "peer" ? "peer" : "solo",
  });

  const mappedQuestions: CbtQuestion[] = (res.questions || []).map((q) => ({
    id: q.id,
    prompt: q.context_text
      ? `${q.context_text}\n\n${q.question_text}`
      : q.question_text,
    options: Object.entries(q.options || {}).map(([key, val]) => ({
      id: key,
      label: key,
      text: String(val),
    })),
  }));

  return {
    session_id: res.session.id,
    kind: input.kind,
    mode: input.mode,
    track_type: input.trackType,
    submit_deadline: res.session.expires_at,
    subjectId: res.session.subject,
    courseId: input.courseId ?? null,
    question_count: res.questions.length,
    duration_seconds: res.session.time_limit_seconds,
    questions: mappedQuestions,
  };
}

export async function submitCbtSession(
  _supabase: any,
  sessionId: string,
  answers: Record<string, string | null>,
): Promise<SubmissionResult> {
  const safeAnswers: Record<string, "A" | "B" | "C" | "D"> = {};
  for (const [k, v] of Object.entries(answers)) {
    if (v && ["A", "B", "C", "D"].includes(v.toUpperCase())) {
      safeAnswers[k] = v.toUpperCase() as "A" | "B" | "C" | "D";
    }
  }

  const res = await submitCBTSession({
    session_id: sessionId,
    answers: safeAnswers,
  });

  return {
    session_id: sessionId,
    total: res.total_questions,
    correct: res.score,
    score_percent: res.percentage,
    answers: Object.entries(safeAnswers).map(([qId, opt]) => ({
      question_id: qId,
      prompt: "",
      options: [],
      selected_option: opt,
      correct_option: null,
      is_correct: false,
      explanation: "",
    })),
  };
}

export async function revealPracticeAnswer(
  _supabase: any,
  _sessionId: string,
  questionId: string,
): Promise<{
  question_id: string;
  correct_option: string;
  explanation: string;
}> {
  return {
    question_id: questionId,
    correct_option: "",
    explanation: "Answers are graded and scored server-side upon session submission.",
  };
}

// RETRIEVING EXISTING USER SESSION USING THE SESSION ID
export async function getPeerSession(
  supabase: any,
  sessionId: string,
): Promise<StartedSession & { status: string }> {
  const { data, error } = await supabase
    .from("cbt_peer_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (error || !data) {
    throw new Error(error?.message ?? "Peer session not found");
  }

  return {
    session_id: data.id,
    kind: "peer",
    mode: "exam",
    track_type: data.track_type,
    submit_deadline: data.expires_at,
    subjectId: data.subject,
    courseId: null,
    question_count: data.total_questions,
    duration_seconds: data.time_limit_seconds,
    questions: [],
    status: data.status,
  };
}

// THE STARTING AND INITIALISATION OF PEER SESSIONS
export async function startPeerSession(
  supabase: any,
  sessionId: string,
): Promise<{
  session_id: string;
  status: string;
  started_at: string;
  submit_deadline: string;
  duration_seconds: number;
}> {
  const { data, error } = await supabase
    .from("cbt_peer_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error || !data) throw error;

  return {
    session_id: data.id,
    status: data.status,
    started_at: data.started_at || new Date().toISOString(),
    submit_deadline: data.expires_at,
    duration_seconds: data.time_limit_seconds,
  };
}
