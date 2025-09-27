"use client";
import "@rainbow-me/rainbowkit/styles.css";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  okxWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
// Only using Somnia testnet - removed other chain imports

// Define Somnia testnet chain configuration
const somniaTestnet = {
  id: 50312,
  name: "Somnia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "STT",
    symbol: "STT",
  },
  rpcUrls: {
    default: {
      http: ["https://dream-rpc.somnia.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Somnia Explorer",
      url: "https://shannon-explorer.somnia.network",
    },
  },
  testnet: true,
} as const;
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: "Celorean",
  projectId: "b7cfcf662095cd0ee1e06aa9eebd146a",
  wallets: [
    {
      groupName: "Other",
      wallets: [metaMaskWallet, okxWallet, trustWallet],
    },
    ...wallets,
    //
  ],
  chains: [somniaTestnet],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColorForeground: "white",
            fontStack: "system",
            overlayBlur: "small",
            borderRadius: "large",
          })}
          modalSize="compact"
          initialChain={somniaTestnet}
        >
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
