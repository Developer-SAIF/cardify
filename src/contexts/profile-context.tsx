"use client";

import type { UserProfile } from "@/types";
import { initialProfileData } from "@/types";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface ProfileContextType {
  profile: UserProfile | null;
  setProfile: Dispatch<SetStateAction<UserProfile | null>>;
  loading: boolean;
  login: (userId: string) => Promise<boolean>;
  logout: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("porichoyUserId");
    if (storedUserId) {
      fetch(`/api/user/${storedUserId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setProfile(data);
          } else {
            localStorage.removeItem("porichoyUserId");
          }
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (userId: string): Promise<boolean> => {
    setLoading(true);
    const res = await fetch(`/api/user/${userId}`);
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
      localStorage.setItem("porichoyUserId", userId);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setProfile(null);
    localStorage.removeItem("porichoyUserId");
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        loading,
        login,
        logout,
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
