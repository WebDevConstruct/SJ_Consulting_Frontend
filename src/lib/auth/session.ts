const SESSION_KEY = "sj-consult-session";
export const SESSION_IDLE_MS = 15 * 60 * 1000; // 15 minutes, per the brief

export interface SessionRecord {
  userId: string;
  issuedAt: number;
  lastActivityAt: number;
}

function readSession(): SessionRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionRecord) : null;
  } catch {
    return null;
  }
}

function writeSession(record: SessionRecord) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(record));
}

function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

function isExpired(record: SessionRecord): boolean {
  return Date.now() - record.lastActivityAt > SESSION_IDLE_MS;
}

export const session = {
  create(userId: string) {
    const now = Date.now();
    writeSession({ userId, issuedAt: now, lastActivityAt: now });
  },

  /** Returns the active session's userId, or null if absent/expired (clearing it if expired). */
  get(): string | null {
    const record = readSession();
    if (!record) return null;
    if (isExpired(record)) {
      clearSession();
      return null;
    }
    return record.userId;
  },

  touch() {
    const record = readSession();
    if (!record || isExpired(record)) return;
    writeSession({ ...record, lastActivityAt: Date.now() });
  },

  clear() {
    clearSession();
  },
};
