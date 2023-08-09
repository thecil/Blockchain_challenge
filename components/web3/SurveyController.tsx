"use client";

import React, { useEffect, useState } from "react";
import { useSurveyCt } from "@/hooks/web3/contracts/useSurveyCt";
import { useWagmiUtils } from "@/hooks/web3/useWagmiUtils";
import SubmitSurvey from "./SubmitSurvey";
import { Countdown } from "../Countdown";

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
    isOnCooldown,
  } = useSurveyCt();

  useEffect(() => {
    console.log("survey controller", {
      isOnCooldown,
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
  }, [
    stage,
    isOnCooldown,
    isLoadingCd,
    isLoadingMappingLastSubmittal,
    isFetchingMapping,
  ]);
  return (
    <>
      {stage === Stages.loading && (
        <>
          <p>loading...</p>
        </>
      )}
      {stage === Stages.notConnected && (
        <>
          <p>Not connected or incorrect network</p>
        </>
      )}
      {stage === Stages.onCooldown && (
        <>
          <Countdown
            expiryTimestamp={isOnCooldown.df as Date}
            onExpire={() => {
              console.log("should reload");
              refetchMappingLastSubmittal();
            }}
          />
        </>
      )}
      {stage === Stages.survey && (
        <>
          <SubmitSurvey />
        </>
      )}
    </>
  );
};

export default SurveyController;
