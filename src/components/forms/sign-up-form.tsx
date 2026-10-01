"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AuthLayout } from "@/components/forms/auth-layout";
import { TextField } from "@/components/forms/text-field";
import { PasswordField } from "@/components/forms/password-field";
import { SelectField } from "@/components/forms/select-field";
import { SegmentedControl } from "@/components/forms/segmented-control";
import { OtpInput } from "@/components/forms/otp-input";
import { InlineAlert } from "@/components/forms/inline-alert";
import { mockApi } from "@/lib/auth/mock-api";
import type { UserProfile } from "@/lib/auth/types";
import {mockDb} from "@lib/auth"
type Step = "details" | "verify";

const YEAR_OPTIONS = [
  { value: "1", label: "Year 1" },
  { value: "2", label: "Year 2" },
  { value: "3", label: "Year 3" },
  { value: "4", label: "Year 4" },
  { value: "5", label: "Year 5" },
];

export function SignUpForm() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("details");
  const [profile, setProfile] = useState<UserProfile>("aspirant");
  const [writtenJamb, setWrittenJamb] = useState<"yes" | "no">("no");
  const [email, setEmail] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [otp, setOtp] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDetailsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      age: Number(form.get("age")),
      username: String(form.get("username") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      password: String(form.get("password") ?? ""),
      userProfile: profile,
      accountVerification: null,
    };
  console.log("Payload", payload)

    const result = await mockApi.signUp(payload);
    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    const sendResult = await mockApi.sendVerificationCode(payload.email);
    setSubmitting(false);

    if (!sendResult.success) {
      setError(
        sendResult.error ?? "Account created, but the code couldn't be sent."
      );
      return;
    }

    setEmail(payload.email);
    setDevOtp(sendResult.data?.devOtp ?? null);
    setStep("verify");
  };


 //   console.log("Applicants Data", mockDb.findByUsername("Oladimeji129"));
  const handleVerifySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError("Enter the full 6-digit code.");
      return;
    }

    setSubmitting(true);
    const result = await mockApi.verifyEmail(email, otp);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "That code didn't work. Please try again.");
      return;
    }

    router.push("/dashboard");
  };

  const handleResend = async () => {
    setError(null);
    setResending(true);
    const result = await mockApi.sendVerificationCode(email);
    setResending(false);

    if (!result.success) {
      setError(result.error ?? "Couldn't resend the code. Please try again.");
      return;
    }
    setDevOtp(result.data?.devOtp ?? null);
  };

  if (step === "verify") {
    return (
      <AuthLayout
        title="Verify your email"
        subtitle={`Enter the 6-digit code we sent to ${email}.`}
        footerText="Wrong email?"
        footerLinkHref="/signup"
        footerLinkLabel="Start over"
      >
        <AnimatePresence mode="wait">
          <motion.form
            key="verify"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleVerifySubmit}
            className="flex flex-col gap-5"
          >
            {devOtp ? (
              <InlineAlert tone="info">
                Development preview only &mdash; no email is actually sent
                here. Your code is <strong>{devOtp}</strong>.
              </InlineAlert>
            ) : null}
            {error ? <InlineAlert tone="error">{error}</InlineAlert> : null}

            <OtpInput value={otp} onChange={setOtp} disabled={submitting} />

            <button
              type="submit"
              disabled={submitting}
              className="focus-gold mt-2 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3.5 text-[14.5px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {submitting ? "Verifying…" : "Verify & continue"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="focus-gold text-center text-[13.5px] text-current/55 hover:text-gold-500 disabled:opacity-60"
            >
              {resending ? "Resending…" : "Resend code"}
            </button>
          </motion.form>
        </AnimatePresence>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="A few details so we can personalize your dashboard from day one."
      footerText="Already have an account?"
      footerLinkHref="/signin"
      footerLinkLabel="Sign in"
    >
      <AnimatePresence mode="wait">
        <motion.form
          key="details"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleDetailsSubmit}
          className="flex flex-col gap-5"
        >
          {error ? <InlineAlert tone="error">{error}</InlineAlert> : null}

          <TextField
            label="Full name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="e.g. Feranmi Adebayo"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Age"
              name="age"
              type="number"
              min={10}
              max={100}
              placeholder="18"
              required
            />
            <TextField
              label="Phone number"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="0801 234 5678"
              required
            />
          </div>

          <TextField
            label="Username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="feranmi_a"
            pattern="[a-zA-Z0-9_]{3,20}"
            hint="3–20 characters: letters, numbers and underscores only."
            required
          />

          <TextField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />

          <PasswordField
            label="Password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
            minLength={8}
          />

          <SegmentedControl
            label="I am a"
            name="user_profile"
            value={profile}
            onChange={(value) => setProfile(value as UserProfile)}
            options={[
              { value: "aspirant", label: "JAMB aspirant" },
              { value: "undergraduate", label: "UNILAG undergraduate" },
            ]}
          />

         

          <button
            type="submit"
            disabled={submitting}
            className="focus-gold mt-2 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3.5 text-[14.5px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </motion.form>
      </AnimatePresence>
    </AuthLayout>
  );
}
