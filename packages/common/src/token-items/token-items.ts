import { flatten, uniqBy } from "lodash";
import { CustomChainInfo } from "../chain-infos";
import { COSMOS_CHAIN_IDS } from "../constants/chain-ids";
import { IBC_DENOMS } from "../constants/denoms";
import { TokenItemType } from "./types";
import {
  ChainInfoReader,
  ChainInfoReaderImpl
} from "../chain-infos/chain-info-reader";
import { NETWORK_TYPES } from "../constants/network";

export interface TokenItems {
  otherChainTokens: TokenItemType[];
  oraichainTokens: TokenItemType[];
  tokens: TokenItemType[];
  flattenTokens: TokenItemType[];
  tokenMap: { [k: string]: TokenItemType };
  assetInfoMap: { [k: string]: TokenItemType };
  cosmosTokens: TokenItemType[];
  cw20Tokens: TokenItemType[];
  cw20TokenMap: { [k: string]: TokenItemType };
  evmTokens: TokenItemType[];
  kawaiiTokens: TokenItemType[];
}

export class TokenItemsImpl implements TokenItems {
  constructor(public readonly chainInfos: CustomChainInfo[]) {}

  static async create(chainInfoReader: ChainInfoReader) {
    const chainInfos = await chainInfoReader.readChainInfos();
    const tokenItems = new TokenItemsImpl(chainInfos);
    return tokenItems;
  }

  private getTokensFromNetwork = (
    network: CustomChainInfo
  ): TokenItemType[] => {
    if (!network) return [];
    const evmDenomsMap = {
      kwt: [IBC_DENOMS.KWTBSC],
      milky: [IBC_DENOMS.MILKYBSC],
      injective: [IBC_DENOMS.INJECTIVE]
    };
    return network.currencies.map((currency) => {
      const evmDenoms =
        network.chainId === COSMOS_CHAIN_IDS.ORAICHAIN
          ? evmDenomsMap[currency.coinMinimalDenom]
          : undefined;
      return {
        name: currency.coinDenom,
        org: network.chainName,
        coinType: network.bip44.coinType,
        contractAddress: currency.contractAddress,
        prefix:
          currency?.prefixToken ?? network.bech32Config?.bech32PrefixAccAddr,
        coinGeckoId: currency.coinGeckoId,
        denom: currency.coinMinimalDenom,
        bridgeNetworkIdentifier: currency.bridgeNetworkIdentifier,
        decimals: currency.coinDecimals,
        bridgeTo: currency.bridgeTo,
        chainId: network.chainId,
        rpc: network.rpc,
        lcd: network.rest,
        cosmosBased: network.networkType === NETWORK_TYPES.COSMOS,
        maxGas: (network.feeCurrencies?.[0].gasPriceStep?.high ?? 0) * 20000,
        gasPriceStep: currency.gasPriceStep,
        feeCurrencies: network.feeCurrencies,
        evmDenoms
      };
    });
  };

  get otherChainTokens() {
    return flatten(
      this.chainInfos
        .filter((chainInfo) => chainInfo.chainId !== COSMOS_CHAIN_IDS.ORAICHAIN)
        .map(this.getTokensFromNetwork)
    );
  }

  get oraichainTokens() {
    return this.getTokensFromNetwork(
      this.chainInfos.find(
        (chain) => chain.chainId === COSMOS_CHAIN_IDS.ORAICHAIN
      )
    );
  }

  get tokens() {
    return [...this.otherChainTokens, ...this.oraichainTokens];
  }

  get flattenTokens() {
    return flatten(this.tokens);
  }

  get tokenMap() {
    return Object.fromEntries(this.flattenTokens.map((c) => [c.denom, c]));
  }

  get assetInfoMap() {
    return Object.fromEntries(
      this.flattenTokens.map((c) => [c.contractAddress || c.denom, c])
    );
  }

  get cosmosTokens() {
    return uniqBy(
      this.flattenTokens.filter(
        (token) =>
          // !token.contractAddress &&
          token.denom && token.cosmosBased && token.coinGeckoId
      ),
      (c) => c.denom
    );
  }

  get cw20Tokens() {
    return uniqBy(
      this.cosmosTokens.filter(
        // filter cosmos based tokens to collect tokens that have contract addresses
        (token) =>
          // !token.contractAddress &&
          token.contractAddress
      ),
      (c) => c.denom
    );
  }

  get cw20TokenMap() {
    return Object.fromEntries(
      this.cw20Tokens.map((c) => [c.contractAddress, c])
    );
  }

  get evmTokens() {
    return uniqBy(
      this.flattenTokens.filter(
        (token) =>
          // !token.contractAddress &&
          token.denom &&
          !token.cosmosBased &&
          token.coinGeckoId &&
          token.chainId !== "kawaii_6886-1"
      ),
      (c) => c.denom
    );
  }

  get kawaiiTokens() {
    return uniqBy(
      this.cosmosTokens.filter((token) => token.chainId === "kawaii_6886-1"),
      (c) => c.denom
    );
  }
}
