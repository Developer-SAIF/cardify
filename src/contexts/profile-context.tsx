"use client";

import type { UserProfile } from "@/types";
import { initialProfileData, DEFAULT_THEME_ID } from "@/types";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface ProfileContextType {
  profile: UserProfile | null;
  setProfile: Dispatch<SetStateAction<UserProfile | null>>;
  loading: boolean;
  login: (userId: string) => Promise<boolean>;
  logout: () => void;
  currentThemeId: string;
  setCurrentThemeId: Dispatch<SetStateAction<string>>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentThemeId, setCurrentThemeId] =
    useState<string>(DEFAULT_THEME_ID);

  useEffect(() => {
    const storedUserId = localStorage.getItem("cardifyUserId");
    if (storedUserId) {
      fetch(`/api/user/${storedUserId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setProfile(data);
            setCurrentThemeId(data.theme);
          } else {
            localStorage.removeItem("cardifyUserId");
          }
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Removed useEffect that synced currentThemeId from profile.theme
  // This was causing a loop with UserCardPage's context patching.
  // setCurrentThemeId is already called appropriately:
  // - on login
  // - by ThemeSelector
  // - by UserCardPage when it patches/restores context

  const login = async (userId: string): Promise<boolean> => {
    setLoading(true);
    const res = await fetch(`/api/user/${userId}`);
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
      setCurrentThemeId(data.theme);
      localStorage.setItem("cardifyUserId", userId);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setProfile(null);
    localStorage.removeItem("cardifyUserId");
    setCurrentThemeId(DEFAULT_THEME_ID);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        loading,
        login,
        logout,
        currentThemeId,
        setCurrentThemeId,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
