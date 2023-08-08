'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useWagmiUtils } from "@/hooks/web3/useWagmiUtils";

enum Stages {
  notConnected = "not connected",
  loading = "loading",
  balanceOf = "balance of",
}

const BalanceOfController = () => {
  const [stage, setStage] = useState(Stages.notConnected);
  const { tokenBalanceOf, isLoadingTokenBalanceOf, isWalletConnected } =
    useWagmiUtils();

  useEffect(() => {
    if (isWalletConnected) {
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
      if (stage !== Stages.notConnected) {
        setStage(Stages.notConnected);
      }
      return;
    }
  }, [stage, isWalletConnected, isLoadingTokenBalanceOf, tokenBalanceOf]);

  return (
    <>
      {stage === Stages.loading && (
        <>
          <p>loading balance...</p>
        </>
      )}
      {stage === Stages.notConnected && <><p>hidden</p></>}
      {stage === Stages.balanceOf && (
        <>
          <p>
            {tokenBalanceOf?.symbol} : {tokenBalanceOf?.formatted}
          </p>
        </>
      )}
    </>
  );
};

export default BalanceOfController;
