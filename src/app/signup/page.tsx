import type { Metadata } from "next";
import { SignUpForm } from "@/components/forms/sign-up-form";

export const metadata: Metadata = {
  title: "Create your account — SJ Consult",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
