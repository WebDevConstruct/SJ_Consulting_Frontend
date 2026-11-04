import {
  getDepartmentsByFaculty,
  type DepartmentRequirement,
} from "@/lib/uaae/admission-data";
import type { EligibleDepartment, UaaeInput, UaaeResult } from "@/lib/analysis/types";

export const OLEVEL_GRADES = [
  { code: "A1", label: "A1 — Excellent (75–100%)", points: 4.0 },
  { code: "B2", label: "B2 — Very Good (70–74%)", points: 3.6 },
  { code: "B3", label: "B3 — Good (65–69%)", points: 3.2 },
  { code: "C4", label: "C4 — Credit (60–64%)", points: 2.8 },
  { code: "C5", label: "C5 — Credit (55–59%)", points: 2.4 },
  { code: "C6", label: "C6 — Credit (50–54%)", points: 2.0},
  { code: "D7", label: "D7 — Pass (45–49%)", points: 0 },
  { code: "E8", label: "E8 — Pass (40–44%)", points: 0 },
  { code: "F9", label: "F9 — Fail (0–39%)", points: 0 },
] as const;

function gradePoints(code: string): number {
  return OLEVEL_GRADES.find((g) => g.code === code)?.points ?? 9;
}

/**
 * Picks which published cutoff applies: the selected catchment state's
 * figure when the department publishes one for it, otherwise the general
 * Merit cutoff. A department with no Merit figure at all (NIL in the
 * source document) isn't admitting via UTME merit this session.
 */
function resolveCutoff(
  dept: DepartmentRequirement,
  catchmentState: string
): { cutoff: number | null; source: "merit" | "catchment" | "unavailable" } {
  if (catchmentState !== "None") {
    const key = catchmentState.toLowerCase() as keyof typeof dept.cutoffs;
    const catchmentValue = dept.cutoffs[key];
    if (typeof catchmentValue === "number") {
      return { cutoff: catchmentValue, source: "catchment" };
    }
  }
  if (typeof dept.cutoffs.merit === "number") {
    return { cutoff: dept.cutoffs.merit, source: "merit" };
  }
  return { cutoff: null, source: "unavailable" };
}

/**
 * Simplified eligibility: a department is treated as a candidate match when
 * every one of the user's non-English UTME subjects appears in that
 * department's real subject pool (see admission-data.ts). This is a
 * deliberately simple stand-in for UNILAG's actual AND/OR subject logic,
 * which the backend will enforce precisely once connected.
 */
function subjectsMatch(dept: DepartmentRequirement, utmeSubjects: string[]): boolean {
  const others = utmeSubjects.filter((s) => s !== "English Language");
  if (others.length === 0) return false;
  return others.every((s) => dept.subjectPool.includes(s));
}

/**
 * UNILAG's published weighting: UTME 50%, Post-UTME 30%, O'level 20%.
 */
export function calculateAggregate(input: UaaeInput): { aggregate: number; oLevelPoints: number } {
  const sumPoints = input.oLevel.reduce((sum, e) => sum + gradePoints(e.grade), 0);
  // 5 subjects, best possible sum = 5 (all A1), worst = 45 (all F9).
  const maxPoints = input.oLevel.length * 9;
  const minPoints = input.oLevel.length * 1;
  //const range = Math.max(1, maxPoints - minPoints);
 // const oLevelComponent = Math.max(0, Math.min(20, (20 * (maxPoints - sumPoints)) / range));

  const utmeComponent = (input.utmeScore / 400) * 50;
  const postUtmeComponent = input.postUtme;

  const aggregate = Math.round(utmeComponent + postUtmeComponent + sumPoints);
  return { aggregate, oLevelPoints: sumPoints };
}

export function runUaae(input: UaaeInput): UaaeResult {
  const { aggregate, oLevelPoints } = calculateAggregate(input);
  const pool = getDepartmentsByFaculty(input.facultyCheck as "All");

  const departments: EligibleDepartment[] = pool
    .filter((dept) => subjectsMatch(dept, input.utmeSubjects))
    .map((dept) => {
      const { cutoff, source } = resolveCutoff(dept, input.catchmentState);
      return {
        faculty: dept.faculty,
        department: dept.department,
        cutoff,
        cutoffSource: source,
        eligible: cutoff !== null && aggregate >= cutoff,
      };
    })
    .sort((a, b) => {
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      return (b.cutoff ?? -1) - (a.cutoff ?? -1);
    });

  return { aggregate, oLevelPoints, input, departments, computedAt: Date.now() };
}

const COMMON_OLEVEL_FALLBACKS = [
  "Civic Education",
  "Further Mathematics",
  "Agricultural Science",
  "Economics",
  "Geography",
];

/**
 * O'level subjects are derived from the chosen UTME combination rather than
 * typed freehand, so the two can never drift apart: English Language and
 * Mathematics are near-universal UNILAG requirements, so they're pinned in,
 * then the UTME electives fill the remaining slots (padded with common
 * O'level subjects if the combination alone doesn't reach five).
 */
export function deriveOLevelSubjects(utmeSubjects: string[], count = 5): string[] {
  const base = Array.from(new Set(["English Language", "Mathematics", ...utmeSubjects]));
  let i = 0;
  while (base.length < count && i < COMMON_OLEVEL_FALLBACKS.length) {
    const candidate = COMMON_OLEVEL_FALLBACKS[i];
    if (!base.includes(candidate)) base.push(candidate);
    i++;
  }
  return base.slice(0, count);
}
