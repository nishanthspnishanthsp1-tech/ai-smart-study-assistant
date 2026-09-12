import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Building,
  GraduationCap,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { StudentProfile } from "../../types";
import { ManageStudentsModal } from "./ManageStudentsModal";
import { appStore } from "../../services/store";

export const AdminStudentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "active" | "blocked">("ALL");
  const [inspectingStudent, setInspectingStudent] = useState<StudentProfile | null>(null);
  const [pendingToggleStudent, setPendingToggleStudent] = useState<StudentProfile | null>(null);
  const [version, setVersion] = useState(0); // Trigger re-render

  const students = appStore.getStudents();

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm);
    if (!matchesSearch) return false;
    if (statusFilter === "ALL") return true;
    return s.status === statusFilter;
  });

  const handleConfirmToggleBlock = () => {
    if (!pendingToggleStudent) return;
    const nextStatus = pendingToggleStudent.status === "active" ? "blocked" : "active";
    appStore.updateStudentStatus(pendingToggleStudent.uid, nextStatus);
    setPendingToggleStudent(null);
    setVersion((v) => v + 1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            Students Directory ({students.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Department of AI&DS • 2nd Year cohort registry and access management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200/60">
            {(["ALL", "active", "blocked"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-colors ${
                  statusFilter === st
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">College / Campus</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Purpose</th>
                <th className="py-3.5 px-4">Enrolled</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((student) => (
                <tr
                  key={student.uid}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{student.name}</div>
                    <div className="text-[10px] text-indigo-600 font-semibold">
                      {student.department} ({student.year})
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{student.phone}</td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{student.college}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">{student.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {student.purpose}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{student.createdAt}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        student.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {student.status === "active" ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <ShieldAlert className="h-3 w-3" />
                      )}
                      {student.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setInspectingStudent(student)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => setPendingToggleStudent(student)}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                          student.status === "active"
                            ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        }`}
                      >
                        {student.status === "active" ? "Block" : "Unblock"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Block/Unblock */}
      {pendingToggleStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl shrink-0 ${
                  pendingToggleStudent.status === "active"
                    ? "bg-rose-100 text-rose-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  {pendingToggleStudent.status === "active"
                    ? `Block ${pendingToggleStudent.name}?`
                    : `Unblock ${pendingToggleStudent.name}?`}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {pendingToggleStudent.status === "active"
                    ? `Are you sure you want to block ${pendingToggleStudent.name} (${pendingToggleStudent.email})? Blocked students cannot log in or use the study assistant until restored.`
                    : `Are you sure you want to restore full portal access for ${pendingToggleStudent.name}?`}
                </p>
                <div className="mt-5 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPendingToggleStudent(null)}
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmToggleBlock}
                    className={`rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors ${
                      pendingToggleStudent.status === "active"
                        ? "bg-rose-600 hover:bg-rose-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    Confirm {pendingToggleStudent.status === "active" ? "Block" : "Unblock"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inspection Modal */}
      {inspectingStudent && (
        <ManageStudentsModal
          student={inspectingStudent}
          onClose={() => setInspectingStudent(null)}
          onStatusChanged={() => {
            setVersion((v) => v + 1);
            setInspectingStudent(null);
          }}
        />
      )}
    </div>
  );
};
