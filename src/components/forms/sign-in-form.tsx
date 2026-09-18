"use client";

import { type FormEvent } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/forms/auth-layout";
import { TextField } from "@/components/forms/text-field";

export function SignInForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Wiring to api/v1/signin happens once the authenticated build
    // phase begins; the backend allocates the session cookie from there.
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
        <TextField
          label="Username or email"
          name="identifier"
          type="text"
          autoComplete="username"
          placeholder="you@example.com"
          required
        />

        <div>
          <TextField
            label="Password"
            name="password"
            type="password"
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
          className="focus-gold mt-1 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3.5 text-[14.5px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01]"
        >
          Sign in
        </button>
      </form>
    </AuthLayout>
  );
}
