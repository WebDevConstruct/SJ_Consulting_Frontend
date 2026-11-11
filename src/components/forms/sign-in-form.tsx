"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/forms/auth-layout";
import { TextField } from "@/components/forms/text-field";
import { PasswordField } from "@/components/forms/password-field";
import { createClient } from "@/lib/supabase/client";
import { useStatusToast } from "@components/ui/status-toast";
import { login } from "@/lib/api";

export function SignInForm() {
  const { showToast } = useStatusToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await login({
        identifier: String(email ?? "").trim(),
        password: String(password ?? ""),
      });

      setSubmitting(false);

      if (result?.user) {
        showToast({
          kind: "success",
          title: "Success",
          message: "Sign in successful",
          statusCode: 200,
        });
        router.push("/dashboard");
      }
    } catch (err: any) {
      setSubmitting(false);
      const msg = err?.message || "Invalid username/email or password.";
      showToast({
        kind: "error",
        title: "Error Signing In",
        message: msg,
      });
      setError(msg);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Use the username or email you signed up with."
      footerText="New to SJ Consult?"
      footerLinkHref="/signup"
      footerLinkLabel="Create an account"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* {error ? (
          <InlineAlert tone="error">
            {error}{" "}
            {needsVerification ? (
              <Link
                href="/signup"
                className="focus-gold font-medium underline underline-offset-2"
              >
                Verify it now
              </Link>
            ) : null}
          </InlineAlert>
        ) : null} */}

        <TextField
        value={email}
        onChange={(e)=> setEmail(e.target.value)}
          label="Username or email"
          name="identifier"
          type="text"
          autoComplete="username"
          placeholder="you@example.com"
          required
        />

        <div>
          <PasswordField
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
            label="Password"
            name="password"
            autoComplete="current-password"
            placeholder="Your password"
            required
          />
          <div className="mt-2 text-right">
            <Link
              href="#"
              className="focus-gold text-[13px] text-current/55 hover:text-gold-500"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="focus-gold mt-1 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3.5 text-[14.5px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
