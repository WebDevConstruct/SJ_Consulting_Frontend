import { tutor } from "@/lib/mock-data";

function TutorMonogram() {
  const initials = tutor.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <defs>
        <linearGradient id="tutorRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#E9CD7B" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="98" className="fill-paper-soft dark:fill-ink-surface" />
      <circle cx="100" cy="100" r="98" fill="none" stroke="url(#tutorRing)" strokeWidth="2" />
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="56"
        className="fill-gold-600 dark:fill-gold-200"
      >
        {initials}
      </text>
    </svg>
  );
}

export function TutorSection() {
  return (
    <section className="border-t border-paper-line bg-paper-soft dark:border-ink-line dark:bg-ink-soft">
      <div className="container-content flex flex-col items-center py-24 text-center md:py-28">
        <div className="h-32 w-32">
          <TutorMonogram />
        </div>

        <h2 className="mt-7 font-display text-[26px] leading-snug sm:text-[28px]">
          {tutor.name}
        </h2>
        <p className="mt-1.5 text-[14.5px] font-medium text-gold-600 dark:text-gold-300">
          {tutor.title}
        </p>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-current/65">
          {tutor.bio}
        </p>
      </div>
    </section>
  );
}
