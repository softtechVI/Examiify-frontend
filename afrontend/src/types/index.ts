
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
