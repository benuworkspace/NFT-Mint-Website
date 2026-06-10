"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { SUPPORTED_CHAIN_ID } from "@/config/wagmi";

/**
 * Custom hook yang centralize semua wallet state.
 * Dipakai oleh semua komponen yang butuh info wallet.
 */
export function useWalletStatus() {
  const { address, isConnected, isConnecting } = useAccount();
  const chainId                                = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  // Apakah user di chain yang benar?
  const isCorrectChain = chainId === SUPPORTED_CHAIN_ID;

  // Apakah app siap untuk interaksi?
  const isReady = isConnected && isCorrectChain;

  // Switch ke Sepolia
  const switchToSepolia = () => {
    switchChain({ chainId: SUPPORTED_CHAIN_ID });
  };

  return {
    address,
    isConnected,
    isConnecting,
    isCorrectChain,
    isReady,
    isSwitching,
    chainId,
    switchToSepolia,
  };
}