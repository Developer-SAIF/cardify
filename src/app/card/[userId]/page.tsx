
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
  const [pageDisplayProfile, setPageDisplayProfile] = useState<UserProfile | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isViewingOwnLiveCard, setIsViewingOwnLiveCard] = useState(false);

  // Refs for context patching
  const isActiveContextPatch = useRef(false);
  const originalContextProfileBeforePatch = useRef<UserProfile | null | undefined>(undefined);
  const originalThemeIdBeforePatch = useRef<string | undefined>(undefined);

  // Step 1: Determine behavior: are we viewing our own live card, the demo card, or another external card?
  useEffect(() => {
    setPageLoading(true);
    if (!paramUserId) {
      setPageDisplayProfile(null);
      setIsViewingOwnLiveCard(false);
      setPageLoading(false);
      return;
    }

    const isDemoCardRoute = paramUserId === initialProfileData.userId;
    // "Own live card" means the URL matches the logged-in user, AND it's NOT the special demo card ID.
    const ownLiveCard = !isDemoCardRoute && contextProfile && contextProfile.userId === paramUserId;

    setIsViewingOwnLiveCard(ownLiveCard);

    if (ownLiveCard) {
      // Viewing own live card (and it's not the demo card ID '12345')
      // Use live data from context; CardPreview will pick this up.
      // No fetching or setting pageDisplayProfile needed here as CardPreview uses context directly.
      setPageLoading(false);
    } else {
      // Viewing an external card OR the special demo card ID '12345'.
      // Fetch data for the paramUserId.
      const fetchProfileData = async (id: string) => {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        if (id === initialProfileData.userId) {
          // This covers the demo card ID '12345', ensuring it always loads initialProfileData.
          setPageDisplayProfile(initialProfileData);
        } else {
          // For any other ID, it's considered "not found" in this demo app.
          // console.warn(`Profile for user ID ${id} not found. This app primarily knows about ID ${initialProfileData.userId}.`);
          setPageDisplayProfile(null);
        }
        setPageLoading(false);
      };
      fetchProfileData(paramUserId);
    }
  }, [paramUserId, contextProfile]);


  // Step 2: If displaying an external card (or the demo card), patch the global context.
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

    // Logic for external cards OR the demo card (isViewingOwnLiveCard is false)
    if (pageDisplayProfile) {
      // We have a profile to display (either fetched external or initialProfileData for demo).
      // We need to patch the global context so CardPreview displays this card's data.
      const needsPatch =
        contextProfile?.userId !== pageDisplayProfile.userId ||
        contextProfile?.theme !== pageDisplayProfile.theme || // Check all relevant fields
        contextCurrentThemeId !== pageDisplayProfile.theme;

      if (needsPatch) {
        if (!isActiveContextPatch.current) {
          // This is the first time we're patching for this external/demo card
          originalContextProfileBeforePatch.current = contextProfile ? { ...contextProfile } : null;
          originalThemeIdBeforePatch.current = contextCurrentThemeId;
          isActiveContextPatch.current = true;
        }
        // Perform the patch
        setContextProfile(pageDisplayProfile);
        setContextCurrentThemeId(pageDisplayProfile.theme);
      }
    } else if (isActiveContextPatch.current) {
      // External/demo card profile is null (e.g., not found), but a patch was active. Restore context.
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
        // If the component unmounts or dependencies change while a patch for an external/demo card was active, restore.
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
    contextProfile,
    contextCurrentThemeId,
    setContextProfile,
    setContextCurrentThemeId,
  ]);


  if (pageLoading || (contextLoading && !isViewingOwnLiveCard && !pageDisplayProfile && !contextProfile)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
        <p className="mt-4 text-xl">Loading Digital Card...</p>
      </div>
    );
  }

  // If we are not viewing our own live card, and pageDisplayProfile is null, it means card not found.
  if (!isViewingOwnLiveCard && !pageDisplayProfile) {
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
  
  // CardPreview always uses useProfile() to get its data.
  // - If isViewingOwnLiveCard is true, context is already live.
  // - If isViewingOwnLiveCard is false (external or demo card), context has been patched by the effect above.
  // - If contextProfile is null (e.g. no user logged in and viewing own non-existent card), CardPreview shows its "no profile" state.

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
