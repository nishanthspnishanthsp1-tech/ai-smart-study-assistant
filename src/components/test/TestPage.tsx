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
  PenTool,
  Send,
  BookOpen,
  Check,
  AlertTriangle,
  Layers,
} from "lucide-react";
import confetti from "canvas-confetti";
import { UploadedFile, TestQuestion, TestResult, QuestionItem } from "../../types";
import { generateTestQuestions, evaluateSubjectiveAnswer } from "../../services/geminiService";
import { appStore } from "../../services/store";

interface TestPageProps {
  files: UploadedFile[];
  initialSelectedFile?: UploadedFile | null;
  onNavigateToDashboard: () => void;
  onNavigateToUpload?: () => void;
}

export const TestPage: React.FC<TestPageProps> = ({
  files,
  initialSelectedFile,
  onNavigateToDashboard,
  onNavigateToUpload,
}) => {
  // Test Mode: "MCQ" or "SUBJECTIVE"
  const [testMode, setTestMode] = useState<"MCQ" | "SUBJECTIVE">("MCQ");

  // --- MCQ STATE ---
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

  // --- SUBJECTIVE EVALUATOR STATE ---
  const allAvailableQuestions = appStore.getAllQuestions();
  const [subjectiveQuestionText, setSubjectiveQuestionText] = useState(
    allAvailableQuestions[0]?.questionText || "Explain the differences between Paging and Segmentation in Operating Systems."
  );
  const [subjectiveMarks, setSubjectiveMarks] = useState<number>(10);
  const [subjectiveSubject, setSubjectiveSubject] = useState<string>(
    allAvailableQuestions[0]?.subject || "Operating Systems"
  );
  const [studentAnswerText, setStudentAnswerText] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    maxScore: number;
    feedback: string;
    pointsCovered: string[];
    missingPoints: string[];
    modelAnswer: string;
  } | null>(null);

  useEffect(() => {
    if (initialSelectedFile) {
      setSelectedFile(initialSelectedFile);
    }
  }, [initialSelectedFile]);

  // Timer countdown for MCQ
  useEffect(() => {
    let interval: any = null;
    if (testMode === "MCQ" && testState === "RUNNING" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (testMode === "MCQ" && testState === "RUNNING" && timeLeft === 0) {
      handleFinishTest();
    }
    return () => clearInterval(interval);
  }, [testMode, testState, timeLeft]);

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

  const handleEvaluateSubjective = async () => {
    if (!studentAnswerText.trim()) return;
    setIsEvaluating(true);
    try {
      const res = await evaluateSubjectiveAnswer(
        subjectiveQuestionText,
        subjectiveMarks,
        studentAnswerText,
        subjectiveSubject
      );

      setEvaluationResult({
        score: res.score,
        maxScore: res.maxScore || subjectiveMarks,
        feedback: res.feedback,
        pointsCovered: res.pointsCovered || [],
        missingPoints: res.missingPoints || [],
        modelAnswer: res.modelAnswer || "",
      });

      // Also record as a test practice activity
      const currentUser = appStore.getCurrentUser();
      const pct = Math.round((res.score / (res.maxScore || subjectiveMarks)) * 100);
      appStore.recordTestResult({
        id: `tr_subj_${Date.now()}`,
        testId: `subj_${Date.now()}`,
        studentId: currentUser?.uid || "student_nishanth_01",
        fileId: "subjective_practice",
        fileName: `Subjective ${subjectiveMarks}M: ${subjectiveQuestionText.slice(0, 30)}...`,
        score: res.score,
        total: res.maxScore || subjectiveMarks,
        percentage: pct,
        date: new Date().toISOString().split("T")[0],
        subject: subjectiveSubject,
        details: [
          {
            questionText: subjectiveQuestionText,
            selected: "Written Response",
            correct: "AI Rubric Evaluated",
            isCorrect: pct >= 60,
            explanation: res.feedback,
          },
        ],
      });

      if (pct >= 70) {
        try {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        } catch {
          // safe
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Test Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-blue-600" />
            AI Practice & Assessment Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Test your knowledge with 1-mark objective tests or practice full subjective exam answers evaluated by AI.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1 border border-slate-200/80 w-fit">
          <button
            onClick={() => {
              setTestMode("MCQ");
            }}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              testMode === "MCQ"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CheckSquare className="h-4 w-4 text-blue-600" />
            <span>1-Mark MCQ Test</span>
          </button>

          <button
            onClick={() => {
              setTestMode("SUBJECTIVE");
            }}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              testMode === "SUBJECTIVE"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PenTool className="h-4 w-4 text-purple-600" />
            <span>Subjective Answer Evaluation</span>
            <span className="rounded-md bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-700">
              AI
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUBJECTIVE ANSWER EVALUATION MODE                                       */}
      {/* ========================================================================= */}
      {testMode === "SUBJECTIVE" && (
        <div className="space-y-6">
          {/* Question Configuration Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <PenTool className="h-5 w-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Subjective Exam Practice & AI Evaluation
                </h3>
              </div>
              <span className="rounded-xl bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200">
                Exam Rubric Grading
              </span>
            </div>

            <div className="space-y-4">
              {/* Question Selection / Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Exam Question to Practice
                  </label>
                  {allAvailableQuestions.length > 0 && (
                    <select
                      onChange={(e) => {
                        const found = allAvailableQuestions.find((q) => q.id === e.target.value);
                        if (found) {
                          setSubjectiveQuestionText(found.questionText);
                          setSubjectiveMarks(found.marks || 10);
                          setSubjectiveSubject(found.subject || "Computer Science");
                          setEvaluationResult(null);
                        }
                      }}
                      className="text-xs text-blue-600 font-semibold bg-blue-50/50 rounded-lg px-2 py-1 border border-blue-200 focus:outline-none"
                    >
                      <option value="">Load from your questions...</option>
                      {allAvailableQuestions.map((q) => (
                        <option key={q.id} value={q.id}>
                          [{q.marks}M] {q.questionText.slice(0, 50)}...
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <textarea
                  value={subjectiveQuestionText}
                  onChange={(e) => setSubjectiveQuestionText(e.target.value)}
                  rows={2}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/40 p-3 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter or paste exam question here..."
                />
              </div>

              {/* Marks & Subject Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Marks
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[2, 3, 5, 10, 13].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSubjectiveMarks(m)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                          subjectiveMarks === m
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {m} Marks
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Subject / Domain
                  </label>
                  <input
                    type="text"
                    value={subjectiveSubject}
                    onChange={(e) => setSubjectiveSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                    placeholder="e.g. Operating Systems, AI, DBMS"
                  />
                </div>
              </div>

              {/* Student Answer Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>Your Answer</span>
                    <span className="text-slate-400 font-normal">
                      (Write points, definitions, diagrams explanation or code)
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {studentAnswerText.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  value={studentAnswerText}
                  onChange={(e) => setStudentAnswerText(e.target.value)}
                  rows={8}
                  placeholder={`Write your ${subjectiveMarks}-mark answer here as you would in the university semester examination paper...`}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs sm:text-sm text-slate-900 leading-relaxed focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 shadow-2xs font-mono"
                />
              </div>

              {/* Submit Evaluation Button */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-slate-400">
                  Evaluated using Anna University / Autonomous semester grading rubric standards.
                </p>
                <button
                  type="button"
                  onClick={handleEvaluateSubjective}
                  disabled={isEvaluating || !studentAnswerText.trim()}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/20 hover:bg-purple-700 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin text-purple-200" />
                      <span>AI Evaluating Your Answer...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Evaluate My Answer with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Evaluation Results Card */}
          {evaluationResult && (
            <div className="rounded-3xl border border-purple-200 bg-white p-6 sm:p-7 shadow-md animate-in fade-in-50 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 font-black text-lg">
                    {evaluationResult.score}/{evaluationResult.maxScore}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      AI Exam Evaluation Scorecard
                    </h3>
                    <p className="text-xs text-slate-500">
                      Score:{" "}
                      <span className="font-bold text-purple-700">
                        {Math.round((evaluationResult.score / evaluationResult.maxScore) * 100)}%
                      </span>{" "}
                      for a {evaluationResult.maxScore}-mark question
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-xl px-3 py-1 text-xs font-bold ${
                      evaluationResult.score >= evaluationResult.maxScore * 0.75
                        ? "bg-emerald-100 text-emerald-800"
                        : evaluationResult.score >= evaluationResult.maxScore * 0.5
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {evaluationResult.score >= evaluationResult.maxScore * 0.75
                      ? "Excellent Performance"
                      : evaluationResult.score >= evaluationResult.maxScore * 0.5
                      ? "Good Attempt - Revise Key Gaps"
                      : "Needs Conceptual Revision"}
                  </span>
                </div>
              </div>

              {/* Feedback Body */}
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Evaluator Feedback
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {evaluationResult.feedback}
                  </p>
                </div>

                {/* Grid of Covered vs Missing Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Points Covered */}
                  <div className="rounded-2xl bg-emerald-50/60 p-4 border border-emerald-200">
                    <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2.5">
                      <Check className="h-4 w-4 text-emerald-700" />
                      <span>Key Points Well Covered</span>
                    </h5>
                    {evaluationResult.pointsCovered.length > 0 ? (
                      <ul className="space-y-1.5 text-xs text-emerald-950">
                        {evaluationResult.pointsCovered.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-emerald-800 italic">No key points detected.</p>
                    )}
                  </div>

                  {/* Missing Points / Areas to Improve */}
                  <div className="rounded-2xl bg-amber-50/60 p-4 border border-amber-200">
                    <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2.5">
                      <AlertTriangle className="h-4 w-4 text-amber-700" />
                      <span>Areas for Improvement / Missing Points</span>
                    </h5>
                    {evaluationResult.missingPoints.length > 0 ? (
                      <ul className="space-y-1.5 text-xs text-amber-950">
                        {evaluationResult.missingPoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-emerald-800">Great job! All core points covered.</p>
                    )}
                  </div>
                </div>

                {/* Model Exemplary Answer */}
                {evaluationResult.modelAnswer && (
                  <div className="rounded-2xl border border-purple-200 bg-purple-50/30 p-4">
                    <h5 className="text-xs font-bold text-purple-900 flex items-center gap-1.5 mb-2">
                      <BookOpen className="h-4 w-4 text-purple-700" />
                      <span>Exemplary Model Answer for {evaluationResult.maxScore} Marks</span>
                    </h5>
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-serif bg-white p-4 rounded-xl border border-purple-100 shadow-2xs">
                      {evaluationResult.modelAnswer}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MCQ OBJECTIVE PRACTICE TEST MODE                                       */}
      {/* ========================================================================= */}
      {testMode === "MCQ" && (
        <>
          {/* State: SELECT FILE */}
          {testState === "SELECT" && (
            <div>
              {files.length === 0 ? (
                <div className="rounded-3xl border border-slate-200/90 bg-white p-8 text-center shadow-xs max-w-xl mx-auto my-8">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
                    <FileText className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No Study Materials Uploaded Yet</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    To take an AI practice test, upload a semester question paper or question bank first, or load our pre-compiled academic materials.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    {onNavigateToUpload && (
                      <button
                        onClick={onNavigateToUpload}
                        className="w-full sm:w-auto rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                      >
                        Upload Study Material
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const initial = appStore.getFiles();
                        if (initial.length > 0) {
                          setSelectedFile(initial[0]);
                        }
                      }}
                      className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Reload Default Study Banks
                    </button>
                  </div>
                </div>
              ) : (
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
                                  isSelected
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-blue-600 border border-slate-200"
                                }`}
                              >
                                <FileText className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                                  {file.fileName}
                                </h4>
                                <span className="text-[11px] font-semibold text-blue-700">
                                  {file.subject}
                                </span>
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
                      className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <span>Begin 10-Question Practice Test</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* State: LOADING */}
          {testState === "LOADING" && (
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
          )}

          {/* State: RUNNING */}
          {testState === "RUNNING" && questions.length > 0 && (
            <div className="space-y-6">
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
                  <span className="text-xs font-semibold text-slate-500">
                    Answered: {Object.keys(userAnswers).length} / {questions.length}
                  </span>

                  {/* Countdown Timer */}
                  <div
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold ${
                      timeLeft < 60
                        ? "bg-rose-50 text-rose-700 animate-pulse border border-rose-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
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
                    {questions[currentIdx].questionText}
                  </h2>
                </div>

                {/* Options Grid */}
                <div className="space-y-3">
                  {questions[currentIdx].options.map((opt) => {
                    const isSelected = userAnswers[questions[currentIdx].id] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectOption(opt.key)}
                        className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
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

                  {currentIdx === questions.length - 1 ? (
                    <button
                      onClick={handleFinishTest}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Submit & Calculate Score</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentIdx((prev) => Math.min(prev + 1, questions.length - 1))}
                      className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* State: FINISHED (Score & Review with Explanations) */}
          {testState === "FINISHED" && latestResult && (
            <div className="space-y-6">
              {/* Score Summary Banner */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 mb-4">
                  <Award className="h-8 w-8" />
                </div>

                <h2 className="text-2xl font-black text-slate-900">
                  Practice Test Completed!
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {latestResult.fileName} • {latestResult.subject}
                </p>

                {/* Big Score Counter */}
                <div className="mt-6 inline-flex items-baseline gap-2 rounded-2xl bg-blue-50 px-6 py-3 border border-blue-200">
                  <span className="text-4xl font-black text-blue-700">
                    {latestResult.score}
                  </span>
                  <span className="text-lg font-bold text-slate-400">/ {latestResult.total}</span>
                  <span className="ml-2 rounded-md bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                    {latestResult.percentage}% Score
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600 max-w-md mx-auto">
                  {latestResult.percentage >= 80
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
                  Detailed Review & Explanations ({latestResult.details.length} Questions)
                </h3>

                {latestResult.details.map((item, idx) => (
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
          )}
        </>
      )}
    </div>
  );
};
