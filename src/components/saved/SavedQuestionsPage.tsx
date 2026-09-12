import React, { useState } from "react";
import {
  BookmarkCheck,
  FileText,
  Trash2,
  Volume2,
  ExternalLink,
  Award,
  Calendar,
  Search,
  BookOpen,
  X,
  Sparkles,
} from "lucide-react";
import { QuestionItem } from "../../types";
import { QuestionCard } from "../questions/QuestionCard";
import { speechService } from "../../services/speechService";
import { appStore } from "../../services/store";

interface SavedQuestionsPageProps {
  savedQuestions: QuestionItem[];
  onToggleSave: (questionId: string) => void;
  onNavigateToUpload: () => void;
}

export const SavedQuestionsPage: React.FC<SavedQuestionsPageProps> = ({
  savedQuestions,
  onToggleSave,
  onNavigateToUpload,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestionForModal, setSelectedQuestionForModal] = useState<QuestionItem | null>(null);

  // Group questions by source file / subject
  const filtered = savedQuestions.filter(
    (q) =>
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedByFile: { [key: string]: QuestionItem[] } = {};
  filtered.forEach((q) => {
    const key = q.subject || "General Engineering";
    if (!groupedByFile[key]) {
      groupedByFile[key] = [];
    }
    groupedByFile[key].push(q);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookmarkCheck className="h-6 w-6 text-amber-500" />
            Saved Questions ({savedQuestions.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Questions saved for quick semester exam revision, grouped by subject and file.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved questions..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {savedQuestions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4">
            <BookmarkCheck className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No saved questions yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            When reviewing questions from uploaded question papers, click "Save Question" to bookmark high priority topics here.
          </p>
          <button
            onClick={onNavigateToUpload}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <span>Explore Uploaded Questions</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByFile).map(([groupName, questions]) => (
            <div
              key={groupName}
              className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs"
            >
              {/* Group Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{groupName}</h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {questions.length} {questions.length === 1 ? "question" : "questions"} saved
                    </span>
                  </div>
                </div>
              </div>

              {/* Question list inside group */}
              <div className="space-y-3">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 sm:p-4 transition-all hover:border-blue-200 hover:bg-blue-50/20"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-amber-500 font-bold">★</span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {q.questionText}
                        </h4>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                          <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                            <Award className="h-3 w-3" />
                            {q.marks} Marks
                          </span>
                          {q.importance === "HIGH" && (
                            <span className="font-semibold text-amber-600">⭐ High Priority</span>
                          )}
                          {q.savedDate && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <Calendar className="h-3 w-3" /> Saved {q.savedDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons: Open, Listen, Remove */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => setSelectedQuestionForModal(q)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-blue-400 hover:text-blue-600 transition-colors"
                        title="Open full answer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Open</span>
                      </button>

                      <button
                        onClick={() => {
                          speechService.speak(
                            `Question: ${q.questionText}. Answer: ${q.answerEnglish}`,
                            "en"
                          );
                        }}
                        className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                        title="Listen answer"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Listen</span>
                      </button>

                      <button
                        onClick={() => onToggleSave(q.id)}
                        className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing complete question & mark-based answer */}
      {selectedQuestionForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Full Question Review
              </span>
              <button
                onClick={() => setSelectedQuestionForModal(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <QuestionCard
                question={selectedQuestionForModal}
                onToggleSave={(id) => {
                  onToggleSave(id);
                  setSelectedQuestionForModal((prev) =>
                    prev ? { ...prev, isSaved: !prev.isSaved } : null
                  );
                }}
                onToggleComplete={(id) => {
                  appStore.toggleQuestionCompleted(id);
                  setSelectedQuestionForModal((prev) =>
                    prev ? { ...prev, isCompleted: !prev.isCompleted } : null
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
