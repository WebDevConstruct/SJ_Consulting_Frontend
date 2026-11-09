"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ModalShell } from "@/components/study/modal-shell";
import type { CbtTrack,  } from "@/lib/study/types";
import { useGlobalContext } from "../../../Context";
import { Book } from "lucide-react";
import { useStatusToast } from "@/components/ui/status-toast";
import { startCbtSession } from "@/lib/study/cbt-api"
import { TextField} from "@/components/forms/text-field";
import {createClient } from "@lib/supabase/client";
import {useParams} from "next/navigation";
import {StartedSession} from "@lib/study/cbt-api";
const supabase = createClient()
export type SubjectOption = {
  id: string;
  name: string;
};

export type TopicOption = {
  id: string;
  subject_id: string;
  title: string;
};

export type CombinationOption = {
  label: string;
  subjectIds: string[];
};

interface SoloTrackModalProps {
  profile : "undergraduate" | "aspirant"
  open: boolean;
  onClose: (session : (StartedSession & {status : string}) | null) => void;
  subjects: SubjectOption[];
  topics: TopicOption[];
  combinations: CombinationOption[];
  // onStart: (selection: {
  //   trackType: CbtTrack;
  //   subjectId : string | null;
  //   courseId ?: string | null;
  //   topicId?: string | null;
  //   subjectIds?: string[] | null;
  //   durationSeconds : number;
  //   mode  : "exam" | "practice";
  //   questionCount : number

  // }) => void | Promise<void>;
}

export function SoloTrackModal({
   profile,
  open,
onClose,
  subjects,
  topics,
  combinations,
  //onStart,
  
}: SoloTrackModalProps) {
   const { courseId } = useParams<{ courseId: string }>();
   const { setActiveSession} = useGlobalContext()
  const [trackType, setTrackType] = useState<CbtTrack>("subject");
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);
  const [combinationLabel, setCombinationLabel] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [mode, setMode] = useState<"exam" | "practice">("practice");
  const [questionCount, setQuestionCount] = useState<number>(30);
 // const {courseId, setCourseId} = useGlobalContext();
  const {showToast} = useStatusToast();
  const [durationSeconds, setDurationSeconds] = useState<number>(0)
 // const [mode, setMode] = useState<"exam" | "practice">("practice")
 const clear = ()=> {
    if (!open) {
      setTrackType("subject");
      setSubjectId(null);
      setTopicId(null);
      setCombinationLabel(null);
      setStarting(false);
    }
 }

  useEffect(() => {
    function runClear(){
      clear();
      setQuestionCount(10);
      setDurationSeconds(15)
    }
    runClear();
  }, [open]);

  if (!open) return null;

  const selectedCombination = combinations.find(
    (combination) => combination.label === combinationLabel,
  );

  const topicOptions = topics.filter(
    (topic) => topic.subject_id === subjectId,
  );

  const canContinue =
   profile === "aspirant" ?  trackType === "subject"
      ? Boolean(subjectId)
      : trackType === "topic"
        ? Boolean(subjectId && topicId)
        : Boolean(selectedCombination) : "courses";



  const handleContinue = async () => {
  //alert("RUNNING")
    if (starting) return;

    setStarting(true);
//console.log(questionCount, durationSeconds, mode, trackType, subjectId, topicId, combinationLabel)
    try {
    const session = await startCbtSession(supabase, {
        kind: "solo",
        mode: mode,
        trackType: profile === "aspirant" ? trackType : "courses",
        durationSeconds : durationSeconds * 60,
        courseId : courseId || null,
        questionCount : questionCount || 30,
      });
    
      if(session){
          setActiveSession(session as unknown as StartedSession & { status: string });
        showToast({
          kind : "success",
          title : "Session Started",
          message : "Your CBT session has started successfully."
        })
         onClose(session as StartedSession & {status : string})
      }
    }catch(error){
       showToast({
    kind : "error",
    title : "Error Starting Session",
    message :   error instanceof Error
        ? error.message :
         ""
  })
    onClose(null)
    } 
  };

console.log("MODE", mode)
  const QUESTION_COUNTS = [10, 20, 30, 40, 50, 60, 70];
  return (

    <ModalShell
      open={open}
      onClose={()=> {
        onClose(null)
      }}
      title="Choose your CBT track"
      description={profile === "aspirant" ? "Select whether you want to practise by subject, topic, or your subject combination."
        : "Select whether you want to practise in practice mode or exam mode."}
      
    >
      {profile === "aspirant" ? (
        <div>
      <div className="grid grid-cols-3 gap-2">
        {(["subject", "topic", "combination"] as CbtTrack[]).map(
          (track) => (
            <button
              key={track}
              type="button"
              onClick={() => setTrackType(track)}
              className={`focus-gold rounded-sm border px-2 py-2.5 text-[12.5px] font-medium capitalize transition-colors ${
                trackType === track
                  ? "border-gold-400 bg-gold-400/5 text-gold-600 dark:text-gold-300"
                  : "border-paper-line text-current/60 hover:border-current/30 dark:border-ink-line"
              }`}
            >
              {track}
            </button>
          ),
        )}
      </div>

      {trackType !== "combination" ? (
        <div className="mt-5 flex flex-col gap-2">
          <span className="text-[13.5px] font-medium text-current/80">
            Subject
          </span>

          <select
            value={subjectId ?? ""}
            onChange={(event) => {
              setSubjectId(event.target.value);
              setTopicId(null);
            }}
            className="focus-gold rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-[14.5px]"
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {trackType === "topic" ? (
        <div className="mt-5 flex flex-col gap-2">
          <span className="text-[13.5px] font-medium text-current/80">
            Topic
          </span>

          <select
            value={topicId ?? ""}
            onChange={(event) => setTopicId(event.target.value)}
            disabled={!subjectId}
            className="focus-gold rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current disabled:opacity-50 dark:border-ink-line dark:bg-ink-surface md:text-[14.5px]"
          >
            <option value="">
              {subjectId ? "Select a topic" : "Select a subject first"}
            </option>
            {topicOptions.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {trackType === "combination" ? (
        <div className="mt-5 flex flex-col gap-2">
          <span className="text-[13.5px] font-medium text-current/80">
            Subject combination
          </span>

          <select
            value={combinationLabel ?? ""}
            onChange={(event) =>
              setCombinationLabel(event.target.value)
            }
            className="focus-gold rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-[14.5px]"
          >
            <option value="">Select a combination</option>
            {combinations.map((combination) => (
              <option
                key={combination.label}
                value={combination.label}
              >
                {combination.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <button
        type="button"
        disabled={!canContinue || starting}
        onClick={handleContinue}
        className="focus-gold mt-6 mb-20 flex w-full items-center justify-center gap-2 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        {starting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Preparing…
          </>
        ) : (
          "Continue"
        )}
      </button>
      </div>
      ) : (
        <div className="flex flex-col gap-4 no-scrollbar">
           <div className={`flex justify-between
             bg-paper-soft dark:bg-ink-soft items-center gap-4 px-4 py-4`}>
           
                <div onClick={()=> {
                  setMode("practice");
                  //alert(mode);
                }} 
                className={`flex py-5 px-2 border border-gold-500 w-1/2 gap-2 lg:dark:hover:dark:bg-gold-700
                   cursor-pointer lg:hover:bg-gold-700 lg:hover:bg-opacity-20 justify-center items-center
                 rounded-md ${mode === "practice" ? "bg-gold-400" : "bg-paper-surface dark:bg-ink-surface"}`}>
                
               <Book/>
               <p className="text-[14px] 
               font-medium text-current/80 dark:text-paper">
                Practice
               </p>
                </div>

                 <div onClick={()=> setMode("exam")}
                 className={`flex px-2 py-5 border w-1/2 cursor-pointer  lg:hover:dark:bg-gold-700 lg:hover:bg-opacity-20 lg:hover:bg-gold-700
                  justify-center items-center gap-2 border-gold-500 rounded-md 
                   ${mode === "exam" ? "bg-gold-400" : "bg-paper-surface dark:bg-ink-surface "}`}>
               <Book/>
               <p className="text-[14px] 
               font-medium text-current/80 dark:text-paper">
                Exam Mode
               </p>
                </div>
                
    
      <div>
        </div>

           </div>

           {/* QUESTION COUNT */}
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

        {/* DURATION OF THE SESSION */}
              <div className="mt-5 flex flex-col gap-2">
  <span className="text-[13.5px] font-medium text-current/80">
    Duration
  </span>

  <select
    value={durationSeconds}
    onChange={(event) =>
      setDurationSeconds(Number(event.target.value))
    }
    className="focus-gold rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-[14.5px]"
  >
    {[15, 30, 45, 60].map((minutes) => (
      <option key={minutes} value={minutes}>
        {minutes} minutes
      </option>
    ))}
  </select>
</div>
           <button
        type="button"
        disabled={!canContinue || starting}
        onClick={handleContinue}
        className="focus-gold mt-6 mb-20 flex w-full items-center justify-center gap-2 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        {starting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Preparing…
          </>
        ) : (
          "Continue"
        )}
      </button>
      
        </div>
      )}
    </ModalShell>
  );
}