import { ChainInfos, CustomChainInfo } from "./types";
import { ChainInfoReader, ChainInfoReaderImpl } from "./chain-info-reader";

export class ChainInfosImpl implements ChainInfos {
  private constructor(public readonly chainInfos: CustomChainInfo[]) {}

  static async create(
    chainInfoReader: ChainInfoReader = new ChainInfoReaderImpl()
  ) {
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
