
"use client";

import { useEffect, useState } from 'react';
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
    setCurrentThemeId, 
    currentThemeId: contextCurrentThemeId 
  } = useProfile();
  
  const [cardProfile, setCardProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Effect to fetch the specific user's card data
  useEffect(() => {
    const fetchProfileData = async (id: string) => {
      setLoading(true);
      // Simulate API call to fetch profile by ID
      await new Promise(resolve => setTimeout(resolve, 300));
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
  // This ensures CardPreview displays the data of `cardProfile`
  useEffect(() => {
    let originalProfileToRestore: UserProfile | null = null;
    let originalThemeIdToRestore: string | null = null;
    let contextWasPatched = false;

    if (cardProfile && contextProfile) {
      // Patch if the user ID in context is different from cardProfile's,
      // OR if the user ID is the same but the theme in context needs to match cardProfile's theme.
      if (contextProfile.userId !== cardProfile.userId || contextCurrentThemeId !== cardProfile.theme) {
        originalProfileToRestore = contextProfile;
        originalThemeIdToRestore = contextCurrentThemeId;
        contextWasPatched = true;

        setProfile(cardProfile);
        setCurrentThemeId(cardProfile.theme);
      }
    } else if (cardProfile && !contextProfile) {
      // If there's no context profile (e.g. user not logged in, viewing public card directly)
      // still set the context for CardPreview to work.
      // No need to store original context as there isn't one active.
      // A more robust solution might involve a different way to pass data to CardPreview if no user is logged in.
      // For this demo, we'll patch it. The cleanup might not be strictly necessary if no prior context existed.
      originalProfileToRestore = null; // Explicitly null
      originalThemeIdToRestore = contextCurrentThemeId; // Store whatever it was (likely default)
      contextWasPatched = true; // Consider this a patch

      setProfile(cardProfile);
      setCurrentThemeId(cardProfile.theme);
    }

    return () => {
      if (contextWasPatched) {
        // If originalProfileToRestore is null, it means we patched from a "no contextProfile" state.
        // Restoring to null might be correct if that's the true state for a logged-out user.
        setProfile(originalProfileToRestore); 
        if (originalThemeIdToRestore !== null) {
          setCurrentThemeId(originalThemeIdToRestore);
        }
      }
    };
  }, [cardProfile, contextProfile, contextCurrentThemeId, setProfile, setCurrentThemeId]);

  if (loading || contextLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
        <Loader2 className="h-16 w-16 animate-spin text-amber-400" />
        <p className="mt-4 text-xl">Loading Digital Card...</p>
      </div>
    );
  }

  if (!cardProfile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
        <h1 className="mb-4 text-4xl font-bold">Card Not Found</h1>
        <p className="mb-8 text-lg">The digital business card you're looking for doesn't exist or is unavailable.</p>
        <Button onClick={() => router.push('/')} variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-slate-900">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go to Homepage
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-800 dark:to-slate-900 p-4 md:p-8">
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
