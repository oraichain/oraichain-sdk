import {
  GasPrice,
  SigningStargateClient,
  defaultRegistryTypes as defaultStargateTypes
} from "@cosmjs/stargate";
import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { wasmTypes } from "@cosmjs/cosmwasm-stargate";
import dotenv from "dotenv";
import { ORAI } from "@oraichain/common";
dotenv.config();

(async () => {
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(
    process.env.EXAMPLES_MNEMONIC,
    { prefix: ORAI }
  ); // replace your mnemonic here

  const customRegistry = new Registry([...defaultStargateTypes, ...wasmTypes]);
  const client = await SigningStargateClient.connectWithSigner(
    "https://rpc.orai.io",
    signer,
    { gasPrice: GasPrice.fromString("0.001orai"), registry: customRegistry }
  );
})();
