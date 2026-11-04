"use client";

/**
 * The real signup flow doesn't currently collect a UTME subject combination,
 * so there's nothing genuine to "autofill" from the account yet. This is a
 * deliberately small placeholder — seeded once per browser — so the UAAE's
 * system-data mode has something real to read from rather than faking a
 * network call. Swap this for an actual account field once signup captures it.
 */
const STORAGE_KEY = "sj-consult-account-utme-subjects";

const DEFAULT_SUBJECTS = [
  "English Language",
  "Physics",
  "Chemistry",
  "Biology",
];

export function getAccountUtmeSubjects(): string[] {
  if (typeof window === "undefined") return DEFAULT_SUBJECTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    // fall through to default
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SUBJECTS));
  return DEFAULT_SUBJECTS;
}
