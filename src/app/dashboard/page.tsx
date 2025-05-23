"use client";

import { ProfileEditorForm } from '@/components/dashboard/profile-editor-form';
import { CardPreview } from '@/components/dashboard/card-preview';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-4 px-2 md:px-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-8 min-h-[calc(100vh-var(--header-height,4rem)-2rem)]"> {/* Adjust header height if needed */}
        {/* Editor Panel */}
        <div className="md:col-span-7 lg:col-span-8">
          <ScrollArea className="h-[calc(100vh-var(--header-height,4rem)-2rem-2rem)] md:pr-4"> {/* Adjust for padding */}
            <h1 className="text-3xl font-bold tracking-tight mb-6 text-foreground">Edit Your Card</h1>
            <ProfileEditorForm />
          </ScrollArea>
        </div>

        {/* Preview Panel */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="sticky top-[calc(var(--header-height,4rem)+1rem)]"> {/* Adjust for header and top padding */}
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">Live Preview</h2>
             <ScrollArea className="h-[calc(100vh-var(--header-height,4rem)-2rem-2rem-3rem)]"> {/* Adjust for padding and title */}
                <CardPreview />
             </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
