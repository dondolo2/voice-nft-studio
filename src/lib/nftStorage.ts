export interface MintedNFT {
  id: string;
  imageUrl: string;
  prompt: string;
  txSignature: string;
  timestamp: number;
}

const STORAGE_KEY = "bloom_studio_nfts";

export function getMintedNFTs(): MintedNFT[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MintedNFT[];
  } catch {
    return [];
  }
}

export function saveMintedNFT(nft: MintedNFT): void {
  const existing = getMintedNFTs();
  existing.unshift(nft);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function clearMintedNFTs(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function generateId(): string {
  return `nft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
