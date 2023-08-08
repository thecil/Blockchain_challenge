import { useAccount, useBalance, serialize, deserialize } from "wagmi";
import { useMemo, useState, useEffect } from "react";
import { Web3Address } from "@/types/web3";
import { useContractInfo } from "./useContractInfo";


export const useWagmiUtils = () => {
const _ct = useContractInfo();
  const { address, isConnected } = useAccount();

  const isWalletConnected = useMemo(() => {
    return Boolean(address && isConnected);
  }, [address, isConnected]);

  const bigIntReplacer = (key: any, value: any) =>
    typeof value === "bigint" ? value.toString() : value;

  const deserialized = (req: string) => {
    const _res = deserialize(req);
    return _res.value;
  };

  const {
    data: _tokenBalanceOf,
    isLoading: isLoadingTokenBalanceOf,
    isSuccess: isSuccessTokenBalanceOf,
    refetch: refetchTokenBalanceOf,
  } = useBalance({
    address: address,
    token: _ct.address as Web3Address,
    enabled: Boolean(_ct.address && isWalletConnected),
  });

  const tokenBalanceOf = useMemo(() => {
    return _tokenBalanceOf ? _tokenBalanceOf : null;
  }, [_tokenBalanceOf]);

  return {
    serialize,
    deserialized,
    bigIntReplacer,
    address,
    isWalletConnected,
    tokenBalanceOf,
    isLoadingTokenBalanceOf,
    refetchTokenBalanceOf,
  };
};
