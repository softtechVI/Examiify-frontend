/**
 * Common TypeScript interfaces and types for the Examiify platform
 */

import { LucideIcon } from "lucide-react";

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

// Feature Types
export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

// Benefit Types
export interface Benefit {
  id: string;
  text: string;
}

// Stats Types
export interface Stat {
  number: string;
  label: string;
}

// Value Types
export interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Milestone Types
export interface Milestone {
  year: string;
  title: string;
  description: string;
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

// Form Field Types
export interface FormField {
  id: keyof ContactFormData;
  label: string;
  type: 'text' | 'email' | 'textarea';
  placeholder: string;
  required: boolean;
}

// Button Variant Types
export type ButtonVariant = 
  | "default" 
  | "destructive" 
  | "outline" 
  | "secondary" 
  | "ghost" 
  | "link";

// Component Props Types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Animation Delay Props
export interface AnimationProps {
  delay?: number;
  duration?: number;
}

// Social Link Types
export interface SocialLink {
  name: string;
  href: string;
  icon: LucideIcon;
}

// Footer Section Types
export interface FooterSection {
  title: string;
  links: Array<{
    name: string;
    href: string;
  }>;
}

// API Response Types (for future backend integration)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User Types (for future authentication)
// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'admin' | 'teacher' | 'student';
//   avatar?: string;
// }

export interface User {
  id: string;
  name: string;
  email: string;
  institutionType?: string;
  role: string | number;
  status: number;
  phoneNumber?: string;
  aiStatus?: boolean;
  avatar?: string;
  institute?: string;
  address?: string;
  state?: string;
  city?: string;
  validStart?: string;
  validUpto?: string;
}
// Exam Types (for future exam management)
export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
}

export interface RoomPayload {
  roomNumber: string;
  name: string;
  capacity: number;
  type: string;
  facilities: string[];
  status: string;
  location: string;
}

export interface Room extends RoomPayload {
  _id: string;
}


// types.ts
export interface ExamData {
  _id?: string;
  examName: string;
  examDate: string;
  examTime: string;
  duration: number;
  shifts: string;
  semesterAndClass: string;
  studentCount: number;
  notes?: string;
  status?: string;
}
