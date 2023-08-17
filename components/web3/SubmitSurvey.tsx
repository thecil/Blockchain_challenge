"use client";

import React, { useState, useEffect } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction
} from "wagmi";
import { useWagmiUtils } from "@/hooks/web3/useWagmiUtils";
import { useContractInfo } from "@/hooks/web3/useContractInfo";
import { useSurveyCt } from "@/hooks/web3/contracts/useSurveyCt";

interface SubmitSurveyProps {
  answersIds: number[];
}

const SubmitSurvey = ({ answersIds }: SubmitSurveyProps) => {
  const [surveyId, setSurveyId] = useState(3);

  const surveyIdBigInt = BigInt(surveyId);
  const answersIdsBigInt = answersIds.map((id) => BigInt(id));

  const { address, isWalletConnected, refetchTokenBalanceOf } = useWagmiUtils();
  const { refetchMappingLastSubmittal, refetchCd } = useSurveyCt();
  const ct = useContractInfo();

  const { config, error } = usePrepareContractWrite({
    ...ct,
    functionName: "submit",
    args: [surveyIdBigInt, answersIdsBigInt],
    enabled: Boolean(isWalletConnected),
    account: address,
    onError: (error) => {
      console.log("usePrepareContractWrite:submit:onError:", { error });
    }
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
    confirmations: 1,
    cacheTime: Infinity,
    hash: submitTxData?.hash
  });

  useEffect(() => {
    if (submitTxSuccess && submitTxData?.hash) {
      console.log("tx success, triggers refetchs", {
        submitTxSuccess,
        hash: submitTxData?.hash
      });
      refetchTokenBalanceOf();
      refetchMappingLastSubmittal();
      refetchCd();
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitTxSuccess]);

  return (
    <>
      <div className="d-grip gap-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
