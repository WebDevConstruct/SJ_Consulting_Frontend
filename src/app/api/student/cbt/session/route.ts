import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
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

  const { kind, course_id: courseId, mode } = await request.json();

  if (!["solo", "peer"].includes(kind)) {
    return NextResponse.json(
      { error: "Only solo and peer sessions can be started." },
      { status: 400 },
    );
  }

  if (!courseId) {
    return NextResponse.json(
      { error: "A course is required." },
      { status: 400 },
    );
  }

  const { data: access } = await supabase
    .from("course_access")
    .select("padlock")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (access?.padlock !== false) {
    return NextResponse.json(
      { error: "This course is still locked." },
      { status: 403 },
    );
  }

  const { data: session, error } = await supabase
    .from("cbt_sessions")
    .insert({
      kind,
      mode: kind === "peer" ? "exam" : mode === "exam" ? "exam" : "practice",
      track_type : "courses",
      course_id: courseId,
      subject_id: null,
      created_by: user.id,
      status: kind === "peer" ? "pending" : "ready",
    })
    .select("id, kind, course_id, status")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "Unable to create this session." },
      { status: 500 },
    );
  }

  return NextResponse.json({ session }, { status: 201 });
}