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
