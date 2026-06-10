"use client";

import { useReadContract } from "wagmi";
import { NFT_CONTRACT } from "@/config/contract";
import type { CollectionInfo } from "@/types";

/**
 * Hook untuk fetch semua info collection dalam satu call.
 * Menggunakan getMintInfo() yang return semua data sekaligus
 * — menghemat RPC calls.
 */
export function useCollectionInfo() {
  const { data, isLoading, error, refetch } = useReadContract({
    ...NFT_CONTRACT,
    functionName: "getMintInfo",
    // Auto-refetch setiap 15 detik untuk data yang fresh
    query: {
      refetchInterval: 15_000,
    },
  });

  // Parse raw data dari contract ke typed object
  const collectionInfo: CollectionInfo | null = data
    ? {
        totalSupply:          data[0],
        maxSupply:            data[1],
        remaining:            data[2],
        mintPrice:            data[3],
        whitelistMintPrice:   data[4],
        publicMintActive:     data[5],
        whitelistMintActive:  data[6],
        revealed:             data[7],
        isPaused:             data[8],
      }
    : null;

  return {
    collectionInfo,
    isLoading,
    error,
    refetch,
  };
}