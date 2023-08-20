"use client";

import React, { useEffect, useState } from "react";
import { useSurveyCt } from "@/hooks/web3/contracts/useSurveyCt";
import { useWagmiUtils } from "@/hooks/web3/useWagmiUtils";
import { Countdown } from "@/components/Countdown";
import Loading from "../Loading";
import SurveyForm from "@/components/SurveyForm";

enum Stages {
  notConnected = "not connected",
  loading = "loading",
  onCooldown = "on cooldown",
  survey = "survey",
}

const SurveyController = () => {
  const [stage, setStage] = useState(Stages.notConnected);
  const { isWalletConnected, isConnectedToCorrectNetwork } = useWagmiUtils();
  const {
    refetchMappingLastSubmittal,
    isFetchingMapping,
    isLoadingMappingLastSubmittal,
    isLoadingCd,
    isOnCooldown
  } = useSurveyCt();

  useEffect(() => {
    console.log("survey controller", {
      isOnCooldown
    });

    if (isWalletConnected && isConnectedToCorrectNetwork) {
      if (!isLoadingCd && !isLoadingMappingLastSubmittal) {
        if (isOnCooldown.isOnCd) {
          if (stage !== Stages.onCooldown) {
            setStage(Stages.onCooldown);
          }
          return;
        } else if (!isOnCooldown.isOnCd) {
          if (stage !== Stages.survey) {
            setStage(Stages.survey);
          }
          return;
        }
      } else if (isLoadingCd || isLoadingMappingLastSubmittal) {
        if (stage !== Stages.loading) {
          setStage(Stages.loading);
        }
        return;
      }
    } else {
      if (stage !== Stages.notConnected) {
        setStage(Stages.notConnected);
      }
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stage,
    isWalletConnected,
    isConnectedToCorrectNetwork,
    isOnCooldown,
    isLoadingCd,
    isLoadingMappingLastSubmittal,
    isFetchingMapping
  ]);

  return (
    <>
      <div className="justify-self-center">
        {stage === Stages.loading && (
          <>
            <Loading size={64} className="text-slate-500" />
          </>
        )}
        {stage === Stages.notConnected && (
          <>
            <h1 className="font-bold text-2xl">
              {!isWalletConnected && "Please connect your wallet to start"}
              {isWalletConnected &&
                !isConnectedToCorrectNetwork &&
                "Incorrect network, please switch to Goerli or Hardhat"}
            </h1>
          </>
        )}
        {stage === Stages.onCooldown && (
          <>
            <Countdown
              expiryTimestamp={isOnCooldown.df as Date}
              onExpire={() => {
                refetchMappingLastSubmittal();
              }}
              timeFormat={{ hours: true, minutes: true, seconds: true }}
              title={"Please wait to request a new survey"}
            />
          </>
        )}
        {stage === Stages.survey && (
          <>
            <SurveyForm />
          </>
        )}
      </div>
    </>
  );
};

export default SurveyController;
