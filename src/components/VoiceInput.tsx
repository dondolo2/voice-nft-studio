import React from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceInputProps {
  isRecording: boolean;
  isTranscribing: boolean;
  transcript: string;
  onToggleRecord: () => void;
  error: string | null;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  isRecording,
  isTranscribing,
  transcript,
  onToggleRecord,
  error,
}) => {
  return (
    <div className="bloom-glass p-6 sm:p-8 flex flex-col items-center gap-6 animate-fade-in-up">
      <h2 className="text-lg sm:text-xl font-bold bloom-gradient-text text-center">
        🎤 Speak Your Art Into Existence
      </h2>

      <p className="text-sm text-muted-foreground text-center max-w-md">
        Tap the microphone and describe the art you want to create. Your voice becomes the prompt.
      </p>

      {/* Mic Button */}
      <button
        onClick={onToggleRecord}
        disabled={isTranscribing}
        className={`
          relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center
          transition-all duration-300 cursor-pointer active:scale-[0.92]
          ${
            isRecording
              ? "bg-gradient-to-br from-bloom-coral to-bloom-pink mic-recording"
              : "bg-gradient-to-br from-bloom-apricot to-bloom-coral hover:shadow-bloom-glow"
          }
          ${isTranscribing ? "opacity-60 cursor-not-allowed" : ""}
          shadow-bloom-lg
        `}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isTranscribing ? (
          <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
        ) : isRecording ? (
          <MicOff className="w-10 h-10 text-primary-foreground" />
        ) : (
          <Mic className="w-10 h-10 text-primary-foreground" />
        )}

        {isRecording && (
          <span className="absolute inset-0 rounded-full border-4 border-bloom-pink/40 animate-ping" />
        )}
      </button>

      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {isTranscribing
          ? "Transcribing..."
          : isRecording
          ? "Listening — tap to stop"
          : "Tap to speak"}
      </span>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm rounded-xl px-4 py-2 text-center max-w-sm">
          {error}
        </div>
      )}

      {transcript && (
        <div className="w-full bloom-glass-sm p-4 sm:p-5 animate-fade-in-up">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Art Prompt
          </p>
          <p className="text-base sm:text-lg font-semibold text-bloom-terracotta leading-relaxed">
            "{transcript}"
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
