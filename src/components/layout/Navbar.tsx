import React, { useState } from "react";
import {
  Bell,
  Search,
  BookOpen,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Menu,
  CheckCircle,
  X,
  FileText,
  LogOut,
} from "lucide-react";
import { StudentProfile, AdminProfile } from "../../types";
import { appStore } from "../../services/store";

interface NavbarProps {
  currentUser: StudentProfile | AdminProfile | null;
  onOpenMobileMenu: () => void;
  onLogout?: () => void;
  onSelectSearch?: (term: string) => void;
  onOpenDocs?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenMobileMenu,
  onLogout,
  onSelectSearch,
  onOpenDocs,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const isStudent = currentUser?.role === "student";
  const activities = appStore.getActivities().slice(0, 5);

  const matchingQuestions =
    searchTerm.trim().length >= 2
      ? appStore
          .getAllQuestions()
          .filter(
            (q) =>
              q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
              q.subject.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 5)
      : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && onSelectSearch) {
      onSelectSearch(searchTerm.trim());
      setShowSearchDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile Toggle & Campus Badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          title="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-sm shadow-blue-500/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-slate-900">
                Rathinam Technical Campus
              </span>
              <span className="hidden rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200/60 sm:inline-block">
                AI&DS • 2nd Year
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-none">
              Department of Artificial Intelligence & Data Science
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Search bar (desktop) */}
      <div className="hidden max-w-md flex-1 px-6 md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onFocus={() => setShowSearchDropdown(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSearchDropdown(true);
            }}
            placeholder="Search questions, subjects, topics..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-8 text-xs text-slate-800 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setShowSearchDropdown(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Quick Search Matches Dropdown */}
          {showSearchDropdown && matchingQuestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Matching Questions ({matchingQuestions.length})
              </div>
              <div className="space-y-1">
                {matchingQuestions.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => {
                      if (onSelectSearch) {
                        onSelectSearch(q.questionText);
                      }
                      setShowSearchDropdown(false);
                    }}
                    className="cursor-pointer rounded-xl p-2 text-xs hover:bg-blue-50/70 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] text-blue-700 font-semibold mb-0.5">
                      <span>{q.subject}</span>
                      <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold">
                        {q.marks} Marks
                      </span>
                    </div>
                    <p className="line-clamp-2 font-medium text-slate-800 text-xs">
                      {q.questionText}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Right: Actions, Portal Toggle & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Architecture & Setup Guide Button */}
        <button
          onClick={onOpenDocs}
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          title="Firebase & Architecture Guidelines"
        >
          <FileText className="h-3.5 w-3.5 text-blue-600" />
          <span>Setup Docs</span>
        </button>

        {/* Role Badge Indicator (Non-clickable, informational only) */}
        {currentUser && (
          <div className="hidden sm:flex items-center">
            {isStudent ? (
              <span className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200/60">
                <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                <span>Student Portal</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200/60">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                <span>Admin Portal</span>
              </span>
            )}
          </div>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/50 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Recent Exam Updates</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="rounded p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-2 text-xs transition-colors hover:bg-blue-50/50"
                  >
                    <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">{act.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{act.description}</p>
                      <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2.5 pl-1 sm:border-l sm:border-slate-200 sm:pl-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm ring-2 ring-blue-100">
              {currentUser?.name?.slice(0, 2).toUpperCase() || "AI"}
            </div>
            <span
              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                currentUser?.status === "blocked" ? "bg-red-500" : "bg-emerald-500"
              }`}
            />
          </div>
          <div className="hidden text-left lg:block">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              {currentUser?.name || "Student"}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
              <span className="capitalize">{currentUser?.role?.replace("_", " ")}</span>
              <span>•</span>
              <span className="text-blue-600">{currentUser?.department || "AI&DS"}</span>
            </div>
          </div>
        </div>

        {/* Optional Logout Button */}
        {currentUser && onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
};
