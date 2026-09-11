import React, { useState } from "react";
import {
  Sparkles,
  UploadCloud,
  FileText,
  AlertTriangle,
  Loader2,
  Award,
  BookOpen,
  Filter,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { PredictedQuestion } from "../../types";
import { predictSyllabusQuestions } from "../../services/geminiService";

export const QuestionPredictionPage: React.FC = () => {
  const [syllabusText, setSyllabusText] = useState("");
  const [requestedCount, setRequestedCount] = useState<number>(15);
  const [subject, setSubject] = useState("Artificial Intelligence & Data Science");
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState<PredictedQuestion[]>([]);
  const [filterUnit, setFilterUnit] = useState<string>("ALL");

  const handlePredict = async () => {
    setIsPredicting(true);
    try {
      const res = await predictSyllabusQuestions(syllabusText, requestedCount, subject);
      if (res.success && res.predictions) {
        setPredictions(res.predictions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPredicting(false);
    }
  };

  const loadSampleSyllabus = () => {
    setSyllabusText(`Anna University Regulation 2021
Department of AI&DS - Semester IV
Course Code: CS3491 - Artificial Intelligence and Machine Learning
UNIT I: PROBLEM SOLVING AND SEARCHING TECHNIQUES
Introduction to AI, Agents and Environments, Problem formulation, Uninformed Search Strategies (BFS, DFS, Uniform Cost), Heuristic Search Strategies (Greedy Best-First, A* Search, AO*), Admissibility and Monotonicity, Adversarial Search (Minimax, Alpha-Beta Pruning).

UNIT II: KNOWLEDGE REPRESENTATION AND REASONING
Logical Agents, Propositional Logic, First-Order Logic, Inference in First-Order Logic, Forward and Backward Chaining, Unification, Resolution, Ontological Engineering, Categories and Objects.

UNIT III: UNCERTAINTY AND PROBABILISTIC REASONING
Acting under Uncertainty, Conditional Probability, Bayes Rule, Bayesian Networks, Exact and Approximate Inference, Hidden Markov Models, Markov Decision Processes.

UNIT IV: MACHINE LEARNING & SUPERVISED LEARNING
Forms of Learning, Supervised Learning, Linear and Logistic Regression, Decision Trees, Support Vector Machines (SVM), Multilayer Perceptron, Backpropagation Algorithm.

UNIT V: REINFORCEMENT LEARNING & APPLICATIONS
Passive and Active Reinforcement Learning, Q-Learning, Natural Language Processing, Computer Vision Object Detection, Ethical AI and Future of Artificial Intelligence.`);
  };

  const filteredPredictions = predictions.filter((p) => {
    if (filterUnit === "ALL") return true;
    return p.unit.toLowerCase().includes(filterUnit.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-500" />
          AI Semester Question Prediction
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Predict high-weightage questions from college syllabus documents and university examination patterns.
        </p>
      </div>

      {/* Input Configuration Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Subject dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Target Course / Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
            >
              <option value="Artificial Intelligence & Machine Learning">
                CS3491 - Artificial Intelligence & Machine Learning
              </option>
              <option value="Operating Systems">CS3452 - Operating Systems</option>
              <option value="Database Management Systems">CS3492 - DBMS</option>
              <option value="Computer Networks">CS3591 - Computer Networks</option>
              <option value="Design and Analysis of Algorithms">AL3301 - DAA</option>
            </select>
          </div>

          {/* Number of questions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              How many important questions do you want?
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={5}
                max={30}
                value={requestedCount}
                onChange={(e) => setRequestedCount(parseInt(e.target.value) || 15)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
              <span className="text-xs text-slate-400 font-medium shrink-0">Questions (5–30)</span>
            </div>
          </div>
        </div>

        {/* Syllabus Textbox */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Paste Syllabus Content or Unit Topics:
            </label>
            <button
              onClick={loadSampleSyllabus}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline"
            >
              Load AI&DS Sem IV Syllabus Sample
            </button>
          </div>
          <textarea
            rows={5}
            value={syllabusText}
            onChange={(e) => setSyllabusText(e.target.value)}
            placeholder="Paste syllabus text here, or click 'Load AI&DS Sem IV Syllabus Sample' above..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            AI analyzes unit syllabus modules, bloom's taxonomy levels, and previous question patterns.
          </span>

          <button
            onClick={handlePredict}
            disabled={isPredicting || !syllabusText.trim()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:opacity-95 transition-all disabled:opacity-50"
          >
            {isPredicting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing & Predicting...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Predict {requestedCount} Important Questions</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-amber-900 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 mt-0.5 text-amber-600 shrink-0" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold">Academic Advisory Disclaimer: </span>
          <span>
            AI question prediction is an analytical estimate based on university syllabus weightage and past question bank patterns. It serves as a study guidance aid and does not guarantee that these exact questions will appear in the semester examination. Students are advised to cover all prescribed syllabus topics thoroughly.
          </span>
        </div>
      </div>

      {/* Predicted Questions Results */}
      {predictions.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                Predicted Questions List ({filteredPredictions.length} Questions)
              </h3>
              <p className="text-xs text-slate-500">
                Sorted by Unit and probability of appearance in Part B and Part C.
              </p>
            </div>

            {/* Unit Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200/60">
                {["ALL", "Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"].map((u) => (
                  <button
                    key={u}
                    onClick={() => setFilterUnit(u)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      filterUnit === u
                        ? "bg-white text-blue-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredPredictions.map((pred, idx) => (
              <div
                key={pred.id || idx}
                className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-blue-300 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">
                      {idx + 1}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                      {pred.unit}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Topic: <strong>{pred.topic}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
                      <Award className="h-3 w-3" />
                      Expected: {pred.expectedMarks} Marks
                    </span>

                    {pred.importance === "HIGH" && (
                      <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                        ⭐ HIGH IMPORTANCE
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {pred.questionText}
                </h4>

                <div className="mt-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-100">
                  <span className="font-bold text-slate-900">Prediction Rationale: </span>
                  <span>{pred.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
