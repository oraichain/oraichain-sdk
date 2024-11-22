import { ChainInfos, CustomChainInfo, ChainInfoReader } from "./types";

export class ChainInfosImpl implements ChainInfos {
  constructor(public readonly chainInfos: CustomChainInfo[]) {}

  static async create(chainInfoReader: ChainInfoReader) {
    const chainInfos = await chainInfoReader.readChainInfos();
    return new ChainInfosImpl(chainInfos);
  }

  get evmChains() {
    return this.chainInfos.filter((c) => c.networkType === "evm");
  }

  get cosmosChains() {
    return this.chainInfos.filter((c) => c.networkType === "cosmos");
  }

  getSpecificChainInfo(chainId: string) {
    return this.chainInfos.find((c) => c.chainId === chainId);
  }
}
