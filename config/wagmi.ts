import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import { http } from "wagmi";

// __________ Validasi environment variables __________

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
    throw new Error (
        "NEX_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. " +
        "Get one at cloude.walletconnect.com"
    );
}

const rpcUrl = 
    process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.sepolia.org";

// __________ Wagmi config __________

/**
 * getDefaultConfig dari RainbowKit adalah cara paling mudah
 * set Wagmi + RainbowKit sekaligus.
 * 
 * Di balik layar, ini mengkonfigurasi:
 * - Wagmi dengan chains dan transports yang dipilih
 * - RainbowKit dengan connectors (Metamask, WalletConnector, dll)
 * - TanStack Query untuk caching
 */
export const wagmiConfig = getDefaultConfig({
    // Nama app yang muncul di wallet saat connect
    appName: "Portfolio NFT Collection",

    // WalletConnect Project ID - required untuk WalletConnect v2
    projectId,

    // Chains yang didukung app kita
    // Kita hanya support Sepolia untuk testing
    chains: [sepolia],

    // Transport - cara app berkomunikasi dengan blockchain
    // http(url) = gunakan RPC URL via HTTP
    transports: {
        [sepolia.id]: http(rpcUrl),
    },

    // Server side rendering - set false karena wallet
    // tidak tersedia di server, hanya di browser
    ssr: false,
});

// __________ EXport Chain Config Untuk Dipakai di Tempat Lain __________

export const SUPPORTED_CHAIN = sepolia;
export const SUPPORTED_CHAIN_ID = sepolia.id; // 11155111