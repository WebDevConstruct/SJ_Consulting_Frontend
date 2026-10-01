import { mockDb, toPublicUser } from "./mock-db";
import { session } from "./session";
import type {
  ApiResult,
  PublicUser,
  SignInPayload,
  SignUpPayload,
} from "./types";

function delay(ms = 700) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateId(): string {
  return `usr_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/**
 * Stands in for api/v1/signup. Creates an unverified account — no session
 * is issued until the email is verified via verifyEmail below.
 */
async function signUp(
  payload: SignUpPayload
): Promise<ApiResult<{ email: string }>> {
  await delay();

  if (mockDb.findByEmail(payload.email)) {
    return { success: false, error: "An account with this email already exists." };
  }
  if (mockDb.findByUsername(payload.username)) {
    return { success: false, error: "That username is already taken." };
  }

  mockDb.insert({
    id: generateId(),
    name: payload.name,
    age: payload.age,
    username: payload.username,
    email: payload.email,
    phone: payload.phone,
    accountVerification : null,
    password: payload.password,
    userProfile: payload.userProfile,
    emailVerified: false,
    pendingOtp: null,
    createdAt: Date.now(),
  });

  return { success: true, data: { email: payload.email } };
}

/**
 * Stands in for api/v1/send?email=. In a real build this dispatches a code
 * by email; here it "sends" it by returning it, clearly marked dev-only,
 * so the flow can be demonstrated without a mail provider.
 */
async function sendVerificationCode(
  email: string
): Promise<ApiResult<{ devOtp: string }>> {
  await delay(500);

  const user = mockDb.findByEmail(email);
  if (!user) {
    return { success: false, error: "No account found for this email." };
  }

  const otp = generateOtp();
  mockDb.update(user.id, { pendingOtp: otp });

  return { success: true, data: { devOtp: otp } };
}

/** Stands in for api/v1/verify_email?email=, body { otp }. */
async function verifyEmail(
  email: string,
  otp: string
): Promise<ApiResult<{ user: PublicUser }>> {
  await delay(500);

  const user = mockDb.findByEmail(email);
  if (!user) {
    return { success: false, error: "No account found for this email." };
  }
  if (!user.pendingOtp || user.pendingOtp !== otp) {
    return { success: false, error: "That code is incorrect or has expired." };
  }

  mockDb.update(user.id, { emailVerified: true, pendingOtp: null });
  session.create(user.id);

  const verified = mockDb.findById(user.id)!;
  return { success: true, data: { user: toPublicUser(verified) } };
}

/** Stands in for api/v1/signin. */
async function signIn(
  payload: SignInPayload
): Promise<
  ApiResult<{ user: PublicUser }> & { needsVerification?: boolean; email?: string }
> {
  await delay();

  const user = mockDb.findByIdentifier(payload.identifier);
  if (!user || user.password !== payload.password) {
    return {
      success: false,
      error: "That username/email or password is incorrect.",
    };
  }

  if (!user.emailVerified) {
    return {
      success: false,
      error: "Please verify your email before signing in.",
      needsVerification: true,
      email: user.email,
    };
  }

  session.create(user.id);
  return { success: true, data: { user: toPublicUser(user) } };
}

/** Stands in for api/v1/logout. */
async function signOut(): Promise<ApiResult<null>> {
  await delay(250);
  session.clear();
  return { success: true };
}

function getCurrentUser(): PublicUser | null {
  const userId = session.get();
  if (!userId) return null;
  const user = mockDb.findById(userId);
  if (!user) return null;
  return toPublicUser(user);
}

export const mockApi = {
  signUp,
  sendVerificationCode,
  verifyEmail,
  signIn,
  signOut,
  getCurrentUser,
};
