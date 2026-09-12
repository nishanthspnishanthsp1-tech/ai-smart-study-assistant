export type UserRole = "student" | "admin" | "super_admin";
export type UserStatus = "active" | "blocked";
export type LanguageCode = "en" | "ta" | "hi";

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
  questionNumber?: string | number;
  section?: string;
  questionText: string;
  marks: number;
  subject: string;
  importance: "HIGH" | "MEDIUM" | "LOW";
  importanceReason: string;
  intent?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  keywords?: string[];
  expectedStructure?: string[];
  answerEnglish: string;
  answerTamil: string;
  answerHindi?: string;
  quickRevision: string[];
  answersByMarks?: Record<number, { en?: string; ta?: string; hi?: string }>;
  isSaved?: boolean;
  savedDate?: string;
  isCompleted?: boolean;
  duplicateWarning?: boolean;
  isRepeated?: boolean;
  repeatedType?: "exact" | "similar" | "concept";
  repeatedReason?: string;
  frequencyCount?: number;
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
  repeatedCount?: number;
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
  marks?: number;
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

export interface SubjectiveEvaluationResult {
  score: number;
  maxMarks: number;
  percentage: number;
  feedback: string;
  modelAnswer: string;
  keyPointsCovered: string[];
  areasToImprove: string[];
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
  type: "upload" | "complete" | "test" | "save" | "revision";
}

export interface DashboardStats {
  filesUploaded: number;
  questionsGenerated: number;
  questionsCompleted: number;
  importantQuestions: number;
  repeatedQuestions: number;
  savedAnswers: number;
  testsTaken: number;
  averageScore: number;
  bestScore: number;
  revisionProgress: number;
}

