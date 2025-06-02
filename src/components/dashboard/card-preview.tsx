"use client";

import { DEFAULT_PROFILE_PICTURE_URL } from "@/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useProfile } from "@/contexts/profile-context";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import { getHugeiconForLink } from "@/lib/hugeicon-map";
import { HugeiconsIcon } from "@hugeicons/react";
import { SkillsSlider } from "./skills-slider";

export function CardPreview() {
  const { profile, loading: profileLoading } = useProfile();

  if (profileLoading) {
    return <CardPreviewSkeleton />;
  }

  if (!profile) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed bg-muted/50 p-8 text-center text-muted-foreground">
        <p>No profile data available. Please log in or select a user.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center py-6 px-2 sm:py-10 sm:px-4 bg-transparent">
      <div
        className={cn(
          "w-full max-w-lg rounded-3xl shadow-xl overflow-hidden flex flex-col border-4 border-primary bg-background"
        )}
      >
        <div className="flex flex-col items-stretch p-2 sm:p-4 sm:pt-8 w-full overflow-hidden">
          {/* Cover Photo & Profile Picture Overlap Section */}
          <div className="relative w-full h-32 sm:h-40 -mx-6 mb-4 rounded-t-3xl overflow-visible">
            {profile.coverPhotoUrl && (
              <Image
                src={profile.coverPhotoUrl}
                alt="Cover Photo"
                fill
                style={{ objectFit: "cover" }}
                className="bg-muted"
                data-ai-hint="profile cover"
                priority
              />
            )}
            {/* Profile Picture Overlapping Cover Photo */}
            <div className="absolute left-6 bottom-0 translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-neutral-900 shadow-lg overflow-hidden bg-muted">
              {profile.profilePictureUrl ? (
                <Image
                  src={profile.profilePictureUrl || DEFAULT_PROFILE_PICTURE_URL}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  fill
                  style={{ objectFit: "cover" }}
                  data-ai-hint="profile person"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-14 h-14 text-muted-foreground/50" />
                </div>
              )}
            </div>
          </div>
          {/* Add padding below the cover/profile section for spacing */}
          <div className="pt-16 sm:pt-20" />

          {/* Name & Headline */}
          <div className="flex flex-col items-start pl-6 pr-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white mt-2 tracking-tight break-words">
              {profile.firstName} {profile.lastName}
            </h1>

            {profile.showHeadline && profile.headline && (
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 mt-2 font-medium break-words px-1">
                {profile.headline}
              </p>
            )}
          </div>

          {/* Professional & Education Details */}
          <div className="w-full mt-4 mb-2 pl-6 pr-2">
            <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-md">
              {profile.professionalDetails
                ?.filter((p) => p.isVisible)
                .map((prof) => (
                  <div
                    key={prof.id}
                    className="text-neutral-700 dark:text-neutral-200 text-base text-left mb-1 break-words"
                  >
                    <span className="font-medium">{prof.profession}</span>
                    {prof.company && <span> at {prof.company}</span>}
                    {prof.location && <span>, {prof.location}</span>}
                  </div>
                ))}

              {profile.education.some((e) => e.isVisible) && (
                <div className="text-neutral-600 dark:text-neutral-300 text-base text-left space-y-1 mt-2 break-words">
                  {profile.education
                    .filter((e) => e.isVisible)
                    .map((edu) => (
                      <div key={edu.id}>
                        <span className="font-medium">{edu.institution}</span>
                        {edu.degree && <span>, {edu.degree}</span>}
                        {edu.period && <span> ({edu.period})</span>}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Skills Slider */}
          {profile.skills.some((s) => s.isVisible) && (
            <div className="w-full mt-8 pl-6 pr-2">
              <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider text-primary text-left">
                Skills
              </h3>
              <SkillsSlider
                skills={profile.skills
                  .filter((s) => s.isVisible)
                  .map((s) => s.name)}
              />
            </div>
          )}

          {/* Links with dynamic icons */}
          {profile.links.some((l) => l.isVisible) && (
            <div className="flex flex-col justify-center gap-2 mt-6 w-full pl-6 pr-2">
              {profile.links
                .filter((l) => l.isVisible)
                .map((link) => {
                  const iconRef = getHugeiconForLink(link);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors shadow text-base font-semibold overflow-hidden"
                    >
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={iconRef}
                          className="h-5 w-5 shrink-0"
                        />
                        <span className="truncate break-words">
                          {link.label || link.platform}
                        </span>
                      </div>
                      <div className="text-xs text-white/80 mt-0.5 truncate">
                        {link.url}
                      </div>
                    </a>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CardPreviewSkeleton() {
  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto rounded-xl shadow-2xl overflow-hidden text-white p-1 bg-gradient-to-br from-blue-600 to-teal-500"
      )}
    >
      <div className="bg-background/80 backdrop-blur-md rounded-lg p-6 space-y-6">
        <div className="relative h-32 md:h-40 -m-6 mb-0 rounded-t-lg overflow-hidden">
          <Skeleton className="h-full w-full" />
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-background shadow-lg overflow-hidden">
            <Skeleton className="h-full w-full rounded-full" />
          </div>
        </div>
        <div className="pt-12 md:pt-14" />
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
        <div className="space-y-2 text-sm text-center">
          <Skeleton className="h-4 w-1/3 mx-auto" />
          <Skeleton className="h-4 w-1/4 mx-auto" />
        </div>
        <div className="border-t border-border pt-4 space-y-2 text-sm">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="border-t border-border pt-4 space-y-2">
          <Skeleton className="h-4 w-1/4 mb-2" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
