"use client";

import { useMemo, useState } from "react";
import {
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction
} from "wagmi";
import { useContractInfo } from "@/hooks/web3/useContractInfo";
import { useWagmiUtils } from "@/hooks/web3/useWagmiUtils";
import { hexToNumber } from "viem";
import { Web3Address } from "@/types/web3";
import { unixNow } from "@/utils/unixTime";
import { TransError, useTransError } from "@/hooks/web3/useTransError";

export const useSurveyCt = () => {
  const [answersIds, setAnswersIds] = useState<number[] | null>(null);
  const ct = useContractInfo();
  const {
    address,
    isWalletConnected,
    isConnectedToCorrectNetwork,
    bigIntReplacer,
    accountNonce
  } = useWagmiUtils();

  const {
    data: _cd,
    refetch: refetchCd,
    isLoading: isLoadingCd
  } = useContractRead({
    functionName: "cooldownSeconds",
    enabled: Boolean(isWalletConnected && isConnectedToCorrectNetwork),
    ...ct
  });

  const cooldown = useMemo(() => {
    if (_cd) {
      const _replacer = JSON.stringify(_cd, bigIntReplacer);
      const _cdNumber = hexToNumber(JSON.parse(_replacer) as Web3Address);
      return _cdNumber;
    } else return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_cd]);

  const {
    data: _mappingLastSubmittal,
    refetch: refetchMappingLastSubmittal,
    isFetching: isFetchingMapping,
    isLoading: isLoadingMappingLastSubmittal
  } = useContractRead({
    functionName: "lastSubmittal",
    args: [address],
    enabled: Boolean(isWalletConnected && isConnectedToCorrectNetwork),
    ...ct
  });

  const mappingLastSubmittal = useMemo(() => {
    if (_mappingLastSubmittal) {
      const _replacer = JSON.stringify(_mappingLastSubmittal, bigIntReplacer);
      const _mLsNumber = hexToNumber(JSON.parse(_replacer) as Web3Address);
      return _mLsNumber;
    } else return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_mappingLastSubmittal]);

  const isOnCooldown = useMemo(() => {
    if (cooldown && mappingLastSubmittal) {
      const _endDate = mappingLastSubmittal + cooldown;
      const _now = unixNow();
      const onCd = _now < _endDate;
      return {
        df: new Date(_endDate * 1000),
        endDate: _endDate,
        isOnCd: onCd
      };
    }
    return {
      df: null,
      endDate: null,
      isOnCd: false
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cooldown, mappingLastSubmittal, isFetchingMapping]);

  const surveyIdBigInt = useMemo(() => {
    return accountNonce ? BigInt(accountNonce) : BigInt(0);
  }, [accountNonce]);

  const answersIdsBigInt = useMemo(() => {
    console.log("answersIdsBigInt", answersIds);

    return answersIds ? answersIds.map((id) => BigInt(id)) : null;
  }, [answersIds]);

  const { config } = usePrepareContractWrite({
    ...ct,
    functionName: "submit",
    args: [surveyIdBigInt, answersIdsBigInt],
    enabled: Boolean(isWalletConnected && surveyIdBigInt && answersIdsBigInt),
    account: address
  });

  const {
    data: submitTxData,
    error: submitTxError,
    write: submit
  } = useContractWrite(config);

  const {
    isLoading: submitTxLoading,
    isSuccess: submitTxSuccess,
    error: submitConfirmTxError
  } = useWaitForTransaction({
    chainId: ct.chainId,
    confirmations: 2,
    cacheTime: Infinity,
    hash: submitTxData?.hash
  });

  const errResult = useTransError({
    txErrors: [submitTxError, submitConfirmTxError] as TransError[]
  });

  return {
    setAnswersIds,
    cooldown,
    refetchCd,
    isLoadingCd,
    mappingLastSubmittal,
    refetchMappingLastSubmittal,
    isFetchingMapping,
    isLoadingMappingLastSubmittal,
    isOnCooldown,
    submit,
    submitTxData,
    submitTxLoading,
    submitTxSuccess,
    ...errResult
  };
};
