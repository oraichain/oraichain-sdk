import path from "path";
import { CustomChainInfo } from "./types";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ChainInfoReader {
  readChainInfos(): Promise<CustomChainInfo[]>;
}

export class ChainInfoReaderImpl {
  constructor(
    private readonly directory: string = path.join(__dirname, "chains")
  ) {}
  async readChainInfos(): Promise<CustomChainInfo[]> {
    const files = await fs.readdir(this.directory);
    const jsonFiles = files.filter((file) => path.extname(file) === ".json");

    const readFilesPromises = jsonFiles.map(async (file) => {
      const filePath = path.join(this.directory, file);
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    });

    return Promise.all(readFilesPromises);
  }
}
