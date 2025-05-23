
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
  const { userId: paramUserIdString } = params;
  const paramUserId = Array.isArray(paramUserIdString) ? paramUserIdString[0] : paramUserIdString;

  const {
    profile: contextProfile,
    loading: contextLoading,
    setProfile: setContextProfile,
    currentThemeId: contextCurrentThemeId,
    setCurrentThemeId: setContextCurrentThemeId,
  } = useProfile();

  const [cardProfile, setCardProfile] = useState<UserProfile | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Refs for context patching
  const isActiveContextPatch = useRef(false);
  const originalContextProfileBeforePatch = useRef<UserProfile | null | undefined>(undefined);
  const originalThemeIdBeforePatch = useRef<string | undefined>(undefined);

  // Step 1: Fetch profile for the card page if it's not the logged-in user's live view
  useEffect(() => {
    setPageLoading(true);
    if (!paramUserId) {
      setCardProfile(null);
      setPageLoading(false);
      return;
    }

    // If paramUserId matches the logged-in user's ID, we will use live context.
    // Otherwise, fetch.
    if (contextProfile && contextProfile.userId === paramUserId) {
      // We are viewing our own card. Rely on live context.
      // No specific cardProfile fetching needed here. CardPreview will use global context.
      // The patching logic in the next effect will handle if context needs to reflect this specific card.
      // If it's our own card, the context should already be "live" and no patch needed.
      setCardProfile(contextProfile); // Set cardProfile for consistency for the loading/not found logic
      setPageLoading(false);
    } else {
      // Fetch data for an external card or the demo card.
      const fetchProfileData = async (id: string) => {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        if (id === initialProfileData.userId) {
          setCardProfile(initialProfileData);
        } else {
          setCardProfile(null);
        }
        setPageLoading(false);
      };
      fetchProfileData(paramUserId);
    }
  }, [paramUserId, contextProfile]); // Only re-run if paramUserId or contextProfile (for ID check) changes.

  // Step 2: Patch global context if displaying an external/demo card; restore on cleanup.
  useEffect(() => {
    const isViewingOwnCard = contextProfile && contextProfile.userId === paramUserId;

    if (isViewingOwnCard) {
      // Viewing own card: ensure any patch is cleaned up if it was active.
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
      return; // No context patching needed.
    }

    // Viewing an external or demo card:
    if (cardProfile) { // cardProfile is the fetched/initial data
      const needsPatch =
        contextProfile?.userId !== cardProfile.userId ||
        contextProfile?.theme !== cardProfile.theme ||
        contextCurrentThemeId !== cardProfile.theme;

      if (needsPatch) {
        if (!isActiveContextPatch.current) {
          // Start of a patch: store original context
          originalContextProfileBeforePatch.current = contextProfile ? { ...contextProfile } : null;
          originalThemeIdBeforePatch.current = contextCurrentThemeId;
          isActiveContextPatch.current = true;
        }
        // Apply patch
        setContextProfile(cardProfile);
        setCurrentThemeId(cardProfile.theme);
      }
      // If no patch is needed (context already matches cardProfile), do nothing.
    } else if (isActiveContextPatch.current) {
      // cardProfile is null (e.g., not found), but a patch was active. Restore.
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

    return () => {
      // Cleanup: If a patch was active when component unmounts or dependencies change
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
    };
  }, [
    cardProfile, // Data for the card being viewed on this page
    contextProfile, // Global context profile
    contextCurrentThemeId, // Global context theme
    paramUserId, // From URL
    setContextProfile,
    setContextCurrentThemeId,
  ]);

  // Loading state logic
  const isLoading = pageLoading || (contextLoading && (!cardProfile || (contextProfile && contextProfile.userId !== paramUserId && !cardProfile)));


  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
        <p className="mt-4 text-xl">Loading Digital Card...</p>
      </div>
    );
  }

  // Not viewing own card AND (cardProfile is null or contextProfile means nothing is loaded for this paramUserId)
  const isOwnCard = contextProfile && contextProfile.userId === paramUserId;
  if (!isOwnCard && !cardProfile) {
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
