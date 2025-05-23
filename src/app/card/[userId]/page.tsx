
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CardPreview } from '@/components/dashboard/card-preview';
import { useProfile } from '@/contexts/profile-context';
import type { UserProfile } from '@/types';
import { initialProfileData } from '@/types'; // Represents the "database" for demo
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UserCardPage() {
  const params = useParams();
  const router = useRouter();
  const { userId: paramUserIdString } = params;
  const paramUserId = Array.isArray(paramUserIdString) ? paramUserIdString[0] : paramUserIdString;

  // Global context
  const {
    profile: contextProfile,
    loading: contextLoading,
    setProfile: setContextProfile,
    currentThemeId: contextCurrentThemeId,
    setCurrentThemeId: setContextCurrentThemeId,
  } = useProfile();

  // Local state for this page
  // pageDisplayProfile holds the profile that this page has decided it should render,
  // either from context (for own live card) or fetched (for external card).
  const [pageDisplayProfile, setPageDisplayProfile] = useState<UserProfile | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  // isViewingOwnLiveCard determines if we're showing the logged-in user's card with their live editor state.
  const [isViewingOwnLiveCard, setIsViewingOwnLiveCard] = useState(false);

  // Refs for context patching (only if NOT isViewingOwnLiveCard, i.e., for external cards)
  const isActiveContextPatch = useRef(false);
  const originalContextProfileBeforePatch = useRef<UserProfile | null | undefined>(undefined);
  const originalThemeIdBeforePatch = useRef<string | undefined>(undefined);

  // Step 1: Determine behavior based on paramUserId and contextProfile
  useEffect(() => {
    setPageLoading(true);
    if (paramUserId) {
      if (contextProfile && contextProfile.userId === paramUserId) {
        // Case 1: Viewing the currently logged-in user's card.
        // Use their live data from the global context. No fetching, no patching needed here.
        setPageDisplayProfile(contextProfile); // For potential local use, though CardPreview uses context
        setIsViewingOwnLiveCard(true);
        setPageLoading(false);
      } else {
        // Case 2: Viewing someone else's card, or no one is logged in that matches paramUserId.
        // Fetch data for paramUserId.
        setIsViewingOwnLiveCard(false);
        const fetchProfileById = async (id: string) => {
          await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
          if (id === initialProfileData.userId) { // Mock "database" lookup
            setPageDisplayProfile(initialProfileData);
          } else {
            setPageDisplayProfile(null); // User not found
          }
          setPageLoading(false);
        };
        fetchProfileById(paramUserId);
      }
    } else {
      setPageDisplayProfile(null); // No User ID in params
      setIsViewingOwnLiveCard(false);
      setPageLoading(false);
    }
  }, [paramUserId, contextProfile]); // Re-run if paramUserId changes or logged-in user (contextProfile) changes

  // Step 2: If displaying an external card (NOT own live card), patch the global context.
  // CardPreview component will pick this patched context up via useProfile().
  useEffect(() => {
    if (isViewingOwnLiveCard) {
      // If we switched to viewing our own live card, and a patch was active, ensure it's cleaned up.
      if (isActiveContextPatch.current) {
        if (originalContextProfileBeforePatch.current !== undefined) {
          setContextProfile(originalContextProfileBeforePatch.current);
        }
        if (originalThemeIdBeforePatch.current !== undefined) {
          setContextCurrentThemeId(originalThemeIdBeforePatch.current);
        }
        isActiveContextPatch.current = false;
        originalContextProfileBeforePatch.current = undefined;
        originalThemeIdBeforePatch.current = undefined;
      }
      return; // No context patching needed for own live card.
    }

    // Logic for external cards (isViewingOwnLiveCard is false)
    if (pageDisplayProfile) {
      // We have a profile for an external card. We need to patch the global context
      // so CardPreview (which uses useProfile) displays this external card's data.
      const needsPatch =
        contextProfile?.userId !== pageDisplayProfile.userId ||
        contextCurrentThemeId !== pageDisplayProfile.theme;

      if (needsPatch) {
        if (!isActiveContextPatch.current) {
          // This is the first time we're patching for this external card (or after a restoration)
          originalContextProfileBeforePatch.current = contextProfile ? { ...contextProfile } : null;
          originalThemeIdBeforePatch.current = contextCurrentThemeId;
          isActiveContextPatch.current = true; // Mark that we are now managing the context for an external card
        }
        // Perform the patch
        setContextProfile(pageDisplayProfile);
        setContextCurrentThemeId(pageDisplayProfile.theme);
      }
    } else if (isActiveContextPatch.current) {
      // External card profile is null (e.g., not found), but a patch was active. Restore context.
      if (originalContextProfileBeforePatch.current !== undefined) {
        setContextProfile(originalContextProfileBeforePatch.current);
      }
      if (originalThemeIdBeforePatch.current !== undefined) {
        setContextCurrentThemeId(originalThemeIdBeforePatch.current);
      }
      isActiveContextPatch.current = false;
      originalContextProfileBeforePatch.current = undefined;
      originalThemeIdBeforePatch.current = undefined;
    }

    // Cleanup function for this effect instance
    return () => {
      if (isActiveContextPatch.current) {
        // If the component unmounts or dependencies change while a patch for an external card was active, restore.
        if (originalContextProfileBeforePatch.current !== undefined) {
          setContextProfile(originalContextProfileBeforePatch.current);
        }
        if (originalThemeIdBeforePatch.current !== undefined) {
          setContextCurrentThemeId(originalThemeIdBeforePatch.current);
        }
        isActiveContextPatch.current = false;
        originalContextProfileBeforePatch.current = undefined;
        originalThemeIdBeforePatch.current = undefined;
      }
    };
  }, [
    isViewingOwnLiveCard,
    pageDisplayProfile,
    contextProfile, // dependency for `needsPatch` and storing original
    contextCurrentThemeId, // dependency for `needsPatch` and storing original
    setContextProfile,
    setContextCurrentThemeId,
  ]);

  // Loading state considers page-specific loading and global context loading if relevant
  if (pageLoading || (contextLoading && !isViewingOwnLiveCard && !contextProfile)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
        <p className="mt-4 text-xl">Loading Digital Card...</p>
      </div>
    );
  }

  // If pageDisplayProfile is null AND we are not viewing our own live card (which would mean contextProfile is also null)
  // This typically means an external card was not found.
  if (!pageDisplayProfile && !isViewingOwnLiveCard) {
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
  
  // If isViewingOwnLiveCard is true, CardPreview uses the live global context.
  // If displaying an external card (isViewingOwnLiveCard is false) and pageDisplayProfile exists,
  // the global context has been patched to pageDisplayProfile, and CardPreview uses that.
  // If pageDisplayProfile is null but isViewingOwnLiveCard is true, it means contextProfile is null,
  // CardPreview will handle this by showing its "no profile" state.

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 p-4 dark:from-slate-800 dark:to-slate-900 md:p-8">
      <div className="w-full max-w-lg">
         <CardPreview /> {/* CardPreview always uses useProfile() to get its data */}
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
