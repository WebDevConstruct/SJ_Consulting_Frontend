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
  const combination = subjectCombinations.find((c) => c.slug === slug);
  const [openSubject, setOpenSubject] = useState<string | null>(
    combination?.subjects[0] ?? null
  );

  if (!combination) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-paper dark:bg-ink">
      <DeepNavHeader
        trail={[
          { label: "Study", href: "/dashboard/aspirant/study" },
          { label: `${combination.label} materials`, href: `/dashboard/aspirant/study/materials/${slug}` },
        ]}
      />

      <div className="mx-auto max-w-2xl px-6 py-10 md:px-10">
        <p className="text-[14px] leading-relaxed text-current/65">
          Verified topic breakdowns for each subject in your{" "}
          {combination.label.toLowerCase()} combination.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {combination.subjects.map((subject, index) => {
            const open = openSubject === subject;
            const topics = getTopicsForSubject(subject);
            return (
              <motion.div
                key={subject}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="overflow-hidden rounded-sm border border-paper-line dark:border-ink-line"
              >
                <button
                  type="button"
                  onClick={() => setOpenSubject(open ? null : subject)}
                  className="focus-gold flex w-full items-center justify-between gap-3 bg-paper-soft px-5 py-4 text-left dark:bg-ink-surface"
                >
                  <span className="flex items-center gap-3">
                    <BookOpen
                      className="h-[18px] w-[18px] text-gold-500 dark:text-gold-300"
                      strokeWidth={1.7}
                    />
                    <span className="text-[14.5px] font-medium">{subject}</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-current/50 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open ? (
                  <div className="flex flex-col divide-y divide-paper-line border-t border-paper-line dark:divide-ink-line dark:border-ink-line">
                    {topics.map((topic) => (
                      <div key={topic.id} className="px-5 py-4">
                        <div className="text-[14px] font-medium">
                          {topic.title}
                        </div>
                        <p className="mt-1 text-[13px] leading-relaxed text-current/55">
                          {topic.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
