"use client";

import type { UserProfile } from '@/types';
import { initialProfileData, DEFAULT_THEME_ID } from '@/types';
import type { Dispatch, ReactNode, SetStateAction} from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

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
  const [currentThemeId, setCurrentThemeId] = useState<string>(DEFAULT_THEME_ID);

  useEffect(() => {
    // Try to load profile from localStorage on initial mount (simulating session)
    const storedUserId = localStorage.getItem('cardifyUserId');
    if (storedUserId) {
      // In a real app, fetch profile based on storedUserId
      if (storedUserId === initialProfileData.userId) {
        setProfile(initialProfileData);
        setCurrentThemeId(initialProfileData.theme);
      } else {
        // Handle case where stored ID is invalid or user not found
        localStorage.removeItem('cardifyUserId');
      }
    }
    setLoading(false);
  }, []);
  
  useEffect(() => {
    if (profile) {
      setCurrentThemeId(profile.theme);
    }
  }, [profile?.theme]);


  const login = async (userId: string): Promise<boolean> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    if (userId === initialProfileData.userId) { // Mock successful login
      setProfile(initialProfileData);
      setCurrentThemeId(initialProfileData.theme);
      localStorage.setItem('cardifyUserId', userId);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setProfile(null);
    localStorage.removeItem('cardifyUserId');
    setCurrentThemeId(DEFAULT_THEME_ID);
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading, login, logout, currentThemeId, setCurrentThemeId }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
