import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  FileText,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import { UploadedFile, TestQuestion, TestResult } from "../../types";
import { generateTestQuestions } from "../../services/geminiService";
import { appStore } from "../../services/store";

interface TestPageProps {
  files: UploadedFile[];
  initialSelectedFile?: UploadedFile | null;
  onNavigateToDashboard: () => void;
}

export const TestPage: React.FC<TestPageProps> = ({
  files,
  initialSelectedFile,
  onNavigateToDashboard,
}) => {
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(
    initialSelectedFile || files[0] || null
  );
  const [testState, setTestState] = useState<"SELECT" | "LOADING" | "RUNNING" | "FINISHED">(
    "SELECT"
  );
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: string]: "A" | "B" | "C" | "D" }>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer
  const [latestResult, setLatestResult] = useState<TestResult | null>(null);

  useEffect(() => {
    if (initialSelectedFile) {
      setSelectedFile(initialSelectedFile);
    }
  }, [initialSelectedFile]);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (testState === "RUNNING" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (testState === "RUNNING" && timeLeft === 0) {
      handleFinishTest();
    }
    return () => clearInterval(interval);
  }, [testState, timeLeft]);

  const handleStartTest = async () => {
    if (!selectedFile) return;
    setTestState("LOADING");

    try {
      const res = await generateTestQuestions(
        selectedFile.questions || selectedFile.fileName,
        10,
        selectedFile.subject
      );
      if (res.success && res.testQuestions && res.testQuestions.length > 0) {
        setQuestions(res.testQuestions);
        setCurrentIdx(0);
        setUserAnswers({});
        setTimeLeft(300); // 5 minutes
        setTestState("RUNNING");
      } else {
        throw new Error("Could not prepare test questions");
      }
    } catch (e) {
      console.error(e);
      // Fallback
      setQuestions([
        {
          id: "t-fb-1",
          fileId: selectedFile.fileId,
          questionText: "What scheduling algorithm assigns fixed time slices in cyclic order?",
          options: [
            { key: "A", text: "First-Come First-Served (FCFS)" },
            { key: "B", text: "Round Robin (RR)" },
            { key: "C", text: "Shortest Job First (SJF)" },
            { key: "D", text: "Priority Scheduling" },
          ],
          correctOption: "B",
          explanation: "Round Robin uses a fixed time quantum to achieve fair CPU sharing without starvation.",
        },
        {
          id: "t-fb-2",
          fileId: selectedFile.fileId,
          questionText: "Which of the following conditions is NOT required for Deadlock?",
          options: [
            { key: "A", text: "Mutual Exclusion" },
            { key: "B", text: "Hold and Wait" },
            { key: "C", text: "Preemption" },
            { key: "D", text: "Circular Wait" },
          ],
          correctOption: "C",
          explanation: "Coffman's conditions mandate NO preemption. Forced preemption would actually break deadlock.",
        },
      ]);
      setTestState("RUNNING");
    }
  };

  const handleSelectOption = (key: "A" | "B" | "C" | "D") => {
    const q = questions[currentIdx];
    setUserAnswers((prev) => ({
      ...prev,
      [q.id]: key,
    }));
  };

  const handleFinishTest = () => {
    let score = 0;
    const details = questions.map((q) => {
      const selected = userAnswers[q.id] || "None";
      const isCorrect = selected === q.correctOption;
      if (isCorrect) score += 1;
      return {
        questionText: q.questionText,
        selected,
        correct: q.correctOption,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const total = questions.length || 1;
    const percentage = Math.round((score / total) * 100);

    const currentUser = appStore.getCurrentUser();
    const resultRecord: TestResult = {
      id: `tr_${Date.now()}`,
      testId: `test_${Date.now()}`,
      studentId: currentUser?.uid || "student_nishanth_01",
      fileId: selectedFile?.fileId || "",
      fileName: selectedFile?.fileName || "Practice Test",
      score,
      total,
      percentage,
      date: new Date().toISOString().split("T")[0],
      subject: selectedFile?.subject || "Computer Science",
      details,
    };

    appStore.recordTestResult(resultRecord);
    setLatestResult(resultRecord);
    setTestState("FINISHED");

    // Confetti effect!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe ignore if canvas confetti is restricted
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // State: SELECT FILE
  if (testState === "SELECT") {
    return (
      <div className="space-y-6 pb-12">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-blue-600" />
            Semester Practice Test (1-Mark Questions)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate an AI-powered 1-mark objective test based directly on your uploaded study materials.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Select Study Material for Test:
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {files.map((file) => {
              const isSelected = selectedFile?.fileId === file.fileId;
              return (
                <div
                  key={file.fileId}
                  onClick={() => setSelectedFile(file)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/60 shadow-sm ring-2 ring-blue-100"
                      : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          isSelected ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-slate-200"
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {file.fileName}
                        </h4>
                        <span className="text-[11px] font-semibold text-blue-700">{file.subject}</span>
                      </div>
                    </div>

                    <span
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{file.questionCount} Questions Available</span>
                    <span className="font-semibold text-slate-700">Status: {file.testStatus}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleStartTest}
              disabled={!selectedFile}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <span>Begin Practice Test</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State: LOADING
  if (testState === "LOADING") {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4 animate-pulse">
          <Sparkles className="h-8 w-8" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Preparing 1-Mark Questions...
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          AI is generating verified questions, distractors, and answer rationales for {selectedFile?.subject}.
        </p>
      </div>
    );
  }

  // State: RUNNING
  if (testState === "RUNNING") {
    const q = questions[currentIdx];
    const isLast = currentIdx === questions.length - 1;
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div className="space-y-6 pb-12">
        {/* Top Sticky Test Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              {selectedFile?.subject}
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Question {currentIdx + 1} of {questions.length}
            </h3>
          </div>

          <div className="flex items-center gap-4">
            {/* Answered Progress */}
            <span className="text-xs font-semibold text-slate-500">
              Answered: {answeredCount} / {questions.length}
            </span>

            {/* Countdown Timer */}
            <div className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold ${
              timeLeft < 60 ? "bg-rose-50 text-rose-700 animate-pulse border border-rose-200" : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}>
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Active Question Box */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 border border-blue-200 mb-2">
              1 Mark Question
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {q.questionText}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {q.options.map((opt) => {
              const isSelected = userAnswers[q.id] === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelectOption(opt.key)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-100"
                      : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-700 border border-slate-200"
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-800">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(prev - 1, 0))}
              disabled={currentIdx === 0}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>

            {isLast ? (
              <button
                onClick={handleFinishTest}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Submit & Calculate Score</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentIdx((prev) => Math.min(prev + 1, questions.length - 1))}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <span>Next Question</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // State: FINISHED (Score & Review with Explanations)
  return (
    <div className="space-y-6 pb-12">
      {/* Score Summary Banner */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 mb-4">
          <Award className="h-8 w-8" />
        </div>

        <h2 className="text-2xl font-black text-slate-900">
          Practice Test Completed!
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {latestResult?.fileName} • {latestResult?.subject}
        </p>

        {/* Big Score Counter */}
        <div className="mt-6 inline-flex items-baseline gap-2 rounded-2xl bg-blue-50 px-6 py-3 border border-blue-200">
          <span className="text-4xl font-black text-blue-700">
            {latestResult?.score}
          </span>
          <span className="text-lg font-bold text-slate-400">/ {latestResult?.total}</span>
          <span className="ml-2 rounded-md bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
            {latestResult?.percentage}% Score
          </span>
        </div>

        <p className="mt-3 text-xs text-slate-600 max-w-md mx-auto">
          {latestResult && latestResult.percentage >= 80
            ? "Outstanding performance! You are well-prepared for this section in the semester examination."
            : "Good effort! Review the detailed explanations below to strengthen your conceptual clarity."}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setTestState("SELECT")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Take Another Test</span>
          </button>
          <button
            onClick={onNavigateToDashboard}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Go to Dashboard Analytics</span>
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
          Detailed Review & Explanations ({latestResult?.details.length || 0} Questions)
        </h3>

        {latestResult?.details.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-4 sm:p-5 transition-all ${
              item.isCorrect
                ? "border-emerald-200 bg-emerald-50/20"
                : "border-rose-200 bg-rose-50/20"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                {item.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <span className="text-[11px] font-bold text-slate-400">Q{idx + 1}</span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                    {item.questionText}
                  </h4>
                </div>
              </div>

              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                  item.isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}
              >
                {item.isCorrect ? "+1 Mark" : "0 Marks"}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Your Choice:</span>
                <span
                  className={`font-bold ${
                    item.isCorrect ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  Option {item.selected}
                </span>
              </div>
              {!item.isCorrect && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Correct Option:</span>
                  <span className="font-bold text-emerald-700">
                    Option {item.correct}
                  </span>
                </div>
              )}
            </div>

            {/* Explanation box */}
            {item.explanation && (
              <div className="mt-3 rounded-xl bg-white/80 p-3 text-xs text-slate-700 border border-slate-200/60">
                <span className="font-bold text-slate-900">Explanation: </span>
                <span>{item.explanation}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
