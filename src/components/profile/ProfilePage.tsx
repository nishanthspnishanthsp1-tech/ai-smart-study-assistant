import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  GraduationCap,
  Building,
  Calendar,
  ShieldCheck,
  Save,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { StudentProfile } from "../../types";
import { appStore } from "../../services/store";

interface ProfilePageProps {
  student: StudentProfile;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ student }) => {
  const [name, setName] = useState(student.name);
  const [phone, setPhone] = useState(student.phone);
  const [purpose, setPurpose] = useState<"Student" | "Staff" | "Education / Learning">(student.purpose);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentProfile = {
      ...student,
      name,
      phone,
      purpose,
    };
    appStore.updateStudentProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <User className="h-6 w-6 text-blue-600" />
          Student Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Registered institutional credentials and academic profile at Rathinam Technical Campus.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Your student profile has been updated successfully!</span>
        </div>
      )}

      {/* College ID Card Badge */}
      <div className="overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 text-white shadow-lg shadow-blue-900/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-2xl font-black ring-4 ring-white/20">
              {student.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black">{student.name}</h3>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
                  {student.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                {student.department} • {student.year}
              </p>
              <p className="text-[11px] text-blue-300">{student.college}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md border border-white/15 text-right">
            <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider block">
              Verified Student Account
            </span>
            <span className="text-xs font-mono font-bold text-white">ID: {student.uid}</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Email (Readonly) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address (Institutional)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={student.email}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Account Purpose
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
              >
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
                <option value="Education / Learning">Education / Learning</option>
              </select>
            </div>

            {/* Institution / College (Readonly) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                College / Institution
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={student.college}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Department (Readonly) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Department & Year
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={`${student.department} (${student.year})`}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
