# Oraichain Common

This package contains a number of cosmos-sdk, evm and bitcoin based chains. Each chain info is represented as a json file with chain id as the filename. The chain info contains data that makes it easy to start running or interacting with a node.

Schema files containing the recommended metadata structure can be found in the `*.schema.json` files located in each sub directory. Schemas are still undergoing revision as user needs are surfaced. Optional fields may be added beyond what is contained in the schema files.

## Contributing

We accept pull requests to add a new chain or IBC infos.

When creating Pull Requests, please provide a title that clearly describes the change, rather than using the default commit title. Titles like "Add chain" are too vague and make it hard to navigate the backlog of Pull Requests. Include specific details such as the affected Chain Name, API types, or Provider. For example, use "Add Oraichain chain info" instead.

## Sample

A sample `Oraichain.json` includes the following information.

```json
{
  "$schema": "../chain.schema.json",
  "rpc": "https://rpc.orai.io",
  "rest": "https://lcd.orai.io",
  "chainId": "Oraichain",
  "chainName": "Oraichain",
  "networkType": "cosmos",
  "stakeCurrency": {
    "coinDenom": "ORAI",
    "coinMinimalDenom": "orai",
    "coinDecimals": 6,
    "coinGeckoId": "oraichain-token",
    "bridgeTo": ["0x38", "0x01", "injective-1"],
    "coinImageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/7533.png",
    "gasPriceStep": { "low": 0.003, "average": 0.005, "high": 0.007 }
  },
  "feeCurrencies": [
    {
      "coinDenom": "ORAI",
      "coinMinimalDenom": "orai",
      "coinDecimals": 6,
      "coinGeckoId": "oraichain-token",
      "bridgeTo": ["0x38", "0x01", "injective-1"],
      "coinImageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/7533.png",
      "gasPriceStep": { "low": 0.003, "average": 0.005, "high": 0.007 }
    }
  ],
  "bip44": { "coinType": 118 },
  "bech32Config": {
    "bech32PrefixAccAddr": "orai",
    "bech32PrefixAccPub": "oraipub",
    "bech32PrefixValAddr": "oraivaloper",
    "bech32PrefixValPub": "oraivaloperpub",
    "bech32PrefixConsAddr": "oraivalcons",
    "bech32PrefixConsPub": "oraivalconspub"
  },
  "features": [
    "stargate",
    "ibc-transfer",
    "cosmwasm",
    "wasmd_0.24+",
    "no-legacy-stdTx"
  ],
  "txExplorer": {
    "name": "Oraiscan",
    "txUrl": "https://scan.orai.io/txs/{txHash}",
    "accountUrl": "https://scan.orai.io/account/{address}"
  },
  "currencies": [
    {
      "coinDenom": "ORAI",
      "coinMinimalDenom": "orai",
      "coinDecimals": 6,
      "coinGeckoId": "oraichain-token",
      "bridgeTo": ["0x38", "0x01", "injective-1"],
      "coinImageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/7533.png",
      "gasPriceStep": { "low": 0.003, "average": 0.005, "high": 0.007 }
    },
    {
      "coinDenom": "ATOM",
      "coinGeckoId": "cosmos",
      "coinMinimalDenom": "ibc/A2E2EEC9057A4A1C2C0A6A4C78B0239118DF5F278830F50B4A6BDD7A66506B78",
      "bridgeTo": ["cosmoshub-4"],
      "coinDecimals": 6,
      "coinImageUrl": "https://dhj8dql1kzq2v.cloudfront.net/white/atom.png"
    },
    {
      "coinDenom": "NTMPI",
      "coinGeckoId": "neutaro",
      "coinMinimalDenom": "ibc/576B1D63E401B6A9A071C78A1D1316D016EC9333D2FEB14AD503FAC4B8731CD1",
      "bridgeTo": ["Neutaro-1"],
      "coinDecimals": 6,
      "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/Neutaro/chain.png"
    },
    {
      "coinDenom": "AIRI",
      "coinGeckoId": "airight",
      "coinMinimalDenom": "airi",
      "type": "cw20",
      "contractAddress": "orai10ldgzued6zjp0mkqwsv2mux3ml50l97c74x8sg",
      "bridgeTo": ["0x38"],
      "coinDecimals": 6,
      "coinImageUrl": "https://i.ibb.co/m8mCyMr/airi.png"
    },
    {
      "coinDenom": "USDT",
      "coinGeckoId": "tether",
      "coinMinimalDenom": "usdt",
      "type": "cw20",
      "contractAddress": "orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh",
      "bridgeTo": ["0x38", "0x2b6653dc", "0x01"],
      "coinDecimals": 6,
      "coinImageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png"
    },
    {
      "coinDenom": "USDC",
      "coinGeckoId": "usd-coin",
      "coinMinimalDenom": "usdc",
      "type": "cw20",
      "contractAddress": "orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd",
      "bridgeTo": ["0x01", "noble-1"],
      "coinDecimals": 6,
      "coinImageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
    },
    {
      "coinDenom": "OSMO",
      "coinMinimalDenom": "ibc/9C4DCD21B48231D0BC2AC3D1B74A864746B37E4292694C93C617324250D002FC",
      "coinDecimals": 6,
      "coinGeckoId": "osmosis",
      "bridgeTo": ["osmosis-1"],
      "coinImageUrl": "https://dhj8dql1kzq2v.cloudfront.net/white/osmo.png"
    },
    {
      "coinDenom": "BEP20 KWT",
      "coinGeckoId": "kawaii-islands",
      "coinMinimalDenom": "ibc/4F7464EEE736CCFB6B444EB72DE60B3B43C0DD509FFA2B87E05D584467AAE8C8",
      "coinDecimals": 18,
      "coinImageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/12313.png"
    },
    {
      "coinDenom": "KWT",
      "coinGeckoId": "kawaii-islands",
      "coinMinimalDenom": "kwt",
      "type": "cw20",
      "contractAddress": "orai1nd4r053e3kgedgld2ymen8l9yrw8xpjyaal7j5",
      "bridgeTo": ["kawaii_6886-1", "0x38"],
      "coinDecimals": 6,
      "coinImageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/12313.png"
    },
    {
      "coinDenom": "BEP20 MILKY",
      "coinGeckoId": "milky-token",
      "coinMinimalDenom": "ibc/E12A2298AC40011C79F02F26C324BD54DF20F4B2904CB9028BFDEDCFAA89B906",
      "coinDecimals": 18,
      "coinImageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/14418.png"
    },
    {
      "coinDenom": "MILKY",
      "coinGeckoId": "milky-token",
      "coinMinimalDenom": "milky",
      "type": "cw20",
      "contractAddress": "orai1gzvndtzceqwfymu2kqhta2jn6gmzxvzqwdgvjw",
      "bridgeTo": ["kawaii_6886-1", "0x38"],
      "coinDecimals": 6,
      "coinImageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/14418.png"
    },
    {
      "coinDenom": "ORAIX",
      "coinMinimalDenom": "oraix",
      "type": "cw20",
      "contractAddress": "orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge",
      "bridgeTo": ["0x01"],
      "coinGeckoId": "oraidex",
      "coinDecimals": 6,
      "coinImageUrl": "https://i.ibb.co/VmMJtf7/oraix.png"
    },
    {
      "coinDenom": "scORAI",
      "coinMinimalDenom": "scorai",
      "type": "cw20",
      "contractAddress": "orai1065qe48g7aemju045aeyprflytemx7kecxkf5m7u5h5mphd0qlcs47pclp",
      "coinGeckoId": "scorai",
      "coinDecimals": 6
    },
    {
      "coinDenom": "wTRX",
      "coinGeckoId": "tron",
      "coinMinimalDenom": "trx",
      "type": "cw20",
      "contractAddress": "orai1c7tpjenafvgjtgm9aqwm7afnke6c56hpdms8jc6md40xs3ugd0es5encn0",
      "bridgeTo": ["0x2b6653dc"],
      "coinDecimals": 6,
      "coinImageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png"
    },
    {
      "coinDenom": "scATOM",
      "coinMinimalDenom": "scatom",
      "type": "cw20",
      "contractAddress": "orai19q4qak2g3cj2xc2y3060t0quzn3gfhzx08rjlrdd3vqxhjtat0cq668phq",
      "coinGeckoId": "scatom",
      "coinDecimals": 6
    },
    {
      "coinDenom": "IBC INJ",
      "coinGeckoId": "injective-protocol",
      "coinMinimalDenom": "ibc/49D820DFDE9F885D7081725A58202ABA2F465CAEE4AFBC683DFB79A8E013E83E",
      "coinDecimals": 18,
      "coinImageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/7226.png"
    },
    {
      "coinDenom": "INJ",
      "coinGeckoId": "injective-protocol",
      "coinMinimalDenom": "injective",
      "contractAddress": "orai19rtmkk6sn4tppvjmp5d5zj6gfsdykrl5rw2euu5gwur3luheuuusesqn49",
      "bridgeTo": ["injective-1"],
      "type": "cw20",
      "coinDecimals": 6,
      "coinImageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/7226.png"
    },
    {
      "coinDenom": "WETH",
      "coinGeckoId": "weth",
      "coinMinimalDenom": "weth",
      "type": "cw20",
      "contractAddress": "orai1dqa52a7hxxuv8ghe7q5v0s36ra0cthea960q2cukznleqhk0wpnshfegez",
      "bridgeTo": ["0x01"],
      "coinDecimals": 6,
      "coinImageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"
    },
    {
      "coinDenom": "BTC",
      "coinGeckoId": "bitcoin",
      "coinMinimalDenom": "usat",
      "type": "cw20",
      "contractAddress": "orai10g6frpysmdgw5tdqke47als6f97aqmr8s3cljsvjce4n5enjftcqtamzsd",
      "coinDecimals": 6,
      "coinImageUrl": "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"
    },
    {
      "coinDenom": "OCH",
      "coinGeckoId": "och",
      "coinMinimalDenom": "och",
      "type": "cw20",
      "contractAddress": "orai1hn8w33cqvysun2aujk5sv33tku4pgcxhhnsxmvnkfvdxagcx0p8qa4l98q",
      "bridgeTo": ["0x01"],
      "coinDecimals": 6,
      "coinImageUrl": "https://assets.coingecko.com/coins/images/34236/standard/orchai_logo_white_copy_4x-8_%281%29.png?1704307670"
    }
  ]
}
```

### Convert type to json schema

```bash
yarn typescript-json-schema packages/common/src/chain-infos/types.ts CustomChainInfo --out chain.schema.json --required --esModuleInterop true --ignoreErrors
```
