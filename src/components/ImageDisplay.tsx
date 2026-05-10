import React from "react";
import { ImageIcon } from "lucide-react";

interface ImageDisplayProps {
  imageUrl: string | null;
  isGenerating: boolean;
  prompt: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUrl,
  isGenerating,
  prompt,
}) => {
  if (!isGenerating && !imageUrl) return null;

  return (
    <div className="bloom-glass p-6 sm:p-8 flex flex-col items-center gap-5 animate-fade-in-up">
      <h2 className="text-lg sm:text-xl font-bold bloom-gradient-text text-center">
        🎨 Generated Artwork
      </h2>

      {isGenerating ? (
        <div className="w-full aspect-square max-w-md rounded-[2rem] overflow-hidden bg-bloom-peach/30 flex flex-col items-center justify-center gap-4">
          <div className="bloom-spinner" />
          <p className="text-sm text-muted-foreground font-medium animate-pulse">
            Painting your vision...
          </p>
          <div className="flex gap-1.5">
            {["🌸", "🌼", "🌻", "🌷"].map((f, i) => (
              <span
                key={i}
                className="text-lg animate-float-medium"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      ) : imageUrl ? (
        <div className="w-full max-w-md">
          <div className="relative rounded-[2rem] overflow-hidden shadow-bloom-lg group">
            <img
              src={imageUrl}
              alt={prompt}
              className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bloom-terracotta/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-sm font-medium text-primary-foreground line-clamp-2">
                {prompt}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full aspect-square max-w-md rounded-[2rem] bg-bloom-peach/20 flex flex-col items-center justify-center gap-3">
          <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Your artwork will appear here</p>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
