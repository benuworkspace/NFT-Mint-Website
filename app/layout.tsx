import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Web3Provider } from "@/components/providers/Web3Provider";
import "./globals.css";

// __________ Font Setup __________

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// __________ Metadata __________

export const metadata: Metadata = {
  title: "Portfolio NFT Collection — Mint",
  description:
    "Mint your Portfolio NFT. Built with Solidity, Next.js, and Wagmi.",
  openGraph: {
    title: "Portfolio NFT Collection",
    description: "Mint your unique Portfolio NFT",
    type: "website",
  },
};

// __________ Root Layout __________

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          min-h-screen
          bg-slate-950
        `}
      >
        {/* Web3Provider membungkus seluruh app */}
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}