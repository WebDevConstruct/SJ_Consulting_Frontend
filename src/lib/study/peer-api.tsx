"use client";

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
  supabase: any,
  sessionId: string,
  identifier: string,
  expiryMinutes = 15,
): Promise<PeerInvite> {
  const { data, error } = await supabase.rpc("create_peer_invite", {
    p_session_id: sessionId,
    p_identifier: identifier.trim(),
    p_expiry_minutes: expiryMinutes,
  });

  if (error) throw error;

  return data;
}

export async function acceptPeerInvite(
  supabase: any,
  inviteId: string,
): Promise<{ session_id: string; status: string }> {
  const { data, error } = await supabase.rpc("accept_peer_invite", {
    p_invite_id: inviteId,
  });

  if (error) throw error;

  return data;
}

export async function cancelPeerInvite(
  supabase: any,
  inviteId: string,
): Promise<void> {
  const { error } = await supabase.rpc("cancel_peer_invite", {
    p_invite_id: inviteId,
  });

  if (error) throw error;
}