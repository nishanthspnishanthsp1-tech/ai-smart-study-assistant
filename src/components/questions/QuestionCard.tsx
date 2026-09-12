import React, { useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Volume2,
  Square,
  Pause,
  Play,
  Sparkles,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Repeat,
  Layers,
  Loader2,
  CheckSquare,
} from "lucide-react";
import { QuestionItem, LanguageCode } from "../../types";
import { speechService } from "../../services/speechService";
import { generateMarksAnswer } from "../../services/geminiService";
import { appStore } from "../../services/store";

interface QuestionCardProps {
  question: QuestionItem;
  onToggleSave: (questionId: string) => void;
  onToggleComplete?: (questionId: string) => void;
  index?: number;
}

const AVAILABLE_MARKS = [2, 3, 5, 10, 13];
const SPEECH_SPEEDS = [0.75, 1.0, 1.25, 1.5];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onToggleSave,
  onToggleComplete,
  index,
}) => {
  const [selectedMarks, setSelectedMarks] = useState<number>(question.marks || 5);
  const [lang, setLang] = useState<LanguageCode>("en");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const isHighPriority = question.importance === "HIGH";
  const isMedPriority = question.importance === "MEDIUM";

  // Derive current answer based on selected marks and language
  const getCurrentAnswer = (): string => {
    // 1. Check custom cached answers
    const markEntry = question.answersByMarks?.[selectedMarks];
    if (markEntry && markEntry[lang]) {
      return markEntry[lang]!;
    }

    // 2. If viewing original question marks
    if (selectedMarks === question.marks) {
      if (lang === "en" && question.answerEnglish) return question.answerEnglish;
      if (lang === "ta" && question.answerTamil) return question.answerTamil;
      if (lang === "hi" && question.answerHindi) return question.answerHindi;
    }

    // 3. Fallback to default language
    if (lang === "ta") {
      return question.answerTamil || question.answerEnglish;
    }
    if (lang === "hi") {
      return question.answerHindi || question.answerEnglish;
    }
    return question.answerEnglish;
  };

  const currentAnswer = getCurrentAnswer();

  const handleMarksChange = async (marks: number) => {
    setSelectedMarks(marks);
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
      setIsPaused(false);
    }

    // Check if we need to fetch/generate for this mark + language
    const existing = question.answersByMarks?.[marks]?.[lang];
    const isOriginal =
      marks === question.marks &&
      (lang === "en" ? question.answerEnglish : lang === "ta" ? question.answerTamil : question.answerHindi);

    if (!existing && !isOriginal) {
      setIsGenerating(true);
      try {
        const newAnswer = await generateMarksAnswer(
          question.questionText,
          marks,
          lang,
          question.subject,
          question.topic
        );
        if (newAnswer) {
          appStore.updateQuestionCustomAnswer(question.id, marks, lang, newAnswer);
        }
      } catch (err) {
        console.error("Failed to generate mark answer:", err);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleSwitchLang = async (newLang: LanguageCode) => {
    if (newLang === lang) return;
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
      setIsPaused(false);
    }
    setLang(newLang);

    // Check if new language needs generation
    const existing = question.answersByMarks?.[selectedMarks]?.[newLang];
    const isOriginal =
      selectedMarks === question.marks &&
      (newLang === "en" ? question.answerEnglish : newLang === "ta" ? question.answerTamil : question.answerHindi);

    if (!existing && !isOriginal) {
      setIsGenerating(true);
      try {
        const newAnswer = await generateMarksAnswer(
          question.questionText,
          selectedMarks,
          newLang,
          question.subject,
          question.topic
        );
        if (newAnswer) {
          appStore.updateQuestionCustomAnswer(question.id, selectedMarks, newLang, newAnswer);
        }
      } catch (err) {
        console.error("Failed to translate/generate answer:", err);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handlePlayVoice = () => {
    if (isPaused) {
      speechService.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);

    speechService.speak(
      `Question: ${question.questionText}. Answer: ${currentAnswer}`,
      lang,
      {
        onStart: () => {
          setIsPlaying(true);
          setIsPaused(false);
        },
        onEnd: () => {
          setIsPlaying(false);
          setIsPaused(false);
        },
        onError: () => {
          setIsPlaying(false);
          setIsPaused(false);
        },
      },
      speechRate
    );
  };

  const handlePauseVoice = () => {
    speechService.pause();
    setIsPaused(true);
  };

  const handleStopVoice = () => {
    speechService.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Helper to format markdown headings, bold text, inline code & code blocks
  const renderFormattedAnswer = (content: string) => {
    const rawLines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    rawLines.forEach((line, idx) => {
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${idx}`}
              className="bg-slate-900 text-emerald-300 rounded-xl p-3 my-2 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800"
            >
              <code>{codeBuffer.join("\n")}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith("### ")) {
        elements.push(
          <h4
            key={idx}
            className="text-xs font-bold text-blue-900 mt-3.5 mb-1.5 flex items-center gap-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 inline-block" />
            {line.replace("### ", "")}
          </h4>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h3
            key={idx}
            className="text-sm font-bold text-slate-900 mt-4 mb-2 pb-1 border-b border-slate-200"
          >
            {line.replace("## ", "")}
          </h3>
        );
      } else if (line.startsWith("- ") || line.startsWith("• ")) {
        elements.push(
          <li
            key={idx}
            className="ml-4 list-disc text-xs text-slate-700 my-1 leading-relaxed"
          >
            {formatInlineText(line.replace(/^[-•]\s*/, ""))}
          </li>
        );
      } else if (/^\d+\.\s/.test(line)) {
        elements.push(
          <div key={idx} className="ml-2 text-xs text-slate-700 my-1 font-medium leading-relaxed">
            {formatInlineText(line)}
          </div>
        );
      } else if (line.trim().length > 0) {
        elements.push(
          <p
            key={idx}
            className="text-xs text-slate-700 my-1.5 leading-relaxed"
          >
            {formatInlineText(line)}
          </p>
        );
      }
    });

    return elements;
  };

  const formatInlineText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="rounded bg-slate-200 px-1 py-0.5 font-mono text-[11px] text-blue-900"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-slate-300">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {index !== undefined && (
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
              Q{index + 1}
            </span>
          )}

          {question.section && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
              {question.section}
            </span>
          )}

          {/* Current Marks Badge */}
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-100">
            {selectedMarks} Marks
          </span>

          {/* Subject Badge */}
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {question.subject}
          </span>

          {/* Importance Flag */}
          {isHighPriority && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
              <Sparkles className="h-3 w-3" />
              HIGH PRIORITY
            </span>
          )}
          {isMedPriority && (
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              MEDIUM PRIORITY
            </span>
          )}

          {/* Repeated Question Badge */}
          {(question.isRepeated || question.duplicateWarning) && (
            <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
              <Repeat className="h-3 w-3" />
              Repeated Question ({question.frequencyCount || 2}x)
            </span>
          )}
        </div>

        {/* Action Controls: Language, TTS, Prepared Status & Save */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Selector: English, Tamil, Hindi */}
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200/70">
            <button
              onClick={() => handleSwitchLang("en")}
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                lang === "en" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleSwitchLang("ta")}
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                lang === "ta" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => handleSwitchLang("hi")}
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                lang === "hi" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Text to Speech Player with Speed Controller */}
          <div className="flex items-center rounded-lg bg-blue-50 px-2 py-0.5 border border-blue-100 gap-1.5">
            {!isPlaying ? (
              <button
                onClick={handlePlayVoice}
                className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                title={`Listen in ${lang === "en" ? "English" : lang === "ta" ? "Tamil" : "Hindi"}`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Listen</span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                {!isPaused ? (
                  <button
                    onClick={handlePauseVoice}
                    className="p-1 text-blue-700 hover:text-blue-900 cursor-pointer"
                    title="Pause voice"
                  >
                    <Pause className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handlePlayVoice}
                    className="p-1 text-emerald-600 hover:text-emerald-800 cursor-pointer"
                    title="Resume voice"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={handleStopVoice}
                  className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                  title="Stop voice"
                >
                  <Square className="h-3 w-3 fill-rose-600" />
                </button>
              </div>
            )}

            {/* Speed selector */}
            <select
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="bg-transparent text-[10px] font-bold text-blue-800 border-none outline-none cursor-pointer pl-1"
              title="Speech Speed"
            >
              {SPEECH_SPEEDS.map((s) => (
                <option key={s} value={s}>
                  {s}x
                </option>
              ))}
            </select>
          </div>

          {/* Prepared / Revision status toggle */}
          {onToggleComplete && (
            <button
              onClick={() => onToggleComplete(question.id)}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-all cursor-pointer ${
                question.isCompleted
                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              title="Mark preparedness for revision"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span className="hidden md:inline">
                {question.isCompleted ? "Prepared ✓" : "Mark Prepared"}
              </span>
            </button>
          )}

          {/* Save Question Toggle */}
          <button
            onClick={() => onToggleSave(question.id)}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
              question.isSaved
                ? "bg-amber-500 text-white shadow-xs hover:bg-amber-600"
                : "border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50/50"
            }`}
          >
            {question.isSaved ? (
              <>
                <BookmarkCheck className="h-3.5 w-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="mt-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
          {question.questionText}
        </h3>
      </div>

      {/* Marks Selection Bar (2, 3, 5, 10, 13 Marks) */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80">
        <span className="text-[11px] font-bold text-slate-600 mr-1 flex items-center gap-1">
          <Layers className="h-3.5 w-3.5 text-blue-600" />
          Select Marks:
        </span>
        {AVAILABLE_MARKS.map((m) => (
          <button
            key={m}
            onClick={() => handleMarksChange(m)}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              selectedMarks === m
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {m} Marks
          </button>
        ))}

        <span className="text-[10px] text-slate-500 ml-auto hidden sm:inline">
          Answer automatically adapts depth to {selectedMarks} marks
        </span>
      </div>

      {/* Repeated Question Notification & Caution */}
      {(question.isRepeated || question.duplicateWarning) && (
        <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-purple-50 p-2.5 text-xs text-purple-900 border border-purple-200/80">
          <Repeat className="h-4 w-4 mt-0.5 text-purple-600 shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-purple-950">
              Detected Similarity / Repeated Question:{" "}
            </span>
            <span className="text-purple-800">
              {question.repeatedReason ||
                "Appeared in multiple semester examination question papers with identical or similar problem statements."}
            </span>
            <p className="text-[10px] text-purple-600/80 mt-0.5 italic">
              Notice: Detected similarity pattern based on uploaded papers; not a guaranteed exam prediction.
            </p>
          </div>
        </div>
      )}

      {/* AI Importance Suggestion Card */}
      {question.importanceReason && (
        <div className="mt-2 flex items-start gap-2 rounded-xl bg-blue-50/60 p-2.5 text-xs text-blue-900 border border-blue-100">
          <Sparkles className="h-4 w-4 mt-0.5 text-blue-600 shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-blue-900">AI Importance Suggestion: </span>
            <span className="text-slate-700">{question.importanceReason}</span>
            <p className="text-[10px] text-slate-400 mt-0.5 italic">
              Academic suggestion based on syllabus patterns; not a guaranteed exam prediction.
            </p>
          </div>
        </div>
      )}

      {/* AI Question Analysis Toggle & Breakdown */}
      <div className="mt-2.5">
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>
            {showAnalysis
              ? "Hide AI Question Analysis"
              : "View AI Question Analysis (Topic, Difficulty, Structure)"}
          </span>
          {showAnalysis ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {showAnalysis && (
          <div className="mt-2 rounded-xl bg-slate-50 p-3 text-xs border border-slate-200 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="font-bold text-slate-700">Question Intent: </span>
                <span className="text-slate-600">
                  {question.intent ||
                    `Assessing conceptual understanding and academic explanation of ${question.topic || question.subject}.`}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Difficulty Level: </span>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 ml-1">
                  {question.difficulty || (selectedMarks >= 10 ? "Hard" : selectedMarks >= 5 ? "Medium" : "Easy")}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Topic: </span>
                <span className="text-slate-600">{question.topic || question.subject}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Subtopic: </span>
                <span className="text-slate-600">
                  {question.subtopic || "Core Principles & Operational Architecture"}
                </span>
              </div>
            </div>

            {/* Expected Answer Structure */}
            <div>
              <span className="font-bold text-slate-700">Expected Exam Structure:</span>
              <ul className="mt-1 list-disc list-inside text-slate-600 space-y-0.5">
                {selectedMarks <= 2 && (
                  <>
                    <li>Direct definition with exact technical keywords</li>
                    <li>Core formula, equation, or 2 key bullet points</li>
                  </>
                )}
                {selectedMarks === 3 && (
                  <>
                    <li>Clear definition and concise scope</li>
                    <li>3 to 4 sequential points or characteristics</li>
                  </>
                )}
                {selectedMarks === 5 && (
                  <>
                    <li>Introduction and clear definition</li>
                    <li>4-5 bulleted operational points or architecture</li>
                    <li>Practical example and Quick Revision takeaway</li>
                  </>
                )}
                {selectedMarks >= 10 && (
                  <>
                    <li>Formal academic introduction and context</li>
                    <li>Architectural block diagram / state transition flow</li>
                    <li>In-depth subheadings with real-world application case</li>
                    <li>Advantages, limitations, and conclusion</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Generated Answer Body */}
      <div className="mt-3.5 rounded-xl bg-slate-50/80 p-3.5 sm:p-4 border border-slate-200/70">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-slate-800 font-bold">
              {lang === "en"
                ? `Exam-Ready Answer (${selectedMarks} Marks)`
                : lang === "ta"
                ? `பல்கலைக்கழக தேர்வு விடை (${selectedMarks} மதிப்பெண்கள்)`
                : `विश्वविद्यालय परीक्षा उत्तर (${selectedMarks} अंक)`}
            </span>
          </div>

          {isGenerating && (
            <div className="flex items-center gap-1.5 text-blue-600 font-medium text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Generating {selectedMarks}-mark answer...</span>
            </div>
          )}
        </div>

        {isGenerating ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p className="text-xs font-medium">
              Generating tailored {selectedMarks}-mark answer in{" "}
              {lang === "en" ? "English" : lang === "ta" ? "Tamil" : "Hindi"}...
            </p>
          </div>
        ) : (
          renderFormattedAnswer(currentAnswer)
        )}

        {/* Quick Revision Section */}
        {question.quickRevision && question.quickRevision.length > 0 && (
          <div className="mt-4 rounded-xl bg-amber-50/80 p-3 border border-amber-200/60">
            <h5 className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-700" />
              Quick Revision Takeaway
            </h5>
            <ul className="space-y-1 text-xs text-amber-950">
              {question.quickRevision.map((point, pIdx) => (
                <li key={pIdx} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
