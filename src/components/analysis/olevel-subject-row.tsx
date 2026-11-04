import { OLEVEL_GRADES } from "@/lib/analysis/grading";

interface OLevelSubjectRowProps {
  subject: string;
  grade: string;
  onGradeChange: (grade: string) => void;
  index: number;
}

/**
 * The subject field is read-only by design: it's derived from the UTME
 * combination chosen above (not re-typed), so O'level and UTME subjects
 * can't drift apart. Only the grade is actually chosen here.
 */
export function OLevelSubjectRow({
  subject,
  grade,
  onGradeChange,
  index,
}: OLevelSubjectRowProps) {
  return (
    <div className="grid grid-cols-[1fr_180px] gap-2">
      <input
        readOnly
        value={subject}
        aria-label={`O'level subject ${index + 1}`}
        tabIndex={-1}
        className="rounded-sm border border-paper-line bg-paper-soft px-4 py-2.5 text-[13.5px] text-current/70 dark:border-ink-line dark:bg-ink-surface"
      />
      <select
        value={grade}
        onChange={(e) => onGradeChange(e.target.value)}
        aria-label={`Grade for ${subject}`}
        className="focus-gold rounded-sm border border-paper-line bg-paper px-3 py-2.5 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-[13px]"
      >
        {OLEVEL_GRADES.map((g) => (
          <option key={g.code} value={g.code}>
            {g.label}
          </option>
        ))}
      </select>
    </div>
  );
}
