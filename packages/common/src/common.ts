import {
  ChainInfoReader,
  ChainInfoReaderFromBackend,
  ChainInfoReaderFromGit,
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

  static async initializeFromBackend() {
    const customChainInfos =
      await new ChainInfoReaderFromBackend().readChainInfos();
    const common = new OraiCommon(
      new ChainInfosImpl(customChainInfos),
      new TokenItemsImpl(customChainInfos)
    );
    return common;
  }

  static async initializeFromGit(accessToken: string = "") {
    const customChainInfos = await new ChainInfoReaderFromGit(
      accessToken
    ).readChainInfos();
    const common = new OraiCommon(
      new ChainInfosImpl(customChainInfos),
      new TokenItemsImpl(customChainInfos)
    );
    return common;
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
