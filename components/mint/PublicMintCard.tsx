"use client";

import { useState, useCallback, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { formatEther } from "viem";
import { NFT_CONTRACT } from "@/config/contract";
import { useWalletStatus } from "@/hooks/useWalletStatus";
import { useCollectionInfo } from "@/hooks/useCollectionInfo";
import { TransactionFeedback } from "./TransactionFeedback";
import type { TransactionState } from "@/types";

// __________ Quantity Selector __________

function QuantitySelector({
  value,
  onChange,
  max,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  max: number;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={disabled || value <= 1}
        className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600
                   text-white font-bold text-lg transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        −
      </button>

      <span className="w-12 text-center text-xl font-bold text-white">
        {value}
      </span>

      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600
                   text-white font-bold text-lg transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
}

// __________ Main Component __________

export function PublicMintCard() {
  const [quantity, setQuantity]   = useState(1);
  const [txState, setTxState]     = useState<TransactionState>({
    status: "idle",
  });

  const { address, isReady }          = useWalletStatus();
  const { collectionInfo, refetch }   = useCollectionInfo();

  // __________ Fetch wallet-specific info __________
  const { data: walletInfo } = useReadContract({
    ...NFT_CONTRACT,
    functionName: "getWalletInfo",
    args:         address ? [address] : undefined,
    query: {
      enabled:         !!address,
      refetchInterval: 15_000,
    },
  });

  // __________ Write contract hook __________
  const {
    writeContractAsync,
    isPending: isWritePending,
  } = useWriteContract();

  // __________ Wait for transaction __________
  const { isSuccess } = useWaitForTransactionReceipt({
    hash: txState.hash,
    query: {
      enabled: !!txState.hash && txState.status === "confirming",
    },
    onReplaced: () => {
      setTxState({ status: "error", error: "Transaction replaced" });
    },
  });

  useEffect(() => {
    if (txState.status === "confirming" && isSuccess) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTxState(prev => ({ ...prev, status: "success" }));
      refetch();
    }
  }, [txState.status, isSuccess, refetch]);

  // __________ Derived state __________

  const publicRemaining = walletInfo ? Number(walletInfo[1]) : 2;
  const maxQuantity     = Math.min(
    publicRemaining,
    collectionInfo ? Number(collectionInfo.remaining) : 0
  );

  const mintPrice   = collectionInfo?.mintPrice ?? BigInt(0);
  const totalPrice  = mintPrice * BigInt(quantity);
  const isActive    = collectionInfo?.publicMintActive ?? false;
  const isSoldOut   = (collectionInfo?.remaining ?? BigInt(0)) === BigInt(0);
  const isDisabled  =
    !isReady ||
    !isActive ||
    isSoldOut ||
    isWritePending ||
    txState.status === "pending" ||
    txState.status === "confirming" ||
    maxQuantity === 0;

  // __________ Mint handler __________

  const handleMint = useCallback(async () => {
    if (!isReady || !collectionInfo) return;

    try {
      setTxState({ status: "pending" });

      const hash = await writeContractAsync({
        ...NFT_CONTRACT,
        functionName: "publicMint",
        args:         [BigInt(quantity)],
        value:        totalPrice,
      });

      setTxState({ status: "confirming", hash });

    } catch (err: unknown) {
      const error = err instanceof Error
        ? err.message.slice(0, 100)
        : "Transaction rejected";
      setTxState({ status: "error", error });
    }
  }, [
    isReady,
    collectionInfo,
    quantity,
    totalPrice,
    writeContractAsync,
  ]);

  // __________ Reset __________

  const handleReset = useCallback(() => {
    setTxState({ status: "idle" });
    setQuantity(1);
  }, []);

  // __________ Render: Transaction feedback __________

  if (txState.status !== "idle") {
    return (
      <TransactionFeedback state={txState} onReset={handleReset} />
    );
  }

  // __________ Render: Not connected __________

  if (!isReady) {
    return (
      <div className="card p-6 text-center">
        <p className="text-2xl mb-2">🔗</p>
        <p className="text-slate-400">
          Connect your wallet to mint
        </p>
      </div>
    );
  }

  // __________ Render: Sold out __________

  if (isSoldOut) {
    return (
      <div className="card p-6 text-center">
        <p className="text-2xl mb-2">🔴</p>
        <p className="text-white font-bold">Sold Out</p>
        <p className="text-slate-400 text-sm mt-1">
          All NFTs have been minted
        </p>
      </div>
    );
  }

  // __________ Render: Mint not active __________

  if (!isActive) {
    return (
      <div className="card p-6 text-center">
        <p className="text-2xl mb-2">⏳</p>
        <p className="text-white font-bold">Public Mint Not Started</p>
        <p className="text-slate-400 text-sm mt-1">
          Check back soon
        </p>
      </div>
    );
  }

  // __________ Render: Wallet limit reached __________

  if (maxQuantity === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="text-white font-bold">Mint Limit Reached</p>
        <p className="text-slate-400 text-sm mt-1">
          You&apos;ve minted the maximum allowed NFTs
        </p>
      </div>
    );
  }

  // __________ Render: Main mint form __________

  return (
    <div className="card p-6 space-y-5">

      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-white">Public Mint</h3>
        <p className="text-slate-400 text-sm mt-1">
          Max 2 per wallet
        </p>
      </div>

      {/* Quantity selector */}
      <div className="space-y-2">
        <label className="text-slate-400 text-sm">Quantity</label>
        <div className="flex items-center justify-between">
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            max={maxQuantity}
            disabled={isDisabled}
          />
          <div className="text-right">
            <p className="text-slate-400 text-xs">Total</p>
            <p className="text-white font-bold text-xl">
              {formatEther(totalPrice)} ETH
            </p>
          </div>
        </div>
      </div>

      {/* Wallet mint status */}
      {walletInfo && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Your mints</span>
          <span className="text-white">
            {Number(walletInfo[0])} / 2
          </span>
        </div>
      )}

      {/* Price per NFT info */}
      <div className="bg-slate-900/50 rounded-lg p-3 flex justify-between">
        <span className="text-slate-400 text-sm">Price per NFT</span>
        <span className="text-white text-sm font-medium">
          {formatEther(mintPrice)} ETH
        </span>
      </div>

      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={isDisabled}
        className="btn-primary w-full text-base"
      >
        {isWritePending
          ? "Confirm in wallet..."
          : `Mint ${quantity} NFT${quantity > 1 ? "s" : ""}`}
      </button>

      <p className="text-slate-500 text-xs text-center">
        Transaction will prompt in your wallet
      </p>
    </div>
  );
}