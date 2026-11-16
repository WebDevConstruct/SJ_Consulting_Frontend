"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ScrollCue } from "@/components/ui/scroll-cue";
import { getAnnouncements } from "@lib/api";
import type { InformationCategory } from "@/components/assets/information";
import type { AnnouncementRecord } from "@/types/announcementTypes";

const CARD_GAP = 20; // gap-5 = 20px

export function Information() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [announcements, setAnnouncements] = useState<
    AnnouncementRecord[] | null
  >(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();

        setAnnouncements(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(
            "Unable to load announcements:",
            error,
          );
        }
      }
    };

    void fetchAnnouncements();

    return () => controller.abort();
  }, []);

  const updateEdges = () => {
    const track = trackRef.current;

    if (!track) return;

    const scrollLeft = track.scrollLeft;
    const cardWidth = track.clientWidth;
    const distance = cardWidth + CARD_GAP;

    setAtStart(scrollLeft <= 4);

    setAtEnd(
      scrollLeft + track.clientWidth >=
        track.scrollWidth - 4,
    );

    setActiveSlide(
      Math.min(
        Math.round(scrollLeft / distance),
        3,
      ),
    );
  };

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;

    if (!track) return;

    const cardWidth = track.clientWidth;
    const distance = cardWidth + CARD_GAP;

    track.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    });
  };

  const filterByCategory = (
    category: string,
  ): AnnouncementRecord[] =>
    announcements?.filter(
      (announcement) =>
        announcement.category === category,
    ) ?? [];

  const filterByCatMentor =
    filterByCategory("mentorship");
  const filterByCatJamb = filterByCategory("jamb");
  const filterByCatAccomodation =
    filterByCategory("accommodation");
  const filterByCatUnderGraduate =
    filterByCategory("unilag");

  const informationData: InformationCategory[] = [
    {
      type: "jamb",
      title: "Exam Body Guidelines & Updates",
      description:
        "Examination updates, guidelines, syllabus changes, and official gazette bulletins directly from JAMB and national examination bodies.",
      link: "/jamb",
      data: filterByCatJamb,
    },
    {
      type: "unilag",
      title: "College Entry Guidelines",
      description:
        "Accurate and timely institutional admission guidelines, Post-UTME screening requirements, and departmental cut-off rules.",
      link: "/unilag",
      data: filterByCatUnderGraduate,
    },
    {
      type: "mentorship",
      title: "Mentorship & Scholarship",
      description:
        "Mentorship guides, hackathons, and scholarship opportunities from reputable organizations for ambitious youths and students. Don't miss out!",
      link: "/mentorship",
      data: filterByCatMentor,
    },
    {
      type: "accommodation",
      title: "Accommodations",
      description:
        "Campus notices, course registration deadlines, dockets, GST login access, continuous assessment updates, and campus accommodation alerts.",
      link: "/accommodation",
      data: filterByCatAccomodation,
    },
  ];

  return (
    <section
      id="information"
      className="relative border-t border-paper-line bg-paper-surface dark:border-ink-line dark:bg-ink"
    >
      <div className="container-content flex flex-col items-center py-10 md:py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <h1 className="text-center text-[20px] leading-[25px] font-serif
            text-ink sm:text-4xl md:text-[50px] dark:text-paper lg:leading-[60px]">
            Information and Scholarship Opportunities,
            All in one place.
          </h1>

          <p className="mt-4 text-center text-base leading-relaxed text-ink/65 dark:text-paper/65">
            Grouped into focused categories, providing a
            comprehensive view of all available updates.
          </p>
        </motion.div>

        <div className="mt-10 flex w-full flex-col gap-6">
          <div
            ref={trackRef}
            onScroll={updateEdges}
            className="no-scrollbar item-card relative flex h-auto min-h-[680px] w-full gap-5 overflow-x-hidden overflow-y-hidden rounded-2xl border border-paper-line dark:border-ink-line lg:h-[760px]"
          >
            {informationData.map(
              (item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                  }}
                  data-item-id={item.type}
                  className="item-card flex h-full w-full flex-shrink-0 basis-full flex-col gap-6 overflow-hidden rounded-2xl border border-paper-line bg-paper p-5 dark:border-ink-line dark:bg-ink sm:p-8"
                >
                  <header className="text-center">
                    <h2 className="font-serif text-2xl font-bold leading-tight text-ink sm:text-3xl dark:text-paper">
                      {item.title}
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-ink/65 dark:text-paper/65">
                      {item.description}
                    </p>
                  </header>

                  {item.data.length > 0 ? (
                    <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      {item.data
                        .slice(0, 4)
                        .map((news, i) => (
                          <article
                            key={news.id}
                            className={`flex h-full min-h-0 flex-col
                             overflow-hidden rounded-2xl border border-paper-line bg-paper-soft
                              shadow-sm transition hover:shadow-md dark:border-ink-line dark:bg-ink-soft ${i !== 0 ? "hidden lg:block" : ""}  `}
                          >
                            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-paper-line dark:bg-ink">
                              {news.image_url ? (
                                <Image
                                  src={news.image_url}
                                  alt={
                                    news.title ??
                                    item.description
                                  }
                                  fill
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-paper-line dark:bg-ink">
                                  <span className="text-xs font-medium text-ink/45 dark:text-paper/45">
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
                              <div className="min-h-0 flex-1">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-700 dark:text-gold-200">
                                  {news.created_at
                                    ? new Date(
                                        news.created_at,
                                      ).toLocaleDateString(
                                        "en-GB",
                                        {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        },
                                      )
                                    : "Recent update"}
                                </p>

                                <h3 className="mt-2 line-clamp-2 font-serif text-base font-bold leading-snug text-ink dark:text-paper">
                                  {news.title}
                                </h3>

                                <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/65 dark:text-paper/65">
                                  {news.summary ??
                                    news.content ??
                                    "Read the full announcement for details."}
                                </p>
                              </div>

                              <div className="mt-4 flex shrink-0 items-center justify-between gap-3 border-t border-paper-line pt-3 dark:border-ink-line">
                                <Link
                                  href={`/${news.category}/${news.slug}`}
                                  className="text-[11px] font-semibold text-gold-700 transition hover:text-gold-600 dark:text-gold-200 dark:hover:text-gold-100"
                                >
                                  View details
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => {
                                    window.location.href = `/${news.category}/${news.slug}`;
                                  }}
                                  className="rounded-full border border-gold-400 bg-gold-metal-soft px-3 py-1.5 text-[11px] font-bold text-ink transition hover:bg-gold-400/20 dark:border-gold-400/50 dark:text-paper"
                                >
                                  Read more
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}
                    </div>
                  ) : (
                    <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-dashed border-paper-line bg-paper-soft p-8 text-center dark:border-ink-line dark:bg-ink-soft">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-ink dark:text-paper">
                          No updates yet
                        </h3>

                        <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">
                          New{" "}
                          {item.title.toLowerCase()}{" "}
                          announcements will appear here.
                        </p>
                      </div>
                    </div>
                  )}

                  <footer className="flex shrink-0 items-end justify-between gap-4">
                    <Link
                      href={item.link}
                      className="font-serif text-sm font-semibold text-gold-700 transition hover:text-gold-600 dark:text-gold-200 dark:hover:text-gold-100"
                    >
                      See all{" "}
                      {item.link.replace("/", "")}{" "}
                      updates
                    </Link>

                    <div className="h-2 w-24 rounded-full bg-gold-metal-soft" />
                  </footer>
                </motion.div>
              ),
            )}
          </div>

          <div className="flex w-full justify-center gap-2">
            {informationData.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Go to ${item.title}`}
                onClick={() => {
                  const track = trackRef.current;

                  if (!track) return;

                  const cardWidth = track.clientWidth;
                  const distance =
                    cardWidth + CARD_GAP;

                  track.scrollTo({
                    left: index * distance,
                    behavior: "smooth",
                  });
                }}
                className={`h-3 w-3 rounded-full transition ${
                  activeSlide === index
                    ? "bg-gold-metal"
                    : "bg-gray-300 dark:bg-ink-line"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-3">
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={atEnd}
          aria-label="Scroll information right"
          className="focus-gold flex h-10 w-10 items-center justify-center rounded-full border border-current/20 bg-paper/90 transition-colors hover:border-gold-400 hover:text-gold-500 disabled:opacity-30 dark:bg-ink-surface/90"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={atStart}
          aria-label="Scroll information left"
          className="focus-gold flex h-10 w-10 items-center justify-center rounded-full border border-current/20 bg-paper/90 transition-colors hover:border-gold-400 hover:text-gold-500 disabled:opacity-30 dark:bg-ink-surface/90"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <ScrollCue
        label="See the difference we've made"
        targetId="metrics"
      />
    </section>
  );
}