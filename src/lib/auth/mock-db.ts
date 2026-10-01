import type { PublicUser, StoredUser } from "./types";

const DB_KEY = "sj-consult-mock-users";

function readAll(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeAll(users: StoredUser[]) {
  window.localStorage.setItem(DB_KEY, JSON.stringify(users));
}

export function toPublicUser(user: StoredUser): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, pendingOtp: _pendingOtp, ...publicUser } = user;
  return publicUser as PublicUser;
}

export const mockDb = {
  findByEmail(email: string): StoredUser | undefined {
    return readAll().find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  },

  findByUsername(username: string): StoredUser | undefined {
    return readAll().find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
  },

  findByIdentifier(identifier: string): StoredUser | undefined {
    return (
      this.findByEmail(identifier) ?? this.findByUsername(identifier)
    );
  },

  findById(id: string): StoredUser | undefined {
    return readAll().find((u) => u.id === id);
  },

  insert(user: StoredUser) {
    const users = readAll();
    users.push(user);
    writeAll(users);
  },

  update(id: string, patch: Partial<StoredUser>) {
    const users = readAll();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return;
    users[index] = { ...users[index], ...patch };
    writeAll(users);
  },
};
