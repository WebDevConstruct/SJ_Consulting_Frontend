import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export interface DeepNavTrailEntry {
  label: string;
  href: string;
}

interface DeepNavHeaderProps {
  /** Full path from the hub page to the current page. Last entry is "current". */
  trail: DeepNavTrailEntry[];
}

/**
 * The trail is declared statically by each page (not derived from browser
 * history), so it stays identical no matter how the user arrived here or
 * where they navigate before coming back — it describes the page's place in
 * the hierarchy, not the user's session.
 */
export function DeepNavHeader({ trail }: DeepNavHeaderProps) {
  const current = trail[trail.length - 1];
  const previous = trail.length > 1 ? trail[trail.length - 2] : null;
  const initial = trail[0];
  const showInitialSeparately = previous && initial.href !== previous.href;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-paper-line bg-paper/95 backdrop-blur-md dark:border-ink-line dark:bg-ink/95">
      <div className="relative flex min-h-[64px] items-center px-5 py-3 md:px-8">
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          {showInitialSeparately ? (
            <span className="truncate text-[11px] font-medium text-current/40">
              {initial.label}
            </span>
          ) : null}
          {previous ? (
            <Link
              href={previous.href}
              className="focus-gold group flex w-fit items-center gap-1.5 text-[13.5px] font-medium text-current/55 transition-colors hover:text-gold-500"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                strokeWidth={1.8}
              />
              {previous.label}
            </Link>
          ) : null}
        </div>

        <h1 className="pointer-events-none absolute left-1/2 top-1/2 max-w-[55%] -translate-x-1/2 -translate-y-1/2 truncate text-center font-display text-[19px] font-semibold leading-tight sm:text-[21px]">
          {current.label}
        </h1>

        <div className="flex-1" />
      </div>
    </header>
  );
}
