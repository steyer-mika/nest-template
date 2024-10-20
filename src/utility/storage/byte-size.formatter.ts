const sizes = [
  'Bytes', // Bytes
  'KB', // Kilobytes (1024 bytes)
  'MB', // Megabytes (1024^2 bytes)
  'GB', // Gigabytes (1024^3 bytes)
  'TB', // Terabytes (1024^4 bytes)
  'PB', // Petabytes (1024^5 bytes)
  'EB', // Exabytes (1024^6 bytes)
  'ZB', // Zettabytes (1024^7 bytes)
  'YB', // Yottabytes (1024^8 bytes)
] as const;

/**
 * Converts bytes to a human-readable size.
 *
 * @param bytes - The number of bytes to be converted.
 * @param defaultFormat - The default format to use if the size is 0.
 * @returns The human-readable size.
 */
export const bytesToSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 Byte';
  }

  // Determine the appropriate unit index
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  // Ensure the index does not exceed the sizes array
  const index = Math.min(i, sizes.length - 1);

  // Calculate the size in the appropriate unit
  const size = bytes / Math.pow(1024, index);

  const result = size.toFixed(2);

  if (result.endsWith('.00')) {
    return `${size} ${sizes[index]}`;
  }

  return `${size.toFixed(2)} ${sizes[index]}`;
};
