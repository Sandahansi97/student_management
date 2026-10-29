// TypeScript interfaces describe the shape of data exchanged with the backend.
export interface Student {
  studentId: number;
  studentName: string;
  homeTown: string;
  createdOn: string;
  isActive: boolean;
}

export interface Marks {
  studentId: number;
  mathsScore: number;
  englishScore: number;
  scienceScore: number;
  total?: number;
  average?: number;
}

export type SubjectName = 'maths' | 'english' | 'science';

// Every backend response has this wrapper.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SubjectScore {
  studentId: number;
  subjectName: SubjectName;
  score: number;
}
