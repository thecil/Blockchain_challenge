import {
  useAccount,
  useBalance,
  serialize,
  deserialize,
  useNetwork
} from "wagmi";
import { getPublicClient } from "@wagmi/core";
import { useMemo, useState, useEffect } from "react";
import { Web3Address } from "@/types/web3";
import { useContractInfo } from "./useContractInfo";

export const useWagmiUtils = () => {
  const [accountNonce, setAccountNonce] = useState<number | null>(null);
  const _ct = useContractInfo();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const publicClient = getPublicClient();

  const isWalletConnected = useMemo(() => {
    return Boolean(address && isConnected);
  }, [address, isConnected]);

  const isConnectedToCorrectNetwork = useMemo(() => {
    return chain?.id ? chain.id === _ct.chainId : false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  const bigIntReplacer = (key: any, value: any) =>
    typeof value === "bigint" ? value.toString() : value;

  const deserialized = (req: string) => {
    const _res = deserialize(req);
    return _res.value;
  };

  const {
    data: _tokenBalanceOf,
    isLoading: isLoadingTokenBalanceOf,
    refetch: refetchTokenBalanceOf
  } = useBalance({
    address: address,
    token: _ct.address as Web3Address,
    enabled: Boolean(_ct.address && isWalletConnected)
  });

  const tokenBalanceOf = useMemo(() => {
    return _tokenBalanceOf ? _tokenBalanceOf : null;
  }, [_tokenBalanceOf]);

  useEffect(() => {
    if (address && publicClient) {
      const fetchNonce = async () => {
        const nonce = await publicClient.getTransactionCount({ address });
        setAccountNonce(nonce);
      };
      fetchNonce();
    }
  }, [address, publicClient]);

  return {
    serialize,
    deserialized,
    bigIntReplacer,
    publicClient,
    accountNonce,
    address,
    isWalletConnected,
    isConnectedToCorrectNetwork,
    tokenBalanceOf,
    isLoadingTokenBalanceOf,
    refetchTokenBalanceOf
  };
};
