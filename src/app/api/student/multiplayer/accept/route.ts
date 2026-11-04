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

  const { session_id: sessionId } = await request.json();

  if (!sessionId) {
    return NextResponse.json(
      { error: "A multiplayer session is required." },
      { status: 400 },
    );
  }

  const { data: participant, error } = await supabase
    .from("cbt_session_participants")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("session_id", sessionId)
    .eq("user_id", user.id)
    .eq("status", "invited")
    .select("id, session_id, user_id, status")
    .single();

  if (error || !participant) {
    return NextResponse.json(
      {
        error:
          error?.message ??
          "You do not have a pending invitation for this session.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ participant }, { status: 200 });
}