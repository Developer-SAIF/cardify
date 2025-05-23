"use client";

import type { UseFormReturn } from 'react-hook-form';
import type { UserProfileFormData } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImageUp, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ImageUploaderProps {
  form: UseFormReturn<UserProfileFormData>;
  fieldName: keyof Pick<UserProfileFormData, 'profilePictureUrl' | 'coverPhotoUrl'>;
  label: string;
  currentImageUrl?: string;
  aspectRatio?: string; // e.g. "1/1" for square, "16/9" for wide
  dataAiHint?: string;
}

export function ImageUploader({ form, fieldName, label, currentImageUrl, aspectRatio = "16/9", dataAiHint }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);

  useEffect(() => {
    setPreviewUrl(currentImageUrl);
  }, [currentImageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newUrl = reader.result as string;
        setPreviewUrl(newUrl);
        // In a real app, upload to imgbb and get URL. For now, use data URL or placeholder.
        // For simplicity, we'll just set a placeholder if it's a real file,
        // or you could use reader.result for local preview.
        // This mock assumes successful upload and returns a placeholder.
        form.setValue(fieldName, `https://placehold.co/${aspectRatio === "1/1" ? "150x150" : "800x300"}.png?text=New+Image`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    form.setValue(fieldName, '');
  };
  
  const currentFieldValue = form.watch(fieldName);
  useEffect(() => {
    setPreviewUrl(currentFieldValue);
  }, [currentFieldValue]);


  return (
    <div className="space-y-2">
      <Label htmlFor={fieldName} className="text-base font-semibold">{label}</Label>
      {previewUrl && (
        <div className="relative mb-2 overflow-hidden rounded-lg shadow-md" style={{ aspectRatio }}>
          <Image
            src={previewUrl}
            alt={`${label} preview`}
            layout="fill"
            objectFit="cover"
            data-ai-hint={dataAiHint || "abstract background"}
            className="bg-muted"
          />
           <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 opacity-80 hover:opacity-100"
            aria-label={`Remove ${label}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" asChild className="cursor-pointer">
            <div>
              <ImageUp className="mr-2 h-4 w-4" />
              <span>{previewUrl ? "Change" : "Upload"} Image</span>
              <Input
                id={fieldName}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
              />
            </div>
        </Button>
      </div>
      {/* Hidden input to satisfy react-hook-form for the URL string */}
      <Input type="hidden" {...form.register(fieldName)} />
    </div>
  );
}
