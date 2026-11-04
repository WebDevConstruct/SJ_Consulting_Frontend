import type { RecentAttempt } from "@/lib/analysis/types";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English Language"];
const TRACKS: RecentAttempt["track_type"][] = ["subject", "topic", "combination"];
const MODES: RecentAttempt["mode"][] = ["solo", "peer"];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/** Deterministic so the chart looks the same on every reload (no backend yet). */
export function getMockAttempts(count = 24): RecentAttempt[] {
  return Array.from({ length: count }, (_, i) => {
    const r1 = seededRandom(i + 1);
    const r2 = seededRandom(i + 101);
    const r3 = seededRandom(i + 201);
    const subject = SUBJECTS[Math.floor(r1 * SUBJECTS.length)];
    const totalQuestions = 10;
    const score = Math.round(4 + r2 * 6); // 4–10
    const daysAgo = Math.floor(r3 * 28);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    return {
      id: `attempt-${i + 1}`,
      subject,
      track_type: TRACKS[i % TRACKS.length],
      mode: MODES[i % MODES.length],
      exam_type: "JAMB",
      total_questions: totalQuestions,
      score,
      score_pct: Math.round((score / totalQuestions) * 1000) / 10,
      time_spent_seconds: 300 + Math.floor(r2 * 600),
      attempted_at: date.toISOString(),
    };
  });
}
