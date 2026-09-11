import React, { useState } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  Building,
  GraduationCap,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
} from "lucide-react";
import { StudentProfile } from "../../types";
import { appStore } from "../../services/store";

interface ManageStudentsModalProps {
  student: StudentProfile | null;
  onClose: () => void;
  onStatusChanged: () => void;
}

export const ManageStudentsModal: React.FC<ManageStudentsModalProps> = ({
  student,
  onClose,
  onStatusChanged,
}) => {
  const [confirmDialog, setConfirmDialog] = useState<"block" | "unblock" | null>(null);

  if (!student) return null;

  const isBlocked = student.status === "blocked";
  const files = appStore.getFiles().filter((f) => f.studentId === student.uid || student.uid === "student_nishanth_01");
  const testResults = appStore.getTestResults().filter((t) => t.studentId === student.uid || student.uid === "student_nishanth_01");

  const totalQuestionsAnswered = files.reduce((acc, f) => acc + f.questionsAnswered, 0);

  const handleExecuteStatusChange = () => {
    if (isBlocked) {
      appStore.updateStudentStatus(student.uid, "active");
    } else {
      appStore.updateStudentStatus(student.uid, "blocked");
    }
    setConfirmDialog(null);
    onStatusChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Student Account Inspection</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Student Profile Card */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-lg">
              {student.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-slate-900">{student.name}</h4>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    isBlocked ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {student.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {student.department} • {student.year}
              </p>
              <p className="text-[11px] text-slate-400">{student.college}</p>
            </div>
          </div>

          {/* Block/Unblock toggle button */}
          <div>
            {isBlocked ? (
              <button
                onClick={() => setConfirmDialog("unblock")}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Unblock Student</span>
              </button>
            ) : (
              <button
                onClick={() => setConfirmDialog("block")}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition-colors"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Block Student</span>
              </button>
            )}
          </div>
        </div>

        {/* Contact & Registration Metadata */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-slate-100 p-3 bg-white">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Email</span>
            <span className="font-semibold text-slate-800">{student.email}</span>
          </div>
          <div className="rounded-xl border border-slate-100 p-3 bg-white">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Phone</span>
            <span className="font-semibold text-slate-800">{student.phone}</span>
          </div>
          <div className="rounded-xl border border-slate-100 p-3 bg-white">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Purpose</span>
            <span className="font-semibold text-slate-800">{student.purpose}</span>
          </div>
          <div className="rounded-xl border border-slate-100 p-3 bg-white">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Enrolled Date</span>
            <span className="font-semibold text-slate-800">{student.createdAt}</span>
          </div>
        </div>

        {/* Study Analytics for this student */}
        <div className="mt-5">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Academic Performance & Study Activity
          </h5>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Files Uploaded</span>
              <p className="text-lg font-black text-slate-900">{files.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Questions Answered</span>
              <p className="text-lg font-black text-indigo-600">{totalQuestionsAnswered}</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Tests Completed</span>
              <p className="text-lg font-black text-emerald-600">{testResults.length}</p>
            </div>
          </div>
        </div>

        {/* Test Score Records */}
        <div className="mt-5">
          <h5 className="text-xs font-bold text-slate-700 mb-2">Practice Test History</h5>
          <div className="space-y-2 max-h-36 overflow-y-auto">
            {testResults.length > 0 ? (
              testResults.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{t.subject}</span>
                    <span className="text-[10px] text-slate-400 block">{t.fileName}</span>
                  </div>
                  <div className="text-right">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                      {t.percentage}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">{t.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No tests attempted yet.</p>
            )}
          </div>
        </div>

        {/* Confirmation Alert Dialog */}
        {confirmDialog && (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-sm">
                  {confirmDialog === "block"
                    ? "Are you sure you want to block this student?"
                    : "Are you sure you want to unblock this student?"}
                </p>
                <p className="mt-1 text-rose-800 leading-relaxed">
                  {confirmDialog === "block"
                    ? "Blocked students cannot log in or access the AI Smart Study Assistant until an administrator restores their privileges."
                    : "This will immediately restore full portal access and study materials for this student."}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleExecuteStatusChange}
                    className={`rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs ${
                      confirmDialog === "block" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    Confirm {confirmDialog === "block" ? "Block" : "Unblock"}
                  </button>
                  <button
                    onClick={() => setConfirmDialog(null)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
