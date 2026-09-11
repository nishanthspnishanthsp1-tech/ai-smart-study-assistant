import React from "react";
import {
  Users,
  UserCheck,
  UserX,
  FileText,
  HelpCircle,
  CheckSquare,
  Shield,
  ArrowUpRight,
  UserPlus,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import { AdminProfile } from "../../types";
import { appStore } from "../../services/store";

interface AdminDashboardHomeProps {
  admin: AdminProfile;
  onNavigate: (tab: string) => void;
}

export const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({
  admin,
  onNavigate,
}) => {
  const adminStats = appStore.getAdminStats();
  const students = appStore.getStudents();
  const recentStudents = students.slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-2 border border-white/15">
              <Shield className="h-3.5 w-3.5 text-indigo-400" />
              <span className="capitalize">{admin.role.replace("_", " ")} Management Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome, {admin.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Department of Artificial Intelligence & Data Science • Rathinam Technical Campus
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate("admin_students")}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-sm hover:bg-slate-100 transition-colors"
            >
              <Users className="h-4 w-4 text-indigo-600" />
              <span>Manage Students</span>
            </button>
            {admin.role === "super_admin" && (
              <button
                onClick={() => onNavigate("admin_add")}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Statistics (6 requested cards) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
        {/* Card 1: Total Students */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Total Students</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{adminStats.totalStudents}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Enrolled 2nd Year AI&DS</p>
          </div>
        </div>

        {/* Card 2: Active Students */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Active Students</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-600">{adminStats.activeNow}</span>
            <p className="text-[10px] text-emerald-700 mt-0.5 font-medium">Full portal access</p>
          </div>
        </div>

        {/* Card 3: Blocked Students */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Blocked Students</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <UserX className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-rose-600">{adminStats.blockedStudents}</span>
            <p className="text-[10px] text-rose-700 mt-0.5 font-medium">Access suspended</p>
          </div>
        </div>

        {/* Card 4: Total Files Uploaded */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Files Uploaded</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{adminStats.totalFilesUploaded}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Question papers</p>
          </div>
        </div>

        {/* Card 5: Total Questions Generated */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Questions Generated</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <HelpCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{adminStats.totalQuestionsGenerated}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">AI mark-based Q&A</p>
          </div>
        </div>

        {/* Card 6: Practice Tests Taken */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Tests Completed</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{adminStats.totalTestsTaken}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Evaluated attempts</p>
          </div>
        </div>
      </div>

      {/* Overview & Quick Student Registry Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Student Registry Table */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Registered Students</h3>
              <p className="text-[11px] text-slate-500">Department of AI&DS 2nd Year cohort</p>
            </div>
            <button
              onClick={() => onNavigate("admin_students")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              View Full Table →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Student</th>
                  <th className="py-2.5 px-3 font-semibold">Email</th>
                  <th className="py-2.5 px-3 font-semibold">Purpose</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentStudents.map((s) => (
                  <tr key={s.uid} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[10px] text-slate-400">{s.college}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{s.email}</td>
                    <td className="py-3 px-3">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                        {s.purpose}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          s.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {s.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Academic Administration Box */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Department Governance</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Admins can inspect student activity, monitor semester exam preparation metrics, and manage user authorizations.
            </p>

            <div className="mt-4 space-y-2.5 rounded-2xl bg-indigo-50/60 p-3.5 text-xs text-indigo-950 border border-indigo-100">
              <div className="flex items-center justify-between">
                <span>Active Semester:</span>
                <strong className="text-indigo-900">Semester IV (2024–2025)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Curriculum Scheme:</span>
                <strong className="text-indigo-900">Regulation 2021</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Registered Cohort:</span>
                <strong className="text-indigo-900">62 Students</strong>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate("admin_manage")}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
            >
              Open Student Access Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
