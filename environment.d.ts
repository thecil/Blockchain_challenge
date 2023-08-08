declare global {
    namespace NodeJS {
      interface ProcessEnv {
        // NEXT_PUBLIC_ALCHEMY_ID: string;
        NEXT_PUBLIC_SUPPORTED_CHAINS: string;
        NEXT_PUBLIC_WALLET_CONNECT_ID: string;
      }
    }
  }
  
  export {};