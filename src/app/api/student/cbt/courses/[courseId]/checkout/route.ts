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

  const { course_id: courseId } = await request.json();

  if (!courseId) {
    return NextResponse.json(
      { error: "A course is required." },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("course_access")
    .upsert(
      {
        user_id: user.id,
        course_id: courseId,
        padlock: false,
      },
      {
        onConflict: "user_id,course_id",
      },
    );

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "Checkout failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Payment successful. This course is now unlocked.",
  });
}