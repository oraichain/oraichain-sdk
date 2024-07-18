import {
  FeeCurrency,
  ChainInfo,
  Bech32Config,
  Currency
} from "@keplr-wallet/types";
import { NetworkType, CoinType } from "../constants/network";

export type BridgeAppCurrency = FeeCurrency & {
  readonly bridgeTo?: string[];
  readonly coinGeckoId?: string;
  readonly bridgeNetworkIdentifier?: string;
  readonly coinDecimals: 6 | 8 | 18; // 6 for cosmos, 8 for bitcoin, 18 for evm
  readonly contractAddress?: string;
  readonly prefixToken?: string;
};

/**
 * A list of Cosmos chain infos. If we need to add / remove any chains, just directly update this variable.
 * some chain is already in wallet so we override some attributes as optional
 */
export interface CustomChainInfo
  extends Omit<
    ChainInfo,
    | "rpcConfig"
    | "restConfig"
    | "feeCurrencies"
    | "stakeCurrency"
    | "currencies"
    | "rest"
    | "bech32Config"
  > {
  readonly networkType: NetworkType;
  readonly coinType: CoinType;
  readonly bech32Config?: Bech32Config;
  readonly rest?: string; // optional, rest api tron and lcd for cosmos
  readonly stakeCurrency?: Currency;
  readonly feeCurrencies?: FeeCurrency[];
  readonly currencies: BridgeAppCurrency[];
  readonly txExplorer?: {
    readonly name: string;
    readonly txUrl: string;
    readonly accountUrl?: string;
  };
}

export interface ChainInfos {
  chainInfos: CustomChainInfo[];
  evmChains: CustomChainInfo[];
  cosmosChains: CustomChainInfo[];
}

export interface ChainInfoReader {
  readChainInfos(): Promise<CustomChainInfo[]>;
}
