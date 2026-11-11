"use client";

import { createPeerDuel, joinPeerDuel, cancelPeerDuel } from "@/lib/api";

export type PeerInvite = {
  id: string;
  session_id: string;
  invited_by: string;
  invited_user_id: string;
  identifier: string;
  inviter_identifier: string | null;
  status: "pending" | "accepted" | "declined" | "expired" | "cancelled";
  expires_at: string;
};

export async function createPeerInvite(
  _supabase: any,
  sessionId: string,
  identifier: string,
  _expiryMinutes = 15,
): Promise<PeerInvite> {
  const duel = await createPeerDuel({
    subject: "economics",
    track_type: "subject",
    opponent_username: identifier.trim(),
  });

  return {
    id: duel.peer_session_id,
    session_id: duel.peer_session_id,
    invited_by: "",
    invited_user_id: "",
    identifier: identifier.trim(),
    inviter_identifier: null,
    status: "pending",
    expires_at: duel.expires_at,
  };
}

export async function acceptPeerInvite(
  _supabase: any,
  inviteId: string,
): Promise<{ session_id: string; status: string }> {
  const result = await joinPeerDuel({
    peer_session_id: inviteId,
  });

  return {
    session_id: result.cbt_session_id,
    status: "in_progress",
  };
}

export async function cancelPeerInvite(
  _supabase: any,
  inviteId: string,
): Promise<void> {
  await cancelPeerDuel(inviteId);
}
