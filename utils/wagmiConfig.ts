import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  ledgerWallet,
  metaMaskWallet,
  // walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { getSupportedChains } from "./supportedChains";

export const { supportedChains, requiredChains } = getSupportedChains();
const { chains, publicClient, webSocketPublicClient } = configureChains(requiredChains, [publicProvider()]);

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string;
const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
  // {
  //   groupName: "Others",
  //   wallets: [walletConnectWallet({ projectId, chains })],
  // },
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});