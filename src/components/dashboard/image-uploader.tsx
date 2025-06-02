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
  fieldName: "profilePictureUrl" | "coverPhotoUrl";
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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setPreviewUrl(currentFieldValue);
    setCanChangeImage(false); // Reset when value changes
  }, [currentFieldValue]);

  // Helper to add fetch timeout
  function fetchWithTimeout(
    resource: RequestInfo,
    options: RequestInit = {},
    timeout = 15000
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Request timed out"));
      }, timeout);
      fetch(resource, options)
        .then((response) => {
          clearTimeout(timer);
          resolve(response);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  const uploadToImgbb = async (file: File): Promise<string | null> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; // Store your key in .env
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetchWithTimeout(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        },
        15000 // 15 seconds timeout
      );
      if (!res.ok) {
        console.error("Failed to upload image:", res.statusText);
        return null;
      }
      const data = await res.json();
      return data.data?.url || null;
    } catch (err: any) {
      if (err.message === "Request timed out") {
        setUploadError("Image upload timed out. Please try again.");
      } else {
        setUploadError("Image upload failed. Please try again.");
      }
      return null;
    }
  };

  // Helper to process image to required aspect ratio and size
  async function processImage(
    file: File,
    targetWidth: number,
    targetHeight: number,
    aspectRatio: string
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        // Calculate cropping
        const inputAspect = img.width / img.height;
        const [arW, arH] = aspectRatio.split("/").map(Number);
        const outputAspect = arW / arH;
        let sx = 0,
          sy = 0,
          sw = img.width,
          sh = img.height;
        if (inputAspect > outputAspect) {
          // Crop width
          sw = img.height * outputAspect;
          sx = (img.width - sw) / 2;
        } else if (inputAspect < outputAspect) {
          // Crop height
          sh = img.width / outputAspect;
          sy = (img.height - sh) / 2;
        }
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Image processing failed"));
          },
          "image/jpeg",
          0.85 // quality
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

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
      setIsUploading(true);
      setUploadError(null);
      // Only allow file change if canChangeImage is true
      if (!canChangeImage && previewUrl) return;
      // Determine target size and aspect ratio
      let targetWidth = 1280,
        targetHeight = 400,
        ar = aspectRatio || "16/9";
      if (fieldName === "profilePictureUrl") {
        targetWidth = 400;
        targetHeight = 400;
        ar = "1/1";
      } else if (fieldName === "coverPhotoUrl") {
        targetWidth = 1280;
        targetHeight = 400;
        ar = "16/5";
      }
      try {
        const processedBlob = await processImage(
          file,
          targetWidth,
          targetHeight,
          ar
        );
        const processedFile = new File([processedBlob], file.name, {
          type: "image/jpeg",
        });
        const imgbbUrl = await uploadToImgbb(processedFile);
        setIsUploading(false);
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
          setUploadError("Image upload failed or timed out. Please try again.");
        }
      } catch (err) {
        setIsUploading(false);
        setUploadError("Image processing failed. Please try again.");
      }
    }
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
      {/* Recommendation message for image ratio */}
      {fieldName === "profilePictureUrl" && (
        <div className="text-xs text-muted-foreground">
          Recommended: Upload a square (1:1 ratio) profile picture for best
          results.
        </div>
      )}
      {fieldName === "coverPhotoUrl" && (
        <div className="text-xs text-muted-foreground">
          Recommended: Upload a wide (16:5 ratio) cover photo for best results.
        </div>
      )}
      {isUploading && (
        <div className="text-sm text-muted-foreground">Uploading image...</div>
      )}
      {uploadError && <div className="text-sm text-red-500">{uploadError}</div>}
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
