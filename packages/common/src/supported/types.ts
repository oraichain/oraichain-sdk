export type SupportedChainInfo = {
  [chainId: string]: {
    coinDenoms: {
      [name: string]: string;
    };
  };
};

export interface SupportedChainInfoReader {
    readSupportedChainInfo(): Promise<SupportedChainInfo>;
}

export interface SupportedTokens {
    oraichainSupportedTokens: string[];
}