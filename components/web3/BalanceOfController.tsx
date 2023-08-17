"use client";

import React, { useState, useEffect } from "react";
import { useWagmiUtils } from "@/hooks/web3/useWagmiUtils";

enum Stages {
  hidden = "not connected",
  loading = "loading",
  balanceOf = "balance of",
}

const BalanceOfController = () => {
  const [stage, setStage] = useState(Stages.hidden);
  const {
    tokenBalanceOf,
    isLoadingTokenBalanceOf,
    isWalletConnected,
    isConnectedToCorrectNetwork,
    refetchTokenBalanceOf
  } = useWagmiUtils();

  useEffect(() => {
    if (isWalletConnected && isConnectedToCorrectNetwork) {
      if (!isLoadingTokenBalanceOf && tokenBalanceOf) {
        if (stage !== Stages.balanceOf) {
          setStage(Stages.balanceOf);
        }
        return;
      } else if (isLoadingTokenBalanceOf) {
        if (stage !== Stages.loading) {
          setStage(Stages.loading);
        }
        return;
      }
    } else {
      if (stage !== Stages.hidden) {
        setStage(Stages.hidden);
      }
      return;
    }
  }, [
    stage,
    isWalletConnected,
    isConnectedToCorrectNetwork,
    isLoadingTokenBalanceOf,
    tokenBalanceOf,
    refetchTokenBalanceOf
  ]);

  return (
    <>
      {stage === Stages.loading && (
        <>
          <p>loading balance...</p>
        </>
      )}
      {stage === Stages.hidden && (
        <>
          <p>hidden</p>
        </>
      )}
      {stage === Stages.balanceOf && (
        <>
          <div className="p-2 w-fit border border-solid border-gray-400 rounded-full bg-gray-200 dark:bg-gray-800 dark:border-gray-200">
            <p>
              {tokenBalanceOf?.symbol} : {tokenBalanceOf?.formatted}
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default BalanceOfController;
