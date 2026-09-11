import React, { useState } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  ShieldAlert,
  Shield,
  BookOpen,
} from "lucide-react";
import { StudentProfile } from "../../types";
import { appStore, DEFAULT_STUDENT } from "../../services/store";

interface StudentLoginProps {
  onLoginSuccess: (student: StudentProfile) => void;
  onNavigateToRegister: () => void;
  onNavigateToAdminLogin: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToAdminLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Please enter your registered student email.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    const students = appStore.getStudents();
    const matched = students.find(
      (s) => s.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matched) {
      // Check if matches default student (Nishanth)
      if (email.trim().toLowerCase() === DEFAULT_STUDENT.email.toLowerCase()) {
        if (DEFAULT_STUDENT.status === "blocked") {
          setErrorMsg("Your account has been blocked by administrator. Please contact Department Head.");
          return;
        }
        onLoginSuccess(DEFAULT_STUDENT);
        return;
      }
      setErrorMsg("No registered student found with this email address. Please register an account.");
      return;
    }

    if (matched.status === "blocked") {
      setErrorMsg("Your account has been blocked by administrator. Please contact Department Head.");
      return;
    }

    onLoginSuccess(matched);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 bg-slate-50/70">
      <div className="w-full max-w-md space-y-6 my-auto">
        {/* Brand Card Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-500/25 mb-4">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Student Portal Login
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Rathinam Technical Campus • Department of AI&DS (2nd Year)
          </p>
        </div>

        {/* Login Form Box */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          {/* Portal Switcher on Login Page Only */}
          <div className="flex rounded-2xl bg-slate-100 p-1 mb-5 border border-slate-200/70">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl bg-white text-blue-700 shadow-xs transition-all"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Student Login</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToAdminLogin}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-900 transition-all"
            >
              <Shield className="h-4 w-4" />
              <span>Admin Login</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
              <ShieldAlert className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Student Email / ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. nishanthsp262007@gmail.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors mt-2"
            >
              <span>Sign In to Student Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Register & Admin Login Links */}
          <div className="mt-6 flex flex-col items-center gap-2 text-xs text-slate-500">
            <p>
              New here?{" "}
              <button
                onClick={onNavigateToRegister}
                className="font-bold text-blue-600 hover:underline"
              >
                Create a student account
              </button>
            </p>
            <button
              onClick={onNavigateToAdminLogin}
              className="font-semibold text-slate-700 hover:text-indigo-600 flex items-center gap-1.5 mt-1"
            >
              <Shield className="h-3.5 w-3.5 text-indigo-600" />
              <span>Department Faculty / Admin Login Portal →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
