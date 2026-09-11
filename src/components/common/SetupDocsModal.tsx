import React, { useState } from "react";
import {
  X,
  FileText,
  Shield,
  Key,
  Database,
  Terminal,
  Server,
  Layers,
  CheckCircle2,
  Copy,
} from "lucide-react";

interface SetupDocsModalProps {
  onClose: () => void;
}

export const SetupDocsModal: React.FC<SetupDocsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "firestore" | "rules" | "gemini" | "superadmin"
  >("overview");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const firestoreRulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    function isStudent() {
      return isAuthenticated() && getUserData().role == 'student' && getUserData().status == 'active';
    }
    
    function isAdmin() {
      return isAuthenticated() && (getUserData().role == 'admin' || getUserData().role == 'super_admin');
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && getUserData().role == 'super_admin';
    }

    // Users Collection
    match /users/{userId} {
      // Students can read/write their own profile; Admins can read all and update status
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if (isAuthenticated() && request.auth.uid == userId) || isAdmin();
      allow delete: if isSuperAdmin();
    }

    // Uploaded Files
    match /uploaded_files/{fileId} {
      allow read: if isAuthenticated();
      allow create: if isStudent();
      allow update, delete: if isStudent() && resource.data.studentId == request.auth.uid || isAdmin();
    }

    // Questions Collection
    match /questions/{questionId} {
      allow read: if isAuthenticated();
      allow write: if isStudent() || isAdmin();
    }

    // Saved Questions Collection
    match /saved_questions/{saveId} {
      allow read, write: if isStudent() && resource.data.studentId == request.auth.uid;
    }

    // Practice Tests & Analytics
    match /practice_tests/{testId} {
      allow read: if isAuthenticated();
      allow create: if isStudent();
      allow delete: if isAdmin();
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[85vh] rounded-3xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                System Architecture & Deployment Guide
              </h3>
              <p className="text-[11px] text-slate-500">
                AI Smart Study Assistant • Rathinam Technical Campus (2nd Year AI&DS)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white overflow-x-auto text-xs font-semibold">
          {[
            { id: "overview", label: "Overview" },
            { id: "firestore", label: "Firestore Schema" },
            { id: "rules", label: "Security Rules" },
            { id: "gemini", label: "Gemini AI Endpoints" },
            { id: "superadmin", label: "Super Admin Setup" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-700 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-700 leading-relaxed space-y-4">
          {activeTab === "overview" && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Project Architectural Summary</h4>
              <p>
                <strong>AI SMART STUDY ASSISTANT</strong> is a full-stack semester exam preparation platform developed for the Department of Artificial Intelligence and Data Science at Rathinam Technical Campus.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="rounded-2xl border border-slate-200 p-3 bg-slate-50">
                  <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Server className="h-4 w-4 text-blue-600" /> Full-Stack Express Server
                  </h5>
                  <p className="text-[11px] text-slate-600">
                    Runs at <code>/server.ts</code> with port 3000 binding, hosting server-side Google GenAI API calls to safeguard API keys from browser DevTools.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-3 bg-slate-50">
                  <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Database className="h-4 w-4 text-emerald-600" /> State Engine & Storage
                  </h5>
                  <p className="text-[11px] text-slate-600">
                    Engineered with <code>AppStore</code> reactive layer and LocalStorage persistence. Ready for instant sync with Firebase Firestore and Authentication.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "firestore" && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Firestore Database Collections</h4>
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 font-mono text-[11px]">
                  <strong className="text-blue-700 block mb-1">Collection: users</strong>
                  uid, name, phone, college, department, year, email, purpose, role ('student' | 'admin' | 'super_admin'), status ('active' | 'blocked'), createdAt
                </div>
                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 font-mono text-[11px]">
                  <strong className="text-blue-700 block mb-1">Collection: uploaded_files</strong>
                  fileId, studentId, fileName, fileType, fileSize, uploadDate, subject, questionCount, questionsAnswered, importantCount, testStatus
                </div>
                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 font-mono text-[11px]">
                  <strong className="text-blue-700 block mb-1">Collection: questions</strong>
                  id, fileId, studentId, questionText, marks, subject, importance ('HIGH' | 'MEDIUM' | 'LOW'), answerEnglish, answerTamil, quickRevision, isSaved
                </div>
                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 font-mono text-[11px]">
                  <strong className="text-blue-700 block mb-1">Collection: practice_tests</strong>
                  id, testId, studentId, fileId, score, total, percentage, date, subject
                </div>
              </div>
            </div>
          )}

          {activeTab === "rules" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Recommended firestore.rules</h4>
                <button
                  onClick={() => copyToClipboard(firestoreRulesCode)}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copied ? "Copied!" : "Copy Rules"}</span>
                </button>
              </div>
              <pre className="rounded-xl bg-slate-900 text-slate-200 p-4 font-mono text-[10px] overflow-x-auto">
                {firestoreRulesCode}
              </pre>
            </div>
          )}

          {activeTab === "gemini" && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Server-side Gemini AI Endpoints</h4>
              <p>
                All AI calls are routed through Express endpoints inside <code>/server.ts</code> using <code>@google/genai</code> SDK:
              </p>
              <ul className="space-y-2 list-disc pl-4">
                <li>
                  <code>POST /api/ai/analyze-material</code>: Analyzes question paper text, extracts questions sequentially, structures mark-based answers (2, 5, 10, 16 marks), generates Tamil translations and quick revision summaries.
                </li>
                <li>
                  <code>POST /api/ai/predict-syllabus</code>: Evaluates Anna University / Rathinam syllabus modules and predicts high-probability exam questions with rationale.
                </li>
                <li>
                  <code>POST /api/ai/generate-test</code>: Generates 1-mark objective questions with verified explanations for practice tests.
                </li>
              </ul>
            </div>
          )}

          {activeTab === "superadmin" && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Super Admin Provisioning Guide</h4>
              <p>
                To create or assign the first Super Admin (Department Head / HOD):
              </p>
              <ol className="space-y-2 list-decimal pl-4">
                <li>
                  Register the faculty account or create user document in <code>users</code> collection.
                </li>
                <li>
                  Set the field <code>role: "super_admin"</code>.
                </li>
                <li>
                  Pre-configured Super Admin in demo: <strong>Dr. S. Ramesh</strong> (<code>hod.aids@rathinam.in</code>).
                </li>
                <li>
                  Super Admin has exclusive permissions to provision new faculty proctors and administrators via the <strong>Add Admin</strong> menu.
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
