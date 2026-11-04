export interface RecentAttempt {
  id: string;
  subject: string;
  track_type: "subject" | "topic" | "combination";
  mode: "solo" | "peer";
  exam_type: string;
  total_questions: number;
  score: number;
  /** Score as a percentage, e.g. 72.5 */
  score_pct: number;
  time_spent_seconds: number;
  attempted_at: string;
}

export type PerformancePeriod = "daily" | "weekly" | "monthly";

export type UaaeMode = "system-data" | "no-system-data";

export interface OLevelEntry {
  subject: string;
  grade: string; // e.g. "A1", "C6"
}

export interface UaaeInput {
  mode: UaaeMode;
  utmeSubjects: string[];
  utmeScore: number;
  oLevel: OLevelEntry[];
  postUtme: number;
  facultyCheck: string; // faculty name or "All"
  /** "None" uses the Merit cutoff; a state name uses that catchment cutoff when the department offers one. */
  catchmentState: string;
}

export interface EligibleDepartment {
  faculty: string;
  department: string;
  cutoff: number | null;
  cutoffSource: "merit" | "catchment" | "unavailable";
  eligible: boolean;
}

export interface UaaeResult {
  aggregate: number;
  oLevelPoints: number;
  input: UaaeInput;
  departments: EligibleDepartment[];
  computedAt: number;
}
