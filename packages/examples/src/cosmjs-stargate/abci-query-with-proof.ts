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
  const key = encodeNamespaces([Buffer.from("token_info")]);
  const finalKey = Buffer.concat([key, Buffer.from("token_info")]);
  console.log(finalKey.length);
  console.log(finalKey);
  const result = await queryClient.queryRawProof(
    "wasm",
    Uint8Array.from([3, ...contract.data, ...Buffer.from("token_info")])
  );

  console.log(result.proof.ops);
  console.log(Buffer.from(result.value).toString());
})();
