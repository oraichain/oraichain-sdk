export const NETWORK_TYPES = {
  COSMOS: "cosmos",
  EVM: "evm",
  BSC: "bsc",
  TRON: "tron",
  BITCOIN: "bitcoin",
} as const;

export type NetworkType = (typeof NETWORK_TYPES)[keyof typeof NETWORK_TYPES];

export type CoinType = 0 | 118 | 60 | 195; // 0 for bitcoin, 118 for cosmos, 60 for evm, 195 for tron??
