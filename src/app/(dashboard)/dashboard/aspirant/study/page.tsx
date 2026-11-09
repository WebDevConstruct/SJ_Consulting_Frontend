"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BookOpenCheck, Loader2, ScrollText } from "lucide-react";
import { GlossyCard } from "@/components/study/glossy-card";
import { SubjectSelectModal } from "@/components/study/subject-select-modal";
import { CbtModeModal } from "@/components/study/cbt-mode-modal";
import  SoloModeModal  from "@/components/study/solo-mode-modal";
import { TimingHeadsUpModal } from "@/components/study/timing-heads-up-modal";
import {InvitePeerOverlay}  from "@/components/study/invite-peer-overlay";
import { CbtRunnerOverlay } from "@/components/study/cbt-runner-overlay";
import { startCbtSession, type StartedSession, SubmissionResult, startPeerSession, getPeerSession } from "@/lib/study/cbt-api";
import type { CbtMode, PeerSession, CbtTrack } from "@/lib/study/types";
import { AccountCompletionRequired } from "@/components/SettingUpModals/AccounCompletionRequired";
import { createClient } from "@/lib/supabase/client";
import  {type SubjectOption, type TopicOption, type CombinationOption, SoloTrackModal}  from "@/components/study/SoloTrackModal"
import { PendingPeerInvites } from "@/components/study/pending-peer-invites";
import { usermetadata } from "@/types/UserTypes";
import {useGlobalContext} from "../../../../../../Context"
import {useStatusToast} from "@/components/ui/status-toast";
import {useSessionResultPopUp} from "@components/useSessionResultPopUp";
import SessionResultPopUp, {type SessionNotification } from "@/components/SessionResultPopUp";
type Modal =
  | "none"
  | "subject-select"
  | "cbt-mode"
  | "solo-mode" | 
  "solo-track" 
  | "timing";




export default function StudyHubPage() {
  const supabase = createClient();
  const {showToast} = useStatusToast();
  
const [subjects, setSubjects] = useState<SubjectOption[]>([]);
const [topics, setTopics] = useState<TopicOption[]>([]);
const [combinations, setCombinations] = useState<CombinationOption[]>([]);
const [starting, setStarting] = useState(false);
const [activeSession, setActiveSession] = useState<StartedSession | null >(null);

  const router = useRouter();
  


  const [modal, setModal] = useState<Modal>("none");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [runnerOpen, setRunnerOpen] = useState(false);

  const [runnerMode, setRunnerMode] = useState<CbtMode>("practice");
  const [lastResult, setLastResult] = useState<SubmissionResult>({} as SubmissionResult);
  const {acceptedSession, setAcceptedSession, recipientSession, setRecipientSession, setNotification} = useGlobalContext()
const [userIdTransfer, setUserIdTransfer] = useState<string>("");
const [userInfoAuth, setUserInfoAuth] = useState<usermetadata>({} as usermetadata);






  useEffect(() => {
    async function promiseWrapper(){
        const { data, error } = await supabase.auth.getUser();
        async function getUserInfoAuth(){
     if(data?.user?.user_metadata?.account_verification?.desired_college) {
    //dataInfo =  data?.user?.user_metadata
    setUserInfoAuth(data?.user?.user_metadata?.account_verification?.desired_college);
    setUserIdTransfer(data?.user?.id)
  }
  if (error) {
    console.error(error);
  } else {
   // setUserInfoAuth(false);
  }
  }
  getUserInfoAuth()

  const loadStudyOptions = async () => {
    //THE USER ONLY SUBJECTS OF STUDY IS HIS / HER SUBJECT COMBINATION

    //const {data, error} = await supabase?.auth?.getUser()
const subjectsResult
 : string[] =  data?.user?.user_metadata?.account_verification?.subject_combination;

const subjectsResultsFormat : SubjectOption[]
 = subjectsResult?.map((item : string, subId)=> ({
  id :  (item === "Financial Acounting" ? "accounting" :  item?.toLowerCase()) || "",
  name : item,
 // description : `This ${item} covers only past questions`
}))
    if (subjectsResultsFormat) {
      setSubjects(subjectsResultsFormat);
    }

    // if (topicsResult.data) {
    //   setTopics(topicsResult.data);
    // }
   // getUserInfoAuth()
  };

  loadStudyOptions();
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
  //eslint-disable-next-line
}, []);


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


  const closeAll = () => setModal("none");

  const handleStudyContinue = (slug: string) => {
    closeAll();
    router.push(`/dashboard/aspirant/study/materials/${slug}`);
  };

  const handleChooseSolo = () => setModal("solo-mode");
//hnadling the pick of a TRACK, EITHER RACTICE OR  
const handleSoloTrackSelected = async (selection: {
  trackType: CbtTrack;
  subjectId?: string | null;
  topicId?: string | null;
  subjectIds?: string[] | null;
}) => {
  setStarting(true);
//alert("You found me he he he")
  try {
    alert("RUNNING");
    const session = await startCbtSession(supabase, {
      kind: "solo",
      mode: runnerMode,
      trackType: selection.trackType,
      subjectId: selection.subjectId ,
      topicId: selection.topicId,
      subjectIds: selection.subjectIds,
      questionCount: 60,
    });
 //   console.log(session)
// if(!session){
//    showToast({
//     kind : "error",
//     title : "Error Starting Session",
//     message :  "An Error Occured While Starting the Session, Please Try Again"
//   })
// }
    setActiveSession(session);

   // setRunnerMode("practice");
    setModal("solo-track");
  } catch (error) {
  //  console.error(error);
  showToast({
    kind : "error",
    title : "Error Starting Session",
    message :   error instanceof Error
        ? error.message :
         ""
  })
   
  } finally {
   // setStarting(false);
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
 
alert("RUNNING");
  
  try {
    
    if (acceptedSession?.kind === "peer" && acceptedSession?.session_id?.length > 1) {
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

  


  return (
    <div className="px-6 py-10 md:px-12 md:py-14">
      <div className="h-[2px] w-12 bg-gold-metal" />
      <h1 className="mt-6 font-display text-[28px] leading-tight sm:text-[32px]">
        Study
      </h1>
      <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-current/65">
        Everything here opens as a quick step-by-step flow rather than a new
        page to hunt through: pick a card, answer a couple of short prompts,
        and you&rsquo;re straight into it. Topic materials open as their own
        page (with a way back to Study at the top); solo and peer practice
        rounds open full-screen so nothing distracts from the questions.
      </p>


   <div >
   {typeof userInfoAuth === "string" ? (
   <div>
   
    {lastResult ? (
        <div className="mt-6 max-w-lg rounded-sm border border-paper-line bg-paper-soft px-4 py-3 text-[13.5px] text-current/70 dark:border-ink-line dark:bg-ink-surface">
          Last round: {lastResult?.correct}/{lastResult?.total} (
          {lastResult?.score_percent}%)
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <GlossyCard
          icon={BookOpenCheck}
          title="Study"
          description="Pick a subject combination and open verified topic breakdowns, subject by subject."
          onClick={() => setModal("subject-select")}
        />
        <GlossyCard
          icon={ScrollText}
          title="Practice MCQs (CBT)"
          description="Solo or with a friend — leaderboard ranking and incentives, split by subject, topic or combination."
          onClick={() => setModal("cbt-mode")}
          delay={0.08}
        />
      </div>

      <SubjectSelectModal
        open={modal === "subject-select"}
        onClose={closeAll}
        onContinue={handleStudyContinue}
      />

      <CbtModeModal
        open={modal === "cbt-mode"}
        onClose={closeAll}
        onChooseSolo={handleChooseSolo}
        onChoosePeer={handleChoosePeer}
      />

      <SoloModeModal
      profile = {"aspirant"}
        open={modal === "solo-mode" && runnerMode === "practice"}
        onClose={()=> {
          setModal("none")
        //  setRunnerOpen(true)
        }}

        subjects={subjects}
        topics={topics}
        onPick={handleSoloPick}
      />

      <TimingHeadsUpModal
        open={modal === "timing"}
        onClose={closeAll}
        onStart={handleStart}
        questionCount={activeSession !== null &&activeSession?.question_count > 0  ? 
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
        profile = {"aspirant"}
      // StatusCheck ={()=> StatusCheck}
      />

   <CbtRunnerOverlay
   profile={"aspirant"}
  open={runnerOpen}
  session={activeSession && activeSession.session_id?.length > 1 ? activeSession : 
    acceptedSession?.status === "running" && acceptedSession?.kind === "peer" ? acceptedSession :
     acceptedSession?.status !== "running" && recipientSession?.kind === "peer" && recipientSession?.status === "running" ? recipientSession : null  }
  onExit={() => {
    setRunnerOpen(false);
    setAcceptedSession({} as StartedSession & {status : string});
    setRecipientSession({} as StartedSession & {status : string});
    setRunnerMode("practice")
  }}
  submitDeadline = {activeSession?.kind === "solo" ? activeSession.submit_deadline : 
    acceptedSession?.status === "running" && acceptedSession.kind === "peer" ? acceptedSession.submit_deadline :
     acceptedSession?.status !== "running" && recipientSession?.kind === "peer" && recipientSession?.status === "running" ? recipientSession?.submit_deadline : null  }
  onFinish={()=> handleRunnerFinish(lastResult )}
  userId = {userIdTransfer}
/>
<SoloTrackModal
profile = "aspirant"
  open={modal === "solo-track"}
  onClose={closeAll}
  subjects={subjects}
  topics={topics}
  combinations={combinations}
 // onStart={handleSoloTrackSelected}
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


    
    </div>
    
    ) : (
      <AccountCompletionRequired />
    )}
    </div>
    </div>
  )
}

