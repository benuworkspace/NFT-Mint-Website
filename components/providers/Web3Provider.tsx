"use client";

// __________ Import __________

import { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig, SUPPORTED_CHAIN } from "@/config/wagmi";

// Import styles RainbowKit
import "@rainbow-me/rainbowkit/styles.css";

// __________ QueryClient Setup __________

/**
 * QueryClient mengatur caching dan refetching data.
 * Dibuat di luar komponen agar tidak di-recreate setiap render.
 *
 * defaultOptions:
 * - staleTime: berapa lama data dianggap "fresh" sebelum refetch
 *   60 detik = data blockchain cukup stabil untuk window ini
 * - retry: berapa kali retry kalau request gagal
 *   2 kali cukup untuk koneksi blockchain yang kadang lambat
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,   // 60 detik
      retry: 2,
      refetchOnWindowFocus: false,  // jangan refetch saat tab di-focus
    },
  },
});

// __________ Provider Props __________

interface Web3ProviderProps {
  children: ReactNode;
}

// __________ Web3Provider Component __________

/**
 * Provider utama yang membungkus seluruh app.
 * Harus di-wrap di root layout (app/layout.tsx).
 *
 * Urutan provider penting:
 * 1. WagmiProvider (paling luar) — setup koneksi chain
 * 2. QueryClientProvider — setup data fetching
 * 3. RainbowKitProvider (paling dalam) — setup wallet UI
 *    RainbowKit butuh Wagmi dan QueryClient sudah ready
 */
export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          // Dark theme yang match dengan design kita
          theme={darkTheme({
            accentColor: "#6366f1",        // indigo-500
            accentColorForeground: "white",
            borderRadius: "large",
            fontStack: "system",
            overlayBlur: "small",
          })}
          // Chain yang ditampilkan di RainbowKit UI
          initialChain={SUPPORTED_CHAIN}
          // Label yang muncul di modal
          modalSize="compact"
          // Bahasa UI RainbowKit
          locale="en"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}