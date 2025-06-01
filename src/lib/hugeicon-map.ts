import { HugeiconsIcon } from "@hugeicons/react";
import {
  Linkedin01Icon,
  Github01Icon,
  TwitterIcon,
  Facebook01Icon,
  InstagramIcon,
  GlobeIcon,
  Mail01Icon,
  PhoneCheckIcon,
  YoutubeIcon,
  WhatsappIcon,
  TelegramIcon,
  LinkCircleIcon,
} from "@hugeicons/core-free-icons";

// Map to icon references
const hugeiconMap: Record<string, any> = {
  linkedin: Linkedin01Icon,
  github: Github01Icon,
  twitter: TwitterIcon,
  facebook: Facebook01Icon,
  instagram: InstagramIcon,
  website: GlobeIcon,
  email: Mail01Icon,
  phone: PhoneCheckIcon,
  youtube: YoutubeIcon,
  whatsapp: WhatsappIcon,
  telegram:   TelegramIcon,
  default: LinkCircleIcon,
};

export function getHugeiconForLink(link: { platform?: string; url?: string }) {
  if (!link) return hugeiconMap.default;
  const platform = link.platform?.toLowerCase() || "";
  const url = link.url?.toLowerCase() || "";
  for (const key of Object.keys(hugeiconMap)) {
    if (platform.includes(key) || url.includes(key)) {
      return hugeiconMap[key];
    }
  }
  return hugeiconMap.default;
}