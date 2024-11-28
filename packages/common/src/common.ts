import {
  ChainInfoReader,
  ChainInfoReaderFromBackend,
  ChainInfoReaderFromGit,
  ChainInfoReaderFromGitRaw,
  ChainInfoReaderFromGitRawOptions,
  ChainInfos,
  ChainInfosImpl,
  CustomChainInfo
} from "./chain-infos";
import { TokenItems, TokenItemsImpl } from "./token-items";

export class OraiCommon {
  constructor(
    private _chainInfos?: ChainInfos,
    private _tokenItems?: TokenItems
  ) {}

  static initializeFromCustomChainInfos(customChainInfos: CustomChainInfo[]) {
    const common = new OraiCommon(
      new ChainInfosImpl(customChainInfos),
      new TokenItemsImpl(customChainInfos)
    );
    return common;
  }

  static async initializeFromChainInfoReader(reader: ChainInfoReader) {
    const customChainInfos = await reader.readChainInfos();
    return OraiCommon.initializeFromCustomChainInfos(customChainInfos);
  }

  static async initializeFromBackend(baseUrl?: string, dex?: string) {
    const reader = new ChainInfoReaderFromBackend(baseUrl, dex);
    return OraiCommon.initializeFromChainInfoReader(reader);
  }

  static async initializeFromGit(accessToken: string = "") {
    const reader = new ChainInfoReaderFromGit(accessToken);
    return OraiCommon.initializeFromChainInfoReader(reader);
  }

  static async initializeFromGitRaw(
    options?: ChainInfoReaderFromGitRawOptions
  ) {
    const reader = new ChainInfoReaderFromGitRaw(options);
    return OraiCommon.initializeFromChainInfoReader(reader);
  }

  withChainInfos(chainInfos: ChainInfos) {
    this._chainInfos = chainInfos;
    return this;
  }

  withTokenItems(tokenItems: TokenItems) {
    this._tokenItems = tokenItems;
    return this;
  }

  get chainInfos() {
    return this._chainInfos;
  }

  get tokenItems() {
    return this._tokenItems;
  }
}
