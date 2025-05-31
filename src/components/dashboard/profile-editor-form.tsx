"use client";

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
import { ThemeSelector } from "./theme-selector";
import { EditableSection } from "./editable-section";
import { DynamicListEditor } from "./dynamic-list-editor";
import { Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

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
      headline: profileData.headline || "",
      professionalDetails: profileData.professionalDetails || [],
      profilePictureUrl: profileData.profilePictureUrl || "",
      contactEmail: profileData.contactEmail || "",
      contactPhone: profileData.contactPhone || "",
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
        className="space-y-8 p-4 md:p-6 lg:p-8"
      >
        <Card>
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
        <Card>
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
        <Card>
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
        <Card>
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
        <ThemeSelector />

        <div className="pt-6">
          <Button
            type="submit"
            className="w-full md:w-auto"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
