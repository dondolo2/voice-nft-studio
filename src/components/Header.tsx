import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSolBalance } from "@/hooks/useSolBalance";

const Header: React.FC = () => {
  const { publicKey } = useWallet();
  const { balance } = useSolBalance();
  const navigate = useNavigate();
  const location = useLocation();

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : null;

  const isOnGallery = location.pathname === "/gallery";

  return (
    <header className="w-full px-4 sm:px-8 py-4 flex items-center justify-between relative z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")}>
          <span className="text-2xl sm:text-3xl">🌸</span>
          <div>
            <h1 className="text-lg sm:text-xl font-bold bloom-gradient-text leading-tight">
              Bloom Studio
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Voice-Activated NFT Art
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-2 sm:ml-4">
          <button
            onClick={() => navigate("/")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              !isOnGallery
                ? "bloom-glass-sm"
                : "text-muted-foreground hover:bg-bloom-peach/20"
            }`}
          >
            Create
          </button>
          <button
            onClick={() => navigate("/gallery")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              isOnGallery
                ? "bloom-glass-sm"
                : "text-muted-foreground hover:bg-bloom-peach/20"
            }`}
          >
            🌻 Gallery
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {publicKey && (
          <div className="hidden sm:flex items-center gap-2 bloom-glass-sm px-4 py-2 text-sm">
            <span className="text-bloom-terracotta-mid font-semibold bloom-mono">
              {balance !== null ? `${balance.toFixed(3)} SOL` : "..."}
            </span>
            <span className="w-px h-4 bg-border" />
            <span className="text-muted-foreground font-medium">
              {shortAddress}
            </span>
          </div>
        )}
        <WalletMultiButton />
      </div>
    </header>
  );
};

export default Header;
