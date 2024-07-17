import bech32 from "bech32";
import { ethers } from "ethers";

export const getEvmAddress = (bech32Address: string) => {
  if (!bech32Address) throw new Error("bech32 address is empty");
  try {
    const decoded = bech32.decode(bech32Address);
    const evmAddress =
      "0x" + Buffer.from(bech32.fromWords(decoded.words)).toString("hex");
    return evmAddress;
  } catch (error) {
    throw new Error(
      "Cannot decode the bech32 address to evm address with the given error: " +
        JSON.stringify({ error })
    );
  }
};

export const tronToEthAddress = (base58: string) => {
  const buffer = Buffer.from(ethers.utils.base58.decode(base58)).subarray(
    1,
    -4
  );
  const hexString = Array.prototype.map
    .call(buffer, (byte) => ("0" + byte.toString(16)).slice(-2))
    .join("");
  return "0x" + hexString;
};

export const ethToTronAddress = (address: string) => {
  const evmAddress = "0x41" + address.substring(2);
  const hash = ethers.utils.sha256(ethers.utils.sha256(evmAddress));
  const checkSum = hash.substring(2, 10);
  return ethers.utils.base58.encode(evmAddress + checkSum);
};

export const isEthAddress = (address: string): boolean => {
  try {
    const checkSumAddress = ethers.utils.getAddress(address);
    return ethers.utils.isAddress(checkSumAddress);
  } catch (error) {
    return false;
  }
};

export const validateEvmAddress = (address: string, network: string) => {
  try {
    const isEvm = ethers.utils.isAddress(address);

    if (isEvm) {
      return {
        isValid: true,
        network
      };
    }

    return {
      isValid: false
    };
  } catch (error) {
    return {
      isValid: false
    };
  }
};

export const validateTronAddress = (address: string, network: string) => {
  try {
    if (!/T[a-zA-Z0-9]{32}/.test(address)) {
      throw new Error("Invalid tron address");
    }

    return {
      isValid: true,
      network
    };
  } catch (error) {
    return {
      isValid: false
    };
  }
};
