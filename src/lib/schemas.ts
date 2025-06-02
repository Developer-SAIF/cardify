import { z } from "zod";

export const socialLinkSchema = z.object({
  id: z.string().min(1, "ID is required"),
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Must be a valid URL"),
  label: z.string().optional(),
  isVisible: z.boolean(),
});

export const skillSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Skill name is required"),
  isVisible: z.boolean(),
});

export const educationEntrySchema = z.object({
  id: z.string().min(1, "ID is required"),
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  period: z.string().min(1, "Period is required"),
  isVisible: z.boolean(),
});

export const professionalDetailSchema = z.object({
  id: z.string().min(1, "ID is required"),
  profession: z.string().min(1, "Profession is required"),
  company: z.string().optional(),
  location: z.string().optional(),
  isVisible: z.boolean().optional(),
});

export const userProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  headline: z
    .string()
    .max(100, "Headline must be 100 characters or less")
    .optional(),
  profession: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  profilePictureUrl: z
    .string()
    .url("Must be a valid URL for profile picture")
    .or(z.literal("")) // allow empty string
    .optional(),
  coverPhotoUrl: z
    .string()
    .url("Must be a valid URL for cover photo")
    .or(z.literal("")) // allow empty string
    .optional(),
  contactEmail: z.string().email("Invalid email address").optional(),
  contactPhone: z.string().optional(), // Add more specific phone validation if needed
  skills: z.array(skillSchema),
  education: z.array(educationEntrySchema),
  links: z.array(socialLinkSchema),
  professionalDetails: z.array(professionalDetailSchema),

  showHeadline: z.boolean(),
  showProfession: z.boolean(),
  showCompany: z.boolean(),
  showLocation: z.boolean(),
  showContactEmail: z.boolean(),
  showContactPhone: z.boolean(),
});

export type SocialLink = z.infer<typeof socialLinkSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type ProfessionalDetail = z.infer<typeof professionalDetailSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
