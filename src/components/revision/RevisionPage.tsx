import React, { useState } from "react";
import {
  Repeat,
  CheckCircle2,
  BookmarkCheck,
  Award,
  Search,
  Sparkles,
  Filter,
  CheckSquare,
  BookOpen,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  ExternalLink,
  Volume2,
  X,
  FileText,
} from "lucide-react";
import { QuestionItem } from "../../types";
import { appStore } from "../../services/store";
import { QuestionCard } from "../questions/QuestionCard";
import { speechService } from "../../services/speechService";

interface RevisionPageProps {
  onToggleSave: (questionId: string) => void;
  onNavigateToTest: () => void;
}

export const RevisionPage: React.FC<RevisionPageProps> = ({
  onToggleSave,
  onNavigateToTest,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"repeated" | "saved" | "all">("repeated");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [selectedQuestionModal, setSelectedQuestionModal] = useState<QuestionItem | null>(null);

  const repeatedQuestions = appStore.getRepeatedQuestions();
  const savedQuestions = appStore.getSavedQuestions();
  const allQuestions = appStore.getAllQuestions();
  const dashboardStats = appStore.getDashboardStats();

  const subjects = Array.from(new Set(allQuestions.map((q) => q.subject || "General")));

  // Filter based on active sub tab, subject, and search term
  const getSourceList = () => {
    if (activeSubTab === "repeated") return repeatedQuestions;
    if (activeSubTab === "saved") return savedQuestions;
    return allQuestions;
  };

  const currentList = getSourceList().filter((q) => {
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.topic && q.topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === "ALL" || q.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const completedCount = allQuestions.filter((q) => q.isCompleted).length;
  const preparednessPercent =
    allQuestions.length > 0 ? Math.round((completedCount / allQuestions.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner with Revision Progress */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-2.5 border border-blue-100">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Exam Revision & Question Patterns</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Syllabus Revision & Repeated Questions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Track your exam preparedness, detect recurring question patterns across university semester papers, and review high-weightage topics.
            </p>
          </div>

          {/* Preparedness Widget */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[240px]">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-lg shadow-md shadow-blue-500/20">
              {preparednessPercent}%
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Preparedness
              </span>
              <p className="text-sm font-bold text-slate-800">
                {completedCount} / {allQuestions.length} Questions
              </p>
              <button
                onClick={onNavigateToTest}
                className="mt-1 flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
              >
                <span>Take Practice Test</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer / Academic Integrity Note */}
        <div className="mt-4 rounded-2xl bg-amber-50/70 p-3 text-xs text-amber-900 border border-amber-200/70 flex items-start gap-2.5">
          <Clock className="h-4 w-4 mt-0.5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold text-amber-950">
              Academic Similarity Detection Notice:{" "}
            </span>
            <span>
              Repeated questions and frequency counts are computed from similarity analysis across your uploaded question papers and syllabus banks. They serve as study guides and do not guarantee actual exam questions.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1 border border-slate-200/80 w-fit">
          <button
            onClick={() => setActiveSubTab("repeated")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "repeated"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Repeat className="h-4 w-4 text-purple-600" />
            <span>Repeated Questions ({repeatedQuestions.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("saved")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "saved"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookmarkCheck className="h-4 w-4 text-amber-600" />
            <span>Saved Bookmarks ({savedQuestions.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("all")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "all"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="h-4 w-4 text-blue-600" />
            <span>All Extracted ({allQuestions.length})</span>
          </button>
        </div>

        {/* Search & Subject Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Subjects ({subjects.length})</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Search Bar */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topic or question..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Questions List */}
      {currentList.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No questions found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {activeSubTab === "repeated"
              ? "Upload multiple question papers to detect repeated questions and recurring problem statements."
              : activeSubTab === "saved"
              ? "Click 'Save' on any question card to bookmark it for your revision list."
              : "No questions match your current search filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map((question, idx) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={idx}
              onToggleSave={onToggleSave}
              onToggleComplete={(id) => appStore.toggleQuestionCompleted(id)}
            />
          ))}
        </div>
      )}

      {/* Modal for full review if invoked */}
      {selectedQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Full Question Revision
              </span>
              <button
                onClick={() => setSelectedQuestionModal(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <QuestionCard
                question={selectedQuestionModal}
                onToggleSave={(id) => {
                  onToggleSave(id);
                  setSelectedQuestionModal((prev) =>
                    prev ? { ...prev, isSaved: !prev.isSaved } : null
                  );
                }}
                onToggleComplete={(id) => appStore.toggleQuestionCompleted(id)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
