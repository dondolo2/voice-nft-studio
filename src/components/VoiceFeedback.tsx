import React from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VoiceFeedbackProps {
  isMuted: boolean;
  onToggle: () => void;
}

const VoiceFeedback: React.FC<VoiceFeedbackProps> = ({ isMuted, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bloom-glass-sm flex items-center justify-center shadow-bloom hover:shadow-bloom-lg transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label={isMuted ? "Unmute voice feedback" : "Mute voice feedback"}
      title={isMuted ? "Unmute voice feedback" : "Mute voice feedback"}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-muted-foreground" />
      ) : (
        <Volume2 className="w-5 h-5 text-bloom-coral" />
      )}
    </button>
  );
};

export default VoiceFeedback;
