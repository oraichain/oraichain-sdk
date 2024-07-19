import { fromBech32 } from "@cosmjs/encoding";
import { QueryClient } from "@cosmjs/stargate";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { ORAI_TOKEN_CONTRACTS } from "@oraichain/common";

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
