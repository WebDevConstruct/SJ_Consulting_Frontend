import { useEffect, useState } from "react";
import { createClient} from "@lib/supabase/client";
type Props = {
  sessionId: string;
   opponentUserId: string;
  submitDeadline: string | null;

  sessionKind: "peer" | "multiplayer";
  completedParticipants?: number;
  totalParticipants?: number;
  sessionStatus : string
  onSessionCompleted: () => void;
  
};




 


  

function formatRemaining(ms: number) {
  if (ms <= 0) return "00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (value: number) => String(value).padStart(2, "0");

  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

export default function SessionWaitingRoom({
  sessionId,
  opponentUserId,
  submitDeadline,
  sessionKind,
  completedParticipants = 0,
  totalParticipants = 0,
  sessionStatus,
  onSessionCompleted,
  
}: Props) {
  const [remainingMs, setRemainingMs] = useState(0);
  
//const supabase = createClient();

 

  useEffect(() => {
    if (!submitDeadline) return;

    const deadline = new Date(submitDeadline).getTime();
    if(sessionStatus === "completed") {
     function cleanUp(){
        setRemainingMs(0);
        onSessionCompleted()
     }
      return cleanUp();
    }

    const tick = () => {
      setRemainingMs(deadline - Date.now());
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [submitDeadline]);

  const isMultiplayer = sessionKind === "multiplayer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-2xl">⏳</span>
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Submission received
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          You have completed this {isMultiplayer ? "multiplayer" : "peer"}{" "}
          session. Please wait while the remaining participants finish or the
          session timer runs out.
        </p>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Time remaining
          </p>

          <p className="mt-1 text-4xl font-bold tabular-nums text-slate-900">
            {formatRemaining(remainingMs)}
          </p>
        </div>

        {isMultiplayer && totalParticipants > 0 && (
          <p className="mt-4 text-sm text-slate-600">
            {completedParticipants} of {totalParticipants} participants have
            submitted.
          </p>
        )}

        <p className="mt-6 text-xs text-slate-500">
          Do not close this page. The results and leaderboard update will appear
          automatically.
        </p>
      </div>
    </div>
  );
}