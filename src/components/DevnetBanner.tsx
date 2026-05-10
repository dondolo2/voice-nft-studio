import React from "react";

const DevnetBanner: React.FC = () => {
  return (
    <div className="w-full py-2.5 px-4 text-center text-sm font-semibold tracking-wide bg-bloom-apricot/30 border-b border-bloom-apricot/20">
      <span className="text-bloom-terracotta">
        🌼 Devnet only – free SOL via{" "}
        <a
          href="https://faucet.solana.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-bloom-coral transition-colors"
        >
          faucet
        </a>{" "}
        🌸
      </span>
    </div>
  );
};

export default DevnetBanner;
