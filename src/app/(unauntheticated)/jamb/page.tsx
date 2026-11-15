"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { getAnnouncements } from "@lib/api";
import type { AnnouncementRecord } from "@/types/announcementTypes";
import type { InformationCategory } from "@/components/assets/information";

export default function ExamPage() {
  const [announcements, setAnnouncements] = useState<
    AnnouncementRecord[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchAnnouncements = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getAnnouncements();

        setAnnouncements(data);
      } catch (fetchError) {
        if (!controller.signal.aborted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load JAMB updates.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchAnnouncements();

    return () => controller.abort();
  }, []);

  const filterByCatJamb: AnnouncementRecord[] =
    announcements?.filter(
      (item) => item.category === "jamb",
    ) ?? [];

  const informationData: InformationCategory[] = [
    {
      type: "jamb",
      title: "Exam Body Guidelines & Updates",
      description:
        "Examination updates, guidelines, syllabus changes, and official gazette bulletins directly from JAMB and national examination bodies.",
      link: "/jamb",
      data: filterByCatJamb,
    },
  ];

  return (
    <div className="flex h-auto w-full flex-col bg-paper-line dark:bg-ink">
      {informationData.map((item, index) =>
        item.type === "jamb" ? (
          <section
            key={index}
            className="item-card flex w-full flex-shrink-0 basis-full flex-col gap-8 rounded-2xl border border-paper-line bg-paper px-4 py-10 dark:border-ink-line dark:bg-ink sm:px-6 md:px-10 md:py-14"
          >
            <header className="mx-auto max-w-3xl text-center">
              <h2 className=" text-2xl font-bold leading-tight text-ink sm:text-3xl dark:text-paper">
                {item.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-ink/65 sm:text-base dark:text-paper/65">
                {item.description}
              </p>
            </header>

            {error && (
              <div
                role="alert"
                className="mx-auto max-w-2xl rounded-2xl border border-paper-line bg-paper-soft p-5 text-sm text-ink/70 dark:border-ink-line dark:bg-ink-soft dark:text-paper/70"
              >
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((placeholder) => (
                  <div
                    key={placeholder}
                    className="h-80 animate-pulse rounded-2xl border border-paper-line bg-paper-soft dark:border-ink-line dark:bg-ink-soft"
                  />
                ))}
              </div>
            ) : filterByCatJamb.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {filterByCatJamb
                  .slice(0, 4)
                  .map((news) => (
                    <article
                      key={news.id}
                      className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-paper-line bg-paper-soft shadow-sm transition hover:shadow-md dark:border-ink-line dark:bg-ink-soft"
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

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-paper-line pt-4 dark:border-ink-line">
                          <Link
                            href={`/jamb/${news.slug}`}
                            className="text-xs font-semibold text-gold-700 transition hover:text-gold-600 dark:text-gold-200 dark:hover:text-gold-100"
                          >
                            View details
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              window.location.href = `/jamb/${news.slug}`;
                            }}
                            className="rounded-full border border-gold-400 bg-gold-metal-soft px-4 py-2 text-xs font-bold text-ink transition hover:bg-gold-400/20 dark:border-gold-400/50 dark:text-paper"
                          >
                            Read more
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-paper-line bg-paper-soft p-10 text-center dark:border-ink-line dark:bg-ink-soft">
                <h3 className="font-serif text-xl font-bold text-ink dark:text-paper">
                  No JAMB updates yet
                </h3>

                <p className="mt-3 text-sm text-ink/65 dark:text-paper/65">
                  New examination guidelines and announcements
                  will appear here when published.
                </p>
              </div>
            )}

            <footer className="flex items-end justify-between gap-4">
              <Link
                href="/jamb"
                className="font-serif text-sm font-semibold text-gold-700 transition hover:text-gold-600 dark:text-gold-200 dark:hover:text-gold-100"
              >
                See all JAMB updates
              </Link>

              <div className="h-2 w-24 rounded-full bg-gold-metal-soft" />
            </footer>
          </section>
        ) : null,
      )}
    </div>
  );
}