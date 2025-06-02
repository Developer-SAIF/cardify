"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useProfile } from "@/contexts/profile-context";
import type { UserProfile } from "@/types";
import { initialProfileData } from "@/types";

// Dynamic import for better code-splitting
const CardPreview = dynamic(() =>
  import("@/components/dashboard/card-preview").then((mod) => mod.CardPreview)
);

export default function UserCardPage() {
  const params = useParams();
  const router = useRouter();
  const paramUserIdString =
    params && "userId" in params ? params.userId : undefined;
  const paramUserId = Array.isArray(paramUserIdString)
    ? paramUserIdString[0]
    : paramUserIdString;

  const {
    profile: contextProfile,
    loading: contextLoading,
    setProfile: setContextProfile,
  } = useProfile();

  const [cardProfile, setCardProfile] = useState<UserProfile | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Refs for context patching
  const isActiveContextPatch = useRef(false);
  const originalContextProfileBeforePatch = useRef<
    UserProfile | null | undefined
  >(undefined);

  // Step 1: Fetch profile for the card page if it's not the logged-in user's live view
  useEffect(() => {
    setPageLoading(true);
    if (!paramUserId) {
      setCardProfile(null);
      setPageLoading(false);
      return;
    }
    if (contextProfile && contextProfile.userId === paramUserId) {
      setCardProfile(contextProfile);
      setPageLoading(false);
    } else {
      const fetchProfileData = async (id: string) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
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

  // Loading state logic
  const isLoading =
    pageLoading ||
    (contextLoading &&
      (!cardProfile ||
        (contextProfile &&
          contextProfile.userId !== paramUserId &&
          !cardProfile)));

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
        <p className="mb-8 text-lg">
          The digital business card you're looking for doesn't exist or is
          unavailable.
        </p>
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="border-white bg-transparent text-white hover:bg-white hover:text-slate-900"
        >
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
              <ArrowLeft className="mr-2 h-4 w-4" /> Create Your Own Porichoy
              Card
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
