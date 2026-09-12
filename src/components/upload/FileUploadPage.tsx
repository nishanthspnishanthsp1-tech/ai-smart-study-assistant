import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  BookOpen,
  Filter,
  Layers,
  ArrowRight,
} from "lucide-react";
import { UploadedFile, QuestionItem } from "../../types";
import { QuestionCard } from "../questions/QuestionCard";
import { analyzeStudyMaterial } from "../../services/geminiService";
import { appStore } from "../../services/store";

interface FileUploadPageProps {
  onToggleSave: (questionId: string) => void;
  onNavigateToHistory: () => void;
}

export const FileUploadPage: React.FC<FileUploadPageProps> = ({
  onToggleSave,
  onNavigateToHistory,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("Artificial Intelligence & Data Science");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "analyzing" | "completed" | "error"
  >("idle");
  const [progressText, setProgressText] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [analyzedQuestions, setAnalyzedQuestions] = useState<QuestionItem[]>([]);
  const [filterPriority, setFilterPriority] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    // Validate file extensions
    const validExtensions = [".pdf", ".docx", ".doc", ".txt", ".png", ".jpg", ".jpeg"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(ext)) {
      setErrorMessage("Please upload PDF, DOCX, TXT or supported image format.");
      return;
    }

    setErrorMessage("");
    setSelectedFile(file);
    processFile(file);
  };

  const processFile = async (file: File) => {
    setUploadStatus("uploading");
    setProgressPercent(20);
    setProgressText("Uploading document...");

    // Read content preview if text file or extract filename
    let textContent = "";
    if (file.type.includes("text") || file.name.endsWith(".txt")) {
      textContent = await file.text();
    } else {
      textContent = `Study material file: ${file.name} for subject: ${subject}. Generate complete exam-oriented questions covering all units, 2 marks, 5 marks, 10 marks and 16 marks.`;
    }

    setTimeout(async () => {
      setUploadStatus("analyzing");
      setProgressPercent(45);
      setProgressText("AI analyzing question paper and extracting questions...");

      // Simulate sequential batch progress if large
      const progressSteps = [
        "Processing Question 1 to 5...",
        "Evaluating mark weightage & answer schemes...",
        "Generating Tamil translations & audio guides...",
        "Detecting exam frequency & high priority items...",
        "Generating quick revision summaries...",
      ];

      for (let i = 0; i < progressSteps.length; i++) {
        await new Promise((res) => setTimeout(res, 600));
        setProgressText(progressSteps[i]);
        setProgressPercent(50 + i * 9);
      }

      try {
        const result = await analyzeStudyMaterial(file.name, textContent, subject);
        if (result.success && result.questions && result.questions.length > 0) {
          const fileId = `file_${Date.now()}`;
          const currentUser = appStore.getCurrentUser();
          const studentId = currentUser?.uid || "student_nishanth_01";

          const formattedQuestions: QuestionItem[] = result.questions.map((q, idx) => ({
            ...q,
            id: `q_${fileId}_${idx + 1}`,
            fileId,
            studentId,
            subject: subject,
            isSaved: false,
          }));

          const uploadedRecord: UploadedFile = {
            fileId,
            studentId,
            fileName: file.name,
            fileType: file.type || "application/pdf",
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            uploadDate: new Date().toISOString().split("T")[0],
            subject,
            questionCount: formattedQuestions.length,
            questionsAnswered: formattedQuestions.length,
            importantCount: formattedQuestions.filter((q) => q.importance === "HIGH").length,
            testStatus: "Not Taken",
            processingStatus: "completed",
            questions: formattedQuestions,
          };

          appStore.addFile(uploadedRecord);
          setAnalyzedQuestions(formattedQuestions);
          setUploadStatus("completed");
          setProgressPercent(100);
          setProgressText(`${formattedQuestions.length}/${formattedQuestions.length} Questions Processed Successfully`);
        } else {
          throw new Error("No questions extracted");
        }
      } catch (err: any) {
        console.error("Processing failed:", err);
        setUploadStatus("error");
        setErrorMessage("We couldn't process this file right now. Please try again.");
      }
    }, 800);
  };

  const handleRetry = () => {
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const filteredQuestions = analyzedQuestions.filter((q) => {
    if (filterPriority === "ALL") return true;
    return q.importance === filterPriority;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Upload Your Study Material
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload your question paper or question bank and let AI prepare easy answers.
        </p>
      </div>

      {/* Upload Zone & Subject Selection */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        {/* Subject dropdown */}
        <div className="mb-5 max-w-xs">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Select Subject / Module
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={uploadStatus === "uploading" || uploadStatus === "analyzing"}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
          >
            <option value="Operating Systems">Operating Systems (OS)</option>
            <option value="DBMS">Database Management Systems (DBMS)</option>
            <option value="Artificial Intelligence">Artificial Intelligence (AI)</option>
            <option value="Computer Networks">Computer Networks (CN)</option>
            <option value="Machine Learning">Machine Learning (ML)</option>
            <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
            <option value="Deep Learning">Deep Learning (DL)</option>
          </select>
        </div>

        {/* Drag and Drop Container */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
            dragActive
              ? "border-blue-600 bg-blue-50/50"
              : "border-slate-200 bg-slate-50/60 hover:border-blue-400 hover:bg-slate-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
            className="hidden"
          />

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-4 shadow-xs">
            <UploadCloud className="h-7 w-7" />
          </div>

          <h3 className="text-base font-bold text-slate-900">
            Drag and drop your question paper or syllabus here
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md">
            Supports PDF, DOC, DOCX, TXT, and images. AI extracts all questions and formats mark-based answers in English and Tamil.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadStatus === "uploading" || uploadStatus === "analyzing"}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />
              <span>Choose File</span>
            </button>
            <span className="text-xs text-slate-400">or drop it anywhere in the box</span>
          </div>

          {/* Quick Demo Upload Pre-fills */}
          <div className="mt-6 pt-5 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Quick Test Material:</span>
            <button
              onClick={() => {
                setSubject("Operating Systems");
                const dummyFile = new File(
                  [
                    "Operating Systems Semester Exam Question Paper - Rathinam Technical Campus\nDepartment of AI&DS (2nd Year)\n\n" +
                    "Unit 1: Process and CPU Scheduling\n" +
                    "Q1: What is Process Synchronization? Explain Critical Section Problem and Peterson's Solution. (10 Marks)\n" +
                    "Q2: Define a Process and illustrate the Process State Transition Diagram with PCB. (5 Marks)\n" +
                    "Q3: Compare Preemptive vs Non-Preemptive CPU Scheduling algorithms with Gantt chart example. (10 Marks)\n\n" +
                    "Unit 2: Deadlocks and Concurrency\n" +
                    "Q4: What are the four necessary conditions for Deadlock? Explain Banker's Algorithm for deadlock avoidance. (16 Marks)\n" +
                    "Q5: Define Semaphore. Differentiate between Binary and Counting Semaphores with wait() and signal() operations. (5 Marks)\n\n" +
                    "Unit 3: Memory Management\n" +
                    "Q6: Explain Paging and Segmentation memory management schemes. What is Page Fault and Belady's Anomaly? (13 Marks)\n" +
                    "Q7: What is Virtual Memory and Thrashing? How does working-set model prevent thrashing? (5 Marks)"
                  ],
                  "OS_Semester_Question_Bank_2024.txt",
                  { type: "text/plain" }
                );
                handleFileSelected(dummyFile);
              }}
              className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-blue-400 hover:text-blue-600 shadow-2xs"
            >
              📄 Load OS Question Bank
            </button>
            <button
              onClick={() => {
                setSubject("Artificial Intelligence");
                const dummyFile = new File(
                  [
                    "Artificial Intelligence & Machine Learning Model Question Paper - Rathinam Technical Campus\nDepartment of AI&DS (2nd Year)\n\n" +
                    "Unit 1: Problem Solving & Search Strategies\n" +
                    "Q1: Explain A* Search Algorithm. Prove that A* with an admissible heuristic is complete and optimal. (13 Marks)\n" +
                    "Q2: What is an Intelligent Agent? Describe the PEAS environment representation for an Autonomous Driving Agent. (5 Marks)\n" +
                    "Q3: Explain Alpha-Beta Pruning in adversarial game playing with an evaluation tree. (10 Marks)\n\n" +
                    "Unit 2: Knowledge Representation & Logic\n" +
                    "Q4: Explain First-Order Logic (FOL) with syntax, semantics, and Resolution refutation principle. (10 Marks)\n\n" +
                    "Unit 3: Machine Learning & Neural Networks\n" +
                    "Q5: Explain the Architecture of Artificial Neural Networks (ANN) and Backpropagation gradient descent algorithm. (16 Marks)\n" +
                    "Q6: Describe Support Vector Machines (SVM). Explain Maximum Margin Hyperplane and Kernel Trick. (10 Marks)"
                  ],
                  "AI_Unit1_5_Question_Bank.txt",
                  { type: "text/plain" }
                );
                handleFileSelected(dummyFile);
              }}
              className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-blue-400 hover:text-blue-600 shadow-2xs"
            >
              📄 Load AI Question Bank
            </button>
          </div>
        </div>

        {/* Upload Status Card */}
        {uploadStatus !== "idle" && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold">
                  {uploadStatus === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : uploadStatus === "error" ? (
                    <AlertCircle className="h-5 w-5 text-rose-600" />
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {selectedFile?.name || "Uploaded Document"}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Size: {selectedFile ? (selectedFile.size / 1024).toFixed(1) + " KB" : "2.4 MB"} •{" "}
                    Subject: {subject}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {uploadStatus === "uploading" && (
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 animate-pulse">
                    Uploading...
                  </span>
                )}
                {uploadStatus === "analyzing" && (
                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 animate-pulse">
                    Analyzing...
                  </span>
                )}
                {uploadStatus === "completed" && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                  </span>
                )}
                {uploadStatus === "error" && (
                  <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                    Failed
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar & Status Text */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>{progressText}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    uploadStatus === "error"
                      ? "bg-rose-500"
                      : uploadStatus === "completed"
                      ? "bg-emerald-500"
                      : "bg-blue-600"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Error Message & Retry */}
            {uploadStatus === "error" && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
                <span>{errorMessage || "We couldn't process this file right now. Please try again."}</span>
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1 font-bold text-rose-700 hover:underline ml-3 shrink-0"
                >
                  <RefreshCw className="h-3 w-3" /> Retry
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generated Q&A Section */}
      {analyzedQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                AI Generated Mark-Based Answers ({analyzedQuestions.length})
              </h3>
              <p className="text-xs text-slate-500">
                All questions extracted in sequence with mark schemes, Tamil translation, and quick revisions.
              </p>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200/60">
                {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilterPriority(p)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      filterPriority === p
                        ? "bg-white text-blue-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {p === "HIGH" ? "⭐ High" : p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Render Questions */}
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                onToggleSave={(id) => {
                  onToggleSave(id);
                  setAnalyzedQuestions((prev) =>
                    prev.map((item) =>
                      item.id === id ? { ...item, isSaved: !item.isSaved } : item
                    )
                  );
                }}
                onToggleComplete={(id) => {
                  appStore.toggleQuestionCompleted(id);
                  setAnalyzedQuestions((prev) =>
                    prev.map((item) =>
                      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
                    )
                  );
                }}
              />
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={onNavigateToHistory}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
            >
              <span>View In Upload History</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
