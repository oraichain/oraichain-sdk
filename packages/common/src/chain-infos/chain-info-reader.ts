import { fetchRetry } from "../helpers";
import {
  CHAIN_REGISTRY_BACKEND_ENDPOINTS,
  CHAIN_REGISTRY_GITHUB_API_ENDPOINTS,
  CHAIN_REGISTRY_GITHUB_RAWCONTENT_ENDPOINTS
} from "../constants";
import {
  ChainInfoReader,
  ChainInfoReaderFromGitRawOptions,
  CustomChainInfo
} from "./types";
import path from "path";

export class ChainInfoReaderFromBackend implements ChainInfoReader {
  constructor(private readonly baseUrl?: string, private readonly dex?: string) {}

  async readChainInfos() {
    const chains = (await (
      await fetchRetry(
        this.baseUrl ?? CHAIN_REGISTRY_BACKEND_ENDPOINTS.BASE_URL +
          path.join(
            CHAIN_REGISTRY_BACKEND_ENDPOINTS.BASE_ENDPOINT,
            CHAIN_REGISTRY_BACKEND_ENDPOINTS.CHAIN_INFOS
          ) + "?dex=" + this.dex
      )
    ).json()) as CustomChainInfo[];
    return chains;
  }
}

/**
 * @summary This class fetches chain infos from our github master branch directly. Beware that it has a rate limit of 60 requests / hour per IP
 */
export class ChainInfoReaderFromGit implements ChainInfoReader {
  constructor(private readonly accessToken: string = "") {}

  async readChainInfos() {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    };
    if (this.accessToken) {
      options.headers["Authorization"] = `Bearer ${this.accessToken}`;
      options.headers["X-GitHub-Api-Version"] = "2022-11-28";
    }
    const response = await (
      await fetchRetry(
        `${CHAIN_REGISTRY_GITHUB_API_ENDPOINTS.BASE_URL}${CHAIN_REGISTRY_GITHUB_API_ENDPOINTS.CHAIN_INFOS}`,
        options
      )
    ).json();

    const responses = (
      await Promise.allSettled(
        response.map((chain) => fetchRetry(chain.download_url))
      )
    )
      .filter((chain) => chain.status === "fulfilled")
      .map((chain) => chain.value);

    const chains: CustomChainInfo[] = await Promise.all(
      responses.map((data) => data.json())
    );
    return chains;
  }
}

/**
 * @summary This class fetches chain infos from our github master branch raw content.
 */
export class ChainInfoReaderFromGitRaw implements ChainInfoReader {
  protected urls: string[] = [];
  constructor(
    protected options: ChainInfoReaderFromGitRawOptions = {
      chainIds: [],
      baseUrl: CHAIN_REGISTRY_GITHUB_RAWCONTENT_ENDPOINTS.BASE_URL
    }
  ) {
    if (!this.options.baseUrl)
      this.options.baseUrl =
        CHAIN_REGISTRY_GITHUB_RAWCONTENT_ENDPOINTS.BASE_URL;
    this.generateUrls();
  }

  private generateUrls() {
    const { chainIds, baseUrl } = this.options;

    const chainUrls = chainIds.map((id) => {
      return `${baseUrl}/chains/${id}.json`;
    });

    this.urls = [...new Set([...chainUrls, ...(this.urls || [])])];
  }

  async readChainInfos() {
    const chainInfos: CustomChainInfo[] = await this.fetchUrls();
    return chainInfos;
  }

  async fetchUrls() {
    return Promise.all(this.urls.map((url) => this.fetch(url)));
  }

  async fetch(url: string) {
    return fetchRetry(url).then((data) => data.json());
  }
}
