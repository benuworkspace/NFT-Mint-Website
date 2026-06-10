"use client";

import { useCollectionInfo } from "@/hooks/useCollectionInfo";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { formatEther } from "viem";

// __________ Helper: Format supply progress __________

function SupplyBar({
  minted,
  max,
}: {
  minted: number;
  max: number;
}) {
  const percentage = max > 0 ? (minted / max) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">Minted</span>
        <span className="text-white font-medium">
          {minted} / {max}
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right text-xs text-slate-500">
        {max - minted} remaining
      </div>
    </div>
  );
}

// __________ Helper: Mint phase badge __________

function MintPhaseBadge({
  publicActive,
  whitelistActive,
  isPaused,
  isSoldOut,
}: {
  publicActive: boolean;
  whitelistActive: boolean;
  isPaused: boolean;
  isSoldOut: boolean;
}) {
  if (isPaused) {
    return <Badge variant="red">⏸ Paused</Badge>;
  }
  if (isSoldOut) {
    return <Badge variant="red">🔴 Sold Out</Badge>;
  }
  if (publicActive && whitelistActive) {
    return <Badge variant="green">🟢 All Phases Active</Badge>;
  }
  if (publicActive) {
    return <Badge variant="green">🟢 Public Mint Live</Badge>;
  }
  if (whitelistActive) {
    return <Badge variant="indigo">🔵 Whitelist Mint Live</Badge>;
  }
  return <Badge variant="yellow">⏳ Mint Not Started</Badge>;
}

// __________ Main Component __________

export function CollectionInfo() {
  const { collectionInfo, isLoading } = useCollectionInfo();

  // Loading state
  if (isLoading) {
    return (
      <div className="card p-6 space-y-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </div>
    );
  }

  // Error state / no data
  if (!collectionInfo) {
    return (
      <div className="card p-6 text-center">
        <p className="text-slate-400">
          Unable to load collection info. Check your connection.
        </p>
      </div>
    );
  }

  const {
    totalSupply,
    maxSupply,
    remaining,
    mintPrice,
    whitelistMintPrice,
    publicMintActive,
    whitelistMintActive,
    revealed,
    isPaused,
  } = collectionInfo;

  const isSoldOut = remaining === BigInt(0);

  return (
    <div className="card p-6 space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Portfolio NFT Collection
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            ERC721 • Sepolia Testnet
          </p>
        </div>
        <MintPhaseBadge
          publicActive={publicMintActive}
          whitelistActive={whitelistMintActive}
          isPaused={isPaused}
          isSoldOut={isSoldOut}
        />
      </div>

      {/* Supply Progress */}
      <SupplyBar
        minted={Number(totalSupply)}
        max={Number(maxSupply)}
      />

      {/* Price Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <p className="text-slate-400 text-xs mb-1">Public Price</p>
          <p className="text-white font-semibold text-lg">
            {formatEther(mintPrice)} ETH
          </p>
          <p className="text-slate-500 text-xs">per NFT</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3">
          <p className="text-slate-400 text-xs mb-1">Whitelist Price</p>
          <p className="text-indigo-400 font-semibold text-lg">
            {formatEther(whitelistMintPrice)} ETH
          </p>
          <p className="text-slate-500 text-xs">50% discount</p>
        </div>
      </div>

      {/* Metadata Status */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Metadata</span>
        <span className={revealed ? "text-green-400" : "text-yellow-400"}>
          {revealed ? "✓ Revealed" : "⏳ Unrevealed"}
        </span>
      </div>
    </div>
  );
}