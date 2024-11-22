import { TokenItemType } from "src/token-items";

/**
 * Determine if the denom is native token or not
 * @param denom denom of token or coin
 * @param prefixCw20 prefix of non-native token. Default is "orai1"
 * @returns true if the denom is native token of Oraichain, false otherwise
 */
export const isNative = (denom: string, prefixCw20: string = "orai1") => {
  if (denom.startsWith(prefixCw20)) {
    return false;
  }
  return true;
};

export const extractCosmosDenomOrCW20Address = (token: TokenItemType) => {
  return token.contractAddress ? token.contractAddress : token.denom;
}
