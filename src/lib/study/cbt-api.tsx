"use client";

import type { CbtMode, CbtTrack } from "@/lib/study/types";



export type CbtOption =
  
{
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
  submit_deadline ?: string | null;
  subjectId ?: string | null;
 courseId ?: string | null;
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
  subjectIds ?: string[] | null;
  questionCount?: number;
  durationSeconds?: number;
};

export async function startCbtSession(
  supabase : any,
  input: StartSessionInput,
): Promise<StartedSession> {
  const { data, error } = await supabase.rpc("start_cbt_session", {
    p_kind: input.kind,
    p_mode: input.mode,
    p_track_type: input.trackType,
    p_subject_id: input.subjectId ?? null,
    p_course_id: input.courseId  ?? null,
    p_topic_id: input.topicId ?? null,
    p_subject_ids: input.subjectIds ?? null,
    p_question_count: input.questionCount ?? 10,
    p_duration_seconds: input.durationSeconds ?? 1800,
  });

  if (error) throw error;

  return data;
}

export async function submitCbtSession(
  supabase: any,
  sessionId: string,
  answers: Record<string, string | null>,
): Promise<SubmissionResult> {
  const payload = Object.entries(answers).map(
    ([questionId, selectedOption]) => ({
      question_id: questionId,
      selected_option: selectedOption,
    }),
  );

  const { data, error } = await supabase.rpc("submit_cbt_session", {
    p_session_id: sessionId,
    p_answers: payload,
  });

  if (error) throw error;

  return data;
}

export async function revealPracticeAnswer(
  supabase: any,
  sessionId: string,
  questionId: string,
): Promise<{
  question_id: string;
  correct_option: string;
  explanation: string;
}> {
  const { data, error } = await supabase.rpc("reveal_practice_answer", {
    p_session_id: sessionId,
    p_question_id: questionId,
  });

  if (error) throw error;

  return data;
}


//RETRIEVING EXISTING USER SESSION USING THE SESSIONiD, ALREADY CONNECTED TO PREVIOSLY BEFORE DISCONNECT
export async function getPeerSession(
  supabase: any,
  sessionId: string,
): Promise<StartedSession & { status: string }> {
  const { data, error } = await supabase.rpc("get_peer_session", {
    p_session_id: sessionId,
  });

  if (error) throw error;

  return data;
}

//The STARTING AND INITIALISATION OF PEER SESSIONS
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
  const { data, error } = await supabase.rpc("start_peer_session", {
    p_session_id: sessionId,
  });

  if (error) throw error;

  return data;
}