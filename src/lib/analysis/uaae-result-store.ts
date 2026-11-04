"use client";

import { useEffect, useState } from "react";
import type { UaaeResult } from "@/lib/analysis/types";

const STORAGE_KEY = "sj-consult-uaae-result";

export function saveUaaeResult(result: UaaeResult) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

function read(): UaaeResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UaaeResult) : null;
  } catch {
    return null;
  }
}

export function useUaaeResult() {
  const [result, setResult] = useState<UaaeResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResult(read());
    setLoaded(true);
  }, []);

  return { result, loaded };
}
