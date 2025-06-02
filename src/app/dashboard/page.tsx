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
      {/* Tablet: Only show editor, full width. Desktop: grid, both panels. Mobile: toggle */}
      <div className="block md:hidden">
        {/* Mobile layout: toggle between editor and preview */}
        {showPreview ? (
          <div className="w-full h-full">
            <div className="sticky top-[calc(var(--header-height,4rem)+1rem)] px-2">
              <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">
                Live Preview
              </h2>
              <ScrollArea className="h-[calc(100vh-var(--header-height,4rem)-2rem-2rem-3rem)]">
                <CardPreview />
              </ScrollArea>
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
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <ScrollArea className="h-[calc(100vh-var(--header-height,4rem)-2rem-2rem)]">
              <h1 className="text-3xl font-bold tracking-tight mb-6 text-foreground px-2">
                Edit Your Card
              </h1>
              <ProfileEditorForm
                isMobile={isMobile}
                showPreview={showPreview}
                setShowPreview={setShowPreview}
              />
            </ScrollArea>
          </div>
        )}
      </div>
      <div className="hidden md:block lg:hidden">
        {/* Tablet layout: show toggle buttons for editor/preview, full width */}
        <div className="w-full h-full px-8 py-4">
          <div className="flex gap-4 mb-4">
            <Button
              type="button"
              variant={showPreview ? "outline" : "default"}
              className={showPreview ? "" : "bg-primary text-white"}
              onClick={() => setShowPreview(false)}
              aria-pressed={!showPreview}
            >
              <Pencil className="mr-2 h-5 w-5" /> Editor
            </Button>
            <Button
              type="button"
              variant={!showPreview ? "outline" : "default"}
              className={!showPreview ? "" : "bg-primary text-white"}
              onClick={() => setShowPreview(true)}
              aria-pressed={showPreview}
            >
              <Eye className="mr-2 h-5 w-5" /> Live Preview
            </Button>
          </div>
          {showPreview ? (
            <div className="w-full h-full">
              <div className="sticky top-[calc(var(--header-height,4rem)+1rem)] px-2">
                <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">
                  Live Preview
                </h2>
                <ScrollArea className="h-[calc(100vh-var(--header-height,4rem)-2rem-2rem-3rem)]">
                  <CardPreview />
                </ScrollArea>
              </div>
            </div>
          ) : (
            <div className="w-full h-full">
              <ScrollArea className="h-[calc(100vh-var(--header-height,4rem)-2rem-2rem)]">
                <h1 className="text-3xl font-bold tracking-tight mb-6 text-foreground px-2">
                  Edit Your Card
                </h1>
                <ProfileEditorForm
                  isMobile={isMobile}
                  showPreview={showPreview}
                  setShowPreview={setShowPreview}
                />
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
      <div className="hidden lg:grid grid-cols-2 gap-10 min-h-[calc(100vh-var(--header-height,3rem)-2rem)] w-full">
        {/* Desktop layout: editor and preview side by side */}
        <div className="flex flex-col w-full h-full">
          <ScrollArea className="h-[calc(100vh-var(--header-height,4rem)-2rem-2rem)] pr-4">
            <h1 className="text-3xl font-bold tracking-tight mb-6 text-foreground px-2 lg:px-12">
              Edit Your Card
            </h1>
            <ProfileEditorForm
              isMobile={isMobile}
              showPreview={showPreview}
              setShowPreview={setShowPreview}
            />
          </ScrollArea>
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="sticky top-[calc(var(--header-height,4rem)+1rem)] px-2 lg:px-12">
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">
              Live Preview
            </h2>
            <ScrollArea className="h-[calc(100vh-var(--header-height,4rem)-2rem-2rem-3rem)]">
              <CardPreview />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
