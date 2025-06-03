import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a unique 8-character ID from a userId (deterministic, non-reversible)
export function generateShortIdFromUserId(userId: string): string {
  // Use SHA-256 hash, then base64 encode and make it URL-safe manually
  const hash = crypto.createHash("sha256").update(userId).digest("base64");
  // Convert to URL-safe base64 (replace + with -, / with _, remove =)
  const base64url = hash
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return base64url.slice(0, 8);
}
