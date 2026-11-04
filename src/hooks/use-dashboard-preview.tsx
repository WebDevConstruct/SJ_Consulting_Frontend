"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

import type { DashboardPreview } from "@lib/dashboard-types";

export function useDashboardPreview() {
  const supabase = createClient();

  const [preview, setPreview] = useState<DashboardPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPreview = async () => {
      setLoading(true);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc(
        "get_dashboard_preview",
        {
          p_session_limit: 3,
          p_leaderboard_limit: 5,
        },
      );

      if (cancelled) return;

      if (rpcError) {
        setError(rpcError.message);
        setPreview(null);
      } else {
        setPreview(data as DashboardPreview);
      }

      setLoading(false);
    };

    void loadPreview();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  return { preview, loading, error };
}