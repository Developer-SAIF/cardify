"use client";

import "@/app/floating-save-btn.css";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import type { UserProfileFormData } from "@/lib/schemas";
import { userProfileSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/contexts/profile-context";
import type { UserProfile, SocialLink, Skill, EducationEntry } from "@/types";
import { ImageUploader } from "./image-uploader";
import { EditableSection } from "./editable-section";
import { DynamicListEditor } from "./dynamic-list-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { Eye, Loader2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface ProfileEditorFormProps {
  isMobile?: boolean;
  showPreview?: boolean;
  setShowPreview?: Dispatch<SetStateAction<boolean>>;
}

export function ProfileEditorForm({
  isMobile,
  showPreview,
  setShowPreview,
}: ProfileEditorFormProps) {
  const { profile, setProfile: setProfileContext, loading } = useProfile();
  const { toast } = useToast();
  const router = useRouter();

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
  useEffect(() => {
    if (profile) {
      reset(mapProfileToFormData(profile));
    }
  }, [profile, reset]);

  console.log(profile);
  if (loading || !profile) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />{" "}
        <span className="ml-2">Loading editor...</span>
      </div>
    );
  }

  function mapProfileToFormData(profileData: UserProfile): UserProfileFormData {
    return {
      ...profileData,
      // Remove any forced empty/default values here to preserve previous info
    };
  }

  function mapFormDataToProfile(
    formData: UserProfileFormData,
    existingProfile: UserProfile
  ): UserProfile {
    return {
      ...existingProfile, // preserve userId
      ...formData,
    };
  }

  async function onSubmit(data: UserProfileFormData) {
    if (!profile || !profile.userId) return;
    const updatedProfile = mapFormDataToProfile(data, profile);
    try {
      const response = await fetch(`/api/user/${profile.userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });
      if (!response.ok) {
        throw new Error("Failed to save profile");
      }
      // Only update context after successful save
      setProfileContext(updatedProfile);
      toast({
        title: "Profile Updated",
        description: "Your digital business card has been saved.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description:
          "There was a problem saving your profile. Please try again.",
        variant: "destructive",
      });
    }
  }

  const generateNewSkill = (): Skill => ({
    id: uuidv4(),
    name: "",
    isVisible: true,
  });
  const generateNewEducation = (): EducationEntry => ({
    id: uuidv4(),
    institution: "",
    degree: "",
    period: "",
    isVisible: true,
  });
  const generateNewLink = (): SocialLink => ({
    id: uuidv4(),
    platform: "",
    url: "",
    label: "",
    isVisible: true,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-2 sm:p-4 md:p-6 lg:p-8 max-w-full"
      >
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <ImageUploader
              form={form}
              fieldName="profilePictureUrl"
              label="Profile Picture"
              aspectRatio="1/1"
              dataAiHint="profile avatar"
            />
            {/* Cover Photo Upload */}
            <ImageUploader
              form={form}
              fieldName="coverPhotoUrl"
              label="Cover Photo"
              aspectRatio="16/5"
              dataAiHint="profile cover"
            />
          </CardContent>
        </Card>

        <EditableSection
          title="Headline"
          isVisible={watch("showHeadline")}
          onToggleVisibility={(v) => setValue("showHeadline", v)}
        >
          <FormField
            control={control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Passionate Developer & Tech Enthusiast"
                    {...field}
                    maxLength={100}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </EditableSection>

        <Separator />
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent>
            <DynamicListEditor
              control={control}
              fieldArray={useFieldArray({
                control,
                name: "professionalDetails",
              })}
              listName="professionalDetails"
              itemTitleKey="profession"
              generateNewItem={() => ({
                id: uuidv4(),
                profession: "",
                company: "",
                location: "",
                isVisible: true,
              })}
              fieldsConfig={[
                {
                  name: "profession",
                  label: "Profession / Role",
                  placeholder: "e.g., Software Engineer",
                },
                {
                  name: "company",
                  label: "Company",
                  placeholder: "e.g., Tech Solutions Inc.",
                },
                {
                  name: "location",
                  label: "Location",
                  placeholder: "e.g., San Francisco, CA",
                },
              ]}
              itemClassName="bg-background/50"
            />
          </CardContent>
        </Card>

        <Separator />
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent>
            <DynamicListEditor
              control={control}
              fieldArray={educationArray}
              listName="education"
              itemTitleKey="institution"
              generateNewItem={generateNewEducation}
              fieldsConfig={[
                {
                  name: "institution",
                  label: "Institution",
                  placeholder: "e.g., State University",
                },
                {
                  name: "degree",
                  label: "Degree/Certificate",
                  placeholder: "e.g., B.S. Computer Science",
                },
                {
                  name: "period",
                  label: "Period",
                  placeholder: "e.g., 2018 - 2022",
                },
              ]}
            />
          </CardContent>
        </Card>

        <Separator />
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent>
            <DynamicListEditor
              control={control}
              fieldArray={linksArray}
              listName="links"
              itemTitleKey="platform"
              generateNewItem={generateNewLink}
              fieldsConfig={[
                {
                  name: "platform",
                  label: "Platform",
                  placeholder: "e.g., LinkedIn, GitHub, Website",
                },
                {
                  name: "url",
                  label: "URL",
                  placeholder: "https://example.com",
                  type: "url",
                },
                {
                  name: "label",
                  label: "Custom Label (Optional)",
                  placeholder: "e.g., My Portfolio",
                },
              ]}
            />
          </CardContent>
        </Card>

        <Separator />
        {/* Remove the ThemeSelector component usage */}

        {/* Floating Save/Preview Buttons for mobile */}
        {isMobile ? (
          <div className="pt-6 floating-save-btn flex gap-2 w-full max-w-full">
            <Button
              type="submit"
              className="w-1/2"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              Save
            </Button>
            {showPreview ? (
              <Button
                type="button"
                className="w-1/2 bg-secondary text-primary border border-primary hover:bg-primary hover:text-white"
                size="lg"
                onClick={() => setShowPreview && setShowPreview(false)}
                aria-pressed={!showPreview}
              >
                <Eye className="mr-2 h-5 w-5" /> Editor preview
              </Button>
            ) : (
              <Button
                type="button"
                className="w-1/2 bg-secondary text-primary border border-primary hover:bg-primary hover:text-white"
                size="lg"
                onClick={() => {
                  if (profile?.userId) {
                    router.push(`/card/${profile.userId}`);
                  } else if (setShowPreview) {
                    setShowPreview(true);
                  }
                }}
                aria-pressed={!!showPreview}
              >
                <Eye className="mr-2 h-5 w-5" /> Live Preview
              </Button>
            )}
          </div>
        ) : (
          <div className="pt-6 floating-save-btn w-full max-w-2xl mx-auto">
            <Button
              type="submit"
              className="w-full md:w-auto"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              Save
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
