"use client";

import { useState } from "react";
import { PublicMintCard }    from "./PublicMintCard";
import { WhitelistMintCard } from "./WhitelistMintCard";

export function MintSection() {
  const [activeTab, setActiveTab] = useState<"public" | "whitelist">(
    "whitelist"
  );

  return (
    <div className="space-y-4">

      {/* Tab selector */}
      <div className="flex gap-2 bg-slate-800/50 rounded-xl p-1">
        <button
          onClick={() => setActiveTab("whitelist")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium 
                      transition-all duration-200 ${
            activeTab === "whitelist"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          🎫 Whitelist
        </button>
        <button
          onClick={() => setActiveTab("public")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium 
                      transition-all duration-200 ${
            activeTab === "public"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          🌐 Public
        </button>
      </div>

      {/* Active mint card */}
      {activeTab === "whitelist"
        ? <WhitelistMintCard />
        : <PublicMintCard />
      }
    </div>
  );
}