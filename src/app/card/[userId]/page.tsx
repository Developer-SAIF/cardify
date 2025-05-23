"use client"; // This page can be client-side if data fetching depends on client, or server if data is fetched on server

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CardPreview } from '@/components/dashboard/card-preview';
import { useProfile } from '@/contexts/profile-context'; // Using this context for simplicity to load the one profile
import type { UserProfile } from '@/types';
import { initialProfileData } from '@/types';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UserCardPage() {
  const params = useParams();
  const router = useRouter();
  const { userId: paramUserId } = params;
  const { profile: contextProfile, loading: contextLoading, setProfile, setCurrentThemeId } = useProfile();
  const [cardProfile, setCardProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async (id: string) => {
      setLoading(true);
      // Simulate API call to fetch profile by ID
      await new Promise(resolve => setTimeout(resolve, 300));
      if (id === initialProfileData.userId) {
        setCardProfile(initialProfileData);
        // If this page loads directly, we might want to set the context for preview consistency
        // This is a bit of a hack for the demo to ensure the preview theme context is set
        if (!contextProfile || contextProfile.userId !== initialProfileData.userId) {
          setProfile(initialProfileData); 
          setCurrentThemeId(initialProfileData.theme);
        } else {
           setCurrentThemeId(contextProfile.theme);
        }
      } else {
        setCardProfile(null); // User not found
      }
      setLoading(false);
    };

    if (paramUserId && typeof paramUserId === 'string') {
      fetchProfileData(paramUserId);
    } else {
      setLoading(false); // No User ID in params
    }
  }, [paramUserId, setProfile, setCurrentThemeId, contextProfile]);

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

  // Temporarily set profile context for CardPreview if not already set or different
  // This is to make CardPreview component (which uses useProfile) work on this public page
  // This is a workaround for the demo. Ideally, CardPreview would take profile as a prop directly.
  let originalContextProfile: UserProfile | null = null;
  let originalThemeId: string | null = null;
  if (contextProfile?.userId !== cardProfile.userId) {
    originalContextProfile = contextProfile;
    originalThemeId = contextProfile?.theme || null; // Assuming useProfile has currentThemeId too
    setProfile(cardProfile);
    setCurrentThemeId(cardProfile.theme);
  }
  
  // Cleanup function to restore context if it was changed
  useEffect(() => {
    return () => {
      if (originalContextProfile !== null && originalThemeId !== null) {
        setProfile(originalContextProfile);
        setCurrentThemeId(originalThemeId);
      }
    };
  }, [originalContextProfile, originalThemeId, setProfile, setCurrentThemeId]);


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
