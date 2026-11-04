"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Book, Lock, Network, User, Users } from "lucide-react";

import { Button } from "@components/Button";
import { useStatusToast } from "@/components/ui/status-toast";
import { useGlobalContext } from "../../../../../../../../Context";
import {  SoloModeModal, InvitePeerOverlay, SoloTrackModal, TimingHeadsUpModal, CbtRunnerOverlay, PendingPeerInvites}
 from "@/components/study";
import   { type usermetadata} from "@/types/UserTypes";
import {  StartedSession, SubmissionResult } from "@/lib/study/cbt-api";
import { CbtMode, CbtTrack,  } from "@/lib/study/types";
import {type SessionNotification} from "@components/SessionResultPopUp";
import { createClient} from "@lib/supabase/client";
import {getPeerSession,  startPeerSession, startCbtSession} from "@lib/study/cbt-api";
import CBTPage from "@components/CBT/CBTPage";
import type { StudentCourse } from "@components/CBT/cbt-types";





const supabase = createClient();

const StudyCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { showToast } = useStatusToast();
  const [activeSession, setActiveSession] = useState<StartedSession | null>()
  const { acceptedSession, 
    setAcceptedSession, course, setCourse, recipientSession, setRecipientSession, setNotification} = useGlobalContext();
    const [starting, setStarting] = useState(false)
    const [runnerOpen, setRunnerOpen] = useState(false);
    const [modal, setModal] = useState("none");
    const [inviteOpen, setInviteOpen] = useState<boolean>(false)
  
  const [multiplayerAvailable, setMultiplayerAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
     const [runnerMode, setRunnerMode] = useState<CbtMode>("practice");
    const [lastResult, setLastResult] = useState<SubmissionResult>({} as SubmissionResult);
   
  const [userIdTransfer, setUserIdTransfer] = useState<string>("");
  const [userInfoAuth, setUserInfoAuth] = useState<usermetadata>({} as usermetadata);




  // THE EFFECT IS USED TO CALL THE SESSION-NOTIFICATION AND REFRESH THE CBT_SESSIONS FOR ANY POSSIBLE PENDING INVITES MADE======///
  
    useEffect(() => {

      async function promiseWrapper(){
          const { data, error } = await supabase.auth.getUser();
          async function getUserInfoAuth(){
       if(data?.user?.user_metadata?.account_verification?.current_college) {
      //dataInfo =  data?.user?.user_metadata
      setUserInfoAuth(data?.user?.user_metadata?.account_verification?.current_college);
      setUserIdTransfer(data?.user?.id)
    }
    if (error) {
      console.error(error);
    } else {
     // setUserInfoAuth(false);
    }
    }
    getUserInfoAuth()
  

    if(recipientSession?.session_id 
      && recipientSession?.kind === "peer" && recipientSession?.status === "ready") {
    const response = await getPeerSession(
      supabase,
      recipientSession?.session_id
    )
    if(response){
      setRunnerOpen(true);
      setRecipientSession(response)
    }
    console.log(response)
    
      }
    }
  promiseWrapper();
  
  
  setAcceptedSession( { 
          session_id: "",
        kind: "peer",
        mode: "exam",
        track_type: "courses",
        submit_deadline : "",
        subjectId : "",
        question_count: 0,
        duration_seconds: 0,
        questions: [],
        status : "pending"
      } )
  setRecipientSession( { 
          session_id: "",
        kind: "peer",
        mode: "exam",
        track_type: "courses",
        submit_deadline : "",
        subjectId : courseId,
        question_count: 0,
        duration_seconds: 0,
        questions: [],
        status : "pending"
      } )
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/student/cbt/courses", {
          credentials: "same-origin",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? "Unable to load this course.");
        }

        const matchedCourse = result.courses?.find(
          (item: { id: string }) => item.id === courseId,
        );

        if (!matchedCourse) {
          throw new Error("This course is not available for your profile.");
        }

        setCourse(matchedCourse);
        setMultiplayerAvailable(
          result.multiplayer_session?.course_id === courseId,
        );
      } catch (error) {
        showToast({
          kind: "error",
          title: "Course error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to load this course.",
        });
      } finally {
        setLoading(false);
      }
    };

    void loadCourse();
  }, [courseId, showToast]);

   //CHECKING RESULT AFTERWARDS
  
  useEffect(() => {
    if (!userIdTransfer) return;
  
    const channel = supabase
      .channel(`session-results:${userIdTransfer}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "session_notifications",
          filter: `user_id=eq.${userIdTransfer}`,
        },
        (payload: { new: SessionNotification }) => {
          setNotification(payload.new as SessionNotification);
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userIdTransfer, runnerOpen]);

  const startSession = async (kind: "solo" | "peer" | "multiplayer") => {
    try {
//   const {data : coursesQuestions, 
//     error : coursesQuestionsError} = await supabase.from("questions_courses")
//   .select("id, course_id, question_text, options, explanation, subquestions")
//   .eq("course_id",  courseId)

//   if(coursesQuestionsError){
//     showToast({
//         kind : "error",
//         title : "Course Questions Error",
//         message : coursesQuestionsError.message || "Error fetching course questions"
//     })
//   }
//   if(coursesQuestions){
//     showToast({
//         kind : "success",
//         title : "Questions Available",
//         message : "Let's start your CBT session now."
//     })
//   }



      const response = await fetch(`/api/student/cbt/session`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind,
          course_id: courseId,
          mode: kind === "peer" ? "exam" : "practice",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to start this session.");
      }
if(response.ok){
      showToast({
        kind: "success",
        title: kind === "solo" ? "Solo session ready" : "Peer session created",
        message:
          kind === "solo"
            ? "Your CBT session is ready."
            : "Invite a coursemate to join your session.",
      });

    }
    } catch (error) {
      showToast({
        kind: "error",
        title: "Session error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to start this session.",
      });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-paper-soft px-6 py-16 dark:bg-ink dark:text-paper">
        Loading course sessions…
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-paper-soft px-6 py-16 dark:bg-ink dark:text-paper">
        Course not available.
      </main>
    );
  }

  //==================== |THE SESSION CODE HANDLING MIGHT BE ROUGH BUT THIS IS THE MVP; NO TIME !!! | =============================\\

  
  
  
  
  
  
  
  
 
  
  
    const closeAll = () => setModal("none");
   const closeSoloTrack = ()=> setModal("timing")
    // const handleStudyContinue = (slug: string) => {
    //   closeAll();
    //   router.push(`/dashboard/aspirant/study/materials/${slug}`);
    // };
  
    const handleChooseSolo = () => setModal("solo-mode");
  //hnadling the pick of a TRACK, EITHER RACTICE OR  
  const handleSoloTrackSelected = async ({mode} : {mode ?: "exam" | "practice"}) => {
    setStarting(true);
  //alert("You found me he he he")
    try {
      const session = await startCbtSession(supabase, {
        kind: "solo",
        mode: mode || "practice",
        trackType: "courses",
      
        courseId : courseId || null,
      //  topicId: selection.topicId || "",
    
        questionCount: 30,
      });
   //   console.log(session)
  
      setActiveSession(session);
     // setModal("timing");
      console.log(modal);
  
     // setRunnerMode("practice");
      
    } catch (error) {
    //  console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Could not prepare this CBT session.",
      );
    } finally {
      setStarting(false);
    }
  };
  
    //HANDLE SOLO PICK 
    const handleChoosePeer = () => {
      setModal("none");
      setInviteOpen(true);
    };
  
  // const StatusCheck = async(sessionId : string)=> {
        
  //    const loaded = await getPeerSession(
  //   supabase,
  //   sessionId
  // );
  
  // setAcceptedSession(loaded);
  // if(loaded?.status === "running"){
  //   setRunnerOpen(true);
  // }
  // }
  
  const handleSoloPick = async (params: {
    trackType: CbtTrack;
    subjectId: string | null;
    topicId: string | null;
    subjectIds: string[] | null;
    mode: CbtMode;
    questionCount: number;
  }) => {
    try {
  
      const started = await startCbtSession(supabase, {
        kind: "solo",
        mode: params.mode,
        trackType: params.trackType,
        subjectId: params.subjectId?.toLowerCase() || "",
        topicId: params.topicId,
        subjectIds: params.subjectIds,
  
        questionCount: params.questionCount,
        durationSeconds:
          params.mode === "exam" ? 600 : 1800,
      });
  
      setActiveSession({
        session_id: started.session_id,
    
        kind: "solo",
        subjectId : started?.subjectId,
        mode: started.mode,
        track_type: started.track_type,
        question_count: started.question_count,
        duration_seconds: started.duration_seconds,
        questions: started.questions,
      });
  //alert(activeSession?.questions);
  if(started){
      setRunnerOpen(true);
  }
      
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Could not start this session.",
      );
    }finally{
    //  setModal("none")
    }
  };
  
    const handleInviteProceed = (accepted: StartedSession & {status : string} ) => {
      setInviteOpen(false);
   // setRunnerSubject(accepted.subject);
      setRunnerMode("exam"); // peer sessions are always exam mode
      setModal("timing");
      setAcceptedSession(accepted as unknown as StartedSession & {status : string})
    
    };
  
  const handleStart = async () => {
   
   // if (!acceptedSession) return;
    //console.log(activeSession)
    //alert("I am running here too oooo")

    if(activeSession?.kind === "solo" && activeSession?.session_id?.length > 1){
        setRunnerOpen(true)
    }
    try {
      
      if (acceptedSession && acceptedSession?.session_id?.length > 1) {
        const started = await startPeerSession(
          supabase,
          acceptedSession.session_id,
        );
  
        setAcceptedSession({
          ...acceptedSession,
          status: "running",
       // started_at : started?.started_at,
          submit_deadline: started.submit_deadline,
        } );
        console.log("Peer session started:", started);
       if(!started?.status){
        showToast({
          kind : "error",
          title : "Peer Session Error",
          message : "An Error Occured While Starting the Peer Session"
        })
        
       }
     if(started?.status === "running"){
        setModal("none")
      setRunnerOpen(true);
     
      
      
     }
      
      }else if(recipientSession?.kind === "peer" && recipientSession?.session_id){
        const getSession = await getPeerSession(
          supabase,
          recipientSession?.session_id
        )
        console.log(getSession?.status)
     setRecipientSession(getSession);
        if(getSession?.status === "running"){
            setRunnerOpen(true);
            console.log(runnerOpen);
            
        }else{
          showToast({
            kind : "error",
            title : "The Peer Session Error",
            message : `The Host has not started the Peer Session,
             you would be notified when the host starts the session`
          })
        }
      }
   } catch (error) {
      console.error(error);
     showToast({
      kind : "error",
      title :  "Peer Session Error",
      message : "An Error Occured While Starting the Peer Session"
     })
   
    
  };
  }
    const handleRunnerFinish = (result: SubmissionResult) => {
      setLastResult(result);
      setRunnerOpen(false);
      setAcceptedSession( { 
          session_id: "",
        kind: "peer",
        mode: "exam",
        track_type: "subject",
        submit_deadline : "",
        subjectId : "",
        question_count: 0,
        duration_seconds: 0,
        questions: [],
        status : "pending"
      } )
  setRecipientSession( { 
          session_id: "",
        kind: "peer",
        mode: "exam",
        track_type: "subject",
        submit_deadline : "",
        subjectId : "",
        question_count: 0,
        duration_seconds: 0,
        questions: [],
        status : "pending"
      } )
      setActiveSession(null);
    };
  

console.log(userIdTransfer);



  return (
    <main className="min-h-screen bg-paper-soft px-4 py-10 sm:px-6 lg:px-10 dark:bg-ink dark:text-paper">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() =>
            router.push("/dashboard/undergraduate/cbt")
          }
          className="text-sm font-medium bg-gold-metal-soft py-3 px-5 rounded-md 
          text-ink dark:text-paper-surface text-ink/60 hover:text-ink 
           dark:text-paper/60 dark:hover:text-paper"
        >
          Back to courses
        </button>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700 dark:text-gold-200">
            {course.course_code}
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {course.course_title}
          </h1>

          <p className="mt-3 text-sm text-ink/65 dark:text-paper/65">
            Choose how you want to study this course.
          </p>
        </header>

        <section className="mt-10 grid gap-4">
          <div className="rounded-2xl border border-paper-line bg-paper p-6 dark:border-ink-line dark:bg-ink-soft">
            <div className="flex items-center  gap-4 justify-start">
              <div className="flex h-12 w-12 p-4 items-center justify-center rounded-xl bg-gold-metal-soft">
                <User className="h-5 w-5 text-ink " />
              </div>

              <div>
                <h2 className="text-xl font-bold">Solo</h2>

                <p className="mt-1 text-sm text-ink/65 font-medium
                 dark:text-paper/65">
                  Practise at your own pace or simulate a timed exam.
                </p>
              </div>
            </div>

            <Button
              className="mt-6 w-full rounded-md"
              text="Start solo session"
              type="button"
              onClick={() => {
                setModal("solo-track")
                
              }}
            />
          </div>

          <div onClick={()=> {
            handleChoosePeer()
          }}
          className="rounded-2xl border border-paper-line bg-paper p-6 dark:border-ink-line dark:bg-ink-soft">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 p-4 items-center justify-center rounded-xl bg-gold-metal-soft">
                <Users className="h-5 w-5 text-ink " />
              </div>

              <div>
                <h2 className="text-xl font-bold">Peer</h2>

                <p className="mt-1 text-sm text-ink/65 dark:text-paper/65">
                  Invite a coursemate and compete in the same timed round.
                </p>
              </div>
            </div>

            <Button
              className="mt-6 w-full rounded-md"
              text="Start peer session"
              type="button"
              onClick={() => {
                // startSession("peer")
                 setModal("cbt-mode")
              }}
            />
          </div>

          <div className="rounded-2xl border border-paper-line bg-paper p-6 dark:border-ink-line dark:bg-ink-soft">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 p-4 items-center justify-center
               rounded-xl bg-gold-metal-soft">
                <Users className="h-5 w-5 text-ink" />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Multiplayer
                </h2>

                <p className="mt-1 text-sm text-ink/65 dark:text-paper/65">
                  Multiplayer sessions are created by your host. You will be
                  notified when you are invited.
                </p>
              </div>
            </div>

            <Button
              className="mt-6 w-full rounded-md"
              text={
                multiplayerAvailable
                  ? "Open multiplayer invitation"
                  : "Multiplayer locked"
              }
              type="button"
              disabled={!multiplayerAvailable}
              onClick={() => {
                if (!multiplayerAvailable) {
                  showToast({
                    kind: "info",
                    title: "Multiplayer locked",
                    message:
                      "You will be notified when your host invites you.",
                  });
                }
              }}
            />
          </div>
        </section>
      </div>


              <TimingHeadsUpModal
                    open={modal === "timing"}
                    onClose={closeAll}
                    onStart={handleStart}
                    questionCount={activeSession !== null && activeSession?.question_count &&
                         activeSession?.question_count > 0  ? 
                      activeSession?.question_count
                      : acceptedSession && acceptedSession?.question_count > 0 ?
                        acceptedSession?.question_count  :  recipientSession &&recipientSession?.question_count > 0 ? recipientSession?.question_count : 0}
                    minutes={
                       acceptedSession?.kind === "peer" && acceptedSession?.duration_seconds > 0
                        ? acceptedSession?.duration_seconds / 60 
                         : recipientSession?.kind === "peer" && recipientSession?.duration_seconds > 0 
                        ? recipientSession?.duration_seconds / 60 : 0}
                  />
            
                  <InvitePeerOverlay
                    open={inviteOpen}
                    onClose={() => setInviteOpen(false)}
                    onProceed={handleInviteProceed}
                    profile={"undergraduate"}
                  // StatusCheck ={()=> StatusCheck}
                  />
            
               <CbtRunnerOverlay
              open={runnerOpen}
              session={activeSession && activeSession.session_id?.length > 1 ? activeSession : 
                acceptedSession?.status === "running" && acceptedSession?.kind === "peer" ? acceptedSession :
                 acceptedSession?.status !== "running" && recipientSession?.kind === "peer" && recipientSession?.status === "running" ? recipientSession : null  }
              onExit={() => setRunnerOpen(false)}
              submitDeadline = {activeSession?.kind === "solo" ? activeSession.submit_deadline : 
                acceptedSession?.status === "running" && acceptedSession.kind === "peer" ? acceptedSession.submit_deadline :
                 acceptedSession?.status !== "running" && recipientSession?.kind === "peer" && recipientSession?.status === "running" ? recipientSession?.submit_deadline : null  }
              onFinish={()=> handleRunnerFinish(lastResult )}
              userId = {userIdTransfer}
            />

               <SoloModeModal
               profile = {"undergraduate"}
                    open={modal === "solo-mode" && runnerMode === "practice"}
                    onClose={()=> {
                      setModal("none")
                      setRunnerOpen(true)
                    }}
            
                    subjects={[]}
                    topics={[]}
                    onPick={handleSoloPick}
                  />
            <SoloTrackModal
            profile = {"undergraduate"}
              open={modal === "solo-track"}
              onClose={closeSoloTrack}
              subjects={[]}
              topics={[]}
              combinations={[]}
              onStart={handleSoloTrackSelected}
            />
            <PendingPeerInvites
              userId = {userIdTransfer}
              onAccepted={(session) => {
                setRecipientSession(session);
                setRunnerMode("exam");
                setModal("timing");
              }}
              setRunningSession={setRunnerOpen}
              
            
                // In the next step, replace this with a dedicated
                // get_peer_session(sessionId) RPC so the invitee receives
                // the exact same question snapshot without creating a new session.
              
            />
       
            
    </main>
  );
};

export default StudyCoursePage;