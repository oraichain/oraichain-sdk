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
