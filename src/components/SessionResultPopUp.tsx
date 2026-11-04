"use client"
import { useGlobalContext } from "../../Context";
export type SessionNotification = {
  id: string;
  session_id: string;
  title: string;
  body: string;
  result: {
    session_kind?: "solo" | "peer" | "multiplayer";
    rank?: number;
    points?: number;
    is_winner?: boolean;
    winner_user_id?: string | null;
  };
};

type Props = {
    notificationValue ?: SessionNotification | null;
  onClose: () => void;
  onViewAnalysis?: () => void;
};

export default function SessionResultPopUp({
  notificationValue,
  onClose,
  onViewAnalysis,
}: Props) {
    const { notification } = useGlobalContext()
 // const [visible, setVisible] = useState(false);

//   useEffect(() =>  ()=> setVisible(Boolean(notification))
//   , [notification]);
const notificationToUse = notificationValue || notification
//console.log("Running directly from the village people house", notification)
  if (!notificationToUse?.result) return null;
  //alert("Session Result Pop Up is being displayed. Please check the console for details.");
  const kind = notificationToUse.result?.session_kind;
  const isWinner = notificationToUse.result?.is_winner === true;
  const points = notificationToUse.result?.points ?? 0;

  const isSolo = kind === "solo";
  const isPeerWinner = kind === "peer" && isWinner;
  const isPeerParticipant = kind === "peer" && !isWinner;

  const heading = isSolo
    ? "Another great step towards reaching the top"
    : isPeerWinner
      ? "Yay! You won this session"
      : isPeerParticipant
        ? "Well played!"
        : notificationToUse.title;

  const message = isSolo
    ? "You have earned 1 leaderboard point for completing this session. Keep going!"
    : isPeerWinner
      ? "You finished in 1st place and earned 3 leaderboard points."
      : isPeerParticipant
        ? "You earned 1 leaderboard point for participating. Another attempt brings you closer to the top."
        : notificationToUse.body;

  const theme = isSolo
    ? "bg-white border-slate-200"
    : isPeerWinner
      ? "bg-gradient-to-br from-amber-50 to-white border-amber-200"
      : "bg-white border-emerald-200";

  const badge = isSolo
    ? "bg-slate-900 text-white"
    : isPeerWinner
      ? "bg-amber-500 text-white"
      : "bg-emerald-600 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`w-full max-w-md rounded-2xl border p-6 shadow-xl ${theme}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badge}`}
            >
              {isSolo ? "+1 point" : `+${points} point${points === 1 ? "" : "s"}`}
            </span>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              {heading}
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close result"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          {onViewAnalysis && (
            <button
              type="button"
              onClick={onViewAnalysis}
              className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View analysis
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}