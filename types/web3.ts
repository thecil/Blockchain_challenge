import { Address } from "wagmi";

export type HexString = Address;
export type Web3Address = Address;

export interface WagmiTransError extends Error {
  reason: string;
  code: string;
  method: string;
  transaction: {
    from: Web3Address;
    to: Web3Address;
    value: any;
    data: HexString;
  };
  error: {
    code: number;
    message: string;
    data: {
      originalError: {
        code: number;
        data: HexString;
        message: string;
      };
    };
  };
}