"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { departments } from "@/lib/mock-data";

export function DepartmentsCarousel() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  const scrollBy = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    const distance = (card?.offsetWidth ?? 300) + 20;
    el.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <section className="border-t border-paper-line bg-paper-soft dark:border-ink-line dark:bg-ink-soft">
      <div className="container-content py-24 md:py-28">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-md">
            <h2 className="font-display text-[30px] leading-tight sm:text-[36px]">
              Five departments, one accountable service.
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-current/65">
              Each department owns one part of the aspirant or undergraduate
              journey.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              aria-label="Scroll departments left"
              className="focus-gold flex h-10 w-10 items-center justify-center rounded-full border border-current/20 
              transition-colors hover:border-gold-400 hover:text-gold-500 disabled:opacity-30 disabled:hover:border-current/20 disabled:hover:text-current"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              aria-label="Scroll departments right"
              className="focus-gold flex h-10 w-10 items-center justify-center rounded-full border border-current/20 transition-colors hover:border-gold-400 hover:text-gold-500 disabled:opacity-30 disabled:hover:border-current/20 disabled:hover:text-current"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          onScroll={updateEdges}
          className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {departments.map((dept, index) => (
            <article
              key={dept.name}
              data-card
              className="w-[78%] flex-shrink-0 snap-start rounded-sm border border-paper-line bg-paper p-7 dark:border-ink-line dark:bg-ink-surface sm:w-[46%] lg:w-[30%]"
            >
              <span className="font-display text-[14px] text-gold-500 dark:text-gold-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-[20px] leading-snug">
                {dept.name}
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-current/60">
                {dept.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
