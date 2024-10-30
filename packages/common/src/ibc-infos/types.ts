import { IBCInfo } from "@chain-registry/types";

export interface IBCInfoMapData {
  source: string;
  channel: string;
  testInfo?: Omit<IBCInfoMapData, "testInfo">;
  timeout: number;
}

export type IBCInfoMap = {
  [key in string]: { [key in string]?: IBCInfoMapData };
};

export interface IbcReader {
  readIbcs(): Promise<IBCInfo[]>;
}
