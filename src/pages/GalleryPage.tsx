import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { getMintedNFTs, clearMintedNFTs, type MintedNFT } from "@/lib/nftStorage";
import FloralBackground from "@/components/FloralBackground";
import DevnetBanner from "@/components/DevnetBanner";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

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

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nfts, setNfts] = useState<MintedNFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const loadedNFTs = getMintedNFTs();
    setNfts(loadedNFTs);
    setIsLoading(false);
  }, []);

  const handleClearGallery = () => {
    if (window.confirm("Are you sure you want to delete all NFTs from the gallery? This only removes them from local storage.")) {
      clearMintedNFTs();
      setNfts([]);
      toast({
        title: "Gallery cleared",
        description: "All saved NFTs have been removed from local storage.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <FloralBackground />
      <DevnetBanner />

      <div className="flex items-center justify-between w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 relative z-10">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bloom-glass hover:bg-bloom-peach/20 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Studio
        </button>
      </div>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6 sm:gap-8 relative z-10">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bloom-gradient-text mb-3">
            🌻 NFT Gallery
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            View all your minted artworks. Click any transaction to verify on-chain provenance.
          </p>
        </div>

        {isLoading ? (
          <div className="bloom-glass p-8 flex items-center justify-center">
            <div className="bloom-spinner" />
          </div>
        ) : nfts.length === 0 ? (
          <div className="bloom-glass p-12 text-center flex flex-col items-center gap-4">
            <p className="text-lg font-medium text-muted-foreground">No NFTs minted yet</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-bloom-coral hover:bg-bloom-pink text-white rounded-full font-medium transition-colors"
            >
              Go create one
            </button>
          </div>
        ) : (
          <div className="bloom-glass p-6 sm:p-8 flex flex-col gap-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold bloom-gradient-text">
                {nfts.length} {nfts.length === 1 ? "NFT" : "NFTs"} Minted
              </h2>
              <button
                onClick={handleClearGallery}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  className="bloom-glass-sm overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-square overflow-hidden rounded-t-[2rem]">
                    <img
                      src={nft.imageUrl}
                      alt={nft.prompt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="text-sm font-semibold text-bloom-terracotta line-clamp-2 mb-3">
                      "{nft.prompt}"
                    </p>
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-muted-foreground">
                        {formatTime(nft.timestamp)}
                      </p>
                      <a
                        href={`https://explorer.solana.com/tx/${nft.txSignature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-bloom-coral hover:text-bloom-pink transition-colors px-3 py-1.5 rounded-full hover:bg-bloom-coral/10"
                      >
                        View Transaction
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GalleryPage;
