import bcrypt from 'bcrypt';

/**
 * Hashes a password using bcrypt
 *
 * @param password - The password to hash
 * @param saltRounds - The number of salt rounds to use
 *
 * @returns The hashed password
 */
export const hashPassword = async (
  password: string,
  saltRounds: number,
): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
