import { NextResponse } from "next/server";

import {createClient} from "@/lib/supabase/server";
import type {
  SessionKind,
  UndergraduateAnalysisResponse,
  UndergraduateSessionSummary,
} from "../../../(dashboard)/dashboard/undergraduate/analysis/types/analysis-types";

const PASS_SCORE = 50;

export async function GET(request: Request) {
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

  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const kind = url.searchParams.get("kind");
  const query = url.searchParams.get("q")?.trim().toLowerCase() ?? "";

 let queryBuilder = supabase
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
  .eq("participation.user_id", user.id)
  .eq("participation.status", "completed")
  .order("completed_at", { ascending: false, nullsFirst: false });

  if (kind && kind !== "all") {
    queryBuilder = queryBuilder.eq("kind", kind);
  }

  if (from) {
    queryBuilder = queryBuilder.gte("created_at", from);
  }

  if (to) {
    queryBuilder = queryBuilder.lte("created_at", `${to}T23:59:59.999Z`);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

 const sessions: UndergraduateSessionSummary[] = (data ?? [])
  .map((row) => {
    const participation = Array.isArray(row.participation)
      ? row.participation[0]
      : row.participation;

    const course = Array.isArray(row.course)
      ? row.course[0]
      : row.course;

    const questionCount =
      row.total_questions ?? row.question_count ?? 0;

    return {
      id: row.id,
      course_title: course?.course_title ?? "Course session",
      course_code: course?.course_code ?? "—",
      kind: row.kind as SessionKind,
      mode: row.mode,
      status: row.status,
      question_count: questionCount,
      score_percent: row.score_percent ?? null,
      correct_count: row.correct_count ?? null,
      attempted_at: row.created_at,
      completed_at:
        participation?.completed_at ?? row.completed_at,
    };
  })
  .filter((session) => {
    if (!query) return true;

    return (
      session.course_title.toLowerCase().includes(query) ||
      session.course_code.toLowerCase().includes(query) ||
      session.kind.toLowerCase().includes(query) ||
      session.mode.toLowerCase().includes(query)
    );
  });

  const completedScores = sessions
    .map((session) => session.score_percent)
    .filter((score): score is number => score !== null);

  const wins = completedScores.filter((score) => score >= PASS_SCORE).length;
  const losses = completedScores.filter((score) => score < PASS_SCORE).length;

  const averageScore =
    completedScores.length > 0
      ? Number(
          (
            completedScores.reduce(
              (total, score) => total + score,
              0,
            ) / completedScores.length
          ).toFixed(1),
        )
      : 0;

  const bestScore =
    completedScores.length > 0 ? Math.max(...completedScores) : 0;

  const chart = sessions
    .filter((session) => session.score_percent !== null)
    .slice()
    .reverse()
    .map((session) => ({
      date: new Date(session.completed_at ?? session.attempted_at).toLocaleDateString(
        "en-NG",
        {
          month: "short",
          day: "numeric",
        },
      ),
      score_percent: session.score_percent ?? 0,
    }));

  const response: UndergraduateAnalysisResponse = {
    sessions,
    summary: {
      total_sessions: sessions.length,
      wins,
      losses,
      average_score: averageScore,
      best_score: bestScore,
    },
    chart,
  };

  return NextResponse.json(response);
}