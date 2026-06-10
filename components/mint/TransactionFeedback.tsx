"use client";

import type { TransactionState } from "@/types";

// __________ Props __________

interface TransactionFeedbackProps {
  state: TransactionState;
  onReset: () => void;
}

// __________ Status Icon __________

function StatusIcon({ status }: { status: TransactionState["status"] }) {
  if (status === "pending") {
    return (
      <div className="w-12 h-12 rounded-full border-4 border-indigo-500 
                      border-t-transparent animate-spin mx-auto" />
    );
  }
  if (status === "confirming") {
    return (
      <div className="w-12 h-12 rounded-full bg-yellow-500/20 
                      flex items-center justify-center mx-auto">
        <span className="text-2xl animate-pulse">⏳</span>
      </div>
    );
  }
  if (status === "success") {
    return (
      <div className="w-12 h-12 rounded-full bg-green-500/20 
                      flex items-center justify-center mx-auto 
                      animate-fade-in">
        <span className="text-2xl">✅</span>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="w-12 h-12 rounded-full bg-red-500/20 
                      flex items-center justify-center mx-auto">
        <span className="text-2xl">❌</span>
      </div>
    );
  }
  return null;
}

// __________ Main Component __________

export function TransactionFeedback({
  state,
  onReset,
}: TransactionFeedbackProps) {

  if (state.status === "idle") return null;

  const messages: Record<TransactionState["status"], string> = {
    idle:       "",
    pending:    "Confirm the transaction in your wallet...",
    confirming: "Transaction submitted. Waiting for confirmation...",
    success:    "NFT minted successfully! 🎉",
    error:      state.error || "Transaction failed. Please try again.",
  };

  return (
    <div className="card p-6 text-center space-y-4 animate-fade-in">

      <StatusIcon status={state.status} />

      <p className={`font-medium ${
        state.status === "success"    ? "text-green-400" :
        state.status === "error"      ? "text-red-400"   :
        state.status === "confirming" ? "text-yellow-400":
        "text-slate-300"
      }`}>
        {messages[state.status]}
      </p>

      {/* Transaction hash link */}
      {state.hash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${state.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
        >
          <span>View on Etherscan</span>
          <span>↗</span>
        </a>
      )}

      {/* Reset button */}
      {(state.status === "success" || state.status === "error") && (
        <button
          onClick={onReset}
          className="btn-secondary w-full mt-2"
        >
          {state.status === "success" ? "Mint Another" : "Try Again"}
        </button>
      )}
    </div>
  );
}