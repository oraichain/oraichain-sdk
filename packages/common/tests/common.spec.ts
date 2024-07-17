import { expect, afterAll, beforeAll, describe, it } from "vitest";
import { OraiCommon } from "../src/common";
import { ChainInfosImpl } from "../src/";
import { TokenItemsImpl } from "../src/";
import { COSMOS_CHAIN_IDS } from "../src/constants/chain-ids";
import { ChainInfoReaderImpl } from "./chain-reader-impl";

describe("test common", () => {
  it("test-chain-info-reader", async () => {
    const reader = new ChainInfoReaderImpl();
    const result = await reader.readChainInfos();
    const oraichainNetwork = result.find(
      (chain) => chain.chainId === COSMOS_CHAIN_IDS.ORAIBRIDGE
    );
    expect(oraichainNetwork).not.undefined;
  });

  it("test-chain-infos-getter", async () => {
    const reader = new ChainInfoReaderImpl();
    const chainInfos = await ChainInfosImpl.create(reader);
    expect(
      chainInfos.evmChains.filter((chain) => chain.networkType !== "evm").length
    ).toEqual(0);
    expect(
      chainInfos.cosmosChains.filter((chain) => chain.networkType !== "cosmos")
        .length
    ).toEqual(0);
  });

  it("test-token-items-getter", async () => {
    const reader = new ChainInfoReaderImpl();
    const tokenItems = await TokenItemsImpl.create(reader);
    expect(
      tokenItems.cosmosTokens.find(
        (chain) => chain.chainId !== COSMOS_CHAIN_IDS.COSMOSHUB
      )
    ).not.undefined;
  });

  it("test-common-getters", async () => {
    const reader = new ChainInfoReaderImpl();
    const chainInfos = await ChainInfosImpl.create(reader);
    const tokenItems = await TokenItemsImpl.create(reader);

    const common = new OraiCommon()
      .withChainInfos(chainInfos)
      .withTokenItems(tokenItems);

    expect(common.chainInfos).not.undefined;
    expect(common.tokenItems).not.undefined;
  });
});
