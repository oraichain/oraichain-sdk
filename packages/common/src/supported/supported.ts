import {
  SupportedChainInfo,
  SupportedChainInfoReader,
  SupportedTokens
} from "./types";

export class SupportChainInfoImpl implements SupportedTokens {
  constructor(public readonly supportedChainInfo: SupportedChainInfo) {}

  static async create(supportedReader: SupportedChainInfoReader) {
    const supportedChainInfo = await supportedReader.readSupportedChainInfo();
    const info = new SupportChainInfoImpl(supportedChainInfo);
    return info;
  }

  get oraichainSupportedTokens() {
    return Object.values(this.supportedChainInfo["oraichain"].coinDenoms);
  }
}
