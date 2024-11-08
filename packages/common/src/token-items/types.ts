import { FeeCurrency } from "@keplr-wallet/types";

export type TokenItemType = {
  name: string;
  org: string;
  denom: string;
  prefix?: string;
  contractAddress?: string;
  evmDenoms?: string[];
  bridgeNetworkIdentifier?: string;
  bridgeTo?: string[];
  chainId: string;
  coinType?: number;
  rpc: string;
  decimals: number;
  maxGas?: number;
  coinGeckoId: string;
  cosmosBased: boolean;
  gasPriceStep?: {
    readonly low: number;
    readonly average: number;
    readonly high: number;
  };
  feeCurrencies?: FeeCurrency[];
  icon: string;
};
