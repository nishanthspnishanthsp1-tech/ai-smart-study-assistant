import React, { useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Volume2,
  Square,
  Pause,
  Play,
  Languages,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
  Award,
} from "lucide-react";
import { QuestionItem } from "../../types";
import { speechService } from "../../services/speechService";

interface QuestionCardProps {
  question: QuestionItem;
  onToggleSave: (questionId: string) => void;
  index?: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onToggleSave,
  index,
}) => {
  const [lang, setLang] = useState<"en" | "ta">("en");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isHighPriority = question.importance === "HIGH";
  const isMedPriority = question.importance === "MEDIUM";

  const handlePlayVoice = () => {
    if (isPaused) {
      speechService.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    const textToRead = lang === "en" ? question.answerEnglish : question.answerTamil;
    setIsPlaying(true);
    setIsPaused(false);

    speechService.speak(
      `Question: ${question.questionText}. Answer: ${textToRead}`,
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
      }
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

  // Helper to format markdown headings & bold text simply without bulky parser
  const renderFormattedAnswer = (content: string) => {
    const lines = content.split("\n");
    return (
      <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith("### ")) {
            return (
              <h4 key={idx} className="font-bold text-slate-900 text-sm sm:text-base mt-3 mb-1 flex items-center gap-1.5 text-blue-900">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                {line.replace("### ", "")}
              </h4>
            );
          }
          if (line.startsWith("## ")) {
            return (
              <h3 key={idx} className="font-bold text-slate-900 text-base sm:text-lg mt-4 mb-2 text-blue-950">
                {line.replace("## ", "")}
              </h3>
            );
          }
          if (line.startsWith("- ") || line.startsWith("• ")) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-blue-500 font-bold">•</span>
                <p
                  className="flex-1"
                  dangerouslySetInnerHTML={{
                    __html: line
                      .replace(/^[-•]\s*/, "")
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>'),
                  }}
                />
              </div>
            );
          }
          if (line.trim().length === 0) {
            return <div key={idx} className="h-1" />;
          }
          return (
            <p
              key={idx}
              dangerouslySetInnerHTML={{
                __html: line.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="font-bold text-slate-900">$1</strong>'
                ),
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="group rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
      {/* Top Header: Index, Badges, Mark Pill & Save Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {index !== undefined && (
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
              Q{index + 1}
            </span>
          )}

          {/* Marks Badge */}
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
            <Award className="h-3 w-3" />
            {question.marks} {question.marks === 1 ? "Mark" : "Marks"}
          </span>

          {/* Subject tag */}
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {question.subject}
          </span>

          {/* Priority / Importance Badge */}
          {isHighPriority && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
              ⭐ IMPORTANT • HIGH PRIORITY
            </span>
          )}
          {isMedPriority && (
            <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700 border border-sky-200">
              MEDIUM PRIORITY
            </span>
          )}
          {!isHighPriority && !isMedPriority && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500 border border-slate-200">
              LOW PRIORITY
            </span>
          )}

          {/* Duplicate warning flag if detected */}
          {question.duplicateWarning && (
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 border border-rose-200">
              <AlertCircle className="h-3 w-3" />
              Similar question detected
            </span>
          )}
        </div>

        {/* Action Controls: Language Toggle, Voice & Save */}
        <div className="flex items-center gap-1.5">
          {/* Language Selector */}
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200/60">
            <button
              onClick={() => setLang("en")}
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors ${
                lang === "en" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("ta")}
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors ${
                lang === "ta" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              தமிழ்
            </button>
          </div>

          {/* Audio Speech Controls */}
          <div className="flex items-center rounded-lg bg-blue-50 px-1.5 py-0.5 border border-blue-100">
            {!isPlaying ? (
              <button
                onClick={handlePlayVoice}
                className="flex items-center gap-1 rounded p-1 text-xs font-medium text-blue-700 hover:text-blue-900"
                title={`Listen in ${lang === "en" ? "English" : "Tamil"}`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Listen</span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                {!isPaused ? (
                  <button
                    onClick={handlePauseVoice}
                    className="p-1 text-blue-700 hover:text-blue-900"
                    title="Pause voice"
                  >
                    <Pause className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handlePlayVoice}
                    className="p-1 text-emerald-600 hover:text-emerald-800"
                    title="Resume voice"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={handleStopVoice}
                  className="p-1 text-rose-600 hover:text-rose-800"
                  title="Stop voice"
                >
                  <Square className="h-3 w-3 fill-rose-600" />
                </button>
              </div>
            )}
          </div>

          {/* Save Question Toggle */}
          <button
            onClick={() => onToggleSave(question.id)}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              question.isSaved
                ? "bg-amber-500 text-white shadow-xs hover:bg-amber-600"
                : "border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50/50"
            }`}
          >
            {question.isSaved ? (
              <>
                <BookmarkCheck className="h-3.5 w-3.5" />
                <span>★ Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" />
                <span>☆ Save Question</span>
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

      {/* AI Importance Prediction Insight Card */}
      {question.importanceReason && (
        <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-blue-50/70 p-2.5 text-xs text-blue-900 border border-blue-100">
          <Sparkles className="h-4 w-4 mt-0.5 text-blue-600 shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-blue-900">AI Importance Prediction: </span>
            <span className="text-slate-700">{question.importanceReason}</span>
            <p className="text-[10px] text-slate-400 mt-0.5 italic">
              Note: AI study analysis estimate; does not guarantee exam appearance.
            </p>
          </div>
        </div>
      )}

      {/* Generated Answer Body */}
      <div className="mt-4 rounded-xl bg-slate-50/80 p-3.5 sm:p-4 border border-slate-100">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
            <span>
              {lang === "en" ? "Answer according to " : "பதில்கள் (தமிழ்) - "}
              {question.marks} Marks
            </span>
          </div>
          <button
            onClick={() => setLang(lang === "en" ? "ta" : "en")}
            className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          >
            <Languages className="h-3 w-3" />
            {lang === "en" ? "Translate to Tamil" : "Translate to English"}
          </button>
        </div>

        {renderFormattedAnswer(lang === "en" ? question.answerEnglish : question.answerTamil)}

        {/* Quick Revision Section */}
        {question.quickRevision && question.quickRevision.length > 0 && (
          <div className="mt-4 rounded-xl bg-amber-50/80 p-3 border border-amber-200/60">
            <h5 className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-700" />
              Quick Revision
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
