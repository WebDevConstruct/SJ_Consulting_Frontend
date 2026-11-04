"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { acceptPeerInvite, type PeerInvite } from "@/lib/study/peer-api";
import { getPeerSession, type StartedSession } from "@/lib/study/cbt-api";
import { createClient } from "@/lib/supabase/client";
import {useStatusToast} from "@/components/ui/status-toast";
import {useGlobalContext} from "../../../Context";

export function PendingPeerInvites({
  userId,
  onAccepted,
  setRunningSession
}: {
  userId: string;
  onAccepted: (session: StartedSession & { status: string }) => void;
  setRunningSession : React.Dispatch<React.SetStateAction<boolean>>
}) {
  const {showToast} = useStatusToast()
  const supabase = createClient();
  //const [userInfo, setUserInfo] = useState<usermetadata | null>(null);
  
  const [invites, setInvites] = useState<PeerInvite[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
   const {recipientSession, setRecipientSession} = useGlobalContext()
  
  
//THE USEEFFECT FOR SENDING OUT INVITES TO OTHER USER_ID
  useEffect(() => {
    if (!userId) return;

    const loadInvites = async () => {
      const { data } = await supabase
        .from("cbt_peer_invites")
        .select("*")
        .eq("invited_user_id", userId)
        .eq("status", "pending")
        .gt("expires_at", new Date().toISOString());

      setInvites(data ?? []);
    };

    loadInvites();

    const channel = supabase
      .channel(`peer-invites-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cbt_peer_invites",
          filter: `invited_user_id=eq.${userId}`,
        },
        () => loadInvites(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

//THE USEEFFECT FOR ACCEPTING A SESSION TO CREATE A PEER SESSION WITH ANOTHER USERID
useEffect(() => {
  if (!recipientSession || recipientSession.status === "running") return;

  const channel = supabase
    .channel(`peer-session-${recipientSession.session_id}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "cbt_sessions",
        filter: `id=eq.${recipientSession.session_id}`,
      },
      (payload) => {
        const updated = payload.new as {
          status: string;
          started_at: string | null;
          submit_deadline: string | null;
        };

        if (updated.status === "running") {
          onAccepted({
            ...recipientSession,
            status: "running",
          });
          setRunningSession(true)
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [recipientSession, supabase, onAccepted]);

  const handleAccept = async (invite: PeerInvite) => {
  setAcceptingId(invite.id);

  try {
    const accepted = await acceptPeerInvite(supabase, invite.id);
    if(!accepted?.session_id){
      showToast({
        kind : "error",
        title : "Session Acceptance Error",
        message : "The System Failed to Accept the Peer Session Invitation"
      })
    }

    const session = await getPeerSession(
      supabase,
      accepted.session_id,
    );
    if(!session){
      showToast({
        kind : "error",
        title : "Peer Session Error",
        message : "The System Failed to Accept the Peer Session Invitation"
      })
    }
   setRecipientSession(session)
    onAccepted(session as unknown as StartedSession & { status: string });
    showToast({
      kind : "success",
      title : "Peer Session Accepted",
      message : "You have successfully accepted the Peer Session Invitation"
    })
  } catch (error) {
    console.error(error);
    showToast({
      kind : "error",
      title : "Peer Session Error",
      message : "The System Failed to Accept the Peer Session Invitation"
    })
  } finally {
    setAcceptingId(null);
  }
};
  if (invites.length === 0) return null;

  return (
    <div className="mt-6 max-w-lg rounded-sm border border-gold-400/40 bg-gold-400/5 p-4">
      <h3 className="font-display text-[16px]">Peer invitations</h3>

      <div className="mt-3 flex flex-col gap-3">
        {invites.map((invite) => (
          <div
            key={invite.id}
            className="flex items-center justify-between gap-3 rounded-sm border border-paper-line bg-paper px-4 py-3 dark:border-ink-line dark:bg-ink-surface"
          >
            <div>
              <p className="text-[13.5px] font-medium">
                {invite.identifier} invited you
              </p>
              <p className="text-[12px] text-current/55">
                Expires{" "}
                {new Date(invite.expires_at).toLocaleTimeString()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={acceptingId === invite.id}
                onClick={() => handleAccept(invite)}
                className="focus-gold flex items-center gap-1.5 rounded-sm border border-gold-400 bg-gold-metal-soft px-3 py-2 text-[12.5px] font-semibold text-ink"
              >
                <Check className="h-4 w-4" />
                Accept
              </button>

              <button
                type="button"
                className="focus-gold rounded-sm border border-paper-line px-3 py-2 text-[12.5px] text-current/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}