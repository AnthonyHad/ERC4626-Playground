// src/providers.tsx
"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { http } from "wagmi"; // ← import the http transport
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// pull your own Alchemy (or Infura/QuickNode) URLs from env
const ALCHEMY_MAINNET = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET!;
// const ALCHEMY_POLYGON = process.env.NEXT_PUBLIC_ALCHEMY_POLYGON!;
// const ALCHEMY_OPTIMISM = process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM!;
// const ALCHEMY_ARBITRUM = process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM!;
// const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC!;

const wagmiConfig = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
  transports: {
    [mainnet.id]: http(ALCHEMY_MAINNET),
    // [polygon.id]: http(ALCHEMY_POLYGON),
    // [optimism.id]: http(ALCHEMY_OPTIMISM),
    // [arbitrum.id]: http(ALCHEMY_ARBITRUM),
    // [base.id]: http(BASE_RPC_URL),
  },
});

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
