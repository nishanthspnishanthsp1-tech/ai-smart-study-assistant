// Web Speech API / SpeechSynthesis service for student voice assistant

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public speak(
    text: string,
    lang: "en" | "ta" | "hi" = "en",
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    },
    rate: number = 1.0
  ) {
    if (!this.synth) {
      console.warn("Speech synthesis is not supported in this browser environment.");
      callbacks?.onError?.("Speech synthesis not supported");
      return;
    }

    // Stop previous utterance
    this.stop();

    // Clean markdown headings, bullets, asterisks for natural reading
    const cleanText = text
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/```[\s\S]*?```/g, "Code snippet omitted for speech.")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/[•\-\+]/g, ", ")
      .replace(/Quick Revision:/gi, "Quick Revision summary:")
      .replace(/விரைவு திருப்புதல்/g, "முக்கிய குறிப்புகள்")
      .replace(/त्वरित दोहराव/g, "महत्वपूर्ण बिंदु")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance = utterance;

    const allVoices = this.getVoices();
    if (lang === "ta") {
      utterance.lang = "ta-IN";
      const tamilVoice = allVoices.find((v) => v.lang.includes("ta") || v.lang.includes("TAM"));
      if (tamilVoice) {
        utterance.voice = tamilVoice;
      }
    } else if (lang === "hi") {
      utterance.lang = "hi-IN";
      const hindiVoice = allVoices.find(
        (v) => v.lang.includes("hi") || v.lang.includes("HIN") || v.name.toLowerCase().includes("hindi")
      );
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
    } else {
      utterance.lang = "en-US";
      const englishVoice =
        allVoices.find((v) => v.lang === "en-IN") ||
        allVoices.find((v) => v.lang.startsWith("en") && v.name.includes("Natural")) ||
        allVoices.find((v) => v.lang.startsWith("en"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }

    utterance.rate = Math.max(0.5, Math.min(rate, 2.0));
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      callbacks?.onError?.(e);
    };

    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!this.synth && this.synth.speaking;
  }

  public isPaused(): boolean {
    return !!this.synth && this.synth.paused;
  }
}

export const speechService = new SpeechService();
