// src/types.ts

export interface TeamMember {
  name: string;
  position: string;
  img: string;
}

export interface Icon {
  iconPath: string;
  color: string;
}

export interface Metric {
  number: string;
  label: string;
}
interface Skill {
  name: string;
  rating: number;
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  address: string;
  aboutMe: string;
  linkedin: string;
  bio: string;
  gender: string;
  primaryEmail: string;
  secondaryEmail: string;
  education: Education[];
  workExperience: string[];
  skills: Skill[];
  resume: string;
}
export interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
}
export interface WorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}
