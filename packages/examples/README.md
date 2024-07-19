# Oraichain Examples

| A collection of examples on how to interact with the Oraichain network using popular Cosmos JS SDKs. |
| ---------------------------------------------------------------------------------------------------- |

## Basic client interaction

```ts
// packages/examples/src/cosmjs-stargate/basic.ts
import { GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import dotenv from "dotenv";
import { ORAI } from "@oraichain/common";
dotenv.config();

(async () => {
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(
    process.env.EXAMPLES_MNEMONIC,
    { prefix: ORAI }
  ); // replace your mnemonic here
  const accounts = await signer.getAccounts();
  const address = accounts[0].address;
  const client = await SigningStargateClient.connectWithSigner(
    "https://rpc.orai.io",
    signer,
    { gasPrice: GasPrice.fromString("0.001orai") }
  );

  const account = await client.getAccount(address);
  const sendTokensResult = await client.sendTokens(
    address,
    address,
    [{ denom: ORAI, amount: "1" }],
    "auto",
    "Oraichain Labs demo sending tokens"
  );

  console.dir(account, { depth: null });
  console.log(sendTokensResult.transactionHash);
})();
```

Here, we create a signer from a prepared mnemonic with the signer prefix being `orai`

Next, we get the first address of the account list before creating a new `SigningStargateClient` with signer. Note that the `gasPrice` should have `orai` as fees in it.

Finally, we try querying the account information and create a basic `MsgSend` transaction to send to itself.

## Custom chain registry

```ts
// packages/examples/src/cosmjs-stargate/custom-chain-registry.ts
import {
  GasPrice,
  SigningStargateClient,
  defaultRegistryTypes as defaultStargateTypes
} from "@cosmjs/stargate";
import { wasmTypes } from "@cosmjs/cosmwasm-stargate";

const customRegistry = new Registry([...defaultStargateTypes, ...wasmTypes]);
const client = await SigningStargateClient.connectWithSigner(
  "https://rpc.orai.io",
  signer,
  { gasPrice: GasPrice.fromString("0.001orai"), registry: customRegistry }
);
```

You can add custom module messages from cosmwasm, clock, ethermint,... into the client and broadcast transactions using these custom messages.

## CosmWasm interaction

```ts
// packages/examples/src/cosmwasm-stargate/basic.ts
import dotenv from "dotenv";
import { ORAI_TOKEN_CONTRACTS } from "@oraichain/common";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
dotenv.config();

(async () => {
  const client = await SigningCosmWasmClient.connect("https://rpc.orai.io");
  const result = await client.queryContractSmart(ORAI_TOKEN_CONTRACTS.USDC, {
    token_info: {}
  });
  console.log(result);
})();
```

## (Advanced) ABCI Query with Proof

```ts
// packages/examples/cosmjs-stargate/abci-query-with-proof.ts
import { fromBech32 } from "@cosmjs/encoding";
import { QueryClient } from "@cosmjs/stargate";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { ORAI_TOKEN_CONTRACTS } from "@oraichain/common";

const encodeNamespaces = (namespaces: Uint8Array[]): Uint8Array => {
  const ret = [];
  for (const ns of namespaces) {
    const lengthBuf = Buffer.allocUnsafe(2);
    console.log(ns.byteLength);
    lengthBuf.writeUInt16BE(ns.byteLength);
    ret.push(lengthBuf);
    ret.push(ns);
  }
  return Buffer.concat(ret);
};

(async () => {
  const tmClient = await Tendermint37Client.connect("https://rpc.orai.io");
  const queryClient = new QueryClient(tmClient as any);
  const contract = fromBech32(ORAI_TOKEN_CONTRACTS.USDC);
  const result = await queryClient.queryRawProof(
    "wasm",
    Uint8Array.from([3, ...contract.data, ...Buffer.from("token_info")])
  );

  console.log(result.proof.ops);
  console.log(Buffer.from(result.value).toString());
})();
```

You can actually query any blockchain state using the low level method called `abciQuery`.

Here, the `QueryClient` just wraps it with the method `queryRawProof` for further processing.

The key here is to understand the `queryKey` works. In Cosmos SDK stores, a state is usually prefixed with /module-name/key-prefix/data

Here, the module name is `wasm`, the key prefix is `3`, which is querying the contract state, the remaining is the concat of the query values.

## License

[GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)
