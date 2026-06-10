"use client";

import { useWalletStatus } from "@/hooks/useWalletStatus";

interface NetworkGuardProps {
  // Children hanya ditampilkan kalau di network yang benar
  children: React.ReactNode;
  // Kalau false, tampilkan warning tapi tetap render children
  // Kalau true (default), block children sampai di network yang benar
  strict?: boolean;
}

/**
 * NetworkGuard membungkus komponen yang butuh network yang benar.
 *
 * Penggunaan:
 * <NetworkGuard>
 *   <MintButton /> ← hanya tampil kalau di Sepolia
 * </NetworkGuard>
 *
 * <NetworkGuard strict={false}>
 *   <CollectionInfo /> ← tampil tapi ada warning kalau wrong network
 * </NetworkGuard>
 */
export function NetworkGuard({
  children,
  strict = true,
}: NetworkGuardProps) {
  const {
    isConnected,
    isCorrectChain,
    switchToSepolia,
    isSwitching,
    isLoading,
    chainId,
  } = useWalletStatus();

  // Kalau belum connect, tidak perlu tampilkan network warning
  if (!isConnected) {
    return <>{children}</>;
  }

  // Kalau masih loading (reconnecting setelah refresh)
  if (isLoading) {
    return (
      <div className="card p-6 text-center">
        <div className="w-8 h-8 border-2 border-indigo-500 
                        border-t-transparent rounded-full animate-spin 
                        mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Connecting...</p>
      </div>
    );
  }

  // Kalau di wrong network
  if (!isCorrectChain) {
    return (
      <>
        {/* Warning banner */}
        <div className="card p-5 border-yellow-700/50 bg-yellow-900/20 
                        space-y-4">

          {/* Icon + title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 
                            flex items-center justify-center shrink-0">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-yellow-400 font-semibold">
                Wrong Network
              </h3>
              <p className="text-yellow-300/70 text-sm">
                Switch to Sepolia Testnet to continue
              </p>
            </div>
          </div>

          {/* Network info */}
          <div className="bg-slate-900/50 rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Current Network</span>
              <span className="text-red-400 font-mono">
                Chain ID: {getChainName(chainId)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Required Network</span>
              <span className="text-green-400 font-mono">
                Sepolia (11155111)
              </span>
            </div>
          </div>

          {/* Switch button */}
          <button
            onClick={switchToSepolia}
            disabled={isSwitching}
            className="btn-primary w-full"
          >
            {isSwitching
              ? "Switching Network..."
              : "Switch to Sepolia"}
          </button>
        </div>

        {/* Render children tapi di-blur kalau strict mode */}
        {!strict && (
          <div className="opacity-50 pointer-events-none select-none">
            {children}
          </div>
        )}
      </>
    );
  }

  // Di network yang benar — render children normal
  return <>{children}</>;
}

// __________ Helper untuk display chain ID __________

function getChainName(chainId: number | undefined) {
  const chainNames: Record<number, string> = {
    1:        "Mainnet",
    5:        "Goerli",
    11155111: "Sepolia",
    137:      "Polygon",
    80001:    "Mumbai",
    56:       "BSC",
    42161:    "Arbitrum",
    10:       "Optimism",
    8453:     "Base",
  };

  const normalizedChainId = chainId ?? 0;

  return chainNames[normalizedChainId] || `Chain ${chainId ?? "Unknown"}`;
}