// Utility to map link platforms/URLs to Hugeicons
import * as Hugeicons from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";

// Add more mappings as needed
const hugeiconMap: Record<string, keyof typeof Hugeicons> = {
  linkedin: "Linkedin01",
  github: "Github01",
  twitter: "Twitter01",
  facebook: "Facebook01",
  instagram: "Instagram01",
  website: "Globe01",
  email: "Mail01",
  phone: "Phone01",
  youtube: "Youtube01",
  whatsapp: "Whatsapp01",
  telegram: "Telegram01",
  default: "Link01",
};

// Try to match by platform or url
export function getHugeiconForLink(link: { platform?: string; url?: string }) {
  if (!link) return Hugeicons[hugeiconMap.default];
  const platform = link.platform?.toLowerCase() || "";
  const url = link.url?.toLowerCase() || "";
  for (const key of Object.keys(hugeiconMap)) {
    if (platform.includes(key) || url.includes(key)) {
      return Hugeicons[hugeiconMap[key]];
    }
  }
  return Hugeicons[hugeiconMap.default];
}
