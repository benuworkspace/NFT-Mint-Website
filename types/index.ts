// NFT Metadata types - sesuai dengan OpenSea standard
export interface NFTAttribute {
    trait_type: string;
    value: string | number;
    display_type?: "number" | "boost_percentage" | "dtae";
}

export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    external_url?: string;
    attributes: NFTAttribute[];
}

// NFT item dengan tokenId dan metadata
export interface NFTItem {
    tokenId: number;
    metadata: NFTMetadata | null;
    tokenURI: string;
    isLoading: boolean;
    error?: string;
}

// Collection info dari contract
export interface CollectionInfo {
    totalSupply: bigint;
    maxSupply: bigint;
    remaining: bigint;
    mintPrice: bigint;
    whitelistMintPrice: bigint;
    publicMintActive: boolean;
    whitelistMintActive: boolean;
    revealed: boolean;
    isPaused: boolean;
}

// Wallet info per address
export interface WalletInfo {
    publicMinted: bigint;
    publicRemaining: bigint;
    whitelistUsed: boolean;
}

// Transaction states
export type TransactionStatus =
    | "idle"
    | "pending"
    | "confirming"
    | "success"
    | "error";

export interface TransactionState {
    status: TransactionStatus;
    hash?: `0x${string}`;
    error?: string;
}

// Mint phases
export type MintPhase = "not_started" | "whitelist" | "public" | "sold_out";