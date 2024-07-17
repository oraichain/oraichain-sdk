import { promises } from "fs";
import path from "path";
import { CustomChainInfo } from "../src/chain-infos/types";
import { ChainInfoReader } from "../src";

export class ChainInfoReaderImpl implements ChainInfoReader {
  constructor(
    private readonly directory: string = path.join(process.cwd(), "chains")
  ) {}
  async readChainInfos(): Promise<CustomChainInfo[]> {
    const files = await promises.readdir(this.directory);
    const jsonFiles = files.filter((file) => path.extname(file) === ".json");

    const readFilesPromises = jsonFiles.map(async (file) => {
      const filePath = path.join(this.directory, file);
      const data = await promises.readFile(filePath, "utf-8");
      return JSON.parse(data);
    });

    return Promise.all(readFilesPromises);
  }
}
