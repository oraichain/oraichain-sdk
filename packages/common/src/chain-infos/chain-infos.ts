import { ChainInfos, CustomChainInfo, ChainInfoReader } from "./types";

export class ChainInfosImpl implements ChainInfos {
  private constructor(public readonly chainInfos: CustomChainInfo[]) {}

  static async create(chainInfoReader: ChainInfoReader) {
    const chainInfos = await chainInfoReader.readChainInfos();
    const info = new ChainInfosImpl(chainInfos);
    return info;
  }

  get evmChains() {
    return this.chainInfos.filter((c) => c.networkType === "evm");
  }

  get cosmosChains() {
    return this.chainInfos.filter((c) => c.networkType === "cosmos");
  }
}
