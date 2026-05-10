import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-4 text-center relative z-10">
      <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
        <span>🌸</span>
        <span className="font-medium">Bloom Studio</span>
        <span>🌼</span>
        <span>Voice-Activated NFT Art on Solana</span>
        <span>🌷</span>
      </div>
      <p className="text-xs text-muted-foreground/60 mt-2">
        Running on Devnet — no real funds required
      </p>
    </footer>
  );
};

export default Footer;
