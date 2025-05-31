// src/types.ts

// export interface member {
//   name: string;
//   position: string;
//   img: string;
// }

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

// export interface Icon {
//   iconPath: string;
//   color: string;
// }

// export interface Metric {
//   number: string;
//   label: string;
// }
export interface Skill {
  name: string;
  rating: number;
}

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  address?: string;
  aboutMe?: string;
  linkedin?: string;
  bio?: string;
  gender?: string;
  primaryEmail: string;
  secondaryEmail?: string;
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skill[];
  certification: Certification[];
  portfolio?: string;
  linktree?: string;
  file?: File;
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  graduationYear?: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  description: string;
}

export interface Certification {
  name: string;
  date?: string;
  issuer?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface Job {
  id: string;
  jobName: string;
  jobDescription: string;
  salaryRange?: string;
  location?: string;
  jobType?: string;
}

export interface Achievement {
  id: string;
  achievementName: string;
  achieverName: string;
  description: string;
  department?: string;
  session?: string;
  link?: string;
  achievementPicture?: string;
  achieverCategory?: "student" | "alumni" | "other" | undefined;
}

import { Vector3 } from "three";

export interface FloatingTextProps {
  position: Vector3 | [number, number, number];
  children: React.ReactNode;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  role: string;
  isVerified: boolean;
  firstName: string;
  lastName: string;
  email: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  studentEmail: string;
}

export interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  studentEmail?: string;
}

export interface AuthFormData {
  verifCode: string;
}

export interface AuthFormErrors {
  verifCode?: string;
}

export interface ForgotPasswordCredential {
  email: string;
}

export interface ForgotPasswordFormErrors {
  email?: string;
}

export interface ResetTokenProps {
  params: {
    resetToken: string;
  };
}

export interface ResetPasswordProps {
  resetToken: string;
}

export interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordErrors {
  password?: string;
  confirmPassword?: string;
}

export interface ResetPasswordResponse {
  isLinkValid: boolean;
  userId: string;
}

export interface UserDataResponse {
  firstName: string;
  lastName: string;
  email: string;
}

interface ResumeWorkExperience {
  Company: string;
  Title: string;
  Dates?: string;
  Description: string;
  Location?: string;
}

interface ResumeProject {
  Name: string;
  Dates?: string;
  Description: string;
  Technologies?: string[];
}

interface ResumeEducation {
  University: string;
  Degree: string;
  Dates?: string;
  CGPA?: string;
}

interface Skills {
  Languages: string[];
  Frameworks?: string[];
  Libraries?: string[];
  "Developer Tools"?: string[];
}

export interface ResumeData {
  Name?: string;
  Email?: string;
  Address?: string;
  PhoneNumber?: string;
  Education?: ResumeEducation;
  Certifications?: Certification[];
  "Work Experience"?: ResumeWorkExperience[];
  Projects?: ResumeProject[];
  Skills?: Skills;
}

export interface JobPostingListProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  isStudent: boolean;
  onApply?: (job: Job) => void;
}

export interface JobPostingFormProps {
  initialData?: Job | null;
  onSubmit: ((jobData: Omit<Job, "id">) => void) | ((jobData: Job) => void);
  onCancel: () => void;
  isOpen: boolean;
  isUpdateForm: boolean;
}

export interface NoPlaceholderProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export interface AchievementFilterProps {
  onDepartmentChange: (department: string) => void;
  onSessionChange: (session: string) => void;
  onCategoryChange: (category: "all" | "student" | "alumni" | "other") => void;
}

export interface AchievementFormProps {
  isOpen: boolean;
  initialData?: Achievement | null;
  onSubmit:
    | ((data: Omit<Achievement, "id">) => void)
    | ((data: Achievement) => void);
  onCancel: () => void;
  isUpdateForm: boolean;
}

export interface AchievementListProps {
  achievements: Achievement[];
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: string) => void;
}

export interface ApiJob {
  id: number;
  userId: number;
  jobName: string;
  jobDescription: string;
  salaryRange: string | null;
  location: string | null;
  jobType:
    | "full-time"
    | "part-time"
    | "internship"
    | "fellowship"
    | "contract"
    | null;
}

export interface JobData {
  jobName: string;
  jobDescription: string;
  salaryRange?: string;
  location?: string;
  jobType?: string;
}

export interface AchievementData {
  achievementName: string;
  achieverName: string;
  description: string;
  department?: string;
  session?: string;
  link?: string;
  achievementPicture?: string;
  achieverCategory?: "student" | "alumni" | "other" | undefined;
}

export interface ApiAchievement {
  id: number;
  userId: number;
  achievementName: string;
  achieverName: string;
  achieverCategory: "student" | "alumni" | "other" | null;
  achievementDescription: string;
  session: string | null;
  department: string | null;
  Link: string | null;
  achievementPicture: string | null;
}

export interface AlumniSuggestions {
  name: string;
  title: string;
  about: string;
  image_url: string;
  session: string;
  department: string;
  education: [];
  headline: string;
  status: "alumni" | "student";
}
