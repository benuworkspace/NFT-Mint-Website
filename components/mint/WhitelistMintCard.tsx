"use client";

import { useState, useCallback, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { formatEther } from "viem";
import { NFT_CONTRACT, getProofForAddress } from "@/config/contract";
import { useWalletStatus } from "@/hooks/useWalletStatus";
import { useCollectionInfo } from "@/hooks/useCollectionInfo";
import { TransactionFeedback } from "./TransactionFeedback";
import type { TransactionState } from "@/types";

// __________ Main Component __________

export function WhitelistMintCard() {
  const [txState, setTxState] = useState<TransactionState>({
    status: "idle",
  });

  const { address, isReady }        = useWalletStatus();
  const { collectionInfo, refetch } = useCollectionInfo();

  // __________ Get proof untuk address yang connect __________
  const proof = address ? getProofForAddress(address) : null;

  // __________ Cek apakah address sudah whitelist mint __________
  const { data: hasWhitelistMinted } = useReadContract({
    ...NFT_CONTRACT,
    functionName: "whitelistMinted",
    args:         address ? [address] : undefined,
    query: {
      enabled:         !!address,
      refetchInterval: 15_000,
    },
  });

  // __________ Cek apakah address whitelisted (via proof) __________
  const { data: isWhitelisted } = useReadContract({
    ...NFT_CONTRACT,
    functionName: "isWhitelisted",
    args: address && proof
      ? [proof as `0x${string}`[], address]
      : undefined,
    query: {
      enabled: !!address && !!proof,
    },
  });

  // __________ Write contract __________
  const { writeContractAsync, isPending: isWritePending } =
    useWriteContract();

  // __________ Wait for transaction __________
  const { isSuccess } = useWaitForTransactionReceipt({
    hash: txState.hash,
    query: {
      enabled: !!txState.hash && txState.status === "confirming",
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
  const isActive   = collectionInfo?.whitelistMintActive ?? false;
  const isSoldOut  = (collectionInfo?.remaining ?? BigInt(0)) === BigInt(0);
  const wlPrice    = collectionInfo?.whitelistMintPrice ?? BigInt(0);
  const isDisabled =
    !isReady          ||
    !isActive         ||
    isSoldOut         ||
    !proof            ||
    !isWhitelisted    ||
    !!hasWhitelistMinted ||
    isWritePending    ||
    txState.status === "pending"    ||
    txState.status === "confirming";

  // __________ Mint handler __________

  const handleMint = useCallback(async () => {
    if (!isReady || !proof) return;

    try {
      setTxState({ status: "pending" });

      const hash = await writeContractAsync({
        ...NFT_CONTRACT,
        functionName: "whitelistMint",
        args:         [proof as `0x${string}`[]],
        value:        wlPrice,
      });

      setTxState({ status: "confirming", hash });

    } catch (err: unknown) {
      const error = err instanceof Error
        ? err.message.slice(0, 100)
        : "Transaction rejected";
      setTxState({ status: "error", error });
    }
  }, [isReady, proof, wlPrice, writeContractAsync]);

  const handleReset = useCallback(() => {
    setTxState({ status: "idle" });
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
        <p className="text-slate-400">Connect your wallet to check eligibility</p>
      </div>
    );
  }

  // __________ Render: Phase not active __________

  if (!isActive) {
    return (
      <div className="card p-6 text-center">
        <p className="text-2xl mb-2">🔵</p>
        <p className="text-white font-bold">Whitelist Mint Not Started</p>
        <p className="text-slate-400 text-sm mt-1">
          Whitelist mint has not been activated yet
        </p>
      </div>
    );
  }

  // __________ Render: Already minted __________

  if (hasWhitelistMinted) {
    return (
      <div className="card p-6 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="text-white font-bold">Already Minted</p>
        <p className="text-slate-400 text-sm mt-1">
          You have already used your whitelist mint
        </p>
      </div>
    );
  }

  // __________ Render: Not whitelisted __________

  if (!proof || isWhitelisted === false) {
    return (
      <div className="card p-6 text-center">
        <p className="text-2xl mb-2">❌</p>
        <p className="text-white font-bold">Not Whitelisted</p>
        <p className="text-slate-400 text-sm mt-1">
          This wallet is not on the whitelist
        </p>
        <p className="text-slate-500 text-xs mt-2">
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>
    );
  }

  // __________ Render: Eligible — show mint form __________

  return (
    <div className="card p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-500/20 
                        flex items-center justify-center">
          <span className="text-lg">🎫</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            Whitelist Mint
          </h3>
          <p className="text-indigo-400 text-sm">
            You are whitelisted! 50% discount applied.
          </p>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Regular price</span>
          <span className="text-slate-500 line-through">
            {formatEther(collectionInfo?.mintPrice ?? BigInt(0))} ETH
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Whitelist price</span>
          <span className="text-indigo-400 font-semibold">
            {formatEther(wlPrice)} ETH
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Quantity</span>
          <span className="text-white">1 NFT (whitelist limit)</span>
        </div>
        <div className="border-t border-slate-700 pt-2 flex justify-between">
          <span className="text-white font-medium">Total</span>
          <span className="text-white font-bold">
            {formatEther(wlPrice)} ETH
          </span>
        </div>
      </div>

      {/* Proof info */}
      <div className="bg-green-900/20 border border-green-800/50 
                      rounded-lg p-3 text-sm">
        <p className="text-green-400 flex items-center gap-2">
          <span>✓</span>
          <span>Merkle proof verified for your wallet</span>
        </p>
      </div>

      {/* Mint button */}
      <button
        onClick={handleMint}
        disabled={isDisabled}
        className="btn-primary w-full bg-indigo-600 
                   hover:bg-indigo-500 text-base"
      >
        {isWritePending
          ? "Confirm in wallet..."
          : "Mint with Whitelist Price"}
      </button>

      <p className="text-slate-500 text-xs text-center">
        1 NFT per whitelisted wallet
      </p>
    </div>
  );
}