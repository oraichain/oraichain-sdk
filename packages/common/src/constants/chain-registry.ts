export const CHAIN_REGISTRY_BACKEND_ENDPOINTS = {
  // FIXME: setup a basic backend & URL for fetching & storing all chain infos
  BASE_URL: "https://",
  BASE_ENDPOINT: "/api/v1",
  CHAIN_INFOS: "/chains"
} as const;

export const GITHUB_API_BASE_URL = "https://api.github.com";
export const CHAIN_REGISTRY_GITHUB_API_ENDPOINTS = {
  CHAIN_INFOS: GITHUB_API_BASE_URL + "/repos/oraichain/oraichain-sdk/contents/chains"
};

export const CHAIN_REGISTRY_GITHUB_RAWCONTENT_ENDPOINTS = {
  BASE_URL: "https://raw.githubusercontent.com/oraichain/oraichain-sdk/master"
};

export const ORAICHAIN_COMMON_GITHUB_API_ENDPOINTS = {
  SUPPORTED_INFO: GITHUB_API_BASE_URL + "/repos/oraichain/oraichain-sdk/contents/supported/"
};
