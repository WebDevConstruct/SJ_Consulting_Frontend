"use client";

import { useRouter } from "next/navigation";
import { BarChart3, Compass } from "lucide-react";
import { DeepNavHeader } from "@/components/dashboard/deep-nav-header";
import { GlossyCard } from "@/components/dashboard/glossy-card";
import { aspirantNavItems } from "@/lib/dashboard-nav";

const analysisNav = aspirantNavItems.find((i) => i.label === "Analysis")!;

export default function AnalysisHubPage() {
  const router = useRouter();

  return (
    <>
      <DeepNavHeader
        trail={[{ label: analysisNav.label, href: analysisNav.href }]}
      />
      <div className="px-6 py-10 md:px-12 md:py-14">
        <div className="h-[2px] w-12 bg-gold-metal" />
        <h1 className="mt-6 font-display text-[28px] leading-tight sm:text-[32px]">
          Analysis
        </h1>
        <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-current/65">
          Two ways to look at where you stand: a breakdown of every CBT round
          you&rsquo;ve practiced, and a forward-looking check of which UNILAG
          departments you&rsquo;d realistically be eligible for.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <GlossyCard
            icon={BarChart3}
            title="CPQA"
            description="CBT Practiced Questions Analysis — every attempt across solo and peer, subject, topic and combination tracks, filterable and charted."
            onClick={() => router.push("/dashboard/aspirant/analysis/cpqa")}
          />
          <GlossyCard
            icon={Compass}
            title="UAAE"
            description="Unilag Admission Analysis Engine — enter your scores and grades, and see which departments you'd be eligible for."
            onClick={() => router.push("/dashboard/aspirant/analysis/uaae")}
            delay={0.08}
          />
        </div>
      </div>
    </>
  );
}
