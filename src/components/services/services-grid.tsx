import { BookOpen, Building2, Radio, Users } from "lucide-react";
import { services } from "@/lib/mock-data";
import Image from "next/image";
const ICONS = {
  book: BookOpen,
  radio: Radio,
  users: Users,
  building: Building2,
};

function ServiceMotif({ index }: { index: number }) {
  // Four distinct, hand-drawn-feeling motifs tied to each service, not stock photography.
  const motifs = [
    // Question bank: stacked ruled cards
    <svg key="0" viewBox="0 0 400 320" className="h-full w-full">
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={40 + i * 14}
          y={40 - i * 14}
          width="260"
          height="200"
          rx="3"
          className="fill-paper-soft stroke-gold-400/50 dark:fill-ink-surface"
          strokeWidth="1"
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="66"
          y1={100 + i * 28}
          x2="256"
          y2={100 + i * 28}
          stroke="#C9A227"
          strokeOpacity={i === 1 ? 0.9 : 0.25}
          strokeWidth={i === 1 ? 2 : 1}
        />
      ))}
    </svg>,
    // Guideline desk: broadcast rings
    <svg key="1" viewBox="0 0 400 320" className="h-full w-full">
      <circle cx="180" cy="160" r="10" fill="#C9A227" />
      {[40, 75, 110].map((r, i) => (
        <circle
          key={r}
          cx="180"
          cy="160"
          r={r}
          fill="none"
          stroke="#C9A227"
          strokeOpacity={0.55 - i * 0.15}
          strokeWidth="1.4"
        />
      ))}
      <rect x="255" y="60" width="90" height="22" rx="2" className="fill-paper-soft stroke-gold-400/40 dark:fill-ink-surface" strokeWidth="1" />
      <rect x="240" y="220" width="90" height="22" rx="2" className="fill-paper-soft stroke-gold-400/40 dark:fill-ink-surface" strokeWidth="1" />
    </svg>,
    // 1:1 guidance: two facing seats
    <svg key="2" viewBox="0 0 400 320" className="h-full w-full">
      <circle cx="140" cy="120" r="26" fill="none" stroke="#C9A227" strokeWidth="1.6" />
      <path d="M96 220c8-34 32-52 44-52s36 18 44 52" fill="none" stroke="#C9A227" strokeWidth="1.6" />
      <circle cx="270" cy="150" r="20" className="fill-gold-metal-soft" />
      <path d="M234 232c6-26 26-40 36-40s30 14 36 40" fill="none" stroke="#C9A227" strokeWidth="1.6" />
      <line x1="180" y1="230" x2="230" y2="230" stroke="#C9A227" strokeOpacity="0.4" strokeDasharray="4 5" />
    </svg>,
    // Accommodation: building outline
    <svg key="3" viewBox="0 0 400 320" className="h-full w-full">
      <rect x="110" y="70" width="140" height="180" rx="2" fill="none" stroke="#C9A227" strokeWidth="1.6" />
      {[0, 1, 2, 3].map((row) =>
        [0, 1].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={130 + col * 60}
            y={95 + row * 38}
            width="34"
            height="22"
            className={
              row === 1 && col === 1
                ? "fill-gold-metal-soft"
                : "fill-none stroke-gold-400/40"
            }
            strokeWidth="1"
          />
        ))
      )}
      <rect x="168" y="212" width="34" height="38" fill="none" stroke="#C9A227" strokeWidth="1.4" />
    </svg>,
  ];

  return motifs[index % motifs.length];
}

export function ServicesGrid() {
  return (
    <section className="bg-paper dark:bg-ink">
      <div className="container-content py-24 md:py-32">
        <div className="w-full flex flex-col items-center ">
          <h2 className="font-display text-[32px] text-center leading-tight sm:text-[38px]">
            Everything the exam year actually requires.
          </h2>
          <p className="mt-4 text-[16px] text-center leading-relaxed text-current/65">
            Not a general study app &mdash; a set of tools built specifically
            around how the JAMB and UNILAG process actually works.
          </p>
        </div>

        <div className="mt-20 flex flex-col gap-24">
          {services.map((service, index) => {
            const reversed = index % 2 === 1;
            return (
              <div
                key={service.title}
                className={`grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16 ${
                  reversed ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="aspect-[5/4] w-full  border border-paper-line rounded-md bg-paper-soft  dark:border-ink-line dark:bg-ink-surface">
                  <Image src={service.image} className="w-full h-full object-cover rounded-md"
                  alt={`${service.title} Image`} width={400}
                   height={400}/>
                </div>

                <div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/50 text-gold-500 dark:text-gold-300">
                    {(() => {
                      const Icon = ICONS[service.icon];
                      return <Icon className="h-5 w-5" strokeWidth={1.6} />;
                    })()}
                  </span>
                  <h3 className="mt-4 font-display text-[26px] leading-snug sm:text-[28px]">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-current/65">
                    {service.description}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 border-t border-gold-400/40 pt-3 text-[13.5px] font-medium text-gold-600 dark:text-gold-300">
                    {service.stat}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
