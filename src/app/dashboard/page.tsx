"use client";

import { ProfileEditorForm } from "@/components/dashboard/profile-editor-form";
import { CardPreview } from "@/components/dashboard/card-preview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";

export default function DashboardPage() {
  const isMobile = useIsMobile();
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="w-full min-h-screen py-2 px-2 md:px-8 lg:px-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-2 min-h-[calc(100vh-var(--header-height,3rem)-2rem)] w-full">
        {/* Editor Panel */}
        <div
          className={`$${
            isMobile ? (showPreview ? "hidden" : "block") : "block"
          } flex flex-col w-full h-full`}
        >
          <ScrollArea className="h-[calc(100vh-var(--header-height,4rem)-2rem-2rem)] md:pr-4">
            <h1 className="text-3xl font-bold tracking-tight mb-6 text-foreground px-2 md:px-6 lg:px-12 flex justify-center text-center">
              Edit Your Card
            </h1>
            <ProfileEditorForm
              isMobile={isMobile}
              showPreview={showPreview}
              setShowPreview={setShowPreview}
            />
          </ScrollArea>
        </div>
        {/* Preview Panel */}
        <div
          className={`$${
            isMobile ? (showPreview ? "block" : "hidden") : "block"
          } flex flex-col w-full h-full`}
        >
          <div className="sticky top-[calc(var(--header-height,4rem)+1rem)] px-2 md:px-6 lg:px-12">
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground flex justify-center text-center">
              Live Preview
            </h2>
            <ScrollArea className="h-[calc(100vh-var(--header-height,4rem)-2rem-2rem-3rem)]">
              <CardPreview />
            </ScrollArea>
            {isMobile && showPreview && (
              <div className="floating-save-btn flex w-full gap-2 mt-4">
                <Button
                  type="button"
                  className="w-full bg-secondary text-primary border border-primary hover:bg-primary hover:text-white"
                  size="lg"
                  onClick={() => setShowPreview(false)}
                  aria-pressed={!showPreview}
                >
                  <Pencil className="mr-2 h-5 w-5" /> Editor preview
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
