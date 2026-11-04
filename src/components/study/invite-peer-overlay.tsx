"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Users,
  X,
} from "lucide-react";
import { subjectCombinations } from "@/lib/study/mock-data";
import type { PacingMode, PeerSession, CbtTrack } from "@/lib/study/types";
import { TextField } from "../forms/text-field";

import { startCbtSession } from "@/lib/study/cbt-api";
import {
  createPeerInvite,
  cancelPeerInvite,
  type PeerInvite,
} from "@/lib/study/peer-api";
import { usermetadata } from "@/types/UserTypes";
import {  createClient} from "@lib/supabase/client";
import {useStatusToast} from "@components/ui/status-toast";
import {useGlobalContext} from "../../../Context";
import {StartedSession} from "@lib/study/cbt-api";

//import { peer}


interface InvitePeerOverlayProps {
  open: boolean;
  onClose: () => void;
  onProceed: (session: StartedSession & {status : string}) => void;
  profile : string
// StatusCheck : (sessionId : string)=> void
}






export function InvitePeerOverlay({
  open,
  onClose,
  onProceed,
  profile
 // StatusCheck
}: InvitePeerOverlayProps) {

//SUBJECT INITIALIZATION
  
const supabase = createClient();
const {showToast} = useStatusToast();
const {acceptedSession, setAcceptedSession, recipientSession,
   course, setCourse, courseId} = useGlobalContext();
//const [userStatus, setUserStatus] = useState<usermetadata>()
const [sessionId, setSessionId] = useState<string | null>(null);
const [invite, setInvite] = useState<PeerInvite | null>(null);
const [durationMinutes, setDurationMinutes] = useState(30);
const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"pending" | "accepted" | "invite" | "configure">("invite");
  const [identifier, setIdentifier] = useState("");
  const [track, setTrack] = useState<CbtTrack>("combination");
  const [pacing, setPacing] = useState<PacingMode>("self-paced");
  const [subjects, setSubjects] = useState<string[]>([])
  const [subject, setSubject] = useState<string>(subjects?.length ? subjects[0] : "");
  const [sending, setSending] = useState(false);

  // When the overlay (re)opens, resume wherever the persisted session is.
  const inviteId = invite?.id ?? null;

const getUserSubjects = async()=> {
 const {data, error} = await supabase?.auth?.getUser()
     setSubjects(data?.user?.user_metadata?.account_verification?.subject_combination)
    console.log(data?.user?.user_metadata?.account_verification)
     if(error){
        showToast({
          kind : "error",
          title : "Subject Retrieval Error",
          message : "The System was unable to retrieve your subject list"
        })
       }
}

useEffect(()=> {
   async function promiseWrapper(){
   await  getUserSubjects()
    }
    promiseWrapper()
    //eslint-disable-next-line
}, [])
useEffect(() => {
  if (!sessionId || !inviteId) return;
    async function promiseWrapper(){
   await  getUserSubjects()
    }
    promiseWrapper()
  let disposed = false;
  let refreshVersion = 0;

  const refreshPeerStatus = async () => {
    const version = ++refreshVersion;

    const [inviteResponse, sessionResponse] = await Promise.all([
      supabase
        .from("cbt_peer_invites")
        .select("*")
        .eq("id", inviteId)
        .single(),

      supabase
        .from("cbt_sessions")
        .select("id, status")
        .eq("id", sessionId)
        .single(),
    ]);

    if (disposed || version !== refreshVersion) return;

    const latestInvite =
      inviteResponse.data as PeerInvite | null;

    const latestSession = sessionResponse.data;

    if (latestInvite) {
      setInvite(latestInvite);
    }

    // The acceptance RPC updates both records.
    // Either readable record can confirm acceptance.
    if (
      latestSession?.status === "ready" ||
      latestInvite?.status === "accepted"
    ) {
      setStep("accepted");
      setError(null);
      return;
    }

    if (latestSession?.status === "running") {
      setError(
        "This session has already started. Rejoin it from your active session screen.",
      );
      return;
    }

    const invitationStatus = latestInvite
      ? String(latestInvite.status)
      : null;

    if (
      invitationStatus === "expired" ||
      invitationStatus === "declined" ||
      invitationStatus === "rejected" ||
      invitationStatus === "cancelled" ||
      invitationStatus === "canceled"
    ) {
      setError(
        invitationStatus === "expired"
          ? "This invitation expired."
          : "This invitation is no longer available.",
      );

      setSessionId(null);
      setInvite(null);
      setStep("invite");
      return;
    }

    if (inviteResponse.error || sessionResponse.error) {
      setError(
        inviteResponse.error?.message ??
          sessionResponse.error?.message ??
          "Could not refresh the peer session.",
      );
      return;
    }

    setError(null);
  };

  const channel = supabase
    .channel(`peer-host-${sessionId}-${inviteId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "cbt_peer_invites",
        filter: `id=eq.${inviteId}`,
      },
      () => {
        void refreshPeerStatus();
      },
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "cbt_sessions",
        filter: `id=eq.${sessionId}`,
      },
      () => {
        void refreshPeerStatus();
      },
    )
    .subscribe((status) => {
      if (disposed) return;

      if (status === "SUBSCRIBED") {
        void refreshPeerStatus();
      }

      if (
        status === "CHANNEL_ERROR" ||
        status === "TIMED_OUT"
      ) {
        setError(
          "Live updates are temporarily unavailable. Reopen this screen to refresh the invitation.",
        );
      }
    });

  // Check for acceptance that occurred before subscription.
  void refreshPeerStatus();

  const handleFocus = () => {
    void refreshPeerStatus();
  };

  window.addEventListener("focus", handleFocus);

  return () => {
    disposed = true;

    window.removeEventListener("focus", handleFocus);
    void supabase.removeChannel(channel);
  };
}, [sessionId,  inviteId, open, supabase]);

  if (!open) return null;

 const handleSendRequest = async () => {
  setSending(true);
  setError(null);

  try {
    const session = await startCbtSession(supabase, {
      kind: "peer",
      mode: "exam",
      trackType: track,
      subjectId: profile === "aspirant" ? 
      (subject === "Financial Acounting" ? "accounting" : subject?.toLowerCase()) || "" : null,
      courseId : course?.id|| null,
      questionCount: 30,
      durationSeconds: durationMinutes * 60,
    });


   setAcceptedSession({
  ...session,
  status : "pending",
  questions: session.questions ?? [],
});


    setSessionId(session.session_id);

    const createdInvite = await createPeerInvite(
      supabase,
      session.session_id,
      identifier,
      15,
    );

    setInvite(createdInvite);
    setStep("pending");
  } catch (inviteError) {
    setError(
      inviteError instanceof Error
        ? inviteError.message
        : "Could not send the peer invitation.",
    );
  } finally {
    setSending(false);
  }
};

 const handleCancel = async () => {
  if (invite) {
    try {
      await cancelPeerInvite(supabase, invite.id);
    } catch (cancelError) {
      console.error(cancelError);
    }
  }


  setSessionId(null);
  setInvite(null);
  setStep("invite");
  setIdentifier("");
  onClose();
};



//HANDLE PROCEED ONCE THE OTHER PEER HAS ACCEPTED THE INVITE
const handleProceed = () => {
  if (!sessionId || !invite) return;

  onProceed({
    ...acceptedSession,
    session_id : sessionId,
    kind : "peer",
    mode : "exam",
    track_type : track,
    status : "accepted",
    question_count : acceptedSession?.question_count || 30,
    duration_seconds : acceptedSession?.duration_seconds || 1800,
    questions : acceptedSession?.questions || [],
  });
  setStep("invite");
};
console.log(recipientSession)

// setInterval(()=> {
//   if(acceptedSession?.status === "pending"){
//  StatusCheck(acceptedSession?.session_id || "")
//   }
// }, 600000) 
  return (
    <div>
      
    <div className="fixed inset-0 z-50 flex flex-col bg-paper dark:bg-ink">
      <div className="flex items-center justify-between border-b border-paper-line px-5 py-4 dark:border-ink-line">
        {step === "configure" ? (
          <button
            type="button"
            onClick={() => setStep("invite")}
            className="focus-gold flex items-center gap-1.5 text-[13.5px] font-medium text-current/60 hover:text-gold-500"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Back
          </button>
        ) : (
          <span className="font-display text-[16px]">Peer session</span>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="focus-gold flex h-9 w-9 items-center justify-center rounded-full text-current/50 hover:text-current"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {step === "invite" ? (
            <motion.div
              key="invite"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm"
            >
              <Users className="h-7 w-7 text-gold-500 dark:text-gold-300" strokeWidth={1.6} />
              <p className="mt-4 text-[14px] leading-relaxed text-current/60">
                Study the same set of questions, at the same time, as a
                friend. They&rsquo;ll get a request to join your round.
              </p>
              <h2 className="mt-5 font-display text-[22px]">Invite a friend</h2>

              <label
                htmlFor="invite-identifier"
                className="mt-5 block text-[13.5px] font-medium text-current/80"
              >
                Username or email
              </label>
              <input
                id="invite-identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. feranmi_a"
                className="focus-gold mt-2 w-full rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current placeholder:text-current/35 dark:border-ink-line dark:bg-ink-surface md:text-[14.5px]"
              />

              <button
                type="button"
                disabled={!identifier.trim()}
                onClick={() => setStep("configure")}
                className="focus-gold mt-6 w-full rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3.5 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                Request
              </button>
            </motion.div>
          ) : null}

          {step === "configure" && (
             profile === "aspirant" ? (
            <motion.div
              key="configure"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm"
            >
              <h2 className="font-display text-[22px]">Set up the round</h2>
              <p className="mt-2 text-[13.5px] text-current/60">
                Inviting <strong>{identifier}</strong>.
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <span className="text-[13.5px] font-medium text-current/80">
                  Subject
                </span>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="focus-gold rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-[14.5px]"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <span className="text-[13.5px] font-medium text-current/80">
                  Track
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["subject", "topic", "combination"] as CbtTrack[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTrack(t)}
                      className={`focus-gold rounded-sm border px-2 py-2.5 text-[12.5px] font-medium capitalize transition-colors ${
                        track === t
                          ? "border-gold-400 bg-gold-400/5 text-gold-600 dark:text-gold-300"
                          : "border-paper-line text-current/60 hover:border-current/30 dark:border-ink-line"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <span className="text-[13.5px] font-medium text-current/80">
                  Pacing
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { value: "self-paced", label: "Self-paced" },
                      { value: "time-initiated", label: "Time-initiated" },
                    ] as { value: PacingMode; label: string }[]
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPacing(option.value)}
                      className={`focus-gold rounded-sm border px-3 py-2.5 text-[12.5px] font-medium transition-colors ${
                        pacing === option.value
                          ? "border-gold-400 bg-gold-400/5 text-gold-600 dark:text-gold-300"
                          : "border-paper-line text-current/60 hover:border-current/30 dark:border-ink-line"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* TIMING */}
       <div className="mt-5 flex flex-col gap-2">
  <span className="text-[13.5px] font-medium text-current/80">
    Duration
  </span>

  <select
    value={durationMinutes}
    onChange={(event) =>
      setDurationMinutes(Number(event.target.value))
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
                disabled={sending}
                onClick={handleSendRequest}
                className="focus-gold mt-7 flex w-full items-center justify-center gap-2 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3.5 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send request"
                )}
              </button>
            </motion.div>
           
             ) : (
                <motion.div  key="configure"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm">
                  <h2 className="text-[14px] font-bold leading-[20px] text-current/80 dark:text-white">
                    Invitation Details
                  </h2>
                  <div className="flex flex-col gap-3">
    <TextField label="Course"  value={course?.course_title || ""} readOnly/>
    {/* // This is used to set the session duration */}
       <div className="mt-5 flex flex-col gap-2">
  <span className="text-[13.5px] font-medium text-current/80">
    Duration
  </span>

  <select
    value={durationMinutes}
    onChange={(event) =>
      setDurationMinutes(Number(event.target.value))
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
                disabled={sending}
                onClick={()=> {
                  setTrack("courses")
                  handleSendRequest()
                }}
                className="focus-gold mt-7 flex w-full items-center justify-center gap-2 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3.5 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send request"
                )}
              </button>
                  </div>
                   
                  </motion.div>
             ) ) }
        {step === "pending" ? (
  <motion.div
    key="pending"
    className="flex w-full max-w-sm flex-col items-center text-center"
  >
    <Loader2 className="h-8 w-8 animate-spin text-gold-500 dark:text-gold-300" />

    <h2 className="mt-5 font-display text-[20px]">
      Waiting for {identifier}
    </h2>

    <p className="mt-2 text-[13.5px] leading-relaxed text-current/60">
      You can leave this screen. We’ll keep the invitation open until
      your friend accepts or it expires.
    </p>

    {error ? (
      <p className="mt-4 rounded-sm bg-red-50 p-3 text-[13px] text-red-700">
        {error}
      </p>
    ) : null}

    <button
      type="button"
      onClick={onClose}
      className="focus-gold mt-6 rounded-sm border border-paper-line px-5 py-2.5 text-[13.5px] font-medium text-current/70"
    >
      Close and keep waiting
    </button>

    <button
      type="button"
      onClick={handleCancel}
      className="focus-gold mt-5 text-[12.5px] text-current/40 hover:text-red-500"
    >
      Cancel request
    </button>
  </motion.div>
) : null}

        {step === "accepted" ? (
  <motion.div
    key="accepted"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.25 }}
    className="flex w-full max-w-sm flex-col items-center text-center"
  >
    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
      <CheckCircle2
        className="h-8 w-8 text-green-600 dark:text-green-400"
        strokeWidth={1.7}
      />
    </div>

    <h2 className="mt-5 font-display text-[20px]">
      {identifier} accepted
    </h2>

    <p className="mt-2 text-[13.5px] leading-relaxed text-current/60">
      Your friend has joined the round. Continue to the session
      setup before starting together.
    </p>

    <div className="mt-5 w-full rounded-sm border border-paper-line px-4 py-3 text-left dark:border-ink-line">
      <div className="flex items-center justify-between gap-3 text-[13px]">
        <span className="text-current/50">{profile === "aspirant" ? "Subject" : "Course"}</span>
        <span className="font-medium">{ profile === "aspirant" ? subject : course?.course_code}</span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 text-[13px]">
        <span className="text-current/50">Duration</span>
        <span className="font-medium">
          {durationMinutes} minutes
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 text-[13px]">
        <span className="text-current/50">Status</span>
        <span className="font-medium text-green-600 dark:text-green-400">
          Invitation accepted
        </span>
      </div>
    </div>

    {error ? (
      <p
        role="alert"
        className="mt-4 w-full rounded-sm bg-red-500/10 p-3 text-[13px] text-red-600 dark:text-red-400"
      >
        {error}
      </p>
    ) : null}

    <button
      type="button"
      onClick={handleProceed}
      className="focus-gold mt-6 w-full rounded-sm border
       border-gold-400 bg-gold-metal-soft px-6 py-3.5 text-[14px] 
       font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01]"
    >
      Continue
    </button>
  </motion.div>
) : null}
        </AnimatePresence>
      </div>
    </div>
     
    </div>
  );
}
