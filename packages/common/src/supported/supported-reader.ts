import { fetchRetry } from "../helpers";
import { SupportedChainInfo, SupportedChainInfoReader } from "./types";
import { ORAICHAIN_COMMON_GITHUB_API_ENDPOINTS } from "../constants";

export class SupportedChainInfoReaderFromGit
  implements SupportedChainInfoReader
{
  constructor(
    private readonly dex: string,
    private readonly accessToken: string
  ) {}

  async readSupportedChainInfo(): Promise<SupportedChainInfo> {
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
    const res = await (
      await fetchRetry(
        `${ORAICHAIN_COMMON_GITHUB_API_ENDPOINTS.BASE_URL}${ORAICHAIN_COMMON_GITHUB_API_ENDPOINTS.SUPPORTED_INFO}${this.dex}.json?ref=feat/read-from-orai-common-backend`,
        options
      )
    ).json();

    const supportedChainInfo: SupportedChainInfo = await (
      await fetchRetry(res.download_url)
    ).json();

    return supportedChainInfo;
  }
}
