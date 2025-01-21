export const NETWORK_TYPES = {
  COSMOS: "cosmos",
  EVM: "evm",
  BSC: "bsc",
  TRON: "tron",
  BITCOIN: "bitcoin",
  TON: "ton",
  SVM: "svm"
} as const;

export type NetworkType = (typeof NETWORK_TYPES)[keyof typeof NETWORK_TYPES];

export type CoinType = 0 | 118 | 60 | 195 | 501 | 607; // 0 for bitcoin, 118 for cosmos, 60 for evm, 195 for tron, 501 for solana, 607 for ton??
