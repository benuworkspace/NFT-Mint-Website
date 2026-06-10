"use client";

import { useWalletStatus } from "@/hooks/useWalletStatus";

/**
 * Tampilkan info wallet yang sedang connect.
 * Dipakai di bawah ConnectButton untuk konteks tambahan.
 */
export function WalletInfo() {
  const {
    isConnected,
    isReady,
    shortAddress,
    formattedBalance,
    isCorrectChain,
  } = useWalletStatus();

  // Tidak tampil kalau belum connect
  if (!isConnected) return null;

  return (
    <div className="card px-4 py-3">
      <div className="flex items-center justify-between">

        {/* Address info */}
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className={`w-2.5 h-2.5 rounded-full ${
            isReady ? "bg-green-400" : "bg-yellow-400"
          } animate-pulse-slow`} />

          <div>
            <p className="text-white text-sm font-mono font-medium">
              {shortAddress}
            </p>
            <p className="text-slate-500 text-xs">
              {isReady ? "Ready to mint" : "Wrong network"}
            </p>
          </div>
        </div>

        {/* Balance */}
        <div className="text-right">
          <p className="text-white text-sm font-medium">
            {formattedBalance}
          </p>
          <p className="text-slate-500 text-xs">
            {isCorrectChain ? "Sepolia ETH" : "Wrong Chain"}
          </p>
        </div>

      </div>
    </div>
  );
}