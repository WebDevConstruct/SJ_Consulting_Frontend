"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpenText,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Course = {
  id: string;
  course_title: string;
  course_code: string;
  short_description: string | null;
};

type CourseTopic = {
  id: string;
  course_id: string;
  title: string;
  summary: string;
  content: string;
  position: number;
};

export default function StudyMaterialsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<CourseTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<CourseTopic | null>(null);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);

  const loadCourses = useCallback(async () => {
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/sign-in");
        return;
      }

      const { data, error } = await supabase
        .from("courses")
        .select("id, course_title, course_code, short_description")
        .order("course_title", { ascending: true });

      if (error) {
        console.error("Failed to load courses:", error);
        return;
      }

      setCourses((data ?? []) as unknown as Course[]);
    } catch (error) {
      console.error("Unexpected course loading error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router, supabase]);

  const loadTopics = useCallback(async (course: Course) => {
    setSelectedCourse(course);
    setSelectedTopic(null);
    setIsLoadingTopics(true);

    try {
      const { data, error } = await supabase
        .from("course_topics")
        .select("id, course_id, title, summary, content, position")
        .eq("course_id", course.id)
        .eq("is_published", true)
        .order("position", { ascending: true });

      if (error) {
        console.error("Failed to load course topics:", error);
        setTopics([]);
        return;
      }

      setTopics((data ?? []) as CourseTopic[]);
    } catch (error) {
      console.error("Unexpected topic loading error:", error);
      setTopics([]);
    } finally {
      setIsLoadingTopics(false);
    }
  }, [supabase]);

  useEffect(() => {
 const runAction = ()=> {
loadCourses();
 }  
 runAction(); 
  }, [loadCourses]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 dark:bg-ink">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500 dark:text-gold-300" />
      </div>
    );
  }

  if (selectedTopic) {
    return (
      <div className="min-h-screen bg-paper px-5 py-8 dark:bg-ink md:px-10 md:py-12">
        <div className="mx-auto w-full max-w-3xl">
          <button
            type="button"
            onClick={() => setSelectedTopic(null)}
            className="focus-gold flex items-center gap-2 text-[13.5px] font-medium text-current/70 hover:text-gold-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course outline
          </button>

          <div className="mt-8">
            <p className="text-[12px] font-medium uppercase tracking-wide text-current/45">
              {selectedCourse?.course_code}
            </p>

            <h1 className="mt-2 font-display text-[28px] leading-tight sm:text-[32px]">
              {selectedTopic.title}
            </h1>

            <div className="mt-6 rounded-sm border border-gold-400/40 bg-gold-400/5 p-5">
              <h2 className="font-display text-[16px]">Topic summary</h2>

              <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-current/75">
                {selectedTopic.summary}
              </p>
            </div>

            <article className="mt-8 rounded-sm border border-paper-line bg-paper-soft p-6 dark:border-ink-line dark:bg-ink-surface">
              <h2 className="font-display text-[18px]">Study notes</h2>

              <p className="mt-4 whitespace-pre-wrap text-[14.5px] leading-relaxed text-current/75">
                {selectedTopic.content}
              </p>
            </article>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-paper px-5 py-8 dark:bg-ink md:px-10 md:py-12">
        <div className="mx-auto w-full max-w-3xl">
          <button
            type="button"
            onClick={() => {
              setSelectedCourse(null);
              setTopics([]);
            }}
            className="focus-gold flex items-center gap-2 text-[13.5px] font-medium text-current/70 hover:text-gold-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </button>

          <div className="mt-8">
            <p className="text-[12px] font-medium uppercase tracking-wide text-current/45">
              {selectedCourse.course_code}
            </p>

            <h1 className="mt-2 font-display text-[28px] leading-tight sm:text-[32px]">
              {selectedCourse.course_title}
            </h1>

            {selectedCourse.short_description ? (
              <p className="mt-3 text-[14.5px] leading-relaxed text-current/65">
                {selectedCourse.short_description}
              </p>
            ) : null}
          </div>

          <div className="mt-10">
            <h2 className="font-display text-[20px]">Course outline</h2>

            {isLoadingTopics ? (
              <div className="mt-6 flex items-center gap-3 text-current/60">
                <Loader2 className="h-5 w-5 animate-spin text-gold-500 dark:text-gold-300" />
                <span className="text-[13.5px]">Loading topics...</span>
              </div>
            ) : topics.length === 0 ? (
              <div className="mt-6 rounded-sm border border-paper-line bg-paper-soft p-6 text-center dark:border-ink-line dark:bg-ink-surface">
                <BookOpenText className="mx-auto h-7 w-7 text-gold-500 dark:text-gold-300" />
                <p className="mt-3 text-[14px] text-current/60">
                  No study topics have been published for this course yet.
                </p>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3">
                {topics.map((topic, index) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className="focus-gold group flex w-full items-center justify-between gap-4 rounded-sm border border-paper-line bg-paper-soft px-5 py-4 text-left transition-colors hover:border-gold-400/50 dark:border-ink-line dark:bg-ink-surface"
                  >
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium uppercase tracking-wide text-current/45">
                        Topic {index + 1}
                      </p>

                      <h3 className="mt-1 truncate font-display text-[17px]">
                        {topic.title}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-current/60">
                        {topic.summary}
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 flex-shrink-0 text-current/40 transition-transform group-hover:translate-x-1 group-hover:text-gold-500" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper px-5 py-8 dark:bg-ink md:px-10 md:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <button
          type="button"
          onClick={() => router.push("/dashboard/undergraduate/study")}
          className="focus-gold flex items-center gap-2 text-[13.5px] font-medium text-current/70 hover:text-gold-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Study
        </button>

        <div className="mt-8">
          <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">
            Study materials
          </h1>

          <p className="mt-3 text-[14.5px] leading-relaxed text-current/65">
            Select a registered course to view its outline and topic notes.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {courses.length === 0 ? (
            <div className="rounded-sm border border-paper-line bg-paper-soft p-6 text-center dark:border-ink-line dark:bg-ink-surface">
              <BookOpenText className="mx-auto h-7 w-7 text-gold-500 dark:text-gold-300" />
              <p className="mt-3 text-[14px] text-current/60">
                No courses are available yet.
              </p>
            </div>
          ) : (
            courses.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => loadTopics(course)}
                className="focus-gold group flex w-full items-center justify-between gap-4 rounded-sm border border-paper-line bg-paper-soft px-5 py-5 text-left transition-colors hover:border-gold-400/50 dark:border-ink-line dark:bg-ink-surface"
              >
                <div className="min-w-0">
                  <p className="text-[12px] font-medium uppercase tracking-wide text-current/45">
                    {course.course_code}
                  </p>

                  <h2 className="mt-1 truncate font-display text-[18px]">
                    {course.course_title}
                  </h2>

                  {course.short_description ? (
                    <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-current/60">
                      {course.short_description}
                    </p>
                  ) : null}
                </div>

                <ChevronRight className="h-5 w-5 flex-shrink-0 text-current/40 transition-transform group-hover:translate-x-1 group-hover:text-gold-500" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}