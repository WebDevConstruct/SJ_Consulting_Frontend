import type { Metadata } from "next";
import { SignInForm } from "@/components/forms/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in — SJ Consult",
};

export default function SignInPage() {
  return <SignInForm />;
}
