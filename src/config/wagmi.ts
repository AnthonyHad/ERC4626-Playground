// src/wagmi.ts
import { createConfig, http } from "@wagmi/core";
import { mainnet, sepolia } from "@wagmi/core/chains";

// 1) read from env
if (!process.env.NEXT_PUBLIC_ALCHEMY_MAINNET) {
  throw new Error("Missing NEXT_PUBLIC_ALCHEMY_MAINNET");
}
if (!process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA) {
  throw new Error("Missing NEXT_PUBLIC_ALCHEMY_SEPOLIA");
}

// 2) build the config per the docs
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_MAINNET),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA),
  },
  // you can add connectors/autoConnect here if you need wallet support
});
