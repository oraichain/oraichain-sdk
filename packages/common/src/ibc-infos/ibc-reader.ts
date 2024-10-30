import { fetchRetry } from "../helpers";
import {
  CHAIN_REGISTRY_BACKEND_ENDPOINTS,
  CHAIN_REGISTRY_GITHUB_RAWCONTENT_ENDPOINTS
} from "../constants";
import { IbcReader } from "./types";
import { IBCInfo } from "@chain-registry/types";
import { customIbcs } from "./ibcs";
import path from "path";

export class IbcReaderFromBackEnd implements IbcReader {
  async readIbcs() {
    const chains = (await (
      await fetchRetry(
        CHAIN_REGISTRY_BACKEND_ENDPOINTS.BASE_URL +
          path.join(
            CHAIN_REGISTRY_BACKEND_ENDPOINTS.BASE_ENDPOINT,
            CHAIN_REGISTRY_BACKEND_ENDPOINTS.CHAIN_INFOS
          )
      )
    ).json()) as IBCInfo[];
    return chains;
  }
}

/**
 * @summary This class fetches IBC info from our github master branch raw content and chain registry.
 */
export class IbcReaderFromGitRaw implements IbcReader {
  protected urls: string[] = [];
  constructor(
    private readonly baseUrl = CHAIN_REGISTRY_GITHUB_RAWCONTENT_ENDPOINTS.BASE_URL
  ) {
    this.generateUrls();
  }

  private generateUrls() {
    const { baseUrl } = this;

    const chainUrls = customIbcs.map((id) => {
      return `${baseUrl}/ibcs/${id}.json`;
    });

    this.urls = [...new Set([...chainUrls, ...(this.urls || [])])];
  }

  async readIbcs() {
    const infos: IBCInfo[] = await this.fetchUrls();
    return infos;
  }

  private async fetchUrls() {
    return Promise.all(this.urls.map((url) => this.fetch(url)));
  }

  private async fetch(url: string) {
    return fetchRetry(url).then((data) => data.json());
  }
}
