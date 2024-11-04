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
import { SupportedChainInfo, SupportedChainInfoReader } from "./supported";
import { TokenItems, TokenItemsImpl } from "./token-items";

export class OraiCommon {
  constructor(
    private _chainInfos?: ChainInfos,
    private _tokenItems?: TokenItems
  ) {}

  static initializeFromCustomChainInfos(
    customChainInfos: CustomChainInfo[],
    supportedChainInfo: SupportedChainInfo = null
  ) {
    const common = new OraiCommon(
      new ChainInfosImpl(customChainInfos),
      new TokenItemsImpl(customChainInfos, supportedChainInfo)
    );
    return common;
  }

  static async initializeFromChainInfoReader(
    reader: ChainInfoReader,
    supportedReader: SupportedChainInfoReader = null
  ) {
    const customChainInfos = await reader.readChainInfos();

    let supportedChainInfo: SupportedChainInfo;
    if (supportedReader) {
      supportedChainInfo = await supportedReader.readSupportedChainInfo();
    }

    return OraiCommon.initializeFromCustomChainInfos(
      customChainInfos,
      supportedChainInfo
    );
  }

  static async initializeFromBackend() {
    const reader = new ChainInfoReaderFromBackend();
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
