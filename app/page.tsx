import { CollectionInfo } from "@/components/mint/CollectionInfo";
import { MintSection } from "@/components/mint/MintSection";
import { ConnectArea } from "@/components/wallet/ConnectArea";

export default function HomePage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Portfolio NFT</h1>
          <p className="text-slate-400">A unique digital collectible built on Ethereum</p>
        </div>

        <ConnectArea />
        <CollectionInfo />
        <MintSection />

        <footer className="pt-8 text-center text-sm text-slate-600">
          <p>By: Absalom Benu | Bukit Digital Nusantara</p>
          <p>Built with Solidity + Next.js + Wagmi</p>
          <a
            href={`https://sepolia.etherscan.io/address/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-indigo-600 transition-colors hover:text-indigo-500"
          >
            View Contract on Etherscan ↗
          </a>
        </footer>
      </div>
    </main>
  );
}