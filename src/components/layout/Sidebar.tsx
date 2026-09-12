import React from "react";
import {
  LayoutDashboard,
  UploadCloud,
  BookmarkCheck,
  History,
  CheckSquare,
  Sparkles,
  User,
  LogOut,
  Users,
  UserCheck,
  Shield,
  UserPlus,
  BrainCircuit,
  GraduationCap,
  Repeat,
  X,
} from "lucide-react";
import { StudentProfile, AdminProfile } from "../../types";

export type StudentNavTab =
  | "dashboard"
  | "upload"
  | "saved"
  | "revision"
  | "history"
  | "test"
  | "prediction"
  | "profile";

export type AdminNavTab =
  | "admin_dashboard"
  | "admin_students"
  | "admin_manage"
  | "admin_details"
  | "admin_add";

interface SidebarProps {
  currentUser: StudentProfile | AdminProfile | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}) => {
  const isStudent = currentUser?.role === "student";

  const studentMenuItems: { id: StudentNavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "upload", label: "File Upload", icon: <UploadCloud className="h-4 w-4" />, badge: "AI" },
    { id: "saved", label: "Saved Questions", icon: <BookmarkCheck className="h-4 w-4" /> },
    { id: "revision", label: "Revision & Patterns", icon: <Repeat className="h-4 w-4" />, badge: "Prep" },
    { id: "history", label: "History", icon: <History className="h-4 w-4" /> },
    { id: "test", label: "Practice Test", icon: <CheckSquare className="h-4 w-4" />, badge: "AI" },
    { id: "prediction", label: "Question Prediction", icon: <Sparkles className="h-4 w-4" />, badge: "Exam" },
    { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  ];

  const adminMenuItems: { id: AdminNavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "admin_dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "admin_students", label: "Students", icon: <Users className="h-4 w-4" /> },
    { id: "admin_manage", label: "Manage Students", icon: <UserCheck className="h-4 w-4" /> },
    { id: "admin_details", label: "Admin Details", icon: <Shield className="h-4 w-4" /> },
    {
      id: "admin_add",
      label: "Add Admin",
      icon: <UserPlus className="h-4 w-4" />,
      badge: currentUser?.role === "super_admin" ? "Super" : "Locked",
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white px-4 py-5 border-r border-slate-200">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 px-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-none">
                AI SMART STUDY
              </h1>
              <p className="text-[10px] font-semibold text-blue-600 tracking-wider mt-0.5">
                ASSISTANT • RTC AI&DS
              </p>
            </div>
          </div>
          {/* Close for mobile drawer */}
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Portal Pill Indicator */}
        <div className="mt-4 mb-2 px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isStudent ? "bg-blue-600" : "bg-indigo-600"
            }`}
          />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            {isStudent ? "Student Portal" : "Admin Management"}
          </span>
        </div>

        {/* Navigation Menu Items */}
        <nav className="mt-4 space-y-1.5">
          {isStudent
            ? studentMenuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-600 hover:bg-blue-50/60 hover:text-blue-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })
            : adminMenuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "text-slate-600 hover:bg-indigo-50/60 hover:text-indigo-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badge === "Super"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
        </nav>
      </div>

      {/* Sidebar Footer Info & Logout */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-3 border border-blue-100/60">
          <div className="flex items-center gap-2 text-blue-700">
            <GraduationCap className="h-4 w-4" />
            <span className="text-[11px] font-bold">2nd Year AI&DS Project</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 leading-snug">
            Semester Exam Assistant for Rathinam Technical Campus students.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col shadow-sm">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
