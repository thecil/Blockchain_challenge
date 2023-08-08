import { Chain } from "wagmi";
import * as allChains from "wagmi/chains";

const SUPPORTED_CHAINS = process.env.NEXT_PUBLIC_SUPPORTED_CHAINS;

export interface ContractAddresConfig {
  chainId: number;
  address: string;
  isDefault?: boolean;
}

export interface AppSupportedChains {
  // chains required by the code
  // must include mainnet as the AAA check token is on mainnet
  requiredChains: Chain[],

  // the chains available to select in the wallet connect modal
  supportedChains: Chain[]
}

// fix issue of provider mistmatch caused by using the same chainId
const chainList = Object.values(allChains).filter(chain => chain.network !== "foundry");

let supportedChainsEnv: ContractAddresConfig[] = [];
let appSupportedChains: AppSupportedChains;

export const getSupportedChainConfig = () => {
  if (supportedChainsEnv.length) return supportedChainsEnv;
  const result = JSON.parse(SUPPORTED_CHAINS) as ContractAddresConfig[];
  if (!result.length)
    throw new Error(
      "No supported chains in NEXT_PUBLIC_SUPPORTED_CHAINS env var"
    );

  supportedChainsEnv = result;
  console.log({ supportedChainsEnv });
  return supportedChainsEnv;
};

export const getSupportedChains = (): AppSupportedChains => {
  if (appSupportedChains) return appSupportedChains;
  const result = getSupportedChainConfig().map(
    ({ chainId }) => {
      const chain = chainList.find((c) => c.id === +chainId);
      if (!chain)
        throw new Error(
          `error getting supported chains. Unknown chainId: ${chainId}`
        );
      return chain;
    }
  );
  appSupportedChains = {
    requiredChains: result.concat(allChains.mainnet),
    supportedChains: result
  };
  console.log("getSupportedChains::", appSupportedChains);

  return appSupportedChains;
};

export const getDefaultChain = () => {
  const supportedChains = getSupportedChainConfig();
  const defaultChain = supportedChains.find(c => c.isDefault) || supportedChains[0];
  if (!defaultChain) throw new Error("No default chain");

  return defaultChain;
};

