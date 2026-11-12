import { createContext, use, type ReactNode } from "react";

import type { Profile } from "./types";
import { usePersistedState } from "./usePersistedState";

const EMPTY: Profile = { photoUri: null, businessName: "", realName: "" };

type ProfileContextValue = {
  profile: Profile;
  updateProfile: (changes: Partial<Profile>) => void;
  /** Name shown on pins you create. */
  displayName: string;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = usePersistedState<Profile>(
    "scout.profile.v1",
    EMPTY,
  );
  const updateProfile = (changes: Partial<Profile>) =>
    setProfile((p) => ({ ...p, ...changes }));
  const displayName =
    profile.businessName.trim() || profile.realName.trim() || "Anonymous";

  return (
    <ProfileContext value={{ profile, updateProfile, displayName }}>
      {children}
    </ProfileContext>
  );
}

export function useProfile() {
  const ctx = use(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider>");
  return ctx;
}
