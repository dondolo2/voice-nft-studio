import React from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import type { MintedNFT } from "@/lib/nftStorage";

interface GalleryProps {
  nfts: MintedNFT[];
  onClear: () => void;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const Gallery: React.FC<GalleryProps> = ({ nfts, onClear }) => {
  if (nfts.length === 0) return null;

  return (
    <div className="bloom-glass p-6 sm:p-8 flex flex-col gap-5 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold bloom-gradient-text">
          🌻 Your NFT Gallery
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-destructive/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            className="bloom-glass-sm overflow-hidden group"
          >
            <div className="relative aspect-square overflow-hidden rounded-t-[2rem]">
              <img
                src={nft.imageUrl}
                alt={nft.prompt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-3 sm:p-4">
              <p className="text-sm font-semibold text-bloom-terracotta line-clamp-2 mb-2">
                "{nft.prompt}"
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                {formatTime(nft.timestamp)}
              </p>
              <a
                href={`https://explorer.solana.com/tx/${nft.txSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-bloom-coral hover:text-bloom-pink transition-colors"
              >
                View TX
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
