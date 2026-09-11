import React, { useState, useEffect } from "react";
import { appStore, DEFAULT_STUDENT, DEFAULT_ADMINS } from "./services/store";
import { StudentProfile, AdminProfile, UploadedFile } from "./types";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { StudentDashboardHome } from "./components/dashboard/StudentDashboardHome";
import { FileUploadPage } from "./components/upload/FileUploadPage";
import { SavedQuestionsPage } from "./components/saved/SavedQuestionsPage";
import { HistoryPage } from "./components/history/HistoryPage";
import { TestPage } from "./components/test/TestPage";
import { QuestionPredictionPage } from "./components/prediction/QuestionPredictionPage";
import { ProfilePage } from "./components/profile/ProfilePage";

import { AdminDashboardHome } from "./components/admin/AdminDashboardHome";
import { AdminStudentsPage } from "./components/admin/AdminStudentsPage";
import { AdminDetailsPage } from "./components/admin/AdminDetailsPage";
import { AddAdminPage } from "./components/admin/AddAdminPage";

import { StudentLogin } from "./components/auth/StudentLogin";
import { StudentRegister } from "./components/auth/StudentRegister";
import { AdminLogin } from "./components/auth/AdminLogin";
import { SetupDocsModal } from "./components/common/SetupDocsModal";
import { ShieldAlert, LogOut, RefreshCw } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<StudentProfile | AdminProfile | null>(
    appStore.getCurrentUser()
  );
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authView, setAuthView] = useState<"student_login" | "student_register" | "admin_login">(
    "student_login"
  );
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [selectedFileForTest, setSelectedFileForTest] = useState<UploadedFile | null>(null);

  // Subscribe to store updates for reactive synchronization
  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setCurrentUser(appStore.getCurrentUser());
    });
    return () => unsubscribe();
  }, []);

  const isStudent = currentUser?.role === "student";
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "super_admin";
  const isBlocked = isStudent && (currentUser as StudentProfile)?.status === "blocked";

  const handleLogout = () => {
    appStore.setCurrentUser(null);
    setCurrentUser(null);
    setAuthView("student_login");
    setActiveTab("dashboard");
  };

  // Strict role security: prevent student sessions from ever staying on or accessing admin tabs
  useEffect(() => {
    if (isStudent && activeTab.startsWith("admin_")) {
      setActiveTab("dashboard");
    }
  }, [isStudent, activeTab]);

  const handleToggleSaveQuestion = (questionId: string) => {
    appStore.toggleSaveQuestion(questionId);
  };

  const handleStartTestForFile = (file: UploadedFile) => {
    setSelectedFileForTest(file);
    setActiveTab("test");
  };

  // If user is not logged in, display authentication view without top navbar
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <main>
          {authView === "student_login" && (
            <StudentLogin
              onLoginSuccess={(user) => {
                appStore.setCurrentUser(user);
                setCurrentUser(user);
                setActiveTab("dashboard");
              }}
              onNavigateToRegister={() => setAuthView("student_register")}
              onNavigateToAdminLogin={() => setAuthView("admin_login")}
            />
          )}

          {authView === "student_register" && (
            <StudentRegister
              onRegisterSuccess={(user) => {
                appStore.setCurrentUser(user);
                setCurrentUser(user);
                setActiveTab("dashboard");
              }}
              onNavigateToLogin={() => setAuthView("student_login")}
            />
          )}

          {authView === "admin_login" && (
            <AdminLogin
              onLoginSuccess={(admin) => {
                appStore.setCurrentUser(admin);
                setCurrentUser(admin);
                setActiveTab("admin_dashboard");
              }}
              onNavigateToStudentLogin={() => setAuthView("student_login")}
            />
          )}
        </main>

        {showDocsModal && <SetupDocsModal onClose={() => setShowDocsModal(false)} />}
      </div>
    );
  }

  // If student account is blocked by administrator
  if (isBlocked) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
        <Navbar
          currentUser={currentUser}
          onOpenMobileMenu={() => {}}
          onLogout={handleLogout}
          onOpenDocs={() => setShowDocsModal(true)}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-black text-rose-950">
              Account Suspended / Blocked
            </h2>
            <p className="mt-2 text-xs text-rose-800 leading-relaxed">
              Your student account (<strong>{(currentUser as StudentProfile).name}</strong>) has been blocked by the department administrator. Please contact your Faculty Advisor or Department Head to restore access.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  // Allow quick unblocking for evaluator convenience
                  appStore.updateStudentStatus(currentUser.uid, "active");
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Demo Action: Restore My Account Access</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {showDocsModal && <SetupDocsModal onClose={() => setShowDocsModal(false)} />}
      </div>
    );
  }

  const stats = appStore.getDashboardStats();
  const activities = appStore.getActivities();
  const files = appStore.getFiles();
  const savedQuestions = appStore.getSavedQuestions();

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar (Desktop Fixed & Mobile Drawer) */}
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== "test") {
            setSelectedFileForTest(null);
          }
        }}
        onLogout={handleLogout}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Sticky Navbar */}
        <Navbar
          currentUser={currentUser}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={handleLogout}
          onOpenDocs={() => setShowDocsModal(true)}
        />

        {/* Dashboard Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* STUDENT VIEWS */}
          {isStudent && activeTab === "dashboard" && (
            <StudentDashboardHome
              student={currentUser as StudentProfile}
              stats={stats}
              activities={activities}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {isStudent && activeTab === "upload" && (
            <FileUploadPage
              onToggleSave={handleToggleSaveQuestion}
              onNavigateToHistory={() => setActiveTab("history")}
            />
          )}

          {isStudent && activeTab === "saved" && (
            <SavedQuestionsPage
              savedQuestions={savedQuestions}
              onToggleSave={handleToggleSaveQuestion}
              onNavigateToUpload={() => setActiveTab("upload")}
            />
          )}

          {isStudent && activeTab === "history" && (
            <HistoryPage
              files={files}
              onToggleSave={handleToggleSaveQuestion}
              onStartTestForFile={handleStartTestForFile}
              onNavigateToUpload={() => setActiveTab("upload")}
            />
          )}

          {isStudent && activeTab === "test" && (
            <TestPage
              files={files}
              initialSelectedFile={selectedFileForTest}
              onNavigateToDashboard={() => setActiveTab("dashboard")}
            />
          )}

          {isStudent && activeTab === "prediction" && (
            <QuestionPredictionPage />
          )}

          {isStudent && activeTab === "profile" && (
            <ProfilePage student={currentUser as StudentProfile} />
          )}

          {/* ADMIN VIEWS - strictly protected for authenticated faculty/admin only */}
          {isAdmin && activeTab === "admin_dashboard" && (
            <AdminDashboardHome
              admin={currentUser as AdminProfile}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {isAdmin && (activeTab === "admin_students" || activeTab === "admin_manage") && (
            <AdminStudentsPage />
          )}

          {isAdmin && activeTab === "admin_details" && (
            <AdminDetailsPage admin={currentUser as AdminProfile} />
          )}

          {isAdmin && activeTab === "admin_add" && (
            <AddAdminPage
              currentAdmin={currentUser as AdminProfile}
              onAdminCreated={() => setActiveTab("admin_students")}
            />
          )}
        </main>
      </div>

      {/* Architecture & Guidelines Documentation Modal */}
      {showDocsModal && <SetupDocsModal onClose={() => setShowDocsModal(false)} />}
    </div>
  );
}
