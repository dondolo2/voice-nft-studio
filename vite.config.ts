import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
    watch: { usePolling: true },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // Polyfill Node built-ins that Irys/Metaplex try to import in the browser
      stream: "stream-browserify",
      crypto: "crypto-browserify",
      http: "stream-http",
      https: "https-browserify",
      zlib: "browserify-zlib",
      url: "url",
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
    include: [
      "@solana/web3.js",
      "@solana/wallet-adapter-react",
      "@solana/wallet-adapter-react-ui",
      "@solana/wallet-adapter-base",
      "buffer",
    ],
    esbuildOptions: {
      // Allow esbuild to handle these Node.js globals
      define: {
        global: "globalThis",
      },
    },
  },
  define: {
    "process.env": {},
    global: "globalThis",
  },
  build: {
    rollupOptions: {
      // Prevent hard build failures from Node-only packages used by Irys
      external: [],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
