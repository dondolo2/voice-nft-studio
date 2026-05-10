/**
 * Solana NFT minting on Devnet using Metaplex Umi.
 *
 * NOTE: umi-uploader-irys is intentionally NOT used here — it imports
 * Node.js built-ins (stream, crypto) that crash Vite's browser build.
 * Metadata is stored as a base64 data URI instead (fine for devnet demos).
 *
 * For production: move Irys uploads to a server-side API route.
 */

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

const DEVNET_RPC = "https://api.devnet.solana.com";
const MIN_SOL_BALANCE = 0.01;

export interface MintResult {
  mintAddress: string;
  signature: string;
}

export async function mintNFT(
  wallet: WalletContextState,
  imageUrl: string,
  prompt: string
): Promise<MintResult> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected. Please connect your Phantom or Backpack wallet.");
  }

  // Check SOL balance
  const connection = new Connection(DEVNET_RPC, "confirmed");
  const balance = await connection.getBalance(wallet.publicKey);
  const solBalance = balance / LAMPORTS_PER_SOL;

  if (solBalance < MIN_SOL_BALANCE) {
    throw new Error(
      `Insufficient SOL balance (${solBalance.toFixed(4)} SOL). ` +
      `You need at least ${MIN_SOL_BALANCE} SOL. Get devnet SOL from https://faucet.solana.com`
    );
  }

  // Set up Umi without irysUploader (avoids Node.js stream/crypto imports)
  const umi = createUmi(DEVNET_RPC).use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(wallet));

  // Use the generated image URL directly as the on-chain URI.
  // This keeps the metadata payload small enough to sign reliably in browser wallets.
  const metadataUri = imageUrl;

  // Mint the NFT on-chain
  const mint = generateSigner(umi);
  const nftName = `Bloom #${Date.now().toString(36).slice(-4).toUpperCase()}`;

  const txResult = await createNft(umi, {
    mint,
    name: nftName,
    symbol: "BLOOM",
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: false,
  }).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });

  const signatureBytes = txResult.signature;
  const signature =
    typeof signatureBytes === "string"
      ? signatureBytes
      : encodeBase58(signatureBytes as Uint8Array);

  return {
    mintAddress: mint.publicKey.toString(),
    signature,
  };
}

function encodeBase58(bytes: Uint8Array): string {
  const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const result: number[] = [];
  for (const byte of bytes) {
    let carry = byte;
    for (let j = 0; j < result.length; j++) {
      carry += result[j] << 8;
      result[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      result.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  for (const byte of bytes) {
    if (byte !== 0) break;
    result.push(0);
  }
  return result
    .reverse()
    .map((d) => ALPHABET[d])
    .join("");
}
