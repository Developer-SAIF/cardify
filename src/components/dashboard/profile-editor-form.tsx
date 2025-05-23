"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import type { UserProfileFormData } from '@/lib/schemas';
import { userProfileSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/profile-context';
import type { UserProfile, SocialLink, Skill, EducationEntry } from '@/types';
import { ImageUploader } from './image-uploader';
import { ThemeSelector } from './theme-selector';
import { EditableSection } from './editable-section';
import { DynamicListEditor } from './dynamic-list-editor';
import { Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

export function ProfileEditorForm() {
  const { profile, setProfile: setProfileContext, loading } = useProfile();
  const { toast } = useToast();

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: profile ? mapProfileToFormData(profile) : undefined,
    mode: "onChange",
  });

  const { control, watch, setValue, reset } = form;

  const skillsArray = useFieldArray({ control, name: "skills" });
  const educationArray = useFieldArray({ control, name: "education" });
  const linksArray = useFieldArray({ control, name: "links" });

  // Reset form when profile data changes (e.g., on login)
  // useEffect(() => {
  //   if (profile) {
  //     reset(mapProfileToFormData(profile));
  //   }
  // }, [profile, reset]);


  if (loading || !profile) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Loading editor...</span></div>;
  }

  function mapProfileToFormData(profileData: UserProfile): UserProfileFormData {
    return {
      ...profileData,
      headline: profileData.headline || "",
      profession: profileData.profession || "",
      company: profileData.company || "",
      location: profileData.location || "",
      profilePictureUrl: profileData.profilePictureUrl || "",
      coverPhotoUrl: profileData.coverPhotoUrl || "",
      contactEmail: profileData.contactEmail || "",
      contactPhone: profileData.contactPhone || "",
    };
  }

  function mapFormDataToProfile(formData: UserProfileFormData, existingProfile: UserProfile): UserProfile {
     return {
      ...existingProfile, // preserve userId
      ...formData,
    };
  }

  async function onSubmit(data: UserProfileFormData) {
    if (!profile) return;
    
    const updatedProfile = mapFormDataToProfile(data, profile);
    setProfileContext(updatedProfile); // Update context

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    toast({
      title: 'Profile Updated',
      description: 'Your digital business card has been saved.',
    });
  }
  
  const generateNewSkill = (): Skill => ({ id: uuidv4(), name: '', isVisible: true });
  const generateNewEducation = (): EducationEntry => ({ id: uuidv4(), institution: '', degree: '', period: '', isVisible: true });
  const generateNewLink = (): SocialLink => ({ id: uuidv4(), platform: '', url: '', label: '', isVisible: true });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 md:p-6 lg:p-8">
        
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField control={control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="e.g., John" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="e.g., Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
            </div>
            <ImageUploader form={form} fieldName="profilePictureUrl" label="Profile Picture" currentImageUrl={watch("profilePictureUrl")} aspectRatio="1/1" dataAiHint="profile avatar" />
            <ImageUploader form={form} fieldName="coverPhotoUrl" label="Cover Photo" currentImageUrl={watch("coverPhotoUrl")} aspectRatio="16/6" dataAiHint="abstract banner" />
          </CardContent>
        </Card>

        <EditableSection title="Headline" isVisible={watch('showHeadline')} onToggleVisibility={(v) => setValue('showHeadline', v)}>
          <FormField control={control} name="headline" render={({ field }) => ( <FormItem><FormControl><Textarea placeholder="e.g., Passionate Developer & Tech Enthusiast" {...field} maxLength={100} /></FormControl><FormMessage /></FormItem> )} />
        </EditableSection>

        <EditableSection title="Professional Details" description="Your role, company, and location." isVisible={watch('showProfession') || watch('showCompany') || watch('showLocation')} onToggleVisibility={(v) => {setValue('showProfession',v); setValue('showCompany',v); setValue('showLocation',v);}}>
          <div className="space-y-4">
            <FormField control={control} name="profession" render={({ field }) => ( <FormItem><FormLabel>Profession / Role</FormLabel><FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={control} name="company" render={({ field }) => ( <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="e.g., Tech Solutions Inc." {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={control} name="location" render={({ field }) => ( <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., San Francisco, CA" {...field} /></FormControl><FormMessage /></FormItem> )} />
          </div>
        </EditableSection>

        <EditableSection title="Contact Information" isVisible={watch('showContactEmail') || watch('showContactPhone')} onToggleVisibility={(v) => {setValue('showContactEmail',v); setValue('showContactPhone',v)}}>
           <div className="space-y-4">
            <FormField control={control} name="contactEmail" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="e.g., john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={control} name="contactPhone" render={({ field }) => ( <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="e.g., +1-555-0100" {...field} /></FormControl><FormMessage /></FormItem> )} />
          </div>
        </EditableSection>
        
        <Separator />
        <Card>
          <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
          <CardContent>
            <DynamicListEditor
              control={control}
              fieldArray={skillsArray}
              listName="skills"
              itemTitleKey="name"
              generateNewItem={generateNewSkill}
              fieldsConfig={[{ name: 'name', label: 'Skill Name', placeholder: 'e.g., React, Project Management' }]}
              itemClassName="bg-background/50"
            />
          </CardContent>
        </Card>
        
        <Separator />
        <Card>
          <CardHeader><CardTitle>Education</CardTitle></CardHeader>
          <CardContent>
            <DynamicListEditor
              control={control}
              fieldArray={educationArray}
              listName="education"
              itemTitleKey="institution"
              generateNewItem={generateNewEducation}
              fieldsConfig={[
                { name: 'institution', label: 'Institution', placeholder: 'e.g., State University' },
                { name: 'degree', label: 'Degree/Certificate', placeholder: 'e.g., B.S. Computer Science' },
                { name: 'period', label: 'Period', placeholder: 'e.g., 2018 - 2022' },
              ]}
            />
          </CardContent>
        </Card>
        
        <Separator />
        <Card>
          <CardHeader><CardTitle>Links</CardTitle></CardHeader>
          <CardContent>
            <DynamicListEditor
              control={control}
              fieldArray={linksArray}
              listName="links"
              itemTitleKey="platform"
              generateNewItem={generateNewLink}
              fieldsConfig={[
                { name: 'platform', label: 'Platform', placeholder: 'e.g., LinkedIn, GitHub, Website' },
                { name: 'url', label: 'URL', placeholder: 'https://example.com', type: 'url' },
                { name: 'label', label: 'Custom Label (Optional)', placeholder: 'e.g., My Portfolio' },
              ]}
            />
          </CardContent>
        </Card>

        <Separator />
        <ThemeSelector />

        <div className="pt-6">
          <Button type="submit" className="w-full md:w-auto" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
