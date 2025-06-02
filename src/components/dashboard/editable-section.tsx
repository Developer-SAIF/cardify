"use client";

import type { ReactNode } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

interface EditableSectionProps {
  title: string;
  description?: string;
  isVisible: boolean;
  onToggleVisibility: (isVisible: boolean) => void;
  children: ReactNode;
  titleClassName?: string;
}

export function EditableSection({
  title,
  description,
  isVisible,
  onToggleVisibility,
  children,
  titleClassName
}: EditableSectionProps) {
  return (
    <Card className="shadow-lg w-full max-w-2xl mx-auto">
      <CardHeader className="px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className={titleClassName || "text-xl"}>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            {isVisible ? <Eye className="h-5 w-5 text-primary" /> : <EyeOff className="h-5 w-5 text-muted-foreground" />}
            <Switch
              id={`visibility-${title.toLowerCase().replace(/\s+/g, '-')}`}
              checked={isVisible}
              onCheckedChange={onToggleVisibility}
              aria-label={`Toggle visibility for ${title}`}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className={isVisible ? "opacity-100 transition-opacity px-2 sm:px-4" : "opacity-60 transition-opacity px-2 sm:px-4"}>
        {children}
      </CardContent>
    </Card>
  );
}
