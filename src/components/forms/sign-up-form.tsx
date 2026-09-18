"use client";

import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/forms/auth-layout";
import { TextField } from "@/components/forms/text-field";
import { SelectField } from "@/components/forms/select-field";
import { SegmentedControl } from "@/components/forms/segmented-control";

type UserProfile = "aspirant" | "undergraduate";

const YEAR_OPTIONS = [
  { value: "1", label: "Year 1" },
  { value: "2", label: "Year 2" },
  { value: "3", label: "Year 3" },
  { value: "4", label: "Year 4" },
  { value: "5", label: "Year 5" },
];

export function SignUpForm() {
  const [profile, setProfile] = useState<UserProfile>("aspirant");
  const [writtenJamb, setWrittenJamb] = useState<"yes" | "no">("no");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Wiring to api/v1/signup, api/v1/send and api/v1/verify_email
    // happens once the authenticated build phase begins.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="This is a preview of the confirmation state — account creation isn't wired to the backend yet."
        footerText="Already have an account?"
        footerLinkHref="/signin"
        footerLinkLabel="Sign in"
      >
        <p className="text-[14.5px] leading-relaxed text-current/65">
          We&rsquo;ll send a verification code to the email you enter here
          once sign-up is connected to the API.
        </p>
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />

        <TextField
          label="Password"
          name="password"
          type="password"
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

        {profile === "undergraduate" ? (
          <SelectField
            label="Current year"
            name="year"
            options={YEAR_OPTIONS}
            defaultValue="1"
          />
        ) : (
          <SegmentedControl
            label="Have you written JAMB before?"
            name="written_jamb"
            value={writtenJamb}
            onChange={(value) => setWrittenJamb(value as "yes" | "no")}
            options={[
              { value: "no", label: "Not yet" },
              { value: "yes", label: "Yes" },
            ]}
          />
        )}

        <button
          type="submit"
          className="focus-gold mt-2 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3.5 text-[14.5px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01]"
        >
          Create account
        </button>
      </form>
    </AuthLayout>
  );
}
