"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { UserProfile } from "@/types";
import { initialProfileData } from "@/types";

// Dynamic import for better code-splitting
const CardPreview = dynamic(() =>
  import("@/components/dashboard/card-preview").then((mod) => mod.CardPreview)
);

export default function UserCardPage() {
  const params = useParams();
  // Accept shortId as param for card page
  const paramShortIdString =
    params && "userId" in params ? params.userId : undefined;
  const paramShortId = Array.isArray(paramShortIdString)
    ? paramShortIdString[0]
    : paramShortIdString;

  const [cardProfile, setCardProfile] = useState<UserProfile | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setPageLoading(true);
    if (!paramShortId) {
      setCardProfile(null);
      setPageLoading(false);
      return;
    }
    // Fetch by shortId instead of userId
    fetch(`/api/user/by-token?shortId=${paramShortId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setCardProfile(data);
        setPageLoading(false);
      });
  }, [paramShortId]);

  if (pageLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
        <p className="mt-4 text-xl">Loading Porichoy Card...</p>
      </div>
    );
  }

  if (!cardProfile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
        <h1 className="mb-4 text-4xl font-bold">Card Not Found</h1>
        <p className="mb-8 text-lg">
          The digital business card you're looking for doesn't exist or is
          unavailable.
        </p>
      </div>
    );
  }

  // Only show the card preview, no buttons or navigation
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-800 dark:to-slate-900 md:p-0 p-0">
      <div className="w-full max-w-lg">
        <CardPreview hideShareLink />
      </div>
    </div>
  );
}
