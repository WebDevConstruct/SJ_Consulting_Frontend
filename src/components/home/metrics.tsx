"use client";

import { useEffect, useRef, useState } from "react";
import { useCountUp } from "@/lib/use-count-up";
import { clientsServedTotal } from "@/lib/mock-data";
import { ScrollCue } from "@/components/ui/scroll-cue";

const SUB_METRICS = [
  { end: 301, suffix: "", label: "Average UTME score of active users" },
  { end: 94, suffix: "%", label: "Practice questions answered correctly on retake" },
  { end: 37, suffix: "", label: "Institutions covered by the guideline desk" },
];

function Counter({
  end,
  suffix = "",
  start,
  duration,
}: {
  end: number;
  suffix?: string;
  start: boolean;
  duration?: number;
}) {
  const value = useCountUp({ end, start, duration });
  return (
    <span className="font-display tabular-nums">
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

export function Metrics() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="metrics"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink text-ivory"
    >
      <div className="pointer-events-none absolute inset-0 bg-ledger-dark" />
      <div className="container-content relative py-24 md:py-32">
        <div className="max-w-xl">
          <h2 className="font-display text-[32px] leading-tight sm:text-[38px]">
            Zero to a track record you can check.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-ivory/65">
            Every figure below comes from our own user data &mdash; not
            marketing copy.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-end gap-14 border-t border-ink-line pt-14 md:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="text-[15px] text-gold-300/80">
              Aspirants and undergraduates served
            </div>
            <div className="mt-3 text-[76px] leading-none text-gold-foil sm:text-[104px]">
              <Counter end={clientsServedTotal} start={inView} duration={2200} />
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3 md:gap-6">
            {SUB_METRICS.map((metric) => (
              <div key={metric.label}>
                <dt className="text-[30px] leading-none text-ivory">
                  <Counter end={metric.end} suffix={metric.suffix} start={inView} />
                </dt>
                <dd className="mt-3 text-[13.5px] leading-snug text-ivory/55">
                  {metric.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <ScrollCue label="Hear from the people who used it" targetId="testimonials" />
    </section>
  );
}
