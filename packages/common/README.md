# Oraichain Common

[![NPM Package][common-npm-badge]][common-npm-link]
[![GitHub Issues][common-issues-badge]][common-issues-link]
[![Discord][discord-badge]][discord-link]

| Resources common to all Oraichain ecosystem. |
| -------------------------------------------- |

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @oraichain/common
```

yarn:

```sh
yarn add @oraichain/common
```

## Quickstart

### import / require

import (ESM, TypeScript):

```ts
import { OraiCommon } from "@oraichain/common";
```

### Initialization

The `OraiCommon` class can be initialized via several ways:

#### 1. via Github API

```ts
import { OraiCommon } from "@oraichain/common";

(async () => {
  const githubAccessToken = ""; // optional for rate limit increase
  const common = await OraiCommon.initializeFromGit(githubAccessToken);
})();
```

`initializeFromGit()` will fetch all the chain infos registered on our [chain-registry](https://github.com/oraichain/oraichain-sdk/blob/master/chains) using Github API and initializes the necessary dependency classes before returning our main `OraiCommon` class.

Note that if you don't have an access token, the rate limit for using this method will be according to the [Github docs](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#primary-rate-limit-for-unauthenticated-users).

#### 2. via Github rawusercontent

```ts
import { OraiCommon } from "@oraichain/common";

(async () => {
  const common = await OraiCommon.initializeFromGitRaw({
    chainIds: ["Oraichain", "osmosis-1", "0x01"]
  });
  expect(common.chainInfos).not.undefined;
  expect(common.chainInfos?.chainInfos.length).toEqual(3);
  expect(common.chainInfos?.cosmosChains.length).toEqual(2);
  expect(common.tokenItems?.evmTokens.length).toBeGreaterThan(0);
})();
```

`initializeFromGitRaw()` takes a list of chainIds as arguments fetch their chain infos registered
on our [chain-registry](https://github.com/oraichain/oraichain-sdk/blob/master/chains) using Github rawusercontent and initializes the necessary dependency classes before returning our main `OraiCommon` class.

#### 3. via Oraichain Labs's backend API

```ts
import { OraiCommon } from "@oraichain/common";

(async () => {
  const common = await OraiCommon.initializeFromBackend();
})();
```

`initializeFromBackend()` will fetch all the chain infos registered on our [chain-registry](https://github.com/oraichain/oraichain-sdk/blob/master/chains) using a backend service and initializes the necessary dependency classes before returning our main `OraiCommon` class.

This method is preferred, as there's no rate limit.

#### 4. via a custom chain info reader (private / custom chains)

You can create a custom `ChainInfoReader` that retrieves your custom chain infos and use that to initialize the `OraiCommon` class:

```ts
import {
  ChainInfoReader,
  CustomChainInfo,
  OraiCommon
} from "@oraichain/common";

export class OurCustomChainInfoReader implements ChainInfoReader {
  async readChainInfos() {
    return [
      {
        chainId: "oraibtc-mainnet-1",
        chainName: "OraiBtc Bridge",
        rpc: "https://btc.rpc.orai.io",
        rest: "https://btc.lcd.orai.io",
        networkType: "cosmos",
        stakeCurrency: {
          coinDenom: "ORAIBTC",
          coinMinimalDenom: "uoraibtc",
          coinDecimals: 6,
          gasPriceStep: {
            low: 0,
            average: 0,
            high: 0
          },
          coinImageUrl:
            "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
        },
        bip44: {
          coinType: 118
        },
        coinType: 118,
        bech32Config: {
          bech32PrefixAccAddr: "oraibtc",
          bech32PrefixAccPub: "oraibtcpub",
          bech32PrefixValAddr: "oraibtcvaloper",
          bech32PrefixValPub: "oraibtcvaloperpub",
          bech32PrefixConsAddr: "oraibtcvalcons",
          bech32PrefixConsPub: "oraibtcvalconspub"
        },
        currencies: [
          {
            coinDenom: "ORAIBTC",
            coinMinimalDenom: "uoraibtc",
            coinDecimals: 6,
            gasPriceStep: {
              low: 0,
              average: 0,
              high: 0
            },
            coinImageUrl:
              "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
          },
          {
            coinDenom: "oBTC",
            coinMinimalDenom: "usat",
            coinDecimals: 14,
            gasPriceStep: {
              low: 0,
              average: 0,
              high: 0
            },
            coinImageUrl:
              "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
          }
        ],
        feeCurrencies: [
          {
            coinDenom: "ORAIBTC",
            coinMinimalDenom: "uoraibtc",
            coinDecimals: 6,
            gasPriceStep: {
              low: 0,
              average: 0,
              high: 0
            },
            coinImageUrl:
              "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
          },
          {
            coinDenom: "oBTC",
            coinMinimalDenom: "usat",
            coinDecimals: 14,
            gasPriceStep: {
              low: 0,
              average: 0,
              high: 0
            },
            coinImageUrl:
              "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
          }
        ],
        features: ["stargate", "ibc-transfer", "cosmwasm"]
      }
    ] as CustomChainInfo[];
  }
}

(async () => {
  const chainInfoReader = new OurCustomChainInfoReader();
  const common = await OraiCommon.initializeFromChainInfoReader(
    chainInfoReader
  );
  console.dir(common.chainInfos, { depth: null });
})();
```

### Usage

Here are some simple usage examples:

```ts
import { ChainInfoReader, OraiCommon } from "@oraichain/common";

(async () => {
  const common = await OraiCommon.initializeFromGit();
  // get total length of list cosmos chains, which is 9 by the time of writing this docs
  console.log(common.chainInfos.cosmosChains.length);
  // get total length of list evm chains, which is 4 by the time of writing this docs
  console.log(common.chainInfos.evmChains.length);
  // find the first cosmos token having chain id === "Oraichain" and show its coingeckoId, which is oraichain-token
  console.log(
    common.tokenItems.cosmosTokens.find(
      (token) => token.chainId === "Oraichain"
    )?.coinGeckoId
  );
  // get the first key of cw20 token map, which is 0xd567B3d7B8FE3C79a1AD8dA978812cfC4Fa05e75
  console.log(Object.keys(common.tokenItems.cw20TokenMap)[0]);
})();
```

## Browser

The package works on browser by default using the provided ESM build.

```ts
// declare a new global field
interface Window {
  ...;
  common: OraiCommon;
}

// initialization when init app
window.common = await OraiCommon.initializeFromGit();

// access to inner attributes like cosmos chains, token items on browser
const cosmosInfos = window.common.chainInfos.chainInfos.filter(
    (chainInfo) =>
      (chainInfo.networkType === 'cosmos' || chainInfo.bip44.coinType === 118) &&
      // TODO: ignore oraibtc
      chainInfo.chainId !== ('oraibtc-mainnet-1' as string)
  );
```

<!-- ## API

### Docs -->

<!-- Generated TypeDoc API [Documentation](./docs/README.md) -->

<!-- ## Helpers

Helper docs -->

## License

[GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/oraichain
[common-npm-badge]: https://img.shields.io/npm/v/@oraichain/common.svg
[common-npm-link]: https://www.npmjs.com/package/@oraichain/common
[common-issues-badge]: https://img.shields.io/github/issues/oraichain/oraichain-sdk/package:%20common?label=issues
[common-issues-link]: https://github.com/oraichain/oraichain-sdk/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+common"
