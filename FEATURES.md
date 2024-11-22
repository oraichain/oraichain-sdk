The repository contains various logic related to the Oraichain SDK, which includes handling chain information, token items, and supported chain information. Here are some key areas of logic in the repository:

## Chain Information Handling:

Classes like `ChainInfoReader`, `ChainInfoReaderFromBackend`, `ChainInfoReaderFromGit`, and `ChainInfoReaderFromGitRaw` are responsible for reading chain information from various sources such as backend services, GitHub, and raw GitHub content.

The `OraiCommon` class provides methods to initialize chain information from different sources.

## Token Items Handling:

Classes like `TokenItems` and `TokenItemsImpl` manage token items.

The repository includes logic for handling token items, such as fetching and managing token data.

## Supported Chain Information:

Classes like `SupportedChainInfoReader` and `SupportedChainInfoReaderFromGit` handle reading supported chain information from GitHub.

Functions like `readSupportedChainInfo` are used to fetch and process supported chain information.

## Helpers and Utilities:

The repository includes various helper functions and utilities in files like `index.ts`, which provide functionalities such as making HTTP requests with retries, parsing transactions, and converting numbers.

## Constants and Configuration:

Constants related to chain IDs and registry endpoints are defined in files like `chain-ids.ts` and `chain-registry.ts`.

## Package Management:

The repository uses tools like Lerna and Nx for managing multiple packages and their dependencies. The configuration for these tools can be found in files like `lerna.json` and `nx.json`.

## Documentation:

The repository includes documentation files like `CHAIN_REGISTRY.md` that provide information about the chain registry mechanism and how to integrate different blockchains with the Oraichain ecosystem.
