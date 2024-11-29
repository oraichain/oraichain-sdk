export const EVM_CHAIN_IDS = {
  ETH: "0x01",
  BSC: "0x38",
  KAWAII_EVM: "0x1ae6",
  TRON: "0x2b6653dc"
} as const;

// cosmos chainId
export const COSMOS_CHAIN_IDS = {
  ORAICHAIN: "Oraichain",
  ORAIBRIDGE: "oraibridge-subnet-2",
  OSMOSIS: "osmosis-1",
  COSMOSHUB: "cosmoshub-4",
  INJECTVE: "injective-1",
  KAWAII_COSMOS: "kawaii_6886-1",
  NOBLE: "noble-1",
  NEUTARO: "Neutaro-1",
  CELESTIA: "celestia"
} as const;

export const TON_CHAIN_ID = {
  TON_MAINNET: "ton",
  TON_TESTNET: "ton_testnet"
} as const;

export const BITCOIN_CHAIN_ID = {
  BITCOIN_MAINNET: "bitcoin"
} as const;

export const EVM_CHAIN_IDS_DECIMAL = {
  mainnet: 1,
  ropsten: 3,
  rinkeby: 4,
  goerli: 5,
  optimism: 10,
  kovan: 42,
  matic: 137,
  kovanOptimism: 69,
  xdai: 100,
  goerliOptimism: 420,
  arbitrum: 42161,
  rinkebyArbitrum: 421611,
  goerliArbitrum: 421613,
  mumbai: 80001,
  sepolia: 11155111,
  avalancheMainnet: 43114,
  avalancheFuji: 43113,
  fantomTestnet: 4002,
  fantom: 250,
  bsc: 56,
  bsc_testnet: 97,
  moonbeam: 1284,
  moonriver: 1285,
  moonbaseAlphaTestnet: 1287,
  harmony: 1666600000,
  cronos: 25,
  fuse: 122,
  songbirdCanaryNetwork: 19,
  costonTestnet: 16,
  boba: 288,
  aurora: 1313161554,
  astar: 592,
  okc: 66,
  heco: 128,
  metis: 1088,
  rsk: 30,
  rskTestnet: 31,
  evmos: 9001,
  evmosTestnet: 9000,
  thundercore: 108,
  thundercoreTestnet: 18,
  oasis: 26863,
  celo: 42220,
  godwoken: 71402,
  godwokentestnet: 71401,
  klatyn: 8217,
  milkomeda: 2001,
  kcc: 321,
  kawaiiverse: 6886,
  etherlite: 111,
  tron: 728126428
};

export type EvmChainId = (typeof EVM_CHAIN_IDS)[keyof typeof EVM_CHAIN_IDS];
export type CosmosChainId = (typeof COSMOS_CHAIN_IDS)[keyof typeof COSMOS_CHAIN_IDS];
export type TonChainId = (typeof TON_CHAIN_ID)[keyof typeof TON_CHAIN_ID];
export type BitcoinChainId = (typeof BITCOIN_CHAIN_ID)[keyof typeof BITCOIN_CHAIN_ID];
export type NetworkChainId = CosmosChainId | EvmChainId | TonChainId | BitcoinChainId;
