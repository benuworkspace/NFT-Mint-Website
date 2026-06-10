import { ConnectArea } from "@/components/wallet/ConnectButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-indigo-400">NFT Mint</p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Mint your Portfolio NFT on Sepolia with one click.
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              Connect your wallet, switch to Sepolia, and start minting your collection directly from this app.
            </p>
          </div>

          <div className="card p-6 shadow-2xl shadow-indigo-950/40">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">Wallet</p>
                <h2 className="text-xl font-semibold text-white">Connect to continue</h2>
              </div>
              <ConnectArea />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
