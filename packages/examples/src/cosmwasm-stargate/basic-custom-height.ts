// import dotenv from "dotenv";
// import { ORAI_TOKEN_CONTRACTS } from "@oraichain/common";
// import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
// import assert from "assert";
// dotenv.config();

// (async () => {
//   const oldStatus = await queryCheckpointByIndex(process.env.RPC, 36975367);
//   const newStatus = await queryCheckpointByIndex(process.env.RPC, 36975369);

//   assert(oldStatus !== newStatus);
// })();

// async function queryCheckpointByIndex(
//   rpc: string,
//   height: number
// ): Promise<string> {
//   const client = await SigningCosmWasmClient.connect(rpc, height);
//   // client.setQueryClientWithHeight(36975367);
//   const result = await client.queryContractSmart(
//     "orai12sxqkgsystjgd9faa48ghv3zmkfqc6qu05uy20mvv730vlzkpvls5zqxuz",
//     {
//       checkpoint_by_index: { index: 13 }
//     }
//   );
//   console.log(result.status);
//   return result.status;
// }
