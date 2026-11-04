"use client";

import { useEffect, useMemo, useState } from "react";

import { Book, Lock, Search, Target, BookCopy } from "lucide-react";

import { Button } from "@components/Button";
import { useStatusToast } from "@/components/ui/status-toast";

import type {
  MultiplayerSessionNotification,
  StudentCBTCoursesResponse,
  StudentCourse,
} from "./cbt-types";

type CBTPageProps = {
  onStudyCourse: (course: StudentCourse) => void;
  onBuyCourse: (course: StudentCourse) => void;
};

const CBTPage = ({ onStudyCourse, onBuyCourse }: CBTPageProps) => {
  const { showToast } = useStatusToast();

  const [data, setData] = useState<StudentCBTCoursesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [multiplayerSession, setMultiplayerSession] =
    useState<MultiplayerSessionNotification | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadCourses = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/student/cbt/courses", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
        });

        const result = (await response.json()) as StudentCBTCoursesResponse;

        if (!response.ok) {
          throw new Error(
            result.error ?? "Unable to load your CBT courses.",
          );
        }

        setData(result);
        setMultiplayerSession(result.multiplayer_session);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load your CBT courses.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadCourses();

    return () => controller.abort();
  }, []);

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return data?.courses ?? [];

    return (data?.courses ?? []).filter(
      (course) =>
        course.course_code.toLowerCase().includes(query) ||
        course.course_title.toLowerCase().includes(query),
    );
  }, [data?.courses, searchQuery]);

  const handlePrimaryAction = (course: StudentCourse) => {
    if (course.access_status === "locked") {
      onBuyCourse(course);
      return;
    }

    onStudyCourse(course);
  };

  return (
    <main className="min-h-screen bg-paper-soft px-4 py-10 text-ink sm:px-6 lg:px-10 dark:bg-ink dark:text-paper">
      <div className="mx-auto max-w-content">
        <header>
          <h1 className="text-3xl font-bold
           leading-tight sm:text-4xl">
            Personalized CBT Contents
          </h1>

          <p className="mt-3 max-w-2xl text-base font-[20px] leading-7
           text-ink/65 dark:text-paper/65">
            Your courses are matched to your current college, faculty,
            department, and level. Unlock a course to access solo, peer, and
            multiplayer sessions.
          </p>

          <div className="mt-7 max-w-xl">
            <label
              htmlFor="course-search"
              className="sr-only"
            >
              Search courses
            </label>

            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45 dark:text-paper/45" />

              <input
                id="course-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by course code or course name"
                className="w-full rounded-xl border border-paper-line bg-paper py-3 pl-11 pr-4 text-sm outline-none transition focus:border-gold-400 dark:border-ink-line dark:bg-ink-soft"
              />
            </div>
          </div>
        </header>

        {error && (
          <section
            role="alert"
            className="mt-8 rounded-2xl border border-paper-line bg-paper p-5 text-sm dark:border-ink-line dark:bg-ink-soft"
          >
            {error}
          </section>
        )}

        {loading && (
          <section className="mt-10 rounded-2xl border border-paper-line bg-paper p-10 text-center dark:border-ink-line dark:bg-ink-soft">
            Loading your personalized courses…
          </section>
        )}

        {!loading && !error && (
          <section className="mt-10 flex flex-wrap w-full gap-5">
            {filteredCourses.map((course) => {
              const isLocked = course.access_status === "locked";

              return (
                <article
                  key={course.id}
                  className="relative overflow-hidden w-full lg:w-1/3 md:w-1/2 flex-shrink 
                   rounded-2xl border border-paper-line bg-paper 
                  p-6 transition hover:shadow-lg 
                  dark:border-ink-line dark:bg-ink-soft"
                >
                  {isLocked && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-ink/10 to-transparent p-6 opacity-40 dark:from-paper/10"
                    >
                      <Lock className="h-24 w-24 text-ink/15 dark:text-paper/15" />
                    </div>
                  )}

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-metal-soft">
                        <Book className="h-5 w-5 text-ink dark:text-gold-300" />
                      </div>

                      <div className="flex flex-col">
                        <p className="text-sm font-bold uppercase tracking-wide">
                          {course.course_code}
                        </p>

                        <p className="mt-1 text-xs text-ink/55 dark:text-paper/55">
                          {course.level}  {course.department_name}
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-ink dark:text-gold-300">
                      {course.price
                        ? `${course.currency} ${course.price}`
                        : "Free"}
                    </p>
                  </div>

                  <div className="relative mt-6">
                    <h2 className="font-display text-xl font-bold leading-snug">
                      {course.course_title}
                    </h2>

                    <div className="mt-3 flex items-start gap-2">
                      <BookCopy className="mt-0.5 h-4 w-4 shrink-0 text-gold-600 dark:text-gold-300" />

                      <p className="text-sm leading-6 text-ink/65 dark:text-paper/65">
                        {course.objective ||
                          "Course objectives will be published soon."}
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-7">
                    <Button
                      className="w-full"
                      text={
                        isLocked
                          ? course.price
                            ? `Buy now — ${course.currency} ${course.price}`
                            : "Buy now"
                          : "Study"
                      }
                      type="button"
                      onClick={() => handlePrimaryAction(course)}
                    />
                  </div>
                </article>
              );
            })}

            {filteredCourses.length === 0 && (
              <div className="rounded-2xl border border-paper-line bg-paper p-10 text-center md:col-span-2 xl:col-span-3 dark:border-ink-line dark:bg-ink-soft">
                <h3 className="font-display text-2xl">
                  No courses found
                </h3>

                <p className="mt-3 text-sm text-ink/65 dark:text-paper/65">
                  Try another course code or course name.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default CBTPage;