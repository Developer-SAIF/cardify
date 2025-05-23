
"use client";

import Image from 'next/image';
import type { UserProfile } from '@/types';
import { getThemeById, availableThemes } from '@/types';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Link as LinkIcon, Sparkles, Building, User, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfile } from '@/contexts/profile-context';
import { Skeleton } from '@/components/ui/skeleton';

const IconMap: Record<string, React.ElementType> = {
  linkedin: Globe,
  github: Globe,
  twitter: Globe,
  website: Globe,
  email: Mail,
  phone: Phone,
  default: LinkIcon,
};

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
  
  // Use currentThemeId directly as it's the live selected theme.
  // currentThemeId is guaranteed to be a string by ProfileContext.
  const theme = getThemeById(currentThemeId); 
  const cardThemeClass = theme.gradientClass;

  return (
    <div className={cn("w-full max-w-md mx-auto rounded-xl shadow-2xl overflow-hidden text-white p-1", cardThemeClass)}>
      <div className="bg-background/80 backdrop-blur-md rounded-lg p-6 space-y-6 text-foreground">
        {/* Cover Photo */}
        <div className="relative h-32 md:h-40 -m-6 mb-0 rounded-t-lg overflow-hidden">
          {profile.coverPhotoUrl ? (
            <Image src={profile.coverPhotoUrl} alt="Cover photo" layout="fill" objectFit="cover" data-ai-hint="abstract background" />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-muted-foreground/50" />
            </div>
          )}
           {/* Profile Picture */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-background shadow-lg overflow-hidden bg-muted">
            {profile.profilePictureUrl ? (
              <Image src={profile.profilePictureUrl} alt={`${profile.firstName} ${profile.lastName}`} layout="fill" objectFit="cover" data-ai-hint="profile person" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-muted-foreground/50" />
              </div>
            )}
          </div>
        </div>

        {/* Spacer for Profile Picture */}
        <div className="pt-12 md:pt-14" /> 

        {/* Name & Headline */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">{profile.firstName} {profile.lastName}</h1>
          {profile.showHeadline && profile.headline && <p className="text-md text-foreground/80 mt-1">{profile.headline}</p>}
        </div>

        {/* Professional Info */}
        {(profile.showProfession || profile.showCompany || profile.showLocation) && (
          <div className="space-y-2 text-sm">
            {profile.showProfession && profile.profession && (
              <div className="flex items-center justify-center">
                <Briefcase className="mr-2 h-4 w-4 text-primary" />
                <span>{profile.profession}</span>
              </div>
            )}
            {profile.showCompany && profile.company && (
              <div className="flex items-center justify-center">
                <Building className="mr-2 h-4 w-4 text-primary" />
                <span>{profile.company}</span>
              </div>
            )}
            {profile.showLocation && profile.location && (
              <div className="flex items-center justify-center">
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Contact Info */}
        {(profile.showContactEmail || profile.showContactPhone) && (
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            {profile.showContactEmail && profile.contactEmail && (
              <div className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                <a href={`mailto:${profile.contactEmail}`} className="hover:underline break-all">{profile.contactEmail}</a>
              </div>
            )}
            {profile.showContactPhone && profile.contactPhone && (
              <div className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                <a href={`tel:${profile.contactPhone}`} className="hover:underline">{profile.contactPhone}</a>
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        {profile.skills.some(s => s.isVisible) && (
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider text-primary">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.filter(s => s.isVisible).map(skill => (
                <span key={skill.id} className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full font-medium">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.education.some(e => e.isVisible) && (
          <div className="border-t border-border pt-4 space-y-3">
            <h3 className="text-sm font-semibold mb-1 uppercase tracking-wider text-primary">Education</h3>
            {profile.education.filter(e => e.isVisible).map(edu => (
              <div key={edu.id} className="text-sm">
                <div className="flex items-start">
                  <GraduationCap className="mr-3 mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{edu.institution}</p>
                    <p className="text-foreground/80">{edu.degree}</p>
                    <p className="text-xs text-foreground/60">{edu.period}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Links */}
        {profile.links.some(l => l.isVisible) && (
          <div className="border-t border-border pt-4 space-y-2">
            <h3 className="text-sm font-semibold mb-1 uppercase tracking-wider text-primary">Links</h3>
            {profile.links.filter(l => l.isVisible).map(link => {
              const Icon = IconMap[link.platform.toLowerCase()] || IconMap.default;
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:text-primary transition-colors group">
                  <Icon className="mr-3 h-5 w-5 text-primary/80 group-hover:text-primary flex-shrink-0" />
                  <span className="truncate group-hover:underline">{link.label || link.platform}</span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


function CardPreviewSkeleton() {
  const theme = availableThemes[0]; // Default theme for skeleton
  return (
     <div className={cn("w-full max-w-md mx-auto rounded-xl shadow-2xl overflow-hidden text-white p-1", theme.gradientClass)}>
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

