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
