import React, { useState } from "react";
import {
  History,
  FileText,
  Calendar,
  Award,
  Star,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  Search,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { UploadedFile } from "../../types";
import { QuestionCard } from "../questions/QuestionCard";

interface HistoryPageProps {
  files: UploadedFile[];
  onToggleSave: (questionId: string) => void;
  onStartTestForFile: (file: UploadedFile) => void;
  onNavigateToUpload: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  files,
  onToggleSave,
  onStartTestForFile,
  onNavigateToUpload,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFileDetails, setActiveFileDetails] = useState<UploadedFile | null>(null);

  const filteredFiles = files.filter(
    (f) =>
      f.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If viewing questions of a specific file
  if (activeFileDetails) {
    return (
      <div className="space-y-6 pb-12">
        {/* Back Button & File Metadata Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveFileDetails(null)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Upload History</span>
          </button>

          <button
            onClick={() => onStartTestForFile(activeFileDetails)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors w-fit"
          >
            <CheckSquare className="h-4 w-4" />
            <span>Take Practice Test on This File</span>
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {activeFileDetails.fileName}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="font-semibold text-blue-700">{activeFileDetails.subject}</span>
                  <span>•</span>
                  <span>Uploaded {activeFileDetails.uploadDate}</span>
                  <span>•</span>
                  <span>{activeFileDetails.fileSize}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-50 px-3 py-1.5 text-center border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Questions</span>
                <p className="text-sm font-bold text-slate-900">{activeFileDetails.questionCount}</p>
              </div>
              <div className="rounded-xl bg-amber-50 px-3 py-1.5 text-center border border-amber-100">
                <span className="text-[10px] text-amber-700 font-semibold uppercase">Important</span>
                <p className="text-sm font-bold text-amber-800">{activeFileDetails.importantCount}</p>
              </div>
              <div className="rounded-xl bg-blue-50 px-3 py-1.5 text-center border border-blue-100">
                <span className="text-[10px] text-blue-700 font-semibold uppercase">Test</span>
                <p className="text-sm font-bold text-blue-800">{activeFileDetails.testStatus}</p>
              </div>
            </div>
          </div>
        </div>

        {/* List of questions */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Extracted Questions & Full Answers ({activeFileDetails.questions?.length || 0})
          </h3>

          {activeFileDetails.questions && activeFileDetails.questions.length > 0 ? (
            activeFileDetails.questions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                onToggleSave={onToggleSave}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
              No questions found for this document. Try re-uploading or analyzing again.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History className="h-6 w-6 text-blue-600" />
            Upload History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your previously analyzed question papers, syllabus files, and model papers.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search uploaded files..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <FileText className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No study material found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Upload question papers or question banks to begin preparing for your semester exams.
          </p>
          <button
            onClick={onNavigateToUpload}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <span>Upload Question Paper</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredFiles.map((file) => (
            <div
              key={file.fileId}
              className="group rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all hover:border-blue-300 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {file.fileName}
                      </h3>
                      <span className="text-xs font-semibold text-blue-700">{file.subject}</span>
                    </div>
                  </div>

                  {/* Test Status Badge */}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      file.testStatus === "Completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : file.testStatus === "Attempted"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {file.testStatus}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50/70 p-3 text-center border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Questions</span>
                    <p className="text-sm font-bold text-slate-900">{file.questionCount}</p>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Answered</span>
                    <p className="text-sm font-bold text-emerald-600">{file.questionsAnswered}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Important</span>
                    <p className="text-sm font-bold text-amber-600">⭐ {file.importantCount}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Uploaded {file.uploadDate}
                  </span>
                  <span>{file.fileSize}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onStartTestForFile(file)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  <span>Practice Test</span>
                </button>

                <button
                  onClick={() => setActiveFileDetails(file)}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-600 transition-colors"
                >
                  <span>View Questions</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
