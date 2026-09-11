export type UserRole = "student" | "admin" | "super_admin";
export type UserStatus = "active" | "blocked";

export interface StudentProfile {
  uid: string;
  name: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  email: string;
  purpose: "Student" | "Staff" | "Education / Learning";
  role: "student";
  status: UserStatus;
  createdAt: string;
  avatarUrl?: string;
}

export interface AdminProfile {
  uid: string;
  name: string;
  phone: string;
  email: string;
  department: string;
  role: "admin" | "super_admin";
  createdAt: string;
}

export interface QuestionItem {
  id: string;
  fileId: string;
  studentId: string;
  questionText: string;
  marks: number;
  subject: string;
  importance: "HIGH" | "MEDIUM" | "LOW";
  importanceReason: string;
  answerEnglish: string;
  answerTamil: string;
  quickRevision: string[];
  isSaved?: boolean;
  savedDate?: string;
  isCompleted?: boolean;
  duplicateWarning?: boolean;
}

export interface UploadedFile {
  fileId: string;
  studentId: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  subject: string;
  questionCount: number;
  questionsAnswered: number;
  importantCount: number;
  testStatus: "Not Taken" | "Attempted" | "Completed";
  processingStatus: "uploading" | "analyzing" | "completed" | "error";
  questions: QuestionItem[];
}

export interface TestOption {
  key: "A" | "B" | "C" | "D";
  text: string;
}

export interface TestQuestion {
  id: string;
  fileId: string;
  questionText: string;
  options: TestOption[];
  correctOption: "A" | "B" | "C" | "D";
  explanation: string;
  selectedOption?: "A" | "B" | "C" | "D";
}

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  fileId: string;
  fileName: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
  subject: string;
  details: {
    questionText: string;
    selected: string;
    correct: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface PredictedQuestion {
  id: string;
  questionText: string;
  unit: string;
  topic: string;
  expectedMarks: number;
  importance: "HIGH" | "MEDIUM" | "LOW";
  reason: string;
}

export interface ActivityLog {
  id: string;
  studentId: string;
  title: string;
  description: string;
  timestamp: string;
  type: "upload" | "complete" | "test" | "save";
}

export interface DashboardStats {
  filesUploaded: number;
  questionsGenerated: number;
  questionsCompleted: number;
  importantQuestions: number;
  testsTaken: number;
  averageScore: number;
  bestScore: number;
}
