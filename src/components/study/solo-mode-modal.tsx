"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Clock,
  Layers,
  PenLine,

} from "lucide-react";
import {ModalShell} from "./modal-shell";
import type { CbtMode, CbtTrack } from "@lib/study/types";
import { useGlobalContext } from "../../../Context";
import { useStatusToast} from "@components/ui/status-toast";
interface SubjectOption {
  id: string;
  name: string;
}

interface TopicOption {
  id: string;
  title: string;
  subject_id: string;
}

interface SoloModeModalProps {
  profile : "undergraduate" | "aspirant";
  open: boolean;
  onClose: () => void;
  subjects: SubjectOption[];
  topics: TopicOption[];
  onPick: (params: {
    trackType: CbtTrack;
    subjectId: string | null;
    topicId: string| null;
    subjectIds: string[] | null;
    courseId ?: string | null;
    mode: CbtMode;
    questionCount: number;
  }) => void | Promise<void>;
}

const QUESTION_COUNTS = [10, 20, 30, 50];

export default function SoloModeModal({
  profile,
  open,
  onClose,
  subjects,
  topics,
  onPick,
}: SoloModeModalProps) {
  const { showToast } = useStatusToast()
  const [trackType, setTrackType] = useState<CbtTrack>("subject");
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);
  const [mode, setMode] = useState<CbtMode>("practice");
  const [questionCount, setQuestionCount] = useState(10);
  const [starting, setStarting] = useState(false);
  const {courseId} = useGlobalContext()
//alert("Solo Mode Modal is running but there seems to be an issue with the code.")
  const availableTopics = useMemo(
    () =>
      topicId || subjectId
        ? topics.filter(
            (topic) =>
              !subjectId || topic.subject_id === subjectId,
          )
        : topics,
    [topics, subjectId, topicId],
  );

  useEffect(() => {
    if (!open) {
      const cleanStates = ()=> {
    setTrackType("subject");
      setSubjectId(null);
      setTopicId(null);
      setMode("practice");
      setQuestionCount(10);
      setStarting(false);
      }
      cleanStates()
    }
  }, [open]);

  const canContinue =
    (trackType === "subject" && Boolean(subjectId)) ||
    (trackType === "topic" && Boolean(topicId));

  const handleContinue = async () => {
  if (!canContinue || starting) return;
 // alert("Starting a session")
  try {
     setStarting(true);
 await onPick({
      trackType,
      subjectId:
        trackType === "subject" ? subjectId : null,
      topicId: trackType === "topic" ? topicId : null,
      courseId,
      subjectIds: [],
      mode,
      questionCount,
    });
    
  }catch(error){
  showToast({
    kind : "error",
    title : "Error Starting Session",
    message :   error instanceof Error
        ? error.message :
         ""
  })
  } finally {
   // onClose()
   // setTrackType("")
  }
};


return(
    <ModalShell
        open={open}
      onClose={onClose}
      title="Practice or simulate?"
      description="Exam mode times you and locks answers once submitted, just like the real thing."
    >
      <div className="flex flex-col gap-6 mb-20">
        <section>
          <div className="mb-2 text-[12.5px] font-medium text-current/60">
            Choose what to practise
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setTrackType("subject");
                setTopicId(null);
              }}
              className={`focus-gold flex items-center gap-3
                 rounded-sm border px-4 py-3 text-left transition-colors ${
                trackType === "subject"
                  ? "border-gold-400/70 bg-gold-400/5"
                  : "border-paper-line hover:border-gold-400/50 dark:border-ink-line"
              }`}
            >
              <BookOpen
                className="h-5 w-5 flex-shrink-0 text-gold-500 dark:text-gold-300"
                strokeWidth={1.7}
              />
              <div>
                <div className="text-[14px] font-medium">
                  Subject
                </div>
                <div className="mt-0.5 text-[12.5px] text-current/55">
                  Mixed topics
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setTrackType("topic");
                setSubjectId(null);
              }}
              className={`focus-gold flex items-center gap-3 rounded-sm border px-4 py-3 text-left transition-colors ${
                trackType === "topic"
                  ? "border-gold-400/70 bg-gold-400/5"
                  : "border-paper-line hover:border-gold-400/50 dark:border-ink-line"
              }`}
            >
              <BookOpen
                className="h-5 w-5 flex-shrink-0 text-gold-500 dark:text-gold-300"
                strokeWidth={1.7}
              />
              <div>
                <div className="text-[14px] font-medium">
                  Topic
                </div>
                <div className="mt-0.5 text-[12.5px] text-current/55">
                  Focused revision
                </div>
              </div>
            </button>
          </div>
        </section>

        {trackType === "subject" && (
          <section>
            <label
              htmlFor="solo-subject"
              className="mb-2 block text-[12.5px] font-medium text-current/60"
            >
              Subject
            </label>

            <select
              id="solo-subject"
              value={subjectId ?? ""}
              onChange={(event) =>
                setSubjectId(event.target.value || null)
              }
              className="focus-gold w-full rounded-sm border border-paper-line bg-transparent px-3 py-3 text-[14px] outline-none dark:border-ink-line"
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} className="text-black bg-black dark:bg-white dark:text-white" value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </section>
        )}

        {trackType === "topic" && (
          <section>
            <label
              htmlFor="solo-topic"
              className="mb-2 block text-[12.5px] font-medium text-current/60"
            >
              Topic
            </label>

            <select
              id="solo-topic"
              value={topicId ?? ""}
              onChange={(event) =>
                setTopicId(event.target.value || null)
              }
              className="focus-gold w-full rounded-sm border border-paper-line bg-transparent px-3 py-3 text-[14px] outline-none dark:border-ink-line"
            >
              <option value="">Select a topic</option>
              {availableTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </section>
        )}

        <section>
          <div className="mb-2 text-[12.5px] font-medium text-current/60">
            Number of questions
          </div>

          <div className="grid grid-cols-4 gap-2">
            {QUESTION_COUNTS.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                className={`focus-gold rounded-sm border px-3 py-2.5 text-[13px] transition-colors ${
                  questionCount === count
                    ? "border-gold-400/70 bg-gold-400/5 font-medium"
                    : "border-paper-line hover:border-gold-400/50 dark:border-ink-line"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 text-[12.5px] font-medium text-current/60">
            Session type
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setMode("practice")}
              className={`focus-gold flex items-center gap-4 rounded-sm border px-4 py-4 text-left transition-colors ${
                mode === "practice"
                  ? "border-gold-400/70 bg-gold-400/5"
                  : "border-paper-line hover:border-gold-400/50 dark:border-ink-line"
              }`}
            >
              <PenLine
                className="h-5 w-5 flex-shrink-0 text-gold-500 dark:text-gold-300"
                strokeWidth={1.7}
              />
              <div>
                <div className="text-[14px] font-medium">
                  Practice
                </div>
                <div className="mt-0.5 text-[12.5px] text-current/55">
                  No timer. Move at your own pace.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode("exam")}
              className={`focus-gold flex items-center gap-4 rounded-sm border px-4 py-4 text-left transition-colors ${
                mode === "exam"
                  ? "border-gold-400/70 bg-gold-400/5"
                  : "border-paper-line hover:border-gold-400/50 dark:border-ink-line"
              }`}
            >
              <Clock
                className="h-5 w-5 flex-shrink-0 text-gold-500 dark:text-gold-300"
                strokeWidth={1.7}
              />
              <div>
                <div className="text-[14px] font-medium">
                  Exam mode
                </div>
                <div className="mt-0.5 text-[12.5px] text-current/55">
                  Timed, single attempt &mdash; simulates the real thing.
                </div>
              </div>
            </button>
          </div>
        </section>

        <button
          type="button"
          disabled={!canContinue || starting}
          onClick={handleContinue}
          className="focus-gold mt-2 flex w-full items-center justify-center gap-2 rounded-sm bg-gold-500 px-4 py-3.5 text-[14px] font-medium text-ink-900 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {starting ? "Preparing questions..." : "Continue"}
        </button>
      </div>
    </ModalShell>
  );
}
