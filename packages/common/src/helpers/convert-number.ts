import { ATOMIC, TRUNC_DECIMALS } from "../constants";

export const validateNumber = (amount: number | string): number => {
  if (typeof amount === "string") return validateNumber(Number(amount));
  if (Number.isNaN(amount) || !Number.isFinite(amount)) return 0;
  return amount;
};

// decimals always >= 6
export const toAmount = (amount: number | string, decimals = 6): bigint => {
  const validatedAmount = validateNumber(amount);
  return (
    BigInt(Math.trunc(validatedAmount * ATOMIC)) *
    BigInt(10 ** (decimals - TRUNC_DECIMALS))
  );
};

/**
 * Converts a fraction to its equivalent decimal value as a number.
 *
 * @param {bigint} numerator - The numerator of the fraction
 * @param {bigint} denominator - The denominator of the fraction
 * @return {number} - The decimal value equivalent to the input fraction, returned as a number.
 */
export const toDecimal = (numerator: bigint, denominator: bigint): number => {
  if (denominator === BigInt(0)) return 0;
  return toDisplay((numerator * BigInt(10 ** 6)) / denominator, 6);
};

/**
 * Convert the amount to be displayed on the user interface.
 *
 * @param {string|bigint} amount - The amount to be converted.
 * @param {number} sourceDecimals - The number of decimal places in the original `amount`.
 * @param {number} desDecimals - The number of decimal places in the `amount` after conversion.
 * @return {number} The value of `amount` after conversion.
 */
export const toDisplay = (
  amount: string | bigint,
  sourceDecimals: number = 6,
  desDecimals: number = 6
): number => {
  if (!amount) return 0;
  // guarding conditions to prevent crashing
  const validatedAmount =
    typeof amount === "string" ? BigInt(amount || "0") : amount;
  const displayDecimals = Math.min(TRUNC_DECIMALS, desDecimals);
  const returnAmount =
    validatedAmount / BigInt(10 ** (sourceDecimals - displayDecimals));
  // save calculation by using cached atomic
  return (
    Number(returnAmount) /
    (displayDecimals === TRUNC_DECIMALS ? ATOMIC : 10 ** displayDecimals)
  );
};
