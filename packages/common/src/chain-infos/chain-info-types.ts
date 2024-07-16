import {
  FeeCurrency,
  ChainInfo,
  Bech32Config,
  Currency,
} from "@keplr-wallet/types";

export type NetworkType = "cosmos" | "evm" | "bsc" | "tron" | "bitcoin";
export type BridgeAppCurrency = FeeCurrency & {
  readonly bridgeTo?: string[];
  readonly coinGeckoId?: string;
  readonly bridgeNetworkIdentifier?: string;
  readonly coinDecimals: 6 | 8 | 18; // 6 for cosmos, 8 for bitcoin, 18 for evm
  readonly contractAddress?: string;
  readonly prefixToken?: string;
};

export type CoinType = 0 | 118 | 60 | 195; // 0 for bitcoin, 118 for cosmos, 60 for evm, 195 for tron??

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
  readonly chainId: string;
  readonly chainName: string;
  readonly networkType: NetworkType;
  readonly bip44: {
    coinType: CoinType;
  };
  readonly coinType: CoinType,
  readonly bech32Config?: Bech32Config;
  readonly rest?: string; // optional, rest api tron and lcd for cosmos
  readonly stakeCurrency?: Currency;
  readonly feeCurrencies?: FeeCurrency[];
  readonly currencies: BridgeAppCurrency[];
  readonly hideInUI?: boolean;
  readonly txExplorer?: {
    readonly name: string;
    readonly txUrl: string;
    readonly accountUrl?: string;
  };
}
