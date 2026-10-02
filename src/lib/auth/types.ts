export type UserProfile = "aspirant" | "undergraduate";

export interface UndergraduteAccountVerificationType {
  college : string;
  faculty : string;
  department : string;
  currentyear : number
}





export interface AspirantAccountVerificationType {
  subjectCombination : string[],
  college : string,
  faculty : string,
  department : string,
  //writtenJamb ?: boolean
}

/**
 * The record as "stored" in our mock database (localStorage).
 * NOTE: passwords are kept in plain text here purely because this is a
 * client-only simulation with no backend.
 */
export interface StoredUser {
  id: string;
  name: string;
  age: number;
  username: string;
  email: string;
  phone: string;
  password: string;
  userProfile: UserProfile | string;
  accountVerification : AspirantAccountVerificationType | UndergraduteAccountVerificationType | null;
  emailVerified: boolean;
  pendingOtp: string | null;
  createdAt: number;
}

/** The safe, public shape of a user — never includes the password. */
export type PublicUser = Omit<StoredUser, "password" | "pendingOtp">;

export interface SignUpPayload {
  name: string;
  age: number;
  username: string;
  email: string;
  phone: string;
  password: string;
  userProfile: UserProfile;
  accountVerification : AspirantAccountVerificationType | UndergraduteAccountVerificationType | null;
}

export interface SignInPayload {
  identifier: string; // username or email
  password: string;
  userAgent: string;
}

export interface ApiResult<T> {
  success: boolean;
  error?: string;
  data?: T;
}
