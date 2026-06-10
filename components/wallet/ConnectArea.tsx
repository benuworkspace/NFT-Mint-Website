"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWalletStatus } from "@/hooks/useWalletStatus";

export function ConnectArea() {
  const { isConnected, isCorrectChain, switchToSepolia, isSwitching } =
    useWalletStatus();

  return (
    <div className="flex flex-col items-center gap-3">

      {/* RainbowKit Connect Button */}
      <ConnectButton
        showBalance={true}
        chainStatus="icon"
        accountStatus="address"
      />

      {/* Network warning */}
      {isConnected && !isCorrectChain && (
        <div className="w-full bg-yellow-900/30 border border-yellow-700/50 
                        rounded-lg p-3 text-center">
          <p className="text-yellow-400 text-sm font-medium mb-2">
            ⚠️ Wrong Network
          </p>
          <p className="text-yellow-300/70 text-xs mb-3">
            Please switch to Sepolia Testnet
          </p>
          <button
            onClick={switchToSepolia}
            disabled={isSwitching}
            className="btn-primary py-2 px-4 text-sm"
          >
            {isSwitching ? "Switching..." : "Switch to Sepolia"}
          </button>
        </div>
      )}
    </div>
  );
}