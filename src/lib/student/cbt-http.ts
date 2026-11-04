import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export class StudentHttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "StudentHttpError";
  }
}

export function studentJsonResponse(
  body: unknown,
  status = 200,
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export function handleStudentError(error: unknown) {
  if (error instanceof StudentHttpError) {
    return studentJsonResponse(
      { error: error.message },
      error.status,
    );
  }

  console.error("Student CBT API failed:", error);

  return studentJsonResponse(
    {
      error:
        "Unable to complete your CBT request. Please try again.",
    },
    500,
  );
}

export function getPrivilegedClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new StudentHttpError(
      500,
      "Server configuration is missing Supabase credentials.",
    );
  }

  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}