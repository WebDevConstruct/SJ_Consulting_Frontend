import { NextResponse } from "next/server";

import {createClient} from "@/lib/supabase/server";
import type {
  AnalysisQuestionReview,
  UndergraduateSessionDetail,
  UndergraduateSessionSummary,
} from "../../../../(dashboard)/dashboard/undergraduate/analysis/types/analysis-types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "You must be signed in." },
      { status: 401 },
    );
  }

  const { data: session, error: sessionError } = await supabase
  .from("cbt_sessions")
  .select(
    `
    id,
    kind,
    mode,
    status,
    question_ids,
    question_count,
    total_questions,
    correct_count,
    score_percent,
    created_at,
    completed_at,
    course:courses (
      course_code,
      course_title
    ),
    participation:cbt_session_participants!inner (
      user_id,
      status,
      completed_at
    )
  `
  )
  .eq("id", sessionId)
  .eq("participation.user_id", user.id)
  .maybeSingle();
  if (sessionError) {
    return NextResponse.json(
      { error: sessionError.message },
      { status: 500 },
    );
  }

  if (!session) {
    return NextResponse.json(
      { error: "Session not found." },
      { status: 404 },
    );
  }

 const participation = Array.isArray(session.participation)
  ? session.participation[0]
  : session.participation;

const course = Array.isArray(session.course)
  ? session.course[0]
  : session.course;

const summary: UndergraduateSessionSummary = {
  id: session.id,
  course_title: course?.course_title ?? "Course session",
  course_code: course?.course_code ?? "—",
  kind: session.kind,
  mode: session.mode,
  status: session.status,
  question_count:
    session.total_questions ?? session.question_count ?? 0,
  score_percent: session.score_percent ?? null,
  correct_count: session.correct_count ?? null,
  attempted_at: session.created_at,
  completed_at:
    participation?.completed_at ?? session.completed_at,
};
  const questionIds = Array.isArray(session.question_ids)
    ? session.question_ids
    : [];
  if (questionIds.length === 0) {
    const response: UndergraduateSessionDetail = {
      session: summary,
      review: [],
    };

    return NextResponse.json(response);
  }

  const { data: questions, error: questionsError } = await supabase
    .from("questions_courses")
    .select(
      `
      id,
      question_text,
      options,
      correct_option,
      explanation
    `
    )
    .in("id", questionIds);

  if (questionsError) {
    return NextResponse.json(
      { error: questionsError.message },
      { status: 500 },
    );
  }
const { data: answers, error: answersError } = await supabase
  .from("cbt_answers")
  .select("question_id, selected_option")
  .eq("session_id", sessionId)
  .eq("user_id", user.id);

if (answersError) {
  return NextResponse.json(
    { error: answersError.message },
    { status: 500 },
  );
}

const answerMap = new Map(
  (answers ?? []).map((answer) => [
    answer.question_id,
    answer,
  ]),
);

const questionMap = new Map(
  (questions ?? []).map((question) => [
    question.id,
    question,
  ]),
);

const review: AnalysisQuestionReview[] = questionIds
  .map((questionId, index) => {
    const question = questionMap.get(questionId);
    const answer = answerMap.get(questionId);

    const options = Array.isArray(question?.options)
      ? question.options.map((option, optionIndex) => {
          if (typeof option === "string") {
            return {
              id: String.fromCharCode(65 + optionIndex),
              text: option,
            };
          }

          return {
            id:
              option?.id ??
              String.fromCharCode(65 + optionIndex),
            text:
              option?.text ??
              option?.label ??
              option?.value ??
              "",
          };
        })
      : [];

    const selectedOption = answer?.selected_option ?? null;
    const correctOption = question?.correct_option ?? null;

    const isCorrect =
      selectedOption !== null &&
      correctOption !== null &&
      selectedOption === correctOption;

    return {
      question_id: questionId,
      position: index + 1,
      prompt: question?.question_text ?? "Question unavailable",
      options,
      selected_option: selectedOption,
      correct_option: correctOption,
      is_correct: selectedOption === null ? null : isCorrect,
      explanation: question?.explanation ?? null,
    };
  })
  .filter((item) => item.question_id);

  const response: UndergraduateSessionDetail = {
    session: summary,
    review,
  };

  return NextResponse.json(response);
}