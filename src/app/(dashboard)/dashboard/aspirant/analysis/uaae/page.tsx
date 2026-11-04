"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DeepNavHeader } from "@/components/dashboard/deep-nav-header";
import { OLevelSubjectRow } from "@/components/analysis/olevel-subject-row";
import {
  faculties,
  allUtmeSubjects,
  CATCHMENT_STATES,
} from "@/lib/uaae/admission-data";
import { getAccountUtmeSubjects } from "@/lib/uaae/account-subjects-store";
import { deriveOLevelSubjects, runUaae } from "@/lib/analysis/grading";
import { saveUaaeResult } from "@/lib/analysis/uaae-result-store";
import type { UaaeMode } from "@/lib/analysis/types";

const NO_SYSTEM_SUBJECT_SLOTS = 3; // English Language is fixed as the 4th

const nonEnglishSubjects = allUtmeSubjects.filter((s) => s !== "English Language");
const defaultCustomSubjects = nonEnglishSubjects.slice(0, NO_SYSTEM_SUBJECT_SLOTS);

export default function UaaePage() {
  const router = useRouter();

  const [mode, setMode] = useState<UaaeMode>("system-data");
  const [accountSubjects, setAccountSubjects] = useState<string[]>([]);
  const [customSubjects, setCustomSubjects] = useState<string[]>(defaultCustomSubjects);
  const [utmeScore, setUtmeScore] = useState(180);
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [postUtme, setPostUtme] = useState(20);
  const [facultyCheck, setFacultyCheck] = useState<string>("All");
  const [catchmentState, setCatchmentState] = useState<string>("None");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAccountSubjects(getAccountUtmeSubjects());
  }, []);

  const utmeSubjects = useMemo(
    () =>
      mode === "system-data"
        ? accountSubjects
        : ["English Language", ...customSubjects],
    [mode, accountSubjects, customSubjects]
  );

  const oLevelSubjects = useMemo(
    () => deriveOLevelSubjects(utmeSubjects),
    [utmeSubjects]
  );

  const handleSubmit = () => {
    const oLevel = oLevelSubjects.map((subject) => ({
      subject,
      grade: grades[subject] ?? "C6",
    }));

    const result = runUaae({
      mode,
      utmeSubjects,
      utmeScore,
      oLevel,
      postUtme: Math.min(postUtme, 30),
      facultyCheck,
      catchmentState,
    });
    saveUaaeResult(result);
    router.push("/dashboard/aspirant/analysis/uaae/results");
  };

  return (
    <>
      <DeepNavHeader
        trail={[
          { label: "Analysis", href: "/dashboard/aspirant/analysis" },
          { label: "UAAE", href: "/dashboard/aspirant/analysis/uaae" },
        ]}
      />
      <div className="px-6 py-10 md:px-12 md:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-lg text-[14.5px] leading-relaxed text-current/65">
            Enter your scores and grades to see which UNILAG departments
            you&rsquo;d realistically qualify for, based on the published
            2026/2027 merit cut-offs.
          </p>

          <div
            role="radiogroup"
            aria-label="Data mode"
            className="flex flex-shrink-0 gap-1 rounded-sm border border-paper-line bg-paper-soft p-1 dark:border-ink-line dark:bg-ink-surface"
          >
            {(
              [
                { value: "system-data", label: "System-data" },
                { value: "no-system-data", label: "Before JAMB" },
              ] as { value: UaaeMode; label: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={mode === opt.value}
                onClick={() => setMode(opt.value)}
                className={`focus-gold rounded-sm px-3.5 py-2 text-[12.5px] font-medium transition-colors ${
                  mode === opt.value
                    ? "bg-gold-metal-soft text-ink"
                    : "text-current/60 hover:text-current"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject combination */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <label className="text-[13px] font-medium text-current/70">
              {mode === "system-data"
                ? "Your subject combination (on file)"
                : "Try a different combination"}
            </label>

            {mode === "system-data" ? (
              <textarea
                readOnly
                value={accountSubjects.join("\n")}
                rows={4}
                className="focus-gold mt-1.5 w-full resize-none rounded-sm border border-paper-line bg-paper-soft px-4 py-3 text-[14px] text-current/70 dark:border-ink-line dark:bg-ink-surface"
              />
            ) : (
              <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="flex items-center rounded-sm border border-paper-line bg-paper-soft px-4 py-3 text-[13.5px] text-current/50 dark:border-ink-line dark:bg-ink-surface">
                  English Language (fixed)
                </div>
                {customSubjects.map((subject, i) => (
                  <select
                    key={i}
                    value={subject}
                    onChange={(e) =>
                      setCustomSubjects((prev) =>
                        prev.map((s, idx) => (idx === i ? e.target.value : s))
                      )
                    }
                    className="focus-gold rounded-sm border border-paper-line bg-paper px-3 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-[13.5px]"
                  >
                    {nonEnglishSubjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            )}
          </div>

          <div className="md:w-48">
            <label
              htmlFor="utme-score"
              className="text-[13px] font-medium text-current/70"
            >
              JAMB total score
            </label>
            <input
              id="utme-score"
              type="number"
              min={0}
              max={400}
              value={utmeScore}
              onChange={(e) => setUtmeScore(Number(e.target.value))}
              className="focus-gold mt-1.5 w-full rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-[14px]"
            />
          </div>
        </div>

        {/* O'level grades — subjects are derived from the combination above, read-only */}
        <div className="mt-8">
          <label className="text-[13px] font-medium text-current/70">
            O&rsquo;level results (WAEC or NECO)
          </label>
          <p className="mt-1 text-[12px] text-current/45">
            Subjects here follow your UTME combination automatically — only
            the grade is yours to set.
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {oLevelSubjects.map((subject, i) => (
              <OLevelSubjectRow
                key={subject}
                index={i}
                subject={subject}
                grade={grades[subject] ?? "C6"}
                onGradeChange={(grade) =>
                  setGrades((prev) => ({ ...prev, [subject]: grade }))
                }
              />
            ))}
          </div>
        </div>

        {/* Post UTME + Faculty check + Catchment state */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="post-utme"
              className="text-[13px] font-medium text-current/70"
            >
              Post-UTME score (out of 30)
            </label>
            <input
              id="post-utme"
              type="number"
              min={0}
              max={30}
              value={postUtme}
              onChange={(e) =>
                setPostUtme(Math.max(0, Math.min(30, Number(e.target.value))))
              }
              className="focus-gold mt-1.5 w-full rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-[14px]"
            />
          </div>
          <div>
            <label
              htmlFor="faculty-check"
              className="text-[13px] font-medium text-current/70"
            >
              Faculty check
            </label>
            <select
              id="faculty-check"
              value={facultyCheck}
              onChange={(e) => setFacultyCheck(e.target.value)}
              className="focus-gold mt-1.5 w-full rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-[14px]"
            >
              <option value="All">All faculties</option>
              {faculties.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="catchment-state"
              className="text-[13px] font-medium text-current/70"
            >
              Catchment state
            </label>
            <select
              id="catchment-state"
              value={catchmentState}
              onChange={(e) => setCatchmentState(e.target.value)}
              className="focus-gold mt-1.5 w-full rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-[14px]"
            >
              <option value="None">None (use Merit cut-off)</option>
              {CATCHMENT_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="focus-gold mt-9 w-full rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3.5 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01] sm:w-auto"
        >
          Check eligibility
        </button>

        <p className="mt-4 max-w-lg text-[12px] leading-relaxed text-current/40">
          Cut-offs are UNILAG&rsquo;s published 2026/2027 UTME Merit figures,
          using your catchment state&rsquo;s figure where one is published
          and falling back to Merit otherwise. Subject combinations come
          from UNILAG&rsquo;s 2025/2026 admission requirements; some newer
          programmes don&rsquo;t have a direct match in that document, so
          their subjects are inferred from the closest related department.
        </p>
      </div>
    </>
  );
}
