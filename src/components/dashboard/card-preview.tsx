"use client";

import { DEFAULT_PROFILE_PICTURE_URL } from "@/types";
import Image from "next/image";
import { getThemeById, availableThemes } from "@/types";
import { cn } from "@/lib/utils";
import { useProfile } from "@/contexts/profile-context";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import { Globe } from "lucide-react";

export function CardPreview() {
  const { profile, loading: profileLoading, currentThemeId } = useProfile();

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

  const theme = getThemeById(currentThemeId);
  const cardThemeClass = theme.gradientClass;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-10 px-2 bg-transparent">
      <div
        className={cn(
          "w-full max-w-lg mx-auto rounded-3xl shadow-xl overflow-hidden h-full flex flex-col border-4",
          theme.borderClass || "border-primary"
        )}
      >
        <div className="flex flex-col items-center p-10 pt-8 flex-1">
          {/* Profile Picture */}
          <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-neutral-900 shadow-lg overflow-hidden bg-muted mb-4">
            {profile.profilePictureUrl ? (
              <Image
                src={profile.profilePictureUrl || DEFAULT_PROFILE_PICTURE_URL}
                alt={`${profile.firstName} ${profile.lastName}`}
                layout="fill"
                objectFit="cover"
                data-ai-hint="profile person"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-14 h-14 text-muted-foreground/50" />
              </div>
            )}
          </div>
          {/* Name & Headline */}
          <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white mt-2 tracking-tight text-center">
            {profile.firstName} {profile.lastName}
          </h1>
          {profile.showHeadline && profile.headline && (
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mt-2 text-center font-medium">
              {profile.headline}
            </p>
          )}
          {/* Professional & Education Details */}
          {(profile.showProfession && profile.profession) ||
          profile.education.some((e) => e.isVisible) ? (
            <div className="w-full mt-4 mb-2">
              <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-md">
                {profile.showProfession && profile.profession && (
                  <p className="text-neutral-700 dark:text-neutral-200 text-base text-left mb-1">
                    {profile.profession}
                    {profile.showCompany && profile.company && (
                      <> at {profile.company}</>
                    )}
                    {profile.showLocation && profile.location && (
                      <>, {profile.location}</>
                    )}
                  </p>
                )}
                {profile.education.some((e) => e.isVisible) && (
                  <div className="text-neutral-600 dark:text-neutral-300 text-base text-left space-y-1">
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
          ) : null}

          {/* Skills */}
          {profile.skills.some((s) => s.isVisible) && (
            <div className="w-full mt-8">
              <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider text-primary text-center">
                Skills
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {profile.skills
                  .filter((s) => s.isVisible)
                  .map((skill) => (
                    <span
                      key={skill.id}
                      className="px-4 py-1 text-sm bg-primary/10 text-primary rounded-full font-semibold"
                    >
                      {skill.name}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Links with static icon (Globe) */}
          {profile.links.some((l) => l.isVisible) && (
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {profile.links
                .filter((l) => l.isVisible)
                .map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow text-base font-semibold min-w-[120px] justify-center"
                  >
                    <Globe className="h-5 w-5" />
                    {link.label || link.platform}
                  </a>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CardPreviewSkeleton() {
  const theme = availableThemes[0]; // Default theme for skeleton
  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto rounded-xl shadow-2xl overflow-hidden text-white p-1",
        theme.gradientClass
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
