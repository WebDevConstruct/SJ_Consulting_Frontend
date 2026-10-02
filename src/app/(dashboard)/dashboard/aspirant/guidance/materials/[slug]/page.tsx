"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronDown } from "lucide-react";
import { notFound } from "next/navigation";
import { DeepNavHeader } from "@/components/study/deep-nav-header";
import { subjectCombinations, getTopicsForSubject } from "@/lib/study/mock-data";

export default function MaterialsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  
 

  return (
    <div className="min-h-screen bg-paper dark:bg-ink">
      <DeepNavHeader
        trail={[
          { label: "Study", href: "/dashboard/aspirant/study" },
         // { label: `${combination.label} materials`, href: `/dashboard/aspirant/study/materials/${slug}` },
        ]}
      />

     
      </div>

  );
}
