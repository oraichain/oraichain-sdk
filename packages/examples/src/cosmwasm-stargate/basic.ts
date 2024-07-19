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
