import React, { useState } from "react";
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  GraduationCap,
} from "lucide-react";
import { AdminProfile } from "../../types";
import { appStore, DEFAULT_ADMINS } from "../../services/store";

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminProfile) => void;
  onNavigateToStudentLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onNavigateToStudentLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Please enter your official administrator email address.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your administrator password.");
      return;
    }

    const admins = appStore.getAdmins();
    const matched = admins.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matched) {
      // Also verify default admin emails in case of casing differences
      const defaultMatch = DEFAULT_ADMINS.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (defaultMatch) {
        onLoginSuccess(defaultMatch);
        return;
      }
      setErrorMsg("Unauthorized: No administrative credentials found for this email.");
      return;
    }

    onLoginSuccess(matched);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setShowForgotModal(false);
      setResetEmail("");
    }, 2500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 bg-slate-900">
      <div className="w-full max-w-md space-y-6 my-auto">
        {/* Admin Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-xl shadow-indigo-500/20 mb-4 ring-4 ring-indigo-500/20">
            <Shield className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Department Admin Portal
          </h2>
          <p className="mt-1 text-xs text-indigo-300">
            Faculty & Departmental Authority • Rathinam Technical Campus
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md text-white">
          {/* Portal Switcher on Login Page Only */}
          <div className="flex rounded-2xl bg-slate-900 p-1 mb-5 border border-slate-800">
            <button
              type="button"
              onClick={onNavigateToStudentLogin}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-white transition-all"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Student Login</span>
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white shadow-xs transition-all"
            >
              <Shield className="h-4 w-4" />
              <span>Admin Login</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-2xl border border-rose-800 bg-rose-950/50 p-3.5 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in">
              <AlertTriangle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin ID / Official Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. hod.aids@rathinam.in"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-3 text-xs font-semibold text-white placeholder:text-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-3 text-xs font-semibold text-white placeholder:text-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-colors mt-3"
            >
              <span>Authenticate Administrator</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onNavigateToStudentLogin}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Student Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Simulator Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl text-white">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-bold">Administrative Password Reset</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enter your official college email address. A secured one-time recovery link will be dispatched.
            </p>

            {resetSent ? (
              <div className="rounded-2xl bg-emerald-950/60 p-3.5 text-xs text-emerald-300 border border-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Password recovery instructions sent to {resetEmail || "your email"}!</span>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="hod.aids@rathinam.in"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-sm"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
