import { expect, afterAll, beforeAll, describe, it } from "vitest";
import { ChainInfoReaderImpl, OraiCommon } from "../src/common";

describe("test common", () => {
  it("test-read-chain-infos", async () => {
    const reader = new ChainInfoReaderImpl();
    const result = await reader.readChainInfos();
    const oraichainNetwork = result.find(
      (chain) => chain.chainId === "Oraichain"
    );
    expect(oraichainNetwork).not.toBeUndefined();
  });

  it("test-common-getters", async () => {
    const common = await new OraiCommon().initialize();
    expect(
      common.evmChains.filter((chain) => chain.networkType !== "evm").length
    ).toEqual(0);
    expect(
      common.cosmosChains.filter((chain) => chain.networkType !== "cosmos")
        .length
    ).toEqual(0);
  });
});
