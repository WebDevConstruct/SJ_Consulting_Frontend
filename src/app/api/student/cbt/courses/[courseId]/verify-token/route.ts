import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type AccountVerification = {
  current_college?: string | null;
  current_faculty?: string | null;
  current_department?: string | null;
  current_level?: string | null;
};

type CourseRow = {
  id: string;
  course_code: string | null;
  course_title: string | null;
  course_objective: string | null;
  college_name: string | null;
  price: number | null;
  currency: string | null;
  offering: {
    id: string;
    faculty_name: string | null;
    department_name: string | null;
    level: string | null;
  } | null;
  course_access:
    | {
        padlock: boolean;
      }[]
    | {
        padlock: boolean;
      }
    | null;
};

type MultiplayerRow = {
  id: string;
  course_id: string;
  title: string | null;
  starts_at: string | null;
  created_by: string | null;
  current_participant:
    | { status: string }[]
    | { status: string }
    | null;
};

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "You must be signed in." },
      { status: 401 },
    );
  }

  const verification = (user.user_metadata?.account_verification ??
    {}) as AccountVerification;

  const college = verification.current_college?.trim().toLowerCase();
  const faculty = verification.current_faculty?.trim().toLowerCase();
  const department = verification.current_department?.trim().toLowerCase();
  const level = verification.current_level?.trim().toLowerCase();

  if (!college || !faculty || !department || !level) {
    return NextResponse.json({
      student: null,
      courses: [],
      multiplayer_session: null,
    });
  }

  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select(
      `
      id,
      course_code,
      course_title,
      course_objective,
      college_name,
      price,
      currency,
      offering:course_offerings(
        id,
        faculty_name,
        department_name,
        level
      ),
      course_access(
        padlock
      )
    `,
    )
    .eq("status", "published")
    .ilike("college_name", college)
    .eq("course_offerings.is_active", true)
    .ilike("course_offerings.faculty_name", faculty)
    .ilike("course_offerings.department_name", department)
    .ilike("course_offerings.level", level)
    .returns<CourseRow[]>();

  if (coursesError) {
    return NextResponse.json(
      { error: coursesError.message },
      { status: 500 },
    );
  }

  const normalizedCourses = (courses ?? []).map((course) => {
    const access = Array.isArray(course.course_access)
      ? course.course_access[0]
      : course.course_access;

    const isLocked = access?.padlock !== false;

    return {
      id: course.id,
      offering_id: course.offering?.id ?? "",
      course_code: course.course_code ?? "",
      course_title: course.course_title ?? "",
      course_objective: course.course_objective ?? "",
      college_name: course.college_name ?? "",
      faculty_name: course.offering?.faculty_name ?? "",
      department_name: course.offering?.department_name ?? "",
      level: course.offering?.level ?? "",
      price: course.price,
      currency: course.currency ?? "NGN",
      access_status: isLocked ? "locked" : "unlocked",
    };
  });

  const courseIds = normalizedCourses.map((course) => course.id);

  let multiplayerSession = null;

  if (courseIds.length > 0) {
    const { data: multiplayerRows, error: multiplayerError } = await supabase
      .from("cbt_sessions")
      .select(
        `
        id,
        course_id,
        title,
        starts_at,
        created_by,
        current_participant:cbt_session_participants(
          status
        )
      `,
      )
      .eq("kind", "multiplayer")
      .in("course_id", courseIds)
      .eq("cbt_session_participants.user_id", user.id)
      .eq("cbt_session_participants.status", "invited")
      .limit(1)
      .returns<MultiplayerRow[]>();

    if (!multiplayerError && multiplayerRows?.[0]) {
      const row = multiplayerRows[0];

      const participant = Array.isArray(row.current_participant)
        ? row.current_participant[0]
        : row.current_participant;

      if (participant?.status === "invited") {
        const { data: host } = await supabase
          .from("users")
          .select("full_name")
          .eq("id", row.created_by ?? "")
          .maybeSingle();

        multiplayerSession = {
          id: row.id,
          course_id: row.course_id,
          title: row.title ?? "Multiplayer CBT session",
          host_name: host?.full_name ?? "Your host",
          starts_at: row.starts_at,
          invitation_status: "invited",
        };
      }
    }
  }

  return NextResponse.json({
    student: {
      id: user.id,
      full_name:
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        "Student",
      current_college: verification.current_college ?? null,
      current_faculty: verification.current_faculty ?? null,
      current_department: verification.current_department ?? null,
      current_level: verification.current_level ?? null,
    },
    courses: normalizedCourses,
    multiplayer_session: multiplayerSession,
  });
}