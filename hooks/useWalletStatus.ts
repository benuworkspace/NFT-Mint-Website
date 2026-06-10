"use client";

import {
  useAccount,
  useChainId,
  useSwitchChain,
  useBalance,
  useDisconnect,
} from "wagmi";
import { formatEther } from "viem";
import { SUPPORTED_CHAIN_ID } from "@/config/wagmi";

/**
 * Central hook untuk semua wallet state.
 *
 * Menggunakan satu hook di sini dan import ke semua
 * komponen jauh lebih maintainable daripada setiap
 * komponen import hooks Wagmi sendiri-sendiri.
 *
 * Kalau ada perubahan logic (misal: support multi-chain),
 * cukup update satu file ini.
 */
export function useWalletStatus() {

  // __________ Account info __________
  const {
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    isReconnecting,
  } = useAccount();

  // __________ Chain info __________
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  // __________ Balance __________
  const { data: balanceData } = useBalance({
    address,
    query: {
      // Refetch balance setiap 15 detik
      refetchInterval: 15_000,
      // Hanya fetch kalau sudah connect
      enabled: !!address,
    },
  });

  // __________ Disconnect __________
  const { disconnect } = useDisconnect();

  // __________ Derived state __________

  // Apakah di chain yang benar?
  const isCorrectChain = chainId === SUPPORTED_CHAIN_ID;

  // Apakah app siap untuk transaksi?
  // Harus connect DAN di chain yang benar
  const isReady = isConnected && isCorrectChain;

  // Loading state (connecting atau reconnecting setelah refresh)
  const isLoading = isConnecting || isReconnecting;

  // Format balance untuk display
  const formattedBalance = balanceData
    ? `${parseFloat(formatEther(balanceData.value)).toFixed(4)} ETH`
    : "0 ETH";

  // Short address untuk display: "0x1234...5678"
  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  // __________ Actions __________

  const switchToSepolia = () => {
    switchChain({ chainId: SUPPORTED_CHAIN_ID });
  };

  const disconnectWallet = () => {
    disconnect();
  };

  return {
    // State
    address,
    shortAddress,
    isConnected,
    isDisconnected,
    isConnecting,
    isReconnecting,
    isLoading,
    isCorrectChain,
    isReady,
    chainId,

    // Balance
    balance: balanceData,
    formattedBalance,

    // Actions
    switchToSepolia,
    disconnectWallet,
    isSwitching,
  };
}