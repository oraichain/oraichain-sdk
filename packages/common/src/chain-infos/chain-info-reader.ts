import { fetchRetry } from "../helpers";
import {
  CHAIN_REGISTRY_BACKEND_ENDPOINTS,
  CHAIN_REGISTRY_GITHUB_API_ENDPOINTS
} from "../constants";
import { ChainInfoReader, CustomChainInfo } from "./types";

export class ChainInfoReaderFromBackend implements ChainInfoReader {
  async readChainInfos() {
    const { chains } = (await (
      await fetchRetry(
        `${CHAIN_REGISTRY_BACKEND_ENDPOINTS.BASE_URL}${CHAIN_REGISTRY_BACKEND_ENDPOINTS.CHAIN_INFOS}`
      )
    ).json()) as { chains: CustomChainInfo[] };
    return chains;
  }
}

/**
 * @summary This class fetches chain infos from our github master branch directly. Beware that it has a rate limit of 60 requests / hour per IP
 */
export class ChainInfoReaderFromGit implements ChainInfoReader {
  constructor(private readonly accessToken: string = "") {}

  async readChainInfos() {
    let options = {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    };
    if (this.accessToken) {
      options.headers["Authorization"] = "Bearer <YOUR-TOKEN>";
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
