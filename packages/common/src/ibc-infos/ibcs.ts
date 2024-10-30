import { IBCInfoMap, IbcReader } from "./types";
import { IBCInfo } from "@chain-registry/types";

export interface Ibcs {
  ibcInfos: IBCInfoMap;
  ibcInfoList: IBCInfo[];
}

export class IbcsImpl implements Ibcs {
  constructor(public ibcInfoList: IBCInfo[]) {
    this.ibcInfoList = ibcInfoList;
  }

  static async create(ibcReader: IbcReader) {
    const ibcs = await ibcReader.readIbcs();
    return new IbcsImpl(ibcs);
  }

  get ibcInfos(): IBCInfoMap {
    // TODO: map from IBCInfo[] to ibc info map
    return {};
  }
}

// hard-code for simplicity since we don't have many ibc hardcodes, and we plan to remove all hardcodes
export const customIbcs = [
  "bsc-oraichain",
  "ethereum-oraichain",
  "noble-oraichain",
  "oraibridge-oraichain",
  "tronnetwork-oraichain"
];
