"use client";

import { availableThemes, getThemeById } from "@/types";
import { useProfile } from "@/contexts/profile-context";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function ThemeSelector() {
  const { profile, setProfile, currentThemeId, setCurrentThemeId } = useProfile();

  const handleThemeChange = (themeId: string) => {
    if (profile) {
      setProfile({ ...profile, theme: themeId });
      setCurrentThemeId(themeId);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Select Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {availableThemes.map((theme) => (
            <div key={theme.id} className="flex flex-col items-center space-y-2">
              <button
                type="button"
                onClick={() => handleThemeChange(theme.id)}
                className={cn(
                  "h-16 w-full rounded-lg border-2 transition-all duration-150 ease-in-out",
                  "flex items-center justify-center bg-gradient-to-br",
                  theme.previewClass,
                  currentThemeId === theme.id ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent hover:opacity-80"
                )}
                aria-label={`Select ${theme.name} theme`}
              >
                {currentThemeId === theme.id && (
                  <Check className="h-8 w-8 text-white mix-blend-difference" />
                )}
              </button>
              <Label className="text-sm font-medium text-center">{theme.name}</Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
