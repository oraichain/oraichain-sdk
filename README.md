# Oraichain SDKs

<p align="center" width="100%">
  <br />
   <a href="https://github.com/oraichain/oraichain-sdk/blob/master/LICENSE"><img height="20" src="https://img.shields.io/badge/License-GNU%20GPL-blue.svg"></a>
   <a href="https://www.npmjs.com/package/@oraichain/common"><img height="20" src="https://img.shields.io/github/package-json/v/oraichain/oraichain-sdk?filename=packages%2Fcommon%2Fpackage.json"></a>
</p>

:information_desk_person: This repository holds various protocol building blocks of the Oraichain blockchain execution layer and is managed by the [Oraichain Labs](https://orai.io/) team. There is a [chain registry mechanism](./CHAIN_REGISTRY.md) that allows EVM, Cosmos-based, and other L1 blockchains to integrate with the Oraichain ecosystem, including cross-chain bridges and IBC connections.

All libraries are bound together by the core [Common library](https://www.npmjs.com/package/@oraichain/common) keeping track of chain specifics and useful helpers. They are complemented by helper packages providing helper functionalities like bigdecimals, transaction parsers, signatures, types and others.

## 📦 Packages

| Name                                                                                        | Description                                  |
| ------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [@oraichain/common](https://github.com/oraichain/oraichain-sdk/tree/master/packages/common) | Resources common to all Oraichain ecosystem. |

## 💰 Wallets

OWallet is a non-custodial wallet, a universal gateway to Web3 in single native wallet built and powered by Oraichain Labs. For more information, please checkout our [OWallet documentation](https://docs.owallet.dev/)

For interacting with Oraichain via other non-custodial wallets like Keplr, Ledger, Metamask, TrustWallet, or dApps, please refer to [this documentaion](https://)

<p align="center" width="100%">
<a href="https://www.owallet.dev/">
  <img width="30px" src="https://raw.githubusercontent.com/oraichain/oraichain-sdk/main/public/images/logos/wallets/owallet.svg" />
</a>
<a href="https://www.keplr.app/">
  <img width="30px" src="https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/keplr.svg" />
</a>
<a href="https://www.ledger.com/">
  <img width="30px" src="https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/ledger.png" />
</a>
<a href="https://walletconnect.com/">
  <img width="30px" src="https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/wallet-connect.svg" />
</a>
<a href="https://trustwallet.com/">
  <img width="30px" src="https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/trust.png" />
</a>
<br />
</p>

## 🛠 Developing

Checkout the repository and bootstrap the yarn workspace:

```sh
# Clone the repo.
git clone https://github.com/oraichain/oraichain-sdk
cd oraichain-sdk
yarn
```

### Testing

```sh
# Run all tests
yarn test

# ES lint
yarn eslint
```

### Building

```sh
yarn build
```

### Publishing

```
yarn deploy
```

For publishing onto NPM, you will need an credential key. Hence, it's best to let the github workflow do the work.

## Related

Checkout these related projects:

<!-- This section is for listing detailed packages from dapps (OraiDEX, Order Book) and possible examples of how to interact with Oraichain -->

## Credits

🛠 Built by Oraichain Labs — if you like our tools, please consider delegating to [OWallet validators ⚛️](https://owallet.dev/validators)

## 🪪 License

All packages are [GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html) licensed.

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating this software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the code, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
