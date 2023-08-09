"use client";

import React, { useState, useEffect } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useWagmiUtils } from "@/hooks/web3/useWagmiUtils";
import { useContractInfo } from "@/hooks/web3/useContractInfo";
import { useSurveyCt } from "@/hooks/web3/contracts/useSurveyCt";

const SubmitSurvey = () => {
  const [surveyId, setSurveyId] = useState(2);
  const [answerIds, setAnswerIds] = useState([1, 2, 3]);

  const surveyIdBigInt = BigInt(surveyId);
  const answerIdsBigInt = answerIds.map((id) => BigInt(id));

  const { address, isWalletConnected, refetchTokenBalanceOf } = useWagmiUtils();
  const { refetchMappingLastSubmittal, refetchCd } = useSurveyCt();
  const ct = useContractInfo();

  const { config, error } = usePrepareContractWrite({
    ...ct,
    functionName: "submit",
    args: [surveyIdBigInt, answerIdsBigInt],
    enabled: Boolean(isWalletConnected),
    account: address,
  });

  const {
    data: submitTxData,
    error: submitTxError,
    write: submit,
  } = useContractWrite(config);

  const {
    isLoading: submitTxLoading,
    isSuccess: submitTxSuccess,
    error: submitConfirmTxError,
  } = useWaitForTransaction({
    chainId: ct.chainId,
    confirmations: 1,
    cacheTime: Infinity,
    hash: submitTxData?.hash,
  });

  useEffect(() => {
    if (submitTxSuccess && submitTxData?.hash) {
      console.log("tx success, triggers refetchs", {
        submitTxSuccess,
        hash: submitTxData?.hash,
      });
      refetchTokenBalanceOf();
      refetchMappingLastSubmittal();
      refetchCd();
    }
    return;
  }, [submitTxSuccess]);

  return (
    <>
      <div className="d-grip gap-2">
        <button
          className="px-2 border-2 rounded-full"
          disabled={!submit || submitTxLoading}
          onClick={() => submit?.()}
        >
          {submitTxLoading ? "Waiting Tx" : "Submit"}
        </button>
      </div>
    </>
  );
};

export default SubmitSurvey;
