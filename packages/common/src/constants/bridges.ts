export const ORAI_BRIDGE_UDENOM = "uoraib";
export const ORAI_BRIDGE_EVM_FEE = "1";
export const ORAI_BRIDGE_CHAIN_FEE = "1";

export const BRIDGE_DENOM_PREFIX = {
  BSC: "oraib",
  ETH: "eth-mainnet",
  TRON: "trontrx-mainnet",
};

export const BRIDGE_PROXY_CONTRACTS = {
  "0x38": "0x9a0A02B296240D2620E339cCDE386Ff612f07Be5",
  "0x01": "0x9a0A02B296240D2620E339cCDE386Ff612f07Be5",
  // tron format TLXrPtQor6xxF2HeQtmKJUUkVNjJZVsgTM
  "0x2b6653dc": "0x73Ddc880916021EFC4754Cb42B53db6EAB1f9D64",
};

export const IBC_WASM_CONTRACT =
  "orai195269awwnt5m6c843q6w7hp8rt0k7syfu9de4h0wz384slshuzps8y7ccm";
export const IBC_WASM_CONTRACT_TEST =
  "orai1jtt8c2lz8emh8s708y0aeduh32xef2rxyg8y78lyvxn806cu7q0sjtxsnv";

export type BridgeDenomPrefix = keyof typeof BRIDGE_DENOM_PREFIX;
