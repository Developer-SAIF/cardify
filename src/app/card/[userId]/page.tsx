
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CardPreview } from '@/components/dashboard/card-preview';
import { useProfile } from '@/contexts/profile-context';
import type { UserProfile } from '@/types';
import { initialProfileData } from '@/types';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UserCardPage() {
  const params = useParams();
  const router = useRouter();
  const { userId: paramUserId } = params;
  const { 
    profile: contextProfile, 
    loading: contextLoading, 
    setProfile, 
    currentThemeId: contextCurrentThemeId,
    setCurrentThemeId 
  } = useProfile();
  
  const [cardProfile, setCardProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Refs to manage context patching
  const isActiveContextPatch = useRef(false); // Tracks if UserCardPage is currently managing the context
  const originalContextProfileBeforePatch = useRef<UserProfile | null | undefined>(undefined);
  const originalThemeIdBeforePatch = useRef<string | undefined>(undefined);


  // Effect to fetch the specific user's card data
  useEffect(() => {
    const fetchProfileData = async (id: string) => {
      setLoading(true);
      // Simulate API call to fetch profile by ID
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
      if (id === initialProfileData.userId) {
        setCardProfile(initialProfileData);
      } else {
        setCardProfile(null); // User not found
      }
      setLoading(false);
    };

    if (paramUserId && typeof paramUserId === 'string') {
      fetchProfileData(paramUserId);
    } else {
      setCardProfile(null); // No User ID in params
      setLoading(false);
    }
  }, [paramUserId]);

  // Effect to temporarily patch the global context for CardPreview component
  useEffect(() => {
    if (cardProfile) {
      // This page has a card to display
      const contextMatchesCard =
        contextProfile?.userId === cardProfile.userId &&
        contextCurrentThemeId === cardProfile.theme;

      if (!contextMatchesCard) {
        // Context needs to be updated to match cardProfile
        if (!isActiveContextPatch.current) {
          // This is the first time we're patching for this card (or after a restoration)
          // Store the current context state as "original"
          originalContextProfileBeforePatch.current = contextProfile ? { ...contextProfile } : null;
          originalThemeIdBeforePatch.current = contextCurrentThemeId;
          isActiveContextPatch.current = true; // Mark that we are now managing the context
        }
        // Perform the patch
        setProfile(cardProfile);
        setCurrentThemeId(cardProfile.theme);
      }
      // If contextMatchesCard is true, do nothing. 
      // isActiveContextPatch.current remains true if we patched earlier.
    } else {
      // No cardProfile to display (e.g., navigating away, card not found)
      if (isActiveContextPatch.current) {
        // We were managing the context, so restore it
        if (originalContextProfileBeforePatch.current !== undefined) {
          setProfile(originalContextProfileBeforePatch.current);
        }
        if (originalThemeIdBeforePatch.current !== undefined) {
          setCurrentThemeId(originalThemeIdBeforePatch.current);
        }
        // Reset state: no longer managing context, clear stored originals
        isActiveContextPatch.current = false;
        originalContextProfileBeforePatch.current = undefined;
        originalThemeIdBeforePatch.current = undefined;
      }
    }
  }, [cardProfile, contextProfile, contextCurrentThemeId, setProfile, setCurrentThemeId]);

  // Unmount effect (to ensure restoration if the page is closed/navigated away from directly)
  useEffect(() => {
    return () => {
      if (isActiveContextPatch.current) {
        // If the component unmounts while it was managing the context
        if (originalContextProfileBeforePatch.current !== undefined) {
          setProfile(originalContextProfileBeforePatch.current);
        }
        if (originalThemeIdBeforePatch.current !== undefined) {
          setCurrentThemeId(originalThemeIdBeforePatch.current);
        }
        // Resetting refs here is for hygiene, component is unmounting anyway
        isActiveContextPatch.current = false;
        originalContextProfileBeforePatch.current = undefined;
        originalThemeIdBeforePatch.current = undefined;
      }
    };
  }, [setProfile, setCurrentThemeId]); // setProfile and setCurrentThemeId are stable

  if (loading || contextLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
        <p className="mt-4 text-xl">Loading Digital Card...</p>
      </div>
    );
  }

  if (!cardProfile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
        <h1 className="mb-4 text-4xl font-bold">Card Not Found</h1>
        <p className="mb-8 text-lg">The digital business card you're looking for doesn't exist or is unavailable.</p>
        <Button onClick={() => router.push('/')} variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-slate-900">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go to Homepage
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 p-4 dark:from-slate-800 dark:to-slate-900 md:p-8">
      <div className="w-full max-w-lg">
         <CardPreview />
         <div className="mt-8 text-center">
          <Link href="/" passHref>
            <Button variant="outline" className="bg-background/80">
              <ArrowLeft className="mr-2 h-4 w-4" /> Create Your Own Cardify Card
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
