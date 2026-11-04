"use client";

import Link from "next/link";
import { CheckCircle2, MinusCircle, XCircle } from "lucide-react";
import { DeepNavHeader } from "@/components/dashboard/deep-nav-header";
import { useUaaeResult } from "@/lib/analysis/uaae-result-store";

function cutoffLabel(
  cutoff: number | null,
  source: "merit" | "catchment" | "unavailable",
  catchmentState: string
) {
  if (cutoff === null) return "Not offered this session";
  if (source === "catchment") return `${cutoff} (${catchmentState} catchment)`;
  return `${cutoff} (Merit)`;
}

export default function UaaeResultsPage() {
  const { result, loaded } = useUaaeResult();

  return (
    <>
      <DeepNavHeader
        trail={[
          { label: "Analysis", href: "/dashboard/aspirant/analysis" },
          { label: "UAAE", href: "/dashboard/aspirant/analysis/uaae" },
          { label: "Results", href: "/dashboard/aspirant/analysis/uaae/results" },
        ]}
      />
      <div className="px-6 py-10 md:px-12 md:py-14">
        {!loaded ? (
          <p className="text-[13.5px] text-current/45">Loading…</p>
        ) : !result ? (
          <div className="max-w-md">
            <p className="text-[14.5px] text-current/65">
              No UAAE run found yet for this session.
            </p>
            <Link
              href="/dashboard/aspirant/analysis/uaae"
              className="focus-gold mt-4 inline-block rounded-sm border border-gold-400 bg-gold-metal-soft px-5 py-2.5 text-[13.5px] font-semibold text-ink shadow-gold"
            >
              Run the UAAE
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-start gap-6 rounded-sm border border-gold-400/40 bg-gold-400/5 p-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[13px] text-current/55">
                  Aggregate (50% UTME + 30% Post-UTME + 20% O&rsquo;level) &middot;{" "}
                  {result.input.mode === "system-data" ? "your account combination" : "simulated combination"}
                </div>
                <div className="mt-1 font-display text-[40px] leading-none text-gold-600 dark:text-gold-300">
                  {result.aggregate}
                </div>
              </div>
              <dl className="grid grid-cols-3 gap-6 text-[13px]">
                <div>
                  <dt className="text-current/50">UTME</dt>
                  <dd className="mt-0.5 font-medium">{result.input.utmeScore}/400</dd>
                </div>
                <div>
                  <dt className="text-current/50">Post-UTME</dt>
                  <dd className="mt-0.5 font-medium">{result.input.postUtme}/30</dd>
                </div>
                <div>
                  <dt className="text-current/50">O&rsquo;level pts</dt>
                  <dd className="mt-0.5 font-medium">{result.oLevelPoints}</dd>
                </div>
              </dl>
            </div>

            <p className="mt-6 text-[14.5px] text-current/65">
              {result.departments.filter((d) => d.eligible).length} of{" "}
              {result.departments.length} matching departments&nbsp;
              {result.input.facultyCheck === "All"
                ? "across all faculties"
                : `in ${result.input.facultyCheck}`}
              {result.input.catchmentState !== "None"
                ? ` · ${result.input.catchmentState} catchment applied where published`
                : ""}
              .
            </p>

            <div className="mt-5 flex flex-col divide-y divide-paper-line overflow-hidden rounded-sm border border-paper-line dark:divide-ink-line dark:border-ink-line">
              {result.departments.length === 0 ? (
                <div className="px-5 py-6 text-[13.5px] text-current/50">
                  No departments in this faculty match the subject
                  combination entered. Try &ldquo;All faculties&rdquo; or a
                  different combination.
                </div>
              ) : (
                result.departments.map((d) => (
                  <div
                    key={`${d.faculty}-${d.department}`}
                    className="flex items-center justify-between gap-4 bg-paper px-5 py-3.5 dark:bg-ink"
                  >
                    <div className="flex items-center gap-3">
                      {d.cutoff === null ? (
                        <MinusCircle className="h-[18px] w-[18px] flex-shrink-0 text-current/25" strokeWidth={1.8} />
                      ) : d.eligible ? (
                        <CheckCircle2
                          className="h-[18px] w-[18px] flex-shrink-0 text-gold-500 dark:text-gold-300"
                          strokeWidth={1.8}
                        />
                      ) : (
                        <XCircle className="h-[18px] w-[18px] flex-shrink-0 text-current/30" strokeWidth={1.8} />
                      )}
                      <div>
                        <div className="text-[14px] font-medium">{d.department}</div>
                        <div className="text-[12.5px] text-current/50">{d.faculty}</div>
                      </div>
                    </div>
                    <div className="text-right text-[12.5px] text-current/45">
                      {cutoffLabel(d.cutoff, d.cutoffSource, result.input.catchmentState)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
