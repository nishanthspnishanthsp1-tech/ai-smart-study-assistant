import React from "react";
import {
  Shield,
  User,
  Phone,
  Mail,
  Building,
  GraduationCap,
  Calendar,
  Award,
} from "lucide-react";
import { AdminProfile } from "../../types";

interface AdminDetailsPageProps {
  admin: AdminProfile;
}

export const AdminDetailsPage: React.FC<AdminDetailsPageProps> = ({ admin }) => {
  const isSuperAdmin = admin.role === "super_admin";

  return (
    <div className="max-w-3xl space-y-6 pb-12">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Shield className="h-6 w-6 text-indigo-600" />
          Administrator Credentials
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Authorized faculty and departmental administrative profile.
        </p>
      </div>

      {/* Admin Profile Card */}
      <div className="overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-black text-white shadow-md">
              {admin.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black">{admin.name}</h3>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    isSuperAdmin ? "bg-amber-400 text-slate-950" : "bg-indigo-500 text-white"
                  }`}
                >
                  {isSuperAdmin ? "⭐ SUPER ADMIN" : "ADMIN"}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                {admin.department}
              </p>
              <p className="text-[11px] text-slate-400">Rathinam Technical Campus</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md border border-white/15 text-right">
            <span className="text-[10px] font-semibold text-indigo-200 uppercase tracking-wider block">
              Authorization Level
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {isSuperAdmin ? "Tier 1: Full System Authority" : "Tier 2: Faculty Proctor"}
            </span>
          </div>
        </div>
      </div>

      {/* Detail Fields */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Faculty Details & Permissions
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <User className="h-4 w-4 text-indigo-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Admin Name</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{admin.name}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Shield className="h-4 w-4 text-indigo-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Assigned Role</span>
            </div>
            <p className="text-sm font-bold capitalize text-slate-900">
              {admin.role.replace("_", " ")}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Mail className="h-4 w-4 text-indigo-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Official Email</span>
            </div>
            <p className="text-sm font-bold font-mono text-slate-900">{admin.email}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Phone className="h-4 w-4 text-indigo-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Official Phone</span>
            </div>
            <p className="text-sm font-bold font-mono text-slate-900">{admin.phone}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <GraduationCap className="h-4 w-4 text-indigo-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Department</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{admin.department}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Account Created</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{admin.createdAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
