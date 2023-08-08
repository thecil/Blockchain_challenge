import React from 'react'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { useWagmiUtils } from '@/hooks/web3/useWagmiUtils';
import { abi_survey } from '@/data/web3/contracts/abi_survey';
import { useContractInfo } from '@/hooks/web3/useContractInfo';
import { parseEther } from "viem";
import { Web3Address } from "@/types/web3";

const SubmitSurvey = () => {
    const { address, isWalletConnected } = useWagmiUtils();
    const _ct = useContractInfo();
    const ct = {
      address: _ct.address,
      chainId: _ct.chainId,
      abi: abi_survey,
    };

    const { config, error } =
    usePrepareContractWrite({
      ...ct,
      functionName: "submit",
      args: [],
      enabled: Boolean(isWalletConnected),
      account: address,
    });

  const {
    data: faucetTxData,
    error: faucetTxError,
    write: faucet,
  } = useContractWrite(config);

  const {
    isLoading: faucetTxLoading,
    isSuccess: faucetTxSuccess,
    error: faucetConfirmTxError,
  } = useWaitForTransaction({
    chainId: ct.chainId,
    confirmations: 2,
    cacheTime: Infinity,
    hash: faucetTxData?.hash,
  });

    return (
    <div>SubmitSurvey</div>
  )
}

export default SubmitSurvey;