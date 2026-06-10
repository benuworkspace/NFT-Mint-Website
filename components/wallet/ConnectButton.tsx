"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWalletStatus } from "@/hooks/useWalletStatus";
import { WalletInfo } from "./WalletInfo";

/**
 * ConnectArea menggabungkan:
 * 1. RainbowKit ConnectButton — untuk connect/disconnect
 * 2. WalletInfo — info detail setelah connect
 * 3. Network warning — kalau di wrong chain
 */
export function ConnectArea() {
  const {
    isConnected,
    isCorrectChain,
    switchToSepolia,
    isSwitching,
  } = useWalletStatus();

  return (
    <div className="space-y-3">

      {/* RainbowKit Connect Button */}
      <div className="flex justify-center">
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
          label="Connect Wallet"
        />
      </div>

      {/* Wallet info — muncul setelah connect */}
      {isConnected && <WalletInfo />}

      {/* Network warning */}
      {isConnected && !isCorrectChain && (
        <div className="card p-4 border-yellow-700/50 bg-yellow-900/20">
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">⚠️</span>
            <div className="flex-1 min-w-0">
              <p className="text-yellow-400 font-medium text-sm">
                Wrong Network Detected
              </p>
              <p className="text-yellow-300/70 text-xs mt-0.5">
                You need to be on Sepolia Testnet to mint.
              </p>
            </div>
            <button
              onClick={switchToSepolia}
              disabled={isSwitching}
              className="btn-primary py-1.5 px-3 text-xs shrink-0"
            >
              {isSwitching ? "..." : "Switch"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}