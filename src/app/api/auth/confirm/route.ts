import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "email" | null;

  // Only allow internal relative paths.
  let next = searchParams.get("next") ?? "/signin";

  if (!next.startsWith("/")) {
    next = "/signin";
  }

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?reason=missing-token`,
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?reason=${encodeURIComponent(
        error.message,
      )}`,
    );
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnvironment = process.env.NODE_ENV === "development";

  if (isLocalEnvironment) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  if (forwardedHost) {
    return NextResponse.redirect(
      `https://${forwardedHost}${next}`,
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}