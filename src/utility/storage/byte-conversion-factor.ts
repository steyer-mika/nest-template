/**
 * Conversion factor for bytes to kilobytes.
 */
const BYTE_CONVERSION_FACTOR = 1024;

/**
 * Conversion factor for bits to bytes.
 */
const BIT_CONVERSION_FACTOR = 8;

/**
 * Converts bits to bytes.
 *
 * @param bits - The value in bits to be converted to bytes.
 * @returns The equivalent value in bytes.
 */
export const BITS = (bits: number): number => bits / BIT_CONVERSION_FACTOR;

/**
 * Converts kilobytes to bytes.
 *
 * @param kb - The value in kilobytes to be converted to bytes.
 * @returns The equivalent value in bytes.
 */
export const KB = (kb: number): number => BYTE_CONVERSION_FACTOR * kb;

/**
 * Converts megabytes to bytes.
 *
 * @param mb - The value in megabytes to be converted to bytes.
 * @returns The equivalent value in bytes.
 */
export const MB = (mb: number): number => BYTE_CONVERSION_FACTOR * KB(mb);

/**
 * Converts gigabytes to bytes.
 *
 * @param gb - The value in gigabytes to be converted to bytes.
 * @returns The equivalent value in bytes.
 */
export const GB = (gb: number): number => BYTE_CONVERSION_FACTOR * MB(gb);

/**
 * Converts terabytes to bytes.
 *
 * @param tb - The value in terabytes to be converted to bytes.
 * @returns The equivalent value in bytes.
 */
export const TB = (tb: number): number => BYTE_CONVERSION_FACTOR * GB(tb);

/**
 * Converts petabytes to bytes.
 *
 * @param pb - The value in petabytes to be converted to bytes.
 * @returns The equivalent value in bytes.
 */
export const PB = (pb: number): number => BYTE_CONVERSION_FACTOR * TB(pb);

/**
 * Converts exabytes to bytes.
 *
 * @param eb - The value in exabytes to be converted to bytes.
 * @returns The equivalent value in bytes.
 */
export const EB = (eb: number): number => BYTE_CONVERSION_FACTOR * PB(eb);

/**
 * Converts zettabytes to bytes.
 *
 * @param zb - The value in zettabytes to be converted to bytes.
 * @returns The equivalent value in bytes.
 */
export const ZB = (zb: number): number => BYTE_CONVERSION_FACTOR * EB(zb);

/**
 * Converts yottabytes to bytes.
 *
 * @param yb - The value in yottabytes to be converted to bytes.
 * @returns The equivalent value in bytes.
 */
export const YB = (yb: number): number => BYTE_CONVERSION_FACTOR * ZB(yb);
