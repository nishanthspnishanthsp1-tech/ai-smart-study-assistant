import React, { useState } from "react";
import {
  GraduationCap,
  User,
  Phone,
  Building,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { StudentProfile } from "../../types";
import { appStore } from "../../services/store";

interface StudentRegisterProps {
  onRegisterSuccess: (student: StudentProfile) => void;
  onNavigateToLogin: () => void;
}

export const StudentRegister: React.FC<StudentRegisterProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("Rathinam Technical Campus");
  const [department, setDepartment] = useState("Artificial Intelligence and Data Science");
  const [year, setYear] = useState("2nd Year");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [purpose, setPurpose] = useState<"Student" | "Staff" | "Education / Learning">("Student");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validations
    if (!name.trim() || !phone.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg("All fields are required. Please fill in all information.");
      return;
    }

    // Phone validation (10 digits)
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid academic or personal email address.");
      return;
    }

    // Password length
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    // Password match
    if (password !== confirmPassword) {
      setErrorMsg("Password and Confirm Password do not match.");
      return;
    }

    // Check duplicate email
    const existing = appStore.getStudents().find(
      (s) => s.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (existing) {
      setErrorMsg("A student account with this email already exists. Please log in.");
      return;
    }

    const newStudent: StudentProfile = {
      uid: `student_${Date.now()}`,
      name: name.trim(),
      phone: `+91 ${cleanPhone.slice(-10)}`,
      college,
      department,
      year,
      email: email.trim().toLowerCase(),
      purpose,
      role: "student",
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    appStore.addStudent(newStudent);
    setSuccessMsg(true);

    setTimeout(() => {
      onRegisterSuccess(newStudent);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 bg-slate-50/70 py-10">
      <div className="w-full max-w-lg space-y-6 my-auto">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-500/25 mb-4">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Student Account Registration
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Rathinam Technical Campus • Department of AI&DS
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          {errorMsg && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
              <AlertTriangle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <span className="font-semibold">Account created! Logging in to study assistant...</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Nishanth S P"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="9842178901"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="student@rathinam.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* College */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  College / Institution
                </label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Department & Year */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department & Year
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-2/3 rounded-xl border border-slate-200 bg-slate-50 py-2 px-2 text-[11px] font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-1/3 rounded-xl border border-slate-200 bg-slate-50 py-2 px-1 text-[11px] font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  >
                    <option value="1st Year">1st Yr</option>
                    <option value="2nd Year">2nd Yr</option>
                    <option value="3rd Year">3rd Yr</option>
                    <option value="4th Year">4th Yr</option>
                  </select>
                </div>
              </div>

              {/* Purpose */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Purpose *
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                >
                  <option value="Student">Student (Semester Exam Preparation)</option>
                  <option value="Staff">Staff (Faculty / Proctor)</option>
                  <option value="Education / Learning">Education / Learning</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors mt-4"
            >
              <span>Create Account & Start Learning</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <button
              onClick={onNavigateToLogin}
              className="font-bold text-blue-600 hover:underline"
            >
              Sign In here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
