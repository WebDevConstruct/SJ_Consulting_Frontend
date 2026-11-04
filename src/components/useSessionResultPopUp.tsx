"use client"

import { AnyARecord } from "dns";
import { useGlobalContext} from "../../Context"

export function useSessionResultPopUp(supabase:any, userId?: string) {
 const {notification, setNotification} = useGlobalContext();

  async function showResultForSession(sessionId: string) {
    if (!userId || !sessionId) return;

    const { data, error } = await supabase
      .from("session_notifications")
      .select("*")
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Unable to load session result:", error);
      return;
    }

    setNotification(data);
  }

  return {
    notification,
    setNotification,
    showResultForSession,
  };
}