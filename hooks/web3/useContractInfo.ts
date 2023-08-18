"use client";

import { useMemo } from "react";
import { useNetwork } from "wagmi";
import { abi_survey } from "@/data/web3/contracts/abi_survey";
import { ContractInterface } from "@/types/web3";

import {
  ContractAddresConfig,
  getSupportedChainConfig
} from "@/utils/supportedChains";
import { Web3Address } from "@/types/web3";

function toContractInterface(config: ContractAddresConfig): ContractInterface {
  return {
    address: config.address as Web3Address,
    abi    : abi_survey,
    chainId: config.chainId
  };
}

export const useContractInfo = (): ContractInterface => {
  const { chain } = useNetwork();

  const contract = useMemo(() => {
    const chainConfig = getSupportedChainConfig();
    const defaultChain = chainConfig.find((c) => c.isDefault) || chainConfig[0];
    const defaultInfo = toContractInterface(defaultChain);

    if (!chain || chain?.unsupported) return defaultInfo;

    const currInfo = chainConfig.find((c) => c.chainId === chain.id);
    return currInfo ? toContractInterface(currInfo) : defaultInfo;
  }, [chain]);
  return contract;
};
