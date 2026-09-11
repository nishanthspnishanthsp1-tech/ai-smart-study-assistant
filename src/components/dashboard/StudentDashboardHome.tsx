import React from "react";
import {
  FileText,
  HelpCircle,
  CheckCircle,
  Star,
  CheckSquare,
  TrendingUp,
  ArrowUpRight,
  UploadCloud,
  Sparkles,
  BookOpen,
  Calendar,
  Activity,
  Award,
} from "lucide-react";
import { StudentProfile, DashboardStats, ActivityLog } from "../../types";

interface StudentDashboardHomeProps {
  student: StudentProfile;
  stats: DashboardStats;
  activities: ActivityLog[];
  onNavigate: (tab: string) => void;
}

export const StudentDashboardHome: React.FC<StudentDashboardHomeProps> = ({
  student,
  stats,
  activities,
  onNavigate,
}) => {
  // Demo subject progress data
  const subjectProgress = [
    { subject: "Operating Systems", percent: 85, color: "bg-blue-600", count: "15 Qs" },
    { subject: "DBMS", percent: 72, color: "bg-indigo-600", count: "12 Qs" },
    { subject: "Artificial Intelligence", percent: 90, color: "bg-emerald-600", count: "18 Qs" },
    { subject: "Computer Networks", percent: 65, color: "bg-amber-600", count: "10 Qs" },
    { subject: "Machine Learning", percent: 78, color: "bg-purple-600", count: "14 Qs" },
    { subject: "Data Structures", percent: 95, color: "bg-cyan-600", count: "20 Qs" },
  ];

  // Test performance points for timeline graph
  const testTrend = [
    { date: "Aug 20", score: 65 },
    { date: "Aug 25", score: 72 },
    { date: "Sep 01", score: 78 },
    { date: "Sep 05", score: 85 },
    { date: "Sep 09", score: 90 },
  ];

  // File upload dates
  const uploadActivity = [
    { day: "Mon", count: 2 },
    { day: "Tue", count: 4 },
    { day: "Wed", count: 1 },
    { day: "Thu", count: 3 },
    { day: "Fri", count: 5 },
    { day: "Sat", count: 2 },
    { day: "Sun", count: 1 },
  ];

  const maxUpload = Math.max(...uploadActivity.map((u) => u.count), 1);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Welcome Banner (AlgoTutor inspired) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-lg shadow-blue-500/15">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3 border border-white/20">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>AI-Powered Semester Exam Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome Back, {student.name} 👋
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-blue-100 font-medium">
            "Prepare smarter. Learn easier. Score better."
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("upload")}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-sm transition-transform hover:scale-105 active:scale-95"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload Question Paper</span>
            </button>
            <button
              onClick={() => onNavigate("test")}
              className="flex items-center gap-2 rounded-xl bg-blue-800/80 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:bg-blue-800 border border-white/20"
            >
              <CheckSquare className="h-4 w-4" />
              <span>Take Practice Test</span>
            </button>
            <button
              onClick={() => onNavigate("prediction")}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 border border-white/20"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Predict Syllabus Questions</span>
            </button>
          </div>
        </div>

        {/* Decorative background visual */}
        <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 h-32 w-32 rounded-full bg-blue-400/20 blur-xl pointer-events-none" />
      </div>

      {/* 2. Dashboard Statistic Cards (6 requested cards) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
        {/* Card 1: Files Uploaded */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Files Uploaded</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{stats.filesUploaded}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Question papers & docs</p>
          </div>
        </div>

        {/* Card 2: Questions Generated */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Total Questions</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <HelpCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{stats.questionsGenerated}</span>
            <p className="text-[10px] text-indigo-600 mt-0.5 font-medium">Mark-based answers</p>
          </div>
        </div>

        {/* Card 3: Questions Completed */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Completed</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{stats.questionsCompleted}</span>
            <p className="text-[10px] text-emerald-600 mt-0.5 font-medium">Revision finished</p>
          </div>
        </div>

        {/* Card 4: Important Questions */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Important Qs</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Star className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-amber-600">{stats.importantQuestions}</span>
            <p className="text-[10px] text-amber-700 mt-0.5 font-medium">High priority</p>
          </div>
        </div>

        {/* Card 5: Tests Taken */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Tests Taken</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{stats.testsTaken}</span>
            <p className="text-[10px] text-purple-600 mt-0.5 font-medium">Practice quizzes</p>
          </div>
        </div>

        {/* Card 6: Average Test Score */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Average Score</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black text-blue-600">{stats.averageScore}%</span>
            <span className="text-[10px] font-bold text-emerald-600">Best {stats.bestScore}%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Overall accuracy</p>
        </div>
      </div>

      {/* 3. Analytics Graphs Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Graph 1: Study Progress Breakdown */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Graph 1: Study Progress</h3>
              <p className="text-[11px] text-slate-500">Completion ratio & high-priority study</p>
            </div>
            <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              Semester IV
            </span>
          </div>

          <div className="space-y-4">
            {/* Progress Bar 1: Completed */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  Questions Completed
                </span>
                <span className="font-bold">{stats.questionsCompleted} / {stats.questionsGenerated}</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      Math.round((stats.questionsCompleted / Math.max(stats.questionsGenerated, 1)) * 100),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Progress Bar 2: Remaining */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                  Questions Remaining
                </span>
                <span className="font-bold">
                  {Math.max(stats.questionsGenerated - stats.questionsCompleted, 0)} Qs
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-slate-400 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      Math.round(
                        (Math.max(stats.questionsGenerated - stats.questionsCompleted, 0) /
                          Math.max(stats.questionsGenerated, 1)) *
                          100
                      ),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Progress Bar 3: Important Questions Studied */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  Important Questions Studied (High Priority)
                </span>
                <span className="font-bold">{stats.importantQuestions} questions</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{ width: "82%" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Studied</span>
              <p className="text-base font-bold text-slate-800">
                {Math.round((stats.questionsCompleted / Math.max(stats.questionsGenerated, 1)) * 100)}%
              </p>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Priority</span>
              <p className="text-base font-bold text-amber-600">{stats.importantQuestions}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Efficiency</span>
              <p className="text-base font-bold text-emerald-600">+18%</p>
            </div>
          </div>
        </div>

        {/* Graph 2: Test Performance Over Time */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Graph 2: Test Performance</h3>
              <p className="text-[11px] text-slate-500">Test score percentage trend over time</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <ArrowUpRight className="h-3.5 w-3.5" /> +25% Growth
            </span>
          </div>

          {/* SVG Score Line Chart */}
          <div className="h-44 w-full pt-2">
            <div className="relative h-32 w-full flex items-end justify-between px-4 pb-2 border-b border-slate-100">
              {testTrend.map((t, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 z-10">
                  <span className="rounded-md bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    {t.score}%
                  </span>
                  <div
                    className="w-8 sm:w-10 rounded-t-xl bg-gradient-to-t from-blue-600 to-indigo-500 transition-all duration-300 hover:brightness-110"
                    style={{ height: `${(t.score / 100) * 88}px` }}
                  />
                  <span className="text-[10px] font-medium text-slate-500 mt-1">{t.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Baseline: 60%</span>
            <span className="font-semibold text-blue-700">Target Score: 95%+</span>
          </div>
        </div>

        {/* Graph 3: File Upload Activity */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Graph 3: File Upload Activity</h3>
              <p className="text-[11px] text-slate-500">Number of files uploaded by day</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>This Week</span>
            </div>
          </div>

          <div className="flex h-36 items-end justify-between gap-2 px-2 pb-2">
            {uploadActivity.map((item, idx) => (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-600">{item.count}</span>
                <div
                  className="w-full rounded-t-lg bg-blue-100 hover:bg-blue-600 transition-colors"
                  style={{ height: `${(item.count / maxUpload) * 90}px` }}
                />
                <span className="text-[10px] font-medium text-slate-500">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 flex items-center justify-between">
            <span>Total uploaded this week: <strong className="text-slate-900">18 study files</strong></span>
            <button
              onClick={() => onNavigate("upload")}
              className="text-blue-600 font-bold hover:underline"
            >
              Upload More →
            </button>
          </div>
        </div>

        {/* Graph 4: Subject-wise Progress */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Graph 4: Subject-wise Progress</h3>
              <p className="text-[11px] text-slate-500">Preparation status across college curriculum</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">6 Subjects</span>
          </div>

          <div className="space-y-3">
            {subjectProgress.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">{item.count}</span>
                    <span className="font-bold text-slate-900">{item.percent}%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-300`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Recent Activity Feed */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
              <p className="text-[11px] text-slate-500">Latest actions and milestone events</p>
            </div>
          </div>
          <span className="text-xs text-slate-400">Auto-synced</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {activities.slice(0, 4).map((act) => (
            <div
              key={act.id}
              className="group rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all hover:border-blue-200 hover:bg-blue-50/30"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="font-medium text-[10px] text-blue-600 bg-blue-100/70 px-1.5 py-0.5 rounded">
                  {act.type.toUpperCase()}
                </span>
                <span className="text-[10px]">{act.timestamp.split(" ")[0]}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {act.title}
              </h4>
              <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {act.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
