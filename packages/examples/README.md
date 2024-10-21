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

You can interact with cosmwasm smart contract. 

In this example, after creating new `SigningCosmWasmClient`, we query USDC CW20 contract state by executing `queryContractSmart` method with query message `{token_info: {}}`.

> For more awesome scripts, please visit our [CosmWasm Tools](https://github.com/oraichain/cosmwasm-tools)

## Custom query height

```ts
import { StargateClient } from "@cosmjs/stargate";
import { ORAI } from "@oraichain/common";
import { assert } from "console";
import { setTimeout } from "timers/promises";

(async () => {
  const rpc = "https://rpc.orai.io";
  const { account: distributionAccount } = await fetch(
    "https://lcd.orai.io/cosmos/auth/v1beta1/module_accounts/distribution"
  ).then((data) => data.json());

  const { address } = distributionAccount.base_account;
  const stargateClient = await StargateClient.connect(rpc);
  const latestHeight = await stargateClient.getHeight();
  const { amount: distrBalance } = await stargateClient.getBalance(
    address,
    ORAI
  );
  const stargateClientTenHeightBefore = await StargateClient.connect(rpc, {
    desiredHeight: latestHeight - 10
  });
  const stargateClientDesiredFiveHeightBefore = await StargateClient.connect(
    rpc,
    {
      desiredHeight: latestHeight - 5
    }
  );

  // query balance of distribution module at latest, 10 and 5 heights before that
  const { amount: distrBalanceTenBefore } =
    await stargateClientTenHeightBefore.getBalance(address, ORAI);
  const { amount: distrBalanceFiveBefore } =
    await stargateClientDesiredFiveHeightBefore.getBalance(address, ORAI);

  // after several blocks, the balances 10 heights before should stay the same, proving that we can query states at a specific height
  await setTimeout(2000);
  const { amount: distrBalanceTenBeforeAgain } =
    await stargateClientTenHeightBefore.getBalance(address, ORAI);
  assert(distrBalanceTenBeforeAgain === distrBalanceTenBefore);
  assert(distrBalanceTenBeforeAgain !== distrBalance);
  assert(distrBalanceTenBeforeAgain !== distrBalanceFiveBefore);
  console.log(
    distrBalance,
    distrBalanceTenBefore,
    distrBalanceTenBeforeAgain,
    distrBalanceFiveBefore
  );
})();
```

You can query blockchain states at specific block height. 

To query blockchain state with custom block height, we use patches with cosmjs and cosmwasm-stargate. You can view the details [here](../../patches/@cosmjs+stargate+0.31.3.patch).

In the example above, we create three `StargateClient` with current height, 5 height before and 10 height before. After that, we get balance of an address with these `StargateClient` by executing `getBalance` method.

After several blocks, the result of `getBalance` with 10 height before stay the same, indicate that we can query states of blockchain at specific height.

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

## (Advanced) ABCI Query with desired height
```ts
import { StargateClient } from "@cosmjs/stargate";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc/build/tendermint37/tendermint37client";
import { ORAI } from "@oraichain/common";
import { assert } from "console";
import {
  QuerySupplyOfRequest,
  QuerySupplyOfResponse
} from "cosmjs-types/cosmos/bank/v1beta1/query";
import { setTimeout } from "timers/promises";

(async () => {
  const rpc = "https://rpc.orai.io";
  const tmClient = await Tendermint37Client.connect(rpc);
  const stargateClient = await StargateClient.connect(rpc);
  const latestHeight = await stargateClient.getHeight();

  const path = `/cosmos.bank.v1beta1.Query/SupplyOf`;
  const data = QuerySupplyOfRequest.encode({ denom: ORAI }).finish();
  const latestOraiSupply = await tmClient.abciQuery({
    path: path,
    data,
    prove: false,
    height: latestHeight
  });
  const oraiSupplyFiveHeightBefore = await tmClient.abciQuery({
    path: path,
    data,
    prove: false,
    height: latestHeight - 5
  });
  await setTimeout(2000);
  const oraiSupplyFiveHeightBeforeAgain = await tmClient.abciQuery({
    path: path,
    data,
    prove: false,
    height: latestHeight - 5
  });
  assert(
    QuerySupplyOfResponse.decode(oraiSupplyFiveHeightBefore.value).amount
      .amount ===
      QuerySupplyOfResponse.decode(oraiSupplyFiveHeightBeforeAgain.value).amount
        .amount
  );
  assert(
    QuerySupplyOfResponse.decode(latestOraiSupply.value).amount.amount !==
      QuerySupplyOfResponse.decode(oraiSupplyFiveHeightBeforeAgain.value).amount
        .amount
  );
  console.log(
    QuerySupplyOfResponse.decode(latestOraiSupply.value).amount.amount,
    QuerySupplyOfResponse.decode(oraiSupplyFiveHeightBefore.value).amount
      .amount,
    QuerySupplyOfResponse.decode(oraiSupplyFiveHeightBeforeAgain.value).amount
      .amount
  );
})();
```

You can query blockchain states by using `abciQuery` method with block height you desired. 

In the example above, we query supply of Orai token at the current height and 5 height before. 

To query blockchain states with `abciQuery`, you need pass params includes `path` (in this example is `/cosmos.bank.v1beta1.Query/SupplyOf`), `data` (in the example here data is `{denom: ORAI}`being encoded), `height` and `prove` (option).

After several blocks, the result when query supply of Orai with 5 height before still stay the same, indicate that we can query blockchain states at specific block height with `abciQuery` method.

## Listen for transactions of smart contract or address

You can query transactions of a smart contract or an address using cosmos-sync sdk or subql. 

Please visit [here](https://github.com/oraichain/cosmos-sync/packages/examples/README.md) for more details about querying transactions with cosmos-sync sdk.

Please visit [here](https://github.com/oraichain/cosmos-subql-starter/tree/dev/Oraichain/tx-history/EXAMPLES.md) for more details about querying transactions with subql.

## License

[GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)
