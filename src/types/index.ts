export const DEFAULT_PROFILE_PICTURE_URL = "https://placehold.co/150x150.png";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label?: string;
  isVisible: boolean;
}

export interface Skill {
  id: string;
  name: string;
  isVisible: boolean;
}

export const DEFAULT_SKILLS = [
  { id: "s1", name: "App development", isVisible: true },
  { id: "s2", name: "Speed cubing", isVisible: true },
  { id: "s3", name: "Debating", isVisible: false },
];

export const DEFAULT_EDUCATION = [
  {
    id: "e1",
    degree: "MBA, Business Administration",
    period: "2016 - 2018",
    isVisible: true,
    institution: "Tech University",
  },
  {
    id: "e2",
    degree: "B.Sc. Computer Science",
    period: "2012 - 2016",
    isVisible: true,
    institution: "State College",
  },
];

export const DEFAULT_LINKS = [
  {
    id: "l1",
    url: "https://linkedin.com/in/alexjohnson",
    label: "LinkedIn",
    platform: "LinkedIn",
    isVisible: true,
  },
  {
    id: "l2",
    url: "https://twitter.com/alexjohnson",
    label: "Twitter",
    platform: "Twitter",
    isVisible: true,
  },
  {
    id: "l3",
    url: "https://alexjohnson.dev",
    label: "Website",
    platform: "Personal Website",
    isVisible: false,
  },
];

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  period: string;
  isVisible: boolean;
}

export interface ProfessionalDetail {
  id: string;
  profession: string;
  company?: string;
  location?: string;
  isVisible?: boolean;
}

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  headline: string;
  profession: string;
  company: string;
  location: string;
  profilePictureUrl: string;
  contactEmail: string;
  contactPhone: string;
  skills: Skill[];
  education: EducationEntry[];
  links: SocialLink[];
  professionalDetails: ProfessionalDetail[];

  showHeadline: boolean;
  showProfession: boolean;
  showCompany: boolean;
  showLocation: boolean;
  showContactEmail: boolean;
  showContactPhone: boolean;
}

export const initialProfileData: UserProfile = {
  userId: "12345",
  firstName: "Alex",
  lastName: "Johnson",
  headline: "Innovator | Leader | Tech Enthusiast",
  profession: "Product Manager",
  company: "Innovatech Ltd.",
  location: "New York, USA",
  profilePictureUrl: "https://placehold.co/150x150.png",
  contactEmail: "alex.johnson@example.com",
  contactPhone: "+1 123 456 7890",
  skills: [
    { id: "s1", name: "Product Strategy", isVisible: true },
    { id: "s2", name: "Agile Methodologies", isVisible: true },
    { id: "s3", name: "UX Design", isVisible: false },
    { id: "s4", name: "Market Analysis", isVisible: true },
  ],
  education: [
    {
      id: "e1",
      institution: "Tech University",
      degree: "MBA, Business Administration",
      period: "2016 - 2018",
      isVisible: true,
    },
    {
      id: "e2",
      institution: "State College",
      degree: "B.Sc. Computer Science",
      period: "2012 - 2016",
      isVisible: true,
    },
  ],
  links: [
    {
      id: "l1",
      platform: "LinkedIn",
      url: "https://linkedin.com/in/alexjohnson",
      label: "LinkedIn",
      isVisible: true,
    },
    {
      id: "l2",
      platform: "Twitter",
      url: "https://twitter.com/alexjohnson",
      label: "Twitter",
      isVisible: true,
    },
    {
      id: "l3",
      platform: "Personal Website",
      url: "https://alexjohnson.dev",
      label: "Website",
      isVisible: false,
    },
  ],
  showHeadline: true,
  showProfession: true,
  showCompany: true,
  showLocation: true,
  showContactEmail: true,
  showContactPhone: true,
  professionalDetails: [],
};
