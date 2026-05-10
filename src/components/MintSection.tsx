import React from "react";
import { Loader2, ExternalLink, CheckCircle2 } from "lucide-react";

interface MintSectionProps {
  imageUrl: string | null;
  isMinting: boolean;
  txSignature: string | null;
  mintAddress?: string | null;
  onMint: () => void;
  walletConnected: boolean;
}

const MINT_FEE = "~0.002 SOL";

const MintSection: React.FC<MintSectionProps> = ({
  imageUrl,
  isMinting,
  txSignature,
  mintAddress,
  onMint,
  walletConnected,
}) => {
  if (!imageUrl) return null;

  return (
    <div className="bloom-glass p-6 sm:p-8 flex flex-col items-center gap-5 animate-fade-in-up">
      <h2 className="text-lg sm:text-xl font-bold bloom-gradient-text text-center">
        🌷 Mint as NFT on Solana
      </h2>

      {!txSignature ? (
        <>
          <div className="bloom-glass-sm px-5 py-3 flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-medium">
              Estimated fee:
            </span>
            <span className="bloom-mono text-bloom-terracotta-mid font-bold text-lg">
              {MINT_FEE}
            </span>
          </div>

          <button
            onClick={onMint}
            disabled={!walletConnected || isMinting}
            className={`
              bloom-btn bloom-btn-primary px-8 py-3 text-base font-bold
              flex items-center gap-2.5
              ${!walletConnected || isMinting ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {isMinting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Minting on Solana...
              </>
            ) : (
              <>
                <span className="text-lg">🌸</span>
                Mint this as NFT on Solana
              </>
            )}
          </button>

          {!walletConnected && (
            <p className="text-xs text-muted-foreground text-center">
              Connect your Phantom or Backpack wallet first to mint
            </p>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-bloom-apricot to-bloom-coral flex items-center justify-center shadow-bloom-glow">
            <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
          </div>

          <div className="text-center">
            <p className="text-lg font-bold text-bloom-terracotta">
              NFT minted!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              View in your wallet
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="bloom-btn flex items-center gap-2 text-sm"
            >
              View Transaction
              <ExternalLink className="w-4 h-4" />
            </a>
            {mintAddress && (
              <a
                href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="bloom-btn flex items-center gap-2 text-sm"
              >
                View NFT
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="bloom-glass-sm px-4 py-3 max-w-full w-full">
            <p className="text-xs text-muted-foreground mb-1">
              Transaction signature:
            </p>
            <p className="bloom-mono text-xs text-bloom-terracotta-mid break-all">
              {txSignature}
            </p>
            {mintAddress && (
              <>
                <p className="text-xs text-muted-foreground mb-1 mt-2">
                  Mint address:
                </p>
                <p className="bloom-mono text-xs text-bloom-terracotta-mid break-all">
                  {mintAddress}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MintSection;
