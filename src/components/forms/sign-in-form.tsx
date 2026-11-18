"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/forms/auth-layout";
import { TextField } from "@/components/forms/text-field";
import { PasswordField } from "@/components/forms/password-field";
import {createClient} from "@/lib/supabase/client";
import {useStatusToast} from "@components/ui/status-toast";

export function SignInForm() {

  //const EmailVerification = params?.get("isverified") === "true"

  const {showToast} = useStatusToast()
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [email, setEmail] = useState("");
const [password, setPassword] = useState<string>("")

useEffect(()=> {
   async function  checkVerification(){
   const supabase = createClient();
   const { data, }= await supabase.auth.getSession();
   if(data?.session?.user?.email_confirmed_at){
    router.push(`/dashboard/${data?.session?.user?.user_metadata?.user_type}`)
   }else{
    router.replace("/signin")
   }
   }
  void checkVerification()


},[])
const [identifier, setIdentifier] = useState<string>("");
//const [passowrd, setPassword] = useState<string>("")
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setSubmitting(true);

  const supabase = createClient();

  const identifierCredential = String(identifier ?? "").trim();
  const passwordCredential = String(password ?? "");

  if (!identifierCredential || !passwordCredential) {
    setSubmitting(false);
    setError("Please enter your username or email and password.");

    showToast({
      kind: "error",
      title: "Missing details",
      message: "Please enter your username or email and password.",
    });

    return;
  }

  try {
    // Resolve either a username or an email into a Supabase Auth email.
    const { data: emailData, error: emailError } = await supabase.rpc(
      "get_auth_email_by_identifier",
      {
        p_identifier: identifier,
      }
    );

    if (emailError) {
      throw emailError;
    }

    const authEmail = emailData;

    if (!authEmail) {
      setSubmitting(false);
      setError("Invalid username or password.");

      showToast({
        kind: "error",
        title: "Error Signing In",
        message: "Invalid username or password.",
      });

      return;
    }

    const { data, error: responseError } =
      await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      });

    setSubmitting(false);

    if (responseError) {
      setError(responseError.message || "Error signing in.");

      showToast({
        kind: "error",
        title: "Error Signing In",
        message:
          responseError.message || "An unexpected error has occurred.",
      });

      return;
    }

    if (data.user) {
      showToast({
        kind: "success",
        title: "Success",
        message: "Sign in successful.",
      });

      router.push("/dashboard");
    }
  } catch (error) {
    setSubmitting(false);
    setError("Error signing in.");

    showToast({
      kind: "error",
      title: "Error Signing In",
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error has occurred.",
    });
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
        onChange={(e)=> setIdentifier(e.target.value)}
          label="Username or email"
          name="identifier"
          type="text"
          autoComplete="username"
          placeholder="Enter your username or email"
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
