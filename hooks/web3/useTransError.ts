import { WagmiTransError } from "../../types/web3";
import { useWagmiUtils } from "../../hooks/web3/useWagmiUtils";

export type TransError = WagmiTransError | undefined | null;

export interface UseTransErrorOptions {
  prepareErrors?: TransError[];
  txErrors?: TransError[];
}

export interface UseTransErrorOutput {
  isError: boolean;
  error?: Error;
}

export const useTransError = function ({
  prepareErrors = [],
  txErrors = []
}: UseTransErrorOptions): UseTransErrorOutput {
  const { bigIntReplacer } = useWagmiUtils();
  const prepErrors = prepareErrors.reduce((errs, err) => {
    if (!err) return errs;

    console.debug("useTransError:: error", JSON.stringify(err, bigIntReplacer));
    const msg = err.reason
      ? err.reason.replace("execution reverted: ", "prepare trans failed: ")
      : err.message;
    errs.push(new Error(msg));
    return errs;
  }, [] as Error[]);

  const transErrors = txErrors
    .filter((err) => !!err)
    .map((err) => new Error(err?.reason || err?.message));

  const allErrors = [...prepErrors, ...transErrors];

  return {
    isError: allErrors.length > 0,
    error: allErrors[0]
  };
};
