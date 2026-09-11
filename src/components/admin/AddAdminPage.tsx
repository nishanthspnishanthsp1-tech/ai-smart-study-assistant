import React, { useState } from "react";
import {
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Lock,
  Building,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { AdminProfile } from "../../types";
import { appStore } from "../../services/store";

interface AddAdminPageProps {
  currentAdmin: AdminProfile;
  onAdminCreated: () => void;
}

export const AddAdminPage: React.FC<AddAdminPageProps> = ({
  currentAdmin,
  onAdminCreated,
}) => {
  const isSuperAdmin = currentAdmin.role === "super_admin";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Artificial Intelligence and Data Science");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "super_admin">("admin");
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      setErrorMsg("Access Denied: Only Super Admin has permission to add administrators.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    const newAdmin: AdminProfile = {
      uid: `admin_${Date.now()}`,
      name,
      phone,
      email,
      department,
      role,
      createdAt: new Date().toISOString().split("T")[0],
    };

    appStore.addAdmin(newAdmin);
    setSuccessMsg(true);
    setErrorMsg("");
    setName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setTimeout(() => {
      setSuccessMsg(false);
      onAdminCreated();
    }, 2000);
  };

  // If logged in as normal admin (not super_admin), enforce strict restriction
  if (!isSuperAdmin) {
    return (
      <div className="max-w-2xl space-y-6 pb-12">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-indigo-600" />
            Provision New Administrator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Faculty account delegation and role access control.
          </p>
        </div>

        <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6 sm:p-8 text-rose-900 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-950">
                Access Denied: Super Admin Privileges Required
              </h3>
              <p className="mt-1 text-xs text-rose-800 leading-relaxed">
                Only the <strong>Super Admin</strong> (HOD Dr. S. Ramesh / System Head) has permission to provision administrator credentials in this system.
              </p>
              <p className="mt-2 text-xs text-rose-700">
                Logged in as: <strong>{currentAdmin.name}</strong> (Standard Admin). If you need administrative accounts added, please request authorization from the Department Head.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 pb-12">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-indigo-600" />
          Add New Administrator
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Super Admin Authorization: Provision faculty proctor or administrative accounts.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>New administrator credentials created successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-rose-50 p-4 text-xs font-semibold text-rose-800 border border-rose-200 animate-in fade-in">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Faculty / Admin Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. A. Murugan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Role selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Administrative Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              >
                <option value="admin">Admin (Faculty Proctor)</option>
                <option value="super_admin">Super Admin (Department Head)</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Official Campus Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="faculty@rathinam.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
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
                  required
                  placeholder="+91 98400 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Department
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Temporary Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Initial Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Provision Administrator</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
