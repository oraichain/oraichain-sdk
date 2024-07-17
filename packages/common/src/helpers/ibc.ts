import Long from "long";

export const calculateTimeoutTimestamp = (
  timeout: number,
  dateNow?: number
): string => {
  return Long.fromNumber(Math.floor((dateNow ?? Date.now()) / 1000) + timeout)
    .multiply(1000000000)
    .toString();
};
