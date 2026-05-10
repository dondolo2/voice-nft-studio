import React from "react";

const FLOWERS = [
  { emoji: "🌸", top: "5%", left: "8%", size: "2.5rem", delay: "0s", anim: "animate-float-slow" },
  { emoji: "🌼", top: "12%", left: "85%", size: "2rem", delay: "1s", anim: "animate-float-medium" },
  { emoji: "🌻", top: "30%", left: "3%", size: "1.8rem", delay: "2s", anim: "animate-float-fast" },
  { emoji: "🌷", top: "55%", left: "92%", size: "2.2rem", delay: "0.5s", anim: "animate-float-slow" },
  { emoji: "🌸", top: "75%", left: "10%", size: "2rem", delay: "1.5s", anim: "animate-float-medium" },
  { emoji: "🌼", top: "88%", left: "78%", size: "1.5rem", delay: "3s", anim: "animate-float-fast" },
  { emoji: "🌻", top: "42%", left: "95%", size: "1.6rem", delay: "2.5s", anim: "animate-float-slow" },
  { emoji: "🌷", top: "18%", left: "50%", size: "1.4rem", delay: "0.8s", anim: "animate-float-medium" },
  { emoji: "🌸", top: "65%", left: "65%", size: "1.3rem", delay: "1.2s", anim: "animate-float-fast" },
  { emoji: "🌼", top: "92%", left: "30%", size: "1.7rem", delay: "2.2s", anim: "animate-float-slow" },
];

const FloralBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {FLOWERS.map((f, i) => (
        <span
          key={i}
          className={`absolute select-none opacity-[0.15] ${f.anim}`}
          style={{
            top: f.top,
            left: f.left,
            fontSize: f.size,
            animationDelay: f.delay,
          }}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
};

export default FloralBackground;
