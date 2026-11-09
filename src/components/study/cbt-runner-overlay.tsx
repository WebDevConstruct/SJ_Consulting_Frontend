"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock, Grid3x3, X } from "lucide-react";
import {
  submitCbtSession,
  type StartedSession,
  type SubmissionResult,
} from "@/lib/study/cbt-api";
import { createClient } from "@/lib/supabase/client";
import {useSessionResultPopUp} from "@components/useSessionResultPopUp";
import {useStatusToast} from "@/components/ui/status-toast";
import SessionWaitingRoom from "../SessionWaitingRoom";
import  SessionResultPopUp  from "../SessionResultPopUp";
import {useGlobalContext} from "../../../Context"

interface CbtRunnerOverlayProps {
  profile  : "aspirant" | "undergraduate";
  open: boolean;
  session: StartedSession | null;
  onExit?: () => void;
  submitDeadline?: string | null;
  onFinish: (result: SubmissionResult) => void;
  userId ?: string
}

interface NormalizedOption {
  id: string;
  text: string;
}

function normalizeOptions(options: unknown[]): NormalizedOption[] {
  return (options ?? []).map((option, index) => {
    if (typeof option === "string") {
      return {
        id: String.fromCharCode(65 + index),
        text: option,
      };
    }

    const objectOption = option as {
      id?: string;
      label?: string;
      text?: string;
      value?: string;
    };

    return {
      id:
        objectOption.label ??
        objectOption.id ??
        String.fromCharCode(65 + index),
      text:
        objectOption.text ??
        objectOption.value ??
        "",
    };
  });
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");

  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function CbtRunnerOverlay({
  profile,
  open,
  session,
  onExit,
  submitDeadline,
  onFinish,
  userId
}: CbtRunnerOverlayProps) {
  const supabase = createClient();
const [sessionStatus, setSessionStatus] = useState<"running" | "completed" | "pending">("running");
  const questions = useMemo(
    () => session?.questions ?? [],
    [session],
  );
  const { setNotification, setActiveSession} = useGlobalContext()
const { notification, showResultForSession} = useSessionResultPopUp(supabase, userId)
  const [index, setIndex] = useState(0);
  const {showToast} = useStatusToast()
  const [answers, setAnswers] = useState<
    Record<string, string | null>
  >({});
  const [participantsSessionCompleted, setParticipantsSessionCompleted] = useState<number>(0)
  const [totalParticipants, setTotalParticipants] = useState(0)
  const [showReview, setShowReview] = useState<boolean>(false)
  const [revealed, setRevealed] = useState<
    Record<string, string>
  >({});
  const [showJump, setShowJump] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const {setAcceptedSession, setRecipientSession, acceptedSession , recipientSession} = useGlobalContext()
  const [result, setResult] = useState<SubmissionResult | null>(
    null,
  );
  const [waitingRoom, setWaitingRoom] = useState(false);
  const current = questions[index];
  const currentOptions = useMemo(
    () => normalizeOptions(current?.options ?? []),
    [current],
  );

  const answeredCount = Object.values(answers).filter(
    Boolean,
  ).length;

  const participantsInSession = async()=> {
     if(!session?.session_id) return;
     const {data : participants, error} = 
     await supabase.from("cbt_session_participants")
     .select("id, status")
     .eq("session_id", session?.session_id)
     
   setTotalParticipants(participants?.length || 0)
 const participantsCount = participants?.filter((participant)=> (
  participant?.status === "completed"
 ))
 setParticipantsSessionCompleted(participantsCount?.length || 0)
  }


  const SessionCheck = async()=> {
       const {data  , error} = await supabase.from("cbt_sessions")
     .select("status")
     .eq("id", session?.session_id)
      .maybeSingle();
      if(error){
        showToast({
          kind : "error",
          title : "Session Retrieval Error",
          message : "The System Failed to Retrieve the Session Status"
        })
      }
if(data?.status === "completed"){
  setSessionStatus("completed");
  setWaitingRoom(false);
   await showResultForSession(session?.session_id || "");
}

  }
  
  const handleSubmit = async () => {
    console.log(session);
    if (!session || submitting) return;

    setSubmitting(true);

    try {
      const payload = {
        answers: Object.entries(answers)
          .filter(([, selected]) => Boolean(selected))
          .map(([questionId, selected]) => ({
            question_id: questionId,
            selected,
          })),
      };

      const submitted = await submitCbtSession(
        supabase,
        session.session_id,
        answers,
      );
      if(submitted?.score_percent){
     const {data  , error} = await supabase.from("cbt_sessions")
     .select("status")
     .eq("id", session?.session_id)
      .maybeSingle();

      if(error){
        showToast({
          kind : "error",
          title : "A Session Retrieval Error",
          message : "Grade Submitted, but an issue in allocating your points has occured"
})

      }
      
      if(data?.status === "completed" ){
    
        setSessionStatus("completed")
       // console.log(session?.session_id)
     await showResultForSession(session?.session_id)
       setWaitingRoom(false);
  //     alert("Your session is completed")
      }else if(data?.status === "running"){
        //alert("Your session is still running")
         //  SessionCheck();
           participantsInSession();
           setWaitingRoom(true)
      
      }
  
        showToast({
          kind : "success",
          title : "Session Completed",
          message : "Your session has been completed successfully."
        })
      }
      
 
      setResult(submitted);
    
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Could not submit this session.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
   // console.log("Running effect")
    if (!open || !session || session.mode !== "exam") {
      return;
    }

    const deadline = submitDeadline
      ? new Date(submitDeadline).getTime()
      : Date.now() + session.duration_seconds * 1000;

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor((deadline - Date.now()) / 1000),
      );

      setSecondsLeft(remaining);

      if (remaining === 0 && result === null && waitingRoom === false) {
        window.clearInterval(interval);
       
        handleSubmit();
      }
    };

    tick();

    const interval = window.setInterval(tick, 1000);
    const MidInterval = window.setInterval(()=> SessionCheck(), 60000)//Every 1 minute
    return () => {
      window.clearInterval(interval);
      window.clearInterval(MidInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, session, submitDeadline]);

  //Listening for Session Notifications
  useEffect(() => {
   
    
  if (!session?.session_id) return;
  const channel = supabase
    .channel(`session-waiting-room:${session?.session_id}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "cbt_sessions",
        filter: `id=eq.${session?.session_id}`,
      },
      async (payload) => {
        const updated = payload.new;
        alert(updated?.status);
        setSessionStatus(updated.status);

        if (updated.status === "completed") {
        //  alert("This is meant to be running")
          setWaitingRoom(false);
          setSessionStatus("completed");
          await showResultForSession(session?.session_id || "");
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
   
  };
}, [supabase, session?.session_id, showResultForSession, sessionStatus, submitting]);
//console.log(notification)
  useEffect(() => {
    if (!open) {

      function anon(){
     setIndex(0);
      setShowReview(false);
      setAnswers({});
      setRevealed({});
      setShowJump(false);
      setResult(null);
      setSubmitting(false);
      }
      anon();
    }
  }, [open]);

  if (!open || !session || !current) return null;

  const isPractice = session.mode === "practice";
  const revealedAnswer = revealed[current.id];
  const hasRevealed = Boolean(revealedAnswer);

  const selectOption = (optionId: string) => {
    setAnswers((previous) => ({
      ...previous,
      [current.id]: optionId,
    }));

    if (isPractice) {
      setRevealed((previous) => ({
        ...previous,
        [current.id]: current.answer ?? "",
      }));
    }
  };

  const goTo = (nextIndex: number) => {
    setIndex(
      Math.max(
        0,
        Math.min(questions.length - 1, nextIndex),
      ),
    );
    setShowJump(false);
  };


  
const resetFields = ()=> {
//  setStep("pending")
if(window !== undefined){
window.location.reload()
}
      setAcceptedSession({ 
        session_id: "",
      kind: "solo",
      mode: "exam",
      track_type:  profile === "aspirant" ?  "subject" : "courses",
      submit_deadline : "",
      subjectId : "",
      question_count: 0,
      duration_seconds: 0,
      questions: [],
      status : "pending"
    } );
      setRecipientSession({ 
        session_id: "",
      kind: "peer",
      mode: "exam",
      track_type:    profile === "aspirant" ?  "subject" : "courses",
      submit_deadline : "",
      subjectId : "",
      question_count: 0,
      duration_seconds: 0,
      questions: [],
      status : "pending"
    } )
    setActiveSession({ 
        session_id: "",
      kind: "peer",
      mode: "exam",
      track_type:  profile === "aspirant" ?  "subject" : "courses",
      submit_deadline : "",
      subjectId : "",
      question_count: 0,
      duration_seconds: 0,
      questions: [],
      status : "pending"
    })
  }
 if (result) {
  const reviewAnswers = result.answers ?? [];

  const normalizeLetter = (
    value: string | null | undefined,
  ) => value?.trim().toUpperCase() ?? "";

 // console.log(notification)


  
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper dark:bg-ink">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-paper-line px-5 py-4 dark:border-ink-line">
        <div>
          <h2 className="font-display text-[20px]">
            {showReview ? "Answer review" : "Round complete"}
          </h2>

          <p className="mt-1 text-[12.5px] text-current/55">
            {result.correct} of {result.total} correct
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            onFinish(result)
            resetFields()
          } }
          className="focus-gold rounded-sm border
           border-gold-400 px-4 py-2 text-[13px] font-medium text-gold-600 dark:text-gold-300"
        >
          Done
        </button>
      </div>

      {/* Scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-6">
        <div
          className={`mx-auto w-full ${
            showReview ? "max-w-2xl" : "max-w-sm"
          }`}
        >
          {/* Score summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-gold-400/40 bg-gold-400/5">
              <span className="font-display text-[28px] text-gold-600 dark:text-gold-300">
                {result.score_percent ?? 0}%
              </span>
            </div>

            <h3 className="mt-5 font-display text-[22px]">
              {session.mode === "exam"
                ? "Exam complete"
                : "Practice complete"}
            </h3>

            <p className="mt-2 text-[14px] text-current/60">
              You answered {result.correct} of {result.total}{" "}
              questions correctly.
            </p>

            <button
              type="button"
              onClick={() => setShowReview((previous) => !previous)}
              disabled={reviewAnswers.length === 0}
              className="focus-gold mt-6 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3 text-[14px] font-semibold text-ink shadow-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              {showReview ? "Hide answer review" : "Review answers"}
            </button>

            {reviewAnswers.length === 0 && (
              <p
                role="status"
                className="mt-3 text-[12.5px] text-current/50"
              >
                No answer review was included in this submission
                response.
              </p>
            )}
          </motion.div>

          {/* Question-by-question review */}
          {showReview && (
            <div className="mt-10 flex flex-col gap-6">
              {reviewAnswers.map((answer, questionIndex) => {
                const selectedLetter = normalizeLetter(
                  answer.selected_option,
                );

                const correctLetter = normalizeLetter(
                  answer.correct_option,
                );

                const unanswered = selectedLetter === "";

                return (
                  <section
                    key={answer.question_id}
                    className="rounded-sm border border-paper-line p-4 sm:p-5 dark:border-ink-line"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[12px] font-medium uppercase tracking-wide text-current/45">
                        Question {questionIndex + 1}
                      </span>

                      <span
                        className={`text-[12.5px] font-medium ${
                          unanswered
                            ? "text-current/50"
                            : answer.is_correct
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {unanswered
                          ? "Unanswered"
                          : answer.is_correct
                            ? "Correct"
                            : "Incorrect"}
                      </span>
                    </div>

                    <h4 className="mt-3 whitespace-pre-wrap font-display text-[18px] leading-relaxed">
                      {answer.prompt}
                    </h4>

                    <div className="mt-5 flex flex-col gap-2.5">
                      {answer.options.map((option) => {
                        const letter = normalizeLetter(option.label);

                        const isSelected =
                          selectedLetter !== "" &&
                          selectedLetter === letter;

                        const isCorrect =
                          correctLetter !== "" &&
                          correctLetter === letter;

                        const isWrongSelection =
                          isSelected && !isCorrect;

                        return (
                          <div
                            key={option.label}
                            className={`flex items-start gap-3 rounded-sm border px-3 py-3 ${
                              isCorrect
                                ? "border-green-500/60 bg-green-500/10"
                                : isWrongSelection
                                  ? "border-red-500/60 bg-red-500/10"
                                  : "border-paper-line dark:border-ink-line"
                            }`}
                          >
                            <span className="text-[13.5px] font-medium text-current/60">
                              {option.label}.
                            </span>

                            <div className="min-w-0 flex-1">
                              <p className="whitespace-pre-wrap text-[14px] leading-relaxed">
                                {option.text}
                              </p>

                              {(isSelected || isCorrect) && (
                                <p className="mt-1 text-[11.5px] text-current/60">
                                  {isSelected && isCorrect
                                    ? "Your answer · Correct answer"
                                    : isCorrect
                                      ? "Correct answer"
                                      : "Your answer"}
                                </p>
                              )}
                            </div>

                            {isCorrect ? (
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                            ) : isWrongSelection ? (
                              <X className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                            ) : null}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 border-t border-paper-line pt-4 dark:border-ink-line">
                      <p className="text-[12.5px] text-current/60">
                        Your answer:{" "}
                        {answer.selected_option || "Unanswered"}
                        <span className="mx-2">·</span>
                        Correct answer:{" "}
                        {answer.correct_option || "Unavailable"}
                      </p>

                      <h5 className="mt-4 text-[13px] font-medium">
                        Explanation
                      </h5>

                      <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-current/70">
                        {answer.explanation?.trim() ||
                          "No explanation is available for this question."}
                      </p>
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-paper-line px-5 py-4 dark:border-ink-line">
        <button
          type="button"
          onClick={() => {
            onFinish(result)
             resetFields()
          }}
          className="focus-gold mx-auto block w-full max-w-sm rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3 text-[14px] font-semibold text-ink shadow-gold"
        >
          Done
        </button>
      </div>
    
      {waitingRoom === true && sessionStatus === "running" && session?.kind !== "solo" ?  (
  <SessionWaitingRoom
    sessionId={acceptedSession?.session_id ?? recipientSession?.session_id ?? ""}
    submitDeadline={session?.submit_deadline ?? null}
    sessionKind={session?.kind ?? "peer"}
    completedParticipants={participantsSessionCompleted}
    totalParticipants={totalParticipants}
      sessionStatus ={sessionStatus}
    onSessionCompleted={() => {
      setWaitingRoom(false);
      showResultForSession(session?.session_id);
    }}
  
  />
) :  (
  <SessionResultPopUp
  notificationValue = {notification}
    onClose={() => setNotification(null)}
    onViewAnalysis={() => {
     setNotification(null);
      // Handle view analysis logic here
    }}

  />
)}
    </div>
  );
}

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper dark:bg-ink">
      <div className="flex items-center justify-between border-b border-paper-line px-5 py-4 dark:border-ink-line">
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit session"
          className="focus-gold flex h-9 w-9 items-center justify-center rounded-full text-current/50 hover:text-current"
        >
          <X className="h-5 w-5" onClick={onExit} />
        </button>

        <div className="text-[13.5px] font-medium text-current/70">
          Question {index + 1} of {questions.length}
        </div>

        <div className="flex items-center gap-3">
          {session.mode === "exam" ? (
            <span className="flex items-center gap-1.5 text-[13.5px] font-medium text-gold-600 dark:text-gold-300">
              <Clock className="h-4 w-4" strokeWidth={1.8} />
              {formatTime(secondsLeft)}
            </span>
          ) : null}

          <button
            type="button"
            onClick={() => setShowJump((value) => !value)}
            aria-label="Jump to question"
            className="focus-gold flex h-9 w-9 items-center justify-center rounded-full text-current/50 hover:text-current"
          >
            <Grid3x3 className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {showJump ? (
        <div className="border-b border-paper-line bg-paper-soft px-5 py-4 dark:border-ink-line dark:bg-ink-soft">
          <div className="flex flex-wrap gap-2">
            {questions.map((question, questionIndex) => {
              const answered = Boolean(answers[question.id]);
              const isCurrent = questionIndex === index;

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => goTo(questionIndex)}
                  className={`focus-gold flex h-9 w-9 items-center justify-center rounded-sm border text-[12.5px] font-medium transition-colors ${
                    isCurrent
                      ? "border-gold-400 bg-gold-metal-soft text-ink"
                      : answered
                        ? "border-gold-400/40 bg-gold-400/10 text-gold-600 dark:text-gold-300"
                        : "border-paper-line text-current/55 dark:border-ink-line"
                  }`}
                >
                  {questionIndex + 1}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-10 md:items-center">
        <div className="w-full max-w-xl">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-[12px] font-medium uppercase tracking-wide text-current/40">
              Question {index + 1}
            </p>

            <h2 className="mt-2 font-display text-[19px] leading-snug sm:text-[21px]">
              {current.prompt}
            </h2>

            <div className="mt-7 flex flex-col gap-3">
              {currentOptions.map((option) => {
                const selected =
                  answers[current.id] === option.id;

                const isCorrectAnswer =
                  isPractice &&
                  hasRevealed &&
                  revealedAnswer === option.id;

                const isWrongSelection =
                  isPractice &&
                  hasRevealed &&
                  selected &&
                  revealedAnswer !== option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectOption(option.id)}
                    className={`focus-gold flex w-full cursor-pointer items-center gap-3 rounded-sm border px-4 py-3.5 text-left transition-colors ${
                      isCorrectAnswer
                        ? "border-green-500 bg-green-500/10"
                        : isWrongSelection
                          ? "border-red-500 bg-red-500/10"
                          : selected
                            ? "border-gold-400 bg-gold-400/5"
                            : "border-paper-line hover:border-current/30 dark:border-ink-line"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? "border-gold-400 bg-gold-metal-soft"
                          : "border-current/30"
                      }`}
                    >
                      {selected ? (
                        <Check
                          className="h-3 w-3 text-ink"
                          strokeWidth={3}
                        />
                      ) : null}
                    </span>

                    <span className="text-[14.5px]">
                      <span className="mr-2 font-medium text-current/50">
                        {option.id}.
                      </span>
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {isPractice && hasRevealed ? (
              <div className="mt-6 rounded-sm border border-paper-line bg-paper-soft p-4
               dark:border-ink-line dark:bg-ink-soft">
                <div className="flex flex-wrap items-center gap-2">
                  {answers[current.id] === revealedAnswer ? (
                    <span className="flex items-center gap-1.5 text-[13px] font-medium text-green-600 dark:text-green-400">
                      <Check
                        className="h-4 w-4"
                        strokeWidth={2.5}
                      />
                      Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[13px] font-medium text-red-500">
                      <X className="h-4 w-4" strokeWidth={2.5} />
                      Incorrect
                    </span>
                  )}

                  <span className="text-[12.5px] text-current/50">
                    Correct answer: {revealedAnswer}
                  </span>
                </div>

                {current.explanation ? (
                  <p className="mt-3 text-[14px] leading-relaxed text-current/70">
                    {current.explanation}
                  </p>
                ) : (
                  <p className="mt-3 text-[13.5px] text-current/50">
                    No explanation is available for this question.
                  </p>
                )}
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-paper-line px-5 py-4 dark:border-ink-line">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="focus-gold rounded-sm border border-paper-line px-5 py-2.5 text-[13.5px] font-medium text-current/70 transition-colors hover:border-current/30 disabled:cursor-not-allowed disabled:opacity-40 dark:border-ink-line"
        >
          Previous
        </button>

        <span className="text-[12.5px] text-current/40">
          {answeredCount}/{questions.length} answered
        </span>

        {index === questions.length - 1 ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="focus-gold rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-2.5 text-[13.5px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="focus-gold rounded-sm border border-paper-line px-5 py-2.5 text-[13.5px] font-medium text-current/70 transition-colors hover:border-current/30 dark:border-ink-line"
            >
              Skip
            </button>

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="focus-gold rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-2.5 text-[13.5px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.02]"
            >
              Next
            </button>
          </div>
        )}
      </div>
    
    </div>
    
  );
  

}