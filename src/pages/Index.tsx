import React, { useState, useCallback, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import DevnetBanner from "@/components/DevnetBanner";
import Header from "@/components/Header";
import FloralBackground from "@/components/FloralBackground";
import VoiceInput from "@/components/VoiceInput";
import ImageDisplay from "@/components/ImageDisplay";
import MintSection from "@/components/MintSection";
import VoiceFeedback from "@/components/VoiceFeedback";
import Footer from "@/components/Footer";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { transcribeAudio, speakText } from "@/lib/elevenlabs";
import { generateImageUrl, preloadImage } from "@/lib/imageGen";
import { mintNFT } from "@/lib/mintNFT";
import {
  saveMintedNFT,
  generateId,
  type MintedNFT,
} from "@/lib/nftStorage";
import { useToast } from "@/hooks/use-toast";

const Index: React.FC = () => {
  const wallet = useWallet();
  const { publicKey } = wallet;
  const { toast } = useToast();
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    error: recorderError,
  } = useVoiceRecorder();

  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState<{
    mintAddress: string;
    signature: string;
  } | null>(null);

  const [isMuted, setIsMuted] = useState(false);

  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Toggle recording
  const handleToggleRecord = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      setTranscript("");
      setImageUrl(null);
      setMintResult(null);
      setTranscriptError(null);
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Generate image + TTS readback
  const generateImage = useCallback(
    async (prompt: string) => {
      if (!prompt.trim()) return;
      setIsGenerating(true);
      setImageUrl(null);
      try {
        const url = generateImageUrl(prompt);
        const loaded = await preloadImage(url);
        setImageUrl(loaded);

        // TTS: read back the prompt after image is generated
        if (!isMutedRef.current) {
          speakText(`Your artwork is ready. The prompt was: ${prompt}`);
        }
      } catch (error) {
        const description =
          error instanceof Error
            ? error.message
            : "Could not generate artwork. Please try a different prompt.";

        toast({
          title: "Image generation failed",
          description,
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    },
    [toast]
  );

  // audioBlob ready -> transcribe -> generate
  useEffect(() => {
    if (!audioBlob) return;
    let cancelled = false;

    const run = async () => {
      setIsTranscribing(true);
      setTranscriptError(null);
      try {
        const text = await transcribeAudio(audioBlob);
        if (cancelled) return;
        setTranscript(text);
        generateImage(text);
      } catch (err) {
        if (cancelled) return;
        setTranscriptError(
          err instanceof Error ? err.message : "Transcription failed"
        );
      } finally {
        if (!cancelled) setIsTranscribing(false);
      }
    };

    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob]);

  // Real minting with Metaplex Umi
  const handleMint = useCallback(async () => {
    if (!publicKey || !imageUrl || !transcript) return;

    setIsMinting(true);
    try {
      const result = await mintNFT(wallet, imageUrl, transcript);
      setMintResult(result);

      const nft: MintedNFT = {
        id: generateId(),
        imageUrl,
        prompt: transcript,
        txSignature: result.signature,
        timestamp: Date.now(),
      };
      saveMintedNFT(nft);

      toast({
        title: "NFT minted!",
        description: "View in your wallet or check the gallery for details.",
      });

      // TTS after minting
      if (!isMutedRef.current) {
        speakText("Your NFT is now on Solana. Thank you for creating.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Minting failed. Please try again.";
      toast({
        title: "Minting failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  }, [publicKey, imageUrl, transcript, wallet, toast]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <FloralBackground />
      <DevnetBanner />
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6 sm:gap-8 relative z-10">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bloom-gradient-text mb-3">
            Voice to Art to NFT
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            Speak your creative vision, watch AI paint it, and mint it as a
            Solana NFT — all in one bloom.
          </p>
        </div>

        <VoiceInput
          isRecording={isRecording}
          isTranscribing={isTranscribing}
          transcript={transcript}
          onToggleRecord={handleToggleRecord}
          error={recorderError || transcriptError}
        />

        <ImageDisplay
          imageUrl={imageUrl}
          isGenerating={isGenerating}
          prompt={transcript}
        />

        <MintSection
          imageUrl={imageUrl}
          isMinting={isMinting}
          txSignature={mintResult?.signature ?? null}
          mintAddress={mintResult?.mintAddress ?? null}
          onMint={handleMint}
          walletConnected={!!publicKey}
        />
      </main>

      <Footer />
      <VoiceFeedback isMuted={isMuted} onToggle={() => setIsMuted((m) => !m)} />
    </div>
  );
};

export default Index;
