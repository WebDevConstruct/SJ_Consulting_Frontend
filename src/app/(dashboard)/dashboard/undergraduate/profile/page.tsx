"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Camera,
  Check,
  Loader2,
  LogOut,
  Moon,
  Save,
  Sun,
  Trophy,
  User,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  user_type: string;
  avatar_url: string | null;
};

type Performance = {
  total_points: number;
  leaderboard_rank: number | null;
};

type Appearance = "light" | "dark";

type StatusMessage = {
  kind: "success" | "error";
  message: string;
} | null;

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [performance, setPerformance] = useState<Performance>({
    total_points: 0,
    leaderboard_rank: null,
  });

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [appearance, setAppearance] = useState<Appearance>("light");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [profileStatus, setProfileStatus] = useState<StatusMessage>(null);
  const [passwordStatus, setPasswordStatus] = useState<StatusMessage>(null);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const loadProfile = useCallback(async () => {
    let isActive = true;

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/sign-in");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select(
          "id, username, full_name, email, user_type, avatar_url"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Failed to load profile:", profileError);
      }

      const loadedProfile: Profile = {
        id: user.id,
        username: profileData?.username ?? "",
        full_name: profileData?.full_name ?? "",
        email: profileData?.email ?? user.email ?? "",
        user_type: profileData?.user_type ?? "aspirant",
        avatar_url: profileData?.avatar_url ?? null,
      };

      if (isActive) {
        setProfile(loadedProfile);
        setUsername(loadedProfile.username);
        setFullName(loadedProfile.full_name);
        setEmail(loadedProfile.email);
        setAvatarUrl(loadedProfile.avatar_url);
      }

      // Load the signed-in student's leaderboard performance.
      const { data: performanceRows, error: performanceError } =
        await supabase.rpc("get_student_leaderboard_position");

      if (performanceError) {
        console.error(
          "Failed to load points and leaderboard rank:",
          performanceError
        );
      }

      const performanceRow = Array.isArray(performanceRows)
        ? performanceRows[0]
        : performanceRows;

      if (isActive) {
        setPerformance({
          total_points: performanceRow?.total_points ?? 0,
          leaderboard_rank: performanceRow?.rank_position ?? null,
        });
      }

      const storedAppearance =
        (localStorage.getItem("appearance") as Appearance | null) ?? "light";

      if (isActive) {
        setAppearance(storedAppearance);
      }
    } catch (error) {
      console.error("Unexpected profile loading error:", error);
    } finally {
      if (isActive) {
        setIsLoadingProfile(false);
      }
    }

    return () => {
      isActive = false;
    };
  }, [router, supabase]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAppearanceChange = (nextAppearance: Appearance) => {
    setAppearance(nextAppearance);
    localStorage.setItem("appearance", nextAppearance);

    document.documentElement.classList.toggle(
      "dark",
      nextAppearance === "dark"
    );
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    if (!username.trim()) {
      setProfileStatus({
        kind: "error",
        message: "Please enter a username.",
      });
      return;
    }

    setIsSavingProfile(true);
    setProfileStatus(null);

    try {
      const { error } = await supabase
        .from("users")
        .update({
          username: username.trim(),
          full_name: fullName.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) {
        throw error;
      }

      setProfileStatus({
        kind: "success",
        message: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);

      setProfileStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not update your profile. Please try again.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file || !profile) return;

    if (!file.type.startsWith("image/")) {
      setProfileStatus({
        kind: "error",
        message: "Please select a valid image file.",
      });
      return;
    }

    setIsUploadingAvatar(true);
    setProfileStatus(null);

    try {
      const fileExtension = file.name.split(".").pop() ?? "jpg";
      const filePath = `${profile.id}/avatar-${Date.now()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("users")
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      setProfileStatus({
        kind: "success",
        message: "Profile photo updated successfully.",
      });
    } catch (error) {
      console.error("Failed to upload profile photo:", error);

      setProfileStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not upload your profile photo. Please try again.",
      });
    } finally {
      setIsUploadingAvatar(false);

      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      setPasswordStatus({
        kind: "error",
        message: "Please enter and confirm your new password.",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordStatus({
        kind: "error",
        message: "The new passwords do not match.",
      });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordStatus({
        kind: "error",
        message: "Your new password must be at least 8 characters.",
      });
      return;
    }

    setIsChangingPassword(true);
    setPasswordStatus(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setPasswordStatus({
        kind: "success",
        message: "Password updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update password:", error);

      setPasswordStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not update your password. Please try again.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await supabase.auth.signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Failed to sign out:", error);
      setIsSigningOut(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 dark:bg-ink">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500 dark:text-gold-300" />
          <p className="text-sm text-current60">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 dark:bg-ink">
        <div className="w-full max-w-sm rounded-sm border border-paper-line bg-paper-soft p-6 text-center dark:border-ink-line dark:bg-ink-surface">
          <User className="mx-auto h-8 w-8 text-gold-500 dark:text-gold-300" />
          <h1 className="mt-4 font-display text-20px">Profile unavailable</h1>
          <p className="mt-2 text-13.5px text-current60">
            We could not load your profile. Please sign in and try again.
          </p>

          <button
            type="button"
            onClick={() => router.replace("/sign-in")}
            className="focus-gold mt-6 w-full rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3 text-14px font-semibold text-ink shadow-gold"
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper px-5 py-10 dark:bg-ink md:px-10 md:py-14">
      <div className="mx-auto w-full max-w-4xl">
        <div className="h-2px w-12 bg-gold-metal" />

        <h1 className="mt-6 font-display text-[28px] leading-tight sm:text-32px">
          Profile
        </h1>

        <p className="mt-3 max-w-lg text-14.5px leading-relaxed text-current65">
          Manage your account details, profile photo, password, appearance and
          leaderboard performance.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-sm border border-paper-line bg-paper-soft p-6 dark:border-ink-line dark:bg-ink-surface lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Profile photo"
                    className="h-24 w-24 rounded-full border border-gold-40040 object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-gold-40040 bg-gold-4005">
                    <User className="h-10 w-10 text-gold-500 dark:text-gold-300" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="focus-gold absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border border-gold-400 bg-gold-metal-soft text-ink shadow-gold transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Change profile photo"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
              </div>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />

              <h2 className="mt-5 font-display text-20px">
                {profile.full_name || profile.username || "Student"}
              </h2>

              <p className="mt-1 text-13.5px text-current60">
                {profile.email}
              </p>

              <span className="mt-4 rounded-full border border-gold-40040 bg-gold-4005 px-3 py-1 text-12px font-medium uppercase tracking-wide text-gold-600 dark:text-gold-300">
                {profile.user_type}
              </span>
            </div>

            <div className="mt-7 rounded-sm border border-paper-line bg-paper p-4 dark:border-ink-line dark:bg-ink-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-gold-40040 bg-gold-4005">
                  <Award className="h-5 w-5 text-gold-500 dark:text-gold-300" />
                </div>

                <div>
                  <p className="text-12.5px text-current55">Total points</p>
                  <p className="font-display text-20px">
                    {performance.total_points}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-gold-40040 bg-gold-4005">
                  <Trophy className="h-5 w-5 text-gold-500 dark:text-gold-300" />
                </div>

                <div>
                  <p className="text-12.5px text-current55">
                    Leaderboard rank
                  </p>
                  <p className="font-display text-20px">
                    {performance.leaderboard_rank
                      ? `#${performance.leaderboard_rank}`
                      : "Unranked"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-sm border border-paper-line bg-paper-soft p-6 dark:border-ink-line dark:bg-ink-surface lg:col-span-2">
            <h3 className="font-display text-20px">Account details</h3>
            <p className="mt-2 text-13.5px text-current60">
              Update your username and full name. Your email address is used as
              your account identity and cannot be changed here.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="username"
                  className="block text-13.5px font-medium text-current80"
                >
                  Username
                </label>

                <input
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter your username"
                  className="focus-gold mt-2 w-full rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-14.5px"
                />
              </div>

              <div>
                <label
                  htmlFor="full-name"
                  className="block text-13.5px font-medium text-current80"
                >
                  Full name
                </label>

                <input
                  id="full-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your full name"
                  className="focus-gold mt-2 w-full rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-14.5px"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-13.5px font-medium text-current80"
                >
                  Email address
                </label>

                <input
                  id="email"
                  value={email}
                  readOnly
                  className="focus-gold mt-2 w-full cursor-not-allowed rounded-sm border border-paper-line bg-paper-soft px-4 py-3 text-base text-current60 dark:border-ink-line dark:bg-ink-soft md:text-14.5px"
                />
              </div>
            </div>

            {profileStatus ? (
              <p
                role="status"
                className={`mt-5 rounded-sm px-4 py-3 text-13px ${
                  profileStatus.kind === "success"
                    ? "bg-green-50010 text-green-600 dark:text-green-400"
                    : "bg-red-50010 text-red-600 dark:text-red-400"
                }`}
              >
                {profileStatus.message}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleUpdateProfile}
              disabled={isSavingProfile}
              className="focus-gold mt-6 flex w-full items-center justify-center gap-2 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3 text-14px font-semibold text-ink shadow-gold transition-transform hover:scale-1.01 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save changes
                </>
              )}
            </button>
          </section>

          <section className="rounded-sm border border-paper-line bg-paper-soft p-6 dark:border-ink-line dark:bg-ink-surface lg:col-span-2">
            <h3 className="font-display text-20px">Change password</h3>
            <p className="mt-2 text-13.5px text-current60">
              Choose a strong password with at least 8 characters.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-13.5px font-medium text-current80"
                >
                  Current password
                </label>

                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
                  className="focus-gold mt-2 w-full rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-14.5px"
                />
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-13.5px font-medium text-current80"
                >
                  New password
                </label>

                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  className="focus-gold mt-2 w-full rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-14.5px"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="block text-13.5px font-medium text-current80"
                >
                  Confirm password
                </label>

                <input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(event) =>
                    setConfirmNewPassword(event.target.value)
                  }
                  autoComplete="new-password"
                  className="focus-gold mt-2 w-full rounded-sm border border-paper-line bg-paper px-4 py-3 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-14.5px"
                />
              </div>
            </div>

            {passwordStatus ? (
              <p
                role="status"
                className={`mt-5 rounded-sm px-4 py-3 text-13px ${
                  passwordStatus.kind === "success"
                    ? "bg-green-50010 text-green-600 dark:text-green-400"
                    : "bg-red-50010 text-red-600 dark:text-red-400"
                }`}
              >
                {passwordStatus.message}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="focus-gold mt-6 flex w-full items-center justify-center gap-2 rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-3 text-14px font-semibold text-ink shadow-gold transition-transform hover:scale-1.01 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Update password
                </>
              )}
            </button>
          </section>

          <section className="rounded-sm border border-paper-line bg-paper-soft p-6 dark:border-ink-line dark:bg-ink-surface">
            <h3 className="font-display text-20px">Appearance</h3>
            <p className="mt-2 text-13.5px text-current60">
              Switch between the light and dark themes.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleAppearanceChange("light")}
                className={`focus-gold flex flex-col items-center gap-2.5 rounded-sm border px-4 py-5 transition-colors ${
                  appearance === "light"
                    ? "border-gold-400 bg-gold-4005"
                    : "border-paper-line hover:border-current30 dark:border-ink-line"
                }`}
              >
                <Sun className="h-6 w-6 text-gold-500 dark:text-gold-300" />
                <span className="text-13.5px font-medium">Light</span>
              </button>

              <button
                type="button"
                onClick={() => handleAppearanceChange("dark")}
                className={`focus-gold flex flex-col items-center gap-2.5 rounded-sm border px-4 py-5 transition-colors ${
                  appearance === "dark"
                    ? "border-gold-400 bg-gold-4005"
                    : "border-paper-line hover:border-current30 dark:border-ink-line"
                }`}
              >
                <Moon className="h-6 w-6 text-gold-500 dark:text-gold-300" />
                <span className="text-13.5px font-medium">Dark</span>
              </button>
            </div>
          </section>

          <section className="rounded-sm border border-paper-line bg-paper-soft p-6 dark:border-ink-line dark:bg-ink-surface lg:col-span-3">
            <h3 className="font-display text-20px">Session</h3>
            <p className="mt-2 text-13.5px text-current60">
              Sign out of this device. You can sign in again at any time.
            </p>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="focus-gold mt-6 flex w-full items-center justify-center gap-2 rounded-sm border border-red-50040 bg-red-50010 px-6 py-3 text-14px font-semibold text-red-600 transition-colors hover:bg-red-50020 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 sm:w-auto"
            >
              {isSigningOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </>
              )}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}