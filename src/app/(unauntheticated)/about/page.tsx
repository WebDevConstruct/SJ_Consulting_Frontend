import type { Metadata } from "next";
import { CacSection } from "@/components/about/cac-section";
import { TutorSection } from "@/components/about/tutor-section";
import { PurposeSection } from "@/components/about/purpose-section";
import { DepartmentsCarousel } from "@/components/about/departments-carousel";

export const metadata: Metadata = {
  title: "About — SJ Consult",
  description:
    "Who runs SJ Consult, why it exists, and the five departments behind it.",
};

export default function AboutPage() {
  return (
    <>
      <CacSection />
      <TutorSection />
      <PurposeSection />
      <DepartmentsCarousel />
    </>
  );
}
