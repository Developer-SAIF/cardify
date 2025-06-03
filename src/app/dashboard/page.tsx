"use client";

import { ProfileEditorForm } from "@/components/dashboard/profile-editor-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { CardPreview } from "@/components/dashboard/card-preview";

export default function DashboardPage() {
  const isMobile = useIsMobile();
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="w-full min-h-screen py-2 px-2">
      {/* Only show one panel at a time based on showPreview */}
      <div className="flex flex-col w-full h-full">
        {!showPreview ? (
          <ScrollArea className="h-[calc(100vh-var(--header-height,4rem)-2rem-2rem)]">
            <h1 className="text-3xl font-bold tracking-tight mb-6 text-foreground px-2 flex justify-center text-center">
              Edit Your Card
            </h1>
            <ProfileEditorForm
              isMobile={isMobile}
              showPreview={showPreview}
              setShowPreview={setShowPreview}
            />
          </ScrollArea>
        ) : (
          <div
            className="h-[calc(100vh-var(--header-height,4rem)-2rem-2rem)] flex items-center justify-center"
            style={{ position: 'relative', top: 'var(--header-height,4rem)' }}
          >
            <CardPreview />
          </div>
        )}
      </div>
      {/* Floating Preview Buttons - always visible on all screens except mobile */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 hidden md:flex">
        <button
          className={`bg-primary text-white px-5 py-3 rounded-full shadow-lg font-semibold hover:bg-primary/90 transition-colors${
            !showPreview ? " opacity-100" : " opacity-60"
          }`}
          type="button"
          onClick={() => setShowPreview(false)}
          disabled={!showPreview}
        >
          Editor Preview
        </button>
        <button
          className={`bg-secondary text-primary px-5 py-3 rounded-full shadow-lg font-semibold hover:bg-secondary/90 transition-colors border border-primary${
            showPreview ? " opacity-100" : " opacity-60"
          }`}
          type="button"
          onClick={() => setShowPreview(true)}
          disabled={showPreview}
        >
          Live Preview
        </button>
      </div>
    </div>
  );
}
// Add to your globals.css or tailwind.config.js:
// .custom-md { @media (min-width: 1428px) { ... } }
// .custom-lg { @media (min-width: 1600px) { ... } }
