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
import { Chain, AssetList } from "@chain-registry/types";
import { Currency, FeeCurrency } from "@keplr-wallet/types";

export class ChainInfoReaderFromBackend implements ChainInfoReader {
  async readChainInfos() {
    const chains = (await (
      await fetchRetry(
        CHAIN_REGISTRY_BACKEND_ENDPOINTS.BASE_URL +
          path.join(
            CHAIN_REGISTRY_BACKEND_ENDPOINTS.BASE_ENDPOINT,
            CHAIN_REGISTRY_BACKEND_ENDPOINTS.CHAIN_INFOS
          )
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

  private async fetchUrls() {
    return Promise.all(this.urls.map((url) => this.fetch(url)));
  }

  private async fetch(url: string) {
    return fetchRetry(url).then((data) => data.json());
  }
}

export function chainRegistryChainToOraiCommon(
  chains: Chain[],
  assets: AssetList[]
): CustomChainInfo[] {
  return chains.map((chain) => {
    const assetList = assets.find(
      (asset) => asset.chain_name === chain.chain_name
    );
    const feeCurrencies = chain.fees?.fee_tokens.map((fee) => {
      const asset = assetList?.assets.find((asset) => asset.base === fee.denom);
      const displayDenom = asset?.display;
      const exponentBase = asset?.denom_units.find(
        (d) => d.denom === displayDenom
      )?.exponent;
      return {
        coinDenom: asset?.display,
        coinMinimalDenom: fee.denom,
        coinDecimals: exponentBase,
        coinGeckoId: asset?.coingecko_id,
        coinImageUrl: asset?.logo_URIs?.png
      } as FeeCurrency;
    });
    const stakingCurrencies = chain.staking?.staking_tokens.map((staking) => {
      const asset = assetList?.assets.find(
        (asset) => asset.base === staking.denom
      );
      const displayDenom = asset?.display;
      const exponentBase = asset?.denom_units.find(
        (d) => d.denom === displayDenom
      )?.exponent;
      return {
        coinDenom: asset?.display,
        coinMinimalDenom: staking.denom,
        coinDecimals: exponentBase,
        coinGeckoId: asset?.coingecko_id,
        coinImageUrl: asset?.logo_URIs?.png
      } as Currency;
    });
    return {
      $schema: "../chain.schema.json",
      rpc:
        chain.apis?.rpc && chain.apis.rpc.length > 0
          ? chain.apis?.rpc[0].address
          : "",
      rest:
        chain.apis?.rest && chain.apis.rest.length > 0
          ? chain.apis?.rest[0].address
          : "",
      chainId: chain.chain_id,
      chainName: chain.chain_name,
      bip44: {
        coinType: chain.slip44
      },
      coinType: chain.slip44,
      bech32Config: chain.bech32_config,
      networkType: "cosmos", // should we hardcode this one?
      currencies: [...(feeCurrencies ?? []), ...(stakingCurrencies ?? [])],
      stakeCurrency: stakingCurrencies as any,
      feeCurrencies: feeCurrencies,
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
      txExplorer:
        chain.explorers && chain.explorers.length > 0
          ? {
              name: chain.explorers[0].url,
              txUrl: chain.explorers[0].tx_page,
              accountUrl: chain.explorers[0].account_page
            }
          : undefined
    } as CustomChainInfo;
  });
}
