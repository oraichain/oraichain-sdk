import { assets, chains } from "chain-registry";
import {
  ChainInfoReader,
  ChainInfoReaderFromBackend,
  ChainInfoReaderFromGit,
  ChainInfoReaderFromGitRaw,
  ChainInfoReaderFromGitRawOptions,
  ChainInfos,
  ChainInfosImpl,
  chainRegistryChainToOraiCommon,
  CustomChainInfo
} from "./chain-infos";
import { TokenItems, TokenItemsImpl } from "./token-items";
import { Ibcs, IbcsImpl } from "./ibc-infos";
import {
  IbcReaderFromBackEnd,
  IbcReaderFromGitRaw
} from "./ibc-infos/ibc-reader";

export class OraiCommon {
  constructor(
    private _chainInfos?: ChainInfos,
    private _tokenItems?: TokenItems,
    private _ibcs?: Ibcs
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
    const chainsFromChainRegistry = chainRegistryChainToOraiCommon(
      chains,
      assets
    );
    return OraiCommon.initializeFromCustomChainInfos([
      ...customChainInfos,
      ...chainsFromChainRegistry
    ]);
  }

  static async initializeFromBackend() {
    const reader = new ChainInfoReaderFromBackend();
    const chainInfos = await reader.readChainInfos();
    const ibcReader = new IbcReaderFromBackEnd();
    const ibcs = await ibcReader.readIbcs();
    const common = OraiCommon.initializeFromCustomChainInfos(chainInfos);
    return common.withIbcInfos(new IbcsImpl(ibcs));
  }

  static async initializeFromGit(accessToken: string = "") {
    const reader = new ChainInfoReaderFromGit(accessToken);
    return OraiCommon.initializeFromChainInfoReader(reader);
  }

  static async initializeFromGitRaw(
    options?: ChainInfoReaderFromGitRawOptions
  ) {
    const reader = new ChainInfoReaderFromGitRaw(options);
    const ibcReader = new IbcReaderFromGitRaw();
    const ibcs = await ibcReader.readIbcs();
    const common = await OraiCommon.initializeFromChainInfoReader(reader);
    return common.withIbcInfos(new IbcsImpl(ibcs));
  }

  withChainInfos(chainInfos: ChainInfos) {
    this._chainInfos = chainInfos;
    return this;
  }

  withTokenItems(tokenItems: TokenItems) {
    this._tokenItems = tokenItems;
    return this;
  }

  withIbcInfos(ibcInfos: Ibcs) {
    this._ibcs = ibcInfos;
    return this;
  }

  get chainInfos() {
    return this._chainInfos;
  }

  get tokenItems() {
    return this._tokenItems;
  }
  get ibcs() {
    return this._ibcs;
  }
}
