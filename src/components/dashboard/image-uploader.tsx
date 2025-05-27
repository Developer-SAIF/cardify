"use client";

import type { UseFormReturn } from "react-hook-form";
import type { UserProfileFormData } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUp, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ImageUploaderProps {
  form: UseFormReturn<UserProfileFormData>;
  fieldName: "profilePictureUrl";
  label: string;
  aspectRatio?: string; // e.g. "1/1" for square
  dataAiHint?: string;
}

export function ImageUploader({
  form,
  fieldName,
  label,
  aspectRatio = "16/9",
  dataAiHint,
}: ImageUploaderProps) {
  const currentFieldValue = form.watch(fieldName);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    currentFieldValue
  );
  const [canChangeImage, setCanChangeImage] = useState(false);

  useEffect(() => {
    setPreviewUrl(currentFieldValue);
    setCanChangeImage(false); // Reset when value changes
  }, [currentFieldValue]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 32 * 1024 * 1024) {
        alert("Image size must be 32MB or less.");
        return;
      }
      setPreviewUrl(undefined); // Optionally show a loading state
      // Only allow file change if canChangeImage is true
      if (!canChangeImage && previewUrl) return;
      const imgbbUrl = await uploadToImgbb(file);
      if (imgbbUrl) {
        setPreviewUrl(imgbbUrl);
        form.setValue(fieldName, imgbbUrl, {
          shouldValidate: true,
          shouldDirty: true,
        });
        await form.trigger(fieldName); // Ensure form state is updated
        setCanChangeImage(false); // Reset after change
        // Automatically save profile after image upload
        if (form.handleSubmit) {
          form.handleSubmit(async (data) => {
            if (typeof window !== "undefined") {
              // Find the closest form element and submit it
              const formEl = document.querySelector("form");
              if (formEl) formEl.requestSubmit();
            }
          })();
        }
      } else {
        alert("Image upload failed. Please try again.");
      }
    }
  };

  const uploadToImgbb = async (file: File): Promise<string | null> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; // Store your key in .env
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error("Failed to upload image:", res.statusText);
      return null;
    }
    const data = await res.json();
    return data.data?.url || null;
  };

  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    form.setValue(fieldName, "");
    setCanChangeImage(true);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldName} className="text-base font-semibold">
        {label}
      </Label>
      {previewUrl && (
        <div
          className="relative mb-2 overflow-hidden rounded-lg shadow-md"
          style={{ aspectRatio }}
        >
          <Image
            src={previewUrl}
            alt={`${label} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
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
        <label
          htmlFor={fieldName}
          className={`cursor-pointer flex items-center px-3 py-2 border rounded-md bg-background transition ${
            previewUrl && !canChangeImage
              ? "opacity-50 pointer-events-none"
              : "hover:bg-muted"
          }`}
        >
          <ImageUp className="mr-2 h-4 w-4" />
          <span>{previewUrl ? "Change" : "Upload"} Image</span>
          <Input
            id={fieldName}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
            disabled={!!previewUrl && !canChangeImage}
          />
        </label>
      </div>
      {/* Hidden input to satisfy react-hook-form for the URL string */}
      <Input type="hidden" {...form.register(fieldName)} />
    </div>
  );
}
