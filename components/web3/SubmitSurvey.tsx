"use client";

import React, { useEffect } from "react";
import { useWagmiUtils } from "@/hooks/web3/useWagmiUtils";
import { useSurveyCt } from "@/hooks/web3/contracts/useSurveyCt";
import { toast } from "react-toastify";

interface SubmitSurveyProps {
  answersIds: number[];
}

const SubmitSurvey = ({ answersIds }: SubmitSurveyProps) => {
  const { refetchTokenBalanceOf } = useWagmiUtils();
  const {
    setAnswersIds,
    refetchMappingLastSubmittal,
    refetchCd,
    submit,
    submitTxData,
    submitTxLoading,
    submitTxSuccess,
    error: submitTxError
  } = useSurveyCt();

  useEffect(() => {
    setAnswersIds(answersIds);
    return;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answersIds]);

  useEffect(() => {
    if (submitTxLoading) {
      if (!toast.isActive("submitTxLoading")) {
        toast.info("Submit Tx Signed, waiting confirmation...", {
          toastId: "submitTxLoading"
        });
      }
      return;
    }
    if (submitTxError) {
      console.log("useEffect:submitTxError:", { submitTxError });

      if (!toast.isActive("submitTxError")) {
        toast.error("An error ocurred or canceled", {
          toastId: "submitTxError"
        });
      }
      return;
    }
    if (submitTxSuccess && submitTxData?.hash) {
      refetchTokenBalanceOf();
      refetchMappingLastSubmittal();
      refetchCd();

      if (!toast.isActive("submitTxSuccess")) {
        toast.success("Transaction Confirmed!", {
          toastId: "submitTxSuccess"
        });
      }
      return;
    }

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitTxSuccess, submitTxLoading, submitTxError]);

  return (
    <>
      <div className="d-grip gap-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
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
