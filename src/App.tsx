import React, { useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import Index from "./pages/Index";
import GalleryPage from "./pages/GalleryPage";
import NotFound from "./pages/NotFound";

import "@solana/wallet-adapter-react-ui/styles.css";

const DEVNET_ENDPOINT = "https://api.devnet.solana.com";

const App: React.FC = () => {
  const endpoint = useMemo(() => DEVNET_ENDPOINT, []);
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
