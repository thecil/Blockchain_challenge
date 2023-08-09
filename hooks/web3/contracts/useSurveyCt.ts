import { useMemo } from "react";
import { useContractRead } from "wagmi";
import { useContractInfo } from "@/hooks/web3/useContractInfo";
import { useWagmiUtils } from "@/hooks/web3/useWagmiUtils";
import { hexToNumber } from "viem";
import { Web3Address } from "@/types/web3";
import { unixNow } from "@/utils/cooldownTime";

export const useSurveyCt = () => {
  const ct = useContractInfo();
  const {
    address,
    isWalletConnected,
    isConnectedToCorrectNetwork,
    bigIntReplacer,
  } = useWagmiUtils();

  const {
    data: _cd,
    refetch: refetchCd,
    isLoading: isLoadingCd,
  } = useContractRead({
    functionName: "cooldownSeconds",
    enabled: Boolean(isWalletConnected && isConnectedToCorrectNetwork),
    ...ct,
  });

  const cooldown = useMemo(() => {
    if (_cd) {
      const _replacer = JSON.stringify(_cd, bigIntReplacer);
      const _cdNumber = hexToNumber(JSON.parse(_replacer) as Web3Address);
      return _cdNumber;
    } else return null;
  }, [_cd]);

  const {
    data: _mappingLastSubmittal,
    refetch: refetchMappingLastSubmittal,
    isFetching: isFetchingMapping,
    isLoading: isLoadingMappingLastSubmittal,
  } = useContractRead({
    functionName: "lastSubmittal",
    args: [address],
    enabled: Boolean(isWalletConnected && isConnectedToCorrectNetwork),
    ...ct,
  });

  const mappingLastSubmittal = useMemo(() => {
    if (_mappingLastSubmittal) {
      const _replacer = JSON.stringify(_mappingLastSubmittal, bigIntReplacer);
      const _mLsNumber = hexToNumber(JSON.parse(_replacer) as Web3Address);
      return _mLsNumber;
    } else return null;
  }, [_mappingLastSubmittal]);

  const isOnCooldown = useMemo(() => {
    if (cooldown && mappingLastSubmittal) {
      const _endDate = mappingLastSubmittal + cooldown;
      const _now = unixNow();
      const onCd = _now < _endDate;
      return {
        df: new Date(_endDate * 1000),
        endDate: _endDate,
        isOnCd: onCd,
      };
    }
    return {
      df: null,
      endDate: null,
      isOnCd: false,
    };
  }, [cooldown, mappingLastSubmittal, isFetchingMapping]);

  return {
    address,
    isWalletConnected,
    cooldown,
    refetchCd,
    isLoadingCd,
    mappingLastSubmittal,
    refetchMappingLastSubmittal,
    isFetchingMapping,
    isLoadingMappingLastSubmittal,
    isOnCooldown,
  };
};
