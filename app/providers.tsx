"use client";

import * as React from "react";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { supportedChains, wagmiConfig } from "@/utils/wagmiConfig";

const demoAppInfo = {
  appName: "Blockchain Challenge"
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={supportedChains} appInfo={demoAppInfo}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
